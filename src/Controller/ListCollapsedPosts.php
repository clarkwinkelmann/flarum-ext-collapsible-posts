<?php

namespace ClarkWinkelmann\CollapsiblePosts\Controller;

use Flarum\Api\Controller\ListPostsController;
use Flarum\Discussion\Discussion;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use Flarum\Query\QueryCriteria;
use Flarum\Query\QueryResults;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Tobscure\JsonApi\Exception\InvalidParameterException;

/**
 * We use a custom controller that way we can customize pagination
 * We extend the original controller, that way any custom include from extensions will also apply
 */
class ListCollapsedPosts extends ListPostsController
{
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);

        $filters = $this->extractFilter($request);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        $include = $this->extractInclude($request);

        $results = $this->filterer->filter(new QueryCriteria($actor, $filters, ['createdAt' => 'asc'], true), $limit, $offset);

        // First result should be the post with number referenced in page[after], so we can use it as reference for the reason
        $firstResult = $results->getResults()->first();
        $lastResult = $results->getResults()->last();

        if ($lastResult) {
            // Check whether inside our page of result there's any post that would end the series
            // We do this check without visibility scope because the post ending the series might not actually be visible to the user
            // TODO: if the post used for "more results" was actually the post ending the series, this would still show has more results
            // This might actually not be an issue because the collapsed_count value for the last post will likely be zero and that's what will be read
            $endOfCollapsedSeries = $firstResult->discussion->posts()
                ->where(function (Builder $query) use ($firstResult) {
                    $query->where('collapsed_reason', '!=', $firstResult->collapsed_reason)
                        ->orWhereNull('collapsed_reason');
                })
                ->where('created_at', '>=', $firstResult->created_at)
                ->where('created_at', '<=', $lastResult->created_at)
                ->orderBy('created_at')
                ->first();

            if ($endOfCollapsedSeries) {
                // Truncate the results to the current collapsed series
                $results = new QueryResults($results->getResults()->filter(function (Post $post) use ($endOfCollapsedSeries) {
                    return $post->created_at && $post->created_at->lt($endOfCollapsedSeries->created_at);
                }), false);
            }
        }

        $document->addPaginationLinks(
            $this->url->to('api')->route('posts.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $results->areMoreResults() ? null : 0
        );

        // Eager load discussion for use in the policies,
        // eager loading does not affect the JSON response,
        // the response only includes relations included in the request.
        if (!in_array('discussion', $include)) {
            $include[] = 'discussion';
        }

        if (in_array('user', $include)) {
            $include[] = 'user.groups';
        }

        $results = $results->getResults();

        // The third parameter is only available since Flarum 1.8
        // It's supposed to be optional, but Flarum Mentions and Likes extension will error if it isn't provided
        // We can provide the parameter even on Flarum versions lower than 1.8 since PHP will just ignore it
        $this->loadRelations($results, $include, $request);

        return $results;
    }

    protected function extractOffset(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $queryParams = $request->getQueryParams();
        $sort = $this->extractSort($request);
        $filter = $this->extractFilter($request);

        if (($number = Arr::get($queryParams, 'page.after')) > 1) {
            if (count($filter) > 1 || !isset($filter['discussion']) || $sort) {
                throw new InvalidParameterException(
                    'You can only use page[after] with filter[discussion] and the default sort order'
                );
            }

            $discussionId = $filter['discussion'];

            // Re-implementation of PostRepository::getIndexForNumber because we need to skip our own logic from the visibility scope
            $query = Discussion::find($filter['discussion'])
                ->posts()
                ->selectRaw("'1' as collapsed_include_hidden")
                ->whereVisibleTo($actor)
                ->where('created_at', '<', function ($query) use ($discussionId, $number) {
                    $query->select('created_at')
                        ->from('posts')
                        ->where('discussion_id', $discussionId)
                        ->whereNotNull('number')
                        ->take(1)

                        // We don't add $number as a binding because for some
                        // reason doing so makes the bindings go out of order.
                        ->orderByRaw('ABS(CAST(number AS SIGNED) - ' . (int)$number . ')');
                });

            return $query->count();
        }

        throw new InvalidParameterException(
            'This endpoint is not meant to be used without page[after]'
        );
    }
}
