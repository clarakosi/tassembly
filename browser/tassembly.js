!function(s){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=s();else if("function"==typeof define&&define.amd)define([],s);else{var h;"undefined"!=typeof window?h=window:"undefined"!=typeof global?h=global:"undefined"!=typeof self&&(h=self);h.tassembly=s()}}(function(){return function h(l,r,e){function k(a,c){if(!r[a]){if(!l[a]){var d="function"==typeof require&&require;if(!c&&d)return d(a,!0);if(p)return p(a,!0);throw Error("Cannot find module '"+a+"'");}d=r[a]={exports:{}};
l[a][0].call(d.exports,function(b){var c=l[a][1][b];return k(c?c:b)},d,d.exports,h,l,r,e)}return r[a].exports}for(var p="function"==typeof require&&require,q=0;q<e.length;q++)k(e[q]);return k}({1:[function(h,l,r){function e(a){this.protocolRegex=k}var k=RegExp("^(http://|https://|ftp://|irc://|ircs://|gopher://|telnet://|nntp://|worldwind://|mailto:|news:|svn://|git://|mms://|//)","i"),p=/&([A-Za-z0-9\x80-\xff]+);|&\#([0-9]+);|&\#[xX]([0-9A-Fa-f]+);|(&)/;e.prototype.decodeCharReferences=function(a){var c=
this;return a.replace(p,function(a,b,t,f,g){return b?c.decodeEntity(b):t?c.decodeChar(parseInt(t,10)):f?c.decodeChar(parseInt(f,16)):g})};var q=RegExp("[\t ]|\u00ad|\u1806|\u200b|\u2060|\ufeff|\u034f|\u180b|\u180c|\u180d|\u200c|\u200d|[\ufe00-\ufe0f]","g");e.prototype.cssDecodeRE=/\\(?:((?:\n|\r\n|\r|\f))|([0-9A-Fa-f]{1,6})[\x20\t\r\n\f]?|(.)|()$)/;e.prototype.sanitizeStyle=function(a){function c(a,c){var d,g;"'"===c?(d=/'/g,g=/'([^'\n\r\f]*)$/):(d=/"/g,g=/"([^"\n\r\f]*)$/);if(1===(a.match(d)||[]).length%
2)a=a.replace(g,function(a,b){return" "+b});return a}a=this.decodeCharReferences(a);a=a.replace(this.cssDecodeRE,function(a,c,d,g){var e;if(void 0!==c)return"";if(void 0!==d){a=parseInt(d,16);try{e=String.fromCharCode(a)}catch(n){e=a.toString()}}else e=void 0!==g?g:"\\";return"\n"===e||'"'===e||"'"===e||"\\"===e?"\\"+e.charCodeAt(0).toString(16)+" ":e});a=a.replace(/\/\*.*\*\//g," ");a=c(a,"'");a=c(a,'"');var d=a.indexOf("/*");0<=d&&(a=a.substr(0,d));return/[\000-\010\016-\037\177]/.test(a)?"/* invalid control char */":
/expression|filter\s*:|accelerator\s*:|url\s*\(/i.test(a)?"/* insecure input */":a};e.prototype.sanitizeHref=function(a){var c=a.match(/^((?:[a-zA-Z][^:\/]*:)?(?:\/\/)?)([^\/]+)(\/?.*)/),d,b;if(c){if(d=c[1],b=c[2],a=c[3],!d.match(this.protocolRegex))return null}else b=d="";b=b.replace(q,"");return d+b+a};l.exports={AttributeSanitizer:e}},{}],2:[function(h,l,r){function e(){this.uid=0;this.cache={};this.partials={}}function k(a){var c="",d=-1,b="";do{if(/^$|[\[:(,]/.test(b))c+=b,/[pri]/.test(a[d+1])&&
/(?:p(?:[cm]s?)?|r[mc]|i)(?:[\.\)\]}]|$)/.test(a.slice(d+1))&&(c+="c.");else if("'"===b){if(b=a.slice(d).match(/'(?:[^\\']+|\\')*'/))c+=b[0],d+=b[0].length-1}else c+=b;d++;b=a[d]}while(b);return c}function p(a){a=""+a;if(q.test(a))return a=k(a);if(/^'/.test(a))return JSON.stringify(a.slice(1,-1).replace(/\\'/g,"'"));if(/^[cm](?:\.[a-zA-Z_$]*)?$/.test(a))return a;a=k(a);return"(function() { try {return "+a+';} catch (e) { console.error("Error in " + '+JSON.stringify(a)+'+": " + e.toString()); return "";}})()'}
h=new (h("./AttributeSanitizer.js").AttributeSanitizer);e.prototype.attrSanitizer=h;e.prototype._getUID=function(){this.uid++;return this.uid};var q=/^(m|p(?:[cm]s?)?|r[mc]|i|c)\.([a-zA-Z_$]+)$/;e.prototype._evalExpr=function(a,c){var d=this.cache["expr"+a];if(!d){if(d=a.match(q))return c[d[1]][d[2]];if(/^'.*'$/.test(a))return a.slice(1,-1).replace(/\\'/g,"'");d=new Function("c","var m = c.m;return "+k(a));this.cache["expr"+a]=d}if(d)try{return d(c)}catch(b){return console.error("Error while evaluating "+
a),console.error(b),""}return a};e.prototype._getTemplate=function(a,c){if(Array.isArray(a))return a;/^'/.test(a)&&(a=a.slice(1,-1).replace(/\\'/g,"'"));return c.rc.options.partials[a]};e.prototype.ctlFn_foreach=function(a,c){var d=this._evalExpr(a.data,c);if(d&&Array.isArray(d))for(var b=this.compile(this._getTemplate(a.tpl),c),e=d.length,f=this.childContext(null,c),g=0;g<e;g++)f.m=d[g],f.pms[0]=d[g],f.i=g,b(f)};e.prototype.ctlFn_template=function(a,c){var d=this._evalExpr(a.data,c),d=this.childContext(d,
c),b=this._getTemplate(a.tpl,c);b&&this._render(b,d)};e.prototype.ctlFn_with=function(a,c){var d=this._evalExpr(a.data,c),b=this._getTemplate(a.tpl,c);d&&b&&(d=this.childContext(d,c),this._render(b,d))};e.prototype.ctlFn_if=function(a,c){this._evalExpr(a.data,c)&&this._render(a.tpl,c)};e.prototype.ctlFn_ifnot=function(a,c){this._evalExpr(a.data,c)||this._render(a.tpl,c)};e.prototype.ctlFn_attr=function(a,c){var d=this,b;Object.keys(a).forEach(function(e){var f=a[e];"string"===typeof f?b=d._evalExpr(a[e],
c):(b=f.v||"",f.app&&Array.isArray(f.app)&&f.app.forEach(function(a){a["if"]&&d._evalExpr(a["if"],c)&&(b+=a.v||"");a.ifnot&&!d._evalExpr(a.ifnot,c)&&(b+=a.v||"")}),!b&&null===f.v&&(b=null));b&&("href"===e||"src"===e?b=this.attrSanitizer.sanitizeHref(b):"style"===e&&(b=this.attrSanitizer.sanitizeStyle(b)));(b||0===b||""===b)&&c.cb(" "+e+'="'+b.toString().replace(/"/g,"&quot;")+'"')})};e.prototype._xmlEncoder=function(a){switch(a){case "<":return"&lt;";case ">":return"&gt;";case "&":return"&amp;";case '"':return"&quot;";
default:return"&#"+a.charCodeAt()+";"}};e.prototype.childContext=function(a,c){return{m:a,pc:c,pm:c.m,pms:[a].concat(c.ps),rm:c.rm,rc:c.rc,cb:c.cb}};e.prototype._assemble=function(a,c){function d(a){e.length&&(b.push("cb("+e.join("+")+");"),e=[]);b.push(a)}var b=[],e=[];b.push("var val;");for(var f=a.length,g=0;g<f;g++){var m=a[g],n=m.constructor;if(n===String)e.push(JSON.stringify(m));else if(n===Array)if(n=m[0],m=m[1],"text"===n)d("val = "+p(m)+';\nval = val || val === 0 ? "" + val : "";\nif(/[<&]/.test(val)) { val = val.replace(/[<&]/g,this._xmlEncoder); }\n'),
e.push("val");else if("attr"===n)for(var n=Object.keys(m),h=0;h<n.length;h++){var k=n[h];if("string"===typeof m[k])b.push("val = "+p(m[k])+";");else{var l=m[k];b.push("val="+JSON.stringify(l.v||""));l.app&&Array.isArray(l.app)&&l.app.forEach(function(a){a["if"]?(b.push("if("+p(a["if"])+"){"),b.push("val += "+JSON.stringify(a.v||"")+";"),b.push("}")):a.ifnot&&(b.push("if(!"+p(a.ifnot)+"){"),b.push("val += "+JSON.stringify(a.v||"")),b.push("}"))});null===l.v&&b.push("if(!val) { val = null; }")}"href"===
k||"src"===k?b.push("if (val) {val = this.attrSanitizer.sanitizeHref(val);}"):"style"===k&&b.push("if (val) {val = this.attrSanitizer.sanitizeStyle(val);}");d('if (val || val === 0 || val === \'\') { \nval = val || val === 0 ? "" + val : "";\nif(/[<&"]/.test(val)) { val = val.replace(/[<&"]/g,this._xmlEncoder); }\ncb('+JSON.stringify(" "+k+'="')+" + val + '\"');}")}else h=this._getUID(),this.cache[h]=m,d("try {"),b.push("this["+JSON.stringify("ctlFn_"+n)+'](this.cache["'+h+'"], c);'),b.push("} catch(e) {"),
b.push("console.error('Unsupported control function:', "+JSON.stringify(n)+", e.stack);"),b.push("}");else console.error("Unsupported type:",m)}d("");return b.join("\n")};e.prototype.render=function(a,c,d){d||(d={});c={rm:c,m:c,pms:[c],rc:null,g:d.globals,cb:d.cb,options:d};c.rc=c;var b="";d.cb||(c.cb=function(a){b+=a});this._render(a,c);if(!d.cb)return b};e.prototype._render=function(a,c){if(a.__cachedFn)return a.__cachedFn(c);for(var d=a.length,b=c.cb,e=0;e<d;e++){var f=a[e],g=f.constructor;if(g===
String)b(f);else if(g===Array){var g=f[0],h=f[1];if("text"===g)f=this._evalExpr(h,c),!f&&0!==f&&(f=""),b((""+f).replace(/[<&]/g,this._xmlEncoder));else try{this["ctlFn_"+g](h,c)}catch(k){console.error("Unsupported control function:",f,k)}}else console.error("Unsupported type:",f)}};e.prototype.compile=function(a,c){var d=this,b=c||{};if(a.__cachedFn)return a.__cachedFn;var e="";b.cb?e+="var m = c.m, cb = c.cb;\n":(e+='var res = "", cb = function(bit) { res += bit; };\nvar m = c;\n',e+="c = { rc: null, rm: m, m: m, pms: [m], g: options.globals, options: options, cb: cb }; c.rc = c;\n");
e+=this._assemble(a,b);b.cb||(e+="return res;");var f=new Function("c","options",e),e=function(a){return f.call(d,a,b)};return a.__cachedFn=e};l.exports=new e},{"./AttributeSanitizer.js":1}]},{},[2])(2)});
