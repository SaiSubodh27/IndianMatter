var j_=Object.defineProperty;var z_=(t,e,n)=>e in t?j_(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Bc=(t,e,n)=>(z_(t,typeof e!="symbol"?e+"":e,n),n);function V_(t,e){for(var n=0;n<e.length;n++){const i=e[n];if(typeof i!="string"&&!Array.isArray(i)){for(const r in i)if(r!=="default"&&!(r in t)){const s=Object.getOwnPropertyDescriptor(i,r);s&&Object.defineProperty(t,r,s.get?s:{enumerable:!0,get:()=>i[r]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function G_(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ug={exports:{}},pc={},dg={exports:{}},Je={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xo=Symbol.for("react.element"),H_=Symbol.for("react.portal"),W_=Symbol.for("react.fragment"),X_=Symbol.for("react.strict_mode"),$_=Symbol.for("react.profiler"),q_=Symbol.for("react.provider"),Y_=Symbol.for("react.context"),K_=Symbol.for("react.forward_ref"),Z_=Symbol.for("react.suspense"),J_=Symbol.for("react.memo"),Q_=Symbol.for("react.lazy"),Mp=Symbol.iterator;function e1(t){return t===null||typeof t!="object"?null:(t=Mp&&t[Mp]||t["@@iterator"],typeof t=="function"?t:null)}var fg={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},hg=Object.assign,pg={};function Js(t,e,n){this.props=t,this.context=e,this.refs=pg,this.updater=n||fg}Js.prototype.isReactComponent={};Js.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Js.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function mg(){}mg.prototype=Js.prototype;function Bf(t,e,n){this.props=t,this.context=e,this.refs=pg,this.updater=n||fg}var jf=Bf.prototype=new mg;jf.constructor=Bf;hg(jf,Js.prototype);jf.isPureReactComponent=!0;var wp=Array.isArray,xg=Object.prototype.hasOwnProperty,zf={current:null},gg={key:!0,ref:!0,__self:!0,__source:!0};function vg(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)xg.call(e,i)&&!gg.hasOwnProperty(i)&&(r[i]=e[i]);var l=arguments.length-2;if(l===1)r.children=n;else if(1<l){for(var c=Array(l),u=0;u<l;u++)c[u]=arguments[u+2];r.children=c}if(t&&t.defaultProps)for(i in l=t.defaultProps,l)r[i]===void 0&&(r[i]=l[i]);return{$$typeof:xo,type:t,key:s,ref:o,props:r,_owner:zf.current}}function t1(t,e){return{$$typeof:xo,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Vf(t){return typeof t=="object"&&t!==null&&t.$$typeof===xo}function n1(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Cp=/\/+/g;function jc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?n1(""+t.key):e.toString(36)}function ml(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case xo:case H_:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+jc(o,0):i,wp(r)?(n="",t!=null&&(n=t.replace(Cp,"$&/")+"/"),ml(r,e,n,"",function(u){return u})):r!=null&&(Vf(r)&&(r=t1(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Cp,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",wp(t))for(var l=0;l<t.length;l++){s=t[l];var c=i+jc(s,l);o+=ml(s,e,n,c,r)}else if(c=e1(t),typeof c=="function")for(t=c.call(t),l=0;!(s=t.next()).done;)s=s.value,c=i+jc(s,l++),o+=ml(s,e,n,c,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Co(t,e,n){if(t==null)return t;var i=[],r=0;return ml(t,i,"","",function(s){return e.call(n,s,r++)}),i}function i1(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var fn={current:null},xl={transition:null},r1={ReactCurrentDispatcher:fn,ReactCurrentBatchConfig:xl,ReactCurrentOwner:zf};function _g(){throw Error("act(...) is not supported in production builds of React.")}Je.Children={map:Co,forEach:function(t,e,n){Co(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Co(t,function(){e++}),e},toArray:function(t){return Co(t,function(e){return e})||[]},only:function(t){if(!Vf(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Je.Component=Js;Je.Fragment=W_;Je.Profiler=$_;Je.PureComponent=Bf;Je.StrictMode=X_;Je.Suspense=Z_;Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=r1;Je.act=_g;Je.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=hg({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=zf.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(c in e)xg.call(e,c)&&!gg.hasOwnProperty(c)&&(i[c]=e[c]===void 0&&l!==void 0?l[c]:e[c])}var c=arguments.length-2;if(c===1)i.children=n;else if(1<c){l=Array(c);for(var u=0;u<c;u++)l[u]=arguments[u+2];i.children=l}return{$$typeof:xo,type:t.type,key:r,ref:s,props:i,_owner:o}};Je.createContext=function(t){return t={$$typeof:Y_,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:q_,_context:t},t.Consumer=t};Je.createElement=vg;Je.createFactory=function(t){var e=vg.bind(null,t);return e.type=t,e};Je.createRef=function(){return{current:null}};Je.forwardRef=function(t){return{$$typeof:K_,render:t}};Je.isValidElement=Vf;Je.lazy=function(t){return{$$typeof:Q_,_payload:{_status:-1,_result:t},_init:i1}};Je.memo=function(t,e){return{$$typeof:J_,type:t,compare:e===void 0?null:e}};Je.startTransition=function(t){var e=xl.transition;xl.transition={};try{t()}finally{xl.transition=e}};Je.unstable_act=_g;Je.useCallback=function(t,e){return fn.current.useCallback(t,e)};Je.useContext=function(t){return fn.current.useContext(t)};Je.useDebugValue=function(){};Je.useDeferredValue=function(t){return fn.current.useDeferredValue(t)};Je.useEffect=function(t,e){return fn.current.useEffect(t,e)};Je.useId=function(){return fn.current.useId()};Je.useImperativeHandle=function(t,e,n){return fn.current.useImperativeHandle(t,e,n)};Je.useInsertionEffect=function(t,e){return fn.current.useInsertionEffect(t,e)};Je.useLayoutEffect=function(t,e){return fn.current.useLayoutEffect(t,e)};Je.useMemo=function(t,e){return fn.current.useMemo(t,e)};Je.useReducer=function(t,e,n){return fn.current.useReducer(t,e,n)};Je.useRef=function(t){return fn.current.useRef(t)};Je.useState=function(t){return fn.current.useState(t)};Je.useSyncExternalStore=function(t,e,n){return fn.current.useSyncExternalStore(t,e,n)};Je.useTransition=function(){return fn.current.useTransition()};Je.version="18.3.1";dg.exports=Je;var L=dg.exports;const mc=G_(L),s1=V_({__proto__:null,default:mc},[L]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var a1=L,o1=Symbol.for("react.element"),l1=Symbol.for("react.fragment"),c1=Object.prototype.hasOwnProperty,u1=a1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d1={key:!0,ref:!0,__self:!0,__source:!0};function yg(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)c1.call(e,i)&&!d1.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:o1,type:t,key:s,ref:o,props:r,_owner:u1.current}}pc.Fragment=l1;pc.jsx=yg;pc.jsxs=yg;ug.exports=pc;var a=ug.exports,Yu={},Sg={exports:{}},Pn={},Eg={exports:{}},bg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(j,z){var $=j.length;j.push(z);e:for(;0<$;){var Q=$-1>>>1,ce=j[Q];if(0<r(ce,z))j[Q]=z,j[$]=ce,$=Q;else break e}}function n(j){return j.length===0?null:j[0]}function i(j){if(j.length===0)return null;var z=j[0],$=j.pop();if($!==z){j[0]=$;e:for(var Q=0,ce=j.length,Me=ce>>>1;Q<Me;){var Ye=2*(Q+1)-1,He=j[Ye],Ve=Ye+1,J=j[Ve];if(0>r(He,$))Ve<ce&&0>r(J,He)?(j[Q]=J,j[Ve]=$,Q=Ve):(j[Q]=He,j[Ye]=$,Q=Ye);else if(Ve<ce&&0>r(J,$))j[Q]=J,j[Ve]=$,Q=Ve;else break e}}return z}function r(j,z){var $=j.sortIndex-z.sortIndex;return $!==0?$:j.id-z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var c=[],u=[],f=1,p=null,h=3,m=!1,g=!1,S=!1,x=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function b(j){for(var z=n(u);z!==null;){if(z.callback===null)i(u);else if(z.startTime<=j)i(u),z.sortIndex=z.expirationTime,e(c,z);else break;z=n(u)}}function E(j){if(S=!1,b(j),!g)if(n(c)!==null)g=!0,Z(w);else{var z=n(u);z!==null&&X(E,z.startTime-j)}}function w(j,z){g=!1,S&&(S=!1,d(_),_=-1),m=!0;var $=h;try{for(b(z),p=n(c);p!==null&&(!(p.expirationTime>z)||j&&!P());){var Q=p.callback;if(typeof Q=="function"){p.callback=null,h=p.priorityLevel;var ce=Q(p.expirationTime<=z);z=t.unstable_now(),typeof ce=="function"?p.callback=ce:p===n(c)&&i(c),b(z)}else i(c);p=n(c)}if(p!==null)var Me=!0;else{var Ye=n(u);Ye!==null&&X(E,Ye.startTime-z),Me=!1}return Me}finally{p=null,h=$,m=!1}}var C=!1,T=null,_=-1,A=5,R=-1;function P(){return!(t.unstable_now()-R<A)}function D(){if(T!==null){var j=t.unstable_now();R=j;var z=!0;try{z=T(!0,j)}finally{z?U():(C=!1,T=null)}}else C=!1}var U;if(typeof v=="function")U=function(){v(D)};else if(typeof MessageChannel<"u"){var F=new MessageChannel,B=F.port2;F.port1.onmessage=D,U=function(){B.postMessage(null)}}else U=function(){x(D,0)};function Z(j){T=j,C||(C=!0,U())}function X(j,z){_=x(function(){j(t.unstable_now())},z)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(j){j.callback=null},t.unstable_continueExecution=function(){g||m||(g=!0,Z(w))},t.unstable_forceFrameRate=function(j){0>j||125<j?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):A=0<j?Math.floor(1e3/j):5},t.unstable_getCurrentPriorityLevel=function(){return h},t.unstable_getFirstCallbackNode=function(){return n(c)},t.unstable_next=function(j){switch(h){case 1:case 2:case 3:var z=3;break;default:z=h}var $=h;h=z;try{return j()}finally{h=$}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(j,z){switch(j){case 1:case 2:case 3:case 4:case 5:break;default:j=3}var $=h;h=j;try{return z()}finally{h=$}},t.unstable_scheduleCallback=function(j,z,$){var Q=t.unstable_now();switch(typeof $=="object"&&$!==null?($=$.delay,$=typeof $=="number"&&0<$?Q+$:Q):$=Q,j){case 1:var ce=-1;break;case 2:ce=250;break;case 5:ce=1073741823;break;case 4:ce=1e4;break;default:ce=5e3}return ce=$+ce,j={id:f++,callback:z,priorityLevel:j,startTime:$,expirationTime:ce,sortIndex:-1},$>Q?(j.sortIndex=$,e(u,j),n(c)===null&&j===n(u)&&(S?(d(_),_=-1):S=!0,X(E,$-Q))):(j.sortIndex=ce,e(c,j),g||m||(g=!0,Z(w))),j},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(j){var z=h;return function(){var $=h;h=z;try{return j.apply(this,arguments)}finally{h=$}}}})(bg);Eg.exports=bg;var f1=Eg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h1=L,Dn=f1;function ae(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Mg=new Set,za={};function Jr(t,e){Vs(t,e),Vs(t+"Capture",e)}function Vs(t,e){for(za[t]=e,t=0;t<e.length;t++)Mg.add(e[t])}var Ui=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ku=Object.prototype.hasOwnProperty,p1=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Ap={},Tp={};function m1(t){return Ku.call(Tp,t)?!0:Ku.call(Ap,t)?!1:p1.test(t)?Tp[t]=!0:(Ap[t]=!0,!1)}function x1(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function g1(t,e,n,i){if(e===null||typeof e>"u"||x1(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function hn(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Yt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Yt[t]=new hn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Yt[e]=new hn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Yt[t]=new hn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Yt[t]=new hn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Yt[t]=new hn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Yt[t]=new hn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Yt[t]=new hn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Yt[t]=new hn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Yt[t]=new hn(t,5,!1,t.toLowerCase(),null,!1,!1)});var Gf=/[\-:]([a-z])/g;function Hf(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Gf,Hf);Yt[e]=new hn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Gf,Hf);Yt[e]=new hn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Gf,Hf);Yt[e]=new hn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Yt[t]=new hn(t,1,!1,t.toLowerCase(),null,!1,!1)});Yt.xlinkHref=new hn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Yt[t]=new hn(t,1,!1,t.toLowerCase(),null,!0,!0)});function Wf(t,e,n,i){var r=Yt.hasOwnProperty(e)?Yt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(g1(e,n,r,i)&&(n=null),i||r===null?m1(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Vi=h1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ao=Symbol.for("react.element"),Ss=Symbol.for("react.portal"),Es=Symbol.for("react.fragment"),Xf=Symbol.for("react.strict_mode"),Zu=Symbol.for("react.profiler"),wg=Symbol.for("react.provider"),Cg=Symbol.for("react.context"),$f=Symbol.for("react.forward_ref"),Ju=Symbol.for("react.suspense"),Qu=Symbol.for("react.suspense_list"),qf=Symbol.for("react.memo"),tr=Symbol.for("react.lazy"),Ag=Symbol.for("react.offscreen"),Np=Symbol.iterator;function oa(t){return t===null||typeof t!="object"?null:(t=Np&&t[Np]||t["@@iterator"],typeof t=="function"?t:null)}var Mt=Object.assign,zc;function Ma(t){if(zc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);zc=e&&e[1]||""}return`
`+zc+t}var Vc=!1;function Gc(t,e){if(!t||Vc)return"";Vc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){i=u}t.call(e.prototype)}else{try{throw Error()}catch(u){i=u}t()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var r=u.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,l=s.length-1;1<=o&&0<=l&&r[o]!==s[l];)l--;for(;1<=o&&0<=l;o--,l--)if(r[o]!==s[l]){if(o!==1||l!==1)do if(o--,l--,0>l||r[o]!==s[l]){var c=`
`+r[o].replace(" at new "," at ");return t.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",t.displayName)),c}while(1<=o&&0<=l);break}}}finally{Vc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Ma(t):""}function v1(t){switch(t.tag){case 5:return Ma(t.type);case 16:return Ma("Lazy");case 13:return Ma("Suspense");case 19:return Ma("SuspenseList");case 0:case 2:case 15:return t=Gc(t.type,!1),t;case 11:return t=Gc(t.type.render,!1),t;case 1:return t=Gc(t.type,!0),t;default:return""}}function ed(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Es:return"Fragment";case Ss:return"Portal";case Zu:return"Profiler";case Xf:return"StrictMode";case Ju:return"Suspense";case Qu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Cg:return(t.displayName||"Context")+".Consumer";case wg:return(t._context.displayName||"Context")+".Provider";case $f:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case qf:return e=t.displayName||null,e!==null?e:ed(t.type)||"Memo";case tr:e=t._payload,t=t._init;try{return ed(t(e))}catch{}}return null}function _1(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ed(e);case 8:return e===Xf?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function yr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Tg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function y1(t){var e=Tg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function To(t){t._valueTracker||(t._valueTracker=y1(t))}function Ng(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Tg(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Fl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function td(t,e){var n=e.checked;return Mt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Rp(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=yr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Rg(t,e){e=e.checked,e!=null&&Wf(t,"checked",e,!1)}function nd(t,e){Rg(t,e);var n=yr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?id(t,e.type,n):e.hasOwnProperty("defaultValue")&&id(t,e.type,yr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Dp(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function id(t,e,n){(e!=="number"||Fl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var wa=Array.isArray;function Ls(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+yr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function rd(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ae(91));return Mt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Pp(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ae(92));if(wa(n)){if(1<n.length)throw Error(ae(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:yr(n)}}function Dg(t,e){var n=yr(e.value),i=yr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Fp(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Pg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function sd(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Pg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var No,Fg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(No=No||document.createElement("div"),No.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=No.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Va(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Da={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},S1=["Webkit","ms","Moz","O"];Object.keys(Da).forEach(function(t){S1.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Da[e]=Da[t]})});function Lg(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Da.hasOwnProperty(t)&&Da[t]?(""+e).trim():e+"px"}function Ig(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Lg(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var E1=Mt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ad(t,e){if(e){if(E1[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ae(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ae(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ae(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ae(62))}}function od(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ld=null;function Yf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var cd=null,Is=null,Us=null;function Lp(t){if(t=_o(t)){if(typeof cd!="function")throw Error(ae(280));var e=t.stateNode;e&&(e=yc(e),cd(t.stateNode,t.type,e))}}function Ug(t){Is?Us?Us.push(t):Us=[t]:Is=t}function kg(){if(Is){var t=Is,e=Us;if(Us=Is=null,Lp(t),e)for(t=0;t<e.length;t++)Lp(e[t])}}function Og(t,e){return t(e)}function Bg(){}var Hc=!1;function jg(t,e,n){if(Hc)return t(e,n);Hc=!0;try{return Og(t,e,n)}finally{Hc=!1,(Is!==null||Us!==null)&&(Bg(),kg())}}function Ga(t,e){var n=t.stateNode;if(n===null)return null;var i=yc(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ae(231,e,typeof n));return n}var ud=!1;if(Ui)try{var la={};Object.defineProperty(la,"passive",{get:function(){ud=!0}}),window.addEventListener("test",la,la),window.removeEventListener("test",la,la)}catch{ud=!1}function b1(t,e,n,i,r,s,o,l,c){var u=Array.prototype.slice.call(arguments,3);try{e.apply(n,u)}catch(f){this.onError(f)}}var Pa=!1,Ll=null,Il=!1,dd=null,M1={onError:function(t){Pa=!0,Ll=t}};function w1(t,e,n,i,r,s,o,l,c){Pa=!1,Ll=null,b1.apply(M1,arguments)}function C1(t,e,n,i,r,s,o,l,c){if(w1.apply(this,arguments),Pa){if(Pa){var u=Ll;Pa=!1,Ll=null}else throw Error(ae(198));Il||(Il=!0,dd=u)}}function Qr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function zg(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Ip(t){if(Qr(t)!==t)throw Error(ae(188))}function A1(t){var e=t.alternate;if(!e){if(e=Qr(t),e===null)throw Error(ae(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Ip(r),t;if(s===i)return Ip(r),e;s=s.sibling}throw Error(ae(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,l=r.child;l;){if(l===n){o=!0,n=r,i=s;break}if(l===i){o=!0,i=r,n=s;break}l=l.sibling}if(!o){for(l=s.child;l;){if(l===n){o=!0,n=s,i=r;break}if(l===i){o=!0,i=s,n=r;break}l=l.sibling}if(!o)throw Error(ae(189))}}if(n.alternate!==i)throw Error(ae(190))}if(n.tag!==3)throw Error(ae(188));return n.stateNode.current===n?t:e}function Vg(t){return t=A1(t),t!==null?Gg(t):null}function Gg(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Gg(t);if(e!==null)return e;t=t.sibling}return null}var Hg=Dn.unstable_scheduleCallback,Up=Dn.unstable_cancelCallback,T1=Dn.unstable_shouldYield,N1=Dn.unstable_requestPaint,Tt=Dn.unstable_now,R1=Dn.unstable_getCurrentPriorityLevel,Kf=Dn.unstable_ImmediatePriority,Wg=Dn.unstable_UserBlockingPriority,Ul=Dn.unstable_NormalPriority,D1=Dn.unstable_LowPriority,Xg=Dn.unstable_IdlePriority,xc=null,mi=null;function P1(t){if(mi&&typeof mi.onCommitFiberRoot=="function")try{mi.onCommitFiberRoot(xc,t,void 0,(t.current.flags&128)===128)}catch{}}var ei=Math.clz32?Math.clz32:I1,F1=Math.log,L1=Math.LN2;function I1(t){return t>>>=0,t===0?32:31-(F1(t)/L1|0)|0}var Ro=64,Do=4194304;function Ca(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function kl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~r;l!==0?i=Ca(l):(s&=o,s!==0&&(i=Ca(s)))}else o=n&~r,o!==0?i=Ca(o):s!==0&&(i=Ca(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-ei(e),r=1<<n,i|=t[n],e&=~r;return i}function U1(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function k1(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-ei(s),l=1<<o,c=r[o];c===-1?(!(l&n)||l&i)&&(r[o]=U1(l,e)):c<=e&&(t.expiredLanes|=l),s&=~l}}function fd(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function $g(){var t=Ro;return Ro<<=1,!(Ro&4194240)&&(Ro=64),t}function Wc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function go(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ei(e),t[e]=n}function O1(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-ei(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Zf(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-ei(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var ct=0;function qg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Yg,Jf,Kg,Zg,Jg,hd=!1,Po=[],ur=null,dr=null,fr=null,Ha=new Map,Wa=new Map,rr=[],B1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function kp(t,e){switch(t){case"focusin":case"focusout":ur=null;break;case"dragenter":case"dragleave":dr=null;break;case"mouseover":case"mouseout":fr=null;break;case"pointerover":case"pointerout":Ha.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Wa.delete(e.pointerId)}}function ca(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=_o(e),e!==null&&Jf(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function j1(t,e,n,i,r){switch(e){case"focusin":return ur=ca(ur,t,e,n,i,r),!0;case"dragenter":return dr=ca(dr,t,e,n,i,r),!0;case"mouseover":return fr=ca(fr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Ha.set(s,ca(Ha.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Wa.set(s,ca(Wa.get(s)||null,t,e,n,i,r)),!0}return!1}function Qg(t){var e=Ur(t.target);if(e!==null){var n=Qr(e);if(n!==null){if(e=n.tag,e===13){if(e=zg(n),e!==null){t.blockedOn=e,Jg(t.priority,function(){Kg(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function gl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=pd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);ld=i,n.target.dispatchEvent(i),ld=null}else return e=_o(n),e!==null&&Jf(e),t.blockedOn=n,!1;e.shift()}return!0}function Op(t,e,n){gl(t)&&n.delete(e)}function z1(){hd=!1,ur!==null&&gl(ur)&&(ur=null),dr!==null&&gl(dr)&&(dr=null),fr!==null&&gl(fr)&&(fr=null),Ha.forEach(Op),Wa.forEach(Op)}function ua(t,e){t.blockedOn===e&&(t.blockedOn=null,hd||(hd=!0,Dn.unstable_scheduleCallback(Dn.unstable_NormalPriority,z1)))}function Xa(t){function e(r){return ua(r,t)}if(0<Po.length){ua(Po[0],t);for(var n=1;n<Po.length;n++){var i=Po[n];i.blockedOn===t&&(i.blockedOn=null)}}for(ur!==null&&ua(ur,t),dr!==null&&ua(dr,t),fr!==null&&ua(fr,t),Ha.forEach(e),Wa.forEach(e),n=0;n<rr.length;n++)i=rr[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<rr.length&&(n=rr[0],n.blockedOn===null);)Qg(n),n.blockedOn===null&&rr.shift()}var ks=Vi.ReactCurrentBatchConfig,Ol=!0;function V1(t,e,n,i){var r=ct,s=ks.transition;ks.transition=null;try{ct=1,Qf(t,e,n,i)}finally{ct=r,ks.transition=s}}function G1(t,e,n,i){var r=ct,s=ks.transition;ks.transition=null;try{ct=4,Qf(t,e,n,i)}finally{ct=r,ks.transition=s}}function Qf(t,e,n,i){if(Ol){var r=pd(t,e,n,i);if(r===null)tu(t,e,i,Bl,n),kp(t,i);else if(j1(r,t,e,n,i))i.stopPropagation();else if(kp(t,i),e&4&&-1<B1.indexOf(t)){for(;r!==null;){var s=_o(r);if(s!==null&&Yg(s),s=pd(t,e,n,i),s===null&&tu(t,e,i,Bl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else tu(t,e,i,null,n)}}var Bl=null;function pd(t,e,n,i){if(Bl=null,t=Yf(i),t=Ur(t),t!==null)if(e=Qr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=zg(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Bl=t,null}function e0(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(R1()){case Kf:return 1;case Wg:return 4;case Ul:case D1:return 16;case Xg:return 536870912;default:return 16}default:return 16}}var or=null,eh=null,vl=null;function t0(){if(vl)return vl;var t,e=eh,n=e.length,i,r="value"in or?or.value:or.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return vl=r.slice(t,1<i?1-i:void 0)}function _l(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Fo(){return!0}function Bp(){return!1}function Fn(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Fo:Bp,this.isPropagationStopped=Bp,this}return Mt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Fo)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Fo)},persist:function(){},isPersistent:Fo}),e}var Qs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},th=Fn(Qs),vo=Mt({},Qs,{view:0,detail:0}),H1=Fn(vo),Xc,$c,da,gc=Mt({},vo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:nh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==da&&(da&&t.type==="mousemove"?(Xc=t.screenX-da.screenX,$c=t.screenY-da.screenY):$c=Xc=0,da=t),Xc)},movementY:function(t){return"movementY"in t?t.movementY:$c}}),jp=Fn(gc),W1=Mt({},gc,{dataTransfer:0}),X1=Fn(W1),$1=Mt({},vo,{relatedTarget:0}),qc=Fn($1),q1=Mt({},Qs,{animationName:0,elapsedTime:0,pseudoElement:0}),Y1=Fn(q1),K1=Mt({},Qs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Z1=Fn(K1),J1=Mt({},Qs,{data:0}),zp=Fn(J1),Q1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ey={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ty={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function ny(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=ty[t])?!!e[t]:!1}function nh(){return ny}var iy=Mt({},vo,{key:function(t){if(t.key){var e=Q1[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=_l(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?ey[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:nh,charCode:function(t){return t.type==="keypress"?_l(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?_l(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),ry=Fn(iy),sy=Mt({},gc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Vp=Fn(sy),ay=Mt({},vo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:nh}),oy=Fn(ay),ly=Mt({},Qs,{propertyName:0,elapsedTime:0,pseudoElement:0}),cy=Fn(ly),uy=Mt({},gc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),dy=Fn(uy),fy=[9,13,27,32],ih=Ui&&"CompositionEvent"in window,Fa=null;Ui&&"documentMode"in document&&(Fa=document.documentMode);var hy=Ui&&"TextEvent"in window&&!Fa,n0=Ui&&(!ih||Fa&&8<Fa&&11>=Fa),Gp=String.fromCharCode(32),Hp=!1;function i0(t,e){switch(t){case"keyup":return fy.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function r0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var bs=!1;function py(t,e){switch(t){case"compositionend":return r0(e);case"keypress":return e.which!==32?null:(Hp=!0,Gp);case"textInput":return t=e.data,t===Gp&&Hp?null:t;default:return null}}function my(t,e){if(bs)return t==="compositionend"||!ih&&i0(t,e)?(t=t0(),vl=eh=or=null,bs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return n0&&e.locale!=="ko"?null:e.data;default:return null}}var xy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Wp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!xy[t.type]:e==="textarea"}function s0(t,e,n,i){Ug(i),e=jl(e,"onChange"),0<e.length&&(n=new th("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var La=null,$a=null;function gy(t){x0(t,0)}function vc(t){var e=Cs(t);if(Ng(e))return t}function vy(t,e){if(t==="change")return e}var a0=!1;if(Ui){var Yc;if(Ui){var Kc="oninput"in document;if(!Kc){var Xp=document.createElement("div");Xp.setAttribute("oninput","return;"),Kc=typeof Xp.oninput=="function"}Yc=Kc}else Yc=!1;a0=Yc&&(!document.documentMode||9<document.documentMode)}function $p(){La&&(La.detachEvent("onpropertychange",o0),$a=La=null)}function o0(t){if(t.propertyName==="value"&&vc($a)){var e=[];s0(e,$a,t,Yf(t)),jg(gy,e)}}function _y(t,e,n){t==="focusin"?($p(),La=e,$a=n,La.attachEvent("onpropertychange",o0)):t==="focusout"&&$p()}function yy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return vc($a)}function Sy(t,e){if(t==="click")return vc(e)}function Ey(t,e){if(t==="input"||t==="change")return vc(e)}function by(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var ii=typeof Object.is=="function"?Object.is:by;function qa(t,e){if(ii(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Ku.call(e,r)||!ii(t[r],e[r]))return!1}return!0}function qp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Yp(t,e){var n=qp(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=qp(n)}}function l0(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?l0(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function c0(){for(var t=window,e=Fl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Fl(t.document)}return e}function rh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function My(t){var e=c0(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&l0(n.ownerDocument.documentElement,n)){if(i!==null&&rh(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=Yp(n,s);var o=Yp(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var wy=Ui&&"documentMode"in document&&11>=document.documentMode,Ms=null,md=null,Ia=null,xd=!1;function Kp(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;xd||Ms==null||Ms!==Fl(i)||(i=Ms,"selectionStart"in i&&rh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ia&&qa(Ia,i)||(Ia=i,i=jl(md,"onSelect"),0<i.length&&(e=new th("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=Ms)))}function Lo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ws={animationend:Lo("Animation","AnimationEnd"),animationiteration:Lo("Animation","AnimationIteration"),animationstart:Lo("Animation","AnimationStart"),transitionend:Lo("Transition","TransitionEnd")},Zc={},u0={};Ui&&(u0=document.createElement("div").style,"AnimationEvent"in window||(delete ws.animationend.animation,delete ws.animationiteration.animation,delete ws.animationstart.animation),"TransitionEvent"in window||delete ws.transitionend.transition);function _c(t){if(Zc[t])return Zc[t];if(!ws[t])return t;var e=ws[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in u0)return Zc[t]=e[n];return t}var d0=_c("animationend"),f0=_c("animationiteration"),h0=_c("animationstart"),p0=_c("transitionend"),m0=new Map,Zp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function br(t,e){m0.set(t,e),Jr(e,[t])}for(var Jc=0;Jc<Zp.length;Jc++){var Qc=Zp[Jc],Cy=Qc.toLowerCase(),Ay=Qc[0].toUpperCase()+Qc.slice(1);br(Cy,"on"+Ay)}br(d0,"onAnimationEnd");br(f0,"onAnimationIteration");br(h0,"onAnimationStart");br("dblclick","onDoubleClick");br("focusin","onFocus");br("focusout","onBlur");br(p0,"onTransitionEnd");Vs("onMouseEnter",["mouseout","mouseover"]);Vs("onMouseLeave",["mouseout","mouseover"]);Vs("onPointerEnter",["pointerout","pointerover"]);Vs("onPointerLeave",["pointerout","pointerover"]);Jr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Jr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Jr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Jr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Jr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Jr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Aa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Ty=new Set("cancel close invalid load scroll toggle".split(" ").concat(Aa));function Jp(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,C1(i,e,void 0,t),t.currentTarget=null}function x0(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var l=i[o],c=l.instance,u=l.currentTarget;if(l=l.listener,c!==s&&r.isPropagationStopped())break e;Jp(r,l,u),s=c}else for(o=0;o<i.length;o++){if(l=i[o],c=l.instance,u=l.currentTarget,l=l.listener,c!==s&&r.isPropagationStopped())break e;Jp(r,l,u),s=c}}}if(Il)throw t=dd,Il=!1,dd=null,t}function xt(t,e){var n=e[Sd];n===void 0&&(n=e[Sd]=new Set);var i=t+"__bubble";n.has(i)||(g0(e,t,2,!1),n.add(i))}function eu(t,e,n){var i=0;e&&(i|=4),g0(n,t,i,e)}var Io="_reactListening"+Math.random().toString(36).slice(2);function Ya(t){if(!t[Io]){t[Io]=!0,Mg.forEach(function(n){n!=="selectionchange"&&(Ty.has(n)||eu(n,!1,t),eu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Io]||(e[Io]=!0,eu("selectionchange",!1,e))}}function g0(t,e,n,i){switch(e0(e)){case 1:var r=V1;break;case 4:r=G1;break;default:r=Qf}n=r.bind(null,e,n,t),r=void 0,!ud||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function tu(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var l=i.stateNode.containerInfo;if(l===r||l.nodeType===8&&l.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var c=o.tag;if((c===3||c===4)&&(c=o.stateNode.containerInfo,c===r||c.nodeType===8&&c.parentNode===r))return;o=o.return}for(;l!==null;){if(o=Ur(l),o===null)return;if(c=o.tag,c===5||c===6){i=s=o;continue e}l=l.parentNode}}i=i.return}jg(function(){var u=s,f=Yf(n),p=[];e:{var h=m0.get(t);if(h!==void 0){var m=th,g=t;switch(t){case"keypress":if(_l(n)===0)break e;case"keydown":case"keyup":m=ry;break;case"focusin":g="focus",m=qc;break;case"focusout":g="blur",m=qc;break;case"beforeblur":case"afterblur":m=qc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=jp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=X1;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=oy;break;case d0:case f0:case h0:m=Y1;break;case p0:m=cy;break;case"scroll":m=H1;break;case"wheel":m=dy;break;case"copy":case"cut":case"paste":m=Z1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=Vp}var S=(e&4)!==0,x=!S&&t==="scroll",d=S?h!==null?h+"Capture":null:h;S=[];for(var v=u,b;v!==null;){b=v;var E=b.stateNode;if(b.tag===5&&E!==null&&(b=E,d!==null&&(E=Ga(v,d),E!=null&&S.push(Ka(v,E,b)))),x)break;v=v.return}0<S.length&&(h=new m(h,g,null,n,f),p.push({event:h,listeners:S}))}}if(!(e&7)){e:{if(h=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",h&&n!==ld&&(g=n.relatedTarget||n.fromElement)&&(Ur(g)||g[ki]))break e;if((m||h)&&(h=f.window===f?f:(h=f.ownerDocument)?h.defaultView||h.parentWindow:window,m?(g=n.relatedTarget||n.toElement,m=u,g=g?Ur(g):null,g!==null&&(x=Qr(g),g!==x||g.tag!==5&&g.tag!==6)&&(g=null)):(m=null,g=u),m!==g)){if(S=jp,E="onMouseLeave",d="onMouseEnter",v="mouse",(t==="pointerout"||t==="pointerover")&&(S=Vp,E="onPointerLeave",d="onPointerEnter",v="pointer"),x=m==null?h:Cs(m),b=g==null?h:Cs(g),h=new S(E,v+"leave",m,n,f),h.target=x,h.relatedTarget=b,E=null,Ur(f)===u&&(S=new S(d,v+"enter",g,n,f),S.target=b,S.relatedTarget=x,E=S),x=E,m&&g)t:{for(S=m,d=g,v=0,b=S;b;b=as(b))v++;for(b=0,E=d;E;E=as(E))b++;for(;0<v-b;)S=as(S),v--;for(;0<b-v;)d=as(d),b--;for(;v--;){if(S===d||d!==null&&S===d.alternate)break t;S=as(S),d=as(d)}S=null}else S=null;m!==null&&Qp(p,h,m,S,!1),g!==null&&x!==null&&Qp(p,x,g,S,!0)}}e:{if(h=u?Cs(u):window,m=h.nodeName&&h.nodeName.toLowerCase(),m==="select"||m==="input"&&h.type==="file")var w=vy;else if(Wp(h))if(a0)w=Ey;else{w=yy;var C=_y}else(m=h.nodeName)&&m.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(w=Sy);if(w&&(w=w(t,u))){s0(p,w,n,f);break e}C&&C(t,h,u),t==="focusout"&&(C=h._wrapperState)&&C.controlled&&h.type==="number"&&id(h,"number",h.value)}switch(C=u?Cs(u):window,t){case"focusin":(Wp(C)||C.contentEditable==="true")&&(Ms=C,md=u,Ia=null);break;case"focusout":Ia=md=Ms=null;break;case"mousedown":xd=!0;break;case"contextmenu":case"mouseup":case"dragend":xd=!1,Kp(p,n,f);break;case"selectionchange":if(wy)break;case"keydown":case"keyup":Kp(p,n,f)}var T;if(ih)e:{switch(t){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else bs?i0(t,n)&&(_="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&(n0&&n.locale!=="ko"&&(bs||_!=="onCompositionStart"?_==="onCompositionEnd"&&bs&&(T=t0()):(or=f,eh="value"in or?or.value:or.textContent,bs=!0)),C=jl(u,_),0<C.length&&(_=new zp(_,t,null,n,f),p.push({event:_,listeners:C}),T?_.data=T:(T=r0(n),T!==null&&(_.data=T)))),(T=hy?py(t,n):my(t,n))&&(u=jl(u,"onBeforeInput"),0<u.length&&(f=new zp("onBeforeInput","beforeinput",null,n,f),p.push({event:f,listeners:u}),f.data=T))}x0(p,e)})}function Ka(t,e,n){return{instance:t,listener:e,currentTarget:n}}function jl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Ga(t,n),s!=null&&i.unshift(Ka(t,s,r)),s=Ga(t,e),s!=null&&i.push(Ka(t,s,r))),t=t.return}return i}function as(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Qp(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var l=n,c=l.alternate,u=l.stateNode;if(c!==null&&c===i)break;l.tag===5&&u!==null&&(l=u,r?(c=Ga(n,s),c!=null&&o.unshift(Ka(n,c,l))):r||(c=Ga(n,s),c!=null&&o.push(Ka(n,c,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var Ny=/\r\n?/g,Ry=/\u0000|\uFFFD/g;function em(t){return(typeof t=="string"?t:""+t).replace(Ny,`
`).replace(Ry,"")}function Uo(t,e,n){if(e=em(e),em(t)!==e&&n)throw Error(ae(425))}function zl(){}var gd=null,vd=null;function _d(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var yd=typeof setTimeout=="function"?setTimeout:void 0,Dy=typeof clearTimeout=="function"?clearTimeout:void 0,tm=typeof Promise=="function"?Promise:void 0,Py=typeof queueMicrotask=="function"?queueMicrotask:typeof tm<"u"?function(t){return tm.resolve(null).then(t).catch(Fy)}:yd;function Fy(t){setTimeout(function(){throw t})}function nu(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Xa(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Xa(e)}function hr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function nm(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var ea=Math.random().toString(36).slice(2),di="__reactFiber$"+ea,Za="__reactProps$"+ea,ki="__reactContainer$"+ea,Sd="__reactEvents$"+ea,Ly="__reactListeners$"+ea,Iy="__reactHandles$"+ea;function Ur(t){var e=t[di];if(e)return e;for(var n=t.parentNode;n;){if(e=n[ki]||n[di]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=nm(t);t!==null;){if(n=t[di])return n;t=nm(t)}return e}t=n,n=t.parentNode}return null}function _o(t){return t=t[di]||t[ki],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Cs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ae(33))}function yc(t){return t[Za]||null}var Ed=[],As=-1;function Mr(t){return{current:t}}function gt(t){0>As||(t.current=Ed[As],Ed[As]=null,As--)}function pt(t,e){As++,Ed[As]=t.current,t.current=e}var Sr={},sn=Mr(Sr),vn=Mr(!1),Gr=Sr;function Gs(t,e){var n=t.type.contextTypes;if(!n)return Sr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function _n(t){return t=t.childContextTypes,t!=null}function Vl(){gt(vn),gt(sn)}function im(t,e,n){if(sn.current!==Sr)throw Error(ae(168));pt(sn,e),pt(vn,n)}function v0(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ae(108,_1(t)||"Unknown",r));return Mt({},n,i)}function Gl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Sr,Gr=sn.current,pt(sn,t),pt(vn,vn.current),!0}function rm(t,e,n){var i=t.stateNode;if(!i)throw Error(ae(169));n?(t=v0(t,e,Gr),i.__reactInternalMemoizedMergedChildContext=t,gt(vn),gt(sn),pt(sn,t)):gt(vn),pt(vn,n)}var Ti=null,Sc=!1,iu=!1;function _0(t){Ti===null?Ti=[t]:Ti.push(t)}function Uy(t){Sc=!0,_0(t)}function wr(){if(!iu&&Ti!==null){iu=!0;var t=0,e=ct;try{var n=Ti;for(ct=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}Ti=null,Sc=!1}catch(r){throw Ti!==null&&(Ti=Ti.slice(t+1)),Hg(Kf,wr),r}finally{ct=e,iu=!1}}return null}var Ts=[],Ns=0,Hl=null,Wl=0,On=[],Bn=0,Hr=null,Ni=1,Ri="";function Lr(t,e){Ts[Ns++]=Wl,Ts[Ns++]=Hl,Hl=t,Wl=e}function y0(t,e,n){On[Bn++]=Ni,On[Bn++]=Ri,On[Bn++]=Hr,Hr=t;var i=Ni;t=Ri;var r=32-ei(i)-1;i&=~(1<<r),n+=1;var s=32-ei(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Ni=1<<32-ei(e)+r|n<<r|i,Ri=s+t}else Ni=1<<s|n<<r|i,Ri=t}function sh(t){t.return!==null&&(Lr(t,1),y0(t,1,0))}function ah(t){for(;t===Hl;)Hl=Ts[--Ns],Ts[Ns]=null,Wl=Ts[--Ns],Ts[Ns]=null;for(;t===Hr;)Hr=On[--Bn],On[Bn]=null,Ri=On[--Bn],On[Bn]=null,Ni=On[--Bn],On[Bn]=null}var Rn=null,Tn=null,vt=!1,Zn=null;function S0(t,e){var n=jn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function sm(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Rn=t,Tn=hr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Rn=t,Tn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Hr!==null?{id:Ni,overflow:Ri}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=jn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Rn=t,Tn=null,!0):!1;default:return!1}}function bd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Md(t){if(vt){var e=Tn;if(e){var n=e;if(!sm(t,e)){if(bd(t))throw Error(ae(418));e=hr(n.nextSibling);var i=Rn;e&&sm(t,e)?S0(i,n):(t.flags=t.flags&-4097|2,vt=!1,Rn=t)}}else{if(bd(t))throw Error(ae(418));t.flags=t.flags&-4097|2,vt=!1,Rn=t}}}function am(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Rn=t}function ko(t){if(t!==Rn)return!1;if(!vt)return am(t),vt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!_d(t.type,t.memoizedProps)),e&&(e=Tn)){if(bd(t))throw E0(),Error(ae(418));for(;e;)S0(t,e),e=hr(e.nextSibling)}if(am(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ae(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Tn=hr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Tn=null}}else Tn=Rn?hr(t.stateNode.nextSibling):null;return!0}function E0(){for(var t=Tn;t;)t=hr(t.nextSibling)}function Hs(){Tn=Rn=null,vt=!1}function oh(t){Zn===null?Zn=[t]:Zn.push(t)}var ky=Vi.ReactCurrentBatchConfig;function fa(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ae(309));var i=n.stateNode}if(!i)throw Error(ae(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var l=r.refs;o===null?delete l[s]:l[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(ae(284));if(!n._owner)throw Error(ae(290,t))}return t}function Oo(t,e){throw t=Object.prototype.toString.call(e),Error(ae(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function om(t){var e=t._init;return e(t._payload)}function b0(t){function e(d,v){if(t){var b=d.deletions;b===null?(d.deletions=[v],d.flags|=16):b.push(v)}}function n(d,v){if(!t)return null;for(;v!==null;)e(d,v),v=v.sibling;return null}function i(d,v){for(d=new Map;v!==null;)v.key!==null?d.set(v.key,v):d.set(v.index,v),v=v.sibling;return d}function r(d,v){return d=gr(d,v),d.index=0,d.sibling=null,d}function s(d,v,b){return d.index=b,t?(b=d.alternate,b!==null?(b=b.index,b<v?(d.flags|=2,v):b):(d.flags|=2,v)):(d.flags|=1048576,v)}function o(d){return t&&d.alternate===null&&(d.flags|=2),d}function l(d,v,b,E){return v===null||v.tag!==6?(v=uu(b,d.mode,E),v.return=d,v):(v=r(v,b),v.return=d,v)}function c(d,v,b,E){var w=b.type;return w===Es?f(d,v,b.props.children,E,b.key):v!==null&&(v.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===tr&&om(w)===v.type)?(E=r(v,b.props),E.ref=fa(d,v,b),E.return=d,E):(E=Cl(b.type,b.key,b.props,null,d.mode,E),E.ref=fa(d,v,b),E.return=d,E)}function u(d,v,b,E){return v===null||v.tag!==4||v.stateNode.containerInfo!==b.containerInfo||v.stateNode.implementation!==b.implementation?(v=du(b,d.mode,E),v.return=d,v):(v=r(v,b.children||[]),v.return=d,v)}function f(d,v,b,E,w){return v===null||v.tag!==7?(v=Vr(b,d.mode,E,w),v.return=d,v):(v=r(v,b),v.return=d,v)}function p(d,v,b){if(typeof v=="string"&&v!==""||typeof v=="number")return v=uu(""+v,d.mode,b),v.return=d,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Ao:return b=Cl(v.type,v.key,v.props,null,d.mode,b),b.ref=fa(d,null,v),b.return=d,b;case Ss:return v=du(v,d.mode,b),v.return=d,v;case tr:var E=v._init;return p(d,E(v._payload),b)}if(wa(v)||oa(v))return v=Vr(v,d.mode,b,null),v.return=d,v;Oo(d,v)}return null}function h(d,v,b,E){var w=v!==null?v.key:null;if(typeof b=="string"&&b!==""||typeof b=="number")return w!==null?null:l(d,v,""+b,E);if(typeof b=="object"&&b!==null){switch(b.$$typeof){case Ao:return b.key===w?c(d,v,b,E):null;case Ss:return b.key===w?u(d,v,b,E):null;case tr:return w=b._init,h(d,v,w(b._payload),E)}if(wa(b)||oa(b))return w!==null?null:f(d,v,b,E,null);Oo(d,b)}return null}function m(d,v,b,E,w){if(typeof E=="string"&&E!==""||typeof E=="number")return d=d.get(b)||null,l(v,d,""+E,w);if(typeof E=="object"&&E!==null){switch(E.$$typeof){case Ao:return d=d.get(E.key===null?b:E.key)||null,c(v,d,E,w);case Ss:return d=d.get(E.key===null?b:E.key)||null,u(v,d,E,w);case tr:var C=E._init;return m(d,v,b,C(E._payload),w)}if(wa(E)||oa(E))return d=d.get(b)||null,f(v,d,E,w,null);Oo(v,E)}return null}function g(d,v,b,E){for(var w=null,C=null,T=v,_=v=0,A=null;T!==null&&_<b.length;_++){T.index>_?(A=T,T=null):A=T.sibling;var R=h(d,T,b[_],E);if(R===null){T===null&&(T=A);break}t&&T&&R.alternate===null&&e(d,T),v=s(R,v,_),C===null?w=R:C.sibling=R,C=R,T=A}if(_===b.length)return n(d,T),vt&&Lr(d,_),w;if(T===null){for(;_<b.length;_++)T=p(d,b[_],E),T!==null&&(v=s(T,v,_),C===null?w=T:C.sibling=T,C=T);return vt&&Lr(d,_),w}for(T=i(d,T);_<b.length;_++)A=m(T,d,_,b[_],E),A!==null&&(t&&A.alternate!==null&&T.delete(A.key===null?_:A.key),v=s(A,v,_),C===null?w=A:C.sibling=A,C=A);return t&&T.forEach(function(P){return e(d,P)}),vt&&Lr(d,_),w}function S(d,v,b,E){var w=oa(b);if(typeof w!="function")throw Error(ae(150));if(b=w.call(b),b==null)throw Error(ae(151));for(var C=w=null,T=v,_=v=0,A=null,R=b.next();T!==null&&!R.done;_++,R=b.next()){T.index>_?(A=T,T=null):A=T.sibling;var P=h(d,T,R.value,E);if(P===null){T===null&&(T=A);break}t&&T&&P.alternate===null&&e(d,T),v=s(P,v,_),C===null?w=P:C.sibling=P,C=P,T=A}if(R.done)return n(d,T),vt&&Lr(d,_),w;if(T===null){for(;!R.done;_++,R=b.next())R=p(d,R.value,E),R!==null&&(v=s(R,v,_),C===null?w=R:C.sibling=R,C=R);return vt&&Lr(d,_),w}for(T=i(d,T);!R.done;_++,R=b.next())R=m(T,d,_,R.value,E),R!==null&&(t&&R.alternate!==null&&T.delete(R.key===null?_:R.key),v=s(R,v,_),C===null?w=R:C.sibling=R,C=R);return t&&T.forEach(function(D){return e(d,D)}),vt&&Lr(d,_),w}function x(d,v,b,E){if(typeof b=="object"&&b!==null&&b.type===Es&&b.key===null&&(b=b.props.children),typeof b=="object"&&b!==null){switch(b.$$typeof){case Ao:e:{for(var w=b.key,C=v;C!==null;){if(C.key===w){if(w=b.type,w===Es){if(C.tag===7){n(d,C.sibling),v=r(C,b.props.children),v.return=d,d=v;break e}}else if(C.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===tr&&om(w)===C.type){n(d,C.sibling),v=r(C,b.props),v.ref=fa(d,C,b),v.return=d,d=v;break e}n(d,C);break}else e(d,C);C=C.sibling}b.type===Es?(v=Vr(b.props.children,d.mode,E,b.key),v.return=d,d=v):(E=Cl(b.type,b.key,b.props,null,d.mode,E),E.ref=fa(d,v,b),E.return=d,d=E)}return o(d);case Ss:e:{for(C=b.key;v!==null;){if(v.key===C)if(v.tag===4&&v.stateNode.containerInfo===b.containerInfo&&v.stateNode.implementation===b.implementation){n(d,v.sibling),v=r(v,b.children||[]),v.return=d,d=v;break e}else{n(d,v);break}else e(d,v);v=v.sibling}v=du(b,d.mode,E),v.return=d,d=v}return o(d);case tr:return C=b._init,x(d,v,C(b._payload),E)}if(wa(b))return g(d,v,b,E);if(oa(b))return S(d,v,b,E);Oo(d,b)}return typeof b=="string"&&b!==""||typeof b=="number"?(b=""+b,v!==null&&v.tag===6?(n(d,v.sibling),v=r(v,b),v.return=d,d=v):(n(d,v),v=uu(b,d.mode,E),v.return=d,d=v),o(d)):n(d,v)}return x}var Ws=b0(!0),M0=b0(!1),Xl=Mr(null),$l=null,Rs=null,lh=null;function ch(){lh=Rs=$l=null}function uh(t){var e=Xl.current;gt(Xl),t._currentValue=e}function wd(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Os(t,e){$l=t,lh=Rs=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(gn=!0),t.firstContext=null)}function Vn(t){var e=t._currentValue;if(lh!==t)if(t={context:t,memoizedValue:e,next:null},Rs===null){if($l===null)throw Error(ae(308));Rs=t,$l.dependencies={lanes:0,firstContext:t}}else Rs=Rs.next=t;return e}var kr=null;function dh(t){kr===null?kr=[t]:kr.push(t)}function w0(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,dh(e)):(n.next=r.next,r.next=n),e.interleaved=n,Oi(t,i)}function Oi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var nr=!1;function fh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function C0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Pi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function pr(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,nt&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Oi(t,n)}return r=i.interleaved,r===null?(e.next=e,dh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Oi(t,n)}function yl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Zf(t,n)}}function lm(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function ql(t,e,n,i){var r=t.updateQueue;nr=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,l=r.shared.pending;if(l!==null){r.shared.pending=null;var c=l,u=c.next;c.next=null,o===null?s=u:o.next=u,o=c;var f=t.alternate;f!==null&&(f=f.updateQueue,l=f.lastBaseUpdate,l!==o&&(l===null?f.firstBaseUpdate=u:l.next=u,f.lastBaseUpdate=c))}if(s!==null){var p=r.baseState;o=0,f=u=c=null,l=s;do{var h=l.lane,m=l.eventTime;if((i&h)===h){f!==null&&(f=f.next={eventTime:m,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var g=t,S=l;switch(h=e,m=n,S.tag){case 1:if(g=S.payload,typeof g=="function"){p=g.call(m,p,h);break e}p=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=S.payload,h=typeof g=="function"?g.call(m,p,h):g,h==null)break e;p=Mt({},p,h);break e;case 2:nr=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,h=r.effects,h===null?r.effects=[l]:h.push(l))}else m={eventTime:m,lane:h,tag:l.tag,payload:l.payload,callback:l.callback,next:null},f===null?(u=f=m,c=p):f=f.next=m,o|=h;if(l=l.next,l===null){if(l=r.shared.pending,l===null)break;h=l,l=h.next,h.next=null,r.lastBaseUpdate=h,r.shared.pending=null}}while(1);if(f===null&&(c=p),r.baseState=c,r.firstBaseUpdate=u,r.lastBaseUpdate=f,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Xr|=o,t.lanes=o,t.memoizedState=p}}function cm(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ae(191,r));r.call(i)}}}var yo={},xi=Mr(yo),Ja=Mr(yo),Qa=Mr(yo);function Or(t){if(t===yo)throw Error(ae(174));return t}function hh(t,e){switch(pt(Qa,e),pt(Ja,t),pt(xi,yo),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:sd(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=sd(e,t)}gt(xi),pt(xi,e)}function Xs(){gt(xi),gt(Ja),gt(Qa)}function A0(t){Or(Qa.current);var e=Or(xi.current),n=sd(e,t.type);e!==n&&(pt(Ja,t),pt(xi,n))}function ph(t){Ja.current===t&&(gt(xi),gt(Ja))}var yt=Mr(0);function Yl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var ru=[];function mh(){for(var t=0;t<ru.length;t++)ru[t]._workInProgressVersionPrimary=null;ru.length=0}var Sl=Vi.ReactCurrentDispatcher,su=Vi.ReactCurrentBatchConfig,Wr=0,Et=null,Ot=null,Gt=null,Kl=!1,Ua=!1,eo=0,Oy=0;function Jt(){throw Error(ae(321))}function xh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!ii(t[n],e[n]))return!1;return!0}function gh(t,e,n,i,r,s){if(Wr=s,Et=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Sl.current=t===null||t.memoizedState===null?Vy:Gy,t=n(i,r),Ua){s=0;do{if(Ua=!1,eo=0,25<=s)throw Error(ae(301));s+=1,Gt=Ot=null,e.updateQueue=null,Sl.current=Hy,t=n(i,r)}while(Ua)}if(Sl.current=Zl,e=Ot!==null&&Ot.next!==null,Wr=0,Gt=Ot=Et=null,Kl=!1,e)throw Error(ae(300));return t}function vh(){var t=eo!==0;return eo=0,t}function ci(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Gt===null?Et.memoizedState=Gt=t:Gt=Gt.next=t,Gt}function Gn(){if(Ot===null){var t=Et.alternate;t=t!==null?t.memoizedState:null}else t=Ot.next;var e=Gt===null?Et.memoizedState:Gt.next;if(e!==null)Gt=e,Ot=t;else{if(t===null)throw Error(ae(310));Ot=t,t={memoizedState:Ot.memoizedState,baseState:Ot.baseState,baseQueue:Ot.baseQueue,queue:Ot.queue,next:null},Gt===null?Et.memoizedState=Gt=t:Gt=Gt.next=t}return Gt}function to(t,e){return typeof e=="function"?e(t):e}function au(t){var e=Gn(),n=e.queue;if(n===null)throw Error(ae(311));n.lastRenderedReducer=t;var i=Ot,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var l=o=null,c=null,u=s;do{var f=u.lane;if((Wr&f)===f)c!==null&&(c=c.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:t(i,u.action);else{var p={lane:f,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};c===null?(l=c=p,o=i):c=c.next=p,Et.lanes|=f,Xr|=f}u=u.next}while(u!==null&&u!==s);c===null?o=i:c.next=l,ii(i,e.memoizedState)||(gn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=c,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,Et.lanes|=s,Xr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function ou(t){var e=Gn(),n=e.queue;if(n===null)throw Error(ae(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);ii(s,e.memoizedState)||(gn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function T0(){}function N0(t,e){var n=Et,i=Gn(),r=e(),s=!ii(i.memoizedState,r);if(s&&(i.memoizedState=r,gn=!0),i=i.queue,_h(P0.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Gt!==null&&Gt.memoizedState.tag&1){if(n.flags|=2048,no(9,D0.bind(null,n,i,r,e),void 0,null),Ht===null)throw Error(ae(349));Wr&30||R0(n,e,r)}return r}function R0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Et.updateQueue,e===null?(e={lastEffect:null,stores:null},Et.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function D0(t,e,n,i){e.value=n,e.getSnapshot=i,F0(e)&&L0(t)}function P0(t,e,n){return n(function(){F0(e)&&L0(t)})}function F0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!ii(t,n)}catch{return!0}}function L0(t){var e=Oi(t,1);e!==null&&ti(e,t,1,-1)}function um(t){var e=ci();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:to,lastRenderedState:t},e.queue=t,t=t.dispatch=zy.bind(null,Et,t),[e.memoizedState,t]}function no(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=Et.updateQueue,e===null?(e={lastEffect:null,stores:null},Et.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function I0(){return Gn().memoizedState}function El(t,e,n,i){var r=ci();Et.flags|=t,r.memoizedState=no(1|e,n,void 0,i===void 0?null:i)}function Ec(t,e,n,i){var r=Gn();i=i===void 0?null:i;var s=void 0;if(Ot!==null){var o=Ot.memoizedState;if(s=o.destroy,i!==null&&xh(i,o.deps)){r.memoizedState=no(e,n,s,i);return}}Et.flags|=t,r.memoizedState=no(1|e,n,s,i)}function dm(t,e){return El(8390656,8,t,e)}function _h(t,e){return Ec(2048,8,t,e)}function U0(t,e){return Ec(4,2,t,e)}function k0(t,e){return Ec(4,4,t,e)}function O0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function B0(t,e,n){return n=n!=null?n.concat([t]):null,Ec(4,4,O0.bind(null,e,t),n)}function yh(){}function j0(t,e){var n=Gn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&xh(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function z0(t,e){var n=Gn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&xh(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function V0(t,e,n){return Wr&21?(ii(n,e)||(n=$g(),Et.lanes|=n,Xr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,gn=!0),t.memoizedState=n)}function By(t,e){var n=ct;ct=n!==0&&4>n?n:4,t(!0);var i=su.transition;su.transition={};try{t(!1),e()}finally{ct=n,su.transition=i}}function G0(){return Gn().memoizedState}function jy(t,e,n){var i=xr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},H0(t))W0(e,n);else if(n=w0(t,e,n,i),n!==null){var r=un();ti(n,t,i,r),X0(n,e,i)}}function zy(t,e,n){var i=xr(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(H0(t))W0(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,l=s(o,n);if(r.hasEagerState=!0,r.eagerState=l,ii(l,o)){var c=e.interleaved;c===null?(r.next=r,dh(e)):(r.next=c.next,c.next=r),e.interleaved=r;return}}catch{}finally{}n=w0(t,e,r,i),n!==null&&(r=un(),ti(n,t,i,r),X0(n,e,i))}}function H0(t){var e=t.alternate;return t===Et||e!==null&&e===Et}function W0(t,e){Ua=Kl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function X0(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Zf(t,n)}}var Zl={readContext:Vn,useCallback:Jt,useContext:Jt,useEffect:Jt,useImperativeHandle:Jt,useInsertionEffect:Jt,useLayoutEffect:Jt,useMemo:Jt,useReducer:Jt,useRef:Jt,useState:Jt,useDebugValue:Jt,useDeferredValue:Jt,useTransition:Jt,useMutableSource:Jt,useSyncExternalStore:Jt,useId:Jt,unstable_isNewReconciler:!1},Vy={readContext:Vn,useCallback:function(t,e){return ci().memoizedState=[t,e===void 0?null:e],t},useContext:Vn,useEffect:dm,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,El(4194308,4,O0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return El(4194308,4,t,e)},useInsertionEffect:function(t,e){return El(4,2,t,e)},useMemo:function(t,e){var n=ci();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=ci();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=jy.bind(null,Et,t),[i.memoizedState,t]},useRef:function(t){var e=ci();return t={current:t},e.memoizedState=t},useState:um,useDebugValue:yh,useDeferredValue:function(t){return ci().memoizedState=t},useTransition:function(){var t=um(!1),e=t[0];return t=By.bind(null,t[1]),ci().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=Et,r=ci();if(vt){if(n===void 0)throw Error(ae(407));n=n()}else{if(n=e(),Ht===null)throw Error(ae(349));Wr&30||R0(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,dm(P0.bind(null,i,s,t),[t]),i.flags|=2048,no(9,D0.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=ci(),e=Ht.identifierPrefix;if(vt){var n=Ri,i=Ni;n=(i&~(1<<32-ei(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=eo++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Oy++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},Gy={readContext:Vn,useCallback:j0,useContext:Vn,useEffect:_h,useImperativeHandle:B0,useInsertionEffect:U0,useLayoutEffect:k0,useMemo:z0,useReducer:au,useRef:I0,useState:function(){return au(to)},useDebugValue:yh,useDeferredValue:function(t){var e=Gn();return V0(e,Ot.memoizedState,t)},useTransition:function(){var t=au(to)[0],e=Gn().memoizedState;return[t,e]},useMutableSource:T0,useSyncExternalStore:N0,useId:G0,unstable_isNewReconciler:!1},Hy={readContext:Vn,useCallback:j0,useContext:Vn,useEffect:_h,useImperativeHandle:B0,useInsertionEffect:U0,useLayoutEffect:k0,useMemo:z0,useReducer:ou,useRef:I0,useState:function(){return ou(to)},useDebugValue:yh,useDeferredValue:function(t){var e=Gn();return Ot===null?e.memoizedState=t:V0(e,Ot.memoizedState,t)},useTransition:function(){var t=ou(to)[0],e=Gn().memoizedState;return[t,e]},useMutableSource:T0,useSyncExternalStore:N0,useId:G0,unstable_isNewReconciler:!1};function Yn(t,e){if(t&&t.defaultProps){e=Mt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Cd(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:Mt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var bc={isMounted:function(t){return(t=t._reactInternals)?Qr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=un(),r=xr(t),s=Pi(i,r);s.payload=e,n!=null&&(s.callback=n),e=pr(t,s,r),e!==null&&(ti(e,t,r,i),yl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=un(),r=xr(t),s=Pi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=pr(t,s,r),e!==null&&(ti(e,t,r,i),yl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=un(),i=xr(t),r=Pi(n,i);r.tag=2,e!=null&&(r.callback=e),e=pr(t,r,i),e!==null&&(ti(e,t,i,n),yl(e,t,i))}};function fm(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!qa(n,i)||!qa(r,s):!0}function $0(t,e,n){var i=!1,r=Sr,s=e.contextType;return typeof s=="object"&&s!==null?s=Vn(s):(r=_n(e)?Gr:sn.current,i=e.contextTypes,s=(i=i!=null)?Gs(t,r):Sr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=bc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function hm(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&bc.enqueueReplaceState(e,e.state,null)}function Ad(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},fh(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Vn(s):(s=_n(e)?Gr:sn.current,r.context=Gs(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Cd(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&bc.enqueueReplaceState(r,r.state,null),ql(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function $s(t,e){try{var n="",i=e;do n+=v1(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function lu(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Td(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Wy=typeof WeakMap=="function"?WeakMap:Map;function q0(t,e,n){n=Pi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Ql||(Ql=!0,Od=i),Td(t,e)},n}function Y0(t,e,n){n=Pi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){Td(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Td(t,e),typeof i!="function"&&(mr===null?mr=new Set([this]):mr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function pm(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Wy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=sS.bind(null,t,e,n),e.then(t,t))}function mm(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function xm(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Pi(-1,1),e.tag=2,pr(n,e,1))),n.lanes|=1),t)}var Xy=Vi.ReactCurrentOwner,gn=!1;function ln(t,e,n,i){e.child=t===null?M0(e,null,n,i):Ws(e,t.child,n,i)}function gm(t,e,n,i,r){n=n.render;var s=e.ref;return Os(e,r),i=gh(t,e,n,i,s,r),n=vh(),t!==null&&!gn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Bi(t,e,r)):(vt&&n&&sh(e),e.flags|=1,ln(t,e,i,r),e.child)}function vm(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Th(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,K0(t,e,s,i,r)):(t=Cl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:qa,n(o,i)&&t.ref===e.ref)return Bi(t,e,r)}return e.flags|=1,t=gr(s,i),t.ref=e.ref,t.return=e,e.child=t}function K0(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(qa(s,i)&&t.ref===e.ref)if(gn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(gn=!0);else return e.lanes=t.lanes,Bi(t,e,r)}return Nd(t,e,n,i,r)}function Z0(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},pt(Ps,Mn),Mn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,pt(Ps,Mn),Mn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,pt(Ps,Mn),Mn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,pt(Ps,Mn),Mn|=i;return ln(t,e,r,n),e.child}function J0(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Nd(t,e,n,i,r){var s=_n(n)?Gr:sn.current;return s=Gs(e,s),Os(e,r),n=gh(t,e,n,i,s,r),i=vh(),t!==null&&!gn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Bi(t,e,r)):(vt&&i&&sh(e),e.flags|=1,ln(t,e,n,r),e.child)}function _m(t,e,n,i,r){if(_n(n)){var s=!0;Gl(e)}else s=!1;if(Os(e,r),e.stateNode===null)bl(t,e),$0(e,n,i),Ad(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var c=o.context,u=n.contextType;typeof u=="object"&&u!==null?u=Vn(u):(u=_n(n)?Gr:sn.current,u=Gs(e,u));var f=n.getDerivedStateFromProps,p=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";p||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==i||c!==u)&&hm(e,o,i,u),nr=!1;var h=e.memoizedState;o.state=h,ql(e,i,o,r),c=e.memoizedState,l!==i||h!==c||vn.current||nr?(typeof f=="function"&&(Cd(e,n,f,i),c=e.memoizedState),(l=nr||fm(e,n,l,i,h,c,u))?(p||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=c),o.props=i,o.state=c,o.context=u,i=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,C0(t,e),l=e.memoizedProps,u=e.type===e.elementType?l:Yn(e.type,l),o.props=u,p=e.pendingProps,h=o.context,c=n.contextType,typeof c=="object"&&c!==null?c=Vn(c):(c=_n(n)?Gr:sn.current,c=Gs(e,c));var m=n.getDerivedStateFromProps;(f=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==p||h!==c)&&hm(e,o,i,c),nr=!1,h=e.memoizedState,o.state=h,ql(e,i,o,r);var g=e.memoizedState;l!==p||h!==g||vn.current||nr?(typeof m=="function"&&(Cd(e,n,m,i),g=e.memoizedState),(u=nr||fm(e,n,u,i,h,g,c)||!1)?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,g,c),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,g,c)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=g),o.props=i,o.state=g,o.context=c,i=u):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),i=!1)}return Rd(t,e,n,i,s,r)}function Rd(t,e,n,i,r,s){J0(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&rm(e,n,!1),Bi(t,e,s);i=e.stateNode,Xy.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=Ws(e,t.child,null,s),e.child=Ws(e,null,l,s)):ln(t,e,l,s),e.memoizedState=i.state,r&&rm(e,n,!0),e.child}function Q0(t){var e=t.stateNode;e.pendingContext?im(t,e.pendingContext,e.pendingContext!==e.context):e.context&&im(t,e.context,!1),hh(t,e.containerInfo)}function ym(t,e,n,i,r){return Hs(),oh(r),e.flags|=256,ln(t,e,n,i),e.child}var Dd={dehydrated:null,treeContext:null,retryLane:0};function Pd(t){return{baseLanes:t,cachePool:null,transitions:null}}function ev(t,e,n){var i=e.pendingProps,r=yt.current,s=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(r&2)!==0),l?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),pt(yt,r&1),t===null)return Md(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Cc(o,i,0,null),t=Vr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Pd(n),e.memoizedState=Dd,t):Sh(e,o));if(r=t.memoizedState,r!==null&&(l=r.dehydrated,l!==null))return $y(t,e,o,i,l,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,l=r.sibling;var c={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=c,e.deletions=null):(i=gr(r,c),i.subtreeFlags=r.subtreeFlags&14680064),l!==null?s=gr(l,s):(s=Vr(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?Pd(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Dd,i}return s=t.child,t=s.sibling,i=gr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Sh(t,e){return e=Cc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Bo(t,e,n,i){return i!==null&&oh(i),Ws(e,t.child,null,n),t=Sh(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function $y(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=lu(Error(ae(422))),Bo(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Cc({mode:"visible",children:i.children},r,0,null),s=Vr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ws(e,t.child,null,o),e.child.memoizedState=Pd(o),e.memoizedState=Dd,s);if(!(e.mode&1))return Bo(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var l=i.dgst;return i=l,s=Error(ae(419)),i=lu(s,i,void 0),Bo(t,e,o,i)}if(l=(o&t.childLanes)!==0,gn||l){if(i=Ht,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Oi(t,r),ti(i,t,r,-1))}return Ah(),i=lu(Error(ae(421))),Bo(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=aS.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Tn=hr(r.nextSibling),Rn=e,vt=!0,Zn=null,t!==null&&(On[Bn++]=Ni,On[Bn++]=Ri,On[Bn++]=Hr,Ni=t.id,Ri=t.overflow,Hr=e),e=Sh(e,i.children),e.flags|=4096,e)}function Sm(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),wd(t.return,e,n)}function cu(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function tv(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(ln(t,e,i.children,n),i=yt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Sm(t,n,e);else if(t.tag===19)Sm(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(pt(yt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Yl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),cu(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Yl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}cu(e,!0,n,null,s);break;case"together":cu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function bl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Bi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Xr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ae(153));if(e.child!==null){for(t=e.child,n=gr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=gr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function qy(t,e,n){switch(e.tag){case 3:Q0(e),Hs();break;case 5:A0(e);break;case 1:_n(e.type)&&Gl(e);break;case 4:hh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;pt(Xl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(pt(yt,yt.current&1),e.flags|=128,null):n&e.child.childLanes?ev(t,e,n):(pt(yt,yt.current&1),t=Bi(t,e,n),t!==null?t.sibling:null);pt(yt,yt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return tv(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),pt(yt,yt.current),i)break;return null;case 22:case 23:return e.lanes=0,Z0(t,e,n)}return Bi(t,e,n)}var nv,Fd,iv,rv;nv=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Fd=function(){};iv=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Or(xi.current);var s=null;switch(n){case"input":r=td(t,r),i=td(t,i),s=[];break;case"select":r=Mt({},r,{value:void 0}),i=Mt({},i,{value:void 0}),s=[];break;case"textarea":r=rd(t,r),i=rd(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=zl)}ad(n,i);var o;n=null;for(u in r)if(!i.hasOwnProperty(u)&&r.hasOwnProperty(u)&&r[u]!=null)if(u==="style"){var l=r[u];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(za.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in i){var c=i[u];if(l=r!=null?r[u]:void 0,i.hasOwnProperty(u)&&c!==l&&(c!=null||l!=null))if(u==="style")if(l){for(o in l)!l.hasOwnProperty(o)||c&&c.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in c)c.hasOwnProperty(o)&&l[o]!==c[o]&&(n||(n={}),n[o]=c[o])}else n||(s||(s=[]),s.push(u,n)),n=c;else u==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,l=l?l.__html:void 0,c!=null&&l!==c&&(s=s||[]).push(u,c)):u==="children"?typeof c!="string"&&typeof c!="number"||(s=s||[]).push(u,""+c):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(za.hasOwnProperty(u)?(c!=null&&u==="onScroll"&&xt("scroll",t),s||l===c||(s=[])):(s=s||[]).push(u,c))}n&&(s=s||[]).push("style",n);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};rv=function(t,e,n,i){n!==i&&(e.flags|=4)};function ha(t,e){if(!vt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Qt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Yy(t,e,n){var i=e.pendingProps;switch(ah(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qt(e),null;case 1:return _n(e.type)&&Vl(),Qt(e),null;case 3:return i=e.stateNode,Xs(),gt(vn),gt(sn),mh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(ko(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Zn!==null&&(zd(Zn),Zn=null))),Fd(t,e),Qt(e),null;case 5:ph(e);var r=Or(Qa.current);if(n=e.type,t!==null&&e.stateNode!=null)iv(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ae(166));return Qt(e),null}if(t=Or(xi.current),ko(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[di]=e,i[Za]=s,t=(e.mode&1)!==0,n){case"dialog":xt("cancel",i),xt("close",i);break;case"iframe":case"object":case"embed":xt("load",i);break;case"video":case"audio":for(r=0;r<Aa.length;r++)xt(Aa[r],i);break;case"source":xt("error",i);break;case"img":case"image":case"link":xt("error",i),xt("load",i);break;case"details":xt("toggle",i);break;case"input":Rp(i,s),xt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},xt("invalid",i);break;case"textarea":Pp(i,s),xt("invalid",i)}ad(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var l=s[o];o==="children"?typeof l=="string"?i.textContent!==l&&(s.suppressHydrationWarning!==!0&&Uo(i.textContent,l,t),r=["children",l]):typeof l=="number"&&i.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&Uo(i.textContent,l,t),r=["children",""+l]):za.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&xt("scroll",i)}switch(n){case"input":To(i),Dp(i,s,!0);break;case"textarea":To(i),Fp(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=zl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Pg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[di]=e,t[Za]=i,nv(t,e,!1,!1),e.stateNode=t;e:{switch(o=od(n,i),n){case"dialog":xt("cancel",t),xt("close",t),r=i;break;case"iframe":case"object":case"embed":xt("load",t),r=i;break;case"video":case"audio":for(r=0;r<Aa.length;r++)xt(Aa[r],t);r=i;break;case"source":xt("error",t),r=i;break;case"img":case"image":case"link":xt("error",t),xt("load",t),r=i;break;case"details":xt("toggle",t),r=i;break;case"input":Rp(t,i),r=td(t,i),xt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=Mt({},i,{value:void 0}),xt("invalid",t);break;case"textarea":Pp(t,i),r=rd(t,i),xt("invalid",t);break;default:r=i}ad(n,r),l=r;for(s in l)if(l.hasOwnProperty(s)){var c=l[s];s==="style"?Ig(t,c):s==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&Fg(t,c)):s==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&Va(t,c):typeof c=="number"&&Va(t,""+c):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(za.hasOwnProperty(s)?c!=null&&s==="onScroll"&&xt("scroll",t):c!=null&&Wf(t,s,c,o))}switch(n){case"input":To(t),Dp(t,i,!1);break;case"textarea":To(t),Fp(t);break;case"option":i.value!=null&&t.setAttribute("value",""+yr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Ls(t,!!i.multiple,s,!1):i.defaultValue!=null&&Ls(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=zl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Qt(e),null;case 6:if(t&&e.stateNode!=null)rv(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ae(166));if(n=Or(Qa.current),Or(xi.current),ko(e)){if(i=e.stateNode,n=e.memoizedProps,i[di]=e,(s=i.nodeValue!==n)&&(t=Rn,t!==null))switch(t.tag){case 3:Uo(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Uo(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[di]=e,e.stateNode=i}return Qt(e),null;case 13:if(gt(yt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(vt&&Tn!==null&&e.mode&1&&!(e.flags&128))E0(),Hs(),e.flags|=98560,s=!1;else if(s=ko(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ae(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ae(317));s[di]=e}else Hs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Qt(e),s=!1}else Zn!==null&&(zd(Zn),Zn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||yt.current&1?Bt===0&&(Bt=3):Ah())),e.updateQueue!==null&&(e.flags|=4),Qt(e),null);case 4:return Xs(),Fd(t,e),t===null&&Ya(e.stateNode.containerInfo),Qt(e),null;case 10:return uh(e.type._context),Qt(e),null;case 17:return _n(e.type)&&Vl(),Qt(e),null;case 19:if(gt(yt),s=e.memoizedState,s===null)return Qt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)ha(s,!1);else{if(Bt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Yl(t),o!==null){for(e.flags|=128,ha(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return pt(yt,yt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Tt()>qs&&(e.flags|=128,i=!0,ha(s,!1),e.lanes=4194304)}else{if(!i)if(t=Yl(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),ha(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!vt)return Qt(e),null}else 2*Tt()-s.renderingStartTime>qs&&n!==1073741824&&(e.flags|=128,i=!0,ha(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Tt(),e.sibling=null,n=yt.current,pt(yt,i?n&1|2:n&1),e):(Qt(e),null);case 22:case 23:return Ch(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Mn&1073741824&&(Qt(e),e.subtreeFlags&6&&(e.flags|=8192)):Qt(e),null;case 24:return null;case 25:return null}throw Error(ae(156,e.tag))}function Ky(t,e){switch(ah(e),e.tag){case 1:return _n(e.type)&&Vl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Xs(),gt(vn),gt(sn),mh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return ph(e),null;case 13:if(gt(yt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ae(340));Hs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return gt(yt),null;case 4:return Xs(),null;case 10:return uh(e.type._context),null;case 22:case 23:return Ch(),null;case 24:return null;default:return null}}var jo=!1,nn=!1,Zy=typeof WeakSet=="function"?WeakSet:Set,be=null;function Ds(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){wt(t,e,i)}else n.current=null}function Ld(t,e,n){try{n()}catch(i){wt(t,e,i)}}var Em=!1;function Jy(t,e){if(gd=Ol,t=c0(),rh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,l=-1,c=-1,u=0,f=0,p=t,h=null;t:for(;;){for(var m;p!==n||r!==0&&p.nodeType!==3||(l=o+r),p!==s||i!==0&&p.nodeType!==3||(c=o+i),p.nodeType===3&&(o+=p.nodeValue.length),(m=p.firstChild)!==null;)h=p,p=m;for(;;){if(p===t)break t;if(h===n&&++u===r&&(l=o),h===s&&++f===i&&(c=o),(m=p.nextSibling)!==null)break;p=h,h=p.parentNode}p=m}n=l===-1||c===-1?null:{start:l,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(vd={focusedElem:t,selectionRange:n},Ol=!1,be=e;be!==null;)if(e=be,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,be=t;else for(;be!==null;){e=be;try{var g=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var S=g.memoizedProps,x=g.memoizedState,d=e.stateNode,v=d.getSnapshotBeforeUpdate(e.elementType===e.type?S:Yn(e.type,S),x);d.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var b=e.stateNode.containerInfo;b.nodeType===1?b.textContent="":b.nodeType===9&&b.documentElement&&b.removeChild(b.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ae(163))}}catch(E){wt(e,e.return,E)}if(t=e.sibling,t!==null){t.return=e.return,be=t;break}be=e.return}return g=Em,Em=!1,g}function ka(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Ld(e,n,s)}r=r.next}while(r!==i)}}function Mc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Id(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function sv(t){var e=t.alternate;e!==null&&(t.alternate=null,sv(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[di],delete e[Za],delete e[Sd],delete e[Ly],delete e[Iy])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function av(t){return t.tag===5||t.tag===3||t.tag===4}function bm(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||av(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Ud(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=zl));else if(i!==4&&(t=t.child,t!==null))for(Ud(t,e,n),t=t.sibling;t!==null;)Ud(t,e,n),t=t.sibling}function kd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(kd(t,e,n),t=t.sibling;t!==null;)kd(t,e,n),t=t.sibling}var Wt=null,Kn=!1;function $i(t,e,n){for(n=n.child;n!==null;)ov(t,e,n),n=n.sibling}function ov(t,e,n){if(mi&&typeof mi.onCommitFiberUnmount=="function")try{mi.onCommitFiberUnmount(xc,n)}catch{}switch(n.tag){case 5:nn||Ds(n,e);case 6:var i=Wt,r=Kn;Wt=null,$i(t,e,n),Wt=i,Kn=r,Wt!==null&&(Kn?(t=Wt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Wt.removeChild(n.stateNode));break;case 18:Wt!==null&&(Kn?(t=Wt,n=n.stateNode,t.nodeType===8?nu(t.parentNode,n):t.nodeType===1&&nu(t,n),Xa(t)):nu(Wt,n.stateNode));break;case 4:i=Wt,r=Kn,Wt=n.stateNode.containerInfo,Kn=!0,$i(t,e,n),Wt=i,Kn=r;break;case 0:case 11:case 14:case 15:if(!nn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Ld(n,e,o),r=r.next}while(r!==i)}$i(t,e,n);break;case 1:if(!nn&&(Ds(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(l){wt(n,e,l)}$i(t,e,n);break;case 21:$i(t,e,n);break;case 22:n.mode&1?(nn=(i=nn)||n.memoizedState!==null,$i(t,e,n),nn=i):$i(t,e,n);break;default:$i(t,e,n)}}function Mm(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new Zy),e.forEach(function(i){var r=oS.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Wn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:Wt=l.stateNode,Kn=!1;break e;case 3:Wt=l.stateNode.containerInfo,Kn=!0;break e;case 4:Wt=l.stateNode.containerInfo,Kn=!0;break e}l=l.return}if(Wt===null)throw Error(ae(160));ov(s,o,r),Wt=null,Kn=!1;var c=r.alternate;c!==null&&(c.return=null),r.return=null}catch(u){wt(r,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)lv(e,t),e=e.sibling}function lv(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Wn(e,t),ai(t),i&4){try{ka(3,t,t.return),Mc(3,t)}catch(S){wt(t,t.return,S)}try{ka(5,t,t.return)}catch(S){wt(t,t.return,S)}}break;case 1:Wn(e,t),ai(t),i&512&&n!==null&&Ds(n,n.return);break;case 5:if(Wn(e,t),ai(t),i&512&&n!==null&&Ds(n,n.return),t.flags&32){var r=t.stateNode;try{Va(r,"")}catch(S){wt(t,t.return,S)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,l=t.type,c=t.updateQueue;if(t.updateQueue=null,c!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&Rg(r,s),od(l,o);var u=od(l,s);for(o=0;o<c.length;o+=2){var f=c[o],p=c[o+1];f==="style"?Ig(r,p):f==="dangerouslySetInnerHTML"?Fg(r,p):f==="children"?Va(r,p):Wf(r,f,p,u)}switch(l){case"input":nd(r,s);break;case"textarea":Dg(r,s);break;case"select":var h=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var m=s.value;m!=null?Ls(r,!!s.multiple,m,!1):h!==!!s.multiple&&(s.defaultValue!=null?Ls(r,!!s.multiple,s.defaultValue,!0):Ls(r,!!s.multiple,s.multiple?[]:"",!1))}r[Za]=s}catch(S){wt(t,t.return,S)}}break;case 6:if(Wn(e,t),ai(t),i&4){if(t.stateNode===null)throw Error(ae(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(S){wt(t,t.return,S)}}break;case 3:if(Wn(e,t),ai(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Xa(e.containerInfo)}catch(S){wt(t,t.return,S)}break;case 4:Wn(e,t),ai(t);break;case 13:Wn(e,t),ai(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Mh=Tt())),i&4&&Mm(t);break;case 22:if(f=n!==null&&n.memoizedState!==null,t.mode&1?(nn=(u=nn)||f,Wn(e,t),nn=u):Wn(e,t),ai(t),i&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!f&&t.mode&1)for(be=t,f=t.child;f!==null;){for(p=be=f;be!==null;){switch(h=be,m=h.child,h.tag){case 0:case 11:case 14:case 15:ka(4,h,h.return);break;case 1:Ds(h,h.return);var g=h.stateNode;if(typeof g.componentWillUnmount=="function"){i=h,n=h.return;try{e=i,g.props=e.memoizedProps,g.state=e.memoizedState,g.componentWillUnmount()}catch(S){wt(i,n,S)}}break;case 5:Ds(h,h.return);break;case 22:if(h.memoizedState!==null){Cm(p);continue}}m!==null?(m.return=h,be=m):Cm(p)}f=f.sibling}e:for(f=null,p=t;;){if(p.tag===5){if(f===null){f=p;try{r=p.stateNode,u?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=p.stateNode,c=p.memoizedProps.style,o=c!=null&&c.hasOwnProperty("display")?c.display:null,l.style.display=Lg("display",o))}catch(S){wt(t,t.return,S)}}}else if(p.tag===6){if(f===null)try{p.stateNode.nodeValue=u?"":p.memoizedProps}catch(S){wt(t,t.return,S)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===t)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===t)break e;for(;p.sibling===null;){if(p.return===null||p.return===t)break e;f===p&&(f=null),p=p.return}f===p&&(f=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Wn(e,t),ai(t),i&4&&Mm(t);break;case 21:break;default:Wn(e,t),ai(t)}}function ai(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(av(n)){var i=n;break e}n=n.return}throw Error(ae(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Va(r,""),i.flags&=-33);var s=bm(t);kd(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,l=bm(t);Ud(t,l,o);break;default:throw Error(ae(161))}}catch(c){wt(t,t.return,c)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Qy(t,e,n){be=t,cv(t)}function cv(t,e,n){for(var i=(t.mode&1)!==0;be!==null;){var r=be,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||jo;if(!o){var l=r.alternate,c=l!==null&&l.memoizedState!==null||nn;l=jo;var u=nn;if(jo=o,(nn=c)&&!u)for(be=r;be!==null;)o=be,c=o.child,o.tag===22&&o.memoizedState!==null?Am(r):c!==null?(c.return=o,be=c):Am(r);for(;s!==null;)be=s,cv(s),s=s.sibling;be=r,jo=l,nn=u}wm(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,be=s):wm(t)}}function wm(t){for(;be!==null;){var e=be;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:nn||Mc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!nn)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Yn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&cm(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}cm(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var c=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var f=u.memoizedState;if(f!==null){var p=f.dehydrated;p!==null&&Xa(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ae(163))}nn||e.flags&512&&Id(e)}catch(h){wt(e,e.return,h)}}if(e===t){be=null;break}if(n=e.sibling,n!==null){n.return=e.return,be=n;break}be=e.return}}function Cm(t){for(;be!==null;){var e=be;if(e===t){be=null;break}var n=e.sibling;if(n!==null){n.return=e.return,be=n;break}be=e.return}}function Am(t){for(;be!==null;){var e=be;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Mc(4,e)}catch(c){wt(e,n,c)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(c){wt(e,r,c)}}var s=e.return;try{Id(e)}catch(c){wt(e,s,c)}break;case 5:var o=e.return;try{Id(e)}catch(c){wt(e,o,c)}}}catch(c){wt(e,e.return,c)}if(e===t){be=null;break}var l=e.sibling;if(l!==null){l.return=e.return,be=l;break}be=e.return}}var eS=Math.ceil,Jl=Vi.ReactCurrentDispatcher,Eh=Vi.ReactCurrentOwner,zn=Vi.ReactCurrentBatchConfig,nt=0,Ht=null,Ut=null,$t=0,Mn=0,Ps=Mr(0),Bt=0,io=null,Xr=0,wc=0,bh=0,Oa=null,xn=null,Mh=0,qs=1/0,Ai=null,Ql=!1,Od=null,mr=null,zo=!1,lr=null,ec=0,Ba=0,Bd=null,Ml=-1,wl=0;function un(){return nt&6?Tt():Ml!==-1?Ml:Ml=Tt()}function xr(t){return t.mode&1?nt&2&&$t!==0?$t&-$t:ky.transition!==null?(wl===0&&(wl=$g()),wl):(t=ct,t!==0||(t=window.event,t=t===void 0?16:e0(t.type)),t):1}function ti(t,e,n,i){if(50<Ba)throw Ba=0,Bd=null,Error(ae(185));go(t,n,i),(!(nt&2)||t!==Ht)&&(t===Ht&&(!(nt&2)&&(wc|=n),Bt===4&&sr(t,$t)),yn(t,i),n===1&&nt===0&&!(e.mode&1)&&(qs=Tt()+500,Sc&&wr()))}function yn(t,e){var n=t.callbackNode;k1(t,e);var i=kl(t,t===Ht?$t:0);if(i===0)n!==null&&Up(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Up(n),e===1)t.tag===0?Uy(Tm.bind(null,t)):_0(Tm.bind(null,t)),Py(function(){!(nt&6)&&wr()}),n=null;else{switch(qg(i)){case 1:n=Kf;break;case 4:n=Wg;break;case 16:n=Ul;break;case 536870912:n=Xg;break;default:n=Ul}n=gv(n,uv.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function uv(t,e){if(Ml=-1,wl=0,nt&6)throw Error(ae(327));var n=t.callbackNode;if(Bs()&&t.callbackNode!==n)return null;var i=kl(t,t===Ht?$t:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=tc(t,i);else{e=i;var r=nt;nt|=2;var s=fv();(Ht!==t||$t!==e)&&(Ai=null,qs=Tt()+500,zr(t,e));do try{iS();break}catch(l){dv(t,l)}while(1);ch(),Jl.current=s,nt=r,Ut!==null?e=0:(Ht=null,$t=0,e=Bt)}if(e!==0){if(e===2&&(r=fd(t),r!==0&&(i=r,e=jd(t,r))),e===1)throw n=io,zr(t,0),sr(t,i),yn(t,Tt()),n;if(e===6)sr(t,i);else{if(r=t.current.alternate,!(i&30)&&!tS(r)&&(e=tc(t,i),e===2&&(s=fd(t),s!==0&&(i=s,e=jd(t,s))),e===1))throw n=io,zr(t,0),sr(t,i),yn(t,Tt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ae(345));case 2:Ir(t,xn,Ai);break;case 3:if(sr(t,i),(i&130023424)===i&&(e=Mh+500-Tt(),10<e)){if(kl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){un(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=yd(Ir.bind(null,t,xn,Ai),e);break}Ir(t,xn,Ai);break;case 4:if(sr(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-ei(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=Tt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*eS(i/1960))-i,10<i){t.timeoutHandle=yd(Ir.bind(null,t,xn,Ai),i);break}Ir(t,xn,Ai);break;case 5:Ir(t,xn,Ai);break;default:throw Error(ae(329))}}}return yn(t,Tt()),t.callbackNode===n?uv.bind(null,t):null}function jd(t,e){var n=Oa;return t.current.memoizedState.isDehydrated&&(zr(t,e).flags|=256),t=tc(t,e),t!==2&&(e=xn,xn=n,e!==null&&zd(e)),t}function zd(t){xn===null?xn=t:xn.push.apply(xn,t)}function tS(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!ii(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function sr(t,e){for(e&=~bh,e&=~wc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ei(e),i=1<<n;t[n]=-1,e&=~i}}function Tm(t){if(nt&6)throw Error(ae(327));Bs();var e=kl(t,0);if(!(e&1))return yn(t,Tt()),null;var n=tc(t,e);if(t.tag!==0&&n===2){var i=fd(t);i!==0&&(e=i,n=jd(t,i))}if(n===1)throw n=io,zr(t,0),sr(t,e),yn(t,Tt()),n;if(n===6)throw Error(ae(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Ir(t,xn,Ai),yn(t,Tt()),null}function wh(t,e){var n=nt;nt|=1;try{return t(e)}finally{nt=n,nt===0&&(qs=Tt()+500,Sc&&wr())}}function $r(t){lr!==null&&lr.tag===0&&!(nt&6)&&Bs();var e=nt;nt|=1;var n=zn.transition,i=ct;try{if(zn.transition=null,ct=1,t)return t()}finally{ct=i,zn.transition=n,nt=e,!(nt&6)&&wr()}}function Ch(){Mn=Ps.current,gt(Ps)}function zr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,Dy(n)),Ut!==null)for(n=Ut.return;n!==null;){var i=n;switch(ah(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Vl();break;case 3:Xs(),gt(vn),gt(sn),mh();break;case 5:ph(i);break;case 4:Xs();break;case 13:gt(yt);break;case 19:gt(yt);break;case 10:uh(i.type._context);break;case 22:case 23:Ch()}n=n.return}if(Ht=t,Ut=t=gr(t.current,null),$t=Mn=e,Bt=0,io=null,bh=wc=Xr=0,xn=Oa=null,kr!==null){for(e=0;e<kr.length;e++)if(n=kr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}kr=null}return t}function dv(t,e){do{var n=Ut;try{if(ch(),Sl.current=Zl,Kl){for(var i=Et.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Kl=!1}if(Wr=0,Gt=Ot=Et=null,Ua=!1,eo=0,Eh.current=null,n===null||n.return===null){Bt=1,io=e,Ut=null;break}e:{var s=t,o=n.return,l=n,c=e;if(e=$t,l.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var u=c,f=l,p=f.tag;if(!(f.mode&1)&&(p===0||p===11||p===15)){var h=f.alternate;h?(f.updateQueue=h.updateQueue,f.memoizedState=h.memoizedState,f.lanes=h.lanes):(f.updateQueue=null,f.memoizedState=null)}var m=mm(o);if(m!==null){m.flags&=-257,xm(m,o,l,s,e),m.mode&1&&pm(s,u,e),e=m,c=u;var g=e.updateQueue;if(g===null){var S=new Set;S.add(c),e.updateQueue=S}else g.add(c);break e}else{if(!(e&1)){pm(s,u,e),Ah();break e}c=Error(ae(426))}}else if(vt&&l.mode&1){var x=mm(o);if(x!==null){!(x.flags&65536)&&(x.flags|=256),xm(x,o,l,s,e),oh($s(c,l));break e}}s=c=$s(c,l),Bt!==4&&(Bt=2),Oa===null?Oa=[s]:Oa.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=q0(s,c,e);lm(s,d);break e;case 1:l=c;var v=s.type,b=s.stateNode;if(!(s.flags&128)&&(typeof v.getDerivedStateFromError=="function"||b!==null&&typeof b.componentDidCatch=="function"&&(mr===null||!mr.has(b)))){s.flags|=65536,e&=-e,s.lanes|=e;var E=Y0(s,l,e);lm(s,E);break e}}s=s.return}while(s!==null)}pv(n)}catch(w){e=w,Ut===n&&n!==null&&(Ut=n=n.return);continue}break}while(1)}function fv(){var t=Jl.current;return Jl.current=Zl,t===null?Zl:t}function Ah(){(Bt===0||Bt===3||Bt===2)&&(Bt=4),Ht===null||!(Xr&268435455)&&!(wc&268435455)||sr(Ht,$t)}function tc(t,e){var n=nt;nt|=2;var i=fv();(Ht!==t||$t!==e)&&(Ai=null,zr(t,e));do try{nS();break}catch(r){dv(t,r)}while(1);if(ch(),nt=n,Jl.current=i,Ut!==null)throw Error(ae(261));return Ht=null,$t=0,Bt}function nS(){for(;Ut!==null;)hv(Ut)}function iS(){for(;Ut!==null&&!T1();)hv(Ut)}function hv(t){var e=xv(t.alternate,t,Mn);t.memoizedProps=t.pendingProps,e===null?pv(t):Ut=e,Eh.current=null}function pv(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=Ky(n,e),n!==null){n.flags&=32767,Ut=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Bt=6,Ut=null;return}}else if(n=Yy(n,e,Mn),n!==null){Ut=n;return}if(e=e.sibling,e!==null){Ut=e;return}Ut=e=t}while(e!==null);Bt===0&&(Bt=5)}function Ir(t,e,n){var i=ct,r=zn.transition;try{zn.transition=null,ct=1,rS(t,e,n,i)}finally{zn.transition=r,ct=i}return null}function rS(t,e,n,i){do Bs();while(lr!==null);if(nt&6)throw Error(ae(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ae(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(O1(t,s),t===Ht&&(Ut=Ht=null,$t=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||zo||(zo=!0,gv(Ul,function(){return Bs(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=zn.transition,zn.transition=null;var o=ct;ct=1;var l=nt;nt|=4,Eh.current=null,Jy(t,n),lv(n,t),My(vd),Ol=!!gd,vd=gd=null,t.current=n,Qy(n),N1(),nt=l,ct=o,zn.transition=s}else t.current=n;if(zo&&(zo=!1,lr=t,ec=r),s=t.pendingLanes,s===0&&(mr=null),P1(n.stateNode),yn(t,Tt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Ql)throw Ql=!1,t=Od,Od=null,t;return ec&1&&t.tag!==0&&Bs(),s=t.pendingLanes,s&1?t===Bd?Ba++:(Ba=0,Bd=t):Ba=0,wr(),null}function Bs(){if(lr!==null){var t=qg(ec),e=zn.transition,n=ct;try{if(zn.transition=null,ct=16>t?16:t,lr===null)var i=!1;else{if(t=lr,lr=null,ec=0,nt&6)throw Error(ae(331));var r=nt;for(nt|=4,be=t.current;be!==null;){var s=be,o=s.child;if(be.flags&16){var l=s.deletions;if(l!==null){for(var c=0;c<l.length;c++){var u=l[c];for(be=u;be!==null;){var f=be;switch(f.tag){case 0:case 11:case 15:ka(8,f,s)}var p=f.child;if(p!==null)p.return=f,be=p;else for(;be!==null;){f=be;var h=f.sibling,m=f.return;if(sv(f),f===u){be=null;break}if(h!==null){h.return=m,be=h;break}be=m}}}var g=s.alternate;if(g!==null){var S=g.child;if(S!==null){g.child=null;do{var x=S.sibling;S.sibling=null,S=x}while(S!==null)}}be=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,be=o;else e:for(;be!==null;){if(s=be,s.flags&2048)switch(s.tag){case 0:case 11:case 15:ka(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,be=d;break e}be=s.return}}var v=t.current;for(be=v;be!==null;){o=be;var b=o.child;if(o.subtreeFlags&2064&&b!==null)b.return=o,be=b;else e:for(o=v;be!==null;){if(l=be,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:Mc(9,l)}}catch(w){wt(l,l.return,w)}if(l===o){be=null;break e}var E=l.sibling;if(E!==null){E.return=l.return,be=E;break e}be=l.return}}if(nt=r,wr(),mi&&typeof mi.onPostCommitFiberRoot=="function")try{mi.onPostCommitFiberRoot(xc,t)}catch{}i=!0}return i}finally{ct=n,zn.transition=e}}return!1}function Nm(t,e,n){e=$s(n,e),e=q0(t,e,1),t=pr(t,e,1),e=un(),t!==null&&(go(t,1,e),yn(t,e))}function wt(t,e,n){if(t.tag===3)Nm(t,t,n);else for(;e!==null;){if(e.tag===3){Nm(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(mr===null||!mr.has(i))){t=$s(n,t),t=Y0(e,t,1),e=pr(e,t,1),t=un(),e!==null&&(go(e,1,t),yn(e,t));break}}e=e.return}}function sS(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=un(),t.pingedLanes|=t.suspendedLanes&n,Ht===t&&($t&n)===n&&(Bt===4||Bt===3&&($t&130023424)===$t&&500>Tt()-Mh?zr(t,0):bh|=n),yn(t,e)}function mv(t,e){e===0&&(t.mode&1?(e=Do,Do<<=1,!(Do&130023424)&&(Do=4194304)):e=1);var n=un();t=Oi(t,e),t!==null&&(go(t,e,n),yn(t,n))}function aS(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),mv(t,n)}function oS(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ae(314))}i!==null&&i.delete(e),mv(t,n)}var xv;xv=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||vn.current)gn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return gn=!1,qy(t,e,n);gn=!!(t.flags&131072)}else gn=!1,vt&&e.flags&1048576&&y0(e,Wl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;bl(t,e),t=e.pendingProps;var r=Gs(e,sn.current);Os(e,n),r=gh(null,e,i,t,r,n);var s=vh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,_n(i)?(s=!0,Gl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,fh(e),r.updater=bc,e.stateNode=r,r._reactInternals=e,Ad(e,i,t,n),e=Rd(null,e,i,!0,s,n)):(e.tag=0,vt&&s&&sh(e),ln(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(bl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=cS(i),t=Yn(i,t),r){case 0:e=Nd(null,e,i,t,n);break e;case 1:e=_m(null,e,i,t,n);break e;case 11:e=gm(null,e,i,t,n);break e;case 14:e=vm(null,e,i,Yn(i.type,t),n);break e}throw Error(ae(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Yn(i,r),Nd(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Yn(i,r),_m(t,e,i,r,n);case 3:e:{if(Q0(e),t===null)throw Error(ae(387));i=e.pendingProps,s=e.memoizedState,r=s.element,C0(t,e),ql(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=$s(Error(ae(423)),e),e=ym(t,e,i,n,r);break e}else if(i!==r){r=$s(Error(ae(424)),e),e=ym(t,e,i,n,r);break e}else for(Tn=hr(e.stateNode.containerInfo.firstChild),Rn=e,vt=!0,Zn=null,n=M0(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Hs(),i===r){e=Bi(t,e,n);break e}ln(t,e,i,n)}e=e.child}return e;case 5:return A0(e),t===null&&Md(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,_d(i,r)?o=null:s!==null&&_d(i,s)&&(e.flags|=32),J0(t,e),ln(t,e,o,n),e.child;case 6:return t===null&&Md(e),null;case 13:return ev(t,e,n);case 4:return hh(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Ws(e,null,i,n):ln(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Yn(i,r),gm(t,e,i,r,n);case 7:return ln(t,e,e.pendingProps,n),e.child;case 8:return ln(t,e,e.pendingProps.children,n),e.child;case 12:return ln(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,pt(Xl,i._currentValue),i._currentValue=o,s!==null)if(ii(s.value,o)){if(s.children===r.children&&!vn.current){e=Bi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var l=s.dependencies;if(l!==null){o=s.child;for(var c=l.firstContext;c!==null;){if(c.context===i){if(s.tag===1){c=Pi(-1,n&-n),c.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var f=u.pending;f===null?c.next=c:(c.next=f.next,f.next=c),u.pending=c}}s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),wd(s.return,n,e),l.lanes|=n;break}c=c.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ae(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),wd(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}ln(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Os(e,n),r=Vn(r),i=i(r),e.flags|=1,ln(t,e,i,n),e.child;case 14:return i=e.type,r=Yn(i,e.pendingProps),r=Yn(i.type,r),vm(t,e,i,r,n);case 15:return K0(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Yn(i,r),bl(t,e),e.tag=1,_n(i)?(t=!0,Gl(e)):t=!1,Os(e,n),$0(e,i,r),Ad(e,i,r,n),Rd(null,e,i,!0,t,n);case 19:return tv(t,e,n);case 22:return Z0(t,e,n)}throw Error(ae(156,e.tag))};function gv(t,e){return Hg(t,e)}function lS(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function jn(t,e,n,i){return new lS(t,e,n,i)}function Th(t){return t=t.prototype,!(!t||!t.isReactComponent)}function cS(t){if(typeof t=="function")return Th(t)?1:0;if(t!=null){if(t=t.$$typeof,t===$f)return 11;if(t===qf)return 14}return 2}function gr(t,e){var n=t.alternate;return n===null?(n=jn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Cl(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")Th(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Es:return Vr(n.children,r,s,e);case Xf:o=8,r|=8;break;case Zu:return t=jn(12,n,e,r|2),t.elementType=Zu,t.lanes=s,t;case Ju:return t=jn(13,n,e,r),t.elementType=Ju,t.lanes=s,t;case Qu:return t=jn(19,n,e,r),t.elementType=Qu,t.lanes=s,t;case Ag:return Cc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case wg:o=10;break e;case Cg:o=9;break e;case $f:o=11;break e;case qf:o=14;break e;case tr:o=16,i=null;break e}throw Error(ae(130,t==null?t:typeof t,""))}return e=jn(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Vr(t,e,n,i){return t=jn(7,t,i,e),t.lanes=n,t}function Cc(t,e,n,i){return t=jn(22,t,i,e),t.elementType=Ag,t.lanes=n,t.stateNode={isHidden:!1},t}function uu(t,e,n){return t=jn(6,t,null,e),t.lanes=n,t}function du(t,e,n){return e=jn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function uS(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Wc(0),this.expirationTimes=Wc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Wc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Nh(t,e,n,i,r,s,o,l,c){return t=new uS(t,e,n,l,c),e===1?(e=1,s===!0&&(e|=8)):e=0,s=jn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},fh(s),t}function dS(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ss,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function vv(t){if(!t)return Sr;t=t._reactInternals;e:{if(Qr(t)!==t||t.tag!==1)throw Error(ae(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(_n(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ae(171))}if(t.tag===1){var n=t.type;if(_n(n))return v0(t,n,e)}return e}function _v(t,e,n,i,r,s,o,l,c){return t=Nh(n,i,!0,t,r,s,o,l,c),t.context=vv(null),n=t.current,i=un(),r=xr(n),s=Pi(i,r),s.callback=e??null,pr(n,s,r),t.current.lanes=r,go(t,r,i),yn(t,i),t}function Ac(t,e,n,i){var r=e.current,s=un(),o=xr(r);return n=vv(n),e.context===null?e.context=n:e.pendingContext=n,e=Pi(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=pr(r,e,o),t!==null&&(ti(t,r,o,s),yl(t,r,o)),o}function nc(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Rm(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Rh(t,e){Rm(t,e),(t=t.alternate)&&Rm(t,e)}function fS(){return null}var yv=typeof reportError=="function"?reportError:function(t){console.error(t)};function Dh(t){this._internalRoot=t}Tc.prototype.render=Dh.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ae(409));Ac(t,e,null,null)};Tc.prototype.unmount=Dh.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;$r(function(){Ac(null,t,null,null)}),e[ki]=null}};function Tc(t){this._internalRoot=t}Tc.prototype.unstable_scheduleHydration=function(t){if(t){var e=Zg();t={blockedOn:null,target:t,priority:e};for(var n=0;n<rr.length&&e!==0&&e<rr[n].priority;n++);rr.splice(n,0,t),n===0&&Qg(t)}};function Ph(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Nc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Dm(){}function hS(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var u=nc(o);s.call(u)}}var o=_v(e,i,t,0,null,!1,!1,"",Dm);return t._reactRootContainer=o,t[ki]=o.current,Ya(t.nodeType===8?t.parentNode:t),$r(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var l=i;i=function(){var u=nc(c);l.call(u)}}var c=Nh(t,0,!1,null,null,!1,!1,"",Dm);return t._reactRootContainer=c,t[ki]=c.current,Ya(t.nodeType===8?t.parentNode:t),$r(function(){Ac(e,c,n,i)}),c}function Rc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var l=r;r=function(){var c=nc(o);l.call(c)}}Ac(e,o,t,r)}else o=hS(n,e,t,r,i);return nc(o)}Yg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Ca(e.pendingLanes);n!==0&&(Zf(e,n|1),yn(e,Tt()),!(nt&6)&&(qs=Tt()+500,wr()))}break;case 13:$r(function(){var i=Oi(t,1);if(i!==null){var r=un();ti(i,t,1,r)}}),Rh(t,1)}};Jf=function(t){if(t.tag===13){var e=Oi(t,134217728);if(e!==null){var n=un();ti(e,t,134217728,n)}Rh(t,134217728)}};Kg=function(t){if(t.tag===13){var e=xr(t),n=Oi(t,e);if(n!==null){var i=un();ti(n,t,e,i)}Rh(t,e)}};Zg=function(){return ct};Jg=function(t,e){var n=ct;try{return ct=t,e()}finally{ct=n}};cd=function(t,e,n){switch(e){case"input":if(nd(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=yc(i);if(!r)throw Error(ae(90));Ng(i),nd(i,r)}}}break;case"textarea":Dg(t,n);break;case"select":e=n.value,e!=null&&Ls(t,!!n.multiple,e,!1)}};Og=wh;Bg=$r;var pS={usingClientEntryPoint:!1,Events:[_o,Cs,yc,Ug,kg,wh]},pa={findFiberByHostInstance:Ur,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},mS={bundleType:pa.bundleType,version:pa.version,rendererPackageName:pa.rendererPackageName,rendererConfig:pa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Vi.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Vg(t),t===null?null:t.stateNode},findFiberByHostInstance:pa.findFiberByHostInstance||fS,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Vo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Vo.isDisabled&&Vo.supportsFiber)try{xc=Vo.inject(mS),mi=Vo}catch{}}Pn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=pS;Pn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ph(e))throw Error(ae(200));return dS(t,e,null,n)};Pn.createRoot=function(t,e){if(!Ph(t))throw Error(ae(299));var n=!1,i="",r=yv;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Nh(t,1,!1,null,null,n,!1,i,r),t[ki]=e.current,Ya(t.nodeType===8?t.parentNode:t),new Dh(e)};Pn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ae(188)):(t=Object.keys(t).join(","),Error(ae(268,t)));return t=Vg(e),t=t===null?null:t.stateNode,t};Pn.flushSync=function(t){return $r(t)};Pn.hydrate=function(t,e,n){if(!Nc(e))throw Error(ae(200));return Rc(null,t,e,!0,n)};Pn.hydrateRoot=function(t,e,n){if(!Ph(t))throw Error(ae(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=yv;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=_v(e,null,t,1,n??null,r,!1,s,o),t[ki]=e.current,Ya(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new Tc(e)};Pn.render=function(t,e,n){if(!Nc(e))throw Error(ae(200));return Rc(null,t,e,!1,n)};Pn.unmountComponentAtNode=function(t){if(!Nc(t))throw Error(ae(40));return t._reactRootContainer?($r(function(){Rc(null,null,t,!1,function(){t._reactRootContainer=null,t[ki]=null})}),!0):!1};Pn.unstable_batchedUpdates=wh;Pn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Nc(n))throw Error(ae(200));if(t==null||t._reactInternals===void 0)throw Error(ae(38));return Rc(t,e,n,!1,i)};Pn.version="18.3.1-next-f1338f8080-20240426";function Sv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Sv)}catch(t){console.error(t)}}Sv(),Sg.exports=Pn;var xS=Sg.exports,Pm=xS;Yu.createRoot=Pm.createRoot,Yu.hydrateRoot=Pm.hydrateRoot;function gS(t={}){const{nonce:e,locale:n,onScriptLoadSuccess:i,onScriptLoadError:r}=t,[s,o]=L.useState(!1),l=L.useRef(i);l.current=i;const c=L.useRef(r);return c.current=r,L.useEffect(()=>{const u=document.createElement("script");return u.src="https://accounts.google.com/gsi/client",n&&(u.src+=`?hl=${n}`),u.async=!0,u.defer=!0,u.nonce=e,u.onload=()=>{var f;o(!0),(f=l.current)===null||f===void 0||f.call(l)},u.onerror=()=>{var f;o(!1),(f=c.current)===null||f===void 0||f.call(c)},document.body.appendChild(u),()=>{document.body.removeChild(u)}},[e]),s}const Ev=L.createContext(null);function bv({clientId:t,nonce:e,locale:n,onScriptLoadSuccess:i,onScriptLoadError:r,children:s}){const o=gS({nonce:e,onScriptLoadSuccess:i,onScriptLoadError:r,locale:n}),l=L.useMemo(()=>({locale:n,clientId:t,scriptLoadedSuccessfully:o}),[t,o]);return mc.createElement(Ev.Provider,{value:l},s)}function vS(){const t=L.useContext(Ev);if(!t)throw new Error("Google OAuth components must be used within GoogleOAuthProvider");return t}function _S(t){var e;return(e=t==null?void 0:t.clientId)!==null&&e!==void 0?e:t==null?void 0:t.client_id}const yS={large:40,medium:32,small:20};function SS({onSuccess:t,onError:e,useOneTap:n,promptMomentNotification:i,type:r="standard",theme:s="outline",size:o="large",text:l,shape:c,logo_alignment:u,width:f,click_listener:p,state:h,containerProps:m,login_hint:g,...S}){const x=L.useRef(null),{clientId:d,locale:v,scriptLoadedSuccessfully:b}=vS(),E=L.useRef(t);E.current=t;const w=L.useRef(e);w.current=e;const C=L.useRef(i);return C.current=i,L.useEffect(()=>{var T,_,A,R,P,D,U,F,B;if(b)return(A=(_=(T=window==null?void 0:window.google)===null||T===void 0?void 0:T.accounts)===null||_===void 0?void 0:_.id)===null||A===void 0||A.initialize({client_id:d,callback:Z=>{var X;if(!(Z!=null&&Z.credential))return(X=w.current)===null||X===void 0?void 0:X.call(w);const{credential:j,select_by:z}=Z;E.current({credential:j,clientId:_S(Z),select_by:z})},login_hint:g,...S}),(D=(P=(R=window==null?void 0:window.google)===null||R===void 0?void 0:R.accounts)===null||P===void 0?void 0:P.id)===null||D===void 0||D.renderButton(x.current,{type:r,theme:s,size:o,text:l,shape:c,logo_alignment:u,width:f,locale:v,click_listener:p,state:h}),n&&((B=(F=(U=window==null?void 0:window.google)===null||U===void 0?void 0:U.accounts)===null||F===void 0?void 0:F.id)===null||B===void 0||B.prompt(C.current)),()=>{var Z,X,j;n&&((j=(X=(Z=window==null?void 0:window.google)===null||Z===void 0?void 0:Z.accounts)===null||X===void 0?void 0:X.id)===null||j===void 0||j.cancel())}},[d,b,n,r,s,o,l,c,u,f,v,g]),mc.createElement("div",{...m,ref:x,style:{height:yS[o],...m==null?void 0:m.style}})}/**
 * @remix-run/router v1.23.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ro(){return ro=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},ro.apply(null,arguments)}var cr;(function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"})(cr||(cr={}));const Fm="popstate";function ES(t){t===void 0&&(t={});function e(i,r){let{pathname:s,search:o,hash:l}=i.location;return Vd("",{pathname:s,search:o,hash:l},r.state&&r.state.usr||null,r.state&&r.state.key||"default")}function n(i,r){return typeof r=="string"?r:ic(r)}return MS(e,n,null,t)}function Nt(t,e){if(t===!1||t===null||typeof t>"u")throw new Error(e)}function Mv(t,e){if(!t){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function bS(){return Math.random().toString(36).substr(2,8)}function Lm(t,e){return{usr:t.state,key:t.key,idx:e}}function Vd(t,e,n,i){return n===void 0&&(n=null),ro({pathname:typeof t=="string"?t:t.pathname,search:"",hash:""},typeof e=="string"?ta(e):e,{state:n,key:e&&e.key||i||bS()})}function ic(t){let{pathname:e="/",search:n="",hash:i=""}=t;return n&&n!=="?"&&(e+=n.charAt(0)==="?"?n:"?"+n),i&&i!=="#"&&(e+=i.charAt(0)==="#"?i:"#"+i),e}function ta(t){let e={};if(t){let n=t.indexOf("#");n>=0&&(e.hash=t.substr(n),t=t.substr(0,n));let i=t.indexOf("?");i>=0&&(e.search=t.substr(i),t=t.substr(0,i)),t&&(e.pathname=t)}return e}function MS(t,e,n,i){i===void 0&&(i={});let{window:r=document.defaultView,v5Compat:s=!1}=i,o=r.history,l=cr.Pop,c=null,u=f();u==null&&(u=0,o.replaceState(ro({},o.state,{idx:u}),""));function f(){return(o.state||{idx:null}).idx}function p(){l=cr.Pop;let x=f(),d=x==null?null:x-u;u=x,c&&c({action:l,location:S.location,delta:d})}function h(x,d){l=cr.Push;let v=Vd(S.location,x,d);n&&n(v,x),u=f()+1;let b=Lm(v,u),E=S.createHref(v);try{o.pushState(b,"",E)}catch(w){if(w instanceof DOMException&&w.name==="DataCloneError")throw w;r.location.assign(E)}s&&c&&c({action:l,location:S.location,delta:1})}function m(x,d){l=cr.Replace;let v=Vd(S.location,x,d);n&&n(v,x),u=f();let b=Lm(v,u),E=S.createHref(v);o.replaceState(b,"",E),s&&c&&c({action:l,location:S.location,delta:0})}function g(x){let d=r.location.origin!=="null"?r.location.origin:r.location.href,v=typeof x=="string"?x:ic(x);return v=v.replace(/ $/,"%20"),Nt(d,"No window.location.(origin|href) available to create URL for href: "+v),new URL(v,d)}let S={get action(){return l},get location(){return t(r,o)},listen(x){if(c)throw new Error("A history only accepts one active listener");return r.addEventListener(Fm,p),c=x,()=>{r.removeEventListener(Fm,p),c=null}},createHref(x){return e(r,x)},createURL:g,encodeLocation(x){let d=g(x);return{pathname:d.pathname,search:d.search,hash:d.hash}},push:h,replace:m,go(x){return o.go(x)}};return S}var Im;(function(t){t.data="data",t.deferred="deferred",t.redirect="redirect",t.error="error"})(Im||(Im={}));function wS(t,e,n){return n===void 0&&(n="/"),CS(t,e,n,!1)}function CS(t,e,n,i){let r=typeof e=="string"?ta(e):e,s=Fh(r.pathname||"/",n);if(s==null)return null;let o=wv(t);AS(o);let l=null,c=OS(s);for(let u=0;l==null&&u<o.length;++u)l=US(o[u],c,i);return l}function wv(t,e,n,i){e===void 0&&(e=[]),n===void 0&&(n=[]),i===void 0&&(i="");let r=(s,o,l)=>{let c={relativePath:l===void 0?s.path||"":l,caseSensitive:s.caseSensitive===!0,childrenIndex:o,route:s};c.relativePath.startsWith("/")&&(Nt(c.relativePath.startsWith(i),'Absolute route path "'+c.relativePath+'" nested under path '+('"'+i+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),c.relativePath=c.relativePath.slice(i.length));let u=vr([i,c.relativePath]),f=n.concat(c);s.children&&s.children.length>0&&(Nt(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+u+'".')),wv(s.children,e,f,u)),!(s.path==null&&!s.index)&&e.push({path:u,score:LS(u,s.index),routesMeta:f})};return t.forEach((s,o)=>{var l;if(s.path===""||!((l=s.path)!=null&&l.includes("?")))r(s,o);else for(let c of Cv(s.path))r(s,o,c)}),e}function Cv(t){let e=t.split("/");if(e.length===0)return[];let[n,...i]=e,r=n.endsWith("?"),s=n.replace(/\?$/,"");if(i.length===0)return r?[s,""]:[s];let o=Cv(i.join("/")),l=[];return l.push(...o.map(c=>c===""?s:[s,c].join("/"))),r&&l.push(...o),l.map(c=>t.startsWith("/")&&c===""?"/":c)}function AS(t){t.sort((e,n)=>e.score!==n.score?n.score-e.score:IS(e.routesMeta.map(i=>i.childrenIndex),n.routesMeta.map(i=>i.childrenIndex)))}const TS=/^:[\w-]+$/,NS=3,RS=2,DS=1,PS=10,FS=-2,Um=t=>t==="*";function LS(t,e){let n=t.split("/"),i=n.length;return n.some(Um)&&(i+=FS),e&&(i+=RS),n.filter(r=>!Um(r)).reduce((r,s)=>r+(TS.test(s)?NS:s===""?DS:PS),i)}function IS(t,e){return t.length===e.length&&t.slice(0,-1).every((i,r)=>i===e[r])?t[t.length-1]-e[e.length-1]:0}function US(t,e,n){n===void 0&&(n=!1);let{routesMeta:i}=t,r={},s="/",o=[];for(let l=0;l<i.length;++l){let c=i[l],u=l===i.length-1,f=s==="/"?e:e.slice(s.length)||"/",p=km({path:c.relativePath,caseSensitive:c.caseSensitive,end:u},f),h=c.route;if(!p&&u&&n&&!i[i.length-1].route.index&&(p=km({path:c.relativePath,caseSensitive:c.caseSensitive,end:!1},f)),!p)return null;Object.assign(r,p.params),o.push({params:r,pathname:vr([s,p.pathname]),pathnameBase:zS(vr([s,p.pathnameBase])),route:h}),p.pathnameBase!=="/"&&(s=vr([s,p.pathnameBase]))}return o}function km(t,e){typeof t=="string"&&(t={path:t,caseSensitive:!1,end:!0});let[n,i]=kS(t.path,t.caseSensitive,t.end),r=e.match(n);if(!r)return null;let s=r[0],o=s.replace(/(.)\/+$/,"$1"),l=r.slice(1);return{params:i.reduce((u,f,p)=>{let{paramName:h,isOptional:m}=f;if(h==="*"){let S=l[p]||"";o=s.slice(0,s.length-S.length).replace(/(.)\/+$/,"$1")}const g=l[p];return m&&!g?u[h]=void 0:u[h]=(g||"").replace(/%2F/g,"/"),u},{}),pathname:s,pathnameBase:o,pattern:t}}function kS(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!0),Mv(t==="*"||!t.endsWith("*")||t.endsWith("/*"),'Route path "'+t+'" will be treated as if it were '+('"'+t.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+t.replace(/\*$/,"/*")+'".'));let i=[],r="^"+t.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,l,c)=>(i.push({paramName:l,isOptional:c!=null}),c?"/?([^\\/]+)?":"/([^\\/]+)"));return t.endsWith("*")?(i.push({paramName:"*"}),r+=t==="*"||t==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?r+="\\/*$":t!==""&&t!=="/"&&(r+="(?:(?=\\/|$))"),[new RegExp(r,e?void 0:"i"),i]}function OS(t){try{return t.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return Mv(!1,'The URL path "'+t+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),t}}function Fh(t,e){if(e==="/")return t;if(!t.toLowerCase().startsWith(e.toLowerCase()))return null;let n=e.endsWith("/")?e.length-1:e.length,i=t.charAt(n);return i&&i!=="/"?null:t.slice(n)||"/"}function BS(t,e){e===void 0&&(e="/");let{pathname:n,search:i="",hash:r=""}=typeof t=="string"?ta(t):t,s;return n?(n=Av(n),n.startsWith("/")?s=Om(n.substring(1),"/"):s=Om(n,e)):s=e,{pathname:s,search:VS(i),hash:GS(r)}}function Om(t,e){let n=e.replace(/\/+$/,"").split("/");return t.split("/").forEach(r=>{r===".."?n.length>1&&n.pop():r!=="."&&n.push(r)}),n.length>1?n.join("/"):"/"}function fu(t,e,n,i){return"Cannot include a '"+t+"' character in a manually specified "+("`to."+e+"` field ["+JSON.stringify(i)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function jS(t){return t.filter((e,n)=>n===0||e.route.path&&e.route.path.length>0)}function Lh(t,e){let n=jS(t);return e?n.map((i,r)=>r===n.length-1?i.pathname:i.pathnameBase):n.map(i=>i.pathnameBase)}function Ih(t,e,n,i){i===void 0&&(i=!1);let r;typeof t=="string"?r=ta(t):(r=ro({},t),Nt(!r.pathname||!r.pathname.includes("?"),fu("?","pathname","search",r)),Nt(!r.pathname||!r.pathname.includes("#"),fu("#","pathname","hash",r)),Nt(!r.search||!r.search.includes("#"),fu("#","search","hash",r)));let s=t===""||r.pathname==="",o=s?"/":r.pathname,l;if(o==null)l=n;else{let p=e.length-1;if(!i&&o.startsWith("..")){let h=o.split("/");for(;h[0]==="..";)h.shift(),p-=1;r.pathname=h.join("/")}l=p>=0?e[p]:"/"}let c=BS(r,l),u=o&&o!=="/"&&o.endsWith("/"),f=(s||o===".")&&n.endsWith("/");return!c.pathname.endsWith("/")&&(u||f)&&(c.pathname+="/"),c}const Av=t=>t.replace(/\/\/+/g,"/"),vr=t=>Av(t.join("/")),zS=t=>t.replace(/\/+$/,"").replace(/^\/*/,"/"),VS=t=>!t||t==="?"?"":t.startsWith("?")?t:"?"+t,GS=t=>!t||t==="#"?"":t.startsWith("#")?t:"#"+t;function HS(t){return t!=null&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.internal=="boolean"&&"data"in t}const Tv=["post","put","patch","delete"];new Set(Tv);const WS=["get",...Tv];new Set(WS);/**
 * React Router v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function so(){return so=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},so.apply(null,arguments)}const Uh=L.createContext(null),XS=L.createContext(null),Cr=L.createContext(null),Dc=L.createContext(null),Gi=L.createContext({outlet:null,matches:[],isDataRoute:!1}),Nv=L.createContext(null);function $S(t,e){let{relative:n}=e===void 0?{}:e;na()||Nt(!1);let{basename:i,navigator:r}=L.useContext(Cr),{hash:s,pathname:o,search:l}=Dv(t,{relative:n}),c=o;return i!=="/"&&(c=o==="/"?i:vr([i,o])),r.createHref({pathname:c,search:l,hash:s})}function na(){return L.useContext(Dc)!=null}function es(){return na()||Nt(!1),L.useContext(Dc).location}function Rv(t){L.useContext(Cr).static||L.useLayoutEffect(t)}function ts(){let{isDataRoute:t}=L.useContext(Gi);return t?lE():qS()}function qS(){na()||Nt(!1);let t=L.useContext(Uh),{basename:e,future:n,navigator:i}=L.useContext(Cr),{matches:r}=L.useContext(Gi),{pathname:s}=es(),o=JSON.stringify(Lh(r,n.v7_relativeSplatPath)),l=L.useRef(!1);return Rv(()=>{l.current=!0}),L.useCallback(function(u,f){if(f===void 0&&(f={}),!l.current)return;if(typeof u=="number"){i.go(u);return}let p=Ih(u,JSON.parse(o),s,f.relative==="path");t==null&&e!=="/"&&(p.pathname=p.pathname==="/"?e:vr([e,p.pathname])),(f.replace?i.replace:i.push)(p,f.state,f)},[e,i,o,s,t])}const YS=L.createContext(null);function KS(t){let e=L.useContext(Gi).outlet;return e&&L.createElement(YS.Provider,{value:t},e)}function Dv(t,e){let{relative:n}=e===void 0?{}:e,{future:i}=L.useContext(Cr),{matches:r}=L.useContext(Gi),{pathname:s}=es(),o=JSON.stringify(Lh(r,i.v7_relativeSplatPath));return L.useMemo(()=>Ih(t,JSON.parse(o),s,n==="path"),[t,o,s,n])}function ZS(t,e){return JS(t,e)}function JS(t,e,n,i){na()||Nt(!1);let{navigator:r}=L.useContext(Cr),{matches:s}=L.useContext(Gi),o=s[s.length-1],l=o?o.params:{};o&&o.pathname;let c=o?o.pathnameBase:"/";o&&o.route;let u=es(),f;if(e){var p;let x=typeof e=="string"?ta(e):e;c==="/"||(p=x.pathname)!=null&&p.startsWith(c)||Nt(!1),f=x}else f=u;let h=f.pathname||"/",m=h;if(c!=="/"){let x=c.replace(/^\//,"").split("/");m="/"+h.replace(/^\//,"").split("/").slice(x.length).join("/")}let g=wS(t,{pathname:m}),S=iE(g&&g.map(x=>Object.assign({},x,{params:Object.assign({},l,x.params),pathname:vr([c,r.encodeLocation?r.encodeLocation(x.pathname).pathname:x.pathname]),pathnameBase:x.pathnameBase==="/"?c:vr([c,r.encodeLocation?r.encodeLocation(x.pathnameBase).pathname:x.pathnameBase])})),s,n,i);return e&&S?L.createElement(Dc.Provider,{value:{location:so({pathname:"/",search:"",hash:"",state:null,key:"default"},f),navigationType:cr.Pop}},S):S}function QS(){let t=oE(),e=HS(t)?t.status+" "+t.statusText:t instanceof Error?t.message:JSON.stringify(t),n=t instanceof Error?t.stack:null,r={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"},s=null;return L.createElement(L.Fragment,null,L.createElement("h2",null,"Unexpected Application Error!"),L.createElement("h3",{style:{fontStyle:"italic"}},e),n?L.createElement("pre",{style:r},n):null,s)}const eE=L.createElement(QS,null);class tE extends L.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,n){return n.location!==e.location||n.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:n.error,location:n.location,revalidation:e.revalidation||n.revalidation}}componentDidCatch(e,n){console.error("React Router caught the following error during render",e,n)}render(){return this.state.error!==void 0?L.createElement(Gi.Provider,{value:this.props.routeContext},L.createElement(Nv.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function nE(t){let{routeContext:e,match:n,children:i}=t,r=L.useContext(Uh);return r&&r.static&&r.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(r.staticContext._deepestRenderedBoundaryId=n.route.id),L.createElement(Gi.Provider,{value:e},i)}function iE(t,e,n,i){var r;if(e===void 0&&(e=[]),n===void 0&&(n=null),i===void 0&&(i=null),t==null){var s;if(!n)return null;if(n.errors)t=n.matches;else if((s=i)!=null&&s.v7_partialHydration&&e.length===0&&!n.initialized&&n.matches.length>0)t=n.matches;else return null}let o=t,l=(r=n)==null?void 0:r.errors;if(l!=null){let f=o.findIndex(p=>p.route.id&&(l==null?void 0:l[p.route.id])!==void 0);f>=0||Nt(!1),o=o.slice(0,Math.min(o.length,f+1))}let c=!1,u=-1;if(n&&i&&i.v7_partialHydration)for(let f=0;f<o.length;f++){let p=o[f];if((p.route.HydrateFallback||p.route.hydrateFallbackElement)&&(u=f),p.route.id){let{loaderData:h,errors:m}=n,g=p.route.loader&&h[p.route.id]===void 0&&(!m||m[p.route.id]===void 0);if(p.route.lazy||g){c=!0,u>=0?o=o.slice(0,u+1):o=[o[0]];break}}}return o.reduceRight((f,p,h)=>{let m,g=!1,S=null,x=null;n&&(m=l&&p.route.id?l[p.route.id]:void 0,S=p.route.errorElement||eE,c&&(u<0&&h===0?(cE("route-fallback",!1),g=!0,x=null):u===h&&(g=!0,x=p.route.hydrateFallbackElement||null)));let d=e.concat(o.slice(0,h+1)),v=()=>{let b;return m?b=S:g?b=x:p.route.Component?b=L.createElement(p.route.Component,null):p.route.element?b=p.route.element:b=f,L.createElement(nE,{match:p,routeContext:{outlet:f,matches:d,isDataRoute:n!=null},children:b})};return n&&(p.route.ErrorBoundary||p.route.errorElement||h===0)?L.createElement(tE,{location:n.location,revalidation:n.revalidation,component:S,error:m,children:v(),routeContext:{outlet:null,matches:d,isDataRoute:!0}}):v()},null)}var Pv=function(t){return t.UseBlocker="useBlocker",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t}(Pv||{}),rc=function(t){return t.UseBlocker="useBlocker",t.UseLoaderData="useLoaderData",t.UseActionData="useActionData",t.UseRouteError="useRouteError",t.UseNavigation="useNavigation",t.UseRouteLoaderData="useRouteLoaderData",t.UseMatches="useMatches",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t.UseRouteId="useRouteId",t}(rc||{});function rE(t){let e=L.useContext(Uh);return e||Nt(!1),e}function sE(t){let e=L.useContext(XS);return e||Nt(!1),e}function aE(t){let e=L.useContext(Gi);return e||Nt(!1),e}function Fv(t){let e=aE(),n=e.matches[e.matches.length-1];return n.route.id||Nt(!1),n.route.id}function oE(){var t;let e=L.useContext(Nv),n=sE(rc.UseRouteError),i=Fv(rc.UseRouteError);return e!==void 0?e:(t=n.errors)==null?void 0:t[i]}function lE(){let{router:t}=rE(Pv.UseNavigateStable),e=Fv(rc.UseNavigateStable),n=L.useRef(!1);return Rv(()=>{n.current=!0}),L.useCallback(function(r,s){s===void 0&&(s={}),n.current&&(typeof r=="number"?t.navigate(r):t.navigate(r,so({fromRouteId:e},s)))},[t,e])}const Bm={};function cE(t,e,n){!e&&!Bm[t]&&(Bm[t]=!0)}function uE(t,e){t==null||t.v7_startTransition,(t==null?void 0:t.v7_relativeSplatPath)===void 0&&(!e||e.v7_relativeSplatPath),e&&(e.v7_fetcherPersist,e.v7_normalizeFormMethod,e.v7_partialHydration,e.v7_skipActionErrorRevalidation)}function dE(t){let{to:e,replace:n,state:i,relative:r}=t;na()||Nt(!1);let{future:s,static:o}=L.useContext(Cr),{matches:l}=L.useContext(Gi),{pathname:c}=es(),u=ts(),f=Ih(e,Lh(l,s.v7_relativeSplatPath),c,r==="path"),p=JSON.stringify(f);return L.useEffect(()=>u(JSON.parse(p),{replace:n,state:i,relative:r}),[u,p,r,n,i]),null}function Lv(t){return KS(t.context)}function $e(t){Nt(!1)}function fE(t){let{basename:e="/",children:n=null,location:i,navigationType:r=cr.Pop,navigator:s,static:o=!1,future:l}=t;na()&&Nt(!1);let c=e.replace(/^\/*/,"/"),u=L.useMemo(()=>({basename:c,navigator:s,static:o,future:so({v7_relativeSplatPath:!1},l)}),[c,l,s,o]);typeof i=="string"&&(i=ta(i));let{pathname:f="/",search:p="",hash:h="",state:m=null,key:g="default"}=i,S=L.useMemo(()=>{let x=Fh(f,c);return x==null?null:{location:{pathname:x,search:p,hash:h,state:m,key:g},navigationType:r}},[c,f,p,h,m,g,r]);return S==null?null:L.createElement(Cr.Provider,{value:u},L.createElement(Dc.Provider,{children:n,value:S}))}function hE(t){let{children:e,location:n}=t;return ZS(Gd(e),n)}new Promise(()=>{});function Gd(t,e){e===void 0&&(e=[]);let n=[];return L.Children.forEach(t,(i,r)=>{if(!L.isValidElement(i))return;let s=[...e,r];if(i.type===L.Fragment){n.push.apply(n,Gd(i.props.children,s));return}i.type!==$e&&Nt(!1),!i.props.index||!i.props.children||Nt(!1);let o={id:i.props.id||s.join("-"),caseSensitive:i.props.caseSensitive,element:i.props.element,Component:i.props.Component,index:i.props.index,path:i.props.path,loader:i.props.loader,action:i.props.action,errorElement:i.props.errorElement,ErrorBoundary:i.props.ErrorBoundary,hasErrorBoundary:i.props.ErrorBoundary!=null||i.props.errorElement!=null,shouldRevalidate:i.props.shouldRevalidate,handle:i.props.handle,lazy:i.props.lazy};i.props.children&&(o.children=Gd(i.props.children,s)),n.push(o)}),n}/**
 * React Router DOM v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Hd(){return Hd=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},Hd.apply(null,arguments)}function pE(t,e){if(t==null)return{};var n={};for(var i in t)if({}.hasOwnProperty.call(t,i)){if(e.indexOf(i)!==-1)continue;n[i]=t[i]}return n}function mE(t){return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}function xE(t,e){return t.button===0&&(!e||e==="_self")&&!mE(t)}function Wd(t){return t===void 0&&(t=""),new URLSearchParams(typeof t=="string"||Array.isArray(t)||t instanceof URLSearchParams?t:Object.keys(t).reduce((e,n)=>{let i=t[n];return e.concat(Array.isArray(i)?i.map(r=>[n,r]):[[n,i]])},[]))}function gE(t,e){let n=Wd(t);return e&&e.forEach((i,r)=>{n.has(r)||e.getAll(r).forEach(s=>{n.append(r,s)})}),n}const vE=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],_E="6";try{window.__reactRouterVersion=_E}catch{}const yE="startTransition",jm=s1[yE];function SE(t){let{basename:e,children:n,future:i,window:r}=t,s=L.useRef();s.current==null&&(s.current=ES({window:r,v5Compat:!0}));let o=s.current,[l,c]=L.useState({action:o.action,location:o.location}),{v7_startTransition:u}=i||{},f=L.useCallback(p=>{u&&jm?jm(()=>c(p)):c(p)},[c,u]);return L.useLayoutEffect(()=>o.listen(f),[o,f]),L.useEffect(()=>uE(i),[i]),L.createElement(fE,{basename:e,children:n,location:l.location,navigationType:l.action,navigator:o,future:i})}const EE=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",bE=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,At=L.forwardRef(function(e,n){let{onClick:i,relative:r,reloadDocument:s,replace:o,state:l,target:c,to:u,preventScrollReset:f,viewTransition:p}=e,h=pE(e,vE),{basename:m}=L.useContext(Cr),g,S=!1;if(typeof u=="string"&&bE.test(u)&&(g=u,EE))try{let b=new URL(window.location.href),E=u.startsWith("//")?new URL(b.protocol+u):new URL(u),w=Fh(E.pathname,m);E.origin===b.origin&&w!=null?u=w+E.search+E.hash:S=!0}catch{}let x=$S(u,{relative:r}),d=ME(u,{replace:o,state:l,target:c,preventScrollReset:f,relative:r,viewTransition:p});function v(b){i&&i(b),b.defaultPrevented||d(b)}return L.createElement("a",Hd({},h,{href:g||x,onClick:S||s?i:v,ref:n,target:c}))});var zm;(function(t){t.UseScrollRestoration="useScrollRestoration",t.UseSubmit="useSubmit",t.UseSubmitFetcher="useSubmitFetcher",t.UseFetcher="useFetcher",t.useViewTransitionState="useViewTransitionState"})(zm||(zm={}));var Vm;(function(t){t.UseFetcher="useFetcher",t.UseFetchers="useFetchers",t.UseScrollRestoration="useScrollRestoration"})(Vm||(Vm={}));function ME(t,e){let{target:n,replace:i,state:r,preventScrollReset:s,relative:o,viewTransition:l}=e===void 0?{}:e,c=ts(),u=es(),f=Dv(t,{relative:o});return L.useCallback(p=>{if(xE(p,n)){p.preventDefault();let h=i!==void 0?i:ic(u)===ic(f);c(t,{replace:h,state:r,preventScrollReset:s,relative:o,viewTransition:l})}},[u,c,f,i,r,n,t,s,o,l])}function wE(t){let e=L.useRef(Wd(t)),n=L.useRef(!1),i=es(),r=L.useMemo(()=>gE(i.search,n.current?null:e.current),[i.search]),s=ts(),o=L.useCallback((l,c)=>{const u=Wd(typeof l=="function"?l(r):l);n.current=!0,s("?"+u,c)},[s,r]);return[r,o]}/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CE=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Iv=(...t)=>t.filter((e,n,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var AE={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const TE=L.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:i,className:r="",children:s,iconNode:o,...l},c)=>L.createElement("svg",{ref:c,...AE,width:e,height:e,stroke:t,strokeWidth:i?Number(n)*24/Number(e):n,className:Iv("lucide",r),...l},[...o.map(([u,f])=>L.createElement(u,f)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Re=(t,e)=>{const n=L.forwardRef(({className:i,...r},s)=>L.createElement(TE,{ref:s,iconNode:e,className:Iv(`lucide-${CE(t)}`,i),...r}));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sc=Re("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const NE=Re("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cn=Re("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gm=Re("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ao=Re("Atom",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",key:"1l2ple"}],["path",{d:"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",key:"1wam0m"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const RE=Re("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uv=Re("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kh=Re("Bookmark",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xd=Re("Box",[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kv=Re("ChartColumn",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hm=Re("ChartNoAxesColumn",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ov=Re("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bv=Re("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const DE=Re("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PE=Re("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oh=Re("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bh=Re("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jv=Re("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const FE=Re("Columns3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const LE=Re("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $d=Re("Cpu",[["rect",{width:"16",height:"16",x:"4",y:"4",rx:"2",key:"14l7u7"}],["rect",{width:"6",height:"6",x:"9",y:"9",rx:"1",key:"5aljv4"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qd=Re("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ji=Re("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jh=Re("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const IE=Re("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zv=Re("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const UE=Re("FileJson",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"1oajmo"}],["path",{d:"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"mpwhp6"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vv=Re("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kE=Re("FileUp",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wm=Re("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const OE=Re("FlaskConical",[["path",{d:"M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2",key:"pzvekw"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M7 16h10",key:"wp8him"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const BE=Re("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jE=Re("Layers3",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59",key:"1e5n1m"}],["path",{d:"m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59",key:"1iwflc"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oo=Re("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zE=Re("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gv=Re("Leaf",[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const VE=Re("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const GE=Re("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const HE=Re("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hv=Re("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const WE=Re("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zh=Re("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vh=Re("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=Re("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ia=Re("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const co=Re("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _r=Re("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const XE=Re("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gh=Re("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $E=Re("SquareCheckBig",[["path",{d:"M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5",key:"1uzm8b"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qE=Re("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wv=Re("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const YE=Re("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const KE=Re("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xv=Re("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ZE=Re("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ys=Re("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const JE=Re("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),QE=[{name:"Dashboard",path:"/app",icon:zE},{name:"Materials Search",path:"/app/materials",icon:ia},{name:"CIF Generation",path:"/app/cif-gen",icon:Vv},{name:"Property Prediction",path:"/app/predict",icon:KE},{name:"Structure Visualization",path:"/app/structures",icon:Xd},{name:"Batch Prediction",path:"/app/batch",icon:oo},{name:"DFT Validation",path:"/app/dft",icon:_r},{name:"Literature & Diversity",path:"/app/literature",icon:Uv},{name:"Saved Results",path:"/app/saved",icon:kh}],eb=[{name:"Settings",path:"/app/settings",icon:co},{name:"Help & Support",path:"/app/help",icon:jv}];function tb({mobileOpen:t,setMobileOpen:e}={}){const n=es(),[i,r]=L.useState(!1),[s,o]=L.useState(!1),l=t??i,c=e??r,u=s||l,f=p=>p==="/app"?n.pathname==="/app":n.pathname.startsWith(p);return a.jsxs(a.Fragment,{children:[a.jsx("button",{type:"button",className:"sidebar-mobile-trigger",onClick:()=>c(!0),"aria-label":"Open navigation","aria-expanded":l,children:a.jsx(zh,{size:20})}),l&&a.jsx("button",{type:"button",className:"sidebar-scrim",onClick:()=>c(!1),"aria-label":"Close navigation"}),a.jsxs("aside",{className:`sidebar-fixed flex flex-col bg-white select-none no-scrollbar ${l?"sidebar-open":""} ${s?"sidebar-expanded":""}`,onMouseEnter:()=>o(!0),onMouseLeave:()=>o(!1),"aria-label":"Primary navigation",children:[a.jsx("nav",{className:"flex-1 flex flex-col gap-1 px-3 py-3 overflow-y-auto no-scrollbar","aria-label":"Main",children:QE.map(p=>{const h=f(p.path),m=p.icon;return a.jsxs(At,{to:p.path,title:u?void 0:p.name,onClick:()=>c(!1),className:`
                  relative flex items-center h-10 rounded-xl text-xs font-medium
                  transition-all duration-150 group
                  ${u?"px-3 gap-3 w-full":"justify-center px-0 w-10 mx-auto"}
                  ${h?"bg-[--im-orange-subtle] text-[--im-orange] font-semibold":"text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt"}
                `,style:h?{"--im-orange-subtle":"var(--im-orange-subtle)"}:{},"aria-current":h?"page":void 0,children:[a.jsx("div",{className:"w-5 h-5 shrink-0 flex items-center justify-center",children:a.jsx(m,{size:17,strokeWidth:h?2.2:1.7,style:{color:h?"var(--im-orange)":void 0},className:h?"":"text-im-textMuted group-hover:text-im-textLight transition-colors"})}),a.jsx("span",{className:`truncate whitespace-nowrap transition-all duration-200 ${u?"opacity-100 max-w-[170px]":"opacity-0 max-w-0 overflow-hidden hidden"}`,children:p.name}),h&&u&&a.jsx("span",{className:"ml-auto w-1.5 h-1.5 rounded-full shrink-0",style:{backgroundColor:"var(--im-orange)"}}),h&&!u&&a.jsx("span",{className:"absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full",style:{backgroundColor:"var(--im-orange)"}})]},p.path)})}),a.jsx("nav",{className:"flex flex-col gap-1 px-3 py-2 border-t border-[#EDE8E2]/70 shrink-0 no-scrollbar","aria-label":"Utilities",children:eb.map(p=>{const h=f(p.path),m=p.icon;return a.jsxs(At,{to:p.path,title:u?void 0:p.name,onClick:()=>c(!1),className:`
                  relative flex items-center h-10 rounded-xl text-xs font-medium
                  transition-all duration-150 group
                  ${u?"px-3 gap-3 w-full":"justify-center px-0 w-10 mx-auto"}
                  ${h?"bg-[#FDF5EE] text-[#D47E30] font-semibold":"text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt"}
                `,"aria-current":h?"page":void 0,children:[a.jsx("div",{className:"w-5 h-5 shrink-0 flex items-center justify-center",children:a.jsx(m,{size:17,strokeWidth:h?2.2:1.7,className:h?"text-[#D47E30]":"text-im-textMuted group-hover:text-im-textLight transition-colors"})}),a.jsx("span",{className:`truncate whitespace-nowrap transition-all duration-200 ${u?"opacity-100 max-w-[170px]":"opacity-0 max-w-0 overflow-hidden hidden"}`,children:p.name})]},p.path)})}),a.jsx("div",{className:"pb-2"}),a.jsx("button",{type:"button",className:"sidebar-mobile-close",onClick:()=>c(!1),"aria-label":"Close navigation",children:a.jsx(Ys,{size:18})})]})]})}function nb({onToggleMobileMenu:t}){const e=ts(),[n,i]=L.useState(!1),[r,s]=L.useState(""),[o,l]=L.useState("Researcher");L.useEffect(()=>{try{const p=JSON.parse(localStorage.getItem("userProfile")||"{}");p!=null&&p.name&&l(p.name)}catch{}},[]);const c=o.charAt(0).toUpperCase(),u=p=>{p.preventDefault(),r.trim()&&e(`/app/materials?q=${encodeURIComponent(r)}`)},f=()=>{localStorage.removeItem("userProfile"),localStorage.removeItem("accessToken"),e("/signin")};return L.useEffect(()=>{if(!n)return;const p=()=>i(!1);return window.addEventListener("mousedown",p),()=>window.removeEventListener("mousedown",p)},[n]),a.jsxs("header",{className:"h-16 w-full flex items-center justify-between px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-[#EDE8E2] fixed top-0 left-0 right-0 z-50",children:[a.jsxs("div",{className:"flex items-center gap-4 sm:gap-5 min-w-0",children:[t&&a.jsx("button",{type:"button",onClick:t,className:"md:hidden p-1.5 rounded-lg text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt transition-colors shrink-0","aria-label":"Open navigation menu",children:a.jsx(zh,{size:20})}),a.jsxs(At,{to:"/app",className:"flex items-center gap-2.5 shrink-0 group select-none mr-1","aria-label":"IndianMatter Home",children:[a.jsx("img",{src:"/mi-icon-mark.png",alt:"IndianMatter",className:"w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105"}),a.jsxs("div",{className:"flex flex-col",children:[a.jsxs("span",{className:"font-headline font-bold text-[15px] sm:text-[16px] text-im-text leading-none tracking-tight",children:["Indian",a.jsx("span",{style:{color:"var(--im-orange)"},children:"Matter"})]}),a.jsx("span",{className:"text-[9px] text-im-textMuted font-normal tracking-wider uppercase mt-0.5 hidden sm:block",children:"Materials Platform"})]})]}),a.jsxs("form",{onSubmit:u,className:"relative w-56 sm:w-72 md:w-84 lg:w-96",children:[a.jsx(ia,{className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-im-textMuted pointer-events-none",size:14,"aria-hidden":"true"}),a.jsx("input",{type:"text",value:r,onChange:p=>s(p.target.value),placeholder:"Search materials, structures, tools…","aria-label":"Search materials",className:"w-full bg-im-surfaceAlt border border-im-border rounded-full py-1.5 pl-9 pr-12 text-xs text-im-text outline-none focus:border-[#D47E30] focus:bg-white transition-all placeholder:text-im-textMuted"}),a.jsx("kbd",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-im-textMuted bg-white border border-im-border px-1.5 py-0.5 rounded pointer-events-none hidden sm:inline-block",children:"⌘K"})]})]}),a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsxs("button",{"aria-label":"Notifications",className:"relative w-8 h-8 rounded-full flex items-center justify-center text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt transition-colors",children:[a.jsx(RE,{size:16}),a.jsx("span",{"aria-hidden":"true",className:"absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D47E30]"})]}),a.jsxs("div",{className:"relative",onMouseDown:p=>p.stopPropagation(),children:[a.jsxs("button",{onClick:()=>i(!n),"aria-expanded":n,"aria-haspopup":"menu",className:"flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-im-surfaceAlt transition-colors",children:[a.jsx("div",{className:"w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm",style:{backgroundColor:"var(--im-brown, #8D5A2B)"},children:c}),a.jsx("span",{className:"hidden sm:block text-xs font-medium text-im-text max-w-[100px] truncate",children:o}),a.jsx(Bv,{size:13,className:`text-im-textMuted transition-transform duration-200 ${n?"rotate-180":""}`})]}),n&&a.jsxs("div",{role:"menu",className:"absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-popover border border-im-border p-1.5 z-50 animate-slide-up",children:[a.jsxs("button",{role:"menuitem",onClick:()=>{i(!1),e("/app/settings")},className:"w-full text-left px-3 py-2 rounded-xl text-xs text-im-text hover:bg-im-surfaceAlt transition-colors flex items-center gap-2.5",children:[a.jsx(co,{size:13,className:"text-im-textMuted"}),"Profile & Settings"]}),a.jsxs("button",{role:"menuitem",onClick:()=>{i(!1),e("/app/saved")},className:"w-full text-left px-3 py-2 rounded-xl text-xs text-im-text hover:bg-im-surfaceAlt transition-colors flex items-center gap-2.5",children:[a.jsx(kh,{size:13,className:"text-im-textMuted"}),"Saved Results"]}),a.jsx("div",{className:"h-px bg-im-border my-1 mx-1"}),a.jsxs("button",{role:"menuitem",onClick:f,className:"w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5",children:[a.jsx(HE,{size:13}),"Sign Out"]})]})]})]})]})}function qi(){const[t,e]=L.useState(!1);return a.jsxs("div",{className:"min-h-screen bg-im-bg text-im-text font-sans flex flex-col",children:[a.jsx(nb,{onToggleMobileMenu:()=>e(!t)}),a.jsxs("div",{className:"flex-1 flex pt-16 relative",children:[a.jsx(tb,{mobileOpen:t,setMobileOpen:e}),a.jsx("div",{className:"main-offset flex flex-col flex-1 min-h-[calc(100vh-4rem)] min-w-0 border-l-0 md:border-l md:border-[#EDE8E2]",children:a.jsx("main",{className:"flex-1 overflow-auto no-scrollbar",children:a.jsx(Lv,{})})})]})]})}function ib(){return a.jsx("div",{className:"min-h-screen bg-im-bg text-im-text flex flex-col font-sans",children:a.jsx("main",{className:"flex-1",children:a.jsx(Lv,{})})})}const Go=[{id:"nmc",formula:"NMC",fullName:"Lithium Nickel Manganese Cobalt Oxide",structure:"Layered Oxide",image:"/assets/mineral_nmc.png",features:["High energy density","Good cycling performance","Widely researched"],detailsUrl:"/app/materials"},{id:"lfp",formula:"LFP",fullName:"Lithium Iron Phosphate",structure:"Olivine Structure",image:"/assets/mineral_lfp.png",features:["Thermal stable","Long cycle life","Cost effective & safe"],detailsUrl:"/app/materials"},{id:"licoo2",formula:"LiCoO₂",fullName:"Lithium Cobalt Oxide",structure:"Layered Oxide",image:"/assets/mineral_licoo2.png",popular:!0,features:["High energy density","Stable structure","Widely used in LIBs"],detailsUrl:"/app/materials"},{id:"lmo",formula:"LMO",fullName:"Lithium Manganese Oxide",structure:"Spinel Structure",image:"/assets/mineral_lmo.png",features:["High power capability","Cost effective","Environmentally friendly"],detailsUrl:"/app/materials"},{id:"nca",formula:"NCA",fullName:"Lithium Nickel Cobalt Aluminium Oxide",structure:"Layered Oxide",image:"/assets/mineral_nca.png",features:["High energy density","Good thermal stability","Promising for EVs"],detailsUrl:"/app/materials"}],rb=[{id:"mp",name:"Materials Project",image:"/assets/db_mp.png",tagline:"Open-access computed material properties using DFT.",scope:"Structural, electronic, magnetic properties",org:"UC Berkeley & LBNL",popular:!0,url:"https://materialsproject.org"},{id:"oqmd",name:"OQMD",image:"/assets/db_oqmd.png",tagline:"Open Quantum Materials Database for computed materials data.",scope:"Thermodynamic, stability, structural properties",org:"Caltech & Northwestern",url:"https://oqmd.org"},{id:"jarvis",name:"JARVIS",image:"/assets/db_jarvis.png",tagline:"Joint Automated Repository for Various Integrated Simulations.",scope:"DFT, ML-ready data, high-throughput APIs",org:"NIST",url:"https://jarvis.nist.gov"},{id:"aflow",name:"AFLOW",image:"/assets/db_aflow.png",tagline:"High-throughput computational materials database.",scope:"Properties, phase diagrams & dependencies",org:"Duke University",url:"https://aflowlib.org"},{id:"nomad",name:"NOMAD",image:"/assets/db_nomad.png",tagline:"The FAIR data platform for materials science.",scope:"DFT, experimental, simulation repository",org:"EuroHPC & Max Planck",url:"https://nomad-lab.eu"}],sb=[{icon:kv,title:"Predict Properties",desc:"Faster, smarter decisions from AI-driven property predictions across thousands of materials."},{icon:ia,title:"Explore Possibilities",desc:"From data to discovery — search federated databases with periodic-table precision."},{icon:Gv,title:"Enable a Sustainable Future",desc:"Accelerating next-generation materials for a cleaner, greener world."}];function ab(){const[t,e]=L.useState(!1),[n,i]=L.useState("home"),[r,s]=L.useState(2);L.useState(0);const[o,l]=L.useState({name:"",email:"",subject:"",message:""}),[c,u]=L.useState("idle"),f=(m,g)=>{m&&m.preventDefault();const S=(g||"explore").replace(/^#/,""),x=document.getElementById(S);if(x){const b=x.getBoundingClientRect().top+window.pageYOffset-72;window.scrollTo({top:Math.max(0,b),behavior:"smooth"}),window.history.pushState(null,"",`#${S}`),i(S)}};L.useEffect(()=>{const m=()=>{const g=window.location.hash;if(g){const S=g.replace(/^#/,""),x=document.getElementById(S);if(x){const d=setTimeout(()=>{const E=x.getBoundingClientRect().top+window.pageYOffset-72;window.scrollTo({top:Math.max(0,E),behavior:"smooth"}),i(S)},100);return()=>clearTimeout(d)}}};return m(),window.addEventListener("hashchange",m),()=>window.removeEventListener("hashchange",m)},[]),L.useEffect(()=>{const m=["home","explore","about","resources","contact"],g=[];return m.forEach(S=>{const x=document.getElementById(S);if(!x)return;const d=new IntersectionObserver(([v])=>{v.isIntersecting&&i(S)},{threshold:.4});d.observe(x),g.push(d)}),()=>g.forEach(S=>S.disconnect())},[]);const p=m=>{m.preventDefault(),u("loading"),setTimeout(()=>{u("success"),setTimeout(()=>{u("idle"),l({name:"",email:"",subject:"",message:""})},4e3)},1200)},h=[{href:"#home",label:"Home"},{href:"#explore",label:"Explore"},{href:"#about",label:"About"},{href:"#resources",label:"Resources"},{href:"#contact",label:"Contact"}];return a.jsxs("div",{className:"landing-page min-h-screen bg-white text-[#38240D] overflow-x-clip selection-orange",children:[a.jsx("div",{"aria-hidden":"true",className:"fixed top-[-200px] right-[-200px] w-[600px] h-[600px] pointer-events-none -z-10",style:{background:"radial-gradient(circle, rgba(253,251,212,0.5) 0%, transparent 70%)",borderRadius:"60% 40% 70% 30% / 50% 60% 40% 70%"}}),a.jsx("div",{"aria-hidden":"true",className:"fixed bottom-[-100px] left-[-150px] w-[500px] h-[500px] pointer-events-none -z-10",style:{background:"radial-gradient(circle, rgba(212,126,48,0.06) 0%, transparent 70%)",borderRadius:"40% 60% 30% 70% / 60% 40% 70% 30%"}}),a.jsxs("header",{className:"fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#EBEBEB]/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all",children:[a.jsxs("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 h-18 flex items-center justify-between gap-6",style:{height:"72px"},children:[a.jsxs(At,{to:"/",className:"flex items-center gap-2.5 shrink-0 group","aria-label":"IndianMatter Home",children:[a.jsx("img",{src:"/mi-icon-mark.png",alt:"","aria-hidden":"true",className:"w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105"}),a.jsxs("span",{className:"font-headline font-bold text-[22px] text-[#1A1A1A] tracking-tight",children:["Indian",a.jsx("span",{style:{color:"#D47E30"},children:"Matter"})]})]}),a.jsx("nav",{className:"hidden md:flex items-center gap-6 lg:gap-8","aria-label":"Main navigation",children:h.map(({href:m,label:g})=>{const S=m.slice(1),x=n===S;return a.jsx("a",{href:m,onClick:d=>f(d,S),className:`text-[14px] font-medium transition-all duration-150 px-3.5 py-1.5 rounded-full ${x?"text-[#D47E30] bg-[#FBF0E6] font-semibold":"text-[#6B6B6B] hover:text-[#D47E30] hover:bg-[#FDF5EE]/60"}`,"aria-current":x?"page":void 0,children:g},m)})}),a.jsxs("div",{className:"flex items-center gap-3 shrink-0",children:[a.jsx("button",{"aria-label":"Toggle light/dark mode",className:"w-9 h-9 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F2F0] transition-all",children:a.jsx(Wv,{size:17})}),a.jsxs(At,{to:"/signin",className:"hidden sm:inline-flex items-center gap-2 text-[14px] font-medium px-5 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#D47E30",color:"#FFFFFF",boxShadow:"0 4px 14px rgba(212,126,48,0.32)"},onMouseEnter:m=>m.currentTarget.style.backgroundColor="#B8671E",onMouseLeave:m=>m.currentTarget.style.backgroundColor="#D47E30",children:["Sign In ",a.jsx(cn,{size:14})]}),a.jsx("button",{onClick:()=>e(!t),className:"md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F2F2F0] transition-colors","aria-label":t?"Close menu":"Open menu","aria-expanded":t,children:t?a.jsx(Ys,{size:20}):a.jsx(zh,{size:20})})]})]}),t&&a.jsxs("div",{className:"md:hidden bg-white border-t border-[#EBEBEB] px-6 py-5 space-y-1",children:[h.map(({href:m,label:g})=>a.jsx("a",{href:m,onClick:S=>{e(!1),f(S,m.slice(1))},className:`flex items-center py-2.5 px-3 rounded-lg text-[15px] font-medium transition-colors ${n===m.slice(1)?"text-[#D47E30] bg-[#FBF0E6] font-semibold":"text-[#3D3D3D] hover:text-[#D47E30]"}`,children:g},m)),a.jsxs(At,{to:"/signin",onClick:()=>e(!1),className:"mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-medium text-white",style:{backgroundColor:"#D47E30"},children:["Sign In ",a.jsx(cn,{size:14})]})]})]}),a.jsx("section",{id:"home",className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-24 lg:pt-36 lg:pb-32",children:a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center",children:[a.jsxs("div",{className:"lg:col-span-7 space-y-7",children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline",children:"Materials for a Better Tomorrow"}),a.jsxs("h1",{className:"text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold text-[#1A1A1A] tracking-tight leading-[1.02]",children:["Indian",a.jsx("span",{style:{color:"#D47E30"},children:"Matter"})]}),a.jsx("h2",{className:"text-xl sm:text-2xl lg:text-3xl font-headline font-light text-[#6B6B6B] tracking-wide",children:"Predict. Explore. Accelerate."}),a.jsx("p",{className:"text-base lg:text-[17px] text-[#6B6B6B] max-w-[520px] leading-relaxed",children:"AI-driven insights for next-generation materials discovery, designed for a sustainable tomorrow."}),a.jsxs("div",{className:"flex flex-wrap items-center gap-4 pt-2",children:[a.jsxs(At,{to:"/app",className:"inline-flex items-center gap-2.5 text-white text-[15px] font-medium px-8 py-3.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#D47E30",boxShadow:"0 10px 28px rgba(212,126,48,0.32)"},onMouseEnter:m=>{m.currentTarget.style.backgroundColor="#B8671E",m.currentTarget.style.boxShadow="0 14px 36px rgba(212,126,48,0.40)"},onMouseLeave:m=>{m.currentTarget.style.backgroundColor="#D47E30",m.currentTarget.style.boxShadow="0 10px 28px rgba(212,126,48,0.32)"},children:["Start Your Research ",a.jsx(cn,{size:16})]}),a.jsxs("a",{href:"#explore",onClick:m=>f(m,"explore"),className:"inline-flex items-center gap-2 text-[#3D3D3D] text-[15px] font-medium px-7 py-3.5 rounded-full bg-white border border-[#EBEBEB] hover:border-[#D47E30] hover:text-[#D47E30] transition-all duration-120 shadow-soft",children:["Try It ",a.jsx(cn,{size:15})]})]}),a.jsxs("div",{className:"flex items-center gap-4 pt-4 text-[12px] text-[#9A9A9A]",children:[a.jsxs("span",{className:"flex items-center gap-1.5",children:[a.jsx(qd,{size:13,style:{color:"#D47E30"}}),"5 Scientific Databases"]}),a.jsx("span",{className:"w-1 h-1 rounded-full bg-[#DDDBD8]"}),a.jsxs("span",{className:"flex items-center gap-1.5",children:[a.jsx(ao,{size:13,style:{color:"#D47E30"}}),"ML Property Prediction"]}),a.jsxs("span",{className:"hidden sm:flex items-center gap-1.5",children:[a.jsx("span",{className:"w-1 h-1 rounded-full bg-[#DDDBD8]"}),"DFT Validation"]})]})]}),a.jsxs("div",{className:"lg:col-span-5 relative flex items-center justify-center min-h-[340px] lg:min-h-[440px]",children:[a.jsx("div",{"aria-hidden":"true",className:"absolute inset-0 rounded-full pointer-events-none",style:{background:"radial-gradient(circle at 55% 50%, rgba(212,126,48,0.10) 0%, rgba(253,251,212,0.25) 40%, transparent 70%)"}}),a.jsxs("svg",{"aria-hidden":"true",className:"absolute inset-0 w-full h-full pointer-events-none opacity-20",viewBox:"0 0 400 400",children:[a.jsx("circle",{cx:"200",cy:"200",r:"160",fill:"none",stroke:"#D47E30",strokeWidth:"0.5",strokeDasharray:"6 8"}),a.jsx("circle",{cx:"200",cy:"200",r:"120",fill:"none",stroke:"#8D5A2B",strokeWidth:"0.4",strokeDasharray:"4 6"}),a.jsx("circle",{cx:"200",cy:"200",r:"80",fill:"none",stroke:"#D47E30",strokeWidth:"0.3",strokeDasharray:"3 5"})]}),a.jsx("span",{className:"absolute top-[18%] right-[12%] text-[10px] font-mono text-[#8D5A2B] bg-[#FDFBD4] border border-[#EDE8E2] px-2.5 py-1 rounded-full shadow-soft pointer-events-none","aria-hidden":"true",children:"LiCoO₂"}),a.jsx("span",{className:"absolute bottom-[22%] left-[8%] text-[10px] font-mono text-[#8D5A2B] bg-[#FDFBD4] border border-[#EDE8E2] px-2.5 py-1 rounded-full shadow-soft pointer-events-none","aria-hidden":"true",children:"R -3 m"}),a.jsx("span",{className:"absolute top-[42%] left-[4%] text-[10px] font-mono text-[#9A9A9A] bg-white border border-[#EBEBEB] px-2.5 py-1 rounded-full shadow-soft pointer-events-none","aria-hidden":"true",children:"Band Gap: 2.45 eV"}),a.jsx("div",{className:"relative w-[260px] sm:w-[300px] lg:w-[340px]",children:a.jsx("img",{src:"/assets/hero_molecule_clean.png",alt:"Crystal molecular structure visualization",className:"w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(141,90,43,0.18)]",style:{filter:"drop-shadow(0 24px 40px rgba(212,126,48,0.15))"}})}),a.jsx("span",{className:"absolute bottom-[8%] right-[10%] font-handwriting text-[#825E34] text-2xl leading-tight rotate-[-6deg] pointer-events-none select-none","aria-hidden":"true",children:"Crystal Paradigm"})]})]})}),a.jsx("section",{className:"bg-white border-y border-[#EBEBEB]",children:a.jsx("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16",children:a.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16",children:sb.map(({icon:m,title:g,desc:S})=>a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsx("div",{className:"w-11 h-11 rounded-2xl flex items-center justify-center shrink-0",style:{backgroundColor:"#FBF0E6"},children:a.jsx(m,{size:20,style:{color:"#D47E30"},strokeWidth:1.8})}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-semibold text-[17px] text-[#1A1A1A] mb-2",children:g}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed",children:S})]})]},g))})})}),a.jsx("section",{id:"explore",className:"pt-8 pb-20 sm:pt-9 sm:pb-24 lg:pt-10 lg:pb-28 bg-white scroll-mt-[72px]",children:a.jsxs("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16",children:[a.jsxs("div",{className:"text-center mb-6 sm:mb-8",children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-2.5",children:"Material Library"}),a.jsx("h2",{className:"text-3xl sm:text-4xl lg:text-[42px] font-headline font-bold text-[#1A1A1A] tracking-tight mb-3",children:"Explore Materials"}),a.jsx("p",{className:"text-sm sm:text-base text-[#6B6B6B] max-w-xl mx-auto leading-relaxed",children:"Browse key battery and energy materials — each with structural, electronic, and thermodynamic properties."})]}),a.jsx("div",{className:"relative h-[440px] sm:h-[480px] flex items-center justify-center overflow-visible","aria-label":"Materials card deck",children:Go.map((m,g)=>{const S=g-r,x=Math.abs(S);if(x>2)return null;const d=S===0?1:x===1?.93:.84,v=S*200,b=S*-2.5,E=10-x*3,w=x>1?.55:1,C=S===0;return a.jsxs("article",{onClick:()=>!C&&s(g),style:{position:"absolute",transform:`translateX(${v}px) scale(${d}) rotate(${b}deg)`,zIndex:E,opacity:w,transition:"all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",cursor:C?"default":"pointer"},className:"w-[280px] sm:w-[300px]","aria-label":`${m.formula} — ${m.fullName}`,children:[C&&a.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,transform:"rotate(2deg) scale(1.02) translateY(10px)",transformOrigin:"center bottom",borderRadius:"2.5rem",background:"linear-gradient(135deg, #FDF5EE 0%, #FAF0E6 100%)",border:"1px solid #EDE8E2",zIndex:-1}}),a.jsxs("div",{className:"bg-white rounded-[2.5rem] p-6 flex flex-col gap-4",style:{boxShadow:C?"0 12px 48px rgba(0,0,0,0.10)":"0 4px 16px rgba(0,0,0,0.06)",border:"1px solid #EBEBEB"},children:[m.popular&&a.jsx("span",{className:"self-start text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full",style:{backgroundColor:"#FBF0E6",color:"#D47E30"},children:"Popular"}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-bold text-3xl text-[#1A1A1A] tracking-tight",children:m.formula}),a.jsx("p",{className:"text-[11px] text-[#9A9A9A] font-medium uppercase tracking-wider mt-0.5",children:m.structure}),a.jsx("p",{className:"text-xs text-[#6B6B6B] mt-1 leading-snug",children:m.fullName})]}),a.jsx("div",{className:"h-32 bg-[#FAFAF8] rounded-2xl flex items-center justify-center border border-[#F2F2F0] overflow-hidden",children:a.jsx("img",{src:m.image,alt:`${m.formula} crystal structure`,className:"max-h-[110px] max-w-full object-contain",style:{filter:"drop-shadow(0 4px 8px rgba(141,90,43,0.12))"}})}),a.jsx("ul",{className:"space-y-1.5",children:m.features.map(T=>a.jsxs("li",{className:"flex items-center gap-2 text-[12px] text-[#6B6B6B]",children:[a.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0",style:{backgroundColor:"#D47E30"},"aria-hidden":"true"}),T]},T))}),C&&a.jsxs(At,{to:m.detailsUrl,className:"mt-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-120",style:{backgroundColor:"#D47E30"},onMouseEnter:T=>T.currentTarget.style.backgroundColor="#B8671E",onMouseLeave:T=>T.currentTarget.style.backgroundColor="#D47E30",children:["View Material ",a.jsx(cn,{size:14})]})]})]},m.id)})}),a.jsxs("div",{className:"flex items-center justify-center gap-4 mt-8",children:[a.jsx("button",{onClick:()=>s(m=>Math.max(0,m-1)),disabled:r===0,"aria-label":"Previous material",className:"w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#D47E30] hover:text-[#D47E30] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-120",children:a.jsx(DE,{size:18})}),a.jsx("div",{className:"flex items-center gap-2",children:Go.map((m,g)=>a.jsx("button",{onClick:()=>s(g),"aria-label":`Go to material ${g+1}`,className:"w-1.5 h-1.5 rounded-full transition-all duration-200",style:{backgroundColor:r===g?"#D47E30":"#DDDBD8",width:r===g?"20px":"6px",height:"6px",borderRadius:"3px"}},g))}),a.jsx("button",{onClick:()=>s(m=>Math.min(Go.length-1,m+1)),disabled:r===Go.length-1,"aria-label":"Next material",className:"w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#D47E30] hover:text-[#D47E30] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-120",children:a.jsx(PE,{size:18})})]})]})}),a.jsx("section",{id:"about",className:"py-24 lg:py-32 bg-white border-y border-[#EBEBEB] scroll-mt-[72px]",children:a.jsx("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16",children:a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center",children:[a.jsx("div",{className:"relative flex items-center justify-center",children:a.jsxs("div",{className:"relative w-full max-w-[400px]",children:[a.jsx("div",{"aria-hidden":"true",className:"absolute inset-[-10%] pointer-events-none",style:{background:"radial-gradient(circle, rgba(253,251,212,0.6) 0%, transparent 70%)"}}),a.jsxs("svg",{viewBox:"0 0 400 400",className:"w-full h-auto","aria-label":"Crystal lattice visualization",children:[[80,160,240,320].map(m=>[80,160,240,320].map(g=>a.jsxs("g",{children:[m<320&&a.jsx("line",{x1:m,y1:g,x2:m+80,y2:g,stroke:"#D47E30",strokeWidth:"0.8",strokeOpacity:"0.25"}),g<320&&a.jsx("line",{x1:m,y1:g,x2:m,y2:g+80,stroke:"#D47E30",strokeWidth:"0.8",strokeOpacity:"0.25"}),m<320&&g<320&&a.jsxs(a.Fragment,{children:[a.jsx("line",{x1:m,y1:g,x2:m+80,y2:g+80,stroke:"#8D5A2B",strokeWidth:"0.5",strokeOpacity:"0.12"}),a.jsx("line",{x1:m+80,y1:g,x2:m,y2:g+80,stroke:"#8D5A2B",strokeWidth:"0.5",strokeOpacity:"0.12"})]})]},`${m}-${g}`))),[80,160,240,320].map(m=>[80,160,240,320].map(g=>{const S=m===200||g===200;return a.jsxs("g",{children:[a.jsx("circle",{cx:m,cy:g,r:S?8:5,fill:m===200&&g===200?"#D47E30":S?"#8D5A2B":"white",stroke:"#D47E30",strokeWidth:m===200&&g===200?0:1.2,strokeOpacity:"0.45"}),m===200&&g===200&&a.jsx("circle",{cx:200,cy:200,r:20,fill:"none",stroke:"#D47E30",strokeWidth:"1",strokeOpacity:"0.2"})]},`atom-${m}-${g}`)})),a.jsx("text",{x:"210",y:"195",fontSize:"9",fill:"#8D5A2B",fontFamily:"JetBrains Mono, monospace",opacity:"0.7",children:"Li"}),a.jsx("text",{x:"162",y:"165",fontSize:"8",fill:"#9A9A9A",fontFamily:"JetBrains Mono, monospace",opacity:"0.6",children:"Co"}),a.jsx("text",{x:"242",y:"165",fontSize:"8",fill:"#9A9A9A",fontFamily:"JetBrains Mono, monospace",opacity:"0.6",children:"O"})]}),a.jsx("div",{className:"absolute inset-0 flex items-center justify-center pointer-events-none",children:a.jsx("img",{src:"/assets/about_lattice_clean.png",alt:"Crystal lattice model",className:"w-[55%] h-auto object-contain",style:{filter:"drop-shadow(0 8px 24px rgba(141,90,43,0.16))",mixBlendMode:"multiply"}})})]})}),a.jsxs("div",{className:"space-y-8",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-3",children:"Our Approach"}),a.jsx("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight mb-4",children:"The Crystal Paradigm"}),a.jsxs("p",{className:"text-base text-[#6B6B6B] leading-relaxed",children:[a.jsx("strong",{className:"text-[#3D3D3D] font-semibold",children:"Inherent Matters."})," ","Every material's behaviour — conductivity, stability, reactivity — is encoded in its crystal structure. IndianMatter was built on this principle."]})]}),a.jsx("div",{className:"space-y-6",children:[{icon:ao,title:"Crystal-Centric Approach",desc:"We treat crystallographic data as the ground truth for all property predictions and validations."},{icon:kv,title:"Property Prediction",desc:"Surrogate ML models trained on DFT datasets enable fast, accurate property screening without expensive simulations."},{icon:Gv,title:"Sustainable Impact",desc:"Accelerating discovery of materials that enable cleaner energy, lighter batteries, and greener chemistry."}].map(({icon:m,title:g,desc:S})=>a.jsxs("div",{className:"flex gap-4",children:[a.jsx("div",{className:"w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",style:{backgroundColor:"#FBF0E6"},children:a.jsx(m,{size:18,style:{color:"#D47E30"},strokeWidth:1.8})}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-semibold text-[15px] text-[#1A1A1A] mb-1",children:g}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed",children:S})]})]},g))})]})]})})}),a.jsx("section",{id:"resources",className:"pt-8 pb-20 sm:pt-9 sm:pb-24 lg:pt-10 lg:pb-28 bg-white scroll-mt-[72px]",children:a.jsxs("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16",children:[a.jsxs("div",{className:"text-center mb-6 sm:mb-8",children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-2.5",children:"Connected Sources"}),a.jsx("h2",{className:"text-3xl sm:text-4xl lg:text-[42px] font-headline font-bold text-[#1A1A1A] tracking-tight mb-3",children:"Scientific Databases"}),a.jsx("p",{className:"text-sm sm:text-base text-[#6B6B6B] max-w-xl mx-auto leading-relaxed",children:"IndianMatter federates across the world's leading open-access computational materials databases."})]}),a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",children:rb.map(m=>a.jsxs("a",{href:m.url,target:"_blank",rel:"noopener noreferrer",className:"group bg-white rounded-3xl p-6 border border-[#EBEBEB] hover:border-[#D47E30]/40 hover:shadow-card-hover transition-all duration-200 flex flex-col gap-4",children:[a.jsxs("div",{className:"flex items-start justify-between",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-10 h-10 rounded-xl bg-[#FAFAF8] border border-[#F2F2F0] flex items-center justify-center overflow-hidden",children:a.jsx("img",{src:m.image,alt:m.name,className:"w-7 h-7 object-contain"})}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-bold text-[15px] text-[#1A1A1A]",children:m.name}),m.popular&&a.jsx("span",{className:"text-[9px] font-bold tracking-wider uppercase text-[#D47E30]",children:"Most Popular"})]})]}),a.jsx(jh,{size:14,className:"text-[#DDDBD8] group-hover:text-[#D47E30] transition-colors shrink-0 mt-1"})]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed",children:m.tagline}),a.jsxs("div",{className:"mt-auto pt-2 border-t border-[#F2F2F0]",children:[a.jsx("p",{className:"text-[11px] text-[#9A9A9A]",children:m.scope}),a.jsxs("p",{className:"text-[11px] font-medium text-[#6B6B6B] mt-0.5",children:["by ",m.org]})]})]},m.id))})]})}),a.jsx("section",{id:"contact",className:"pt-8 pb-16 sm:pt-9 sm:pb-20 lg:pt-10 lg:pb-24 bg-white border-t border-[#EBEBEB] scroll-mt-[72px]",children:a.jsx("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16",children:a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start",children:[a.jsxs("div",{className:"space-y-6 sm:space-y-7",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-2.5",children:"Get in Touch"}),a.jsx("h2",{className:"text-3xl sm:text-4xl lg:text-[42px] font-headline font-bold text-[#1A1A1A] tracking-tight mb-3",children:"Contact"}),a.jsx("p",{className:"text-sm sm:text-base text-[#6B6B6B] leading-relaxed max-w-md",children:"For research partnerships, questions about the platform, or collaboration opportunities — we'd love to hear from you."})]}),a.jsx("div",{className:"space-y-4",children:[{icon:Hv,label:"Email",value:"research@indianmatter.ai"},{icon:WE,label:"Location",value:"India"},{icon:ZE,label:"Collaboration",value:"Open to research partnerships"}].map(({icon:m,label:g,value:S})=>a.jsxs("div",{className:"flex items-center gap-3.5",children:[a.jsx("div",{className:"w-9 h-9 rounded-xl flex items-center justify-center shrink-0",style:{backgroundColor:"#FBF0E6"},children:a.jsx(m,{size:16,style:{color:"#D47E30"},strokeWidth:1.8})}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] text-[#9A9A9A] uppercase tracking-wider font-medium",children:g}),a.jsx("p",{className:"text-sm text-[#3D3D3D] font-medium mt-0.5",children:S})]})]},g))}),a.jsx("div",{className:"pt-2 pointer-events-none select-none opacity-60",children:a.jsx("img",{src:"/assets/contact_crystal.png",alt:"","aria-hidden":"true",className:"w-20 h-auto object-contain",style:{filter:"drop-shadow(0 4px 8px rgba(141,90,43,0.15))"}})})]}),a.jsx("div",{children:a.jsxs("form",{onSubmit:p,className:"bg-[#FAFAF8] rounded-3xl p-6 sm:p-7 border border-[#EBEBEB] space-y-4","aria-label":"Contact form",noValidate:!0,children:[a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3.5",children:[a.jsxs("div",{children:[a.jsxs("label",{htmlFor:"contact-name",className:"block text-[12px] font-medium text-[#3D3D3D] mb-1",children:["Name ",a.jsx("span",{className:"text-[#D47E30]",children:"*"})]}),a.jsx("input",{id:"contact-name",type:"text",required:!0,value:o.name,onChange:m=>l({...o,name:m.target.value}),placeholder:"Your full name",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"})]}),a.jsxs("div",{children:[a.jsxs("label",{htmlFor:"contact-email",className:"block text-[12px] font-medium text-[#3D3D3D] mb-1",children:["Email ",a.jsx("span",{className:"text-[#D47E30]",children:"*"})]}),a.jsx("input",{id:"contact-email",type:"email",required:!0,value:o.email,onChange:m=>l({...o,email:m.target.value}),placeholder:"you@institution.edu",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"})]})]}),a.jsxs("div",{children:[a.jsx("label",{htmlFor:"contact-subject",className:"block text-[12px] font-medium text-[#3D3D3D] mb-1",children:"Subject"}),a.jsx("input",{id:"contact-subject",type:"text",value:o.subject,onChange:m=>l({...o,subject:m.target.value}),placeholder:"Research collaboration / Query / Other",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"})]}),a.jsxs("div",{children:[a.jsxs("label",{htmlFor:"contact-message",className:"block text-[12px] font-medium text-[#3D3D3D] mb-1",children:["Message ",a.jsx("span",{className:"text-[#D47E30]",children:"*"})]}),a.jsx("textarea",{id:"contact-message",required:!0,rows:4,value:o.message,onChange:m=>l({...o,message:m.target.value}),placeholder:"Tell us about your research interest or question...",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8] resize-none"})]}),c==="success"?a.jsxs("div",{className:"flex items-center gap-2.5 py-3 px-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700",children:[a.jsx(Bh,{size:16,className:"shrink-0"}),"Thank you! We'll be in touch soon."]}):a.jsx("button",{type:"submit",disabled:c==="loading",className:"w-full flex items-center justify-center gap-2.5 py-3 rounded-full text-white text-sm font-medium transition-all duration-120 active:scale-[0.98] disabled:opacity-70",style:{backgroundColor:"#D47E30"},onMouseEnter:m=>{c!=="loading"&&(m.currentTarget.style.backgroundColor="#B8671E")},onMouseLeave:m=>m.currentTarget.style.backgroundColor="#D47E30",children:c==="loading"?a.jsxs(a.Fragment,{children:[a.jsx(VE,{size:16,className:"animate-spin"}),"Sending…"]}):a.jsxs(a.Fragment,{children:["Send Message ",a.jsx(cn,{size:15})]})})]})})]})})}),a.jsx("footer",{className:"border-t border-[#EBEBEB] bg-white",children:a.jsxs("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 flex flex-col sm:flex-row items-center justify-between gap-4",children:[a.jsxs("div",{className:"flex items-center gap-2.5",children:[a.jsx("img",{src:"/mi-icon-mark.png",alt:"","aria-hidden":"true",className:"w-6 h-6 object-contain"}),a.jsxs("span",{className:"font-headline font-bold text-[15px] text-[#1A1A1A]",children:["Indian",a.jsx("span",{style:{color:"#D47E30"},children:"Matter"})]})]}),a.jsxs("p",{className:"text-[12px] text-[#9A9A9A] text-center",children:["© ",new Date().getFullYear()," IndianMatter. Computational materials research platform."]}),a.jsxs("div",{className:"flex items-center gap-5 text-[12px] text-[#6B6B6B]",children:[a.jsx("a",{href:"#",className:"hover:text-[#D47E30] transition-colors",children:"Privacy"}),a.jsx("a",{href:"#",className:"hover:text-[#D47E30] transition-colors",children:"Terms"}),a.jsx(At,{to:"/signin",className:"hover:text-[#D47E30] transition-colors",children:"Sign In"})]})]})})]})}const ob={}.VITE_API_BASE_URL||{}.VITE_TOPATH_URL||"http://localhost:8000",qr=ob.replace(/\/+$/,"");class hu extends Error{constructor(n,i=0,r=!1){super(n);Bc(this,"status");Bc(this,"unreachable");this.name="ApiError",this.status=i,this.unreachable=r}}const lb={}.VITE_GOOGLE_CLIENT_ID||"1084224754546-placeholder.apps.googleusercontent.com";function cb(){const t=ts(),[e,n]=L.useState(!1),[i,r]=L.useState(""),[s,o]=L.useState(""),[l,c]=L.useState(!0),[u,f]=L.useState(!1),[p,h]=L.useState(""),m=async x=>{x.preventDefault(),f(!0),h("");try{const d=await fetch(`${qr}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i,password:s})});if(d.ok){const v=await d.json();localStorage.setItem("accessToken",v.access_token),localStorage.setItem("userProfile",JSON.stringify(v.user)),t("/app")}else localStorage.setItem("userProfile",JSON.stringify({name:i.split("@")[0]||"Researcher",email:i})),t("/app")}catch{localStorage.setItem("userProfile",JSON.stringify({name:i.split("@")[0]||"Researcher",email:i})),t("/app")}finally{f(!1)}},g=async x=>{f(!0),h("");try{if(x.credential){const d=await fetch(`${qr}/api/auth/google-login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:x.credential})});if(d.ok){const v=await d.json();localStorage.setItem("accessToken",v.access_token),localStorage.setItem("userProfile",JSON.stringify(v.user)),t("/app");return}}localStorage.setItem("userProfile",JSON.stringify({name:"Google Researcher",email:"researcher@google.auth"})),t("/app")}catch{localStorage.setItem("userProfile",JSON.stringify({name:"Google Researcher",email:"researcher@google.auth"})),t("/app")}finally{f(!1)}},S=()=>{localStorage.setItem("userProfile",JSON.stringify({name:"Google Researcher",email:"researcher@google.auth"})),t("/app")};return a.jsx(bv,{clientId:lb,children:a.jsxs("div",{className:"min-h-screen bg-white text-[#1E2227] flex flex-col justify-between relative overflow-x-hidden font-sans selection:bg-[#F1641D]/20 selection:text-[#F1641D]",children:[a.jsx("div",{className:"fixed top-0 left-[-120px] w-[320px] h-[750px] bg-[#F8DFCB]/40 rounded-[100%] blur-3xl pointer-events-none -z-10 transform -rotate-12"}),a.jsx("div",{className:"fixed top-[40%] right-[-140px] w-[380px] h-[850px] bg-[#F8DFCB]/50 rounded-[100%] blur-3xl pointer-events-none -z-10 transform rotate-12"}),a.jsx("div",{className:"fixed bottom-0 left-[-80px] w-[340px] h-[600px] bg-[#F8DFCB]/30 rounded-[100%] blur-3xl pointer-events-none -z-10"}),a.jsx("div",{className:"fixed bottom-0 right-0 w-44 md:w-64 opacity-80 pointer-events-none -z-10",children:a.jsx("img",{src:"/assets/signin_molecule.png",alt:"",className:"w-full h-auto object-contain"})}),a.jsxs("header",{className:"w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 h-20 flex items-center justify-between border-b border-[#F0E5D9]/50",children:[a.jsxs(At,{to:"/",className:"flex items-center gap-3",children:[a.jsx("img",{src:"/mi-icon-mark.png",alt:"IndianMatter",className:"w-8 h-8 object-contain"}),a.jsxs("span",{className:"font-headline font-bold text-xl tracking-tight text-[#1E2227]",children:["Indian",a.jsx("span",{className:"text-[#F1641D]",children:"Matter"})]})]}),a.jsxs("nav",{className:"hidden md:flex items-center gap-8 text-[14px] font-medium text-[#5F6771]",children:[a.jsx(At,{to:"/",className:"hover:text-[#F1641D] transition-colors",children:"Home"}),a.jsx(At,{to:"/#explore",className:"hover:text-[#F1641D] transition-colors",children:"Explore"}),a.jsx(At,{to:"/#about",className:"hover:text-[#F1641D] transition-colors",children:"About"}),a.jsx(At,{to:"/#resources",className:"hover:text-[#F1641D] transition-colors",children:"Resources"}),a.jsx(At,{to:"/#contact",className:"hover:text-[#F1641D] transition-colors",children:"Contact"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx("button",{"aria-label":"Theme toggle",className:"w-9 h-9 rounded-full flex items-center justify-center text-[#5F6771] hover:text-[#1E2227] hover:bg-black/5 transition-all",children:a.jsx(Wv,{size:18,strokeWidth:1.8})}),a.jsx("button",{className:"bg-[#F1641D] text-white px-6 py-2 rounded-full text-[14px] font-medium opacity-90 cursor-default",children:"Sign In"})]})]}),a.jsx("main",{className:"flex-1 flex items-center justify-center px-4 sm:px-6 py-8",children:a.jsxs("div",{className:"w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white overflow-hidden flex flex-col md:flex-row min-h-[580px]",children:[a.jsxs("div",{className:"md:w-5/12 bg-[#FAF4EE] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden",children:[a.jsxs("div",{className:"relative z-10 space-y-4",children:[a.jsx("div",{className:"w-10 h-1 bg-[#F1641D] rounded-full"}),a.jsxs("div",{children:[a.jsx("p",{className:"text-xs font-semibold text-[#8C929C] uppercase tracking-wider",children:"Welcome to"}),a.jsxs("h1",{className:"text-3xl font-headline font-bold text-[#1E2227] tracking-tight mt-1",children:["Indian",a.jsx("span",{className:"text-[#F1641D]",children:"Matter"})]}),a.jsx("p",{className:"text-xs font-medium text-[#5F6771] mt-0.5",children:"Materials for a Brighter Tomorrow"})]}),a.jsx("p",{className:"text-xs text-[#6C737E] leading-relaxed max-w-[260px]",children:"Sign in to explore, predict and accelerate materials discovery with the power of data and crystal structures."})]}),a.jsxs("div",{className:"relative mt-8 flex items-end justify-between",children:[a.jsx("div",{className:"w-48 sm:w-56 -ml-4 -mb-4",children:a.jsx("img",{src:"/assets/signin_crystal.png",alt:"Crystal Specimen",className:"w-full h-auto object-contain drop-shadow-lg select-none pointer-events-none"})}),a.jsxs("div",{className:"text-right pb-4 -mr-2",children:[a.jsxs("p",{className:"font-handwriting text-[#5B636E] text-xl leading-tight -rotate-3",children:["Science",a.jsx("br",{}),"Today",a.jsx("br",{}),"A Brighter",a.jsx("br",{}),"Tomorrow"]}),a.jsx("div",{className:"w-8 h-[2px] bg-[#F1641D] ml-auto mt-1"})]})]})]}),a.jsxs("div",{className:"md:w-7/12 bg-white p-8 sm:p-12 flex flex-col justify-center",children:[a.jsx("h2",{className:"text-3xl font-headline font-bold text-[#1E2227] tracking-tight",children:"Sign In"}),a.jsx("p",{className:"text-xs text-[#6C737E] mt-1 mb-6",children:"Welcome back! Continue your journey with IndianMatter."}),p&&a.jsxs("div",{className:"mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2",children:[a.jsx(Oh,{size:14})," ",p]}),a.jsxs("div",{className:"space-y-3 mb-6",children:[a.jsx("div",{className:"w-full flex justify-center",children:a.jsx(SS,{onSuccess:g,onError:S,theme:"outline",shape:"pill",text:"signin_with",width:"320"})}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[a.jsxs("button",{type:"button",onClick:S,className:"flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#E9DFD4] rounded-xl hover:bg-[#FAF4EE] text-xs font-semibold text-[#1E2227] transition-all active:scale-98",children:[a.jsx("img",{src:"https://www.svgrepo.com/show/475656/google-color.svg",alt:"Google",className:"w-4 h-4"}),"Quick Google Sign In"]}),a.jsxs("button",{type:"button",onClick:()=>{localStorage.setItem("userProfile",JSON.stringify({name:"GitHub Researcher"})),t("/app")},className:"flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#E9DFD4] rounded-xl hover:bg-[#FAF4EE] text-xs font-semibold text-[#1E2227] transition-all active:scale-98",children:[a.jsx("img",{src:"https://www.svgrepo.com/show/512317/github-142.svg",alt:"GitHub",className:"w-4 h-4"}),"Continue with GitHub"]})]})]}),a.jsxs("div",{className:"relative my-3 text-center",children:[a.jsx("div",{className:"absolute inset-0 flex items-center",children:a.jsx("div",{className:"w-full border-t border-[#EFE5DC]"})}),a.jsx("span",{className:"relative bg-white px-3 text-[11px] text-[#9EA4AD]",children:"or with email"})]}),a.jsxs("form",{onSubmit:m,className:"space-y-4",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-medium text-[#1E2227] mb-1.5",children:"Email"}),a.jsxs("div",{className:"relative",children:[a.jsx(Hv,{className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]",size:16}),a.jsx("input",{type:"email",required:!0,value:i,onChange:x=>r(x.target.value),placeholder:"researcher@university.edu",className:"w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors placeholder:text-[#9EA4AD]"})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-medium text-[#1E2227] mb-1.5",children:"Password"}),a.jsxs("div",{className:"relative",children:[a.jsx(GE,{className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]",size:16}),a.jsx("input",{type:e?"text":"password",required:!0,value:s,onChange:x=>o(x.target.value),placeholder:"Enter your password",className:"w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors placeholder:text-[#9EA4AD]"}),a.jsx("button",{type:"button",onClick:()=>n(!e),className:"absolute right-3 top-1/2 -translate-y-1/2 text-[#8C929C] hover:text-[#1E2227]",children:e?a.jsx(IE,{size:15}):a.jsx(zv,{size:15})})]})]}),a.jsxs("div",{className:"flex items-center justify-between text-xs pt-1",children:[a.jsxs("label",{className:"flex items-center gap-2 cursor-pointer select-none",children:[a.jsx("input",{type:"checkbox",checked:l,onChange:x=>c(x.target.checked),className:"accent-[#F1641D] rounded cursor-pointer"}),a.jsx("span",{className:"text-[#6C737E]",children:"Remember me"})]}),a.jsx("a",{href:"#forgot",className:"text-[#F1641D] font-medium hover:underline",children:"Forgot password?"})]}),a.jsxs("button",{type:"submit",disabled:u,className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft flex items-center justify-center gap-2 active:scale-98 mt-2 disabled:opacity-50",children:[u?"Authenticating...":"Sign In"," ",a.jsx(cn,{size:14})]})]}),a.jsxs("p",{className:"text-center text-xs text-[#6C737E] mt-6",children:["Don't have an account?"," ",a.jsx(At,{to:"/signin",className:"text-[#F1641D] font-semibold hover:underline",children:"Sign Up"})]})]})]})}),a.jsxs("footer",{className:"py-6 text-center",children:[a.jsx("p",{className:"text-[10px] tracking-[0.25em] font-bold text-[#9EA4AD] uppercase font-headline",children:"MATERIALS FOR A BRIGHTER TOMORROW"}),a.jsx("div",{className:"w-10 h-[2px] bg-[#F1641D] mx-auto mt-2"})]})]})})}function ma({children:t,backColor:e="linear-gradient(135deg, #FDF5EE 0%, #FAF0E6 100%)",backBorder:n="1px solid #EDE8E2",backRotation:i=1.5}){return a.jsxs("div",{className:"relative",children:[a.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,background:e,border:n,borderRadius:"2.5rem",transform:`rotate(${i}deg) scale(1.025) translateY(10px)`,transformOrigin:"center bottom",zIndex:0}}),a.jsx("div",{style:{position:"relative",zIndex:1,backgroundColor:"#FFFFFF",borderRadius:"2.5rem",border:"1px solid #EBEBEB",boxShadow:"0 8px 40px rgba(0,0,0,0.06)"},children:t})]})}function Ft({icon:t,label:e,accent:n="#D47E30"}){return a.jsxs("div",{className:"flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#1A1A1A]",style:{backgroundColor:"#FFFFFF",borderColor:"#EBEBEB"},children:[a.jsx(t,{size:14,strokeWidth:1.8,style:{color:n}}),a.jsx("span",{children:e})]})}function Xm(){const t=ts(),[e,n]=L.useState("Li3PS4"),[i,r]=L.useState("Electrolyte"),[s,o]=L.useState("formula"),[l,c]=L.useState(["GNN"]),u=f=>{c(p=>p.includes(f)?p.filter(h=>h!==f):[...p,f])};return a.jsxs("div",{className:"w-full max-w-[1100px] mx-auto space-y-6 px-6 sm:px-8 py-8",children:[a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6",children:[a.jsxs("div",{className:"space-y-1.5",children:[a.jsx("p",{className:"text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A9A9A] font-headline",children:"Welcome Back 👋"}),a.jsxs("h1",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["Let's Explore ",a.jsx("span",{style:{color:"#D47E30"},children:"Materials"})]}),a.jsx("p",{className:"text-sm text-[#6B6B6B]",children:"Powerful tools for a sustainable and innovative future."})]}),a.jsx("div",{className:"shrink-0 pointer-events-none select-none opacity-80",children:a.jsx("img",{src:"/assets/dash_mountains.png",alt:"","aria-hidden":"true",className:"w-44 sm:w-52 h-auto object-contain"})})]}),a.jsx(ma,{backColor:"linear-gradient(135deg, #FDF5EE 0%, #FAF0E6 100%)",backBorder:"1px solid #EDE8E2",backRotation:1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-5 space-y-6",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1",style:{color:"#D47E30"},children:"01 / 05 — Prediction & Validation"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["DFT",a.jsx("br",{}),"Validation"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Compare ML-predicted properties with high-accuracy DFT calculations for reliable material insights."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Ft,{icon:Xd,label:"Structure Optimization"}),a.jsx(Ft,{icon:Hm,label:"Energy Calculation"}),a.jsx(Ft,{icon:oo,label:"Electronic Properties"}),a.jsx(Ft,{icon:_r,label:"Stability Analysis"})]})]}),a.jsx("div",{className:"lg:col-span-3 flex items-center justify-center pointer-events-none select-none",children:a.jsx("div",{className:"w-48 sm:w-56",children:a.jsx("img",{src:"/assets/dash_c1_crystal.png",alt:"DFT crystal specimen",className:"w-full h-auto object-contain",style:{filter:"drop-shadow(0 12px 28px rgba(141,90,43,0.20))"}})})}),a.jsxs("div",{className:"lg:col-span-4 space-y-4",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A]",children:"Energy Comparison"}),a.jsx(Gm,{size:13,className:"text-[#9A9A9A]"})]}),a.jsxs("div",{className:"flex items-center gap-3 text-[10px] text-[#6B6B6B] mb-2",children:[a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2 h-2 rounded-full",style:{backgroundColor:"#D47E30"}}),"DFT Ground Truth"]}),a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2 h-2 rounded-full bg-blue-500"}),"ML Prediction"]})]}),a.jsxs("svg",{viewBox:"0 0 240 72",className:"w-full h-16",children:[a.jsx("line",{x1:"0",y1:"18",x2:"240",y2:"18",stroke:"#F2F2F0",strokeDasharray:"3,3"}),a.jsx("line",{x1:"0",y1:"36",x2:"240",y2:"36",stroke:"#F2F2F0",strokeDasharray:"3,3"}),a.jsx("line",{x1:"0",y1:"54",x2:"240",y2:"54",stroke:"#F2F2F0",strokeDasharray:"3,3"}),a.jsx("path",{d:"M 0 18 Q 60 44 120 54 T 240 60",fill:"none",stroke:"#D47E30",strokeWidth:"2",strokeLinecap:"round"}),[0,60,120,180,240].map((f,p)=>{const h=[18,44,54,58,60];return a.jsx("circle",{cx:f,cy:h[p],r:"3",fill:"#D47E30"},p)}),a.jsx("path",{d:"M 0 28 Q 60 48 120 56 T 240 59",fill:"none",stroke:"#3B82F6",strokeWidth:"2",strokeLinecap:"round"}),[0,60,120,180,240].map((f,p)=>{const h=[28,48,56,58,59];return a.jsx("circle",{cx:f,cy:h[p],r:"3",fill:"#3B82F6"},p)})]})]}),a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB] space-y-2",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block mb-2",children:"Key Properties"}),[["Band Gap","2.1 eV"],["Formation Energy","−1.25 eV/atom"],["Ionic Conductivity","1.2 × 10⁻⁵ S/cm"],["Space Group","P2₁/c"]].map(([f,p])=>a.jsxs("div",{className:"flex justify-between text-xs",children:[a.jsx("span",{className:"text-[#6B6B6B]",children:f}),a.jsx("span",{className:"font-medium text-[#1A1A1A] font-mono",children:p})]},f)),a.jsx("p",{className:"text-[10px] text-[#9A9A9A] pt-1 italic",children:"Demo values — use tool for real predictions"})]}),a.jsxs("div",{className:"flex justify-end items-center gap-4",children:[a.jsx("button",{onClick:()=>t("/app/dft"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"}),a.jsxs("button",{onClick:()=>t("/app/dft"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#D47E30",boxShadow:"0 6px 20px rgba(212,126,48,0.28)"},onMouseEnter:f=>f.currentTarget.style.backgroundColor="#B8671E",onMouseLeave:f=>f.currentTarget.style.backgroundColor="#D47E30",children:["Launch Tool ",a.jsx(cn,{size:14})]})]})]})]})}),a.jsx(ma,{backColor:"linear-gradient(135deg, #EEF4FE 0%, #E6EFFD 100%)",backBorder:"1px solid #D5E5FA",backRotation:-1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-4 space-y-4 lg:order-3",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB] space-y-3",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block",children:"Input / Generate"}),a.jsx("div",{className:"flex border-b border-[#EBEBEB] text-xs gap-1",children:["formula","existing"].map(f=>a.jsx("button",{onClick:()=>o(f),className:"pb-1.5 font-semibold text-xs border-b-2 mr-3 transition-all capitalize",style:{borderColor:s===f?"#2563EB":"transparent",color:s===f?"#2563EB":"#9A9A9A"},children:f==="formula"?"From Formula":"From CIF"},f))}),a.jsx("input",{type:"text",value:e,onChange:f=>n(f.target.value),placeholder:"e.g. Li3PS4","aria-label":"Chemical formula",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2563EB] transition-colors"}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-[11px] text-[#6B6B6B] mb-1",children:"Material Type"}),a.jsxs("select",{value:i,onChange:f=>r(f.target.value),"aria-label":"Material type",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#2563EB] transition-colors",children:[a.jsx("option",{children:"Electrolyte"}),a.jsx("option",{children:"Cathode"}),a.jsx("option",{children:"Anode"}),a.jsx("option",{children:"Solid-State Conductor"})]})]}),a.jsxs("button",{onClick:()=>t("/app/cif-gen"),className:"w-full bg-[#2563EB] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5",children:["Generate CIF ",a.jsx(cn,{size:13})]})]}),a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block mb-2",children:"CIF Preview"}),a.jsx("pre",{className:"text-[10px] font-mono text-[#6B6B6B] leading-relaxed overflow-x-auto",children:`data_${e}
_symmetry_space_group_name_H-M  "P2_1/c"
_cell_length_a  8.693
_cell_length_b  10.222
_cell_length_c  6.345
_cell_angle_beta  90.000
...`})]})]}),a.jsx("div",{className:"lg:col-span-3 flex items-center justify-center pointer-events-none select-none lg:order-2",children:a.jsx("div",{className:"w-48 sm:w-52",children:a.jsx("img",{src:"/assets/dash_c2_crystal.png",alt:"CIF crystal specimen",className:"w-full h-auto object-contain",style:{filter:"drop-shadow(0 12px 28px rgba(37,99,235,0.15))"}})})}),a.jsxs("div",{className:"lg:col-span-5 space-y-6 lg:order-1",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#2563EB]",children:"02 / 05 — Structure & File Generation"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["CIF",a.jsx("br",{}),"Generation"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Generate CIF files from chemical formulas or existing structures. Supports doped structures and material families."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Ft,{icon:Vv,label:"Formula to CIF",accent:"#2563EB"}),a.jsx(Ft,{icon:ao,label:"Doped Structures",accent:"#2563EB"}),a.jsx(Ft,{icon:co,label:"Structure Optimization",accent:"#2563EB"}),a.jsx(Ft,{icon:qd,label:"Multiple Formats",accent:"#2563EB"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsxs("button",{onClick:()=>t("/app/cif-gen"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#2563EB",boxShadow:"0 6px 20px rgba(37,99,235,0.25)"},onMouseEnter:f=>f.currentTarget.style.backgroundColor="#1D4ED8",onMouseLeave:f=>f.currentTarget.style.backgroundColor="#2563EB",children:["Launch Tool ",a.jsx(cn,{size:14})]}),a.jsx("button",{onClick:()=>t("/app/cif-gen"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"})]})]})]})}),a.jsx(ma,{backColor:"linear-gradient(135deg, #EEFAF4 0%, #E6F8EF 100%)",backBorder:"1px solid #C6F0D6",backRotation:1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-5 space-y-6",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#059669]",children:"03 / 05 — Property Prediction"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["Property",a.jsx("br",{}),"Prediction"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Predict key material properties using state-of-the-art graph neural network models."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Ft,{icon:sc,label:"Ionic Conductivity",accent:"#059669"}),a.jsx(Ft,{icon:Hm,label:"Band Gap",accent:"#059669"}),a.jsx(Ft,{icon:_r,label:"Formation Energy",accent:"#059669"}),a.jsx(Ft,{icon:$d,label:"Multiple Models",accent:"#059669"})]})]}),a.jsxs("div",{className:"lg:col-span-3 flex flex-col items-center justify-center pointer-events-none select-none gap-3",children:[a.jsxs("p",{className:"font-handwriting text-[#059669] text-2xl leading-tight -rotate-6 text-center",children:["Predict",a.jsx("br",{}),"Accelerate",a.jsx("br",{}),"Innovate"]}),a.jsx("div",{className:"w-44",children:a.jsx("img",{src:"/assets/hero_molecule_clean.png",alt:"Property prediction molecules",className:"w-full h-auto object-contain",style:{filter:"drop-shadow(0 8px 20px rgba(5,150,105,0.14))"}})})]}),a.jsxs("div",{className:"lg:col-span-4 space-y-4",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]",children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A]",children:"Ionic Conductivity"}),a.jsx(Gm,{size:13,className:"text-[#9A9A9A]"})]}),a.jsxs("div",{className:"flex items-center gap-3 text-[10px] text-[#6B6B6B] mb-2",children:[a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2 h-2 rounded-full",style:{backgroundColor:"#D47E30"}}),"True"]}),a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2 h-2 rounded-full bg-[#059669]"}),"Predicted"]})]}),a.jsx("svg",{viewBox:"0 0 240 72",className:"w-full h-16",children:[[30,38],[60,48],[90,36],[120,52],[150,44],[180,40],[210,46]].map(([f,p],h)=>a.jsxs("g",{children:[a.jsx("circle",{cx:f,cy:p,r:"3.5",fill:"#D47E30",opacity:"0.75"}),a.jsx("circle",{cx:f+5,cy:p+(h%2===0?-3:3),r:"3.5",fill:"#059669",opacity:"0.75"})]},h))})]}),a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB] space-y-2.5",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block",children:"Model Selection"}),["GNN (Graph Neural Network)","M3GNet","CHGNet","ALIGNN"].map(f=>{const p=f.split(" ")[0],h=l.includes(p);return a.jsxs("label",{className:"flex items-center gap-2.5 cursor-pointer py-0.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors select-none",children:[a.jsx("div",{className:"w-4 h-4 rounded border flex items-center justify-center transition-colors",onClick:()=>u(p),style:{backgroundColor:h?"#059669":"white",borderColor:h?"#059669":"#DDDBD8",color:"white"},children:h&&a.jsx(Ov,{size:10,strokeWidth:3})}),f]},f)})]}),a.jsxs("div",{className:"flex justify-end items-center gap-4",children:[a.jsx("button",{onClick:()=>t("/app/predict"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"}),a.jsxs("button",{onClick:()=>t("/app/predict"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#059669",boxShadow:"0 6px 20px rgba(5,150,105,0.25)"},onMouseEnter:f=>f.currentTarget.style.backgroundColor="#047857",onMouseLeave:f=>f.currentTarget.style.backgroundColor="#059669",children:["Launch Tool ",a.jsx(cn,{size:14})]})]})]})]})}),a.jsx(ma,{backColor:"linear-gradient(135deg, #F5F0FF 0%, #EEE6FF 100%)",backBorder:"1px solid #DDD6FE",backRotation:-1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-4 space-y-4 lg:order-3",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-5 border border-[#EBEBEB] space-y-3",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block",children:"Active Lattice: LiCoO₂"}),a.jsx("div",{className:"grid grid-cols-2 gap-2 text-xs font-mono",children:[["a","2.816 Å"],["b","2.816 Å"],["c","14.054 Å"],["Vol","96.5 Å³"]].map(([f,p])=>a.jsxs("div",{className:"bg-[#F2F2F0] rounded-xl px-3 py-2",children:[a.jsx("span",{className:"text-[#9A9A9A] text-[10px]",children:f}),a.jsx("span",{className:"block text-[#1A1A1A] font-semibold",children:p})]},f))}),a.jsx("div",{className:"pt-1 border-t border-[#EBEBEB]",children:a.jsx("span",{className:"text-[10px] text-[#9A9A9A]",children:"Space Group: R -3 m"})})]}),a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block mb-3",children:"Viewer Controls"}),a.jsx("div",{className:"flex flex-wrap gap-1.5",children:["Rotate","Zoom","Bonds","Unit Cell","Reset"].map(f=>a.jsx("span",{className:"text-[10px] px-2.5 py-1 rounded-lg border text-[#6B6B6B]",style:{borderColor:"#DDDBD8",backgroundColor:"white"},children:f},f))})]})]}),a.jsx("div",{className:"lg:col-span-3 flex items-center justify-center pointer-events-none select-none lg:order-2",children:a.jsx("div",{className:"w-52 sm:w-56",children:a.jsx("img",{src:"/assets/about_lattice.png",alt:"3D unit cell visualization",className:"w-full h-auto object-contain",style:{filter:"drop-shadow(0 12px 28px rgba(124,58,237,0.15))"}})})}),a.jsxs("div",{className:"lg:col-span-5 space-y-6 lg:order-1",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#7C3AED]",children:"04 / 05 — Structure Visualization"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["Structure",a.jsx("br",{}),"Visualization"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Real-time 3D crystallographic lattice viewer with rotate, zoom, bond, and unit-cell controls."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Ft,{icon:Xd,label:"3D WebGL Canvas",accent:"#7C3AED"}),a.jsx(Ft,{icon:ao,label:"Coordination Polyhedra",accent:"#7C3AED"}),a.jsx(Ft,{icon:co,label:"Unit Cell Vectors",accent:"#7C3AED"}),a.jsx(Ft,{icon:sc,label:"Bond Measurements",accent:"#7C3AED"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsxs("button",{onClick:()=>t("/app/structures"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#7C3AED",boxShadow:"0 6px 20px rgba(124,58,237,0.25)"},onMouseEnter:f=>f.currentTarget.style.backgroundColor="#6D28D9",onMouseLeave:f=>f.currentTarget.style.backgroundColor="#7C3AED",children:["Launch Tool ",a.jsx(cn,{size:14})]}),a.jsx("button",{onClick:()=>t("/app/structures"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"})]})]})]})}),a.jsx(ma,{backColor:"linear-gradient(135deg, #FFFBEB 0%, #FFF8E1 100%)",backBorder:"1px solid #FDE68A",backRotation:1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-5 space-y-6",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#D97706]",children:"05 / 05 — High-Throughput Screening"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["Batch",a.jsx("br",{}),"Prediction"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Upload up to 500 CIF files for parallel automated property screening, syntax verification, and consolidated CSV/ZIP export."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Ft,{icon:oo,label:"Multi-CIF Upload",accent:"#D97706"}),a.jsx(Ft,{icon:_r,label:"Syntax Pre-Flight",accent:"#D97706"}),a.jsx(Ft,{icon:$d,label:"Parallel Evaluation",accent:"#D97706"}),a.jsx(Ft,{icon:qd,label:"Bulk ZIP Export",accent:"#D97706"})]})]}),a.jsxs("div",{className:"lg:col-span-7 space-y-4",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-5 border border-[#EBEBEB] space-y-4",children:[a.jsxs("div",{className:"flex justify-between items-center text-xs",children:[a.jsx("span",{className:"font-bold text-[#1A1A1A]",children:"Batch Execution Queue"}),a.jsx("span",{className:"font-mono font-bold text-[#D97706]",children:"100% (248/248)"})]}),a.jsx("div",{className:"h-2.5 bg-[#FEF3C7] rounded-full overflow-hidden",children:a.jsx("div",{className:"h-full rounded-full",style:{width:"100%",backgroundColor:"#D97706"}})}),a.jsx("div",{className:"space-y-1.5",children:[{file:"LLZO_cubic.cif",status:"Complete",ok:!0},{file:"NMC811_doped.cif",status:"Complete",ok:!0},{file:"LFP_orthorhombic.cif",status:"Complete",ok:!0},{file:"Na3Zr2Si2PO12.cif",status:"Complete",ok:!0}].map(({file:f,status:p,ok:h})=>a.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:[a.jsx("span",{className:"font-mono text-[#6B6B6B]",children:f}),a.jsxs("span",{className:"flex items-center gap-1.5 font-medium",style:{color:h?"#059669":"#DC2626"},children:[a.jsx(OE,{size:11}),p]})]},f))}),a.jsxs("div",{className:"flex justify-between text-[11px] pt-1 border-t border-[#EBEBEB]",children:[a.jsx("span",{className:"text-[#6B6B6B]",children:"Processed: 248 structures"}),a.jsx("span",{className:"font-semibold text-[#059669]",children:"0 Errors"})]})]}),a.jsxs("div",{className:"flex justify-end items-center gap-4",children:[a.jsx("button",{onClick:()=>t("/app/batch"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"}),a.jsxs("button",{onClick:()=>t("/app/batch"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#D97706",boxShadow:"0 6px 20px rgba(217,119,6,0.25)"},onMouseEnter:f=>f.currentTarget.style.backgroundColor="#B45309",onMouseLeave:f=>f.currentTarget.style.backgroundColor="#D97706",children:["Launch Tool ",a.jsx(cn,{size:14})]})]})]})]})}),a.jsx("div",{className:"h-8"})]})}const ub=[[1,"H","Hydrogen",1,1,"nonmetal","+1, -1"],[2,"He","Helium",18,1,"noble","0"],[3,"Li","Lithium",1,2,"alkali","+1"],[4,"Be","Beryllium",2,2,"alkaline","+2"],[5,"B","Boron",13,2,"metalloid","+3"],[6,"C","Carbon",14,2,"nonmetal","-4, +2, +4"],[7,"N","Nitrogen",15,2,"nonmetal","-3, +3, +5"],[8,"O","Oxygen",16,2,"nonmetal","-2"],[9,"F","Fluorine",17,2,"halogen","-1"],[10,"Ne","Neon",18,2,"noble","0"],[11,"Na","Sodium",1,3,"alkali","+1"],[12,"Mg","Magnesium",2,3,"alkaline","+2"],[13,"Al","Aluminium",13,3,"post-transition","+3"],[14,"Si","Silicon",14,3,"metalloid","-4, +4"],[15,"P","Phosphorus",15,3,"nonmetal","-3, +3, +5"],[16,"S","Sulfur",16,3,"nonmetal","-2, +4, +6"],[17,"Cl","Chlorine",17,3,"halogen","-1, +1, +5, +7"],[18,"Ar","Argon",18,3,"noble","0"],[19,"K","Potassium",1,4,"alkali","+1"],[20,"Ca","Calcium",2,4,"alkaline","+2"],[21,"Sc","Scandium",3,4,"transition","+3"],[22,"Ti","Titanium",4,4,"transition","+2, +3, +4"],[23,"V","Vanadium",5,4,"transition","+2, +3, +4, +5"],[24,"Cr","Chromium",6,4,"transition","+2, +3, +6"],[25,"Mn","Manganese",7,4,"transition","+2, +4, +7"],[26,"Fe","Iron",8,4,"transition","+2, +3"],[27,"Co","Cobalt",9,4,"transition","+2, +3"],[28,"Ni","Nickel",10,4,"transition","+2, +3"],[29,"Cu","Copper",11,4,"transition","+1, +2"],[30,"Zn","Zinc",12,4,"transition","+2"],[31,"Ga","Gallium",13,4,"post-transition","+3"],[32,"Ge","Germanium",14,4,"metalloid","+2, +4"],[33,"As","Arsenic",15,4,"metalloid","-3, +3, +5"],[34,"Se","Selenium",16,4,"nonmetal","-2, +4, +6"],[35,"Br","Bromine",17,4,"halogen","-1, +1, +5"],[36,"Kr","Krypton",18,4,"noble","0"],[37,"Rb","Rubidium",1,5,"alkali","+1"],[38,"Sr","Strontium",2,5,"alkaline","+2"],[39,"Y","Yttrium",3,5,"transition","+3"],[40,"Zr","Zirconium",4,5,"transition","+4"],[41,"Nb","Niobium",5,5,"transition","+3, +5"],[42,"Mo","Molybdenum",6,5,"transition","+4, +6"],[43,"Tc","Technetium",7,5,"transition","+4, +7"],[44,"Ru","Ruthenium",8,5,"transition","+3, +4"],[45,"Rh","Rhodium",9,5,"transition","+3"],[46,"Pd","Palladium",10,5,"transition","+2, +4"],[47,"Ag","Silver",11,5,"transition","+1"],[48,"Cd","Cadmium",12,5,"transition","+2"],[49,"In","Indium",13,5,"post-transition","+1, +3"],[50,"Sn","Tin",14,5,"post-transition","+2, +4"],[51,"Sb","Antimony",15,5,"metalloid","-3, +3, +5"],[52,"Te","Tellurium",16,5,"metalloid","-2, +4, +6"],[53,"I","Iodine",17,5,"halogen","-1, +1, +5, +7"],[54,"Xe","Xenon",18,5,"noble","0"],[55,"Cs","Caesium",1,6,"alkali","+1"],[56,"Ba","Barium",2,6,"alkaline","+2"],[57,"La","Lanthanum",3,6,"lanthanide","+3"],[72,"Hf","Hafnium",4,6,"transition","+4"],[73,"Ta","Tantalum",5,6,"transition","+5"],[74,"W","Tungsten",6,6,"transition","+4, +6"],[75,"Re","Rhenium",7,6,"transition","+4, +6, +7"],[76,"Os","Osmium",8,6,"transition","+4, +8"],[77,"Ir","Iridium",9,6,"transition","+3, +4"],[78,"Pt","Platinum",10,6,"transition","+2, +4"],[79,"Au","Gold",11,6,"transition","+1, +3"],[80,"Hg","Mercury",12,6,"transition","+1, +2"],[81,"Tl","Thallium",13,6,"post-transition","+1, +3"],[82,"Pb","Lead",14,6,"post-transition","+2, +4"],[83,"Bi","Bismuth",15,6,"post-transition","+3, +5"],[84,"Po","Polonium",16,6,"post-transition","+2, +4"],[85,"At","Astatine",17,6,"halogen","-1, +1, +5"],[86,"Rn","Radon",18,6,"noble","0"],[87,"Fr","Francium",1,7,"alkali","+1"],[88,"Ra","Radium",2,7,"alkaline","+2"],[89,"Ac","Actinium",3,7,"actinide","+3"],[104,"Rf","Rutherfordium",4,7,"transition","+4"],[105,"Db","Dubnium",5,7,"transition","+5"],[106,"Sg","Seaborgium",6,7,"transition","+6"],[107,"Bh","Bohrium",7,7,"transition","+7"],[108,"Hs","Hassium",8,7,"transition","+8"],[109,"Mt","Meitnerium",9,7,"transition"],[110,"Ds","Darmstadtium",10,7,"transition"],[111,"Rg","Roentgenium",11,7,"transition"],[112,"Cn","Copernicium",12,7,"transition","+2"],[113,"Nh","Nihonium",13,7,"post-transition","+1, +3"],[114,"Fl","Flerovium",14,7,"post-transition","+2, +4"],[115,"Mc","Moscovium",15,7,"post-transition","+1, +3"],[116,"Lv","Livermorium",16,7,"post-transition","+2, +4"],[117,"Ts","Tennessine",17,7,"halogen","-1, +1, +3"],[118,"Og","Oganesson",18,7,"noble","0"],[58,"Ce","Cerium",4,8,"lanthanide","+3, +4"],[59,"Pr","Praseodymium",5,8,"lanthanide","+3, +4"],[60,"Nd","Neodymium",6,8,"lanthanide","+3"],[61,"Pm","Promethium",7,8,"lanthanide","+3"],[62,"Sm","Samarium",8,8,"lanthanide","+2, +3"],[63,"Eu","Europium",9,8,"lanthanide","+2, +3"],[64,"Gd","Gadolinium",10,8,"lanthanide","+3"],[65,"Tb","Terbium",11,8,"lanthanide","+3, +4"],[66,"Dy","Dysprosium",12,8,"lanthanide","+3"],[67,"Ho","Holmium",13,8,"lanthanide","+3"],[68,"Er","Erbium",14,8,"lanthanide","+3"],[69,"Tm","Thulium",15,8,"lanthanide","+2, +3"],[70,"Yb","Ytterbium",16,8,"lanthanide","+2, +3"],[71,"Lu","Lutetium",17,8,"lanthanide","+3"],[90,"Th","Thorium",4,9,"actinide","+4"],[91,"Pa","Protactinium",5,9,"actinide","+4, +5"],[92,"U","Uranium",6,9,"actinide","+3, +4, +5, +6"],[93,"Np","Neptunium",7,9,"actinide","+3, +4, +5, +6"],[94,"Pu","Plutonium",8,9,"actinide","+3, +4, +5, +6"],[95,"Am","Americium",9,9,"actinide","+3, +4, +5, +6"],[96,"Cm","Curium",10,9,"actinide","+3"],[97,"Bk","Berkelium",11,9,"actinide","+3, +4"],[98,"Cf","Californium",12,9,"actinide","+3"],[99,"Es","Einsteinium",13,9,"actinide","+3"],[100,"Fm","Fermium",14,9,"actinide","+3"],[101,"Md","Mendelevium",15,9,"actinide","+2, +3"],[102,"No","Nobelium",16,9,"actinide","+2, +3"],[103,"Lr","Lawrencium",17,9,"actinide","+3"]],$m=ub.map(([t,e,n,i,r,s,o])=>({number:t,symbol:e,name:n,group:i,period:r,category:s,oxidationStates:o})),db=[["alkali","Alkali"],["transition","Transition"],["nonmetal","Nonmetal"],["halogen","Halogen"],["noble","Noble gas"],["lanthanide","Lanthanide"],["actinide","Actinide"]];function $v({includeElements:t,excludeElements:e,onElementClick:n}){const[i,r]=L.useState(null),[s,o]=L.useState(new Set),l=L.useMemo(()=>$m.filter(p=>p.period<=7),[]),c=L.useMemo(()=>$m.filter(p=>p.period>=8),[]),u=p=>s.size===0||s.has(p.category),f=p=>{o(h=>{const m=new Set(h);return m.has(p)?m.delete(p):m.add(p),m})};return a.jsxs("div",{className:"space-y-3",children:[a.jsxs("div",{className:"flex flex-wrap items-center gap-1.5","aria-label":"Filter periodic table by category",children:[db.map(([p,h])=>{const m=s.has(p);return a.jsxs("button",{type:"button",onClick:()=>f(p),"aria-pressed":m,className:`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${m?"bg-[#FBE8D8] border-[#F1641D] text-[#F1641D]":"bg-white border-[#E9DFD4] text-[#6C737E] hover:border-[#F1641D]/50"}`,children:[a.jsx("i",{className:`periodic-legend-swatch periodic-category-${p}`}),h]},p)}),s.size>0&&a.jsx("button",{type:"button",onClick:()=>o(new Set),className:"text-[11px] text-[#F1641D] font-semibold ml-1",children:"Clear categories"})]}),a.jsx("div",{className:"overflow-x-auto pb-2",children:a.jsxs("div",{className:"periodic-table-grid",role:"grid","aria-label":"Periodic table of chemical elements",children:[l.map(p=>a.jsx(qm,{element:p,selected:t.includes(p.symbol)?"include":e.includes(p.symbol)?"exclude":"none",onClick:()=>{r(p),n(p.symbol)},dimmed:!u(p)},p.number)),a.jsx("div",{className:"periodic-table-f-label",style:{gridColumn:1,gridRow:8},children:"Lanthanides"}),a.jsx("div",{className:"periodic-table-f-label",style:{gridColumn:1,gridRow:9},children:"Actinides"}),c.map(p=>a.jsx(qm,{element:p,selected:t.includes(p.symbol)?"include":e.includes(p.symbol)?"exclude":"none",onClick:()=>{r(p),n(p.symbol)},dimmed:!u(p)},p.number))]})}),a.jsx("div",{className:"min-h-12 rounded-xl bg-[#FDFBD4] px-4 py-3 text-xs text-[#38240D]","aria-live":"polite",children:i?a.jsxs(a.Fragment,{children:[a.jsx("strong",{children:i.name})," (",i.symbol,") · Atomic number ",i.number,i.oxidationStates?` · Oxidation states ${i.oxidationStates}`:""]}):"Select an element to inspect its identity and add it to the query."})]})}function qm({element:t,selected:e,onClick:n,dimmed:i}){return a.jsxs("button",{type:"button",role:"gridcell","aria-label":`${t.name}, ${t.symbol}, atomic number ${t.number}`,title:`${t.name} · ${t.symbol} · Atomic number ${t.number}`,onClick:n,style:{gridColumn:t.group,gridRow:t.period},className:`periodic-element periodic-category-${t.category} periodic-element-${e} ${i?"periodic-element-dimmed":""}`,children:[a.jsx("span",{className:"periodic-element-number",children:t.number}),a.jsx("span",{className:"periodic-element-symbol",children:t.symbol})]})}async function fb(t){const e=new URLSearchParams;t.elements&&t.elements.length>0&&t.elements.forEach(i=>e.append("elements",i)),t.excludeElements&&t.excludeElements.length>0&&t.excludeElements.forEach(i=>e.append("exclude_elements",i)),t.matchMode&&e.append("match_mode",t.matchMode),t.formula&&e.append("formula",t.formula),t.minBandGap!==void 0&&e.append("min_band_gap",t.minBandGap.toString()),t.maxBandGap!==void 0&&e.append("max_band_gap",t.maxBandGap.toString()),t.minEHull!==void 0&&e.append("min_e_hull",t.minEHull.toString()),t.maxEHull!==void 0&&e.append("max_e_hull",t.maxEHull.toString()),t.page!==void 0&&e.append("page",t.page.toString()),t.limit!==void 0&&e.append("limit",t.limit.toString());let n;try{n=await fetch(`${qr}/api/dataset/search?${e.toString()}`)}catch{throw new Error(`Backend unavailable at ${qr}. Start the FastAPI server and try again.`)}if(!n.ok)throw new Error(`Dataset search failed with status ${n.status}`);return n.json()}function Lt(t){return t==null||Number.isNaN(t)?null:t}const Tr=[{key:"mv_id",label:"Material ID",type:"text",accessor:t=>t.mv_id??"",format:t=>t.mv_id??"N/A"},{key:"Formula",label:"Formula",type:"text",accessor:t=>t.Formula??"",format:t=>t.Formula??"N/A"},{key:"nsites",label:"Sites",type:"number",accessor:t=>Lt(t.nsites),format:t=>Lt(t.nsites)===null?"N/A":String(t.nsites),colorScale:"neutral"},{key:"e_hull",label:"E Above Hull (eV/atom)",type:"number",accessor:t=>Lt(t["E_hull-m (eV/atom)"]),format:t=>{const e=Lt(t["E_hull-m (eV/atom)"]);return e===null?"N/A":e.toFixed(3)},backendFilter:!0,colorScale:"goodLow"},{key:"formation_energy",label:"Formation Energy (eV/atom)",type:"number",accessor:t=>Lt(t["Form. Energy E_f (eV/atom)"]),format:t=>{const e=Lt(t["Form. Energy E_f (eV/atom)"]);return e===null?"N/A":e.toFixed(3)},colorScale:"goodLow"},{key:"ionic_conductivity",label:"Ionic Cond. (mS/cm)",type:"number",accessor:t=>Lt(t["Ionic Conductivity (mS/cm)"]??t.ionic_conductivity),format:t=>{const e=Lt(t["Ionic Conductivity (mS/cm)"]??t.ionic_conductivity);return e===null?"N/A":e.toExponential(2)},colorScale:"goodHigh"},{key:"activation_energy",label:"Activation Energy (eV)",type:"number",accessor:t=>Lt(t["Activation Energy Ea (eV)"]??t.activation_energy),format:t=>{const e=Lt(t["Activation Energy Ea (eV)"]??t.activation_energy);return e===null?"N/A":e.toFixed(2)},colorScale:"goodLow"},{key:"migration_barrier",label:"Migration Barrier (eV)",type:"number",accessor:t=>Lt(t["Migration Barrier (eV)"]??t.migration_barrier),format:t=>{const e=Lt(t["Migration Barrier (eV)"]??t.migration_barrier);return e===null?"N/A":e.toFixed(2)},colorScale:"goodLow"},{key:"band_gap",label:"Band Gap (eV)",type:"number",accessor:t=>Lt(t["Band Gap E_g (eV)"]),format:t=>{const e=Lt(t["Band Gap E_g (eV)"]);return e===null?"N/A":e.toFixed(2)},backendFilter:!0,colorScale:"neutral"},{key:"bulk_modulus",label:"Bulk Modulus (GPa)",type:"number",accessor:t=>Lt(t["Bulk Modulus K (GPa)"]),format:t=>{const e=Lt(t["Bulk Modulus K (GPa)"]);return e===null?"N/A":e.toFixed(1)},colorScale:"goodHigh"},{key:"shear_modulus",label:"Shear Modulus (GPa)",type:"number",accessor:t=>Lt(t["Shear Modulus G (GPa)"]),format:t=>{const e=Lt(t["Shear Modulus G (GPa)"]);return e===null?"N/A":e.toFixed(1)},colorScale:"goodHigh"},{key:"metal_prob",label:"Metal Prob.",type:"number",accessor:t=>Lt(t["Metal Prob."]),format:t=>{const e=Lt(t["Metal Prob."]);return e===null?"N/A":`${(e*100).toFixed(0)}%`},colorScale:"neutral"}];function hb(t,e,n){switch(e){case">=":return t>=n;case"<=":return t<=n;case"=":return t===n;case">":return t>n;case"<":return t<n}}function pb(t,e){const n="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-semibold text-[11px]";if(t.type!=="number"||!t.colorScale)return"";const i=t.accessor(e);return typeof i!="number"?`${n} bg-[#F1F2F4] text-[#8C929C]`:t.key==="e_hull"?i<=.01?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i<=.05?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#FDE4E1] text-[#B3261E]`:t.key==="formation_energy"?i<=-1.5?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i<=0?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#FDE4E1] text-[#B3261E]`:t.key==="ionic_conductivity"?i>=1?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i>=.1?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#F1F2F4] text-[#5F6771]`:t.key==="activation_energy"||t.key==="migration_barrier"?i<=.35?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i<=.5?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#FDE4E1] text-[#B3261E]`:t.key==="bulk_modulus"||t.key==="shear_modulus"?i>=100?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i>=40?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#F1F2F4] text-[#5F6771]`:t.key==="metal_prob"?i>=.66?`${n} bg-[#E3ECFC] text-[#1D4FA3]`:i>=.33?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#F1F2F4] text-[#5F6771]`:`${n} bg-[#FAF4EE] text-[#1E2227]`}function Ym(){const[t,e]=wE(),[n,i]=L.useState(t.get("q")??""),[r,s]=L.useState(t.getAll("elements")),[o,l]=L.useState(t.getAll("exclude_elements")),[c,u]=L.useState("include"),[f,p]=L.useState(""),[h,m]=L.useState(""),[g,S]=L.useState(""),[x,d]=L.useState(""),[v,b]=L.useState(()=>!!t.get("q")||t.getAll("elements").length>0||t.getAll("exclude_elements").length>0),[E,w]=L.useState([]),[C,T]=L.useState(0),[_,A]=L.useState(!1),[R,P]=L.useState(null),[D,U]=L.useState(new Set),[F,B]=L.useState(!1),[Z,X]=L.useState(null),[j,z]=L.useState({}),[$,Q]=L.useState({}),[ce,Me]=L.useState(null);L.useEffect(()=>{if(!v)return;const q=new AbortController;return A(!0),P(null),fb({formula:n.trim()||void 0,elements:r,excludeElements:o,minBandGap:f?Number(f):void 0,maxBandGap:h?Number(h):void 0,minEHull:g?Number(g):void 0,maxEHull:x?Number(x):void 0,page:1,limit:100}).then(le=>{q.signal.aborted||(w(le.results),T(le.total))}).catch(le=>{q.signal.aborted||P(le instanceof Error?le.message:"Unable to fetch materials.")}).finally(()=>{q.signal.aborted||A(!1)}),()=>q.abort()},[v,n,r,o,f,h,g,x]);const Ye=q=>{c==="include"?(s(le=>le.includes(q)?le.filter(we=>we!==q):[...le,q]),l(le=>le.filter(we=>we!==q))):(l(le=>le.includes(q)?le.filter(we=>we!==q):[...le,q]),s(le=>le.filter(we=>we!==q)))},He=q=>{q.preventDefault();const le=new URLSearchParams;n.trim()&&le.set("q",n.trim()),r.forEach(we=>le.append("elements",we)),o.forEach(we=>le.append("exclude_elements",we)),e(le),b(!0)},Ve=()=>{i(""),s([]),l([]),p(""),m(""),S(""),d(""),z({}),Q({}),Me(null),e(new URLSearchParams),b(!1),w([]),T(0)},J=(q,le,we)=>{const Fe=we.trim()===""?"":we.trim();q==="band_gap"?le==="<="?m(Fe):p(Fe):le==="<="?d(Fe):S(Fe),b(!0)},ie=L.useMemo(()=>{let q=E;if(Object.entries(j).forEach(([le,we])=>{if(!we.trim())return;const Fe=Tr.find(Le=>Le.key===le);if(!Fe)return;const je=we.trim().toLowerCase();q=q.filter(Le=>String(Fe.accessor(Le)??"").toLowerCase().includes(je))}),Object.entries($).forEach(([le,we])=>{const Fe=Tr.find(Le=>Le.key===le);if(!Fe||Fe.backendFilter||we.value.trim()==="")return;const je=Number(we.value);Number.isNaN(je)||(q=q.filter(Le=>{const Ue=Fe.accessor(Le);return typeof Ue=="number"&&hb(Ue,we.comparator,je)}))}),ce){const le=Tr.find(we=>we.key===ce.key);q=[...q].sort((we,Fe)=>{const je=le.accessor(we),Le=le.accessor(Fe);if(je===null||je==="")return 1;if(Le===null||Le==="")return-1;const Ue=je<Le?-1:je>Le?1:0;return ce.dir==="asc"?Ue:-Ue})}return q},[E,j,$,ce]),Se=()=>{const q=Tr.filter(it=>!D.has(it.key)),le=q.map(it=>it.label).join(","),we=ie.map(it=>q.map(Rt=>`"${String(Rt.accessor(it)??"").replace(/"/g,'""')}"`).join(",")),Fe=[le,...we].join(`
`),je=new Blob([Fe],{type:"text/csv;charset=utf-8;"}),Le=URL.createObjectURL(je),Ue=document.createElement("a");Ue.href=Le,Ue.download="materials_export.csv",Ue.click(),URL.revokeObjectURL(Le)},Be=[...r.map(q=>({element:q,mode:"include"})),...o.map(q=>({element:q,mode:"exclude"}))];return a.jsxs("div",{className:"w-full max-w-[1600px] mx-auto space-y-7 px-4 sm:px-8 py-6",children:[a.jsxs("header",{children:[a.jsx("p",{className:"text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D]",children:"Material discovery"}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Materials Explorer"}),a.jsx("p",{className:"text-sm text-[#6C737E] mt-1",children:"Search real IndianMatter records, then refine returned solid-state battery candidates."})]}),a.jsxs("section",{className:"bg-white rounded-[2rem] p-5 sm:p-7 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsxs("form",{onSubmit:He,className:"flex flex-col sm:flex-row gap-3",children:[a.jsxs("div",{className:"relative flex-1",children:[a.jsx(ia,{className:"absolute left-4 top-1/2 -translate-y-1/2 text-[#8C929C]",size:17}),a.jsx("input",{value:n,onChange:q=>i(q.target.value),placeholder:"Search formula or material ID (e.g., Li7La3Zr2O12)","aria-label":"Search materials",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-[#F1641D]"})]}),a.jsx("button",{type:"submit",className:"px-6 py-3 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F]",children:"Search Materials"}),a.jsxs("button",{type:"button",onClick:Ve,className:"px-4 py-3 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(lo,{size:13})," Reset"]})]}),a.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs",children:[a.jsx("span",{className:"font-semibold text-[#1E2227]",children:"Element mode:"}),a.jsx("button",{type:"button",onClick:()=>u("include"),className:`px-3 py-1.5 rounded-lg ${c==="include"?"bg-[#FBE8D8] text-[#F1641D]":"bg-[#FAF4EE] text-[#6C737E]"}`,children:"Include"}),a.jsx("button",{type:"button",onClick:()=>u("exclude"),className:`px-3 py-1.5 rounded-lg ${c==="exclude"?"bg-[#713600] text-white":"bg-[#FAF4EE] text-[#6C737E]"}`,children:"Exclude"}),Be.length>0&&a.jsxs("span",{className:"flex items-center gap-1.5 flex-wrap",children:[a.jsx("span",{className:"text-[#8C929C]",children:"·"}),Be.map(({element:q,mode:le})=>a.jsxs("span",{className:`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${le==="exclude"?"text-[#713600]":"text-[#F1641D]"}`,children:[le==="exclude"?"−":"+",q,a.jsx("button",{type:"button",onClick:()=>Ye(q),"aria-label":`Remove ${q}`,className:"text-[#8C929C] hover:text-[#1E2227]",children:a.jsx(Ys,{size:10})})]},`${le}-${q}`))]}),a.jsx("span",{className:"ml-auto text-[#8C929C]",children:"Database: IndianMatter dataset"})]}),a.jsx($v,{includeElements:r,excludeElements:o,onElementClick:Ye})]}),!v&&a.jsxs("div",{className:"bg-white rounded-2xl p-10 text-center border border-[#EFE5DC] text-sm text-[#6C737E]",children:[a.jsx(Wm,{className:"mx-auto mb-3 text-[#F1641D]",size:22}),"Start with a formula, material ID, or element selection."]}),v&&a.jsxs("section",{className:"bg-white rounded-2xl border border-[#EFE5DC] overflow-hidden shadow-card",children:[a.jsxs("div",{className:"flex flex-wrap items-center gap-3 p-4 border-b border-[#F2E7DC] bg-[#FAF4EE]/40",children:[a.jsxs("button",{type:"button",onClick:Ve,className:"px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] flex items-center gap-1.5",children:[a.jsx(lo,{size:13})," Reset"]}),a.jsx("span",{className:"px-3 py-2 bg-[#1E2227] text-white rounded-xl text-xs font-semibold",children:_?"Searching…":`${ie.length} of ${C} materials`}),a.jsxs("div",{className:"relative ml-auto",children:[a.jsxs("button",{type:"button",onClick:()=>B(q=>!q),className:"px-3 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(FE,{size:14})," Columns"]}),F&&a.jsx("div",{className:"absolute right-0 mt-1 w-60 bg-white border border-[#E9DFD4] rounded-xl shadow-card p-3 z-30 space-y-1",children:Tr.map(q=>a.jsxs("label",{className:"flex items-center gap-2 text-xs text-[#1E2227] py-1 cursor-pointer",children:[a.jsx("input",{type:"checkbox",checked:!D.has(q.key),onChange:()=>U(le=>{const we=new Set(le);return we.has(q.key)?we.delete(q.key):we.add(q.key),we})}),q.label]},q.key))})]}),a.jsxs("button",{type:"button",onClick:Se,className:"px-3 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(ji,{size:14})," Export Table"]})]}),R&&a.jsx("div",{role:"alert",className:"p-5 text-sm text-red-700",children:R}),!_&&!R&&!ie.length&&a.jsx("div",{className:"p-8 text-center text-sm text-[#6C737E]",children:"No materials found. Try removing an element, widening a range, or clearing a column filter."}),_&&a.jsx("div",{className:"p-8 text-center text-sm text-[#6C737E]",children:"Searching materials..."}),!_&&!R&&ie.length>0&&a.jsx("div",{className:"overflow-x-auto relative",children:a.jsxs("table",{className:"w-full text-xs border-separate border-spacing-0",children:[a.jsx("thead",{children:a.jsx("tr",{className:"bg-[#1E2227]",children:Tr.filter(q=>!D.has(q.key)).map((q,le,we)=>{var Fe,je;return a.jsxs("th",{className:"relative px-3.5 py-3 text-left font-semibold text-[#E9DFD4] whitespace-nowrap border-b border-[#333842]",children:[a.jsxs("div",{className:"flex items-center justify-between gap-2",children:[a.jsxs("button",{type:"button",onClick:()=>Me(Le=>({key:q.key,dir:(Le==null?void 0:Le.key)===q.key&&Le.dir==="asc"?"desc":"asc"})),className:"hover:text-white transition-colors",children:[q.label,(ce==null?void 0:ce.key)===q.key?ce.dir==="asc"?" ▲":" ▼":""]}),a.jsx("button",{type:"button",onClick:()=>X(Le=>Le===q.key?null:q.key),"aria-label":`Filter ${q.label}`,className:`${q.type==="text"&&j[q.key]||q.type==="number"&&((Fe=$[q.key])!=null&&Fe.value)?"text-[#F1641D]":"text-[#8C929C]"} hover:text-white transition-colors`,children:a.jsx(Wm,{size:12})})]}),Z===q.key&&a.jsx("div",{className:`absolute top-full mt-1.5 w-60 bg-white border border-[#E9DFD4] rounded-xl shadow-2xl p-3.5 z-50 text-left font-normal normal-case text-[#1E2227] ${le>we.length-3?"right-0":"left-0"}`,children:q.type==="text"?a.jsxs(a.Fragment,{children:[a.jsx("p",{className:"text-[10px] text-[#8C929C] mb-1 font-semibold uppercase tracking-wider",children:"Contains Text"}),a.jsx("input",{value:j[q.key]??"",onChange:Le=>z(Ue=>({...Ue,[q.key]:Le.target.value})),placeholder:"Filter...",className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#F1641D]"})]}):a.jsxs(a.Fragment,{children:[a.jsx("p",{className:"text-[10px] text-[#8C929C] mb-1 font-semibold uppercase tracking-wider",children:q.backendFilter?"Filter Range (Backend Query)":"Numeric Comparator"}),a.jsxs("select",{defaultValue:">=",id:`comp-${q.key}`,className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2 py-1.5 text-xs outline-none mb-2",children:[a.jsx("option",{value:">=",children:"Greater than or equal (≥)"}),a.jsx("option",{value:"<=",children:"Less than or equal (≤)"}),!q.backendFilter&&a.jsxs(a.Fragment,{children:[a.jsx("option",{value:"=",children:"Equal to (=)"}),a.jsx("option",{value:">",children:"Strictly greater (>)"}),a.jsx("option",{value:"<",children:"Strictly less (<)"})]})]}),a.jsx("input",{id:`val-${q.key}`,type:"number",step:"any",placeholder:"Threshold value...",defaultValue:q.backendFilter?void 0:((je=$[q.key])==null?void 0:je.value)??"",className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#F1641D] mb-2.5"}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx("button",{type:"button",onClick:()=>{const Le=document.getElementById(`comp-${q.key}`).value,Ue=document.getElementById(`val-${q.key}`).value;q.backendFilter&&(q.key==="e_hull"||q.key==="band_gap")?J(q.key,Le,Ue):Q(it=>({...it,[q.key]:{comparator:Le,value:Ue}})),X(null)},className:"flex-1 py-1.5 bg-[#F1641D] text-white rounded-lg text-xs font-semibold hover:bg-[#D9520F]",children:"Apply"}),a.jsx("button",{type:"button",onClick:()=>{Q(Le=>{const Ue={...Le};return delete Ue[q.key],Ue}),X(null)},className:"px-2.5 py-1.5 border border-[#E9DFD4] rounded-lg text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE]",children:"Clear"})]})]})})]},q.key)})})}),a.jsx("tbody",{children:ie.map((q,le)=>a.jsx("tr",{className:`${le%2===0?"bg-white":"bg-[#FDF9F4]"} border-b border-[#F2E7DC] hover:bg-[#FBE8D8]/40 transition-colors`,children:Tr.filter(we=>!D.has(we.key)).map(we=>a.jsx("td",{className:"px-3.5 py-2.5 whitespace-nowrap",children:we.colorScale?a.jsx("span",{className:`${pb(we,q)} font-mono`,children:we.format(q)}):a.jsx("span",{className:"text-[#1E2227] font-mono",children:we.format(q)})},we.key))},q.mv_id??le))})]})})]})]})}function Km(){const[t,e]=L.useState("structure");return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs(At,{to:"/app/materials",className:"inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C929C] hover:text-[#F1641D] transition-colors mb-3",children:[a.jsx(NE,{size:14})," Back to Materials Search"]}),a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold text-[#F1641D] uppercase tracking-wider font-headline",children:[a.jsx("span",{children:"Materials Project • mp-22526"}),a.jsx("span",{children:"• Trigonal (R -3 m)"})]}),a.jsx("h1",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1E2227] tracking-tight mt-1",children:"LiCoO₂"}),a.jsx("p",{className:"text-sm text-[#5F6771]",children:"Lithium Cobalt Oxide — Layered Cathode Material"})]}),a.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[a.jsxs(At,{to:"/app/dft",className:"px-4 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5 shadow-sm",children:[a.jsx(_r,{size:14,className:"text-[#F1641D]"})," Validate with DFT"]}),a.jsxs(At,{to:"/app/predict",className:"px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-medium hover:bg-[#D9520F] flex items-center gap-1.5 shadow-sm",children:[a.jsx(sc,{size:14})," Predict Properties"]})]})]})]}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsxs("div",{className:"lg:col-span-7 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] flex flex-col justify-between min-h-[460px]",children:[a.jsxs("div",{className:"flex items-center justify-between border-b border-[#F2E7DC] pb-3 mb-4",children:[a.jsx("span",{className:"text-xs font-bold text-[#1E2227] uppercase tracking-wider",children:"3D Unit Cell Representation"}),a.jsx("span",{className:"px-2.5 py-0.5 bg-[#FAF4EE] text-[#5F6771] text-[11px] font-mono rounded-lg border border-[#EFE5DC]",children:"R -3 m (No. 166)"})]}),a.jsx("div",{className:"flex-1 flex items-center justify-center relative my-4",children:a.jsx("img",{src:"/assets/about_lattice.png",alt:"LiCoO2 Unit Cell",className:"max-h-72 max-w-full object-contain drop-shadow-2xl"})}),a.jsxs("div",{className:"flex justify-between items-center text-xs text-[#8C929C] pt-3 border-t border-[#F2E7DC]",children:[a.jsx("span",{children:"Atoms: 12 (3 Li, 3 Co, 6 O)"}),a.jsx(At,{to:"/app/structures",className:"text-[#F1641D] font-semibold hover:underline",children:"Open in Advanced 3D Studio →"})]})]}),a.jsxs("div",{className:"lg:col-span-5 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Intrinsic Properties"}),a.jsxs("div",{className:"space-y-2.5 text-xs font-mono",children:[a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Band Gap (DFT)"}),a.jsx("span",{className:"font-bold text-[#1E2227]",children:"2.45 eV (Direct)"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Formation Energy"}),a.jsx("span",{className:"font-bold text-[#2E7D32]",children:"-2.180 eV/atom"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Energy Above Hull"}),a.jsx("span",{className:"font-bold text-[#2E7D32]",children:"0.000 eV (On Hull)"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Ionic Conductivity (300K)"}),a.jsx("span",{className:"font-bold text-[#F1641D]",children:"1.24 × 10⁻³ S/cm"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Crystal Density"}),a.jsx("span",{className:"font-bold text-[#1E2227]",children:"5.06 g/cm³"})]})]}),a.jsx("div",{className:"pt-2",children:a.jsxs("button",{onClick:()=>alert("CIF structure downloaded."),className:"w-full py-2.5 bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl text-xs font-semibold text-[#1E2227] hover:bg-[#EFE5DC] transition-colors flex items-center justify-center gap-1.5",children:[a.jsx(ji,{size:14})," Download Validated CIF"]})})]})]}),a.jsxs("div",{className:"bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-card border border-[#EFE5DC] space-y-6",children:[a.jsx("div",{className:"flex flex-wrap gap-2 border-b border-[#F2E7DC] pb-3",children:[{id:"structure",label:"Crystallographic Lattice"},{id:"electronic",label:"Electronic Band Structure"},{id:"thermo",label:"Thermodynamic Hull"},{id:"literature",label:"Research Citations"}].map(n=>a.jsx("button",{onClick:()=>e(n.id),className:`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${t===n.id?"bg-[#F1641D] text-white shadow-sm":"bg-[#FAF4EE] text-[#5F6771] hover:text-[#1E2227]"}`,children:n.label},n.id))}),t==="structure"&&a.jsxs("div",{className:"space-y-4",children:[a.jsx("h4",{className:"font-headline font-bold text-base text-[#1E2227]",children:"Lattice Vectors (Conventional)"}),a.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono",children:[a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#8C929C] block text-[10px]",children:"a"}),a.jsx("span",{className:"font-bold",children:"2.816 Å"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#8C929C] block text-[10px]",children:"b"}),a.jsx("span",{className:"font-bold",children:"2.816 Å"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#8C929C] block text-[10px]",children:"c"}),a.jsx("span",{className:"font-bold",children:"14.054 Å"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#8C929C] block text-[10px]",children:"Volume"}),a.jsx("span",{className:"font-bold",children:"96.5 Å³"})]})]})]}),t==="electronic"&&a.jsxs("div",{className:"bg-[#FAF4EE] p-8 rounded-2xl border border-[#EFE5DC] text-center space-y-2",children:[a.jsx("p",{className:"font-headline font-bold text-base text-[#1E2227]",children:"Electronic Density of States (DOS)"}),a.jsx("p",{className:"text-xs text-[#6C737E]",children:"Valence band dominated by Co 3d and O 2p hybridization. Direct electronic band gap = 2.45 eV."})]}),t==="thermo"&&a.jsxs("div",{className:"bg-[#FAF4EE] p-8 rounded-2xl border border-[#EFE5DC] text-center space-y-2",children:[a.jsx("p",{className:"font-headline font-bold text-base text-[#1E2227]",children:"Li-Co-O Convex Hull"}),a.jsx("p",{className:"text-xs text-[#2E7D32] font-semibold",children:"Material lies directly on the thermodynamic convex hull (Ehull = 0.000 eV). Zero decomposition enthalpy into binary constituents."})]}),t==="literature"&&a.jsx("div",{className:"space-y-3",children:[{title:"Electrochemical characterization of LiCoO2 cathodes",journal:"J. Power Sources",year:"2023",doi:"10.1016/j.jpowsour.2023"},{title:"First-principles study of Li-ion diffusion in layered oxides",journal:"Phys. Rev. B",year:"2022",doi:"10.1103/PhysRevB.105"}].map((n,i)=>a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-xl border border-[#EFE5DC] flex justify-between items-center text-xs",children:[a.jsxs("div",{children:[a.jsx("p",{className:"font-bold text-[#1E2227]",children:n.title}),a.jsxs("p",{className:"text-[11px] text-[#6C737E] mt-0.5",children:[n.journal," (",n.year,")"]})]}),a.jsxs("span",{className:"text-[#F1641D] font-mono flex items-center gap-1",children:["DOI ",a.jsx(jh,{size:12})]})]},i))})]})]})}function Zm(){const[t,e]=L.useState([]),[n,i]=L.useState([]),[r,s]=L.useState("include"),[o,l]=L.useState("All"),[c,u]=L.useState("Cathode"),[f,p]=L.useState("1.0"),[h,m]=L.useState("3.5"),g=x=>{if(r==="both"){t.includes(x)?(e(t.filter(d=>d!==x)),i([...n,x])):n.includes(x)?i(n.filter(d=>d!==x)):e([...t,x]);return}r==="include"?t.includes(x)?e(t.filter(d=>d!==x)):(i(n.filter(d=>d!==x)),e([...t,x])):n.includes(x)?i(n.filter(d=>d!==x)):(e(t.filter(d=>d!==x)),i([...n,x]))},S=(x,d)=>{d==="include"?e(t.filter(v=>v!==x)):i(n.filter(v=>v!==x))};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(XE,{size:14})," Multi-Criteria Search Engine"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Advanced Periodic Search"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Filter crystallographic databases by stoichiometric composition, IUPAC element constraints, space group symmetries, and property thresholds."})]}),a.jsxs("div",{className:"bg-white rounded-2xl p-4 shadow-sm border border-[#EFE5DC] flex flex-wrap items-center justify-between gap-3",children:[a.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs",children:[a.jsx("span",{className:"font-semibold text-[#1E2227]",children:"Active Filter Constraints:"}),t.map(x=>a.jsxs("span",{className:"px-2.5 py-1 bg-[#FBE8D8] text-[#F1641D] rounded-lg font-bold flex items-center gap-1 text-xs",children:["+",x,a.jsx(Ys,{size:12,className:"cursor-pointer hover:opacity-75",onClick:()=>S(x,"include")})]},x)),n.map(x=>a.jsxs("span",{className:"px-2.5 py-1 bg-[#ECEFF1] text-[#374151] rounded-lg font-bold flex items-center gap-1 text-xs",children:["-",x,a.jsx(Ys,{size:12,className:"cursor-pointer hover:opacity-75",onClick:()=>S(x,"exclude")})]},x)),t.length===0&&n.length===0&&a.jsx("span",{className:"text-xs text-[#8C929C] italic",children:"No elements selected"})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("span",{className:"text-xs text-[#8C929C]",children:"Mode:"}),a.jsx("button",{onClick:()=>s("include"),className:`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${r==="include"?"bg-[#F1641D] text-white shadow-sm":"bg-[#FAF4EE] text-[#5F6771]"}`,children:"+ Include Element"}),a.jsx("button",{onClick:()=>s("both"),className:`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${r==="both"?"bg-[#5B636E] text-white shadow-sm":"bg-[#FAF4EE] text-[#5F6771]"}`,children:"Both"}),a.jsx("button",{onClick:()=>s("exclude"),className:`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${r==="exclude"?"bg-[#374151] text-white shadow-sm":"bg-[#FAF4EE] text-[#5F6771]"}`,children:"− Exclude Element"})]})]}),a.jsxs("div",{className:"bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4",children:[a.jsxs("div",{className:"flex justify-between items-center text-xs text-[#8C929C]",children:[a.jsx("span",{children:"Click any element to add to active query filter"}),a.jsxs("span",{className:"flex items-center gap-3",children:[a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2.5 h-2.5 bg-[#F1641D] rounded-full"})," ","Included"]}),a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2.5 h-2.5 bg-[#374151] rounded-full"})," ","Excluded"]})]})]}),a.jsx($v,{includeElements:t,excludeElements:n,onElementClick:g})]}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[a.jsxs("div",{className:"bg-white rounded-2xl p-6 shadow-card border border-[#EFE5DC] space-y-3",children:[a.jsx("label",{className:"block text-xs font-bold text-[#1E2227]",children:"Crystal System"}),a.jsxs("select",{value:o,onChange:x=>l(x.target.value),className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none",children:[a.jsx("option",{value:"All",children:"All Crystal Systems"}),a.jsx("option",{value:"Cubic",children:"Cubic"}),a.jsx("option",{value:"Tetragonal",children:"Tetragonal"}),a.jsx("option",{value:"Orthorhombic",children:"Orthorhombic"}),a.jsx("option",{value:"Trigonal",children:"Trigonal / Rhombohedral"}),a.jsx("option",{value:"Hexagonal",children:"Hexagonal"}),a.jsx("option",{value:"Monoclinic",children:"Monoclinic"})]})]}),a.jsxs("div",{className:"bg-white rounded-2xl p-6 shadow-card border border-[#EFE5DC] space-y-3",children:[a.jsx("label",{className:"block text-xs font-bold text-[#1E2227]",children:"Material Application"}),a.jsxs("select",{value:c,onChange:x=>u(x.target.value),className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none",children:[a.jsx("option",{value:"Cathode",children:"Cathode Material"}),a.jsx("option",{value:"Anode",children:"Anode Material"}),a.jsx("option",{value:"Electrolyte",children:"Solid Electrolyte"}),a.jsx("option",{value:"Oxide",children:"Oxide"}),a.jsx("option",{value:"Sulfide",children:"Sulfide"}),a.jsx("option",{value:"Phosphate",children:"Phosphate"})]})]}),a.jsxs("div",{className:"bg-white rounded-2xl p-6 shadow-card border border-[#EFE5DC] space-y-3",children:[a.jsx("label",{className:"block text-xs font-bold text-[#1E2227]",children:"Band Gap Range (eV)"}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx("input",{type:"number",value:f,onChange:x=>p(x.target.value),placeholder:"Min",className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs outline-none"}),a.jsx("input",{type:"number",value:h,onChange:x=>m(x.target.value),placeholder:"Max",className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs outline-none"})]})]})]}),a.jsxs("div",{className:"flex justify-end gap-3 pt-2",children:[a.jsxs("button",{onClick:()=>{e([]),i([])},className:"px-5 py-2.5 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(lo,{size:13})," Reset Constraints"]}),a.jsxs(At,{to:`/materials-search?${t.map(x=>`elements=${encodeURIComponent(x)}`).join("&")}${n.length&&t.length?"&":""}${n.map(x=>`exclude_elements=${encodeURIComponent(x)}`).join("&")}`,className:"px-6 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] flex items-center gap-2 shadow-soft",children:["Query Databases ",a.jsx(ia,{size:14})]})]})]})}function Jm(){const[t,e]=L.useState("LiCoO2"),[n,i]=L.useState("PBE"),[r,s]=L.useState(520),[o,l]=L.useState("4x4x4"),[c,u]=L.useState("idle"),[f,p]=L.useState(0),h=m=>{m.preventDefault(),u("running"),p(15);const g=setInterval(()=>{p(S=>S>=95?(clearInterval(g),u("completed"),100):S+25)},600)};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(_r,{size:14})," Ab Initio Benchmarking"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"DFT Validation Engine"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Benchmark machine learning predicted formation energy and forces against high-accuracy Density Functional Theory calculations."})]}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsxs("div",{className:"lg:col-span-5 space-y-6",children:[a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Calculation Parameters"}),a.jsxs("form",{onSubmit:h,className:"space-y-4",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Chemical Formula or MP-ID"}),a.jsx("input",{type:"text",value:t,onChange:m=>e(m.target.value),placeholder:"e.g. LiCoO2, mp-22526",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-4 py-2.5 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors",required:!0})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Exchange Functional"}),a.jsxs("select",{value:n,onChange:m=>i(m.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]",children:[a.jsx("option",{value:"PBE",children:"PBE (Generalized Gradient)"}),a.jsx("option",{value:"PBEsol",children:"PBEsol (Solids)"}),a.jsx("option",{value:"SCAN",children:"SCAN (Meta-GGA)"}),a.jsx("option",{value:"HSE06",children:"HSE06 (Hybrid)"})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Plane-Wave Cutoff (eV)"}),a.jsx("input",{type:"number",value:r,onChange:m=>s(Number(m.target.value)),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"k-point Mesh Density"}),a.jsxs("select",{value:o,onChange:m=>l(m.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]",children:[a.jsx("option",{value:"4x4x4",children:"4 × 4 × 4 (Gamma-centered)"}),a.jsx("option",{value:"6x6x6",children:"6 × 6 × 6 (Dense standard)"}),a.jsx("option",{value:"8x8x8",children:"8 × 8 × 8 (Convergence test)"})]})]}),a.jsx("div",{className:"pt-2",children:a.jsxs("button",{type:"submit",disabled:c==="running",className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft flex items-center justify-center gap-2 disabled:opacity-50",children:[c==="running"?"Computing SCF Iterations...":"Dispatch DFT Calculation"," ",a.jsx(Vh,{size:14})]})})]})]}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] text-xs text-[#5B636E] space-y-2",children:[a.jsx("h4",{className:"font-bold text-[#1E2227]",children:"Precision Guidelines"}),a.jsx("p",{children:"Ground-truth DFT simulations run using Quantum ESPRESSO / VASP backend clusters. Calculations benchmark total energy, Fermi levels, and band edges."})]})]}),a.jsxs("div",{className:"lg:col-span-7 space-y-6",children:[c==="idle"&&a.jsxs("div",{className:"bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] space-y-4 flex flex-col items-center justify-center min-h-[420px]",children:[a.jsx("div",{className:"w-16 h-16 rounded-full bg-[#FBE8D8] text-[#F1641D] flex items-center justify-center",children:a.jsx(_r,{size:32})}),a.jsx("h3",{className:"text-xl font-headline font-bold text-[#1E2227]",children:"Awaiting Calculation Dispatch"}),a.jsx("p",{className:"text-xs text-[#6C737E] max-w-sm",children:"Configure your structural inputs and functional parameters on the left, then dispatch the job to benchmark against ML ground truth."})]}),c==="running"&&a.jsxs("div",{className:"bg-white rounded-[2rem] p-10 shadow-card border border-[#EFE5DC] space-y-6 min-h-[420px] flex flex-col justify-center",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Self-Consistent Field (SCF) Iteration"}),a.jsxs("p",{className:"text-xs text-[#8C929C]",children:["Calculating Kohn-Sham eigenvalues for ",t]})]}),a.jsxs("span",{className:"text-xs font-mono font-bold text-[#F1641D]",children:[f,"%"]})]}),a.jsx("div",{className:"w-full h-3 bg-[#FAF4EE] rounded-full overflow-hidden border border-[#EFE5DC]",children:a.jsx("div",{className:"h-full bg-[#F1641D] rounded-full transition-all duration-300",style:{width:`${f}%`}})}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-xl p-4 font-mono text-[11px] text-[#5B636E] space-y-1",children:[a.jsxs("p",{children:["▶ Initializing plane-wave basis set (cutoff = ",r," eV)..."]}),a.jsxs("p",{children:["▶ Generating k-point grid (",o,")..."]}),a.jsx("p",{children:"▶ Iteration 14: dE = 1.48e-05 eV, charge density residual = 8.12e-06"}),a.jsxs("p",{className:"text-[#F1641D]",children:["▶ Converging exchange-correlation potential (",n,")..."]})]})]}),c==="completed"&&a.jsxs("div",{className:"bg-white rounded-[2rem] p-8 shadow-card border border-[#EFE5DC] space-y-6",children:[a.jsxs("div",{className:"flex items-center justify-between border-b border-[#F2E7DC] pb-4",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx(Bh,{size:24,className:"text-[#2E7D32]"}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-bold text-xl text-[#1E2227]",children:"DFT Converged Successfully"}),a.jsx("p",{className:"text-xs text-[#8C929C]",children:"Ground truth reached in 28 electronic steps"})]})]}),a.jsx("span",{className:"px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold rounded-full",children:"10⁻⁶ eV Tolerated"})]}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:[a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-2xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[10px] text-[#8C929C] uppercase font-bold",children:"GNN Prediction"}),a.jsx("p",{className:"text-2xl font-bold font-headline text-[#F1641D] mt-1",children:"-4.842 eV"}),a.jsx("p",{className:"text-[11px] text-[#6C737E]",children:"Formation Energy"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-2xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[10px] text-[#8C929C] uppercase font-bold",children:"DFT Ground Truth"}),a.jsx("p",{className:"text-2xl font-bold font-headline text-[#1E2227] mt-1",children:"-4.860 eV"}),a.jsxs("p",{className:"text-[11px] text-[#6C737E]",children:[n," Functional"]})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-2xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[10px] text-[#8C929C] uppercase font-bold",children:"Absolute Error (Δ)"}),a.jsx("p",{className:"text-2xl font-bold font-headline text-[#2E7D32] mt-1",children:"0.018 eV"}),a.jsx("p",{className:"text-[11px] text-[#2E7D32]",children:"Within chemical accuracy"})]})]}),a.jsxs("div",{className:"space-y-3 pt-2",children:[a.jsx("h4",{className:"text-xs font-bold text-[#1E2227]",children:"Electronic Descriptors Delta"}),a.jsxs("div",{className:"space-y-2 text-xs",children:[a.jsxs("div",{className:"flex justify-between text-[#5B636E]",children:[a.jsx("span",{children:"Band Gap (GNN: 2.45 eV vs DFT: 2.48 eV)"}),a.jsx("span",{className:"font-mono text-[#2E7D32]",children:"Δ 0.03 eV"})]}),a.jsx("div",{className:"w-full h-2 bg-[#FAF4EE] rounded-full overflow-hidden",children:a.jsx("div",{className:"h-full bg-[#F1641D] rounded-full",style:{width:"94%"}})})]})]}),a.jsxs("div",{className:"pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F2E7DC]",children:[a.jsxs("button",{onClick:()=>u("idle"),className:"px-4 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(lo,{size:13})," Reset"]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsxs("button",{onClick:()=>alert("CONTCAR and calculation log exported to workspace."),className:"px-4 py-2 bg-[#FAF4EE] text-[#1E2227] rounded-xl text-xs font-medium hover:bg-[#EFE5DC] flex items-center gap-1.5",children:[a.jsx(ji,{size:13})," Export CONTCAR"]}),a.jsxs("button",{onClick:()=>alert("DFT benchmark saved to active research collection."),className:"px-5 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-medium hover:bg-[#D9520F] flex items-center gap-1.5",children:["Save Benchmark ",a.jsx(cn,{size:13})]})]})]})]})]})]})]})}function Qm(){const t=ts(),[e,n]=L.useState("Na3Zr2Si2PO12"),[i,r]=L.useState("NASICON"),[s,o]=L.useState("Sc"),[l,c]=L.useState("0.1"),[u,f]=L.useState(!0),[p,h]=L.useState(!1),m=`data_Na3Zr2Si2PO12_NASICON
_audit_creation_method 'IndianMatter Algorithmic Synthesis'
_cell_length_a 8.8043
_cell_length_b 8.8043
_cell_length_c 22.7585
_cell_angle_alpha 90.0000
_cell_angle_beta 90.0000
_cell_angle_gamma 120.0000
_symmetry_space_group_name_H-M 'R -3 c'
_symmetry_Int_Tables_number 167

loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
_atom_site_occupancy
Na1 Na 0.00000 0.00000 0.00000 1.0000
Na2 Na 0.63810 0.00000 0.25000 0.6667
Zr1 Zr 0.00000 0.00000 0.14720 0.9000
Sc1 Sc 0.00000 0.00000 0.14720 0.1000
Si1 Si 0.29410 0.00000 0.25000 0.6667
P1  P  0.29410 0.00000 0.25000 0.3333
O1  O  0.18340 0.16890 0.08640 1.0000
O2  O  0.18820 0.01630 0.19320 1.0000`,g=()=>{navigator.clipboard.writeText(m),h(!0),setTimeout(()=>h(!1),2e3)},S=()=>{const x=new Blob([m],{type:"text/plain;charset=utf-8"}),d=URL.createObjectURL(x),v=document.createElement("a");v.href=d,v.download=`${e}_${i}.cif`,v.click(),URL.revokeObjectURL(d)};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(UE,{size:14})," Structure Synthesis Engine"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"CIF Generation & Doping"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Synthesize crystallographic structures from stoichiometric compositions or reference prototype families with automated Wyckoff site population."})]}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsx("div",{className:"lg:col-span-5 space-y-6",children:a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Stoichiometric Synthesis"}),a.jsxs("form",{onSubmit:x=>{x.preventDefault(),f(!0)},className:"space-y-4",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Target Chemical Formula"}),a.jsx("input",{type:"text",value:e,onChange:x=>n(x.target.value),placeholder:"e.g. Na3Zr2Si2PO12, Li7La3Zr2O12",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-4 py-2.5 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors font-mono",required:!0})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Reference Prototype Family"}),a.jsxs("select",{value:i,onChange:x=>r(x.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]",children:[a.jsx("option",{value:"NASICON",children:"NASICON (Superionic Conductor)"}),a.jsx("option",{value:"Garnet",children:"Garnet (e.g. LLZO)"}),a.jsx("option",{value:"Perovskite",children:"Perovskite (ABX3)"}),a.jsx("option",{value:"Spinel",children:"Spinel (Fd-3m)"}),a.jsx("option",{value:"Layered",children:"Layered Oxide (R-3m)"})]})]}),a.jsxs("div",{className:"pt-2 border-t border-[#F2E7DC]",children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("span",{className:"text-xs font-bold text-[#1E2227]",children:"Site Substitution (Doping)"}),a.jsx("span",{className:"text-[10px] text-[#F1641D] font-semibold",children:"Optional"})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-[11px] text-[#6C737E] mb-1",children:"Dopant Element"}),a.jsx("input",{type:"text",value:s,onChange:x=>o(x.target.value),placeholder:"e.g. Sc, Y, Al",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-[11px] text-[#6C737E] mb-1",children:"Fraction (x)"}),a.jsx("input",{type:"number",step:"0.05",value:l,onChange:x=>c(x.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"})]})]})]}),a.jsx("div",{className:"pt-3",children:a.jsxs("button",{type:"submit",className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft flex items-center justify-center gap-2 active:scale-98",children:["Synthesize Crystallographic Unit Cell ",a.jsx(Gh,{size:14})]})})]})]})}),a.jsx("div",{className:"lg:col-span-7 space-y-6",children:u&&a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsxs("div",{className:"flex items-center justify-between border-b border-[#F2E7DC] pb-4",children:[a.jsxs("div",{children:[a.jsxs("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:["Generated CIF: ",e]}),a.jsx("p",{className:"text-xs text-[#8C929C]",children:"Space Group: R -3 c (No. 167) • Trigonal"})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsxs("button",{onClick:g,className:"p-2 border border-[#E9DFD4] rounded-xl text-xs text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[p?a.jsx(Ov,{size:13,className:"text-[#2E7D32]"}):a.jsx(LE,{size:13}),p?"Copied":"Copy CIF"]}),a.jsxs("button",{onClick:S,className:"px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-medium hover:bg-[#D9520F] flex items-center gap-1.5 shadow-sm",children:[a.jsx(ji,{size:13})," Download .cif"]})]})]}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6",children:[a.jsx("div",{className:"w-40 h-40 flex items-center justify-center shrink-0",children:a.jsx("img",{src:"/assets/about_lattice.png",alt:"Lattice Preview",className:"max-h-full max-w-full object-contain drop-shadow-md"})}),a.jsxs("div",{className:"space-y-2 text-xs text-[#5F6771] flex-1",children:[a.jsx("h4",{className:"font-bold text-[#1E2227] font-headline text-sm",children:"Lattice Vectors & Volume"}),a.jsxs("div",{className:"grid grid-cols-3 gap-2 font-mono text-[11px]",children:[a.jsx("div",{children:"a: 8.804 Å"}),a.jsx("div",{children:"b: 8.804 Å"}),a.jsx("div",{children:"c: 22.758 Å"}),a.jsx("div",{children:"α: 90.0°"}),a.jsx("div",{children:"β: 90.0°"}),a.jsx("div",{children:"γ: 120.0°"})]}),a.jsx("p",{className:"text-[11px] text-[#8C929C] pt-1",children:"Volume: 1528.2 Å³ • Cell Formula Units (Z): 6"})]})]}),a.jsxs("div",{children:[a.jsxs("div",{className:"flex justify-between items-center text-xs font-semibold text-[#1E2227] mb-2",children:[a.jsx("span",{children:"Crystallographic Block Viewer"}),a.jsx("span",{className:"text-[#8C929C] text-[11px] font-mono",children:"CIF v1.1 Standard"})]}),a.jsx("pre",{className:"bg-[#FAF4EE] border border-[#EFE5DC] rounded-xl p-4 text-[11px] font-mono text-[#1E2227] overflow-x-auto max-h-60 leading-relaxed",children:m})]}),a.jsxs("div",{className:"pt-2 flex justify-end gap-3",children:[a.jsxs("button",{onClick:()=>t("/app/structures"),className:"px-4 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(zv,{size:14})," Open in 3D Viewer"]}),a.jsxs("button",{onClick:()=>t("/app/predict"),className:"px-5 py-2 bg-[#1E2227] text-white rounded-xl text-xs font-medium hover:bg-black flex items-center gap-1.5",children:["Predict Properties for Structure ",a.jsx(cn,{size:14})]})]})]})})]})]})}async function ns(t,e){const n=localStorage.getItem("accessToken"),i=new Headers(e==null?void 0:e.headers);n&&i.set("Authorization",`Bearer ${n}`);let r;try{r=await fetch(`${qr}${t}`,{...e,headers:i})}catch{throw new hu(`Backend unavailable at ${qr}. Start the FastAPI server and try again.`,0,!0)}const s=await r.text();let o=null;try{o=s?JSON.parse(s):null}catch{throw new hu(`Backend returned a non-JSON response (HTTP ${r.status}).`,r.status)}if(!r.ok){const l=o&&typeof o=="object"&&"detail"in o?String(o.detail):`Request failed with HTTP ${r.status}.`;throw new hu(l,r.status)}return o}async function mb(t,e=["bulk_modulus","shear_modulus","thermal"],n=298.15){const i=new FormData;return i.append("file",t),i.append("properties",e.join(",")),i.append("temperature",String(n)),ns("/api/calculations/predict-properties",{method:"POST",body:i})}async function xb(t,e=[]){const n=new FormData;return n.append("file",t),e.forEach(i=>n.append("structure_files",i)),ns("/api/materials-prediction/datasets/upload",{method:"POST",body:n})}function gb(){return ns("/api/materials-prediction/properties")}function vb(){return ns("/api/materials-prediction/models/capabilities")}function _b(t){return ns("/api/materials-prediction/predictions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function yb(t){return ns(`/api/materials-prediction/predictions/${encodeURIComponent(t)}`)}function Sb(t){return ns(`/api/materials-prediction/predictions/${encodeURIComponent(t)}/results`)}function ex(t,e="zip"){return`${qr}/api/materials-prediction/predictions/${encodeURIComponent(t)}/download/${e}`}function tx(){const[t,e]=L.useState(null),[n,i]=L.useState([]),[r,s]=L.useState({}),[o,l]=L.useState([]),[c,u]=L.useState(""),[f,p]=L.useState([]),[h,m]=L.useState(null),[g,S]=L.useState("idle"),[x,d]=L.useState(0),[v,b]=L.useState([]),[E,w]=L.useState(!0),[C,T]=L.useState(!1),[_,A]=L.useState(null);L.useEffect(()=>{Promise.all([vb(),gb()]).then(([D,U])=>{const F=Object.fromEntries(Object.entries(D.models).filter(([,B])=>B.available));s(F),u(Object.keys(F)[0]??""),l(U.filter(B=>!B.unsupported)),p(U.filter(B=>!B.unsupported).slice(0,1).map(B=>B.key))}).catch(D=>A(D instanceof Error?D.message:"Could not load prediction capabilities.")).finally(()=>w(!1))},[]),L.useEffect(()=>{if(!h||!C)return;const D=window.setInterval(async()=>{try{const U=await yb(h);S(U.status),d(U.progress_percent??0),["completed","failed","canceled"].includes(U.status)&&(window.clearInterval(D),T(!1),U.status==="completed"&&b((await Sb(h)).results))}catch(U){window.clearInterval(D),T(!1),A(U instanceof Error?U.message:"Could not read prediction job status.")}},1e3);return()=>window.clearInterval(D)},[h,C]);const R=D=>p(U=>U.includes(D)?U.filter(F=>F!==D):[...U,D]),P=async D=>{if(D.preventDefault(),!t)return A("Upload a CSV dataset before starting a batch job.");if(!c||f.length===0)return A("Select an available model and at least one supported property.");A(null),b([]),T(!0),S("uploading"),d(0);try{const U=await xb(t,n),F=await _b({dataset_id:U.dataset_id,selected_models:[c],selected_properties:f});m(F.job_id),S(F.status),d(F.progress_percent??0)}catch(U){T(!1),S("failed"),A(U instanceof Error?U.message:"Batch prediction failed.")}};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(JE,{size:14})," Backend batch pipeline"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Batch Property Prediction"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Upload a supported CSV dataset and optional CIF structures, then monitor the real prediction job."})]}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsxs("form",{onSubmit:P,className:"lg:col-span-4 bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsx("h2",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Dataset and configuration"}),a.jsxs("label",{className:"block text-xs font-semibold text-[#1E2227]",children:["CSV dataset",a.jsxs("span",{className:"mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-[#E9DFD4] bg-[#FAF4EE]/50 px-3 py-3 text-[#6C737E] cursor-pointer",children:[a.jsx(Xv,{size:15,className:"text-[#F1641D]"}),a.jsx("span",{className:"truncate",children:(t==null?void 0:t.name)??"Choose a .csv file"}),a.jsx("input",{type:"file",accept:".csv",className:"sr-only",onChange:D=>{var U;return e(((U=D.target.files)==null?void 0:U[0])??null)}})]})]}),a.jsxs("label",{className:"block text-xs font-semibold text-[#1E2227]",children:["Optional CIF structures",a.jsx("input",{type:"file",accept:".cif",multiple:!0,className:"mt-1.5 block w-full text-xs text-[#6C737E]",onChange:D=>i(Array.from(D.target.files??[]))})]}),a.jsxs("label",{className:"block text-xs font-semibold text-[#1E2227]",children:["Available model",a.jsxs("select",{value:c,onChange:D=>u(D.target.value),disabled:E,className:"mt-1.5 w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs",children:[a.jsx("option",{value:"",children:E?"Loading capabilities...":"No available models"}),Object.entries(r).map(([D,U])=>a.jsxs("option",{value:D,children:[U.name," (",U.device??"device unavailable",")"]},D))]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"block text-xs font-semibold text-[#1E2227] mb-2",children:"Supported properties"}),a.jsx("div",{className:"space-y-2",children:o.map(D=>a.jsxs("label",{className:"flex items-center gap-2 text-xs text-[#5F6771]",children:[a.jsx("input",{type:"checkbox",checked:f.includes(D.key),onChange:()=>R(D.key)}),D.name," (",D.unit||"unit unavailable",")"]},D.key))}),!E&&o.length===0&&a.jsx("p",{className:"text-xs text-[#8C929C]",children:"No supported properties returned by the backend."})]}),a.jsxs("button",{type:"submit",disabled:C||E,className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] disabled:opacity-50 flex items-center justify-center gap-2",children:[a.jsx(Vh,{size:14}),C?"Running batch job...":"Run backend batch prediction"]}),_&&a.jsxs("div",{role:"alert",className:"flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700",children:[a.jsx(Oh,{size:15,className:"shrink-0"}),_]})]}),a.jsxs("section",{className:"lg:col-span-8 bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5","aria-label":"Batch prediction results",children:[a.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E7DC] pb-4",children:[a.jsxs("div",{children:[a.jsx("h2",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Execution status"}),a.jsx("p",{className:"text-xs text-[#8C929C]",children:g==="idle"?"Awaiting a real backend job.":g})]}),h&&!C&&a.jsxs("div",{className:"flex gap-2",children:[a.jsxs("a",{href:ex(h,"csv"),className:"px-3 py-1.5 bg-[#FAF4EE] rounded-xl text-xs flex items-center gap-1.5",children:[a.jsx(ji,{size:13})," CSV"]}),a.jsxs("a",{href:ex(h,"zip"),className:"px-3 py-1.5 bg-[#F1641D] text-white rounded-xl text-xs flex items-center gap-1.5",children:[a.jsx(ji,{size:13})," ZIP"]})]})]}),C&&a.jsxs("div",{className:"space-y-2",children:[a.jsxs("div",{className:"flex justify-between text-xs",children:[a.jsx("span",{children:"Backend progress"}),a.jsxs("span",{children:[x,"%"]})]}),a.jsx("div",{className:"h-3 bg-[#FAF4EE] rounded-full overflow-hidden",children:a.jsx("div",{className:"h-full bg-[#F1641D] transition-all",style:{width:`${x}%`}})})]}),!v.length&&!C&&a.jsx("div",{className:"py-16 text-center text-sm text-[#6C737E]",children:"Results will appear here after a completed backend job."}),!!v.length&&a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-left text-xs",children:[a.jsx("thead",{children:a.jsx("tr",{className:"border-b border-[#F2E7DC] text-[#8C929C]",children:Object.keys(v[0]).map(D=>a.jsx("th",{className:"py-2 px-3",children:D},D))})}),a.jsx("tbody",{children:v.map((D,U)=>a.jsx("tr",{className:"border-b border-[#FAF4EE]",children:a.jsx(a.Fragment,{children:Object.entries(D).map(([F,B])=>a.jsx("td",{className:"py-3 px-3 font-mono",children:String(B??"Not available")},F))})},U))})]})})]})]})]})}const Si=t=>(e,n)=>typeof e=="number"?`${e.toFixed(t)} ${n}`:"N/A",Eb=t=>(e,n)=>typeof e=="number"?`${e.toExponential(t)} ${n}`:"N/A",qv=[{key:"bulk_modulus",title:"Bulk Modulus (K_VRH)",category:"Mechanical",unit:"GPa",requiresModel:"gnn",format:Si(3)},{key:"shear_modulus",title:"Shear Modulus (G_VRH)",category:"Mechanical",unit:"GPa",requiresModel:"gnn",format:Si(3)},{key:"youngs_modulus",title:"Young's Modulus",category:"Mechanical",unit:"GPa",requiresModel:"gnn",format:Si(3)},{key:"poisson_ratio",title:"Poisson's Ratio",category:"Mechanical",unit:"",requiresModel:"gnn",format:t=>typeof t=="number"?t.toFixed(4):"N/A"},{key:"compressibility",title:"Compressibility",category:"Mechanical",unit:"GPa⁻¹",requiresModel:"gnn",format:Eb(3)},{key:"elastic_anisotropy",title:"Elastic Anisotropy",category:"Mechanical",unit:"",requiresModel:"gnn",format:t=>typeof t=="number"?t.toFixed(4):"N/A"},{key:"thermal",title:"EOS Bulk Modulus (B0)",category:"Thermal",unit:"GPa",requiresModel:"gnn",format:Si(2)},{key:"debye_temperature",title:"Debye Temperature",category:"Thermal",unit:"K",requiresModel:"gnn",format:Si(1)},{key:"thermal_conductivity",title:"Thermal Conductivity",category:"Thermal",unit:"W/m·K",requiresModel:"gnn",format:Si(3)},{key:"band_gap",title:"Electronic Band Gap",category:"Electronic",unit:"eV",requiresModel:"gnn",format:Si(3)},{key:"electronic_state",title:"Electronic State",category:"Electronic",unit:"",requiresModel:"gnn",format:t=>typeof t=="string"?t:"N/A"},{key:"ionic_conductivity",title:"Ionic Conductivity",category:"Ionic Transport",unit:"mS/cm",requiresModel:"base",format:Si(3)},{key:"ionic_conductivity_activation_energy",title:"Activation Energy (Ea)",category:"Ionic Transport",unit:"eV",requiresModel:"base",format:Si(3)}],bb=Object.fromEntries(qv.map(t=>[t.key,t])),Mb=["Mechanical","Thermal","Electronic","Ionic Transport"],wb={gnn:"GNN",base:"Ionic Surrogate"},nx="https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js";let Ho=null;function Cb(){return window.$3Dmol?Promise.resolve(window.$3Dmol):Ho||(Ho=new Promise((t,e)=>{const n=document.querySelector(`script[src="${nx}"]`);if(n){n.addEventListener("load",()=>t(window.$3Dmol)),n.addEventListener("error",()=>e(new Error("Failed to load 3Dmol.js")));return}const i=document.createElement("script");i.src=nx,i.async=!0,i.onload=()=>t(window.$3Dmol),i.onerror=()=>e(new Error("Failed to load 3Dmol.js")),document.body.appendChild(i)}),Ho)}function Ab(t){const[e,n]=L.useState(null);return L.useEffect(()=>{if(!t){n(null);return}let i=!1;return t.text().then(r=>{i||n(r)}).catch(()=>{i||n(null)}),()=>{i=!0}},[t]),e}function Tb({cifText:t}){const e=L.useRef(null),n=L.useRef(null),[i,r]=L.useState("idle");return L.useEffect(()=>{if(!t||!e.current){r("idle");return}let s=!1;return r("loading"),Cb().then(o=>{if(s||!e.current)return;e.current.innerHTML="";const l=o.createViewer(e.current,{backgroundColor:"white"});n.current=l,l.addModel(t,"cif"),l.setStyle({},{sphere:{scale:.28},stick:{radius:.1}});try{l.addUnitCell()}catch{}l.zoomTo(),l.render(),s||r("ready")}).catch(()=>{s||r("error")}),()=>{if(s=!0,n.current){try{n.current.clear()}catch{}n.current=null}}},[t]),t?a.jsxs("div",{className:"w-full h-full relative",children:[a.jsx("div",{ref:e,className:"w-full h-full"}),i==="loading"&&a.jsx("div",{className:"absolute inset-0 flex items-center justify-center text-xs text-[#6C737E] bg-white/70",children:"Loading structure viewer…"}),i==="error"&&a.jsx("div",{className:"absolute inset-0 flex items-center justify-center text-xs text-red-600 bg-white/90 px-4 text-center",children:"Couldn't load the 3D structure viewer. Check your network connection and try again."})]}):a.jsxs("div",{className:"text-center space-y-2 p-4",children:[a.jsx(oo,{className:"mx-auto text-[#F1641D]",size:32}),a.jsx("p",{className:"text-xs font-medium text-[#1E2227]",children:"Upload a CIF file to preview the 3D crystal structure."})]})}function ix(){const[t,e]=L.useState(null),[n,i]=L.useState(["bulk_modulus","shear_modulus","thermal"]),[r,s]=L.useState(null),[o,l]=L.useState(!1),[c,u]=L.useState(null),f=Ab(t),p=m=>{i(g=>g.includes(m)?g.filter(S=>S!==m):[...g,m])},h=async m=>{if(m.preventDefault(),!t){u("Upload a CIF file before running a prediction.");return}if(n.length===0){u("Select at least one property to compute.");return}l(!0),u(null),s(null);try{const g=await mb(t,n);s(g)}catch(g){u(g instanceof Error?g.message:"Prediction failed. Ensure backend service is running.")}finally{l(!1)}};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsx(Nb,{}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsx("div",{className:"lg:col-span-5",children:a.jsxs("form",{onSubmit:h,className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6",children:[a.jsx("h2",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Prediction Inputs"}),a.jsx(Rb,{file:t,onChange:e}),a.jsx(Db,{selectedKeys:n,onToggle:p}),a.jsxs("button",{type:"submit",disabled:o,className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors",children:[o?"Running Model Inference & Property Calculators...":"Run Property Prediction",a.jsx(Vh,{size:14})]}),c&&a.jsxs("div",{role:"alert",className:"flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700",children:[a.jsx(Oh,{size:15,className:"shrink-0"}),c]})]})}),a.jsx("div",{className:"lg:col-span-7",children:a.jsx(Pb,{result:r,loading:o,cifText:f})})]})]})}function Nb(){return a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(sc,{size:14})," Unified Material Property Inference"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Property Prediction Engine"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Submit a CIF structure to calculate desired target properties using optimized model pipelines."})]})}function Rb({file:t,onChange:e}){return a.jsxs("label",{className:"block text-xs font-semibold text-[#1E2227]",children:["CIF Structure File",a.jsxs("span",{className:"mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-[#E9DFD4] bg-[#FAF4EE]/50 px-3 py-3 text-[#6C737E] cursor-pointer hover:border-[#F1641D] transition-colors",children:[a.jsx(Xv,{size:15,className:"text-[#F1641D]"}),a.jsx("span",{className:"truncate",children:(t==null?void 0:t.name)??"Choose a .cif file"}),a.jsx("input",{type:"file",accept:".cif,.CIF",className:"sr-only",onChange:n=>{var i;return e(((i=n.target.files)==null?void 0:i[0])??null)}})]})]})}function Db({selectedKeys:t,onToggle:e}){return a.jsxs("div",{className:"space-y-3",children:[a.jsx("span",{className:"block text-xs font-semibold text-[#1E2227]",children:"Target Properties"}),a.jsx("div",{className:"max-h-80 overflow-y-auto pr-1 space-y-4",children:Mb.map(n=>{const i=qv.filter(r=>r.category===n);return a.jsxs("div",{className:"space-y-1.5",children:[a.jsx("span",{className:"block text-[10px] font-bold uppercase tracking-wider text-[#8C929C]",children:n}),a.jsx("div",{className:"space-y-1.5",children:i.map(r=>{const s=t.includes(r.key);return a.jsxs("div",{onClick:()=>e(r.key),className:`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${s?"border-[#F1641D] bg-[#FAF4EE] text-[#1E2227]":"border-[#E9DFD4] text-[#6C737E] hover:border-[#F1641D]"}`,children:[a.jsxs("div",{className:"flex items-center gap-2 truncate",children:[s?a.jsx($E,{size:16,className:"text-[#F1641D] shrink-0"}):a.jsx(qE,{size:16,className:"text-gray-400 shrink-0"}),a.jsx("span",{className:"font-medium truncate",children:r.title})]}),a.jsxs("div",{className:"flex items-center gap-1.5 shrink-0",children:[a.jsx("span",{className:"text-[9px] uppercase tracking-wider text-[#8C929C] bg-white/70 px-1.5 py-0.5 rounded border border-[#EFE5DC]",children:wb[r.requiresModel]}),a.jsx("span",{className:"text-[10px] uppercase tracking-wider text-[#8C929C] bg-white/70 px-2 py-0.5 rounded border border-[#EFE5DC]",children:r.unit||"—"})]})]},r.key)})})]},n)})})]})}function Pb({result:t,loading:e,cifText:n}){return e?a.jsxs("div",{className:"bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] text-sm text-[#6C737E] space-y-3",children:[a.jsx("div",{className:"animate-spin w-8 h-8 border-4 border-[#F1641D] border-t-transparent rounded-full mx-auto"}),a.jsx("p",{children:"Executing model inference and property calculators..."})]}):t?a.jsx(Fb,{result:t,cifText:n}):a.jsx("div",{className:"bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] text-sm text-[#6C737E]",children:"Awaiting CIF prediction request. Select a structure file and target properties to begin calculation."})}function Fb({result:t,cifText:e}){var c;const{material_metadata:n,base_outputs:i,properties:r,model_used:s}=t,o=(c=i==null?void 0:i.energy_per_atom)==null?void 0:c.value,l=Object.keys(r??{});return a.jsxs("section",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6","aria-label":"Prediction result",children:[a.jsxs("div",{className:"border-b border-[#F2E7DC] pb-4 flex justify-between items-start",children:[a.jsxs("div",{children:[a.jsx("h2",{className:"font-headline font-bold text-2xl text-[#1E2227]",children:n.formula||"Predicted Structure"}),a.jsxs("p",{className:"text-xs text-[#8C929C] mt-1 flex items-center gap-2",children:[a.jsx($d,{size:12,className:"text-[#F1641D]"}),"Pipeline:"," ",a.jsx("span",{className:"uppercase font-semibold text-[#1E2227]",children:s})," ","· Sites: ",n.num_sites," · Volume:"," ",n.volume_A3.toFixed(2)," Å³"]})]}),a.jsxs("span",{className:"text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF4EE] text-[#F1641D] border border-[#EFE5DC]",children:["Density: ",n.density_g_cm3.toFixed(2)," g/cm³"]})]}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] space-y-3",children:[a.jsxs("div",{className:"flex justify-between items-center",children:[a.jsx("span",{className:"text-xs font-bold text-[#1E2227] uppercase tracking-wider",children:"Crystal Lattice Visualization"}),a.jsx("span",{className:"text-[10px] text-[#8C929C]",children:"Interactive 3D Unit Cell"})]}),a.jsx("div",{className:"w-full h-72 bg-white rounded-xl border border-[#EFE5DC] overflow-hidden relative flex items-center justify-center",children:a.jsx(Tb,{cifText:e})})]}),typeof o=="number"&&a.jsxs("div",{className:"bg-[#FAF4EE] rounded-2xl p-4 border border-[#EFE5DC] flex justify-between items-center",children:[a.jsxs("div",{children:[a.jsx("span",{className:"block text-xs font-bold text-[#8C929C] uppercase",children:"Potential Energy Per Atom"}),a.jsxs("span",{className:"text-xl font-headline font-bold text-[#1E2227]",children:[o.toFixed(4)," eV/atom"]})]}),a.jsx(oo,{className:"text-[#F1641D] opacity-80",size:24})]}),a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:l.map(u=>{var h;const f=r[u],p=bb[u];return!f||!p?null:a.jsx(Lb,{title:p.title,category:p.category,value:p.format(f.value,f.unit),status:f.status,warning:f.status==="estimated"||f.status==="calculated_with_warnings"||f.status==="failed"?(h=f.warnings)==null?void 0:h[0]:void 0},u)})})]})}function Lb({title:t,value:e,category:n,status:i,warning:r}){return a.jsx("div",{className:"bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] flex flex-col justify-between",children:a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{className:"block text-[10px] font-bold text-[#8C929C] uppercase tracking-wider",children:n}),i&&i!=="calculated"&&a.jsx("span",{className:"text-[9px] uppercase tracking-wider text-[#F1641D] bg-white px-1.5 py-0.5 rounded border border-[#EFE5DC]",children:i.replace(/_/g," ")})]}),a.jsx("span",{className:"block text-xs font-bold text-[#1E2227] mt-1",children:t}),a.jsx("span",{className:"block mt-2 text-2xl font-headline font-bold text-[#1E2227] break-words",children:e}),r&&a.jsx("span",{className:"block mt-2 text-[10px] text-[#8C929C] leading-snug",children:r})]})})}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Hh="186",Ib=0,rx=1,Ub=2,Al=1,kb=2,Ta=3,Yr=0,Sn=1,fi=2,Fi=0,ja=1,sx=2,ax=3,ox=4,Ob=5,ys=100,Bb=101,jb=102,zb=103,Vb=104,Gb=200,Hb=201,Wb=202,Xb=203,Yv=204,Kv=205,$b=206,qb=207,Yb=208,Kb=209,Zb=210,Jb=211,Qb=212,eM=213,tM=214,Yd=0,Kd=1,Zd=2,uo=3,Jd=4,Qd=5,ef=6,tf=7,Zv=0,nM=1,iM=2,gi=0,Jv=1,Qv=2,e_=3,Wh=4,t_=5,n_=6,i_=7,r_=300,Kr=301,Ks=302,pu=303,mu=304,Pc=306,nf=1e3,Di=1001,rf=1002,Xt=1003,rM=1004,Wo=1005,rn=1006,xu=1007,Br=1008,An=1009,s_=1010,a_=1011,fo=1012,Xh=1013,vi=1014,hi=1015,_i=1016,$h=1017,qh=1018,ho=1020,o_=35902,l_=35899,c_=1021,u_=1022,Qn=1023,zi=1026,jr=1027,d_=1028,Yh=1029,Zr=1030,Kh=1031,Zh=1033,Tl=33776,Nl=33777,Rl=33778,Dl=33779,sf=35840,af=35841,of=35842,lf=35843,cf=36196,uf=37492,df=37496,ff=37488,hf=37489,ac=37490,pf=37491,mf=37808,xf=37809,gf=37810,vf=37811,_f=37812,yf=37813,Sf=37814,Ef=37815,bf=37816,Mf=37817,wf=37818,Cf=37819,Af=37820,Tf=37821,Nf=36492,Rf=36494,Df=36495,Pf=36283,Ff=36284,oc=36285,Lf=36286,sM=3200,If=0,aM=1,ar="",wn="srgb",lc="srgb-linear",cc="linear",lt="srgb",gu=7680,oM=519,lM=512,cM=513,uM=514,Jh=515,dM=516,fM=517,Qh=518,hM=519,pM=35044,lx="300 es",pi=2e3,po=2001;function mM(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function uc(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function xM(){const t=uc("canvas");return t.style.display="block",t}const cx={};function ux(...t){const e="THREE."+t.shift();console.log(e,...t)}function f_(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Oe(...t){t=f_(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function rt(...t){t=f_(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function js(...t){const e=t.join(" ");e in cx||(cx[e]=!0,Oe(...t))}function gM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const vM={[Yd]:Kd,[Zd]:ef,[Jd]:tf,[uo]:Qd,[Kd]:Yd,[ef]:Zd,[tf]:Jd,[Qd]:uo};class is{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const en=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],vu=Math.PI/180,Uf=180/Math.PI;function So(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(en[t&255]+en[t>>8&255]+en[t>>16&255]+en[t>>24&255]+"-"+en[e&255]+en[e>>8&255]+"-"+en[e>>16&15|64]+en[e>>24&255]+"-"+en[n&63|128]+en[n>>8&255]+"-"+en[n>>16&255]+en[n>>24&255]+en[i&255]+en[i>>8&255]+en[i>>16&255]+en[i>>24&255]).toLowerCase()}function Qe(t,e,n){return Math.max(e,Math.min(n,t))}function _M(t,e){return(t%e+e)%e}function _u(t,e,n){return(1-n)*t+n*e}function xa(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:case Uint8ClampedArray:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function mn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const cp=class cp{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Qe(this.x,e.x,n.x),this.y=Qe(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Qe(this.x,e,n),this.y=Qe(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Qe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};cp.prototype.isVector2=!0;let Ze=cp;class ra{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,l){let c=i[r+0],u=i[r+1],f=i[r+2],p=i[r+3],h=s[o+0],m=s[o+1],g=s[o+2],S=s[o+3];if(p!==S||c!==h||u!==m||f!==g){let x=c*h+u*m+f*g+p*S;x<0&&(h=-h,m=-m,g=-g,S=-S,x=-x);let d=1-l;if(x<.9995){const v=Math.acos(x),b=Math.sin(v);d=Math.sin(d*v)/b,l=Math.sin(l*v)/b,c=c*d+h*l,u=u*d+m*l,f=f*d+g*l,p=p*d+S*l}else{c=c*d+h*l,u=u*d+m*l,f=f*d+g*l,p=p*d+S*l;const v=1/Math.sqrt(c*c+u*u+f*f+p*p);c*=v,u*=v,f*=v,p*=v}}e[n]=c,e[n+1]=u,e[n+2]=f,e[n+3]=p}static multiplyQuaternionsFlat(e,n,i,r,s,o){const l=i[r],c=i[r+1],u=i[r+2],f=i[r+3],p=s[o],h=s[o+1],m=s[o+2],g=s[o+3];return e[n]=l*g+f*p+c*m-u*h,e[n+1]=c*g+f*h+u*p-l*m,e[n+2]=u*g+f*m+l*h-c*p,e[n+3]=f*g-l*p-c*h-u*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,l=Math.cos,c=Math.sin,u=l(i/2),f=l(r/2),p=l(s/2),h=c(i/2),m=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=h*f*p+u*m*g,this._y=u*m*p-h*f*g,this._z=u*f*g+h*m*p,this._w=u*f*p-h*m*g;break;case"YXZ":this._x=h*f*p+u*m*g,this._y=u*m*p-h*f*g,this._z=u*f*g-h*m*p,this._w=u*f*p+h*m*g;break;case"ZXY":this._x=h*f*p-u*m*g,this._y=u*m*p+h*f*g,this._z=u*f*g+h*m*p,this._w=u*f*p-h*m*g;break;case"ZYX":this._x=h*f*p-u*m*g,this._y=u*m*p+h*f*g,this._z=u*f*g-h*m*p,this._w=u*f*p+h*m*g;break;case"YZX":this._x=h*f*p+u*m*g,this._y=u*m*p+h*f*g,this._z=u*f*g-h*m*p,this._w=u*f*p-h*m*g;break;case"XZY":this._x=h*f*p-u*m*g,this._y=u*m*p-h*f*g,this._z=u*f*g+h*m*p,this._w=u*f*p+h*m*g;break;default:Oe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],l=n[5],c=n[9],u=n[2],f=n[6],p=n[10],h=i+l+p;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(f-c)*m,this._y=(s-u)*m,this._z=(o-r)*m}else if(i>l&&i>p){const m=2*Math.sqrt(1+i-l-p);this._w=(f-c)/m,this._x=.25*m,this._y=(r+o)/m,this._z=(s+u)/m}else if(l>p){const m=2*Math.sqrt(1+l-i-p);this._w=(s-u)/m,this._x=(r+o)/m,this._y=.25*m,this._z=(c+f)/m}else{const m=2*Math.sqrt(1+p-i-l);this._w=(o-r)/m,this._x=(s+u)/m,this._y=(c+f)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,l=n._x,c=n._y,u=n._z,f=n._w;return this._x=i*f+o*l+r*u-s*c,this._y=r*f+o*c+s*l-i*u,this._z=s*f+o*u+i*c-r*l,this._w=o*f-i*l-r*c-s*u,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,l=this.dot(e);l<0&&(i=-i,r=-r,s=-s,o=-o,l=-l);let c=1-n;if(l<.9995){const u=Math.acos(l),f=Math.sin(u);c=Math.sin(c*u)/f,n=Math.sin(n*u)/f,this._x=this._x*c+i*n,this._y=this._y*c+r*n,this._z=this._z*c+s*n,this._w=this._w*c+o*n,this._onChangeCallback()}else this._x=this._x*c+i*n,this._y=this._y*c+r*n,this._z=this._z*c+s*n,this._w=this._w*c+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const up=class up{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(dx.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(dx.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,l=e.z,c=e.w,u=2*(o*r-l*i),f=2*(l*n-s*r),p=2*(s*i-o*n);return this.x=n+c*u+o*p-l*f,this.y=i+c*f+l*u-s*p,this.z=r+c*p+s*f-o*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Qe(this.x,e.x,n.x),this.y=Qe(this.y,e.y,n.y),this.z=Qe(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Qe(this.x,e,n),this.y=Qe(this.y,e,n),this.z=Qe(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,l=n.y,c=n.z;return this.x=r*c-s*l,this.y=s*o-i*c,this.z=i*l-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return yu.copy(this).projectOnVector(e),this.sub(yu)}reflect(e){return this.sub(yu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Qe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};up.prototype.isVector3=!0;let G=up;const yu=new G,dx=new ra,dp=class dp{constructor(e,n,i,r,s,o,l,c,u){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,l,c,u)}set(e,n,i,r,s,o,l,c,u){const f=this.elements;return f[0]=e,f[1]=r,f[2]=l,f[3]=n,f[4]=s,f[5]=c,f[6]=i,f[7]=o,f[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],l=i[3],c=i[6],u=i[1],f=i[4],p=i[7],h=i[2],m=i[5],g=i[8],S=r[0],x=r[3],d=r[6],v=r[1],b=r[4],E=r[7],w=r[2],C=r[5],T=r[8];return s[0]=o*S+l*v+c*w,s[3]=o*x+l*b+c*C,s[6]=o*d+l*E+c*T,s[1]=u*S+f*v+p*w,s[4]=u*x+f*b+p*C,s[7]=u*d+f*E+p*T,s[2]=h*S+m*v+g*w,s[5]=h*x+m*b+g*C,s[8]=h*d+m*E+g*T,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],l=e[5],c=e[6],u=e[7],f=e[8];return n*o*f-n*l*u-i*s*f+i*l*c+r*s*u-r*o*c}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],l=e[5],c=e[6],u=e[7],f=e[8],p=f*o-l*u,h=l*c-f*s,m=u*s-o*c,g=n*p+i*h+r*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/g;return e[0]=p*S,e[1]=(r*u-f*i)*S,e[2]=(l*i-r*o)*S,e[3]=h*S,e[4]=(f*n-r*c)*S,e[5]=(r*s-l*n)*S,e[6]=m*S,e[7]=(i*c-u*n)*S,e[8]=(o*n-i*s)*S,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,l){const c=Math.cos(s),u=Math.sin(s);return this.set(i*c,i*u,-i*(c*o+u*l)+o+e,-r*u,r*c,-r*(-u*o+c*l)+l+n,0,0,1),this}scale(e,n){return js("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Su.makeScale(e,n)),this}rotate(e){return js("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Su.makeRotation(-e)),this}translate(e,n){return js("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Su.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};dp.prototype.isMatrix3=!0;let ze=dp;const Su=new ze,fx=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hx=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function yM(){const t={enabled:!0,workingColorSpace:lc,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===lt&&(r.r=Li(r.r),r.g=Li(r.g),r.b=Li(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===lt&&(r.r=zs(r.r),r.g=zs(r.g),r.b=zs(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ar?cc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return js("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return js("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[lc]:{primaries:e,whitePoint:i,transfer:cc,toXYZ:fx,fromXYZ:hx,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:wn},outputColorSpaceConfig:{drawingBufferColorSpace:wn}},[wn]:{primaries:e,whitePoint:i,transfer:lt,toXYZ:fx,fromXYZ:hx,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:wn}}}),t}const et=yM();function Li(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function zs(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let os;class SM{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{os===void 0&&(os=uc("canvas")),os.width=e.width,os.height=e.height;const r=os.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=os}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=uc("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Li(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Li(n[i]/255)*255):n[i]=Li(n[i]);return{data:n,width:e.width,height:e.height}}else return Oe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let EM=0;class ep{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:EM++}),this.uuid=So(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,l=r.length;o<l;o++)r[o].isDataTexture?s.push(Eu(r[o].image)):s.push(Eu(r[o]))}else s=Eu(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Eu(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?SM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Oe("Texture: Unable to serialize Texture."),{})}let bM=0;const bu=new G;class dn extends is{constructor(e=dn.DEFAULT_IMAGE,n=dn.DEFAULT_MAPPING,i=Di,r=Di,s=rn,o=Br,l=Qn,c=An,u=dn.DEFAULT_ANISOTROPY,f=ar){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bM++}),this.uuid=So(),this.name="",this.source=new ep(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=u,this.format=l,this.internalFormat=null,this.type=c,this.offset=new Ze(0,0),this.repeat=new Ze(1,1),this.center=new Ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(bu).x}get height(){return this.source.getSize(bu).y}get depth(){return this.source.getSize(bu).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Oe(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Oe(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==r_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case nf:e.x=e.x-Math.floor(e.x);break;case Di:e.x=e.x<0?0:1;break;case rf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case nf:e.y=e.y-Math.floor(e.y);break;case Di:e.y=e.y<0?0:1;break;case rf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=r_;dn.DEFAULT_ANISOTROPY=1;const fp=class fp{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const c=e.elements,u=c[0],f=c[4],p=c[8],h=c[1],m=c[5],g=c[9],S=c[2],x=c[6],d=c[10];if(Math.abs(f-h)<.01&&Math.abs(p-S)<.01&&Math.abs(g-x)<.01){if(Math.abs(f+h)<.1&&Math.abs(p+S)<.1&&Math.abs(g+x)<.1&&Math.abs(u+m+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const b=(u+1)/2,E=(m+1)/2,w=(d+1)/2,C=(f+h)/4,T=(p+S)/4,_=(g+x)/4;return b>E&&b>w?b<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(b),r=C/i,s=T/i):E>w?E<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(E),i=C/r,s=_/r):w<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),i=T/s,r=_/s),this.set(i,r,s,n),this}let v=Math.sqrt((x-g)*(x-g)+(p-S)*(p-S)+(h-f)*(h-f));return Math.abs(v)<.001&&(v=1),this.x=(x-g)/v,this.y=(p-S)/v,this.z=(h-f)/v,this.w=Math.acos((u+m+d-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Qe(this.x,e.x,n.x),this.y=Qe(this.y,e.y,n.y),this.z=Qe(this.z,e.z,n.z),this.w=Qe(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Qe(this.x,e,n),this.y=Qe(this.y,e,n),this.z=Qe(this.z,e,n),this.w=Qe(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};fp.prototype.isVector4=!0;let St=fp;class MM extends is{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new St(0,0,e,n),this.scissorTest=!1,this.viewport=new St(0,0,e,n),this.textures=[];const r={width:e,height:n,depth:i.depth},s=new dn(r),o=i.count;for(let l=0;l<o;l++)this.textures[l]=s.clone(),this.textures[l].isRenderTargetTexture=!0,this.textures[l].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const n={minFilter:rn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},e.textures[n].image);this.textures[n].source=new ep(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const n=e.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ni extends MM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class h_ extends dn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class wM extends dn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const hc=class hc{constructor(e,n,i,r,s,o,l,c,u,f,p,h,m,g,S,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,l,c,u,f,p,h,m,g,S,x)}set(e,n,i,r,s,o,l,c,u,f,p,h,m,g,S,x){const d=this.elements;return d[0]=e,d[4]=n,d[8]=i,d[12]=r,d[1]=s,d[5]=o,d[9]=l,d[13]=c,d[2]=u,d[6]=f,d[10]=p,d[14]=h,d[3]=m,d[7]=g,d[11]=S,d[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new hc().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const n=this.elements,i=e.elements,r=1/ls.setFromMatrixColumn(e,0).length(),s=1/ls.setFromMatrixColumn(e,1).length(),o=1/ls.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),l=Math.sin(i),c=Math.cos(r),u=Math.sin(r),f=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const h=o*f,m=o*p,g=l*f,S=l*p;n[0]=c*f,n[4]=-c*p,n[8]=u,n[1]=m+g*u,n[5]=h-S*u,n[9]=-l*c,n[2]=S-h*u,n[6]=g+m*u,n[10]=o*c}else if(e.order==="YXZ"){const h=c*f,m=c*p,g=u*f,S=u*p;n[0]=h+S*l,n[4]=g*l-m,n[8]=o*u,n[1]=o*p,n[5]=o*f,n[9]=-l,n[2]=m*l-g,n[6]=S+h*l,n[10]=o*c}else if(e.order==="ZXY"){const h=c*f,m=c*p,g=u*f,S=u*p;n[0]=h-S*l,n[4]=-o*p,n[8]=g+m*l,n[1]=m+g*l,n[5]=o*f,n[9]=S-h*l,n[2]=-o*u,n[6]=l,n[10]=o*c}else if(e.order==="ZYX"){const h=o*f,m=o*p,g=l*f,S=l*p;n[0]=c*f,n[4]=g*u-m,n[8]=h*u+S,n[1]=c*p,n[5]=S*u+h,n[9]=m*u-g,n[2]=-u,n[6]=l*c,n[10]=o*c}else if(e.order==="YZX"){const h=o*c,m=o*u,g=l*c,S=l*u;n[0]=c*f,n[4]=S-h*p,n[8]=g*p+m,n[1]=p,n[5]=o*f,n[9]=-l*f,n[2]=-u*f,n[6]=m*p+g,n[10]=h-S*p}else if(e.order==="XZY"){const h=o*c,m=o*u,g=l*c,S=l*u;n[0]=c*f,n[4]=-p,n[8]=u*f,n[1]=h*p+S,n[5]=o*f,n[9]=m*p-g,n[2]=g*p-m,n[6]=l*f,n[10]=S*p+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(CM,e,AM)}lookAt(e,n,i){const r=this.elements;return En.subVectors(e,n),En.lengthSq()===0&&(En.z=1),En.normalize(),Yi.crossVectors(i,En),Yi.lengthSq()===0&&(Math.abs(i.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Yi.crossVectors(i,En)),Yi.normalize(),Xo.crossVectors(En,Yi),r[0]=Yi.x,r[4]=Xo.x,r[8]=En.x,r[1]=Yi.y,r[5]=Xo.y,r[9]=En.y,r[2]=Yi.z,r[6]=Xo.z,r[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],l=i[4],c=i[8],u=i[12],f=i[1],p=i[5],h=i[9],m=i[13],g=i[2],S=i[6],x=i[10],d=i[14],v=i[3],b=i[7],E=i[11],w=i[15],C=r[0],T=r[4],_=r[8],A=r[12],R=r[1],P=r[5],D=r[9],U=r[13],F=r[2],B=r[6],Z=r[10],X=r[14],j=r[3],z=r[7],$=r[11],Q=r[15];return s[0]=o*C+l*R+c*F+u*j,s[4]=o*T+l*P+c*B+u*z,s[8]=o*_+l*D+c*Z+u*$,s[12]=o*A+l*U+c*X+u*Q,s[1]=f*C+p*R+h*F+m*j,s[5]=f*T+p*P+h*B+m*z,s[9]=f*_+p*D+h*Z+m*$,s[13]=f*A+p*U+h*X+m*Q,s[2]=g*C+S*R+x*F+d*j,s[6]=g*T+S*P+x*B+d*z,s[10]=g*_+S*D+x*Z+d*$,s[14]=g*A+S*U+x*X+d*Q,s[3]=v*C+b*R+E*F+w*j,s[7]=v*T+b*P+E*B+w*z,s[11]=v*_+b*D+E*Z+w*$,s[15]=v*A+b*U+E*X+w*Q,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],l=e[5],c=e[9],u=e[13],f=e[2],p=e[6],h=e[10],m=e[14],g=e[3],S=e[7],x=e[11],d=e[15],v=c*m-u*h,b=l*m-u*p,E=l*h-c*p,w=o*m-u*f,C=o*h-c*f,T=o*p-l*f;return n*(S*v-x*b+d*E)-i*(g*v-x*w+d*C)+r*(g*b-S*w+d*T)-s*(g*E-S*C+x*T)}determinantAffine(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[1],o=e[5],l=e[9],c=e[2],u=e[6],f=e[10];return n*(o*f-l*u)-i*(s*f-l*c)+r*(s*u-o*c)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],l=e[5],c=e[6],u=e[7],f=e[8],p=e[9],h=e[10],m=e[11],g=e[12],S=e[13],x=e[14],d=e[15],v=n*l-i*o,b=n*c-r*o,E=n*u-s*o,w=i*c-r*l,C=i*u-s*l,T=r*u-s*c,_=f*S-p*g,A=f*x-h*g,R=f*d-m*g,P=p*x-h*S,D=p*d-m*S,U=h*d-m*x,F=v*U-b*D+E*P+w*R-C*A+T*_;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/F;return e[0]=(l*U-c*D+u*P)*B,e[1]=(r*D-i*U-s*P)*B,e[2]=(S*T-x*C+d*w)*B,e[3]=(h*C-p*T-m*w)*B,e[4]=(c*R-o*U-u*A)*B,e[5]=(n*U-r*R+s*A)*B,e[6]=(x*E-g*T-d*b)*B,e[7]=(f*T-h*E+m*b)*B,e[8]=(o*D-l*R+u*_)*B,e[9]=(i*R-n*D-s*_)*B,e[10]=(g*C-S*E+d*v)*B,e[11]=(p*E-f*C-m*v)*B,e[12]=(l*A-o*P-c*_)*B,e[13]=(n*P-i*A+r*_)*B,e[14]=(S*b-g*w-x*v)*B,e[15]=(f*w-p*b+h*v)*B,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,l=e.y,c=e.z,u=s*o,f=s*l;return this.set(u*o+i,u*l-r*c,u*c+r*l,0,u*l+r*c,f*l+i,f*c-r*o,0,u*c-r*l,f*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,l=n._z,c=n._w,u=s+s,f=o+o,p=l+l,h=s*u,m=s*f,g=s*p,S=o*f,x=o*p,d=l*p,v=c*u,b=c*f,E=c*p,w=i.x,C=i.y,T=i.z;return r[0]=(1-(S+d))*w,r[1]=(m+E)*w,r[2]=(g-b)*w,r[3]=0,r[4]=(m-E)*C,r[5]=(1-(h+d))*C,r[6]=(x+v)*C,r[7]=0,r[8]=(g+b)*T,r[9]=(x-v)*T,r[10]=(1-(h+S))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),n.identity(),this;let o=ls.set(r[0],r[1],r[2]).length();const l=ls.set(r[4],r[5],r[6]).length(),c=ls.set(r[8],r[9],r[10]).length();s<0&&(o=-o),Xn.copy(this);const u=1/o,f=1/l,p=1/c;return Xn.elements[0]*=u,Xn.elements[1]*=u,Xn.elements[2]*=u,Xn.elements[4]*=f,Xn.elements[5]*=f,Xn.elements[6]*=f,Xn.elements[8]*=p,Xn.elements[9]*=p,Xn.elements[10]*=p,n.setFromRotationMatrix(Xn),i.x=o,i.y=l,i.z=c,this}makePerspective(e,n,i,r,s,o,l=pi,c=!1){const u=this.elements,f=2*s/(n-e),p=2*s/(i-r),h=(n+e)/(n-e),m=(i+r)/(i-r);let g,S;if(c)g=s/(o-s),S=o*s/(o-s);else if(l===pi)g=-(o+s)/(o-s),S=-2*o*s/(o-s);else if(l===po)g=-o/(o-s),S=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return u[0]=f,u[4]=0,u[8]=h,u[12]=0,u[1]=0,u[5]=p,u[9]=m,u[13]=0,u[2]=0,u[6]=0,u[10]=g,u[14]=S,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,n,i,r,s,o,l=pi,c=!1){const u=this.elements,f=2/(n-e),p=2/(i-r),h=-(n+e)/(n-e),m=-(i+r)/(i-r);let g,S;if(c)g=1/(o-s),S=o/(o-s);else if(l===pi)g=-2/(o-s),S=-(o+s)/(o-s);else if(l===po)g=-1/(o-s),S=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return u[0]=f,u[4]=0,u[8]=0,u[12]=h,u[1]=0,u[5]=p,u[9]=0,u[13]=m,u[2]=0,u[6]=0,u[10]=g,u[14]=S,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};hc.prototype.isMatrix4=!0;let bt=hc;const ls=new G,Xn=new bt,CM=new G(0,0,0),AM=new G(1,1,1),Yi=new G,Xo=new G,En=new G,px=new bt,mx=new ra;class Er{constructor(e=0,n=0,i=0,r=Er.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],l=r[8],c=r[1],u=r[5],f=r[9],p=r[2],h=r[6],m=r[10];switch(n){case"XYZ":this._y=Math.asin(Qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,u),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(l,m),this._z=Math.atan2(c,u)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,m),this._z=Math.atan2(-o,u)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Qe(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,u));break;case"YZX":this._z=Math.asin(Qe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-f,u),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(l,m));break;case"XZY":this._z=Math.asin(-Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,u),this._y=Math.atan2(l,s)):(this._x=Math.atan2(-f,m),this._y=0);break;default:Oe("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return px.makeRotationFromQuaternion(e),this.setFromRotationMatrix(px,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return mx.setFromEuler(this),this.setFromQuaternion(mx,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Er.DEFAULT_ORDER="XYZ";class p_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let TM=0;const xx=new G,cs=new ra,Ei=new bt,$o=new G,ga=new G,NM=new G,RM=new ra,gx=new G(1,0,0),vx=new G(0,1,0),_x=new G(0,0,1),yx={type:"added"},DM={type:"removed"},us={type:"childadded",child:null},Mu={type:"childremoved",child:null};class qt extends is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:TM++}),this.uuid=So(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=qt.DEFAULT_UP.clone();const e=new G,n=new Er,i=new ra,r=new G(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new bt},normalMatrix:{value:new ze}}),this.matrix=new bt,this.matrixWorld=new bt,this.matrixAutoUpdate=qt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new p_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return cs.setFromAxisAngle(e,n),this.quaternion.multiply(cs),this}rotateOnWorldAxis(e,n){return cs.setFromAxisAngle(e,n),this.quaternion.premultiply(cs),this}rotateX(e){return this.rotateOnAxis(gx,e)}rotateY(e){return this.rotateOnAxis(vx,e)}rotateZ(e){return this.rotateOnAxis(_x,e)}translateOnAxis(e,n){return xx.copy(e).applyQuaternion(this.quaternion),this.position.add(xx.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(gx,e)}translateY(e){return this.translateOnAxis(vx,e)}translateZ(e){return this.translateOnAxis(_x,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?$o.copy(e):$o.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ga.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(ga,$o,this.up):Ei.lookAt($o,ga,this.up),this.quaternion.setFromRotationMatrix(Ei),r&&(Ei.extractRotation(r.matrixWorld),cs.setFromRotationMatrix(Ei),this.quaternion.premultiply(cs.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(rt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yx),us.child=e,this.dispatchEvent(us),us.child=null):rt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(DM),Mu.child=e,this.dispatchEvent(Mu),Mu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yx),us.child=e,this.dispatchEvent(us),us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ga,e,NM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ga,RM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){const s=this.children;for(let o=0,l=s.length;o<l;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(l=>({...l,boundingBox:l.boundingBox?l.boundingBox.toJSON():void 0,boundingSphere:l.boundingSphere?l.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(l=>({...l})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let u=0,f=c.length;u<f;u++){const p=c[u];s(e.shapes,p)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,u=this.material.length;c<u;c++)l.push(s(e.materials,this.material[c]));r.material=l}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let l=0;l<this.children.length;l++)r.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];r.animations.push(s(e.animations,c))}}if(n){const l=o(e.geometries),c=o(e.materials),u=o(e.textures),f=o(e.images),p=o(e.shapes),h=o(e.skeletons),m=o(e.animations),g=o(e.nodes);l.length>0&&(i.geometries=l),c.length>0&&(i.materials=c),u.length>0&&(i.textures=u),f.length>0&&(i.images=f),p.length>0&&(i.shapes=p),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(l){const c=[];for(const u in l){const f=l[u];delete f.metadata,c.push(f)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}qt.DEFAULT_UP=new G(0,1,0);qt.DEFAULT_MATRIX_AUTO_UPDATE=!0;qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Na extends qt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const PM={type:"move"};class wu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Na,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Na,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Na,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const l=this._targetRay,c=this._grip,u=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(u&&e.hand){o=!0;for(const S of e.hand.values()){const x=n.getJointPose(S,i),d=this._getHandJoint(u,S);x!==null&&(d.matrix.fromArray(x.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=x.radius),d.visible=x!==null}const f=u.joints["index-finger-tip"],p=u.joints["thumb-tip"],h=f.position.distanceTo(p.position),m=.02,g=.005;u.inputState.pinching&&h>m+g?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&h<=m-g&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));l!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(PM)))}return l!==null&&(l.visible=r!==null),c!==null&&(c.visible=s!==null),u!==null&&(u.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Na;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const m_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ki={h:0,s:0,l:0},qo={h:0,s:0,l:0};function Cu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class qe{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=wn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=et.workingColorSpace){return this.r=e,this.g=n,this.b=i,et.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=et.workingColorSpace){if(e=_M(e,1),n=Qe(n,0,1),i=Qe(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=Cu(o,s,e+1/3),this.g=Cu(o,s,e),this.b=Cu(o,s,e-1/3)}return et.colorSpaceToWorking(this,r),this}setStyle(e,n=wn){function i(s){s!==void 0&&parseFloat(s)<1&&Oe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],l=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:Oe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);Oe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=wn){const i=m_[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Oe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}copyLinearToSRGB(e){return this.r=zs(e.r),this.g=zs(e.g),this.b=zs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=wn){return et.workingToColorSpace(tn.copy(this),e),Math.round(Qe(tn.r*255,0,255))*65536+Math.round(Qe(tn.g*255,0,255))*256+Math.round(Qe(tn.b*255,0,255))}getHexString(e=wn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=et.workingColorSpace){et.workingToColorSpace(tn.copy(this),n);const i=tn.r,r=tn.g,s=tn.b,o=Math.max(i,r,s),l=Math.min(i,r,s);let c,u;const f=(l+o)/2;if(l===o)c=0,u=0;else{const p=o-l;switch(u=f<=.5?p/(o+l):p/(2-o-l),o){case i:c=(r-s)/p+(r<s?6:0);break;case r:c=(s-i)/p+2;break;case s:c=(i-r)/p+4;break}c/=6}return e.h=c,e.s=u,e.l=f,e}getRGB(e,n=et.workingColorSpace){return et.workingToColorSpace(tn.copy(this),n),e.r=tn.r,e.g=tn.g,e.b=tn.b,e}getStyle(e=wn){et.workingToColorSpace(tn.copy(this),e);const n=tn.r,i=tn.g,r=tn.b;return e!==wn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Ki),this.setHSL(Ki.h+e,Ki.s+n,Ki.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Ki),e.getHSL(qo);const i=_u(Ki.h,qo.h,n),r=_u(Ki.s,qo.s,n),s=_u(Ki.l,qo.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const tn=new qe;qe.NAMES=m_;class tp{constructor(e,n=1,i=1e3){this.isFog=!0,this.name="",this.color=new qe(e),this.near=n,this.far=i}clone(){return new tp(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class FM extends qt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Er,this.environmentIntensity=1,this.environmentRotation=new Er,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}}const $n=new G,bi=new G,Au=new G,Mi=new G,ds=new G,fs=new G,Sx=new G,Tu=new G,Nu=new G,Ru=new G,Du=new St,Pu=new St,Fu=new St;class Jn{constructor(e=new G,n=new G,i=new G){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),$n.subVectors(e,n),r.cross($n);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){$n.subVectors(r,n),bi.subVectors(i,n),Au.subVectors(e,n);const o=$n.dot($n),l=$n.dot(bi),c=$n.dot(Au),u=bi.dot(bi),f=bi.dot(Au),p=o*u-l*l;if(p===0)return s.set(0,0,0),null;const h=1/p,m=(u*c-l*f)*h,g=(o*f-l*c)*h;return s.set(1-m-g,g,m)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(e,n,i,r,s,o,l,c){return this.getBarycoord(e,n,i,r,Mi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Mi.x),c.addScaledVector(o,Mi.y),c.addScaledVector(l,Mi.z),c)}static getInterpolatedAttribute(e,n,i,r,s,o){return Du.setScalar(0),Pu.setScalar(0),Fu.setScalar(0),Du.fromBufferAttribute(e,n),Pu.fromBufferAttribute(e,i),Fu.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Du,s.x),o.addScaledVector(Pu,s.y),o.addScaledVector(Fu,s.z),o}static isFrontFacing(e,n,i,r){return $n.subVectors(i,n),bi.subVectors(e,n),$n.cross(bi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $n.subVectors(this.c,this.b),bi.subVectors(this.a,this.b),$n.cross(bi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Jn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Jn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Jn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Jn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Jn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,l;ds.subVectors(r,i),fs.subVectors(s,i),Tu.subVectors(e,i);const c=ds.dot(Tu),u=fs.dot(Tu);if(c<=0&&u<=0)return n.copy(i);Nu.subVectors(e,r);const f=ds.dot(Nu),p=fs.dot(Nu);if(f>=0&&p<=f)return n.copy(r);const h=c*p-f*u;if(h<=0&&c>=0&&f<=0)return o=c/(c-f),n.copy(i).addScaledVector(ds,o);Ru.subVectors(e,s);const m=ds.dot(Ru),g=fs.dot(Ru);if(g>=0&&m<=g)return n.copy(s);const S=m*u-c*g;if(S<=0&&u>=0&&g<=0)return l=u/(u-g),n.copy(i).addScaledVector(fs,l);const x=f*g-m*p;if(x<=0&&p-f>=0&&m-g>=0)return Sx.subVectors(s,r),l=(p-f)/(p-f+(m-g)),n.copy(r).addScaledVector(Sx,l);const d=1/(x+S+h);return o=S*d,l=h*d,n.copy(i).addScaledVector(ds,o).addScaledVector(fs,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Eo{constructor(e=new G(1/0,1/0,1/0),n=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(qn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(qn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=qn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,l=s.count;o<l;o++)e.isMesh===!0?e.getVertexPosition(o,qn):qn.fromBufferAttribute(s,o),qn.applyMatrix4(e.matrixWorld),this.expandByPoint(qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Yo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Yo.copy(i.boundingBox)),Yo.applyMatrix4(e.matrixWorld),this.union(Yo)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qn),qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(va),Ko.subVectors(this.max,va),hs.subVectors(e.a,va),ps.subVectors(e.b,va),ms.subVectors(e.c,va),Zi.subVectors(ps,hs),Ji.subVectors(ms,ps),Nr.subVectors(hs,ms);let n=[0,-Zi.z,Zi.y,0,-Ji.z,Ji.y,0,-Nr.z,Nr.y,Zi.z,0,-Zi.x,Ji.z,0,-Ji.x,Nr.z,0,-Nr.x,-Zi.y,Zi.x,0,-Ji.y,Ji.x,0,-Nr.y,Nr.x,0];return!Lu(n,hs,ps,ms,Ko)||(n=[1,0,0,0,1,0,0,0,1],!Lu(n,hs,ps,ms,Ko))?!1:(Zo.crossVectors(Zi,Ji),n=[Zo.x,Zo.y,Zo.z],Lu(n,hs,ps,ms,Ko))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const wi=[new G,new G,new G,new G,new G,new G,new G,new G],qn=new G,Yo=new Eo,hs=new G,ps=new G,ms=new G,Zi=new G,Ji=new G,Nr=new G,va=new G,Ko=new G,Zo=new G,Rr=new G;function Lu(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Rr.fromArray(t,s);const l=r.x*Math.abs(Rr.x)+r.y*Math.abs(Rr.y)+r.z*Math.abs(Rr.z),c=e.dot(Rr),u=n.dot(Rr),f=i.dot(Rr);if(Math.max(-Math.max(c,u,f),Math.min(c,u,f))>l)return!1}return!0}const It=new G,Jo=new Ze;let LM=0;class Ii extends is{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:LM++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=pM,this.updateRanges=[],this.gpuType=hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Jo.fromBufferAttribute(this,n),Jo.applyMatrix3(e),this.setXY(n,Jo.x,Jo.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)It.fromBufferAttribute(this,n),It.applyMatrix3(e),this.setXYZ(n,It.x,It.y,It.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)It.fromBufferAttribute(this,n),It.applyMatrix4(e),this.setXYZ(n,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)It.fromBufferAttribute(this,n),It.applyNormalMatrix(e),this.setXYZ(n,It.x,It.y,It.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)It.fromBufferAttribute(this,n),It.transformDirection(e),this.setXYZ(n,It.x,It.y,It.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=xa(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=mn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=xa(n,this.array)),n}setX(e,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=xa(n,this.array)),n}setY(e,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=xa(n,this.array)),n}setZ(e,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=xa(n,this.array)),n}setW(e,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=mn(n,this.array),i=mn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=mn(n,this.array),i=mn(i,this.array),r=mn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=mn(n,this.array),i=mn(i,this.array),r=mn(r,this.array),s=mn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class x_ extends Ii{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class g_ extends Ii{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class kt extends Ii{constructor(e,n,i){super(new Float32Array(e),n,i)}}const IM=new Eo,_a=new G,Iu=new G;class Fc{constructor(e=new G,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):IM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_a.subVectors(e,this.center);const n=_a.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(_a,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Iu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_a.copy(e.center).add(Iu)),this.expandByPoint(_a.copy(e.center).sub(Iu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let UM=0;const Un=new bt,Uu=new qt,xs=new G,bn=new Eo,ya=new Eo,Vt=new G;class Ln extends is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:UM++}),this.uuid=So(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(mM(e)?g_:x_)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ze().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Un.makeRotationFromQuaternion(e),this.applyMatrix4(Un),this}rotateX(e){return Un.makeRotationX(e),this.applyMatrix4(Un),this}rotateY(e){return Un.makeRotationY(e),this.applyMatrix4(Un),this}rotateZ(e){return Un.makeRotationZ(e),this.applyMatrix4(Un),this}translate(e,n,i){return Un.makeTranslation(e,n,i),this.applyMatrix4(Un),this}scale(e,n,i){return Un.makeScale(e,n,i),this.applyMatrix4(Un),this}lookAt(e){return Uu.lookAt(e),Uu.updateMatrix(),this.applyMatrix4(Uu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xs).negate(),this.translate(xs.x,xs.y,xs.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new kt(i,3))}else{const i=Math.min(e.length,n.count);for(let r=0;r<i;r++){const s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&Oe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Eo);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){rt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];bn.setFromBufferAttribute(s),this.morphTargetsRelative?(Vt.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(Vt),Vt.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(Vt)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&rt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fc);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){rt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(e){const i=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const l=n[s];ya.setFromBufferAttribute(l),this.morphTargetsRelative?(Vt.addVectors(bn.min,ya.min),bn.expandByPoint(Vt),Vt.addVectors(bn.max,ya.max),bn.expandByPoint(Vt)):(bn.expandByPoint(ya.min),bn.expandByPoint(ya.max))}bn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Vt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Vt));if(n)for(let s=0,o=n.length;s<o;s++){const l=n[s],c=this.morphTargetsRelative;for(let u=0,f=l.count;u<f;u++)Vt.fromBufferAttribute(l,u),c&&(xs.fromBufferAttribute(e,u),Vt.add(xs)),r=Math.max(r,i.distanceToSquared(Vt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&rt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){rt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Ii(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));const l=[],c=[];for(let _=0;_<i.count;_++)l[_]=new G,c[_]=new G;const u=new G,f=new G,p=new G,h=new Ze,m=new Ze,g=new Ze,S=new G,x=new G;function d(_,A,R){u.fromBufferAttribute(i,_),f.fromBufferAttribute(i,A),p.fromBufferAttribute(i,R),h.fromBufferAttribute(s,_),m.fromBufferAttribute(s,A),g.fromBufferAttribute(s,R),f.sub(u),p.sub(u),m.sub(h),g.sub(h);const P=1/(m.x*g.y-g.x*m.y);isFinite(P)&&(S.copy(f).multiplyScalar(g.y).addScaledVector(p,-m.y).multiplyScalar(P),x.copy(p).multiplyScalar(m.x).addScaledVector(f,-g.x).multiplyScalar(P),l[_].add(S),l[A].add(S),l[R].add(S),c[_].add(x),c[A].add(x),c[R].add(x))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let _=0,A=v.length;_<A;++_){const R=v[_],P=R.start,D=R.count;for(let U=P,F=P+D;U<F;U+=3)d(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const b=new G,E=new G,w=new G,C=new G;function T(_){w.fromBufferAttribute(r,_),C.copy(w);const A=l[_];b.copy(A),b.sub(w.multiplyScalar(w.dot(A))).normalize(),E.crossVectors(C,A);const P=E.dot(c[_])<0?-1:1;o.setXYZW(_,b.x,b.y,b.z,P)}for(let _=0,A=v.length;_<A;++_){const R=v[_],P=R.start,D=R.count;for(let U=P,F=P+D;U<F;U+=3)T(e.getX(U+0)),T(e.getX(U+1)),T(e.getX(U+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new Ii(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const r=new G,s=new G,o=new G,l=new G,c=new G,u=new G,f=new G,p=new G;if(e)for(let h=0,m=e.count;h<m;h+=3){const g=e.getX(h+0),S=e.getX(h+1),x=e.getX(h+2);r.fromBufferAttribute(n,g),s.fromBufferAttribute(n,S),o.fromBufferAttribute(n,x),f.subVectors(o,s),p.subVectors(r,s),f.cross(p),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,S),u.fromBufferAttribute(i,x),l.add(f),c.add(f),u.add(f),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(S,c.x,c.y,c.z),i.setXYZ(x,u.x,u.y,u.z)}else for(let h=0,m=n.count;h<m;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),o.fromBufferAttribute(n,h+2),f.subVectors(o,s),p.subVectors(r,s),f.cross(p),i.setXYZ(h+0,f.x,f.y,f.z),i.setXYZ(h+1,f.x,f.y,f.z),i.setXYZ(h+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Vt.fromBufferAttribute(e,n),Vt.normalize(),e.setXYZ(n,Vt.x,Vt.y,Vt.z)}toNonIndexed(){function e(l,c){const u=l.array,f=l.itemSize,p=l.normalized,h=new u.constructor(c.length*f);let m=0,g=0;for(let S=0,x=c.length;S<x;S++){l.isInterleavedBufferAttribute?m=c[S]*l.data.stride+l.offset:m=c[S]*f;for(let d=0;d<f;d++)h[g++]=u[m++]}return new Ii(h,f,p)}if(this.index===null)return Oe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Ln,i=this.index.array,r=this.attributes;for(const l in r){const c=r[l],u=e(c,i);n.setAttribute(l,u)}const s=this.morphAttributes;for(const l in s){const c=[],u=s[l];for(let f=0,p=u.length;f<p;f++){const h=u[f],m=e(h,i);c.push(m)}n.morphAttributes[l]=c}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let l=0,c=o.length;l<c;l++){const u=o[l];n.addGroup(u.start,u.count,u.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const u in c)c[u]!==void 0&&(e[u]=c[u]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const u=i[c];e.data.attributes[c]=u.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const u=this.morphAttributes[c],f=[];for(let p=0,h=u.length;p<h;p++){const m=u[p];f.push(m.toJSON(e.data))}f.length>0&&(r[c]=f,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const l=this.boundingSphere;return l!==null&&(e.data.boundingSphere=l.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const u in r){const f=r[u];this.setAttribute(u,f.clone(n))}const s=e.morphAttributes;for(const u in s){const f=[],p=s[u];for(let h=0,m=p.length;h<m;h++)f.push(p[h].clone(n));this.morphAttributes[u]=f}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let u=0,f=o.length;u<f;u++){const p=o[u];this.addGroup(p.start,p.count,p.materialIndex)}const l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ku=new G,kM=new G,OM=new ze;class ir{constructor(e=new G(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=ku.subVectors(i,n).cross(kM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const r=e.delta(ku),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(r,o)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||OM.getNormalMatrix(e),r=this.coplanarPoint(ku).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let BM=0;class sa extends is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:BM++}),this.uuid=So(),this.name="",this.type="Material",this.blending=ja,this.side=Yr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yv,this.blendDst=Kv,this.blendEquation=ys,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=uo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=oM,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gu,this.stencilZFail=gu,this.stencilZPass=gu,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Oe(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Oe(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const l in s){const c=s[l];delete c.metadata,o.push(c)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new qe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new ir().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Ze().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ze().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Ci=new G,Ou=new G,Qo=new G,el=new G;class v_{constructor(e=new G,n=new G(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ci)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Ci.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Ci.copy(this.origin).addScaledVector(this.direction,n),Ci.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Ou.copy(e).add(n).multiplyScalar(.5),Qo.copy(n).sub(e).normalize(),el.copy(this.origin).sub(Ou);const s=e.distanceTo(n)*.5,o=-this.direction.dot(Qo),l=el.dot(this.direction),c=-el.dot(Qo),u=el.lengthSq(),f=Math.abs(1-o*o);let p,h,m,g;if(f>0)if(p=o*c-l,h=o*l-c,g=s*f,p>=0)if(h>=-g)if(h<=g){const S=1/f;p*=S,h*=S,m=p*(p+o*h+2*l)+h*(o*p+h+2*c)+u}else h=s,p=Math.max(0,-(o*h+l)),m=-p*p+h*(h+2*c)+u;else h=-s,p=Math.max(0,-(o*h+l)),m=-p*p+h*(h+2*c)+u;else h<=-g?(p=Math.max(0,-(-o*s+l)),h=p>0?-s:Math.min(Math.max(-s,-c),s),m=-p*p+h*(h+2*c)+u):h<=g?(p=0,h=Math.min(Math.max(-s,-c),s),m=h*(h+2*c)+u):(p=Math.max(0,-(o*s+l)),h=p>0?s:Math.min(Math.max(-s,-c),s),m=-p*p+h*(h+2*c)+u);else h=o>0?-s:s,p=Math.max(0,-(o*h+l)),m=-p*p+h*(h+2*c)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(Ou).addScaledVector(Qo,h),m}intersectSphere(e,n){if(e.radius<0)return null;Ci.subVectors(e.center,this.origin);const i=Ci.dot(this.direction),r=Ci.dot(Ci)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),l=i-o,c=i+o;return c<0?null:l<0?this.at(c,n):this.at(l,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,l,c;const u=1/this.direction.x,f=1/this.direction.y,p=1/this.direction.z,h=this.origin;return u>=0?(i=(e.min.x-h.x)*u,r=(e.max.x-h.x)*u):(i=(e.max.x-h.x)*u,r=(e.min.x-h.x)*u),f>=0?(s=(e.min.y-h.y)*f,o=(e.max.y-h.y)*f):(s=(e.max.y-h.y)*f,o=(e.min.y-h.y)*f),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),p>=0?(l=(e.min.z-h.z)*p,c=(e.max.z-h.z)*p):(l=(e.max.z-h.z)*p,c=(e.min.z-h.z)*p),i>c||l>r)||((l>i||i!==i)&&(i=l),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Ci)!==null}intersectTriangle(e,n,i,r,s){const o=this.origin,l=this.direction,c=l.x,u=l.y,f=l.z,p=e.x-o.x,h=e.y-o.y,m=e.z-o.z,g=n.x-o.x,S=n.y-o.y,x=n.z-o.z,d=i.x-o.x,v=i.y-o.y,b=i.z-o.z,E=Math.abs(c),w=Math.abs(u),C=Math.abs(f);let T,_,A,R,P,D,U,F,B,Z,X,j;if(E>=w&&E>=C?(A=c,D=p,B=g,j=d,c>=0?(T=u,_=f,R=h,P=m,U=S,F=x,Z=v,X=b):(T=f,_=u,R=m,P=h,U=x,F=S,Z=b,X=v)):w>=C?(A=u,D=h,B=S,j=v,u>=0?(T=f,_=c,R=m,P=p,U=x,F=g,Z=b,X=d):(T=c,_=f,R=p,P=m,U=g,F=x,Z=d,X=b)):(A=f,D=m,B=x,j=b,f>=0?(T=c,_=u,R=p,P=h,U=g,F=S,Z=d,X=v):(T=u,_=c,R=h,P=p,U=S,F=g,Z=v,X=d)),A===0)return null;const z=T/A,$=_/A,Q=1/A,ce=R-z*D,Me=P-$*D,Ye=U-z*B,He=F-$*B,Ve=Z-z*j,J=X-$*j,ie=Ve*He-J*Ye,Se=ce*J-Me*Ve,Be=Ye*Me-He*ce;if(r){if(ie<0||Se<0||Be<0)return null}else if((ie<0||Se<0||Be<0)&&(ie>0||Se>0||Be>0))return null;const q=ie+Se+Be;if(q===0)return null;const le=Q*(ie*D+Se*B+Be*j);return(q>0?le<0:le>0)?null:this.at(le/q,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class np extends sa{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Er,this.combine=Zv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ex=new bt,Dr=new v_,tl=new Fc,bx=new G,nl=new G,il=new G,rl=new G,Bu=new G,sl=new G,Mx=new G,al=new G;class Nn extends qt{constructor(e=new Ln,n=new np){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const l=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const l=this.morphTargetInfluences;if(s&&l){sl.set(0,0,0);for(let c=0,u=s.length;c<u;c++){const f=l[c],p=s[c];f!==0&&(Bu.fromBufferAttribute(p,e),o?sl.addScaledVector(Bu,f):sl.addScaledVector(Bu.sub(n),f))}n.add(sl)}return n}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),tl.copy(i.boundingSphere),tl.applyMatrix4(s),Dr.copy(e.ray).recast(e.near),!(tl.containsPoint(Dr.origin)===!1&&(Dr.intersectSphere(tl,bx)===null||Dr.origin.distanceToSquared(bx)>(e.far-e.near)**2))&&(Ex.copy(s).invert(),Dr.copy(e.ray).applyMatrix4(Ex),!(i.boundingBox!==null&&Dr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Dr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,l=s.index,c=s.attributes.position,u=s.attributes.uv,f=s.attributes.uv1,p=s.attributes.normal,h=s.groups,m=s.drawRange;if(l!==null)if(Array.isArray(o))for(let g=0,S=h.length;g<S;g++){const x=h[g],d=o[x.materialIndex],v=Math.max(x.start,m.start),b=Math.min(l.count,Math.min(x.start+x.count,m.start+m.count));for(let E=v,w=b;E<w;E+=3){const C=l.getX(E),T=l.getX(E+1),_=l.getX(E+2);r=ol(this,d,e,i,u,f,p,C,T,_),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=x.materialIndex,n.push(r))}}else{const g=Math.max(0,m.start),S=Math.min(l.count,m.start+m.count);for(let x=g,d=S;x<d;x+=3){const v=l.getX(x),b=l.getX(x+1),E=l.getX(x+2);r=ol(this,o,e,i,u,f,p,v,b,E),r&&(r.faceIndex=Math.floor(x/3),n.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,S=h.length;g<S;g++){const x=h[g],d=o[x.materialIndex],v=Math.max(x.start,m.start),b=Math.min(c.count,Math.min(x.start+x.count,m.start+m.count));for(let E=v,w=b;E<w;E+=3){const C=E,T=E+1,_=E+2;r=ol(this,d,e,i,u,f,p,C,T,_),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=x.materialIndex,n.push(r))}}else{const g=Math.max(0,m.start),S=Math.min(c.count,m.start+m.count);for(let x=g,d=S;x<d;x+=3){const v=x,b=x+1,E=x+2;r=ol(this,o,e,i,u,f,p,v,b,E),r&&(r.faceIndex=Math.floor(x/3),n.push(r))}}}}function jM(t,e,n,i,r,s,o,l){let c;if(e.side===Sn?c=i.intersectTriangle(o,s,r,!0,l):c=i.intersectTriangle(r,s,o,e.side===Yr,l),c===null)return null;al.copy(l),al.applyMatrix4(t.matrixWorld);const u=n.ray.origin.distanceTo(al);return u<n.near||u>n.far?null:{distance:u,point:al.clone(),object:t}}function ol(t,e,n,i,r,s,o,l,c,u){t.getVertexPosition(l,nl),t.getVertexPosition(c,il),t.getVertexPosition(u,rl);const f=jM(t,e,n,i,nl,il,rl,Mx);if(f){const p=new G;Jn.getBarycoord(Mx,nl,il,rl,p),r&&(f.uv=Jn.getInterpolatedAttribute(r,l,c,u,p,new Ze)),s&&(f.uv1=Jn.getInterpolatedAttribute(s,l,c,u,p,new Ze)),o&&(f.normal=Jn.getInterpolatedAttribute(o,l,c,u,p,new G),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const h={a:l,b:c,c:u,normal:new G,materialIndex:0};Jn.getNormal(nl,il,rl,h.normal),f.face=h,f.barycoord=p}return f}class zM extends dn{constructor(e=null,n=1,i=1,r,s,o,l,c,u=Xt,f=Xt,p,h){super(null,o,l,c,u,f,r,s,p,h),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Pr=new Fc,VM=new Ze(.5,.5),ll=new G;class ip{constructor(e=new ir,n=new ir,i=new ir,r=new ir,s=new ir,o=new ir){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const l=this.planes;return l[0].copy(e),l[1].copy(n),l[2].copy(i),l[3].copy(r),l[4].copy(s),l[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=pi,i=!1){const r=this.planes,s=e.elements,o=s[0],l=s[1],c=s[2],u=s[3],f=s[4],p=s[5],h=s[6],m=s[7],g=s[8],S=s[9],x=s[10],d=s[11],v=s[12],b=s[13],E=s[14],w=s[15];if(r[0].setComponents(u-o,m-f,d-g,w-v).normalize(),r[1].setComponents(u+o,m+f,d+g,w+v).normalize(),r[2].setComponents(u+l,m+p,d+S,w+b).normalize(),r[3].setComponents(u-l,m-p,d-S,w-b).normalize(),i)r[4].setComponents(c,h,x,E).normalize(),r[5].setComponents(u-c,m-h,d-x,w-E).normalize();else if(r[4].setComponents(u-c,m-h,d-x,w-E).normalize(),n===pi)r[5].setComponents(u+c,m+h,d+x,w+E).normalize();else if(n===po)r[5].setComponents(c,h,x,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pr)}intersectsSprite(e){Pr.center.set(0,0,0);const n=VM.distanceTo(e.center);return Pr.radius=.7071067811865476+n,Pr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(ll.x=r.normal.x>0?e.max.x:e.min.x,ll.y=r.normal.y>0?e.max.y:e.min.y,ll.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ll)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class GM extends sa{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const dc=new G,fc=new G,wx=new bt,Sa=new v_,cl=new Fc,ju=new G,Cx=new G;class HM extends qt{constructor(e=new Ln,n=new GM){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)dc.fromBufferAttribute(n,r-1),fc.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=dc.distanceTo(fc);e.setAttribute("lineDistance",new kt(i,1))}else Oe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),cl.copy(i.boundingSphere),cl.applyMatrix4(r),cl.radius+=s,e.ray.intersectsSphere(cl)===!1)return;wx.copy(r).invert(),Sa.copy(e.ray).applyMatrix4(wx);const l=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,u=this.isLineSegments?2:1,f=i.index,h=i.attributes.position;if(f!==null){const m=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let S=m,x=g-1;S<x;S+=u){const d=f.getX(S),v=f.getX(S+1),b=ul(this,e,Sa,c,d,v,S);b&&n.push(b)}if(this.isLineLoop){const S=f.getX(g-1),x=f.getX(m),d=ul(this,e,Sa,c,S,x,g-1);d&&n.push(d)}}else{const m=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let S=m,x=g-1;S<x;S+=u){const d=ul(this,e,Sa,c,S,S+1,S);d&&n.push(d)}if(this.isLineLoop){const S=ul(this,e,Sa,c,g-1,m,g-1);S&&n.push(S)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const l=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=s}}}}}function ul(t,e,n,i,r,s,o){const l=t.geometry.attributes.position;if(dc.fromBufferAttribute(l,r),fc.fromBufferAttribute(l,s),n.distanceSqToSegment(dc,fc,ju,Cx)>i)return;ju.applyMatrix4(t.matrixWorld);const u=e.ray.origin.distanceTo(ju);if(!(u<e.near||u>e.far))return{distance:u,point:Cx.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}const Ax=new G,Tx=new G;class WM extends HM{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Ax.fromBufferAttribute(n,r),Tx.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Ax.distanceTo(Tx);e.setAttribute("lineDistance",new kt(i,1))}else Oe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class __ extends dn{constructor(e=[],n=Kr,i,r,s,o,l,c,u,f){super(e,n,i,r,s,o,l,c,u,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class mo extends dn{constructor(e,n,i=vi,r,s,o,l=Xt,c=Xt,u,f=zi,p=1){if(f!==zi&&f!==jr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:n,depth:p};super(h,r,s,o,l,c,f,i,u),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ep(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return n.compareFunction=this.compareFunction,n}}class XM extends mo{constructor(e,n=vi,i=Kr,r,s,o=Xt,l=Xt,c,u=zi){const f={width:e,height:e,depth:1},p=[f,f,f,f,f,f];super(e,e,n,i,r,s,o,l,c,u),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class y_ extends dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class bo extends Ln{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const l=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],u=[],f=[],p=[];let h=0,m=0;g("z","y","x",-1,-1,i,n,e,o,s,0),g("z","y","x",1,-1,i,n,-e,o,s,1),g("x","z","y",1,1,e,i,n,r,o,2),g("x","z","y",1,-1,e,i,-n,r,o,3),g("x","y","z",1,-1,e,n,i,r,s,4),g("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new kt(u,3)),this.setAttribute("normal",new kt(f,3)),this.setAttribute("uv",new kt(p,2));function g(S,x,d,v,b,E,w,C,T,_,A){const R=E/T,P=w/_,D=E/2,U=w/2,F=C/2,B=T+1,Z=_+1;let X=0,j=0;const z=new G;for(let $=0;$<Z;$++){const Q=$*P-U;for(let ce=0;ce<B;ce++){const Me=ce*R-D;z[S]=Me*v,z[x]=Q*b,z[d]=F,u.push(z.x,z.y,z.z),z[S]=0,z[x]=0,z[d]=C>0?1:-1,f.push(z.x,z.y,z.z),p.push(ce/T),p.push(1-$/_),X+=1}}for(let $=0;$<_;$++)for(let Q=0;Q<T;Q++){const ce=h+Q+B*$,Me=h+Q+B*($+1),Ye=h+(Q+1)+B*($+1),He=h+(Q+1)+B*$;c.push(ce,Me,He),c.push(Me,Ye,He),j+=6}l.addGroup(m,j,A),m+=j,h+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class rp extends Ln{constructor(e=1,n=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:i,thetaLength:r},n=Math.max(3,n);const s=[],o=[],l=[],c=[],u=new G,f=new Ze;o.push(0,0,0),l.push(0,0,1),c.push(.5,.5);for(let p=0,h=3;p<=n;p++,h+=3){const m=i+p/n*r;u.x=e*Math.cos(m),u.y=e*Math.sin(m),o.push(u.x,u.y,u.z),l.push(0,0,1),f.x=(o[h]/e+1)/2,f.y=(o[h+1]/e+1)/2,c.push(f.x,f.y)}for(let p=1;p<=n;p++)s.push(p,p+1,0);this.setIndex(s),this.setAttribute("position",new kt(o,3)),this.setAttribute("normal",new kt(l,3)),this.setAttribute("uv",new kt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rp(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class sp extends Ln{constructor(e=1,n=1,i=1,r=32,s=1,o=!1,l=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:l,thetaLength:c};const u=this;r=Math.floor(r),s=Math.floor(s);const f=[],p=[],h=[],m=[];let g=0;const S=[],x=i/2;let d=0;v(),o===!1&&(e>0&&b(!0),n>0&&b(!1)),this.setIndex(f),this.setAttribute("position",new kt(p,3)),this.setAttribute("normal",new kt(h,3)),this.setAttribute("uv",new kt(m,2));function v(){const E=new G,w=new G;let C=0;const T=(n-e)/i;for(let _=0;_<=s;_++){const A=[],R=_/s,P=R*(n-e)+e;for(let D=0;D<=r;D++){const U=D/r,F=U*c+l,B=Math.sin(F),Z=Math.cos(F);w.x=P*B,w.y=-R*i+x,w.z=P*Z,p.push(w.x,w.y,w.z),E.set(B,T,Z).normalize(),h.push(E.x,E.y,E.z),m.push(U,1-R),A.push(g++)}S.push(A)}for(let _=0;_<r;_++)for(let A=0;A<s;A++){const R=S[A][_],P=S[A+1][_],D=S[A+1][_+1],U=S[A][_+1];(e>0||A!==0)&&(f.push(R,P,U),C+=3),(n>0||A!==s-1)&&(f.push(P,D,U),C+=3)}u.addGroup(d,C,0),d+=C}function b(E){const w=g,C=new Ze,T=new G;let _=0;const A=E===!0?e:n,R=E===!0?1:-1;for(let D=1;D<=r;D++)p.push(0,x*R,0),h.push(0,R,0),m.push(.5,.5),g++;const P=g;for(let D=0;D<=r;D++){const F=D/r*c+l,B=Math.cos(F),Z=Math.sin(F);T.x=A*Z,T.y=x*R,T.z=A*B,p.push(T.x,T.y,T.z),h.push(0,R,0),C.x=B*.5+.5,C.y=Z*.5*R+.5,m.push(C.x,C.y),g++}for(let D=0;D<r;D++){const U=w+D,F=P+D;E===!0?f.push(F,F+1,U):f.push(F+1,F,U),_+=3}u.addGroup(d,_,E===!0?1:2),d+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new sp(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Lc extends Ln{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,l=Math.floor(i),c=Math.floor(r),u=l+1,f=c+1,p=e/l,h=n/c,m=[],g=[],S=[],x=[];for(let d=0;d<f;d++){const v=d*h-o;for(let b=0;b<u;b++){const E=b*p-s;g.push(E,-v,0),S.push(0,0,1),x.push(b/l),x.push(1-d/c)}}for(let d=0;d<c;d++)for(let v=0;v<l;v++){const b=v+u*d,E=v+u*(d+1),w=v+1+u*(d+1),C=v+1+u*d;m.push(b,E,C),m.push(E,w,C)}this.setIndex(m),this.setAttribute("position",new kt(g,3)),this.setAttribute("normal",new kt(S,3)),this.setAttribute("uv",new kt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Lc(e.width,e.height,e.widthSegments,e.heightSegments)}}class ap extends Ln{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,o=0,l=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:l},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const c=Math.min(o+l,Math.PI);let u=0;const f=[],p=new G,h=new G,m=[],g=[],S=[],x=[];for(let d=0;d<=i;d++){const v=[],b=d/i,E=o+b*l,w=e*Math.cos(E),C=Math.sqrt(e*e-w*w);let T=0;d===0&&o===0?T=.5/n:d===i&&c===Math.PI&&(T=-.5/n);for(let _=0;_<=n;_++){const A=_/n,R=r+A*s;p.x=-C*Math.cos(R),p.y=w,p.z=C*Math.sin(R),g.push(p.x,p.y,p.z),h.copy(p).normalize(),S.push(h.x,h.y,h.z),x.push(A+T,1-b),v.push(u++)}f.push(v)}for(let d=0;d<i;d++)for(let v=0;v<n;v++){const b=f[d][v+1],E=f[d][v],w=f[d+1][v],C=f[d+1][v+1];(d!==0||o>0)&&m.push(b,E,C),(d!==i-1||c<Math.PI)&&m.push(E,w,C)}this.setIndex(m),this.setAttribute("position",new kt(g,3)),this.setAttribute("normal",new kt(S,3)),this.setAttribute("uv",new kt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ap(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function Zs(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];if(Nx(r))r.isRenderTargetTexture?(Oe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(Nx(r[0])){const s=[];for(let o=0,l=r.length;o<l;o++)s[o]=r[o].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function on(t){const e={};for(let n=0;n<t.length;n++){const i=Zs(t[n]);for(const r in i)e[r]=i[r]}return e}function Nx(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function $M(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function S_(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const qM={clone:Zs,merge:on};var YM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,KM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class yi extends sa{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=YM,this.fragmentShader=KM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zs(e.uniforms),this.uniformsGroups=$M(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(const i in e.uniforms){const r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=n[r.value]||null;break;case"c":this.uniforms[i].value=new qe().setHex(r.value);break;case"v2":this.uniforms[i].value=new Ze().fromArray(r.value);break;case"v3":this.uniforms[i].value=new G().fromArray(r.value);break;case"v4":this.uniforms[i].value=new St().fromArray(r.value);break;case"m3":this.uniforms[i].value=new ze().fromArray(r.value);break;case"m4":this.uniforms[i].value=new bt().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class ZM extends yi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class E_ extends sa{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=If,this.normalScale=new Ze(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Er,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class JM extends E_{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ze(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(n){this.ior=(1+.4*n)/(1-.4*n)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new qe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new qe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new qe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class QM extends sa{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=sM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class e2 extends sa{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class op extends qt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=n}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}const zu=new bt,Rx=new G,Dx=new G;class b_{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ze(512,512),this.mapType=An,this.map=null,this.mapPass=null,this.matrix=new bt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ip,this._frameExtents=new Ze(1,1),this._viewportCount=1,this._viewports=[new St(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera;Rx.setFromMatrixPosition(e.matrixWorld),n.position.copy(Rx),Dx.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Dx),n.updateMatrixWorld(),this._updateMatrix(n,this.matrix,this._frustum)}_updateMatrix(e,n,i,r){zu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(zu,e.coordinateSystem,e.reversedDepth);const s=this._frameExtents,o=r?r.z/s.x:1,l=r?r.w/s.y:1,c=r?r.x/s.x:0,u=r?r.y/s.y:0;e.coordinateSystem===po||e.reversedDepth?n.set(.5*o,0,0,.5*o+c,0,.5*l,0,.5*l+u,0,0,1,0,0,0,0,1):n.set(.5*o,0,0,.5*o+c,0,.5*l,0,.5*l+u,0,0,.5,.5,0,0,0,1),n.multiply(zu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const dl=new G,fl=new ra,oi=new G;class M_ extends qt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new bt,this.projectionMatrix=new bt,this.projectionMatrixInverse=new bt,this.coordinateSystem=pi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(dl,fl,oi),oi.x===1&&oi.y===1&&oi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(dl,fl,oi.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(dl,fl,oi),oi.x===1&&oi.y===1&&oi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(dl,fl,oi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Qi=new G,Px=new Ze,Fx=new Ze;class Cn extends M_{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Uf*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(vu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Uf*2*Math.atan(Math.tan(vu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Qi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qi.x,Qi.y).multiplyScalar(-e/Qi.z),Qi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Qi.x,Qi.y).multiplyScalar(-e/Qi.z)}getViewSize(e,n){return this.getViewBounds(e,Px,Fx),n.subVectors(Fx,Px)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(vu*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,u=o.fullHeight;s+=o.offsetX*r/c,n-=o.offsetY*i/u,r*=o.width/c,i*=o.height/u}const l=this.filmOffset;l!==0&&(s+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class t2 extends b_{constructor(){super(new Cn(90,1,.5,500)),this.isPointLightShadow=!0}}class Lx extends op{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new t2}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.distance=this.distance,n.object.decay=this.decay,n.object.shadow=this.shadow.toJSON(),n}}class lp extends M_{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,l=r+n,c=r-n;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=u*this.view.offsetX,o=s+u*this.view.width,l-=f*this.view.offsetY,c=l-f*this.view.height}this.projectionMatrix.makeOrthographic(s,o,l,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class n2 extends b_{constructor(){super(new lp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class i2 extends op{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qt.DEFAULT_UP),this.updateMatrix(),this.target=new qt,this.shadow=new n2}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}class r2 extends op{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const gs=-90,vs=1;class s2 extends qt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Cn(gs,vs,e,n);r.layers=this.layers,this.add(r);const s=new Cn(gs,vs,e,n);s.layers=this.layers,this.add(s);const o=new Cn(gs,vs,e,n);o.layers=this.layers,this.add(o);const l=new Cn(gs,vs,e,n);l.layers=this.layers,this.add(l);const c=new Cn(gs,vs,e,n);c.layers=this.layers,this.add(c);const u=new Cn(gs,vs,e,n);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,l,c]=n;for(const u of n)this.remove(u);if(e===pi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===po)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of n)this.add(u),u.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,l,c,u,f]=this.children,p=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let x=!1;e.isWebGLRenderer===!0?x=e.state.buffers.depth.getReversed():x=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,3,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),e.setRenderTarget(i,4,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),i.texture.generateMipmaps=S,e.setRenderTarget(i,5,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,f),e.setRenderTarget(p,h,m),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class a2 extends Cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const hp=class hp{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){const s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};hp.prototype.isMatrix2=!0;let Ix=hp;function Ux(t,e,n,i){const r=o2(i);switch(n){case c_:return t*e;case d_:return t*e/r.components*r.byteLength;case Yh:return t*e/r.components*r.byteLength;case Zr:return t*e*2/r.components*r.byteLength;case Kh:return t*e*2/r.components*r.byteLength;case u_:return t*e*3/r.components*r.byteLength;case Qn:return t*e*4/r.components*r.byteLength;case Zh:return t*e*4/r.components*r.byteLength;case Tl:case Nl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Rl:case Dl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case af:case lf:return Math.max(t,16)*Math.max(e,8)/4;case sf:case of:return Math.max(t,8)*Math.max(e,8)/2;case cf:case uf:case ff:case hf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case df:case ac:case pf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case mf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case xf:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case gf:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case vf:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case _f:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case yf:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Sf:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Ef:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case bf:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Mf:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case wf:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Cf:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Af:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Tf:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Nf:case Rf:case Df:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Pf:case Ff:return Math.ceil(t/4)*Math.ceil(e/4)*8;case oc:case Lf:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function o2(t){switch(t){case An:case s_:return{byteLength:1,components:1};case fo:case a_:case _i:return{byteLength:2,components:1};case $h:case qh:return{byteLength:2,components:4};case vi:case Xh:case hi:return{byteLength:4,components:1};case o_:case l_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hh}}));typeof window<"u"&&(window.__THREE__?Oe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hh);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function w_(){let t=null,e=!1,n=null,i=null;function r(s,o){i=t.requestAnimationFrame(r),n(s,o)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function l2(t){const e=new WeakMap;function n(l,c){const u=l.array,f=l.usage,p=u.byteLength,h=t.createBuffer();t.bindBuffer(c,h),t.bufferData(c,u,f),l.onUploadCallback();let m;if(u instanceof Float32Array)m=t.FLOAT;else if(typeof Float16Array<"u"&&u instanceof Float16Array)m=t.HALF_FLOAT;else if(u instanceof Uint16Array)l.isFloat16BufferAttribute?m=t.HALF_FLOAT:m=t.UNSIGNED_SHORT;else if(u instanceof Int16Array)m=t.SHORT;else if(u instanceof Uint32Array)m=t.UNSIGNED_INT;else if(u instanceof Int32Array)m=t.INT;else if(u instanceof Int8Array)m=t.BYTE;else if(u instanceof Uint8Array)m=t.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)m=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:h,type:m,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:p}}function i(l,c,u){const f=c.array,p=c.updateRanges;if(t.bindBuffer(u,l),p.length===0)t.bufferSubData(u,0,f);else{p.sort((m,g)=>m.start-g.start);let h=0;for(let m=1;m<p.length;m++){const g=p[h],S=p[m];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++h,p[h]=S)}p.length=h+1;for(let m=0,g=p.length;m<g;m++){const S=p[m];t.bufferSubData(u,S.start*f.BYTES_PER_ELEMENT,f,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(l){return l.isInterleavedBufferAttribute&&(l=l.data),e.get(l)}function s(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=e.get(l);c&&(t.deleteBuffer(c.buffer),e.delete(l))}function o(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const f=e.get(l);(!f||f.version<l.version)&&e.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const u=e.get(l);if(u===void 0)e.set(l,n(l,c));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,l,c),u.version=l.version}}return{get:r,remove:s,update:o}}var c2=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,u2=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,d2=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,f2=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,h2=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,p2=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,m2=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,x2=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,g2=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,v2=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_2=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,y2=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,S2=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,E2=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,b2=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,M2=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,w2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,C2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,A2=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,T2=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,N2=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,R2=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,D2=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,P2=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,F2=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,L2=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,I2=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,U2=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,k2=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,O2=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,B2="gl_FragColor = linearToOutputTexel( gl_FragColor );",j2=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,z2=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,V2=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,G2=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,H2=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,W2=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,X2=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$2=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,q2=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Y2=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,K2=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Z2=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,J2=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Q2=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ew=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,tw=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,nw=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,iw=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,rw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sw=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,aw=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ow=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lw=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,cw=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,uw=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,dw=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,fw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_w=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ew=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ww=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Cw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Aw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Tw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Nw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Pw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Fw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Lw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Iw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Uw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ow=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Bw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ww=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Xw=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$w=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,qw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Yw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Kw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Zw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Qw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,eC=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tC=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,nC=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,iC=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,rC=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,sC=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,aC=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,oC=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,lC=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cC=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,uC=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fC=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pC=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mC=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,xC=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,gC=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,vC=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,_C=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yC=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,SC=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,EC=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bC=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,MC=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wC=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,CC=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AC=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,TC=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,NC=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,RC=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,DC=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,PC=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,FC=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,LC=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IC=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,UC=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kC=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,OC=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,BC=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jC=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zC=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,VC=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:c2,alphahash_pars_fragment:u2,alphamap_fragment:d2,alphamap_pars_fragment:f2,alphatest_fragment:h2,alphatest_pars_fragment:p2,aomap_fragment:m2,aomap_pars_fragment:x2,batching_pars_vertex:g2,batching_vertex:v2,begin_vertex:_2,beginnormal_vertex:y2,bsdfs:S2,iridescence_fragment:E2,bumpmap_pars_fragment:b2,clipping_planes_fragment:M2,clipping_planes_pars_fragment:w2,clipping_planes_pars_vertex:C2,clipping_planes_vertex:A2,color_fragment:T2,color_pars_fragment:N2,color_pars_vertex:R2,color_vertex:D2,common:P2,cube_uv_reflection_fragment:F2,defaultnormal_vertex:L2,displacementmap_pars_vertex:I2,displacementmap_vertex:U2,emissivemap_fragment:k2,emissivemap_pars_fragment:O2,colorspace_fragment:B2,colorspace_pars_fragment:j2,envmap_fragment:z2,envmap_common_pars_fragment:V2,envmap_pars_fragment:G2,envmap_pars_vertex:H2,envmap_physical_pars_fragment:tw,envmap_vertex:W2,fog_vertex:X2,fog_pars_vertex:$2,fog_fragment:q2,fog_pars_fragment:Y2,gradientmap_pars_fragment:K2,lightmap_pars_fragment:Z2,lights_lambert_fragment:J2,lights_lambert_pars_fragment:Q2,lights_pars_begin:ew,lights_toon_fragment:nw,lights_toon_pars_fragment:iw,lights_phong_fragment:rw,lights_phong_pars_fragment:sw,lights_physical_fragment:aw,lights_physical_pars_fragment:ow,lights_fragment_begin:lw,lights_fragment_maps:cw,lights_fragment_end:uw,lightprobes_pars_fragment:dw,logdepthbuf_fragment:fw,logdepthbuf_pars_fragment:hw,logdepthbuf_pars_vertex:pw,logdepthbuf_vertex:mw,map_fragment:xw,map_pars_fragment:gw,map_particle_fragment:vw,map_particle_pars_fragment:_w,metalnessmap_fragment:yw,metalnessmap_pars_fragment:Sw,morphinstance_vertex:Ew,morphcolor_vertex:bw,morphnormal_vertex:Mw,morphtarget_pars_vertex:ww,morphtarget_vertex:Cw,normal_fragment_begin:Aw,normal_fragment_maps:Tw,normal_pars_fragment:Nw,normal_pars_vertex:Rw,normal_vertex:Dw,normalmap_pars_fragment:Pw,clearcoat_normal_fragment_begin:Fw,clearcoat_normal_fragment_maps:Lw,clearcoat_pars_fragment:Iw,iridescence_pars_fragment:Uw,opaque_fragment:kw,packing:Ow,premultiplied_alpha_fragment:Bw,project_vertex:jw,dithering_fragment:zw,dithering_pars_fragment:Vw,roughnessmap_fragment:Gw,roughnessmap_pars_fragment:Hw,shadowmap_pars_fragment:Ww,shadowmap_pars_vertex:Xw,shadowmap_vertex:$w,shadowmask_pars_fragment:qw,skinbase_vertex:Yw,skinning_pars_vertex:Kw,skinning_vertex:Zw,skinnormal_vertex:Jw,specularmap_fragment:Qw,specularmap_pars_fragment:eC,tonemapping_fragment:tC,tonemapping_pars_fragment:nC,transmission_fragment:iC,transmission_pars_fragment:rC,uv_pars_fragment:sC,uv_pars_vertex:aC,uv_vertex:oC,worldpos_vertex:lC,background_vert:cC,background_frag:uC,backgroundCube_vert:dC,backgroundCube_frag:fC,cube_vert:hC,cube_frag:pC,depth_vert:mC,depth_frag:xC,distance_vert:gC,distance_frag:vC,equirect_vert:_C,equirect_frag:yC,linedashed_vert:SC,linedashed_frag:EC,meshbasic_vert:bC,meshbasic_frag:MC,meshlambert_vert:wC,meshlambert_frag:CC,meshmatcap_vert:AC,meshmatcap_frag:TC,meshnormal_vert:NC,meshnormal_frag:RC,meshphong_vert:DC,meshphong_frag:PC,meshphysical_vert:FC,meshphysical_frag:LC,meshtoon_vert:IC,meshtoon_frag:UC,points_vert:kC,points_frag:OC,shadow_vert:BC,shadow_frag:jC,sprite_vert:zC,sprite_frag:VC},xe={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new Ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},ui={basic:{uniforms:on([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:on([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new qe(0)},envMapIntensity:{value:1}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:on([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:on([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:on([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new qe(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:on([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:on([xe.points,xe.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:on([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:on([xe.common,xe.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:on([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:on([xe.sprite,xe.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distance:{uniforms:on([xe.common,xe.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distance_vert,fragmentShader:Xe.distance_frag},shadow:{uniforms:on([xe.lights,xe.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};ui.physical={uniforms:on([ui.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const hl={r:0,b:0,g:0},GC=new bt,C_=new ze;C_.set(-1,0,0,0,1,0,0,0,1);function HC(t,e,n,i,r,s){const o=new qe(0);let l=r===!0?0:1,c,u,f=null,p=0,h=null;function m(v){let b=v.isScene===!0?v.background:null;if(b&&b.isTexture){const E=v.backgroundBlurriness>0;b=e.get(b,E)}return b}function g(v){let b=!1;const E=m(v);E===null?x(o,l):E&&E.isColor&&(x(E,1),b=!0);const w=t.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function S(v,b){const E=m(b);E&&(E.isCubeTexture||E.mapping===Pc)?(u===void 0&&(u=new Nn(new bo(1,1,1),new yi({name:"BackgroundCubeMaterial",uniforms:Zs(ui.backgroundCube.uniforms),vertexShader:ui.backgroundCube.vertexShader,fragmentShader:ui.backgroundCube.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,C,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=E,u.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(GC.makeRotationFromEuler(b.backgroundRotation)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&u.material.uniforms.backgroundRotation.value.premultiply(C_),u.material.toneMapped=et.getTransfer(E.colorSpace)!==lt,(f!==E||p!==E.version||h!==t.toneMapping)&&(u.material.needsUpdate=!0,f=E,p=E.version,h=t.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new Nn(new Lc(2,2),new yi({name:"BackgroundMaterial",uniforms:Zs(ui.background.uniforms),vertexShader:ui.background.vertexShader,fragmentShader:ui.background.fragmentShader,side:Yr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=et.getTransfer(E.colorSpace)!==lt,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||p!==E.version||h!==t.toneMapping)&&(c.material.needsUpdate=!0,f=E,p=E.version,h=t.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function x(v,b){v.getRGB(hl,S_(t)),n.buffers.color.setClear(hl.r,hl.g,hl.b,b,s)}function d(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,b=1){o.set(v),l=b,x(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,x(o,l)},render:g,addToRenderList:S,dispose:d}}function WC(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,o=!1;function l(P,D,U,F,B){let Z=!1;const X=p(P,F,U,D);s!==X&&(s=X,u(s.object)),Z=m(P,F,U,B),Z&&g(P,F,U,B),B!==null&&e.update(B,t.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,E(P,D,U,F),B!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function c(){return t.createVertexArray()}function u(P){return t.bindVertexArray(P)}function f(P){return t.deleteVertexArray(P)}function p(P,D,U,F){const B=F.wireframe===!0;let Z=i[D.id];Z===void 0&&(Z={},i[D.id]=Z);const X=P.isInstancedMesh===!0?P.id:0;let j=Z[X];j===void 0&&(j={},Z[X]=j);let z=j[U.id];z===void 0&&(z={},j[U.id]=z);let $=z[B];return $===void 0&&($=h(c()),z[B]=$),$}function h(P){const D=[],U=[],F=[];for(let B=0;B<n;B++)D[B]=0,U[B]=0,F[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:U,attributeDivisors:F,object:P,attributes:{},index:null}}function m(P,D,U,F){const B=s.attributes,Z=D.attributes;let X=0;const j=U.getAttributes();for(const z in j)if(j[z].location>=0){const Q=B[z];let ce=Z[z];if(ce===void 0&&(z==="instanceMatrix"&&P.instanceMatrix&&(ce=P.instanceMatrix),z==="instanceColor"&&P.instanceColor&&(ce=P.instanceColor)),Q===void 0||Q.attribute!==ce||ce&&Q.data!==ce.data)return!0;X++}return s.attributesNum!==X||s.index!==F}function g(P,D,U,F){const B={},Z=D.attributes;let X=0;const j=U.getAttributes();for(const z in j)if(j[z].location>=0){let Q=Z[z];Q===void 0&&(z==="instanceMatrix"&&P.instanceMatrix&&(Q=P.instanceMatrix),z==="instanceColor"&&P.instanceColor&&(Q=P.instanceColor));const ce={};ce.attribute=Q,Q&&Q.data&&(ce.data=Q.data),B[z]=ce,X++}s.attributes=B,s.attributesNum=X,s.index=F}function S(){const P=s.newAttributes;for(let D=0,U=P.length;D<U;D++)P[D]=0}function x(P){d(P,0)}function d(P,D){const U=s.newAttributes,F=s.enabledAttributes,B=s.attributeDivisors;U[P]=1,F[P]===0&&(t.enableVertexAttribArray(P),F[P]=1),B[P]!==D&&(t.vertexAttribDivisor(P,D),B[P]=D)}function v(){const P=s.newAttributes,D=s.enabledAttributes;for(let U=0,F=D.length;U<F;U++)D[U]!==P[U]&&(t.disableVertexAttribArray(U),D[U]=0)}function b(P,D,U,F,B,Z,X){X===!0?t.vertexAttribIPointer(P,D,U,B,Z):t.vertexAttribPointer(P,D,U,F,B,Z)}function E(P,D,U,F){S();const B=F.attributes,Z=U.getAttributes(),X=D.defaultAttributeValues;for(const j in Z){const z=Z[j];if(z.location>=0){let $=B[j];if($===void 0&&(j==="instanceMatrix"&&P.instanceMatrix&&($=P.instanceMatrix),j==="instanceColor"&&P.instanceColor&&($=P.instanceColor)),$!==void 0){const Q=$.normalized,ce=$.itemSize,Me=e.get($);if(Me===void 0)continue;const Ye=Me.buffer,He=Me.type,Ve=Me.bytesPerElement,J=He===t.INT||He===t.UNSIGNED_INT||$.gpuType===Xh;if($.isInterleavedBufferAttribute){const ie=$.data,Se=ie.stride,Be=$.offset;if(ie.isInstancedInterleavedBuffer){for(let q=0;q<z.locationSize;q++)d(z.location+q,ie.meshPerAttribute);P.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let q=0;q<z.locationSize;q++)x(z.location+q);t.bindBuffer(t.ARRAY_BUFFER,Ye);for(let q=0;q<z.locationSize;q++)b(z.location+q,ce/z.locationSize,He,Q,Se*Ve,(Be+ce/z.locationSize*q)*Ve,J)}else{if($.isInstancedBufferAttribute){for(let ie=0;ie<z.locationSize;ie++)d(z.location+ie,$.meshPerAttribute);P.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ie=0;ie<z.locationSize;ie++)x(z.location+ie);t.bindBuffer(t.ARRAY_BUFFER,Ye);for(let ie=0;ie<z.locationSize;ie++)b(z.location+ie,ce/z.locationSize,He,Q,ce*Ve,ce/z.locationSize*ie*Ve,J)}}else if(X!==void 0){const Q=X[j];if(Q!==void 0)switch(Q.length){case 2:t.vertexAttrib2fv(z.location,Q);break;case 3:t.vertexAttrib3fv(z.location,Q);break;case 4:t.vertexAttrib4fv(z.location,Q);break;default:t.vertexAttrib1fv(z.location,Q)}}}}v()}function w(){A();for(const P in i){const D=i[P];for(const U in D){const F=D[U];for(const B in F){const Z=F[B];for(const X in Z)f(Z[X].object),delete Z[X];delete F[B]}}delete i[P]}}function C(P){if(i[P.id]===void 0)return;const D=i[P.id];for(const U in D){const F=D[U];for(const B in F){const Z=F[B];for(const X in Z)f(Z[X].object),delete Z[X];delete F[B]}}delete i[P.id]}function T(P){for(const D in i){const U=i[D];for(const F in U){const B=U[F];if(B[P.id]===void 0)continue;const Z=B[P.id];for(const X in Z)f(Z[X].object),delete Z[X];delete B[P.id]}}}function _(P){for(const D in i){const U=i[D],F=P.isInstancedMesh===!0?P.id:0,B=U[F];if(B!==void 0){for(const Z in B){const X=B[Z];for(const j in X)f(X[j].object),delete X[j];delete B[Z]}delete U[F],Object.keys(U).length===0&&delete i[D]}}}function A(){R(),o=!0,s!==r&&(s=r,u(s.object))}function R(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:l,reset:A,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:C,releaseStatesOfObject:_,releaseStatesOfProgram:T,initAttributes:S,enableAttribute:x,disableUnusedAttributes:v}}function XC(t,e,n){let i;function r(c){i=c}function s(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function o(c,u,f){f!==0&&(t.drawArraysInstanced(i,c,u,f),n.update(u,i,f))}function l(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,f);let h=0;for(let m=0;m<f;m++)h+=u[m];n.update(h,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=l}function $C(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(T){return!(T!==Qn&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(T){const _=T===_i&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==An&&T!==hi&&!_&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE))}function c(T){if(T==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let u=n.precision!==void 0?n.precision:"highp";const f=c(u);f!==u&&(Oe("WebGLRenderer:",u,"not supported, using",f,"instead."),u=f);const p=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&Oe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=t.getParameter(t.MAX_TEXTURE_SIZE),x=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),d=t.getParameter(t.MAX_VERTEX_ATTRIBS),v=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),b=t.getParameter(t.MAX_VARYING_VECTORS),E=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),w=t.getParameter(t.MAX_SAMPLES),C=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:l,precision:u,logarithmicDepthBuffer:p,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:x,maxAttributes:d,maxVertexUniforms:v,maxVaryings:b,maxFragmentUniforms:E,maxSamples:w,samples:C}}function qC(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new ir,l=new ze,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){const m=p.length!==0||h||i!==0||r;return r=h,i=p.length,m},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,h){n=f(p,h,0)},this.setState=function(p,h,m){const g=p.clippingPlanes,S=p.clipIntersection,x=p.clipShadows,d=t.get(p);if(!r||g===null||g.length===0||s&&!x)s?f(null):u();else{const v=s?0:i,b=v*4;let E=d.clippingState||null;c.value=E,E=f(g,h,b,m);for(let w=0;w!==b;++w)E[w]=n[w];d.clippingState=E,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=v}};function u(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(p,h,m,g){const S=p!==null?p.length:0;let x=null;if(S!==0){if(x=c.value,g!==!0||x===null){const d=m+S*4,v=h.matrixWorldInverse;l.getNormalMatrix(v),(x===null||x.length<d)&&(x=new Float32Array(d));for(let b=0,E=m;b!==S;++b,E+=4)o.copy(p[b]).applyMatrix4(v,l),o.normal.toArray(x,E),x[E+3]=o.constant}c.value=x,c.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,x}}const Fs=4,YC=6,KC=20,ZC=256,Ea=new lp,kx=new qe;let Vu=null,Gu=0,Hu=0,Wu=!1;const JC=new G,Fr=new G;class Ox{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){const{size:o=256,position:l=JC}=s;Vu=this._renderer.getRenderTarget(),Gu=this._renderer.getActiveCubeFace(),Hu=this._renderer.getActiveMipmapLevel(),Wu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,l),n>0&&this._blur(c,0,0,n),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zx(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Vu,Gu,Hu),this._renderer.xr.enabled=Wu,e.scissorTest=!1,_s(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Kr||e.mapping===Ks?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vu=this._renderer.getRenderTarget(),Gu=this._renderer.getActiveCubeFace(),Hu=this._renderer.getActiveMipmapLevel(),Wu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:_i,format:Qn,colorSpace:lc,depthBuffer:!1},r=Bx(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bx(e,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=QC(s)),this._blurMaterial=tA(s,e,n),this._ggxMaterial=eA(s,e,n)}return r}_compileMaterial(e){const n=new Nn(new Ln,e);this._renderer.compile(n,Ea)}_sceneToCubeUV(e,n,i,r,s){const c=new Cn(90,1,n,i),u=[1,-1,1,1,1,1],f=[1,1,1,-1,-1,-1],p=this._renderer,h=p.autoClear,m=p.toneMapping;p.getClearColor(kx),p.toneMapping=gi,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(r),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Nn(new bo,new np({name:"PMREM.Background",side:Sn,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,x=S.material;let d=!1;const v=e.background;v?v.isColor&&(x.color.copy(v),e.background=null,d=!0):(x.color.copy(kx),d=!0);for(let b=0;b<6;b++){const E=b%3;E===0?(c.up.set(0,u[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+f[b],s.y,s.z)):E===1?(c.up.set(0,0,u[b]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+f[b],s.z)):(c.up.set(0,u[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+f[b]));const w=this._cubeSize;_s(r,E*w,b>2?w:0,w,w),p.setRenderTarget(r),d&&p.render(S,c),p.render(e,c)}p.toneMapping=m,p.autoClear=h,e.background=v}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Kr||e.mapping===Ks;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=zx()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jx());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const l=s.uniforms;l.envMap.value=e;const c=this._cubeSize;_s(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(o,Ea)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,l=this._lodMeshes[i];l.material=o;const c=o.uniforms,u=i/(this._lodMeshes.length-1),f=n/(this._lodMeshes.length-1),p=Math.sqrt(u*u-f*f),h=u*1.25,m=p*h,{_lodMax:g}=this,S=this._sizeLods[i],x=3*S*(i>g-Fs?i-g+Fs:0),d=4*(this._cubeSize-S);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=g-n,_s(s,x,d,3*S,2*S),r.setRenderTarget(s),r.render(l,Ea),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=g-i,_s(e,x,d,3*S,2*S),r.setRenderTarget(e),r.render(l,Ea)}_blur(e,n,i,r){const s=this._pingPongRenderTarget,o=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,n,i,o),this._blurPass(s,e,i,i,o)}_blurPass(e,n,i,r,s){const o=this._renderer,l=this._blurMaterial,c=this._lodMeshes[r];c.material=l;const u=l.uniforms;u.envMap.value=e.texture,u.sigma.value=s,u.mipInt.value=this._lodMax-i;const f=this._sizeLods[r],p=3*f*(r>this._lodMax-Fs?r-this._lodMax+Fs:0),h=4*(this._cubeSize-f);_s(n,p,h,3*f,2*f),o.setRenderTarget(n),o.render(c,Ea)}}function QC(t){const e=[],n=[];let i=t;const r=t-Fs+1+YC;for(let s=0;s<r;s++){const o=Math.pow(2,i);e.push(o);const l=1/(o-2),c=-l,u=1+l,f=[c,c,u,c,u,u,c,c,u,u,c,u],p=6,h=6,m=3,g=new Float32Array(m*h*p),S=new Float32Array(m*h*p);for(let d=0;d<p;d++){const v=d%3*2/3-1,b=d>2?0:-1,E=[v,b,0,v+2/3,b,0,v+2/3,b+1,0,v,b,0,v+2/3,b+1,0,v,b+1,0];g.set(E,m*h*d);for(let w=0;w<h;w++){const C=f[w*2]*2-1,T=f[w*2+1]*2-1;d===0?Fr.set(1,T,C):d===1?Fr.set(-C,1,-T):d===2?Fr.set(-C,T,1):d===3?Fr.set(-1,T,-C):d===4?Fr.set(-C,-1,T):Fr.set(C,T,-1),Fr.toArray(S,(d*h+w)*m)}}const x=new Ln;x.setAttribute("position",new Ii(g,m)),x.setAttribute("outputDirection",new Ii(S,m)),n.push(new Nn(x,null)),i>Fs&&i--}return{lodMeshes:n,sizeLods:e}}function Bx(t,e,n){const i=new ni(t,e,n);return i.texture.mapping=Pc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function _s(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function eA(t,e,n){return new yi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ZC,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ic(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function tA(t,e,n){return new yi({name:"SphericalGaussianBlur",defines:{SAMPLES:KC,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Ic(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function jx(){return new yi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function zx(){return new yi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function Ic(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class A_ extends ni{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new __(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new bo(5,5,5),s=new yi({name:"CubemapFromEquirect",uniforms:Zs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Sn,blending:Fi});s.uniforms.tEquirect.value=n;const o=new Nn(r,s),l=n.minFilter;return n.minFilter===Br&&(n.minFilter=rn),new s2(1,10,this).update(e,o),n.minFilter=l,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}function nA(t){let e=new WeakMap,n=new WeakMap,i=null;function r(h,m=!1){return h==null?null:m?o(h):s(h)}function s(h){if(h&&h.isTexture){const m=h.mapping;if(m===pu||m===mu)if(e.has(h)){const g=e.get(h).texture;return l(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const S=new A_(g.height);return S.fromEquirectangularTexture(t,h),e.set(h,S),h.addEventListener("dispose",u),l(S.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){const m=h.mapping,g=m===pu||m===mu,S=m===Kr||m===Ks;if(g||S){let x=n.get(h);const d=x!==void 0?x.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==d)return i===null&&(i=new Ox(t)),x=g?i.fromEquirectangular(h,x):i.fromCubemap(h,x),x.texture.pmremVersion=h.pmremVersion,n.set(h,x),x.texture;if(x!==void 0)return x.texture;{const v=h.image;return g&&v&&v.height>0||S&&v&&c(v)?(i===null&&(i=new Ox(t)),x=g?i.fromEquirectangular(h):i.fromCubemap(h),x.texture.pmremVersion=h.pmremVersion,n.set(h,x),h.addEventListener("dispose",f),x.texture):null}}}return h}function l(h,m){return m===pu?h.mapping=Kr:m===mu&&(h.mapping=Ks),h}function c(h){let m=0;const g=6;for(let S=0;S<g;S++)h[S]!==void 0&&m++;return m===g}function u(h){const m=h.target;m.removeEventListener("dispose",u);const g=e.get(m);g!==void 0&&(e.delete(m),g.dispose())}function f(h){const m=h.target;m.removeEventListener("dispose",f);const g=n.get(m);g!==void 0&&(n.delete(m),g.dispose())}function p(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:p}}function iA(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&js("WebGLRenderer: "+i+" extension not supported."),r}}}function rA(t,e,n,i){const r={},s=new WeakMap;function o(p){const h=p.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete r[h.id];const m=s.get(h);m&&(e.remove(m),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function l(p,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,n.memory.geometries++),h}function c(p){const h=p.attributes;for(const m in h)e.update(h[m],t.ARRAY_BUFFER)}function u(p){const h=[],m=p.index,g=p.attributes.position;let S=0;if(g===void 0)return;if(m!==null){const v=m.array;S=m.version;for(let b=0,E=v.length;b<E;b+=3){const w=v[b+0],C=v[b+1],T=v[b+2];h.push(w,C,C,T,T,w)}}else{const v=g.array;S=g.version;for(let b=0,E=v.length/3-1;b<E;b+=3){const w=b+0,C=b+1,T=b+2;h.push(w,C,C,T,T,w)}}const x=new(g.count>=65535?g_:x_)(h,1);x.version=S;const d=s.get(p);d&&e.remove(d),s.set(p,x)}function f(p){const h=s.get(p);if(h){const m=p.index;m!==null&&h.version<m.version&&u(p)}else u(p);return s.get(p)}return{get:l,update:c,getWireframeAttribute:f}}function sA(t,e,n){let i;function r(p){i=p}let s,o;function l(p){s=p.type,o=p.bytesPerElement}function c(p,h){t.drawElements(i,h,s,p*o),n.update(h,i,1)}function u(p,h,m){m!==0&&(t.drawElementsInstanced(i,h,s,p*o,m),n.update(h,i,m))}function f(p,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,p,0,m);let S=0;for(let x=0;x<m;x++)S+=h[x];n.update(S,i,1)}this.setMode=r,this.setIndex=l,this.render=c,this.renderInstances=u,this.renderMultiDraw=f}function aA(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,l){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=l*(s/3);break;case t.LINES:n.lines+=l*(s/2);break;case t.LINE_STRIP:n.lines+=l*(s-1);break;case t.LINE_LOOP:n.lines+=l*s;break;case t.POINTS:n.points+=l*s;break;default:rt("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function oA(t,e,n){const i=new WeakMap,r=new St;function s(o,l,c){const u=o.morphTargetInfluences,f=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,p=f!==void 0?f.length:0;let h=i.get(l);if(h===void 0||h.count!==p){let R=function(){_.dispose(),i.delete(l),l.removeEventListener("dispose",R)};var m=R;h!==void 0&&h.texture.dispose();const g=l.morphAttributes.position!==void 0,S=l.morphAttributes.normal!==void 0,x=l.morphAttributes.color!==void 0,d=l.morphAttributes.position||[],v=l.morphAttributes.normal||[],b=l.morphAttributes.color||[];let E=0;g===!0&&(E=1),S===!0&&(E=2),x===!0&&(E=3);let w=l.attributes.position.count*E,C=1;w>e.maxTextureSize&&(C=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const T=new Float32Array(w*C*4*p),_=new h_(T,w,C,p);_.type=hi,_.needsUpdate=!0;const A=E*4;for(let P=0;P<p;P++){const D=d[P],U=v[P],F=b[P],B=w*C*4*P;for(let Z=0;Z<D.count;Z++){const X=Z*A;g===!0&&(r.fromBufferAttribute(D,Z),T[B+X+0]=r.x,T[B+X+1]=r.y,T[B+X+2]=r.z,T[B+X+3]=0),S===!0&&(r.fromBufferAttribute(U,Z),T[B+X+4]=r.x,T[B+X+5]=r.y,T[B+X+6]=r.z,T[B+X+7]=0),x===!0&&(r.fromBufferAttribute(F,Z),T[B+X+8]=r.x,T[B+X+9]=r.y,T[B+X+10]=r.z,T[B+X+11]=F.itemSize===4?r.w:1)}}h={count:p,texture:_,size:new Ze(w,C)},i.set(l,h),l.addEventListener("dispose",R)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let g=0;for(let x=0;x<u.length;x++)g+=u[x];const S=l.morphTargetsRelative?1:1-g;c.getUniforms().setValue(t,"morphTargetBaseInfluence",S),c.getUniforms().setValue(t,"morphTargetInfluences",u)}c.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function lA(t,e,n,i,r){let s=new WeakMap;function o(u){const f=r.render.frame,p=u.geometry,h=e.get(u,p);if(s.get(h)!==f&&(e.update(h),s.set(h,f)),u.isInstancedMesh&&(u.hasEventListener("dispose",c)===!1&&u.addEventListener("dispose",c),s.get(u)!==f&&(n.update(u.instanceMatrix,t.ARRAY_BUFFER),u.instanceColor!==null&&n.update(u.instanceColor,t.ARRAY_BUFFER),s.set(u,f))),u.isSkinnedMesh){const m=u.skeleton;s.get(m)!==f&&(m.update(),s.set(m,f))}return h}function l(){s=new WeakMap}function c(u){const f=u.target;f.removeEventListener("dispose",c),i.releaseStatesOfObject(f),n.remove(f.instanceMatrix),f.instanceColor!==null&&n.remove(f.instanceColor)}return{update:o,dispose:l}}const cA={[Jv]:"LINEAR_TONE_MAPPING",[Qv]:"REINHARD_TONE_MAPPING",[e_]:"CINEON_TONE_MAPPING",[Wh]:"ACES_FILMIC_TONE_MAPPING",[n_]:"AGX_TONE_MAPPING",[i_]:"NEUTRAL_TONE_MAPPING",[t_]:"CUSTOM_TONE_MAPPING"};function uA(t,e,n,i,r,s){const o=new ni(e,n,{type:t,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let l=null,c=null;const u=new Ln;u.setAttribute("position",new kt([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new kt([0,2,0,0,2,0],2));const f=new ZM({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new Nn(u,f),h=new lp(-1,1,1,-1,0,1);let m=null,g=null,S=!1,x,d=null,v=[],b=!1;this.setSize=function(E,w){o.setSize(E,w),l!==null&&l.setSize(E,w),c!==null&&c.setSize(E,w);for(let C=0;C<v.length;C++){const T=v[C];T.setSize&&T.setSize(E,w)}},this.setEffects=function(E){v=E,b=v.length>0&&v[0].isRenderPass===!0;const w=o.width,C=o.height;v.length>0&&l===null&&(l=new ni(w,C,{type:_i,depthBuffer:!1,stencilBuffer:!1}),c=new ni(w,C,{type:_i,depthBuffer:!1,stencilBuffer:!1}));for(let T=0;T<v.length;T++){const _=v[T];_.setSize&&_.setSize(w,C)}},this.begin=function(E,w){if(S||E.toneMapping===gi&&v.length===0)return!1;if(d=w,w!==null){const C=w.width,T=w.height;(o.width!==C||o.height!==T)&&this.setSize(C,T)}return b===!1&&E.setRenderTarget(o),x=E.toneMapping,E.toneMapping=gi,!0},this.hasRenderPass=function(){return b},this.end=function(E,w){E.toneMapping=x,S=!0;let C=o,T=l;for(let _=0;_<v.length;_++){const A=v[_];A.enabled!==!1&&(A.render(E,T,C,w),A.needsSwap!==!1&&(C=T,T=T===l?c:l))}if(m!==E.outputColorSpace||g!==E.toneMapping){m=E.outputColorSpace,g=E.toneMapping,f.defines={},et.getTransfer(m)===lt&&(f.defines.SRGB_TRANSFER="");const _=cA[g];_&&(f.defines[_]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=C.texture,E.setRenderTarget(d),E.render(p,h),d=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){o.dispose(),l!==null&&l.dispose(),c!==null&&c.dispose(),u.dispose(),f.dispose()}}const T_=new dn,kf=new mo(1,1),N_=new h_,R_=new wM,D_=new __,Vx=[],Gx=[],Hx=new Float32Array(16),Wx=new Float32Array(9),Xx=new Float32Array(4);function aa(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Vx[r];if(s===void 0&&(s=new Float32Array(r),Vx[r]=s),e!==0){i.toArray(s,0);for(let o=1,l=0;o!==e;++o)l+=n,t[o].toArray(s,l)}return s}function jt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function zt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Uc(t,e){let n=Gx[e];n===void 0&&(n=new Int32Array(e),Gx[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function dA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function fA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(jt(n,e))return;t.uniform2fv(this.addr,e),zt(n,e)}}function hA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(jt(n,e))return;t.uniform3fv(this.addr,e),zt(n,e)}}function pA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(jt(n,e))return;t.uniform4fv(this.addr,e),zt(n,e)}}function mA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(jt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),zt(n,e)}else{if(jt(n,i))return;Xx.set(i),t.uniformMatrix2fv(this.addr,!1,Xx),zt(n,i)}}function xA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(jt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),zt(n,e)}else{if(jt(n,i))return;Wx.set(i),t.uniformMatrix3fv(this.addr,!1,Wx),zt(n,i)}}function gA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(jt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),zt(n,e)}else{if(jt(n,i))return;Hx.set(i),t.uniformMatrix4fv(this.addr,!1,Hx),zt(n,i)}}function vA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function _A(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(jt(n,e))return;t.uniform2iv(this.addr,e),zt(n,e)}}function yA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(jt(n,e))return;t.uniform3iv(this.addr,e),zt(n,e)}}function SA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(jt(n,e))return;t.uniform4iv(this.addr,e),zt(n,e)}}function EA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function bA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(jt(n,e))return;t.uniform2uiv(this.addr,e),zt(n,e)}}function MA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(jt(n,e))return;t.uniform3uiv(this.addr,e),zt(n,e)}}function wA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(jt(n,e))return;t.uniform4uiv(this.addr,e),zt(n,e)}}function CA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(kf.compareFunction=n.isReversedDepthBuffer()?Qh:Jh,s=kf):s=T_,n.setTexture2D(e||s,r)}function AA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||R_,r)}function TA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||D_,r)}function NA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||N_,r)}function RA(t){switch(t){case 5126:return dA;case 35664:return fA;case 35665:return hA;case 35666:return pA;case 35674:return mA;case 35675:return xA;case 35676:return gA;case 5124:case 35670:return vA;case 35667:case 35671:return _A;case 35668:case 35672:return yA;case 35669:case 35673:return SA;case 5125:return EA;case 36294:return bA;case 36295:return MA;case 36296:return wA;case 35678:case 36198:case 36298:case 36306:case 35682:return CA;case 35679:case 36299:case 36307:return AA;case 35680:case 36300:case 36308:case 36293:return TA;case 36289:case 36303:case 36311:case 36292:return NA}}function DA(t,e){t.uniform1fv(this.addr,e)}function PA(t,e){const n=aa(e,this.size,2);t.uniform2fv(this.addr,n)}function FA(t,e){const n=aa(e,this.size,3);t.uniform3fv(this.addr,n)}function LA(t,e){const n=aa(e,this.size,4);t.uniform4fv(this.addr,n)}function IA(t,e){const n=aa(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function UA(t,e){const n=aa(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function kA(t,e){const n=aa(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function OA(t,e){t.uniform1iv(this.addr,e)}function BA(t,e){t.uniform2iv(this.addr,e)}function jA(t,e){t.uniform3iv(this.addr,e)}function zA(t,e){t.uniform4iv(this.addr,e)}function VA(t,e){t.uniform1uiv(this.addr,e)}function GA(t,e){t.uniform2uiv(this.addr,e)}function HA(t,e){t.uniform3uiv(this.addr,e)}function WA(t,e){t.uniform4uiv(this.addr,e)}function XA(t,e,n){const i=this.cache,r=e.length,s=Uc(n,r);jt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));let o;this.type===t.SAMPLER_2D_SHADOW?o=kf:o=T_;for(let l=0;l!==r;++l)n.setTexture2D(e[l]||o,s[l])}function $A(t,e,n){const i=this.cache,r=e.length,s=Uc(n,r);jt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||R_,s[o])}function qA(t,e,n){const i=this.cache,r=e.length,s=Uc(n,r);jt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||D_,s[o])}function YA(t,e,n){const i=this.cache,r=e.length,s=Uc(n,r);jt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||N_,s[o])}function KA(t){switch(t){case 5126:return DA;case 35664:return PA;case 35665:return FA;case 35666:return LA;case 35674:return IA;case 35675:return UA;case 35676:return kA;case 5124:case 35670:return OA;case 35667:case 35671:return BA;case 35668:case 35672:return jA;case 35669:case 35673:return zA;case 5125:return VA;case 36294:return GA;case 36295:return HA;case 36296:return WA;case 35678:case 36198:case 36298:case 36306:case 35682:return XA;case 35679:case 36299:case 36307:return $A;case 35680:case 36300:case 36308:case 36293:return qA;case 36289:case 36303:case 36311:case 36292:return YA}}class ZA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=RA(n.type)}}class JA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=KA(n.type)}}class QA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const l=r[s];l.setValue(e,n[l.id],i)}}}const Xu=/(\w+)(\])?(\[|\.)?/g;function $x(t,e){t.seq.push(e),t.map[e.id]=e}function eT(t,e,n){const i=t.name,r=i.length;for(Xu.lastIndex=0;;){const s=Xu.exec(i),o=Xu.lastIndex;let l=s[1];const c=s[2]==="]",u=s[3];if(c&&(l=l|0),u===void 0||u==="["&&o+2===r){$x(n,u===void 0?new ZA(l,t,e):new JA(l,t,e));break}else{let p=n.map[l];p===void 0&&(p=new QA(l),$x(n,p)),n=p}}}class Pl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const l=e.getActiveUniform(n,o),c=e.getUniformLocation(n,l.name);eT(l,c,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const l=n[s],c=i[l.id];c.needsUpdate!==!1&&l.setValue(e,c.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function qx(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const tT=37297;let nT=0;function iT(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const l=o+1;i.push(`${l===e?">":" "} ${l}: ${n[o]}`)}return i.join(`
`)}const Yx=new ze;function rT(t){et._getMatrix(Yx,et.workingColorSpace,t);const e=`mat3( ${Yx.elements.map(n=>n.toFixed(4))} )`;switch(et.getTransfer(t)){case cc:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return Oe("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Kx(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const l=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+iT(t.getShaderSource(e),l)}else return s}function sT(t,e){const n=rT(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const aT={[Jv]:"Linear",[Qv]:"Reinhard",[e_]:"Cineon",[Wh]:"ACESFilmic",[n_]:"AgX",[i_]:"Neutral",[t_]:"Custom"};function oT(t,e){const n=aT[e];return n===void 0?(Oe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const pl=new G;function lT(){et.getLuminanceCoefficients(pl);const t=pl.x.toFixed(4),e=pl.y.toFixed(4),n=pl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function cT(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ra).join(`
`)}function uT(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function dT(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let l=1;s.type===t.FLOAT_MAT2&&(l=2),s.type===t.FLOAT_MAT3&&(l=3),s.type===t.FLOAT_MAT4&&(l=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:l}}return n}function Ra(t){return t!==""}function Zx(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jx(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const fT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Of(t){return t.replace(fT,pT)}const hT=new Map;function pT(t,e){let n=Xe[e];if(n===void 0){const i=hT.get(e);if(i!==void 0)n=Xe[i],Oe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Of(n)}const mT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qx(t){return t.replace(mT,xT)}function xT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function eg(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const gT={[Al]:"SHADOWMAP_TYPE_PCF",[Ta]:"SHADOWMAP_TYPE_VSM"};function vT(t){return gT[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const _T={[Kr]:"ENVMAP_TYPE_CUBE",[Ks]:"ENVMAP_TYPE_CUBE",[Pc]:"ENVMAP_TYPE_CUBE_UV"};function yT(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":_T[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const ST={[Ks]:"ENVMAP_MODE_REFRACTION"};function ET(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":ST[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const bT={[Zv]:"ENVMAP_BLENDING_MULTIPLY",[nM]:"ENVMAP_BLENDING_MIX",[iM]:"ENVMAP_BLENDING_ADD"};function MT(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":bT[t.combine]||"ENVMAP_BLENDING_NONE"}function wT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function CT(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,l=n.fragmentShader;const c=vT(n),u=yT(n),f=ET(n),p=MT(n),h=wT(n),m=cT(n),g=uT(s),S=r.createProgram();let x,d,v=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(x=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Ra).join(`
`),x.length>0&&(x+=`
`),d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Ra).join(`
`),d.length>0&&(d+=`
`)):(x=[eg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+f:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ra).join(`
`),d=[eg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",n.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==gi?"#define TONE_MAPPING":"",n.toneMapping!==gi?Xe.tonemapping_pars_fragment:"",n.toneMapping!==gi?oT("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,sT("linearToOutputTexel",n.outputColorSpace),lT(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Ra).join(`
`)),o=Of(o),o=Zx(o,n),o=Jx(o,n),l=Of(l),l=Zx(l,n),l=Jx(l,n),o=Qx(o),l=Qx(l),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,x=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,d=["#define varying in",n.glslVersion===lx?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===lx?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const b=v+x+o,E=v+d+l,w=qx(r,r.VERTEX_SHADER,b),C=qx(r,r.FRAGMENT_SHADER,E);r.attachShader(S,w),r.attachShader(S,C),n.index0AttributeName!==void 0?r.bindAttribLocation(S,0,n.index0AttributeName):n.hasPositionAttribute===!0&&r.bindAttribLocation(S,0,"position"),r.linkProgram(S);function T(P){if(t.debug.checkShaderErrors){const D=r.getProgramInfoLog(S)||"",U=r.getShaderInfoLog(w)||"",F=r.getShaderInfoLog(C)||"",B=D.trim(),Z=U.trim(),X=F.trim();let j=!0,z=!0;if(r.getProgramParameter(S,r.LINK_STATUS)===!1)if(j=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,S,w,C);else{const $=Kx(r,w,"vertex"),Q=Kx(r,C,"fragment");rt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(S,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+$+`
`+Q)}else B!==""?Oe("WebGLProgram: Program Info Log:",B):(Z===""||X==="")&&(z=!1);z&&(P.diagnostics={runnable:j,programLog:B,vertexShader:{log:Z,prefix:x},fragmentShader:{log:X,prefix:d}})}r.deleteShader(w),r.deleteShader(C),_=new Pl(r,S),A=dT(r,S)}let _;this.getUniforms=function(){return _===void 0&&T(this),_};let A;this.getAttributes=function(){return A===void 0&&T(this),A};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(S,tT)),R},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(S),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=nT++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=w,this.fragmentShader=C,this}let AT=0;class TT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){const r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new NT(e),n.set(e,i)),i}}class NT{constructor(e){this.id=AT++,this.code=e,this.usedTimes=0}}function RT(t){return t===Zr||t===ac||t===oc}function DT(t,e,n,i,r,s){const o=new p_,l=new TT,c=new Set,u=[],f=new Map,p=i.logarithmicDepthBuffer;let h=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return c.add(_),_===0?"uv":`uv${_}`}function S(_,A,R,P,D,U){const F=P.fog,B=D.geometry,Z=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,X=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,j=e.get(_.envMap||Z,X),z=j&&j.mapping===Pc?j.image.height:null,$=m[_.type];_.precision!==null&&(h=i.getMaxPrecision(_.precision),h!==_.precision&&Oe("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));const Q=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ce=Q!==void 0?Q.length:0;let Me=0;B.morphAttributes.position!==void 0&&(Me=1),B.morphAttributes.normal!==void 0&&(Me=2),B.morphAttributes.color!==void 0&&(Me=3);let Ye,He,Ve,J;if($){const ft=ui[$];Ye=ft.vertexShader,He=ft.fragmentShader}else{Ye=_.vertexShader,He=_.fragmentShader;const ft=l.getVertexShaderStage(_),st=l.getFragmentShaderStage(_);l.update(_,ft,st),Ve=ft.id,J=st.id}const ie=t.getRenderTarget(),Se=t.state.buffers.depth.getReversed(),Be=D.isInstancedMesh===!0,q=D.isBatchedMesh===!0,le=!!_.map,we=!!_.matcap,Fe=!!j,je=!!_.aoMap,Le=!!_.lightMap,Ue=!!_.bumpMap&&_.wireframe===!1,it=!!_.normalMap,Rt=!!_.displacementMap,pn=!!_.emissiveMap,_t=!!_.metalnessMap,Dt=!!_.roughnessMap,O=_.anisotropy>0,Kt=_.clearcoat>0,ot=_.dispersion>0,N=_.retroreflectivity>0,y=_.iridescence>0,V=_.sheen>0,Y=_.transmission>0,ee=O&&!!_.anisotropyMap,oe=Kt&&!!_.clearcoatMap,ue=Kt&&!!_.clearcoatNormalMap,te=Kt&&!!_.clearcoatRoughnessMap,re=y&&!!_.iridescenceMap,de=y&&!!_.iridescenceThicknessMap,De=V&&!!_.sheenColorMap,me=V&&!!_.sheenRoughnessMap,fe=!!_.specularMap,Pe=!!_.specularColorMap,ke=!!_.specularIntensityMap,Ge=Y&&!!_.transmissionMap,k=Y&&!!_.thicknessMap,he=!!_.gradientMap,ne=!!_.alphaMap,pe=_.alphaTest>0,_e=!!_.alphaHash,se=!!_.extensions;let Ie=gi;_.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ie=t.toneMapping);const Te={shaderID:$,shaderType:_.type,shaderName:_.name,vertexShader:Ye,fragmentShader:He,defines:_.defines,customVertexShaderID:Ve,customFragmentShaderID:J,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:q,batchingColor:q&&D._colorsTexture!==null,instancing:Be,instancingColor:Be&&D.instanceColor!==null,instancingMorph:Be&&D.morphTexture!==null,outputColorSpace:ie===null?t.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:le,matcap:we,envMap:Fe,envMapMode:Fe&&j.mapping,envMapCubeUVHeight:z,aoMap:je,lightMap:Le,bumpMap:Ue,normalMap:it,displacementMap:Rt,emissiveMap:pn,normalMapObjectSpace:it&&_.normalMapType===aM,normalMapTangentSpace:it&&_.normalMapType===If,packedNormalMap:it&&_.normalMapType===If&&RT(_.normalMap.format),metalnessMap:_t,roughnessMap:Dt,anisotropy:O,anisotropyMap:ee,clearcoat:Kt,clearcoatMap:oe,clearcoatNormalMap:ue,clearcoatRoughnessMap:te,dispersion:ot,retroreflection:N,iridescence:y,iridescenceMap:re,iridescenceThicknessMap:de,sheen:V,sheenColorMap:De,sheenRoughnessMap:me,specularMap:fe,specularColorMap:Pe,specularIntensityMap:ke,transmission:Y,transmissionMap:Ge,thicknessMap:k,gradientMap:he,opaque:_.transparent===!1&&_.blending===ja&&_.alphaToCoverage===!1,alphaMap:ne,alphaTest:pe,alphaHash:_e,combine:_.combine,mapUv:le&&g(_.map.channel),aoMapUv:je&&g(_.aoMap.channel),lightMapUv:Le&&g(_.lightMap.channel),bumpMapUv:Ue&&g(_.bumpMap.channel),normalMapUv:it&&g(_.normalMap.channel),displacementMapUv:Rt&&g(_.displacementMap.channel),emissiveMapUv:pn&&g(_.emissiveMap.channel),metalnessMapUv:_t&&g(_.metalnessMap.channel),roughnessMapUv:Dt&&g(_.roughnessMap.channel),anisotropyMapUv:ee&&g(_.anisotropyMap.channel),clearcoatMapUv:oe&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:ue&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:re&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:de&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:De&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:me&&g(_.sheenRoughnessMap.channel),specularMapUv:fe&&g(_.specularMap.channel),specularColorMapUv:Pe&&g(_.specularColorMap.channel),specularIntensityMapUv:ke&&g(_.specularIntensityMap.channel),transmissionMapUv:Ge&&g(_.transmissionMap.channel),thicknessMapUv:k&&g(_.thicknessMap.channel),alphaMapUv:ne&&g(_.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(it||O),vertexNormals:!!B.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!B.attributes.uv&&(le||ne),fog:!!F,useFog:_.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||B.attributes.normal===void 0&&it===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:Se,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:Me,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:U.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:t.shadowMap.enabled&&R.length>0,shadowMapType:t.shadowMap.type,toneMapping:Ie,decodeVideoTexture:le&&_.map.isVideoTexture===!0&&et.getTransfer(_.map.colorSpace)===lt,decodeVideoTextureEmissive:pn&&_.emissiveMap.isVideoTexture===!0&&et.getTransfer(_.emissiveMap.colorSpace)===lt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===fi,flipSided:_.side===Sn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:se&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&_.extensions.multiDraw===!0||q)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Te.vertexUv1s=c.has(1),Te.vertexUv2s=c.has(2),Te.vertexUv3s=c.has(3),c.clear(),Te}function x(_){const A=[];if(_.shaderID?A.push(_.shaderID):(A.push(_.customVertexShaderID),A.push(_.customFragmentShaderID)),_.defines!==void 0)for(const R in _.defines)A.push(R),A.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(d(A,_),v(A,_),A.push(t.outputColorSpace)),A.push(_.customProgramCacheKey),A.join()}function d(_,A){_.push(A.precision),_.push(A.outputColorSpace),_.push(A.envMapMode),_.push(A.envMapCubeUVHeight),_.push(A.mapUv),_.push(A.alphaMapUv),_.push(A.lightMapUv),_.push(A.aoMapUv),_.push(A.bumpMapUv),_.push(A.normalMapUv),_.push(A.displacementMapUv),_.push(A.emissiveMapUv),_.push(A.metalnessMapUv),_.push(A.roughnessMapUv),_.push(A.anisotropyMapUv),_.push(A.clearcoatMapUv),_.push(A.clearcoatNormalMapUv),_.push(A.clearcoatRoughnessMapUv),_.push(A.iridescenceMapUv),_.push(A.iridescenceThicknessMapUv),_.push(A.sheenColorMapUv),_.push(A.sheenRoughnessMapUv),_.push(A.specularMapUv),_.push(A.specularColorMapUv),_.push(A.specularIntensityMapUv),_.push(A.transmissionMapUv),_.push(A.thicknessMapUv),_.push(A.combine),_.push(A.fogExp2),_.push(A.sizeAttenuation),_.push(A.morphTargetsCount),_.push(A.morphAttributeCount),_.push(A.numSunLights),_.push(A.numDirLights),_.push(A.numPointLights),_.push(A.numSpotLights),_.push(A.numSpotLightMaps),_.push(A.numHemiLights),_.push(A.numRectAreaLights),_.push(A.numSunLightShadows),_.push(A.numDirLightShadows),_.push(A.numPointLightShadows),_.push(A.numSpotLightShadows),_.push(A.numSpotLightShadowsWithMaps),_.push(A.numLightProbes),_.push(A.shadowMapType),_.push(A.toneMapping),_.push(A.numClippingPlanes),_.push(A.numClipIntersection),_.push(A.depthPacking)}function v(_,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.retroreflection&&o.enable(24),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function b(_){const A=m[_.type];let R;if(A){const P=ui[A];R=qM.clone(P.uniforms)}else R=_.uniforms;return R}function E(_,A){let R=f.get(A);return R!==void 0?++R.usedTimes:(R=new CT(t,A,_,r),u.push(R),f.set(A,R)),R}function w(_){if(--_.usedTimes===0){const A=u.indexOf(_);u[A]=u[u.length-1],u.pop(),f.delete(_.cacheKey),_.destroy()}}function C(_){l.remove(_)}function T(){l.dispose()}return{getParameters:S,getProgramCacheKey:x,getUniforms:b,acquireProgram:E,releaseProgram:w,releaseShaderCache:C,programs:u,dispose:T}}function PT(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let l=t.get(o);return l===void 0&&(l={},t.set(o,l)),l}function i(o){t.delete(o)}function r(o,l,c){t.get(o)[l]=c}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function FT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function tg(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function ng(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h){let m=0;return h.isInstancedMesh&&(m+=2),h.isSkinnedMesh&&(m+=1),m}function l(h,m,g,S,x,d){let v=t[e];return v===void 0?(v={id:h.id,object:h,geometry:m,material:g,materialVariant:o(h),groupOrder:S,renderOrder:h.renderOrder,z:x,group:d},t[e]=v):(v.id=h.id,v.object=h,v.geometry=m,v.material=g,v.materialVariant=o(h),v.groupOrder=S,v.renderOrder=h.renderOrder,v.z=x,v.group=d),e++,v}function c(h,m,g,S,x,d,v){v.reversedDepth===!0&&(x=-x);const b=l(h,m,g,S,x,d);g.transmission>0?i.push(b):g.transparent===!0?r.push(b):n.push(b)}function u(h,m,g,S,x,d){const v=l(h,m,g,S,x,d);g.transmission>0?i.unshift(v):g.transparent===!0?r.unshift(v):n.unshift(v)}function f(h,m){n.length>1&&n.sort(h||FT),i.length>1&&i.sort(m||tg),r.length>1&&r.sort(m||tg)}function p(){for(let h=e,m=t.length;h<m;h++){const g=t[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:c,unshift:u,finish:p,sort:f}}function LT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new ng,t.set(i,[o])):r>=s.length?(o=new ng,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function IT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={direction:new G,color:new qe};break;case"SpotLight":n={position:new G,direction:new G,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new G,color:new qe,distance:0,decay:0};break;case"HemisphereLight":n={direction:new G,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":n={color:new qe,position:new G,halfWidth:new G,halfHeight:new G};break}return t[e.id]=n,n}}}function UT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let kT=0;function OT(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function BT(t){const e=new IT,n=UT(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new G);const r=new G,s=new bt,o=new bt;function l(u){let f=0,p=0,h=0;for(let D=0;D<9;D++)i.probe[D].set(0,0,0);let m=0,g=0,S=0,x=0,d=0,v=0,b=0,E=0,w=0,C=0,T=0,_=0,A=0,R=0;u.sort(OT);for(let D=0,U=u.length;D<U;D++){const F=u[D],B=F.color,Z=F.intensity,X=F.distance;let j=null;if(F.shadow&&F.shadow.map&&(F.shadow.map.texture.format===Zr?j=F.shadow.map.texture:j=F.shadow.map.depthTexture||F.shadow.map.texture),F.isAmbientLight)f+=B.r*Z,p+=B.g*Z,h+=B.b*Z;else if(F.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(F.sh.coefficients[z],Z);R++}else if(F.isSunLight){const z=e.get(F);if(z.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const $=F.shadow,Q=n.get(F);Q.shadowIntensity=$.intensity,Q.shadowBias=$.bias,Q.shadowNormalBias=$.normalBias,Q.shadowRadius=$.radius,Q.shadowMapSize.copy($.mapSize).multiply($.getFrameExtents()),i.sunShadow[g]=Q,i.sunShadowMap[g]=j;const ce=$.getViewportCount();for(let Me=0;Me<ce;Me++)i.sunShadowMatrix[S+Me]=$.getMatrix(Me),i.sunShadowCascade[S+Me]=$._cascadeData[Me];S+=ce,g++}i.sun[m]=z,m++}else if(F.isDirectionalLight){const z=e.get(F);if(z.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const $=F.shadow,Q=n.get(F);Q.shadowIntensity=$.intensity,Q.shadowBias=$.bias,Q.shadowNormalBias=$.normalBias,Q.shadowRadius=$.radius,Q.shadowMapSize=$.mapSize,i.directionalShadow[x]=Q,i.directionalShadowMap[x]=j,i.directionalShadowMatrix[x]=F.shadow.matrix,w++}i.directional[x]=z,x++}else if(F.isSpotLight){const z=e.get(F);z.position.setFromMatrixPosition(F.matrixWorld),z.color.copy(B).multiplyScalar(Z),z.distance=X,z.coneCos=Math.cos(F.angle),z.penumbraCos=Math.cos(F.angle*(1-F.penumbra)),z.decay=F.decay,i.spot[v]=z;const $=F.shadow;if(F.map&&(i.spotLightMap[_]=F.map,_++,$.updateMatrices(F),F.castShadow&&A++),i.spotLightMatrix[v]=$.matrix,F.castShadow){const Q=n.get(F);Q.shadowIntensity=$.intensity,Q.shadowBias=$.bias,Q.shadowNormalBias=$.normalBias,Q.shadowRadius=$.radius,Q.shadowMapSize=$.mapSize,i.spotShadow[v]=Q,i.spotShadowMap[v]=j,T++}v++}else if(F.isRectAreaLight){const z=e.get(F);z.color.copy(B).multiplyScalar(Z),z.halfWidth.set(F.width*.5,0,0),z.halfHeight.set(0,F.height*.5,0),i.rectArea[b]=z,b++}else if(F.isPointLight){const z=e.get(F);if(z.color.copy(F.color).multiplyScalar(F.intensity),z.distance=F.distance,z.decay=F.decay,F.castShadow){const $=F.shadow,Q=n.get(F);Q.shadowIntensity=$.intensity,Q.shadowBias=$.bias,Q.shadowNormalBias=$.normalBias,Q.shadowRadius=$.radius,Q.shadowMapSize=$.mapSize,Q.shadowCameraNear=$.camera.near,Q.shadowCameraFar=$.camera.far,i.pointShadow[d]=Q,i.pointShadowMap[d]=j,i.pointShadowMatrix[d]=F.shadow.matrix,C++}i.point[d]=z,d++}else if(F.isHemisphereLight){const z=e.get(F);z.skyColor.copy(F.color).multiplyScalar(Z),z.groundColor.copy(F.groundColor).multiplyScalar(Z),i.hemi[E]=z,E++}}b>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=xe.LTC_FLOAT_1,i.rectAreaLTC2=xe.LTC_FLOAT_2):(i.rectAreaLTC1=xe.LTC_HALF_1,i.rectAreaLTC2=xe.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=p,i.ambient[2]=h;const P=i.hash;(P.sunLength!==m||P.directionalLength!==x||P.pointLength!==d||P.spotLength!==v||P.rectAreaLength!==b||P.hemiLength!==E||P.numSunShadows!==g||P.numDirectionalShadows!==w||P.numPointShadows!==C||P.numSpotShadows!==T||P.numSpotMaps!==_||P.numLightProbes!==R)&&(i.sun.length=m,i.directional.length=x,i.spot.length=v,i.rectArea.length=b,i.point.length=d,i.hemi.length=E,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=S,i.sunShadowCascade.length=S,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.directionalShadowMatrix.length=w,i.pointShadow.length=C,i.pointShadowMap.length=C,i.pointShadowMatrix.length=C,i.spotShadow.length=T,i.spotShadowMap.length=T,i.spotLightMatrix.length=T+_-A,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,P.sunLength=m,P.directionalLength=x,P.pointLength=d,P.spotLength=v,P.rectAreaLength=b,P.hemiLength=E,P.numSunShadows=g,P.numDirectionalShadows=w,P.numPointShadows=C,P.numSpotShadows=T,P.numSpotMaps=_,P.numLightProbes=R,i.version=kT++)}function c(u,f){let p=0,h=0,m=0,g=0,S=0,x=0;const d=f.matrixWorldInverse;for(let v=0,b=u.length;v<b;v++){const E=u[v];if(E.isSunLight){const w=i.sun[p];w.direction.setFromMatrixPosition(E.matrixWorld),w.direction.transformDirection(d),p++}else if(E.isDirectionalLight){const w=i.directional[h];w.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(d),h++}else if(E.isSpotLight){const w=i.spot[g];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(d),w.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(d),g++}else if(E.isRectAreaLight){const w=i.rectArea[S];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(d),o.identity(),s.copy(E.matrixWorld),s.premultiply(d),o.extractRotation(s),w.halfWidth.set(E.width*.5,0,0),w.halfHeight.set(0,E.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),S++}else if(E.isPointLight){const w=i.point[m];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(d),m++}else if(E.isHemisphereLight){const w=i.hemi[x];w.direction.setFromMatrixPosition(E.matrixWorld),w.direction.transformDirection(d),x++}}}return{setup:l,setupView:c,state:i}}function ig(t){const e=new BT(t),n=[],i=[],r=[];function s(h){p.camera=h,n.length=0,i.length=0,r.length=0}function o(h){n.push(h)}function l(h){i.push(h)}function c(h){r.push(h)}function u(){e.setup(n)}function f(h){e.setupView(n,h)}const p={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:p,setupLights:u,setupLightsView:f,pushLight:o,pushShadow:l,pushLightProbeGrid:c}}function jT(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let l;return o===void 0?(l=new ig(t),e.set(r,[l])):s>=o.length?(l=new ig(t),o.push(l)):l=o[s],l}function i(){e=new WeakMap}return{get:n,dispose:i}}const zT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,VT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,GT=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],HT=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],rg=new bt,ba=new G,$u=new G;function WT(t,e,n){let i=new ip;const r=new Ze,s=new Ze,o=new St,l=new QM,c=new e2,u={},f=n.maxTextureSize,p={[Yr]:Sn,[Sn]:Yr,[fi]:fi},h=new yi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ze},radius:{value:4}},vertexShader:zT,fragmentShader:VT}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const g=new Ln;g.setAttribute("position",new Ii(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new Nn(g,h),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Al;let d=this.type;this.render=function(C,T,_){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||C.length===0)return;this.type===kb&&(Oe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Al);const A=t.getRenderTarget(),R=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),D=t.state;D.setBlending(Fi),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const U=d!==this.type;U&&T.traverse(function(F){F.material&&(Array.isArray(F.material)?F.material.forEach(B=>B.needsUpdate=!0):F.material.needsUpdate=!0)});for(let F=0,B=C.length;F<B;F++){const Z=C[F],X=Z.shadow;if(X===void 0){Oe("WebGLShadowMap:",Z,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);const j=X.getFrameExtents();r.multiply(j),s.copy(X.mapSize),(r.x>f||r.y>f)&&(r.x>f&&(s.x=Math.floor(f/j.x),r.x=s.x*j.x,X.mapSize.x=s.x),r.y>f&&(s.y=Math.floor(f/j.y),r.y=s.y*j.y,X.mapSize.y=s.y));const z=t.state.buffers.depth.getReversed();if(X.camera._reversedDepth=z,X.map===null||U===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===Ta){if(Z.isPointLight){Oe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new ni(r.x,r.y,{format:Zr,type:_i,minFilter:rn,magFilter:rn,generateMipmaps:!1}),X.map.texture.name=Z.name+".shadowMap",X.map.depthTexture=new mo(r.x,r.y,hi),X.map.depthTexture.name=Z.name+".shadowMapDepth",X.map.depthTexture.format=zi,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Xt,X.map.depthTexture.magFilter=Xt}else Z.isPointLight?(X.map=new A_(r.x),X.map.depthTexture=new XM(r.x,vi)):(X.map=new ni(r.x,r.y),X.map.depthTexture=new mo(r.x,r.y,vi)),X.map.depthTexture.name=Z.name+".shadowMap",X.map.depthTexture.format=zi,this.type===Al?(X.map.depthTexture.compareFunction=z?Qh:Jh,X.map.depthTexture.minFilter=rn,X.map.depthTexture.magFilter=rn):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Xt,X.map.depthTexture.magFilter=Xt);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==r.x||X.map.height!==r.y)&&X.map.setSize(r.x,r.y);const $=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();Z.isPointLight!==!0&&X.updateMatrices(Z,_);for(let Q=0;Q<$;Q++){const ce=X.getCamera(Q);if(Z.isPointLight){const Me=X.camera,Ye=X.matrix,He=Z.distance||Me.far;He!==Me.far&&(Me.far=He,Me.updateProjectionMatrix()),ba.setFromMatrixPosition(Z.matrixWorld),Me.position.copy(ba),$u.copy(Me.position),$u.add(GT[Q]),Me.up.copy(HT[Q]),Me.lookAt($u),Me.updateMatrixWorld(),Ye.makeTranslation(-ba.x,-ba.y,-ba.z),rg.multiplyMatrices(Me.projectionMatrix,Me.matrixWorldInverse),X._frustum.setFromProjectionMatrix(rg,Me.coordinateSystem,Me.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)t.setRenderTarget(X.map,Q),t.clear();else{Q===0&&(t.setRenderTarget(X.map),t.clear());const Me=X.getViewport(Q);o.set(s.x*Me.x,s.y*Me.y,s.x*Me.z,s.y*Me.w),D.viewport(o)}i=X.getFrustum(Q),E(T,_,ce,Z,this.type)}X.isPointLightShadow!==!0&&this.type===Ta&&v(X,_),X.needsUpdate=!1}d=this.type,x.needsUpdate=!1,t.setRenderTarget(A,R,P)};function v(C,T){const _=e.update(S);h.defines.VSM_SAMPLES!==C.blurSamples&&(h.defines.VSM_SAMPLES=C.blurSamples,m.defines.VSM_SAMPLES=C.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),C.mapPass===null?C.mapPass=new ni(r.x,r.y,{format:Zr,type:_i}):(C.mapPass.width!==C.map.width||C.mapPass.height!==C.map.height)&&C.mapPass.setSize(C.map.width,C.map.height),h.uniforms.shadow_pass.value=C.map.depthTexture,h.uniforms.resolution.value.set(C.map.width,C.map.height),h.uniforms.radius.value=C.radius,t.setRenderTarget(C.mapPass),t.clear(),t.renderBufferDirect(T,null,_,h,S,null),m.uniforms.shadow_pass.value=C.mapPass.texture,m.uniforms.resolution.value.set(C.map.width,C.map.height),m.uniforms.radius.value=C.radius,t.setRenderTarget(C.map),t.clear(),t.renderBufferDirect(T,null,_,m,S,null)}function b(C,T,_,A){let R=null;const P=_.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(P!==void 0)R=P;else if(R=_.isPointLight===!0?c:l,t.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const D=R.uuid,U=T.uuid;let F=u[D];F===void 0&&(F={},u[D]=F);let B=F[U];B===void 0&&(B=R.clone(),F[U]=B,T.addEventListener("dispose",w)),R=B}if(R.visible=T.visible,R.wireframe=T.wireframe,A===Ta?R.side=T.shadowSide!==null?T.shadowSide:T.side:R.side=T.shadowSide!==null?T.shadowSide:p[T.side],R.alphaMap=T.alphaMap,R.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,R.map=T.map,R.clipShadows=T.clipShadows,R.clippingPlanes=T.clippingPlanes,R.clipIntersection=T.clipIntersection,R.displacementMap=T.displacementMap,R.displacementScale=T.displacementScale,R.displacementBias=T.displacementBias,R.wireframeLinewidth=T.wireframeLinewidth,R.linewidth=T.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const D=t.properties.get(R);D.light=_}return R}function E(C,T,_,A,R){if(C.visible===!1)return;if(C.layers.test(T.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&R===Ta)&&(!C.frustumCulled||C.intersectsFrustum(i))){C.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,C.matrixWorld);const U=e.update(C),F=C.material;if(Array.isArray(F)){const B=U.groups;for(let Z=0,X=B.length;Z<X;Z++){const j=B[Z],z=F[j.materialIndex];if(z&&z.visible){const $=b(C,z,A,R);C.onBeforeShadow(t,C,T,_,U,$,j),t.renderBufferDirect(_,null,U,$,C,j),C.onAfterShadow(t,C,T,_,U,$,j)}}}else if(F.visible){const B=b(C,F,A,R);C.onBeforeShadow(t,C,T,_,U,B,null),t.renderBufferDirect(_,null,U,B,C,null),C.onAfterShadow(t,C,T,_,U,B,null)}}const D=C.children;for(let U=0,F=D.length;U<F;U++)E(D[U],T,_,A,R)}function w(C){C.target.removeEventListener("dispose",w);for(const _ in u){const A=u[_],R=C.target.uuid;R in A&&(A[R].dispose(),delete A[R])}}}function XT(t,e){function n(){let k=!1;const he=new St;let ne=null;const pe=new St(0,0,0,0);return{setMask:function(_e){ne!==_e&&!k&&(t.colorMask(_e,_e,_e,_e),ne=_e)},setLocked:function(_e){k=_e},setClear:function(_e,se,Ie,Te,ft){ft===!0&&(_e*=Te,se*=Te,Ie*=Te),he.set(_e,se,Ie,Te),pe.equals(he)===!1&&(t.clearColor(_e,se,Ie,Te),pe.copy(he))},reset:function(){k=!1,ne=null,pe.set(-1,0,0,0)}}}function i(){let k=!1,he=!1,ne=null,pe=null,_e=null;return{setReversed:function(se){if(he!==se){const Ie=e.get("EXT_clip_control");se?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),he=se;const Te=_e;_e=null,this.setClear(Te)}},getReversed:function(){return he},setTest:function(se){se?ie(t.DEPTH_TEST):Se(t.DEPTH_TEST)},setMask:function(se){ne!==se&&!k&&(t.depthMask(se),ne=se)},setFunc:function(se){if(he&&(se=vM[se]),pe!==se){switch(se){case Yd:t.depthFunc(t.NEVER);break;case Kd:t.depthFunc(t.ALWAYS);break;case Zd:t.depthFunc(t.LESS);break;case uo:t.depthFunc(t.LEQUAL);break;case Jd:t.depthFunc(t.EQUAL);break;case Qd:t.depthFunc(t.GEQUAL);break;case ef:t.depthFunc(t.GREATER);break;case tf:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}pe=se}},setLocked:function(se){k=se},setClear:function(se){_e!==se&&(_e=se,he&&(se=1-se),t.clearDepth(se))},reset:function(){k=!1,ne=null,pe=null,_e=null,he=!1}}}function r(){let k=!1,he=null,ne=null,pe=null,_e=null,se=null,Ie=null,Te=null,ft=null;return{setTest:function(st){k||(st?ie(t.STENCIL_TEST):Se(t.STENCIL_TEST))},setMask:function(st){he!==st&&!k&&(t.stencilMask(st),he=st)},setFunc:function(st,Hn,ri){(ne!==st||pe!==Hn||_e!==ri)&&(t.stencilFunc(st,Hn,ri),ne=st,pe=Hn,_e=ri)},setOp:function(st,Hn,ri){(se!==st||Ie!==Hn||Te!==ri)&&(t.stencilOp(st,Hn,ri),se=st,Ie=Hn,Te=ri)},setLocked:function(st){k=st},setClear:function(st){ft!==st&&(t.clearStencil(st),ft=st)},reset:function(){k=!1,he=null,ne=null,pe=null,_e=null,se=null,Ie=null,Te=null,ft=null}}}const s=new n,o=new i,l=new r,c=new WeakMap,u=new WeakMap;let f={},p={},h={},m=new WeakMap,g=[],S=null,x=!1,d=null,v=null,b=null,E=null,w=null,C=null,T=null,_=new qe(0,0,0),A=0,R=!1,P=null,D=null,U=null,F=null,B=null;const Z=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,j=0;const z=t.getParameter(t.VERSION);z.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(z)[1]),X=j>=1):z.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),X=j>=2);let $=null,Q={};const ce=t.getParameter(t.SCISSOR_BOX),Me=t.getParameter(t.VIEWPORT),Ye=new St().fromArray(ce),He=new St().fromArray(Me);function Ve(k,he,ne,pe){const _e=new Uint8Array(4),se=t.createTexture();t.bindTexture(k,se),t.texParameteri(k,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(k,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ie=0;Ie<ne;Ie++)k===t.TEXTURE_3D||k===t.TEXTURE_2D_ARRAY?t.texImage3D(he,0,t.RGBA,1,1,pe,0,t.RGBA,t.UNSIGNED_BYTE,_e):t.texImage2D(he+Ie,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,_e);return se}const J={};J[t.TEXTURE_2D]=Ve(t.TEXTURE_2D,t.TEXTURE_2D,1),J[t.TEXTURE_CUBE_MAP]=Ve(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[t.TEXTURE_2D_ARRAY]=Ve(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),J[t.TEXTURE_3D]=Ve(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),l.setClear(0),ie(t.DEPTH_TEST),o.setFunc(uo),Ue(!1),it(rx),ie(t.CULL_FACE),je(Fi);function ie(k){f[k]!==!0&&(t.enable(k),f[k]=!0)}function Se(k){f[k]!==!1&&(t.disable(k),f[k]=!1)}function Be(k,he){return h[k]!==he?(t.bindFramebuffer(k,he),h[k]=he,k===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=he),k===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=he),!0):!1}function q(k,he){let ne=g,pe=!1;if(k){ne=m.get(he),ne===void 0&&(ne=[],m.set(he,ne));const _e=k.textures;if(ne.length!==_e.length||ne[0]!==t.COLOR_ATTACHMENT0){for(let se=0,Ie=_e.length;se<Ie;se++)ne[se]=t.COLOR_ATTACHMENT0+se;ne.length=_e.length,pe=!0}}else ne[0]!==t.BACK&&(ne[0]=t.BACK,pe=!0);pe&&t.drawBuffers(ne)}function le(k){return S!==k?(t.useProgram(k),S=k,!0):!1}const we={[ys]:t.FUNC_ADD,[Bb]:t.FUNC_SUBTRACT,[jb]:t.FUNC_REVERSE_SUBTRACT};we[zb]=t.MIN,we[Vb]=t.MAX;const Fe={[Gb]:t.ZERO,[Hb]:t.ONE,[Wb]:t.SRC_COLOR,[Yv]:t.SRC_ALPHA,[Zb]:t.SRC_ALPHA_SATURATE,[Yb]:t.DST_COLOR,[$b]:t.DST_ALPHA,[Xb]:t.ONE_MINUS_SRC_COLOR,[Kv]:t.ONE_MINUS_SRC_ALPHA,[Kb]:t.ONE_MINUS_DST_COLOR,[qb]:t.ONE_MINUS_DST_ALPHA,[Jb]:t.CONSTANT_COLOR,[Qb]:t.ONE_MINUS_CONSTANT_COLOR,[eM]:t.CONSTANT_ALPHA,[tM]:t.ONE_MINUS_CONSTANT_ALPHA};function je(k,he,ne,pe,_e,se,Ie,Te,ft,st){if(k===Fi){x===!0&&(Se(t.BLEND),x=!1);return}if(x===!1&&(ie(t.BLEND),x=!0),k!==Ob){if(k!==d||st!==R){if((v!==ys||w!==ys)&&(t.blendEquation(t.FUNC_ADD),v=ys,w=ys),st)switch(k){case ja:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case sx:t.blendFunc(t.ONE,t.ONE);break;case ax:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case ox:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:rt("WebGLState: Invalid blending: ",k);break}else switch(k){case ja:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case sx:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case ax:rt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ox:rt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:rt("WebGLState: Invalid blending: ",k);break}b=null,E=null,C=null,T=null,_.set(0,0,0),A=0,d=k,R=st}return}_e=_e||he,se=se||ne,Ie=Ie||pe,(he!==v||_e!==w)&&(t.blendEquationSeparate(we[he],we[_e]),v=he,w=_e),(ne!==b||pe!==E||se!==C||Ie!==T)&&(t.blendFuncSeparate(Fe[ne],Fe[pe],Fe[se],Fe[Ie]),b=ne,E=pe,C=se,T=Ie),(Te.equals(_)===!1||ft!==A)&&(t.blendColor(Te.r,Te.g,Te.b,ft),_.copy(Te),A=ft),d=k,R=!1}function Le(k,he){k.side===fi?Se(t.CULL_FACE):ie(t.CULL_FACE);let ne=k.side===Sn;he&&(ne=!ne),Ue(ne),k.blending===ja&&k.transparent===!1?je(Fi):je(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),o.setFunc(k.depthFunc),o.setTest(k.depthTest),o.setMask(k.depthWrite),s.setMask(k.colorWrite);const pe=k.stencilWrite;l.setTest(pe),pe&&(l.setMask(k.stencilWriteMask),l.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),l.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),pn(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?ie(t.SAMPLE_ALPHA_TO_COVERAGE):Se(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(k){P!==k&&(k?t.frontFace(t.CW):t.frontFace(t.CCW),P=k)}function it(k){k!==Ib?(ie(t.CULL_FACE),k!==D&&(k===rx?t.cullFace(t.BACK):k===Ub?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Se(t.CULL_FACE),D=k}function Rt(k){k!==U&&(X&&t.lineWidth(k),U=k)}function pn(k,he,ne){k?(ie(t.POLYGON_OFFSET_FILL),(F!==he||B!==ne)&&(F=he,B=ne,o.getReversed()&&(he=-he),t.polygonOffset(he,ne))):Se(t.POLYGON_OFFSET_FILL)}function _t(k){k?ie(t.SCISSOR_TEST):Se(t.SCISSOR_TEST)}function Dt(k){k===void 0&&(k=t.TEXTURE0+Z-1),$!==k&&(t.activeTexture(k),$=k)}function O(k,he,ne){ne===void 0&&($===null?ne=t.TEXTURE0+Z-1:ne=$);let pe=Q[ne];pe===void 0&&(pe={type:void 0,texture:void 0},Q[ne]=pe),(pe.type!==k||pe.texture!==he)&&($!==ne&&(t.activeTexture(ne),$=ne),t.bindTexture(k,he||J[k]),pe.type=k,pe.texture=he)}function Kt(){const k=Q[$];k!==void 0&&k.type!==void 0&&(t.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function ot(){try{t.compressedTexImage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function N(){try{t.compressedTexImage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function y(){try{t.texSubImage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function V(){try{t.texSubImage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function Y(){try{t.compressedTexSubImage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function ee(){try{t.compressedTexSubImage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function oe(){try{t.texStorage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function ue(){try{t.texStorage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function te(){try{t.texImage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function re(){try{t.texImage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function de(k){return p[k]!==void 0?p[k]:t.getParameter(k)}function De(k,he){p[k]!==he&&(t.pixelStorei(k,he),p[k]=he)}function me(k){Ye.equals(k)===!1&&(t.scissor(k.x,k.y,k.z,k.w),Ye.copy(k))}function fe(k){He.equals(k)===!1&&(t.viewport(k.x,k.y,k.z,k.w),He.copy(k))}function Pe(k,he){let ne=u.get(he);ne===void 0&&(ne=new WeakMap,u.set(he,ne));let pe=ne.get(k);pe===void 0&&(pe=t.getUniformBlockIndex(he,k.name),ne.set(k,pe))}function ke(k,he){const pe=u.get(he).get(k);c.get(he)!==pe&&(t.uniformBlockBinding(he,pe,k.__bindingPointIndex),c.set(he,pe))}function Ge(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),f={},p={},$=null,Q={},h={},m=new WeakMap,g=[],S=null,x=!1,d=null,v=null,b=null,E=null,w=null,C=null,T=null,_=new qe(0,0,0),A=0,R=!1,P=null,D=null,U=null,F=null,B=null,Ye.set(0,0,t.canvas.width,t.canvas.height),He.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),l.reset()}return{buffers:{color:s,depth:o,stencil:l},enable:ie,disable:Se,bindFramebuffer:Be,drawBuffers:q,useProgram:le,setBlending:je,setMaterial:Le,setFlipSided:Ue,setCullFace:it,setLineWidth:Rt,setPolygonOffset:pn,setScissorTest:_t,activeTexture:Dt,bindTexture:O,unbindTexture:Kt,compressedTexImage2D:ot,compressedTexImage3D:N,texImage2D:te,texImage3D:re,pixelStorei:De,getParameter:de,updateUBOMapping:Pe,uniformBlockBinding:ke,texStorage2D:oe,texStorage3D:ue,texSubImage2D:y,texSubImage3D:V,compressedTexSubImage2D:Y,compressedTexSubImage3D:ee,scissor:me,viewport:fe,reset:Ge}}function $T(t,e,n,i,r,s,o){const l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new Ze,f=new WeakMap,p=new Set;let h;const m=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(N,y){return g?new OffscreenCanvas(N,y):uc("canvas")}function x(N,y,V){let Y=1;const ee=ot(N);if((ee.width>V||ee.height>V)&&(Y=V/Math.max(ee.width,ee.height)),Y<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const oe=Math.floor(Y*ee.width),ue=Math.floor(Y*ee.height);h===void 0&&(h=S(oe,ue));const te=y?S(oe,ue):h;return te.width=oe,te.height=ue,te.getContext("2d").drawImage(N,0,0,oe,ue),Oe("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+oe+"x"+ue+")."),te}else return"data"in N&&Oe("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),N;return N}function d(N){return N.generateMipmaps}function v(N){t.generateMipmap(N)}function b(N){return N.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?t.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function E(N,y,V,Y,ee,oe=!1){if(N!==null){if(t[N]!==void 0)return t[N];Oe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let ue;Y&&(ue=e.get("EXT_texture_norm16"),ue||Oe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let te=y;if(y===t.RED&&(V===t.FLOAT&&(te=t.R32F),V===t.HALF_FLOAT&&(te=t.R16F),V===t.UNSIGNED_BYTE&&(te=t.R8),V===t.UNSIGNED_SHORT&&ue&&(te=ue.R16_EXT),V===t.SHORT&&ue&&(te=ue.R16_SNORM_EXT)),y===t.RED_INTEGER&&(V===t.UNSIGNED_BYTE&&(te=t.R8UI),V===t.UNSIGNED_SHORT&&(te=t.R16UI),V===t.UNSIGNED_INT&&(te=t.R32UI),V===t.BYTE&&(te=t.R8I),V===t.SHORT&&(te=t.R16I),V===t.INT&&(te=t.R32I)),y===t.RG&&(V===t.FLOAT&&(te=t.RG32F),V===t.HALF_FLOAT&&(te=t.RG16F),V===t.UNSIGNED_BYTE&&(te=t.RG8),V===t.UNSIGNED_SHORT&&ue&&(te=ue.RG16_EXT),V===t.SHORT&&ue&&(te=ue.RG16_SNORM_EXT)),y===t.RG_INTEGER&&(V===t.UNSIGNED_BYTE&&(te=t.RG8UI),V===t.UNSIGNED_SHORT&&(te=t.RG16UI),V===t.UNSIGNED_INT&&(te=t.RG32UI),V===t.BYTE&&(te=t.RG8I),V===t.SHORT&&(te=t.RG16I),V===t.INT&&(te=t.RG32I)),y===t.RGB_INTEGER&&(V===t.UNSIGNED_BYTE&&(te=t.RGB8UI),V===t.UNSIGNED_SHORT&&(te=t.RGB16UI),V===t.UNSIGNED_INT&&(te=t.RGB32UI),V===t.BYTE&&(te=t.RGB8I),V===t.SHORT&&(te=t.RGB16I),V===t.INT&&(te=t.RGB32I)),y===t.RGBA_INTEGER&&(V===t.UNSIGNED_BYTE&&(te=t.RGBA8UI),V===t.UNSIGNED_SHORT&&(te=t.RGBA16UI),V===t.UNSIGNED_INT&&(te=t.RGBA32UI),V===t.BYTE&&(te=t.RGBA8I),V===t.SHORT&&(te=t.RGBA16I),V===t.INT&&(te=t.RGBA32I)),y===t.RGB&&(V===t.UNSIGNED_SHORT&&ue&&(te=ue.RGB16_EXT),V===t.SHORT&&ue&&(te=ue.RGB16_SNORM_EXT),V===t.UNSIGNED_INT_5_9_9_9_REV&&(te=t.RGB9_E5),V===t.UNSIGNED_INT_10F_11F_11F_REV&&(te=t.R11F_G11F_B10F)),y===t.RGBA){const re=oe?cc:et.getTransfer(ee);V===t.FLOAT&&(te=t.RGBA32F),V===t.HALF_FLOAT&&(te=t.RGBA16F),V===t.UNSIGNED_BYTE&&(te=re===lt?t.SRGB8_ALPHA8:t.RGBA8),V===t.UNSIGNED_SHORT&&ue&&(te=ue.RGBA16_EXT),V===t.SHORT&&ue&&(te=ue.RGBA16_SNORM_EXT),V===t.UNSIGNED_SHORT_4_4_4_4&&(te=t.RGBA4),V===t.UNSIGNED_SHORT_5_5_5_1&&(te=t.RGB5_A1)}return(te===t.R16F||te===t.R32F||te===t.RG16F||te===t.RG32F||te===t.RGBA16F||te===t.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function w(N,y){let V;return N?y===null||y===vi||y===ho?V=t.DEPTH24_STENCIL8:y===hi?V=t.DEPTH32F_STENCIL8:y===fo&&(V=t.DEPTH24_STENCIL8,Oe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===vi||y===ho?V=t.DEPTH_COMPONENT24:y===hi?V=t.DEPTH_COMPONENT32F:y===fo&&(V=t.DEPTH_COMPONENT16),V}function C(N,y){return d(N)===!0||N.isFramebufferTexture&&N.minFilter!==Xt&&N.minFilter!==rn?Math.log2(Math.max(y.width,y.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?y.mipmaps.length:1}function T(N){const y=N.target;y.removeEventListener("dispose",T),A(y),y.isVideoTexture&&f.delete(y),y.isHTMLTexture&&p.delete(y)}function _(N){const y=N.target;y.removeEventListener("dispose",_),P(y)}function A(N){const y=i.get(N);if(y.__webglInit===void 0)return;const V=N.source,Y=m.get(V);if(Y){const ee=Y[y.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&R(N),Object.keys(Y).length===0&&m.delete(V)}i.remove(N)}function R(N){const y=i.get(N);t.deleteTexture(y.__webglTexture);const V=N.source,Y=m.get(V);delete Y[y.__cacheKey],o.memory.textures--}function P(N){const y=i.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),i.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(y.__webglFramebuffer[Y]))for(let ee=0;ee<y.__webglFramebuffer[Y].length;ee++)t.deleteFramebuffer(y.__webglFramebuffer[Y][ee]);else t.deleteFramebuffer(y.__webglFramebuffer[Y]);y.__webglDepthbuffer&&t.deleteRenderbuffer(y.__webglDepthbuffer[Y])}else{if(Array.isArray(y.__webglFramebuffer))for(let Y=0;Y<y.__webglFramebuffer.length;Y++)t.deleteFramebuffer(y.__webglFramebuffer[Y]);else t.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&t.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&t.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let Y=0;Y<y.__webglColorRenderbuffer.length;Y++)y.__webglColorRenderbuffer[Y]&&t.deleteRenderbuffer(y.__webglColorRenderbuffer[Y]);y.__webglDepthRenderbuffer&&t.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const V=N.textures;for(let Y=0,ee=V.length;Y<ee;Y++){const oe=i.get(V[Y]);oe.__webglTexture&&(t.deleteTexture(oe.__webglTexture),o.memory.textures--),i.remove(V[Y])}i.remove(N)}let D=0;function U(){D=0}function F(){return D}function B(N){D=N}function Z(){const N=D;return N>=r.maxTextures&&Oe("WebGLTextures: Trying to use "+(N+1)+" texture units while this GPU supports only "+r.maxTextures),D+=1,N}function X(N){const y=[];return y.push(N.wrapS),y.push(N.wrapT),y.push(N.wrapR||0),y.push(N.magFilter),y.push(N.minFilter),y.push(N.anisotropy),y.push(N.internalFormat),y.push(N.format),y.push(N.type),y.push(N.generateMipmaps),y.push(N.premultiplyAlpha),y.push(N.flipY),y.push(N.unpackAlignment),y.push(N.colorSpace),y.join()}function j(N,y){const V=i.get(N);if(N.isVideoTexture&&O(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&V.__version!==N.version){const Y=N.image;if(Y===null)Oe("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Oe("WebGLRenderer: Texture marked for update but image is incomplete");else{Se(V,N,y);return}}else N.isExternalTexture&&(V.__webglTexture=N.sourceTexture?N.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,V.__webglTexture,t.TEXTURE0+y)}function z(N,y){const V=i.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&V.__version!==N.version){Se(V,N,y);return}else N.isExternalTexture&&(V.__webglTexture=N.sourceTexture?N.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,V.__webglTexture,t.TEXTURE0+y)}function $(N,y){const V=i.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&V.__version!==N.version){Se(V,N,y);return}n.bindTexture(t.TEXTURE_3D,V.__webglTexture,t.TEXTURE0+y)}function Q(N,y){const V=i.get(N);if(N.isCubeDepthTexture!==!0&&N.version>0&&V.__version!==N.version){Be(V,N,y);return}n.bindTexture(t.TEXTURE_CUBE_MAP,V.__webglTexture,t.TEXTURE0+y)}const ce={[nf]:t.REPEAT,[Di]:t.CLAMP_TO_EDGE,[rf]:t.MIRRORED_REPEAT},Me={[Xt]:t.NEAREST,[rM]:t.NEAREST_MIPMAP_NEAREST,[Wo]:t.NEAREST_MIPMAP_LINEAR,[rn]:t.LINEAR,[xu]:t.LINEAR_MIPMAP_NEAREST,[Br]:t.LINEAR_MIPMAP_LINEAR},Ye={[lM]:t.NEVER,[hM]:t.ALWAYS,[cM]:t.LESS,[Jh]:t.LEQUAL,[uM]:t.EQUAL,[Qh]:t.GEQUAL,[dM]:t.GREATER,[fM]:t.NOTEQUAL};function He(N,y){if(y.type===hi&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===rn||y.magFilter===xu||y.magFilter===Wo||y.magFilter===Br||y.minFilter===rn||y.minFilter===xu||y.minFilter===Wo||y.minFilter===Br)&&Oe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(N,t.TEXTURE_WRAP_S,ce[y.wrapS]),t.texParameteri(N,t.TEXTURE_WRAP_T,ce[y.wrapT]),(N===t.TEXTURE_3D||N===t.TEXTURE_2D_ARRAY)&&t.texParameteri(N,t.TEXTURE_WRAP_R,ce[y.wrapR]),t.texParameteri(N,t.TEXTURE_MAG_FILTER,Me[y.magFilter]),t.texParameteri(N,t.TEXTURE_MIN_FILTER,Me[y.minFilter]),y.compareFunction&&(t.texParameteri(N,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(N,t.TEXTURE_COMPARE_FUNC,Ye[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Xt||y.minFilter!==Wo&&y.minFilter!==Br||y.type===hi&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");t.texParameterf(N,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,r.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function Ve(N,y){let V=!1;N.__webglInit===void 0&&(N.__webglInit=!0,y.addEventListener("dispose",T));const Y=y.source;let ee=m.get(Y);ee===void 0&&(ee={},m.set(Y,ee));const oe=X(y);if(oe!==N.__cacheKey){ee[oe]===void 0&&(ee[oe]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,V=!0),ee[oe].usedTimes++;const ue=ee[N.__cacheKey];ue!==void 0&&(ee[N.__cacheKey].usedTimes--,ue.usedTimes===0&&R(y)),N.__cacheKey=oe,N.__webglTexture=ee[oe].texture}return V}function J(N,y,V){return Math.floor(Math.floor(N/V)/y)}function ie(N,y,V,Y){const oe=N.updateRanges;if(oe.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,y.width,y.height,V,Y,y.data);else{oe.sort((De,me)=>De.start-me.start);let ue=0;for(let De=1;De<oe.length;De++){const me=oe[ue],fe=oe[De],Pe=me.start+me.count,ke=J(fe.start,y.width,4),Ge=J(me.start,y.width,4);fe.start<=Pe+1&&ke===Ge&&J(fe.start+fe.count-1,y.width,4)===ke?me.count=Math.max(me.count,fe.start+fe.count-me.start):(++ue,oe[ue]=fe)}oe.length=ue+1;const te=n.getParameter(t.UNPACK_ROW_LENGTH),re=n.getParameter(t.UNPACK_SKIP_PIXELS),de=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,y.width);for(let De=0,me=oe.length;De<me;De++){const fe=oe[De],Pe=Math.floor(fe.start/4),ke=Math.ceil(fe.count/4),Ge=Pe%y.width,k=Math.floor(Pe/y.width),he=ke,ne=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(t.UNPACK_SKIP_ROWS,k),n.texSubImage2D(t.TEXTURE_2D,0,Ge,k,he,ne,V,Y,y.data)}N.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,te),n.pixelStorei(t.UNPACK_SKIP_PIXELS,re),n.pixelStorei(t.UNPACK_SKIP_ROWS,de)}}function Se(N,y,V){let Y=t.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(Y=t.TEXTURE_2D_ARRAY),y.isData3DTexture&&(Y=t.TEXTURE_3D);const ee=Ve(N,y),oe=y.source;n.bindTexture(Y,N.__webglTexture,t.TEXTURE0+V);const ue=i.get(oe);if(oe.version!==ue.__version||ee===!0){if(n.activeTexture(t.TEXTURE0+V),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const ne=et.getPrimaries(et.workingColorSpace),pe=y.colorSpace===ar?null:et.getPrimaries(y.colorSpace),_e=y.colorSpace===ar||ne===pe?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e)}n.pixelStorei(t.UNPACK_ALIGNMENT,y.unpackAlignment);let re=x(y.image,!1,r.maxTextureSize);re=Kt(y,re);const de=s.convert(y.format,y.colorSpace),De=s.convert(y.type);let me=E(y.internalFormat,de,De,y.normalized,y.colorSpace,y.isVideoTexture);He(Y,y);let fe;const Pe=y.mipmaps,ke=y.isVideoTexture!==!0,Ge=ue.__version===void 0||ee===!0,k=oe.dataReady,he=C(y,re);if(y.isDepthTexture)me=w(y.format===jr,y.type),Ge&&(ke?n.texStorage2D(t.TEXTURE_2D,1,me,re.width,re.height):n.texImage2D(t.TEXTURE_2D,0,me,re.width,re.height,0,de,De,null));else if(y.isDataTexture)if(Pe.length>0){ke&&Ge&&n.texStorage2D(t.TEXTURE_2D,he,me,Pe[0].width,Pe[0].height);for(let ne=0,pe=Pe.length;ne<pe;ne++)fe=Pe[ne],ke?k&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,fe.width,fe.height,de,De,fe.data):n.texImage2D(t.TEXTURE_2D,ne,me,fe.width,fe.height,0,de,De,fe.data);y.generateMipmaps=!1}else ke?(Ge&&n.texStorage2D(t.TEXTURE_2D,he,me,re.width,re.height),k&&ie(y,re,de,De)):n.texImage2D(t.TEXTURE_2D,0,me,re.width,re.height,0,de,De,re.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){ke&&Ge&&n.texStorage3D(t.TEXTURE_2D_ARRAY,he,me,Pe[0].width,Pe[0].height,re.depth);for(let ne=0,pe=Pe.length;ne<pe;ne++)if(fe=Pe[ne],y.format!==Qn)if(de!==null)if(ke){if(k)if(y.layerUpdates.size>0){const _e=Ux(fe.width,fe.height,y.format,y.type);for(const se of y.layerUpdates){const Ie=fe.data.subarray(se*_e/fe.data.BYTES_PER_ELEMENT,(se+1)*_e/fe.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,se,fe.width,fe.height,1,de,Ie)}}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,0,fe.width,fe.height,re.depth,de,fe.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ne,me,fe.width,fe.height,re.depth,0,fe.data,0,0);else Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?k&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,0,fe.width,fe.height,re.depth,de,De,fe.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ne,me,fe.width,fe.height,re.depth,0,de,De,fe.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{ke&&Ge&&n.texStorage2D(t.TEXTURE_2D,he,me,Pe[0].width,Pe[0].height);for(let ne=0,pe=Pe.length;ne<pe;ne++)fe=Pe[ne],y.format!==Qn?de!==null?ke?k&&n.compressedTexSubImage2D(t.TEXTURE_2D,ne,0,0,fe.width,fe.height,de,fe.data):n.compressedTexImage2D(t.TEXTURE_2D,ne,me,fe.width,fe.height,0,fe.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?k&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,fe.width,fe.height,de,De,fe.data):n.texImage2D(t.TEXTURE_2D,ne,me,fe.width,fe.height,0,de,De,fe.data)}else if(y.isDataArrayTexture)if(ke){if(Ge&&n.texStorage3D(t.TEXTURE_2D_ARRAY,he,me,re.width,re.height,re.depth),k)if(y.layerUpdates.size>0){const ne=Ux(re.width,re.height,y.format,y.type);for(const pe of y.layerUpdates){const _e=re.data.subarray(pe*ne/re.data.BYTES_PER_ELEMENT,(pe+1)*ne/re.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,pe,re.width,re.height,1,de,De,_e)}y.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,de,De,re.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,me,re.width,re.height,re.depth,0,de,De,re.data);else if(y.isData3DTexture)ke?(Ge&&n.texStorage3D(t.TEXTURE_3D,he,me,re.width,re.height,re.depth),k&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,de,De,re.data)):n.texImage3D(t.TEXTURE_3D,0,me,re.width,re.height,re.depth,0,de,De,re.data);else if(y.isFramebufferTexture){if(Ge)if(ke)n.texStorage2D(t.TEXTURE_2D,he,me,re.width,re.height);else{let ne=re.width,pe=re.height;for(let _e=0;_e<he;_e++)n.texImage2D(t.TEXTURE_2D,_e,me,ne,pe,0,de,De,null),ne>>=1,pe>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in t){const ne=t.canvas;if(ne.hasAttribute("layoutsubtree")||ne.setAttribute("layoutsubtree","true"),re.parentNode!==ne){ne.appendChild(re),p.add(y),ne.onpaint=pe=>{const _e=pe.changedElements;for(const se of p)_e.includes(se.image)&&(se.needsUpdate=!0)},ne.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,re);else{const _e=t.RGBA,se=t.RGBA,Ie=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,_e,se,Ie,re)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(Pe.length>0){if(ke&&Ge){const ne=ot(Pe[0]);n.texStorage2D(t.TEXTURE_2D,he,me,ne.width,ne.height)}for(let ne=0,pe=Pe.length;ne<pe;ne++)fe=Pe[ne],ke?k&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,de,De,fe):n.texImage2D(t.TEXTURE_2D,ne,me,de,De,fe);y.generateMipmaps=!1}else if(ke){if(Ge){const ne=ot(re);n.texStorage2D(t.TEXTURE_2D,he,me,ne.width,ne.height)}k&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,de,De,re)}else n.texImage2D(t.TEXTURE_2D,0,me,de,De,re);d(y)&&v(Y),ue.__version=oe.version,y.onUpdate&&y.onUpdate(y)}N.__version=y.version}function Be(N,y,V){if(y.image.length!==6)return;const Y=Ve(N,y),ee=y.source;n.bindTexture(t.TEXTURE_CUBE_MAP,N.__webglTexture,t.TEXTURE0+V);const oe=i.get(ee);if(ee.version!==oe.__version||Y===!0){n.activeTexture(t.TEXTURE0+V);const ue=et.getPrimaries(et.workingColorSpace),te=y.colorSpace===ar?null:et.getPrimaries(y.colorSpace),re=y.colorSpace===ar||ue===te?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,re);const de=y.isCompressedTexture||y.image[0].isCompressedTexture,De=y.image[0]&&y.image[0].isDataTexture,me=[];for(let se=0;se<6;se++)!de&&!De?me[se]=x(y.image[se],!0,r.maxCubemapSize):me[se]=De?y.image[se].image:y.image[se],me[se]=Kt(y,me[se]);const fe=me[0],Pe=s.convert(y.format,y.colorSpace),ke=s.convert(y.type),Ge=E(y.internalFormat,Pe,ke,y.normalized,y.colorSpace),k=y.isVideoTexture!==!0,he=oe.__version===void 0||Y===!0,ne=ee.dataReady;let pe=C(y,fe);He(t.TEXTURE_CUBE_MAP,y);let _e;if(de){k&&he&&n.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Ge,fe.width,fe.height);for(let se=0;se<6;se++){_e=me[se].mipmaps;for(let Ie=0;Ie<_e.length;Ie++){const Te=_e[Ie];y.format!==Qn?Pe!==null?k?ne&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,0,0,Te.width,Te.height,Pe,Te.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,Ge,Te.width,Te.height,0,Te.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,0,0,Te.width,Te.height,Pe,ke,Te.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,Ge,Te.width,Te.height,0,Pe,ke,Te.data)}}}else{if(_e=y.mipmaps,k&&he){_e.length>0&&pe++;const se=ot(me[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Ge,se.width,se.height)}for(let se=0;se<6;se++)if(De){k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,me[se].width,me[se].height,Pe,ke,me[se].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ge,me[se].width,me[se].height,0,Pe,ke,me[se].data);for(let Ie=0;Ie<_e.length;Ie++){const ft=_e[Ie].image[se].image;k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,0,0,ft.width,ft.height,Pe,ke,ft.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,Ge,ft.width,ft.height,0,Pe,ke,ft.data)}}else{k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Pe,ke,me[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ge,Pe,ke,me[se]);for(let Ie=0;Ie<_e.length;Ie++){const Te=_e[Ie];k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,0,0,Pe,ke,Te.image[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,Ge,Pe,ke,Te.image[se])}}}d(y)&&v(t.TEXTURE_CUBE_MAP),oe.__version=ee.version,y.onUpdate&&y.onUpdate(y)}N.__version=y.version}function q(N,y,V,Y,ee,oe){const ue=s.convert(V.format,V.colorSpace),te=s.convert(V.type),re=E(V.internalFormat,ue,te,V.normalized,V.colorSpace),de=i.get(y),De=i.get(V);if(De.__renderTarget=y,!de.__hasExternalTextures){const me=Math.max(1,y.width>>oe),fe=Math.max(1,y.height>>oe);ee===t.TEXTURE_3D||ee===t.TEXTURE_2D_ARRAY?n.texImage3D(ee,oe,re,me,fe,y.depth,0,ue,te,null):n.texImage2D(ee,oe,re,me,fe,0,ue,te,null)}n.bindFramebuffer(t.FRAMEBUFFER,N),Dt(y)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Y,ee,De.__webglTexture,0,_t(y)):(ee===t.TEXTURE_2D||ee>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Y,ee,De.__webglTexture,oe),n.bindFramebuffer(t.FRAMEBUFFER,null)}function le(N,y,V){if(t.bindRenderbuffer(t.RENDERBUFFER,N),y.depthBuffer){const Y=y.depthTexture,ee=Y&&Y.isDepthTexture?Y.type:null,oe=w(y.stencilBuffer,ee),ue=y.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Dt(y)?l.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,_t(y),oe,y.width,y.height):V?t.renderbufferStorageMultisample(t.RENDERBUFFER,_t(y),oe,y.width,y.height):t.renderbufferStorage(t.RENDERBUFFER,oe,y.width,y.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ue,t.RENDERBUFFER,N)}else{const Y=y.textures;for(let ee=0;ee<Y.length;ee++){const oe=Y[ee],ue=s.convert(oe.format,oe.colorSpace),te=s.convert(oe.type),re=E(oe.internalFormat,ue,te,oe.normalized,oe.colorSpace);Dt(y)?l.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,_t(y),re,y.width,y.height):V?t.renderbufferStorageMultisample(t.RENDERBUFFER,_t(y),re,y.width,y.height):t.renderbufferStorage(t.RENDERBUFFER,re,y.width,y.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function we(N,y,V){const Y=y.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,N),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ee=i.get(y.depthTexture);if(ee.__renderTarget=y,(!ee.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),Y){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,y.depthTexture.addEventListener("dispose",T)),ee.__webglTexture===void 0){ee.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,ee.__webglTexture),He(t.TEXTURE_CUBE_MAP,y.depthTexture);const de=s.convert(y.depthTexture.format),De=s.convert(y.depthTexture.type);let me;y.depthTexture.format===zi?me=t.DEPTH_COMPONENT24:y.depthTexture.format===jr&&(me=t.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,me,y.width,y.height,0,de,De,null)}}else j(y.depthTexture,0);const oe=ee.__webglTexture,ue=_t(y),te=Y?t.TEXTURE_CUBE_MAP_POSITIVE_X+V:t.TEXTURE_2D,re=y.depthTexture.format===jr?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(y.depthTexture.format===zi)Dt(y)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,re,te,oe,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,re,te,oe,0);else if(y.depthTexture.format===jr)Dt(y)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,re,te,oe,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,re,te,oe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Fe(N){const y=i.get(N),V=N.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==N.depthTexture){const Y=N.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),Y){const ee=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,Y.removeEventListener("dispose",ee)};Y.addEventListener("dispose",ee),y.__depthDisposeCallback=ee}y.__boundDepthTexture=Y}if(N.depthTexture&&!y.__autoAllocateDepthBuffer)if(V)for(let Y=0;Y<6;Y++)we(y.__webglFramebuffer[Y],N,Y);else{const Y=N.texture.mipmaps;Y&&Y.length>0?we(y.__webglFramebuffer[0],N,0):we(y.__webglFramebuffer,N,0)}else if(V){y.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(n.bindFramebuffer(t.FRAMEBUFFER,y.__webglFramebuffer[Y]),y.__webglDepthbuffer[Y]===void 0)y.__webglDepthbuffer[Y]=t.createRenderbuffer(),le(y.__webglDepthbuffer[Y],N,!1);else{const ee=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,oe=y.__webglDepthbuffer[Y];t.bindRenderbuffer(t.RENDERBUFFER,oe),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,oe)}}else{const Y=N.texture.mipmaps;if(Y&&Y.length>0?n.bindFramebuffer(t.FRAMEBUFFER,y.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=t.createRenderbuffer(),le(y.__webglDepthbuffer,N,!1);else{const ee=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,oe=y.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,oe),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,oe)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function je(N,y,V){const Y=i.get(N);y!==void 0&&q(Y.__webglFramebuffer,N,N.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),V!==void 0&&Fe(N)}function Le(N){const y=N.texture,V=i.get(N),Y=i.get(y);N.addEventListener("dispose",_);const ee=N.textures,oe=N.isWebGLCubeRenderTarget===!0,ue=ee.length>1;if(ue||(Y.__webglTexture===void 0&&(Y.__webglTexture=t.createTexture()),Y.__version=y.version,o.memory.textures++),oe){V.__webglFramebuffer=[];for(let te=0;te<6;te++)if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer[te]=[];for(let re=0;re<y.mipmaps.length;re++)V.__webglFramebuffer[te][re]=t.createFramebuffer()}else V.__webglFramebuffer[te]=t.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer=[];for(let te=0;te<y.mipmaps.length;te++)V.__webglFramebuffer[te]=t.createFramebuffer()}else V.__webglFramebuffer=t.createFramebuffer();if(ue)for(let te=0,re=ee.length;te<re;te++){const de=i.get(ee[te]);de.__webglTexture===void 0&&(de.__webglTexture=t.createTexture(),o.memory.textures++)}if(N.samples>0&&Dt(N)===!1){V.__webglMultisampledFramebuffer=t.createFramebuffer(),V.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let te=0;te<ee.length;te++){const re=ee[te];V.__webglColorRenderbuffer[te]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,V.__webglColorRenderbuffer[te]);const de=s.convert(re.format,re.colorSpace),De=s.convert(re.type),me=E(re.internalFormat,de,De,re.normalized,re.colorSpace,N.isXRRenderTarget===!0),fe=_t(N);t.renderbufferStorageMultisample(t.RENDERBUFFER,fe,me,N.width,N.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+te,t.RENDERBUFFER,V.__webglColorRenderbuffer[te])}t.bindRenderbuffer(t.RENDERBUFFER,null),N.depthBuffer&&(V.__webglDepthRenderbuffer=t.createRenderbuffer(),le(V.__webglDepthRenderbuffer,N,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(oe){n.bindTexture(t.TEXTURE_CUBE_MAP,Y.__webglTexture),He(t.TEXTURE_CUBE_MAP,y);for(let te=0;te<6;te++)if(y.mipmaps&&y.mipmaps.length>0)for(let re=0;re<y.mipmaps.length;re++)q(V.__webglFramebuffer[te][re],N,y,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+te,re);else q(V.__webglFramebuffer[te],N,y,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);d(y)&&v(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ue){for(let te=0,re=ee.length;te<re;te++){const de=ee[te],De=i.get(de);let me=t.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(me=N.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(me,De.__webglTexture),He(me,de),q(V.__webglFramebuffer,N,de,t.COLOR_ATTACHMENT0+te,me,0),d(de)&&v(me)}n.unbindTexture()}else{let te=t.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(te=N.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(te,Y.__webglTexture),He(te,y),y.mipmaps&&y.mipmaps.length>0)for(let re=0;re<y.mipmaps.length;re++)q(V.__webglFramebuffer[re],N,y,t.COLOR_ATTACHMENT0,te,re);else q(V.__webglFramebuffer,N,y,t.COLOR_ATTACHMENT0,te,0);d(y)&&v(te),n.unbindTexture()}N.depthBuffer&&Fe(N)}function Ue(N){const y=N.textures;for(let V=0,Y=y.length;V<Y;V++){const ee=y[V];if(d(ee)){const oe=b(N),ue=i.get(ee).__webglTexture;n.bindTexture(oe,ue),v(oe),n.unbindTexture()}}}const it=[],Rt=[];function pn(N){if(N.samples>0){if(Dt(N)===!1){const y=N.textures,V=N.width,Y=N.height;let ee=t.COLOR_BUFFER_BIT;const oe=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=i.get(N),te=y.length>1;if(te)for(let de=0;de<y.length;de++)n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);const re=N.texture.mipmaps;re&&re.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let de=0;de<y.length;de++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(ee|=t.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(ee|=t.STENCIL_BUFFER_BIT)),te){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ue.__webglColorRenderbuffer[de]);const De=i.get(y[de]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,De,0)}t.blitFramebuffer(0,0,V,Y,0,0,V,Y,ee,t.NEAREST),c===!0&&(it.length=0,Rt.length=0,it.push(t.COLOR_ATTACHMENT0+de),N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&(it.push(oe),Rt.push(oe),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Rt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,it))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),te)for(let de=0;de<y.length;de++){n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.RENDERBUFFER,ue.__webglColorRenderbuffer[de]);const De=i.get(y[de]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.TEXTURE_2D,De,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&c){const y=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[y])}}}function _t(N){return Math.min(r.maxSamples,N.samples)}function Dt(N){const y=i.get(N);return N.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function O(N){const y=o.render.frame;f.get(N)!==y&&(f.set(N,y),N.update())}function Kt(N,y){const V=N.colorSpace,Y=N.format,ee=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||V!==lc&&V!==ar&&(et.getTransfer(V)===lt?(Y!==Qn||ee!==An)&&Oe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):rt("WebGLTextures: Unsupported texture color space:",V)),y}function ot(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(u.width=N.naturalWidth||N.width,u.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(u.width=N.displayWidth,u.height=N.displayHeight):(u.width=N.width,u.height=N.height),u}this.allocateTextureUnit=Z,this.resetTextureUnits=U,this.getTextureUnits=F,this.setTextureUnits=B,this.setTexture2D=j,this.setTexture2DArray=z,this.setTexture3D=$,this.setTextureCube=Q,this.rebindTextures=je,this.setupRenderTarget=Le,this.updateRenderTargetMipmap=Ue,this.updateMultisampleRenderTarget=pn,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=q,this.useMultisampledRTT=Dt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function qT(t,e){function n(i,r=ar){let s;const o=et.getTransfer(r);if(i===An)return t.UNSIGNED_BYTE;if(i===$h)return t.UNSIGNED_SHORT_4_4_4_4;if(i===qh)return t.UNSIGNED_SHORT_5_5_5_1;if(i===o_)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===l_)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===s_)return t.BYTE;if(i===a_)return t.SHORT;if(i===fo)return t.UNSIGNED_SHORT;if(i===Xh)return t.INT;if(i===vi)return t.UNSIGNED_INT;if(i===hi)return t.FLOAT;if(i===_i)return t.HALF_FLOAT;if(i===c_)return t.ALPHA;if(i===u_)return t.RGB;if(i===Qn)return t.RGBA;if(i===zi)return t.DEPTH_COMPONENT;if(i===jr)return t.DEPTH_STENCIL;if(i===d_)return t.RED;if(i===Yh)return t.RED_INTEGER;if(i===Zr)return t.RG;if(i===Kh)return t.RG_INTEGER;if(i===Zh)return t.RGBA_INTEGER;if(i===Tl||i===Nl||i===Rl||i===Dl)if(o===lt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Tl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Nl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Rl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Dl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Tl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Nl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Rl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Dl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===sf||i===af||i===of||i===lf)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===sf)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===af)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===of)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===lf)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===cf||i===uf||i===df||i===ff||i===hf||i===ac||i===pf)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===cf||i===uf)return o===lt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===df)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===ff)return s.COMPRESSED_R11_EAC;if(i===hf)return s.COMPRESSED_SIGNED_R11_EAC;if(i===ac)return s.COMPRESSED_RG11_EAC;if(i===pf)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===mf||i===xf||i===gf||i===vf||i===_f||i===yf||i===Sf||i===Ef||i===bf||i===Mf||i===wf||i===Cf||i===Af||i===Tf)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===mf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===xf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===gf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===vf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===_f)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===yf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Sf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ef)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===bf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Mf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===wf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Cf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Af)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Tf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Nf||i===Rf||i===Df)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Nf)return o===lt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Rf)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Df)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Pf||i===Ff||i===oc||i===Lf)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Pf)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Ff)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===oc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Lf)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ho?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const YT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,KT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class ZT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new y_(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new yi({vertexShader:YT,fragmentShader:KT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Nn(new Lc(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class JT extends is{constructor(e,n){super();const i=this;let r=null,s=1,o=null,l="local-floor",c=1,u=null,f=null,p=null,h=null,m=null,g=null;const S=typeof XRWebGLBinding<"u",x=new ZT,d={},v=n.getContextAttributes();let b=null,E=null;const w=[],C=[],T=new Ze;let _=null,A=null;const R=new Cn;R.viewport=new St;const P=new Cn;P.viewport=new St;const D=[R,P],U=new a2;let F=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ie=w[J];return ie===void 0&&(ie=new wu,w[J]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(J){let ie=w[J];return ie===void 0&&(ie=new wu,w[J]=ie),ie.getGripSpace()},this.getHand=function(J){let ie=w[J];return ie===void 0&&(ie=new wu,w[J]=ie),ie.getHandSpace()};function Z(J){const ie=C.indexOf(J.inputSource);if(ie===-1)return;const Se=w[ie];Se!==void 0&&(Se.update(J.inputSource,J.frame,u||o),Se.dispatchEvent({type:J.type,data:J.inputSource}))}function X(){r.removeEventListener("select",Z),r.removeEventListener("selectstart",Z),r.removeEventListener("selectend",Z),r.removeEventListener("squeeze",Z),r.removeEventListener("squeezestart",Z),r.removeEventListener("squeezeend",Z),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",j);for(let J=0;J<w.length;J++){const ie=C[J];ie!==null&&(C[J]=null,w[J].disconnect(ie))}F=null,B=null,x.reset();for(const J in d)delete d[J];if(e.setRenderTarget(b),m=null,h=null,p=null,r=null,E=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(T.width,T.height,!1),A!==null){const J=A.camera;J.fov=A.fov,J.zoom=A.zoom,J.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,i.isPresenting===!0&&Oe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){l=J,i.isPresenting===!0&&Oe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||o},this.setReferenceSpace=function(J){u=J},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return p===null&&S&&(p=new XRWebGLBinding(r,n)),p},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(J){if(r=J,r!==null){if(b=e.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",X),r.addEventListener("inputsourceschange",j),v.xrCompatible!==!0&&await n.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(T),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,Be=null,q=null;v.depth&&(q=v.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Se=v.stencil?jr:zi,Be=v.stencil?ho:vi);const le={colorFormat:n.RGBA8,depthFormat:q,scaleFactor:s};p=this.getBinding(),h=p.createProjectionLayer(le),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),E=new ni(h.textureWidth,h.textureHeight,{format:Qn,type:An,depthTexture:new mo(h.textureWidth,h.textureHeight,Be,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const Se={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,n,Se),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),E=new ni(m.framebufferWidth,m.framebufferHeight,{format:Qn,type:An,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1,storeMultisampledDepthBuffer:m.ignoreDepthValues===!1,storeMultisampledStencilBuffer:m.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(c),u=null,o=await r.requestReferenceSpace(l),Ve.setContext(r),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function j(J){for(let ie=0;ie<J.removed.length;ie++){const Se=J.removed[ie],Be=C.indexOf(Se);Be>=0&&(C[Be]=null,w[Be].disconnect(Se))}for(let ie=0;ie<J.added.length;ie++){const Se=J.added[ie];let Be=C.indexOf(Se);if(Be===-1){for(let le=0;le<w.length;le++)if(le>=C.length){C.push(Se),Be=le;break}else if(C[le]===null){C[le]=Se,Be=le;break}if(Be===-1)break}const q=w[Be];q&&q.connect(Se)}}const z=new G,$=new G;function Q(J,ie,Se){z.setFromMatrixPosition(ie.matrixWorld),$.setFromMatrixPosition(Se.matrixWorld);const Be=z.distanceTo($),q=ie.projectionMatrix.elements,le=Se.projectionMatrix.elements,we=q[14]/(q[10]-1),Fe=q[14]/(q[10]+1),je=(q[9]+1)/q[5],Le=(q[9]-1)/q[5],Ue=(q[8]-1)/q[0],it=(le[8]+1)/le[0],Rt=we*Ue,pn=we*it,_t=Be/(-Ue+it),Dt=_t*-Ue;if(ie.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Dt),J.translateZ(_t),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),q[10]===-1)J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const O=we+_t,Kt=Fe+_t,ot=Rt-Dt,N=pn+(Be-Dt),y=je*Fe/Kt*O,V=Le*Fe/Kt*O;J.projectionMatrix.makePerspective(ot,N,y,V,O,Kt),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ce(J,ie){ie===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ie.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(r===null)return;let ie=J.near,Se=J.far;x.texture!==null&&(x.depthNear>0&&(ie=x.depthNear),x.depthFar>0&&(Se=x.depthFar)),U.near=P.near=R.near=ie,U.far=P.far=R.far=Se,(F!==U.near||B!==U.far)&&(r.updateRenderState({depthNear:U.near,depthFar:U.far}),F=U.near,B=U.far),U.layers.mask=J.layers.mask|6,R.layers.mask=U.layers.mask&-5,P.layers.mask=U.layers.mask&-3;const Be=J.parent,q=U.cameras;ce(U,Be);for(let le=0;le<q.length;le++)ce(q[le],Be);q.length===2?Q(U,R,P):U.projectionMatrix.copy(R.projectionMatrix),A===null&&J.isPerspectiveCamera&&(A={camera:J,fov:J.fov,zoom:J.zoom}),Me(J,U,Be)};function Me(J,ie,Se){Se===null?J.matrix.copy(ie.matrixWorld):(J.matrix.copy(Se.matrixWorld),J.matrix.invert(),J.matrix.multiply(ie.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Uf*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(h===null&&m===null))return c},this.setFoveation=function(J){c=J,h!==null&&(h.fixedFoveation=J),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=J)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(U)},this.getCameraTexture=function(J){return d[J]};let Ye=null;function He(J,ie){if(f=ie.getViewerPose(u||o),g=ie,f!==null){const Se=f.views;m!==null&&(e.setRenderTargetFramebuffer(E,m.framebuffer),e.setRenderTarget(E));let Be=!1;Se.length!==U.cameras.length&&(U.cameras.length=0,Be=!0);for(let Fe=0;Fe<Se.length;Fe++){const je=Se[Fe];let Le=null;if(m!==null)Le=m.getViewport(je);else{const it=p.getViewSubImage(h,je);Le=it.viewport,Fe===0&&(e.setRenderTargetTextures(E,it.colorTexture,it.depthStencilTexture),e.setRenderTarget(E))}let Ue=D[Fe];Ue===void 0&&(Ue=new Cn,Ue.layers.enable(Fe),Ue.viewport=new St,D[Fe]=Ue),Ue.matrix.fromArray(je.transform.matrix),Ue.matrix.decompose(Ue.position,Ue.quaternion,Ue.scale),Ue.projectionMatrix.fromArray(je.projectionMatrix),Ue.projectionMatrixInverse.copy(Ue.projectionMatrix).invert(),Ue.viewport.set(Le.x,Le.y,Le.width,Le.height),Fe===0&&(U.matrix.copy(Ue.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Be===!0&&U.cameras.push(Ue)}const q=r.enabledFeatures;if(q&&q.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&S){p=i.getBinding();const Fe=p.getDepthInformation(Se[0]);Fe&&Fe.isValid&&Fe.texture&&x.init(Fe,r.renderState)}if(q&&q.includes("camera-access")&&S){e.state.unbindTexture(),p=i.getBinding();for(let Fe=0;Fe<Se.length;Fe++){const je=Se[Fe].camera;if(je){let Le=d[je];Le||(Le=new y_,d[je]=Le);const Ue=p.getCameraImage(je);Le.sourceTexture=Ue}}}}for(let Se=0;Se<w.length;Se++){const Be=C[Se],q=w[Se];Be!==null&&q!==void 0&&q.update(Be,ie,u||o)}Ye&&Ye(J,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),g=null}const Ve=new w_;Ve.setAnimationLoop(He),this.setAnimationLoop=function(J){Ye=J},this.dispose=function(){}}}const QT=new bt,P_=new ze;P_.set(-1,0,0,0,1,0,0,0,1);function e3(t,e){function n(x,d){x.matrixAutoUpdate===!0&&x.updateMatrix(),d.value.copy(x.matrix)}function i(x,d){d.color.getRGB(x.fogColor.value,S_(t)),d.isFog?(x.fogNear.value=d.near,x.fogFar.value=d.far):d.isFogExp2&&(x.fogDensity.value=d.density)}function r(x,d,v,b,E){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?s(x,d):d.isMeshLambertMaterial?(s(x,d),d.envMap&&(x.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(s(x,d),p(x,d)):d.isMeshPhongMaterial?(s(x,d),f(x,d),d.envMap&&(x.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(s(x,d),h(x,d),d.isMeshPhysicalMaterial&&m(x,d,E)):d.isMeshMatcapMaterial?(s(x,d),g(x,d)):d.isMeshDepthMaterial?s(x,d):d.isMeshDistanceMaterial?(s(x,d),S(x,d)):d.isMeshNormalMaterial?s(x,d):d.isLineBasicMaterial?(o(x,d),d.isLineDashedMaterial&&l(x,d)):d.isPointsMaterial?c(x,d,v,b):d.isSpriteMaterial?u(x,d):d.isShadowMaterial?(x.color.value.copy(d.color),x.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(x,d){x.opacity.value=d.opacity,d.color&&x.diffuse.value.copy(d.color),d.emissive&&x.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(x.map.value=d.map,n(d.map,x.mapTransform)),d.alphaMap&&(x.alphaMap.value=d.alphaMap,n(d.alphaMap,x.alphaMapTransform)),d.bumpMap&&(x.bumpMap.value=d.bumpMap,n(d.bumpMap,x.bumpMapTransform),x.bumpScale.value=d.bumpScale,d.side===Sn&&(x.bumpScale.value*=-1)),d.normalMap&&(x.normalMap.value=d.normalMap,n(d.normalMap,x.normalMapTransform),x.normalScale.value.copy(d.normalScale),d.side===Sn&&x.normalScale.value.negate()),d.displacementMap&&(x.displacementMap.value=d.displacementMap,n(d.displacementMap,x.displacementMapTransform),x.displacementScale.value=d.displacementScale,x.displacementBias.value=d.displacementBias),d.emissiveMap&&(x.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,x.emissiveMapTransform)),d.specularMap&&(x.specularMap.value=d.specularMap,n(d.specularMap,x.specularMapTransform)),d.alphaTest>0&&(x.alphaTest.value=d.alphaTest);const v=e.get(d),b=v.envMap,E=v.envMapRotation;b&&(x.envMap.value=b,x.envMapRotation.value.setFromMatrix4(QT.makeRotationFromEuler(E)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&x.envMapRotation.value.premultiply(P_),x.reflectivity.value=d.reflectivity,x.ior.value=d.ior,x.refractionRatio.value=d.refractionRatio),d.lightMap&&(x.lightMap.value=d.lightMap,x.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,x.lightMapTransform)),d.aoMap&&(x.aoMap.value=d.aoMap,x.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,x.aoMapTransform))}function o(x,d){x.diffuse.value.copy(d.color),x.opacity.value=d.opacity,d.map&&(x.map.value=d.map,n(d.map,x.mapTransform))}function l(x,d){x.dashSize.value=d.dashSize,x.totalSize.value=d.dashSize+d.gapSize,x.scale.value=d.scale}function c(x,d,v,b){x.diffuse.value.copy(d.color),x.opacity.value=d.opacity,x.size.value=d.size*v,x.scale.value=b*.5,d.map&&(x.map.value=d.map,n(d.map,x.uvTransform)),d.alphaMap&&(x.alphaMap.value=d.alphaMap,n(d.alphaMap,x.alphaMapTransform)),d.alphaTest>0&&(x.alphaTest.value=d.alphaTest)}function u(x,d){x.diffuse.value.copy(d.color),x.opacity.value=d.opacity,x.rotation.value=d.rotation,d.map&&(x.map.value=d.map,n(d.map,x.mapTransform)),d.alphaMap&&(x.alphaMap.value=d.alphaMap,n(d.alphaMap,x.alphaMapTransform)),d.alphaTest>0&&(x.alphaTest.value=d.alphaTest)}function f(x,d){x.specular.value.copy(d.specular),x.shininess.value=Math.max(d.shininess,1e-4)}function p(x,d){d.gradientMap&&(x.gradientMap.value=d.gradientMap)}function h(x,d){x.metalness.value=d.metalness,d.metalnessMap&&(x.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,x.metalnessMapTransform)),x.roughness.value=d.roughness,d.roughnessMap&&(x.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,x.roughnessMapTransform)),d.envMap&&(x.envMapIntensity.value=d.envMapIntensity)}function m(x,d,v){x.ior.value=d.ior,d.sheen>0&&(x.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),x.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(x.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,x.sheenColorMapTransform)),d.sheenRoughnessMap&&(x.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,x.sheenRoughnessMapTransform))),d.clearcoat>0&&(x.clearcoat.value=d.clearcoat,x.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(x.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,x.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(x.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Sn&&x.clearcoatNormalScale.value.negate())),d.dispersion>0&&(x.dispersion.value=d.dispersion),d.retroreflectivity>0&&(x.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(x.iridescence.value=d.iridescence,x.iridescenceIOR.value=d.iridescenceIOR,x.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(x.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,x.iridescenceMapTransform)),d.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),d.transmission>0&&(x.transmission.value=d.transmission,x.transmissionSamplerMap.value=v.texture,x.transmissionSamplerSize.value.set(v.width,v.height),d.transmissionMap&&(x.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,x.transmissionMapTransform)),x.thickness.value=d.thickness,d.thicknessMap&&(x.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=d.attenuationDistance,x.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(x.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(x.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=d.specularIntensity,x.specularColor.value.copy(d.specularColor),d.specularColorMap&&(x.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,x.specularColorMapTransform)),d.specularIntensityMap&&(x.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,x.specularIntensityMapTransform))}function g(x,d){d.matcap&&(x.matcap.value=d.matcap)}function S(x,d){const v=e.get(d).light;x.referencePosition.value.setFromMatrixPosition(v.matrixWorld),x.nearDistance.value=v.shadow.camera.near,x.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function t3(t,e,n,i){let r={},s={},o=[];const l=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,w){const C=w.program;i.uniformBlockBinding(E,C)}function u(E,w){let C=r[E.id];C===void 0&&(x(E),C=f(E),r[E.id]=C,E.addEventListener("dispose",v));const T=w.program;i.updateUBOMapping(E,T);const _=e.render.frame;s[E.id]!==_&&(h(E),s[E.id]=_)}function f(E){const w=p();E.__bindingPointIndex=w;const C=t.createBuffer(),T=E.__size,_=E.usage;return t.bindBuffer(t.UNIFORM_BUFFER,C),t.bufferData(t.UNIFORM_BUFFER,T,_),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,w,C),C}function p(){for(let E=0;E<l;E++)if(o.indexOf(E)===-1)return o.push(E),E;return rt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(E){const w=r[E.id],C=E.uniforms,T=E.__cache;t.bindBuffer(t.UNIFORM_BUFFER,w);for(let _=0,A=C.length;_<A;_++){const R=C[_];if(Array.isArray(R))for(let P=0,D=R.length;P<D;P++)m(R[P],_,P,T);else m(R,_,0,T)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(E,w,C,T){if(S(E,w,C,T)===!0){const _=E.__offset,A=E.value;if(Array.isArray(A)){let R=0;for(let P=0;P<A.length;P++){const D=A[P],U=d(D);g(D,E.__data,R),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(R+=U.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,E.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,_,E.__data)}}function g(E,w,C){typeof E=="number"||typeof E=="boolean"?w[0]=E:E.isMatrix3?(w[0]=E.elements[0],w[1]=E.elements[1],w[2]=E.elements[2],w[3]=0,w[4]=E.elements[3],w[5]=E.elements[4],w[6]=E.elements[5],w[7]=0,w[8]=E.elements[6],w[9]=E.elements[7],w[10]=E.elements[8],w[11]=0):ArrayBuffer.isView(E)?w.set(new E.constructor(E.buffer,E.byteOffset,w.length)):E.toArray(w,C)}function S(E,w,C,T){const _=E.value,A=w+"_"+C;if(T[A]===void 0)return typeof _=="number"||typeof _=="boolean"?T[A]=_:ArrayBuffer.isView(_)?T[A]=_.slice():T[A]=_.clone(),!0;{const R=T[A];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return T[A]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function x(E){const w=E.uniforms;let C=0;const T=16;for(let A=0,R=w.length;A<R;A++){const P=Array.isArray(w[A])?w[A]:[w[A]];for(let D=0,U=P.length;D<U;D++){const F=P[D],B=Array.isArray(F.value)?F.value:[F.value];for(let Z=0,X=B.length;Z<X;Z++){const j=B[Z],z=d(j),$=C%T,Q=$%z.boundary,ce=$+Q;C+=Q,ce!==0&&T-ce<z.storage&&(C+=T-ce),F.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=C,C+=z.storage}}}const _=C%T;return _>0&&(C+=T-_),E.__size=C,E.__cache={},this}function d(E){const w={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(w.boundary=4,w.storage=4):E.isVector2?(w.boundary=8,w.storage=8):E.isVector3||E.isColor?(w.boundary=16,w.storage=12):E.isVector4?(w.boundary=16,w.storage=16):E.isMatrix3?(w.boundary=48,w.storage=48):E.isMatrix4?(w.boundary=64,w.storage=64):E.isTexture?Oe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(E)?(w.boundary=16,w.storage=E.byteLength):Oe("WebGLRenderer: Unsupported uniform value type.",E),w}function v(E){const w=E.target;w.removeEventListener("dispose",v);const C=o.indexOf(w.__bindingPointIndex);o.splice(C,1),t.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function b(){for(const E in r)t.deleteBuffer(r[E]);o=[],r={},s={}}return{bind:c,update:u,dispose:b}}const n3=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let li=null;function i3(){return li===null&&(li=new zM(n3,16,16,Zr,_i),li.name="DFG_LUT",li.minFilter=rn,li.magFilter=rn,li.wrapS=Di,li.wrapT=Di,li.generateMipmaps=!1,li.needsUpdate=!0),li}class r3{constructor(e={}){const{canvas:n=xM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:u=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:m=An}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;const S=m,x=new Set([Zh,Kh,Yh]),d=new Set([An,vi,fo,ho,$h,qh]),v=new Uint32Array(4),b=new Int32Array(4),E=new G;let w=null,C=null;const T=[],_=[];let A=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=gi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let P=!1,D=null,U=null,F=null,B=null;this._outputColorSpace=wn;let Z=0,X=0,j=null,z=-1,$=null;const Q=new St,ce=new St;let Me=null;const Ye=new qe(0);let He=0,Ve=n.width,J=n.height,ie=1,Se=null,Be=null;const q=new St(0,0,Ve,J),le=new St(0,0,Ve,J);let we=!1;const Fe=new ip;let je=!1,Le=!1;const Ue=new bt,it=new G,Rt=new St,pn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let _t=!1;function Dt(){return j===null?ie:1}let O=i;function Kt(M,I){return n.getContext(M,I)}let ot,N,y,V,Y,ee,oe,ue,te,re,de,De,me,fe,Pe,ke,Ge,k,he,ne,pe,_e,se;try{const M={alpha:!0,depth:r,stencil:s,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:u,powerPreference:f,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Hh}`),n.addEventListener("webglcontextlost",ft,!1),n.addEventListener("webglcontextrestored",st,!1),n.addEventListener("webglcontextcreationerror",Hn,!1),O===null){const I="webgl2";if(O=Kt(I,M),O===null)throw Kt(I)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ie()}catch(M){throw n.removeEventListener("webglcontextlost",ft,!1),n.removeEventListener("webglcontextrestored",st,!1),n.removeEventListener("webglcontextcreationerror",Hn,!1),rt("WebGLRenderer: "+M.message),M}function Ie(){ot=new iA(O),ot.init(),pe=new qT(O,ot),N=new $C(O,ot,e,pe),y=new XT(O,ot),N.reversedDepthBuffer&&h&&y.buffers.depth.setReversed(!0),U=O.createFramebuffer(),F=O.createFramebuffer(),B=O.createFramebuffer(),V=new aA(O),Y=new PT,ee=new $T(O,ot,y,Y,N,pe,V),oe=new nA(R),ue=new l2(O),_e=new WC(O,ue),te=new rA(O,ue,V,_e),re=new lA(O,te,ue,_e,V),k=new oA(O,N,ee),Pe=new qC(Y),de=new DT(R,oe,ot,N,_e,Pe),De=new e3(R,Y),me=new LT,fe=new jT(ot),Ge=new HC(R,oe,y,re,g,c),ke=new WT(R,re,N),se=new t3(O,V,N,y),he=new XC(O,ot,V),ne=new sA(O,ot,V),V.programs=de.programs,R.capabilities=N,R.extensions=ot,R.properties=Y,R.renderLists=me,R.shadowMap=ke,R.state=y,R.info=V}S!==An&&(A=new uA(S,n.width,n.height,l,r,s));const Te=new JT(R,O);this.xr=Te,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const M=ot.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=ot.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(M){M!==void 0&&(ie=M,this.setSize(Ve,J,!1))},this.getSize=function(M){return M.set(Ve,J)},this.setSize=function(M,I,K=!0){if(Te.isPresenting){Oe("WebGLRenderer: Can't change size while VR device is presenting.");return}Ve=M,J=I,n.width=Math.floor(M*ie),n.height=Math.floor(I*ie),K===!0&&(n.style.width=M+"px",n.style.height=I+"px"),A!==null&&A.setSize(n.width,n.height),this.setViewport(0,0,M,I)},this.getDrawingBufferSize=function(M){return M.set(Ve*ie,J*ie).floor()},this.setDrawingBufferSize=function(M,I,K){Ve=M,J=I,ie=K,n.width=Math.floor(M*K),n.height=Math.floor(I*K),this.setViewport(0,0,M,I)},this.setEffects=function(M){if(S===An){rt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let I=0;I<M.length;I++)if(M[I].isOutputPass===!0){Oe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(Q)},this.getViewport=function(M){return M.copy(q)},this.setViewport=function(M,I,K,H){M.isVector4?q.set(M.x,M.y,M.z,M.w):q.set(M,I,K,H),y.viewport(Q.copy(q).multiplyScalar(ie).round())},this.getScissor=function(M){return M.copy(le)},this.setScissor=function(M,I,K,H){M.isVector4?le.set(M.x,M.y,M.z,M.w):le.set(M,I,K,H),y.scissor(ce.copy(le).multiplyScalar(ie).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(M){y.setScissorTest(we=M)},this.setOpaqueSort=function(M){Se=M},this.setTransparentSort=function(M){Be=M},this.getClearColor=function(M){return M.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(M=!0,I=!0,K=!0){let H=0;if(M){let W=!1;if(j!==null){const ve=j.texture.format;W=x.has(ve)}if(W){const ve=j.texture.type,Ee=d.has(ve),ge=Ge.getClearColor(),Ce=Ge.getClearAlpha(),Ne=ge.r,We=ge.g,Ke=ge.b;Ee?(v[0]=Ne,v[1]=We,v[2]=Ke,v[3]=Ce,O.clearBufferuiv(O.COLOR,0,v)):(b[0]=Ne,b[1]=We,b[2]=Ke,b[3]=Ce,O.clearBufferiv(O.COLOR,0,b))}else H|=O.COLOR_BUFFER_BIT}I&&(H|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(H|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&O.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),D=M},this.dispose=function(){n.removeEventListener("webglcontextlost",ft,!1),n.removeEventListener("webglcontextrestored",st,!1),n.removeEventListener("webglcontextcreationerror",Hn,!1),Ge.dispose(),me.dispose(),fe.dispose(),Y.dispose(),oe.dispose(),re.dispose(),_e.dispose(),se.dispose(),de.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",mp),Te.removeEventListener("sessionend",xp),Ar.stop()};function ft(M){M.preventDefault(),ux("WebGLRenderer: Context Lost."),P=!0}function st(){ux("WebGLRenderer: Context Restored."),P=!1;const M=V.autoReset,I=ke.enabled,K=ke.autoUpdate,H=ke.needsUpdate,W=ke.type;Ie(),V.autoReset=M,ke.enabled=I,ke.autoUpdate=K,ke.needsUpdate=H,ke.type=W}function Hn(M){rt("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function ri(M){const I=M.target;I.removeEventListener("dispose",ri),F_(I)}function F_(M){L_(M),Y.remove(M)}function L_(M){const I=Y.get(M).programs;I!==void 0&&(I.forEach(function(K){de.releaseProgram(K)}),M.isShaderMaterial&&de.releaseShaderCache(M))}this.renderBufferDirect=function(M,I,K,H,W,ve){I===null&&(I=pn);const Ee=W.isMesh&&W.matrixWorld.determinantAffine()<0,ge=k_(M,I,K,H,W);y.setMaterial(H,Ee);let Ce=K.index,Ne=1;if(H.wireframe===!0){if(Ce=te.getWireframeAttribute(K),Ce===void 0)return;Ne=2}const We=K.drawRange,Ke=K.attributes.position;let Ae=We.start*Ne,at=(We.start+We.count)*Ne;ve!==null&&(Ae=Math.max(Ae,ve.start*Ne),at=Math.min(at,(ve.start+ve.count)*Ne)),Ce!==null?(Ae=Math.max(Ae,0),at=Math.min(at,Ce.count)):Ke!=null&&(Ae=Math.max(Ae,0),at=Math.min(at,Ke.count));const Pt=at-Ae;if(Pt<0||Pt===1/0)return;_e.setup(W,H,ge,K,Ce);let mt,dt=he;if(Ce!==null&&(mt=ue.get(Ce),dt=ne,dt.setIndex(mt)),W.isMesh)H.wireframe===!0?(y.setLineWidth(H.wireframeLinewidth*Dt()),dt.setMode(O.LINES)):dt.setMode(O.TRIANGLES);else if(W.isLine){let Zt=H.linewidth;Zt===void 0&&(Zt=1),y.setLineWidth(Zt*Dt()),W.isLineSegments?dt.setMode(O.LINES):W.isLineLoop?dt.setMode(O.LINE_LOOP):dt.setMode(O.LINE_STRIP)}else W.isPoints?dt.setMode(O.POINTS):W.isSprite&&dt.setMode(O.TRIANGLES);if(W.isBatchedMesh)if(ot.get("WEBGL_multi_draw"))dt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Zt=W._multiDrawStarts,ye=W._multiDrawCounts,an=W._multiDrawCount,tt=Ce?ue.get(Ce).bytesPerElement:1,In=Y.get(H).currentProgram.getUniforms();for(let si=0;si<an;si++)In.setValue(O,"_gl_DrawID",si),dt.render(Zt[si]/tt,ye[si])}else if(W.isInstancedMesh)dt.renderInstances(Ae,Pt,W.count);else if(K.isInstancedBufferGeometry){const Zt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,ye=Math.min(K.instanceCount,Zt);dt.renderInstances(Ae,Pt,ye)}else dt.render(Ae,Pt)};function pp(M,I,K,H){D!==null&&M.isNodeMaterial&&D.setObject(H,M),je===!0&&Pe.setState(M,K,!1),M.transparent===!0&&M.side===fi&&M.forceSinglePass===!1?(M.side=Sn,M.needsUpdate=!0,wo(M,I,H),M.side=Yr,M.needsUpdate=!0,wo(M,I,H),M.side=fi):wo(M,I,H)}this.compile=function(M,I,K=null){K===null&&(K=M),D!==null&&D.renderStart(M,I,K),C=fe.get(K),C.init(I),_.push(C),K.traverseVisible(function(W){W.isLight&&W.layers.test(I.layers)&&(C.pushLight(W),W.castShadow&&C.pushShadow(W))}),M!==K&&M.traverseVisible(function(W){W.isLight&&W.layers.test(I.layers)&&(C.pushLight(W),W.castShadow&&C.pushShadow(W))}),C.setupLights(),D!==null&&D.updateLights(C.state.lightsArray),Le=this.localClippingEnabled,je=Pe.init(this.clippingPlanes,Le),je===!0&&Pe.setGlobalState(this.clippingPlanes,I),D!==null&&ke.render(C.state.shadowsArray,K,I);const H=new Set;return M.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const ve=W.material;if(ve)if(Array.isArray(ve))for(let Ee=0;Ee<ve.length;Ee++){const ge=ve[Ee];pp(ge,K,I,W),H.add(ge)}else pp(ve,K,I,W),H.add(ve)}),C=_.pop(),D!==null&&D.renderEnd(),H},this.compileAsync=function(M,I,K=null){const H=this.compile(M,I,K);return new Promise(W=>{function ve(){if(H.forEach(function(Ee){const Ce=Y.get(Ee).currentProgram;(Ce===void 0||Ce.isReady())&&H.delete(Ee)}),H.size===0){W(M);return}setTimeout(ve,10)}ot.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let kc=null;function I_(M){kc&&kc(M)}function mp(){Ar.stop()}function xp(){Ar.start()}const Ar=new w_;Ar.setAnimationLoop(I_),typeof self<"u"&&Ar.setContext(self),this.setAnimationLoop=function(M){kc=M,Te.setAnimationLoop(M),M===null?Ar.stop():Ar.start()},Te.addEventListener("sessionstart",mp),Te.addEventListener("sessionend",xp),this.render=function(M,I){if(I!==void 0&&I.isCamera!==!0){rt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;D!==null&&D.renderStart(M,I);const K=Te.enabled===!0&&Te.isPresenting===!0,H=A!==null&&(j===null||K)&&A.begin(R,j);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(I),I=Te.getCamera()),M.isScene===!0&&M.onBeforeRender(R,M,I,j),C=fe.get(M,_.length),C.init(I),C.state.textureUnits=ee.getTextureUnits(),_.push(C),Ue.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Fe.setFromProjectionMatrix(Ue,pi,I.reversedDepth),Le=this.localClippingEnabled,je=Pe.init(this.clippingPlanes,Le),w=me.get(M,T.length),w.init(),T.push(w),Te.enabled===!0&&Te.isPresenting===!0){const Ee=R.xr.getDepthSensingMesh();Ee!==null&&Oc(Ee,I,-1/0,R.sortObjects)}Oc(M,I,0,R.sortObjects),w.finish(),D!==null&&D.updateLights(C.state.lightsArray),R.sortObjects===!0&&w.sort(Se,Be),_t=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,_t&&Ge.addToRenderList(w,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),je===!0&&Pe.beginShadows();const W=C.state.shadowsArray;if(ke.render(W,M,I),je===!0&&Pe.endShadows(),(H&&A.hasRenderPass())===!1){const Ee=w.opaque,ge=w.transmissive;if(C.setupLights(),I.isArrayCamera){const Ce=I.cameras;if(ge.length>0)for(let Ne=0,We=Ce.length;Ne<We;Ne++){const Ke=Ce[Ne];vp(Ee,ge,M,Ke)}_t&&Ge.render(M);for(let Ne=0,We=Ce.length;Ne<We;Ne++){const Ke=Ce[Ne];gp(w,M,Ke,Ke.viewport)}}else ge.length>0&&vp(Ee,ge,M,I),_t&&Ge.render(M),gp(w,M,I)}j!==null&&X===0&&(ee.updateMultisampleRenderTarget(j),ee.updateRenderTargetMipmap(j)),H&&A.end(R),M.isScene===!0&&M.onAfterRender(R,M,I),_e.resetDefaultState(),z=-1,$=null,_.pop(),_.length>0?(C=_[_.length-1],ee.setTextureUnits(C.state.textureUnits),je===!0&&Pe.setGlobalState(R.clippingPlanes,C.state.camera)):C=null,T.pop(),T.length>0?w=T[T.length-1]:w=null,D!==null&&D.renderEnd()};function Oc(M,I,K,H){if(M.visible===!1)return;if(M.layers.test(I.layers)){if(M.isGroup)K=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(I);else if(M.isLightProbeGrid)C.pushLightProbeGrid(M);else if(M.isLight)C.pushLight(M),M.castShadow&&C.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(Fe)){H&&Rt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Ue);const Ee=re.update(M),ge=M.material;ge.visible&&w.push(M,Ee,ge,K,Rt.z,null,I)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(Fe))){const Ee=re.update(M),ge=M.material;if(H&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Rt.copy(M.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),Rt.copy(Ee.boundingSphere.center)),Rt.applyMatrix4(M.matrixWorld).applyMatrix4(Ue)),Array.isArray(ge)){const Ce=Ee.groups;for(let Ne=0,We=Ce.length;Ne<We;Ne++){const Ke=Ce[Ne],Ae=ge[Ke.materialIndex];Ae&&Ae.visible&&w.push(M,Ee,Ae,K,Rt.z,Ke,I)}}else ge.visible&&w.push(M,Ee,ge,K,Rt.z,null,I)}}const ve=M.children;for(let Ee=0,ge=ve.length;Ee<ge;Ee++)Oc(ve[Ee],I,K,H)}function gp(M,I,K,H){const{opaque:W,transmissive:ve,transparent:Ee}=M;C.setupLightsView(K),je===!0&&Pe.setGlobalState(R.clippingPlanes,K),H&&y.viewport(Q.copy(H)),W.length>0&&Mo(W,I,K),ve.length>0&&Mo(ve,I,K),Ee.length>0&&Mo(Ee,I,K),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function vp(M,I,K,H){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(C.state.transmissionRenderTarget[H.id]===void 0){const Ae=ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float");C.state.transmissionRenderTarget[H.id]=new ni(1,1,{generateMipmaps:!0,type:Ae?_i:An,minFilter:Br,samples:Math.max(4,N.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:et.workingColorSpace})}const ve=C.state.transmissionRenderTarget[H.id],Ee=H.viewport||Q;ve.setSize(Ee.z*R.transmissionResolutionScale,Ee.w*R.transmissionResolutionScale);const ge=R.getRenderTarget(),Ce=R.getActiveCubeFace(),Ne=R.getActiveMipmapLevel();R.setRenderTarget(ve),R.getClearColor(Ye),He=R.getClearAlpha(),He<1&&R.setClearColor(16777215,.5),R.clear(),_t&&Ge.render(K);const We=R.toneMapping;R.toneMapping=gi;const Ke=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),C.setupLightsView(H),je===!0&&Pe.setGlobalState(R.clippingPlanes,H),Mo(M,K,H),ee.updateMultisampleRenderTarget(ve),ee.updateRenderTargetMipmap(ve),ot.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let at=0,Pt=I.length;at<Pt;at++){const mt=I[at],{object:dt,geometry:Zt,material:ye,group:an}=mt;if(ye.side===fi&&dt.layers.test(H.layers)){const tt=ye.side;ye.side=Sn,ye.needsUpdate=!0,_p(dt,K,H,Zt,ye,an),ye.side=tt,ye.needsUpdate=!0,Ae=!0}}Ae===!0&&(ee.updateMultisampleRenderTarget(ve),ee.updateRenderTargetMipmap(ve))}R.setRenderTarget(ge,Ce,Ne),R.setClearColor(Ye,He),Ke!==void 0&&(H.viewport=Ke),R.toneMapping=We}function Mo(M,I,K){const H=I.isScene===!0?I.overrideMaterial:null;for(let W=0,ve=M.length;W<ve;W++){const Ee=M[W],{object:ge,geometry:Ce,group:Ne}=Ee;let We=Ee.material;We.allowOverride===!0&&H!==null&&(We=H),ge.layers.test(K.layers)&&_p(ge,I,K,Ce,We,Ne)}}function _p(M,I,K,H,W,ve){D!==null&&W.isNodeMaterial&&D.setObject(M,W),M.onBeforeRender(R,I,K,H,W,ve),M.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),W.onBeforeRender(R,I,K,H,M,ve),W.transparent===!0&&W.side===fi&&W.forceSinglePass===!1?(W.side=Sn,W.needsUpdate=!0,R.renderBufferDirect(K,I,H,W,M,ve),W.side=Yr,W.needsUpdate=!0,R.renderBufferDirect(K,I,H,W,M,ve),W.side=fi):R.renderBufferDirect(K,I,H,W,M,ve),M.onAfterRender(R,I,K,H,W,ve)}function wo(M,I,K){I.isScene!==!0&&(I=pn);const H=Y.get(M),W=C.state.lights,ve=C.state.shadowsArray,Ee=W.state.version,ge=de.getParameters(M,W.state,ve,I,K,C.state.lightProbeGridArray),Ce=de.getProgramCacheKey(ge);let Ne=H.programs;H.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?I.environment:null,H.fog=I.fog;const We=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;H.envMap=oe.get(M.envMap||H.environment,We),H.envMapRotation=H.environment!==null&&M.envMap===null?I.environmentRotation:M.envMapRotation,Ne===void 0&&(M.addEventListener("dispose",ri),Ne=new Map,H.programs=Ne);let Ke=Ne.get(Ce);if(Ke!==void 0){if(H.currentProgram===Ke&&H.lightsStateVersion===Ee)return Sp(M,ge),Ke}else ge.uniforms=de.getUniforms(M),D!==null&&M.isNodeMaterial&&D.build(M,K,ge),M.onBeforeCompile(ge,R),Ke=de.acquireProgram(ge,Ce),Ne.set(Ce,Ke),H.uniforms=ge.uniforms;const Ae=H.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ae.clippingPlanes=Pe.uniform),Sp(M,ge),H.needsLights=B_(M),H.lightsStateVersion=Ee,H.needsLights&&(Ae.ambientLightColor.value=W.state.ambient,Ae.lightProbe.value=W.state.probe,Ae.sunLights.value=W.state.sun,Ae.sunLightShadows.value=W.state.sunShadow,Ae.directionalLights.value=W.state.directional,Ae.directionalLightShadows.value=W.state.directionalShadow,Ae.spotLights.value=W.state.spot,Ae.spotLightShadows.value=W.state.spotShadow,Ae.rectAreaLights.value=W.state.rectArea,Ae.ltc_1.value=W.state.rectAreaLTC1,Ae.ltc_2.value=W.state.rectAreaLTC2,Ae.pointLights.value=W.state.point,Ae.pointLightShadows.value=W.state.pointShadow,Ae.hemisphereLights.value=W.state.hemi,Ae.sunShadowMatrix.value=W.state.sunShadowMatrix,Ae.sunShadowCascade.value=W.state.sunShadowCascade,Ae.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ae.spotLightMatrix.value=W.state.spotLightMatrix,Ae.spotLightMap.value=W.state.spotLightMap,Ae.pointShadowMatrix.value=W.state.pointShadowMatrix),H.lightProbeGrid=C.state.lightProbeGridArray.length>0,H.currentProgram=Ke,H.uniformsList=null,Ke}function yp(M){if(M.uniformsList===null){const I=M.currentProgram.getUniforms();M.uniformsList=Pl.seqWithValue(I.seq,M.uniforms)}return M.uniformsList}function Sp(M,I){const K=Y.get(M);K.outputColorSpace=I.outputColorSpace,K.batching=I.batching,K.batchingColor=I.batchingColor,K.instancing=I.instancing,K.instancingColor=I.instancingColor,K.instancingMorph=I.instancingMorph,K.skinning=I.skinning,K.morphTargets=I.morphTargets,K.morphNormals=I.morphNormals,K.morphColors=I.morphColors,K.morphTargetsCount=I.morphTargetsCount,K.numClippingPlanes=I.numClippingPlanes,K.numIntersection=I.numClipIntersection,K.vertexAlphas=I.vertexAlphas,K.vertexTangents=I.vertexTangents,K.toneMapping=I.toneMapping}function U_(M,I){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;E.setFromMatrixPosition(I.matrixWorld);for(let K=0,H=M.length;K<H;K++){const W=M[K];if(W.texture!==null&&W.boundingBox.containsPoint(E))return W}return null}function k_(M,I,K,H,W){I.isScene!==!0&&(I=pn),ee.resetTextureUnits();const ve=I.fog,Ee=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?I.environment:null,ge=j===null?R.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:et.workingColorSpace,Ce=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ne=oe.get(H.envMap||Ee,Ce),We=H.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,Ke=!!K.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ae=!!K.morphAttributes.position,at=!!K.morphAttributes.normal,Pt=!!K.morphAttributes.color;let mt=gi;H.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(mt=R.toneMapping);const dt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Zt=dt!==void 0?dt.length:0,ye=Y.get(H),an=C.state.lights;if(je===!0&&(Le===!0||M!==$)){const ht=M===$&&H.id===z;Pe.setState(H,M,ht)}let tt=!1;H.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==an.state.version||ye.outputColorSpace!==ge||W.isBatchedMesh&&ye.batching===!1||!W.isBatchedMesh&&ye.batching===!0||W.isBatchedMesh&&ye.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&ye.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&ye.instancing===!1||!W.isInstancedMesh&&ye.instancing===!0||W.isSkinnedMesh&&ye.skinning===!1||!W.isSkinnedMesh&&ye.skinning===!0||W.isInstancedMesh&&ye.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&ye.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&ye.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&ye.instancingMorph===!1&&W.morphTexture!==null||ye.envMap!==Ne||H.fog===!0&&ye.fog!==ve||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==Pe.numPlanes||ye.numIntersection!==Pe.numIntersection)||ye.vertexAlphas!==We||ye.vertexTangents!==Ke||ye.morphTargets!==Ae||ye.morphNormals!==at||ye.morphColors!==Pt||ye.toneMapping!==mt||ye.morphTargetsCount!==Zt||!!ye.lightProbeGrid!=C.state.lightProbeGridArray.length>0)&&(tt=!0):(tt=!0,ye.__version=H.version);let In=ye.currentProgram;tt===!0&&(In=wo(H,I,W),D&&H.isNodeMaterial&&D.onUpdateProgram(H,In,ye));let si=!1,Hi=!1,rs=!1;const ut=In.getUniforms(),Ct=ye.uniforms;if(y.useProgram(In.program)&&(si=!0,Hi=!0,rs=!0),H.id!==z&&(z=H.id,Hi=!0),ye.needsLights){const ht=U_(C.state.lightProbeGridArray,W);ye.lightProbeGrid!==ht&&(ye.lightProbeGrid=ht,Hi=!0)}if(si||$!==M){y.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),ut.setValue(O,"projectionMatrix",M.projectionMatrix),ut.setValue(O,"viewMatrix",M.matrixWorldInverse);const Xi=ut.map.cameraPosition;Xi!==void 0&&Xi.setValue(O,it.setFromMatrixPosition(M.matrixWorld)),N.logarithmicDepthBuffer&&ut.setValue(O,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ut.setValue(O,"isOrthographic",M.isOrthographicCamera===!0),$!==M&&($=M,Hi=!0,rs=!0)}if(ye.needsLights&&(an.state.sunShadowMap.length>0&&ut.setValue(O,"sunShadowMap",an.state.sunShadowMap,ee),an.state.directionalShadowMap.length>0&&ut.setValue(O,"directionalShadowMap",an.state.directionalShadowMap,ee),an.state.spotShadowMap.length>0&&ut.setValue(O,"spotShadowMap",an.state.spotShadowMap,ee),an.state.pointShadowMap.length>0&&ut.setValue(O,"pointShadowMap",an.state.pointShadowMap,ee)),W.isSkinnedMesh){ut.setOptional(O,W,"bindMatrix"),ut.setOptional(O,W,"bindMatrixInverse");const ht=W.skeleton;ht&&(ht.boneTexture===null&&ht.computeBoneTexture(),ut.setValue(O,"boneTexture",ht.boneTexture,ee))}W.isBatchedMesh&&(ut.setOptional(O,W,"batchingTexture"),ut.setValue(O,"batchingTexture",W._matricesTexture,ee),ut.setOptional(O,W,"batchingIdTexture"),ut.setValue(O,"batchingIdTexture",W._indirectTexture,ee),ut.setOptional(O,W,"batchingColorTexture"),W._colorsTexture!==null&&ut.setValue(O,"batchingColorTexture",W._colorsTexture,ee));const Wi=K.morphAttributes;if((Wi.position!==void 0||Wi.normal!==void 0||Wi.color!==void 0)&&k.update(W,K,In),(Hi||ye.receiveShadow!==W.receiveShadow)&&(ye.receiveShadow=W.receiveShadow,ut.setValue(O,"receiveShadow",W.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&I.environment!==null&&(Ct.envMapIntensity.value=I.environmentIntensity),Ct.dfgLUT!==void 0&&(Ct.dfgLUT.value=i3()),Hi){if(ut.setValue(O,"toneMappingExposure",R.toneMappingExposure),ye.needsLights&&O_(Ct,rs),ve&&H.fog===!0&&De.refreshFogUniforms(Ct,ve),De.refreshMaterialUniforms(Ct,H,ie,J,C.state.transmissionRenderTarget[M.id]),ye.needsLights&&ye.lightProbeGrid){const ht=ye.lightProbeGrid;Ct.probesSH.value=ht.texture,Ct.probesMin.value.copy(ht.boundingBox.min),Ct.probesMax.value.copy(ht.boundingBox.max),Ct.probesResolution.value.copy(ht.resolution)}Pl.upload(O,yp(ye),Ct,ee)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Pl.upload(O,yp(ye),Ct,ee),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ut.setValue(O,"center",W.center),ut.setValue(O,"modelViewMatrix",W.modelViewMatrix),ut.setValue(O,"normalMatrix",W.normalMatrix),ut.setValue(O,"modelMatrix",W.matrixWorld),H.uniformsGroups!==void 0){const ht=H.uniformsGroups;for(let Xi=0,ss=ht.length;Xi<ss;Xi++){const bp=ht[Xi];se.update(bp,In),se.bind(bp,In)}}return In}function O_(M,I){M.ambientLightColor.needsUpdate=I,M.lightProbe.needsUpdate=I,M.sunLights.needsUpdate=I,M.sunLightShadows.needsUpdate=I,M.directionalLights.needsUpdate=I,M.directionalLightShadows.needsUpdate=I,M.pointLights.needsUpdate=I,M.pointLightShadows.needsUpdate=I,M.spotLights.needsUpdate=I,M.spotLightShadows.needsUpdate=I,M.rectAreaLights.needsUpdate=I,M.hemisphereLights.needsUpdate=I}function B_(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(M,I,K){const H=Y.get(M);H.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),Y.get(M.texture).__webglTexture=I,Y.get(M.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:K,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,I){const K=Y.get(M);K.__webglFramebuffer=I,K.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(M,I=0,K=0){j=M,Z=I,X=K;let H=null,W=!1,ve=!1;if(M){const ge=Y.get(M);if(ge.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(O.FRAMEBUFFER,ge.__webglFramebuffer),Q.copy(M.viewport),ce.copy(M.scissor),Me=M.scissorTest,y.viewport(Q),y.scissor(ce),y.setScissorTest(Me),z=-1;return}else if(ge.__webglFramebuffer===void 0)ee.setupRenderTarget(M);else if(ge.__hasExternalTextures)ee.rebindTextures(M,Y.get(M.texture).__webglTexture,Y.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const We=M.depthTexture;if(ge.__boundDepthTexture!==We){if(We!==null&&Y.has(We)&&(M.width!==We.image.width||M.height!==We.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ee.setupDepthRenderbuffer(M)}}const Ce=M.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(ve=!0);const Ne=Y.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ne[I])?H=Ne[I][K]:H=Ne[I],W=!0):M.samples>0&&ee.useMultisampledRTT(M)===!1?H=Y.get(M).__webglMultisampledFramebuffer:Array.isArray(Ne)?H=Ne[K]:H=Ne,Q.copy(M.viewport),ce.copy(M.scissor),Me=M.scissorTest}else Q.copy(q).multiplyScalar(ie).floor(),ce.copy(le).multiplyScalar(ie).floor(),Me=we;if(K!==0&&(H=U),y.bindFramebuffer(O.FRAMEBUFFER,H)&&y.drawBuffers(M,H),y.viewport(Q),y.scissor(ce),y.setScissorTest(Me),W){const ge=Y.get(M.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+I,ge.__webglTexture,K)}else if(ve){const ge=I;for(let Ce=0;Ce<M.textures.length;Ce++){const Ne=Y.get(M.textures[Ce]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Ce,Ne.__webglTexture,K,ge)}}else if(M!==null&&K!==0){const ge=Y.get(M.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ge.__webglTexture,K)}z=-1};function Ep(M){const I=Y.get(M);return(I.__readFormat!==M.format||I.__readType!==M.type)&&(I.__readFormat=M.format,I.__readType=M.type,I.__formatReadable=N.textureFormatReadable(M.format),I.__typeReadable=N.textureTypeReadable(M.type)),I}this.readRenderTargetPixels=function(M,I,K,H,W,ve,Ee,ge=0){if(!(M&&M.isWebGLRenderTarget)){rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=Y.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce){y.bindFramebuffer(O.FRAMEBUFFER,Ce);try{const Ne=M.textures[ge],We=Ne.format,Ke=Ne.type;M.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ge);const Ae=Ep(Ne);if(Ae.__formatReadable===!1){rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ae.__typeReadable===!1){rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=M.width-H&&K>=0&&K<=M.height-W&&O.readPixels(I,K,H,W,pe.convert(We),pe.convert(Ke),ve)}finally{const Ne=j!==null?Y.get(j).__webglFramebuffer:null;y.bindFramebuffer(O.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(M,I,K,H,W,ve,Ee,ge=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=Y.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce)if(I>=0&&I<=M.width-H&&K>=0&&K<=M.height-W){y.bindFramebuffer(O.FRAMEBUFFER,Ce);const Ne=M.textures[ge],We=Ne.format,Ke=Ne.type;M.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ge);const Ae=Ep(Ne);if(Ae.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ae.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const at=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,at),O.bufferData(O.PIXEL_PACK_BUFFER,ve.byteLength,O.STREAM_READ),O.readPixels(I,K,H,W,pe.convert(We),pe.convert(Ke),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);const Pt=j!==null?Y.get(j).__webglFramebuffer:null;y.bindFramebuffer(O.FRAMEBUFFER,Pt);const mt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await gM(O,mt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,at),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ve),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(at),O.deleteSync(mt),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,I=null,K=0){const H=Math.pow(2,-K),W=Math.floor(M.image.width*H),ve=Math.floor(M.image.height*H),Ee=I!==null?I.x:0,ge=I!==null?I.y:0;ee.setTexture2D(M,0),O.copyTexSubImage2D(O.TEXTURE_2D,K,0,0,Ee,ge,W,ve),y.unbindTexture()},this.copyTextureToTexture=function(M,I,K=null,H=null,W=0,ve=0){let Ee,ge,Ce,Ne,We,Ke,Ae,at,Pt;const mt=M.isCompressedTexture?M.mipmaps[ve]:M.image;if(K!==null)Ee=K.max.x-K.min.x,ge=K.max.y-K.min.y,Ce=K.isBox3?K.max.z-K.min.z:1,Ne=K.min.x,We=K.min.y,Ke=K.isBox3?K.min.z:0;else{const Ct=Math.pow(2,-W);Ee=Math.floor(mt.width*Ct),ge=Math.floor(mt.height*Ct),M.isDataArrayTexture?Ce=mt.depth:M.isData3DTexture?Ce=Math.floor(mt.depth*Ct):Ce=1,Ne=0,We=0,Ke=0}H!==null?(Ae=H.x,at=H.y,Pt=H.z):(Ae=0,at=0,Pt=0);const dt=pe.convert(I.format),Zt=pe.convert(I.type);let ye;I.isData3DTexture?(ee.setTexture3D(I,0),ye=O.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(ee.setTexture2DArray(I,0),ye=O.TEXTURE_2D_ARRAY):(ee.setTexture2D(I,0),ye=O.TEXTURE_2D),y.activeTexture(O.TEXTURE0),y.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,I.flipY),y.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),y.pixelStorei(O.UNPACK_ALIGNMENT,I.unpackAlignment);const an=y.getParameter(O.UNPACK_ROW_LENGTH),tt=y.getParameter(O.UNPACK_IMAGE_HEIGHT),In=y.getParameter(O.UNPACK_SKIP_PIXELS),si=y.getParameter(O.UNPACK_SKIP_ROWS),Hi=y.getParameter(O.UNPACK_SKIP_IMAGES);y.pixelStorei(O.UNPACK_ROW_LENGTH,mt.width),y.pixelStorei(O.UNPACK_IMAGE_HEIGHT,mt.height),y.pixelStorei(O.UNPACK_SKIP_PIXELS,Ne),y.pixelStorei(O.UNPACK_SKIP_ROWS,We),y.pixelStorei(O.UNPACK_SKIP_IMAGES,Ke);const rs=M.isDataArrayTexture||M.isData3DTexture,ut=I.isDataArrayTexture||I.isData3DTexture;if(M.isDepthTexture){const Ct=Y.get(M),Wi=Y.get(I),ht=Y.get(Ct.__renderTarget),Xi=Y.get(Wi.__renderTarget);y.bindFramebuffer(O.READ_FRAMEBUFFER,ht.__webglFramebuffer),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,Xi.__webglFramebuffer);for(let ss=0;ss<Ce;ss++)rs&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Y.get(M).__webglTexture,W,Ke+ss),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Y.get(I).__webglTexture,ve,Pt+ss)),O.blitFramebuffer(Ne,We,Ee,ge,Ae,at,Ee,ge,O.DEPTH_BUFFER_BIT,O.NEAREST);y.bindFramebuffer(O.READ_FRAMEBUFFER,null),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(W!==0||M.isRenderTargetTexture||Y.has(M)){const Ct=Y.get(M),Wi=Y.get(I);y.bindFramebuffer(O.READ_FRAMEBUFFER,F),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,B);for(let ht=0;ht<Ce;ht++)rs?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ct.__webglTexture,W,Ke+ht):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ct.__webglTexture,W),ut?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Wi.__webglTexture,ve,Pt+ht):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Wi.__webglTexture,ve),W!==0?O.blitFramebuffer(Ne,We,Ee,ge,Ae,at,Ee,ge,O.COLOR_BUFFER_BIT,O.NEAREST):ut?O.copyTexSubImage3D(ye,ve,Ae,at,Pt+ht,Ne,We,Ee,ge):O.copyTexSubImage2D(ye,ve,Ae,at,Ne,We,Ee,ge);y.bindFramebuffer(O.READ_FRAMEBUFFER,null),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else ut?M.isDataTexture||M.isData3DTexture?O.texSubImage3D(ye,ve,Ae,at,Pt,Ee,ge,Ce,dt,Zt,mt.data):I.isCompressedArrayTexture?O.compressedTexSubImage3D(ye,ve,Ae,at,Pt,Ee,ge,Ce,dt,mt.data):O.texSubImage3D(ye,ve,Ae,at,Pt,Ee,ge,Ce,dt,Zt,mt):M.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,ve,Ae,at,Ee,ge,dt,Zt,mt.data):M.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,ve,Ae,at,mt.width,mt.height,dt,mt.data):O.texSubImage2D(O.TEXTURE_2D,ve,Ae,at,Ee,ge,dt,Zt,mt);y.pixelStorei(O.UNPACK_ROW_LENGTH,an),y.pixelStorei(O.UNPACK_IMAGE_HEIGHT,tt),y.pixelStorei(O.UNPACK_SKIP_PIXELS,In),y.pixelStorei(O.UNPACK_SKIP_ROWS,si),y.pixelStorei(O.UNPACK_SKIP_IMAGES,Hi),ve===0&&I.generateMipmaps&&O.generateMipmap(ye),y.unbindTexture()},this.initRenderTarget=function(M){Y.get(M).__webglFramebuffer===void 0&&ee.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?ee.setTextureCube(M,0):M.isData3DTexture?ee.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?ee.setTexture2DArray(M,0):ee.setTexture2D(M,0),y.unbindTexture()},this.resetState=function(){Z=0,X=0,j=null,y.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),n.unpackColorSpace=et._getUnpackColorSpace()}}const s3={Li:{color:15050751,radius:.34},Co:{color:6404351,radius:.46},Fe:{color:16754287,radius:.45},O:{color:16740744,radius:.31},Ba:{color:6481874,radius:.48},Ti:{color:12042446,radius:.43},Zr:{color:7855020,radius:.46},La:{color:16765550,radius:.49},P:{color:12623103,radius:.4},S:{color:16768381,radius:.42}};function a3(t){return s3[t]??{color:14212842,radius:.4}}function o3(t){const e=Math.PI/180,n=(t.alpha??90)*e,i=(t.beta??90)*e,r=(t.gamma??90)*e,s=new G(t.a||5,0,0),o=new G((t.b||5)*Math.cos(r),(t.b||5)*Math.sin(r),0),l=(t.c||5)*Math.cos(i),c=(t.c||5)*(Math.cos(n)-Math.cos(i)*Math.cos(r))/Math.max(Math.sin(r),.001),u=Math.sqrt(Math.max((t.c||5)**2-l**2-c**2,0));return{a:s,b:o,c:new G(l,c,u)}}function l3({atoms:t,lattice:e,materialLabel:n,sourceLabel:i}){const r=L.useRef(null);return L.useEffect(()=>{const s=r.current;if(!s)return;const o=new FM;o.background=new qe(16645112),o.fog=new tp(16645112,18,44);const l=new Cn(38,1,.1,1e3),c=new r3({antialias:!0});c.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.outputColorSpace=wn,c.toneMapping=Wh,c.toneMappingExposure=1.15,s.appendChild(c.domElement);const u=()=>{const _=Math.max(s.clientWidth,320),A=Math.max(s.clientHeight,300);l.aspect=_/A,l.updateProjectionMatrix(),c.setSize(_,A,!1)};u();const f=new ResizeObserver(u);f.observe(s),o.add(new r2(16777215,1.55));const p=new i2(16777215,3.4);p.position.set(8,12,10),o.add(p);const h=new Lx(16757371,7,30,2);h.position.set(-8,5,-9),o.add(h);const m=new Lx(16771548,6,28,2);m.position.set(9,-4,6),o.add(m);const g=o3(e),S=g.a.clone().add(g.b).add(g.c).multiplyScalar(.5),x=Math.max(g.a.length(),g.b.length(),g.c.length(),5);l.position.set(x*1.7,x*1.2,x*2.15),l.lookAt(0,0,0);const d=new Na;o.add(d);const v=[];t.forEach(_=>{const[A,R,P]=_.fractional_coordinates,D=g.a.clone().multiplyScalar(A).add(g.b.clone().multiplyScalar(R)).add(g.c.clone().multiplyScalar(P)).sub(S);v.push(D);const U=a3(_.species),F=new Nn(new ap(U.radius,32,24),new JM({color:U.color,roughness:.22,metalness:.08,clearcoat:.7,emissive:U.color,emissiveIntensity:.025}));F.position.copy(D),d.add(F)});const b=new E_({color:10133930,roughness:.42,transparent:!0,opacity:.72}),E=Math.max(x*.3,2.35);for(let _=0;_<v.length;_+=1)for(let A=_+1;A<v.length;A+=1){const R=v[A].clone().sub(v[_]),P=R.length();if(P>E)continue;const D=new Nn(new sp(.05,.05,P,10),b);D.position.copy(v[_]).add(v[A]).multiplyScalar(.5),D.quaternion.setFromUnitVectors(new G(0,1,0),R.normalize()),d.add(D)}const w=new Nn(new rp(x*2.4,64),new np({color:16036748,transparent:!0,opacity:.12,side:fi}));w.rotation.x=-Math.PI/2,w.position.y=-x*.65,o.add(w);let C=0;const T=()=>{d.rotation.y+=.0024,c.render(o,l),C=requestAnimationFrame(T)};return T(),()=>{cancelAnimationFrame(C),f.disconnect(),c.dispose(),o.traverse(_=>{if(_ instanceof Nn||_ instanceof WM){_.geometry.dispose();const A=_.material;Array.isArray(A)?A.forEach(R=>R.dispose()):A.dispose()}}),s.contains(c.domElement)&&s.removeChild(c.domElement)}},[t,e]),a.jsx("div",{ref:r,className:"relative h-full min-h-[480px] w-full overflow-hidden rounded-2xl bg-[#fdfbf8] border border-[#EDE8E2]","aria-label":"Interactive crystal structure visualization",children:(n||i)&&a.jsxs("div",{className:"pointer-events-none absolute left-4 top-4 z-10 max-w-[70%] rounded-xl bg-white/90 px-3.5 py-2 shadow-sm backdrop-blur-sm border border-[#EDE8E2]",children:[n&&a.jsx("p",{className:"font-mono text-xs font-bold text-[#1E2227]",children:n}),i&&a.jsx("p",{className:"mt-0.5 text-[9px] uppercase tracking-[.14em] text-[#8C929C] font-medium",children:i})]})})}function kn(t,e){const n=t.find(i=>i.toLowerCase().startsWith(e.toLowerCase()));return(n==null?void 0:n.split(/\s+/).slice(1).join(" ").trim())||""}function er(t){return t.replace(/[()]/g,"").trim()}async function c3(t){var o;const n=(await t.text()).split(/\r?\n/).map(l=>l.trim()).filter(Boolean),i=[],r=n.findIndex(l=>l.toLowerCase()==="loop_");if(r>=0){const l=[];let c=r+1;for(;c<n.length&&n[c].startsWith("_");)l.push(n[c++]);const u=l.findIndex(m=>/type_symbol|label/i.test(m)),f=l.findIndex(m=>/fract_x/i.test(m)),p=l.findIndex(m=>/fract_y/i.test(m)),h=l.findIndex(m=>/fract_z/i.test(m));for(;c<n.length&&!n[c].startsWith("loop_")&&!n[c].startsWith("_")&&!n[c].startsWith("data_");){const m=n[c].split(/\s+/);if(u>=0&&f>=0&&p>=0&&h>=0){const g=Number.parseFloat(m[f]),S=Number.parseFloat(m[p]),x=Number.parseFloat(m[h]);[g,S,x].every(Number.isFinite)&&i.push({species:m[u],fractional_coordinates:[g,S,x]})}c+=1}}if(!i.length)throw new Error("No fractional atom coordinates were found in this CIF.");return{formula:(kn(n,"_chemical_formula_sum")||kn(n,"_chemical_formula_structural")||"Uploaded structure").replace(/[']/g,""),data_block:((o=n.find(l=>l.toLowerCase().startsWith("data_")))==null?void 0:o.slice(5))||"uploaded",space_group:er(kn(n,"_space_group_name_h-m")||kn(n,"_symmetry_space_group_name_h-m")||"Unknown"),space_group_number:er(kn(n,"_space_group_it_number")||kn(n,"_symmetry_int_tables_number")||"—"),lattice:{a:er(kn(n,"_cell_length_a")),b:er(kn(n,"_cell_length_b")),c:er(kn(n,"_cell_length_c")),alpha:er(kn(n,"_cell_angle_alpha")),beta:er(kn(n,"_cell_angle_beta")),gamma:er(kn(n,"_cell_angle_gamma"))},atoms:i}}const qu=[{id:"LiCoO2",formula:"LiCoO₂",name:"Lithium cobalt oxide",system:"Trigonal",spaceGroup:"R -3 m · 166",lattice:{a:2.816,b:2.816,c:14.054,alpha:90,beta:90,gamma:120},atoms:[{species:"Li",fractional_coordinates:[0,0,0]},{species:"Li",fractional_coordinates:[.5,.5,.5]},{species:"Co",fractional_coordinates:[0,0,.5]},{species:"Co",fractional_coordinates:[.5,.5,0]},{species:"O",fractional_coordinates:[0,0,.24]},{species:"O",fractional_coordinates:[0,0,.76]},{species:"O",fractional_coordinates:[.5,.5,.24]},{species:"O",fractional_coordinates:[.5,.5,.76]}]},{id:"LiFePO4",formula:"LiFePO₄",name:"Lithium iron phosphate",system:"Orthorhombic",spaceGroup:"P n m a · 62",lattice:{a:10.334,b:6.01,c:4.693,alpha:90,beta:90,gamma:90},atoms:[{species:"Li",fractional_coordinates:[0,0,0]},{species:"Fe",fractional_coordinates:[.25,.5,.25]},{species:"P",fractional_coordinates:[.4,.25,.1]},{species:"O",fractional_coordinates:[.1,.2,.3]}]},{id:"LLZO",formula:"Li₇La₃Zr₂O₁₂",name:"Lithium lanthanum zirconium oxide",system:"Cubic",spaceGroup:"I a -3 d · 230",lattice:{a:12.968,b:12.968,c:12.968,alpha:90,beta:90,gamma:90},atoms:[{species:"Zr",fractional_coordinates:[0,0,0]},{species:"La",fractional_coordinates:[.25,.25,.25]},{species:"Li",fractional_coordinates:[.12,.35,.48]},{species:"O",fractional_coordinates:[.1,.2,.3]}]}];function sg(){const[t,e]=L.useState("LiCoO2"),[n,i]=L.useState(null),[r,s]=L.useState(!1),[o,l]=L.useState(null),[c,u]=L.useState(!0),f=qu.find(d=>d.id===t)??qu[0],p=(n==null?void 0:n.atoms)??f.atoms,h=n?{a:Number.parseFloat(n.lattice.a)||5,b:Number.parseFloat(n.lattice.b)||5,c:Number.parseFloat(n.lattice.c)||5,alpha:90,beta:90,gamma:90}:f.lattice,m=(n==null?void 0:n.formula)??f.formula,g=n?"Uploaded CIF · local structure":`IndianMatter library · ${f.id}`,S=L.useMemo(()=>Array.from(new Set(p.map(d=>d.species))),[p]),x=async d=>{if(d){s(!0),l(null);try{i(await c3(d))}catch(v){i(null),l(v instanceof Error?v.message:"CIF parsing failed.")}finally{s(!1)}}};return a.jsx("div",{className:"w-full max-w-[1550px] mx-auto space-y-6 px-4 sm:px-8 py-6 text-im-text",children:a.jsxs("div",{children:[a.jsxs("header",{className:"mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D47E30] font-headline",children:[a.jsx(ao,{size:14})," Structure Intelligence Engine"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227] tracking-tight",children:"Crystal Structure Studio"}),a.jsx("p",{className:"mt-1 max-w-2xl text-sm text-[#6C737E]",children:"Inspect crystallographic lattice geometry, atomic coordination, and material identity in an interactive 3D WebGL workspace."})]}),a.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[a.jsxs("div",{className:"flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700",children:[a.jsx(Bh,{size:14})," WebGL ready"]}),a.jsxs("label",{className:"flex cursor-pointer items-center gap-2 rounded-xl bg-[#D47E30] hover:bg-[#B8671E] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all",children:[a.jsx(kE,{size:15})," Upload CIF",a.jsx("input",{type:"file",accept:".cif",className:"hidden",onChange:d=>{var v;return x((v=d.target.files)==null?void 0:v[0])}})]})]})]}),a.jsxs("div",{className:"grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]",children:[a.jsxs("aside",{className:"order-2 rounded-[2rem] border border-[#EDE8E2] bg-white p-5 shadow-card xl:order-1",children:[a.jsxs("div",{className:"mb-4 flex items-center justify-between",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C929C]",children:"Structure library"}),a.jsx("p",{className:"mt-0.5 text-base font-headline font-bold text-[#1E2227]",children:"Curated Presets"})]}),a.jsx("div",{className:"w-8 h-8 rounded-xl bg-[#FDF5EE] flex items-center justify-center text-[#D47E30]",children:a.jsx(jE,{size:17})})]}),a.jsx("div",{className:"space-y-2",children:qu.map(d=>{const v=!n&&f.id===d.id;return a.jsxs("button",{type:"button",onClick:()=>{e(d.id),i(null)},className:`w-full rounded-2xl border p-3.5 text-left transition-all ${v?"border-[#D47E30] bg-[#FDF5EE] shadow-sm":"border-[#EDE8E2] bg-white hover:border-[#D47E30]/40 hover:bg-[#FAF4EE]/40"}`,children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{className:"font-mono text-sm font-bold text-[#1E2227]",children:d.formula}),v&&a.jsx("span",{className:"h-2 w-2 rounded-full bg-[#D47E30] shadow-[0_0_8px_rgba(212,126,48,0.5)]"})]}),a.jsx("p",{className:"mt-1 text-xs text-[#6C737E]",children:d.name}),a.jsxs("p",{className:"mt-2 text-[10px] font-medium text-[#8C929C]",children:[d.system," · ",d.spaceGroup]})]},d.id)})}),a.jsx("div",{className:"my-5 h-px bg-[#EDE8E2]"}),a.jsxs("button",{type:"button",onClick:()=>u(d=>!d),className:"flex w-full items-center justify-between text-xs font-semibold text-[#1E2227] hover:text-[#D47E30] transition-colors",children:[a.jsx("span",{children:"Viewer preferences"}),a.jsx(Bv,{size:14,className:`transition-transform duration-200 ${c?"rotate-180":""}`})]}),c&&a.jsxs("div",{className:"mt-3 space-y-2.5 text-xs text-[#6C737E]",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{children:"Renderer"}),a.jsx("span",{className:"font-mono text-[#1E2227] font-medium",children:"WebGL 2.0"})]}),a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{children:"Antialiasing"}),a.jsx("span",{className:"text-emerald-700 font-medium",children:"Active"})]}),a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{children:"Source fidelity"}),a.jsx("span",{className:"text-[#D47E30] font-medium",children:"High"})]})]})]}),a.jsxs("section",{className:"order-1 min-w-0 xl:order-2",children:[a.jsxs("div",{className:"overflow-hidden rounded-[2rem] border border-[#EDE8E2] bg-white shadow-card",children:[a.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE8E2] bg-[#FAF4EE]/30 px-6 py-4",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-[#D47E30]",children:"Active structure"}),a.jsx("h2",{className:"mt-0.5 text-xl font-headline font-bold text-[#1E2227] tracking-tight",children:m})]}),a.jsxs("div",{className:"flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full",children:[a.jsx(_r,{size:14})," Validated geometry"]})]}),a.jsx("div",{className:"p-3 sm:p-4 bg-[#FDFBF8]/60 min-h-[500px]",children:a.jsx(l3,{atoms:p,lattice:h,materialLabel:m,sourceLabel:g})})]}),r&&a.jsx("div",{className:"mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 font-medium flex items-center gap-2",children:"Parsing CIF with the structure service…"}),o&&a.jsxs("div",{role:"alert",className:"mt-3 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-900 font-medium",children:[a.jsx("span",{children:o}),a.jsx("button",{type:"button",onClick:()=>l(null),children:a.jsx(Ys,{size:15})})]})]}),a.jsxs("aside",{className:"order-3 space-y-5",children:[a.jsxs("section",{className:"rounded-[2rem] border border-[#EDE8E2] bg-white p-5 shadow-card space-y-4",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C929C]",children:"Structure profile"}),a.jsx("h3",{className:"mt-0.5 text-base font-headline font-bold text-[#1E2227]",children:n?"Uploaded CIF":f.name})]}),a.jsx("div",{className:"w-8 h-8 rounded-xl bg-[#FDF5EE] flex items-center justify-center text-[#D47E30]",children:a.jsx(Gh,{size:16})})]}),a.jsx("div",{className:"space-y-2",children:[["Crystal system",n!=null&&n.space_group?"Parsed structure":f.system],["Space group",(n==null?void 0:n.space_group)??f.spaceGroup],["Unique elements",`${S.length} species`],["Atom sites",`${p.length} sites`]].map(([d,v])=>a.jsxs("div",{className:"rounded-xl border border-[#EDE8E2] bg-[#FAF4EE]/40 px-3.5 py-2.5",children:[a.jsx("p",{className:"text-[10px] uppercase font-semibold text-[#8C929C]",children:d}),a.jsx("p",{className:"mt-0.5 text-xs font-semibold text-[#1E2227]",children:v})]},d))})]}),a.jsxs("section",{className:"rounded-[2rem] border border-[#EDE8E2] bg-white p-5 shadow-card",children:[a.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C929C]",children:"Lattice parameters"}),a.jsx("div",{className:"mt-3 grid grid-cols-2 gap-2",children:[["a",h.a],["b",h.b],["c",h.c],["volume",h.a*h.b*h.c]].map(([d,v])=>a.jsxs("div",{className:"rounded-xl border border-[#EDE8E2] bg-[#FAF4EE]/40 px-3 py-2",children:[a.jsx("p",{className:"text-[10px] uppercase font-bold text-[#8C929C]",children:d}),a.jsxs("p",{className:"mt-0.5 font-mono text-xs font-bold text-[#1E2227]",children:[Number(v).toFixed(d==="volume"?1:3)," ",a.jsxs("span",{className:"text-[9px] text-[#8C929C]",children:["Å",d==="volume"?"³":""]})]})]},d))})]}),a.jsxs("div",{className:"flex gap-2.5",children:[a.jsxs("button",{type:"button",onClick:()=>window.location.reload(),className:"flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#EDE8E2] bg-white hover:bg-im-surfaceAlt px-3 py-2.5 text-xs font-semibold text-[#1E2227] shadow-sm transition-colors",children:[a.jsx(lo,{size:14})," Reset"]}),a.jsxs("button",{type:"button",onClick:()=>alert("Structure export queued."),className:"flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D47E30] hover:bg-[#B8671E] px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-colors",children:[a.jsx(ji,{size:14})," Export"]})]})]})]}),a.jsxs("footer",{className:"mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDE8E2] pt-4 text-[11px] text-[#8C929C]",children:[a.jsx("span",{children:"IndianMatter Structure Intelligence · Interactive WebGL preview"}),a.jsx("span",{children:"All visual coordinates reflect the active crystal lattice record"})]})]})})}function ag(){const[t,e]=L.useState(""),n=[{title:"Machine Learning Interatomic Potentials for Next-Generation Solid Electrolytes",authors:"Chen, L., Srinivasan, V., et al.",journal:"Nature Materials",year:2024,citations:142,doi:"10.1038/s41563-024-01822-x",tags:["MLIP","Solid-State","NASICON"]},{title:"Direct Synthesis and High-Throughput DFT Validation of Halide Perovskite Solar Materials",authors:"Sharma, R., Patel, K., et al.",journal:"Advanced Energy Materials",year:2023,citations:89,doi:"10.1002/aenm.202301992",tags:["Perovskite","DFT","Photovoltaics"]},{title:"Crystal Graph Neural Networks for Ultra-Fast Band Gap Prediction in Battery Cathodes",authors:"Gupta, A., Wang, Y., et al.",journal:"Physical Review Materials",year:2024,citations:67,doi:"10.1103/PhysRevMaterials.8.043801",tags:["GNN","Cathodes","Band Gap"]}];return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(Uv,{size:14})," Knowledge Exploration"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Literature & Diversity Analysis"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Explore published literature correlations, chemical space diversity projections, and crystal structure citations."})]}),a.jsx("div",{className:"bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-4",children:a.jsxs("div",{className:"relative",children:[a.jsx(ia,{className:"absolute left-4 top-1/2 -translate-y-1/2 text-[#8C929C]",size:18}),a.jsx("input",{type:"text",value:t,onChange:i=>e(i.target.value),placeholder:"Search publications by keyword, crystal system, author, or DOI...",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-[#1E2227] outline-none focus:border-[#F1641D]"})]})}),a.jsxs("div",{className:"bg-white rounded-[2.5rem] p-8 shadow-card border border-[#EFE5DC] flex flex-col md:flex-row items-center justify-between gap-8",children:[a.jsxs("div",{className:"space-y-3 max-w-xl",children:[a.jsx("span",{className:"text-xs font-bold text-[#F1641D] uppercase tracking-wider font-headline",children:"Chemical Diversity Projection"}),a.jsx("h3",{className:"text-2xl font-headline font-bold text-[#1E2227]",children:"Explored vs. Unexplored Chemical Space"}),a.jsx("p",{className:"text-xs text-[#5F6771] leading-relaxed",children:"t-SNE dimensional reduction mapping 140,000+ Materials Project structures against published synthesis papers. Dense clusters represent established oxide chemistries; sparse regions highlight novel exploration targets."}),a.jsxs("div",{className:"flex gap-4 text-xs font-semibold pt-2",children:[a.jsxs("span",{className:"flex items-center gap-1.5",children:[a.jsx("span",{className:"w-2.5 h-2.5 bg-[#F1641D] rounded-full"})," Explored Syntheses"]}),a.jsxs("span",{className:"flex items-center gap-1.5",children:[a.jsx("span",{className:"w-2.5 h-2.5 bg-[#2E7D32] rounded-full"})," High-Confidence Predicted"]})]})]}),a.jsx("div",{className:"w-56 h-44 bg-[#FAF4EE] rounded-2xl border border-[#EFE5DC] flex items-center justify-center p-4",children:a.jsxs("div",{className:"text-center",children:[a.jsx(Gh,{size:32,className:"text-[#F1641D] mx-auto mb-2"}),a.jsx("p",{className:"text-xs font-bold text-[#1E2227]",children:"Latent Space Map"}),a.jsx("p",{className:"text-[10px] text-[#8C929C]",children:"UMAP 2D Projection"})]})})]}),a.jsxs("div",{className:"space-y-4",children:[a.jsx("h3",{className:"font-headline font-bold text-xl text-[#1E2227]",children:"Correlated Research Publications"}),a.jsx("div",{className:"space-y-3",children:n.map((i,r)=>a.jsxs("div",{className:"bg-white rounded-2xl p-6 shadow-sm border border-[#EFE5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow",children:[a.jsxs("div",{className:"space-y-1.5",children:[a.jsx("h4",{className:"font-headline font-bold text-base text-[#1E2227]",children:i.title}),a.jsxs("p",{className:"text-xs text-[#5F6771]",children:[i.authors," • ",a.jsx("span",{className:"font-medium text-[#1E2227]",children:i.journal})," (",i.year,")"]}),a.jsx("div",{className:"flex flex-wrap gap-1.5 pt-1",children:i.tags.map(s=>a.jsx("span",{className:"px-2.5 py-0.5 bg-[#FAF4EE] rounded-md text-[10px] font-medium text-[#5B636E]",children:s},s))})]}),a.jsxs("div",{className:"flex items-center gap-3 shrink-0",children:[a.jsxs("span",{className:"text-xs text-[#8C929C] font-mono",children:[i.citations," citations"]}),a.jsxs("a",{href:`https://doi.org/${i.doi}`,target:"_blank",rel:"noopener noreferrer",className:"px-3.5 py-2 bg-[#FAF4EE] text-[#F1641D] rounded-xl text-xs font-semibold hover:bg-[#FBE8D8] transition-colors flex items-center gap-1",children:["DOI ",a.jsx(jh,{size:12})]})]})]},r))})]})]})}function og(){const[t,e]=L.useState("materials"),n=[{formula:"LiCoO2",name:"Lithium Cobalt Oxide",system:"Trigonal",date:"2026-09-08",id:"mp-22526"},{formula:"Na3Zr2Si2PO12",name:"NASICON Superionic",system:"Trigonal",date:"2026-09-09",id:"oqmd-1218"},{formula:"Li7La3Zr2O12",name:"Garnet LLZO",system:"Cubic",date:"2026-09-10",id:"mp-942732"}];return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(kh,{size:14})," Research Workspace"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Saved Collections"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Access bookmarked crystal structures, completed DFT runs, GNN property inferences, and synthesized CIFs."})]}),a.jsxs("button",{onClick:()=>alert("Consolidated research archive exported (ZIP)."),className:"px-4 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] flex items-center gap-2 shadow-soft shrink-0",children:[a.jsx(ji,{size:14})," Export Workspace (ZIP)"]})]}),a.jsx("div",{className:"bg-white rounded-2xl p-2 shadow-sm border border-[#EFE5DC] flex flex-wrap gap-2",children:[{id:"materials",label:"Saved Materials (3)"},{id:"predictions",label:"GNN Predictions (8)"},{id:"dft",label:"DFT Runs (4)"},{id:"cif",label:"Synthesized CIFs (5)"}].map(i=>a.jsx("button",{onClick:()=>e(i.id),className:`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${t===i.id?"bg-[#FBE8D8] text-[#F1641D] shadow-sm":"text-[#5F6771] hover:text-[#1E2227]"}`,children:i.label},i.id))}),a.jsx("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC]",children:a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-left text-xs",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"border-b border-[#F2E7DC] text-[#8C929C] font-headline uppercase text-[10px]",children:[a.jsx("th",{className:"py-3 px-4",children:"Formula"}),a.jsx("th",{className:"py-3 px-4",children:"Identifier / ID"}),a.jsx("th",{className:"py-3 px-4",children:"Crystal System"}),a.jsx("th",{className:"py-3 px-4",children:"Saved Date"}),a.jsx("th",{className:"py-3 px-4 text-right",children:"Actions"})]})}),a.jsx("tbody",{className:"divide-y divide-[#FAF4EE]",children:n.map((i,r)=>a.jsxs("tr",{className:"hover:bg-[#FAF4EE]/60 transition-colors",children:[a.jsx("td",{className:"py-4 px-4 font-bold text-[#1E2227] font-headline text-sm",children:i.formula}),a.jsx("td",{className:"py-4 px-4 font-mono text-[#5F6771]",children:i.id}),a.jsx("td",{className:"py-4 px-4 text-[#5F6771]",children:i.system}),a.jsx("td",{className:"py-4 px-4 text-[#8C929C]",children:i.date}),a.jsxs("td",{className:"py-4 px-4 text-right space-x-2",children:[a.jsx("button",{onClick:()=>alert(`Downloaded ${i.formula} CIF`),className:"p-1.5 hover:bg-[#FAF4EE] rounded-lg text-[#5F6771] hover:text-[#1E2227]",title:"Download",children:a.jsx(ji,{size:14})}),a.jsx("button",{onClick:()=>alert(`Removed ${i.formula} from saved collection.`),className:"p-1.5 hover:bg-red-50 rounded-lg text-[#8C929C] hover:text-red-600",title:"Delete",children:a.jsx(YE,{size:14})})]})]},r))})]})})})]})}function lg(){const[t,e]=L.useState("Dr. Srinivasan"),[n,i]=L.useState("researcher@lab.edu"),[r,s]=L.useState("Solid State Ionics Laboratory"),[o,l]=L.useState("mp_live_9481940184029481");return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(co,{size:14})," Workspace Configuration"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Researcher Settings"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Manage your laboratory affiliation, API access tokens, units of measurement, and cluster credentials."})]}),a.jsxs("div",{className:"max-w-3xl space-y-6",children:[a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Researcher Profile"}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block font-semibold text-[#1E2227] mb-1.5",children:"Full Name"}),a.jsx("input",{type:"text",value:t,onChange:c=>e(c.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2.5 outline-none focus:border-[#F1641D]"})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block font-semibold text-[#1E2227] mb-1.5",children:"Email Address"}),a.jsx("input",{type:"email",value:n,onChange:c=>i(c.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2.5 outline-none focus:border-[#F1641D]"})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block font-semibold text-[#1E2227] mb-1.5",children:"Laboratory Affiliation"}),a.jsx("input",{type:"text",value:r,onChange:c=>s(c.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2.5 outline-none focus:border-[#F1641D]"})]})]}),a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"API Credentials"}),a.jsx("p",{className:"text-xs text-[#6C737E]",children:"Connect your Materials Project API Key to enable automated cross-federation querying."}),a.jsxs("div",{children:[a.jsx("label",{className:"block font-semibold text-[#1E2227] mb-1.5",children:"Materials Project API Key"}),a.jsxs("div",{className:"relative",children:[a.jsx(BE,{className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]",size:15}),a.jsx("input",{type:"password",value:o,onChange:c=>l(c.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono outline-none focus:border-[#F1641D]"})]})]})]}),a.jsx("div",{className:"flex justify-end",children:a.jsx("button",{onClick:()=>alert("Settings saved successfully."),className:"px-6 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft",children:"Save Changes"})})]})]})}function cg(){const t=[{q:"What graph neural network architectures power property predictions?",a:"IndianMatter utilizes M3GNet, ALIGNN, and CHGNet pre-trained on Materials Project 2024.1 datasets, calibrated with 95% confidence intervals."},{q:"How does DFT validation work?",a:"Calculations are dispatched using Quantum ESPRESSO / VASP backend clusters employing PBE, PBEsol, and SCAN meta-GGA exchange-correlation functionals."},{q:"Which CIF format versions are supported for batch screening?",a:"The parser supports standard CIF 1.1, CIF3, and CIF5 specifications. Malformed files are flagged in the pre-flight verification queue."}];return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(jv,{size:14})," Knowledge & Documentation"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Help & Scientific Support"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Reference documentation on crystallographic conventions, machine learning model benchmarks, and computational methodology."})]}),a.jsxs("div",{className:"max-w-3xl space-y-6",children:[a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Frequently Asked Questions"}),a.jsx("div",{className:"space-y-4 text-xs",children:t.map((e,n)=>a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-xl border border-[#EFE5DC] space-y-1.5",children:[a.jsx("p",{className:"font-bold text-[#1E2227]",children:e.q}),a.jsx("p",{className:"text-[#5F6771] leading-relaxed",children:e.a})]},n))})]}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-[2rem] p-6 sm:p-8 border border-[#EFE5DC] flex items-center justify-between gap-4",children:[a.jsxs("div",{children:[a.jsx("h4",{className:"font-headline font-bold text-base text-[#1E2227]",children:"Need Dedicated Research Support?"}),a.jsx("p",{className:"text-xs text-[#6C737E] mt-0.5",children:"Contact our computational physics advisory team for custom functional setup or large-scale batch processing."})]}),a.jsx("button",{onClick:()=>alert("Support ticket created. A computational scientist will respond within 4 hours."),className:"px-5 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft shrink-0",children:"Submit Research Ticket"})]})]})]})}function u3(){return a.jsx(SE,{children:a.jsxs(hE,{children:[a.jsxs($e,{element:a.jsx(ib,{}),children:[a.jsx($e,{path:"/",element:a.jsx(ab,{})}),a.jsx($e,{path:"/signin",element:a.jsx(cb,{})})]}),a.jsxs($e,{path:"/app",element:a.jsx(qi,{}),children:[a.jsx($e,{index:!0,element:a.jsx(Xm,{})}),a.jsx($e,{path:"materials",element:a.jsx(Ym,{})}),a.jsx($e,{path:"materials/:id",element:a.jsx(Km,{})}),a.jsx($e,{path:"advanced-search",element:a.jsx(Zm,{})}),a.jsx($e,{path:"dft",element:a.jsx(Jm,{})}),a.jsx($e,{path:"cif-gen",element:a.jsx(Qm,{})}),a.jsx($e,{path:"predict",element:a.jsx(ix,{})}),a.jsx($e,{path:"structures",element:a.jsx(sg,{})}),a.jsx($e,{path:"batch",element:a.jsx(tx,{})}),a.jsx($e,{path:"literature",element:a.jsx(ag,{})}),a.jsx($e,{path:"saved",element:a.jsx(og,{})}),a.jsx($e,{path:"settings",element:a.jsx(lg,{})}),a.jsx($e,{path:"help",element:a.jsx(cg,{})})]}),a.jsxs($e,{path:"/dashboard",element:a.jsx(qi,{}),children:[a.jsx($e,{index:!0,element:a.jsx(Xm,{})}),a.jsx($e,{path:"dft-validation",element:a.jsx(Jm,{})}),a.jsx($e,{path:"cif-generation",element:a.jsx(Qm,{})}),a.jsx($e,{path:"property-prediction",element:a.jsx(ix,{})}),a.jsx($e,{path:"structure-visualization",element:a.jsx(sg,{})}),a.jsx($e,{path:"batch-prediction",element:a.jsx(tx,{})})]}),a.jsxs($e,{path:"/materials-search",element:a.jsx(qi,{}),children:[a.jsx($e,{index:!0,element:a.jsx(Ym,{})}),a.jsx($e,{path:"advanced",element:a.jsx(Zm,{})})]}),a.jsx($e,{path:"/materials",element:a.jsx(qi,{}),children:a.jsx($e,{path:":id",element:a.jsx(Km,{})})}),a.jsx($e,{path:"/literature-diversity",element:a.jsx(qi,{}),children:a.jsx($e,{index:!0,element:a.jsx(ag,{})})}),a.jsx($e,{path:"/saved-results",element:a.jsx(qi,{}),children:a.jsx($e,{index:!0,element:a.jsx(og,{})})}),a.jsx($e,{path:"/settings",element:a.jsx(qi,{}),children:a.jsx($e,{index:!0,element:a.jsx(lg,{})})}),a.jsx($e,{path:"/help-support",element:a.jsx(qi,{}),children:a.jsx($e,{index:!0,element:a.jsx(cg,{})})}),a.jsx($e,{path:"*",element:a.jsx(dE,{to:"/",replace:!0})})]})})}const d3={theme:"system",setTheme:()=>null},f3=L.createContext(d3);function h3({children:t,defaultTheme:e="system",storageKey:n="vite-ui-theme",...i}){const[r,s]=L.useState(()=>typeof window>"u"?e:window.localStorage.getItem(n)||e);L.useEffect(()=>{const l=window.document.documentElement;if(l.classList.remove("light","dark"),r==="system"){const c=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";l.classList.add(c);return}l.classList.add(r)},[r]);const o={theme:r,setTheme:l=>{window.localStorage.setItem(n,l),s(l)}};return a.jsx(f3.Provider,{...i,value:o,children:t})}const p3="635274602034-pjssntimvqimvijg8t0murgnpmvdus0o.apps.googleusercontent.com";Yu.createRoot(document.getElementById("root")).render(a.jsx(mc.StrictMode,{children:a.jsx(bv,{clientId:p3,children:a.jsx(h3,{children:a.jsx(u3,{})})})}));
