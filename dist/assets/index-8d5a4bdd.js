var $_=Object.defineProperty;var q_=(t,e,n)=>e in t?$_(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Vc=(t,e,n)=>(q_(t,typeof e!="symbol"?e+"":e,n),n);function Y_(t,e){for(var n=0;n<e.length;n++){const i=e[n];if(typeof i!="string"&&!Array.isArray(i)){for(const r in i)if(r!=="default"&&!(r in t)){const s=Object.getOwnPropertyDescriptor(i,r);s&&Object.defineProperty(t,r,s.get?s:{enumerable:!0,get:()=>i[r]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function K_(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var xg={exports:{}},xc={},gg={exports:{}},Je={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var vo=Symbol.for("react.element"),Z_=Symbol.for("react.portal"),J_=Symbol.for("react.fragment"),Q_=Symbol.for("react.strict_mode"),e1=Symbol.for("react.profiler"),t1=Symbol.for("react.provider"),n1=Symbol.for("react.context"),i1=Symbol.for("react.forward_ref"),r1=Symbol.for("react.suspense"),s1=Symbol.for("react.memo"),a1=Symbol.for("react.lazy"),Rp=Symbol.iterator;function o1(t){return t===null||typeof t!="object"?null:(t=Rp&&t[Rp]||t["@@iterator"],typeof t=="function"?t:null)}var vg={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_g=Object.assign,yg={};function Js(t,e,n){this.props=t,this.context=e,this.refs=yg,this.updater=n||vg}Js.prototype.isReactComponent={};Js.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Js.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Eg(){}Eg.prototype=Js.prototype;function Hf(t,e,n){this.props=t,this.context=e,this.refs=yg,this.updater=n||vg}var Wf=Hf.prototype=new Eg;Wf.constructor=Hf;_g(Wf,Js.prototype);Wf.isPureReactComponent=!0;var Dp=Array.isArray,Sg=Object.prototype.hasOwnProperty,Xf={current:null},bg={key:!0,ref:!0,__self:!0,__source:!0};function Mg(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Sg.call(e,i)&&!bg.hasOwnProperty(i)&&(r[i]=e[i]);var l=arguments.length-2;if(l===1)r.children=n;else if(1<l){for(var c=Array(l),u=0;u<l;u++)c[u]=arguments[u+2];r.children=c}if(t&&t.defaultProps)for(i in l=t.defaultProps,l)r[i]===void 0&&(r[i]=l[i]);return{$$typeof:vo,type:t,key:s,ref:o,props:r,_owner:Xf.current}}function l1(t,e){return{$$typeof:vo,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function $f(t){return typeof t=="object"&&t!==null&&t.$$typeof===vo}function c1(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Pp=/\/+/g;function Gc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?c1(""+t.key):e.toString(36)}function gl(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case vo:case Z_:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+Gc(o,0):i,Dp(r)?(n="",t!=null&&(n=t.replace(Pp,"$&/")+"/"),gl(r,e,n,"",function(u){return u})):r!=null&&($f(r)&&(r=l1(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Pp,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",Dp(t))for(var l=0;l<t.length;l++){s=t[l];var c=i+Gc(s,l);o+=gl(s,e,n,c,r)}else if(c=o1(t),typeof c=="function")for(t=c.call(t),l=0;!(s=t.next()).done;)s=s.value,c=i+Gc(s,l++),o+=gl(s,e,n,c,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function To(t,e,n){if(t==null)return t;var i=[],r=0;return gl(t,i,"","",function(s){return e.call(n,s,r++)}),i}function u1(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var fn={current:null},vl={transition:null},d1={ReactCurrentDispatcher:fn,ReactCurrentBatchConfig:vl,ReactCurrentOwner:Xf};function wg(){throw Error("act(...) is not supported in production builds of React.")}Je.Children={map:To,forEach:function(t,e,n){To(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return To(t,function(){e++}),e},toArray:function(t){return To(t,function(e){return e})||[]},only:function(t){if(!$f(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Je.Component=Js;Je.Fragment=J_;Je.Profiler=e1;Je.PureComponent=Hf;Je.StrictMode=Q_;Je.Suspense=r1;Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=d1;Je.act=wg;Je.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=_g({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Xf.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(c in e)Sg.call(e,c)&&!bg.hasOwnProperty(c)&&(i[c]=e[c]===void 0&&l!==void 0?l[c]:e[c])}var c=arguments.length-2;if(c===1)i.children=n;else if(1<c){l=Array(c);for(var u=0;u<c;u++)l[u]=arguments[u+2];i.children=l}return{$$typeof:vo,type:t.type,key:r,ref:s,props:i,_owner:o}};Je.createContext=function(t){return t={$$typeof:n1,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:t1,_context:t},t.Consumer=t};Je.createElement=Mg;Je.createFactory=function(t){var e=Mg.bind(null,t);return e.type=t,e};Je.createRef=function(){return{current:null}};Je.forwardRef=function(t){return{$$typeof:i1,render:t}};Je.isValidElement=$f;Je.lazy=function(t){return{$$typeof:a1,_payload:{_status:-1,_result:t},_init:u1}};Je.memo=function(t,e){return{$$typeof:s1,type:t,compare:e===void 0?null:e}};Je.startTransition=function(t){var e=vl.transition;vl.transition={};try{t()}finally{vl.transition=e}};Je.unstable_act=wg;Je.useCallback=function(t,e){return fn.current.useCallback(t,e)};Je.useContext=function(t){return fn.current.useContext(t)};Je.useDebugValue=function(){};Je.useDeferredValue=function(t){return fn.current.useDeferredValue(t)};Je.useEffect=function(t,e){return fn.current.useEffect(t,e)};Je.useId=function(){return fn.current.useId()};Je.useImperativeHandle=function(t,e,n){return fn.current.useImperativeHandle(t,e,n)};Je.useInsertionEffect=function(t,e){return fn.current.useInsertionEffect(t,e)};Je.useLayoutEffect=function(t,e){return fn.current.useLayoutEffect(t,e)};Je.useMemo=function(t,e){return fn.current.useMemo(t,e)};Je.useReducer=function(t,e,n){return fn.current.useReducer(t,e,n)};Je.useRef=function(t){return fn.current.useRef(t)};Je.useState=function(t){return fn.current.useState(t)};Je.useSyncExternalStore=function(t,e,n){return fn.current.useSyncExternalStore(t,e,n)};Je.useTransition=function(){return fn.current.useTransition()};Je.version="18.3.1";gg.exports=Je;var L=gg.exports;const gc=K_(L),f1=Y_({__proto__:null,default:gc},[L]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h1=L,p1=Symbol.for("react.element"),m1=Symbol.for("react.fragment"),x1=Object.prototype.hasOwnProperty,g1=h1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,v1={key:!0,ref:!0,__self:!0,__source:!0};function Cg(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)x1.call(e,i)&&!v1.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:p1,type:t,key:s,ref:o,props:r,_owner:g1.current}}xc.Fragment=m1;xc.jsx=Cg;xc.jsxs=Cg;xg.exports=xc;var a=xg.exports,Qu={},Ag={exports:{}},Pn={},Tg={exports:{}},Ng={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(j,z){var $=j.length;j.push(z);e:for(;0<$;){var Q=$-1>>>1,ce=j[Q];if(0<r(ce,z))j[Q]=z,j[$]=ce,$=Q;else break e}}function n(j){return j.length===0?null:j[0]}function i(j){if(j.length===0)return null;var z=j[0],$=j.pop();if($!==z){j[0]=$;e:for(var Q=0,ce=j.length,Me=ce>>>1;Q<Me;){var Ye=2*(Q+1)-1,He=j[Ye],Ve=Ye+1,J=j[Ve];if(0>r(He,$))Ve<ce&&0>r(J,He)?(j[Q]=J,j[Ve]=$,Q=Ve):(j[Q]=He,j[Ye]=$,Q=Ye);else if(Ve<ce&&0>r(J,$))j[Q]=J,j[Ve]=$,Q=Ve;else break e}}return z}function r(j,z){var $=j.sortIndex-z.sortIndex;return $!==0?$:j.id-z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var c=[],u=[],d=1,p=null,h=3,m=!1,v=!1,b=!1,x=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function w(j){for(var z=n(u);z!==null;){if(z.callback===null)i(u);else if(z.startTime<=j)i(u),z.sortIndex=z.expirationTime,e(c,z);else break;z=n(u)}}function S(j){if(b=!1,w(j),!v)if(n(c)!==null)v=!0,Z(y);else{var z=n(u);z!==null&&X(S,z.startTime-j)}}function y(j,z){v=!1,b&&(b=!1,f(_),_=-1),m=!0;var $=h;try{for(w(z),p=n(c);p!==null&&(!(p.expirationTime>z)||j&&!P());){var Q=p.callback;if(typeof Q=="function"){p.callback=null,h=p.priorityLevel;var ce=Q(p.expirationTime<=z);z=t.unstable_now(),typeof ce=="function"?p.callback=ce:p===n(c)&&i(c),w(z)}else i(c);p=n(c)}if(p!==null)var Me=!0;else{var Ye=n(u);Ye!==null&&X(S,Ye.startTime-z),Me=!1}return Me}finally{p=null,h=$,m=!1}}var M=!1,A=null,_=-1,T=5,R=-1;function P(){return!(t.unstable_now()-R<T)}function D(){if(A!==null){var j=t.unstable_now();R=j;var z=!0;try{z=A(!0,j)}finally{z?I():(M=!1,A=null)}}else M=!1}var I;if(typeof g=="function")I=function(){g(D)};else if(typeof MessageChannel<"u"){var F=new MessageChannel,B=F.port2;F.port1.onmessage=D,I=function(){B.postMessage(null)}}else I=function(){x(D,0)};function Z(j){A=j,M||(M=!0,I())}function X(j,z){_=x(function(){j(t.unstable_now())},z)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(j){j.callback=null},t.unstable_continueExecution=function(){v||m||(v=!0,Z(y))},t.unstable_forceFrameRate=function(j){0>j||125<j?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<j?Math.floor(1e3/j):5},t.unstable_getCurrentPriorityLevel=function(){return h},t.unstable_getFirstCallbackNode=function(){return n(c)},t.unstable_next=function(j){switch(h){case 1:case 2:case 3:var z=3;break;default:z=h}var $=h;h=z;try{return j()}finally{h=$}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(j,z){switch(j){case 1:case 2:case 3:case 4:case 5:break;default:j=3}var $=h;h=j;try{return z()}finally{h=$}},t.unstable_scheduleCallback=function(j,z,$){var Q=t.unstable_now();switch(typeof $=="object"&&$!==null?($=$.delay,$=typeof $=="number"&&0<$?Q+$:Q):$=Q,j){case 1:var ce=-1;break;case 2:ce=250;break;case 5:ce=1073741823;break;case 4:ce=1e4;break;default:ce=5e3}return ce=$+ce,j={id:d++,callback:z,priorityLevel:j,startTime:$,expirationTime:ce,sortIndex:-1},$>Q?(j.sortIndex=$,e(u,j),n(c)===null&&j===n(u)&&(b?(f(_),_=-1):b=!0,X(S,$-Q))):(j.sortIndex=ce,e(c,j),v||m||(v=!0,Z(y))),j},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(j){var z=h;return function(){var $=h;h=z;try{return j.apply(this,arguments)}finally{h=$}}}})(Ng);Tg.exports=Ng;var _1=Tg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var y1=L,Dn=_1;function ae(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Rg=new Set,Va={};function es(t,e){Vs(t,e),Vs(t+"Capture",e)}function Vs(t,e){for(Va[t]=e,t=0;t<e.length;t++)Rg.add(e[t])}var Ui=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ed=Object.prototype.hasOwnProperty,E1=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Fp={},Lp={};function S1(t){return ed.call(Lp,t)?!0:ed.call(Fp,t)?!1:E1.test(t)?Lp[t]=!0:(Fp[t]=!0,!1)}function b1(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function M1(t,e,n,i){if(e===null||typeof e>"u"||b1(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function hn(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Kt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Kt[t]=new hn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Kt[e]=new hn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Kt[t]=new hn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Kt[t]=new hn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Kt[t]=new hn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Kt[t]=new hn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Kt[t]=new hn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Kt[t]=new hn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Kt[t]=new hn(t,5,!1,t.toLowerCase(),null,!1,!1)});var qf=/[\-:]([a-z])/g;function Yf(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(qf,Yf);Kt[e]=new hn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(qf,Yf);Kt[e]=new hn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(qf,Yf);Kt[e]=new hn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Kt[t]=new hn(t,1,!1,t.toLowerCase(),null,!1,!1)});Kt.xlinkHref=new hn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Kt[t]=new hn(t,1,!1,t.toLowerCase(),null,!0,!0)});function Kf(t,e,n,i){var r=Kt.hasOwnProperty(e)?Kt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(M1(e,n,r,i)&&(n=null),i||r===null?S1(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Vi=y1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,No=Symbol.for("react.element"),Es=Symbol.for("react.portal"),Ss=Symbol.for("react.fragment"),Zf=Symbol.for("react.strict_mode"),td=Symbol.for("react.profiler"),Dg=Symbol.for("react.provider"),Pg=Symbol.for("react.context"),Jf=Symbol.for("react.forward_ref"),nd=Symbol.for("react.suspense"),id=Symbol.for("react.suspense_list"),Qf=Symbol.for("react.memo"),ir=Symbol.for("react.lazy"),Fg=Symbol.for("react.offscreen"),Ip=Symbol.iterator;function oa(t){return t===null||typeof t!="object"?null:(t=Ip&&t[Ip]||t["@@iterator"],typeof t=="function"?t:null)}var Mt=Object.assign,Hc;function wa(t){if(Hc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Hc=e&&e[1]||""}return`
`+Hc+t}var Wc=!1;function Xc(t,e){if(!t||Wc)return"";Wc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){i=u}t.call(e.prototype)}else{try{throw Error()}catch(u){i=u}t()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var r=u.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,l=s.length-1;1<=o&&0<=l&&r[o]!==s[l];)l--;for(;1<=o&&0<=l;o--,l--)if(r[o]!==s[l]){if(o!==1||l!==1)do if(o--,l--,0>l||r[o]!==s[l]){var c=`
`+r[o].replace(" at new "," at ");return t.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",t.displayName)),c}while(1<=o&&0<=l);break}}}finally{Wc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?wa(t):""}function w1(t){switch(t.tag){case 5:return wa(t.type);case 16:return wa("Lazy");case 13:return wa("Suspense");case 19:return wa("SuspenseList");case 0:case 2:case 15:return t=Xc(t.type,!1),t;case 11:return t=Xc(t.type.render,!1),t;case 1:return t=Xc(t.type,!0),t;default:return""}}function rd(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Ss:return"Fragment";case Es:return"Portal";case td:return"Profiler";case Zf:return"StrictMode";case nd:return"Suspense";case id:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Pg:return(t.displayName||"Context")+".Consumer";case Dg:return(t._context.displayName||"Context")+".Provider";case Jf:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Qf:return e=t.displayName||null,e!==null?e:rd(t.type)||"Memo";case ir:e=t._payload,t=t._init;try{return rd(t(e))}catch{}}return null}function C1(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return rd(e);case 8:return e===Zf?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Sr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Lg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function A1(t){var e=Lg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Ro(t){t._valueTracker||(t._valueTracker=A1(t))}function Ig(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Lg(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Il(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function sd(t,e){var n=e.checked;return Mt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Up(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=Sr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Ug(t,e){e=e.checked,e!=null&&Kf(t,"checked",e,!1)}function ad(t,e){Ug(t,e);var n=Sr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?od(t,e.type,n):e.hasOwnProperty("defaultValue")&&od(t,e.type,Sr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function kp(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function od(t,e,n){(e!=="number"||Il(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Ca=Array.isArray;function Ls(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+Sr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function ld(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ae(91));return Mt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Op(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ae(92));if(Ca(n)){if(1<n.length)throw Error(ae(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:Sr(n)}}function kg(t,e){var n=Sr(e.value),i=Sr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Bp(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Og(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function cd(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Og(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Do,Bg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Do=Do||document.createElement("div"),Do.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Do.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Ga(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Pa={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},T1=["Webkit","ms","Moz","O"];Object.keys(Pa).forEach(function(t){T1.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Pa[e]=Pa[t]})});function jg(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Pa.hasOwnProperty(t)&&Pa[t]?(""+e).trim():e+"px"}function zg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=jg(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var N1=Mt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ud(t,e){if(e){if(N1[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ae(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ae(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ae(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ae(62))}}function dd(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var fd=null;function eh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var hd=null,Is=null,Us=null;function jp(t){if(t=Eo(t)){if(typeof hd!="function")throw Error(ae(280));var e=t.stateNode;e&&(e=Sc(e),hd(t.stateNode,t.type,e))}}function Vg(t){Is?Us?Us.push(t):Us=[t]:Is=t}function Gg(){if(Is){var t=Is,e=Us;if(Us=Is=null,jp(t),e)for(t=0;t<e.length;t++)jp(e[t])}}function Hg(t,e){return t(e)}function Wg(){}var $c=!1;function Xg(t,e,n){if($c)return t(e,n);$c=!0;try{return Hg(t,e,n)}finally{$c=!1,(Is!==null||Us!==null)&&(Wg(),Gg())}}function Ha(t,e){var n=t.stateNode;if(n===null)return null;var i=Sc(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ae(231,e,typeof n));return n}var pd=!1;if(Ui)try{var la={};Object.defineProperty(la,"passive",{get:function(){pd=!0}}),window.addEventListener("test",la,la),window.removeEventListener("test",la,la)}catch{pd=!1}function R1(t,e,n,i,r,s,o,l,c){var u=Array.prototype.slice.call(arguments,3);try{e.apply(n,u)}catch(d){this.onError(d)}}var Fa=!1,Ul=null,kl=!1,md=null,D1={onError:function(t){Fa=!0,Ul=t}};function P1(t,e,n,i,r,s,o,l,c){Fa=!1,Ul=null,R1.apply(D1,arguments)}function F1(t,e,n,i,r,s,o,l,c){if(P1.apply(this,arguments),Fa){if(Fa){var u=Ul;Fa=!1,Ul=null}else throw Error(ae(198));kl||(kl=!0,md=u)}}function ts(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function $g(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function zp(t){if(ts(t)!==t)throw Error(ae(188))}function L1(t){var e=t.alternate;if(!e){if(e=ts(t),e===null)throw Error(ae(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return zp(r),t;if(s===i)return zp(r),e;s=s.sibling}throw Error(ae(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,l=r.child;l;){if(l===n){o=!0,n=r,i=s;break}if(l===i){o=!0,i=r,n=s;break}l=l.sibling}if(!o){for(l=s.child;l;){if(l===n){o=!0,n=s,i=r;break}if(l===i){o=!0,i=s,n=r;break}l=l.sibling}if(!o)throw Error(ae(189))}}if(n.alternate!==i)throw Error(ae(190))}if(n.tag!==3)throw Error(ae(188));return n.stateNode.current===n?t:e}function qg(t){return t=L1(t),t!==null?Yg(t):null}function Yg(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Yg(t);if(e!==null)return e;t=t.sibling}return null}var Kg=Dn.unstable_scheduleCallback,Vp=Dn.unstable_cancelCallback,I1=Dn.unstable_shouldYield,U1=Dn.unstable_requestPaint,At=Dn.unstable_now,k1=Dn.unstable_getCurrentPriorityLevel,th=Dn.unstable_ImmediatePriority,Zg=Dn.unstable_UserBlockingPriority,Ol=Dn.unstable_NormalPriority,O1=Dn.unstable_LowPriority,Jg=Dn.unstable_IdlePriority,vc=null,mi=null;function B1(t){if(mi&&typeof mi.onCommitFiberRoot=="function")try{mi.onCommitFiberRoot(vc,t,void 0,(t.current.flags&128)===128)}catch{}}var ei=Math.clz32?Math.clz32:V1,j1=Math.log,z1=Math.LN2;function V1(t){return t>>>=0,t===0?32:31-(j1(t)/z1|0)|0}var Po=64,Fo=4194304;function Aa(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Bl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~r;l!==0?i=Aa(l):(s&=o,s!==0&&(i=Aa(s)))}else o=n&~r,o!==0?i=Aa(o):s!==0&&(i=Aa(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-ei(e),r=1<<n,i|=t[n],e&=~r;return i}function G1(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function H1(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-ei(s),l=1<<o,c=r[o];c===-1?(!(l&n)||l&i)&&(r[o]=G1(l,e)):c<=e&&(t.expiredLanes|=l),s&=~l}}function xd(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Qg(){var t=Po;return Po<<=1,!(Po&4194240)&&(Po=64),t}function qc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function _o(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ei(e),t[e]=n}function W1(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-ei(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function nh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-ei(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var ct=0;function e0(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var t0,ih,n0,i0,r0,gd=!1,Lo=[],fr=null,hr=null,pr=null,Wa=new Map,Xa=new Map,ar=[],X1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Gp(t,e){switch(t){case"focusin":case"focusout":fr=null;break;case"dragenter":case"dragleave":hr=null;break;case"mouseover":case"mouseout":pr=null;break;case"pointerover":case"pointerout":Wa.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Xa.delete(e.pointerId)}}function ca(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Eo(e),e!==null&&ih(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function $1(t,e,n,i,r){switch(e){case"focusin":return fr=ca(fr,t,e,n,i,r),!0;case"dragenter":return hr=ca(hr,t,e,n,i,r),!0;case"mouseover":return pr=ca(pr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Wa.set(s,ca(Wa.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Xa.set(s,ca(Xa.get(s)||null,t,e,n,i,r)),!0}return!1}function s0(t){var e=Br(t.target);if(e!==null){var n=ts(e);if(n!==null){if(e=n.tag,e===13){if(e=$g(n),e!==null){t.blockedOn=e,r0(t.priority,function(){n0(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function _l(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=vd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);fd=i,n.target.dispatchEvent(i),fd=null}else return e=Eo(n),e!==null&&ih(e),t.blockedOn=n,!1;e.shift()}return!0}function Hp(t,e,n){_l(t)&&n.delete(e)}function q1(){gd=!1,fr!==null&&_l(fr)&&(fr=null),hr!==null&&_l(hr)&&(hr=null),pr!==null&&_l(pr)&&(pr=null),Wa.forEach(Hp),Xa.forEach(Hp)}function ua(t,e){t.blockedOn===e&&(t.blockedOn=null,gd||(gd=!0,Dn.unstable_scheduleCallback(Dn.unstable_NormalPriority,q1)))}function $a(t){function e(r){return ua(r,t)}if(0<Lo.length){ua(Lo[0],t);for(var n=1;n<Lo.length;n++){var i=Lo[n];i.blockedOn===t&&(i.blockedOn=null)}}for(fr!==null&&ua(fr,t),hr!==null&&ua(hr,t),pr!==null&&ua(pr,t),Wa.forEach(e),Xa.forEach(e),n=0;n<ar.length;n++)i=ar[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<ar.length&&(n=ar[0],n.blockedOn===null);)s0(n),n.blockedOn===null&&ar.shift()}var ks=Vi.ReactCurrentBatchConfig,jl=!0;function Y1(t,e,n,i){var r=ct,s=ks.transition;ks.transition=null;try{ct=1,rh(t,e,n,i)}finally{ct=r,ks.transition=s}}function K1(t,e,n,i){var r=ct,s=ks.transition;ks.transition=null;try{ct=4,rh(t,e,n,i)}finally{ct=r,ks.transition=s}}function rh(t,e,n,i){if(jl){var r=vd(t,e,n,i);if(r===null)ru(t,e,i,zl,n),Gp(t,i);else if($1(r,t,e,n,i))i.stopPropagation();else if(Gp(t,i),e&4&&-1<X1.indexOf(t)){for(;r!==null;){var s=Eo(r);if(s!==null&&t0(s),s=vd(t,e,n,i),s===null&&ru(t,e,i,zl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else ru(t,e,i,null,n)}}var zl=null;function vd(t,e,n,i){if(zl=null,t=eh(i),t=Br(t),t!==null)if(e=ts(t),e===null)t=null;else if(n=e.tag,n===13){if(t=$g(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return zl=t,null}function a0(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(k1()){case th:return 1;case Zg:return 4;case Ol:case O1:return 16;case Jg:return 536870912;default:return 16}default:return 16}}var cr=null,sh=null,yl=null;function o0(){if(yl)return yl;var t,e=sh,n=e.length,i,r="value"in cr?cr.value:cr.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return yl=r.slice(t,1<i?1-i:void 0)}function El(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Io(){return!0}function Wp(){return!1}function Fn(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Io:Wp,this.isPropagationStopped=Wp,this}return Mt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Io)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Io)},persist:function(){},isPersistent:Io}),e}var Qs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ah=Fn(Qs),yo=Mt({},Qs,{view:0,detail:0}),Z1=Fn(yo),Yc,Kc,da,_c=Mt({},yo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:oh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==da&&(da&&t.type==="mousemove"?(Yc=t.screenX-da.screenX,Kc=t.screenY-da.screenY):Kc=Yc=0,da=t),Yc)},movementY:function(t){return"movementY"in t?t.movementY:Kc}}),Xp=Fn(_c),J1=Mt({},_c,{dataTransfer:0}),Q1=Fn(J1),ey=Mt({},yo,{relatedTarget:0}),Zc=Fn(ey),ty=Mt({},Qs,{animationName:0,elapsedTime:0,pseudoElement:0}),ny=Fn(ty),iy=Mt({},Qs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),ry=Fn(iy),sy=Mt({},Qs,{data:0}),$p=Fn(sy),ay={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},oy={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ly={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function cy(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=ly[t])?!!e[t]:!1}function oh(){return cy}var uy=Mt({},yo,{key:function(t){if(t.key){var e=ay[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=El(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?oy[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:oh,charCode:function(t){return t.type==="keypress"?El(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?El(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),dy=Fn(uy),fy=Mt({},_c,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),qp=Fn(fy),hy=Mt({},yo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:oh}),py=Fn(hy),my=Mt({},Qs,{propertyName:0,elapsedTime:0,pseudoElement:0}),xy=Fn(my),gy=Mt({},_c,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),vy=Fn(gy),_y=[9,13,27,32],lh=Ui&&"CompositionEvent"in window,La=null;Ui&&"documentMode"in document&&(La=document.documentMode);var yy=Ui&&"TextEvent"in window&&!La,l0=Ui&&(!lh||La&&8<La&&11>=La),Yp=String.fromCharCode(32),Kp=!1;function c0(t,e){switch(t){case"keyup":return _y.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function u0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var bs=!1;function Ey(t,e){switch(t){case"compositionend":return u0(e);case"keypress":return e.which!==32?null:(Kp=!0,Yp);case"textInput":return t=e.data,t===Yp&&Kp?null:t;default:return null}}function Sy(t,e){if(bs)return t==="compositionend"||!lh&&c0(t,e)?(t=o0(),yl=sh=cr=null,bs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return l0&&e.locale!=="ko"?null:e.data;default:return null}}var by={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Zp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!by[t.type]:e==="textarea"}function d0(t,e,n,i){Vg(i),e=Vl(e,"onChange"),0<e.length&&(n=new ah("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Ia=null,qa=null;function My(t){S0(t,0)}function yc(t){var e=Cs(t);if(Ig(e))return t}function wy(t,e){if(t==="change")return e}var f0=!1;if(Ui){var Jc;if(Ui){var Qc="oninput"in document;if(!Qc){var Jp=document.createElement("div");Jp.setAttribute("oninput","return;"),Qc=typeof Jp.oninput=="function"}Jc=Qc}else Jc=!1;f0=Jc&&(!document.documentMode||9<document.documentMode)}function Qp(){Ia&&(Ia.detachEvent("onpropertychange",h0),qa=Ia=null)}function h0(t){if(t.propertyName==="value"&&yc(qa)){var e=[];d0(e,qa,t,eh(t)),Xg(My,e)}}function Cy(t,e,n){t==="focusin"?(Qp(),Ia=e,qa=n,Ia.attachEvent("onpropertychange",h0)):t==="focusout"&&Qp()}function Ay(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return yc(qa)}function Ty(t,e){if(t==="click")return yc(e)}function Ny(t,e){if(t==="input"||t==="change")return yc(e)}function Ry(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var ii=typeof Object.is=="function"?Object.is:Ry;function Ya(t,e){if(ii(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!ed.call(e,r)||!ii(t[r],e[r]))return!1}return!0}function em(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function tm(t,e){var n=em(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=em(n)}}function p0(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?p0(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function m0(){for(var t=window,e=Il();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Il(t.document)}return e}function ch(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function Dy(t){var e=m0(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&p0(n.ownerDocument.documentElement,n)){if(i!==null&&ch(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=tm(n,s);var o=tm(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var Py=Ui&&"documentMode"in document&&11>=document.documentMode,Ms=null,_d=null,Ua=null,yd=!1;function nm(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;yd||Ms==null||Ms!==Il(i)||(i=Ms,"selectionStart"in i&&ch(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ua&&Ya(Ua,i)||(Ua=i,i=Vl(_d,"onSelect"),0<i.length&&(e=new ah("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=Ms)))}function Uo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ws={animationend:Uo("Animation","AnimationEnd"),animationiteration:Uo("Animation","AnimationIteration"),animationstart:Uo("Animation","AnimationStart"),transitionend:Uo("Transition","TransitionEnd")},eu={},x0={};Ui&&(x0=document.createElement("div").style,"AnimationEvent"in window||(delete ws.animationend.animation,delete ws.animationiteration.animation,delete ws.animationstart.animation),"TransitionEvent"in window||delete ws.transitionend.transition);function Ec(t){if(eu[t])return eu[t];if(!ws[t])return t;var e=ws[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in x0)return eu[t]=e[n];return t}var g0=Ec("animationend"),v0=Ec("animationiteration"),_0=Ec("animationstart"),y0=Ec("transitionend"),E0=new Map,im="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function wr(t,e){E0.set(t,e),es(e,[t])}for(var tu=0;tu<im.length;tu++){var nu=im[tu],Fy=nu.toLowerCase(),Ly=nu[0].toUpperCase()+nu.slice(1);wr(Fy,"on"+Ly)}wr(g0,"onAnimationEnd");wr(v0,"onAnimationIteration");wr(_0,"onAnimationStart");wr("dblclick","onDoubleClick");wr("focusin","onFocus");wr("focusout","onBlur");wr(y0,"onTransitionEnd");Vs("onMouseEnter",["mouseout","mouseover"]);Vs("onMouseLeave",["mouseout","mouseover"]);Vs("onPointerEnter",["pointerout","pointerover"]);Vs("onPointerLeave",["pointerout","pointerover"]);es("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));es("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));es("onBeforeInput",["compositionend","keypress","textInput","paste"]);es("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));es("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));es("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ta="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Iy=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ta));function rm(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,F1(i,e,void 0,t),t.currentTarget=null}function S0(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var l=i[o],c=l.instance,u=l.currentTarget;if(l=l.listener,c!==s&&r.isPropagationStopped())break e;rm(r,l,u),s=c}else for(o=0;o<i.length;o++){if(l=i[o],c=l.instance,u=l.currentTarget,l=l.listener,c!==s&&r.isPropagationStopped())break e;rm(r,l,u),s=c}}}if(kl)throw t=md,kl=!1,md=null,t}function xt(t,e){var n=e[wd];n===void 0&&(n=e[wd]=new Set);var i=t+"__bubble";n.has(i)||(b0(e,t,2,!1),n.add(i))}function iu(t,e,n){var i=0;e&&(i|=4),b0(n,t,i,e)}var ko="_reactListening"+Math.random().toString(36).slice(2);function Ka(t){if(!t[ko]){t[ko]=!0,Rg.forEach(function(n){n!=="selectionchange"&&(Iy.has(n)||iu(n,!1,t),iu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[ko]||(e[ko]=!0,iu("selectionchange",!1,e))}}function b0(t,e,n,i){switch(a0(e)){case 1:var r=Y1;break;case 4:r=K1;break;default:r=rh}n=r.bind(null,e,n,t),r=void 0,!pd||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function ru(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var l=i.stateNode.containerInfo;if(l===r||l.nodeType===8&&l.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var c=o.tag;if((c===3||c===4)&&(c=o.stateNode.containerInfo,c===r||c.nodeType===8&&c.parentNode===r))return;o=o.return}for(;l!==null;){if(o=Br(l),o===null)return;if(c=o.tag,c===5||c===6){i=s=o;continue e}l=l.parentNode}}i=i.return}Xg(function(){var u=s,d=eh(n),p=[];e:{var h=E0.get(t);if(h!==void 0){var m=ah,v=t;switch(t){case"keypress":if(El(n)===0)break e;case"keydown":case"keyup":m=dy;break;case"focusin":v="focus",m=Zc;break;case"focusout":v="blur",m=Zc;break;case"beforeblur":case"afterblur":m=Zc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=Xp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=Q1;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=py;break;case g0:case v0:case _0:m=ny;break;case y0:m=xy;break;case"scroll":m=Z1;break;case"wheel":m=vy;break;case"copy":case"cut":case"paste":m=ry;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=qp}var b=(e&4)!==0,x=!b&&t==="scroll",f=b?h!==null?h+"Capture":null:h;b=[];for(var g=u,w;g!==null;){w=g;var S=w.stateNode;if(w.tag===5&&S!==null&&(w=S,f!==null&&(S=Ha(g,f),S!=null&&b.push(Za(g,S,w)))),x)break;g=g.return}0<b.length&&(h=new m(h,v,null,n,d),p.push({event:h,listeners:b}))}}if(!(e&7)){e:{if(h=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",h&&n!==fd&&(v=n.relatedTarget||n.fromElement)&&(Br(v)||v[ki]))break e;if((m||h)&&(h=d.window===d?d:(h=d.ownerDocument)?h.defaultView||h.parentWindow:window,m?(v=n.relatedTarget||n.toElement,m=u,v=v?Br(v):null,v!==null&&(x=ts(v),v!==x||v.tag!==5&&v.tag!==6)&&(v=null)):(m=null,v=u),m!==v)){if(b=Xp,S="onMouseLeave",f="onMouseEnter",g="mouse",(t==="pointerout"||t==="pointerover")&&(b=qp,S="onPointerLeave",f="onPointerEnter",g="pointer"),x=m==null?h:Cs(m),w=v==null?h:Cs(v),h=new b(S,g+"leave",m,n,d),h.target=x,h.relatedTarget=w,S=null,Br(d)===u&&(b=new b(f,g+"enter",v,n,d),b.target=w,b.relatedTarget=x,S=b),x=S,m&&v)t:{for(b=m,f=v,g=0,w=b;w;w=as(w))g++;for(w=0,S=f;S;S=as(S))w++;for(;0<g-w;)b=as(b),g--;for(;0<w-g;)f=as(f),w--;for(;g--;){if(b===f||f!==null&&b===f.alternate)break t;b=as(b),f=as(f)}b=null}else b=null;m!==null&&sm(p,h,m,b,!1),v!==null&&x!==null&&sm(p,x,v,b,!0)}}e:{if(h=u?Cs(u):window,m=h.nodeName&&h.nodeName.toLowerCase(),m==="select"||m==="input"&&h.type==="file")var y=wy;else if(Zp(h))if(f0)y=Ny;else{y=Ay;var M=Cy}else(m=h.nodeName)&&m.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(y=Ty);if(y&&(y=y(t,u))){d0(p,y,n,d);break e}M&&M(t,h,u),t==="focusout"&&(M=h._wrapperState)&&M.controlled&&h.type==="number"&&od(h,"number",h.value)}switch(M=u?Cs(u):window,t){case"focusin":(Zp(M)||M.contentEditable==="true")&&(Ms=M,_d=u,Ua=null);break;case"focusout":Ua=_d=Ms=null;break;case"mousedown":yd=!0;break;case"contextmenu":case"mouseup":case"dragend":yd=!1,nm(p,n,d);break;case"selectionchange":if(Py)break;case"keydown":case"keyup":nm(p,n,d)}var A;if(lh)e:{switch(t){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else bs?c0(t,n)&&(_="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&(l0&&n.locale!=="ko"&&(bs||_!=="onCompositionStart"?_==="onCompositionEnd"&&bs&&(A=o0()):(cr=d,sh="value"in cr?cr.value:cr.textContent,bs=!0)),M=Vl(u,_),0<M.length&&(_=new $p(_,t,null,n,d),p.push({event:_,listeners:M}),A?_.data=A:(A=u0(n),A!==null&&(_.data=A)))),(A=yy?Ey(t,n):Sy(t,n))&&(u=Vl(u,"onBeforeInput"),0<u.length&&(d=new $p("onBeforeInput","beforeinput",null,n,d),p.push({event:d,listeners:u}),d.data=A))}S0(p,e)})}function Za(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Vl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Ha(t,n),s!=null&&i.unshift(Za(t,s,r)),s=Ha(t,e),s!=null&&i.push(Za(t,s,r))),t=t.return}return i}function as(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function sm(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var l=n,c=l.alternate,u=l.stateNode;if(c!==null&&c===i)break;l.tag===5&&u!==null&&(l=u,r?(c=Ha(n,s),c!=null&&o.unshift(Za(n,c,l))):r||(c=Ha(n,s),c!=null&&o.push(Za(n,c,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var Uy=/\r\n?/g,ky=/\u0000|\uFFFD/g;function am(t){return(typeof t=="string"?t:""+t).replace(Uy,`
`).replace(ky,"")}function Oo(t,e,n){if(e=am(e),am(t)!==e&&n)throw Error(ae(425))}function Gl(){}var Ed=null,Sd=null;function bd(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Md=typeof setTimeout=="function"?setTimeout:void 0,Oy=typeof clearTimeout=="function"?clearTimeout:void 0,om=typeof Promise=="function"?Promise:void 0,By=typeof queueMicrotask=="function"?queueMicrotask:typeof om<"u"?function(t){return om.resolve(null).then(t).catch(jy)}:Md;function jy(t){setTimeout(function(){throw t})}function su(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),$a(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);$a(e)}function mr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function lm(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var ea=Math.random().toString(36).slice(2),di="__reactFiber$"+ea,Ja="__reactProps$"+ea,ki="__reactContainer$"+ea,wd="__reactEvents$"+ea,zy="__reactListeners$"+ea,Vy="__reactHandles$"+ea;function Br(t){var e=t[di];if(e)return e;for(var n=t.parentNode;n;){if(e=n[ki]||n[di]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=lm(t);t!==null;){if(n=t[di])return n;t=lm(t)}return e}t=n,n=t.parentNode}return null}function Eo(t){return t=t[di]||t[ki],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Cs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ae(33))}function Sc(t){return t[Ja]||null}var Cd=[],As=-1;function Cr(t){return{current:t}}function gt(t){0>As||(t.current=Cd[As],Cd[As]=null,As--)}function pt(t,e){As++,Cd[As]=t.current,t.current=e}var br={},an=Cr(br),vn=Cr(!1),Xr=br;function Gs(t,e){var n=t.type.contextTypes;if(!n)return br;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function _n(t){return t=t.childContextTypes,t!=null}function Hl(){gt(vn),gt(an)}function cm(t,e,n){if(an.current!==br)throw Error(ae(168));pt(an,e),pt(vn,n)}function M0(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ae(108,C1(t)||"Unknown",r));return Mt({},n,i)}function Wl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||br,Xr=an.current,pt(an,t),pt(vn,vn.current),!0}function um(t,e,n){var i=t.stateNode;if(!i)throw Error(ae(169));n?(t=M0(t,e,Xr),i.__reactInternalMemoizedMergedChildContext=t,gt(vn),gt(an),pt(an,t)):gt(vn),pt(vn,n)}var Ti=null,bc=!1,au=!1;function w0(t){Ti===null?Ti=[t]:Ti.push(t)}function Gy(t){bc=!0,w0(t)}function Ar(){if(!au&&Ti!==null){au=!0;var t=0,e=ct;try{var n=Ti;for(ct=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}Ti=null,bc=!1}catch(r){throw Ti!==null&&(Ti=Ti.slice(t+1)),Kg(th,Ar),r}finally{ct=e,au=!1}}return null}var Ts=[],Ns=0,Xl=null,$l=0,On=[],Bn=0,$r=null,Ni=1,Ri="";function kr(t,e){Ts[Ns++]=$l,Ts[Ns++]=Xl,Xl=t,$l=e}function C0(t,e,n){On[Bn++]=Ni,On[Bn++]=Ri,On[Bn++]=$r,$r=t;var i=Ni;t=Ri;var r=32-ei(i)-1;i&=~(1<<r),n+=1;var s=32-ei(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Ni=1<<32-ei(e)+r|n<<r|i,Ri=s+t}else Ni=1<<s|n<<r|i,Ri=t}function uh(t){t.return!==null&&(kr(t,1),C0(t,1,0))}function dh(t){for(;t===Xl;)Xl=Ts[--Ns],Ts[Ns]=null,$l=Ts[--Ns],Ts[Ns]=null;for(;t===$r;)$r=On[--Bn],On[Bn]=null,Ri=On[--Bn],On[Bn]=null,Ni=On[--Bn],On[Bn]=null}var Rn=null,Tn=null,vt=!1,Zn=null;function A0(t,e){var n=jn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function dm(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Rn=t,Tn=mr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Rn=t,Tn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=$r!==null?{id:Ni,overflow:Ri}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=jn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Rn=t,Tn=null,!0):!1;default:return!1}}function Ad(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Td(t){if(vt){var e=Tn;if(e){var n=e;if(!dm(t,e)){if(Ad(t))throw Error(ae(418));e=mr(n.nextSibling);var i=Rn;e&&dm(t,e)?A0(i,n):(t.flags=t.flags&-4097|2,vt=!1,Rn=t)}}else{if(Ad(t))throw Error(ae(418));t.flags=t.flags&-4097|2,vt=!1,Rn=t}}}function fm(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Rn=t}function Bo(t){if(t!==Rn)return!1;if(!vt)return fm(t),vt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!bd(t.type,t.memoizedProps)),e&&(e=Tn)){if(Ad(t))throw T0(),Error(ae(418));for(;e;)A0(t,e),e=mr(e.nextSibling)}if(fm(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ae(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Tn=mr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Tn=null}}else Tn=Rn?mr(t.stateNode.nextSibling):null;return!0}function T0(){for(var t=Tn;t;)t=mr(t.nextSibling)}function Hs(){Tn=Rn=null,vt=!1}function fh(t){Zn===null?Zn=[t]:Zn.push(t)}var Hy=Vi.ReactCurrentBatchConfig;function fa(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ae(309));var i=n.stateNode}if(!i)throw Error(ae(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var l=r.refs;o===null?delete l[s]:l[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(ae(284));if(!n._owner)throw Error(ae(290,t))}return t}function jo(t,e){throw t=Object.prototype.toString.call(e),Error(ae(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function hm(t){var e=t._init;return e(t._payload)}function N0(t){function e(f,g){if(t){var w=f.deletions;w===null?(f.deletions=[g],f.flags|=16):w.push(g)}}function n(f,g){if(!t)return null;for(;g!==null;)e(f,g),g=g.sibling;return null}function i(f,g){for(f=new Map;g!==null;)g.key!==null?f.set(g.key,g):f.set(g.index,g),g=g.sibling;return f}function r(f,g){return f=_r(f,g),f.index=0,f.sibling=null,f}function s(f,g,w){return f.index=w,t?(w=f.alternate,w!==null?(w=w.index,w<g?(f.flags|=2,g):w):(f.flags|=2,g)):(f.flags|=1048576,g)}function o(f){return t&&f.alternate===null&&(f.flags|=2),f}function l(f,g,w,S){return g===null||g.tag!==6?(g=hu(w,f.mode,S),g.return=f,g):(g=r(g,w),g.return=f,g)}function c(f,g,w,S){var y=w.type;return y===Ss?d(f,g,w.props.children,S,w.key):g!==null&&(g.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===ir&&hm(y)===g.type)?(S=r(g,w.props),S.ref=fa(f,g,w),S.return=f,S):(S=Tl(w.type,w.key,w.props,null,f.mode,S),S.ref=fa(f,g,w),S.return=f,S)}function u(f,g,w,S){return g===null||g.tag!==4||g.stateNode.containerInfo!==w.containerInfo||g.stateNode.implementation!==w.implementation?(g=pu(w,f.mode,S),g.return=f,g):(g=r(g,w.children||[]),g.return=f,g)}function d(f,g,w,S,y){return g===null||g.tag!==7?(g=Wr(w,f.mode,S,y),g.return=f,g):(g=r(g,w),g.return=f,g)}function p(f,g,w){if(typeof g=="string"&&g!==""||typeof g=="number")return g=hu(""+g,f.mode,w),g.return=f,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case No:return w=Tl(g.type,g.key,g.props,null,f.mode,w),w.ref=fa(f,null,g),w.return=f,w;case Es:return g=pu(g,f.mode,w),g.return=f,g;case ir:var S=g._init;return p(f,S(g._payload),w)}if(Ca(g)||oa(g))return g=Wr(g,f.mode,w,null),g.return=f,g;jo(f,g)}return null}function h(f,g,w,S){var y=g!==null?g.key:null;if(typeof w=="string"&&w!==""||typeof w=="number")return y!==null?null:l(f,g,""+w,S);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case No:return w.key===y?c(f,g,w,S):null;case Es:return w.key===y?u(f,g,w,S):null;case ir:return y=w._init,h(f,g,y(w._payload),S)}if(Ca(w)||oa(w))return y!==null?null:d(f,g,w,S,null);jo(f,w)}return null}function m(f,g,w,S,y){if(typeof S=="string"&&S!==""||typeof S=="number")return f=f.get(w)||null,l(g,f,""+S,y);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case No:return f=f.get(S.key===null?w:S.key)||null,c(g,f,S,y);case Es:return f=f.get(S.key===null?w:S.key)||null,u(g,f,S,y);case ir:var M=S._init;return m(f,g,w,M(S._payload),y)}if(Ca(S)||oa(S))return f=f.get(w)||null,d(g,f,S,y,null);jo(g,S)}return null}function v(f,g,w,S){for(var y=null,M=null,A=g,_=g=0,T=null;A!==null&&_<w.length;_++){A.index>_?(T=A,A=null):T=A.sibling;var R=h(f,A,w[_],S);if(R===null){A===null&&(A=T);break}t&&A&&R.alternate===null&&e(f,A),g=s(R,g,_),M===null?y=R:M.sibling=R,M=R,A=T}if(_===w.length)return n(f,A),vt&&kr(f,_),y;if(A===null){for(;_<w.length;_++)A=p(f,w[_],S),A!==null&&(g=s(A,g,_),M===null?y=A:M.sibling=A,M=A);return vt&&kr(f,_),y}for(A=i(f,A);_<w.length;_++)T=m(A,f,_,w[_],S),T!==null&&(t&&T.alternate!==null&&A.delete(T.key===null?_:T.key),g=s(T,g,_),M===null?y=T:M.sibling=T,M=T);return t&&A.forEach(function(P){return e(f,P)}),vt&&kr(f,_),y}function b(f,g,w,S){var y=oa(w);if(typeof y!="function")throw Error(ae(150));if(w=y.call(w),w==null)throw Error(ae(151));for(var M=y=null,A=g,_=g=0,T=null,R=w.next();A!==null&&!R.done;_++,R=w.next()){A.index>_?(T=A,A=null):T=A.sibling;var P=h(f,A,R.value,S);if(P===null){A===null&&(A=T);break}t&&A&&P.alternate===null&&e(f,A),g=s(P,g,_),M===null?y=P:M.sibling=P,M=P,A=T}if(R.done)return n(f,A),vt&&kr(f,_),y;if(A===null){for(;!R.done;_++,R=w.next())R=p(f,R.value,S),R!==null&&(g=s(R,g,_),M===null?y=R:M.sibling=R,M=R);return vt&&kr(f,_),y}for(A=i(f,A);!R.done;_++,R=w.next())R=m(A,f,_,R.value,S),R!==null&&(t&&R.alternate!==null&&A.delete(R.key===null?_:R.key),g=s(R,g,_),M===null?y=R:M.sibling=R,M=R);return t&&A.forEach(function(D){return e(f,D)}),vt&&kr(f,_),y}function x(f,g,w,S){if(typeof w=="object"&&w!==null&&w.type===Ss&&w.key===null&&(w=w.props.children),typeof w=="object"&&w!==null){switch(w.$$typeof){case No:e:{for(var y=w.key,M=g;M!==null;){if(M.key===y){if(y=w.type,y===Ss){if(M.tag===7){n(f,M.sibling),g=r(M,w.props.children),g.return=f,f=g;break e}}else if(M.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===ir&&hm(y)===M.type){n(f,M.sibling),g=r(M,w.props),g.ref=fa(f,M,w),g.return=f,f=g;break e}n(f,M);break}else e(f,M);M=M.sibling}w.type===Ss?(g=Wr(w.props.children,f.mode,S,w.key),g.return=f,f=g):(S=Tl(w.type,w.key,w.props,null,f.mode,S),S.ref=fa(f,g,w),S.return=f,f=S)}return o(f);case Es:e:{for(M=w.key;g!==null;){if(g.key===M)if(g.tag===4&&g.stateNode.containerInfo===w.containerInfo&&g.stateNode.implementation===w.implementation){n(f,g.sibling),g=r(g,w.children||[]),g.return=f,f=g;break e}else{n(f,g);break}else e(f,g);g=g.sibling}g=pu(w,f.mode,S),g.return=f,f=g}return o(f);case ir:return M=w._init,x(f,g,M(w._payload),S)}if(Ca(w))return v(f,g,w,S);if(oa(w))return b(f,g,w,S);jo(f,w)}return typeof w=="string"&&w!==""||typeof w=="number"?(w=""+w,g!==null&&g.tag===6?(n(f,g.sibling),g=r(g,w),g.return=f,f=g):(n(f,g),g=hu(w,f.mode,S),g.return=f,f=g),o(f)):n(f,g)}return x}var Ws=N0(!0),R0=N0(!1),ql=Cr(null),Yl=null,Rs=null,hh=null;function ph(){hh=Rs=Yl=null}function mh(t){var e=ql.current;gt(ql),t._currentValue=e}function Nd(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Os(t,e){Yl=t,hh=Rs=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(gn=!0),t.firstContext=null)}function Vn(t){var e=t._currentValue;if(hh!==t)if(t={context:t,memoizedValue:e,next:null},Rs===null){if(Yl===null)throw Error(ae(308));Rs=t,Yl.dependencies={lanes:0,firstContext:t}}else Rs=Rs.next=t;return e}var jr=null;function xh(t){jr===null?jr=[t]:jr.push(t)}function D0(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,xh(e)):(n.next=r.next,r.next=n),e.interleaved=n,Oi(t,i)}function Oi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var rr=!1;function gh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function P0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Pi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function xr(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,nt&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Oi(t,n)}return r=i.interleaved,r===null?(e.next=e,xh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Oi(t,n)}function Sl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,nh(t,n)}}function pm(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Kl(t,e,n,i){var r=t.updateQueue;rr=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,l=r.shared.pending;if(l!==null){r.shared.pending=null;var c=l,u=c.next;c.next=null,o===null?s=u:o.next=u,o=c;var d=t.alternate;d!==null&&(d=d.updateQueue,l=d.lastBaseUpdate,l!==o&&(l===null?d.firstBaseUpdate=u:l.next=u,d.lastBaseUpdate=c))}if(s!==null){var p=r.baseState;o=0,d=u=c=null,l=s;do{var h=l.lane,m=l.eventTime;if((i&h)===h){d!==null&&(d=d.next={eventTime:m,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var v=t,b=l;switch(h=e,m=n,b.tag){case 1:if(v=b.payload,typeof v=="function"){p=v.call(m,p,h);break e}p=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=b.payload,h=typeof v=="function"?v.call(m,p,h):v,h==null)break e;p=Mt({},p,h);break e;case 2:rr=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,h=r.effects,h===null?r.effects=[l]:h.push(l))}else m={eventTime:m,lane:h,tag:l.tag,payload:l.payload,callback:l.callback,next:null},d===null?(u=d=m,c=p):d=d.next=m,o|=h;if(l=l.next,l===null){if(l=r.shared.pending,l===null)break;h=l,l=h.next,h.next=null,r.lastBaseUpdate=h,r.shared.pending=null}}while(1);if(d===null&&(c=p),r.baseState=c,r.firstBaseUpdate=u,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Yr|=o,t.lanes=o,t.memoizedState=p}}function mm(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ae(191,r));r.call(i)}}}var So={},xi=Cr(So),Qa=Cr(So),eo=Cr(So);function zr(t){if(t===So)throw Error(ae(174));return t}function vh(t,e){switch(pt(eo,e),pt(Qa,t),pt(xi,So),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:cd(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=cd(e,t)}gt(xi),pt(xi,e)}function Xs(){gt(xi),gt(Qa),gt(eo)}function F0(t){zr(eo.current);var e=zr(xi.current),n=cd(e,t.type);e!==n&&(pt(Qa,t),pt(xi,n))}function _h(t){Qa.current===t&&(gt(xi),gt(Qa))}var yt=Cr(0);function Zl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var ou=[];function yh(){for(var t=0;t<ou.length;t++)ou[t]._workInProgressVersionPrimary=null;ou.length=0}var bl=Vi.ReactCurrentDispatcher,lu=Vi.ReactCurrentBatchConfig,qr=0,St=null,kt=null,Gt=null,Jl=!1,ka=!1,to=0,Wy=0;function Qt(){throw Error(ae(321))}function Eh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!ii(t[n],e[n]))return!1;return!0}function Sh(t,e,n,i,r,s){if(qr=s,St=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,bl.current=t===null||t.memoizedState===null?Yy:Ky,t=n(i,r),ka){s=0;do{if(ka=!1,to=0,25<=s)throw Error(ae(301));s+=1,Gt=kt=null,e.updateQueue=null,bl.current=Zy,t=n(i,r)}while(ka)}if(bl.current=Ql,e=kt!==null&&kt.next!==null,qr=0,Gt=kt=St=null,Jl=!1,e)throw Error(ae(300));return t}function bh(){var t=to!==0;return to=0,t}function ci(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Gt===null?St.memoizedState=Gt=t:Gt=Gt.next=t,Gt}function Gn(){if(kt===null){var t=St.alternate;t=t!==null?t.memoizedState:null}else t=kt.next;var e=Gt===null?St.memoizedState:Gt.next;if(e!==null)Gt=e,kt=t;else{if(t===null)throw Error(ae(310));kt=t,t={memoizedState:kt.memoizedState,baseState:kt.baseState,baseQueue:kt.baseQueue,queue:kt.queue,next:null},Gt===null?St.memoizedState=Gt=t:Gt=Gt.next=t}return Gt}function no(t,e){return typeof e=="function"?e(t):e}function cu(t){var e=Gn(),n=e.queue;if(n===null)throw Error(ae(311));n.lastRenderedReducer=t;var i=kt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var l=o=null,c=null,u=s;do{var d=u.lane;if((qr&d)===d)c!==null&&(c=c.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:t(i,u.action);else{var p={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};c===null?(l=c=p,o=i):c=c.next=p,St.lanes|=d,Yr|=d}u=u.next}while(u!==null&&u!==s);c===null?o=i:c.next=l,ii(i,e.memoizedState)||(gn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=c,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,St.lanes|=s,Yr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function uu(t){var e=Gn(),n=e.queue;if(n===null)throw Error(ae(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);ii(s,e.memoizedState)||(gn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function L0(){}function I0(t,e){var n=St,i=Gn(),r=e(),s=!ii(i.memoizedState,r);if(s&&(i.memoizedState=r,gn=!0),i=i.queue,Mh(O0.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Gt!==null&&Gt.memoizedState.tag&1){if(n.flags|=2048,io(9,k0.bind(null,n,i,r,e),void 0,null),Ht===null)throw Error(ae(349));qr&30||U0(n,e,r)}return r}function U0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=St.updateQueue,e===null?(e={lastEffect:null,stores:null},St.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function k0(t,e,n,i){e.value=n,e.getSnapshot=i,B0(e)&&j0(t)}function O0(t,e,n){return n(function(){B0(e)&&j0(t)})}function B0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!ii(t,n)}catch{return!0}}function j0(t){var e=Oi(t,1);e!==null&&ti(e,t,1,-1)}function xm(t){var e=ci();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:no,lastRenderedState:t},e.queue=t,t=t.dispatch=qy.bind(null,St,t),[e.memoizedState,t]}function io(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=St.updateQueue,e===null?(e={lastEffect:null,stores:null},St.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function z0(){return Gn().memoizedState}function Ml(t,e,n,i){var r=ci();St.flags|=t,r.memoizedState=io(1|e,n,void 0,i===void 0?null:i)}function Mc(t,e,n,i){var r=Gn();i=i===void 0?null:i;var s=void 0;if(kt!==null){var o=kt.memoizedState;if(s=o.destroy,i!==null&&Eh(i,o.deps)){r.memoizedState=io(e,n,s,i);return}}St.flags|=t,r.memoizedState=io(1|e,n,s,i)}function gm(t,e){return Ml(8390656,8,t,e)}function Mh(t,e){return Mc(2048,8,t,e)}function V0(t,e){return Mc(4,2,t,e)}function G0(t,e){return Mc(4,4,t,e)}function H0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function W0(t,e,n){return n=n!=null?n.concat([t]):null,Mc(4,4,H0.bind(null,e,t),n)}function wh(){}function X0(t,e){var n=Gn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Eh(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function $0(t,e){var n=Gn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Eh(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function q0(t,e,n){return qr&21?(ii(n,e)||(n=Qg(),St.lanes|=n,Yr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,gn=!0),t.memoizedState=n)}function Xy(t,e){var n=ct;ct=n!==0&&4>n?n:4,t(!0);var i=lu.transition;lu.transition={};try{t(!1),e()}finally{ct=n,lu.transition=i}}function Y0(){return Gn().memoizedState}function $y(t,e,n){var i=vr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},K0(t))Z0(e,n);else if(n=D0(t,e,n,i),n!==null){var r=un();ti(n,t,i,r),J0(n,e,i)}}function qy(t,e,n){var i=vr(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(K0(t))Z0(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,l=s(o,n);if(r.hasEagerState=!0,r.eagerState=l,ii(l,o)){var c=e.interleaved;c===null?(r.next=r,xh(e)):(r.next=c.next,c.next=r),e.interleaved=r;return}}catch{}finally{}n=D0(t,e,r,i),n!==null&&(r=un(),ti(n,t,i,r),J0(n,e,i))}}function K0(t){var e=t.alternate;return t===St||e!==null&&e===St}function Z0(t,e){ka=Jl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function J0(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,nh(t,n)}}var Ql={readContext:Vn,useCallback:Qt,useContext:Qt,useEffect:Qt,useImperativeHandle:Qt,useInsertionEffect:Qt,useLayoutEffect:Qt,useMemo:Qt,useReducer:Qt,useRef:Qt,useState:Qt,useDebugValue:Qt,useDeferredValue:Qt,useTransition:Qt,useMutableSource:Qt,useSyncExternalStore:Qt,useId:Qt,unstable_isNewReconciler:!1},Yy={readContext:Vn,useCallback:function(t,e){return ci().memoizedState=[t,e===void 0?null:e],t},useContext:Vn,useEffect:gm,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Ml(4194308,4,H0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Ml(4194308,4,t,e)},useInsertionEffect:function(t,e){return Ml(4,2,t,e)},useMemo:function(t,e){var n=ci();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=ci();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=$y.bind(null,St,t),[i.memoizedState,t]},useRef:function(t){var e=ci();return t={current:t},e.memoizedState=t},useState:xm,useDebugValue:wh,useDeferredValue:function(t){return ci().memoizedState=t},useTransition:function(){var t=xm(!1),e=t[0];return t=Xy.bind(null,t[1]),ci().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=St,r=ci();if(vt){if(n===void 0)throw Error(ae(407));n=n()}else{if(n=e(),Ht===null)throw Error(ae(349));qr&30||U0(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,gm(O0.bind(null,i,s,t),[t]),i.flags|=2048,io(9,k0.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=ci(),e=Ht.identifierPrefix;if(vt){var n=Ri,i=Ni;n=(i&~(1<<32-ei(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=to++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Wy++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},Ky={readContext:Vn,useCallback:X0,useContext:Vn,useEffect:Mh,useImperativeHandle:W0,useInsertionEffect:V0,useLayoutEffect:G0,useMemo:$0,useReducer:cu,useRef:z0,useState:function(){return cu(no)},useDebugValue:wh,useDeferredValue:function(t){var e=Gn();return q0(e,kt.memoizedState,t)},useTransition:function(){var t=cu(no)[0],e=Gn().memoizedState;return[t,e]},useMutableSource:L0,useSyncExternalStore:I0,useId:Y0,unstable_isNewReconciler:!1},Zy={readContext:Vn,useCallback:X0,useContext:Vn,useEffect:Mh,useImperativeHandle:W0,useInsertionEffect:V0,useLayoutEffect:G0,useMemo:$0,useReducer:uu,useRef:z0,useState:function(){return uu(no)},useDebugValue:wh,useDeferredValue:function(t){var e=Gn();return kt===null?e.memoizedState=t:q0(e,kt.memoizedState,t)},useTransition:function(){var t=uu(no)[0],e=Gn().memoizedState;return[t,e]},useMutableSource:L0,useSyncExternalStore:I0,useId:Y0,unstable_isNewReconciler:!1};function Yn(t,e){if(t&&t.defaultProps){e=Mt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Rd(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:Mt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var wc={isMounted:function(t){return(t=t._reactInternals)?ts(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=un(),r=vr(t),s=Pi(i,r);s.payload=e,n!=null&&(s.callback=n),e=xr(t,s,r),e!==null&&(ti(e,t,r,i),Sl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=un(),r=vr(t),s=Pi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=xr(t,s,r),e!==null&&(ti(e,t,r,i),Sl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=un(),i=vr(t),r=Pi(n,i);r.tag=2,e!=null&&(r.callback=e),e=xr(t,r,i),e!==null&&(ti(e,t,i,n),Sl(e,t,i))}};function vm(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Ya(n,i)||!Ya(r,s):!0}function Q0(t,e,n){var i=!1,r=br,s=e.contextType;return typeof s=="object"&&s!==null?s=Vn(s):(r=_n(e)?Xr:an.current,i=e.contextTypes,s=(i=i!=null)?Gs(t,r):br),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=wc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function _m(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&wc.enqueueReplaceState(e,e.state,null)}function Dd(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},gh(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Vn(s):(s=_n(e)?Xr:an.current,r.context=Gs(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Rd(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&wc.enqueueReplaceState(r,r.state,null),Kl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function $s(t,e){try{var n="",i=e;do n+=w1(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function du(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Pd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Jy=typeof WeakMap=="function"?WeakMap:Map;function ev(t,e,n){n=Pi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){tc||(tc=!0,Vd=i),Pd(t,e)},n}function tv(t,e,n){n=Pi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){Pd(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Pd(t,e),typeof i!="function"&&(gr===null?gr=new Set([this]):gr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function ym(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Jy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=fE.bind(null,t,e,n),e.then(t,t))}function Em(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Sm(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Pi(-1,1),e.tag=2,xr(n,e,1))),n.lanes|=1),t)}var Qy=Vi.ReactCurrentOwner,gn=!1;function cn(t,e,n,i){e.child=t===null?R0(e,null,n,i):Ws(e,t.child,n,i)}function bm(t,e,n,i,r){n=n.render;var s=e.ref;return Os(e,r),i=Sh(t,e,n,i,s,r),n=bh(),t!==null&&!gn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Bi(t,e,r)):(vt&&n&&uh(e),e.flags|=1,cn(t,e,i,r),e.child)}function Mm(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Fh(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,nv(t,e,s,i,r)):(t=Tl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Ya,n(o,i)&&t.ref===e.ref)return Bi(t,e,r)}return e.flags|=1,t=_r(s,i),t.ref=e.ref,t.return=e,e.child=t}function nv(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Ya(s,i)&&t.ref===e.ref)if(gn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(gn=!0);else return e.lanes=t.lanes,Bi(t,e,r)}return Fd(t,e,n,i,r)}function iv(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},pt(Ps,Mn),Mn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,pt(Ps,Mn),Mn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,pt(Ps,Mn),Mn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,pt(Ps,Mn),Mn|=i;return cn(t,e,r,n),e.child}function rv(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Fd(t,e,n,i,r){var s=_n(n)?Xr:an.current;return s=Gs(e,s),Os(e,r),n=Sh(t,e,n,i,s,r),i=bh(),t!==null&&!gn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Bi(t,e,r)):(vt&&i&&uh(e),e.flags|=1,cn(t,e,n,r),e.child)}function wm(t,e,n,i,r){if(_n(n)){var s=!0;Wl(e)}else s=!1;if(Os(e,r),e.stateNode===null)wl(t,e),Q0(e,n,i),Dd(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var c=o.context,u=n.contextType;typeof u=="object"&&u!==null?u=Vn(u):(u=_n(n)?Xr:an.current,u=Gs(e,u));var d=n.getDerivedStateFromProps,p=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";p||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==i||c!==u)&&_m(e,o,i,u),rr=!1;var h=e.memoizedState;o.state=h,Kl(e,i,o,r),c=e.memoizedState,l!==i||h!==c||vn.current||rr?(typeof d=="function"&&(Rd(e,n,d,i),c=e.memoizedState),(l=rr||vm(e,n,l,i,h,c,u))?(p||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=c),o.props=i,o.state=c,o.context=u,i=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,P0(t,e),l=e.memoizedProps,u=e.type===e.elementType?l:Yn(e.type,l),o.props=u,p=e.pendingProps,h=o.context,c=n.contextType,typeof c=="object"&&c!==null?c=Vn(c):(c=_n(n)?Xr:an.current,c=Gs(e,c));var m=n.getDerivedStateFromProps;(d=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==p||h!==c)&&_m(e,o,i,c),rr=!1,h=e.memoizedState,o.state=h,Kl(e,i,o,r);var v=e.memoizedState;l!==p||h!==v||vn.current||rr?(typeof m=="function"&&(Rd(e,n,m,i),v=e.memoizedState),(u=rr||vm(e,n,u,i,h,v,c)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,v,c),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,v,c)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),o.props=i,o.state=v,o.context=c,i=u):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),i=!1)}return Ld(t,e,n,i,s,r)}function Ld(t,e,n,i,r,s){rv(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&um(e,n,!1),Bi(t,e,s);i=e.stateNode,Qy.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=Ws(e,t.child,null,s),e.child=Ws(e,null,l,s)):cn(t,e,l,s),e.memoizedState=i.state,r&&um(e,n,!0),e.child}function sv(t){var e=t.stateNode;e.pendingContext?cm(t,e.pendingContext,e.pendingContext!==e.context):e.context&&cm(t,e.context,!1),vh(t,e.containerInfo)}function Cm(t,e,n,i,r){return Hs(),fh(r),e.flags|=256,cn(t,e,n,i),e.child}var Id={dehydrated:null,treeContext:null,retryLane:0};function Ud(t){return{baseLanes:t,cachePool:null,transitions:null}}function av(t,e,n){var i=e.pendingProps,r=yt.current,s=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(r&2)!==0),l?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),pt(yt,r&1),t===null)return Td(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Tc(o,i,0,null),t=Wr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Ud(n),e.memoizedState=Id,t):Ch(e,o));if(r=t.memoizedState,r!==null&&(l=r.dehydrated,l!==null))return eE(t,e,o,i,l,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,l=r.sibling;var c={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=c,e.deletions=null):(i=_r(r,c),i.subtreeFlags=r.subtreeFlags&14680064),l!==null?s=_r(l,s):(s=Wr(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?Ud(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Id,i}return s=t.child,t=s.sibling,i=_r(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Ch(t,e){return e=Tc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function zo(t,e,n,i){return i!==null&&fh(i),Ws(e,t.child,null,n),t=Ch(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function eE(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=du(Error(ae(422))),zo(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Tc({mode:"visible",children:i.children},r,0,null),s=Wr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ws(e,t.child,null,o),e.child.memoizedState=Ud(o),e.memoizedState=Id,s);if(!(e.mode&1))return zo(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var l=i.dgst;return i=l,s=Error(ae(419)),i=du(s,i,void 0),zo(t,e,o,i)}if(l=(o&t.childLanes)!==0,gn||l){if(i=Ht,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Oi(t,r),ti(i,t,r,-1))}return Ph(),i=du(Error(ae(421))),zo(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=hE.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Tn=mr(r.nextSibling),Rn=e,vt=!0,Zn=null,t!==null&&(On[Bn++]=Ni,On[Bn++]=Ri,On[Bn++]=$r,Ni=t.id,Ri=t.overflow,$r=e),e=Ch(e,i.children),e.flags|=4096,e)}function Am(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Nd(t.return,e,n)}function fu(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function ov(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(cn(t,e,i.children,n),i=yt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Am(t,n,e);else if(t.tag===19)Am(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(pt(yt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Zl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),fu(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Zl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}fu(e,!0,n,null,s);break;case"together":fu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function wl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Bi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Yr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ae(153));if(e.child!==null){for(t=e.child,n=_r(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=_r(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function tE(t,e,n){switch(e.tag){case 3:sv(e),Hs();break;case 5:F0(e);break;case 1:_n(e.type)&&Wl(e);break;case 4:vh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;pt(ql,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(pt(yt,yt.current&1),e.flags|=128,null):n&e.child.childLanes?av(t,e,n):(pt(yt,yt.current&1),t=Bi(t,e,n),t!==null?t.sibling:null);pt(yt,yt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return ov(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),pt(yt,yt.current),i)break;return null;case 22:case 23:return e.lanes=0,iv(t,e,n)}return Bi(t,e,n)}var lv,kd,cv,uv;lv=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};kd=function(){};cv=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,zr(xi.current);var s=null;switch(n){case"input":r=sd(t,r),i=sd(t,i),s=[];break;case"select":r=Mt({},r,{value:void 0}),i=Mt({},i,{value:void 0}),s=[];break;case"textarea":r=ld(t,r),i=ld(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Gl)}ud(n,i);var o;n=null;for(u in r)if(!i.hasOwnProperty(u)&&r.hasOwnProperty(u)&&r[u]!=null)if(u==="style"){var l=r[u];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Va.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in i){var c=i[u];if(l=r!=null?r[u]:void 0,i.hasOwnProperty(u)&&c!==l&&(c!=null||l!=null))if(u==="style")if(l){for(o in l)!l.hasOwnProperty(o)||c&&c.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in c)c.hasOwnProperty(o)&&l[o]!==c[o]&&(n||(n={}),n[o]=c[o])}else n||(s||(s=[]),s.push(u,n)),n=c;else u==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,l=l?l.__html:void 0,c!=null&&l!==c&&(s=s||[]).push(u,c)):u==="children"?typeof c!="string"&&typeof c!="number"||(s=s||[]).push(u,""+c):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Va.hasOwnProperty(u)?(c!=null&&u==="onScroll"&&xt("scroll",t),s||l===c||(s=[])):(s=s||[]).push(u,c))}n&&(s=s||[]).push("style",n);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};uv=function(t,e,n,i){n!==i&&(e.flags|=4)};function ha(t,e){if(!vt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function en(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function nE(t,e,n){var i=e.pendingProps;switch(dh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return en(e),null;case 1:return _n(e.type)&&Hl(),en(e),null;case 3:return i=e.stateNode,Xs(),gt(vn),gt(an),yh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Bo(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Zn!==null&&(Wd(Zn),Zn=null))),kd(t,e),en(e),null;case 5:_h(e);var r=zr(eo.current);if(n=e.type,t!==null&&e.stateNode!=null)cv(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ae(166));return en(e),null}if(t=zr(xi.current),Bo(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[di]=e,i[Ja]=s,t=(e.mode&1)!==0,n){case"dialog":xt("cancel",i),xt("close",i);break;case"iframe":case"object":case"embed":xt("load",i);break;case"video":case"audio":for(r=0;r<Ta.length;r++)xt(Ta[r],i);break;case"source":xt("error",i);break;case"img":case"image":case"link":xt("error",i),xt("load",i);break;case"details":xt("toggle",i);break;case"input":Up(i,s),xt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},xt("invalid",i);break;case"textarea":Op(i,s),xt("invalid",i)}ud(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var l=s[o];o==="children"?typeof l=="string"?i.textContent!==l&&(s.suppressHydrationWarning!==!0&&Oo(i.textContent,l,t),r=["children",l]):typeof l=="number"&&i.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&Oo(i.textContent,l,t),r=["children",""+l]):Va.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&xt("scroll",i)}switch(n){case"input":Ro(i),kp(i,s,!0);break;case"textarea":Ro(i),Bp(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Gl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Og(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[di]=e,t[Ja]=i,lv(t,e,!1,!1),e.stateNode=t;e:{switch(o=dd(n,i),n){case"dialog":xt("cancel",t),xt("close",t),r=i;break;case"iframe":case"object":case"embed":xt("load",t),r=i;break;case"video":case"audio":for(r=0;r<Ta.length;r++)xt(Ta[r],t);r=i;break;case"source":xt("error",t),r=i;break;case"img":case"image":case"link":xt("error",t),xt("load",t),r=i;break;case"details":xt("toggle",t),r=i;break;case"input":Up(t,i),r=sd(t,i),xt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=Mt({},i,{value:void 0}),xt("invalid",t);break;case"textarea":Op(t,i),r=ld(t,i),xt("invalid",t);break;default:r=i}ud(n,r),l=r;for(s in l)if(l.hasOwnProperty(s)){var c=l[s];s==="style"?zg(t,c):s==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&Bg(t,c)):s==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&Ga(t,c):typeof c=="number"&&Ga(t,""+c):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Va.hasOwnProperty(s)?c!=null&&s==="onScroll"&&xt("scroll",t):c!=null&&Kf(t,s,c,o))}switch(n){case"input":Ro(t),kp(t,i,!1);break;case"textarea":Ro(t),Bp(t);break;case"option":i.value!=null&&t.setAttribute("value",""+Sr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Ls(t,!!i.multiple,s,!1):i.defaultValue!=null&&Ls(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Gl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return en(e),null;case 6:if(t&&e.stateNode!=null)uv(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ae(166));if(n=zr(eo.current),zr(xi.current),Bo(e)){if(i=e.stateNode,n=e.memoizedProps,i[di]=e,(s=i.nodeValue!==n)&&(t=Rn,t!==null))switch(t.tag){case 3:Oo(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Oo(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[di]=e,e.stateNode=i}return en(e),null;case 13:if(gt(yt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(vt&&Tn!==null&&e.mode&1&&!(e.flags&128))T0(),Hs(),e.flags|=98560,s=!1;else if(s=Bo(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ae(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ae(317));s[di]=e}else Hs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;en(e),s=!1}else Zn!==null&&(Wd(Zn),Zn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||yt.current&1?Bt===0&&(Bt=3):Ph())),e.updateQueue!==null&&(e.flags|=4),en(e),null);case 4:return Xs(),kd(t,e),t===null&&Ka(e.stateNode.containerInfo),en(e),null;case 10:return mh(e.type._context),en(e),null;case 17:return _n(e.type)&&Hl(),en(e),null;case 19:if(gt(yt),s=e.memoizedState,s===null)return en(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)ha(s,!1);else{if(Bt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Zl(t),o!==null){for(e.flags|=128,ha(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return pt(yt,yt.current&1|2),e.child}t=t.sibling}s.tail!==null&&At()>qs&&(e.flags|=128,i=!0,ha(s,!1),e.lanes=4194304)}else{if(!i)if(t=Zl(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),ha(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!vt)return en(e),null}else 2*At()-s.renderingStartTime>qs&&n!==1073741824&&(e.flags|=128,i=!0,ha(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=At(),e.sibling=null,n=yt.current,pt(yt,i?n&1|2:n&1),e):(en(e),null);case 22:case 23:return Dh(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Mn&1073741824&&(en(e),e.subtreeFlags&6&&(e.flags|=8192)):en(e),null;case 24:return null;case 25:return null}throw Error(ae(156,e.tag))}function iE(t,e){switch(dh(e),e.tag){case 1:return _n(e.type)&&Hl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Xs(),gt(vn),gt(an),yh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return _h(e),null;case 13:if(gt(yt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ae(340));Hs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return gt(yt),null;case 4:return Xs(),null;case 10:return mh(e.type._context),null;case 22:case 23:return Dh(),null;case 24:return null;default:return null}}var Vo=!1,rn=!1,rE=typeof WeakSet=="function"?WeakSet:Set,be=null;function Ds(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){wt(t,e,i)}else n.current=null}function Od(t,e,n){try{n()}catch(i){wt(t,e,i)}}var Tm=!1;function sE(t,e){if(Ed=jl,t=m0(),ch(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,l=-1,c=-1,u=0,d=0,p=t,h=null;t:for(;;){for(var m;p!==n||r!==0&&p.nodeType!==3||(l=o+r),p!==s||i!==0&&p.nodeType!==3||(c=o+i),p.nodeType===3&&(o+=p.nodeValue.length),(m=p.firstChild)!==null;)h=p,p=m;for(;;){if(p===t)break t;if(h===n&&++u===r&&(l=o),h===s&&++d===i&&(c=o),(m=p.nextSibling)!==null)break;p=h,h=p.parentNode}p=m}n=l===-1||c===-1?null:{start:l,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(Sd={focusedElem:t,selectionRange:n},jl=!1,be=e;be!==null;)if(e=be,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,be=t;else for(;be!==null;){e=be;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var b=v.memoizedProps,x=v.memoizedState,f=e.stateNode,g=f.getSnapshotBeforeUpdate(e.elementType===e.type?b:Yn(e.type,b),x);f.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var w=e.stateNode.containerInfo;w.nodeType===1?w.textContent="":w.nodeType===9&&w.documentElement&&w.removeChild(w.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ae(163))}}catch(S){wt(e,e.return,S)}if(t=e.sibling,t!==null){t.return=e.return,be=t;break}be=e.return}return v=Tm,Tm=!1,v}function Oa(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Od(e,n,s)}r=r.next}while(r!==i)}}function Cc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Bd(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function dv(t){var e=t.alternate;e!==null&&(t.alternate=null,dv(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[di],delete e[Ja],delete e[wd],delete e[zy],delete e[Vy])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function fv(t){return t.tag===5||t.tag===3||t.tag===4}function Nm(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||fv(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function jd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Gl));else if(i!==4&&(t=t.child,t!==null))for(jd(t,e,n),t=t.sibling;t!==null;)jd(t,e,n),t=t.sibling}function zd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(zd(t,e,n),t=t.sibling;t!==null;)zd(t,e,n),t=t.sibling}var Wt=null,Kn=!1;function qi(t,e,n){for(n=n.child;n!==null;)hv(t,e,n),n=n.sibling}function hv(t,e,n){if(mi&&typeof mi.onCommitFiberUnmount=="function")try{mi.onCommitFiberUnmount(vc,n)}catch{}switch(n.tag){case 5:rn||Ds(n,e);case 6:var i=Wt,r=Kn;Wt=null,qi(t,e,n),Wt=i,Kn=r,Wt!==null&&(Kn?(t=Wt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Wt.removeChild(n.stateNode));break;case 18:Wt!==null&&(Kn?(t=Wt,n=n.stateNode,t.nodeType===8?su(t.parentNode,n):t.nodeType===1&&su(t,n),$a(t)):su(Wt,n.stateNode));break;case 4:i=Wt,r=Kn,Wt=n.stateNode.containerInfo,Kn=!0,qi(t,e,n),Wt=i,Kn=r;break;case 0:case 11:case 14:case 15:if(!rn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Od(n,e,o),r=r.next}while(r!==i)}qi(t,e,n);break;case 1:if(!rn&&(Ds(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(l){wt(n,e,l)}qi(t,e,n);break;case 21:qi(t,e,n);break;case 22:n.mode&1?(rn=(i=rn)||n.memoizedState!==null,qi(t,e,n),rn=i):qi(t,e,n);break;default:qi(t,e,n)}}function Rm(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new rE),e.forEach(function(i){var r=pE.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Wn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:Wt=l.stateNode,Kn=!1;break e;case 3:Wt=l.stateNode.containerInfo,Kn=!0;break e;case 4:Wt=l.stateNode.containerInfo,Kn=!0;break e}l=l.return}if(Wt===null)throw Error(ae(160));hv(s,o,r),Wt=null,Kn=!1;var c=r.alternate;c!==null&&(c.return=null),r.return=null}catch(u){wt(r,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)pv(e,t),e=e.sibling}function pv(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Wn(e,t),ai(t),i&4){try{Oa(3,t,t.return),Cc(3,t)}catch(b){wt(t,t.return,b)}try{Oa(5,t,t.return)}catch(b){wt(t,t.return,b)}}break;case 1:Wn(e,t),ai(t),i&512&&n!==null&&Ds(n,n.return);break;case 5:if(Wn(e,t),ai(t),i&512&&n!==null&&Ds(n,n.return),t.flags&32){var r=t.stateNode;try{Ga(r,"")}catch(b){wt(t,t.return,b)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,l=t.type,c=t.updateQueue;if(t.updateQueue=null,c!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&Ug(r,s),dd(l,o);var u=dd(l,s);for(o=0;o<c.length;o+=2){var d=c[o],p=c[o+1];d==="style"?zg(r,p):d==="dangerouslySetInnerHTML"?Bg(r,p):d==="children"?Ga(r,p):Kf(r,d,p,u)}switch(l){case"input":ad(r,s);break;case"textarea":kg(r,s);break;case"select":var h=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var m=s.value;m!=null?Ls(r,!!s.multiple,m,!1):h!==!!s.multiple&&(s.defaultValue!=null?Ls(r,!!s.multiple,s.defaultValue,!0):Ls(r,!!s.multiple,s.multiple?[]:"",!1))}r[Ja]=s}catch(b){wt(t,t.return,b)}}break;case 6:if(Wn(e,t),ai(t),i&4){if(t.stateNode===null)throw Error(ae(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(b){wt(t,t.return,b)}}break;case 3:if(Wn(e,t),ai(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{$a(e.containerInfo)}catch(b){wt(t,t.return,b)}break;case 4:Wn(e,t),ai(t);break;case 13:Wn(e,t),ai(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Nh=At())),i&4&&Rm(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(rn=(u=rn)||d,Wn(e,t),rn=u):Wn(e,t),ai(t),i&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!d&&t.mode&1)for(be=t,d=t.child;d!==null;){for(p=be=d;be!==null;){switch(h=be,m=h.child,h.tag){case 0:case 11:case 14:case 15:Oa(4,h,h.return);break;case 1:Ds(h,h.return);var v=h.stateNode;if(typeof v.componentWillUnmount=="function"){i=h,n=h.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(b){wt(i,n,b)}}break;case 5:Ds(h,h.return);break;case 22:if(h.memoizedState!==null){Pm(p);continue}}m!==null?(m.return=h,be=m):Pm(p)}d=d.sibling}e:for(d=null,p=t;;){if(p.tag===5){if(d===null){d=p;try{r=p.stateNode,u?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=p.stateNode,c=p.memoizedProps.style,o=c!=null&&c.hasOwnProperty("display")?c.display:null,l.style.display=jg("display",o))}catch(b){wt(t,t.return,b)}}}else if(p.tag===6){if(d===null)try{p.stateNode.nodeValue=u?"":p.memoizedProps}catch(b){wt(t,t.return,b)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===t)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===t)break e;for(;p.sibling===null;){if(p.return===null||p.return===t)break e;d===p&&(d=null),p=p.return}d===p&&(d=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Wn(e,t),ai(t),i&4&&Rm(t);break;case 21:break;default:Wn(e,t),ai(t)}}function ai(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(fv(n)){var i=n;break e}n=n.return}throw Error(ae(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Ga(r,""),i.flags&=-33);var s=Nm(t);zd(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,l=Nm(t);jd(t,l,o);break;default:throw Error(ae(161))}}catch(c){wt(t,t.return,c)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function aE(t,e,n){be=t,mv(t)}function mv(t,e,n){for(var i=(t.mode&1)!==0;be!==null;){var r=be,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||Vo;if(!o){var l=r.alternate,c=l!==null&&l.memoizedState!==null||rn;l=Vo;var u=rn;if(Vo=o,(rn=c)&&!u)for(be=r;be!==null;)o=be,c=o.child,o.tag===22&&o.memoizedState!==null?Fm(r):c!==null?(c.return=o,be=c):Fm(r);for(;s!==null;)be=s,mv(s),s=s.sibling;be=r,Vo=l,rn=u}Dm(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,be=s):Dm(t)}}function Dm(t){for(;be!==null;){var e=be;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:rn||Cc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!rn)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Yn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&mm(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}mm(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var c=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var p=d.dehydrated;p!==null&&$a(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ae(163))}rn||e.flags&512&&Bd(e)}catch(h){wt(e,e.return,h)}}if(e===t){be=null;break}if(n=e.sibling,n!==null){n.return=e.return,be=n;break}be=e.return}}function Pm(t){for(;be!==null;){var e=be;if(e===t){be=null;break}var n=e.sibling;if(n!==null){n.return=e.return,be=n;break}be=e.return}}function Fm(t){for(;be!==null;){var e=be;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Cc(4,e)}catch(c){wt(e,n,c)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(c){wt(e,r,c)}}var s=e.return;try{Bd(e)}catch(c){wt(e,s,c)}break;case 5:var o=e.return;try{Bd(e)}catch(c){wt(e,o,c)}}}catch(c){wt(e,e.return,c)}if(e===t){be=null;break}var l=e.sibling;if(l!==null){l.return=e.return,be=l;break}be=e.return}}var oE=Math.ceil,ec=Vi.ReactCurrentDispatcher,Ah=Vi.ReactCurrentOwner,zn=Vi.ReactCurrentBatchConfig,nt=0,Ht=null,It=null,qt=0,Mn=0,Ps=Cr(0),Bt=0,ro=null,Yr=0,Ac=0,Th=0,Ba=null,xn=null,Nh=0,qs=1/0,Ai=null,tc=!1,Vd=null,gr=null,Go=!1,ur=null,nc=0,ja=0,Gd=null,Cl=-1,Al=0;function un(){return nt&6?At():Cl!==-1?Cl:Cl=At()}function vr(t){return t.mode&1?nt&2&&qt!==0?qt&-qt:Hy.transition!==null?(Al===0&&(Al=Qg()),Al):(t=ct,t!==0||(t=window.event,t=t===void 0?16:a0(t.type)),t):1}function ti(t,e,n,i){if(50<ja)throw ja=0,Gd=null,Error(ae(185));_o(t,n,i),(!(nt&2)||t!==Ht)&&(t===Ht&&(!(nt&2)&&(Ac|=n),Bt===4&&or(t,qt)),yn(t,i),n===1&&nt===0&&!(e.mode&1)&&(qs=At()+500,bc&&Ar()))}function yn(t,e){var n=t.callbackNode;H1(t,e);var i=Bl(t,t===Ht?qt:0);if(i===0)n!==null&&Vp(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Vp(n),e===1)t.tag===0?Gy(Lm.bind(null,t)):w0(Lm.bind(null,t)),By(function(){!(nt&6)&&Ar()}),n=null;else{switch(e0(i)){case 1:n=th;break;case 4:n=Zg;break;case 16:n=Ol;break;case 536870912:n=Jg;break;default:n=Ol}n=bv(n,xv.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function xv(t,e){if(Cl=-1,Al=0,nt&6)throw Error(ae(327));var n=t.callbackNode;if(Bs()&&t.callbackNode!==n)return null;var i=Bl(t,t===Ht?qt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=ic(t,i);else{e=i;var r=nt;nt|=2;var s=vv();(Ht!==t||qt!==e)&&(Ai=null,qs=At()+500,Hr(t,e));do try{uE();break}catch(l){gv(t,l)}while(1);ph(),ec.current=s,nt=r,It!==null?e=0:(Ht=null,qt=0,e=Bt)}if(e!==0){if(e===2&&(r=xd(t),r!==0&&(i=r,e=Hd(t,r))),e===1)throw n=ro,Hr(t,0),or(t,i),yn(t,At()),n;if(e===6)or(t,i);else{if(r=t.current.alternate,!(i&30)&&!lE(r)&&(e=ic(t,i),e===2&&(s=xd(t),s!==0&&(i=s,e=Hd(t,s))),e===1))throw n=ro,Hr(t,0),or(t,i),yn(t,At()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ae(345));case 2:Or(t,xn,Ai);break;case 3:if(or(t,i),(i&130023424)===i&&(e=Nh+500-At(),10<e)){if(Bl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){un(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Md(Or.bind(null,t,xn,Ai),e);break}Or(t,xn,Ai);break;case 4:if(or(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-ei(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=At()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*oE(i/1960))-i,10<i){t.timeoutHandle=Md(Or.bind(null,t,xn,Ai),i);break}Or(t,xn,Ai);break;case 5:Or(t,xn,Ai);break;default:throw Error(ae(329))}}}return yn(t,At()),t.callbackNode===n?xv.bind(null,t):null}function Hd(t,e){var n=Ba;return t.current.memoizedState.isDehydrated&&(Hr(t,e).flags|=256),t=ic(t,e),t!==2&&(e=xn,xn=n,e!==null&&Wd(e)),t}function Wd(t){xn===null?xn=t:xn.push.apply(xn,t)}function lE(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!ii(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function or(t,e){for(e&=~Th,e&=~Ac,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ei(e),i=1<<n;t[n]=-1,e&=~i}}function Lm(t){if(nt&6)throw Error(ae(327));Bs();var e=Bl(t,0);if(!(e&1))return yn(t,At()),null;var n=ic(t,e);if(t.tag!==0&&n===2){var i=xd(t);i!==0&&(e=i,n=Hd(t,i))}if(n===1)throw n=ro,Hr(t,0),or(t,e),yn(t,At()),n;if(n===6)throw Error(ae(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Or(t,xn,Ai),yn(t,At()),null}function Rh(t,e){var n=nt;nt|=1;try{return t(e)}finally{nt=n,nt===0&&(qs=At()+500,bc&&Ar())}}function Kr(t){ur!==null&&ur.tag===0&&!(nt&6)&&Bs();var e=nt;nt|=1;var n=zn.transition,i=ct;try{if(zn.transition=null,ct=1,t)return t()}finally{ct=i,zn.transition=n,nt=e,!(nt&6)&&Ar()}}function Dh(){Mn=Ps.current,gt(Ps)}function Hr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,Oy(n)),It!==null)for(n=It.return;n!==null;){var i=n;switch(dh(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Hl();break;case 3:Xs(),gt(vn),gt(an),yh();break;case 5:_h(i);break;case 4:Xs();break;case 13:gt(yt);break;case 19:gt(yt);break;case 10:mh(i.type._context);break;case 22:case 23:Dh()}n=n.return}if(Ht=t,It=t=_r(t.current,null),qt=Mn=e,Bt=0,ro=null,Th=Ac=Yr=0,xn=Ba=null,jr!==null){for(e=0;e<jr.length;e++)if(n=jr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}jr=null}return t}function gv(t,e){do{var n=It;try{if(ph(),bl.current=Ql,Jl){for(var i=St.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Jl=!1}if(qr=0,Gt=kt=St=null,ka=!1,to=0,Ah.current=null,n===null||n.return===null){Bt=1,ro=e,It=null;break}e:{var s=t,o=n.return,l=n,c=e;if(e=qt,l.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var u=c,d=l,p=d.tag;if(!(d.mode&1)&&(p===0||p===11||p===15)){var h=d.alternate;h?(d.updateQueue=h.updateQueue,d.memoizedState=h.memoizedState,d.lanes=h.lanes):(d.updateQueue=null,d.memoizedState=null)}var m=Em(o);if(m!==null){m.flags&=-257,Sm(m,o,l,s,e),m.mode&1&&ym(s,u,e),e=m,c=u;var v=e.updateQueue;if(v===null){var b=new Set;b.add(c),e.updateQueue=b}else v.add(c);break e}else{if(!(e&1)){ym(s,u,e),Ph();break e}c=Error(ae(426))}}else if(vt&&l.mode&1){var x=Em(o);if(x!==null){!(x.flags&65536)&&(x.flags|=256),Sm(x,o,l,s,e),fh($s(c,l));break e}}s=c=$s(c,l),Bt!==4&&(Bt=2),Ba===null?Ba=[s]:Ba.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var f=ev(s,c,e);pm(s,f);break e;case 1:l=c;var g=s.type,w=s.stateNode;if(!(s.flags&128)&&(typeof g.getDerivedStateFromError=="function"||w!==null&&typeof w.componentDidCatch=="function"&&(gr===null||!gr.has(w)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=tv(s,l,e);pm(s,S);break e}}s=s.return}while(s!==null)}yv(n)}catch(y){e=y,It===n&&n!==null&&(It=n=n.return);continue}break}while(1)}function vv(){var t=ec.current;return ec.current=Ql,t===null?Ql:t}function Ph(){(Bt===0||Bt===3||Bt===2)&&(Bt=4),Ht===null||!(Yr&268435455)&&!(Ac&268435455)||or(Ht,qt)}function ic(t,e){var n=nt;nt|=2;var i=vv();(Ht!==t||qt!==e)&&(Ai=null,Hr(t,e));do try{cE();break}catch(r){gv(t,r)}while(1);if(ph(),nt=n,ec.current=i,It!==null)throw Error(ae(261));return Ht=null,qt=0,Bt}function cE(){for(;It!==null;)_v(It)}function uE(){for(;It!==null&&!I1();)_v(It)}function _v(t){var e=Sv(t.alternate,t,Mn);t.memoizedProps=t.pendingProps,e===null?yv(t):It=e,Ah.current=null}function yv(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=iE(n,e),n!==null){n.flags&=32767,It=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Bt=6,It=null;return}}else if(n=nE(n,e,Mn),n!==null){It=n;return}if(e=e.sibling,e!==null){It=e;return}It=e=t}while(e!==null);Bt===0&&(Bt=5)}function Or(t,e,n){var i=ct,r=zn.transition;try{zn.transition=null,ct=1,dE(t,e,n,i)}finally{zn.transition=r,ct=i}return null}function dE(t,e,n,i){do Bs();while(ur!==null);if(nt&6)throw Error(ae(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ae(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(W1(t,s),t===Ht&&(It=Ht=null,qt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Go||(Go=!0,bv(Ol,function(){return Bs(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=zn.transition,zn.transition=null;var o=ct;ct=1;var l=nt;nt|=4,Ah.current=null,sE(t,n),pv(n,t),Dy(Sd),jl=!!Ed,Sd=Ed=null,t.current=n,aE(n),U1(),nt=l,ct=o,zn.transition=s}else t.current=n;if(Go&&(Go=!1,ur=t,nc=r),s=t.pendingLanes,s===0&&(gr=null),B1(n.stateNode),yn(t,At()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(tc)throw tc=!1,t=Vd,Vd=null,t;return nc&1&&t.tag!==0&&Bs(),s=t.pendingLanes,s&1?t===Gd?ja++:(ja=0,Gd=t):ja=0,Ar(),null}function Bs(){if(ur!==null){var t=e0(nc),e=zn.transition,n=ct;try{if(zn.transition=null,ct=16>t?16:t,ur===null)var i=!1;else{if(t=ur,ur=null,nc=0,nt&6)throw Error(ae(331));var r=nt;for(nt|=4,be=t.current;be!==null;){var s=be,o=s.child;if(be.flags&16){var l=s.deletions;if(l!==null){for(var c=0;c<l.length;c++){var u=l[c];for(be=u;be!==null;){var d=be;switch(d.tag){case 0:case 11:case 15:Oa(8,d,s)}var p=d.child;if(p!==null)p.return=d,be=p;else for(;be!==null;){d=be;var h=d.sibling,m=d.return;if(dv(d),d===u){be=null;break}if(h!==null){h.return=m,be=h;break}be=m}}}var v=s.alternate;if(v!==null){var b=v.child;if(b!==null){v.child=null;do{var x=b.sibling;b.sibling=null,b=x}while(b!==null)}}be=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,be=o;else e:for(;be!==null;){if(s=be,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Oa(9,s,s.return)}var f=s.sibling;if(f!==null){f.return=s.return,be=f;break e}be=s.return}}var g=t.current;for(be=g;be!==null;){o=be;var w=o.child;if(o.subtreeFlags&2064&&w!==null)w.return=o,be=w;else e:for(o=g;be!==null;){if(l=be,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:Cc(9,l)}}catch(y){wt(l,l.return,y)}if(l===o){be=null;break e}var S=l.sibling;if(S!==null){S.return=l.return,be=S;break e}be=l.return}}if(nt=r,Ar(),mi&&typeof mi.onPostCommitFiberRoot=="function")try{mi.onPostCommitFiberRoot(vc,t)}catch{}i=!0}return i}finally{ct=n,zn.transition=e}}return!1}function Im(t,e,n){e=$s(n,e),e=ev(t,e,1),t=xr(t,e,1),e=un(),t!==null&&(_o(t,1,e),yn(t,e))}function wt(t,e,n){if(t.tag===3)Im(t,t,n);else for(;e!==null;){if(e.tag===3){Im(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(gr===null||!gr.has(i))){t=$s(n,t),t=tv(e,t,1),e=xr(e,t,1),t=un(),e!==null&&(_o(e,1,t),yn(e,t));break}}e=e.return}}function fE(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=un(),t.pingedLanes|=t.suspendedLanes&n,Ht===t&&(qt&n)===n&&(Bt===4||Bt===3&&(qt&130023424)===qt&&500>At()-Nh?Hr(t,0):Th|=n),yn(t,e)}function Ev(t,e){e===0&&(t.mode&1?(e=Fo,Fo<<=1,!(Fo&130023424)&&(Fo=4194304)):e=1);var n=un();t=Oi(t,e),t!==null&&(_o(t,e,n),yn(t,n))}function hE(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),Ev(t,n)}function pE(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ae(314))}i!==null&&i.delete(e),Ev(t,n)}var Sv;Sv=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||vn.current)gn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return gn=!1,tE(t,e,n);gn=!!(t.flags&131072)}else gn=!1,vt&&e.flags&1048576&&C0(e,$l,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;wl(t,e),t=e.pendingProps;var r=Gs(e,an.current);Os(e,n),r=Sh(null,e,i,t,r,n);var s=bh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,_n(i)?(s=!0,Wl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,gh(e),r.updater=wc,e.stateNode=r,r._reactInternals=e,Dd(e,i,t,n),e=Ld(null,e,i,!0,s,n)):(e.tag=0,vt&&s&&uh(e),cn(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(wl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=xE(i),t=Yn(i,t),r){case 0:e=Fd(null,e,i,t,n);break e;case 1:e=wm(null,e,i,t,n);break e;case 11:e=bm(null,e,i,t,n);break e;case 14:e=Mm(null,e,i,Yn(i.type,t),n);break e}throw Error(ae(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Yn(i,r),Fd(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Yn(i,r),wm(t,e,i,r,n);case 3:e:{if(sv(e),t===null)throw Error(ae(387));i=e.pendingProps,s=e.memoizedState,r=s.element,P0(t,e),Kl(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=$s(Error(ae(423)),e),e=Cm(t,e,i,n,r);break e}else if(i!==r){r=$s(Error(ae(424)),e),e=Cm(t,e,i,n,r);break e}else for(Tn=mr(e.stateNode.containerInfo.firstChild),Rn=e,vt=!0,Zn=null,n=R0(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Hs(),i===r){e=Bi(t,e,n);break e}cn(t,e,i,n)}e=e.child}return e;case 5:return F0(e),t===null&&Td(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,bd(i,r)?o=null:s!==null&&bd(i,s)&&(e.flags|=32),rv(t,e),cn(t,e,o,n),e.child;case 6:return t===null&&Td(e),null;case 13:return av(t,e,n);case 4:return vh(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Ws(e,null,i,n):cn(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Yn(i,r),bm(t,e,i,r,n);case 7:return cn(t,e,e.pendingProps,n),e.child;case 8:return cn(t,e,e.pendingProps.children,n),e.child;case 12:return cn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,pt(ql,i._currentValue),i._currentValue=o,s!==null)if(ii(s.value,o)){if(s.children===r.children&&!vn.current){e=Bi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var l=s.dependencies;if(l!==null){o=s.child;for(var c=l.firstContext;c!==null;){if(c.context===i){if(s.tag===1){c=Pi(-1,n&-n),c.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?c.next=c:(c.next=d.next,d.next=c),u.pending=c}}s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),Nd(s.return,n,e),l.lanes|=n;break}c=c.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ae(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),Nd(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}cn(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Os(e,n),r=Vn(r),i=i(r),e.flags|=1,cn(t,e,i,n),e.child;case 14:return i=e.type,r=Yn(i,e.pendingProps),r=Yn(i.type,r),Mm(t,e,i,r,n);case 15:return nv(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Yn(i,r),wl(t,e),e.tag=1,_n(i)?(t=!0,Wl(e)):t=!1,Os(e,n),Q0(e,i,r),Dd(e,i,r,n),Ld(null,e,i,!0,t,n);case 19:return ov(t,e,n);case 22:return iv(t,e,n)}throw Error(ae(156,e.tag))};function bv(t,e){return Kg(t,e)}function mE(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function jn(t,e,n,i){return new mE(t,e,n,i)}function Fh(t){return t=t.prototype,!(!t||!t.isReactComponent)}function xE(t){if(typeof t=="function")return Fh(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Jf)return 11;if(t===Qf)return 14}return 2}function _r(t,e){var n=t.alternate;return n===null?(n=jn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Tl(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")Fh(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Ss:return Wr(n.children,r,s,e);case Zf:o=8,r|=8;break;case td:return t=jn(12,n,e,r|2),t.elementType=td,t.lanes=s,t;case nd:return t=jn(13,n,e,r),t.elementType=nd,t.lanes=s,t;case id:return t=jn(19,n,e,r),t.elementType=id,t.lanes=s,t;case Fg:return Tc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Dg:o=10;break e;case Pg:o=9;break e;case Jf:o=11;break e;case Qf:o=14;break e;case ir:o=16,i=null;break e}throw Error(ae(130,t==null?t:typeof t,""))}return e=jn(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Wr(t,e,n,i){return t=jn(7,t,i,e),t.lanes=n,t}function Tc(t,e,n,i){return t=jn(22,t,i,e),t.elementType=Fg,t.lanes=n,t.stateNode={isHidden:!1},t}function hu(t,e,n){return t=jn(6,t,null,e),t.lanes=n,t}function pu(t,e,n){return e=jn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function gE(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=qc(0),this.expirationTimes=qc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=qc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Lh(t,e,n,i,r,s,o,l,c){return t=new gE(t,e,n,l,c),e===1?(e=1,s===!0&&(e|=8)):e=0,s=jn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},gh(s),t}function vE(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Es,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function Mv(t){if(!t)return br;t=t._reactInternals;e:{if(ts(t)!==t||t.tag!==1)throw Error(ae(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(_n(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ae(171))}if(t.tag===1){var n=t.type;if(_n(n))return M0(t,n,e)}return e}function wv(t,e,n,i,r,s,o,l,c){return t=Lh(n,i,!0,t,r,s,o,l,c),t.context=Mv(null),n=t.current,i=un(),r=vr(n),s=Pi(i,r),s.callback=e??null,xr(n,s,r),t.current.lanes=r,_o(t,r,i),yn(t,i),t}function Nc(t,e,n,i){var r=e.current,s=un(),o=vr(r);return n=Mv(n),e.context===null?e.context=n:e.pendingContext=n,e=Pi(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=xr(r,e,o),t!==null&&(ti(t,r,o,s),Sl(t,r,o)),o}function rc(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Um(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Ih(t,e){Um(t,e),(t=t.alternate)&&Um(t,e)}function _E(){return null}var Cv=typeof reportError=="function"?reportError:function(t){console.error(t)};function Uh(t){this._internalRoot=t}Rc.prototype.render=Uh.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ae(409));Nc(t,e,null,null)};Rc.prototype.unmount=Uh.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Kr(function(){Nc(null,t,null,null)}),e[ki]=null}};function Rc(t){this._internalRoot=t}Rc.prototype.unstable_scheduleHydration=function(t){if(t){var e=i0();t={blockedOn:null,target:t,priority:e};for(var n=0;n<ar.length&&e!==0&&e<ar[n].priority;n++);ar.splice(n,0,t),n===0&&s0(t)}};function kh(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Dc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function km(){}function yE(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var u=rc(o);s.call(u)}}var o=wv(e,i,t,0,null,!1,!1,"",km);return t._reactRootContainer=o,t[ki]=o.current,Ka(t.nodeType===8?t.parentNode:t),Kr(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var l=i;i=function(){var u=rc(c);l.call(u)}}var c=Lh(t,0,!1,null,null,!1,!1,"",km);return t._reactRootContainer=c,t[ki]=c.current,Ka(t.nodeType===8?t.parentNode:t),Kr(function(){Nc(e,c,n,i)}),c}function Pc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var l=r;r=function(){var c=rc(o);l.call(c)}}Nc(e,o,t,r)}else o=yE(n,e,t,r,i);return rc(o)}t0=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Aa(e.pendingLanes);n!==0&&(nh(e,n|1),yn(e,At()),!(nt&6)&&(qs=At()+500,Ar()))}break;case 13:Kr(function(){var i=Oi(t,1);if(i!==null){var r=un();ti(i,t,1,r)}}),Ih(t,1)}};ih=function(t){if(t.tag===13){var e=Oi(t,134217728);if(e!==null){var n=un();ti(e,t,134217728,n)}Ih(t,134217728)}};n0=function(t){if(t.tag===13){var e=vr(t),n=Oi(t,e);if(n!==null){var i=un();ti(n,t,e,i)}Ih(t,e)}};i0=function(){return ct};r0=function(t,e){var n=ct;try{return ct=t,e()}finally{ct=n}};hd=function(t,e,n){switch(e){case"input":if(ad(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=Sc(i);if(!r)throw Error(ae(90));Ig(i),ad(i,r)}}}break;case"textarea":kg(t,n);break;case"select":e=n.value,e!=null&&Ls(t,!!n.multiple,e,!1)}};Hg=Rh;Wg=Kr;var EE={usingClientEntryPoint:!1,Events:[Eo,Cs,Sc,Vg,Gg,Rh]},pa={findFiberByHostInstance:Br,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},SE={bundleType:pa.bundleType,version:pa.version,rendererPackageName:pa.rendererPackageName,rendererConfig:pa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Vi.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=qg(t),t===null?null:t.stateNode},findFiberByHostInstance:pa.findFiberByHostInstance||_E,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ho=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ho.isDisabled&&Ho.supportsFiber)try{vc=Ho.inject(SE),mi=Ho}catch{}}Pn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=EE;Pn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!kh(e))throw Error(ae(200));return vE(t,e,null,n)};Pn.createRoot=function(t,e){if(!kh(t))throw Error(ae(299));var n=!1,i="",r=Cv;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Lh(t,1,!1,null,null,n,!1,i,r),t[ki]=e.current,Ka(t.nodeType===8?t.parentNode:t),new Uh(e)};Pn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ae(188)):(t=Object.keys(t).join(","),Error(ae(268,t)));return t=qg(e),t=t===null?null:t.stateNode,t};Pn.flushSync=function(t){return Kr(t)};Pn.hydrate=function(t,e,n){if(!Dc(e))throw Error(ae(200));return Pc(null,t,e,!0,n)};Pn.hydrateRoot=function(t,e,n){if(!kh(t))throw Error(ae(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=Cv;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=wv(e,null,t,1,n??null,r,!1,s,o),t[ki]=e.current,Ka(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new Rc(e)};Pn.render=function(t,e,n){if(!Dc(e))throw Error(ae(200));return Pc(null,t,e,!1,n)};Pn.unmountComponentAtNode=function(t){if(!Dc(t))throw Error(ae(40));return t._reactRootContainer?(Kr(function(){Pc(null,null,t,!1,function(){t._reactRootContainer=null,t[ki]=null})}),!0):!1};Pn.unstable_batchedUpdates=Rh;Pn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Dc(n))throw Error(ae(200));if(t==null||t._reactInternals===void 0)throw Error(ae(38));return Pc(t,e,n,!1,i)};Pn.version="18.3.1-next-f1338f8080-20240426";function Av(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Av)}catch(t){console.error(t)}}Av(),Ag.exports=Pn;var bE=Ag.exports,Om=bE;Qu.createRoot=Om.createRoot,Qu.hydrateRoot=Om.hydrateRoot;function ME(t={}){const{nonce:e,locale:n,onScriptLoadSuccess:i,onScriptLoadError:r}=t,[s,o]=L.useState(!1),l=L.useRef(i);l.current=i;const c=L.useRef(r);return c.current=r,L.useEffect(()=>{const u=document.createElement("script");return u.src="https://accounts.google.com/gsi/client",n&&(u.src+=`?hl=${n}`),u.async=!0,u.defer=!0,u.nonce=e,u.onload=()=>{var d;o(!0),(d=l.current)===null||d===void 0||d.call(l)},u.onerror=()=>{var d;o(!1),(d=c.current)===null||d===void 0||d.call(c)},document.body.appendChild(u),()=>{document.body.removeChild(u)}},[e]),s}const Tv=L.createContext(null);function Nv({clientId:t,nonce:e,locale:n,onScriptLoadSuccess:i,onScriptLoadError:r,children:s}){const o=ME({nonce:e,onScriptLoadSuccess:i,onScriptLoadError:r,locale:n}),l=L.useMemo(()=>({locale:n,clientId:t,scriptLoadedSuccessfully:o}),[t,o]);return gc.createElement(Tv.Provider,{value:l},s)}function wE(){const t=L.useContext(Tv);if(!t)throw new Error("Google OAuth components must be used within GoogleOAuthProvider");return t}function CE(t){var e;return(e=t==null?void 0:t.clientId)!==null&&e!==void 0?e:t==null?void 0:t.client_id}const AE={large:40,medium:32,small:20};function TE({onSuccess:t,onError:e,useOneTap:n,promptMomentNotification:i,type:r="standard",theme:s="outline",size:o="large",text:l,shape:c,logo_alignment:u,width:d,click_listener:p,state:h,containerProps:m,login_hint:v,...b}){const x=L.useRef(null),{clientId:f,locale:g,scriptLoadedSuccessfully:w}=wE(),S=L.useRef(t);S.current=t;const y=L.useRef(e);y.current=e;const M=L.useRef(i);return M.current=i,L.useEffect(()=>{var A,_,T,R,P,D,I,F,B;if(w)return(T=(_=(A=window==null?void 0:window.google)===null||A===void 0?void 0:A.accounts)===null||_===void 0?void 0:_.id)===null||T===void 0||T.initialize({client_id:f,callback:Z=>{var X;if(!(Z!=null&&Z.credential))return(X=y.current)===null||X===void 0?void 0:X.call(y);const{credential:j,select_by:z}=Z;S.current({credential:j,clientId:CE(Z),select_by:z})},login_hint:v,...b}),(D=(P=(R=window==null?void 0:window.google)===null||R===void 0?void 0:R.accounts)===null||P===void 0?void 0:P.id)===null||D===void 0||D.renderButton(x.current,{type:r,theme:s,size:o,text:l,shape:c,logo_alignment:u,width:d,locale:g,click_listener:p,state:h}),n&&((B=(F=(I=window==null?void 0:window.google)===null||I===void 0?void 0:I.accounts)===null||F===void 0?void 0:F.id)===null||B===void 0||B.prompt(M.current)),()=>{var Z,X,j;n&&((j=(X=(Z=window==null?void 0:window.google)===null||Z===void 0?void 0:Z.accounts)===null||X===void 0?void 0:X.id)===null||j===void 0||j.cancel())}},[f,w,n,r,s,o,l,c,u,d,g,v]),gc.createElement("div",{...m,ref:x,style:{height:AE[o],...m==null?void 0:m.style}})}/**
 * @remix-run/router v1.23.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function so(){return so=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},so.apply(null,arguments)}var dr;(function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"})(dr||(dr={}));const Bm="popstate";function NE(t){t===void 0&&(t={});function e(i,r){let{pathname:s,search:o,hash:l}=i.location;return Xd("",{pathname:s,search:o,hash:l},r.state&&r.state.usr||null,r.state&&r.state.key||"default")}function n(i,r){return typeof r=="string"?r:sc(r)}return DE(e,n,null,t)}function Tt(t,e){if(t===!1||t===null||typeof t>"u")throw new Error(e)}function Rv(t,e){if(!t){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function RE(){return Math.random().toString(36).substr(2,8)}function jm(t,e){return{usr:t.state,key:t.key,idx:e}}function Xd(t,e,n,i){return n===void 0&&(n=null),so({pathname:typeof t=="string"?t:t.pathname,search:"",hash:""},typeof e=="string"?ta(e):e,{state:n,key:e&&e.key||i||RE()})}function sc(t){let{pathname:e="/",search:n="",hash:i=""}=t;return n&&n!=="?"&&(e+=n.charAt(0)==="?"?n:"?"+n),i&&i!=="#"&&(e+=i.charAt(0)==="#"?i:"#"+i),e}function ta(t){let e={};if(t){let n=t.indexOf("#");n>=0&&(e.hash=t.substr(n),t=t.substr(0,n));let i=t.indexOf("?");i>=0&&(e.search=t.substr(i),t=t.substr(0,i)),t&&(e.pathname=t)}return e}function DE(t,e,n,i){i===void 0&&(i={});let{window:r=document.defaultView,v5Compat:s=!1}=i,o=r.history,l=dr.Pop,c=null,u=d();u==null&&(u=0,o.replaceState(so({},o.state,{idx:u}),""));function d(){return(o.state||{idx:null}).idx}function p(){l=dr.Pop;let x=d(),f=x==null?null:x-u;u=x,c&&c({action:l,location:b.location,delta:f})}function h(x,f){l=dr.Push;let g=Xd(b.location,x,f);n&&n(g,x),u=d()+1;let w=jm(g,u),S=b.createHref(g);try{o.pushState(w,"",S)}catch(y){if(y instanceof DOMException&&y.name==="DataCloneError")throw y;r.location.assign(S)}s&&c&&c({action:l,location:b.location,delta:1})}function m(x,f){l=dr.Replace;let g=Xd(b.location,x,f);n&&n(g,x),u=d();let w=jm(g,u),S=b.createHref(g);o.replaceState(w,"",S),s&&c&&c({action:l,location:b.location,delta:0})}function v(x){let f=r.location.origin!=="null"?r.location.origin:r.location.href,g=typeof x=="string"?x:sc(x);return g=g.replace(/ $/,"%20"),Tt(f,"No window.location.(origin|href) available to create URL for href: "+g),new URL(g,f)}let b={get action(){return l},get location(){return t(r,o)},listen(x){if(c)throw new Error("A history only accepts one active listener");return r.addEventListener(Bm,p),c=x,()=>{r.removeEventListener(Bm,p),c=null}},createHref(x){return e(r,x)},createURL:v,encodeLocation(x){let f=v(x);return{pathname:f.pathname,search:f.search,hash:f.hash}},push:h,replace:m,go(x){return o.go(x)}};return b}var zm;(function(t){t.data="data",t.deferred="deferred",t.redirect="redirect",t.error="error"})(zm||(zm={}));function PE(t,e,n){return n===void 0&&(n="/"),FE(t,e,n,!1)}function FE(t,e,n,i){let r=typeof e=="string"?ta(e):e,s=Oh(r.pathname||"/",n);if(s==null)return null;let o=Dv(t);LE(o);let l=null,c=WE(s);for(let u=0;l==null&&u<o.length;++u)l=GE(o[u],c,i);return l}function Dv(t,e,n,i){e===void 0&&(e=[]),n===void 0&&(n=[]),i===void 0&&(i="");let r=(s,o,l)=>{let c={relativePath:l===void 0?s.path||"":l,caseSensitive:s.caseSensitive===!0,childrenIndex:o,route:s};c.relativePath.startsWith("/")&&(Tt(c.relativePath.startsWith(i),'Absolute route path "'+c.relativePath+'" nested under path '+('"'+i+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),c.relativePath=c.relativePath.slice(i.length));let u=yr([i,c.relativePath]),d=n.concat(c);s.children&&s.children.length>0&&(Tt(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+u+'".')),Dv(s.children,e,d,u)),!(s.path==null&&!s.index)&&e.push({path:u,score:zE(u,s.index),routesMeta:d})};return t.forEach((s,o)=>{var l;if(s.path===""||!((l=s.path)!=null&&l.includes("?")))r(s,o);else for(let c of Pv(s.path))r(s,o,c)}),e}function Pv(t){let e=t.split("/");if(e.length===0)return[];let[n,...i]=e,r=n.endsWith("?"),s=n.replace(/\?$/,"");if(i.length===0)return r?[s,""]:[s];let o=Pv(i.join("/")),l=[];return l.push(...o.map(c=>c===""?s:[s,c].join("/"))),r&&l.push(...o),l.map(c=>t.startsWith("/")&&c===""?"/":c)}function LE(t){t.sort((e,n)=>e.score!==n.score?n.score-e.score:VE(e.routesMeta.map(i=>i.childrenIndex),n.routesMeta.map(i=>i.childrenIndex)))}const IE=/^:[\w-]+$/,UE=3,kE=2,OE=1,BE=10,jE=-2,Vm=t=>t==="*";function zE(t,e){let n=t.split("/"),i=n.length;return n.some(Vm)&&(i+=jE),e&&(i+=kE),n.filter(r=>!Vm(r)).reduce((r,s)=>r+(IE.test(s)?UE:s===""?OE:BE),i)}function VE(t,e){return t.length===e.length&&t.slice(0,-1).every((i,r)=>i===e[r])?t[t.length-1]-e[e.length-1]:0}function GE(t,e,n){n===void 0&&(n=!1);let{routesMeta:i}=t,r={},s="/",o=[];for(let l=0;l<i.length;++l){let c=i[l],u=l===i.length-1,d=s==="/"?e:e.slice(s.length)||"/",p=Gm({path:c.relativePath,caseSensitive:c.caseSensitive,end:u},d),h=c.route;if(!p&&u&&n&&!i[i.length-1].route.index&&(p=Gm({path:c.relativePath,caseSensitive:c.caseSensitive,end:!1},d)),!p)return null;Object.assign(r,p.params),o.push({params:r,pathname:yr([s,p.pathname]),pathnameBase:qE(yr([s,p.pathnameBase])),route:h}),p.pathnameBase!=="/"&&(s=yr([s,p.pathnameBase]))}return o}function Gm(t,e){typeof t=="string"&&(t={path:t,caseSensitive:!1,end:!0});let[n,i]=HE(t.path,t.caseSensitive,t.end),r=e.match(n);if(!r)return null;let s=r[0],o=s.replace(/(.)\/+$/,"$1"),l=r.slice(1);return{params:i.reduce((u,d,p)=>{let{paramName:h,isOptional:m}=d;if(h==="*"){let b=l[p]||"";o=s.slice(0,s.length-b.length).replace(/(.)\/+$/,"$1")}const v=l[p];return m&&!v?u[h]=void 0:u[h]=(v||"").replace(/%2F/g,"/"),u},{}),pathname:s,pathnameBase:o,pattern:t}}function HE(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!0),Rv(t==="*"||!t.endsWith("*")||t.endsWith("/*"),'Route path "'+t+'" will be treated as if it were '+('"'+t.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+t.replace(/\*$/,"/*")+'".'));let i=[],r="^"+t.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,l,c)=>(i.push({paramName:l,isOptional:c!=null}),c?"/?([^\\/]+)?":"/([^\\/]+)"));return t.endsWith("*")?(i.push({paramName:"*"}),r+=t==="*"||t==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?r+="\\/*$":t!==""&&t!=="/"&&(r+="(?:(?=\\/|$))"),[new RegExp(r,e?void 0:"i"),i]}function WE(t){try{return t.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return Rv(!1,'The URL path "'+t+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),t}}function Oh(t,e){if(e==="/")return t;if(!t.toLowerCase().startsWith(e.toLowerCase()))return null;let n=e.endsWith("/")?e.length-1:e.length,i=t.charAt(n);return i&&i!=="/"?null:t.slice(n)||"/"}function XE(t,e){e===void 0&&(e="/");let{pathname:n,search:i="",hash:r=""}=typeof t=="string"?ta(t):t,s;return n?(n=Fv(n),n.startsWith("/")?s=Hm(n.substring(1),"/"):s=Hm(n,e)):s=e,{pathname:s,search:YE(i),hash:KE(r)}}function Hm(t,e){let n=e.replace(/\/+$/,"").split("/");return t.split("/").forEach(r=>{r===".."?n.length>1&&n.pop():r!=="."&&n.push(r)}),n.length>1?n.join("/"):"/"}function mu(t,e,n,i){return"Cannot include a '"+t+"' character in a manually specified "+("`to."+e+"` field ["+JSON.stringify(i)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function $E(t){return t.filter((e,n)=>n===0||e.route.path&&e.route.path.length>0)}function Bh(t,e){let n=$E(t);return e?n.map((i,r)=>r===n.length-1?i.pathname:i.pathnameBase):n.map(i=>i.pathnameBase)}function jh(t,e,n,i){i===void 0&&(i=!1);let r;typeof t=="string"?r=ta(t):(r=so({},t),Tt(!r.pathname||!r.pathname.includes("?"),mu("?","pathname","search",r)),Tt(!r.pathname||!r.pathname.includes("#"),mu("#","pathname","hash",r)),Tt(!r.search||!r.search.includes("#"),mu("#","search","hash",r)));let s=t===""||r.pathname==="",o=s?"/":r.pathname,l;if(o==null)l=n;else{let p=e.length-1;if(!i&&o.startsWith("..")){let h=o.split("/");for(;h[0]==="..";)h.shift(),p-=1;r.pathname=h.join("/")}l=p>=0?e[p]:"/"}let c=XE(r,l),u=o&&o!=="/"&&o.endsWith("/"),d=(s||o===".")&&n.endsWith("/");return!c.pathname.endsWith("/")&&(u||d)&&(c.pathname+="/"),c}const Fv=t=>t.replace(/\/\/+/g,"/"),yr=t=>Fv(t.join("/")),qE=t=>t.replace(/\/+$/,"").replace(/^\/*/,"/"),YE=t=>!t||t==="?"?"":t.startsWith("?")?t:"?"+t,KE=t=>!t||t==="#"?"":t.startsWith("#")?t:"#"+t;function ZE(t){return t!=null&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.internal=="boolean"&&"data"in t}const Lv=["post","put","patch","delete"];new Set(Lv);const JE=["get",...Lv];new Set(JE);/**
 * React Router v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ao(){return ao=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},ao.apply(null,arguments)}const zh=L.createContext(null),QE=L.createContext(null),Tr=L.createContext(null),Fc=L.createContext(null),Gi=L.createContext({outlet:null,matches:[],isDataRoute:!1}),Iv=L.createContext(null);function eS(t,e){let{relative:n}=e===void 0?{}:e;na()||Tt(!1);let{basename:i,navigator:r}=L.useContext(Tr),{hash:s,pathname:o,search:l}=kv(t,{relative:n}),c=o;return i!=="/"&&(c=o==="/"?i:yr([i,o])),r.createHref({pathname:c,search:l,hash:s})}function na(){return L.useContext(Fc)!=null}function Hi(){return na()||Tt(!1),L.useContext(Fc).location}function Uv(t){L.useContext(Tr).static||L.useLayoutEffect(t)}function Nr(){let{isDataRoute:t}=L.useContext(Gi);return t?mS():tS()}function tS(){na()||Tt(!1);let t=L.useContext(zh),{basename:e,future:n,navigator:i}=L.useContext(Tr),{matches:r}=L.useContext(Gi),{pathname:s}=Hi(),o=JSON.stringify(Bh(r,n.v7_relativeSplatPath)),l=L.useRef(!1);return Uv(()=>{l.current=!0}),L.useCallback(function(u,d){if(d===void 0&&(d={}),!l.current)return;if(typeof u=="number"){i.go(u);return}let p=jh(u,JSON.parse(o),s,d.relative==="path");t==null&&e!=="/"&&(p.pathname=p.pathname==="/"?e:yr([e,p.pathname])),(d.replace?i.replace:i.push)(p,d.state,d)},[e,i,o,s,t])}const nS=L.createContext(null);function iS(t){let e=L.useContext(Gi).outlet;return e&&L.createElement(nS.Provider,{value:t},e)}function kv(t,e){let{relative:n}=e===void 0?{}:e,{future:i}=L.useContext(Tr),{matches:r}=L.useContext(Gi),{pathname:s}=Hi(),o=JSON.stringify(Bh(r,i.v7_relativeSplatPath));return L.useMemo(()=>jh(t,JSON.parse(o),s,n==="path"),[t,o,s,n])}function rS(t,e){return sS(t,e)}function sS(t,e,n,i){na()||Tt(!1);let{navigator:r}=L.useContext(Tr),{matches:s}=L.useContext(Gi),o=s[s.length-1],l=o?o.params:{};o&&o.pathname;let c=o?o.pathnameBase:"/";o&&o.route;let u=Hi(),d;if(e){var p;let x=typeof e=="string"?ta(e):e;c==="/"||(p=x.pathname)!=null&&p.startsWith(c)||Tt(!1),d=x}else d=u;let h=d.pathname||"/",m=h;if(c!=="/"){let x=c.replace(/^\//,"").split("/");m="/"+h.replace(/^\//,"").split("/").slice(x.length).join("/")}let v=PE(t,{pathname:m}),b=uS(v&&v.map(x=>Object.assign({},x,{params:Object.assign({},l,x.params),pathname:yr([c,r.encodeLocation?r.encodeLocation(x.pathname).pathname:x.pathname]),pathnameBase:x.pathnameBase==="/"?c:yr([c,r.encodeLocation?r.encodeLocation(x.pathnameBase).pathname:x.pathnameBase])})),s,n,i);return e&&b?L.createElement(Fc.Provider,{value:{location:ao({pathname:"/",search:"",hash:"",state:null,key:"default"},d),navigationType:dr.Pop}},b):b}function aS(){let t=pS(),e=ZE(t)?t.status+" "+t.statusText:t instanceof Error?t.message:JSON.stringify(t),n=t instanceof Error?t.stack:null,r={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"},s=null;return L.createElement(L.Fragment,null,L.createElement("h2",null,"Unexpected Application Error!"),L.createElement("h3",{style:{fontStyle:"italic"}},e),n?L.createElement("pre",{style:r},n):null,s)}const oS=L.createElement(aS,null);class lS extends L.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,n){return n.location!==e.location||n.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:n.error,location:n.location,revalidation:e.revalidation||n.revalidation}}componentDidCatch(e,n){console.error("React Router caught the following error during render",e,n)}render(){return this.state.error!==void 0?L.createElement(Gi.Provider,{value:this.props.routeContext},L.createElement(Iv.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function cS(t){let{routeContext:e,match:n,children:i}=t,r=L.useContext(zh);return r&&r.static&&r.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(r.staticContext._deepestRenderedBoundaryId=n.route.id),L.createElement(Gi.Provider,{value:e},i)}function uS(t,e,n,i){var r;if(e===void 0&&(e=[]),n===void 0&&(n=null),i===void 0&&(i=null),t==null){var s;if(!n)return null;if(n.errors)t=n.matches;else if((s=i)!=null&&s.v7_partialHydration&&e.length===0&&!n.initialized&&n.matches.length>0)t=n.matches;else return null}let o=t,l=(r=n)==null?void 0:r.errors;if(l!=null){let d=o.findIndex(p=>p.route.id&&(l==null?void 0:l[p.route.id])!==void 0);d>=0||Tt(!1),o=o.slice(0,Math.min(o.length,d+1))}let c=!1,u=-1;if(n&&i&&i.v7_partialHydration)for(let d=0;d<o.length;d++){let p=o[d];if((p.route.HydrateFallback||p.route.hydrateFallbackElement)&&(u=d),p.route.id){let{loaderData:h,errors:m}=n,v=p.route.loader&&h[p.route.id]===void 0&&(!m||m[p.route.id]===void 0);if(p.route.lazy||v){c=!0,u>=0?o=o.slice(0,u+1):o=[o[0]];break}}}return o.reduceRight((d,p,h)=>{let m,v=!1,b=null,x=null;n&&(m=l&&p.route.id?l[p.route.id]:void 0,b=p.route.errorElement||oS,c&&(u<0&&h===0?(xS("route-fallback",!1),v=!0,x=null):u===h&&(v=!0,x=p.route.hydrateFallbackElement||null)));let f=e.concat(o.slice(0,h+1)),g=()=>{let w;return m?w=b:v?w=x:p.route.Component?w=L.createElement(p.route.Component,null):p.route.element?w=p.route.element:w=d,L.createElement(cS,{match:p,routeContext:{outlet:d,matches:f,isDataRoute:n!=null},children:w})};return n&&(p.route.ErrorBoundary||p.route.errorElement||h===0)?L.createElement(lS,{location:n.location,revalidation:n.revalidation,component:b,error:m,children:g(),routeContext:{outlet:null,matches:f,isDataRoute:!0}}):g()},null)}var Ov=function(t){return t.UseBlocker="useBlocker",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t}(Ov||{}),ac=function(t){return t.UseBlocker="useBlocker",t.UseLoaderData="useLoaderData",t.UseActionData="useActionData",t.UseRouteError="useRouteError",t.UseNavigation="useNavigation",t.UseRouteLoaderData="useRouteLoaderData",t.UseMatches="useMatches",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t.UseRouteId="useRouteId",t}(ac||{});function dS(t){let e=L.useContext(zh);return e||Tt(!1),e}function fS(t){let e=L.useContext(QE);return e||Tt(!1),e}function hS(t){let e=L.useContext(Gi);return e||Tt(!1),e}function Bv(t){let e=hS(),n=e.matches[e.matches.length-1];return n.route.id||Tt(!1),n.route.id}function pS(){var t;let e=L.useContext(Iv),n=fS(ac.UseRouteError),i=Bv(ac.UseRouteError);return e!==void 0?e:(t=n.errors)==null?void 0:t[i]}function mS(){let{router:t}=dS(Ov.UseNavigateStable),e=Bv(ac.UseNavigateStable),n=L.useRef(!1);return Uv(()=>{n.current=!0}),L.useCallback(function(r,s){s===void 0&&(s={}),n.current&&(typeof r=="number"?t.navigate(r):t.navigate(r,ao({fromRouteId:e},s)))},[t,e])}const Wm={};function xS(t,e,n){!e&&!Wm[t]&&(Wm[t]=!0)}function gS(t,e){t==null||t.v7_startTransition,(t==null?void 0:t.v7_relativeSplatPath)===void 0&&(!e||e.v7_relativeSplatPath),e&&(e.v7_fetcherPersist,e.v7_normalizeFormMethod,e.v7_partialHydration,e.v7_skipActionErrorRevalidation)}function jv(t){let{to:e,replace:n,state:i,relative:r}=t;na()||Tt(!1);let{future:s,static:o}=L.useContext(Tr),{matches:l}=L.useContext(Gi),{pathname:c}=Hi(),u=Nr(),d=jh(e,Bh(l,s.v7_relativeSplatPath),c,r==="path"),p=JSON.stringify(d);return L.useEffect(()=>u(JSON.parse(p),{replace:n,state:i,relative:r}),[u,p,r,n,i]),null}function zv(t){return iS(t.context)}function $e(t){Tt(!1)}function vS(t){let{basename:e="/",children:n=null,location:i,navigationType:r=dr.Pop,navigator:s,static:o=!1,future:l}=t;na()&&Tt(!1);let c=e.replace(/^\/*/,"/"),u=L.useMemo(()=>({basename:c,navigator:s,static:o,future:ao({v7_relativeSplatPath:!1},l)}),[c,l,s,o]);typeof i=="string"&&(i=ta(i));let{pathname:d="/",search:p="",hash:h="",state:m=null,key:v="default"}=i,b=L.useMemo(()=>{let x=Oh(d,c);return x==null?null:{location:{pathname:x,search:p,hash:h,state:m,key:v},navigationType:r}},[c,d,p,h,m,v,r]);return b==null?null:L.createElement(Tr.Provider,{value:u},L.createElement(Fc.Provider,{children:n,value:b}))}function _S(t){let{children:e,location:n}=t;return rS($d(e),n)}new Promise(()=>{});function $d(t,e){e===void 0&&(e=[]);let n=[];return L.Children.forEach(t,(i,r)=>{if(!L.isValidElement(i))return;let s=[...e,r];if(i.type===L.Fragment){n.push.apply(n,$d(i.props.children,s));return}i.type!==$e&&Tt(!1),!i.props.index||!i.props.children||Tt(!1);let o={id:i.props.id||s.join("-"),caseSensitive:i.props.caseSensitive,element:i.props.element,Component:i.props.Component,index:i.props.index,path:i.props.path,loader:i.props.loader,action:i.props.action,errorElement:i.props.errorElement,ErrorBoundary:i.props.ErrorBoundary,hasErrorBoundary:i.props.ErrorBoundary!=null||i.props.errorElement!=null,shouldRevalidate:i.props.shouldRevalidate,handle:i.props.handle,lazy:i.props.lazy};i.props.children&&(o.children=$d(i.props.children,s)),n.push(o)}),n}/**
 * React Router DOM v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function qd(){return qd=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},qd.apply(null,arguments)}function yS(t,e){if(t==null)return{};var n={};for(var i in t)if({}.hasOwnProperty.call(t,i)){if(e.indexOf(i)!==-1)continue;n[i]=t[i]}return n}function ES(t){return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}function SS(t,e){return t.button===0&&(!e||e==="_self")&&!ES(t)}function Yd(t){return t===void 0&&(t=""),new URLSearchParams(typeof t=="string"||Array.isArray(t)||t instanceof URLSearchParams?t:Object.keys(t).reduce((e,n)=>{let i=t[n];return e.concat(Array.isArray(i)?i.map(r=>[n,r]):[[n,i]])},[]))}function bS(t,e){let n=Yd(t);return e&&e.forEach((i,r)=>{n.has(r)||e.getAll(r).forEach(s=>{n.append(r,s)})}),n}const MS=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],wS="6";try{window.__reactRouterVersion=wS}catch{}const CS="startTransition",Xm=f1[CS];function AS(t){let{basename:e,children:n,future:i,window:r}=t,s=L.useRef();s.current==null&&(s.current=NE({window:r,v5Compat:!0}));let o=s.current,[l,c]=L.useState({action:o.action,location:o.location}),{v7_startTransition:u}=i||{},d=L.useCallback(p=>{u&&Xm?Xm(()=>c(p)):c(p)},[c,u]);return L.useLayoutEffect(()=>o.listen(d),[o,d]),L.useEffect(()=>gS(i),[i]),L.createElement(vS,{basename:e,children:n,location:l.location,navigationType:l.action,navigator:o,future:i})}const TS=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",NS=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Ot=L.forwardRef(function(e,n){let{onClick:i,relative:r,reloadDocument:s,replace:o,state:l,target:c,to:u,preventScrollReset:d,viewTransition:p}=e,h=yS(e,MS),{basename:m}=L.useContext(Tr),v,b=!1;if(typeof u=="string"&&NS.test(u)&&(v=u,TS))try{let w=new URL(window.location.href),S=u.startsWith("//")?new URL(w.protocol+u):new URL(u),y=Oh(S.pathname,m);S.origin===w.origin&&y!=null?u=y+S.search+S.hash:b=!0}catch{}let x=eS(u,{relative:r}),f=RS(u,{replace:o,state:l,target:c,preventScrollReset:d,relative:r,viewTransition:p});function g(w){i&&i(w),w.defaultPrevented||f(w)}return L.createElement("a",qd({},h,{href:v||x,onClick:b||s?i:g,ref:n,target:c}))});var $m;(function(t){t.UseScrollRestoration="useScrollRestoration",t.UseSubmit="useSubmit",t.UseSubmitFetcher="useSubmitFetcher",t.UseFetcher="useFetcher",t.useViewTransitionState="useViewTransitionState"})($m||($m={}));var qm;(function(t){t.UseFetcher="useFetcher",t.UseFetchers="useFetchers",t.UseScrollRestoration="useScrollRestoration"})(qm||(qm={}));function RS(t,e){let{target:n,replace:i,state:r,preventScrollReset:s,relative:o,viewTransition:l}=e===void 0?{}:e,c=Nr(),u=Hi(),d=kv(t,{relative:o});return L.useCallback(p=>{if(SS(p,n)){p.preventDefault();let h=i!==void 0?i:sc(u)===sc(d);c(t,{replace:h,state:r,preventScrollReset:s,relative:o,viewTransition:l})}},[u,c,d,i,r,n,t,s,o,l])}function DS(t){let e=L.useRef(Yd(t)),n=L.useRef(!1),i=Hi(),r=L.useMemo(()=>bS(i.search,n.current?null:e.current),[i.search]),s=Nr(),o=L.useCallback((l,c)=>{const u=Yd(typeof l=="function"?l(r):l);n.current=!0,s("?"+u,c)},[s,r]);return[r,o]}/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PS=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Vv=(...t)=>t.filter((e,n,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var FS={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const LS=L.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:i,className:r="",children:s,iconNode:o,...l},c)=>L.createElement("svg",{ref:c,...FS,width:e,height:e,stroke:t,strokeWidth:i?Number(n)*24/Number(e):n,className:Vv("lucide",r),...l},[...o.map(([u,d])=>L.createElement(u,d)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Re=(t,e)=>{const n=L.forwardRef(({className:i,...r},s)=>L.createElement(LS,{ref:s,iconNode:e,className:Vv(`lucide-${PS(t)}`,i),...r}));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oc=Re("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const IS=Re("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xt=Re("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ym=Re("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oo=Re("Atom",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",key:"1l2ple"}],["path",{d:"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",key:"1wam0m"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const US=Re("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gv=Re("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vh=Re("Bookmark",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kd=Re("Box",[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hv=Re("ChartColumn",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Km=Re("ChartNoAxesColumn",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wv=Re("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gh=Re("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kS=Re("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const OS=Re("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hh=Re("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wh=Re("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xv=Re("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const BS=Re("Columns3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jS=Re("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zd=Re("Cpu",[["rect",{width:"16",height:"16",x:"4",y:"4",rx:"2",key:"14l7u7"}],["rect",{width:"6",height:"6",x:"9",y:"9",rx:"1",key:"5aljv4"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jd=Re("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ji=Re("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xh=Re("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zS=Re("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $v=Re("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const VS=Re("FileJson",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"1oajmo"}],["path",{d:"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"mpwhp6"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qv=Re("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const GS=Re("FileUp",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zm=Re("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const HS=Re("FlaskConical",[["path",{d:"M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2",key:"pzvekw"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M7 16h10",key:"wp8him"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const WS=Re("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const XS=Re("Layers3",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59",key:"1e5n1m"}],["path",{d:"m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59",key:"1iwflc"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=Re("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $S=Re("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yv=Re("Leaf",[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qS=Re("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const YS=Re("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qd=Re("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kv=Re("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const KS=Re("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $h=Re("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qh=Re("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const co=Re("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ia=Re("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uo=Re("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Er=Re("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ZS=Re("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yh=Re("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const JS=Re("SquareCheckBig",[["path",{d:"M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5",key:"1uzm8b"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const QS=Re("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zv=Re("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eb=Re("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tb=Re("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jv=Re("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nb=Re("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ys=Re("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ib=Re("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),rb=[{name:"Dashboard",path:"/app",icon:$S},{name:"Materials Search",path:"/app/materials",icon:ia},{name:"CIF Generation",path:"/app/cif-gen",icon:qv},{name:"Property Prediction",path:"/app/predict",icon:tb},{name:"Structure Visualization",path:"/app/structures",icon:Kd},{name:"Batch Prediction",path:"/app/batch",icon:lo},{name:"DFT Validation",path:"/app/dft",icon:Er},{name:"Literature & Diversity",path:"/app/literature",icon:Gv},{name:"Saved Results",path:"/app/saved",icon:Vh}],sb=[{name:"Settings",path:"/app/settings",icon:uo},{name:"Help & Support",path:"/app/help",icon:Xv}];function ab({mobileOpen:t,setMobileOpen:e}={}){const n=Hi(),[i,r]=L.useState(!1),[s,o]=L.useState(!1),l=t??i,c=e??r,u=s||l,d=p=>p==="/app"?n.pathname==="/app":n.pathname.startsWith(p);return a.jsxs(a.Fragment,{children:[a.jsx("button",{type:"button",className:"sidebar-mobile-trigger",onClick:()=>c(!0),"aria-label":"Open navigation","aria-expanded":l,children:a.jsx($h,{size:20})}),l&&a.jsx("button",{type:"button",className:"sidebar-scrim",onClick:()=>c(!1),"aria-label":"Close navigation"}),a.jsxs("aside",{className:`sidebar-fixed flex flex-col bg-white select-none no-scrollbar ${l?"sidebar-open":""} ${s?"sidebar-expanded":""}`,onMouseEnter:()=>o(!0),onMouseLeave:()=>o(!1),"aria-label":"Primary navigation",children:[a.jsx("nav",{className:"flex-1 flex flex-col gap-1 px-3 py-3 overflow-y-auto no-scrollbar","aria-label":"Main",children:rb.map(p=>{const h=d(p.path),m=p.icon;return a.jsxs(Ot,{to:p.path,title:u?void 0:p.name,onClick:()=>c(!1),className:`
                  relative flex items-center h-10 rounded-xl text-xs font-medium
                  transition-all duration-150 group
                  ${u?"px-3 gap-3 w-full":"justify-center px-0 w-10 mx-auto"}
                  ${h?"bg-[--im-orange-subtle] text-[--im-orange] font-semibold":"text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt"}
                `,style:h?{"--im-orange-subtle":"var(--im-orange-subtle)"}:{},"aria-current":h?"page":void 0,children:[a.jsx("div",{className:"w-5 h-5 shrink-0 flex items-center justify-center",children:a.jsx(m,{size:17,strokeWidth:h?2.2:1.7,style:{color:h?"var(--im-orange)":void 0},className:h?"":"text-im-textMuted group-hover:text-im-textLight transition-colors"})}),a.jsx("span",{className:`truncate whitespace-nowrap transition-all duration-200 ${u?"opacity-100 max-w-[170px]":"opacity-0 max-w-0 overflow-hidden hidden"}`,children:p.name}),h&&u&&a.jsx("span",{className:"ml-auto w-1.5 h-1.5 rounded-full shrink-0",style:{backgroundColor:"var(--im-orange)"}}),h&&!u&&a.jsx("span",{className:"absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full",style:{backgroundColor:"var(--im-orange)"}})]},p.path)})}),a.jsx("nav",{className:"flex flex-col gap-1 px-3 py-2 border-t border-[#EDE8E2]/70 shrink-0 no-scrollbar","aria-label":"Utilities",children:sb.map(p=>{const h=d(p.path),m=p.icon;return a.jsxs(Ot,{to:p.path,title:u?void 0:p.name,onClick:()=>c(!1),className:`
                  relative flex items-center h-10 rounded-xl text-xs font-medium
                  transition-all duration-150 group
                  ${u?"px-3 gap-3 w-full":"justify-center px-0 w-10 mx-auto"}
                  ${h?"bg-[#FDF5EE] text-[#D47E30] font-semibold":"text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt"}
                `,"aria-current":h?"page":void 0,children:[a.jsx("div",{className:"w-5 h-5 shrink-0 flex items-center justify-center",children:a.jsx(m,{size:17,strokeWidth:h?2.2:1.7,className:h?"text-[#D47E30]":"text-im-textMuted group-hover:text-im-textLight transition-colors"})}),a.jsx("span",{className:`truncate whitespace-nowrap transition-all duration-200 ${u?"opacity-100 max-w-[170px]":"opacity-0 max-w-0 overflow-hidden hidden"}`,children:p.name})]},p.path)})}),a.jsx("div",{className:"pb-2"}),a.jsx("button",{type:"button",className:"sidebar-mobile-close",onClick:()=>c(!1),"aria-label":"Close navigation",children:a.jsx(Ys,{size:18})})]})]})}const Qv=L.createContext(void 0),ma="userProfile",xu="accessToken";function ob({children:t}){const[e,n]=L.useState(()=>{try{const o=localStorage.getItem(ma);return o?JSON.parse(o):null}catch{return null}});L.useEffect(()=>{const o=l=>{if(l.key===ma)try{n(l.newValue?JSON.parse(l.newValue):null)}catch{n(null)}};return window.addEventListener("storage",o),()=>window.removeEventListener("storage",o)},[]);const i=o=>{const l=(o.email||"").trim(),c=o.isGoogle??(l.toLowerCase().includes("gmail.com")||l.toLowerCase().includes("google.com"));let u=l;u?u.includes("@")||(u=`${u}@${c?"gmail.com":"indianmatter.org"}`):u=c?"subodh.matter@gmail.com":"researcher@indianmatter.org";let d=(o.name||"").trim();d||(d=u.includes("@")?u.split("@")[0]:u,d=d.charAt(0).toUpperCase()+d.slice(1));const p={name:d,email:u,isGoogle:c,provider:o.provider||(c?"google":"email"),avatar:o.avatar||(c?"https://lh3.googleusercontent.com/a/default-user=s96-c":void 0)};localStorage.setItem(ma,JSON.stringify(p)),localStorage.setItem(xu,"token_"+Date.now()),n(p)},r=o=>{const l={name:(o==null?void 0:o.name)||"Dr. Subodh Kumar",email:(o==null?void 0:o.email)||"subodh.matter@gmail.com",avatar:(o==null?void 0:o.avatar)||"https://lh3.googleusercontent.com/a/default-user=s96-c",isGoogle:!0,provider:"google"};localStorage.setItem(ma,JSON.stringify(l)),localStorage.setItem(xu,"google_token_"+Date.now()),n(l)},s=()=>{localStorage.removeItem(ma),localStorage.removeItem(xu),n(null)};return a.jsx(Qv.Provider,{value:{isAuthenticated:!!e,user:e,signIn:i,signInWithGoogle:r,signOut:s},children:t})}function Lc(){const t=L.useContext(Qv);if(!t)throw new Error("useAuth must be used within an AuthProvider");return t}function lb({onToggleMobileMenu:t}){const e=Nr(),{user:n,signOut:i}=Lc(),[r,s]=L.useState(!1),[o,l]=L.useState(""),c=(n==null?void 0:n.name)||"Researcher",u=(n==null?void 0:n.email)||"researcher@indianmatter.org",d=!!(n!=null&&n.isGoogle),p=c.charAt(0).toUpperCase(),h=v=>{v.preventDefault(),o.trim()&&e(`/app/materials?q=${encodeURIComponent(o)}`)},m=()=>{i(),e("/signin")};return L.useEffect(()=>{if(!r)return;const v=()=>s(!1);return window.addEventListener("mousedown",v),()=>window.removeEventListener("mousedown",v)},[r]),a.jsxs("header",{className:"h-16 w-full flex items-center justify-between px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-[#EDE8E2] fixed top-0 left-0 right-0 z-50",children:[a.jsxs("div",{className:"flex items-center gap-4 sm:gap-5 min-w-0",children:[t&&a.jsx("button",{type:"button",onClick:t,className:"md:hidden p-1.5 rounded-lg text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt transition-colors shrink-0","aria-label":"Open navigation menu",children:a.jsx($h,{size:20})}),a.jsxs(Ot,{to:"/app",className:"flex items-center gap-2.5 shrink-0 group select-none mr-1","aria-label":"IndianMatter Home",children:[a.jsx("img",{src:"/mi-icon-mark.png",alt:"IndianMatter",className:"w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105"}),a.jsxs("div",{className:"flex flex-col",children:[a.jsxs("span",{className:"font-headline font-bold text-[15px] sm:text-[16px] text-im-text leading-none tracking-tight",children:["Indian",a.jsx("span",{style:{color:"var(--im-orange)"},children:"Matter"})]}),a.jsx("span",{className:"text-[9px] text-im-textMuted font-normal tracking-wider uppercase mt-0.5 hidden sm:block",children:"Materials Platform"})]})]}),a.jsxs("form",{onSubmit:h,className:"relative w-56 sm:w-72 md:w-84 lg:w-96",children:[a.jsx(ia,{className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-im-textMuted pointer-events-none",size:14,"aria-hidden":"true"}),a.jsx("input",{type:"text",value:o,onChange:v=>l(v.target.value),placeholder:"Search materials, structures, tools…","aria-label":"Search materials",className:"w-full bg-im-surfaceAlt border border-im-border rounded-full py-1.5 pl-9 pr-12 text-xs text-im-text outline-none focus:border-[#D47E30] focus:bg-white transition-all placeholder:text-im-textMuted"}),a.jsx("kbd",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-im-textMuted bg-white border border-im-border px-1.5 py-0.5 rounded pointer-events-none hidden sm:inline-block",children:"⌘K"})]})]}),a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsxs("button",{"aria-label":"Notifications",className:"relative w-8 h-8 rounded-full flex items-center justify-center text-im-textLight hover:text-im-text hover:bg-im-surfaceAlt transition-colors",children:[a.jsx(US,{size:16}),a.jsx("span",{"aria-hidden":"true",className:"absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D47E30]"})]}),a.jsxs("div",{className:"relative",onMouseDown:v=>v.stopPropagation(),children:[a.jsxs("button",{onClick:()=>s(!r),"aria-expanded":r,"aria-haspopup":"menu",className:"flex items-center gap-2 p-1 pr-2.5 rounded-full border border-[#EDE8E2] bg-white hover:bg-im-surfaceAlt transition-colors",children:[a.jsxs("div",{className:"relative",children:[n!=null&&n.avatar?a.jsx("img",{src:n.avatar,alt:c,className:"w-7 h-7 rounded-full object-cover shadow-sm"}):a.jsx("div",{className:"w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm",style:{backgroundColor:"var(--im-brown, #8D5A2B)"},children:p}),d&&a.jsx("span",{className:"absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs border border-white",children:a.jsx("img",{src:"https://www.svgrepo.com/show/475656/google-color.svg",alt:"Google",className:"w-2.5 h-2.5"})})]}),a.jsxs("div",{className:"hidden sm:flex flex-col items-start leading-tight",children:[a.jsx("span",{className:"text-xs font-semibold text-im-text max-w-[120px] truncate",children:c}),d?a.jsx("span",{className:"text-[10px] text-[#1967D2] font-medium flex items-center gap-1",children:"Google"}):a.jsx("span",{className:"text-[10px] text-im-textMuted max-w-[120px] truncate",children:u})]}),a.jsx(Gh,{size:13,className:`text-im-textMuted transition-transform duration-200 ${r?"rotate-180":""}`})]}),r&&a.jsxs("div",{role:"menu",className:"absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-popover border border-im-border p-2 z-50 animate-slide-up",children:[a.jsxs("div",{className:"px-3 py-2 border-b border-im-border mb-1.5",children:[d&&a.jsxs("div",{className:"flex items-center gap-1.5 mb-1 text-[10px] font-semibold text-[#1967D2] bg-[#E8F0FE] px-2 py-0.5 rounded-full w-fit",children:[a.jsx("img",{src:"https://www.svgrepo.com/show/475656/google-color.svg",alt:"Google",className:"w-2.5 h-2.5"}),"Google Account"]}),a.jsx("p",{className:"text-xs font-bold text-im-text truncate",children:c}),a.jsx("p",{className:"text-[11px] text-im-textMuted truncate",children:u})]}),a.jsxs("button",{role:"menuitem",onClick:()=>{s(!1),e("/app/settings")},className:"w-full text-left px-3 py-2 rounded-xl text-xs text-im-text hover:bg-im-surfaceAlt transition-colors flex items-center gap-2.5",children:[a.jsx(uo,{size:13,className:"text-im-textMuted"}),"Profile & Settings"]}),a.jsxs("button",{role:"menuitem",onClick:()=>{s(!1),e("/app/saved")},className:"w-full text-left px-3 py-2 rounded-xl text-xs text-im-text hover:bg-im-surfaceAlt transition-colors flex items-center gap-2.5",children:[a.jsx(Vh,{size:13,className:"text-im-textMuted"}),"Saved Results"]}),a.jsx("div",{className:"h-px bg-im-border my-1 mx-1"}),a.jsxs("button",{role:"menuitem",onClick:m,className:"w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5 font-medium",children:[a.jsx(Qd,{size:13}),"Sign Out"]})]})]})]})]})}function Yi(){const[t,e]=L.useState(!1);return a.jsxs("div",{className:"min-h-screen bg-im-bg text-im-text font-sans flex flex-col",children:[a.jsx(lb,{onToggleMobileMenu:()=>e(!t)}),a.jsxs("div",{className:"flex-1 flex pt-16 relative",children:[a.jsx(ab,{mobileOpen:t,setMobileOpen:e}),a.jsx("div",{className:"main-offset flex flex-col flex-1 min-h-[calc(100vh-4rem)] min-w-0 border-l-0 md:border-l md:border-[#EDE8E2]",children:a.jsx("main",{className:"flex-1 overflow-auto no-scrollbar",children:a.jsx(zv,{})})})]})]})}function cb(){return a.jsx("div",{className:"min-h-screen bg-im-bg text-im-text flex flex-col font-sans",children:a.jsx("main",{className:"flex-1",children:a.jsx(zv,{})})})}const Wo=[{id:"nmc",formula:"NMC",fullName:"Lithium Nickel Manganese Cobalt Oxide",structure:"Layered Oxide",image:"/assets/mineral_nmc.png",features:["High energy density","Good cycling performance","Widely researched"],detailsUrl:"/app/materials"},{id:"lfp",formula:"LFP",fullName:"Lithium Iron Phosphate",structure:"Olivine Structure",image:"/assets/mineral_lfp.png",features:["Thermal stable","Long cycle life","Cost effective & safe"],detailsUrl:"/app/materials"},{id:"licoo2",formula:"LiCoO₂",fullName:"Lithium Cobalt Oxide",structure:"Layered Oxide",image:"/assets/mineral_licoo2.png",popular:!0,features:["High energy density","Stable structure","Widely used in LIBs"],detailsUrl:"/app/materials"},{id:"lmo",formula:"LMO",fullName:"Lithium Manganese Oxide",structure:"Spinel Structure",image:"/assets/mineral_lmo.png",features:["High power capability","Cost effective","Environmentally friendly"],detailsUrl:"/app/materials"},{id:"nca",formula:"NCA",fullName:"Lithium Nickel Cobalt Aluminium Oxide",structure:"Layered Oxide",image:"/assets/mineral_nca.png",features:["High energy density","Good thermal stability","Promising for EVs"],detailsUrl:"/app/materials"}],ub=[{id:"mp",name:"Materials Project",image:"/assets/db_mp.png",tagline:"Open-access computed material properties using DFT.",scope:"Structural, electronic, magnetic properties",org:"UC Berkeley & LBNL",popular:!0,url:"https://materialsproject.org"},{id:"oqmd",name:"OQMD",image:"/assets/db_oqmd.png",tagline:"Open Quantum Materials Database for computed materials data.",scope:"Thermodynamic, stability, structural properties",org:"Caltech & Northwestern",url:"https://oqmd.org"},{id:"jarvis",name:"JARVIS",image:"/assets/db_jarvis.png",tagline:"Joint Automated Repository for Various Integrated Simulations.",scope:"DFT, ML-ready data, high-throughput APIs",org:"NIST",url:"https://jarvis.nist.gov"},{id:"aflow",name:"AFLOW",image:"/assets/db_aflow.png",tagline:"High-throughput computational materials database.",scope:"Properties, phase diagrams & dependencies",org:"Duke University",url:"https://aflowlib.org"},{id:"nomad",name:"NOMAD",image:"/assets/db_nomad.png",tagline:"The FAIR data platform for materials science.",scope:"DFT, experimental, simulation repository",org:"EuroHPC & Max Planck",url:"https://nomad-lab.eu"}],db=[{icon:Hv,title:"Predict Properties",desc:"Faster, smarter decisions from AI-driven property predictions across thousands of materials."},{icon:ia,title:"Explore Possibilities",desc:"From data to discovery — search federated databases with periodic-table precision."},{icon:Yv,title:"Enable a Sustainable Future",desc:"Accelerating next-generation materials for a cleaner, greener world."}];function fb(){const t=Nr(),{isAuthenticated:e,user:n,signOut:i}=Lc(),[r,s]=L.useState(!1),[o,l]=L.useState(!1),c=L.useRef(null),[u,d]=L.useState("home"),[p,h]=L.useState(2);L.useState(0);const[m,v]=L.useState({name:"",email:"",subject:"",message:""}),[b,x]=L.useState("idle");L.useEffect(()=>{if(!o)return;const y=M=>{c.current&&!c.current.contains(M.target)&&l(!1)};return document.addEventListener("mousedown",y),()=>document.removeEventListener("mousedown",y)},[o]);const f=(y,M=650)=>{const A=window.scrollY||window.pageYOffset||document.documentElement.scrollTop||0,_=y-A;if(Math.abs(_)<2)return;let T=null;const R=D=>D<.5?4*D*D*D:1-Math.pow(-2*D+2,3)/2,P=D=>{T||(T=D);const I=D-T,F=Math.min(I/M,1),B=R(F);window.scrollTo(0,A+_*B),F<1&&window.requestAnimationFrame(P)};window.requestAnimationFrame(P)},g=(y,M)=>{y&&y.preventDefault();const A=(M||"explore").replace(/^#/,""),_=document.getElementById(A);if(_){const R=window.scrollY||window.pageYOffset||document.documentElement.scrollTop||0,P=_.getBoundingClientRect().top,D=Math.max(0,P+R-72);f(D,650),window.history.pushState(null,"",`#${A}`),d(A)}};L.useEffect(()=>{const y=()=>{const M=window.location.hash;if(M){const A=M.replace(/^#/,""),_=document.getElementById(A);if(_){const T=setTimeout(()=>{const P=window.scrollY||window.pageYOffset||document.documentElement.scrollTop||0,D=_.getBoundingClientRect().top,I=Math.max(0,D+P-72);f(I,650),d(A)},150);return()=>clearTimeout(T)}}};return y(),window.addEventListener("hashchange",y),()=>window.removeEventListener("hashchange",y)},[]),L.useEffect(()=>{const y=["home","explore","about","resources","contact"],M=[];return y.forEach(A=>{const _=document.getElementById(A);if(!_)return;const T=new IntersectionObserver(([R])=>{R.isIntersecting&&d(A)},{threshold:.4});T.observe(_),M.push(T)}),()=>M.forEach(A=>A.disconnect())},[]);const w=y=>{y.preventDefault(),x("loading"),setTimeout(()=>{x("success"),setTimeout(()=>{x("idle"),v({name:"",email:"",subject:"",message:""})},4e3)},1200)},S=[{href:"#home",label:"Home"},{href:"#explore",label:"Explore"},{href:"#about",label:"About"},{href:"#resources",label:"Resources"},{href:"#contact",label:"Contact"}];return a.jsxs("div",{className:"landing-page min-h-screen bg-white text-[#38240D] overflow-x-clip selection-orange",children:[a.jsx("div",{"aria-hidden":"true",className:"fixed top-[-200px] right-[-200px] w-[600px] h-[600px] pointer-events-none -z-10",style:{background:"radial-gradient(circle, rgba(253,251,212,0.5) 0%, transparent 70%)",borderRadius:"60% 40% 70% 30% / 50% 60% 40% 70%"}}),a.jsx("div",{"aria-hidden":"true",className:"fixed bottom-[-100px] left-[-150px] w-[500px] h-[500px] pointer-events-none -z-10",style:{background:"radial-gradient(circle, rgba(212,126,48,0.06) 0%, transparent 70%)",borderRadius:"40% 60% 30% 70% / 60% 40% 70% 30%"}}),a.jsxs("header",{className:"fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#EBEBEB]/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all",children:[a.jsxs("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 h-18 flex items-center justify-between gap-6",style:{height:"72px"},children:[a.jsxs(Ot,{to:"/",className:"flex items-center gap-2.5 shrink-0 group","aria-label":"IndianMatter Home",children:[a.jsx("img",{src:"/mi-icon-mark.png",alt:"","aria-hidden":"true",className:"w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105"}),a.jsxs("span",{className:"font-headline font-bold text-[22px] text-[#1A1A1A] tracking-tight",children:["Indian",a.jsx("span",{style:{color:"#D47E30"},children:"Matter"})]})]}),a.jsx("nav",{className:"hidden md:flex items-center gap-6 lg:gap-8","aria-label":"Main navigation",children:S.map(({href:y,label:M})=>{const A=y.slice(1),_=u===A;return a.jsx("a",{href:y,onClick:T=>g(T,A),className:`text-[14px] font-medium transition-all duration-150 px-3.5 py-1.5 rounded-full ${_?"text-[#D47E30] bg-[#FBF0E6] font-semibold":"text-[#6B6B6B] hover:text-[#D47E30] hover:bg-[#FDF5EE]/60"}`,"aria-current":_?"page":void 0,children:M},y)})}),a.jsxs("div",{className:"flex items-center gap-3 shrink-0",children:[a.jsx("button",{"aria-label":"Toggle light/dark mode",className:"w-9 h-9 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F2F0] transition-all",children:a.jsx(Zv,{size:17})}),e&&n?a.jsxs("div",{className:"relative hidden sm:block",ref:c,children:[a.jsxs("button",{type:"button",onClick:()=>l(!o),className:"inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-[#EDE8E2] bg-white hover:bg-[#FAF8F5] transition-all shadow-sm",children:[a.jsxs("div",{className:"relative",children:[n.avatar?a.jsx("img",{src:n.avatar,alt:n.name,className:"w-7 h-7 rounded-full object-cover shadow-xs"}):a.jsx("div",{className:"w-7 h-7 rounded-full bg-[#8D5A2B] text-white flex items-center justify-center text-xs font-bold shadow-xs",children:n.name.charAt(0).toUpperCase()}),n.isGoogle&&a.jsx("span",{className:"absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs border border-white",children:a.jsx("img",{src:"https://www.svgrepo.com/show/475656/google-color.svg",alt:"Google",className:"w-2.5 h-2.5"})})]}),a.jsxs("div",{className:"flex flex-col items-start leading-tight",children:[a.jsx("span",{className:"text-xs font-semibold text-[#1A1A1A] max-w-[120px] truncate",children:n.name}),n.isGoogle?a.jsx("span",{className:"text-[10px] text-[#1967D2] font-medium flex items-center gap-1",children:"Google"}):a.jsx("span",{className:"text-[10px] text-[#6B6B6B] max-w-[120px] truncate",children:n.email})]}),a.jsx(Gh,{size:13,className:`text-[#8C929C] transition-transform duration-200 ${o?"rotate-180":""}`})]}),o&&a.jsxs("div",{className:"absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#EDE8E2] p-2.5 z-50 animate-slide-up",children:[a.jsxs("div",{className:"px-3 py-2 border-b border-[#F2EDE6] mb-1.5",children:[n.isGoogle&&a.jsxs("div",{className:"flex items-center gap-1.5 mb-1 text-[10px] font-semibold text-[#1967D2] bg-[#E8F0FE] px-2 py-0.5 rounded-full w-fit",children:[a.jsx("img",{src:"https://www.svgrepo.com/show/475656/google-color.svg",alt:"Google",className:"w-2.5 h-2.5"}),"Google Account"]}),a.jsx("p",{className:"text-xs font-bold text-[#1A1A1A] truncate",children:n.name}),a.jsx("p",{className:"text-[11px] text-[#6B6B6B] truncate",children:n.email})]}),a.jsxs("button",{type:"button",onClick:()=>{l(!1),t("/app")},className:"w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#1A1A1A] hover:bg-[#FBF0E6] hover:text-[#D47E30] transition-colors text-left",children:[a.jsx("span",{children:"Open Workspace"}),a.jsx(Xt,{size:13})]}),a.jsx("div",{className:"h-px bg-[#EDE8E2] my-1 mx-1"}),a.jsxs("button",{type:"button",onClick:()=>{l(!1),i()},className:"w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left",children:[a.jsx(Qd,{size:13}),a.jsx("span",{children:"Sign Out"})]})]})]}):a.jsxs(Ot,{to:"/signin",className:"hidden sm:inline-flex items-center gap-2 text-[14px] font-medium px-5 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#D47E30",color:"#FFFFFF",boxShadow:"0 4px 14px rgba(212,126,48,0.32)"},onMouseEnter:y=>y.currentTarget.style.backgroundColor="#B8671E",onMouseLeave:y=>y.currentTarget.style.backgroundColor="#D47E30",children:["Sign In ",a.jsx(Xt,{size:14})]}),a.jsx("button",{onClick:()=>s(!r),className:"md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F2F2F0] transition-colors","aria-label":r?"Close menu":"Open menu","aria-expanded":r,children:r?a.jsx(Ys,{size:20}):a.jsx($h,{size:20})})]})]}),r&&a.jsxs("div",{className:"md:hidden bg-white border-t border-[#EBEBEB] px-6 py-5 space-y-1",children:[S.map(({href:y,label:M})=>a.jsx("a",{href:y,onClick:A=>{s(!1),g(A,y.slice(1))},className:`flex items-center py-2.5 px-3 rounded-lg text-[15px] font-medium transition-colors ${u===y.slice(1)?"text-[#D47E30] bg-[#FBF0E6] font-semibold":"text-[#3D3D3D] hover:text-[#D47E30]"}`,children:M},y)),e&&n?a.jsxs("div",{className:"mt-3 pt-3 border-t border-[#EBEBEB] space-y-2",children:[a.jsxs("div",{className:"px-2 py-1 flex items-center gap-2.5",children:[a.jsxs("div",{className:"relative",children:[n.avatar?a.jsx("img",{src:n.avatar,alt:n.name,className:"w-8 h-8 rounded-full object-cover"}):a.jsx("div",{className:"w-8 h-8 rounded-full bg-[#8D5A2B] text-white flex items-center justify-center text-xs font-bold",children:n.name.charAt(0).toUpperCase()}),n.isGoogle&&a.jsx("span",{className:"absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border border-white",children:a.jsx("img",{src:"https://www.svgrepo.com/show/475656/google-color.svg",alt:"",className:"w-2.5 h-2.5"})})]}),a.jsxs("div",{className:"flex flex-col min-w-0",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] truncate",children:n.name}),a.jsx("span",{className:"text-[10px] text-[#6B6B6B] truncate",children:n.email})]})]}),a.jsxs("button",{type:"button",onClick:()=>{s(!1),t("/app")},className:"w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-medium text-white",style:{backgroundColor:"#D47E30"},children:["Open Workspace ",a.jsx(Xt,{size:13})]}),a.jsxs("button",{type:"button",onClick:()=>{s(!1),i()},className:"w-full flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors",children:[a.jsx(Qd,{size:13})," Sign Out"]})]}):a.jsxs(Ot,{to:"/signin",onClick:()=>s(!1),className:"mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-medium text-white",style:{backgroundColor:"#D47E30"},children:["Sign In ",a.jsx(Xt,{size:14})]})]})]}),a.jsx("section",{id:"home",className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-24 lg:pt-36 lg:pb-32",children:a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center",children:[a.jsxs("div",{className:"lg:col-span-7 space-y-7",children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline",children:"Materials for a Better Tomorrow"}),a.jsxs("h1",{className:"text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold text-[#1A1A1A] tracking-tight leading-[1.02]",children:["Indian",a.jsx("span",{style:{color:"#D47E30"},children:"Matter"})]}),a.jsx("h2",{className:"text-xl sm:text-2xl lg:text-3xl font-headline font-light text-[#6B6B6B] tracking-wide",children:"Predict. Explore. Accelerate."}),a.jsx("p",{className:"text-base lg:text-[17px] text-[#6B6B6B] max-w-[520px] leading-relaxed",children:"AI-driven insights for next-generation materials discovery, designed for a sustainable tomorrow."}),a.jsxs("div",{className:"flex flex-wrap items-center gap-4 pt-2",children:[a.jsxs("button",{type:"button",onClick:()=>{t(e?"/app":"/signin?redirect=/app")},className:"inline-flex items-center gap-2.5 text-white text-[15px] font-medium px-8 py-3.5 rounded-full transition-all duration-120 active:scale-95 cursor-pointer",style:{backgroundColor:"#D47E30",boxShadow:"0 10px 28px rgba(212,126,48,0.32)"},onMouseEnter:y=>{y.currentTarget.style.backgroundColor="#B8671E",y.currentTarget.style.boxShadow="0 14px 36px rgba(212,126,48,0.40)"},onMouseLeave:y=>{y.currentTarget.style.backgroundColor="#D47E30",y.currentTarget.style.boxShadow="0 10px 28px rgba(212,126,48,0.32)"},children:["Start Your Research ",a.jsx(Xt,{size:16})]}),a.jsxs("a",{href:"#explore",onClick:y=>g(y,"explore"),className:"inline-flex items-center gap-2 text-[#3D3D3D] text-[15px] font-medium px-7 py-3.5 rounded-full bg-white border border-[#EBEBEB] hover:border-[#D47E30] hover:text-[#D47E30] transition-all duration-120 shadow-soft",children:["Try It ",a.jsx(Xt,{size:15})]})]}),a.jsxs("div",{className:"flex items-center gap-4 pt-4 text-[12px] text-[#9A9A9A]",children:[a.jsxs("span",{className:"flex items-center gap-1.5",children:[a.jsx(Jd,{size:13,style:{color:"#D47E30"}}),"5 Scientific Databases"]}),a.jsx("span",{className:"w-1 h-1 rounded-full bg-[#DDDBD8]"}),a.jsxs("span",{className:"flex items-center gap-1.5",children:[a.jsx(oo,{size:13,style:{color:"#D47E30"}}),"ML Property Prediction"]}),a.jsxs("span",{className:"hidden sm:flex items-center gap-1.5",children:[a.jsx("span",{className:"w-1 h-1 rounded-full bg-[#DDDBD8]"}),"DFT Validation"]})]})]}),a.jsxs("div",{className:"lg:col-span-5 relative flex items-center justify-center min-h-[340px] lg:min-h-[440px]",children:[a.jsx("div",{"aria-hidden":"true",className:"absolute inset-0 rounded-full pointer-events-none",style:{background:"radial-gradient(circle at 55% 50%, rgba(212,126,48,0.10) 0%, rgba(253,251,212,0.25) 40%, transparent 70%)"}}),a.jsxs("svg",{"aria-hidden":"true",className:"absolute inset-0 w-full h-full pointer-events-none opacity-20",viewBox:"0 0 400 400",children:[a.jsx("circle",{cx:"200",cy:"200",r:"160",fill:"none",stroke:"#D47E30",strokeWidth:"0.5",strokeDasharray:"6 8"}),a.jsx("circle",{cx:"200",cy:"200",r:"120",fill:"none",stroke:"#8D5A2B",strokeWidth:"0.4",strokeDasharray:"4 6"}),a.jsx("circle",{cx:"200",cy:"200",r:"80",fill:"none",stroke:"#D47E30",strokeWidth:"0.3",strokeDasharray:"3 5"})]}),a.jsx("span",{className:"absolute top-[18%] right-[12%] text-[10px] font-mono text-[#8D5A2B] bg-[#FDFBD4] border border-[#EDE8E2] px-2.5 py-1 rounded-full shadow-soft pointer-events-none","aria-hidden":"true",children:"LiCoO₂"}),a.jsx("span",{className:"absolute bottom-[22%] left-[8%] text-[10px] font-mono text-[#8D5A2B] bg-[#FDFBD4] border border-[#EDE8E2] px-2.5 py-1 rounded-full shadow-soft pointer-events-none","aria-hidden":"true",children:"R -3 m"}),a.jsx("span",{className:"absolute top-[42%] left-[4%] text-[10px] font-mono text-[#9A9A9A] bg-white border border-[#EBEBEB] px-2.5 py-1 rounded-full shadow-soft pointer-events-none","aria-hidden":"true",children:"Band Gap: 2.45 eV"}),a.jsx("div",{className:"relative w-[260px] sm:w-[300px] lg:w-[340px]",children:a.jsx("img",{src:"/assets/hero_molecule_clean.png",alt:"Crystal molecular structure visualization",className:"w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(141,90,43,0.18)]",style:{filter:"drop-shadow(0 24px 40px rgba(212,126,48,0.15))"}})}),a.jsx("span",{className:"absolute bottom-[8%] right-[10%] font-handwriting text-[#825E34] text-2xl leading-tight rotate-[-6deg] pointer-events-none select-none","aria-hidden":"true",children:"Crystal Paradigm"})]})]})}),a.jsx("section",{className:"bg-white border-y border-[#EBEBEB]",children:a.jsx("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16",children:a.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16",children:db.map(({icon:y,title:M,desc:A})=>a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsx("div",{className:"w-11 h-11 rounded-2xl flex items-center justify-center shrink-0",style:{backgroundColor:"#FBF0E6"},children:a.jsx(y,{size:20,style:{color:"#D47E30"},strokeWidth:1.8})}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-semibold text-[17px] text-[#1A1A1A] mb-2",children:M}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed",children:A})]})]},M))})})}),a.jsx("section",{id:"explore",className:"pt-8 pb-20 sm:pt-9 sm:pb-24 lg:pt-10 lg:pb-28 bg-white scroll-mt-[72px]",children:a.jsxs("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16",children:[a.jsxs("div",{className:"text-center mb-6 sm:mb-8",children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-2.5",children:"Material Library"}),a.jsx("h2",{className:"text-3xl sm:text-4xl lg:text-[42px] font-headline font-bold text-[#1A1A1A] tracking-tight mb-3",children:"Explore Materials"}),a.jsx("p",{className:"text-sm sm:text-base text-[#6B6B6B] max-w-xl mx-auto leading-relaxed",children:"Browse key battery and energy materials — each with structural, electronic, and thermodynamic properties."})]}),a.jsx("div",{className:"relative h-[440px] sm:h-[480px] flex items-center justify-center overflow-visible","aria-label":"Materials card deck",children:Wo.map((y,M)=>{const A=M-p,_=Math.abs(A);if(_>2)return null;const T=A===0?1:_===1?.93:.84,R=A*200,P=A*-2.5,D=10-_*3,I=_>1?.55:1,F=A===0;return a.jsxs("article",{onClick:()=>!F&&h(M),style:{position:"absolute",transform:`translateX(${R}px) scale(${T}) rotate(${P}deg)`,zIndex:D,opacity:I,transition:"all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",cursor:F?"default":"pointer"},className:"w-[280px] sm:w-[300px]","aria-label":`${y.formula} — ${y.fullName}`,children:[F&&a.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,transform:"rotate(2deg) scale(1.02) translateY(10px)",transformOrigin:"center bottom",borderRadius:"2.5rem",background:"linear-gradient(135deg, #FDF5EE 0%, #FAF0E6 100%)",border:"1px solid #EDE8E2",zIndex:-1}}),a.jsxs("div",{className:"bg-white rounded-[2.5rem] p-6 flex flex-col gap-4",style:{boxShadow:F?"0 12px 48px rgba(0,0,0,0.10)":"0 4px 16px rgba(0,0,0,0.06)",border:"1px solid #EBEBEB"},children:[y.popular&&a.jsx("span",{className:"self-start text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full",style:{backgroundColor:"#FBF0E6",color:"#D47E30"},children:"Popular"}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-bold text-3xl text-[#1A1A1A] tracking-tight",children:y.formula}),a.jsx("p",{className:"text-[11px] text-[#9A9A9A] font-medium uppercase tracking-wider mt-0.5",children:y.structure}),a.jsx("p",{className:"text-xs text-[#6B6B6B] mt-1 leading-snug",children:y.fullName})]}),a.jsx("div",{className:"h-32 bg-[#FAFAF8] rounded-2xl flex items-center justify-center border border-[#F2F2F0] overflow-hidden",children:a.jsx("img",{src:y.image,alt:`${y.formula} crystal structure`,className:"max-h-[110px] max-w-full object-contain",style:{filter:"drop-shadow(0 4px 8px rgba(141,90,43,0.12))"}})}),a.jsx("ul",{className:"space-y-1.5",children:y.features.map(B=>a.jsxs("li",{className:"flex items-center gap-2 text-[12px] text-[#6B6B6B]",children:[a.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0",style:{backgroundColor:"#D47E30"},"aria-hidden":"true"}),B]},B))}),F&&a.jsxs("button",{type:"button",onClick:()=>{t(e?y.detailsUrl:`/signin?redirect=${encodeURIComponent(y.detailsUrl)}`)},className:"mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-120 active:scale-95 cursor-pointer",style:{backgroundColor:"#D47E30"},onMouseEnter:B=>B.currentTarget.style.backgroundColor="#B8671E",onMouseLeave:B=>B.currentTarget.style.backgroundColor="#D47E30",children:["View Material ",a.jsx(Xt,{size:14})]})]})]},y.id)})}),a.jsxs("div",{className:"flex items-center justify-center gap-4 mt-8",children:[a.jsx("button",{onClick:()=>h(y=>Math.max(0,y-1)),disabled:p===0,"aria-label":"Previous material",className:"w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#D47E30] hover:text-[#D47E30] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-120",children:a.jsx(kS,{size:18})}),a.jsx("div",{className:"flex items-center gap-2",children:Wo.map((y,M)=>a.jsx("button",{onClick:()=>h(M),"aria-label":`Go to material ${M+1}`,className:"w-1.5 h-1.5 rounded-full transition-all duration-200",style:{backgroundColor:p===M?"#D47E30":"#DDDBD8",width:p===M?"20px":"6px",height:"6px",borderRadius:"3px"}},M))}),a.jsx("button",{onClick:()=>h(y=>Math.min(Wo.length-1,y+1)),disabled:p===Wo.length-1,"aria-label":"Next material",className:"w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#D47E30] hover:text-[#D47E30] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-120",children:a.jsx(OS,{size:18})})]})]})}),a.jsx("section",{id:"about",className:"py-24 lg:py-32 bg-white border-y border-[#EBEBEB] scroll-mt-[72px]",children:a.jsx("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16",children:a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center",children:[a.jsx("div",{className:"relative flex items-center justify-center",children:a.jsxs("div",{className:"relative w-full max-w-[400px]",children:[a.jsx("div",{"aria-hidden":"true",className:"absolute inset-[-10%] pointer-events-none",style:{background:"radial-gradient(circle, rgba(253,251,212,0.6) 0%, transparent 70%)"}}),a.jsxs("svg",{viewBox:"0 0 400 400",className:"w-full h-auto","aria-label":"Crystal lattice visualization",children:[[80,160,240,320].map(y=>[80,160,240,320].map(M=>a.jsxs("g",{children:[y<320&&a.jsx("line",{x1:y,y1:M,x2:y+80,y2:M,stroke:"#D47E30",strokeWidth:"0.8",strokeOpacity:"0.25"}),M<320&&a.jsx("line",{x1:y,y1:M,x2:y,y2:M+80,stroke:"#D47E30",strokeWidth:"0.8",strokeOpacity:"0.25"}),y<320&&M<320&&a.jsxs(a.Fragment,{children:[a.jsx("line",{x1:y,y1:M,x2:y+80,y2:M+80,stroke:"#8D5A2B",strokeWidth:"0.5",strokeOpacity:"0.12"}),a.jsx("line",{x1:y+80,y1:M,x2:y,y2:M+80,stroke:"#8D5A2B",strokeWidth:"0.5",strokeOpacity:"0.12"})]})]},`${y}-${M}`))),[80,160,240,320].map(y=>[80,160,240,320].map(M=>{const A=y===200||M===200;return a.jsxs("g",{children:[a.jsx("circle",{cx:y,cy:M,r:A?8:5,fill:y===200&&M===200?"#D47E30":A?"#8D5A2B":"white",stroke:"#D47E30",strokeWidth:y===200&&M===200?0:1.2,strokeOpacity:"0.45"}),y===200&&M===200&&a.jsx("circle",{cx:200,cy:200,r:20,fill:"none",stroke:"#D47E30",strokeWidth:"1",strokeOpacity:"0.2"})]},`atom-${y}-${M}`)})),a.jsx("text",{x:"210",y:"195",fontSize:"9",fill:"#8D5A2B",fontFamily:"JetBrains Mono, monospace",opacity:"0.7",children:"Li"}),a.jsx("text",{x:"162",y:"165",fontSize:"8",fill:"#9A9A9A",fontFamily:"JetBrains Mono, monospace",opacity:"0.6",children:"Co"}),a.jsx("text",{x:"242",y:"165",fontSize:"8",fill:"#9A9A9A",fontFamily:"JetBrains Mono, monospace",opacity:"0.6",children:"O"})]}),a.jsx("div",{className:"absolute inset-0 flex items-center justify-center pointer-events-none",children:a.jsx("img",{src:"/assets/about_lattice_clean.png",alt:"Crystal lattice model",className:"w-[55%] h-auto object-contain",style:{filter:"drop-shadow(0 8px 24px rgba(141,90,43,0.16))",mixBlendMode:"multiply"}})})]})}),a.jsxs("div",{className:"space-y-8",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-3",children:"Our Approach"}),a.jsx("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight mb-4",children:"The Crystal Paradigm"}),a.jsxs("p",{className:"text-base text-[#6B6B6B] leading-relaxed",children:[a.jsx("strong",{className:"text-[#3D3D3D] font-semibold",children:"Inherent Matters."})," ","Every material's behaviour — conductivity, stability, reactivity — is encoded in its crystal structure. IndianMatter was built on this principle."]})]}),a.jsx("div",{className:"space-y-6",children:[{icon:oo,title:"Crystal-Centric Approach",desc:"We treat crystallographic data as the ground truth for all property predictions and validations."},{icon:Hv,title:"Property Prediction",desc:"Surrogate ML models trained on DFT datasets enable fast, accurate property screening without expensive simulations."},{icon:Yv,title:"Sustainable Impact",desc:"Accelerating discovery of materials that enable cleaner energy, lighter batteries, and greener chemistry."}].map(({icon:y,title:M,desc:A})=>a.jsxs("div",{className:"flex gap-4",children:[a.jsx("div",{className:"w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",style:{backgroundColor:"#FBF0E6"},children:a.jsx(y,{size:18,style:{color:"#D47E30"},strokeWidth:1.8})}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-semibold text-[15px] text-[#1A1A1A] mb-1",children:M}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed",children:A})]})]},M))})]})]})})}),a.jsx("section",{id:"resources",className:"pt-8 pb-20 sm:pt-9 sm:pb-24 lg:pt-10 lg:pb-28 bg-white scroll-mt-[72px]",children:a.jsxs("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16",children:[a.jsxs("div",{className:"text-center mb-6 sm:mb-8",children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-2.5",children:"Connected Sources"}),a.jsx("h2",{className:"text-3xl sm:text-4xl lg:text-[42px] font-headline font-bold text-[#1A1A1A] tracking-tight mb-3",children:"Scientific Databases"}),a.jsx("p",{className:"text-sm sm:text-base text-[#6B6B6B] max-w-xl mx-auto leading-relaxed",children:"IndianMatter federates across the world's leading open-access computational materials databases."})]}),a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",children:ub.map(y=>a.jsxs("a",{href:y.url,target:"_blank",rel:"noopener noreferrer",className:"group bg-white rounded-3xl p-6 border border-[#EBEBEB] hover:border-[#D47E30]/40 hover:shadow-card-hover transition-all duration-200 flex flex-col gap-4",children:[a.jsxs("div",{className:"flex items-start justify-between",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-10 h-10 rounded-xl bg-[#FAFAF8] border border-[#F2F2F0] flex items-center justify-center overflow-hidden",children:a.jsx("img",{src:y.image,alt:y.name,className:"w-7 h-7 object-contain"})}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-bold text-[15px] text-[#1A1A1A]",children:y.name}),y.popular&&a.jsx("span",{className:"text-[9px] font-bold tracking-wider uppercase text-[#D47E30]",children:"Most Popular"})]})]}),a.jsx(Xh,{size:14,className:"text-[#DDDBD8] group-hover:text-[#D47E30] transition-colors shrink-0 mt-1"})]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed",children:y.tagline}),a.jsxs("div",{className:"mt-auto pt-2 border-t border-[#F2F2F0]",children:[a.jsx("p",{className:"text-[11px] text-[#9A9A9A]",children:y.scope}),a.jsxs("p",{className:"text-[11px] font-medium text-[#6B6B6B] mt-0.5",children:["by ",y.org]})]})]},y.id))})]})}),a.jsx("section",{id:"contact",className:"pt-8 pb-16 sm:pt-9 sm:pb-20 lg:pt-10 lg:pb-24 bg-white border-t border-[#EBEBEB] scroll-mt-[72px]",children:a.jsx("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16",children:a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start",children:[a.jsxs("div",{className:"space-y-6 sm:space-y-7",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.25em] uppercase text-[#9A9A9A] font-headline mb-2.5",children:"Get in Touch"}),a.jsx("h2",{className:"text-3xl sm:text-4xl lg:text-[42px] font-headline font-bold text-[#1A1A1A] tracking-tight mb-3",children:"Contact"}),a.jsx("p",{className:"text-sm sm:text-base text-[#6B6B6B] leading-relaxed max-w-md",children:"For research partnerships, questions about the platform, or collaboration opportunities — we'd love to hear from you."})]}),a.jsx("div",{className:"space-y-4",children:[{icon:Kv,label:"Email",value:"research@indianmatter.ai"},{icon:KS,label:"Location",value:"India"},{icon:nb,label:"Collaboration",value:"Open to research partnerships"}].map(({icon:y,label:M,value:A})=>a.jsxs("div",{className:"flex items-center gap-3.5",children:[a.jsx("div",{className:"w-9 h-9 rounded-xl flex items-center justify-center shrink-0",style:{backgroundColor:"#FBF0E6"},children:a.jsx(y,{size:16,style:{color:"#D47E30"},strokeWidth:1.8})}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] text-[#9A9A9A] uppercase tracking-wider font-medium",children:M}),a.jsx("p",{className:"text-sm text-[#3D3D3D] font-medium mt-0.5",children:A})]})]},M))}),a.jsx("div",{className:"pt-2 pointer-events-none select-none opacity-60",children:a.jsx("img",{src:"/assets/contact_crystal.png",alt:"","aria-hidden":"true",className:"w-20 h-auto object-contain",style:{filter:"drop-shadow(0 4px 8px rgba(141,90,43,0.15))"}})})]}),a.jsx("div",{children:a.jsxs("form",{onSubmit:w,className:"bg-[#FAFAF8] rounded-3xl p-6 sm:p-7 border border-[#EBEBEB] space-y-4","aria-label":"Contact form",noValidate:!0,children:[a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3.5",children:[a.jsxs("div",{children:[a.jsxs("label",{htmlFor:"contact-name",className:"block text-[12px] font-medium text-[#3D3D3D] mb-1",children:["Name ",a.jsx("span",{className:"text-[#D47E30]",children:"*"})]}),a.jsx("input",{id:"contact-name",type:"text",required:!0,value:m.name,onChange:y=>v({...m,name:y.target.value}),placeholder:"Your full name",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"})]}),a.jsxs("div",{children:[a.jsxs("label",{htmlFor:"contact-email",className:"block text-[12px] font-medium text-[#3D3D3D] mb-1",children:["Email ",a.jsx("span",{className:"text-[#D47E30]",children:"*"})]}),a.jsx("input",{id:"contact-email",type:"email",required:!0,value:m.email,onChange:y=>v({...m,email:y.target.value}),placeholder:"you@institution.edu",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"})]})]}),a.jsxs("div",{children:[a.jsx("label",{htmlFor:"contact-subject",className:"block text-[12px] font-medium text-[#3D3D3D] mb-1",children:"Subject"}),a.jsx("input",{id:"contact-subject",type:"text",value:m.subject,onChange:y=>v({...m,subject:y.target.value}),placeholder:"Research collaboration / Query / Other",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8]"})]}),a.jsxs("div",{children:[a.jsxs("label",{htmlFor:"contact-message",className:"block text-[12px] font-medium text-[#3D3D3D] mb-1",children:["Message ",a.jsx("span",{className:"text-[#D47E30]",children:"*"})]}),a.jsx("textarea",{id:"contact-message",required:!0,rows:4,value:m.message,onChange:y=>v({...m,message:y.target.value}),placeholder:"Tell us about your research interest or question...",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#D47E30] transition-colors placeholder:text-[#DDDBD8] resize-none"})]}),b==="success"?a.jsxs("div",{className:"flex items-center gap-2.5 py-3 px-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700",children:[a.jsx(Wh,{size:16,className:"shrink-0"}),"Thank you! We'll be in touch soon."]}):a.jsx("button",{type:"submit",disabled:b==="loading",className:"w-full flex items-center justify-center gap-2.5 py-3 rounded-full text-white text-sm font-medium transition-all duration-120 active:scale-[0.98] disabled:opacity-70",style:{backgroundColor:"#D47E30"},onMouseEnter:y=>{b!=="loading"&&(y.currentTarget.style.backgroundColor="#B8671E")},onMouseLeave:y=>y.currentTarget.style.backgroundColor="#D47E30",children:b==="loading"?a.jsxs(a.Fragment,{children:[a.jsx(qS,{size:16,className:"animate-spin"}),"Sending…"]}):a.jsxs(a.Fragment,{children:["Send Message ",a.jsx(Xt,{size:15})]})})]})})]})})}),a.jsx("footer",{className:"border-t border-[#EBEBEB] bg-white",children:a.jsxs("div",{className:"max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 flex flex-col sm:flex-row items-center justify-between gap-4",children:[a.jsxs("div",{className:"flex items-center gap-2.5",children:[a.jsx("img",{src:"/mi-icon-mark.png",alt:"","aria-hidden":"true",className:"w-6 h-6 object-contain"}),a.jsxs("span",{className:"font-headline font-bold text-[15px] text-[#1A1A1A]",children:["Indian",a.jsx("span",{style:{color:"#D47E30"},children:"Matter"})]})]}),a.jsxs("p",{className:"text-[12px] text-[#9A9A9A] text-center",children:["© ",new Date().getFullYear()," IndianMatter. Computational materials research platform."]}),a.jsxs("div",{className:"flex items-center gap-5 text-[12px] text-[#6B6B6B]",children:[a.jsx("a",{href:"#",className:"hover:text-[#D47E30] transition-colors",children:"Privacy"}),a.jsx("a",{href:"#",className:"hover:text-[#D47E30] transition-colors",children:"Terms"}),a.jsx(Ot,{to:"/signin",className:"hover:text-[#D47E30] transition-colors",children:"Sign In"})]})]})})]})}const hb={}.VITE_GOOGLE_CLIENT_ID||"1084224754546-placeholder.apps.googleusercontent.com";function pb(){const t=Nr(),e=Hi(),{isAuthenticated:n,signIn:i,signInWithGoogle:r}=Lc(),[s,o]=L.useState(!1),[l,c]=L.useState(""),[u,d]=L.useState(""),[p,h]=L.useState(!0),[m,v]=L.useState(!1),[b,x]=L.useState(""),f=new URLSearchParams(e.search).get("redirect")||"/app";L.useEffect(()=>{n&&t(f,{replace:!0})},[n,f,t]);const g=y=>{y.preventDefault(),v(!0),x("");const M=l.trim()||"researcher@indianmatter.org";i({email:M,name:M.includes("@")?M.split("@")[0]:M,isGoogle:M.toLowerCase().includes("gmail.com")||M.toLowerCase().includes("google.com")}),v(!1),t(f,{replace:!0})},w=y=>{v(!0),x("");try{if(y.credential)try{const A=y.credential.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),_=decodeURIComponent(atob(A).split("").map(R=>"%"+("00"+R.charCodeAt(0).toString(16)).slice(-2)).join("")),T=JSON.parse(_);r({name:T.name||"Dr. Subodh Kumar",email:T.email||"subodh.matter@gmail.com",avatar:T.picture||"https://lh3.googleusercontent.com/a/default-user=s96-c"}),t(f,{replace:!0});return}catch{}r(),t(f,{replace:!0})}finally{v(!1)}},S=()=>{r({name:"Dr. Subodh Kumar",email:"subodh.matter@gmail.com",isGoogle:!0}),t(f,{replace:!0})};return a.jsx(Nv,{clientId:hb,children:a.jsxs("div",{className:"min-h-screen bg-white text-[#1E2227] flex flex-col justify-between relative overflow-x-hidden font-sans selection:bg-[#F1641D]/20 selection:text-[#F1641D]",children:[a.jsx("div",{className:"fixed top-0 left-[-120px] w-[320px] h-[750px] bg-[#F8DFCB]/40 rounded-[100%] blur-3xl pointer-events-none -z-10 transform -rotate-12"}),a.jsx("div",{className:"fixed top-[40%] right-[-140px] w-[380px] h-[850px] bg-[#F8DFCB]/50 rounded-[100%] blur-3xl pointer-events-none -z-10 transform rotate-12"}),a.jsx("div",{className:"fixed bottom-0 left-[-80px] w-[340px] h-[600px] bg-[#F8DFCB]/30 rounded-[100%] blur-3xl pointer-events-none -z-10"}),a.jsx("div",{className:"fixed bottom-0 right-0 w-44 md:w-64 opacity-80 pointer-events-none -z-10",children:a.jsx("img",{src:"/assets/signin_molecule.png",alt:"",className:"w-full h-auto object-contain"})}),a.jsxs("header",{className:"w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 h-20 flex items-center justify-between border-b border-[#F0E5D9]/50",children:[a.jsxs(Ot,{to:"/",className:"flex items-center gap-3",children:[a.jsx("img",{src:"/mi-icon-mark.png",alt:"IndianMatter",className:"w-8 h-8 object-contain"}),a.jsxs("span",{className:"font-headline font-bold text-xl tracking-tight text-[#1E2227]",children:["Indian",a.jsx("span",{className:"text-[#F1641D]",children:"Matter"})]})]}),a.jsxs("nav",{className:"hidden md:flex items-center gap-8 text-[14px] font-medium text-[#5F6771]",children:[a.jsx(Ot,{to:"/",className:"hover:text-[#F1641D] transition-colors",children:"Home"}),a.jsx(Ot,{to:"/#explore",className:"hover:text-[#F1641D] transition-colors",children:"Explore"}),a.jsx(Ot,{to:"/#about",className:"hover:text-[#F1641D] transition-colors",children:"About"}),a.jsx(Ot,{to:"/#resources",className:"hover:text-[#F1641D] transition-colors",children:"Resources"}),a.jsx(Ot,{to:"/#contact",className:"hover:text-[#F1641D] transition-colors",children:"Contact"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx("button",{"aria-label":"Theme toggle",className:"w-9 h-9 rounded-full flex items-center justify-center text-[#5F6771] hover:text-[#1E2227] hover:bg-black/5 transition-all",children:a.jsx(Zv,{size:18,strokeWidth:1.8})}),a.jsx("button",{className:"bg-[#F1641D] text-white px-6 py-2 rounded-full text-[14px] font-medium opacity-90 cursor-default",children:"Sign In"})]})]}),a.jsx("main",{className:"flex-1 flex items-center justify-center px-4 sm:px-6 py-8",children:a.jsxs("div",{className:"w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white overflow-hidden flex flex-col md:flex-row min-h-[580px]",children:[a.jsxs("div",{className:"md:w-5/12 bg-[#FAF4EE] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden",children:[a.jsxs("div",{className:"relative z-10 space-y-4",children:[a.jsx("div",{className:"w-10 h-1 bg-[#F1641D] rounded-full"}),a.jsxs("div",{children:[a.jsx("p",{className:"text-xs font-semibold text-[#8C929C] uppercase tracking-wider",children:"Welcome to"}),a.jsxs("h1",{className:"text-3xl font-headline font-bold text-[#1E2227] tracking-tight mt-1",children:["Indian",a.jsx("span",{className:"text-[#F1641D]",children:"Matter"})]}),a.jsx("p",{className:"text-xs font-medium text-[#5F6771] mt-0.5",children:"Materials for a Brighter Tomorrow"})]}),a.jsx("p",{className:"text-xs text-[#6C737E] leading-relaxed max-w-[260px]",children:"Sign in to explore, predict and accelerate materials discovery with the power of data and crystal structures."})]}),a.jsxs("div",{className:"relative mt-8 flex items-end justify-between",children:[a.jsx("div",{className:"w-48 sm:w-56 -ml-4 -mb-4",children:a.jsx("img",{src:"/assets/signin_crystal.png",alt:"Crystal Specimen",className:"w-full h-auto object-contain drop-shadow-lg select-none pointer-events-none"})}),a.jsxs("div",{className:"text-right pb-4 -mr-2",children:[a.jsxs("p",{className:"font-handwriting text-[#5B636E] text-xl leading-tight -rotate-3",children:["Science",a.jsx("br",{}),"Today",a.jsx("br",{}),"A Brighter",a.jsx("br",{}),"Tomorrow"]}),a.jsx("div",{className:"w-8 h-[2px] bg-[#F1641D] ml-auto mt-1"})]})]})]}),a.jsxs("div",{className:"md:w-7/12 bg-white p-8 sm:p-12 flex flex-col justify-center",children:[a.jsx("h2",{className:"text-3xl font-headline font-bold text-[#1E2227] tracking-tight",children:"Sign In"}),a.jsx("p",{className:"text-xs text-[#6C737E] mt-1 mb-6",children:"Welcome back! Continue your journey with IndianMatter."}),b&&a.jsxs("div",{className:"mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2",children:[a.jsx(Hh,{size:14})," ",b]}),a.jsxs("div",{className:"space-y-3 mb-6",children:[a.jsx("div",{className:"w-full flex justify-center",children:a.jsx(TE,{onSuccess:w,onError:S,theme:"outline",shape:"pill",text:"signin_with",width:"320"})}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[a.jsxs("button",{type:"button",onClick:S,className:"flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#E9DFD4] rounded-xl hover:bg-[#FAF4EE] text-xs font-semibold text-[#1E2227] transition-all active:scale-98",children:[a.jsx("img",{src:"https://www.svgrepo.com/show/475656/google-color.svg",alt:"Google",className:"w-4 h-4"}),"Quick Google Sign In"]}),a.jsxs("button",{type:"button",onClick:()=>{i({name:"GitHub Researcher",email:"researcher@github.com",provider:"github"}),t(f,{replace:!0})},className:"flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#E9DFD4] rounded-xl hover:bg-[#FAF4EE] text-xs font-semibold text-[#1E2227] transition-all active:scale-98",children:[a.jsx("img",{src:"https://www.svgrepo.com/show/512317/github-142.svg",alt:"GitHub",className:"w-4 h-4"}),"Continue with GitHub"]})]})]}),a.jsxs("div",{className:"relative my-3 text-center",children:[a.jsx("div",{className:"absolute inset-0 flex items-center",children:a.jsx("div",{className:"w-full border-t border-[#EFE5DC]"})}),a.jsx("span",{className:"relative bg-white px-3 text-[11px] text-[#9EA4AD]",children:"or with email"})]}),a.jsxs("form",{onSubmit:g,className:"space-y-4",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-medium text-[#1E2227] mb-1.5",children:"Email"}),a.jsxs("div",{className:"relative",children:[a.jsx(Kv,{className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]",size:16}),a.jsx("input",{type:"email",required:!0,value:l,onChange:y=>c(y.target.value),placeholder:"researcher@university.edu",className:"w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors placeholder:text-[#9EA4AD]"})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-medium text-[#1E2227] mb-1.5",children:"Password"}),a.jsxs("div",{className:"relative",children:[a.jsx(YS,{className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]",size:16}),a.jsx("input",{type:s?"text":"password",required:!0,value:u,onChange:y=>d(y.target.value),placeholder:"Enter your password",className:"w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors placeholder:text-[#9EA4AD]"}),a.jsx("button",{type:"button",onClick:()=>o(!s),className:"absolute right-3 top-1/2 -translate-y-1/2 text-[#8C929C] hover:text-[#1E2227]",children:s?a.jsx(zS,{size:15}):a.jsx($v,{size:15})})]})]}),a.jsxs("div",{className:"flex items-center justify-between text-xs pt-1",children:[a.jsxs("label",{className:"flex items-center gap-2 cursor-pointer select-none",children:[a.jsx("input",{type:"checkbox",checked:p,onChange:y=>h(y.target.checked),className:"accent-[#F1641D] rounded cursor-pointer"}),a.jsx("span",{className:"text-[#6C737E]",children:"Remember me"})]}),a.jsx("a",{href:"#forgot",className:"text-[#F1641D] font-medium hover:underline",children:"Forgot password?"})]}),a.jsxs("button",{type:"submit",disabled:m,className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft flex items-center justify-center gap-2 active:scale-98 mt-2 disabled:opacity-50",children:[m?"Authenticating...":"Sign In"," ",a.jsx(Xt,{size:14})]})]}),a.jsxs("p",{className:"text-center text-xs text-[#6C737E] mt-6",children:["Don't have an account?"," ",a.jsx(Ot,{to:"/signin",className:"text-[#F1641D] font-semibold hover:underline",children:"Sign Up"})]})]})]})}),a.jsxs("footer",{className:"py-6 text-center",children:[a.jsx("p",{className:"text-[10px] tracking-[0.25em] font-bold text-[#9EA4AD] uppercase font-headline",children:"MATERIALS FOR A BRIGHTER TOMORROW"}),a.jsx("div",{className:"w-10 h-[2px] bg-[#F1641D] mx-auto mt-2"})]})]})})}function xa({children:t,backColor:e="linear-gradient(135deg, #FDF5EE 0%, #FAF0E6 100%)",backBorder:n="1px solid #EDE8E2",backRotation:i=1.5}){return a.jsxs("div",{className:"relative",children:[a.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,background:e,border:n,borderRadius:"2.5rem",transform:`rotate(${i}deg) scale(1.025) translateY(10px)`,transformOrigin:"center bottom",zIndex:0}}),a.jsx("div",{style:{position:"relative",zIndex:1,backgroundColor:"#FFFFFF",borderRadius:"2.5rem",border:"1px solid #EBEBEB",boxShadow:"0 8px 40px rgba(0,0,0,0.06)"},children:t})]})}function Pt({icon:t,label:e,accent:n="#D47E30"}){return a.jsxs("div",{className:"flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#1A1A1A]",style:{backgroundColor:"#FFFFFF",borderColor:"#EBEBEB"},children:[a.jsx(t,{size:14,strokeWidth:1.8,style:{color:n}}),a.jsx("span",{children:e})]})}function Jm(){const t=Nr(),[e,n]=L.useState("Li3PS4"),[i,r]=L.useState("Electrolyte"),[s,o]=L.useState("formula"),[l,c]=L.useState(["GNN"]),u=d=>{c(p=>p.includes(d)?p.filter(h=>h!==d):[...p,d])};return a.jsxs("div",{className:"w-full max-w-[1100px] mx-auto space-y-6 px-6 sm:px-8 py-8",children:[a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-6",children:[a.jsxs("div",{className:"space-y-1.5",children:[a.jsx("p",{className:"text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A9A9A] font-headline",children:"Welcome Back 👋"}),a.jsxs("h1",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["Let's Explore ",a.jsx("span",{style:{color:"#D47E30"},children:"Materials"})]}),a.jsx("p",{className:"text-sm text-[#6B6B6B]",children:"Powerful tools for a sustainable and innovative future."})]}),a.jsx("div",{className:"shrink-0 pointer-events-none select-none opacity-80",children:a.jsx("img",{src:"/assets/dash_mountains.png",alt:"","aria-hidden":"true",className:"w-44 sm:w-52 h-auto object-contain"})})]}),a.jsx(xa,{backColor:"linear-gradient(135deg, #FDF5EE 0%, #FAF0E6 100%)",backBorder:"1px solid #EDE8E2",backRotation:1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-5 space-y-6",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1",style:{color:"#D47E30"},children:"01 / 05 — Prediction & Validation"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["DFT",a.jsx("br",{}),"Validation"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Compare ML-predicted properties with high-accuracy DFT calculations for reliable material insights."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Pt,{icon:Kd,label:"Structure Optimization"}),a.jsx(Pt,{icon:Km,label:"Energy Calculation"}),a.jsx(Pt,{icon:lo,label:"Electronic Properties"}),a.jsx(Pt,{icon:Er,label:"Stability Analysis"})]})]}),a.jsx("div",{className:"lg:col-span-3 flex items-center justify-center pointer-events-none select-none",children:a.jsx("div",{className:"w-48 sm:w-56",children:a.jsx("img",{src:"/assets/dash_c1_crystal.png",alt:"DFT crystal specimen",className:"w-full h-auto object-contain",style:{filter:"drop-shadow(0 12px 28px rgba(141,90,43,0.20))"}})})}),a.jsxs("div",{className:"lg:col-span-4 space-y-4",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A]",children:"Energy Comparison"}),a.jsx(Ym,{size:13,className:"text-[#9A9A9A]"})]}),a.jsxs("div",{className:"flex items-center gap-3 text-[10px] text-[#6B6B6B] mb-2",children:[a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2 h-2 rounded-full",style:{backgroundColor:"#D47E30"}}),"DFT Ground Truth"]}),a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2 h-2 rounded-full bg-blue-500"}),"ML Prediction"]})]}),a.jsxs("svg",{viewBox:"0 0 240 72",className:"w-full h-16",children:[a.jsx("line",{x1:"0",y1:"18",x2:"240",y2:"18",stroke:"#F2F2F0",strokeDasharray:"3,3"}),a.jsx("line",{x1:"0",y1:"36",x2:"240",y2:"36",stroke:"#F2F2F0",strokeDasharray:"3,3"}),a.jsx("line",{x1:"0",y1:"54",x2:"240",y2:"54",stroke:"#F2F2F0",strokeDasharray:"3,3"}),a.jsx("path",{d:"M 0 18 Q 60 44 120 54 T 240 60",fill:"none",stroke:"#D47E30",strokeWidth:"2",strokeLinecap:"round"}),[0,60,120,180,240].map((d,p)=>{const h=[18,44,54,58,60];return a.jsx("circle",{cx:d,cy:h[p],r:"3",fill:"#D47E30"},p)}),a.jsx("path",{d:"M 0 28 Q 60 48 120 56 T 240 59",fill:"none",stroke:"#3B82F6",strokeWidth:"2",strokeLinecap:"round"}),[0,60,120,180,240].map((d,p)=>{const h=[28,48,56,58,59];return a.jsx("circle",{cx:d,cy:h[p],r:"3",fill:"#3B82F6"},p)})]})]}),a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB] space-y-2",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block mb-2",children:"Key Properties"}),[["Band Gap","2.1 eV"],["Formation Energy","−1.25 eV/atom"],["Ionic Conductivity","1.2 × 10⁻⁵ S/cm"],["Space Group","P2₁/c"]].map(([d,p])=>a.jsxs("div",{className:"flex justify-between text-xs",children:[a.jsx("span",{className:"text-[#6B6B6B]",children:d}),a.jsx("span",{className:"font-medium text-[#1A1A1A] font-mono",children:p})]},d)),a.jsx("p",{className:"text-[10px] text-[#9A9A9A] pt-1 italic",children:"Demo values — use tool for real predictions"})]}),a.jsxs("div",{className:"flex justify-end items-center gap-4",children:[a.jsx("button",{onClick:()=>t("/app/dft"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"}),a.jsxs("button",{onClick:()=>t("/app/dft"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#D47E30",boxShadow:"0 6px 20px rgba(212,126,48,0.28)"},onMouseEnter:d=>d.currentTarget.style.backgroundColor="#B8671E",onMouseLeave:d=>d.currentTarget.style.backgroundColor="#D47E30",children:["Launch Tool ",a.jsx(Xt,{size:14})]})]})]})]})}),a.jsx(xa,{backColor:"linear-gradient(135deg, #EEF4FE 0%, #E6EFFD 100%)",backBorder:"1px solid #D5E5FA",backRotation:-1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-4 space-y-4 lg:order-3",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB] space-y-3",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block",children:"Input / Generate"}),a.jsx("div",{className:"flex border-b border-[#EBEBEB] text-xs gap-1",children:["formula","existing"].map(d=>a.jsx("button",{onClick:()=>o(d),className:"pb-1.5 font-semibold text-xs border-b-2 mr-3 transition-all capitalize",style:{borderColor:s===d?"#2563EB":"transparent",color:s===d?"#2563EB":"#9A9A9A"},children:d==="formula"?"From Formula":"From CIF"},d))}),a.jsx("input",{type:"text",value:e,onChange:d=>n(d.target.value),placeholder:"e.g. Li3PS4","aria-label":"Chemical formula",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2563EB] transition-colors"}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-[11px] text-[#6B6B6B] mb-1",children:"Material Type"}),a.jsxs("select",{value:i,onChange:d=>r(d.target.value),"aria-label":"Material type",className:"w-full bg-white border border-[#EBEBEB] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#2563EB] transition-colors",children:[a.jsx("option",{children:"Electrolyte"}),a.jsx("option",{children:"Cathode"}),a.jsx("option",{children:"Anode"}),a.jsx("option",{children:"Solid-State Conductor"})]})]}),a.jsxs("button",{onClick:()=>t("/app/cif-gen"),className:"w-full bg-[#2563EB] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5",children:["Generate CIF ",a.jsx(Xt,{size:13})]})]}),a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block mb-2",children:"CIF Preview"}),a.jsx("pre",{className:"text-[10px] font-mono text-[#6B6B6B] leading-relaxed overflow-x-auto",children:`data_${e}
_symmetry_space_group_name_H-M  "P2_1/c"
_cell_length_a  8.693
_cell_length_b  10.222
_cell_length_c  6.345
_cell_angle_beta  90.000
...`})]})]}),a.jsx("div",{className:"lg:col-span-3 flex items-center justify-center pointer-events-none select-none lg:order-2",children:a.jsx("div",{className:"w-48 sm:w-52",children:a.jsx("img",{src:"/assets/dash_c2_crystal.png",alt:"CIF crystal specimen",className:"w-full h-auto object-contain",style:{filter:"drop-shadow(0 12px 28px rgba(37,99,235,0.15))"}})})}),a.jsxs("div",{className:"lg:col-span-5 space-y-6 lg:order-1",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#2563EB]",children:"02 / 05 — Structure & File Generation"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["CIF",a.jsx("br",{}),"Generation"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Generate CIF files from chemical formulas or existing structures. Supports doped structures and material families."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Pt,{icon:qv,label:"Formula to CIF",accent:"#2563EB"}),a.jsx(Pt,{icon:oo,label:"Doped Structures",accent:"#2563EB"}),a.jsx(Pt,{icon:uo,label:"Structure Optimization",accent:"#2563EB"}),a.jsx(Pt,{icon:Jd,label:"Multiple Formats",accent:"#2563EB"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsxs("button",{onClick:()=>t("/app/cif-gen"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#2563EB",boxShadow:"0 6px 20px rgba(37,99,235,0.25)"},onMouseEnter:d=>d.currentTarget.style.backgroundColor="#1D4ED8",onMouseLeave:d=>d.currentTarget.style.backgroundColor="#2563EB",children:["Launch Tool ",a.jsx(Xt,{size:14})]}),a.jsx("button",{onClick:()=>t("/app/cif-gen"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"})]})]})]})}),a.jsx(xa,{backColor:"linear-gradient(135deg, #EEFAF4 0%, #E6F8EF 100%)",backBorder:"1px solid #C6F0D6",backRotation:1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-5 space-y-6",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#059669]",children:"03 / 05 — Property Prediction"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["Property",a.jsx("br",{}),"Prediction"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Predict key material properties using state-of-the-art graph neural network models."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Pt,{icon:oc,label:"Ionic Conductivity",accent:"#059669"}),a.jsx(Pt,{icon:Km,label:"Band Gap",accent:"#059669"}),a.jsx(Pt,{icon:Er,label:"Formation Energy",accent:"#059669"}),a.jsx(Pt,{icon:Zd,label:"Multiple Models",accent:"#059669"})]})]}),a.jsxs("div",{className:"lg:col-span-3 flex flex-col items-center justify-center pointer-events-none select-none gap-3",children:[a.jsxs("p",{className:"font-handwriting text-[#059669] text-2xl leading-tight -rotate-6 text-center",children:["Predict",a.jsx("br",{}),"Accelerate",a.jsx("br",{}),"Innovate"]}),a.jsx("div",{className:"w-44",children:a.jsx("img",{src:"/assets/hero_molecule_clean.png",alt:"Property prediction molecules",className:"w-full h-auto object-contain",style:{filter:"drop-shadow(0 8px 20px rgba(5,150,105,0.14))"}})})]}),a.jsxs("div",{className:"lg:col-span-4 space-y-4",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]",children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A]",children:"Ionic Conductivity"}),a.jsx(Ym,{size:13,className:"text-[#9A9A9A]"})]}),a.jsxs("div",{className:"flex items-center gap-3 text-[10px] text-[#6B6B6B] mb-2",children:[a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2 h-2 rounded-full",style:{backgroundColor:"#D47E30"}}),"True"]}),a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2 h-2 rounded-full bg-[#059669]"}),"Predicted"]})]}),a.jsx("svg",{viewBox:"0 0 240 72",className:"w-full h-16",children:[[30,38],[60,48],[90,36],[120,52],[150,44],[180,40],[210,46]].map(([d,p],h)=>a.jsxs("g",{children:[a.jsx("circle",{cx:d,cy:p,r:"3.5",fill:"#D47E30",opacity:"0.75"}),a.jsx("circle",{cx:d+5,cy:p+(h%2===0?-3:3),r:"3.5",fill:"#059669",opacity:"0.75"})]},h))})]}),a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB] space-y-2.5",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block",children:"Model Selection"}),["GNN (Graph Neural Network)","M3GNet","CHGNet","ALIGNN"].map(d=>{const p=d.split(" ")[0],h=l.includes(p);return a.jsxs("label",{className:"flex items-center gap-2.5 cursor-pointer py-0.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors select-none",children:[a.jsx("div",{className:"w-4 h-4 rounded border flex items-center justify-center transition-colors",onClick:()=>u(p),style:{backgroundColor:h?"#059669":"white",borderColor:h?"#059669":"#DDDBD8",color:"white"},children:h&&a.jsx(Wv,{size:10,strokeWidth:3})}),d]},d)})]}),a.jsxs("div",{className:"flex justify-end items-center gap-4",children:[a.jsx("button",{onClick:()=>t("/app/predict"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"}),a.jsxs("button",{onClick:()=>t("/app/predict"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#059669",boxShadow:"0 6px 20px rgba(5,150,105,0.25)"},onMouseEnter:d=>d.currentTarget.style.backgroundColor="#047857",onMouseLeave:d=>d.currentTarget.style.backgroundColor="#059669",children:["Launch Tool ",a.jsx(Xt,{size:14})]})]})]})]})}),a.jsx(xa,{backColor:"linear-gradient(135deg, #F5F0FF 0%, #EEE6FF 100%)",backBorder:"1px solid #DDD6FE",backRotation:-1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-4 space-y-4 lg:order-3",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-5 border border-[#EBEBEB] space-y-3",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block",children:"Active Lattice: LiCoO₂"}),a.jsx("div",{className:"grid grid-cols-2 gap-2 text-xs font-mono",children:[["a","2.816 Å"],["b","2.816 Å"],["c","14.054 Å"],["Vol","96.5 Å³"]].map(([d,p])=>a.jsxs("div",{className:"bg-[#F2F2F0] rounded-xl px-3 py-2",children:[a.jsx("span",{className:"text-[#9A9A9A] text-[10px]",children:d}),a.jsx("span",{className:"block text-[#1A1A1A] font-semibold",children:p})]},d))}),a.jsx("div",{className:"pt-1 border-t border-[#EBEBEB]",children:a.jsx("span",{className:"text-[10px] text-[#9A9A9A]",children:"Space Group: R -3 m"})})]}),a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-4 border border-[#EBEBEB]",children:[a.jsx("span",{className:"text-xs font-bold text-[#1A1A1A] block mb-3",children:"Viewer Controls"}),a.jsx("div",{className:"flex flex-wrap gap-1.5",children:["Rotate","Zoom","Bonds","Unit Cell","Reset"].map(d=>a.jsx("span",{className:"text-[10px] px-2.5 py-1 rounded-lg border text-[#6B6B6B]",style:{borderColor:"#DDDBD8",backgroundColor:"white"},children:d},d))})]})]}),a.jsx("div",{className:"lg:col-span-3 flex items-center justify-center pointer-events-none select-none lg:order-2",children:a.jsx("div",{className:"w-52 sm:w-56",children:a.jsx("img",{src:"/assets/about_lattice.png",alt:"3D unit cell visualization",className:"w-full h-auto object-contain",style:{filter:"drop-shadow(0 12px 28px rgba(124,58,237,0.15))"}})})}),a.jsxs("div",{className:"lg:col-span-5 space-y-6 lg:order-1",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#7C3AED]",children:"04 / 05 — Structure Visualization"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["Structure",a.jsx("br",{}),"Visualization"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Real-time 3D crystallographic lattice viewer with rotate, zoom, bond, and unit-cell controls."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Pt,{icon:Kd,label:"3D WebGL Canvas",accent:"#7C3AED"}),a.jsx(Pt,{icon:oo,label:"Coordination Polyhedra",accent:"#7C3AED"}),a.jsx(Pt,{icon:uo,label:"Unit Cell Vectors",accent:"#7C3AED"}),a.jsx(Pt,{icon:oc,label:"Bond Measurements",accent:"#7C3AED"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsxs("button",{onClick:()=>t("/app/structures"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#7C3AED",boxShadow:"0 6px 20px rgba(124,58,237,0.25)"},onMouseEnter:d=>d.currentTarget.style.backgroundColor="#6D28D9",onMouseLeave:d=>d.currentTarget.style.backgroundColor="#7C3AED",children:["Launch Tool ",a.jsx(Xt,{size:14})]}),a.jsx("button",{onClick:()=>t("/app/structures"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"})]})]})]})}),a.jsx(xa,{backColor:"linear-gradient(135deg, #FFFBEB 0%, #FFF8E1 100%)",backBorder:"1px solid #FDE68A",backRotation:1.5,children:a.jsxs("div",{className:"p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center",children:[a.jsxs("div",{className:"lg:col-span-5 space-y-6",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[11px] font-bold tracking-[0.22em] uppercase font-headline mb-1 text-[#D97706]",children:"05 / 05 — High-Throughput Screening"}),a.jsxs("h2",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1A1A1A] tracking-tight",children:["Batch",a.jsx("br",{}),"Prediction"]}),a.jsx("p",{className:"text-sm text-[#6B6B6B] leading-relaxed mt-3 max-w-sm",children:"Upload up to 500 CIF files for parallel automated property screening, syntax verification, and consolidated CSV/ZIP export."})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx(Pt,{icon:lo,label:"Multi-CIF Upload",accent:"#D97706"}),a.jsx(Pt,{icon:Er,label:"Syntax Pre-Flight",accent:"#D97706"}),a.jsx(Pt,{icon:Zd,label:"Parallel Evaluation",accent:"#D97706"}),a.jsx(Pt,{icon:Jd,label:"Bulk ZIP Export",accent:"#D97706"})]})]}),a.jsxs("div",{className:"lg:col-span-7 space-y-4",children:[a.jsxs("div",{className:"bg-[#FAFAF8] rounded-2xl p-5 border border-[#EBEBEB] space-y-4",children:[a.jsxs("div",{className:"flex justify-between items-center text-xs",children:[a.jsx("span",{className:"font-bold text-[#1A1A1A]",children:"Batch Execution Queue"}),a.jsx("span",{className:"font-mono font-bold text-[#D97706]",children:"100% (248/248)"})]}),a.jsx("div",{className:"h-2.5 bg-[#FEF3C7] rounded-full overflow-hidden",children:a.jsx("div",{className:"h-full rounded-full",style:{width:"100%",backgroundColor:"#D97706"}})}),a.jsx("div",{className:"space-y-1.5",children:[{file:"LLZO_cubic.cif",status:"Complete",ok:!0},{file:"NMC811_doped.cif",status:"Complete",ok:!0},{file:"LFP_orthorhombic.cif",status:"Complete",ok:!0},{file:"Na3Zr2Si2PO12.cif",status:"Complete",ok:!0}].map(({file:d,status:p,ok:h})=>a.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:[a.jsx("span",{className:"font-mono text-[#6B6B6B]",children:d}),a.jsxs("span",{className:"flex items-center gap-1.5 font-medium",style:{color:h?"#059669":"#DC2626"},children:[a.jsx(HS,{size:11}),p]})]},d))}),a.jsxs("div",{className:"flex justify-between text-[11px] pt-1 border-t border-[#EBEBEB]",children:[a.jsx("span",{className:"text-[#6B6B6B]",children:"Processed: 248 structures"}),a.jsx("span",{className:"font-semibold text-[#059669]",children:"0 Errors"})]})]}),a.jsxs("div",{className:"flex justify-end items-center gap-4",children:[a.jsx("button",{onClick:()=>t("/app/batch"),className:"text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] underline transition-colors",children:"Learn More"}),a.jsxs("button",{onClick:()=>t("/app/batch"),className:"flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-120 active:scale-95",style:{backgroundColor:"#D97706",boxShadow:"0 6px 20px rgba(217,119,6,0.25)"},onMouseEnter:d=>d.currentTarget.style.backgroundColor="#B45309",onMouseLeave:d=>d.currentTarget.style.backgroundColor="#D97706",children:["Launch Tool ",a.jsx(Xt,{size:14})]})]})]})]})}),a.jsx("div",{className:"h-8"})]})}const mb=[[1,"H","Hydrogen",1,1,"nonmetal","+1, -1"],[2,"He","Helium",18,1,"noble","0"],[3,"Li","Lithium",1,2,"alkali","+1"],[4,"Be","Beryllium",2,2,"alkaline","+2"],[5,"B","Boron",13,2,"metalloid","+3"],[6,"C","Carbon",14,2,"nonmetal","-4, +2, +4"],[7,"N","Nitrogen",15,2,"nonmetal","-3, +3, +5"],[8,"O","Oxygen",16,2,"nonmetal","-2"],[9,"F","Fluorine",17,2,"halogen","-1"],[10,"Ne","Neon",18,2,"noble","0"],[11,"Na","Sodium",1,3,"alkali","+1"],[12,"Mg","Magnesium",2,3,"alkaline","+2"],[13,"Al","Aluminium",13,3,"post-transition","+3"],[14,"Si","Silicon",14,3,"metalloid","-4, +4"],[15,"P","Phosphorus",15,3,"nonmetal","-3, +3, +5"],[16,"S","Sulfur",16,3,"nonmetal","-2, +4, +6"],[17,"Cl","Chlorine",17,3,"halogen","-1, +1, +5, +7"],[18,"Ar","Argon",18,3,"noble","0"],[19,"K","Potassium",1,4,"alkali","+1"],[20,"Ca","Calcium",2,4,"alkaline","+2"],[21,"Sc","Scandium",3,4,"transition","+3"],[22,"Ti","Titanium",4,4,"transition","+2, +3, +4"],[23,"V","Vanadium",5,4,"transition","+2, +3, +4, +5"],[24,"Cr","Chromium",6,4,"transition","+2, +3, +6"],[25,"Mn","Manganese",7,4,"transition","+2, +4, +7"],[26,"Fe","Iron",8,4,"transition","+2, +3"],[27,"Co","Cobalt",9,4,"transition","+2, +3"],[28,"Ni","Nickel",10,4,"transition","+2, +3"],[29,"Cu","Copper",11,4,"transition","+1, +2"],[30,"Zn","Zinc",12,4,"transition","+2"],[31,"Ga","Gallium",13,4,"post-transition","+3"],[32,"Ge","Germanium",14,4,"metalloid","+2, +4"],[33,"As","Arsenic",15,4,"metalloid","-3, +3, +5"],[34,"Se","Selenium",16,4,"nonmetal","-2, +4, +6"],[35,"Br","Bromine",17,4,"halogen","-1, +1, +5"],[36,"Kr","Krypton",18,4,"noble","0"],[37,"Rb","Rubidium",1,5,"alkali","+1"],[38,"Sr","Strontium",2,5,"alkaline","+2"],[39,"Y","Yttrium",3,5,"transition","+3"],[40,"Zr","Zirconium",4,5,"transition","+4"],[41,"Nb","Niobium",5,5,"transition","+3, +5"],[42,"Mo","Molybdenum",6,5,"transition","+4, +6"],[43,"Tc","Technetium",7,5,"transition","+4, +7"],[44,"Ru","Ruthenium",8,5,"transition","+3, +4"],[45,"Rh","Rhodium",9,5,"transition","+3"],[46,"Pd","Palladium",10,5,"transition","+2, +4"],[47,"Ag","Silver",11,5,"transition","+1"],[48,"Cd","Cadmium",12,5,"transition","+2"],[49,"In","Indium",13,5,"post-transition","+1, +3"],[50,"Sn","Tin",14,5,"post-transition","+2, +4"],[51,"Sb","Antimony",15,5,"metalloid","-3, +3, +5"],[52,"Te","Tellurium",16,5,"metalloid","-2, +4, +6"],[53,"I","Iodine",17,5,"halogen","-1, +1, +5, +7"],[54,"Xe","Xenon",18,5,"noble","0"],[55,"Cs","Caesium",1,6,"alkali","+1"],[56,"Ba","Barium",2,6,"alkaline","+2"],[57,"La","Lanthanum",3,6,"lanthanide","+3"],[72,"Hf","Hafnium",4,6,"transition","+4"],[73,"Ta","Tantalum",5,6,"transition","+5"],[74,"W","Tungsten",6,6,"transition","+4, +6"],[75,"Re","Rhenium",7,6,"transition","+4, +6, +7"],[76,"Os","Osmium",8,6,"transition","+4, +8"],[77,"Ir","Iridium",9,6,"transition","+3, +4"],[78,"Pt","Platinum",10,6,"transition","+2, +4"],[79,"Au","Gold",11,6,"transition","+1, +3"],[80,"Hg","Mercury",12,6,"transition","+1, +2"],[81,"Tl","Thallium",13,6,"post-transition","+1, +3"],[82,"Pb","Lead",14,6,"post-transition","+2, +4"],[83,"Bi","Bismuth",15,6,"post-transition","+3, +5"],[84,"Po","Polonium",16,6,"post-transition","+2, +4"],[85,"At","Astatine",17,6,"halogen","-1, +1, +5"],[86,"Rn","Radon",18,6,"noble","0"],[87,"Fr","Francium",1,7,"alkali","+1"],[88,"Ra","Radium",2,7,"alkaline","+2"],[89,"Ac","Actinium",3,7,"actinide","+3"],[104,"Rf","Rutherfordium",4,7,"transition","+4"],[105,"Db","Dubnium",5,7,"transition","+5"],[106,"Sg","Seaborgium",6,7,"transition","+6"],[107,"Bh","Bohrium",7,7,"transition","+7"],[108,"Hs","Hassium",8,7,"transition","+8"],[109,"Mt","Meitnerium",9,7,"transition"],[110,"Ds","Darmstadtium",10,7,"transition"],[111,"Rg","Roentgenium",11,7,"transition"],[112,"Cn","Copernicium",12,7,"transition","+2"],[113,"Nh","Nihonium",13,7,"post-transition","+1, +3"],[114,"Fl","Flerovium",14,7,"post-transition","+2, +4"],[115,"Mc","Moscovium",15,7,"post-transition","+1, +3"],[116,"Lv","Livermorium",16,7,"post-transition","+2, +4"],[117,"Ts","Tennessine",17,7,"halogen","-1, +1, +3"],[118,"Og","Oganesson",18,7,"noble","0"],[58,"Ce","Cerium",4,8,"lanthanide","+3, +4"],[59,"Pr","Praseodymium",5,8,"lanthanide","+3, +4"],[60,"Nd","Neodymium",6,8,"lanthanide","+3"],[61,"Pm","Promethium",7,8,"lanthanide","+3"],[62,"Sm","Samarium",8,8,"lanthanide","+2, +3"],[63,"Eu","Europium",9,8,"lanthanide","+2, +3"],[64,"Gd","Gadolinium",10,8,"lanthanide","+3"],[65,"Tb","Terbium",11,8,"lanthanide","+3, +4"],[66,"Dy","Dysprosium",12,8,"lanthanide","+3"],[67,"Ho","Holmium",13,8,"lanthanide","+3"],[68,"Er","Erbium",14,8,"lanthanide","+3"],[69,"Tm","Thulium",15,8,"lanthanide","+2, +3"],[70,"Yb","Ytterbium",16,8,"lanthanide","+2, +3"],[71,"Lu","Lutetium",17,8,"lanthanide","+3"],[90,"Th","Thorium",4,9,"actinide","+4"],[91,"Pa","Protactinium",5,9,"actinide","+4, +5"],[92,"U","Uranium",6,9,"actinide","+3, +4, +5, +6"],[93,"Np","Neptunium",7,9,"actinide","+3, +4, +5, +6"],[94,"Pu","Plutonium",8,9,"actinide","+3, +4, +5, +6"],[95,"Am","Americium",9,9,"actinide","+3, +4, +5, +6"],[96,"Cm","Curium",10,9,"actinide","+3"],[97,"Bk","Berkelium",11,9,"actinide","+3, +4"],[98,"Cf","Californium",12,9,"actinide","+3"],[99,"Es","Einsteinium",13,9,"actinide","+3"],[100,"Fm","Fermium",14,9,"actinide","+3"],[101,"Md","Mendelevium",15,9,"actinide","+2, +3"],[102,"No","Nobelium",16,9,"actinide","+2, +3"],[103,"Lr","Lawrencium",17,9,"actinide","+3"]],Qm=mb.map(([t,e,n,i,r,s,o])=>({number:t,symbol:e,name:n,group:i,period:r,category:s,oxidationStates:o})),xb=[["alkali","Alkali"],["transition","Transition"],["nonmetal","Nonmetal"],["halogen","Halogen"],["noble","Noble gas"],["lanthanide","Lanthanide"],["actinide","Actinide"]];function e_({includeElements:t,excludeElements:e,onElementClick:n}){const[i,r]=L.useState(null),[s,o]=L.useState(new Set),l=L.useMemo(()=>Qm.filter(p=>p.period<=7),[]),c=L.useMemo(()=>Qm.filter(p=>p.period>=8),[]),u=p=>s.size===0||s.has(p.category),d=p=>{o(h=>{const m=new Set(h);return m.has(p)?m.delete(p):m.add(p),m})};return a.jsxs("div",{className:"space-y-3",children:[a.jsxs("div",{className:"flex flex-wrap items-center gap-1.5","aria-label":"Filter periodic table by category",children:[xb.map(([p,h])=>{const m=s.has(p);return a.jsxs("button",{type:"button",onClick:()=>d(p),"aria-pressed":m,className:`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${m?"bg-[#FBE8D8] border-[#F1641D] text-[#F1641D]":"bg-white border-[#E9DFD4] text-[#6C737E] hover:border-[#F1641D]/50"}`,children:[a.jsx("i",{className:`periodic-legend-swatch periodic-category-${p}`}),h]},p)}),s.size>0&&a.jsx("button",{type:"button",onClick:()=>o(new Set),className:"text-[11px] text-[#F1641D] font-semibold ml-1",children:"Clear categories"})]}),a.jsx("div",{className:"overflow-x-auto pb-2",children:a.jsxs("div",{className:"periodic-table-grid",role:"grid","aria-label":"Periodic table of chemical elements",children:[l.map(p=>a.jsx(ex,{element:p,selected:t.includes(p.symbol)?"include":e.includes(p.symbol)?"exclude":"none",onClick:()=>{r(p),n(p.symbol)},dimmed:!u(p)},p.number)),a.jsx("div",{className:"periodic-table-f-label",style:{gridColumn:1,gridRow:8},children:"Lanthanides"}),a.jsx("div",{className:"periodic-table-f-label",style:{gridColumn:1,gridRow:9},children:"Actinides"}),c.map(p=>a.jsx(ex,{element:p,selected:t.includes(p.symbol)?"include":e.includes(p.symbol)?"exclude":"none",onClick:()=>{r(p),n(p.symbol)},dimmed:!u(p)},p.number))]})}),a.jsx("div",{className:"min-h-12 rounded-xl bg-[#FDFBD4] px-4 py-3 text-xs text-[#38240D]","aria-live":"polite",children:i?a.jsxs(a.Fragment,{children:[a.jsx("strong",{children:i.name})," (",i.symbol,") · Atomic number ",i.number,i.oxidationStates?` · Oxidation states ${i.oxidationStates}`:""]}):"Select an element to inspect its identity and add it to the query."})]})}function ex({element:t,selected:e,onClick:n,dimmed:i}){return a.jsxs("button",{type:"button",role:"gridcell","aria-label":`${t.name}, ${t.symbol}, atomic number ${t.number}`,title:`${t.name} · ${t.symbol} · Atomic number ${t.number}`,onClick:n,style:{gridColumn:t.group,gridRow:t.period},className:`periodic-element periodic-category-${t.category} periodic-element-${e} ${i?"periodic-element-dimmed":""}`,children:[a.jsx("span",{className:"periodic-element-number",children:t.number}),a.jsx("span",{className:"periodic-element-symbol",children:t.symbol})]})}const gb={}.VITE_API_BASE_URL||{}.VITE_TOPATH_URL||"http://localhost:8000",fo=gb.replace(/\/+$/,"");class gu extends Error{constructor(n,i=0,r=!1){super(n);Vc(this,"status");Vc(this,"unreachable");this.name="ApiError",this.status=i,this.unreachable=r}}async function vb(t){const e=new URLSearchParams;t.elements&&t.elements.length>0&&t.elements.forEach(i=>e.append("elements",i)),t.excludeElements&&t.excludeElements.length>0&&t.excludeElements.forEach(i=>e.append("exclude_elements",i)),t.matchMode&&e.append("match_mode",t.matchMode),t.formula&&e.append("formula",t.formula),t.minBandGap!==void 0&&e.append("min_band_gap",t.minBandGap.toString()),t.maxBandGap!==void 0&&e.append("max_band_gap",t.maxBandGap.toString()),t.minEHull!==void 0&&e.append("min_e_hull",t.minEHull.toString()),t.maxEHull!==void 0&&e.append("max_e_hull",t.maxEHull.toString()),t.page!==void 0&&e.append("page",t.page.toString()),t.limit!==void 0&&e.append("limit",t.limit.toString());let n;try{n=await fetch(`${fo}/api/dataset/search?${e.toString()}`)}catch{throw new Error(`Backend unavailable at ${fo}. Start the FastAPI server and try again.`)}if(!n.ok)throw new Error(`Dataset search failed with status ${n.status}`);return n.json()}function Ft(t){return t==null||Number.isNaN(t)?null:t}const Dr=[{key:"mv_id",label:"Material ID",type:"text",accessor:t=>t.mv_id??"",format:t=>t.mv_id??"N/A"},{key:"Formula",label:"Formula",type:"text",accessor:t=>t.Formula??"",format:t=>t.Formula??"N/A"},{key:"nsites",label:"Sites",type:"number",accessor:t=>Ft(t.nsites),format:t=>Ft(t.nsites)===null?"N/A":String(t.nsites),colorScale:"neutral"},{key:"e_hull",label:"E Above Hull (eV/atom)",type:"number",accessor:t=>Ft(t["E_hull-m (eV/atom)"]),format:t=>{const e=Ft(t["E_hull-m (eV/atom)"]);return e===null?"N/A":e.toFixed(3)},backendFilter:!0,colorScale:"goodLow"},{key:"formation_energy",label:"Formation Energy (eV/atom)",type:"number",accessor:t=>Ft(t["Form. Energy E_f (eV/atom)"]),format:t=>{const e=Ft(t["Form. Energy E_f (eV/atom)"]);return e===null?"N/A":e.toFixed(3)},colorScale:"goodLow"},{key:"ionic_conductivity",label:"Ionic Cond. (mS/cm)",type:"number",accessor:t=>Ft(t["Ionic Conductivity (mS/cm)"]??t.ionic_conductivity),format:t=>{const e=Ft(t["Ionic Conductivity (mS/cm)"]??t.ionic_conductivity);return e===null?"N/A":e.toExponential(2)},colorScale:"goodHigh"},{key:"activation_energy",label:"Activation Energy (eV)",type:"number",accessor:t=>Ft(t["Activation Energy Ea (eV)"]??t.activation_energy),format:t=>{const e=Ft(t["Activation Energy Ea (eV)"]??t.activation_energy);return e===null?"N/A":e.toFixed(2)},colorScale:"goodLow"},{key:"migration_barrier",label:"Migration Barrier (eV)",type:"number",accessor:t=>Ft(t["Migration Barrier (eV)"]??t.migration_barrier),format:t=>{const e=Ft(t["Migration Barrier (eV)"]??t.migration_barrier);return e===null?"N/A":e.toFixed(2)},colorScale:"goodLow"},{key:"band_gap",label:"Band Gap (eV)",type:"number",accessor:t=>Ft(t["Band Gap E_g (eV)"]),format:t=>{const e=Ft(t["Band Gap E_g (eV)"]);return e===null?"N/A":e.toFixed(2)},backendFilter:!0,colorScale:"neutral"},{key:"bulk_modulus",label:"Bulk Modulus (GPa)",type:"number",accessor:t=>Ft(t["Bulk Modulus K (GPa)"]),format:t=>{const e=Ft(t["Bulk Modulus K (GPa)"]);return e===null?"N/A":e.toFixed(1)},colorScale:"goodHigh"},{key:"shear_modulus",label:"Shear Modulus (GPa)",type:"number",accessor:t=>Ft(t["Shear Modulus G (GPa)"]),format:t=>{const e=Ft(t["Shear Modulus G (GPa)"]);return e===null?"N/A":e.toFixed(1)},colorScale:"goodHigh"},{key:"metal_prob",label:"Metal Prob.",type:"number",accessor:t=>Ft(t["Metal Prob."]),format:t=>{const e=Ft(t["Metal Prob."]);return e===null?"N/A":`${(e*100).toFixed(0)}%`},colorScale:"neutral"}];function _b(t,e,n){switch(e){case">=":return t>=n;case"<=":return t<=n;case"=":return t===n;case">":return t>n;case"<":return t<n}}function yb(t,e){const n="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-semibold text-[11px]";if(t.type!=="number"||!t.colorScale)return"";const i=t.accessor(e);return typeof i!="number"?`${n} bg-[#F1F2F4] text-[#8C929C]`:t.key==="e_hull"?i<=.01?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i<=.05?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#FDE4E1] text-[#B3261E]`:t.key==="formation_energy"?i<=-1.5?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i<=0?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#FDE4E1] text-[#B3261E]`:t.key==="ionic_conductivity"?i>=1?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i>=.1?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#F1F2F4] text-[#5F6771]`:t.key==="activation_energy"||t.key==="migration_barrier"?i<=.35?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i<=.5?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#FDE4E1] text-[#B3261E]`:t.key==="bulk_modulus"||t.key==="shear_modulus"?i>=100?`${n} bg-[#DFF5E1] text-[#1E7B34]`:i>=40?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#F1F2F4] text-[#5F6771]`:t.key==="metal_prob"?i>=.66?`${n} bg-[#E3ECFC] text-[#1D4FA3]`:i>=.33?`${n} bg-[#FFF1CF] text-[#9A6A00]`:`${n} bg-[#F1F2F4] text-[#5F6771]`:`${n} bg-[#FAF4EE] text-[#1E2227]`}function tx(){const[t,e]=DS(),[n,i]=L.useState(t.get("q")??""),[r,s]=L.useState(t.getAll("elements")),[o,l]=L.useState(t.getAll("exclude_elements")),[c,u]=L.useState("include"),[d,p]=L.useState(""),[h,m]=L.useState(""),[v,b]=L.useState(""),[x,f]=L.useState(""),[g,w]=L.useState(()=>!!t.get("q")||t.getAll("elements").length>0||t.getAll("exclude_elements").length>0),[S,y]=L.useState([]),[M,A]=L.useState(0),[_,T]=L.useState(!1),[R,P]=L.useState(null),[D,I]=L.useState(new Set),[F,B]=L.useState(!1),[Z,X]=L.useState(null),[j,z]=L.useState({}),[$,Q]=L.useState({}),[ce,Me]=L.useState(null);L.useEffect(()=>{if(!g)return;const q=new AbortController;return T(!0),P(null),vb({formula:n.trim()||void 0,elements:r,excludeElements:o,minBandGap:d?Number(d):void 0,maxBandGap:h?Number(h):void 0,minEHull:v?Number(v):void 0,maxEHull:x?Number(x):void 0,page:1,limit:100}).then(le=>{q.signal.aborted||(y(le.results),A(le.total))}).catch(le=>{q.signal.aborted||P(le instanceof Error?le.message:"Unable to fetch materials.")}).finally(()=>{q.signal.aborted||T(!1)}),()=>q.abort()},[g,n,r,o,d,h,v,x]);const Ye=q=>{c==="include"?(s(le=>le.includes(q)?le.filter(we=>we!==q):[...le,q]),l(le=>le.filter(we=>we!==q))):(l(le=>le.includes(q)?le.filter(we=>we!==q):[...le,q]),s(le=>le.filter(we=>we!==q)))},He=q=>{q.preventDefault();const le=new URLSearchParams;n.trim()&&le.set("q",n.trim()),r.forEach(we=>le.append("elements",we)),o.forEach(we=>le.append("exclude_elements",we)),e(le),w(!0)},Ve=()=>{i(""),s([]),l([]),p(""),m(""),b(""),f(""),z({}),Q({}),Me(null),e(new URLSearchParams),w(!1),y([]),A(0)},J=(q,le,we)=>{const Fe=we.trim()===""?"":we.trim();q==="band_gap"?le==="<="?m(Fe):p(Fe):le==="<="?f(Fe):b(Fe),w(!0)},ie=L.useMemo(()=>{let q=S;if(Object.entries(j).forEach(([le,we])=>{if(!we.trim())return;const Fe=Dr.find(Le=>Le.key===le);if(!Fe)return;const je=we.trim().toLowerCase();q=q.filter(Le=>String(Fe.accessor(Le)??"").toLowerCase().includes(je))}),Object.entries($).forEach(([le,we])=>{const Fe=Dr.find(Le=>Le.key===le);if(!Fe||Fe.backendFilter||we.value.trim()==="")return;const je=Number(we.value);Number.isNaN(je)||(q=q.filter(Le=>{const Ue=Fe.accessor(Le);return typeof Ue=="number"&&_b(Ue,we.comparator,je)}))}),ce){const le=Dr.find(we=>we.key===ce.key);q=[...q].sort((we,Fe)=>{const je=le.accessor(we),Le=le.accessor(Fe);if(je===null||je==="")return 1;if(Le===null||Le==="")return-1;const Ue=je<Le?-1:je>Le?1:0;return ce.dir==="asc"?Ue:-Ue})}return q},[S,j,$,ce]),Ee=()=>{const q=Dr.filter(it=>!D.has(it.key)),le=q.map(it=>it.label).join(","),we=ie.map(it=>q.map(Nt=>`"${String(Nt.accessor(it)??"").replace(/"/g,'""')}"`).join(",")),Fe=[le,...we].join(`
`),je=new Blob([Fe],{type:"text/csv;charset=utf-8;"}),Le=URL.createObjectURL(je),Ue=document.createElement("a");Ue.href=Le,Ue.download="materials_export.csv",Ue.click(),URL.revokeObjectURL(Le)},Be=[...r.map(q=>({element:q,mode:"include"})),...o.map(q=>({element:q,mode:"exclude"}))];return a.jsxs("div",{className:"w-full max-w-[1600px] mx-auto space-y-7 px-4 sm:px-8 py-6",children:[a.jsxs("header",{children:[a.jsx("p",{className:"text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D]",children:"Material discovery"}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Materials Explorer"}),a.jsx("p",{className:"text-sm text-[#6C737E] mt-1",children:"Search real IndianMatter records, then refine returned solid-state battery candidates."})]}),a.jsxs("section",{className:"bg-white rounded-[2rem] p-5 sm:p-7 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsxs("form",{onSubmit:He,className:"flex flex-col sm:flex-row gap-3",children:[a.jsxs("div",{className:"relative flex-1",children:[a.jsx(ia,{className:"absolute left-4 top-1/2 -translate-y-1/2 text-[#8C929C]",size:17}),a.jsx("input",{value:n,onChange:q=>i(q.target.value),placeholder:"Search formula or material ID (e.g., Li7La3Zr2O12)","aria-label":"Search materials",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-[#F1641D]"})]}),a.jsx("button",{type:"submit",className:"px-6 py-3 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F]",children:"Search Materials"}),a.jsxs("button",{type:"button",onClick:Ve,className:"px-4 py-3 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(co,{size:13})," Reset"]})]}),a.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs",children:[a.jsx("span",{className:"font-semibold text-[#1E2227]",children:"Element mode:"}),a.jsx("button",{type:"button",onClick:()=>u("include"),className:`px-3 py-1.5 rounded-lg ${c==="include"?"bg-[#FBE8D8] text-[#F1641D]":"bg-[#FAF4EE] text-[#6C737E]"}`,children:"Include"}),a.jsx("button",{type:"button",onClick:()=>u("exclude"),className:`px-3 py-1.5 rounded-lg ${c==="exclude"?"bg-[#713600] text-white":"bg-[#FAF4EE] text-[#6C737E]"}`,children:"Exclude"}),Be.length>0&&a.jsxs("span",{className:"flex items-center gap-1.5 flex-wrap",children:[a.jsx("span",{className:"text-[#8C929C]",children:"·"}),Be.map(({element:q,mode:le})=>a.jsxs("span",{className:`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${le==="exclude"?"text-[#713600]":"text-[#F1641D]"}`,children:[le==="exclude"?"−":"+",q,a.jsx("button",{type:"button",onClick:()=>Ye(q),"aria-label":`Remove ${q}`,className:"text-[#8C929C] hover:text-[#1E2227]",children:a.jsx(Ys,{size:10})})]},`${le}-${q}`))]}),a.jsx("span",{className:"ml-auto text-[#8C929C]",children:"Database: IndianMatter dataset"})]}),a.jsx(e_,{includeElements:r,excludeElements:o,onElementClick:Ye})]}),!g&&a.jsxs("div",{className:"bg-white rounded-2xl p-10 text-center border border-[#EFE5DC] text-sm text-[#6C737E]",children:[a.jsx(Zm,{className:"mx-auto mb-3 text-[#F1641D]",size:22}),"Start with a formula, material ID, or element selection."]}),g&&a.jsxs("section",{className:"bg-white rounded-2xl border border-[#EFE5DC] overflow-hidden shadow-card",children:[a.jsxs("div",{className:"flex flex-wrap items-center gap-3 p-4 border-b border-[#F2E7DC] bg-[#FAF4EE]/40",children:[a.jsxs("button",{type:"button",onClick:Ve,className:"px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] flex items-center gap-1.5",children:[a.jsx(co,{size:13})," Reset"]}),a.jsx("span",{className:"px-3 py-2 bg-[#1E2227] text-white rounded-xl text-xs font-semibold",children:_?"Searching…":`${ie.length} of ${M} materials`}),a.jsxs("div",{className:"relative ml-auto",children:[a.jsxs("button",{type:"button",onClick:()=>B(q=>!q),className:"px-3 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(BS,{size:14})," Columns"]}),F&&a.jsx("div",{className:"absolute right-0 mt-1 w-60 bg-white border border-[#E9DFD4] rounded-xl shadow-card p-3 z-30 space-y-1",children:Dr.map(q=>a.jsxs("label",{className:"flex items-center gap-2 text-xs text-[#1E2227] py-1 cursor-pointer",children:[a.jsx("input",{type:"checkbox",checked:!D.has(q.key),onChange:()=>I(le=>{const we=new Set(le);return we.has(q.key)?we.delete(q.key):we.add(q.key),we})}),q.label]},q.key))})]}),a.jsxs("button",{type:"button",onClick:Ee,className:"px-3 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(ji,{size:14})," Export Table"]})]}),R&&a.jsx("div",{role:"alert",className:"p-5 text-sm text-red-700",children:R}),!_&&!R&&!ie.length&&a.jsx("div",{className:"p-8 text-center text-sm text-[#6C737E]",children:"No materials found. Try removing an element, widening a range, or clearing a column filter."}),_&&a.jsx("div",{className:"p-8 text-center text-sm text-[#6C737E]",children:"Searching materials..."}),!_&&!R&&ie.length>0&&a.jsx("div",{className:"overflow-x-auto relative",children:a.jsxs("table",{className:"w-full text-xs border-separate border-spacing-0",children:[a.jsx("thead",{children:a.jsx("tr",{className:"bg-[#1E2227]",children:Dr.filter(q=>!D.has(q.key)).map((q,le,we)=>{var Fe,je;return a.jsxs("th",{className:"relative px-3.5 py-3 text-left font-semibold text-[#E9DFD4] whitespace-nowrap border-b border-[#333842]",children:[a.jsxs("div",{className:"flex items-center justify-between gap-2",children:[a.jsxs("button",{type:"button",onClick:()=>Me(Le=>({key:q.key,dir:(Le==null?void 0:Le.key)===q.key&&Le.dir==="asc"?"desc":"asc"})),className:"hover:text-white transition-colors",children:[q.label,(ce==null?void 0:ce.key)===q.key?ce.dir==="asc"?" ▲":" ▼":""]}),a.jsx("button",{type:"button",onClick:()=>X(Le=>Le===q.key?null:q.key),"aria-label":`Filter ${q.label}`,className:`${q.type==="text"&&j[q.key]||q.type==="number"&&((Fe=$[q.key])!=null&&Fe.value)?"text-[#F1641D]":"text-[#8C929C]"} hover:text-white transition-colors`,children:a.jsx(Zm,{size:12})})]}),Z===q.key&&a.jsx("div",{className:`absolute top-full mt-1.5 w-60 bg-white border border-[#E9DFD4] rounded-xl shadow-2xl p-3.5 z-50 text-left font-normal normal-case text-[#1E2227] ${le>we.length-3?"right-0":"left-0"}`,children:q.type==="text"?a.jsxs(a.Fragment,{children:[a.jsx("p",{className:"text-[10px] text-[#8C929C] mb-1 font-semibold uppercase tracking-wider",children:"Contains Text"}),a.jsx("input",{value:j[q.key]??"",onChange:Le=>z(Ue=>({...Ue,[q.key]:Le.target.value})),placeholder:"Filter...",className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#F1641D]"})]}):a.jsxs(a.Fragment,{children:[a.jsx("p",{className:"text-[10px] text-[#8C929C] mb-1 font-semibold uppercase tracking-wider",children:q.backendFilter?"Filter Range (Backend Query)":"Numeric Comparator"}),a.jsxs("select",{defaultValue:">=",id:`comp-${q.key}`,className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2 py-1.5 text-xs outline-none mb-2",children:[a.jsx("option",{value:">=",children:"Greater than or equal (≥)"}),a.jsx("option",{value:"<=",children:"Less than or equal (≤)"}),!q.backendFilter&&a.jsxs(a.Fragment,{children:[a.jsx("option",{value:"=",children:"Equal to (=)"}),a.jsx("option",{value:">",children:"Strictly greater (>)"}),a.jsx("option",{value:"<",children:"Strictly less (<)"})]})]}),a.jsx("input",{id:`val-${q.key}`,type:"number",step:"any",placeholder:"Threshold value...",defaultValue:q.backendFilter?void 0:((je=$[q.key])==null?void 0:je.value)??"",className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#F1641D] mb-2.5"}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx("button",{type:"button",onClick:()=>{const Le=document.getElementById(`comp-${q.key}`).value,Ue=document.getElementById(`val-${q.key}`).value;q.backendFilter&&(q.key==="e_hull"||q.key==="band_gap")?J(q.key,Le,Ue):Q(it=>({...it,[q.key]:{comparator:Le,value:Ue}})),X(null)},className:"flex-1 py-1.5 bg-[#F1641D] text-white rounded-lg text-xs font-semibold hover:bg-[#D9520F]",children:"Apply"}),a.jsx("button",{type:"button",onClick:()=>{Q(Le=>{const Ue={...Le};return delete Ue[q.key],Ue}),X(null)},className:"px-2.5 py-1.5 border border-[#E9DFD4] rounded-lg text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE]",children:"Clear"})]})]})})]},q.key)})})}),a.jsx("tbody",{children:ie.map((q,le)=>a.jsx("tr",{className:`${le%2===0?"bg-white":"bg-[#FDF9F4]"} border-b border-[#F2E7DC] hover:bg-[#FBE8D8]/40 transition-colors`,children:Dr.filter(we=>!D.has(we.key)).map(we=>a.jsx("td",{className:"px-3.5 py-2.5 whitespace-nowrap",children:we.colorScale?a.jsx("span",{className:`${yb(we,q)} font-mono`,children:we.format(q)}):a.jsx("span",{className:"text-[#1E2227] font-mono",children:we.format(q)})},we.key))},q.mv_id??le))})]})})]})]})}function nx(){const[t,e]=L.useState("structure");return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs(Ot,{to:"/app/materials",className:"inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C929C] hover:text-[#F1641D] transition-colors mb-3",children:[a.jsx(IS,{size:14})," Back to Materials Search"]}),a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold text-[#F1641D] uppercase tracking-wider font-headline",children:[a.jsx("span",{children:"Materials Project • mp-22526"}),a.jsx("span",{children:"• Trigonal (R -3 m)"})]}),a.jsx("h1",{className:"text-4xl sm:text-5xl font-headline font-bold text-[#1E2227] tracking-tight mt-1",children:"LiCoO₂"}),a.jsx("p",{className:"text-sm text-[#5F6771]",children:"Lithium Cobalt Oxide — Layered Cathode Material"})]}),a.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[a.jsxs(Ot,{to:"/app/dft",className:"px-4 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5 shadow-sm",children:[a.jsx(Er,{size:14,className:"text-[#F1641D]"})," Validate with DFT"]}),a.jsxs(Ot,{to:"/app/predict",className:"px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-medium hover:bg-[#D9520F] flex items-center gap-1.5 shadow-sm",children:[a.jsx(oc,{size:14})," Predict Properties"]})]})]})]}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsxs("div",{className:"lg:col-span-7 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] flex flex-col justify-between min-h-[460px]",children:[a.jsxs("div",{className:"flex items-center justify-between border-b border-[#F2E7DC] pb-3 mb-4",children:[a.jsx("span",{className:"text-xs font-bold text-[#1E2227] uppercase tracking-wider",children:"3D Unit Cell Representation"}),a.jsx("span",{className:"px-2.5 py-0.5 bg-[#FAF4EE] text-[#5F6771] text-[11px] font-mono rounded-lg border border-[#EFE5DC]",children:"R -3 m (No. 166)"})]}),a.jsx("div",{className:"flex-1 flex items-center justify-center relative my-4",children:a.jsx("img",{src:"/assets/about_lattice.png",alt:"LiCoO2 Unit Cell",className:"max-h-72 max-w-full object-contain drop-shadow-2xl"})}),a.jsxs("div",{className:"flex justify-between items-center text-xs text-[#8C929C] pt-3 border-t border-[#F2E7DC]",children:[a.jsx("span",{children:"Atoms: 12 (3 Li, 3 Co, 6 O)"}),a.jsx(Ot,{to:"/app/structures",className:"text-[#F1641D] font-semibold hover:underline",children:"Open in Advanced 3D Studio →"})]})]}),a.jsxs("div",{className:"lg:col-span-5 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Intrinsic Properties"}),a.jsxs("div",{className:"space-y-2.5 text-xs font-mono",children:[a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Band Gap (DFT)"}),a.jsx("span",{className:"font-bold text-[#1E2227]",children:"2.45 eV (Direct)"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Formation Energy"}),a.jsx("span",{className:"font-bold text-[#2E7D32]",children:"-2.180 eV/atom"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Energy Above Hull"}),a.jsx("span",{className:"font-bold text-[#2E7D32]",children:"0.000 eV (On Hull)"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Ionic Conductivity (300K)"}),a.jsx("span",{className:"font-bold text-[#F1641D]",children:"1.24 × 10⁻³ S/cm"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl flex justify-between items-center border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#5F6771]",children:"Crystal Density"}),a.jsx("span",{className:"font-bold text-[#1E2227]",children:"5.06 g/cm³"})]})]}),a.jsx("div",{className:"pt-2",children:a.jsxs("button",{onClick:()=>alert("CIF structure downloaded."),className:"w-full py-2.5 bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl text-xs font-semibold text-[#1E2227] hover:bg-[#EFE5DC] transition-colors flex items-center justify-center gap-1.5",children:[a.jsx(ji,{size:14})," Download Validated CIF"]})})]})]}),a.jsxs("div",{className:"bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-card border border-[#EFE5DC] space-y-6",children:[a.jsx("div",{className:"flex flex-wrap gap-2 border-b border-[#F2E7DC] pb-3",children:[{id:"structure",label:"Crystallographic Lattice"},{id:"electronic",label:"Electronic Band Structure"},{id:"thermo",label:"Thermodynamic Hull"},{id:"literature",label:"Research Citations"}].map(n=>a.jsx("button",{onClick:()=>e(n.id),className:`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${t===n.id?"bg-[#F1641D] text-white shadow-sm":"bg-[#FAF4EE] text-[#5F6771] hover:text-[#1E2227]"}`,children:n.label},n.id))}),t==="structure"&&a.jsxs("div",{className:"space-y-4",children:[a.jsx("h4",{className:"font-headline font-bold text-base text-[#1E2227]",children:"Lattice Vectors (Conventional)"}),a.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono",children:[a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#8C929C] block text-[10px]",children:"a"}),a.jsx("span",{className:"font-bold",children:"2.816 Å"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#8C929C] block text-[10px]",children:"b"}),a.jsx("span",{className:"font-bold",children:"2.816 Å"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#8C929C] block text-[10px]",children:"c"}),a.jsx("span",{className:"font-bold",children:"14.054 Å"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-3 rounded-xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[#8C929C] block text-[10px]",children:"Volume"}),a.jsx("span",{className:"font-bold",children:"96.5 Å³"})]})]})]}),t==="electronic"&&a.jsxs("div",{className:"bg-[#FAF4EE] p-8 rounded-2xl border border-[#EFE5DC] text-center space-y-2",children:[a.jsx("p",{className:"font-headline font-bold text-base text-[#1E2227]",children:"Electronic Density of States (DOS)"}),a.jsx("p",{className:"text-xs text-[#6C737E]",children:"Valence band dominated by Co 3d and O 2p hybridization. Direct electronic band gap = 2.45 eV."})]}),t==="thermo"&&a.jsxs("div",{className:"bg-[#FAF4EE] p-8 rounded-2xl border border-[#EFE5DC] text-center space-y-2",children:[a.jsx("p",{className:"font-headline font-bold text-base text-[#1E2227]",children:"Li-Co-O Convex Hull"}),a.jsx("p",{className:"text-xs text-[#2E7D32] font-semibold",children:"Material lies directly on the thermodynamic convex hull (Ehull = 0.000 eV). Zero decomposition enthalpy into binary constituents."})]}),t==="literature"&&a.jsx("div",{className:"space-y-3",children:[{title:"Electrochemical characterization of LiCoO2 cathodes",journal:"J. Power Sources",year:"2023",doi:"10.1016/j.jpowsour.2023"},{title:"First-principles study of Li-ion diffusion in layered oxides",journal:"Phys. Rev. B",year:"2022",doi:"10.1103/PhysRevB.105"}].map((n,i)=>a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-xl border border-[#EFE5DC] flex justify-between items-center text-xs",children:[a.jsxs("div",{children:[a.jsx("p",{className:"font-bold text-[#1E2227]",children:n.title}),a.jsxs("p",{className:"text-[11px] text-[#6C737E] mt-0.5",children:[n.journal," (",n.year,")"]})]}),a.jsxs("span",{className:"text-[#F1641D] font-mono flex items-center gap-1",children:["DOI ",a.jsx(Xh,{size:12})]})]},i))})]})]})}function ix(){const[t,e]=L.useState([]),[n,i]=L.useState([]),[r,s]=L.useState("include"),[o,l]=L.useState("All"),[c,u]=L.useState("Cathode"),[d,p]=L.useState("1.0"),[h,m]=L.useState("3.5"),v=x=>{if(r==="both"){t.includes(x)?(e(t.filter(f=>f!==x)),i([...n,x])):n.includes(x)?i(n.filter(f=>f!==x)):e([...t,x]);return}r==="include"?t.includes(x)?e(t.filter(f=>f!==x)):(i(n.filter(f=>f!==x)),e([...t,x])):n.includes(x)?i(n.filter(f=>f!==x)):(e(t.filter(f=>f!==x)),i([...n,x]))},b=(x,f)=>{f==="include"?e(t.filter(g=>g!==x)):i(n.filter(g=>g!==x))};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(ZS,{size:14})," Multi-Criteria Search Engine"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Advanced Periodic Search"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Filter crystallographic databases by stoichiometric composition, IUPAC element constraints, space group symmetries, and property thresholds."})]}),a.jsxs("div",{className:"bg-white rounded-2xl p-4 shadow-sm border border-[#EFE5DC] flex flex-wrap items-center justify-between gap-3",children:[a.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs",children:[a.jsx("span",{className:"font-semibold text-[#1E2227]",children:"Active Filter Constraints:"}),t.map(x=>a.jsxs("span",{className:"px-2.5 py-1 bg-[#FBE8D8] text-[#F1641D] rounded-lg font-bold flex items-center gap-1 text-xs",children:["+",x,a.jsx(Ys,{size:12,className:"cursor-pointer hover:opacity-75",onClick:()=>b(x,"include")})]},x)),n.map(x=>a.jsxs("span",{className:"px-2.5 py-1 bg-[#ECEFF1] text-[#374151] rounded-lg font-bold flex items-center gap-1 text-xs",children:["-",x,a.jsx(Ys,{size:12,className:"cursor-pointer hover:opacity-75",onClick:()=>b(x,"exclude")})]},x)),t.length===0&&n.length===0&&a.jsx("span",{className:"text-xs text-[#8C929C] italic",children:"No elements selected"})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("span",{className:"text-xs text-[#8C929C]",children:"Mode:"}),a.jsx("button",{onClick:()=>s("include"),className:`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${r==="include"?"bg-[#F1641D] text-white shadow-sm":"bg-[#FAF4EE] text-[#5F6771]"}`,children:"+ Include Element"}),a.jsx("button",{onClick:()=>s("both"),className:`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${r==="both"?"bg-[#5B636E] text-white shadow-sm":"bg-[#FAF4EE] text-[#5F6771]"}`,children:"Both"}),a.jsx("button",{onClick:()=>s("exclude"),className:`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${r==="exclude"?"bg-[#374151] text-white shadow-sm":"bg-[#FAF4EE] text-[#5F6771]"}`,children:"− Exclude Element"})]})]}),a.jsxs("div",{className:"bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4",children:[a.jsxs("div",{className:"flex justify-between items-center text-xs text-[#8C929C]",children:[a.jsx("span",{children:"Click any element to add to active query filter"}),a.jsxs("span",{className:"flex items-center gap-3",children:[a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2.5 h-2.5 bg-[#F1641D] rounded-full"})," ","Included"]}),a.jsxs("span",{className:"flex items-center gap-1",children:[a.jsx("span",{className:"w-2.5 h-2.5 bg-[#374151] rounded-full"})," ","Excluded"]})]})]}),a.jsx(e_,{includeElements:t,excludeElements:n,onElementClick:v})]}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[a.jsxs("div",{className:"bg-white rounded-2xl p-6 shadow-card border border-[#EFE5DC] space-y-3",children:[a.jsx("label",{className:"block text-xs font-bold text-[#1E2227]",children:"Crystal System"}),a.jsxs("select",{value:o,onChange:x=>l(x.target.value),className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none",children:[a.jsx("option",{value:"All",children:"All Crystal Systems"}),a.jsx("option",{value:"Cubic",children:"Cubic"}),a.jsx("option",{value:"Tetragonal",children:"Tetragonal"}),a.jsx("option",{value:"Orthorhombic",children:"Orthorhombic"}),a.jsx("option",{value:"Trigonal",children:"Trigonal / Rhombohedral"}),a.jsx("option",{value:"Hexagonal",children:"Hexagonal"}),a.jsx("option",{value:"Monoclinic",children:"Monoclinic"})]})]}),a.jsxs("div",{className:"bg-white rounded-2xl p-6 shadow-card border border-[#EFE5DC] space-y-3",children:[a.jsx("label",{className:"block text-xs font-bold text-[#1E2227]",children:"Material Application"}),a.jsxs("select",{value:c,onChange:x=>u(x.target.value),className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none",children:[a.jsx("option",{value:"Cathode",children:"Cathode Material"}),a.jsx("option",{value:"Anode",children:"Anode Material"}),a.jsx("option",{value:"Electrolyte",children:"Solid Electrolyte"}),a.jsx("option",{value:"Oxide",children:"Oxide"}),a.jsx("option",{value:"Sulfide",children:"Sulfide"}),a.jsx("option",{value:"Phosphate",children:"Phosphate"})]})]}),a.jsxs("div",{className:"bg-white rounded-2xl p-6 shadow-card border border-[#EFE5DC] space-y-3",children:[a.jsx("label",{className:"block text-xs font-bold text-[#1E2227]",children:"Band Gap Range (eV)"}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsx("input",{type:"number",value:d,onChange:x=>p(x.target.value),placeholder:"Min",className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs outline-none"}),a.jsx("input",{type:"number",value:h,onChange:x=>m(x.target.value),placeholder:"Max",className:"w-full bg-[#FAF4EE] border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs outline-none"})]})]})]}),a.jsxs("div",{className:"flex justify-end gap-3 pt-2",children:[a.jsxs("button",{onClick:()=>{e([]),i([])},className:"px-5 py-2.5 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(co,{size:13})," Reset Constraints"]}),a.jsxs(Ot,{to:`/materials-search?${t.map(x=>`elements=${encodeURIComponent(x)}`).join("&")}${n.length&&t.length?"&":""}${n.map(x=>`exclude_elements=${encodeURIComponent(x)}`).join("&")}`,className:"px-6 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] flex items-center gap-2 shadow-soft",children:["Query Databases ",a.jsx(ia,{size:14})]})]})]})}function rx(){const[t,e]=L.useState("LiCoO2"),[n,i]=L.useState("PBE"),[r,s]=L.useState(520),[o,l]=L.useState("4x4x4"),[c,u]=L.useState("idle"),[d,p]=L.useState(0),h=m=>{m.preventDefault(),u("running"),p(15);const v=setInterval(()=>{p(b=>b>=95?(clearInterval(v),u("completed"),100):b+25)},600)};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(Er,{size:14})," Ab Initio Benchmarking"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"DFT Validation Engine"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Benchmark machine learning predicted formation energy and forces against high-accuracy Density Functional Theory calculations."})]}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsxs("div",{className:"lg:col-span-5 space-y-6",children:[a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Calculation Parameters"}),a.jsxs("form",{onSubmit:h,className:"space-y-4",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Chemical Formula or MP-ID"}),a.jsx("input",{type:"text",value:t,onChange:m=>e(m.target.value),placeholder:"e.g. LiCoO2, mp-22526",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-4 py-2.5 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors",required:!0})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Exchange Functional"}),a.jsxs("select",{value:n,onChange:m=>i(m.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]",children:[a.jsx("option",{value:"PBE",children:"PBE (Generalized Gradient)"}),a.jsx("option",{value:"PBEsol",children:"PBEsol (Solids)"}),a.jsx("option",{value:"SCAN",children:"SCAN (Meta-GGA)"}),a.jsx("option",{value:"HSE06",children:"HSE06 (Hybrid)"})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Plane-Wave Cutoff (eV)"}),a.jsx("input",{type:"number",value:r,onChange:m=>s(Number(m.target.value)),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"k-point Mesh Density"}),a.jsxs("select",{value:o,onChange:m=>l(m.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]",children:[a.jsx("option",{value:"4x4x4",children:"4 × 4 × 4 (Gamma-centered)"}),a.jsx("option",{value:"6x6x6",children:"6 × 6 × 6 (Dense standard)"}),a.jsx("option",{value:"8x8x8",children:"8 × 8 × 8 (Convergence test)"})]})]}),a.jsx("div",{className:"pt-2",children:a.jsxs("button",{type:"submit",disabled:c==="running",className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft flex items-center justify-center gap-2 disabled:opacity-50",children:[c==="running"?"Computing SCF Iterations...":"Dispatch DFT Calculation"," ",a.jsx(qh,{size:14})]})})]})]}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] text-xs text-[#5B636E] space-y-2",children:[a.jsx("h4",{className:"font-bold text-[#1E2227]",children:"Precision Guidelines"}),a.jsx("p",{children:"Ground-truth DFT simulations run using Quantum ESPRESSO / VASP backend clusters. Calculations benchmark total energy, Fermi levels, and band edges."})]})]}),a.jsxs("div",{className:"lg:col-span-7 space-y-6",children:[c==="idle"&&a.jsxs("div",{className:"bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] space-y-4 flex flex-col items-center justify-center min-h-[420px]",children:[a.jsx("div",{className:"w-16 h-16 rounded-full bg-[#FBE8D8] text-[#F1641D] flex items-center justify-center",children:a.jsx(Er,{size:32})}),a.jsx("h3",{className:"text-xl font-headline font-bold text-[#1E2227]",children:"Awaiting Calculation Dispatch"}),a.jsx("p",{className:"text-xs text-[#6C737E] max-w-sm",children:"Configure your structural inputs and functional parameters on the left, then dispatch the job to benchmark against ML ground truth."})]}),c==="running"&&a.jsxs("div",{className:"bg-white rounded-[2rem] p-10 shadow-card border border-[#EFE5DC] space-y-6 min-h-[420px] flex flex-col justify-center",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Self-Consistent Field (SCF) Iteration"}),a.jsxs("p",{className:"text-xs text-[#8C929C]",children:["Calculating Kohn-Sham eigenvalues for ",t]})]}),a.jsxs("span",{className:"text-xs font-mono font-bold text-[#F1641D]",children:[d,"%"]})]}),a.jsx("div",{className:"w-full h-3 bg-[#FAF4EE] rounded-full overflow-hidden border border-[#EFE5DC]",children:a.jsx("div",{className:"h-full bg-[#F1641D] rounded-full transition-all duration-300",style:{width:`${d}%`}})}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-xl p-4 font-mono text-[11px] text-[#5B636E] space-y-1",children:[a.jsxs("p",{children:["▶ Initializing plane-wave basis set (cutoff = ",r," eV)..."]}),a.jsxs("p",{children:["▶ Generating k-point grid (",o,")..."]}),a.jsx("p",{children:"▶ Iteration 14: dE = 1.48e-05 eV, charge density residual = 8.12e-06"}),a.jsxs("p",{className:"text-[#F1641D]",children:["▶ Converging exchange-correlation potential (",n,")..."]})]})]}),c==="completed"&&a.jsxs("div",{className:"bg-white rounded-[2rem] p-8 shadow-card border border-[#EFE5DC] space-y-6",children:[a.jsxs("div",{className:"flex items-center justify-between border-b border-[#F2E7DC] pb-4",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx(Wh,{size:24,className:"text-[#2E7D32]"}),a.jsxs("div",{children:[a.jsx("h3",{className:"font-headline font-bold text-xl text-[#1E2227]",children:"DFT Converged Successfully"}),a.jsx("p",{className:"text-xs text-[#8C929C]",children:"Ground truth reached in 28 electronic steps"})]})]}),a.jsx("span",{className:"px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold rounded-full",children:"10⁻⁶ eV Tolerated"})]}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:[a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-2xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[10px] text-[#8C929C] uppercase font-bold",children:"GNN Prediction"}),a.jsx("p",{className:"text-2xl font-bold font-headline text-[#F1641D] mt-1",children:"-4.842 eV"}),a.jsx("p",{className:"text-[11px] text-[#6C737E]",children:"Formation Energy"})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-2xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[10px] text-[#8C929C] uppercase font-bold",children:"DFT Ground Truth"}),a.jsx("p",{className:"text-2xl font-bold font-headline text-[#1E2227] mt-1",children:"-4.860 eV"}),a.jsxs("p",{className:"text-[11px] text-[#6C737E]",children:[n," Functional"]})]}),a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-2xl border border-[#EFE5DC]",children:[a.jsx("span",{className:"text-[10px] text-[#8C929C] uppercase font-bold",children:"Absolute Error (Δ)"}),a.jsx("p",{className:"text-2xl font-bold font-headline text-[#2E7D32] mt-1",children:"0.018 eV"}),a.jsx("p",{className:"text-[11px] text-[#2E7D32]",children:"Within chemical accuracy"})]})]}),a.jsxs("div",{className:"space-y-3 pt-2",children:[a.jsx("h4",{className:"text-xs font-bold text-[#1E2227]",children:"Electronic Descriptors Delta"}),a.jsxs("div",{className:"space-y-2 text-xs",children:[a.jsxs("div",{className:"flex justify-between text-[#5B636E]",children:[a.jsx("span",{children:"Band Gap (GNN: 2.45 eV vs DFT: 2.48 eV)"}),a.jsx("span",{className:"font-mono text-[#2E7D32]",children:"Δ 0.03 eV"})]}),a.jsx("div",{className:"w-full h-2 bg-[#FAF4EE] rounded-full overflow-hidden",children:a.jsx("div",{className:"h-full bg-[#F1641D] rounded-full",style:{width:"94%"}})})]})]}),a.jsxs("div",{className:"pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F2E7DC]",children:[a.jsxs("button",{onClick:()=>u("idle"),className:"px-4 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx(co,{size:13})," Reset"]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsxs("button",{onClick:()=>alert("CONTCAR and calculation log exported to workspace."),className:"px-4 py-2 bg-[#FAF4EE] text-[#1E2227] rounded-xl text-xs font-medium hover:bg-[#EFE5DC] flex items-center gap-1.5",children:[a.jsx(ji,{size:13})," Export CONTCAR"]}),a.jsxs("button",{onClick:()=>alert("DFT benchmark saved to active research collection."),className:"px-5 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-medium hover:bg-[#D9520F] flex items-center gap-1.5",children:["Save Benchmark ",a.jsx(Xt,{size:13})]})]})]})]})]})]})]})}function sx(){const t=Nr(),[e,n]=L.useState("Na3Zr2Si2PO12"),[i,r]=L.useState("NASICON"),[s,o]=L.useState("Sc"),[l,c]=L.useState("0.1"),[u,d]=L.useState(!0),[p,h]=L.useState(!1),m=`data_Na3Zr2Si2PO12_NASICON
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
O2  O  0.18820 0.01630 0.19320 1.0000`,v=()=>{navigator.clipboard.writeText(m),h(!0),setTimeout(()=>h(!1),2e3)},b=()=>{const x=new Blob([m],{type:"text/plain;charset=utf-8"}),f=URL.createObjectURL(x),g=document.createElement("a");g.href=f,g.download=`${e}_${i}.cif`,g.click(),URL.revokeObjectURL(f)};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(VS,{size:14})," Structure Synthesis Engine"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"CIF Generation & Doping"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Synthesize crystallographic structures from stoichiometric compositions or reference prototype families with automated Wyckoff site population."})]}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsx("div",{className:"lg:col-span-5 space-y-6",children:a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Stoichiometric Synthesis"}),a.jsxs("form",{onSubmit:x=>{x.preventDefault(),d(!0)},className:"space-y-4",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Target Chemical Formula"}),a.jsx("input",{type:"text",value:e,onChange:x=>n(x.target.value),placeholder:"e.g. Na3Zr2Si2PO12, Li7La3Zr2O12",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-4 py-2.5 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors font-mono",required:!0})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-xs font-semibold text-[#1E2227] mb-1.5",children:"Reference Prototype Family"}),a.jsxs("select",{value:i,onChange:x=>r(x.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]",children:[a.jsx("option",{value:"NASICON",children:"NASICON (Superionic Conductor)"}),a.jsx("option",{value:"Garnet",children:"Garnet (e.g. LLZO)"}),a.jsx("option",{value:"Perovskite",children:"Perovskite (ABX3)"}),a.jsx("option",{value:"Spinel",children:"Spinel (Fd-3m)"}),a.jsx("option",{value:"Layered",children:"Layered Oxide (R-3m)"})]})]}),a.jsxs("div",{className:"pt-2 border-t border-[#F2E7DC]",children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("span",{className:"text-xs font-bold text-[#1E2227]",children:"Site Substitution (Doping)"}),a.jsx("span",{className:"text-[10px] text-[#F1641D] font-semibold",children:"Optional"})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-[11px] text-[#6C737E] mb-1",children:"Dopant Element"}),a.jsx("input",{type:"text",value:s,onChange:x=>o(x.target.value),placeholder:"e.g. Sc, Y, Al",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block text-[11px] text-[#6C737E] mb-1",children:"Fraction (x)"}),a.jsx("input",{type:"number",step:"0.05",value:l,onChange:x=>c(x.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs text-[#1E2227] outline-none focus:border-[#F1641D]"})]})]})]}),a.jsx("div",{className:"pt-3",children:a.jsxs("button",{type:"submit",className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft flex items-center justify-center gap-2 active:scale-98",children:["Synthesize Crystallographic Unit Cell ",a.jsx(Yh,{size:14})]})})]})]})}),a.jsx("div",{className:"lg:col-span-7 space-y-6",children:u&&a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsxs("div",{className:"flex items-center justify-between border-b border-[#F2E7DC] pb-4",children:[a.jsxs("div",{children:[a.jsxs("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:["Generated CIF: ",e]}),a.jsx("p",{className:"text-xs text-[#8C929C]",children:"Space Group: R -3 c (No. 167) • Trigonal"})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsxs("button",{onClick:v,className:"p-2 border border-[#E9DFD4] rounded-xl text-xs text-[#5F6771] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[p?a.jsx(Wv,{size:13,className:"text-[#2E7D32]"}):a.jsx(jS,{size:13}),p?"Copied":"Copy CIF"]}),a.jsxs("button",{onClick:b,className:"px-4 py-2 bg-[#F1641D] text-white rounded-xl text-xs font-medium hover:bg-[#D9520F] flex items-center gap-1.5 shadow-sm",children:[a.jsx(ji,{size:13})," Download .cif"]})]})]}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6",children:[a.jsx("div",{className:"w-40 h-40 flex items-center justify-center shrink-0",children:a.jsx("img",{src:"/assets/about_lattice.png",alt:"Lattice Preview",className:"max-h-full max-w-full object-contain drop-shadow-md"})}),a.jsxs("div",{className:"space-y-2 text-xs text-[#5F6771] flex-1",children:[a.jsx("h4",{className:"font-bold text-[#1E2227] font-headline text-sm",children:"Lattice Vectors & Volume"}),a.jsxs("div",{className:"grid grid-cols-3 gap-2 font-mono text-[11px]",children:[a.jsx("div",{children:"a: 8.804 Å"}),a.jsx("div",{children:"b: 8.804 Å"}),a.jsx("div",{children:"c: 22.758 Å"}),a.jsx("div",{children:"α: 90.0°"}),a.jsx("div",{children:"β: 90.0°"}),a.jsx("div",{children:"γ: 120.0°"})]}),a.jsx("p",{className:"text-[11px] text-[#8C929C] pt-1",children:"Volume: 1528.2 Å³ • Cell Formula Units (Z): 6"})]})]}),a.jsxs("div",{children:[a.jsxs("div",{className:"flex justify-between items-center text-xs font-semibold text-[#1E2227] mb-2",children:[a.jsx("span",{children:"Crystallographic Block Viewer"}),a.jsx("span",{className:"text-[#8C929C] text-[11px] font-mono",children:"CIF v1.1 Standard"})]}),a.jsx("pre",{className:"bg-[#FAF4EE] border border-[#EFE5DC] rounded-xl p-4 text-[11px] font-mono text-[#1E2227] overflow-x-auto max-h-60 leading-relaxed",children:m})]}),a.jsxs("div",{className:"pt-2 flex justify-end gap-3",children:[a.jsxs("button",{onClick:()=>t("/app/structures"),className:"px-4 py-2 border border-[#E9DFD4] rounded-xl text-xs font-medium text-[#1E2227] hover:bg-[#FAF4EE] flex items-center gap-1.5",children:[a.jsx($v,{size:14})," Open in 3D Viewer"]}),a.jsxs("button",{onClick:()=>t("/app/predict"),className:"px-5 py-2 bg-[#1E2227] text-white rounded-xl text-xs font-medium hover:bg-black flex items-center gap-1.5",children:["Predict Properties for Structure ",a.jsx(Xt,{size:14})]})]})]})})]})]})}async function ns(t,e){const n=localStorage.getItem("accessToken"),i=new Headers(e==null?void 0:e.headers);n&&i.set("Authorization",`Bearer ${n}`);let r;try{r=await fetch(`${fo}${t}`,{...e,headers:i})}catch{throw new gu(`Backend unavailable at ${fo}. Start the FastAPI server and try again.`,0,!0)}const s=await r.text();let o=null;try{o=s?JSON.parse(s):null}catch{throw new gu(`Backend returned a non-JSON response (HTTP ${r.status}).`,r.status)}if(!r.ok){const l=o&&typeof o=="object"&&"detail"in o?String(o.detail):`Request failed with HTTP ${r.status}.`;throw new gu(l,r.status)}return o}async function Eb(t,e=["bulk_modulus","shear_modulus","thermal"],n=298.15){const i=new FormData;return i.append("file",t),i.append("properties",e.join(",")),i.append("temperature",String(n)),ns("/api/calculations/predict-properties",{method:"POST",body:i})}async function Sb(t,e=[]){const n=new FormData;return n.append("file",t),e.forEach(i=>n.append("structure_files",i)),ns("/api/materials-prediction/datasets/upload",{method:"POST",body:n})}function bb(){return ns("/api/materials-prediction/properties")}function Mb(){return ns("/api/materials-prediction/models/capabilities")}function wb(t){return ns("/api/materials-prediction/predictions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function Cb(t){return ns(`/api/materials-prediction/predictions/${encodeURIComponent(t)}`)}function Ab(t){return ns(`/api/materials-prediction/predictions/${encodeURIComponent(t)}/results`)}function ax(t,e="zip"){return`${fo}/api/materials-prediction/predictions/${encodeURIComponent(t)}/download/${e}`}function ox(){const[t,e]=L.useState(null),[n,i]=L.useState([]),[r,s]=L.useState({}),[o,l]=L.useState([]),[c,u]=L.useState(""),[d,p]=L.useState([]),[h,m]=L.useState(null),[v,b]=L.useState("idle"),[x,f]=L.useState(0),[g,w]=L.useState([]),[S,y]=L.useState(!0),[M,A]=L.useState(!1),[_,T]=L.useState(null);L.useEffect(()=>{Promise.all([Mb(),bb()]).then(([D,I])=>{const F=Object.fromEntries(Object.entries(D.models).filter(([,B])=>B.available));s(F),u(Object.keys(F)[0]??""),l(I.filter(B=>!B.unsupported)),p(I.filter(B=>!B.unsupported).slice(0,1).map(B=>B.key))}).catch(D=>T(D instanceof Error?D.message:"Could not load prediction capabilities.")).finally(()=>y(!1))},[]),L.useEffect(()=>{if(!h||!M)return;const D=window.setInterval(async()=>{try{const I=await Cb(h);b(I.status),f(I.progress_percent??0),["completed","failed","canceled"].includes(I.status)&&(window.clearInterval(D),A(!1),I.status==="completed"&&w((await Ab(h)).results))}catch(I){window.clearInterval(D),A(!1),T(I instanceof Error?I.message:"Could not read prediction job status.")}},1e3);return()=>window.clearInterval(D)},[h,M]);const R=D=>p(I=>I.includes(D)?I.filter(F=>F!==D):[...I,D]),P=async D=>{if(D.preventDefault(),!t)return T("Upload a CSV dataset before starting a batch job.");if(!c||d.length===0)return T("Select an available model and at least one supported property.");T(null),w([]),A(!0),b("uploading"),f(0);try{const I=await Sb(t,n),F=await wb({dataset_id:I.dataset_id,selected_models:[c],selected_properties:d});m(F.job_id),b(F.status),f(F.progress_percent??0)}catch(I){A(!1),b("failed"),T(I instanceof Error?I.message:"Batch prediction failed.")}};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(ib,{size:14})," Backend batch pipeline"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Batch Property Prediction"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Upload a supported CSV dataset and optional CIF structures, then monitor the real prediction job."})]}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsxs("form",{onSubmit:P,className:"lg:col-span-4 bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsx("h2",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Dataset and configuration"}),a.jsxs("label",{className:"block text-xs font-semibold text-[#1E2227]",children:["CSV dataset",a.jsxs("span",{className:"mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-[#E9DFD4] bg-[#FAF4EE]/50 px-3 py-3 text-[#6C737E] cursor-pointer",children:[a.jsx(Jv,{size:15,className:"text-[#F1641D]"}),a.jsx("span",{className:"truncate",children:(t==null?void 0:t.name)??"Choose a .csv file"}),a.jsx("input",{type:"file",accept:".csv",className:"sr-only",onChange:D=>{var I;return e(((I=D.target.files)==null?void 0:I[0])??null)}})]})]}),a.jsxs("label",{className:"block text-xs font-semibold text-[#1E2227]",children:["Optional CIF structures",a.jsx("input",{type:"file",accept:".cif",multiple:!0,className:"mt-1.5 block w-full text-xs text-[#6C737E]",onChange:D=>i(Array.from(D.target.files??[]))})]}),a.jsxs("label",{className:"block text-xs font-semibold text-[#1E2227]",children:["Available model",a.jsxs("select",{value:c,onChange:D=>u(D.target.value),disabled:S,className:"mt-1.5 w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2 text-xs",children:[a.jsx("option",{value:"",children:S?"Loading capabilities...":"No available models"}),Object.entries(r).map(([D,I])=>a.jsxs("option",{value:D,children:[I.name," (",I.device??"device unavailable",")"]},D))]})]}),a.jsxs("div",{children:[a.jsx("span",{className:"block text-xs font-semibold text-[#1E2227] mb-2",children:"Supported properties"}),a.jsx("div",{className:"space-y-2",children:o.map(D=>a.jsxs("label",{className:"flex items-center gap-2 text-xs text-[#5F6771]",children:[a.jsx("input",{type:"checkbox",checked:d.includes(D.key),onChange:()=>R(D.key)}),D.name," (",D.unit||"unit unavailable",")"]},D.key))}),!S&&o.length===0&&a.jsx("p",{className:"text-xs text-[#8C929C]",children:"No supported properties returned by the backend."})]}),a.jsxs("button",{type:"submit",disabled:M||S,className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] disabled:opacity-50 flex items-center justify-center gap-2",children:[a.jsx(qh,{size:14}),M?"Running batch job...":"Run backend batch prediction"]}),_&&a.jsxs("div",{role:"alert",className:"flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700",children:[a.jsx(Hh,{size:15,className:"shrink-0"}),_]})]}),a.jsxs("section",{className:"lg:col-span-8 bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5","aria-label":"Batch prediction results",children:[a.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E7DC] pb-4",children:[a.jsxs("div",{children:[a.jsx("h2",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Execution status"}),a.jsx("p",{className:"text-xs text-[#8C929C]",children:v==="idle"?"Awaiting a real backend job.":v})]}),h&&!M&&a.jsxs("div",{className:"flex gap-2",children:[a.jsxs("a",{href:ax(h,"csv"),className:"px-3 py-1.5 bg-[#FAF4EE] rounded-xl text-xs flex items-center gap-1.5",children:[a.jsx(ji,{size:13})," CSV"]}),a.jsxs("a",{href:ax(h,"zip"),className:"px-3 py-1.5 bg-[#F1641D] text-white rounded-xl text-xs flex items-center gap-1.5",children:[a.jsx(ji,{size:13})," ZIP"]})]})]}),M&&a.jsxs("div",{className:"space-y-2",children:[a.jsxs("div",{className:"flex justify-between text-xs",children:[a.jsx("span",{children:"Backend progress"}),a.jsxs("span",{children:[x,"%"]})]}),a.jsx("div",{className:"h-3 bg-[#FAF4EE] rounded-full overflow-hidden",children:a.jsx("div",{className:"h-full bg-[#F1641D] transition-all",style:{width:`${x}%`}})})]}),!g.length&&!M&&a.jsx("div",{className:"py-16 text-center text-sm text-[#6C737E]",children:"Results will appear here after a completed backend job."}),!!g.length&&a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-left text-xs",children:[a.jsx("thead",{children:a.jsx("tr",{className:"border-b border-[#F2E7DC] text-[#8C929C]",children:Object.keys(g[0]).map(D=>a.jsx("th",{className:"py-2 px-3",children:D},D))})}),a.jsx("tbody",{children:g.map((D,I)=>a.jsx("tr",{className:"border-b border-[#FAF4EE]",children:a.jsx(a.Fragment,{children:Object.entries(D).map(([F,B])=>a.jsx("td",{className:"py-3 px-3 font-mono",children:String(B??"Not available")},F))})},I))})]})})]})]})]})}const Ei=t=>(e,n)=>typeof e=="number"?`${e.toFixed(t)} ${n}`:"N/A",Tb=t=>(e,n)=>typeof e=="number"?`${e.toExponential(t)} ${n}`:"N/A",t_=[{key:"bulk_modulus",title:"Bulk Modulus (K_VRH)",category:"Mechanical",unit:"GPa",requiresModel:"gnn",format:Ei(3)},{key:"shear_modulus",title:"Shear Modulus (G_VRH)",category:"Mechanical",unit:"GPa",requiresModel:"gnn",format:Ei(3)},{key:"youngs_modulus",title:"Young's Modulus",category:"Mechanical",unit:"GPa",requiresModel:"gnn",format:Ei(3)},{key:"poisson_ratio",title:"Poisson's Ratio",category:"Mechanical",unit:"",requiresModel:"gnn",format:t=>typeof t=="number"?t.toFixed(4):"N/A"},{key:"compressibility",title:"Compressibility",category:"Mechanical",unit:"GPa⁻¹",requiresModel:"gnn",format:Tb(3)},{key:"elastic_anisotropy",title:"Elastic Anisotropy",category:"Mechanical",unit:"",requiresModel:"gnn",format:t=>typeof t=="number"?t.toFixed(4):"N/A"},{key:"thermal",title:"EOS Bulk Modulus (B0)",category:"Thermal",unit:"GPa",requiresModel:"gnn",format:Ei(2)},{key:"debye_temperature",title:"Debye Temperature",category:"Thermal",unit:"K",requiresModel:"gnn",format:Ei(1)},{key:"thermal_conductivity",title:"Thermal Conductivity",category:"Thermal",unit:"W/m·K",requiresModel:"gnn",format:Ei(3)},{key:"band_gap",title:"Electronic Band Gap",category:"Electronic",unit:"eV",requiresModel:"gnn",format:Ei(3)},{key:"electronic_state",title:"Electronic State",category:"Electronic",unit:"",requiresModel:"gnn",format:t=>typeof t=="string"?t:"N/A"},{key:"ionic_conductivity",title:"Ionic Conductivity",category:"Ionic Transport",unit:"mS/cm",requiresModel:"base",format:Ei(3)},{key:"ionic_conductivity_activation_energy",title:"Activation Energy (Ea)",category:"Ionic Transport",unit:"eV",requiresModel:"base",format:Ei(3)}],Nb=Object.fromEntries(t_.map(t=>[t.key,t])),Rb=["Mechanical","Thermal","Electronic","Ionic Transport"],Db={gnn:"GNN",base:"Ionic Surrogate"},lx="https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js";let Xo=null;function Pb(){return window.$3Dmol?Promise.resolve(window.$3Dmol):Xo||(Xo=new Promise((t,e)=>{const n=document.querySelector(`script[src="${lx}"]`);if(n){n.addEventListener("load",()=>t(window.$3Dmol)),n.addEventListener("error",()=>e(new Error("Failed to load 3Dmol.js")));return}const i=document.createElement("script");i.src=lx,i.async=!0,i.onload=()=>t(window.$3Dmol),i.onerror=()=>e(new Error("Failed to load 3Dmol.js")),document.body.appendChild(i)}),Xo)}function Fb(t){const[e,n]=L.useState(null);return L.useEffect(()=>{if(!t){n(null);return}let i=!1;return t.text().then(r=>{i||n(r)}).catch(()=>{i||n(null)}),()=>{i=!0}},[t]),e}function Lb({cifText:t}){const e=L.useRef(null),n=L.useRef(null),[i,r]=L.useState("idle");return L.useEffect(()=>{if(!t||!e.current){r("idle");return}let s=!1;return r("loading"),Pb().then(o=>{if(s||!e.current)return;e.current.innerHTML="";const l=o.createViewer(e.current,{backgroundColor:"white"});n.current=l,l.addModel(t,"cif"),l.setStyle({},{sphere:{scale:.28},stick:{radius:.1}});try{l.addUnitCell()}catch{}l.zoomTo(),l.render(),s||r("ready")}).catch(()=>{s||r("error")}),()=>{if(s=!0,n.current){try{n.current.clear()}catch{}n.current=null}}},[t]),t?a.jsxs("div",{className:"w-full h-full relative",children:[a.jsx("div",{ref:e,className:"w-full h-full"}),i==="loading"&&a.jsx("div",{className:"absolute inset-0 flex items-center justify-center text-xs text-[#6C737E] bg-white/70",children:"Loading structure viewer…"}),i==="error"&&a.jsx("div",{className:"absolute inset-0 flex items-center justify-center text-xs text-red-600 bg-white/90 px-4 text-center",children:"Couldn't load the 3D structure viewer. Check your network connection and try again."})]}):a.jsxs("div",{className:"text-center space-y-2 p-4",children:[a.jsx(lo,{className:"mx-auto text-[#F1641D]",size:32}),a.jsx("p",{className:"text-xs font-medium text-[#1E2227]",children:"Upload a CIF file to preview the 3D crystal structure."})]})}function cx(){const[t,e]=L.useState(null),[n,i]=L.useState(["bulk_modulus","shear_modulus","thermal"]),[r,s]=L.useState(null),[o,l]=L.useState(!1),[c,u]=L.useState(null),d=Fb(t),p=m=>{i(v=>v.includes(m)?v.filter(b=>b!==m):[...v,m])},h=async m=>{if(m.preventDefault(),!t){u("Upload a CIF file before running a prediction.");return}if(n.length===0){u("Select at least one property to compute.");return}l(!0),u(null),s(null);try{const v=await Eb(t,n);s(v)}catch(v){u(v instanceof Error?v.message:"Prediction failed. Ensure backend service is running.")}finally{l(!1)}};return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsx(Ib,{}),a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[a.jsx("div",{className:"lg:col-span-5",children:a.jsxs("form",{onSubmit:h,className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6",children:[a.jsx("h2",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Prediction Inputs"}),a.jsx(Ub,{file:t,onChange:e}),a.jsx(kb,{selectedKeys:n,onToggle:p}),a.jsxs("button",{type:"submit",disabled:o,className:"w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors",children:[o?"Running Model Inference & Property Calculators...":"Run Property Prediction",a.jsx(qh,{size:14})]}),c&&a.jsxs("div",{role:"alert",className:"flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700",children:[a.jsx(Hh,{size:15,className:"shrink-0"}),c]})]})}),a.jsx("div",{className:"lg:col-span-7",children:a.jsx(Ob,{result:r,loading:o,cifText:d})})]})]})}function Ib(){return a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(oc,{size:14})," Unified Material Property Inference"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Property Prediction Engine"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Submit a CIF structure to calculate desired target properties using optimized model pipelines."})]})}function Ub({file:t,onChange:e}){return a.jsxs("label",{className:"block text-xs font-semibold text-[#1E2227]",children:["CIF Structure File",a.jsxs("span",{className:"mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-[#E9DFD4] bg-[#FAF4EE]/50 px-3 py-3 text-[#6C737E] cursor-pointer hover:border-[#F1641D] transition-colors",children:[a.jsx(Jv,{size:15,className:"text-[#F1641D]"}),a.jsx("span",{className:"truncate",children:(t==null?void 0:t.name)??"Choose a .cif file"}),a.jsx("input",{type:"file",accept:".cif,.CIF",className:"sr-only",onChange:n=>{var i;return e(((i=n.target.files)==null?void 0:i[0])??null)}})]})]})}function kb({selectedKeys:t,onToggle:e}){return a.jsxs("div",{className:"space-y-3",children:[a.jsx("span",{className:"block text-xs font-semibold text-[#1E2227]",children:"Target Properties"}),a.jsx("div",{className:"max-h-80 overflow-y-auto pr-1 space-y-4",children:Rb.map(n=>{const i=t_.filter(r=>r.category===n);return a.jsxs("div",{className:"space-y-1.5",children:[a.jsx("span",{className:"block text-[10px] font-bold uppercase tracking-wider text-[#8C929C]",children:n}),a.jsx("div",{className:"space-y-1.5",children:i.map(r=>{const s=t.includes(r.key);return a.jsxs("div",{onClick:()=>e(r.key),className:`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${s?"border-[#F1641D] bg-[#FAF4EE] text-[#1E2227]":"border-[#E9DFD4] text-[#6C737E] hover:border-[#F1641D]"}`,children:[a.jsxs("div",{className:"flex items-center gap-2 truncate",children:[s?a.jsx(JS,{size:16,className:"text-[#F1641D] shrink-0"}):a.jsx(QS,{size:16,className:"text-gray-400 shrink-0"}),a.jsx("span",{className:"font-medium truncate",children:r.title})]}),a.jsxs("div",{className:"flex items-center gap-1.5 shrink-0",children:[a.jsx("span",{className:"text-[9px] uppercase tracking-wider text-[#8C929C] bg-white/70 px-1.5 py-0.5 rounded border border-[#EFE5DC]",children:Db[r.requiresModel]}),a.jsx("span",{className:"text-[10px] uppercase tracking-wider text-[#8C929C] bg-white/70 px-2 py-0.5 rounded border border-[#EFE5DC]",children:r.unit||"—"})]})]},r.key)})})]},n)})})]})}function Ob({result:t,loading:e,cifText:n}){return e?a.jsxs("div",{className:"bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] text-sm text-[#6C737E] space-y-3",children:[a.jsx("div",{className:"animate-spin w-8 h-8 border-4 border-[#F1641D] border-t-transparent rounded-full mx-auto"}),a.jsx("p",{children:"Executing model inference and property calculators..."})]}):t?a.jsx(Bb,{result:t,cifText:n}):a.jsx("div",{className:"bg-white rounded-[2rem] p-12 text-center shadow-card border border-[#EFE5DC] text-sm text-[#6C737E]",children:"Awaiting CIF prediction request. Select a structure file and target properties to begin calculation."})}function Bb({result:t,cifText:e}){var c;const{material_metadata:n,base_outputs:i,properties:r,model_used:s}=t,o=(c=i==null?void 0:i.energy_per_atom)==null?void 0:c.value,l=Object.keys(r??{});return a.jsxs("section",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-6","aria-label":"Prediction result",children:[a.jsxs("div",{className:"border-b border-[#F2E7DC] pb-4 flex justify-between items-start",children:[a.jsxs("div",{children:[a.jsx("h2",{className:"font-headline font-bold text-2xl text-[#1E2227]",children:n.formula||"Predicted Structure"}),a.jsxs("p",{className:"text-xs text-[#8C929C] mt-1 flex items-center gap-2",children:[a.jsx(Zd,{size:12,className:"text-[#F1641D]"}),"Pipeline:"," ",a.jsx("span",{className:"uppercase font-semibold text-[#1E2227]",children:s})," ","· Sites: ",n.num_sites," · Volume:"," ",n.volume_A3.toFixed(2)," Å³"]})]}),a.jsxs("span",{className:"text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF4EE] text-[#F1641D] border border-[#EFE5DC]",children:["Density: ",n.density_g_cm3.toFixed(2)," g/cm³"]})]}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] space-y-3",children:[a.jsxs("div",{className:"flex justify-between items-center",children:[a.jsx("span",{className:"text-xs font-bold text-[#1E2227] uppercase tracking-wider",children:"Crystal Lattice Visualization"}),a.jsx("span",{className:"text-[10px] text-[#8C929C]",children:"Interactive 3D Unit Cell"})]}),a.jsx("div",{className:"w-full h-72 bg-white rounded-xl border border-[#EFE5DC] overflow-hidden relative flex items-center justify-center",children:a.jsx(Lb,{cifText:e})})]}),typeof o=="number"&&a.jsxs("div",{className:"bg-[#FAF4EE] rounded-2xl p-4 border border-[#EFE5DC] flex justify-between items-center",children:[a.jsxs("div",{children:[a.jsx("span",{className:"block text-xs font-bold text-[#8C929C] uppercase",children:"Potential Energy Per Atom"}),a.jsxs("span",{className:"text-xl font-headline font-bold text-[#1E2227]",children:[o.toFixed(4)," eV/atom"]})]}),a.jsx(lo,{className:"text-[#F1641D] opacity-80",size:24})]}),a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:l.map(u=>{var h;const d=r[u],p=Nb[u];return!d||!p?null:a.jsx(jb,{title:p.title,category:p.category,value:p.format(d.value,d.unit),status:d.status,warning:d.status==="estimated"||d.status==="calculated_with_warnings"||d.status==="failed"?(h=d.warnings)==null?void 0:h[0]:void 0},u)})})]})}function jb({title:t,value:e,category:n,status:i,warning:r}){return a.jsx("div",{className:"bg-[#FAF4EE] rounded-2xl p-5 border border-[#EFE5DC] flex flex-col justify-between",children:a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{className:"block text-[10px] font-bold text-[#8C929C] uppercase tracking-wider",children:n}),i&&i!=="calculated"&&a.jsx("span",{className:"text-[9px] uppercase tracking-wider text-[#F1641D] bg-white px-1.5 py-0.5 rounded border border-[#EFE5DC]",children:i.replace(/_/g," ")})]}),a.jsx("span",{className:"block text-xs font-bold text-[#1E2227] mt-1",children:t}),a.jsx("span",{className:"block mt-2 text-2xl font-headline font-bold text-[#1E2227] break-words",children:e}),r&&a.jsx("span",{className:"block mt-2 text-[10px] text-[#8C929C] leading-snug",children:r})]})})}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Kh="186",zb=0,ux=1,Vb=2,Nl=1,Gb=2,Na=3,Zr=0,En=1,fi=2,Fi=0,za=1,dx=2,fx=3,hx=4,Hb=5,ys=100,Wb=101,Xb=102,$b=103,qb=104,Yb=200,Kb=201,Zb=202,Jb=203,n_=204,i_=205,Qb=206,eM=207,tM=208,nM=209,iM=210,rM=211,sM=212,aM=213,oM=214,ef=0,tf=1,nf=2,ho=3,rf=4,sf=5,af=6,of=7,r_=0,lM=1,cM=2,gi=0,s_=1,a_=2,o_=3,Zh=4,l_=5,c_=6,u_=7,d_=300,Jr=301,Ks=302,vu=303,_u=304,Ic=306,lf=1e3,Di=1001,cf=1002,$t=1003,uM=1004,$o=1005,sn=1006,yu=1007,Vr=1008,An=1009,f_=1010,h_=1011,po=1012,Jh=1013,vi=1014,hi=1015,_i=1016,Qh=1017,ep=1018,mo=1020,p_=35902,m_=35899,x_=1021,g_=1022,Qn=1023,zi=1026,Gr=1027,v_=1028,tp=1029,Qr=1030,np=1031,ip=1033,Rl=33776,Dl=33777,Pl=33778,Fl=33779,uf=35840,df=35841,ff=35842,hf=35843,pf=36196,mf=37492,xf=37496,gf=37488,vf=37489,lc=37490,_f=37491,yf=37808,Ef=37809,Sf=37810,bf=37811,Mf=37812,wf=37813,Cf=37814,Af=37815,Tf=37816,Nf=37817,Rf=37818,Df=37819,Pf=37820,Ff=37821,Lf=36492,If=36494,Uf=36495,kf=36283,Of=36284,cc=36285,Bf=36286,dM=3200,jf=0,fM=1,lr="",wn="srgb",uc="srgb-linear",dc="linear",lt="srgb",Eu=7680,hM=519,pM=512,mM=513,xM=514,rp=515,gM=516,vM=517,sp=518,_M=519,yM=35044,px="300 es",pi=2e3,xo=2001;function EM(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function fc(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function SM(){const t=fc("canvas");return t.style.display="block",t}const mx={};function xx(...t){const e="THREE."+t.shift();console.log(e,...t)}function __(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Oe(...t){t=__(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function rt(...t){t=__(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function js(...t){const e=t.join(" ");e in mx||(mx[e]=!0,Oe(...t))}function bM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const MM={[ef]:tf,[nf]:af,[rf]:of,[ho]:sf,[tf]:ef,[af]:nf,[of]:rf,[sf]:ho};class is{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Su=Math.PI/180,zf=180/Math.PI;function bo(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(tn[t&255]+tn[t>>8&255]+tn[t>>16&255]+tn[t>>24&255]+"-"+tn[e&255]+tn[e>>8&255]+"-"+tn[e>>16&15|64]+tn[e>>24&255]+"-"+tn[n&63|128]+tn[n>>8&255]+"-"+tn[n>>16&255]+tn[n>>24&255]+tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]).toLowerCase()}function Qe(t,e,n){return Math.max(e,Math.min(n,t))}function wM(t,e){return(t%e+e)%e}function bu(t,e,n){return(1-n)*t+n*e}function ga(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:case Uint8ClampedArray:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function mn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const mp=class mp{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Qe(this.x,e.x,n.x),this.y=Qe(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Qe(this.x,e,n),this.y=Qe(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Qe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};mp.prototype.isVector2=!0;let Ze=mp;class ra{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,l){let c=i[r+0],u=i[r+1],d=i[r+2],p=i[r+3],h=s[o+0],m=s[o+1],v=s[o+2],b=s[o+3];if(p!==b||c!==h||u!==m||d!==v){let x=c*h+u*m+d*v+p*b;x<0&&(h=-h,m=-m,v=-v,b=-b,x=-x);let f=1-l;if(x<.9995){const g=Math.acos(x),w=Math.sin(g);f=Math.sin(f*g)/w,l=Math.sin(l*g)/w,c=c*f+h*l,u=u*f+m*l,d=d*f+v*l,p=p*f+b*l}else{c=c*f+h*l,u=u*f+m*l,d=d*f+v*l,p=p*f+b*l;const g=1/Math.sqrt(c*c+u*u+d*d+p*p);c*=g,u*=g,d*=g,p*=g}}e[n]=c,e[n+1]=u,e[n+2]=d,e[n+3]=p}static multiplyQuaternionsFlat(e,n,i,r,s,o){const l=i[r],c=i[r+1],u=i[r+2],d=i[r+3],p=s[o],h=s[o+1],m=s[o+2],v=s[o+3];return e[n]=l*v+d*p+c*m-u*h,e[n+1]=c*v+d*h+u*p-l*m,e[n+2]=u*v+d*m+l*h-c*p,e[n+3]=d*v-l*p-c*h-u*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,l=Math.cos,c=Math.sin,u=l(i/2),d=l(r/2),p=l(s/2),h=c(i/2),m=c(r/2),v=c(s/2);switch(o){case"XYZ":this._x=h*d*p+u*m*v,this._y=u*m*p-h*d*v,this._z=u*d*v+h*m*p,this._w=u*d*p-h*m*v;break;case"YXZ":this._x=h*d*p+u*m*v,this._y=u*m*p-h*d*v,this._z=u*d*v-h*m*p,this._w=u*d*p+h*m*v;break;case"ZXY":this._x=h*d*p-u*m*v,this._y=u*m*p+h*d*v,this._z=u*d*v+h*m*p,this._w=u*d*p-h*m*v;break;case"ZYX":this._x=h*d*p-u*m*v,this._y=u*m*p+h*d*v,this._z=u*d*v-h*m*p,this._w=u*d*p+h*m*v;break;case"YZX":this._x=h*d*p+u*m*v,this._y=u*m*p+h*d*v,this._z=u*d*v-h*m*p,this._w=u*d*p-h*m*v;break;case"XZY":this._x=h*d*p-u*m*v,this._y=u*m*p-h*d*v,this._z=u*d*v+h*m*p,this._w=u*d*p+h*m*v;break;default:Oe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],l=n[5],c=n[9],u=n[2],d=n[6],p=n[10],h=i+l+p;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-c)*m,this._y=(s-u)*m,this._z=(o-r)*m}else if(i>l&&i>p){const m=2*Math.sqrt(1+i-l-p);this._w=(d-c)/m,this._x=.25*m,this._y=(r+o)/m,this._z=(s+u)/m}else if(l>p){const m=2*Math.sqrt(1+l-i-p);this._w=(s-u)/m,this._x=(r+o)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+p-i-l);this._w=(o-r)/m,this._x=(s+u)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,l=n._x,c=n._y,u=n._z,d=n._w;return this._x=i*d+o*l+r*u-s*c,this._y=r*d+o*c+s*l-i*u,this._z=s*d+o*u+i*c-r*l,this._w=o*d-i*l-r*c-s*u,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,l=this.dot(e);l<0&&(i=-i,r=-r,s=-s,o=-o,l=-l);let c=1-n;if(l<.9995){const u=Math.acos(l),d=Math.sin(u);c=Math.sin(c*u)/d,n=Math.sin(n*u)/d,this._x=this._x*c+i*n,this._y=this._y*c+r*n,this._z=this._z*c+s*n,this._w=this._w*c+o*n,this._onChangeCallback()}else this._x=this._x*c+i*n,this._y=this._y*c+r*n,this._z=this._z*c+s*n,this._w=this._w*c+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const xp=class xp{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(gx.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(gx.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,l=e.z,c=e.w,u=2*(o*r-l*i),d=2*(l*n-s*r),p=2*(s*i-o*n);return this.x=n+c*u+o*p-l*d,this.y=i+c*d+l*u-s*p,this.z=r+c*p+s*d-o*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Qe(this.x,e.x,n.x),this.y=Qe(this.y,e.y,n.y),this.z=Qe(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Qe(this.x,e,n),this.y=Qe(this.y,e,n),this.z=Qe(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,l=n.y,c=n.z;return this.x=r*c-s*l,this.y=s*o-i*c,this.z=i*l-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Mu.copy(this).projectOnVector(e),this.sub(Mu)}reflect(e){return this.sub(Mu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Qe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};xp.prototype.isVector3=!0;let G=xp;const Mu=new G,gx=new ra,gp=class gp{constructor(e,n,i,r,s,o,l,c,u){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,l,c,u)}set(e,n,i,r,s,o,l,c,u){const d=this.elements;return d[0]=e,d[1]=r,d[2]=l,d[3]=n,d[4]=s,d[5]=c,d[6]=i,d[7]=o,d[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],l=i[3],c=i[6],u=i[1],d=i[4],p=i[7],h=i[2],m=i[5],v=i[8],b=r[0],x=r[3],f=r[6],g=r[1],w=r[4],S=r[7],y=r[2],M=r[5],A=r[8];return s[0]=o*b+l*g+c*y,s[3]=o*x+l*w+c*M,s[6]=o*f+l*S+c*A,s[1]=u*b+d*g+p*y,s[4]=u*x+d*w+p*M,s[7]=u*f+d*S+p*A,s[2]=h*b+m*g+v*y,s[5]=h*x+m*w+v*M,s[8]=h*f+m*S+v*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],l=e[5],c=e[6],u=e[7],d=e[8];return n*o*d-n*l*u-i*s*d+i*l*c+r*s*u-r*o*c}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],l=e[5],c=e[6],u=e[7],d=e[8],p=d*o-l*u,h=l*c-d*s,m=u*s-o*c,v=n*p+i*h+r*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/v;return e[0]=p*b,e[1]=(r*u-d*i)*b,e[2]=(l*i-r*o)*b,e[3]=h*b,e[4]=(d*n-r*c)*b,e[5]=(r*s-l*n)*b,e[6]=m*b,e[7]=(i*c-u*n)*b,e[8]=(o*n-i*s)*b,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,l){const c=Math.cos(s),u=Math.sin(s);return this.set(i*c,i*u,-i*(c*o+u*l)+o+e,-r*u,r*c,-r*(-u*o+c*l)+l+n,0,0,1),this}scale(e,n){return js("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(wu.makeScale(e,n)),this}rotate(e){return js("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(wu.makeRotation(-e)),this}translate(e,n){return js("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(wu.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};gp.prototype.isMatrix3=!0;let ze=gp;const wu=new ze,vx=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_x=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function CM(){const t={enabled:!0,workingColorSpace:uc,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===lt&&(r.r=Li(r.r),r.g=Li(r.g),r.b=Li(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===lt&&(r.r=zs(r.r),r.g=zs(r.g),r.b=zs(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===lr?dc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return js("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return js("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[uc]:{primaries:e,whitePoint:i,transfer:dc,toXYZ:vx,fromXYZ:_x,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:wn},outputColorSpaceConfig:{drawingBufferColorSpace:wn}},[wn]:{primaries:e,whitePoint:i,transfer:lt,toXYZ:vx,fromXYZ:_x,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:wn}}}),t}const et=CM();function Li(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function zs(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let os;class AM{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{os===void 0&&(os=fc("canvas")),os.width=e.width,os.height=e.height;const r=os.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=os}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=fc("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Li(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Li(n[i]/255)*255):n[i]=Li(n[i]);return{data:n,width:e.width,height:e.height}}else return Oe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let TM=0;class ap{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:TM++}),this.uuid=bo(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,l=r.length;o<l;o++)r[o].isDataTexture?s.push(Cu(r[o].image)):s.push(Cu(r[o]))}else s=Cu(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Cu(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?AM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Oe("Texture: Unable to serialize Texture."),{})}let NM=0;const Au=new G;class dn extends is{constructor(e=dn.DEFAULT_IMAGE,n=dn.DEFAULT_MAPPING,i=Di,r=Di,s=sn,o=Vr,l=Qn,c=An,u=dn.DEFAULT_ANISOTROPY,d=lr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:NM++}),this.uuid=bo(),this.name="",this.source=new ap(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=u,this.format=l,this.internalFormat=null,this.type=c,this.offset=new Ze(0,0),this.repeat=new Ze(1,1),this.center=new Ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Au).x}get height(){return this.source.getSize(Au).y}get depth(){return this.source.getSize(Au).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Oe(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Oe(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==d_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case lf:e.x=e.x-Math.floor(e.x);break;case Di:e.x=e.x<0?0:1;break;case cf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case lf:e.y=e.y-Math.floor(e.y);break;case Di:e.y=e.y<0?0:1;break;case cf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=d_;dn.DEFAULT_ANISOTROPY=1;const vp=class vp{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const c=e.elements,u=c[0],d=c[4],p=c[8],h=c[1],m=c[5],v=c[9],b=c[2],x=c[6],f=c[10];if(Math.abs(d-h)<.01&&Math.abs(p-b)<.01&&Math.abs(v-x)<.01){if(Math.abs(d+h)<.1&&Math.abs(p+b)<.1&&Math.abs(v+x)<.1&&Math.abs(u+m+f-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const w=(u+1)/2,S=(m+1)/2,y=(f+1)/2,M=(d+h)/4,A=(p+b)/4,_=(v+x)/4;return w>S&&w>y?w<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(w),r=M/i,s=A/i):S>y?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=M/r,s=_/r):y<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(y),i=A/s,r=_/s),this.set(i,r,s,n),this}let g=Math.sqrt((x-v)*(x-v)+(p-b)*(p-b)+(h-d)*(h-d));return Math.abs(g)<.001&&(g=1),this.x=(x-v)/g,this.y=(p-b)/g,this.z=(h-d)/g,this.w=Math.acos((u+m+f-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Qe(this.x,e.x,n.x),this.y=Qe(this.y,e.y,n.y),this.z=Qe(this.z,e.z,n.z),this.w=Qe(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Qe(this.x,e,n),this.y=Qe(this.y,e,n),this.z=Qe(this.z,e,n),this.w=Qe(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Qe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};vp.prototype.isVector4=!0;let Et=vp;class RM extends is{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Et(0,0,e,n),this.scissorTest=!1,this.viewport=new Et(0,0,e,n),this.textures=[];const r={width:e,height:n,depth:i.depth},s=new dn(r),o=i.count;for(let l=0;l<o;l++)this.textures[l]=s.clone(),this.textures[l].isRenderTargetTexture=!0,this.textures[l].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const n={minFilter:sn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},e.textures[n].image);this.textures[n].source=new ap(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const n=e.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ni extends RM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class y_ extends dn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=$t,this.minFilter=$t,this.wrapR=Di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class DM extends dn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=$t,this.minFilter=$t,this.wrapR=Di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const mc=class mc{constructor(e,n,i,r,s,o,l,c,u,d,p,h,m,v,b,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,l,c,u,d,p,h,m,v,b,x)}set(e,n,i,r,s,o,l,c,u,d,p,h,m,v,b,x){const f=this.elements;return f[0]=e,f[4]=n,f[8]=i,f[12]=r,f[1]=s,f[5]=o,f[9]=l,f[13]=c,f[2]=u,f[6]=d,f[10]=p,f[14]=h,f[3]=m,f[7]=v,f[11]=b,f[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new mc().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const n=this.elements,i=e.elements,r=1/ls.setFromMatrixColumn(e,0).length(),s=1/ls.setFromMatrixColumn(e,1).length(),o=1/ls.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),l=Math.sin(i),c=Math.cos(r),u=Math.sin(r),d=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const h=o*d,m=o*p,v=l*d,b=l*p;n[0]=c*d,n[4]=-c*p,n[8]=u,n[1]=m+v*u,n[5]=h-b*u,n[9]=-l*c,n[2]=b-h*u,n[6]=v+m*u,n[10]=o*c}else if(e.order==="YXZ"){const h=c*d,m=c*p,v=u*d,b=u*p;n[0]=h+b*l,n[4]=v*l-m,n[8]=o*u,n[1]=o*p,n[5]=o*d,n[9]=-l,n[2]=m*l-v,n[6]=b+h*l,n[10]=o*c}else if(e.order==="ZXY"){const h=c*d,m=c*p,v=u*d,b=u*p;n[0]=h-b*l,n[4]=-o*p,n[8]=v+m*l,n[1]=m+v*l,n[5]=o*d,n[9]=b-h*l,n[2]=-o*u,n[6]=l,n[10]=o*c}else if(e.order==="ZYX"){const h=o*d,m=o*p,v=l*d,b=l*p;n[0]=c*d,n[4]=v*u-m,n[8]=h*u+b,n[1]=c*p,n[5]=b*u+h,n[9]=m*u-v,n[2]=-u,n[6]=l*c,n[10]=o*c}else if(e.order==="YZX"){const h=o*c,m=o*u,v=l*c,b=l*u;n[0]=c*d,n[4]=b-h*p,n[8]=v*p+m,n[1]=p,n[5]=o*d,n[9]=-l*d,n[2]=-u*d,n[6]=m*p+v,n[10]=h-b*p}else if(e.order==="XZY"){const h=o*c,m=o*u,v=l*c,b=l*u;n[0]=c*d,n[4]=-p,n[8]=u*d,n[1]=h*p+b,n[5]=o*d,n[9]=m*p-v,n[2]=v*p-m,n[6]=l*d,n[10]=b*p+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(PM,e,FM)}lookAt(e,n,i){const r=this.elements;return Sn.subVectors(e,n),Sn.lengthSq()===0&&(Sn.z=1),Sn.normalize(),Ki.crossVectors(i,Sn),Ki.lengthSq()===0&&(Math.abs(i.z)===1?Sn.x+=1e-4:Sn.z+=1e-4,Sn.normalize(),Ki.crossVectors(i,Sn)),Ki.normalize(),qo.crossVectors(Sn,Ki),r[0]=Ki.x,r[4]=qo.x,r[8]=Sn.x,r[1]=Ki.y,r[5]=qo.y,r[9]=Sn.y,r[2]=Ki.z,r[6]=qo.z,r[10]=Sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],l=i[4],c=i[8],u=i[12],d=i[1],p=i[5],h=i[9],m=i[13],v=i[2],b=i[6],x=i[10],f=i[14],g=i[3],w=i[7],S=i[11],y=i[15],M=r[0],A=r[4],_=r[8],T=r[12],R=r[1],P=r[5],D=r[9],I=r[13],F=r[2],B=r[6],Z=r[10],X=r[14],j=r[3],z=r[7],$=r[11],Q=r[15];return s[0]=o*M+l*R+c*F+u*j,s[4]=o*A+l*P+c*B+u*z,s[8]=o*_+l*D+c*Z+u*$,s[12]=o*T+l*I+c*X+u*Q,s[1]=d*M+p*R+h*F+m*j,s[5]=d*A+p*P+h*B+m*z,s[9]=d*_+p*D+h*Z+m*$,s[13]=d*T+p*I+h*X+m*Q,s[2]=v*M+b*R+x*F+f*j,s[6]=v*A+b*P+x*B+f*z,s[10]=v*_+b*D+x*Z+f*$,s[14]=v*T+b*I+x*X+f*Q,s[3]=g*M+w*R+S*F+y*j,s[7]=g*A+w*P+S*B+y*z,s[11]=g*_+w*D+S*Z+y*$,s[15]=g*T+w*I+S*X+y*Q,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],l=e[5],c=e[9],u=e[13],d=e[2],p=e[6],h=e[10],m=e[14],v=e[3],b=e[7],x=e[11],f=e[15],g=c*m-u*h,w=l*m-u*p,S=l*h-c*p,y=o*m-u*d,M=o*h-c*d,A=o*p-l*d;return n*(b*g-x*w+f*S)-i*(v*g-x*y+f*M)+r*(v*w-b*y+f*A)-s*(v*S-b*M+x*A)}determinantAffine(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[1],o=e[5],l=e[9],c=e[2],u=e[6],d=e[10];return n*(o*d-l*u)-i*(s*d-l*c)+r*(s*u-o*c)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],l=e[5],c=e[6],u=e[7],d=e[8],p=e[9],h=e[10],m=e[11],v=e[12],b=e[13],x=e[14],f=e[15],g=n*l-i*o,w=n*c-r*o,S=n*u-s*o,y=i*c-r*l,M=i*u-s*l,A=r*u-s*c,_=d*b-p*v,T=d*x-h*v,R=d*f-m*v,P=p*x-h*b,D=p*f-m*b,I=h*f-m*x,F=g*I-w*D+S*P+y*R-M*T+A*_;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/F;return e[0]=(l*I-c*D+u*P)*B,e[1]=(r*D-i*I-s*P)*B,e[2]=(b*A-x*M+f*y)*B,e[3]=(h*M-p*A-m*y)*B,e[4]=(c*R-o*I-u*T)*B,e[5]=(n*I-r*R+s*T)*B,e[6]=(x*S-v*A-f*w)*B,e[7]=(d*A-h*S+m*w)*B,e[8]=(o*D-l*R+u*_)*B,e[9]=(i*R-n*D-s*_)*B,e[10]=(v*M-b*S+f*g)*B,e[11]=(p*S-d*M-m*g)*B,e[12]=(l*T-o*P-c*_)*B,e[13]=(n*P-i*T+r*_)*B,e[14]=(b*w-v*y-x*g)*B,e[15]=(d*y-p*w+h*g)*B,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,l=e.y,c=e.z,u=s*o,d=s*l;return this.set(u*o+i,u*l-r*c,u*c+r*l,0,u*l+r*c,d*l+i,d*c-r*o,0,u*c-r*l,d*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,l=n._z,c=n._w,u=s+s,d=o+o,p=l+l,h=s*u,m=s*d,v=s*p,b=o*d,x=o*p,f=l*p,g=c*u,w=c*d,S=c*p,y=i.x,M=i.y,A=i.z;return r[0]=(1-(b+f))*y,r[1]=(m+S)*y,r[2]=(v-w)*y,r[3]=0,r[4]=(m-S)*M,r[5]=(1-(h+f))*M,r[6]=(x+g)*M,r[7]=0,r[8]=(v+w)*A,r[9]=(x-g)*A,r[10]=(1-(h+b))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),n.identity(),this;let o=ls.set(r[0],r[1],r[2]).length();const l=ls.set(r[4],r[5],r[6]).length(),c=ls.set(r[8],r[9],r[10]).length();s<0&&(o=-o),Xn.copy(this);const u=1/o,d=1/l,p=1/c;return Xn.elements[0]*=u,Xn.elements[1]*=u,Xn.elements[2]*=u,Xn.elements[4]*=d,Xn.elements[5]*=d,Xn.elements[6]*=d,Xn.elements[8]*=p,Xn.elements[9]*=p,Xn.elements[10]*=p,n.setFromRotationMatrix(Xn),i.x=o,i.y=l,i.z=c,this}makePerspective(e,n,i,r,s,o,l=pi,c=!1){const u=this.elements,d=2*s/(n-e),p=2*s/(i-r),h=(n+e)/(n-e),m=(i+r)/(i-r);let v,b;if(c)v=s/(o-s),b=o*s/(o-s);else if(l===pi)v=-(o+s)/(o-s),b=-2*o*s/(o-s);else if(l===xo)v=-o/(o-s),b=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return u[0]=d,u[4]=0,u[8]=h,u[12]=0,u[1]=0,u[5]=p,u[9]=m,u[13]=0,u[2]=0,u[6]=0,u[10]=v,u[14]=b,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,n,i,r,s,o,l=pi,c=!1){const u=this.elements,d=2/(n-e),p=2/(i-r),h=-(n+e)/(n-e),m=-(i+r)/(i-r);let v,b;if(c)v=1/(o-s),b=o/(o-s);else if(l===pi)v=-2/(o-s),b=-(o+s)/(o-s);else if(l===xo)v=-1/(o-s),b=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return u[0]=d,u[4]=0,u[8]=0,u[12]=h,u[1]=0,u[5]=p,u[9]=0,u[13]=m,u[2]=0,u[6]=0,u[10]=v,u[14]=b,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};mc.prototype.isMatrix4=!0;let bt=mc;const ls=new G,Xn=new bt,PM=new G(0,0,0),FM=new G(1,1,1),Ki=new G,qo=new G,Sn=new G,yx=new bt,Ex=new ra;class Mr{constructor(e=0,n=0,i=0,r=Mr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],l=r[8],c=r[1],u=r[5],d=r[9],p=r[2],h=r[6],m=r[10];switch(n){case"XYZ":this._y=Math.asin(Qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,u),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(l,m),this._z=Math.atan2(c,u)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,m),this._z=Math.atan2(-o,u)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Qe(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,u));break;case"YZX":this._z=Math.asin(Qe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,u),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(l,m));break;case"XZY":this._z=Math.asin(-Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,u),this._y=Math.atan2(l,s)):(this._x=Math.atan2(-d,m),this._y=0);break;default:Oe("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return yx.makeRotationFromQuaternion(e),this.setFromRotationMatrix(yx,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Ex.setFromEuler(this),this.setFromQuaternion(Ex,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Mr.DEFAULT_ORDER="XYZ";class E_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let LM=0;const Sx=new G,cs=new ra,Si=new bt,Yo=new G,va=new G,IM=new G,UM=new ra,bx=new G(1,0,0),Mx=new G(0,1,0),wx=new G(0,0,1),Cx={type:"added"},kM={type:"removed"},us={type:"childadded",child:null},Tu={type:"childremoved",child:null};class Yt extends is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:LM++}),this.uuid=bo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Yt.DEFAULT_UP.clone();const e=new G,n=new Mr,i=new ra,r=new G(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new bt},normalMatrix:{value:new ze}}),this.matrix=new bt,this.matrixWorld=new bt,this.matrixAutoUpdate=Yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new E_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return cs.setFromAxisAngle(e,n),this.quaternion.multiply(cs),this}rotateOnWorldAxis(e,n){return cs.setFromAxisAngle(e,n),this.quaternion.premultiply(cs),this}rotateX(e){return this.rotateOnAxis(bx,e)}rotateY(e){return this.rotateOnAxis(Mx,e)}rotateZ(e){return this.rotateOnAxis(wx,e)}translateOnAxis(e,n){return Sx.copy(e).applyQuaternion(this.quaternion),this.position.add(Sx.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(bx,e)}translateY(e){return this.translateOnAxis(Mx,e)}translateZ(e){return this.translateOnAxis(wx,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Si.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Yo.copy(e):Yo.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),va.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Si.lookAt(va,Yo,this.up):Si.lookAt(Yo,va,this.up),this.quaternion.setFromRotationMatrix(Si),r&&(Si.extractRotation(r.matrixWorld),cs.setFromRotationMatrix(Si),this.quaternion.premultiply(cs.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(rt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cx),us.child=e,this.dispatchEvent(us),us.child=null):rt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(kM),Tu.child=e,this.dispatchEvent(Tu),Tu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Si.multiply(e.parent.matrixWorld)),e.applyMatrix4(Si),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cx),us.child=e,this.dispatchEvent(us),us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(va,e,IM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(va,UM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){const s=this.children;for(let o=0,l=s.length;o<l;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(l=>({...l,boundingBox:l.boundingBox?l.boundingBox.toJSON():void 0,boundingSphere:l.boundingSphere?l.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(l=>({...l})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let u=0,d=c.length;u<d;u++){const p=c[u];s(e.shapes,p)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,u=this.material.length;c<u;c++)l.push(s(e.materials,this.material[c]));r.material=l}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let l=0;l<this.children.length;l++)r.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];r.animations.push(s(e.animations,c))}}if(n){const l=o(e.geometries),c=o(e.materials),u=o(e.textures),d=o(e.images),p=o(e.shapes),h=o(e.skeletons),m=o(e.animations),v=o(e.nodes);l.length>0&&(i.geometries=l),c.length>0&&(i.materials=c),u.length>0&&(i.textures=u),d.length>0&&(i.images=d),p.length>0&&(i.shapes=p),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(l){const c=[];for(const u in l){const d=l[u];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Yt.DEFAULT_UP=new G(0,1,0);Yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ra extends Yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const OM={type:"move"};class Nu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ra,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ra,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ra,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const l=this._targetRay,c=this._grip,u=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(u&&e.hand){o=!0;for(const b of e.hand.values()){const x=n.getJointPose(b,i),f=this._getHandJoint(u,b);x!==null&&(f.matrix.fromArray(x.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=x.radius),f.visible=x!==null}const d=u.joints["index-finger-tip"],p=u.joints["thumb-tip"],h=d.position.distanceTo(p.position),m=.02,v=.005;u.inputState.pinching&&h>m+v?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&h<=m-v&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));l!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(OM)))}return l!==null&&(l.visible=r!==null),c!==null&&(c.visible=s!==null),u!==null&&(u.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Ra;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const S_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zi={h:0,s:0,l:0},Ko={h:0,s:0,l:0};function Ru(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class qe{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=wn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=et.workingColorSpace){return this.r=e,this.g=n,this.b=i,et.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=et.workingColorSpace){if(e=wM(e,1),n=Qe(n,0,1),i=Qe(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=Ru(o,s,e+1/3),this.g=Ru(o,s,e),this.b=Ru(o,s,e-1/3)}return et.colorSpaceToWorking(this,r),this}setStyle(e,n=wn){function i(s){s!==void 0&&parseFloat(s)<1&&Oe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],l=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:Oe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);Oe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=wn){const i=S_[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Oe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}copyLinearToSRGB(e){return this.r=zs(e.r),this.g=zs(e.g),this.b=zs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=wn){return et.workingToColorSpace(nn.copy(this),e),Math.round(Qe(nn.r*255,0,255))*65536+Math.round(Qe(nn.g*255,0,255))*256+Math.round(Qe(nn.b*255,0,255))}getHexString(e=wn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=et.workingColorSpace){et.workingToColorSpace(nn.copy(this),n);const i=nn.r,r=nn.g,s=nn.b,o=Math.max(i,r,s),l=Math.min(i,r,s);let c,u;const d=(l+o)/2;if(l===o)c=0,u=0;else{const p=o-l;switch(u=d<=.5?p/(o+l):p/(2-o-l),o){case i:c=(r-s)/p+(r<s?6:0);break;case r:c=(s-i)/p+2;break;case s:c=(i-r)/p+4;break}c/=6}return e.h=c,e.s=u,e.l=d,e}getRGB(e,n=et.workingColorSpace){return et.workingToColorSpace(nn.copy(this),n),e.r=nn.r,e.g=nn.g,e.b=nn.b,e}getStyle(e=wn){et.workingToColorSpace(nn.copy(this),e);const n=nn.r,i=nn.g,r=nn.b;return e!==wn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Zi),this.setHSL(Zi.h+e,Zi.s+n,Zi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Zi),e.getHSL(Ko);const i=bu(Zi.h,Ko.h,n),r=bu(Zi.s,Ko.s,n),s=bu(Zi.l,Ko.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const nn=new qe;qe.NAMES=S_;class op{constructor(e,n=1,i=1e3){this.isFog=!0,this.name="",this.color=new qe(e),this.near=n,this.far=i}clone(){return new op(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class BM extends Yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mr,this.environmentIntensity=1,this.environmentRotation=new Mr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}}const $n=new G,bi=new G,Du=new G,Mi=new G,ds=new G,fs=new G,Ax=new G,Pu=new G,Fu=new G,Lu=new G,Iu=new Et,Uu=new Et,ku=new Et;class Jn{constructor(e=new G,n=new G,i=new G){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),$n.subVectors(e,n),r.cross($n);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){$n.subVectors(r,n),bi.subVectors(i,n),Du.subVectors(e,n);const o=$n.dot($n),l=$n.dot(bi),c=$n.dot(Du),u=bi.dot(bi),d=bi.dot(Du),p=o*u-l*l;if(p===0)return s.set(0,0,0),null;const h=1/p,m=(u*c-l*d)*h,v=(o*d-l*c)*h;return s.set(1-m-v,v,m)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(e,n,i,r,s,o,l,c){return this.getBarycoord(e,n,i,r,Mi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Mi.x),c.addScaledVector(o,Mi.y),c.addScaledVector(l,Mi.z),c)}static getInterpolatedAttribute(e,n,i,r,s,o){return Iu.setScalar(0),Uu.setScalar(0),ku.setScalar(0),Iu.fromBufferAttribute(e,n),Uu.fromBufferAttribute(e,i),ku.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Iu,s.x),o.addScaledVector(Uu,s.y),o.addScaledVector(ku,s.z),o}static isFrontFacing(e,n,i,r){return $n.subVectors(i,n),bi.subVectors(e,n),$n.cross(bi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $n.subVectors(this.c,this.b),bi.subVectors(this.a,this.b),$n.cross(bi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Jn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Jn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Jn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Jn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Jn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,l;ds.subVectors(r,i),fs.subVectors(s,i),Pu.subVectors(e,i);const c=ds.dot(Pu),u=fs.dot(Pu);if(c<=0&&u<=0)return n.copy(i);Fu.subVectors(e,r);const d=ds.dot(Fu),p=fs.dot(Fu);if(d>=0&&p<=d)return n.copy(r);const h=c*p-d*u;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),n.copy(i).addScaledVector(ds,o);Lu.subVectors(e,s);const m=ds.dot(Lu),v=fs.dot(Lu);if(v>=0&&m<=v)return n.copy(s);const b=m*u-c*v;if(b<=0&&u>=0&&v<=0)return l=u/(u-v),n.copy(i).addScaledVector(fs,l);const x=d*v-m*p;if(x<=0&&p-d>=0&&m-v>=0)return Ax.subVectors(s,r),l=(p-d)/(p-d+(m-v)),n.copy(r).addScaledVector(Ax,l);const f=1/(x+b+h);return o=b*f,l=h*f,n.copy(i).addScaledVector(ds,o).addScaledVector(fs,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Mo{constructor(e=new G(1/0,1/0,1/0),n=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(qn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(qn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=qn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,l=s.count;o<l;o++)e.isMesh===!0?e.getVertexPosition(o,qn):qn.fromBufferAttribute(s,o),qn.applyMatrix4(e.matrixWorld),this.expandByPoint(qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Zo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Zo.copy(i.boundingBox)),Zo.applyMatrix4(e.matrixWorld),this.union(Zo)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qn),qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(_a),Jo.subVectors(this.max,_a),hs.subVectors(e.a,_a),ps.subVectors(e.b,_a),ms.subVectors(e.c,_a),Ji.subVectors(ps,hs),Qi.subVectors(ms,ps),Pr.subVectors(hs,ms);let n=[0,-Ji.z,Ji.y,0,-Qi.z,Qi.y,0,-Pr.z,Pr.y,Ji.z,0,-Ji.x,Qi.z,0,-Qi.x,Pr.z,0,-Pr.x,-Ji.y,Ji.x,0,-Qi.y,Qi.x,0,-Pr.y,Pr.x,0];return!Ou(n,hs,ps,ms,Jo)||(n=[1,0,0,0,1,0,0,0,1],!Ou(n,hs,ps,ms,Jo))?!1:(Qo.crossVectors(Ji,Qi),n=[Qo.x,Qo.y,Qo.z],Ou(n,hs,ps,ms,Jo))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const wi=[new G,new G,new G,new G,new G,new G,new G,new G],qn=new G,Zo=new Mo,hs=new G,ps=new G,ms=new G,Ji=new G,Qi=new G,Pr=new G,_a=new G,Jo=new G,Qo=new G,Fr=new G;function Ou(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Fr.fromArray(t,s);const l=r.x*Math.abs(Fr.x)+r.y*Math.abs(Fr.y)+r.z*Math.abs(Fr.z),c=e.dot(Fr),u=n.dot(Fr),d=i.dot(Fr);if(Math.max(-Math.max(c,u,d),Math.min(c,u,d))>l)return!1}return!0}const Lt=new G,el=new Ze;let jM=0;class Ii extends is{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jM++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=yM,this.updateRanges=[],this.gpuType=hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)el.fromBufferAttribute(this,n),el.applyMatrix3(e),this.setXY(n,el.x,el.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Lt.fromBufferAttribute(this,n),Lt.applyMatrix3(e),this.setXYZ(n,Lt.x,Lt.y,Lt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Lt.fromBufferAttribute(this,n),Lt.applyMatrix4(e),this.setXYZ(n,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Lt.fromBufferAttribute(this,n),Lt.applyNormalMatrix(e),this.setXYZ(n,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Lt.fromBufferAttribute(this,n),Lt.transformDirection(e),this.setXYZ(n,Lt.x,Lt.y,Lt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ga(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=mn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ga(n,this.array)),n}setX(e,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ga(n,this.array)),n}setY(e,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ga(n,this.array)),n}setZ(e,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ga(n,this.array)),n}setW(e,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=mn(n,this.array),i=mn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=mn(n,this.array),i=mn(i,this.array),r=mn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=mn(n,this.array),i=mn(i,this.array),r=mn(r,this.array),s=mn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class b_ extends Ii{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class M_ extends Ii{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Ut extends Ii{constructor(e,n,i){super(new Float32Array(e),n,i)}}const zM=new Mo,ya=new G,Bu=new G;class Uc{constructor(e=new G,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):zM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ya.subVectors(e,this.center);const n=ya.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ya,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Bu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ya.copy(e.center).add(Bu)),this.expandByPoint(ya.copy(e.center).sub(Bu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let VM=0;const Un=new bt,ju=new Yt,xs=new G,bn=new Mo,Ea=new Mo,Vt=new G;class Ln extends is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:VM++}),this.uuid=bo(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(EM(e)?M_:b_)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ze().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Un.makeRotationFromQuaternion(e),this.applyMatrix4(Un),this}rotateX(e){return Un.makeRotationX(e),this.applyMatrix4(Un),this}rotateY(e){return Un.makeRotationY(e),this.applyMatrix4(Un),this}rotateZ(e){return Un.makeRotationZ(e),this.applyMatrix4(Un),this}translate(e,n,i){return Un.makeTranslation(e,n,i),this.applyMatrix4(Un),this}scale(e,n,i){return Un.makeScale(e,n,i),this.applyMatrix4(Un),this}lookAt(e){return ju.lookAt(e),ju.updateMatrix(),this.applyMatrix4(ju.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xs).negate(),this.translate(xs.x,xs.y,xs.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ut(i,3))}else{const i=Math.min(e.length,n.count);for(let r=0;r<i;r++){const s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&Oe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mo);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){rt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];bn.setFromBufferAttribute(s),this.morphTargetsRelative?(Vt.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(Vt),Vt.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(Vt)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&rt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Uc);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){rt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(e){const i=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const l=n[s];Ea.setFromBufferAttribute(l),this.morphTargetsRelative?(Vt.addVectors(bn.min,Ea.min),bn.expandByPoint(Vt),Vt.addVectors(bn.max,Ea.max),bn.expandByPoint(Vt)):(bn.expandByPoint(Ea.min),bn.expandByPoint(Ea.max))}bn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Vt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Vt));if(n)for(let s=0,o=n.length;s<o;s++){const l=n[s],c=this.morphTargetsRelative;for(let u=0,d=l.count;u<d;u++)Vt.fromBufferAttribute(l,u),c&&(xs.fromBufferAttribute(e,u),Vt.add(xs)),r=Math.max(r,i.distanceToSquared(Vt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&rt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){rt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Ii(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));const l=[],c=[];for(let _=0;_<i.count;_++)l[_]=new G,c[_]=new G;const u=new G,d=new G,p=new G,h=new Ze,m=new Ze,v=new Ze,b=new G,x=new G;function f(_,T,R){u.fromBufferAttribute(i,_),d.fromBufferAttribute(i,T),p.fromBufferAttribute(i,R),h.fromBufferAttribute(s,_),m.fromBufferAttribute(s,T),v.fromBufferAttribute(s,R),d.sub(u),p.sub(u),m.sub(h),v.sub(h);const P=1/(m.x*v.y-v.x*m.y);isFinite(P)&&(b.copy(d).multiplyScalar(v.y).addScaledVector(p,-m.y).multiplyScalar(P),x.copy(p).multiplyScalar(m.x).addScaledVector(d,-v.x).multiplyScalar(P),l[_].add(b),l[T].add(b),l[R].add(b),c[_].add(x),c[T].add(x),c[R].add(x))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let _=0,T=g.length;_<T;++_){const R=g[_],P=R.start,D=R.count;for(let I=P,F=P+D;I<F;I+=3)f(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const w=new G,S=new G,y=new G,M=new G;function A(_){y.fromBufferAttribute(r,_),M.copy(y);const T=l[_];w.copy(T),w.sub(y.multiplyScalar(y.dot(T))).normalize(),S.crossVectors(M,T);const P=S.dot(c[_])<0?-1:1;o.setXYZW(_,w.x,w.y,w.z,P)}for(let _=0,T=g.length;_<T;++_){const R=g[_],P=R.start,D=R.count;for(let I=P,F=P+D;I<F;I+=3)A(e.getX(I+0)),A(e.getX(I+1)),A(e.getX(I+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new Ii(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const r=new G,s=new G,o=new G,l=new G,c=new G,u=new G,d=new G,p=new G;if(e)for(let h=0,m=e.count;h<m;h+=3){const v=e.getX(h+0),b=e.getX(h+1),x=e.getX(h+2);r.fromBufferAttribute(n,v),s.fromBufferAttribute(n,b),o.fromBufferAttribute(n,x),d.subVectors(o,s),p.subVectors(r,s),d.cross(p),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,b),u.fromBufferAttribute(i,x),l.add(d),c.add(d),u.add(d),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(b,c.x,c.y,c.z),i.setXYZ(x,u.x,u.y,u.z)}else for(let h=0,m=n.count;h<m;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),o.fromBufferAttribute(n,h+2),d.subVectors(o,s),p.subVectors(r,s),d.cross(p),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Vt.fromBufferAttribute(e,n),Vt.normalize(),e.setXYZ(n,Vt.x,Vt.y,Vt.z)}toNonIndexed(){function e(l,c){const u=l.array,d=l.itemSize,p=l.normalized,h=new u.constructor(c.length*d);let m=0,v=0;for(let b=0,x=c.length;b<x;b++){l.isInterleavedBufferAttribute?m=c[b]*l.data.stride+l.offset:m=c[b]*d;for(let f=0;f<d;f++)h[v++]=u[m++]}return new Ii(h,d,p)}if(this.index===null)return Oe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Ln,i=this.index.array,r=this.attributes;for(const l in r){const c=r[l],u=e(c,i);n.setAttribute(l,u)}const s=this.morphAttributes;for(const l in s){const c=[],u=s[l];for(let d=0,p=u.length;d<p;d++){const h=u[d],m=e(h,i);c.push(m)}n.morphAttributes[l]=c}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let l=0,c=o.length;l<c;l++){const u=o[l];n.addGroup(u.start,u.count,u.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const u in c)c[u]!==void 0&&(e[u]=c[u]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const u=i[c];e.data.attributes[c]=u.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const u=this.morphAttributes[c],d=[];for(let p=0,h=u.length;p<h;p++){const m=u[p];d.push(m.toJSON(e.data))}d.length>0&&(r[c]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const l=this.boundingSphere;return l!==null&&(e.data.boundingSphere=l.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const u in r){const d=r[u];this.setAttribute(u,d.clone(n))}const s=e.morphAttributes;for(const u in s){const d=[],p=s[u];for(let h=0,m=p.length;h<m;h++)d.push(p[h].clone(n));this.morphAttributes[u]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let u=0,d=o.length;u<d;u++){const p=o[u];this.addGroup(p.start,p.count,p.materialIndex)}const l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zu=new G,GM=new G,HM=new ze;class sr{constructor(e=new G(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=zu.subVectors(i,n).cross(GM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const r=e.delta(zu),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(r,o)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||HM.getNormalMatrix(e),r=this.coplanarPoint(zu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let WM=0;class sa extends is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:WM++}),this.uuid=bo(),this.name="",this.type="Material",this.blending=za,this.side=Zr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=n_,this.blendDst=i_,this.blendEquation=ys,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=ho,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=hM,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Eu,this.stencilZFail=Eu,this.stencilZPass=Eu,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Oe(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Oe(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const l in s){const c=s[l];delete c.metadata,o.push(c)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new qe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new sr().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Ze().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ze().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Ci=new G,Vu=new G,tl=new G,nl=new G;class w_{constructor(e=new G,n=new G(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ci)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Ci.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Ci.copy(this.origin).addScaledVector(this.direction,n),Ci.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Vu.copy(e).add(n).multiplyScalar(.5),tl.copy(n).sub(e).normalize(),nl.copy(this.origin).sub(Vu);const s=e.distanceTo(n)*.5,o=-this.direction.dot(tl),l=nl.dot(this.direction),c=-nl.dot(tl),u=nl.lengthSq(),d=Math.abs(1-o*o);let p,h,m,v;if(d>0)if(p=o*c-l,h=o*l-c,v=s*d,p>=0)if(h>=-v)if(h<=v){const b=1/d;p*=b,h*=b,m=p*(p+o*h+2*l)+h*(o*p+h+2*c)+u}else h=s,p=Math.max(0,-(o*h+l)),m=-p*p+h*(h+2*c)+u;else h=-s,p=Math.max(0,-(o*h+l)),m=-p*p+h*(h+2*c)+u;else h<=-v?(p=Math.max(0,-(-o*s+l)),h=p>0?-s:Math.min(Math.max(-s,-c),s),m=-p*p+h*(h+2*c)+u):h<=v?(p=0,h=Math.min(Math.max(-s,-c),s),m=h*(h+2*c)+u):(p=Math.max(0,-(o*s+l)),h=p>0?s:Math.min(Math.max(-s,-c),s),m=-p*p+h*(h+2*c)+u);else h=o>0?-s:s,p=Math.max(0,-(o*h+l)),m=-p*p+h*(h+2*c)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(Vu).addScaledVector(tl,h),m}intersectSphere(e,n){if(e.radius<0)return null;Ci.subVectors(e.center,this.origin);const i=Ci.dot(this.direction),r=Ci.dot(Ci)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),l=i-o,c=i+o;return c<0?null:l<0?this.at(c,n):this.at(l,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,l,c;const u=1/this.direction.x,d=1/this.direction.y,p=1/this.direction.z,h=this.origin;return u>=0?(i=(e.min.x-h.x)*u,r=(e.max.x-h.x)*u):(i=(e.max.x-h.x)*u,r=(e.min.x-h.x)*u),d>=0?(s=(e.min.y-h.y)*d,o=(e.max.y-h.y)*d):(s=(e.max.y-h.y)*d,o=(e.min.y-h.y)*d),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),p>=0?(l=(e.min.z-h.z)*p,c=(e.max.z-h.z)*p):(l=(e.max.z-h.z)*p,c=(e.min.z-h.z)*p),i>c||l>r)||((l>i||i!==i)&&(i=l),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Ci)!==null}intersectTriangle(e,n,i,r,s){const o=this.origin,l=this.direction,c=l.x,u=l.y,d=l.z,p=e.x-o.x,h=e.y-o.y,m=e.z-o.z,v=n.x-o.x,b=n.y-o.y,x=n.z-o.z,f=i.x-o.x,g=i.y-o.y,w=i.z-o.z,S=Math.abs(c),y=Math.abs(u),M=Math.abs(d);let A,_,T,R,P,D,I,F,B,Z,X,j;if(S>=y&&S>=M?(T=c,D=p,B=v,j=f,c>=0?(A=u,_=d,R=h,P=m,I=b,F=x,Z=g,X=w):(A=d,_=u,R=m,P=h,I=x,F=b,Z=w,X=g)):y>=M?(T=u,D=h,B=b,j=g,u>=0?(A=d,_=c,R=m,P=p,I=x,F=v,Z=w,X=f):(A=c,_=d,R=p,P=m,I=v,F=x,Z=f,X=w)):(T=d,D=m,B=x,j=w,d>=0?(A=c,_=u,R=p,P=h,I=v,F=b,Z=f,X=g):(A=u,_=c,R=h,P=p,I=b,F=v,Z=g,X=f)),T===0)return null;const z=A/T,$=_/T,Q=1/T,ce=R-z*D,Me=P-$*D,Ye=I-z*B,He=F-$*B,Ve=Z-z*j,J=X-$*j,ie=Ve*He-J*Ye,Ee=ce*J-Me*Ve,Be=Ye*Me-He*ce;if(r){if(ie<0||Ee<0||Be<0)return null}else if((ie<0||Ee<0||Be<0)&&(ie>0||Ee>0||Be>0))return null;const q=ie+Ee+Be;if(q===0)return null;const le=Q*(ie*D+Ee*B+Be*j);return(q>0?le<0:le>0)?null:this.at(le/q,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class lp extends sa{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mr,this.combine=r_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Tx=new bt,Lr=new w_,il=new Uc,Nx=new G,rl=new G,sl=new G,al=new G,Gu=new G,ol=new G,Rx=new G,ll=new G;class Nn extends Yt{constructor(e=new Ln,n=new lp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const l=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const l=this.morphTargetInfluences;if(s&&l){ol.set(0,0,0);for(let c=0,u=s.length;c<u;c++){const d=l[c],p=s[c];d!==0&&(Gu.fromBufferAttribute(p,e),o?ol.addScaledVector(Gu,d):ol.addScaledVector(Gu.sub(n),d))}n.add(ol)}return n}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),il.copy(i.boundingSphere),il.applyMatrix4(s),Lr.copy(e.ray).recast(e.near),!(il.containsPoint(Lr.origin)===!1&&(Lr.intersectSphere(il,Nx)===null||Lr.origin.distanceToSquared(Nx)>(e.far-e.near)**2))&&(Tx.copy(s).invert(),Lr.copy(e.ray).applyMatrix4(Tx),!(i.boundingBox!==null&&Lr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Lr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,l=s.index,c=s.attributes.position,u=s.attributes.uv,d=s.attributes.uv1,p=s.attributes.normal,h=s.groups,m=s.drawRange;if(l!==null)if(Array.isArray(o))for(let v=0,b=h.length;v<b;v++){const x=h[v],f=o[x.materialIndex],g=Math.max(x.start,m.start),w=Math.min(l.count,Math.min(x.start+x.count,m.start+m.count));for(let S=g,y=w;S<y;S+=3){const M=l.getX(S),A=l.getX(S+1),_=l.getX(S+2);r=cl(this,f,e,i,u,d,p,M,A,_),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=x.materialIndex,n.push(r))}}else{const v=Math.max(0,m.start),b=Math.min(l.count,m.start+m.count);for(let x=v,f=b;x<f;x+=3){const g=l.getX(x),w=l.getX(x+1),S=l.getX(x+2);r=cl(this,o,e,i,u,d,p,g,w,S),r&&(r.faceIndex=Math.floor(x/3),n.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let v=0,b=h.length;v<b;v++){const x=h[v],f=o[x.materialIndex],g=Math.max(x.start,m.start),w=Math.min(c.count,Math.min(x.start+x.count,m.start+m.count));for(let S=g,y=w;S<y;S+=3){const M=S,A=S+1,_=S+2;r=cl(this,f,e,i,u,d,p,M,A,_),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=x.materialIndex,n.push(r))}}else{const v=Math.max(0,m.start),b=Math.min(c.count,m.start+m.count);for(let x=v,f=b;x<f;x+=3){const g=x,w=x+1,S=x+2;r=cl(this,o,e,i,u,d,p,g,w,S),r&&(r.faceIndex=Math.floor(x/3),n.push(r))}}}}function XM(t,e,n,i,r,s,o,l){let c;if(e.side===En?c=i.intersectTriangle(o,s,r,!0,l):c=i.intersectTriangle(r,s,o,e.side===Zr,l),c===null)return null;ll.copy(l),ll.applyMatrix4(t.matrixWorld);const u=n.ray.origin.distanceTo(ll);return u<n.near||u>n.far?null:{distance:u,point:ll.clone(),object:t}}function cl(t,e,n,i,r,s,o,l,c,u){t.getVertexPosition(l,rl),t.getVertexPosition(c,sl),t.getVertexPosition(u,al);const d=XM(t,e,n,i,rl,sl,al,Rx);if(d){const p=new G;Jn.getBarycoord(Rx,rl,sl,al,p),r&&(d.uv=Jn.getInterpolatedAttribute(r,l,c,u,p,new Ze)),s&&(d.uv1=Jn.getInterpolatedAttribute(s,l,c,u,p,new Ze)),o&&(d.normal=Jn.getInterpolatedAttribute(o,l,c,u,p,new G),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:l,b:c,c:u,normal:new G,materialIndex:0};Jn.getNormal(rl,sl,al,h.normal),d.face=h,d.barycoord=p}return d}class $M extends dn{constructor(e=null,n=1,i=1,r,s,o,l,c,u=$t,d=$t,p,h){super(null,o,l,c,u,d,r,s,p,h),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ir=new Uc,qM=new Ze(.5,.5),ul=new G;class cp{constructor(e=new sr,n=new sr,i=new sr,r=new sr,s=new sr,o=new sr){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const l=this.planes;return l[0].copy(e),l[1].copy(n),l[2].copy(i),l[3].copy(r),l[4].copy(s),l[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=pi,i=!1){const r=this.planes,s=e.elements,o=s[0],l=s[1],c=s[2],u=s[3],d=s[4],p=s[5],h=s[6],m=s[7],v=s[8],b=s[9],x=s[10],f=s[11],g=s[12],w=s[13],S=s[14],y=s[15];if(r[0].setComponents(u-o,m-d,f-v,y-g).normalize(),r[1].setComponents(u+o,m+d,f+v,y+g).normalize(),r[2].setComponents(u+l,m+p,f+b,y+w).normalize(),r[3].setComponents(u-l,m-p,f-b,y-w).normalize(),i)r[4].setComponents(c,h,x,S).normalize(),r[5].setComponents(u-c,m-h,f-x,y-S).normalize();else if(r[4].setComponents(u-c,m-h,f-x,y-S).normalize(),n===pi)r[5].setComponents(u+c,m+h,f+x,y+S).normalize();else if(n===xo)r[5].setComponents(c,h,x,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ir.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Ir.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ir)}intersectsSprite(e){Ir.center.set(0,0,0);const n=qM.distanceTo(e.center);return Ir.radius=.7071067811865476+n,Ir.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ir)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(ul.x=r.normal.x>0?e.max.x:e.min.x,ul.y=r.normal.y>0?e.max.y:e.min.y,ul.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ul)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class YM extends sa{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const hc=new G,pc=new G,Dx=new bt,Sa=new w_,dl=new Uc,Hu=new G,Px=new G;class KM extends Yt{constructor(e=new Ln,n=new YM){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)hc.fromBufferAttribute(n,r-1),pc.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=hc.distanceTo(pc);e.setAttribute("lineDistance",new Ut(i,1))}else Oe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),dl.copy(i.boundingSphere),dl.applyMatrix4(r),dl.radius+=s,e.ray.intersectsSphere(dl)===!1)return;Dx.copy(r).invert(),Sa.copy(e.ray).applyMatrix4(Dx);const l=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,u=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const m=Math.max(0,o.start),v=Math.min(d.count,o.start+o.count);for(let b=m,x=v-1;b<x;b+=u){const f=d.getX(b),g=d.getX(b+1),w=fl(this,e,Sa,c,f,g,b);w&&n.push(w)}if(this.isLineLoop){const b=d.getX(v-1),x=d.getX(m),f=fl(this,e,Sa,c,b,x,v-1);f&&n.push(f)}}else{const m=Math.max(0,o.start),v=Math.min(h.count,o.start+o.count);for(let b=m,x=v-1;b<x;b+=u){const f=fl(this,e,Sa,c,b,b+1,b);f&&n.push(f)}if(this.isLineLoop){const b=fl(this,e,Sa,c,v-1,m,v-1);b&&n.push(b)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const l=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=s}}}}}function fl(t,e,n,i,r,s,o){const l=t.geometry.attributes.position;if(hc.fromBufferAttribute(l,r),pc.fromBufferAttribute(l,s),n.distanceSqToSegment(hc,pc,Hu,Px)>i)return;Hu.applyMatrix4(t.matrixWorld);const u=e.ray.origin.distanceTo(Hu);if(!(u<e.near||u>e.far))return{distance:u,point:Px.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}const Fx=new G,Lx=new G;class ZM extends KM{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Fx.fromBufferAttribute(n,r),Lx.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Fx.distanceTo(Lx);e.setAttribute("lineDistance",new Ut(i,1))}else Oe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class C_ extends dn{constructor(e=[],n=Jr,i,r,s,o,l,c,u,d){super(e,n,i,r,s,o,l,c,u,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class go extends dn{constructor(e,n,i=vi,r,s,o,l=$t,c=$t,u,d=zi,p=1){if(d!==zi&&d!==Gr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:n,depth:p};super(h,r,s,o,l,c,d,i,u),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ap(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return n.compareFunction=this.compareFunction,n}}class JM extends go{constructor(e,n=vi,i=Jr,r,s,o=$t,l=$t,c,u=zi){const d={width:e,height:e,depth:1},p=[d,d,d,d,d,d];super(e,e,n,i,r,s,o,l,c,u),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class A_ extends dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class wo extends Ln{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const l=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],u=[],d=[],p=[];let h=0,m=0;v("z","y","x",-1,-1,i,n,e,o,s,0),v("z","y","x",1,-1,i,n,-e,o,s,1),v("x","z","y",1,1,e,i,n,r,o,2),v("x","z","y",1,-1,e,i,-n,r,o,3),v("x","y","z",1,-1,e,n,i,r,s,4),v("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new Ut(u,3)),this.setAttribute("normal",new Ut(d,3)),this.setAttribute("uv",new Ut(p,2));function v(b,x,f,g,w,S,y,M,A,_,T){const R=S/A,P=y/_,D=S/2,I=y/2,F=M/2,B=A+1,Z=_+1;let X=0,j=0;const z=new G;for(let $=0;$<Z;$++){const Q=$*P-I;for(let ce=0;ce<B;ce++){const Me=ce*R-D;z[b]=Me*g,z[x]=Q*w,z[f]=F,u.push(z.x,z.y,z.z),z[b]=0,z[x]=0,z[f]=M>0?1:-1,d.push(z.x,z.y,z.z),p.push(ce/A),p.push(1-$/_),X+=1}}for(let $=0;$<_;$++)for(let Q=0;Q<A;Q++){const ce=h+Q+B*$,Me=h+Q+B*($+1),Ye=h+(Q+1)+B*($+1),He=h+(Q+1)+B*$;c.push(ce,Me,He),c.push(Me,Ye,He),j+=6}l.addGroup(m,j,T),m+=j,h+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class up extends Ln{constructor(e=1,n=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:i,thetaLength:r},n=Math.max(3,n);const s=[],o=[],l=[],c=[],u=new G,d=new Ze;o.push(0,0,0),l.push(0,0,1),c.push(.5,.5);for(let p=0,h=3;p<=n;p++,h+=3){const m=i+p/n*r;u.x=e*Math.cos(m),u.y=e*Math.sin(m),o.push(u.x,u.y,u.z),l.push(0,0,1),d.x=(o[h]/e+1)/2,d.y=(o[h+1]/e+1)/2,c.push(d.x,d.y)}for(let p=1;p<=n;p++)s.push(p,p+1,0);this.setIndex(s),this.setAttribute("position",new Ut(o,3)),this.setAttribute("normal",new Ut(l,3)),this.setAttribute("uv",new Ut(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new up(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class dp extends Ln{constructor(e=1,n=1,i=1,r=32,s=1,o=!1,l=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:l,thetaLength:c};const u=this;r=Math.floor(r),s=Math.floor(s);const d=[],p=[],h=[],m=[];let v=0;const b=[],x=i/2;let f=0;g(),o===!1&&(e>0&&w(!0),n>0&&w(!1)),this.setIndex(d),this.setAttribute("position",new Ut(p,3)),this.setAttribute("normal",new Ut(h,3)),this.setAttribute("uv",new Ut(m,2));function g(){const S=new G,y=new G;let M=0;const A=(n-e)/i;for(let _=0;_<=s;_++){const T=[],R=_/s,P=R*(n-e)+e;for(let D=0;D<=r;D++){const I=D/r,F=I*c+l,B=Math.sin(F),Z=Math.cos(F);y.x=P*B,y.y=-R*i+x,y.z=P*Z,p.push(y.x,y.y,y.z),S.set(B,A,Z).normalize(),h.push(S.x,S.y,S.z),m.push(I,1-R),T.push(v++)}b.push(T)}for(let _=0;_<r;_++)for(let T=0;T<s;T++){const R=b[T][_],P=b[T+1][_],D=b[T+1][_+1],I=b[T][_+1];(e>0||T!==0)&&(d.push(R,P,I),M+=3),(n>0||T!==s-1)&&(d.push(P,D,I),M+=3)}u.addGroup(f,M,0),f+=M}function w(S){const y=v,M=new Ze,A=new G;let _=0;const T=S===!0?e:n,R=S===!0?1:-1;for(let D=1;D<=r;D++)p.push(0,x*R,0),h.push(0,R,0),m.push(.5,.5),v++;const P=v;for(let D=0;D<=r;D++){const F=D/r*c+l,B=Math.cos(F),Z=Math.sin(F);A.x=T*Z,A.y=x*R,A.z=T*B,p.push(A.x,A.y,A.z),h.push(0,R,0),M.x=B*.5+.5,M.y=Z*.5*R+.5,m.push(M.x,M.y),v++}for(let D=0;D<r;D++){const I=y+D,F=P+D;S===!0?d.push(F,F+1,I):d.push(F+1,F,I),_+=3}u.addGroup(f,_,S===!0?1:2),f+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dp(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class kc extends Ln{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,l=Math.floor(i),c=Math.floor(r),u=l+1,d=c+1,p=e/l,h=n/c,m=[],v=[],b=[],x=[];for(let f=0;f<d;f++){const g=f*h-o;for(let w=0;w<u;w++){const S=w*p-s;v.push(S,-g,0),b.push(0,0,1),x.push(w/l),x.push(1-f/c)}}for(let f=0;f<c;f++)for(let g=0;g<l;g++){const w=g+u*f,S=g+u*(f+1),y=g+1+u*(f+1),M=g+1+u*f;m.push(w,S,M),m.push(S,y,M)}this.setIndex(m),this.setAttribute("position",new Ut(v,3)),this.setAttribute("normal",new Ut(b,3)),this.setAttribute("uv",new Ut(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kc(e.width,e.height,e.widthSegments,e.heightSegments)}}class fp extends Ln{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,o=0,l=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:l},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const c=Math.min(o+l,Math.PI);let u=0;const d=[],p=new G,h=new G,m=[],v=[],b=[],x=[];for(let f=0;f<=i;f++){const g=[],w=f/i,S=o+w*l,y=e*Math.cos(S),M=Math.sqrt(e*e-y*y);let A=0;f===0&&o===0?A=.5/n:f===i&&c===Math.PI&&(A=-.5/n);for(let _=0;_<=n;_++){const T=_/n,R=r+T*s;p.x=-M*Math.cos(R),p.y=y,p.z=M*Math.sin(R),v.push(p.x,p.y,p.z),h.copy(p).normalize(),b.push(h.x,h.y,h.z),x.push(T+A,1-w),g.push(u++)}d.push(g)}for(let f=0;f<i;f++)for(let g=0;g<n;g++){const w=d[f][g+1],S=d[f][g],y=d[f+1][g],M=d[f+1][g+1];(f!==0||o>0)&&m.push(w,S,M),(f!==i-1||c<Math.PI)&&m.push(S,y,M)}this.setIndex(m),this.setAttribute("position",new Ut(v,3)),this.setAttribute("normal",new Ut(b,3)),this.setAttribute("uv",new Ut(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fp(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function Zs(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];if(Ix(r))r.isRenderTargetTexture?(Oe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(Ix(r[0])){const s=[];for(let o=0,l=r.length;o<l;o++)s[o]=r[o].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function ln(t){const e={};for(let n=0;n<t.length;n++){const i=Zs(t[n]);for(const r in i)e[r]=i[r]}return e}function Ix(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function QM(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function T_(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const e2={clone:Zs,merge:ln};var t2=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,n2=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class yi extends sa{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=t2,this.fragmentShader=n2,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zs(e.uniforms),this.uniformsGroups=QM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(const i in e.uniforms){const r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=n[r.value]||null;break;case"c":this.uniforms[i].value=new qe().setHex(r.value);break;case"v2":this.uniforms[i].value=new Ze().fromArray(r.value);break;case"v3":this.uniforms[i].value=new G().fromArray(r.value);break;case"v4":this.uniforms[i].value=new Et().fromArray(r.value);break;case"m3":this.uniforms[i].value=new ze().fromArray(r.value);break;case"m4":this.uniforms[i].value=new bt().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class i2 extends yi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class N_ extends sa{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=jf,this.normalScale=new Ze(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class r2 extends N_{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ze(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(n){this.ior=(1+.4*n)/(1-.4*n)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new qe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new qe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new qe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class s2 extends sa{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=dM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class a2 extends sa{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class hp extends Yt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=n}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}const Wu=new bt,Ux=new G,kx=new G;class R_{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ze(512,512),this.mapType=An,this.map=null,this.mapPass=null,this.matrix=new bt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cp,this._frameExtents=new Ze(1,1),this._viewportCount=1,this._viewports=[new Et(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera;Ux.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ux),kx.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(kx),n.updateMatrixWorld(),this._updateMatrix(n,this.matrix,this._frustum)}_updateMatrix(e,n,i,r){Wu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Wu,e.coordinateSystem,e.reversedDepth);const s=this._frameExtents,o=r?r.z/s.x:1,l=r?r.w/s.y:1,c=r?r.x/s.x:0,u=r?r.y/s.y:0;e.coordinateSystem===xo||e.reversedDepth?n.set(.5*o,0,0,.5*o+c,0,.5*l,0,.5*l+u,0,0,1,0,0,0,0,1):n.set(.5*o,0,0,.5*o+c,0,.5*l,0,.5*l+u,0,0,.5,.5,0,0,0,1),n.multiply(Wu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const hl=new G,pl=new ra,oi=new G;class D_ extends Yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new bt,this.projectionMatrix=new bt,this.projectionMatrixInverse=new bt,this.coordinateSystem=pi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(hl,pl,oi),oi.x===1&&oi.y===1&&oi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(hl,pl,oi.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(hl,pl,oi),oi.x===1&&oi.y===1&&oi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(hl,pl,oi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const er=new G,Ox=new Ze,Bx=new Ze;class Cn extends D_{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=zf*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Su*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zf*2*Math.atan(Math.tan(Su*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){er.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(er.x,er.y).multiplyScalar(-e/er.z),er.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(er.x,er.y).multiplyScalar(-e/er.z)}getViewSize(e,n){return this.getViewBounds(e,Ox,Bx),n.subVectors(Bx,Ox)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Su*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,u=o.fullHeight;s+=o.offsetX*r/c,n-=o.offsetY*i/u,r*=o.width/c,i*=o.height/u}const l=this.filmOffset;l!==0&&(s+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class o2 extends R_{constructor(){super(new Cn(90,1,.5,500)),this.isPointLightShadow=!0}}class jx extends hp{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new o2}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.distance=this.distance,n.object.decay=this.decay,n.object.shadow=this.shadow.toJSON(),n}}class pp extends D_{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,l=r+n,c=r-n;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=u*this.view.offsetX,o=s+u*this.view.width,l-=d*this.view.offsetY,c=l-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,l,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class l2 extends R_{constructor(){super(new pp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class c2 extends hp{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Yt.DEFAULT_UP),this.updateMatrix(),this.target=new Yt,this.shadow=new l2}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}class u2 extends hp{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const gs=-90,vs=1;class d2 extends Yt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Cn(gs,vs,e,n);r.layers=this.layers,this.add(r);const s=new Cn(gs,vs,e,n);s.layers=this.layers,this.add(s);const o=new Cn(gs,vs,e,n);o.layers=this.layers,this.add(o);const l=new Cn(gs,vs,e,n);l.layers=this.layers,this.add(l);const c=new Cn(gs,vs,e,n);c.layers=this.layers,this.add(c);const u=new Cn(gs,vs,e,n);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,l,c]=n;for(const u of n)this.remove(u);if(e===pi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===xo)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of n)this.add(u),u.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,l,c,u,d]=this.children,p=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const b=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let x=!1;e.isWebGLRenderer===!0?x=e.state.buffers.depth.getReversed():x=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,3,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),e.setRenderTarget(i,4,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),i.texture.generateMipmaps=b,e.setRenderTarget(i,5,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,d),e.setRenderTarget(p,h,m),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class f2 extends Cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const _p=class _p{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){const s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};_p.prototype.isMatrix2=!0;let zx=_p;function Vx(t,e,n,i){const r=h2(i);switch(n){case x_:return t*e;case v_:return t*e/r.components*r.byteLength;case tp:return t*e/r.components*r.byteLength;case Qr:return t*e*2/r.components*r.byteLength;case np:return t*e*2/r.components*r.byteLength;case g_:return t*e*3/r.components*r.byteLength;case Qn:return t*e*4/r.components*r.byteLength;case ip:return t*e*4/r.components*r.byteLength;case Rl:case Dl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Pl:case Fl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case df:case hf:return Math.max(t,16)*Math.max(e,8)/4;case uf:case ff:return Math.max(t,8)*Math.max(e,8)/2;case pf:case mf:case gf:case vf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case xf:case lc:case _f:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case yf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ef:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Sf:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case bf:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Mf:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case wf:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Cf:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Af:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Tf:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Nf:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Rf:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Df:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Pf:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Ff:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Lf:case If:case Uf:return Math.ceil(t/4)*Math.ceil(e/4)*16;case kf:case Of:return Math.ceil(t/4)*Math.ceil(e/4)*8;case cc:case Bf:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function h2(t){switch(t){case An:case f_:return{byteLength:1,components:1};case po:case h_:case _i:return{byteLength:2,components:1};case Qh:case ep:return{byteLength:2,components:4};case vi:case Jh:case hi:return{byteLength:4,components:1};case p_:case m_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Kh}}));typeof window<"u"&&(window.__THREE__?Oe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Kh);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function P_(){let t=null,e=!1,n=null,i=null;function r(s,o){i=t.requestAnimationFrame(r),n(s,o)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function p2(t){const e=new WeakMap;function n(l,c){const u=l.array,d=l.usage,p=u.byteLength,h=t.createBuffer();t.bindBuffer(c,h),t.bufferData(c,u,d),l.onUploadCallback();let m;if(u instanceof Float32Array)m=t.FLOAT;else if(typeof Float16Array<"u"&&u instanceof Float16Array)m=t.HALF_FLOAT;else if(u instanceof Uint16Array)l.isFloat16BufferAttribute?m=t.HALF_FLOAT:m=t.UNSIGNED_SHORT;else if(u instanceof Int16Array)m=t.SHORT;else if(u instanceof Uint32Array)m=t.UNSIGNED_INT;else if(u instanceof Int32Array)m=t.INT;else if(u instanceof Int8Array)m=t.BYTE;else if(u instanceof Uint8Array)m=t.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)m=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:h,type:m,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:p}}function i(l,c,u){const d=c.array,p=c.updateRanges;if(t.bindBuffer(u,l),p.length===0)t.bufferSubData(u,0,d);else{p.sort((m,v)=>m.start-v.start);let h=0;for(let m=1;m<p.length;m++){const v=p[h],b=p[m];b.start<=v.start+v.count+1?v.count=Math.max(v.count,b.start+b.count-v.start):(++h,p[h]=b)}p.length=h+1;for(let m=0,v=p.length;m<v;m++){const b=p[m];t.bufferSubData(u,b.start*d.BYTES_PER_ELEMENT,d,b.start,b.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(l){return l.isInterleavedBufferAttribute&&(l=l.data),e.get(l)}function s(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=e.get(l);c&&(t.deleteBuffer(c.buffer),e.delete(l))}function o(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const d=e.get(l);(!d||d.version<l.version)&&e.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const u=e.get(l);if(u===void 0)e.set(l,n(l,c));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,l,c),u.version=l.version}}return{get:r,remove:s,update:o}}var m2=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,x2=`#ifdef USE_ALPHAHASH
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
#endif`,g2=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,v2=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_2=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,y2=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,E2=`#ifdef USE_AOMAP
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
#endif`,S2=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,b2=`#ifdef USE_BATCHING
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
#endif`,M2=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,w2=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,C2=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,A2=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,T2=`#ifdef USE_IRIDESCENCE
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
#endif`,N2=`#ifdef USE_BUMPMAP
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
#endif`,R2=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,D2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,P2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,F2=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,L2=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,I2=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,U2=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,k2=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,O2=`#define PI 3.141592653589793
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
} // validated`,B2=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,j2=`vec3 transformedNormal = objectNormal;
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
#endif`,z2=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,V2=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,G2=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,H2=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,W2="gl_FragColor = linearToOutputTexel( gl_FragColor );",X2=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,$2=`#ifdef USE_ENVMAP
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
#endif`,q2=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Y2=`#ifdef USE_ENVMAP
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
#endif`,K2=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Z2=`#ifdef USE_ENVMAP
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
#endif`,J2=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Q2=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ew=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,tw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nw=`#ifdef USE_GRADIENTMAP
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
}`,iw=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rw=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,aw=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,ow=`#ifdef USE_ENVMAP
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
#endif`,lw=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,uw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,fw=`PhysicalMaterial material;
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
#endif`,hw=`uniform sampler2D dfgLUT;
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
}`,pw=`
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
#endif`,mw=`#if defined( RE_IndirectDiffuse )
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
#endif`,xw=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gw=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,vw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_w=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ew=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Sw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ww=`#if defined( USE_POINTS_UV )
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
#endif`,Cw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Aw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Tw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Nw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dw=`#ifdef USE_MORPHTARGETS
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
#endif`,Pw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Lw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Iw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Uw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Ow=`#ifdef USE_NORMALMAP
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
#endif`,Bw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,jw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Gw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ww=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$w=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Kw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Jw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,eC=`float getShadowMask() {
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
}`,tC=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,nC=`#ifdef USE_SKINNING
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
#endif`,iC=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rC=`#ifdef USE_SKINNING
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
#endif`,sC=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,aC=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,oC=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,lC=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,cC=`#ifdef USE_TRANSMISSION
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
#endif`,uC=`#ifdef USE_TRANSMISSION
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
#endif`,dC=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fC=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hC=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pC=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const mC=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xC=`uniform sampler2D t2D;
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
}`,gC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vC=`#ifdef ENVMAP_TYPE_CUBE
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
}`,_C=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yC=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,EC=`#include <common>
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
}`,SC=`#if DEPTH_PACKING == 3200
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
}`,bC=`#define DISTANCE
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
}`,MC=`#define DISTANCE
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
}`,wC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,CC=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,AC=`uniform float scale;
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
}`,TC=`uniform vec3 diffuse;
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
}`,NC=`#include <common>
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
}`,RC=`uniform vec3 diffuse;
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
}`,DC=`#define LAMBERT
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
}`,PC=`#define LAMBERT
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
}`,FC=`#define MATCAP
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
}`,LC=`#define MATCAP
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
}`,IC=`#define NORMAL
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
}`,UC=`#define NORMAL
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
}`,kC=`#define PHONG
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
}`,OC=`#define PHONG
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
}`,BC=`#define STANDARD
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
}`,jC=`#define STANDARD
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
}`,zC=`#define TOON
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
}`,VC=`#define TOON
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
}`,GC=`uniform float size;
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
}`,HC=`uniform vec3 diffuse;
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
}`,WC=`#include <common>
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
}`,XC=`uniform vec3 color;
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
}`,$C=`uniform float rotation;
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
}`,qC=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:m2,alphahash_pars_fragment:x2,alphamap_fragment:g2,alphamap_pars_fragment:v2,alphatest_fragment:_2,alphatest_pars_fragment:y2,aomap_fragment:E2,aomap_pars_fragment:S2,batching_pars_vertex:b2,batching_vertex:M2,begin_vertex:w2,beginnormal_vertex:C2,bsdfs:A2,iridescence_fragment:T2,bumpmap_pars_fragment:N2,clipping_planes_fragment:R2,clipping_planes_pars_fragment:D2,clipping_planes_pars_vertex:P2,clipping_planes_vertex:F2,color_fragment:L2,color_pars_fragment:I2,color_pars_vertex:U2,color_vertex:k2,common:O2,cube_uv_reflection_fragment:B2,defaultnormal_vertex:j2,displacementmap_pars_vertex:z2,displacementmap_vertex:V2,emissivemap_fragment:G2,emissivemap_pars_fragment:H2,colorspace_fragment:W2,colorspace_pars_fragment:X2,envmap_fragment:$2,envmap_common_pars_fragment:q2,envmap_pars_fragment:Y2,envmap_pars_vertex:K2,envmap_physical_pars_fragment:ow,envmap_vertex:Z2,fog_vertex:J2,fog_pars_vertex:Q2,fog_fragment:ew,fog_pars_fragment:tw,gradientmap_pars_fragment:nw,lightmap_pars_fragment:iw,lights_lambert_fragment:rw,lights_lambert_pars_fragment:sw,lights_pars_begin:aw,lights_toon_fragment:lw,lights_toon_pars_fragment:cw,lights_phong_fragment:uw,lights_phong_pars_fragment:dw,lights_physical_fragment:fw,lights_physical_pars_fragment:hw,lights_fragment_begin:pw,lights_fragment_maps:mw,lights_fragment_end:xw,lightprobes_pars_fragment:gw,logdepthbuf_fragment:vw,logdepthbuf_pars_fragment:_w,logdepthbuf_pars_vertex:yw,logdepthbuf_vertex:Ew,map_fragment:Sw,map_pars_fragment:bw,map_particle_fragment:Mw,map_particle_pars_fragment:ww,metalnessmap_fragment:Cw,metalnessmap_pars_fragment:Aw,morphinstance_vertex:Tw,morphcolor_vertex:Nw,morphnormal_vertex:Rw,morphtarget_pars_vertex:Dw,morphtarget_vertex:Pw,normal_fragment_begin:Fw,normal_fragment_maps:Lw,normal_pars_fragment:Iw,normal_pars_vertex:Uw,normal_vertex:kw,normalmap_pars_fragment:Ow,clearcoat_normal_fragment_begin:Bw,clearcoat_normal_fragment_maps:jw,clearcoat_pars_fragment:zw,iridescence_pars_fragment:Vw,opaque_fragment:Gw,packing:Hw,premultiplied_alpha_fragment:Ww,project_vertex:Xw,dithering_fragment:$w,dithering_pars_fragment:qw,roughnessmap_fragment:Yw,roughnessmap_pars_fragment:Kw,shadowmap_pars_fragment:Zw,shadowmap_pars_vertex:Jw,shadowmap_vertex:Qw,shadowmask_pars_fragment:eC,skinbase_vertex:tC,skinning_pars_vertex:nC,skinning_vertex:iC,skinnormal_vertex:rC,specularmap_fragment:sC,specularmap_pars_fragment:aC,tonemapping_fragment:oC,tonemapping_pars_fragment:lC,transmission_fragment:cC,transmission_pars_fragment:uC,uv_pars_fragment:dC,uv_pars_vertex:fC,uv_vertex:hC,worldpos_vertex:pC,background_vert:mC,background_frag:xC,backgroundCube_vert:gC,backgroundCube_frag:vC,cube_vert:_C,cube_frag:yC,depth_vert:EC,depth_frag:SC,distance_vert:bC,distance_frag:MC,equirect_vert:wC,equirect_frag:CC,linedashed_vert:AC,linedashed_frag:TC,meshbasic_vert:NC,meshbasic_frag:RC,meshlambert_vert:DC,meshlambert_frag:PC,meshmatcap_vert:FC,meshmatcap_frag:LC,meshnormal_vert:IC,meshnormal_frag:UC,meshphong_vert:kC,meshphong_frag:OC,meshphysical_vert:BC,meshphysical_frag:jC,meshtoon_vert:zC,meshtoon_frag:VC,points_vert:GC,points_frag:HC,shadow_vert:WC,shadow_frag:XC,sprite_vert:$C,sprite_frag:qC},xe={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new Ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},ui={basic:{uniforms:ln([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:ln([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new qe(0)},envMapIntensity:{value:1}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:ln([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:ln([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:ln([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new qe(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:ln([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:ln([xe.points,xe.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:ln([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:ln([xe.common,xe.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:ln([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:ln([xe.sprite,xe.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distance:{uniforms:ln([xe.common,xe.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distance_vert,fragmentShader:Xe.distance_frag},shadow:{uniforms:ln([xe.lights,xe.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};ui.physical={uniforms:ln([ui.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const ml={r:0,b:0,g:0},YC=new bt,F_=new ze;F_.set(-1,0,0,0,1,0,0,0,1);function KC(t,e,n,i,r,s){const o=new qe(0);let l=r===!0?0:1,c,u,d=null,p=0,h=null;function m(g){let w=g.isScene===!0?g.background:null;if(w&&w.isTexture){const S=g.backgroundBlurriness>0;w=e.get(w,S)}return w}function v(g){let w=!1;const S=m(g);S===null?x(o,l):S&&S.isColor&&(x(S,1),w=!0);const y=t.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,s):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function b(g,w){const S=m(w);S&&(S.isCubeTexture||S.mapping===Ic)?(u===void 0&&(u=new Nn(new wo(1,1,1),new yi({name:"BackgroundCubeMaterial",uniforms:Zs(ui.backgroundCube.uniforms),vertexShader:ui.backgroundCube.vertexShader,fragmentShader:ui.backgroundCube.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(y,M,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=S,u.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(YC.makeRotationFromEuler(w.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&u.material.uniforms.backgroundRotation.value.premultiply(F_),u.material.toneMapped=et.getTransfer(S.colorSpace)!==lt,(d!==S||p!==S.version||h!==t.toneMapping)&&(u.material.needsUpdate=!0,d=S,p=S.version,h=t.toneMapping),u.layers.enableAll(),g.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Nn(new kc(2,2),new yi({name:"BackgroundMaterial",uniforms:Zs(ui.background.uniforms),vertexShader:ui.background.vertexShader,fragmentShader:ui.background.fragmentShader,side:Zr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=et.getTransfer(S.colorSpace)!==lt,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||p!==S.version||h!==t.toneMapping)&&(c.material.needsUpdate=!0,d=S,p=S.version,h=t.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function x(g,w){g.getRGB(ml,T_(t)),n.buffers.color.setClear(ml.r,ml.g,ml.b,w,s)}function f(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(g,w=1){o.set(g),l=w,x(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,x(o,l)},render:v,addToRenderList:b,dispose:f}}function ZC(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,o=!1;function l(P,D,I,F,B){let Z=!1;const X=p(P,F,I,D);s!==X&&(s=X,u(s.object)),Z=m(P,F,I,B),Z&&v(P,F,I,B),B!==null&&e.update(B,t.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,S(P,D,I,F),B!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function c(){return t.createVertexArray()}function u(P){return t.bindVertexArray(P)}function d(P){return t.deleteVertexArray(P)}function p(P,D,I,F){const B=F.wireframe===!0;let Z=i[D.id];Z===void 0&&(Z={},i[D.id]=Z);const X=P.isInstancedMesh===!0?P.id:0;let j=Z[X];j===void 0&&(j={},Z[X]=j);let z=j[I.id];z===void 0&&(z={},j[I.id]=z);let $=z[B];return $===void 0&&($=h(c()),z[B]=$),$}function h(P){const D=[],I=[],F=[];for(let B=0;B<n;B++)D[B]=0,I[B]=0,F[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:I,attributeDivisors:F,object:P,attributes:{},index:null}}function m(P,D,I,F){const B=s.attributes,Z=D.attributes;let X=0;const j=I.getAttributes();for(const z in j)if(j[z].location>=0){const Q=B[z];let ce=Z[z];if(ce===void 0&&(z==="instanceMatrix"&&P.instanceMatrix&&(ce=P.instanceMatrix),z==="instanceColor"&&P.instanceColor&&(ce=P.instanceColor)),Q===void 0||Q.attribute!==ce||ce&&Q.data!==ce.data)return!0;X++}return s.attributesNum!==X||s.index!==F}function v(P,D,I,F){const B={},Z=D.attributes;let X=0;const j=I.getAttributes();for(const z in j)if(j[z].location>=0){let Q=Z[z];Q===void 0&&(z==="instanceMatrix"&&P.instanceMatrix&&(Q=P.instanceMatrix),z==="instanceColor"&&P.instanceColor&&(Q=P.instanceColor));const ce={};ce.attribute=Q,Q&&Q.data&&(ce.data=Q.data),B[z]=ce,X++}s.attributes=B,s.attributesNum=X,s.index=F}function b(){const P=s.newAttributes;for(let D=0,I=P.length;D<I;D++)P[D]=0}function x(P){f(P,0)}function f(P,D){const I=s.newAttributes,F=s.enabledAttributes,B=s.attributeDivisors;I[P]=1,F[P]===0&&(t.enableVertexAttribArray(P),F[P]=1),B[P]!==D&&(t.vertexAttribDivisor(P,D),B[P]=D)}function g(){const P=s.newAttributes,D=s.enabledAttributes;for(let I=0,F=D.length;I<F;I++)D[I]!==P[I]&&(t.disableVertexAttribArray(I),D[I]=0)}function w(P,D,I,F,B,Z,X){X===!0?t.vertexAttribIPointer(P,D,I,B,Z):t.vertexAttribPointer(P,D,I,F,B,Z)}function S(P,D,I,F){b();const B=F.attributes,Z=I.getAttributes(),X=D.defaultAttributeValues;for(const j in Z){const z=Z[j];if(z.location>=0){let $=B[j];if($===void 0&&(j==="instanceMatrix"&&P.instanceMatrix&&($=P.instanceMatrix),j==="instanceColor"&&P.instanceColor&&($=P.instanceColor)),$!==void 0){const Q=$.normalized,ce=$.itemSize,Me=e.get($);if(Me===void 0)continue;const Ye=Me.buffer,He=Me.type,Ve=Me.bytesPerElement,J=He===t.INT||He===t.UNSIGNED_INT||$.gpuType===Jh;if($.isInterleavedBufferAttribute){const ie=$.data,Ee=ie.stride,Be=$.offset;if(ie.isInstancedInterleavedBuffer){for(let q=0;q<z.locationSize;q++)f(z.location+q,ie.meshPerAttribute);P.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let q=0;q<z.locationSize;q++)x(z.location+q);t.bindBuffer(t.ARRAY_BUFFER,Ye);for(let q=0;q<z.locationSize;q++)w(z.location+q,ce/z.locationSize,He,Q,Ee*Ve,(Be+ce/z.locationSize*q)*Ve,J)}else{if($.isInstancedBufferAttribute){for(let ie=0;ie<z.locationSize;ie++)f(z.location+ie,$.meshPerAttribute);P.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ie=0;ie<z.locationSize;ie++)x(z.location+ie);t.bindBuffer(t.ARRAY_BUFFER,Ye);for(let ie=0;ie<z.locationSize;ie++)w(z.location+ie,ce/z.locationSize,He,Q,ce*Ve,ce/z.locationSize*ie*Ve,J)}}else if(X!==void 0){const Q=X[j];if(Q!==void 0)switch(Q.length){case 2:t.vertexAttrib2fv(z.location,Q);break;case 3:t.vertexAttrib3fv(z.location,Q);break;case 4:t.vertexAttrib4fv(z.location,Q);break;default:t.vertexAttrib1fv(z.location,Q)}}}}g()}function y(){T();for(const P in i){const D=i[P];for(const I in D){const F=D[I];for(const B in F){const Z=F[B];for(const X in Z)d(Z[X].object),delete Z[X];delete F[B]}}delete i[P]}}function M(P){if(i[P.id]===void 0)return;const D=i[P.id];for(const I in D){const F=D[I];for(const B in F){const Z=F[B];for(const X in Z)d(Z[X].object),delete Z[X];delete F[B]}}delete i[P.id]}function A(P){for(const D in i){const I=i[D];for(const F in I){const B=I[F];if(B[P.id]===void 0)continue;const Z=B[P.id];for(const X in Z)d(Z[X].object),delete Z[X];delete B[P.id]}}}function _(P){for(const D in i){const I=i[D],F=P.isInstancedMesh===!0?P.id:0,B=I[F];if(B!==void 0){for(const Z in B){const X=B[Z];for(const j in X)d(X[j].object),delete X[j];delete B[Z]}delete I[F],Object.keys(I).length===0&&delete i[D]}}}function T(){R(),o=!0,s!==r&&(s=r,u(s.object))}function R(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:l,reset:T,resetDefaultState:R,dispose:y,releaseStatesOfGeometry:M,releaseStatesOfObject:_,releaseStatesOfProgram:A,initAttributes:b,enableAttribute:x,disableUnusedAttributes:g}}function JC(t,e,n){let i;function r(c){i=c}function s(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function o(c,u,d){d!==0&&(t.drawArraysInstanced(i,c,u,d),n.update(u,i,d))}function l(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,d);let h=0;for(let m=0;m<d;m++)h+=u[m];n.update(h,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=l}function QC(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==Qn&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(A){const _=A===_i&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==An&&A!==hi&&!_&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE))}function c(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let u=n.precision!==void 0?n.precision:"highp";const d=c(u);d!==u&&(Oe("WebGLRenderer:",u,"not supported, using",d,"instead."),u=d);const p=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&Oe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=t.getParameter(t.MAX_TEXTURE_SIZE),x=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),f=t.getParameter(t.MAX_VERTEX_ATTRIBS),g=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),w=t.getParameter(t.MAX_VARYING_VECTORS),S=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),y=t.getParameter(t.MAX_SAMPLES),M=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:l,precision:u,logarithmicDepthBuffer:p,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:v,maxTextureSize:b,maxCubemapSize:x,maxAttributes:f,maxVertexUniforms:g,maxVaryings:w,maxFragmentUniforms:S,maxSamples:y,samples:M}}function eA(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new sr,l=new ze,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){const m=p.length!==0||h||i!==0||r;return r=h,i=p.length,m},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,h){n=d(p,h,0)},this.setState=function(p,h,m){const v=p.clippingPlanes,b=p.clipIntersection,x=p.clipShadows,f=t.get(p);if(!r||v===null||v.length===0||s&&!x)s?d(null):u();else{const g=s?0:i,w=g*4;let S=f.clippingState||null;c.value=S,S=d(v,h,w,m);for(let y=0;y!==w;++y)S[y]=n[y];f.clippingState=S,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=g}};function u(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(p,h,m,v){const b=p!==null?p.length:0;let x=null;if(b!==0){if(x=c.value,v!==!0||x===null){const f=m+b*4,g=h.matrixWorldInverse;l.getNormalMatrix(g),(x===null||x.length<f)&&(x=new Float32Array(f));for(let w=0,S=m;w!==b;++w,S+=4)o.copy(p[w]).applyMatrix4(g,l),o.normal.toArray(x,S),x[S+3]=o.constant}c.value=x,c.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,x}}const Fs=4,tA=6,nA=20,iA=256,ba=new pp,Gx=new qe;let Xu=null,$u=0,qu=0,Yu=!1;const rA=new G,Ur=new G;class Hx{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){const{size:o=256,position:l=rA}=s;Xu=this._renderer.getRenderTarget(),$u=this._renderer.getActiveCubeFace(),qu=this._renderer.getActiveMipmapLevel(),Yu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,l),n>0&&this._blur(c,0,0,n),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$x(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Xu,$u,qu),this._renderer.xr.enabled=Yu,e.scissorTest=!1,_s(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Jr||e.mapping===Ks?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Xu=this._renderer.getRenderTarget(),$u=this._renderer.getActiveCubeFace(),qu=this._renderer.getActiveMipmapLevel(),Yu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:_i,format:Qn,colorSpace:uc,depthBuffer:!1},r=Wx(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wx(e,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=sA(s)),this._blurMaterial=oA(s,e,n),this._ggxMaterial=aA(s,e,n)}return r}_compileMaterial(e){const n=new Nn(new Ln,e);this._renderer.compile(n,ba)}_sceneToCubeUV(e,n,i,r,s){const c=new Cn(90,1,n,i),u=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],p=this._renderer,h=p.autoClear,m=p.toneMapping;p.getClearColor(Gx),p.toneMapping=gi,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(r),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Nn(new wo,new lp({name:"PMREM.Background",side:En,depthWrite:!1,depthTest:!1})));const b=this._backgroundBox,x=b.material;let f=!1;const g=e.background;g?g.isColor&&(x.color.copy(g),e.background=null,f=!0):(x.color.copy(Gx),f=!0);for(let w=0;w<6;w++){const S=w%3;S===0?(c.up.set(0,u[w],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+d[w],s.y,s.z)):S===1?(c.up.set(0,0,u[w]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+d[w],s.z)):(c.up.set(0,u[w],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+d[w]));const y=this._cubeSize;_s(r,S*y,w>2?y:0,y,y),p.setRenderTarget(r),f&&p.render(b,c),p.render(e,c)}p.toneMapping=m,p.autoClear=h,e.background=g}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Jr||e.mapping===Ks;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=$x()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xx());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const l=s.uniforms;l.envMap.value=e;const c=this._cubeSize;_s(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(o,ba)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,l=this._lodMeshes[i];l.material=o;const c=o.uniforms,u=i/(this._lodMeshes.length-1),d=n/(this._lodMeshes.length-1),p=Math.sqrt(u*u-d*d),h=u*1.25,m=p*h,{_lodMax:v}=this,b=this._sizeLods[i],x=3*b*(i>v-Fs?i-v+Fs:0),f=4*(this._cubeSize-b);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=v-n,_s(s,x,f,3*b,2*b),r.setRenderTarget(s),r.render(l,ba),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=v-i,_s(e,x,f,3*b,2*b),r.setRenderTarget(e),r.render(l,ba)}_blur(e,n,i,r){const s=this._pingPongRenderTarget,o=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,n,i,o),this._blurPass(s,e,i,i,o)}_blurPass(e,n,i,r,s){const o=this._renderer,l=this._blurMaterial,c=this._lodMeshes[r];c.material=l;const u=l.uniforms;u.envMap.value=e.texture,u.sigma.value=s,u.mipInt.value=this._lodMax-i;const d=this._sizeLods[r],p=3*d*(r>this._lodMax-Fs?r-this._lodMax+Fs:0),h=4*(this._cubeSize-d);_s(n,p,h,3*d,2*d),o.setRenderTarget(n),o.render(c,ba)}}function sA(t){const e=[],n=[];let i=t;const r=t-Fs+1+tA;for(let s=0;s<r;s++){const o=Math.pow(2,i);e.push(o);const l=1/(o-2),c=-l,u=1+l,d=[c,c,u,c,u,u,c,c,u,u,c,u],p=6,h=6,m=3,v=new Float32Array(m*h*p),b=new Float32Array(m*h*p);for(let f=0;f<p;f++){const g=f%3*2/3-1,w=f>2?0:-1,S=[g,w,0,g+2/3,w,0,g+2/3,w+1,0,g,w,0,g+2/3,w+1,0,g,w+1,0];v.set(S,m*h*f);for(let y=0;y<h;y++){const M=d[y*2]*2-1,A=d[y*2+1]*2-1;f===0?Ur.set(1,A,M):f===1?Ur.set(-M,1,-A):f===2?Ur.set(-M,A,1):f===3?Ur.set(-1,A,-M):f===4?Ur.set(-M,-1,A):Ur.set(M,A,-1),Ur.toArray(b,(f*h+y)*m)}}const x=new Ln;x.setAttribute("position",new Ii(v,m)),x.setAttribute("outputDirection",new Ii(b,m)),n.push(new Nn(x,null)),i>Fs&&i--}return{lodMeshes:n,sizeLods:e}}function Wx(t,e,n){const i=new ni(t,e,n);return i.texture.mapping=Ic,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function _s(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function aA(t,e,n){return new yi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:iA,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Oc(),fragmentShader:`

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
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function oA(t,e,n){return new yi({name:"SphericalGaussianBlur",defines:{SAMPLES:nA,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Oc(),fragmentShader:`

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
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function Xx(){return new yi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Oc(),fragmentShader:`

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
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function $x(){return new yi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Oc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function Oc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class L_ extends ni{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new C_(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new wo(5,5,5),s=new yi({name:"CubemapFromEquirect",uniforms:Zs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:En,blending:Fi});s.uniforms.tEquirect.value=n;const o=new Nn(r,s),l=n.minFilter;return n.minFilter===Vr&&(n.minFilter=sn),new d2(1,10,this).update(e,o),n.minFilter=l,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}function lA(t){let e=new WeakMap,n=new WeakMap,i=null;function r(h,m=!1){return h==null?null:m?o(h):s(h)}function s(h){if(h&&h.isTexture){const m=h.mapping;if(m===vu||m===_u)if(e.has(h)){const v=e.get(h).texture;return l(v,h.mapping)}else{const v=h.image;if(v&&v.height>0){const b=new L_(v.height);return b.fromEquirectangularTexture(t,h),e.set(h,b),h.addEventListener("dispose",u),l(b.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){const m=h.mapping,v=m===vu||m===_u,b=m===Jr||m===Ks;if(v||b){let x=n.get(h);const f=x!==void 0?x.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return i===null&&(i=new Hx(t)),x=v?i.fromEquirectangular(h,x):i.fromCubemap(h,x),x.texture.pmremVersion=h.pmremVersion,n.set(h,x),x.texture;if(x!==void 0)return x.texture;{const g=h.image;return v&&g&&g.height>0||b&&g&&c(g)?(i===null&&(i=new Hx(t)),x=v?i.fromEquirectangular(h):i.fromCubemap(h),x.texture.pmremVersion=h.pmremVersion,n.set(h,x),h.addEventListener("dispose",d),x.texture):null}}}return h}function l(h,m){return m===vu?h.mapping=Jr:m===_u&&(h.mapping=Ks),h}function c(h){let m=0;const v=6;for(let b=0;b<v;b++)h[b]!==void 0&&m++;return m===v}function u(h){const m=h.target;m.removeEventListener("dispose",u);const v=e.get(m);v!==void 0&&(e.delete(m),v.dispose())}function d(h){const m=h.target;m.removeEventListener("dispose",d);const v=n.get(m);v!==void 0&&(n.delete(m),v.dispose())}function p(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:p}}function cA(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&js("WebGLRenderer: "+i+" extension not supported."),r}}}function uA(t,e,n,i){const r={},s=new WeakMap;function o(p){const h=p.target;h.index!==null&&e.remove(h.index);for(const v in h.attributes)e.remove(h.attributes[v]);h.removeEventListener("dispose",o),delete r[h.id];const m=s.get(h);m&&(e.remove(m),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function l(p,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,n.memory.geometries++),h}function c(p){const h=p.attributes;for(const m in h)e.update(h[m],t.ARRAY_BUFFER)}function u(p){const h=[],m=p.index,v=p.attributes.position;let b=0;if(v===void 0)return;if(m!==null){const g=m.array;b=m.version;for(let w=0,S=g.length;w<S;w+=3){const y=g[w+0],M=g[w+1],A=g[w+2];h.push(y,M,M,A,A,y)}}else{const g=v.array;b=v.version;for(let w=0,S=g.length/3-1;w<S;w+=3){const y=w+0,M=w+1,A=w+2;h.push(y,M,M,A,A,y)}}const x=new(v.count>=65535?M_:b_)(h,1);x.version=b;const f=s.get(p);f&&e.remove(f),s.set(p,x)}function d(p){const h=s.get(p);if(h){const m=p.index;m!==null&&h.version<m.version&&u(p)}else u(p);return s.get(p)}return{get:l,update:c,getWireframeAttribute:d}}function dA(t,e,n){let i;function r(p){i=p}let s,o;function l(p){s=p.type,o=p.bytesPerElement}function c(p,h){t.drawElements(i,h,s,p*o),n.update(h,i,1)}function u(p,h,m){m!==0&&(t.drawElementsInstanced(i,h,s,p*o,m),n.update(h,i,m))}function d(p,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,p,0,m);let b=0;for(let x=0;x<m;x++)b+=h[x];n.update(b,i,1)}this.setMode=r,this.setIndex=l,this.render=c,this.renderInstances=u,this.renderMultiDraw=d}function fA(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,l){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=l*(s/3);break;case t.LINES:n.lines+=l*(s/2);break;case t.LINE_STRIP:n.lines+=l*(s-1);break;case t.LINE_LOOP:n.lines+=l*s;break;case t.POINTS:n.points+=l*s;break;default:rt("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function hA(t,e,n){const i=new WeakMap,r=new Et;function s(o,l,c){const u=o.morphTargetInfluences,d=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,p=d!==void 0?d.length:0;let h=i.get(l);if(h===void 0||h.count!==p){let R=function(){_.dispose(),i.delete(l),l.removeEventListener("dispose",R)};var m=R;h!==void 0&&h.texture.dispose();const v=l.morphAttributes.position!==void 0,b=l.morphAttributes.normal!==void 0,x=l.morphAttributes.color!==void 0,f=l.morphAttributes.position||[],g=l.morphAttributes.normal||[],w=l.morphAttributes.color||[];let S=0;v===!0&&(S=1),b===!0&&(S=2),x===!0&&(S=3);let y=l.attributes.position.count*S,M=1;y>e.maxTextureSize&&(M=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const A=new Float32Array(y*M*4*p),_=new y_(A,y,M,p);_.type=hi,_.needsUpdate=!0;const T=S*4;for(let P=0;P<p;P++){const D=f[P],I=g[P],F=w[P],B=y*M*4*P;for(let Z=0;Z<D.count;Z++){const X=Z*T;v===!0&&(r.fromBufferAttribute(D,Z),A[B+X+0]=r.x,A[B+X+1]=r.y,A[B+X+2]=r.z,A[B+X+3]=0),b===!0&&(r.fromBufferAttribute(I,Z),A[B+X+4]=r.x,A[B+X+5]=r.y,A[B+X+6]=r.z,A[B+X+7]=0),x===!0&&(r.fromBufferAttribute(F,Z),A[B+X+8]=r.x,A[B+X+9]=r.y,A[B+X+10]=r.z,A[B+X+11]=F.itemSize===4?r.w:1)}}h={count:p,texture:_,size:new Ze(y,M)},i.set(l,h),l.addEventListener("dispose",R)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let v=0;for(let x=0;x<u.length;x++)v+=u[x];const b=l.morphTargetsRelative?1:1-v;c.getUniforms().setValue(t,"morphTargetBaseInfluence",b),c.getUniforms().setValue(t,"morphTargetInfluences",u)}c.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function pA(t,e,n,i,r){let s=new WeakMap;function o(u){const d=r.render.frame,p=u.geometry,h=e.get(u,p);if(s.get(h)!==d&&(e.update(h),s.set(h,d)),u.isInstancedMesh&&(u.hasEventListener("dispose",c)===!1&&u.addEventListener("dispose",c),s.get(u)!==d&&(n.update(u.instanceMatrix,t.ARRAY_BUFFER),u.instanceColor!==null&&n.update(u.instanceColor,t.ARRAY_BUFFER),s.set(u,d))),u.isSkinnedMesh){const m=u.skeleton;s.get(m)!==d&&(m.update(),s.set(m,d))}return h}function l(){s=new WeakMap}function c(u){const d=u.target;d.removeEventListener("dispose",c),i.releaseStatesOfObject(d),n.remove(d.instanceMatrix),d.instanceColor!==null&&n.remove(d.instanceColor)}return{update:o,dispose:l}}const mA={[s_]:"LINEAR_TONE_MAPPING",[a_]:"REINHARD_TONE_MAPPING",[o_]:"CINEON_TONE_MAPPING",[Zh]:"ACES_FILMIC_TONE_MAPPING",[c_]:"AGX_TONE_MAPPING",[u_]:"NEUTRAL_TONE_MAPPING",[l_]:"CUSTOM_TONE_MAPPING"};function xA(t,e,n,i,r,s){const o=new ni(e,n,{type:t,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let l=null,c=null;const u=new Ln;u.setAttribute("position",new Ut([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new Ut([0,2,0,0,2,0],2));const d=new i2({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),p=new Nn(u,d),h=new pp(-1,1,1,-1,0,1);let m=null,v=null,b=!1,x,f=null,g=[],w=!1;this.setSize=function(S,y){o.setSize(S,y),l!==null&&l.setSize(S,y),c!==null&&c.setSize(S,y);for(let M=0;M<g.length;M++){const A=g[M];A.setSize&&A.setSize(S,y)}},this.setEffects=function(S){g=S,w=g.length>0&&g[0].isRenderPass===!0;const y=o.width,M=o.height;g.length>0&&l===null&&(l=new ni(y,M,{type:_i,depthBuffer:!1,stencilBuffer:!1}),c=new ni(y,M,{type:_i,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<g.length;A++){const _=g[A];_.setSize&&_.setSize(y,M)}},this.begin=function(S,y){if(b||S.toneMapping===gi&&g.length===0)return!1;if(f=y,y!==null){const M=y.width,A=y.height;(o.width!==M||o.height!==A)&&this.setSize(M,A)}return w===!1&&S.setRenderTarget(o),x=S.toneMapping,S.toneMapping=gi,!0},this.hasRenderPass=function(){return w},this.end=function(S,y){S.toneMapping=x,b=!0;let M=o,A=l;for(let _=0;_<g.length;_++){const T=g[_];T.enabled!==!1&&(T.render(S,A,M,y),T.needsSwap!==!1&&(M=A,A=A===l?c:l))}if(m!==S.outputColorSpace||v!==S.toneMapping){m=S.outputColorSpace,v=S.toneMapping,d.defines={},et.getTransfer(m)===lt&&(d.defines.SRGB_TRANSFER="");const _=mA[v];_&&(d.defines[_]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=M.texture,S.setRenderTarget(f),S.render(p,h),f=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){o.dispose(),l!==null&&l.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}const I_=new dn,Vf=new go(1,1),U_=new y_,k_=new DM,O_=new C_,qx=[],Yx=[],Kx=new Float32Array(16),Zx=new Float32Array(9),Jx=new Float32Array(4);function aa(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=qx[r];if(s===void 0&&(s=new Float32Array(r),qx[r]=s),e!==0){i.toArray(s,0);for(let o=1,l=0;o!==e;++o)l+=n,t[o].toArray(s,l)}return s}function jt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function zt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Bc(t,e){let n=Yx[e];n===void 0&&(n=new Int32Array(e),Yx[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function gA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function vA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(jt(n,e))return;t.uniform2fv(this.addr,e),zt(n,e)}}function _A(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(jt(n,e))return;t.uniform3fv(this.addr,e),zt(n,e)}}function yA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(jt(n,e))return;t.uniform4fv(this.addr,e),zt(n,e)}}function EA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(jt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),zt(n,e)}else{if(jt(n,i))return;Jx.set(i),t.uniformMatrix2fv(this.addr,!1,Jx),zt(n,i)}}function SA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(jt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),zt(n,e)}else{if(jt(n,i))return;Zx.set(i),t.uniformMatrix3fv(this.addr,!1,Zx),zt(n,i)}}function bA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(jt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),zt(n,e)}else{if(jt(n,i))return;Kx.set(i),t.uniformMatrix4fv(this.addr,!1,Kx),zt(n,i)}}function MA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function wA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(jt(n,e))return;t.uniform2iv(this.addr,e),zt(n,e)}}function CA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(jt(n,e))return;t.uniform3iv(this.addr,e),zt(n,e)}}function AA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(jt(n,e))return;t.uniform4iv(this.addr,e),zt(n,e)}}function TA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function NA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(jt(n,e))return;t.uniform2uiv(this.addr,e),zt(n,e)}}function RA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(jt(n,e))return;t.uniform3uiv(this.addr,e),zt(n,e)}}function DA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(jt(n,e))return;t.uniform4uiv(this.addr,e),zt(n,e)}}function PA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Vf.compareFunction=n.isReversedDepthBuffer()?sp:rp,s=Vf):s=I_,n.setTexture2D(e||s,r)}function FA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||k_,r)}function LA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||O_,r)}function IA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||U_,r)}function UA(t){switch(t){case 5126:return gA;case 35664:return vA;case 35665:return _A;case 35666:return yA;case 35674:return EA;case 35675:return SA;case 35676:return bA;case 5124:case 35670:return MA;case 35667:case 35671:return wA;case 35668:case 35672:return CA;case 35669:case 35673:return AA;case 5125:return TA;case 36294:return NA;case 36295:return RA;case 36296:return DA;case 35678:case 36198:case 36298:case 36306:case 35682:return PA;case 35679:case 36299:case 36307:return FA;case 35680:case 36300:case 36308:case 36293:return LA;case 36289:case 36303:case 36311:case 36292:return IA}}function kA(t,e){t.uniform1fv(this.addr,e)}function OA(t,e){const n=aa(e,this.size,2);t.uniform2fv(this.addr,n)}function BA(t,e){const n=aa(e,this.size,3);t.uniform3fv(this.addr,n)}function jA(t,e){const n=aa(e,this.size,4);t.uniform4fv(this.addr,n)}function zA(t,e){const n=aa(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function VA(t,e){const n=aa(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function GA(t,e){const n=aa(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function HA(t,e){t.uniform1iv(this.addr,e)}function WA(t,e){t.uniform2iv(this.addr,e)}function XA(t,e){t.uniform3iv(this.addr,e)}function $A(t,e){t.uniform4iv(this.addr,e)}function qA(t,e){t.uniform1uiv(this.addr,e)}function YA(t,e){t.uniform2uiv(this.addr,e)}function KA(t,e){t.uniform3uiv(this.addr,e)}function ZA(t,e){t.uniform4uiv(this.addr,e)}function JA(t,e,n){const i=this.cache,r=e.length,s=Bc(n,r);jt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));let o;this.type===t.SAMPLER_2D_SHADOW?o=Vf:o=I_;for(let l=0;l!==r;++l)n.setTexture2D(e[l]||o,s[l])}function QA(t,e,n){const i=this.cache,r=e.length,s=Bc(n,r);jt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||k_,s[o])}function eT(t,e,n){const i=this.cache,r=e.length,s=Bc(n,r);jt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||O_,s[o])}function tT(t,e,n){const i=this.cache,r=e.length,s=Bc(n,r);jt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||U_,s[o])}function nT(t){switch(t){case 5126:return kA;case 35664:return OA;case 35665:return BA;case 35666:return jA;case 35674:return zA;case 35675:return VA;case 35676:return GA;case 5124:case 35670:return HA;case 35667:case 35671:return WA;case 35668:case 35672:return XA;case 35669:case 35673:return $A;case 5125:return qA;case 36294:return YA;case 36295:return KA;case 36296:return ZA;case 35678:case 36198:case 36298:case 36306:case 35682:return JA;case 35679:case 36299:case 36307:return QA;case 35680:case 36300:case 36308:case 36293:return eT;case 36289:case 36303:case 36311:case 36292:return tT}}class iT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=UA(n.type)}}class rT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=nT(n.type)}}class sT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const l=r[s];l.setValue(e,n[l.id],i)}}}const Ku=/(\w+)(\])?(\[|\.)?/g;function Qx(t,e){t.seq.push(e),t.map[e.id]=e}function aT(t,e,n){const i=t.name,r=i.length;for(Ku.lastIndex=0;;){const s=Ku.exec(i),o=Ku.lastIndex;let l=s[1];const c=s[2]==="]",u=s[3];if(c&&(l=l|0),u===void 0||u==="["&&o+2===r){Qx(n,u===void 0?new iT(l,t,e):new rT(l,t,e));break}else{let p=n.map[l];p===void 0&&(p=new sT(l),Qx(n,p)),n=p}}}class Ll{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const l=e.getActiveUniform(n,o),c=e.getUniformLocation(n,l.name);aT(l,c,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const l=n[s],c=i[l.id];c.needsUpdate!==!1&&l.setValue(e,c.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function eg(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const oT=37297;let lT=0;function cT(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const l=o+1;i.push(`${l===e?">":" "} ${l}: ${n[o]}`)}return i.join(`
`)}const tg=new ze;function uT(t){et._getMatrix(tg,et.workingColorSpace,t);const e=`mat3( ${tg.elements.map(n=>n.toFixed(4))} )`;switch(et.getTransfer(t)){case dc:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return Oe("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function ng(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const l=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+cT(t.getShaderSource(e),l)}else return s}function dT(t,e){const n=uT(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const fT={[s_]:"Linear",[a_]:"Reinhard",[o_]:"Cineon",[Zh]:"ACESFilmic",[c_]:"AgX",[u_]:"Neutral",[l_]:"Custom"};function hT(t,e){const n=fT[e];return n===void 0?(Oe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const xl=new G;function pT(){et.getLuminanceCoefficients(xl);const t=xl.x.toFixed(4),e=xl.y.toFixed(4),n=xl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mT(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Da).join(`
`)}function xT(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function gT(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let l=1;s.type===t.FLOAT_MAT2&&(l=2),s.type===t.FLOAT_MAT3&&(l=3),s.type===t.FLOAT_MAT4&&(l=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:l}}return n}function Da(t){return t!==""}function ig(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function rg(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const vT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gf(t){return t.replace(vT,yT)}const _T=new Map;function yT(t,e){let n=Xe[e];if(n===void 0){const i=_T.get(e);if(i!==void 0)n=Xe[i],Oe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Gf(n)}const ET=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sg(t){return t.replace(ET,ST)}function ST(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function ag(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}const bT={[Nl]:"SHADOWMAP_TYPE_PCF",[Na]:"SHADOWMAP_TYPE_VSM"};function MT(t){return bT[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const wT={[Jr]:"ENVMAP_TYPE_CUBE",[Ks]:"ENVMAP_TYPE_CUBE",[Ic]:"ENVMAP_TYPE_CUBE_UV"};function CT(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":wT[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const AT={[Ks]:"ENVMAP_MODE_REFRACTION"};function TT(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":AT[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const NT={[r_]:"ENVMAP_BLENDING_MULTIPLY",[lM]:"ENVMAP_BLENDING_MIX",[cM]:"ENVMAP_BLENDING_ADD"};function RT(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":NT[t.combine]||"ENVMAP_BLENDING_NONE"}function DT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function PT(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,l=n.fragmentShader;const c=MT(n),u=CT(n),d=TT(n),p=RT(n),h=DT(n),m=mT(n),v=xT(s),b=r.createProgram();let x,f,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(x=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Da).join(`
`),x.length>0&&(x+=`
`),f=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Da).join(`
`),f.length>0&&(f+=`
`)):(x=[ag(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Da).join(`
`),f=[ag(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.envMap?"#define "+d:"",n.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==gi?"#define TONE_MAPPING":"",n.toneMapping!==gi?Xe.tonemapping_pars_fragment:"",n.toneMapping!==gi?hT("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,dT("linearToOutputTexel",n.outputColorSpace),pT(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Da).join(`
`)),o=Gf(o),o=ig(o,n),o=rg(o,n),l=Gf(l),l=ig(l,n),l=rg(l,n),o=sg(o),l=sg(l),n.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,x=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,f=["#define varying in",n.glslVersion===px?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===px?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const w=g+x+o,S=g+f+l,y=eg(r,r.VERTEX_SHADER,w),M=eg(r,r.FRAGMENT_SHADER,S);r.attachShader(b,y),r.attachShader(b,M),n.index0AttributeName!==void 0?r.bindAttribLocation(b,0,n.index0AttributeName):n.hasPositionAttribute===!0&&r.bindAttribLocation(b,0,"position"),r.linkProgram(b);function A(P){if(t.debug.checkShaderErrors){const D=r.getProgramInfoLog(b)||"",I=r.getShaderInfoLog(y)||"",F=r.getShaderInfoLog(M)||"",B=D.trim(),Z=I.trim(),X=F.trim();let j=!0,z=!0;if(r.getProgramParameter(b,r.LINK_STATUS)===!1)if(j=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,b,y,M);else{const $=ng(r,y,"vertex"),Q=ng(r,M,"fragment");rt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(b,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+$+`
`+Q)}else B!==""?Oe("WebGLProgram: Program Info Log:",B):(Z===""||X==="")&&(z=!1);z&&(P.diagnostics={runnable:j,programLog:B,vertexShader:{log:Z,prefix:x},fragmentShader:{log:X,prefix:f}})}r.deleteShader(y),r.deleteShader(M),_=new Ll(r,b),T=gT(r,b)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let T;this.getAttributes=function(){return T===void 0&&A(this),T};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(b,oT)),R},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(b),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=lT++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=y,this.fragmentShader=M,this}let FT=0;class LT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){const r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new IT(e),n.set(e,i)),i}}class IT{constructor(e){this.id=FT++,this.code=e,this.usedTimes=0}}function UT(t){return t===Qr||t===lc||t===cc}function kT(t,e,n,i,r,s){const o=new E_,l=new LT,c=new Set,u=[],d=new Map,p=i.logarithmicDepthBuffer;let h=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(_){return c.add(_),_===0?"uv":`uv${_}`}function b(_,T,R,P,D,I){const F=P.fog,B=D.geometry,Z=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,X=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,j=e.get(_.envMap||Z,X),z=j&&j.mapping===Ic?j.image.height:null,$=m[_.type];_.precision!==null&&(h=i.getMaxPrecision(_.precision),h!==_.precision&&Oe("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));const Q=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ce=Q!==void 0?Q.length:0;let Me=0;B.morphAttributes.position!==void 0&&(Me=1),B.morphAttributes.normal!==void 0&&(Me=2),B.morphAttributes.color!==void 0&&(Me=3);let Ye,He,Ve,J;if($){const ft=ui[$];Ye=ft.vertexShader,He=ft.fragmentShader}else{Ye=_.vertexShader,He=_.fragmentShader;const ft=l.getVertexShaderStage(_),st=l.getFragmentShaderStage(_);l.update(_,ft,st),Ve=ft.id,J=st.id}const ie=t.getRenderTarget(),Ee=t.state.buffers.depth.getReversed(),Be=D.isInstancedMesh===!0,q=D.isBatchedMesh===!0,le=!!_.map,we=!!_.matcap,Fe=!!j,je=!!_.aoMap,Le=!!_.lightMap,Ue=!!_.bumpMap&&_.wireframe===!1,it=!!_.normalMap,Nt=!!_.displacementMap,pn=!!_.emissiveMap,_t=!!_.metalnessMap,Rt=!!_.roughnessMap,O=_.anisotropy>0,Zt=_.clearcoat>0,ot=_.dispersion>0,N=_.retroreflectivity>0,E=_.iridescence>0,V=_.sheen>0,Y=_.transmission>0,ee=O&&!!_.anisotropyMap,oe=Zt&&!!_.clearcoatMap,ue=Zt&&!!_.clearcoatNormalMap,te=Zt&&!!_.clearcoatRoughnessMap,re=E&&!!_.iridescenceMap,de=E&&!!_.iridescenceThicknessMap,De=V&&!!_.sheenColorMap,me=V&&!!_.sheenRoughnessMap,fe=!!_.specularMap,Pe=!!_.specularColorMap,ke=!!_.specularIntensityMap,Ge=Y&&!!_.transmissionMap,k=Y&&!!_.thicknessMap,he=!!_.gradientMap,ne=!!_.alphaMap,pe=_.alphaTest>0,_e=!!_.alphaHash,se=!!_.extensions;let Ie=gi;_.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ie=t.toneMapping);const Te={shaderID:$,shaderType:_.type,shaderName:_.name,vertexShader:Ye,fragmentShader:He,defines:_.defines,customVertexShaderID:Ve,customFragmentShaderID:J,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:q,batchingColor:q&&D._colorsTexture!==null,instancing:Be,instancingColor:Be&&D.instanceColor!==null,instancingMorph:Be&&D.morphTexture!==null,outputColorSpace:ie===null?t.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:le,matcap:we,envMap:Fe,envMapMode:Fe&&j.mapping,envMapCubeUVHeight:z,aoMap:je,lightMap:Le,bumpMap:Ue,normalMap:it,displacementMap:Nt,emissiveMap:pn,normalMapObjectSpace:it&&_.normalMapType===fM,normalMapTangentSpace:it&&_.normalMapType===jf,packedNormalMap:it&&_.normalMapType===jf&&UT(_.normalMap.format),metalnessMap:_t,roughnessMap:Rt,anisotropy:O,anisotropyMap:ee,clearcoat:Zt,clearcoatMap:oe,clearcoatNormalMap:ue,clearcoatRoughnessMap:te,dispersion:ot,retroreflection:N,iridescence:E,iridescenceMap:re,iridescenceThicknessMap:de,sheen:V,sheenColorMap:De,sheenRoughnessMap:me,specularMap:fe,specularColorMap:Pe,specularIntensityMap:ke,transmission:Y,transmissionMap:Ge,thicknessMap:k,gradientMap:he,opaque:_.transparent===!1&&_.blending===za&&_.alphaToCoverage===!1,alphaMap:ne,alphaTest:pe,alphaHash:_e,combine:_.combine,mapUv:le&&v(_.map.channel),aoMapUv:je&&v(_.aoMap.channel),lightMapUv:Le&&v(_.lightMap.channel),bumpMapUv:Ue&&v(_.bumpMap.channel),normalMapUv:it&&v(_.normalMap.channel),displacementMapUv:Nt&&v(_.displacementMap.channel),emissiveMapUv:pn&&v(_.emissiveMap.channel),metalnessMapUv:_t&&v(_.metalnessMap.channel),roughnessMapUv:Rt&&v(_.roughnessMap.channel),anisotropyMapUv:ee&&v(_.anisotropyMap.channel),clearcoatMapUv:oe&&v(_.clearcoatMap.channel),clearcoatNormalMapUv:ue&&v(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&v(_.clearcoatRoughnessMap.channel),iridescenceMapUv:re&&v(_.iridescenceMap.channel),iridescenceThicknessMapUv:de&&v(_.iridescenceThicknessMap.channel),sheenColorMapUv:De&&v(_.sheenColorMap.channel),sheenRoughnessMapUv:me&&v(_.sheenRoughnessMap.channel),specularMapUv:fe&&v(_.specularMap.channel),specularColorMapUv:Pe&&v(_.specularColorMap.channel),specularIntensityMapUv:ke&&v(_.specularIntensityMap.channel),transmissionMapUv:Ge&&v(_.transmissionMap.channel),thicknessMapUv:k&&v(_.thicknessMap.channel),alphaMapUv:ne&&v(_.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(it||O),vertexNormals:!!B.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!B.attributes.uv&&(le||ne),fog:!!F,useFog:_.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||B.attributes.normal===void 0&&it===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:Ee,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:Me,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:I.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:t.shadowMap.enabled&&R.length>0,shadowMapType:t.shadowMap.type,toneMapping:Ie,decodeVideoTexture:le&&_.map.isVideoTexture===!0&&et.getTransfer(_.map.colorSpace)===lt,decodeVideoTextureEmissive:pn&&_.emissiveMap.isVideoTexture===!0&&et.getTransfer(_.emissiveMap.colorSpace)===lt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===fi,flipSided:_.side===En,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:se&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&_.extensions.multiDraw===!0||q)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Te.vertexUv1s=c.has(1),Te.vertexUv2s=c.has(2),Te.vertexUv3s=c.has(3),c.clear(),Te}function x(_){const T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(const R in _.defines)T.push(R),T.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(f(T,_),g(T,_),T.push(t.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function f(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numSunLights),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numSunLightShadows),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function g(_,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.retroreflection&&o.enable(24),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function w(_){const T=m[_.type];let R;if(T){const P=ui[T];R=e2.clone(P.uniforms)}else R=_.uniforms;return R}function S(_,T){let R=d.get(T);return R!==void 0?++R.usedTimes:(R=new PT(t,T,_,r),u.push(R),d.set(T,R)),R}function y(_){if(--_.usedTimes===0){const T=u.indexOf(_);u[T]=u[u.length-1],u.pop(),d.delete(_.cacheKey),_.destroy()}}function M(_){l.remove(_)}function A(){l.dispose()}return{getParameters:b,getProgramCacheKey:x,getUniforms:w,acquireProgram:S,releaseProgram:y,releaseShaderCache:M,programs:u,dispose:A}}function OT(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let l=t.get(o);return l===void 0&&(l={},t.set(o,l)),l}function i(o){t.delete(o)}function r(o,l,c){t.get(o)[l]=c}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function BT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function og(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function lg(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h){let m=0;return h.isInstancedMesh&&(m+=2),h.isSkinnedMesh&&(m+=1),m}function l(h,m,v,b,x,f){let g=t[e];return g===void 0?(g={id:h.id,object:h,geometry:m,material:v,materialVariant:o(h),groupOrder:b,renderOrder:h.renderOrder,z:x,group:f},t[e]=g):(g.id=h.id,g.object=h,g.geometry=m,g.material=v,g.materialVariant=o(h),g.groupOrder=b,g.renderOrder=h.renderOrder,g.z=x,g.group=f),e++,g}function c(h,m,v,b,x,f,g){g.reversedDepth===!0&&(x=-x);const w=l(h,m,v,b,x,f);v.transmission>0?i.push(w):v.transparent===!0?r.push(w):n.push(w)}function u(h,m,v,b,x,f){const g=l(h,m,v,b,x,f);v.transmission>0?i.unshift(g):v.transparent===!0?r.unshift(g):n.unshift(g)}function d(h,m){n.length>1&&n.sort(h||BT),i.length>1&&i.sort(m||og),r.length>1&&r.sort(m||og)}function p(){for(let h=e,m=t.length;h<m;h++){const v=t[h];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:c,unshift:u,finish:p,sort:d}}function jT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new lg,t.set(i,[o])):r>=s.length?(o=new lg,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function zT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={direction:new G,color:new qe};break;case"SpotLight":n={position:new G,direction:new G,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new G,color:new qe,distance:0,decay:0};break;case"HemisphereLight":n={direction:new G,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":n={color:new qe,position:new G,halfWidth:new G,halfHeight:new G};break}return t[e.id]=n,n}}}function VT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let GT=0;function HT(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function WT(t){const e=new zT,n=VT(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new G);const r=new G,s=new bt,o=new bt;function l(u){let d=0,p=0,h=0;for(let D=0;D<9;D++)i.probe[D].set(0,0,0);let m=0,v=0,b=0,x=0,f=0,g=0,w=0,S=0,y=0,M=0,A=0,_=0,T=0,R=0;u.sort(HT);for(let D=0,I=u.length;D<I;D++){const F=u[D],B=F.color,Z=F.intensity,X=F.distance;let j=null;if(F.shadow&&F.shadow.map&&(F.shadow.map.texture.format===Qr?j=F.shadow.map.texture:j=F.shadow.map.depthTexture||F.shadow.map.texture),F.isAmbientLight)d+=B.r*Z,p+=B.g*Z,h+=B.b*Z;else if(F.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(F.sh.coefficients[z],Z);R++}else if(F.isSunLight){const z=e.get(F);if(z.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const $=F.shadow,Q=n.get(F);Q.shadowIntensity=$.intensity,Q.shadowBias=$.bias,Q.shadowNormalBias=$.normalBias,Q.shadowRadius=$.radius,Q.shadowMapSize.copy($.mapSize).multiply($.getFrameExtents()),i.sunShadow[v]=Q,i.sunShadowMap[v]=j;const ce=$.getViewportCount();for(let Me=0;Me<ce;Me++)i.sunShadowMatrix[b+Me]=$.getMatrix(Me),i.sunShadowCascade[b+Me]=$._cascadeData[Me];b+=ce,v++}i.sun[m]=z,m++}else if(F.isDirectionalLight){const z=e.get(F);if(z.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const $=F.shadow,Q=n.get(F);Q.shadowIntensity=$.intensity,Q.shadowBias=$.bias,Q.shadowNormalBias=$.normalBias,Q.shadowRadius=$.radius,Q.shadowMapSize=$.mapSize,i.directionalShadow[x]=Q,i.directionalShadowMap[x]=j,i.directionalShadowMatrix[x]=F.shadow.matrix,y++}i.directional[x]=z,x++}else if(F.isSpotLight){const z=e.get(F);z.position.setFromMatrixPosition(F.matrixWorld),z.color.copy(B).multiplyScalar(Z),z.distance=X,z.coneCos=Math.cos(F.angle),z.penumbraCos=Math.cos(F.angle*(1-F.penumbra)),z.decay=F.decay,i.spot[g]=z;const $=F.shadow;if(F.map&&(i.spotLightMap[_]=F.map,_++,$.updateMatrices(F),F.castShadow&&T++),i.spotLightMatrix[g]=$.matrix,F.castShadow){const Q=n.get(F);Q.shadowIntensity=$.intensity,Q.shadowBias=$.bias,Q.shadowNormalBias=$.normalBias,Q.shadowRadius=$.radius,Q.shadowMapSize=$.mapSize,i.spotShadow[g]=Q,i.spotShadowMap[g]=j,A++}g++}else if(F.isRectAreaLight){const z=e.get(F);z.color.copy(B).multiplyScalar(Z),z.halfWidth.set(F.width*.5,0,0),z.halfHeight.set(0,F.height*.5,0),i.rectArea[w]=z,w++}else if(F.isPointLight){const z=e.get(F);if(z.color.copy(F.color).multiplyScalar(F.intensity),z.distance=F.distance,z.decay=F.decay,F.castShadow){const $=F.shadow,Q=n.get(F);Q.shadowIntensity=$.intensity,Q.shadowBias=$.bias,Q.shadowNormalBias=$.normalBias,Q.shadowRadius=$.radius,Q.shadowMapSize=$.mapSize,Q.shadowCameraNear=$.camera.near,Q.shadowCameraFar=$.camera.far,i.pointShadow[f]=Q,i.pointShadowMap[f]=j,i.pointShadowMatrix[f]=F.shadow.matrix,M++}i.point[f]=z,f++}else if(F.isHemisphereLight){const z=e.get(F);z.skyColor.copy(F.color).multiplyScalar(Z),z.groundColor.copy(F.groundColor).multiplyScalar(Z),i.hemi[S]=z,S++}}w>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=xe.LTC_FLOAT_1,i.rectAreaLTC2=xe.LTC_FLOAT_2):(i.rectAreaLTC1=xe.LTC_HALF_1,i.rectAreaLTC2=xe.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=p,i.ambient[2]=h;const P=i.hash;(P.sunLength!==m||P.directionalLength!==x||P.pointLength!==f||P.spotLength!==g||P.rectAreaLength!==w||P.hemiLength!==S||P.numSunShadows!==v||P.numDirectionalShadows!==y||P.numPointShadows!==M||P.numSpotShadows!==A||P.numSpotMaps!==_||P.numLightProbes!==R)&&(i.sun.length=m,i.directional.length=x,i.spot.length=g,i.rectArea.length=w,i.point.length=f,i.hemi.length=S,i.sunShadow.length=v,i.sunShadowMap.length=v,i.sunShadowMatrix.length=b,i.sunShadowCascade.length=b,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.directionalShadowMatrix.length=y,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=A,i.spotShadowMap.length=A,i.spotLightMatrix.length=A+_-T,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,P.sunLength=m,P.directionalLength=x,P.pointLength=f,P.spotLength=g,P.rectAreaLength=w,P.hemiLength=S,P.numSunShadows=v,P.numDirectionalShadows=y,P.numPointShadows=M,P.numSpotShadows=A,P.numSpotMaps=_,P.numLightProbes=R,i.version=GT++)}function c(u,d){let p=0,h=0,m=0,v=0,b=0,x=0;const f=d.matrixWorldInverse;for(let g=0,w=u.length;g<w;g++){const S=u[g];if(S.isSunLight){const y=i.sun[p];y.direction.setFromMatrixPosition(S.matrixWorld),y.direction.transformDirection(f),p++}else if(S.isDirectionalLight){const y=i.directional[h];y.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(f),h++}else if(S.isSpotLight){const y=i.spot[v];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(f),y.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(f),v++}else if(S.isRectAreaLight){const y=i.rectArea[b];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(f),o.identity(),s.copy(S.matrixWorld),s.premultiply(f),o.extractRotation(s),y.halfWidth.set(S.width*.5,0,0),y.halfHeight.set(0,S.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),b++}else if(S.isPointLight){const y=i.point[m];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(f),m++}else if(S.isHemisphereLight){const y=i.hemi[x];y.direction.setFromMatrixPosition(S.matrixWorld),y.direction.transformDirection(f),x++}}}return{setup:l,setupView:c,state:i}}function cg(t){const e=new WT(t),n=[],i=[],r=[];function s(h){p.camera=h,n.length=0,i.length=0,r.length=0}function o(h){n.push(h)}function l(h){i.push(h)}function c(h){r.push(h)}function u(){e.setup(n)}function d(h){e.setupView(n,h)}const p={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:p,setupLights:u,setupLightsView:d,pushLight:o,pushShadow:l,pushLightProbeGrid:c}}function XT(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let l;return o===void 0?(l=new cg(t),e.set(r,[l])):s>=o.length?(l=new cg(t),o.push(l)):l=o[s],l}function i(){e=new WeakMap}return{get:n,dispose:i}}const $T=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qT=`uniform sampler2D shadow_pass;
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
}`,YT=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],KT=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],ug=new bt,Ma=new G,Zu=new G;function ZT(t,e,n){let i=new cp;const r=new Ze,s=new Ze,o=new Et,l=new s2,c=new a2,u={},d=n.maxTextureSize,p={[Zr]:En,[En]:Zr,[fi]:fi},h=new yi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ze},radius:{value:4}},vertexShader:$T,fragmentShader:qT}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const v=new Ln;v.setAttribute("position",new Ii(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new Nn(v,h),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nl;let f=this.type;this.render=function(M,A,_){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||M.length===0)return;this.type===Gb&&(Oe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Nl);const T=t.getRenderTarget(),R=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),D=t.state;D.setBlending(Fi),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const I=f!==this.type;I&&A.traverse(function(F){F.material&&(Array.isArray(F.material)?F.material.forEach(B=>B.needsUpdate=!0):F.material.needsUpdate=!0)});for(let F=0,B=M.length;F<B;F++){const Z=M[F],X=Z.shadow;if(X===void 0){Oe("WebGLShadowMap:",Z,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);const j=X.getFrameExtents();r.multiply(j),s.copy(X.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/j.x),r.x=s.x*j.x,X.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/j.y),r.y=s.y*j.y,X.mapSize.y=s.y));const z=t.state.buffers.depth.getReversed();if(X.camera._reversedDepth=z,X.map===null||I===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===Na){if(Z.isPointLight){Oe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new ni(r.x,r.y,{format:Qr,type:_i,minFilter:sn,magFilter:sn,generateMipmaps:!1}),X.map.texture.name=Z.name+".shadowMap",X.map.depthTexture=new go(r.x,r.y,hi),X.map.depthTexture.name=Z.name+".shadowMapDepth",X.map.depthTexture.format=zi,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=$t,X.map.depthTexture.magFilter=$t}else Z.isPointLight?(X.map=new L_(r.x),X.map.depthTexture=new JM(r.x,vi)):(X.map=new ni(r.x,r.y),X.map.depthTexture=new go(r.x,r.y,vi)),X.map.depthTexture.name=Z.name+".shadowMap",X.map.depthTexture.format=zi,this.type===Nl?(X.map.depthTexture.compareFunction=z?sp:rp,X.map.depthTexture.minFilter=sn,X.map.depthTexture.magFilter=sn):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=$t,X.map.depthTexture.magFilter=$t);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==r.x||X.map.height!==r.y)&&X.map.setSize(r.x,r.y);const $=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();Z.isPointLight!==!0&&X.updateMatrices(Z,_);for(let Q=0;Q<$;Q++){const ce=X.getCamera(Q);if(Z.isPointLight){const Me=X.camera,Ye=X.matrix,He=Z.distance||Me.far;He!==Me.far&&(Me.far=He,Me.updateProjectionMatrix()),Ma.setFromMatrixPosition(Z.matrixWorld),Me.position.copy(Ma),Zu.copy(Me.position),Zu.add(YT[Q]),Me.up.copy(KT[Q]),Me.lookAt(Zu),Me.updateMatrixWorld(),Ye.makeTranslation(-Ma.x,-Ma.y,-Ma.z),ug.multiplyMatrices(Me.projectionMatrix,Me.matrixWorldInverse),X._frustum.setFromProjectionMatrix(ug,Me.coordinateSystem,Me.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)t.setRenderTarget(X.map,Q),t.clear();else{Q===0&&(t.setRenderTarget(X.map),t.clear());const Me=X.getViewport(Q);o.set(s.x*Me.x,s.y*Me.y,s.x*Me.z,s.y*Me.w),D.viewport(o)}i=X.getFrustum(Q),S(A,_,ce,Z,this.type)}X.isPointLightShadow!==!0&&this.type===Na&&g(X,_),X.needsUpdate=!1}f=this.type,x.needsUpdate=!1,t.setRenderTarget(T,R,P)};function g(M,A){const _=e.update(b);h.defines.VSM_SAMPLES!==M.blurSamples&&(h.defines.VSM_SAMPLES=M.blurSamples,m.defines.VSM_SAMPLES=M.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),M.mapPass===null?M.mapPass=new ni(r.x,r.y,{format:Qr,type:_i}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),h.uniforms.shadow_pass.value=M.map.depthTexture,h.uniforms.resolution.value.set(M.map.width,M.map.height),h.uniforms.radius.value=M.radius,t.setRenderTarget(M.mapPass),t.clear(),t.renderBufferDirect(A,null,_,h,b,null),m.uniforms.shadow_pass.value=M.mapPass.texture,m.uniforms.resolution.value.set(M.map.width,M.map.height),m.uniforms.radius.value=M.radius,t.setRenderTarget(M.map),t.clear(),t.renderBufferDirect(A,null,_,m,b,null)}function w(M,A,_,T){let R=null;const P=_.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(P!==void 0)R=P;else if(R=_.isPointLight===!0?c:l,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const D=R.uuid,I=A.uuid;let F=u[D];F===void 0&&(F={},u[D]=F);let B=F[I];B===void 0&&(B=R.clone(),F[I]=B,A.addEventListener("dispose",y)),R=B}if(R.visible=A.visible,R.wireframe=A.wireframe,T===Na?R.side=A.shadowSide!==null?A.shadowSide:A.side:R.side=A.shadowSide!==null?A.shadowSide:p[A.side],R.alphaMap=A.alphaMap,R.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,R.map=A.map,R.clipShadows=A.clipShadows,R.clippingPlanes=A.clippingPlanes,R.clipIntersection=A.clipIntersection,R.displacementMap=A.displacementMap,R.displacementScale=A.displacementScale,R.displacementBias=A.displacementBias,R.wireframeLinewidth=A.wireframeLinewidth,R.linewidth=A.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const D=t.properties.get(R);D.light=_}return R}function S(M,A,_,T,R){if(M.visible===!1)return;if(M.layers.test(A.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&R===Na)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,M.matrixWorld);const I=e.update(M),F=M.material;if(Array.isArray(F)){const B=I.groups;for(let Z=0,X=B.length;Z<X;Z++){const j=B[Z],z=F[j.materialIndex];if(z&&z.visible){const $=w(M,z,T,R);M.onBeforeShadow(t,M,A,_,I,$,j),t.renderBufferDirect(_,null,I,$,M,j),M.onAfterShadow(t,M,A,_,I,$,j)}}}else if(F.visible){const B=w(M,F,T,R);M.onBeforeShadow(t,M,A,_,I,B,null),t.renderBufferDirect(_,null,I,B,M,null),M.onAfterShadow(t,M,A,_,I,B,null)}}const D=M.children;for(let I=0,F=D.length;I<F;I++)S(D[I],A,_,T,R)}function y(M){M.target.removeEventListener("dispose",y);for(const _ in u){const T=u[_],R=M.target.uuid;R in T&&(T[R].dispose(),delete T[R])}}}function JT(t,e){function n(){let k=!1;const he=new Et;let ne=null;const pe=new Et(0,0,0,0);return{setMask:function(_e){ne!==_e&&!k&&(t.colorMask(_e,_e,_e,_e),ne=_e)},setLocked:function(_e){k=_e},setClear:function(_e,se,Ie,Te,ft){ft===!0&&(_e*=Te,se*=Te,Ie*=Te),he.set(_e,se,Ie,Te),pe.equals(he)===!1&&(t.clearColor(_e,se,Ie,Te),pe.copy(he))},reset:function(){k=!1,ne=null,pe.set(-1,0,0,0)}}}function i(){let k=!1,he=!1,ne=null,pe=null,_e=null;return{setReversed:function(se){if(he!==se){const Ie=e.get("EXT_clip_control");se?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),he=se;const Te=_e;_e=null,this.setClear(Te)}},getReversed:function(){return he},setTest:function(se){se?ie(t.DEPTH_TEST):Ee(t.DEPTH_TEST)},setMask:function(se){ne!==se&&!k&&(t.depthMask(se),ne=se)},setFunc:function(se){if(he&&(se=MM[se]),pe!==se){switch(se){case ef:t.depthFunc(t.NEVER);break;case tf:t.depthFunc(t.ALWAYS);break;case nf:t.depthFunc(t.LESS);break;case ho:t.depthFunc(t.LEQUAL);break;case rf:t.depthFunc(t.EQUAL);break;case sf:t.depthFunc(t.GEQUAL);break;case af:t.depthFunc(t.GREATER);break;case of:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}pe=se}},setLocked:function(se){k=se},setClear:function(se){_e!==se&&(_e=se,he&&(se=1-se),t.clearDepth(se))},reset:function(){k=!1,ne=null,pe=null,_e=null,he=!1}}}function r(){let k=!1,he=null,ne=null,pe=null,_e=null,se=null,Ie=null,Te=null,ft=null;return{setTest:function(st){k||(st?ie(t.STENCIL_TEST):Ee(t.STENCIL_TEST))},setMask:function(st){he!==st&&!k&&(t.stencilMask(st),he=st)},setFunc:function(st,Hn,ri){(ne!==st||pe!==Hn||_e!==ri)&&(t.stencilFunc(st,Hn,ri),ne=st,pe=Hn,_e=ri)},setOp:function(st,Hn,ri){(se!==st||Ie!==Hn||Te!==ri)&&(t.stencilOp(st,Hn,ri),se=st,Ie=Hn,Te=ri)},setLocked:function(st){k=st},setClear:function(st){ft!==st&&(t.clearStencil(st),ft=st)},reset:function(){k=!1,he=null,ne=null,pe=null,_e=null,se=null,Ie=null,Te=null,ft=null}}}const s=new n,o=new i,l=new r,c=new WeakMap,u=new WeakMap;let d={},p={},h={},m=new WeakMap,v=[],b=null,x=!1,f=null,g=null,w=null,S=null,y=null,M=null,A=null,_=new qe(0,0,0),T=0,R=!1,P=null,D=null,I=null,F=null,B=null;const Z=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,j=0;const z=t.getParameter(t.VERSION);z.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(z)[1]),X=j>=1):z.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),X=j>=2);let $=null,Q={};const ce=t.getParameter(t.SCISSOR_BOX),Me=t.getParameter(t.VIEWPORT),Ye=new Et().fromArray(ce),He=new Et().fromArray(Me);function Ve(k,he,ne,pe){const _e=new Uint8Array(4),se=t.createTexture();t.bindTexture(k,se),t.texParameteri(k,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(k,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ie=0;Ie<ne;Ie++)k===t.TEXTURE_3D||k===t.TEXTURE_2D_ARRAY?t.texImage3D(he,0,t.RGBA,1,1,pe,0,t.RGBA,t.UNSIGNED_BYTE,_e):t.texImage2D(he+Ie,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,_e);return se}const J={};J[t.TEXTURE_2D]=Ve(t.TEXTURE_2D,t.TEXTURE_2D,1),J[t.TEXTURE_CUBE_MAP]=Ve(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[t.TEXTURE_2D_ARRAY]=Ve(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),J[t.TEXTURE_3D]=Ve(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),l.setClear(0),ie(t.DEPTH_TEST),o.setFunc(ho),Ue(!1),it(ux),ie(t.CULL_FACE),je(Fi);function ie(k){d[k]!==!0&&(t.enable(k),d[k]=!0)}function Ee(k){d[k]!==!1&&(t.disable(k),d[k]=!1)}function Be(k,he){return h[k]!==he?(t.bindFramebuffer(k,he),h[k]=he,k===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=he),k===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=he),!0):!1}function q(k,he){let ne=v,pe=!1;if(k){ne=m.get(he),ne===void 0&&(ne=[],m.set(he,ne));const _e=k.textures;if(ne.length!==_e.length||ne[0]!==t.COLOR_ATTACHMENT0){for(let se=0,Ie=_e.length;se<Ie;se++)ne[se]=t.COLOR_ATTACHMENT0+se;ne.length=_e.length,pe=!0}}else ne[0]!==t.BACK&&(ne[0]=t.BACK,pe=!0);pe&&t.drawBuffers(ne)}function le(k){return b!==k?(t.useProgram(k),b=k,!0):!1}const we={[ys]:t.FUNC_ADD,[Wb]:t.FUNC_SUBTRACT,[Xb]:t.FUNC_REVERSE_SUBTRACT};we[$b]=t.MIN,we[qb]=t.MAX;const Fe={[Yb]:t.ZERO,[Kb]:t.ONE,[Zb]:t.SRC_COLOR,[n_]:t.SRC_ALPHA,[iM]:t.SRC_ALPHA_SATURATE,[tM]:t.DST_COLOR,[Qb]:t.DST_ALPHA,[Jb]:t.ONE_MINUS_SRC_COLOR,[i_]:t.ONE_MINUS_SRC_ALPHA,[nM]:t.ONE_MINUS_DST_COLOR,[eM]:t.ONE_MINUS_DST_ALPHA,[rM]:t.CONSTANT_COLOR,[sM]:t.ONE_MINUS_CONSTANT_COLOR,[aM]:t.CONSTANT_ALPHA,[oM]:t.ONE_MINUS_CONSTANT_ALPHA};function je(k,he,ne,pe,_e,se,Ie,Te,ft,st){if(k===Fi){x===!0&&(Ee(t.BLEND),x=!1);return}if(x===!1&&(ie(t.BLEND),x=!0),k!==Hb){if(k!==f||st!==R){if((g!==ys||y!==ys)&&(t.blendEquation(t.FUNC_ADD),g=ys,y=ys),st)switch(k){case za:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case dx:t.blendFunc(t.ONE,t.ONE);break;case fx:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case hx:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:rt("WebGLState: Invalid blending: ",k);break}else switch(k){case za:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case dx:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case fx:rt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case hx:rt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:rt("WebGLState: Invalid blending: ",k);break}w=null,S=null,M=null,A=null,_.set(0,0,0),T=0,f=k,R=st}return}_e=_e||he,se=se||ne,Ie=Ie||pe,(he!==g||_e!==y)&&(t.blendEquationSeparate(we[he],we[_e]),g=he,y=_e),(ne!==w||pe!==S||se!==M||Ie!==A)&&(t.blendFuncSeparate(Fe[ne],Fe[pe],Fe[se],Fe[Ie]),w=ne,S=pe,M=se,A=Ie),(Te.equals(_)===!1||ft!==T)&&(t.blendColor(Te.r,Te.g,Te.b,ft),_.copy(Te),T=ft),f=k,R=!1}function Le(k,he){k.side===fi?Ee(t.CULL_FACE):ie(t.CULL_FACE);let ne=k.side===En;he&&(ne=!ne),Ue(ne),k.blending===za&&k.transparent===!1?je(Fi):je(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),o.setFunc(k.depthFunc),o.setTest(k.depthTest),o.setMask(k.depthWrite),s.setMask(k.colorWrite);const pe=k.stencilWrite;l.setTest(pe),pe&&(l.setMask(k.stencilWriteMask),l.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),l.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),pn(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?ie(t.SAMPLE_ALPHA_TO_COVERAGE):Ee(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(k){P!==k&&(k?t.frontFace(t.CW):t.frontFace(t.CCW),P=k)}function it(k){k!==zb?(ie(t.CULL_FACE),k!==D&&(k===ux?t.cullFace(t.BACK):k===Vb?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ee(t.CULL_FACE),D=k}function Nt(k){k!==I&&(X&&t.lineWidth(k),I=k)}function pn(k,he,ne){k?(ie(t.POLYGON_OFFSET_FILL),(F!==he||B!==ne)&&(F=he,B=ne,o.getReversed()&&(he=-he),t.polygonOffset(he,ne))):Ee(t.POLYGON_OFFSET_FILL)}function _t(k){k?ie(t.SCISSOR_TEST):Ee(t.SCISSOR_TEST)}function Rt(k){k===void 0&&(k=t.TEXTURE0+Z-1),$!==k&&(t.activeTexture(k),$=k)}function O(k,he,ne){ne===void 0&&($===null?ne=t.TEXTURE0+Z-1:ne=$);let pe=Q[ne];pe===void 0&&(pe={type:void 0,texture:void 0},Q[ne]=pe),(pe.type!==k||pe.texture!==he)&&($!==ne&&(t.activeTexture(ne),$=ne),t.bindTexture(k,he||J[k]),pe.type=k,pe.texture=he)}function Zt(){const k=Q[$];k!==void 0&&k.type!==void 0&&(t.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function ot(){try{t.compressedTexImage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function N(){try{t.compressedTexImage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function E(){try{t.texSubImage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function V(){try{t.texSubImage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function Y(){try{t.compressedTexSubImage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function ee(){try{t.compressedTexSubImage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function oe(){try{t.texStorage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function ue(){try{t.texStorage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function te(){try{t.texImage2D(...arguments)}catch(k){rt("WebGLState:",k)}}function re(){try{t.texImage3D(...arguments)}catch(k){rt("WebGLState:",k)}}function de(k){return p[k]!==void 0?p[k]:t.getParameter(k)}function De(k,he){p[k]!==he&&(t.pixelStorei(k,he),p[k]=he)}function me(k){Ye.equals(k)===!1&&(t.scissor(k.x,k.y,k.z,k.w),Ye.copy(k))}function fe(k){He.equals(k)===!1&&(t.viewport(k.x,k.y,k.z,k.w),He.copy(k))}function Pe(k,he){let ne=u.get(he);ne===void 0&&(ne=new WeakMap,u.set(he,ne));let pe=ne.get(k);pe===void 0&&(pe=t.getUniformBlockIndex(he,k.name),ne.set(k,pe))}function ke(k,he){const pe=u.get(he).get(k);c.get(he)!==pe&&(t.uniformBlockBinding(he,pe,k.__bindingPointIndex),c.set(he,pe))}function Ge(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),d={},p={},$=null,Q={},h={},m=new WeakMap,v=[],b=null,x=!1,f=null,g=null,w=null,S=null,y=null,M=null,A=null,_=new qe(0,0,0),T=0,R=!1,P=null,D=null,I=null,F=null,B=null,Ye.set(0,0,t.canvas.width,t.canvas.height),He.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),l.reset()}return{buffers:{color:s,depth:o,stencil:l},enable:ie,disable:Ee,bindFramebuffer:Be,drawBuffers:q,useProgram:le,setBlending:je,setMaterial:Le,setFlipSided:Ue,setCullFace:it,setLineWidth:Nt,setPolygonOffset:pn,setScissorTest:_t,activeTexture:Rt,bindTexture:O,unbindTexture:Zt,compressedTexImage2D:ot,compressedTexImage3D:N,texImage2D:te,texImage3D:re,pixelStorei:De,getParameter:de,updateUBOMapping:Pe,uniformBlockBinding:ke,texStorage2D:oe,texStorage3D:ue,texSubImage2D:E,texSubImage3D:V,compressedTexSubImage2D:Y,compressedTexSubImage3D:ee,scissor:me,viewport:fe,reset:Ge}}function QT(t,e,n,i,r,s,o){const l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new Ze,d=new WeakMap,p=new Set;let h;const m=new WeakMap;let v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(N,E){return v?new OffscreenCanvas(N,E):fc("canvas")}function x(N,E,V){let Y=1;const ee=ot(N);if((ee.width>V||ee.height>V)&&(Y=V/Math.max(ee.width,ee.height)),Y<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const oe=Math.floor(Y*ee.width),ue=Math.floor(Y*ee.height);h===void 0&&(h=b(oe,ue));const te=E?b(oe,ue):h;return te.width=oe,te.height=ue,te.getContext("2d").drawImage(N,0,0,oe,ue),Oe("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+oe+"x"+ue+")."),te}else return"data"in N&&Oe("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),N;return N}function f(N){return N.generateMipmaps}function g(N){t.generateMipmap(N)}function w(N){return N.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?t.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function S(N,E,V,Y,ee,oe=!1){if(N!==null){if(t[N]!==void 0)return t[N];Oe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let ue;Y&&(ue=e.get("EXT_texture_norm16"),ue||Oe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let te=E;if(E===t.RED&&(V===t.FLOAT&&(te=t.R32F),V===t.HALF_FLOAT&&(te=t.R16F),V===t.UNSIGNED_BYTE&&(te=t.R8),V===t.UNSIGNED_SHORT&&ue&&(te=ue.R16_EXT),V===t.SHORT&&ue&&(te=ue.R16_SNORM_EXT)),E===t.RED_INTEGER&&(V===t.UNSIGNED_BYTE&&(te=t.R8UI),V===t.UNSIGNED_SHORT&&(te=t.R16UI),V===t.UNSIGNED_INT&&(te=t.R32UI),V===t.BYTE&&(te=t.R8I),V===t.SHORT&&(te=t.R16I),V===t.INT&&(te=t.R32I)),E===t.RG&&(V===t.FLOAT&&(te=t.RG32F),V===t.HALF_FLOAT&&(te=t.RG16F),V===t.UNSIGNED_BYTE&&(te=t.RG8),V===t.UNSIGNED_SHORT&&ue&&(te=ue.RG16_EXT),V===t.SHORT&&ue&&(te=ue.RG16_SNORM_EXT)),E===t.RG_INTEGER&&(V===t.UNSIGNED_BYTE&&(te=t.RG8UI),V===t.UNSIGNED_SHORT&&(te=t.RG16UI),V===t.UNSIGNED_INT&&(te=t.RG32UI),V===t.BYTE&&(te=t.RG8I),V===t.SHORT&&(te=t.RG16I),V===t.INT&&(te=t.RG32I)),E===t.RGB_INTEGER&&(V===t.UNSIGNED_BYTE&&(te=t.RGB8UI),V===t.UNSIGNED_SHORT&&(te=t.RGB16UI),V===t.UNSIGNED_INT&&(te=t.RGB32UI),V===t.BYTE&&(te=t.RGB8I),V===t.SHORT&&(te=t.RGB16I),V===t.INT&&(te=t.RGB32I)),E===t.RGBA_INTEGER&&(V===t.UNSIGNED_BYTE&&(te=t.RGBA8UI),V===t.UNSIGNED_SHORT&&(te=t.RGBA16UI),V===t.UNSIGNED_INT&&(te=t.RGBA32UI),V===t.BYTE&&(te=t.RGBA8I),V===t.SHORT&&(te=t.RGBA16I),V===t.INT&&(te=t.RGBA32I)),E===t.RGB&&(V===t.UNSIGNED_SHORT&&ue&&(te=ue.RGB16_EXT),V===t.SHORT&&ue&&(te=ue.RGB16_SNORM_EXT),V===t.UNSIGNED_INT_5_9_9_9_REV&&(te=t.RGB9_E5),V===t.UNSIGNED_INT_10F_11F_11F_REV&&(te=t.R11F_G11F_B10F)),E===t.RGBA){const re=oe?dc:et.getTransfer(ee);V===t.FLOAT&&(te=t.RGBA32F),V===t.HALF_FLOAT&&(te=t.RGBA16F),V===t.UNSIGNED_BYTE&&(te=re===lt?t.SRGB8_ALPHA8:t.RGBA8),V===t.UNSIGNED_SHORT&&ue&&(te=ue.RGBA16_EXT),V===t.SHORT&&ue&&(te=ue.RGBA16_SNORM_EXT),V===t.UNSIGNED_SHORT_4_4_4_4&&(te=t.RGBA4),V===t.UNSIGNED_SHORT_5_5_5_1&&(te=t.RGB5_A1)}return(te===t.R16F||te===t.R32F||te===t.RG16F||te===t.RG32F||te===t.RGBA16F||te===t.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function y(N,E){let V;return N?E===null||E===vi||E===mo?V=t.DEPTH24_STENCIL8:E===hi?V=t.DEPTH32F_STENCIL8:E===po&&(V=t.DEPTH24_STENCIL8,Oe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===vi||E===mo?V=t.DEPTH_COMPONENT24:E===hi?V=t.DEPTH_COMPONENT32F:E===po&&(V=t.DEPTH_COMPONENT16),V}function M(N,E){return f(N)===!0||N.isFramebufferTexture&&N.minFilter!==$t&&N.minFilter!==sn?Math.log2(Math.max(E.width,E.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?E.mipmaps.length:1}function A(N){const E=N.target;E.removeEventListener("dispose",A),T(E),E.isVideoTexture&&d.delete(E),E.isHTMLTexture&&p.delete(E)}function _(N){const E=N.target;E.removeEventListener("dispose",_),P(E)}function T(N){const E=i.get(N);if(E.__webglInit===void 0)return;const V=N.source,Y=m.get(V);if(Y){const ee=Y[E.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&R(N),Object.keys(Y).length===0&&m.delete(V)}i.remove(N)}function R(N){const E=i.get(N);t.deleteTexture(E.__webglTexture);const V=N.source,Y=m.get(V);delete Y[E.__cacheKey],o.memory.textures--}function P(N){const E=i.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),i.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(E.__webglFramebuffer[Y]))for(let ee=0;ee<E.__webglFramebuffer[Y].length;ee++)t.deleteFramebuffer(E.__webglFramebuffer[Y][ee]);else t.deleteFramebuffer(E.__webglFramebuffer[Y]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[Y])}else{if(Array.isArray(E.__webglFramebuffer))for(let Y=0;Y<E.__webglFramebuffer.length;Y++)t.deleteFramebuffer(E.__webglFramebuffer[Y]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let Y=0;Y<E.__webglColorRenderbuffer.length;Y++)E.__webglColorRenderbuffer[Y]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[Y]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const V=N.textures;for(let Y=0,ee=V.length;Y<ee;Y++){const oe=i.get(V[Y]);oe.__webglTexture&&(t.deleteTexture(oe.__webglTexture),o.memory.textures--),i.remove(V[Y])}i.remove(N)}let D=0;function I(){D=0}function F(){return D}function B(N){D=N}function Z(){const N=D;return N>=r.maxTextures&&Oe("WebGLTextures: Trying to use "+(N+1)+" texture units while this GPU supports only "+r.maxTextures),D+=1,N}function X(N){const E=[];return E.push(N.wrapS),E.push(N.wrapT),E.push(N.wrapR||0),E.push(N.magFilter),E.push(N.minFilter),E.push(N.anisotropy),E.push(N.internalFormat),E.push(N.format),E.push(N.type),E.push(N.generateMipmaps),E.push(N.premultiplyAlpha),E.push(N.flipY),E.push(N.unpackAlignment),E.push(N.colorSpace),E.join()}function j(N,E){const V=i.get(N);if(N.isVideoTexture&&O(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&V.__version!==N.version){const Y=N.image;if(Y===null)Oe("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Oe("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(V,N,E);return}}else N.isExternalTexture&&(V.__webglTexture=N.sourceTexture?N.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,V.__webglTexture,t.TEXTURE0+E)}function z(N,E){const V=i.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&V.__version!==N.version){Ee(V,N,E);return}else N.isExternalTexture&&(V.__webglTexture=N.sourceTexture?N.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,V.__webglTexture,t.TEXTURE0+E)}function $(N,E){const V=i.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&V.__version!==N.version){Ee(V,N,E);return}n.bindTexture(t.TEXTURE_3D,V.__webglTexture,t.TEXTURE0+E)}function Q(N,E){const V=i.get(N);if(N.isCubeDepthTexture!==!0&&N.version>0&&V.__version!==N.version){Be(V,N,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,V.__webglTexture,t.TEXTURE0+E)}const ce={[lf]:t.REPEAT,[Di]:t.CLAMP_TO_EDGE,[cf]:t.MIRRORED_REPEAT},Me={[$t]:t.NEAREST,[uM]:t.NEAREST_MIPMAP_NEAREST,[$o]:t.NEAREST_MIPMAP_LINEAR,[sn]:t.LINEAR,[yu]:t.LINEAR_MIPMAP_NEAREST,[Vr]:t.LINEAR_MIPMAP_LINEAR},Ye={[pM]:t.NEVER,[_M]:t.ALWAYS,[mM]:t.LESS,[rp]:t.LEQUAL,[xM]:t.EQUAL,[sp]:t.GEQUAL,[gM]:t.GREATER,[vM]:t.NOTEQUAL};function He(N,E){if(E.type===hi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===sn||E.magFilter===yu||E.magFilter===$o||E.magFilter===Vr||E.minFilter===sn||E.minFilter===yu||E.minFilter===$o||E.minFilter===Vr)&&Oe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(N,t.TEXTURE_WRAP_S,ce[E.wrapS]),t.texParameteri(N,t.TEXTURE_WRAP_T,ce[E.wrapT]),(N===t.TEXTURE_3D||N===t.TEXTURE_2D_ARRAY)&&t.texParameteri(N,t.TEXTURE_WRAP_R,ce[E.wrapR]),t.texParameteri(N,t.TEXTURE_MAG_FILTER,Me[E.magFilter]),t.texParameteri(N,t.TEXTURE_MIN_FILTER,Me[E.minFilter]),E.compareFunction&&(t.texParameteri(N,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(N,t.TEXTURE_COMPARE_FUNC,Ye[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===$t||E.minFilter!==$o&&E.minFilter!==Vr||E.type===hi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");t.texParameterf(N,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function Ve(N,E){let V=!1;N.__webglInit===void 0&&(N.__webglInit=!0,E.addEventListener("dispose",A));const Y=E.source;let ee=m.get(Y);ee===void 0&&(ee={},m.set(Y,ee));const oe=X(E);if(oe!==N.__cacheKey){ee[oe]===void 0&&(ee[oe]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,V=!0),ee[oe].usedTimes++;const ue=ee[N.__cacheKey];ue!==void 0&&(ee[N.__cacheKey].usedTimes--,ue.usedTimes===0&&R(E)),N.__cacheKey=oe,N.__webglTexture=ee[oe].texture}return V}function J(N,E,V){return Math.floor(Math.floor(N/V)/E)}function ie(N,E,V,Y){const oe=N.updateRanges;if(oe.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,E.width,E.height,V,Y,E.data);else{oe.sort((De,me)=>De.start-me.start);let ue=0;for(let De=1;De<oe.length;De++){const me=oe[ue],fe=oe[De],Pe=me.start+me.count,ke=J(fe.start,E.width,4),Ge=J(me.start,E.width,4);fe.start<=Pe+1&&ke===Ge&&J(fe.start+fe.count-1,E.width,4)===ke?me.count=Math.max(me.count,fe.start+fe.count-me.start):(++ue,oe[ue]=fe)}oe.length=ue+1;const te=n.getParameter(t.UNPACK_ROW_LENGTH),re=n.getParameter(t.UNPACK_SKIP_PIXELS),de=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,E.width);for(let De=0,me=oe.length;De<me;De++){const fe=oe[De],Pe=Math.floor(fe.start/4),ke=Math.ceil(fe.count/4),Ge=Pe%E.width,k=Math.floor(Pe/E.width),he=ke,ne=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(t.UNPACK_SKIP_ROWS,k),n.texSubImage2D(t.TEXTURE_2D,0,Ge,k,he,ne,V,Y,E.data)}N.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,te),n.pixelStorei(t.UNPACK_SKIP_PIXELS,re),n.pixelStorei(t.UNPACK_SKIP_ROWS,de)}}function Ee(N,E,V){let Y=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(Y=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(Y=t.TEXTURE_3D);const ee=Ve(N,E),oe=E.source;n.bindTexture(Y,N.__webglTexture,t.TEXTURE0+V);const ue=i.get(oe);if(oe.version!==ue.__version||ee===!0){if(n.activeTexture(t.TEXTURE0+V),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){const ne=et.getPrimaries(et.workingColorSpace),pe=E.colorSpace===lr?null:et.getPrimaries(E.colorSpace),_e=E.colorSpace===lr||ne===pe?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e)}n.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment);let re=x(E.image,!1,r.maxTextureSize);re=Zt(E,re);const de=s.convert(E.format,E.colorSpace),De=s.convert(E.type);let me=S(E.internalFormat,de,De,E.normalized,E.colorSpace,E.isVideoTexture);He(Y,E);let fe;const Pe=E.mipmaps,ke=E.isVideoTexture!==!0,Ge=ue.__version===void 0||ee===!0,k=oe.dataReady,he=M(E,re);if(E.isDepthTexture)me=y(E.format===Gr,E.type),Ge&&(ke?n.texStorage2D(t.TEXTURE_2D,1,me,re.width,re.height):n.texImage2D(t.TEXTURE_2D,0,me,re.width,re.height,0,de,De,null));else if(E.isDataTexture)if(Pe.length>0){ke&&Ge&&n.texStorage2D(t.TEXTURE_2D,he,me,Pe[0].width,Pe[0].height);for(let ne=0,pe=Pe.length;ne<pe;ne++)fe=Pe[ne],ke?k&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,fe.width,fe.height,de,De,fe.data):n.texImage2D(t.TEXTURE_2D,ne,me,fe.width,fe.height,0,de,De,fe.data);E.generateMipmaps=!1}else ke?(Ge&&n.texStorage2D(t.TEXTURE_2D,he,me,re.width,re.height),k&&ie(E,re,de,De)):n.texImage2D(t.TEXTURE_2D,0,me,re.width,re.height,0,de,De,re.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){ke&&Ge&&n.texStorage3D(t.TEXTURE_2D_ARRAY,he,me,Pe[0].width,Pe[0].height,re.depth);for(let ne=0,pe=Pe.length;ne<pe;ne++)if(fe=Pe[ne],E.format!==Qn)if(de!==null)if(ke){if(k)if(E.layerUpdates.size>0){const _e=Vx(fe.width,fe.height,E.format,E.type);for(const se of E.layerUpdates){const Ie=fe.data.subarray(se*_e/fe.data.BYTES_PER_ELEMENT,(se+1)*_e/fe.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,se,fe.width,fe.height,1,de,Ie)}}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,0,fe.width,fe.height,re.depth,de,fe.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ne,me,fe.width,fe.height,re.depth,0,fe.data,0,0);else Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?k&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,0,fe.width,fe.height,re.depth,de,De,fe.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ne,me,fe.width,fe.height,re.depth,0,de,De,fe.data);E.layerUpdates.size>0&&E.clearLayerUpdates()}else{ke&&Ge&&n.texStorage2D(t.TEXTURE_2D,he,me,Pe[0].width,Pe[0].height);for(let ne=0,pe=Pe.length;ne<pe;ne++)fe=Pe[ne],E.format!==Qn?de!==null?ke?k&&n.compressedTexSubImage2D(t.TEXTURE_2D,ne,0,0,fe.width,fe.height,de,fe.data):n.compressedTexImage2D(t.TEXTURE_2D,ne,me,fe.width,fe.height,0,fe.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?k&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,fe.width,fe.height,de,De,fe.data):n.texImage2D(t.TEXTURE_2D,ne,me,fe.width,fe.height,0,de,De,fe.data)}else if(E.isDataArrayTexture)if(ke){if(Ge&&n.texStorage3D(t.TEXTURE_2D_ARRAY,he,me,re.width,re.height,re.depth),k)if(E.layerUpdates.size>0){const ne=Vx(re.width,re.height,E.format,E.type);for(const pe of E.layerUpdates){const _e=re.data.subarray(pe*ne/re.data.BYTES_PER_ELEMENT,(pe+1)*ne/re.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,pe,re.width,re.height,1,de,De,_e)}E.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,de,De,re.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,me,re.width,re.height,re.depth,0,de,De,re.data);else if(E.isData3DTexture)ke?(Ge&&n.texStorage3D(t.TEXTURE_3D,he,me,re.width,re.height,re.depth),k&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,de,De,re.data)):n.texImage3D(t.TEXTURE_3D,0,me,re.width,re.height,re.depth,0,de,De,re.data);else if(E.isFramebufferTexture){if(Ge)if(ke)n.texStorage2D(t.TEXTURE_2D,he,me,re.width,re.height);else{let ne=re.width,pe=re.height;for(let _e=0;_e<he;_e++)n.texImage2D(t.TEXTURE_2D,_e,me,ne,pe,0,de,De,null),ne>>=1,pe>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in t){const ne=t.canvas;if(ne.hasAttribute("layoutsubtree")||ne.setAttribute("layoutsubtree","true"),re.parentNode!==ne){ne.appendChild(re),p.add(E),ne.onpaint=pe=>{const _e=pe.changedElements;for(const se of p)_e.includes(se.image)&&(se.needsUpdate=!0)},ne.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,re);else{const _e=t.RGBA,se=t.RGBA,Ie=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,_e,se,Ie,re)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(Pe.length>0){if(ke&&Ge){const ne=ot(Pe[0]);n.texStorage2D(t.TEXTURE_2D,he,me,ne.width,ne.height)}for(let ne=0,pe=Pe.length;ne<pe;ne++)fe=Pe[ne],ke?k&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,de,De,fe):n.texImage2D(t.TEXTURE_2D,ne,me,de,De,fe);E.generateMipmaps=!1}else if(ke){if(Ge){const ne=ot(re);n.texStorage2D(t.TEXTURE_2D,he,me,ne.width,ne.height)}k&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,de,De,re)}else n.texImage2D(t.TEXTURE_2D,0,me,de,De,re);f(E)&&g(Y),ue.__version=oe.version,E.onUpdate&&E.onUpdate(E)}N.__version=E.version}function Be(N,E,V){if(E.image.length!==6)return;const Y=Ve(N,E),ee=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,N.__webglTexture,t.TEXTURE0+V);const oe=i.get(ee);if(ee.version!==oe.__version||Y===!0){n.activeTexture(t.TEXTURE0+V);const ue=et.getPrimaries(et.workingColorSpace),te=E.colorSpace===lr?null:et.getPrimaries(E.colorSpace),re=E.colorSpace===lr||ue===te?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,re);const de=E.isCompressedTexture||E.image[0].isCompressedTexture,De=E.image[0]&&E.image[0].isDataTexture,me=[];for(let se=0;se<6;se++)!de&&!De?me[se]=x(E.image[se],!0,r.maxCubemapSize):me[se]=De?E.image[se].image:E.image[se],me[se]=Zt(E,me[se]);const fe=me[0],Pe=s.convert(E.format,E.colorSpace),ke=s.convert(E.type),Ge=S(E.internalFormat,Pe,ke,E.normalized,E.colorSpace),k=E.isVideoTexture!==!0,he=oe.__version===void 0||Y===!0,ne=ee.dataReady;let pe=M(E,fe);He(t.TEXTURE_CUBE_MAP,E);let _e;if(de){k&&he&&n.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Ge,fe.width,fe.height);for(let se=0;se<6;se++){_e=me[se].mipmaps;for(let Ie=0;Ie<_e.length;Ie++){const Te=_e[Ie];E.format!==Qn?Pe!==null?k?ne&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,0,0,Te.width,Te.height,Pe,Te.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,Ge,Te.width,Te.height,0,Te.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,0,0,Te.width,Te.height,Pe,ke,Te.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie,Ge,Te.width,Te.height,0,Pe,ke,Te.data)}}}else{if(_e=E.mipmaps,k&&he){_e.length>0&&pe++;const se=ot(me[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Ge,se.width,se.height)}for(let se=0;se<6;se++)if(De){k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,me[se].width,me[se].height,Pe,ke,me[se].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ge,me[se].width,me[se].height,0,Pe,ke,me[se].data);for(let Ie=0;Ie<_e.length;Ie++){const ft=_e[Ie].image[se].image;k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,0,0,ft.width,ft.height,Pe,ke,ft.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,Ge,ft.width,ft.height,0,Pe,ke,ft.data)}}else{k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Pe,ke,me[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ge,Pe,ke,me[se]);for(let Ie=0;Ie<_e.length;Ie++){const Te=_e[Ie];k?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,0,0,Pe,ke,Te.image[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ie+1,Ge,Pe,ke,Te.image[se])}}}f(E)&&g(t.TEXTURE_CUBE_MAP),oe.__version=ee.version,E.onUpdate&&E.onUpdate(E)}N.__version=E.version}function q(N,E,V,Y,ee,oe){const ue=s.convert(V.format,V.colorSpace),te=s.convert(V.type),re=S(V.internalFormat,ue,te,V.normalized,V.colorSpace),de=i.get(E),De=i.get(V);if(De.__renderTarget=E,!de.__hasExternalTextures){const me=Math.max(1,E.width>>oe),fe=Math.max(1,E.height>>oe);ee===t.TEXTURE_3D||ee===t.TEXTURE_2D_ARRAY?n.texImage3D(ee,oe,re,me,fe,E.depth,0,ue,te,null):n.texImage2D(ee,oe,re,me,fe,0,ue,te,null)}n.bindFramebuffer(t.FRAMEBUFFER,N),Rt(E)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Y,ee,De.__webglTexture,0,_t(E)):(ee===t.TEXTURE_2D||ee>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Y,ee,De.__webglTexture,oe),n.bindFramebuffer(t.FRAMEBUFFER,null)}function le(N,E,V){if(t.bindRenderbuffer(t.RENDERBUFFER,N),E.depthBuffer){const Y=E.depthTexture,ee=Y&&Y.isDepthTexture?Y.type:null,oe=y(E.stencilBuffer,ee),ue=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Rt(E)?l.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,_t(E),oe,E.width,E.height):V?t.renderbufferStorageMultisample(t.RENDERBUFFER,_t(E),oe,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,oe,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ue,t.RENDERBUFFER,N)}else{const Y=E.textures;for(let ee=0;ee<Y.length;ee++){const oe=Y[ee],ue=s.convert(oe.format,oe.colorSpace),te=s.convert(oe.type),re=S(oe.internalFormat,ue,te,oe.normalized,oe.colorSpace);Rt(E)?l.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,_t(E),re,E.width,E.height):V?t.renderbufferStorageMultisample(t.RENDERBUFFER,_t(E),re,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,re,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function we(N,E,V){const Y=E.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,N),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ee=i.get(E.depthTexture);if(ee.__renderTarget=E,(!ee.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),Y){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,E.depthTexture.addEventListener("dispose",A)),ee.__webglTexture===void 0){ee.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,ee.__webglTexture),He(t.TEXTURE_CUBE_MAP,E.depthTexture);const de=s.convert(E.depthTexture.format),De=s.convert(E.depthTexture.type);let me;E.depthTexture.format===zi?me=t.DEPTH_COMPONENT24:E.depthTexture.format===Gr&&(me=t.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,me,E.width,E.height,0,de,De,null)}}else j(E.depthTexture,0);const oe=ee.__webglTexture,ue=_t(E),te=Y?t.TEXTURE_CUBE_MAP_POSITIVE_X+V:t.TEXTURE_2D,re=E.depthTexture.format===Gr?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(E.depthTexture.format===zi)Rt(E)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,re,te,oe,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,re,te,oe,0);else if(E.depthTexture.format===Gr)Rt(E)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,re,te,oe,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,re,te,oe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Fe(N){const E=i.get(N),V=N.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==N.depthTexture){const Y=N.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),Y){const ee=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,Y.removeEventListener("dispose",ee)};Y.addEventListener("dispose",ee),E.__depthDisposeCallback=ee}E.__boundDepthTexture=Y}if(N.depthTexture&&!E.__autoAllocateDepthBuffer)if(V)for(let Y=0;Y<6;Y++)we(E.__webglFramebuffer[Y],N,Y);else{const Y=N.texture.mipmaps;Y&&Y.length>0?we(E.__webglFramebuffer[0],N,0):we(E.__webglFramebuffer,N,0)}else if(V){E.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[Y]),E.__webglDepthbuffer[Y]===void 0)E.__webglDepthbuffer[Y]=t.createRenderbuffer(),le(E.__webglDepthbuffer[Y],N,!1);else{const ee=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,oe=E.__webglDepthbuffer[Y];t.bindRenderbuffer(t.RENDERBUFFER,oe),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,oe)}}else{const Y=N.texture.mipmaps;if(Y&&Y.length>0?n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=t.createRenderbuffer(),le(E.__webglDepthbuffer,N,!1);else{const ee=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,oe=E.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,oe),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,oe)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function je(N,E,V){const Y=i.get(N);E!==void 0&&q(Y.__webglFramebuffer,N,N.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),V!==void 0&&Fe(N)}function Le(N){const E=N.texture,V=i.get(N),Y=i.get(E);N.addEventListener("dispose",_);const ee=N.textures,oe=N.isWebGLCubeRenderTarget===!0,ue=ee.length>1;if(ue||(Y.__webglTexture===void 0&&(Y.__webglTexture=t.createTexture()),Y.__version=E.version,o.memory.textures++),oe){V.__webglFramebuffer=[];for(let te=0;te<6;te++)if(E.mipmaps&&E.mipmaps.length>0){V.__webglFramebuffer[te]=[];for(let re=0;re<E.mipmaps.length;re++)V.__webglFramebuffer[te][re]=t.createFramebuffer()}else V.__webglFramebuffer[te]=t.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){V.__webglFramebuffer=[];for(let te=0;te<E.mipmaps.length;te++)V.__webglFramebuffer[te]=t.createFramebuffer()}else V.__webglFramebuffer=t.createFramebuffer();if(ue)for(let te=0,re=ee.length;te<re;te++){const de=i.get(ee[te]);de.__webglTexture===void 0&&(de.__webglTexture=t.createTexture(),o.memory.textures++)}if(N.samples>0&&Rt(N)===!1){V.__webglMultisampledFramebuffer=t.createFramebuffer(),V.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let te=0;te<ee.length;te++){const re=ee[te];V.__webglColorRenderbuffer[te]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,V.__webglColorRenderbuffer[te]);const de=s.convert(re.format,re.colorSpace),De=s.convert(re.type),me=S(re.internalFormat,de,De,re.normalized,re.colorSpace,N.isXRRenderTarget===!0),fe=_t(N);t.renderbufferStorageMultisample(t.RENDERBUFFER,fe,me,N.width,N.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+te,t.RENDERBUFFER,V.__webglColorRenderbuffer[te])}t.bindRenderbuffer(t.RENDERBUFFER,null),N.depthBuffer&&(V.__webglDepthRenderbuffer=t.createRenderbuffer(),le(V.__webglDepthRenderbuffer,N,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(oe){n.bindTexture(t.TEXTURE_CUBE_MAP,Y.__webglTexture),He(t.TEXTURE_CUBE_MAP,E);for(let te=0;te<6;te++)if(E.mipmaps&&E.mipmaps.length>0)for(let re=0;re<E.mipmaps.length;re++)q(V.__webglFramebuffer[te][re],N,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+te,re);else q(V.__webglFramebuffer[te],N,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);f(E)&&g(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ue){for(let te=0,re=ee.length;te<re;te++){const de=ee[te],De=i.get(de);let me=t.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(me=N.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(me,De.__webglTexture),He(me,de),q(V.__webglFramebuffer,N,de,t.COLOR_ATTACHMENT0+te,me,0),f(de)&&g(me)}n.unbindTexture()}else{let te=t.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(te=N.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(te,Y.__webglTexture),He(te,E),E.mipmaps&&E.mipmaps.length>0)for(let re=0;re<E.mipmaps.length;re++)q(V.__webglFramebuffer[re],N,E,t.COLOR_ATTACHMENT0,te,re);else q(V.__webglFramebuffer,N,E,t.COLOR_ATTACHMENT0,te,0);f(E)&&g(te),n.unbindTexture()}N.depthBuffer&&Fe(N)}function Ue(N){const E=N.textures;for(let V=0,Y=E.length;V<Y;V++){const ee=E[V];if(f(ee)){const oe=w(N),ue=i.get(ee).__webglTexture;n.bindTexture(oe,ue),g(oe),n.unbindTexture()}}}const it=[],Nt=[];function pn(N){if(N.samples>0){if(Rt(N)===!1){const E=N.textures,V=N.width,Y=N.height;let ee=t.COLOR_BUFFER_BIT;const oe=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=i.get(N),te=E.length>1;if(te)for(let de=0;de<E.length;de++)n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);const re=N.texture.mipmaps;re&&re.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let de=0;de<E.length;de++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(ee|=t.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(ee|=t.STENCIL_BUFFER_BIT)),te){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ue.__webglColorRenderbuffer[de]);const De=i.get(E[de]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,De,0)}t.blitFramebuffer(0,0,V,Y,0,0,V,Y,ee,t.NEAREST),c===!0&&(it.length=0,Nt.length=0,it.push(t.COLOR_ATTACHMENT0+de),N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&(it.push(oe),Nt.push(oe),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Nt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,it))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),te)for(let de=0;de<E.length;de++){n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.RENDERBUFFER,ue.__webglColorRenderbuffer[de]);const De=i.get(E[de]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.TEXTURE_2D,De,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&c){const E=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[E])}}}function _t(N){return Math.min(r.maxSamples,N.samples)}function Rt(N){const E=i.get(N);return N.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function O(N){const E=o.render.frame;d.get(N)!==E&&(d.set(N,E),N.update())}function Zt(N,E){const V=N.colorSpace,Y=N.format,ee=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||V!==uc&&V!==lr&&(et.getTransfer(V)===lt?(Y!==Qn||ee!==An)&&Oe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):rt("WebGLTextures: Unsupported texture color space:",V)),E}function ot(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(u.width=N.naturalWidth||N.width,u.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(u.width=N.displayWidth,u.height=N.displayHeight):(u.width=N.width,u.height=N.height),u}this.allocateTextureUnit=Z,this.resetTextureUnits=I,this.getTextureUnits=F,this.setTextureUnits=B,this.setTexture2D=j,this.setTexture2DArray=z,this.setTexture3D=$,this.setTextureCube=Q,this.rebindTextures=je,this.setupRenderTarget=Le,this.updateRenderTargetMipmap=Ue,this.updateMultisampleRenderTarget=pn,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=q,this.useMultisampledRTT=Rt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function e3(t,e){function n(i,r=lr){let s;const o=et.getTransfer(r);if(i===An)return t.UNSIGNED_BYTE;if(i===Qh)return t.UNSIGNED_SHORT_4_4_4_4;if(i===ep)return t.UNSIGNED_SHORT_5_5_5_1;if(i===p_)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===m_)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===f_)return t.BYTE;if(i===h_)return t.SHORT;if(i===po)return t.UNSIGNED_SHORT;if(i===Jh)return t.INT;if(i===vi)return t.UNSIGNED_INT;if(i===hi)return t.FLOAT;if(i===_i)return t.HALF_FLOAT;if(i===x_)return t.ALPHA;if(i===g_)return t.RGB;if(i===Qn)return t.RGBA;if(i===zi)return t.DEPTH_COMPONENT;if(i===Gr)return t.DEPTH_STENCIL;if(i===v_)return t.RED;if(i===tp)return t.RED_INTEGER;if(i===Qr)return t.RG;if(i===np)return t.RG_INTEGER;if(i===ip)return t.RGBA_INTEGER;if(i===Rl||i===Dl||i===Pl||i===Fl)if(o===lt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Rl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Dl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Pl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Fl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Rl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Dl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Pl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Fl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===uf||i===df||i===ff||i===hf)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===uf)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===df)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ff)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===hf)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===pf||i===mf||i===xf||i===gf||i===vf||i===lc||i===_f)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===pf||i===mf)return o===lt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===xf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===gf)return s.COMPRESSED_R11_EAC;if(i===vf)return s.COMPRESSED_SIGNED_R11_EAC;if(i===lc)return s.COMPRESSED_RG11_EAC;if(i===_f)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===yf||i===Ef||i===Sf||i===bf||i===Mf||i===wf||i===Cf||i===Af||i===Tf||i===Nf||i===Rf||i===Df||i===Pf||i===Ff)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===yf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ef)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Sf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===bf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Mf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===wf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Cf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Af)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Tf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Nf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Rf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Df)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Pf)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ff)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Lf||i===If||i===Uf)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Lf)return o===lt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===If)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Uf)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===kf||i===Of||i===cc||i===Bf)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===kf)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Of)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===cc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Bf)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===mo?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const t3=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,n3=`
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

}`;class i3{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new A_(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new yi({vertexShader:t3,fragmentShader:n3,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Nn(new kc(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class r3 extends is{constructor(e,n){super();const i=this;let r=null,s=1,o=null,l="local-floor",c=1,u=null,d=null,p=null,h=null,m=null,v=null;const b=typeof XRWebGLBinding<"u",x=new i3,f={},g=n.getContextAttributes();let w=null,S=null;const y=[],M=[],A=new Ze;let _=null,T=null;const R=new Cn;R.viewport=new Et;const P=new Cn;P.viewport=new Et;const D=[R,P],I=new f2;let F=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ie=y[J];return ie===void 0&&(ie=new Nu,y[J]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(J){let ie=y[J];return ie===void 0&&(ie=new Nu,y[J]=ie),ie.getGripSpace()},this.getHand=function(J){let ie=y[J];return ie===void 0&&(ie=new Nu,y[J]=ie),ie.getHandSpace()};function Z(J){const ie=M.indexOf(J.inputSource);if(ie===-1)return;const Ee=y[ie];Ee!==void 0&&(Ee.update(J.inputSource,J.frame,u||o),Ee.dispatchEvent({type:J.type,data:J.inputSource}))}function X(){r.removeEventListener("select",Z),r.removeEventListener("selectstart",Z),r.removeEventListener("selectend",Z),r.removeEventListener("squeeze",Z),r.removeEventListener("squeezestart",Z),r.removeEventListener("squeezeend",Z),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",j);for(let J=0;J<y.length;J++){const ie=M[J];ie!==null&&(M[J]=null,y[J].disconnect(ie))}F=null,B=null,x.reset();for(const J in f)delete f[J];if(e.setRenderTarget(w),m=null,h=null,p=null,r=null,S=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(A.width,A.height,!1),T!==null){const J=T.camera;J.fov=T.fov,J.zoom=T.zoom,J.updateProjectionMatrix(),T=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,i.isPresenting===!0&&Oe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){l=J,i.isPresenting===!0&&Oe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||o},this.setReferenceSpace=function(J){u=J},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return p===null&&b&&(p=new XRWebGLBinding(r,n)),p},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(J){if(r=J,r!==null){if(w=e.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",X),r.addEventListener("inputsourceschange",j),g.xrCompatible!==!0&&await n.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(A),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,Be=null,q=null;g.depth&&(q=g.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Ee=g.stencil?Gr:zi,Be=g.stencil?mo:vi);const le={colorFormat:n.RGBA8,depthFormat:q,scaleFactor:s};p=this.getBinding(),h=p.createProjectionLayer(le),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),S=new ni(h.textureWidth,h.textureHeight,{format:Qn,type:An,depthTexture:new go(h.textureWidth,h.textureHeight,Be,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const Ee={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,n,Ee),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),S=new ni(m.framebufferWidth,m.framebufferHeight,{format:Qn,type:An,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1,storeMultisampledDepthBuffer:m.ignoreDepthValues===!1,storeMultisampledStencilBuffer:m.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),u=null,o=await r.requestReferenceSpace(l),Ve.setContext(r),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function j(J){for(let ie=0;ie<J.removed.length;ie++){const Ee=J.removed[ie],Be=M.indexOf(Ee);Be>=0&&(M[Be]=null,y[Be].disconnect(Ee))}for(let ie=0;ie<J.added.length;ie++){const Ee=J.added[ie];let Be=M.indexOf(Ee);if(Be===-1){for(let le=0;le<y.length;le++)if(le>=M.length){M.push(Ee),Be=le;break}else if(M[le]===null){M[le]=Ee,Be=le;break}if(Be===-1)break}const q=y[Be];q&&q.connect(Ee)}}const z=new G,$=new G;function Q(J,ie,Ee){z.setFromMatrixPosition(ie.matrixWorld),$.setFromMatrixPosition(Ee.matrixWorld);const Be=z.distanceTo($),q=ie.projectionMatrix.elements,le=Ee.projectionMatrix.elements,we=q[14]/(q[10]-1),Fe=q[14]/(q[10]+1),je=(q[9]+1)/q[5],Le=(q[9]-1)/q[5],Ue=(q[8]-1)/q[0],it=(le[8]+1)/le[0],Nt=we*Ue,pn=we*it,_t=Be/(-Ue+it),Rt=_t*-Ue;if(ie.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Rt),J.translateZ(_t),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),q[10]===-1)J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const O=we+_t,Zt=Fe+_t,ot=Nt-Rt,N=pn+(Be-Rt),E=je*Fe/Zt*O,V=Le*Fe/Zt*O;J.projectionMatrix.makePerspective(ot,N,E,V,O,Zt),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ce(J,ie){ie===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ie.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(r===null)return;let ie=J.near,Ee=J.far;x.texture!==null&&(x.depthNear>0&&(ie=x.depthNear),x.depthFar>0&&(Ee=x.depthFar)),I.near=P.near=R.near=ie,I.far=P.far=R.far=Ee,(F!==I.near||B!==I.far)&&(r.updateRenderState({depthNear:I.near,depthFar:I.far}),F=I.near,B=I.far),I.layers.mask=J.layers.mask|6,R.layers.mask=I.layers.mask&-5,P.layers.mask=I.layers.mask&-3;const Be=J.parent,q=I.cameras;ce(I,Be);for(let le=0;le<q.length;le++)ce(q[le],Be);q.length===2?Q(I,R,P):I.projectionMatrix.copy(R.projectionMatrix),T===null&&J.isPerspectiveCamera&&(T={camera:J,fov:J.fov,zoom:J.zoom}),Me(J,I,Be)};function Me(J,ie,Ee){Ee===null?J.matrix.copy(ie.matrixWorld):(J.matrix.copy(Ee.matrixWorld),J.matrix.invert(),J.matrix.multiply(ie.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=zf*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(h===null&&m===null))return c},this.setFoveation=function(J){c=J,h!==null&&(h.fixedFoveation=J),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=J)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(I)},this.getCameraTexture=function(J){return f[J]};let Ye=null;function He(J,ie){if(d=ie.getViewerPose(u||o),v=ie,d!==null){const Ee=d.views;m!==null&&(e.setRenderTargetFramebuffer(S,m.framebuffer),e.setRenderTarget(S));let Be=!1;Ee.length!==I.cameras.length&&(I.cameras.length=0,Be=!0);for(let Fe=0;Fe<Ee.length;Fe++){const je=Ee[Fe];let Le=null;if(m!==null)Le=m.getViewport(je);else{const it=p.getViewSubImage(h,je);Le=it.viewport,Fe===0&&(e.setRenderTargetTextures(S,it.colorTexture,it.depthStencilTexture),e.setRenderTarget(S))}let Ue=D[Fe];Ue===void 0&&(Ue=new Cn,Ue.layers.enable(Fe),Ue.viewport=new Et,D[Fe]=Ue),Ue.matrix.fromArray(je.transform.matrix),Ue.matrix.decompose(Ue.position,Ue.quaternion,Ue.scale),Ue.projectionMatrix.fromArray(je.projectionMatrix),Ue.projectionMatrixInverse.copy(Ue.projectionMatrix).invert(),Ue.viewport.set(Le.x,Le.y,Le.width,Le.height),Fe===0&&(I.matrix.copy(Ue.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Be===!0&&I.cameras.push(Ue)}const q=r.enabledFeatures;if(q&&q.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&b){p=i.getBinding();const Fe=p.getDepthInformation(Ee[0]);Fe&&Fe.isValid&&Fe.texture&&x.init(Fe,r.renderState)}if(q&&q.includes("camera-access")&&b){e.state.unbindTexture(),p=i.getBinding();for(let Fe=0;Fe<Ee.length;Fe++){const je=Ee[Fe].camera;if(je){let Le=f[je];Le||(Le=new A_,f[je]=Le);const Ue=p.getCameraImage(je);Le.sourceTexture=Ue}}}}for(let Ee=0;Ee<y.length;Ee++){const Be=M[Ee],q=y[Ee];Be!==null&&q!==void 0&&q.update(Be,ie,u||o)}Ye&&Ye(J,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),v=null}const Ve=new P_;Ve.setAnimationLoop(He),this.setAnimationLoop=function(J){Ye=J},this.dispose=function(){}}}const s3=new bt,B_=new ze;B_.set(-1,0,0,0,1,0,0,0,1);function a3(t,e){function n(x,f){x.matrixAutoUpdate===!0&&x.updateMatrix(),f.value.copy(x.matrix)}function i(x,f){f.color.getRGB(x.fogColor.value,T_(t)),f.isFog?(x.fogNear.value=f.near,x.fogFar.value=f.far):f.isFogExp2&&(x.fogDensity.value=f.density)}function r(x,f,g,w,S){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?s(x,f):f.isMeshLambertMaterial?(s(x,f),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(s(x,f),p(x,f)):f.isMeshPhongMaterial?(s(x,f),d(x,f),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(s(x,f),h(x,f),f.isMeshPhysicalMaterial&&m(x,f,S)):f.isMeshMatcapMaterial?(s(x,f),v(x,f)):f.isMeshDepthMaterial?s(x,f):f.isMeshDistanceMaterial?(s(x,f),b(x,f)):f.isMeshNormalMaterial?s(x,f):f.isLineBasicMaterial?(o(x,f),f.isLineDashedMaterial&&l(x,f)):f.isPointsMaterial?c(x,f,g,w):f.isSpriteMaterial?u(x,f):f.isShadowMaterial?(x.color.value.copy(f.color),x.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(x,f){x.opacity.value=f.opacity,f.color&&x.diffuse.value.copy(f.color),f.emissive&&x.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(x.map.value=f.map,n(f.map,x.mapTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,n(f.alphaMap,x.alphaMapTransform)),f.bumpMap&&(x.bumpMap.value=f.bumpMap,n(f.bumpMap,x.bumpMapTransform),x.bumpScale.value=f.bumpScale,f.side===En&&(x.bumpScale.value*=-1)),f.normalMap&&(x.normalMap.value=f.normalMap,n(f.normalMap,x.normalMapTransform),x.normalScale.value.copy(f.normalScale),f.side===En&&x.normalScale.value.negate()),f.displacementMap&&(x.displacementMap.value=f.displacementMap,n(f.displacementMap,x.displacementMapTransform),x.displacementScale.value=f.displacementScale,x.displacementBias.value=f.displacementBias),f.emissiveMap&&(x.emissiveMap.value=f.emissiveMap,n(f.emissiveMap,x.emissiveMapTransform)),f.specularMap&&(x.specularMap.value=f.specularMap,n(f.specularMap,x.specularMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest);const g=e.get(f),w=g.envMap,S=g.envMapRotation;w&&(x.envMap.value=w,x.envMapRotation.value.setFromMatrix4(s3.makeRotationFromEuler(S)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&x.envMapRotation.value.premultiply(B_),x.reflectivity.value=f.reflectivity,x.ior.value=f.ior,x.refractionRatio.value=f.refractionRatio),f.lightMap&&(x.lightMap.value=f.lightMap,x.lightMapIntensity.value=f.lightMapIntensity,n(f.lightMap,x.lightMapTransform)),f.aoMap&&(x.aoMap.value=f.aoMap,x.aoMapIntensity.value=f.aoMapIntensity,n(f.aoMap,x.aoMapTransform))}function o(x,f){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,f.map&&(x.map.value=f.map,n(f.map,x.mapTransform))}function l(x,f){x.dashSize.value=f.dashSize,x.totalSize.value=f.dashSize+f.gapSize,x.scale.value=f.scale}function c(x,f,g,w){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,x.size.value=f.size*g,x.scale.value=w*.5,f.map&&(x.map.value=f.map,n(f.map,x.uvTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,n(f.alphaMap,x.alphaMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest)}function u(x,f){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,x.rotation.value=f.rotation,f.map&&(x.map.value=f.map,n(f.map,x.mapTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,n(f.alphaMap,x.alphaMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest)}function d(x,f){x.specular.value.copy(f.specular),x.shininess.value=Math.max(f.shininess,1e-4)}function p(x,f){f.gradientMap&&(x.gradientMap.value=f.gradientMap)}function h(x,f){x.metalness.value=f.metalness,f.metalnessMap&&(x.metalnessMap.value=f.metalnessMap,n(f.metalnessMap,x.metalnessMapTransform)),x.roughness.value=f.roughness,f.roughnessMap&&(x.roughnessMap.value=f.roughnessMap,n(f.roughnessMap,x.roughnessMapTransform)),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)}function m(x,f,g){x.ior.value=f.ior,f.sheen>0&&(x.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),x.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(x.sheenColorMap.value=f.sheenColorMap,n(f.sheenColorMap,x.sheenColorMapTransform)),f.sheenRoughnessMap&&(x.sheenRoughnessMap.value=f.sheenRoughnessMap,n(f.sheenRoughnessMap,x.sheenRoughnessMapTransform))),f.clearcoat>0&&(x.clearcoat.value=f.clearcoat,x.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(x.clearcoatMap.value=f.clearcoatMap,n(f.clearcoatMap,x.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,n(f.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(x.clearcoatNormalMap.value=f.clearcoatNormalMap,n(f.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===En&&x.clearcoatNormalScale.value.negate())),f.dispersion>0&&(x.dispersion.value=f.dispersion),f.retroreflectivity>0&&(x.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(x.iridescence.value=f.iridescence,x.iridescenceIOR.value=f.iridescenceIOR,x.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(x.iridescenceMap.value=f.iridescenceMap,n(f.iridescenceMap,x.iridescenceMapTransform)),f.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=f.iridescenceThicknessMap,n(f.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),f.transmission>0&&(x.transmission.value=f.transmission,x.transmissionSamplerMap.value=g.texture,x.transmissionSamplerSize.value.set(g.width,g.height),f.transmissionMap&&(x.transmissionMap.value=f.transmissionMap,n(f.transmissionMap,x.transmissionMapTransform)),x.thickness.value=f.thickness,f.thicknessMap&&(x.thicknessMap.value=f.thicknessMap,n(f.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=f.attenuationDistance,x.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(x.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(x.anisotropyMap.value=f.anisotropyMap,n(f.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=f.specularIntensity,x.specularColor.value.copy(f.specularColor),f.specularColorMap&&(x.specularColorMap.value=f.specularColorMap,n(f.specularColorMap,x.specularColorMapTransform)),f.specularIntensityMap&&(x.specularIntensityMap.value=f.specularIntensityMap,n(f.specularIntensityMap,x.specularIntensityMapTransform))}function v(x,f){f.matcap&&(x.matcap.value=f.matcap)}function b(x,f){const g=e.get(f).light;x.referencePosition.value.setFromMatrixPosition(g.matrixWorld),x.nearDistance.value=g.shadow.camera.near,x.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function o3(t,e,n,i){let r={},s={},o=[];const l=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,y){const M=y.program;i.uniformBlockBinding(S,M)}function u(S,y){let M=r[S.id];M===void 0&&(x(S),M=d(S),r[S.id]=M,S.addEventListener("dispose",g));const A=y.program;i.updateUBOMapping(S,A);const _=e.render.frame;s[S.id]!==_&&(h(S),s[S.id]=_)}function d(S){const y=p();S.__bindingPointIndex=y;const M=t.createBuffer(),A=S.__size,_=S.usage;return t.bindBuffer(t.UNIFORM_BUFFER,M),t.bufferData(t.UNIFORM_BUFFER,A,_),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,y,M),M}function p(){for(let S=0;S<l;S++)if(o.indexOf(S)===-1)return o.push(S),S;return rt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){const y=r[S.id],M=S.uniforms,A=S.__cache;t.bindBuffer(t.UNIFORM_BUFFER,y);for(let _=0,T=M.length;_<T;_++){const R=M[_];if(Array.isArray(R))for(let P=0,D=R.length;P<D;P++)m(R[P],_,P,A);else m(R,_,0,A)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(S,y,M,A){if(b(S,y,M,A)===!0){const _=S.__offset,T=S.value;if(Array.isArray(T)){let R=0;for(let P=0;P<T.length;P++){const D=T[P],I=f(D);v(D,S.__data,R),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(R+=I.storage/Float32Array.BYTES_PER_ELEMENT)}}else v(T,S.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,_,S.__data)}}function v(S,y,M){typeof S=="number"||typeof S=="boolean"?y[0]=S:S.isMatrix3?(y[0]=S.elements[0],y[1]=S.elements[1],y[2]=S.elements[2],y[3]=0,y[4]=S.elements[3],y[5]=S.elements[4],y[6]=S.elements[5],y[7]=0,y[8]=S.elements[6],y[9]=S.elements[7],y[10]=S.elements[8],y[11]=0):ArrayBuffer.isView(S)?y.set(new S.constructor(S.buffer,S.byteOffset,y.length)):S.toArray(y,M)}function b(S,y,M,A){const _=S.value,T=y+"_"+M;if(A[T]===void 0)return typeof _=="number"||typeof _=="boolean"?A[T]=_:ArrayBuffer.isView(_)?A[T]=_.slice():A[T]=_.clone(),!0;{const R=A[T];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return A[T]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function x(S){const y=S.uniforms;let M=0;const A=16;for(let T=0,R=y.length;T<R;T++){const P=Array.isArray(y[T])?y[T]:[y[T]];for(let D=0,I=P.length;D<I;D++){const F=P[D],B=Array.isArray(F.value)?F.value:[F.value];for(let Z=0,X=B.length;Z<X;Z++){const j=B[Z],z=f(j),$=M%A,Q=$%z.boundary,ce=$+Q;M+=Q,ce!==0&&A-ce<z.storage&&(M+=A-ce),F.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=z.storage}}}const _=M%A;return _>0&&(M+=A-_),S.__size=M,S.__cache={},this}function f(S){const y={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(y.boundary=4,y.storage=4):S.isVector2?(y.boundary=8,y.storage=8):S.isVector3||S.isColor?(y.boundary=16,y.storage=12):S.isVector4?(y.boundary=16,y.storage=16):S.isMatrix3?(y.boundary=48,y.storage=48):S.isMatrix4?(y.boundary=64,y.storage=64):S.isTexture?Oe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(y.boundary=16,y.storage=S.byteLength):Oe("WebGLRenderer: Unsupported uniform value type.",S),y}function g(S){const y=S.target;y.removeEventListener("dispose",g);const M=o.indexOf(y.__bindingPointIndex);o.splice(M,1),t.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function w(){for(const S in r)t.deleteBuffer(r[S]);o=[],r={},s={}}return{bind:c,update:u,dispose:w}}const l3=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let li=null;function c3(){return li===null&&(li=new $M(l3,16,16,Qr,_i),li.name="DFG_LUT",li.minFilter=sn,li.magFilter=sn,li.wrapS=Di,li.wrapT=Di,li.generateMipmaps=!1,li.needsUpdate=!0),li}class u3{constructor(e={}){const{canvas:n=SM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:u=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:m=An}=e;this.isWebGLRenderer=!0;let v;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=i.getContextAttributes().alpha}else v=o;const b=m,x=new Set([ip,np,tp]),f=new Set([An,vi,po,mo,Qh,ep]),g=new Uint32Array(4),w=new Int32Array(4),S=new G;let y=null,M=null;const A=[],_=[];let T=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=gi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let P=!1,D=null,I=null,F=null,B=null;this._outputColorSpace=wn;let Z=0,X=0,j=null,z=-1,$=null;const Q=new Et,ce=new Et;let Me=null;const Ye=new qe(0);let He=0,Ve=n.width,J=n.height,ie=1,Ee=null,Be=null;const q=new Et(0,0,Ve,J),le=new Et(0,0,Ve,J);let we=!1;const Fe=new cp;let je=!1,Le=!1;const Ue=new bt,it=new G,Nt=new Et,pn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let _t=!1;function Rt(){return j===null?ie:1}let O=i;function Zt(C,U){return n.getContext(C,U)}let ot,N,E,V,Y,ee,oe,ue,te,re,de,De,me,fe,Pe,ke,Ge,k,he,ne,pe,_e,se;try{const C={alpha:!0,depth:r,stencil:s,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Kh}`),n.addEventListener("webglcontextlost",ft,!1),n.addEventListener("webglcontextrestored",st,!1),n.addEventListener("webglcontextcreationerror",Hn,!1),O===null){const U="webgl2";if(O=Zt(U,C),O===null)throw Zt(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ie()}catch(C){throw n.removeEventListener("webglcontextlost",ft,!1),n.removeEventListener("webglcontextrestored",st,!1),n.removeEventListener("webglcontextcreationerror",Hn,!1),rt("WebGLRenderer: "+C.message),C}function Ie(){ot=new cA(O),ot.init(),pe=new e3(O,ot),N=new QC(O,ot,e,pe),E=new JT(O,ot),N.reversedDepthBuffer&&h&&E.buffers.depth.setReversed(!0),I=O.createFramebuffer(),F=O.createFramebuffer(),B=O.createFramebuffer(),V=new fA(O),Y=new OT,ee=new QT(O,ot,E,Y,N,pe,V),oe=new lA(R),ue=new p2(O),_e=new ZC(O,ue),te=new uA(O,ue,V,_e),re=new pA(O,te,ue,_e,V),k=new hA(O,N,ee),Pe=new eA(Y),de=new kT(R,oe,ot,N,_e,Pe),De=new a3(R,Y),me=new jT,fe=new XT(ot),Ge=new KC(R,oe,E,re,v,c),ke=new ZT(R,re,N),se=new o3(O,V,N,E),he=new JC(O,ot,V),ne=new dA(O,ot,V),V.programs=de.programs,R.capabilities=N,R.extensions=ot,R.properties=Y,R.renderLists=me,R.shadowMap=ke,R.state=E,R.info=V}b!==An&&(T=new xA(b,n.width,n.height,l,r,s));const Te=new r3(R,O);this.xr=Te,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const C=ot.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=ot.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(C){C!==void 0&&(ie=C,this.setSize(Ve,J,!1))},this.getSize=function(C){return C.set(Ve,J)},this.setSize=function(C,U,K=!0){if(Te.isPresenting){Oe("WebGLRenderer: Can't change size while VR device is presenting.");return}Ve=C,J=U,n.width=Math.floor(C*ie),n.height=Math.floor(U*ie),K===!0&&(n.style.width=C+"px",n.style.height=U+"px"),T!==null&&T.setSize(n.width,n.height),this.setViewport(0,0,C,U)},this.getDrawingBufferSize=function(C){return C.set(Ve*ie,J*ie).floor()},this.setDrawingBufferSize=function(C,U,K){Ve=C,J=U,ie=K,n.width=Math.floor(C*K),n.height=Math.floor(U*K),this.setViewport(0,0,C,U)},this.setEffects=function(C){if(b===An){rt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(C){for(let U=0;U<C.length;U++)if(C[U].isOutputPass===!0){Oe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(C||[])},this.getCurrentViewport=function(C){return C.copy(Q)},this.getViewport=function(C){return C.copy(q)},this.setViewport=function(C,U,K,H){C.isVector4?q.set(C.x,C.y,C.z,C.w):q.set(C,U,K,H),E.viewport(Q.copy(q).multiplyScalar(ie).round())},this.getScissor=function(C){return C.copy(le)},this.setScissor=function(C,U,K,H){C.isVector4?le.set(C.x,C.y,C.z,C.w):le.set(C,U,K,H),E.scissor(ce.copy(le).multiplyScalar(ie).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(C){E.setScissorTest(we=C)},this.setOpaqueSort=function(C){Ee=C},this.setTransparentSort=function(C){Be=C},this.getClearColor=function(C){return C.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(C=!0,U=!0,K=!0){let H=0;if(C){let W=!1;if(j!==null){const ve=j.texture.format;W=x.has(ve)}if(W){const ve=j.texture.type,Se=f.has(ve),ge=Ge.getClearColor(),Ce=Ge.getClearAlpha(),Ne=ge.r,We=ge.g,Ke=ge.b;Se?(g[0]=Ne,g[1]=We,g[2]=Ke,g[3]=Ce,O.clearBufferuiv(O.COLOR,0,g)):(w[0]=Ne,w[1]=We,w[2]=Ke,w[3]=Ce,O.clearBufferiv(O.COLOR,0,w))}else H|=O.COLOR_BUFFER_BIT}U&&(H|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(H|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&O.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(C){C.setRenderer(this),D=C},this.dispose=function(){n.removeEventListener("webglcontextlost",ft,!1),n.removeEventListener("webglcontextrestored",st,!1),n.removeEventListener("webglcontextcreationerror",Hn,!1),Ge.dispose(),me.dispose(),fe.dispose(),Y.dispose(),oe.dispose(),re.dispose(),_e.dispose(),se.dispose(),de.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",Ep),Te.removeEventListener("sessionend",Sp),Rr.stop()};function ft(C){C.preventDefault(),xx("WebGLRenderer: Context Lost."),P=!0}function st(){xx("WebGLRenderer: Context Restored."),P=!1;const C=V.autoReset,U=ke.enabled,K=ke.autoUpdate,H=ke.needsUpdate,W=ke.type;Ie(),V.autoReset=C,ke.enabled=U,ke.autoUpdate=K,ke.needsUpdate=H,ke.type=W}function Hn(C){rt("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ri(C){const U=C.target;U.removeEventListener("dispose",ri),j_(U)}function j_(C){z_(C),Y.remove(C)}function z_(C){const U=Y.get(C).programs;U!==void 0&&(U.forEach(function(K){de.releaseProgram(K)}),C.isShaderMaterial&&de.releaseShaderCache(C))}this.renderBufferDirect=function(C,U,K,H,W,ve){U===null&&(U=pn);const Se=W.isMesh&&W.matrixWorld.determinantAffine()<0,ge=H_(C,U,K,H,W);E.setMaterial(H,Se);let Ce=K.index,Ne=1;if(H.wireframe===!0){if(Ce=te.getWireframeAttribute(K),Ce===void 0)return;Ne=2}const We=K.drawRange,Ke=K.attributes.position;let Ae=We.start*Ne,at=(We.start+We.count)*Ne;ve!==null&&(Ae=Math.max(Ae,ve.start*Ne),at=Math.min(at,(ve.start+ve.count)*Ne)),Ce!==null?(Ae=Math.max(Ae,0),at=Math.min(at,Ce.count)):Ke!=null&&(Ae=Math.max(Ae,0),at=Math.min(at,Ke.count));const Dt=at-Ae;if(Dt<0||Dt===1/0)return;_e.setup(W,H,ge,K,Ce);let mt,dt=he;if(Ce!==null&&(mt=ue.get(Ce),dt=ne,dt.setIndex(mt)),W.isMesh)H.wireframe===!0?(E.setLineWidth(H.wireframeLinewidth*Rt()),dt.setMode(O.LINES)):dt.setMode(O.TRIANGLES);else if(W.isLine){let Jt=H.linewidth;Jt===void 0&&(Jt=1),E.setLineWidth(Jt*Rt()),W.isLineSegments?dt.setMode(O.LINES):W.isLineLoop?dt.setMode(O.LINE_LOOP):dt.setMode(O.LINE_STRIP)}else W.isPoints?dt.setMode(O.POINTS):W.isSprite&&dt.setMode(O.TRIANGLES);if(W.isBatchedMesh)if(ot.get("WEBGL_multi_draw"))dt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Jt=W._multiDrawStarts,ye=W._multiDrawCounts,on=W._multiDrawCount,tt=Ce?ue.get(Ce).bytesPerElement:1,In=Y.get(H).currentProgram.getUniforms();for(let si=0;si<on;si++)In.setValue(O,"_gl_DrawID",si),dt.render(Jt[si]/tt,ye[si])}else if(W.isInstancedMesh)dt.renderInstances(Ae,Dt,W.count);else if(K.isInstancedBufferGeometry){const Jt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,ye=Math.min(K.instanceCount,Jt);dt.renderInstances(Ae,Dt,ye)}else dt.render(Ae,Dt)};function yp(C,U,K,H){D!==null&&C.isNodeMaterial&&D.setObject(H,C),je===!0&&Pe.setState(C,K,!1),C.transparent===!0&&C.side===fi&&C.forceSinglePass===!1?(C.side=En,C.needsUpdate=!0,Ao(C,U,H),C.side=Zr,C.needsUpdate=!0,Ao(C,U,H),C.side=fi):Ao(C,U,H)}this.compile=function(C,U,K=null){K===null&&(K=C),D!==null&&D.renderStart(C,U,K),M=fe.get(K),M.init(U),_.push(M),K.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),C!==K&&C.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),M.setupLights(),D!==null&&D.updateLights(M.state.lightsArray),Le=this.localClippingEnabled,je=Pe.init(this.clippingPlanes,Le),je===!0&&Pe.setGlobalState(this.clippingPlanes,U),D!==null&&ke.render(M.state.shadowsArray,K,U);const H=new Set;return C.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const ve=W.material;if(ve)if(Array.isArray(ve))for(let Se=0;Se<ve.length;Se++){const ge=ve[Se];yp(ge,K,U,W),H.add(ge)}else yp(ve,K,U,W),H.add(ve)}),M=_.pop(),D!==null&&D.renderEnd(),H},this.compileAsync=function(C,U,K=null){const H=this.compile(C,U,K);return new Promise(W=>{function ve(){if(H.forEach(function(Se){const Ce=Y.get(Se).currentProgram;(Ce===void 0||Ce.isReady())&&H.delete(Se)}),H.size===0){W(C);return}setTimeout(ve,10)}ot.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let jc=null;function V_(C){jc&&jc(C)}function Ep(){Rr.stop()}function Sp(){Rr.start()}const Rr=new P_;Rr.setAnimationLoop(V_),typeof self<"u"&&Rr.setContext(self),this.setAnimationLoop=function(C){jc=C,Te.setAnimationLoop(C),C===null?Rr.stop():Rr.start()},Te.addEventListener("sessionstart",Ep),Te.addEventListener("sessionend",Sp),this.render=function(C,U){if(U!==void 0&&U.isCamera!==!0){rt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;D!==null&&D.renderStart(C,U);const K=Te.enabled===!0&&Te.isPresenting===!0,H=T!==null&&(j===null||K)&&T.begin(R,j);if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(U),U=Te.getCamera()),C.isScene===!0&&C.onBeforeRender(R,C,U,j),M=fe.get(C,_.length),M.init(U),M.state.textureUnits=ee.getTextureUnits(),_.push(M),Ue.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Fe.setFromProjectionMatrix(Ue,pi,U.reversedDepth),Le=this.localClippingEnabled,je=Pe.init(this.clippingPlanes,Le),y=me.get(C,A.length),y.init(),A.push(y),Te.enabled===!0&&Te.isPresenting===!0){const Se=R.xr.getDepthSensingMesh();Se!==null&&zc(Se,U,-1/0,R.sortObjects)}zc(C,U,0,R.sortObjects),y.finish(),D!==null&&D.updateLights(M.state.lightsArray),R.sortObjects===!0&&y.sort(Ee,Be),_t=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,_t&&Ge.addToRenderList(y,C),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),je===!0&&Pe.beginShadows();const W=M.state.shadowsArray;if(ke.render(W,C,U),je===!0&&Pe.endShadows(),(H&&T.hasRenderPass())===!1){const Se=y.opaque,ge=y.transmissive;if(M.setupLights(),U.isArrayCamera){const Ce=U.cameras;if(ge.length>0)for(let Ne=0,We=Ce.length;Ne<We;Ne++){const Ke=Ce[Ne];Mp(Se,ge,C,Ke)}_t&&Ge.render(C);for(let Ne=0,We=Ce.length;Ne<We;Ne++){const Ke=Ce[Ne];bp(y,C,Ke,Ke.viewport)}}else ge.length>0&&Mp(Se,ge,C,U),_t&&Ge.render(C),bp(y,C,U)}j!==null&&X===0&&(ee.updateMultisampleRenderTarget(j),ee.updateRenderTargetMipmap(j)),H&&T.end(R),C.isScene===!0&&C.onAfterRender(R,C,U),_e.resetDefaultState(),z=-1,$=null,_.pop(),_.length>0?(M=_[_.length-1],ee.setTextureUnits(M.state.textureUnits),je===!0&&Pe.setGlobalState(R.clippingPlanes,M.state.camera)):M=null,A.pop(),A.length>0?y=A[A.length-1]:y=null,D!==null&&D.renderEnd()};function zc(C,U,K,H){if(C.visible===!1)return;if(C.layers.test(U.layers)){if(C.isGroup)K=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(U);else if(C.isLightProbeGrid)M.pushLightProbeGrid(C);else if(C.isLight)M.pushLight(C),C.castShadow&&M.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||C.intersectsFrustum(Fe)){H&&Nt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(Ue);const Se=re.update(C),ge=C.material;ge.visible&&y.push(C,Se,ge,K,Nt.z,null,U)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||C.intersectsFrustum(Fe))){const Se=re.update(C),ge=C.material;if(H&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Nt.copy(C.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Nt.copy(Se.boundingSphere.center)),Nt.applyMatrix4(C.matrixWorld).applyMatrix4(Ue)),Array.isArray(ge)){const Ce=Se.groups;for(let Ne=0,We=Ce.length;Ne<We;Ne++){const Ke=Ce[Ne],Ae=ge[Ke.materialIndex];Ae&&Ae.visible&&y.push(C,Se,Ae,K,Nt.z,Ke,U)}}else ge.visible&&y.push(C,Se,ge,K,Nt.z,null,U)}}const ve=C.children;for(let Se=0,ge=ve.length;Se<ge;Se++)zc(ve[Se],U,K,H)}function bp(C,U,K,H){const{opaque:W,transmissive:ve,transparent:Se}=C;M.setupLightsView(K),je===!0&&Pe.setGlobalState(R.clippingPlanes,K),H&&E.viewport(Q.copy(H)),W.length>0&&Co(W,U,K),ve.length>0&&Co(ve,U,K),Se.length>0&&Co(Se,U,K),E.buffers.depth.setTest(!0),E.buffers.depth.setMask(!0),E.buffers.color.setMask(!0),E.setPolygonOffset(!1)}function Mp(C,U,K,H){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[H.id]===void 0){const Ae=ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[H.id]=new ni(1,1,{generateMipmaps:!0,type:Ae?_i:An,minFilter:Vr,samples:Math.max(4,N.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:et.workingColorSpace})}const ve=M.state.transmissionRenderTarget[H.id],Se=H.viewport||Q;ve.setSize(Se.z*R.transmissionResolutionScale,Se.w*R.transmissionResolutionScale);const ge=R.getRenderTarget(),Ce=R.getActiveCubeFace(),Ne=R.getActiveMipmapLevel();R.setRenderTarget(ve),R.getClearColor(Ye),He=R.getClearAlpha(),He<1&&R.setClearColor(16777215,.5),R.clear(),_t&&Ge.render(K);const We=R.toneMapping;R.toneMapping=gi;const Ke=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),M.setupLightsView(H),je===!0&&Pe.setGlobalState(R.clippingPlanes,H),Co(C,K,H),ee.updateMultisampleRenderTarget(ve),ee.updateRenderTargetMipmap(ve),ot.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let at=0,Dt=U.length;at<Dt;at++){const mt=U[at],{object:dt,geometry:Jt,material:ye,group:on}=mt;if(ye.side===fi&&dt.layers.test(H.layers)){const tt=ye.side;ye.side=En,ye.needsUpdate=!0,wp(dt,K,H,Jt,ye,on),ye.side=tt,ye.needsUpdate=!0,Ae=!0}}Ae===!0&&(ee.updateMultisampleRenderTarget(ve),ee.updateRenderTargetMipmap(ve))}R.setRenderTarget(ge,Ce,Ne),R.setClearColor(Ye,He),Ke!==void 0&&(H.viewport=Ke),R.toneMapping=We}function Co(C,U,K){const H=U.isScene===!0?U.overrideMaterial:null;for(let W=0,ve=C.length;W<ve;W++){const Se=C[W],{object:ge,geometry:Ce,group:Ne}=Se;let We=Se.material;We.allowOverride===!0&&H!==null&&(We=H),ge.layers.test(K.layers)&&wp(ge,U,K,Ce,We,Ne)}}function wp(C,U,K,H,W,ve){D!==null&&W.isNodeMaterial&&D.setObject(C,W),C.onBeforeRender(R,U,K,H,W,ve),C.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),W.onBeforeRender(R,U,K,H,C,ve),W.transparent===!0&&W.side===fi&&W.forceSinglePass===!1?(W.side=En,W.needsUpdate=!0,R.renderBufferDirect(K,U,H,W,C,ve),W.side=Zr,W.needsUpdate=!0,R.renderBufferDirect(K,U,H,W,C,ve),W.side=fi):R.renderBufferDirect(K,U,H,W,C,ve),C.onAfterRender(R,U,K,H,W,ve)}function Ao(C,U,K){U.isScene!==!0&&(U=pn);const H=Y.get(C),W=M.state.lights,ve=M.state.shadowsArray,Se=W.state.version,ge=de.getParameters(C,W.state,ve,U,K,M.state.lightProbeGridArray),Ce=de.getProgramCacheKey(ge);let Ne=H.programs;H.environment=C.isMeshStandardMaterial||C.isMeshLambertMaterial||C.isMeshPhongMaterial?U.environment:null,H.fog=U.fog;const We=C.isMeshStandardMaterial||C.isMeshLambertMaterial&&!C.envMap||C.isMeshPhongMaterial&&!C.envMap;H.envMap=oe.get(C.envMap||H.environment,We),H.envMapRotation=H.environment!==null&&C.envMap===null?U.environmentRotation:C.envMapRotation,Ne===void 0&&(C.addEventListener("dispose",ri),Ne=new Map,H.programs=Ne);let Ke=Ne.get(Ce);if(Ke!==void 0){if(H.currentProgram===Ke&&H.lightsStateVersion===Se)return Ap(C,ge),Ke}else ge.uniforms=de.getUniforms(C),D!==null&&C.isNodeMaterial&&D.build(C,K,ge),C.onBeforeCompile(ge,R),Ke=de.acquireProgram(ge,Ce),Ne.set(Ce,Ke),H.uniforms=ge.uniforms;const Ae=H.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ae.clippingPlanes=Pe.uniform),Ap(C,ge),H.needsLights=X_(C),H.lightsStateVersion=Se,H.needsLights&&(Ae.ambientLightColor.value=W.state.ambient,Ae.lightProbe.value=W.state.probe,Ae.sunLights.value=W.state.sun,Ae.sunLightShadows.value=W.state.sunShadow,Ae.directionalLights.value=W.state.directional,Ae.directionalLightShadows.value=W.state.directionalShadow,Ae.spotLights.value=W.state.spot,Ae.spotLightShadows.value=W.state.spotShadow,Ae.rectAreaLights.value=W.state.rectArea,Ae.ltc_1.value=W.state.rectAreaLTC1,Ae.ltc_2.value=W.state.rectAreaLTC2,Ae.pointLights.value=W.state.point,Ae.pointLightShadows.value=W.state.pointShadow,Ae.hemisphereLights.value=W.state.hemi,Ae.sunShadowMatrix.value=W.state.sunShadowMatrix,Ae.sunShadowCascade.value=W.state.sunShadowCascade,Ae.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ae.spotLightMatrix.value=W.state.spotLightMatrix,Ae.spotLightMap.value=W.state.spotLightMap,Ae.pointShadowMatrix.value=W.state.pointShadowMatrix),H.lightProbeGrid=M.state.lightProbeGridArray.length>0,H.currentProgram=Ke,H.uniformsList=null,Ke}function Cp(C){if(C.uniformsList===null){const U=C.currentProgram.getUniforms();C.uniformsList=Ll.seqWithValue(U.seq,C.uniforms)}return C.uniformsList}function Ap(C,U){const K=Y.get(C);K.outputColorSpace=U.outputColorSpace,K.batching=U.batching,K.batchingColor=U.batchingColor,K.instancing=U.instancing,K.instancingColor=U.instancingColor,K.instancingMorph=U.instancingMorph,K.skinning=U.skinning,K.morphTargets=U.morphTargets,K.morphNormals=U.morphNormals,K.morphColors=U.morphColors,K.morphTargetsCount=U.morphTargetsCount,K.numClippingPlanes=U.numClippingPlanes,K.numIntersection=U.numClipIntersection,K.vertexAlphas=U.vertexAlphas,K.vertexTangents=U.vertexTangents,K.toneMapping=U.toneMapping}function G_(C,U){if(C.length===0)return null;if(C.length===1)return C[0].texture!==null?C[0]:null;S.setFromMatrixPosition(U.matrixWorld);for(let K=0,H=C.length;K<H;K++){const W=C[K];if(W.texture!==null&&W.boundingBox.containsPoint(S))return W}return null}function H_(C,U,K,H,W){U.isScene!==!0&&(U=pn),ee.resetTextureUnits();const ve=U.fog,Se=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?U.environment:null,ge=j===null?R.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:et.workingColorSpace,Ce=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ne=oe.get(H.envMap||Se,Ce),We=H.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,Ke=!!K.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ae=!!K.morphAttributes.position,at=!!K.morphAttributes.normal,Dt=!!K.morphAttributes.color;let mt=gi;H.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(mt=R.toneMapping);const dt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Jt=dt!==void 0?dt.length:0,ye=Y.get(H),on=M.state.lights;if(je===!0&&(Le===!0||C!==$)){const ht=C===$&&H.id===z;Pe.setState(H,C,ht)}let tt=!1;H.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==on.state.version||ye.outputColorSpace!==ge||W.isBatchedMesh&&ye.batching===!1||!W.isBatchedMesh&&ye.batching===!0||W.isBatchedMesh&&ye.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&ye.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&ye.instancing===!1||!W.isInstancedMesh&&ye.instancing===!0||W.isSkinnedMesh&&ye.skinning===!1||!W.isSkinnedMesh&&ye.skinning===!0||W.isInstancedMesh&&ye.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&ye.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&ye.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&ye.instancingMorph===!1&&W.morphTexture!==null||ye.envMap!==Ne||H.fog===!0&&ye.fog!==ve||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==Pe.numPlanes||ye.numIntersection!==Pe.numIntersection)||ye.vertexAlphas!==We||ye.vertexTangents!==Ke||ye.morphTargets!==Ae||ye.morphNormals!==at||ye.morphColors!==Dt||ye.toneMapping!==mt||ye.morphTargetsCount!==Jt||!!ye.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(tt=!0):(tt=!0,ye.__version=H.version);let In=ye.currentProgram;tt===!0&&(In=Ao(H,U,W),D&&H.isNodeMaterial&&D.onUpdateProgram(H,In,ye));let si=!1,Wi=!1,rs=!1;const ut=In.getUniforms(),Ct=ye.uniforms;if(E.useProgram(In.program)&&(si=!0,Wi=!0,rs=!0),H.id!==z&&(z=H.id,Wi=!0),ye.needsLights){const ht=G_(M.state.lightProbeGridArray,W);ye.lightProbeGrid!==ht&&(ye.lightProbeGrid=ht,Wi=!0)}if(si||$!==C){E.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),ut.setValue(O,"projectionMatrix",C.projectionMatrix),ut.setValue(O,"viewMatrix",C.matrixWorldInverse);const $i=ut.map.cameraPosition;$i!==void 0&&$i.setValue(O,it.setFromMatrixPosition(C.matrixWorld)),N.logarithmicDepthBuffer&&ut.setValue(O,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ut.setValue(O,"isOrthographic",C.isOrthographicCamera===!0),$!==C&&($=C,Wi=!0,rs=!0)}if(ye.needsLights&&(on.state.sunShadowMap.length>0&&ut.setValue(O,"sunShadowMap",on.state.sunShadowMap,ee),on.state.directionalShadowMap.length>0&&ut.setValue(O,"directionalShadowMap",on.state.directionalShadowMap,ee),on.state.spotShadowMap.length>0&&ut.setValue(O,"spotShadowMap",on.state.spotShadowMap,ee),on.state.pointShadowMap.length>0&&ut.setValue(O,"pointShadowMap",on.state.pointShadowMap,ee)),W.isSkinnedMesh){ut.setOptional(O,W,"bindMatrix"),ut.setOptional(O,W,"bindMatrixInverse");const ht=W.skeleton;ht&&(ht.boneTexture===null&&ht.computeBoneTexture(),ut.setValue(O,"boneTexture",ht.boneTexture,ee))}W.isBatchedMesh&&(ut.setOptional(O,W,"batchingTexture"),ut.setValue(O,"batchingTexture",W._matricesTexture,ee),ut.setOptional(O,W,"batchingIdTexture"),ut.setValue(O,"batchingIdTexture",W._indirectTexture,ee),ut.setOptional(O,W,"batchingColorTexture"),W._colorsTexture!==null&&ut.setValue(O,"batchingColorTexture",W._colorsTexture,ee));const Xi=K.morphAttributes;if((Xi.position!==void 0||Xi.normal!==void 0||Xi.color!==void 0)&&k.update(W,K,In),(Wi||ye.receiveShadow!==W.receiveShadow)&&(ye.receiveShadow=W.receiveShadow,ut.setValue(O,"receiveShadow",W.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&U.environment!==null&&(Ct.envMapIntensity.value=U.environmentIntensity),Ct.dfgLUT!==void 0&&(Ct.dfgLUT.value=c3()),Wi){if(ut.setValue(O,"toneMappingExposure",R.toneMappingExposure),ye.needsLights&&W_(Ct,rs),ve&&H.fog===!0&&De.refreshFogUniforms(Ct,ve),De.refreshMaterialUniforms(Ct,H,ie,J,M.state.transmissionRenderTarget[C.id]),ye.needsLights&&ye.lightProbeGrid){const ht=ye.lightProbeGrid;Ct.probesSH.value=ht.texture,Ct.probesMin.value.copy(ht.boundingBox.min),Ct.probesMax.value.copy(ht.boundingBox.max),Ct.probesResolution.value.copy(ht.resolution)}Ll.upload(O,Cp(ye),Ct,ee)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ll.upload(O,Cp(ye),Ct,ee),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ut.setValue(O,"center",W.center),ut.setValue(O,"modelViewMatrix",W.modelViewMatrix),ut.setValue(O,"normalMatrix",W.normalMatrix),ut.setValue(O,"modelMatrix",W.matrixWorld),H.uniformsGroups!==void 0){const ht=H.uniformsGroups;for(let $i=0,ss=ht.length;$i<ss;$i++){const Np=ht[$i];se.update(Np,In),se.bind(Np,In)}}return In}function W_(C,U){C.ambientLightColor.needsUpdate=U,C.lightProbe.needsUpdate=U,C.sunLights.needsUpdate=U,C.sunLightShadows.needsUpdate=U,C.directionalLights.needsUpdate=U,C.directionalLightShadows.needsUpdate=U,C.pointLights.needsUpdate=U,C.pointLightShadows.needsUpdate=U,C.spotLights.needsUpdate=U,C.spotLightShadows.needsUpdate=U,C.rectAreaLights.needsUpdate=U,C.hemisphereLights.needsUpdate=U}function X_(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(C,U,K){const H=Y.get(C);H.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),Y.get(C.texture).__webglTexture=U,Y.get(C.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:K,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,U){const K=Y.get(C);K.__webglFramebuffer=U,K.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(C,U=0,K=0){j=C,Z=U,X=K;let H=null,W=!1,ve=!1;if(C){const ge=Y.get(C);if(ge.__useDefaultFramebuffer!==void 0){E.bindFramebuffer(O.FRAMEBUFFER,ge.__webglFramebuffer),Q.copy(C.viewport),ce.copy(C.scissor),Me=C.scissorTest,E.viewport(Q),E.scissor(ce),E.setScissorTest(Me),z=-1;return}else if(ge.__webglFramebuffer===void 0)ee.setupRenderTarget(C);else if(ge.__hasExternalTextures)ee.rebindTextures(C,Y.get(C.texture).__webglTexture,Y.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const We=C.depthTexture;if(ge.__boundDepthTexture!==We){if(We!==null&&Y.has(We)&&(C.width!==We.image.width||C.height!==We.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ee.setupDepthRenderbuffer(C)}}const Ce=C.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(ve=!0);const Ne=Y.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Ne[U])?H=Ne[U][K]:H=Ne[U],W=!0):C.samples>0&&ee.useMultisampledRTT(C)===!1?H=Y.get(C).__webglMultisampledFramebuffer:Array.isArray(Ne)?H=Ne[K]:H=Ne,Q.copy(C.viewport),ce.copy(C.scissor),Me=C.scissorTest}else Q.copy(q).multiplyScalar(ie).floor(),ce.copy(le).multiplyScalar(ie).floor(),Me=we;if(K!==0&&(H=I),E.bindFramebuffer(O.FRAMEBUFFER,H)&&E.drawBuffers(C,H),E.viewport(Q),E.scissor(ce),E.setScissorTest(Me),W){const ge=Y.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,ge.__webglTexture,K)}else if(ve){const ge=U;for(let Ce=0;Ce<C.textures.length;Ce++){const Ne=Y.get(C.textures[Ce]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Ce,Ne.__webglTexture,K,ge)}}else if(C!==null&&K!==0){const ge=Y.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ge.__webglTexture,K)}z=-1};function Tp(C){const U=Y.get(C);return(U.__readFormat!==C.format||U.__readType!==C.type)&&(U.__readFormat=C.format,U.__readType=C.type,U.__formatReadable=N.textureFormatReadable(C.format),U.__typeReadable=N.textureTypeReadable(C.type)),U}this.readRenderTargetPixels=function(C,U,K,H,W,ve,Se,ge=0){if(!(C&&C.isWebGLRenderTarget)){rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=Y.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Se!==void 0&&(Ce=Ce[Se]),Ce){E.bindFramebuffer(O.FRAMEBUFFER,Ce);try{const Ne=C.textures[ge],We=Ne.format,Ke=Ne.type;C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ge);const Ae=Tp(Ne);if(Ae.__formatReadable===!1){rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ae.__typeReadable===!1){rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=C.width-H&&K>=0&&K<=C.height-W&&O.readPixels(U,K,H,W,pe.convert(We),pe.convert(Ke),ve)}finally{const Ne=j!==null?Y.get(j).__webglFramebuffer:null;E.bindFramebuffer(O.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(C,U,K,H,W,ve,Se,ge=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=Y.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Se!==void 0&&(Ce=Ce[Se]),Ce)if(U>=0&&U<=C.width-H&&K>=0&&K<=C.height-W){E.bindFramebuffer(O.FRAMEBUFFER,Ce);const Ne=C.textures[ge],We=Ne.format,Ke=Ne.type;C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ge);const Ae=Tp(Ne);if(Ae.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ae.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const at=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,at),O.bufferData(O.PIXEL_PACK_BUFFER,ve.byteLength,O.STREAM_READ),O.readPixels(U,K,H,W,pe.convert(We),pe.convert(Ke),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);const Dt=j!==null?Y.get(j).__webglFramebuffer:null;E.bindFramebuffer(O.FRAMEBUFFER,Dt);const mt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await bM(O,mt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,at),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ve),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(at),O.deleteSync(mt),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,U=null,K=0){const H=Math.pow(2,-K),W=Math.floor(C.image.width*H),ve=Math.floor(C.image.height*H),Se=U!==null?U.x:0,ge=U!==null?U.y:0;ee.setTexture2D(C,0),O.copyTexSubImage2D(O.TEXTURE_2D,K,0,0,Se,ge,W,ve),E.unbindTexture()},this.copyTextureToTexture=function(C,U,K=null,H=null,W=0,ve=0){let Se,ge,Ce,Ne,We,Ke,Ae,at,Dt;const mt=C.isCompressedTexture?C.mipmaps[ve]:C.image;if(K!==null)Se=K.max.x-K.min.x,ge=K.max.y-K.min.y,Ce=K.isBox3?K.max.z-K.min.z:1,Ne=K.min.x,We=K.min.y,Ke=K.isBox3?K.min.z:0;else{const Ct=Math.pow(2,-W);Se=Math.floor(mt.width*Ct),ge=Math.floor(mt.height*Ct),C.isDataArrayTexture?Ce=mt.depth:C.isData3DTexture?Ce=Math.floor(mt.depth*Ct):Ce=1,Ne=0,We=0,Ke=0}H!==null?(Ae=H.x,at=H.y,Dt=H.z):(Ae=0,at=0,Dt=0);const dt=pe.convert(U.format),Jt=pe.convert(U.type);let ye;U.isData3DTexture?(ee.setTexture3D(U,0),ye=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(ee.setTexture2DArray(U,0),ye=O.TEXTURE_2D_ARRAY):(ee.setTexture2D(U,0),ye=O.TEXTURE_2D),E.activeTexture(O.TEXTURE0),E.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),E.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),E.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);const on=E.getParameter(O.UNPACK_ROW_LENGTH),tt=E.getParameter(O.UNPACK_IMAGE_HEIGHT),In=E.getParameter(O.UNPACK_SKIP_PIXELS),si=E.getParameter(O.UNPACK_SKIP_ROWS),Wi=E.getParameter(O.UNPACK_SKIP_IMAGES);E.pixelStorei(O.UNPACK_ROW_LENGTH,mt.width),E.pixelStorei(O.UNPACK_IMAGE_HEIGHT,mt.height),E.pixelStorei(O.UNPACK_SKIP_PIXELS,Ne),E.pixelStorei(O.UNPACK_SKIP_ROWS,We),E.pixelStorei(O.UNPACK_SKIP_IMAGES,Ke);const rs=C.isDataArrayTexture||C.isData3DTexture,ut=U.isDataArrayTexture||U.isData3DTexture;if(C.isDepthTexture){const Ct=Y.get(C),Xi=Y.get(U),ht=Y.get(Ct.__renderTarget),$i=Y.get(Xi.__renderTarget);E.bindFramebuffer(O.READ_FRAMEBUFFER,ht.__webglFramebuffer),E.bindFramebuffer(O.DRAW_FRAMEBUFFER,$i.__webglFramebuffer);for(let ss=0;ss<Ce;ss++)rs&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Y.get(C).__webglTexture,W,Ke+ss),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Y.get(U).__webglTexture,ve,Dt+ss)),O.blitFramebuffer(Ne,We,Se,ge,Ae,at,Se,ge,O.DEPTH_BUFFER_BIT,O.NEAREST);E.bindFramebuffer(O.READ_FRAMEBUFFER,null),E.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(W!==0||C.isRenderTargetTexture||Y.has(C)){const Ct=Y.get(C),Xi=Y.get(U);E.bindFramebuffer(O.READ_FRAMEBUFFER,F),E.bindFramebuffer(O.DRAW_FRAMEBUFFER,B);for(let ht=0;ht<Ce;ht++)rs?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ct.__webglTexture,W,Ke+ht):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ct.__webglTexture,W),ut?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Xi.__webglTexture,ve,Dt+ht):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Xi.__webglTexture,ve),W!==0?O.blitFramebuffer(Ne,We,Se,ge,Ae,at,Se,ge,O.COLOR_BUFFER_BIT,O.NEAREST):ut?O.copyTexSubImage3D(ye,ve,Ae,at,Dt+ht,Ne,We,Se,ge):O.copyTexSubImage2D(ye,ve,Ae,at,Ne,We,Se,ge);E.bindFramebuffer(O.READ_FRAMEBUFFER,null),E.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else ut?C.isDataTexture||C.isData3DTexture?O.texSubImage3D(ye,ve,Ae,at,Dt,Se,ge,Ce,dt,Jt,mt.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(ye,ve,Ae,at,Dt,Se,ge,Ce,dt,mt.data):O.texSubImage3D(ye,ve,Ae,at,Dt,Se,ge,Ce,dt,Jt,mt):C.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,ve,Ae,at,Se,ge,dt,Jt,mt.data):C.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,ve,Ae,at,mt.width,mt.height,dt,mt.data):O.texSubImage2D(O.TEXTURE_2D,ve,Ae,at,Se,ge,dt,Jt,mt);E.pixelStorei(O.UNPACK_ROW_LENGTH,on),E.pixelStorei(O.UNPACK_IMAGE_HEIGHT,tt),E.pixelStorei(O.UNPACK_SKIP_PIXELS,In),E.pixelStorei(O.UNPACK_SKIP_ROWS,si),E.pixelStorei(O.UNPACK_SKIP_IMAGES,Wi),ve===0&&U.generateMipmaps&&O.generateMipmap(ye),E.unbindTexture()},this.initRenderTarget=function(C){Y.get(C).__webglFramebuffer===void 0&&ee.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?ee.setTextureCube(C,0):C.isData3DTexture?ee.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?ee.setTexture2DArray(C,0):ee.setTexture2D(C,0),E.unbindTexture()},this.resetState=function(){Z=0,X=0,j=null,E.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),n.unpackColorSpace=et._getUnpackColorSpace()}}const d3={Li:{color:15050751,radius:.34},Co:{color:6404351,radius:.46},Fe:{color:16754287,radius:.45},O:{color:16740744,radius:.31},Ba:{color:6481874,radius:.48},Ti:{color:12042446,radius:.43},Zr:{color:7855020,radius:.46},La:{color:16765550,radius:.49},P:{color:12623103,radius:.4},S:{color:16768381,radius:.42}};function f3(t){return d3[t]??{color:14212842,radius:.4}}function h3(t){const e=Math.PI/180,n=(t.alpha??90)*e,i=(t.beta??90)*e,r=(t.gamma??90)*e,s=new G(t.a||5,0,0),o=new G((t.b||5)*Math.cos(r),(t.b||5)*Math.sin(r),0),l=(t.c||5)*Math.cos(i),c=(t.c||5)*(Math.cos(n)-Math.cos(i)*Math.cos(r))/Math.max(Math.sin(r),.001),u=Math.sqrt(Math.max((t.c||5)**2-l**2-c**2,0));return{a:s,b:o,c:new G(l,c,u)}}function p3({atoms:t,lattice:e,materialLabel:n,sourceLabel:i}){const r=L.useRef(null);return L.useEffect(()=>{const s=r.current;if(!s)return;const o=new BM;o.background=new qe(16645112),o.fog=new op(16645112,18,44);const l=new Cn(38,1,.1,1e3),c=new u3({antialias:!0});c.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.outputColorSpace=wn,c.toneMapping=Zh,c.toneMappingExposure=1.15,s.appendChild(c.domElement);const u=()=>{const _=Math.max(s.clientWidth,320),T=Math.max(s.clientHeight,300);l.aspect=_/T,l.updateProjectionMatrix(),c.setSize(_,T,!1)};u();const d=new ResizeObserver(u);d.observe(s),o.add(new u2(16777215,1.55));const p=new c2(16777215,3.4);p.position.set(8,12,10),o.add(p);const h=new jx(16757371,7,30,2);h.position.set(-8,5,-9),o.add(h);const m=new jx(16771548,6,28,2);m.position.set(9,-4,6),o.add(m);const v=h3(e),b=v.a.clone().add(v.b).add(v.c).multiplyScalar(.5),x=Math.max(v.a.length(),v.b.length(),v.c.length(),5);l.position.set(x*1.7,x*1.2,x*2.15),l.lookAt(0,0,0);const f=new Ra;o.add(f);const g=[];t.forEach(_=>{const[T,R,P]=_.fractional_coordinates,D=v.a.clone().multiplyScalar(T).add(v.b.clone().multiplyScalar(R)).add(v.c.clone().multiplyScalar(P)).sub(b);g.push(D);const I=f3(_.species),F=new Nn(new fp(I.radius,32,24),new r2({color:I.color,roughness:.22,metalness:.08,clearcoat:.7,emissive:I.color,emissiveIntensity:.025}));F.position.copy(D),f.add(F)});const w=new N_({color:10133930,roughness:.42,transparent:!0,opacity:.72}),S=Math.max(x*.3,2.35);for(let _=0;_<g.length;_+=1)for(let T=_+1;T<g.length;T+=1){const R=g[T].clone().sub(g[_]),P=R.length();if(P>S)continue;const D=new Nn(new dp(.05,.05,P,10),w);D.position.copy(g[_]).add(g[T]).multiplyScalar(.5),D.quaternion.setFromUnitVectors(new G(0,1,0),R.normalize()),f.add(D)}const y=new Nn(new up(x*2.4,64),new lp({color:16036748,transparent:!0,opacity:.12,side:fi}));y.rotation.x=-Math.PI/2,y.position.y=-x*.65,o.add(y);let M=0;const A=()=>{f.rotation.y+=.0024,c.render(o,l),M=requestAnimationFrame(A)};return A(),()=>{cancelAnimationFrame(M),d.disconnect(),c.dispose(),o.traverse(_=>{if(_ instanceof Nn||_ instanceof ZM){_.geometry.dispose();const T=_.material;Array.isArray(T)?T.forEach(R=>R.dispose()):T.dispose()}}),s.contains(c.domElement)&&s.removeChild(c.domElement)}},[t,e]),a.jsx("div",{ref:r,className:"relative h-full min-h-[480px] w-full overflow-hidden rounded-2xl bg-[#fdfbf8] border border-[#EDE8E2]","aria-label":"Interactive crystal structure visualization",children:(n||i)&&a.jsxs("div",{className:"pointer-events-none absolute left-4 top-4 z-10 max-w-[70%] rounded-xl bg-white/90 px-3.5 py-2 shadow-sm backdrop-blur-sm border border-[#EDE8E2]",children:[n&&a.jsx("p",{className:"font-mono text-xs font-bold text-[#1E2227]",children:n}),i&&a.jsx("p",{className:"mt-0.5 text-[9px] uppercase tracking-[.14em] text-[#8C929C] font-medium",children:i})]})})}function kn(t,e){const n=t.find(i=>i.toLowerCase().startsWith(e.toLowerCase()));return(n==null?void 0:n.split(/\s+/).slice(1).join(" ").trim())||""}function tr(t){return t.replace(/[()]/g,"").trim()}async function m3(t){var o;const n=(await t.text()).split(/\r?\n/).map(l=>l.trim()).filter(Boolean),i=[],r=n.findIndex(l=>l.toLowerCase()==="loop_");if(r>=0){const l=[];let c=r+1;for(;c<n.length&&n[c].startsWith("_");)l.push(n[c++]);const u=l.findIndex(m=>/type_symbol|label/i.test(m)),d=l.findIndex(m=>/fract_x/i.test(m)),p=l.findIndex(m=>/fract_y/i.test(m)),h=l.findIndex(m=>/fract_z/i.test(m));for(;c<n.length&&!n[c].startsWith("loop_")&&!n[c].startsWith("_")&&!n[c].startsWith("data_");){const m=n[c].split(/\s+/);if(u>=0&&d>=0&&p>=0&&h>=0){const v=Number.parseFloat(m[d]),b=Number.parseFloat(m[p]),x=Number.parseFloat(m[h]);[v,b,x].every(Number.isFinite)&&i.push({species:m[u],fractional_coordinates:[v,b,x]})}c+=1}}if(!i.length)throw new Error("No fractional atom coordinates were found in this CIF.");return{formula:(kn(n,"_chemical_formula_sum")||kn(n,"_chemical_formula_structural")||"Uploaded structure").replace(/[']/g,""),data_block:((o=n.find(l=>l.toLowerCase().startsWith("data_")))==null?void 0:o.slice(5))||"uploaded",space_group:tr(kn(n,"_space_group_name_h-m")||kn(n,"_symmetry_space_group_name_h-m")||"Unknown"),space_group_number:tr(kn(n,"_space_group_it_number")||kn(n,"_symmetry_int_tables_number")||"—"),lattice:{a:tr(kn(n,"_cell_length_a")),b:tr(kn(n,"_cell_length_b")),c:tr(kn(n,"_cell_length_c")),alpha:tr(kn(n,"_cell_angle_alpha")),beta:tr(kn(n,"_cell_angle_beta")),gamma:tr(kn(n,"_cell_angle_gamma"))},atoms:i}}const Ju=[{id:"LiCoO2",formula:"LiCoO₂",name:"Lithium cobalt oxide",system:"Trigonal",spaceGroup:"R -3 m · 166",lattice:{a:2.816,b:2.816,c:14.054,alpha:90,beta:90,gamma:120},atoms:[{species:"Li",fractional_coordinates:[0,0,0]},{species:"Li",fractional_coordinates:[.5,.5,.5]},{species:"Co",fractional_coordinates:[0,0,.5]},{species:"Co",fractional_coordinates:[.5,.5,0]},{species:"O",fractional_coordinates:[0,0,.24]},{species:"O",fractional_coordinates:[0,0,.76]},{species:"O",fractional_coordinates:[.5,.5,.24]},{species:"O",fractional_coordinates:[.5,.5,.76]}]},{id:"LiFePO4",formula:"LiFePO₄",name:"Lithium iron phosphate",system:"Orthorhombic",spaceGroup:"P n m a · 62",lattice:{a:10.334,b:6.01,c:4.693,alpha:90,beta:90,gamma:90},atoms:[{species:"Li",fractional_coordinates:[0,0,0]},{species:"Fe",fractional_coordinates:[.25,.5,.25]},{species:"P",fractional_coordinates:[.4,.25,.1]},{species:"O",fractional_coordinates:[.1,.2,.3]}]},{id:"LLZO",formula:"Li₇La₃Zr₂O₁₂",name:"Lithium lanthanum zirconium oxide",system:"Cubic",spaceGroup:"I a -3 d · 230",lattice:{a:12.968,b:12.968,c:12.968,alpha:90,beta:90,gamma:90},atoms:[{species:"Zr",fractional_coordinates:[0,0,0]},{species:"La",fractional_coordinates:[.25,.25,.25]},{species:"Li",fractional_coordinates:[.12,.35,.48]},{species:"O",fractional_coordinates:[.1,.2,.3]}]}];function dg(){const[t,e]=L.useState("LiCoO2"),[n,i]=L.useState(null),[r,s]=L.useState(!1),[o,l]=L.useState(null),[c,u]=L.useState(!0),d=Ju.find(f=>f.id===t)??Ju[0],p=(n==null?void 0:n.atoms)??d.atoms,h=n?{a:Number.parseFloat(n.lattice.a)||5,b:Number.parseFloat(n.lattice.b)||5,c:Number.parseFloat(n.lattice.c)||5,alpha:90,beta:90,gamma:90}:d.lattice,m=(n==null?void 0:n.formula)??d.formula,v=n?"Uploaded CIF · local structure":`IndianMatter library · ${d.id}`,b=L.useMemo(()=>Array.from(new Set(p.map(f=>f.species))),[p]),x=async f=>{if(f){s(!0),l(null);try{i(await m3(f))}catch(g){i(null),l(g instanceof Error?g.message:"CIF parsing failed.")}finally{s(!1)}}};return a.jsx("div",{className:"w-full max-w-[1550px] mx-auto space-y-6 px-4 sm:px-8 py-6 text-im-text",children:a.jsxs("div",{children:[a.jsxs("header",{className:"mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D47E30] font-headline",children:[a.jsx(oo,{size:14})," Structure Intelligence Engine"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227] tracking-tight",children:"Crystal Structure Studio"}),a.jsx("p",{className:"mt-1 max-w-2xl text-sm text-[#6C737E]",children:"Inspect crystallographic lattice geometry, atomic coordination, and material identity in an interactive 3D WebGL workspace."})]}),a.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[a.jsxs("div",{className:"flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700",children:[a.jsx(Wh,{size:14})," WebGL ready"]}),a.jsxs("label",{className:"flex cursor-pointer items-center gap-2 rounded-xl bg-[#D47E30] hover:bg-[#B8671E] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all",children:[a.jsx(GS,{size:15})," Upload CIF",a.jsx("input",{type:"file",accept:".cif",className:"hidden",onChange:f=>{var g;return x((g=f.target.files)==null?void 0:g[0])}})]})]})]}),a.jsxs("div",{className:"grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]",children:[a.jsxs("aside",{className:"order-2 rounded-[2rem] border border-[#EDE8E2] bg-white p-5 shadow-card xl:order-1",children:[a.jsxs("div",{className:"mb-4 flex items-center justify-between",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C929C]",children:"Structure library"}),a.jsx("p",{className:"mt-0.5 text-base font-headline font-bold text-[#1E2227]",children:"Curated Presets"})]}),a.jsx("div",{className:"w-8 h-8 rounded-xl bg-[#FDF5EE] flex items-center justify-center text-[#D47E30]",children:a.jsx(XS,{size:17})})]}),a.jsx("div",{className:"space-y-2",children:Ju.map(f=>{const g=!n&&d.id===f.id;return a.jsxs("button",{type:"button",onClick:()=>{e(f.id),i(null)},className:`w-full rounded-2xl border p-3.5 text-left transition-all ${g?"border-[#D47E30] bg-[#FDF5EE] shadow-sm":"border-[#EDE8E2] bg-white hover:border-[#D47E30]/40 hover:bg-[#FAF4EE]/40"}`,children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{className:"font-mono text-sm font-bold text-[#1E2227]",children:f.formula}),g&&a.jsx("span",{className:"h-2 w-2 rounded-full bg-[#D47E30] shadow-[0_0_8px_rgba(212,126,48,0.5)]"})]}),a.jsx("p",{className:"mt-1 text-xs text-[#6C737E]",children:f.name}),a.jsxs("p",{className:"mt-2 text-[10px] font-medium text-[#8C929C]",children:[f.system," · ",f.spaceGroup]})]},f.id)})}),a.jsx("div",{className:"my-5 h-px bg-[#EDE8E2]"}),a.jsxs("button",{type:"button",onClick:()=>u(f=>!f),className:"flex w-full items-center justify-between text-xs font-semibold text-[#1E2227] hover:text-[#D47E30] transition-colors",children:[a.jsx("span",{children:"Viewer preferences"}),a.jsx(Gh,{size:14,className:`transition-transform duration-200 ${c?"rotate-180":""}`})]}),c&&a.jsxs("div",{className:"mt-3 space-y-2.5 text-xs text-[#6C737E]",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{children:"Renderer"}),a.jsx("span",{className:"font-mono text-[#1E2227] font-medium",children:"WebGL 2.0"})]}),a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{children:"Antialiasing"}),a.jsx("span",{className:"text-emerald-700 font-medium",children:"Active"})]}),a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{children:"Source fidelity"}),a.jsx("span",{className:"text-[#D47E30] font-medium",children:"High"})]})]})]}),a.jsxs("section",{className:"order-1 min-w-0 xl:order-2",children:[a.jsxs("div",{className:"overflow-hidden rounded-[2rem] border border-[#EDE8E2] bg-white shadow-card",children:[a.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE8E2] bg-[#FAF4EE]/30 px-6 py-4",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-[#D47E30]",children:"Active structure"}),a.jsx("h2",{className:"mt-0.5 text-xl font-headline font-bold text-[#1E2227] tracking-tight",children:m})]}),a.jsxs("div",{className:"flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full",children:[a.jsx(Er,{size:14})," Validated geometry"]})]}),a.jsx("div",{className:"p-3 sm:p-4 bg-[#FDFBF8]/60 min-h-[500px]",children:a.jsx(p3,{atoms:p,lattice:h,materialLabel:m,sourceLabel:v})})]}),r&&a.jsx("div",{className:"mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 font-medium flex items-center gap-2",children:"Parsing CIF with the structure service…"}),o&&a.jsxs("div",{role:"alert",className:"mt-3 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-900 font-medium",children:[a.jsx("span",{children:o}),a.jsx("button",{type:"button",onClick:()=>l(null),children:a.jsx(Ys,{size:15})})]})]}),a.jsxs("aside",{className:"order-3 space-y-5",children:[a.jsxs("section",{className:"rounded-[2rem] border border-[#EDE8E2] bg-white p-5 shadow-card space-y-4",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C929C]",children:"Structure profile"}),a.jsx("h3",{className:"mt-0.5 text-base font-headline font-bold text-[#1E2227]",children:n?"Uploaded CIF":d.name})]}),a.jsx("div",{className:"w-8 h-8 rounded-xl bg-[#FDF5EE] flex items-center justify-center text-[#D47E30]",children:a.jsx(Yh,{size:16})})]}),a.jsx("div",{className:"space-y-2",children:[["Crystal system",n!=null&&n.space_group?"Parsed structure":d.system],["Space group",(n==null?void 0:n.space_group)??d.spaceGroup],["Unique elements",`${b.length} species`],["Atom sites",`${p.length} sites`]].map(([f,g])=>a.jsxs("div",{className:"rounded-xl border border-[#EDE8E2] bg-[#FAF4EE]/40 px-3.5 py-2.5",children:[a.jsx("p",{className:"text-[10px] uppercase font-semibold text-[#8C929C]",children:f}),a.jsx("p",{className:"mt-0.5 text-xs font-semibold text-[#1E2227]",children:g})]},f))})]}),a.jsxs("section",{className:"rounded-[2rem] border border-[#EDE8E2] bg-white p-5 shadow-card",children:[a.jsx("p",{className:"text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C929C]",children:"Lattice parameters"}),a.jsx("div",{className:"mt-3 grid grid-cols-2 gap-2",children:[["a",h.a],["b",h.b],["c",h.c],["volume",h.a*h.b*h.c]].map(([f,g])=>a.jsxs("div",{className:"rounded-xl border border-[#EDE8E2] bg-[#FAF4EE]/40 px-3 py-2",children:[a.jsx("p",{className:"text-[10px] uppercase font-bold text-[#8C929C]",children:f}),a.jsxs("p",{className:"mt-0.5 font-mono text-xs font-bold text-[#1E2227]",children:[Number(g).toFixed(f==="volume"?1:3)," ",a.jsxs("span",{className:"text-[9px] text-[#8C929C]",children:["Å",f==="volume"?"³":""]})]})]},f))})]}),a.jsxs("div",{className:"flex gap-2.5",children:[a.jsxs("button",{type:"button",onClick:()=>window.location.reload(),className:"flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#EDE8E2] bg-white hover:bg-im-surfaceAlt px-3 py-2.5 text-xs font-semibold text-[#1E2227] shadow-sm transition-colors",children:[a.jsx(co,{size:14})," Reset"]}),a.jsxs("button",{type:"button",onClick:()=>alert("Structure export queued."),className:"flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D47E30] hover:bg-[#B8671E] px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-colors",children:[a.jsx(ji,{size:14})," Export"]})]})]})]}),a.jsxs("footer",{className:"mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDE8E2] pt-4 text-[11px] text-[#8C929C]",children:[a.jsx("span",{children:"IndianMatter Structure Intelligence · Interactive WebGL preview"}),a.jsx("span",{children:"All visual coordinates reflect the active crystal lattice record"})]})]})})}function fg(){const[t,e]=L.useState(""),n=[{title:"Machine Learning Interatomic Potentials for Next-Generation Solid Electrolytes",authors:"Chen, L., Srinivasan, V., et al.",journal:"Nature Materials",year:2024,citations:142,doi:"10.1038/s41563-024-01822-x",tags:["MLIP","Solid-State","NASICON"]},{title:"Direct Synthesis and High-Throughput DFT Validation of Halide Perovskite Solar Materials",authors:"Sharma, R., Patel, K., et al.",journal:"Advanced Energy Materials",year:2023,citations:89,doi:"10.1002/aenm.202301992",tags:["Perovskite","DFT","Photovoltaics"]},{title:"Crystal Graph Neural Networks for Ultra-Fast Band Gap Prediction in Battery Cathodes",authors:"Gupta, A., Wang, Y., et al.",journal:"Physical Review Materials",year:2024,citations:67,doi:"10.1103/PhysRevMaterials.8.043801",tags:["GNN","Cathodes","Band Gap"]}];return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(Gv,{size:14})," Knowledge Exploration"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Literature & Diversity Analysis"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Explore published literature correlations, chemical space diversity projections, and crystal structure citations."})]}),a.jsx("div",{className:"bg-white rounded-[2rem] p-6 shadow-card border border-[#EFE5DC] space-y-4",children:a.jsxs("div",{className:"relative",children:[a.jsx(ia,{className:"absolute left-4 top-1/2 -translate-y-1/2 text-[#8C929C]",size:18}),a.jsx("input",{type:"text",value:t,onChange:i=>e(i.target.value),placeholder:"Search publications by keyword, crystal system, author, or DOI...",className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-[#1E2227] outline-none focus:border-[#F1641D]"})]})}),a.jsxs("div",{className:"bg-white rounded-[2.5rem] p-8 shadow-card border border-[#EFE5DC] flex flex-col md:flex-row items-center justify-between gap-8",children:[a.jsxs("div",{className:"space-y-3 max-w-xl",children:[a.jsx("span",{className:"text-xs font-bold text-[#F1641D] uppercase tracking-wider font-headline",children:"Chemical Diversity Projection"}),a.jsx("h3",{className:"text-2xl font-headline font-bold text-[#1E2227]",children:"Explored vs. Unexplored Chemical Space"}),a.jsx("p",{className:"text-xs text-[#5F6771] leading-relaxed",children:"t-SNE dimensional reduction mapping 140,000+ Materials Project structures against published synthesis papers. Dense clusters represent established oxide chemistries; sparse regions highlight novel exploration targets."}),a.jsxs("div",{className:"flex gap-4 text-xs font-semibold pt-2",children:[a.jsxs("span",{className:"flex items-center gap-1.5",children:[a.jsx("span",{className:"w-2.5 h-2.5 bg-[#F1641D] rounded-full"})," Explored Syntheses"]}),a.jsxs("span",{className:"flex items-center gap-1.5",children:[a.jsx("span",{className:"w-2.5 h-2.5 bg-[#2E7D32] rounded-full"})," High-Confidence Predicted"]})]})]}),a.jsx("div",{className:"w-56 h-44 bg-[#FAF4EE] rounded-2xl border border-[#EFE5DC] flex items-center justify-center p-4",children:a.jsxs("div",{className:"text-center",children:[a.jsx(Yh,{size:32,className:"text-[#F1641D] mx-auto mb-2"}),a.jsx("p",{className:"text-xs font-bold text-[#1E2227]",children:"Latent Space Map"}),a.jsx("p",{className:"text-[10px] text-[#8C929C]",children:"UMAP 2D Projection"})]})})]}),a.jsxs("div",{className:"space-y-4",children:[a.jsx("h3",{className:"font-headline font-bold text-xl text-[#1E2227]",children:"Correlated Research Publications"}),a.jsx("div",{className:"space-y-3",children:n.map((i,r)=>a.jsxs("div",{className:"bg-white rounded-2xl p-6 shadow-sm border border-[#EFE5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow",children:[a.jsxs("div",{className:"space-y-1.5",children:[a.jsx("h4",{className:"font-headline font-bold text-base text-[#1E2227]",children:i.title}),a.jsxs("p",{className:"text-xs text-[#5F6771]",children:[i.authors," • ",a.jsx("span",{className:"font-medium text-[#1E2227]",children:i.journal})," (",i.year,")"]}),a.jsx("div",{className:"flex flex-wrap gap-1.5 pt-1",children:i.tags.map(s=>a.jsx("span",{className:"px-2.5 py-0.5 bg-[#FAF4EE] rounded-md text-[10px] font-medium text-[#5B636E]",children:s},s))})]}),a.jsxs("div",{className:"flex items-center gap-3 shrink-0",children:[a.jsxs("span",{className:"text-xs text-[#8C929C] font-mono",children:[i.citations," citations"]}),a.jsxs("a",{href:`https://doi.org/${i.doi}`,target:"_blank",rel:"noopener noreferrer",className:"px-3.5 py-2 bg-[#FAF4EE] text-[#F1641D] rounded-xl text-xs font-semibold hover:bg-[#FBE8D8] transition-colors flex items-center gap-1",children:["DOI ",a.jsx(Xh,{size:12})]})]})]},r))})]})]})}function hg(){const[t,e]=L.useState("materials"),n=[{formula:"LiCoO2",name:"Lithium Cobalt Oxide",system:"Trigonal",date:"2026-09-08",id:"mp-22526"},{formula:"Na3Zr2Si2PO12",name:"NASICON Superionic",system:"Trigonal",date:"2026-09-09",id:"oqmd-1218"},{formula:"Li7La3Zr2O12",name:"Garnet LLZO",system:"Cubic",date:"2026-09-10",id:"mp-942732"}];return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(Vh,{size:14})," Research Workspace"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Saved Collections"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Access bookmarked crystal structures, completed DFT runs, GNN property inferences, and synthesized CIFs."})]}),a.jsxs("button",{onClick:()=>alert("Consolidated research archive exported (ZIP)."),className:"px-4 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] flex items-center gap-2 shadow-soft shrink-0",children:[a.jsx(ji,{size:14})," Export Workspace (ZIP)"]})]}),a.jsx("div",{className:"bg-white rounded-2xl p-2 shadow-sm border border-[#EFE5DC] flex flex-wrap gap-2",children:[{id:"materials",label:"Saved Materials (3)"},{id:"predictions",label:"GNN Predictions (8)"},{id:"dft",label:"DFT Runs (4)"},{id:"cif",label:"Synthesized CIFs (5)"}].map(i=>a.jsx("button",{onClick:()=>e(i.id),className:`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${t===i.id?"bg-[#FBE8D8] text-[#F1641D] shadow-sm":"text-[#5F6771] hover:text-[#1E2227]"}`,children:i.label},i.id))}),a.jsx("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC]",children:a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-left text-xs",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"border-b border-[#F2E7DC] text-[#8C929C] font-headline uppercase text-[10px]",children:[a.jsx("th",{className:"py-3 px-4",children:"Formula"}),a.jsx("th",{className:"py-3 px-4",children:"Identifier / ID"}),a.jsx("th",{className:"py-3 px-4",children:"Crystal System"}),a.jsx("th",{className:"py-3 px-4",children:"Saved Date"}),a.jsx("th",{className:"py-3 px-4 text-right",children:"Actions"})]})}),a.jsx("tbody",{className:"divide-y divide-[#FAF4EE]",children:n.map((i,r)=>a.jsxs("tr",{className:"hover:bg-[#FAF4EE]/60 transition-colors",children:[a.jsx("td",{className:"py-4 px-4 font-bold text-[#1E2227] font-headline text-sm",children:i.formula}),a.jsx("td",{className:"py-4 px-4 font-mono text-[#5F6771]",children:i.id}),a.jsx("td",{className:"py-4 px-4 text-[#5F6771]",children:i.system}),a.jsx("td",{className:"py-4 px-4 text-[#8C929C]",children:i.date}),a.jsxs("td",{className:"py-4 px-4 text-right space-x-2",children:[a.jsx("button",{onClick:()=>alert(`Downloaded ${i.formula} CIF`),className:"p-1.5 hover:bg-[#FAF4EE] rounded-lg text-[#5F6771] hover:text-[#1E2227]",title:"Download",children:a.jsx(ji,{size:14})}),a.jsx("button",{onClick:()=>alert(`Removed ${i.formula} from saved collection.`),className:"p-1.5 hover:bg-red-50 rounded-lg text-[#8C929C] hover:text-red-600",title:"Delete",children:a.jsx(eb,{size:14})})]})]},r))})]})})})]})}function pg(){const[t,e]=L.useState("Dr. Srinivasan"),[n,i]=L.useState("researcher@lab.edu"),[r,s]=L.useState("Solid State Ionics Laboratory"),[o,l]=L.useState("mp_live_9481940184029481");return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(uo,{size:14})," Workspace Configuration"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Researcher Settings"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Manage your laboratory affiliation, API access tokens, units of measurement, and cluster credentials."})]}),a.jsxs("div",{className:"max-w-3xl space-y-6",children:[a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Researcher Profile"}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block font-semibold text-[#1E2227] mb-1.5",children:"Full Name"}),a.jsx("input",{type:"text",value:t,onChange:c=>e(c.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2.5 outline-none focus:border-[#F1641D]"})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block font-semibold text-[#1E2227] mb-1.5",children:"Email Address"}),a.jsx("input",{type:"email",value:n,onChange:c=>i(c.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2.5 outline-none focus:border-[#F1641D]"})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:"block font-semibold text-[#1E2227] mb-1.5",children:"Laboratory Affiliation"}),a.jsx("input",{type:"text",value:r,onChange:c=>s(c.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2.5 outline-none focus:border-[#F1641D]"})]})]}),a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"API Credentials"}),a.jsx("p",{className:"text-xs text-[#6C737E]",children:"Connect your Materials Project API Key to enable automated cross-federation querying."}),a.jsxs("div",{children:[a.jsx("label",{className:"block font-semibold text-[#1E2227] mb-1.5",children:"Materials Project API Key"}),a.jsxs("div",{className:"relative",children:[a.jsx(WS,{className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]",size:15}),a.jsx("input",{type:"password",value:o,onChange:c=>l(c.target.value),className:"w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono outline-none focus:border-[#F1641D]"})]})]})]}),a.jsx("div",{className:"flex justify-end",children:a.jsx("button",{onClick:()=>alert("Settings saved successfully."),className:"px-6 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft",children:"Save Changes"})})]})]})}function mg(){const t=[{q:"What graph neural network architectures power property predictions?",a:"IndianMatter utilizes M3GNet, ALIGNN, and CHGNet pre-trained on Materials Project 2024.1 datasets, calibrated with 95% confidence intervals."},{q:"How does DFT validation work?",a:"Calculations are dispatched using Quantum ESPRESSO / VASP backend clusters employing PBE, PBEsol, and SCAN meta-GGA exchange-correlation functionals."},{q:"Which CIF format versions are supported for batch screening?",a:"The parser supports standard CIF 1.1, CIF3, and CIF5 specifications. Malformed files are flagged in the pre-flight verification queue."}];return a.jsxs("div",{className:"w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6",children:[a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1",children:[a.jsx(Xv,{size:14})," Knowledge & Documentation"]}),a.jsx("h1",{className:"text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]",children:"Help & Scientific Support"}),a.jsx("p",{className:"text-sm text-[#6C737E] max-w-2xl mt-1",children:"Reference documentation on crystallographic conventions, machine learning model benchmarks, and computational methodology."})]}),a.jsxs("div",{className:"max-w-3xl space-y-6",children:[a.jsxs("div",{className:"bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5",children:[a.jsx("h3",{className:"font-headline font-bold text-lg text-[#1E2227]",children:"Frequently Asked Questions"}),a.jsx("div",{className:"space-y-4 text-xs",children:t.map((e,n)=>a.jsxs("div",{className:"bg-[#FAF4EE] p-4 rounded-xl border border-[#EFE5DC] space-y-1.5",children:[a.jsx("p",{className:"font-bold text-[#1E2227]",children:e.q}),a.jsx("p",{className:"text-[#5F6771] leading-relaxed",children:e.a})]},n))})]}),a.jsxs("div",{className:"bg-[#FAF4EE] rounded-[2rem] p-6 sm:p-8 border border-[#EFE5DC] flex items-center justify-between gap-4",children:[a.jsxs("div",{children:[a.jsx("h4",{className:"font-headline font-bold text-base text-[#1E2227]",children:"Need Dedicated Research Support?"}),a.jsx("p",{className:"text-xs text-[#6C737E] mt-0.5",children:"Contact our computational physics advisory team for custom functional setup or large-scale batch processing."})]}),a.jsx("button",{onClick:()=>alert("Support ticket created. A computational scientist will respond within 4 hours."),className:"px-5 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft shrink-0",children:"Submit Research Ticket"})]})]})]})}function nr({children:t}){const{isAuthenticated:e}=Lc(),n=Hi();if(!e){const i=n.pathname+n.search;return a.jsx(jv,{to:`/signin?redirect=${encodeURIComponent(i)}`,replace:!0})}return a.jsx(a.Fragment,{children:t})}function x3(){return a.jsx(AS,{children:a.jsx(ob,{children:a.jsxs(_S,{children:[a.jsxs($e,{element:a.jsx(cb,{}),children:[a.jsx($e,{path:"/",element:a.jsx(fb,{})}),a.jsx($e,{path:"/signin",element:a.jsx(pb,{})})]}),a.jsxs($e,{path:"/app",element:a.jsx(nr,{children:a.jsx(Yi,{})}),children:[a.jsx($e,{index:!0,element:a.jsx(Jm,{})}),a.jsx($e,{path:"materials",element:a.jsx(tx,{})}),a.jsx($e,{path:"materials/:id",element:a.jsx(nx,{})}),a.jsx($e,{path:"advanced-search",element:a.jsx(ix,{})}),a.jsx($e,{path:"dft",element:a.jsx(rx,{})}),a.jsx($e,{path:"cif-gen",element:a.jsx(sx,{})}),a.jsx($e,{path:"predict",element:a.jsx(cx,{})}),a.jsx($e,{path:"structures",element:a.jsx(dg,{})}),a.jsx($e,{path:"batch",element:a.jsx(ox,{})}),a.jsx($e,{path:"literature",element:a.jsx(fg,{})}),a.jsx($e,{path:"saved",element:a.jsx(hg,{})}),a.jsx($e,{path:"settings",element:a.jsx(pg,{})}),a.jsx($e,{path:"help",element:a.jsx(mg,{})})]}),a.jsxs($e,{path:"/dashboard",element:a.jsx(nr,{children:a.jsx(Yi,{})}),children:[a.jsx($e,{index:!0,element:a.jsx(Jm,{})}),a.jsx($e,{path:"dft-validation",element:a.jsx(rx,{})}),a.jsx($e,{path:"cif-generation",element:a.jsx(sx,{})}),a.jsx($e,{path:"property-prediction",element:a.jsx(cx,{})}),a.jsx($e,{path:"structure-visualization",element:a.jsx(dg,{})}),a.jsx($e,{path:"batch-prediction",element:a.jsx(ox,{})})]}),a.jsxs($e,{path:"/materials-search",element:a.jsx(nr,{children:a.jsx(Yi,{})}),children:[a.jsx($e,{index:!0,element:a.jsx(tx,{})}),a.jsx($e,{path:"advanced",element:a.jsx(ix,{})})]}),a.jsx($e,{path:"/materials",element:a.jsx(nr,{children:a.jsx(Yi,{})}),children:a.jsx($e,{path:":id",element:a.jsx(nx,{})})}),a.jsx($e,{path:"/literature-diversity",element:a.jsx(nr,{children:a.jsx(Yi,{})}),children:a.jsx($e,{index:!0,element:a.jsx(fg,{})})}),a.jsx($e,{path:"/saved-results",element:a.jsx(nr,{children:a.jsx(Yi,{})}),children:a.jsx($e,{index:!0,element:a.jsx(hg,{})})}),a.jsx($e,{path:"/settings",element:a.jsx(nr,{children:a.jsx(Yi,{})}),children:a.jsx($e,{index:!0,element:a.jsx(pg,{})})}),a.jsx($e,{path:"/help-support",element:a.jsx(nr,{children:a.jsx(Yi,{})}),children:a.jsx($e,{index:!0,element:a.jsx(mg,{})})}),a.jsx($e,{path:"*",element:a.jsx(jv,{to:"/",replace:!0})})]})})})}const g3={theme:"system",setTheme:()=>null},v3=L.createContext(g3);function _3({children:t,defaultTheme:e="system",storageKey:n="vite-ui-theme",...i}){const[r,s]=L.useState(()=>typeof window>"u"?e:window.localStorage.getItem(n)||e);L.useEffect(()=>{const l=window.document.documentElement;if(l.classList.remove("light","dark"),r==="system"){const c=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";l.classList.add(c);return}l.classList.add(r)},[r]);const o={theme:r,setTheme:l=>{window.localStorage.setItem(n,l),s(l)}};return a.jsx(v3.Provider,{...i,value:o,children:t})}const y3="635274602034-pjssntimvqimvijg8t0murgnpmvdus0o.apps.googleusercontent.com";Qu.createRoot(document.getElementById("root")).render(a.jsx(gc.StrictMode,{children:a.jsx(Nv,{clientId:y3,children:a.jsx(_3,{children:a.jsx(x3,{})})})}));
