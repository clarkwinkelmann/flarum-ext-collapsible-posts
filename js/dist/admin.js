module.exports=function(t){var n={};function e(a){if(n[a])return n[a].exports;var o=n[a]={i:a,l:!1,exports:{}};return t[a].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=n,e.d=function(t,n,a){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:a})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(e.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(a,o,function(n){return t[n]}.bind(null,o));return a},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=9)}([,function(t,n){t.exports=flarum.core.compat["admin/app"]},function(t,n){t.exports=flarum.core.compat["common/components/Button"]},,,,,function(t,n){t.exports=flarum.core.compat["common/components/SelectDropdown"]},,function(t,n,e){"use strict";e.r(n);var a=e(1),o=e.n(a),r=e(2),l=e.n(r),i=e(7),s=e.n(i),c=function(){function t(){this.locale=void 0}var n=t.prototype;return n.oninit=function(){this.locale=o.a.data.locale},n.view=function(t){var n=this,e=[],a=function(t){if(!o.a.data.locales.hasOwnProperty(t))return"continue";e.push(l.a.component({active:n.locale===t,icon:n.locale!==t||"fas fa-check",onclick:function(){n.locale=t}},t.toUpperCase()))};for(var r in o.a.data.locales)a(r);return m(".ReportLocalizedInput",[s.a.component({buttonClassName:"Button"},e),m("input.FormControl",{value:t.attrs.value[this.locale]||"",onchange:function(e){t.attrs.onchange(n.locale,e.target.value)}})])},t}(),u="collapsible-posts.reasons",p="clarkwinkelmann-collapsible-posts.admin.settings.";o.a.initializers.add("clarkwinkelmann-collapsible-posts",(function(){o.a.extensionData.for("clarkwinkelmann-collapsible-posts").registerSetting((function(){var t=this,n=[];try{n=JSON.parse(this.setting(u)())}catch(t){}return Array.isArray(n)||(n=[]),[m(".Form-group",[m("label",o.a.translator.trans(p+"reasons")),m("table",[m("thead",m("tr",[m("th",o.a.translator.trans(p+"header.key")),m("th",o.a.translator.trans(p+"header.label")),m("th",o.a.translator.trans(p+"header.explanation")),m("th")])),m("tbody",[n.map((function(e,a){return m("tr",[m("td",m("input.FormControl",{type:"text",value:e.key||"",onchange:function(a){e.key=a.target.value,t.setting(u)(JSON.stringify(n))}})),m("td",m(c,{value:e.label||{},onchange:function(a,o){e.label=e.label||{},e.label[a]=o,t.setting(u)(JSON.stringify(n))}})),m("td",m(c,{value:e.explanation||{},onchange:function(a,o){e.explanation=e.explanation||{},o?e.explanation[a]=o:(delete e.explanation[a],0===Object.keys(e.explanation).length&&delete e.explanation),t.setting(u)(JSON.stringify(n))}})),m("td",l.a.component({className:"Button Button--icon",icon:"fas fa-times",onclick:function(){n.splice(a,1),t.setting(u)(JSON.stringify(n))}}))])})),m("tr",m("td",{colspan:3},l.a.component({className:"Button Button--block",onclick:function(){n.push({key:""}),t.setting(u)(JSON.stringify(n))}},o.a.translator.trans(p+"add"))))])])])]})).registerPermission({icon:"fas fa-arrows-alt-v",label:o.a.translator.trans("clarkwinkelmann-collapsible-posts.admin.permission.collapse"),permission:"clarkwinkelmann-collapsible-posts.collapse"},"moderate")}))}]);
//# sourceMappingURL=admin.js.map