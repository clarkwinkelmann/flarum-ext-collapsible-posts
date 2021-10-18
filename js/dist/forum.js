module.exports=function(t){var e={};function o(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=6)}([function(t,e){t.exports=flarum.core.compat["forum/app"]},function(t,e){t.exports=flarum.core.compat["common/extend"]},function(t,e){t.exports=flarum.core.compat["forum/components/CommentPost"]},,function(t,e){t.exports=flarum.core.compat["common/components/Button"]},function(t,e){t.exports=flarum.core.compat["forum/utils/PostControls"]},function(t,e,o){"use strict";o.r(e);var n=o(1),r=o(0),a=o.n(r),s=o(4),i=o.n(s),l=o(5),c=o.n(l),u=o(2),p=o.n(u),f=[];a.a.initializers.add("clarkwinkelmann-collapsible-posts",(function(){Object(n.extend)(c.a,"moderationControls",(function(t,e){if(e.attribute("canCollapse")){var o=e.attribute("isCollapsed");t.add("collapse",i.a.component({icon:o?"fas fa-arrows-alt-v":"fas fa-compress-alt",onclick:function(){-1===f.indexOf(e.id())&&f.push(e.id()),e.save({isCollapsed:!o}).then((function(){m.redraw()}))}},a.a.translator.trans("clarkwinkelmann-collapsible-posts.forum.postControl."+(o?"uncollapse":"collapse"))))}})),Object(n.extend)(p.a.prototype,"headerItems",(function(t){this.attrs.post.attribute("isCollapsed")&&t.add("collapsed",m("span.CollapsedPostBadge",a.a.translator.trans("clarkwinkelmann-collapsible-posts.forum.badge.post")))})),Object(n.extend)(p.a.prototype,"oninit",(function(){var t=this.attrs.post;this.subtree.check((function(){return t.attribute("isCollapsed")}),(function(){return-1===f.indexOf(t.id())}))})),Object(n.override)(p.a.prototype,"view",(function(t){var e=this.attrs.post;return e.attribute("isCollapsed")&&-1===f.indexOf(e.id())?m(".CollapsedPost",[m(".CollapsedPostText",a.a.translator.trans("clarkwinkelmann-collapsible-posts.forum.stream.hidden",{count:e.attribute("collapsedCount")+1})),i.a.component({className:"Button",onclick:function(){f.push(e.id());var t=e.discussion();a.a.store.find("collapsed-posts",{filter:{discussion:t.id()},page:{after:e.number()}}).then((function(o){console.log(o),o.slice().reverse().forEach((function(t,e){0===e&&t.attribute("collapsedCount")>0||f.push(t.id())}));var n=t.data.relationships.posts.data,r=n.map((function(t){return t.id})),s=r.indexOf(e.id());if(-1!==s){var i=o.filter((function(t){return-1===r.indexOf(t.id())})).map((function(t){return{type:"posts",id:t.id()}}));n.splice.apply(n,[s+1,0].concat(i));var l=a.a.current.get("stream");l&&l.goToNumber(e.number())}}))}},a.a.translator.trans("clarkwinkelmann-collapsible-posts.forum.stream.load"))]):t()}))}))}]);
//# sourceMappingURL=forum.js.map