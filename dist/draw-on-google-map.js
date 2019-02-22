!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("MapDraw",[],e):"object"==typeof exports?exports.MapDraw=e():t.MapDraw=e()}(window,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e,n){var r=new(n(2))({state:{selected:null,color:"#fff",strokeWeight:6,polygonFillColor:"#fff",polygonOpacity:1,markerIcon:null},actions:{changeSelected:function(t,e){t.commit("changeSelected",e)},changeColor:function(t,e){t.commit("changeColor",e)},changeStrokeWeight:function(t,e){t.commit("changeStrokeWeight",e)},changePolygonFillColor:function(t,e){t.commit("changePolygonFillColor",e)},changePolygonOpacity:function(t,e){t.commit("changePolygonOpacity",e)},changeMarkerIcon:function(t,e){t.commit("changeMarkerIcon",e)}},mutations:{changeSelected:function(t,e){return t.selected=e,t},changeColor:function(t,e){return t.color=e,t},changeStrokeWeight:function(t,e){return t.strokeWeight=e,t},changePolygonFillColor:function(t,e){return t.polygonFillColor=e,t},changePolygonOpacity:function(t,e){return e>1?e=1:e<0&&(e=0),t.polygonOpacity=e,t},changeMarkerIcon:function(t,e){return t.markerIcon=e,t}}});t.exports=r},function(t,e,n){function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");var n=e.get(t);return n.get?n.get.call(t):n.value}function a(t,e,n){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");var r=e.get(t);if(r.set)r.set.call(t,n);else{if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=n}return n}var i=n(2),s=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),l.set(this,{writable:!0,value:void 0}),c.set(this,{writable:!0,value:void 0}),u.set(this,{writable:!0,value:void 0}),f.set(this,{writable:!0,value:null});var n=this;this.startDraw=this.startDraw||function(){},this.stopDraw=this.stopDraw||function(){},e instanceof i&&e.events.subscribe("stateChange",function(){n.stopDraw(),n.startDraw()})}var e,n,s;return e=t,(n=[{key:"BRUSH",set:function(t){a(this,l,t)},get:function(){return o(this,l)}},{key:"POLYGON",set:function(t){a(this,c,t)},get:function(){return o(this,c)}},{key:"MARKER",set:function(t){a(this,u,t)},get:function(){return o(this,u)}},{key:"NONE",get:function(){return o(this,f)}}])&&r(e.prototype,n),s&&r(e,s),t}(),l=new WeakMap,c=new WeakMap,u=new WeakMap,f=new WeakMap;t.exports=s},function(t,e,n){function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=n(6),a=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t);var n=this;this.actions={},this.mutations={},this.states={},this.status="resting",this.events=new o,e.hasOwnProperty("actions")&&(this.actions=e.actions),e.hasOwnProperty("mutations")&&(this.mutations=e.mutations),this.states=new Proxy(e.state,{set:function(t,e,r){return t[e]=r,n.events.publish("stateChange",n.states),n.status="resting",!0}})}var e,n,a;return e=t,(n=[{key:"dispatch",value:function(t,e){return"function"!=typeof this.actions[t]?(console.error('Action "'.concat(t," doesn't exist.")),!1):(this.status="action",this.actions[t](this,e),!0)}},{key:"commit",value:function(t,e){if("function"!=typeof this.mutations[t])return console.error('Mutation "'.concat(t,"\" doesn't exist")),!1;this.status="mutation";var n=this.mutations[t](this.states,e);return this.states=Object.assign(this.states,n),!0}}])&&r(e.prototype,n),a&&r(e,a),t}();t.exports=a},function(t,e,n){function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function a(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");var n=e.get(t);return n.get?n.get.call(t):n.value}function i(t,e,n){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");var r=e.get(t);if(r.set)r.set.call(t,n);else{if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=n}return n}var s=n(4),l=function(){function t(e){var n=this;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),c.set(this,{writable:!0,value:void 0}),u.set(this,{writable:!0,value:void 0}),o(this,"holdMap",function(){a(n,c).setOptions({draggable:!1})}),o(this,"releaseMap",function(){a(n,c).setOptions({draggable:!0})}),o(this,"brush",{startDraw:function(){a(n,u).startBrushDraw()},stopDraw:function(){a(n,u).stopBrushDraw()},clearArt:function(){a(n,u).clearBrushArt()}}),o(this,"polygon",{startDraw:function(){a(n,u).startPolygonDraw()},stopDraw:function(){a(n,u).stopPolygonDraw()},clearArt:function(){a(n,u).clearPolygonArt()},changeOpacity:function(t){a(n,u).changePolygonOpacity(t)},changeFillColor:function(t){a(n,u).changePolygonFillColor(t)}}),o(this,"marker",{startDraw:function(){a(n,u).startMarkerDraw()},stopDraw:function(){a(n,u).stopMarkerDraw()},clearArt:function(){a(n,u).clearMarkerArt()},changeIcon:function(t){a(n,u).changeMarkerIcon(t)}}),!e)throw"You should pass the map instance.";i(this,c,e),i(this,u,new s(e))}var e,n,l;return e=t,(n=[{key:"clearAllArt",value:function(){a(this,u).clearAllArt()}},{key:"changeColor",value:function(t){a(this,u).changeColor(t)}},{key:"changeStrokeWeight",value:function(t){a(this,u).changeStrokeWeight(t)}},{key:"getSelectedTool",value:function(){return a(this,u).getSelectedTool()}},{key:"getSelectedColor",value:function(){return a(this,u).getSelectedColor()}}])&&r(e.prototype,n),l&&r(e,l),t}(),c=new WeakMap,u=new WeakMap;t.exports=l},function(t,e,n){function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");var n=e.get(t);return n.get?n.get.call(t):n.value}function a(t,e,n){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");var r=e.get(t);if(r.set)r.set.call(t,n);else{if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=n}return n}var i=n(5),s=n(7),l=n(8),c=n(0),u=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),f.set(this,{writable:!0,value:void 0}),h.set(this,{writable:!0,value:void 0}),p.set(this,{writable:!0,value:void 0}),y.set(this,{writable:!0,value:void 0}),w.set(this,{writable:!0,value:void 0}),v.set(this,{writable:!0,value:void 0}),a(this,h,window.google),a(this,p,window.google.maps.drawing),a(this,f,e)}var e,n,u;return e=t,(n=[{key:"startBrushDraw",value:function(){o(this,y)||a(this,y,new i(o(this,f),o(this,h))),c.states.selected!==o(this,y)&&c.dispatch("changeSelected",o(this,y))}},{key:"stopBrushDraw",value:function(){if(!o(this,y))throw"Brush Didn't initialized yet! please start Brush drawing before stopping it!";o(this,y).stopDraw(),c.states.selected===o(this,y)&&c.dispatch("changeSelected",null)}},{key:"clearBrushArt",value:function(){o(this,y)&&o(this,y).clearDrawn()}},{key:"startPolygonDraw",value:function(){o(this,w)||a(this,w,new s(o(this,f),o(this,h),o(this,p))),c.states.selected!==o(this,w)&&c.dispatch("changeSelected",o(this,w))}},{key:"stopPolygonDraw",value:function(){if(!o(this,w))throw"Polygon Didn't initialized yet! please start Polygon drawing before stopping it!";o(this,w).stopDraw(),c.states.selected===o(this,w)&&c.dispatch("changeSelected",null)}},{key:"clearPolygonArt",value:function(){o(this,w)&&o(this,w).clearDrawn()}},{key:"startMarkerDraw",value:function(){o(this,v)||a(this,v,new l(o(this,f),o(this,h),o(this,p))),c.states.selected!==o(this,v)&&c.dispatch("changeSelected",o(this,v))}},{key:"stopMarkerDraw",value:function(){if(!o(this,v))throw"Marker Didn't initialized yet! please start Marker drawing before stopping it!";o(this,v).stopDraw(),c.states.selected===o(this,v)&&c.dispatch("changeSelected",null)}},{key:"clearMarkerArt",value:function(){o(this,v)&&o(this,v).clearDrawn()}},{key:"clearAllArt",value:function(){this.clearBrushArt(),this.clearPolygonArt(),this.clearMarkerArt()}},{key:"changeColor",value:function(t){t&&"string"==typeof t&&c.dispatch("changeColor",t)}},{key:"changeStrokeWeight",value:function(t){t&&"number"==typeof t&&c.dispatch("changeStrokeWeight",t)}},{key:"changePolygonFillColor",value:function(t){t&&"string"==typeof t&&c.dispatch("changePolygonFillColor",t)}},{key:"changePolygonOpacity",value:function(t){t&&"number"==typeof t&&c.dispatch("changePolygonOpacity",t)}},{key:"changeMarkerIcon",value:function(t){c.dispatch("changeMarkerIcon",t)}},{key:"getSelectedTool",value:function(){return c.states.selected.getType()}},{key:"getSelectedColor",value:function(){return c.states.color}}])&&r(e.prototype,n),u&&r(e,u),t}(),f=new WeakMap,h=new WeakMap,p=new WeakMap,y=new WeakMap,w=new WeakMap,v=new WeakMap;t.exports=u},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t,e,n){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return n}function c(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");var n=e.get(t);return n.get?n.get.call(t):n.value}function u(t,e,n){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");var r=e.get(t);if(r.set)r.set.call(t,n);else{if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=n}return n}var f=n(1),h=n(0),p=function(t){function e(t,n){var o,s,l;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),s=this,o=!(l=a(e).call(this,h))||"object"!==r(l)&&"function"!=typeof l?i(s):l,O.add(i(o)),k.add(i(o)),m.add(i(o)),b.add(i(o)),g.add(i(o)),y.set(i(o),{writable:!0,value:void 0}),w.set(i(o),{writable:!0,value:void 0}),v.set(i(o),{writable:!0,value:!1}),d.set(i(o),{writable:!0,value:[]}),u(i(o),y,t),u(i(o),w,n),o}var n,p,P;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(e,f),n=e,(p=[{key:"startDraw",value:function(){h.states.selected instanceof e&&(u(this,v,!0),this.BRUSH=l(this,g,S).call(this),l(this,b,M).call(this),l(this,O,D).call(this))}},{key:"stopDraw",value:function(){c(this,v)&&(u(this,v,!1),c(this,w).maps.event.clearListeners(c(this,y),"mousemove"),c(this,w).maps.event.clearListeners(c(this,y),"mouseup"),c(this,w).maps.event.clearListeners(c(this,y),"mouseout"),c(this,w).maps.event.clearListeners(c(this,y),"mousedown"))}},{key:"clearDrawn",value:function(){c(this,d).map(function(t){return t.setMap(null)}),c(this,d).length=0}},{key:"getType",value:function(){return"BRUSH"}}])&&o(n.prototype,p),P&&o(n,P),e}(),y=new WeakMap,w=new WeakMap,v=new WeakMap,d=new WeakMap,g=new WeakSet,b=new WeakSet,m=new WeakSet,k=new WeakSet,O=new WeakSet,S=function(){return{cache:{},map:c(this,y),options:{zIndex:2e5},poly:!1}},M=function(){this.BRUSH.options.strokeColor=h.states.color,this.BRUSH.options.strokeWeight=h.states.strokeWeight},P=function(t){if(t&&this.BRUSH.poly){var e=this.BRUSH.cache[this.BRUSH.poly],n=e.getPath();n.insertAt(n.getLength(),t.latLng),e.setPath(n)}else this.BRUSH.poly=!1},W=function(t,e){var n=this.BRUSH.options;n.map=this.BRUSH.map,n.clickable=!1,this.BRUSH.poly="p"+(new Date).getTime(),this.BRUSH.cache[this.BRUSH.poly]=new e.maps.Polyline(n),c(this,d).push(this.BRUSH.cache[this.BRUSH.poly]),l(this,m,P).call(this,t)},D=function(){var t=this;c(this,w).maps.event.addListener(c(t,y),"mousemove",function(e){l(t,m,P).call(t,e)}),c(this,w).maps.event.addListener(c(t,y),"mouseup",function(e){l(t,m,P).call(t,0)}),c(this,w).maps.event.addListener(c(t,y),"mouseout",function(e){l(t,m,P).call(t,0)}),c(this,w).maps.event.addListener(c(t,y),"mousedown",function(e){l(t,k,W).call(t,e,c(t,w))})};t.exports=p},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var r=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.events={}}var e,r,o;return e=t,(r=[{key:"subscribe",value:function(t,e){return this.events.hasOwnProperty(t)||(this.events[t]=[]),this.events[t].push(e)}},{key:"publish",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.events.hasOwnProperty(t)?this.events[t].map(function(t){return t(e)}):[]}}])&&n(e.prototype,r),o&&n(e,o),t}();t.exports=r},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t,e,n){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return n}function c(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");var n=e.get(t);return n.get?n.get.call(t):n.value}function u(t,e,n){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");var r=e.get(t);if(r.set)r.set.call(t,n);else{if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=n}return n}var f=n(1),h=n(0),p=function(t){function e(t,n,o){var s,l,c;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),l=this,s=!(c=a(e).call(this,h))||"object"!==r(c)&&"function"!=typeof c?i(l):c,k.add(i(s)),m.add(i(s)),b.add(i(s)),y.set(i(s),{writable:!0,value:void 0}),w.set(i(s),{writable:!0,value:void 0}),v.set(i(s),{writable:!0,value:void 0}),d.set(i(s),{writable:!0,value:!1}),g.set(i(s),{writable:!0,value:[]}),u(i(s),y,t),u(i(s),w,n),u(i(s),v,o),s}var n,p,P;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(e,f),n=e,(p=[{key:"startDraw",value:function(){h.states.selected instanceof e&&(u(this,d,!0),this.POLYGON=new(c(this,v).DrawingManager)(l(this,b,O).call(this)),l(this,k,M).call(this),l(this,m,S).call(this),this.POLYGON.setMap(c(this,y)))}},{key:"stopDraw",value:function(){c(this,d)&&(u(this,d,!1),c(this,w).maps.event.clearListeners(this.POLYGON,"polygoncomplete"),this.POLYGON.setMap(null))}},{key:"clearDrawn",value:function(){c(this,g).map(function(t){return t.setMap(null)}),c(this,g).length=0}},{key:"getType",value:function(){return"POLYGON"}}])&&o(n.prototype,p),P&&o(n,P),e}(),y=new WeakMap,w=new WeakMap,v=new WeakMap,d=new WeakMap,g=new WeakMap,b=new WeakSet,m=new WeakSet,k=new WeakSet,O=function(){return{drawingControl:!1,polygonOptions:{editable:!1,draggable:!1,clickable:!1,zIndex:2e5}}},S=function(){this.POLYGON.polygonOptions.strokeColor=h.states.color,this.POLYGON.polygonOptions.strokeWeight=h.states.strokeWeight,this.POLYGON.polygonOptions.fillColor=h.states.polygonFillColor,this.POLYGON.polygonOptions.fillOpacity=h.states.polygonOpacity},M=function(){var t=this;c(this,w).maps.event.addListener(this.POLYGON,"polygoncomplete",function(e){c(t,g).push(e)}),this.POLYGON.setDrawingMode(c(this,v).OverlayType.POLYGON)};t.exports=p},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t,e,n){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return n}function c(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");var n=e.get(t);return n.get?n.get.call(t):n.value}function u(t,e,n){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");var r=e.get(t);if(r.set)r.set.call(t,n);else{if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=n}return n}var f=n(1),h=n(0),p=n(9),y=function(t){function e(t,n,o){var s,l,c;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),l=this,s=!(c=a(e).call(this,h))||"object"!==r(c)&&"function"!=typeof c?i(l):c,O.add(i(s)),k.add(i(s)),m.add(i(s)),w.set(i(s),{writable:!0,value:void 0}),v.set(i(s),{writable:!0,value:void 0}),d.set(i(s),{writable:!0,value:void 0}),g.set(i(s),{writable:!0,value:!1}),b.set(i(s),{writable:!0,value:[]}),u(i(s),w,t),u(i(s),v,n),u(i(s),d,o),s}var n,p,y;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(e,f),n=e,(p=[{key:"startDraw",value:function(){h.states.selected instanceof e&&(u(this,g,!0),this.MARKER=new(c(this,d).DrawingManager)(l(this,m,S).call(this)),l(this,O,P).call(this),l(this,k,M).call(this),this.MARKER.setMap(c(this,w)))}},{key:"stopDraw",value:function(){c(this,g)&&(u(this,g,!1),c(this,v).maps.event.clearListeners(this.MARKER,"markercomplete"),this.MARKER.setMap(null))}},{key:"clearDrawn",value:function(){c(this,b).map(function(t){return t.setMap(null)}),c(this,b).length=0}},{key:"getType",value:function(){return"MARKER"}}])&&o(n.prototype,p),y&&o(n,y),e}(),w=new WeakMap,v=new WeakMap,d=new WeakMap,g=new WeakMap,b=new WeakMap,m=new WeakSet,k=new WeakSet,O=new WeakSet,S=function(){return{drawingControl:!1,markerOptions:{editable:!1,draggable:!1,clickable:!1,cursor:"pointer",zIndex:2e5}}},M=function(){var t=null;t=h.states.markerIcon?"default"===h.states.markerIcon.toLowerCase()?null:"colorful"===h.states.markerIcon.toLowerCase()?(new p).icon():h.states.markerIcon.toLowerCase():null,this.MARKER.markerOptions.icon=t},P=function(){var t=this;c(this,v).maps.event.addListener(this.MARKER,"markercomplete",function(e){c(t,b).push(e)}),this.MARKER.setDrawingMode(c(this,d).OverlayType.MARKER)};t.exports=y},function(t,e,n){function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(t,e,n){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return n}var a=n(0),i=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),c.add(this),l.add(this),s.add(this)}var e,n,i;return e=t,(n=[{key:"icon",value:function(){var t=document.createElement("canvas");t.style.display="none";var e=t.getContext("2d");e.font="600 120px Times New Roman";var n=e.measureText("."),r=o(this,s,u).call(this,t,e.font,".");return t.height=r.height+8,t.width=n.width+8,e.font="600 120px Times New Roman",e.fillStyle=a.states.color,e.fillText(".",0,r.height+4.5),e.canvas.toDataURL()}}])&&r(e.prototype,n),i&&r(e,i),t}(),s=new WeakSet,l=new WeakSet,c=new WeakSet,u=function(t,e,n){var r=t.getContext("2d"),a=t.width,i=t.height;r.font=e,r.textAlign="left",r.textBaseline="top",r.fillText(n,25,5);var s=r.getImageData(0,0,a,i).data,u=o(this,l,f).call(this,a,i,s);return{height:o(this,c,h).call(this,a,i,s)-u}},f=function(t,e,n){for(var r=-1,o=0;o<e;o++){for(var a=0;a<t;a++){if(n[4*(t*o+a)+3]>0){r=o;break}}if(r>=0)break}return r},h=function(t,e,n){for(var r=-1,o=e;o>0;o--){for(var a=0;a<t;a++){if(n[4*(t*o+a)+3]>0){r=o;break}}if(r>=0)break}return r};t.exports=i}])});