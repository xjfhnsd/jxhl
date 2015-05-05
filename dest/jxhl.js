(function(){"use strict";function $jxhl(){this.useCache=false;this.layoutCache={}}$jxhl.prototype.newControl=function(node,baseid){var basecontrol=document.createElement("div");if(node){basecontrol.setAttribute("jxhl_control",node.nodeName);basecontrol.setAttribute("jxhl_baseid",baseid);if(node.getAttribute("id"))basecontrol.id=baseid+"_"+node.getAttribute("id");if(node.getAttribute("css_name"))basecontrol.className=node.getAttribute("css_name");if(node.getAttribute("css_text"))basecontrol.style.cssText=node.getAttribute("css_text");if(node.getAttribute("width"))basecontrol.jxhlWidth=node.getAttribute("width");if(node.getAttribute("height"))basecontrol.jxhlHeight=node.getAttribute("height");if(node.getAttribute("left"))basecontrol.jxhlLeft=node.getAttribute("left");else basecontrol.jxhlLeft=0;if(node.getAttribute("top"))basecontrol.jxhlTop=node.getAttribute("top");else basecontrol.jxhlTop=0;if(node.getAttribute("dock"))basecontrol.dock=node.getAttribute("dock");else basecontrol.dock="auto";if(node.getAttribute("overflow"))basecontrol.overflow=node.getAttribute("overflow");else basecontrol.overflow="hidden";if(node.getAttribute("v_align"))basecontrol.v_align=node.getAttribute("v_align");else basecontrol.v_align="top";if(node.getAttribute("h_align"))basecontrol.h_align=node.getAttribute("h_align");else basecontrol.h_align="left";if(node.getAttribute("visible"))basecontrol.visible=this.toBoolean(node.getAttribute("visible"));else basecontrol.visible=true;if(node.getAttribute("opacity")){var opaF=1;try{opaF=Math.min(1,parseFloat(node.getAttribute("opacity")))}catch(x){}basecontrol.style.opacity=opaF;basecontrol.style.mozOpacity=opaF;basecontrol.style.khtmlOpacity=opaF;basecontrol.style.filter="alpha(opacity="+parseInt(opaF*100)+")"}var margin=node.getAttribute("margin");var padding=node.getAttribute("padding");var border=node.getAttribute("border_width");if(!margin)basecontrol.margin=[0,0,0,0];else if(margin.indexOf(",")==-1)basecontrol.margin=[parseInt(margin),parseInt(margin),parseInt(margin),parseInt(margin)];else basecontrol.margin=eval("(["+margin+"])");if(!padding)basecontrol.padding=[0,0,0,0];else if(padding.indexOf(",")==-1)basecontrol.padding=[parseInt(padding),parseInt(padding),parseInt(padding),parseInt(padding)];else basecontrol.padding=eval("(["+padding+"])");if(!border)basecontrol.border=[0,0,0,0];else if(border.indexOf(",")==-1)basecontrol.border=[parseInt(border),parseInt(border),parseInt(border),parseInt(border)];else basecontrol.border=eval("(["+border+"])");basecontrol.style.borderTopWidth=basecontrol.border[0]+"px";basecontrol.style.borderRightWidth=basecontrol.border[1]+"px";basecontrol.style.borderBottomWidth=basecontrol.border[2]+"px";basecontrol.style.borderLeftWidth=basecontrol.border[3]+"px";if(node.nodeName=="image"){var img=document.createElement("img");if(node.getAttribute("src"))img.setAttribute("src",node.getAttribute("src"));basecontrol.jxhl_image=img;basecontrol.appendChild(img)}if(node.nodeName=="frame"){var frm=document.createElement("iframe");frm.frameBorder=0;frm.frameSpacing=0;if(node.getAttribute("frame_scrolling"))frm.setAttribute("scrolling",node.getAttribute("frame_scrolling"));else frm.setAttribute("scrolling","auto");if(node.getAttribute("src"))frm.setAttribute("src",node.getAttribute("src"));basecontrol.jxhl_frame=frm;basecontrol.appendChild(frm)}if(node.getAttribute("local_var")&&node.getAttribute("local_var")!="jxhl$runnable"&&node.getAttribute("local_var")!="jxhl$container"&&node.getAttribute("local_var")!="jxhl$arguments"){this.runnableObject["jxhl_inner_var$"+baseid][node.getAttribute("local_var")]=basecontrol}}return basecontrol};$jxhl.prototype.parseControl=function(e,t,r){if(e.nodeType==4||e.nodeType==3||e.nodeType==8)return;var n=e.nodeName;if(n=="runnable"){this.runnableObject["jxhl_inner_var$"+r]["jxhl$runnable"]=this.getInnerHtml(e);return}if(!t.childControls)t.childControls=[];var i=this.newControl(e,r);i.style.position="absolute";i.isroot=false;i.parentContainer=t;switch(n){case"html":case"label":if(typeof jQuery!="undefined")$(i).append(this.getInnerHtml(e));else i.innerHTML=this.getInnerHtml(e);t.appendChild(i);t.childControls.push(i);if(n=="html"){var o=i.childNodes;for(var l=0;l<o.length;l++){s.apply(this,[o[l]])}}break;case"frame":t.appendChild(i);t.childControls.push(i);break;case"image":t.appendChild(i);t.childControls.push(i);break;case"panel":t.appendChild(i);t.childControls.push(i);break}if(n=="panel"&&e.childNodes.length>0){for(var a=0;a<e.childNodes.length;a++)this.parseControl(e.childNodes[a],i,r)}function s(){var e=arguments[0];if(e.nodeType!=1)return;if(e.getAttribute("local_var")&&e.getAttribute("local_var")!="jxhl$runnable"&&e.getAttribute("local_var")!="jxhl$container"&&e.getAttribute("local_var")!="jxhl$arguments"){this.runnableObject["jxhl_inner_var$"+r][e.getAttribute("local_var")]=e}var t=e.childNodes;if(t.length==0)return;for(var n=0;n<t.length;n++){s.apply(this,[t[n]])}}};$jxhl.prototype.calcControlPostion=function(e){if(e.parentContainer){if(!e.visible){e.style.display="none";e.jxhl_runtime_visible="disable";return}if(e.jxhl_runtime_visible&&e.jxhl_runtime_visible=="disable"){e.jxhl_runtime_visible=null;e.style.display=""}var t=e.parentContainer;var r=this.calcElementSize(t);if(!t.region)t.region={sx:0,sy:0,ex:r.width,ey:r.height};var n=this.calcElementSize(e);var i=0;var o=0;e.style.position="absolute";switch(e.dock){case"auto":i=n.width-e.margin[1]-e.margin[3]-e.border[1]-e.border[3];o=n.height-e.margin[0]-e.margin[2]-e.border[0]-e.border[2];i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:i,ey:o};e.style.width=i+"px";e.style.height=o+"px";e.style.position="relative";e.style.left=this.convertElementUnit(e.jxhlLeft,e,"h")+e.margin[3]+"px";e.style.top=this.convertElementUnit(e.jxhlTop,e,"v")+e.margin[0]+"px";break;case"none":i=n.width-e.margin[1]-e.margin[3]-e.border[1]-e.border[3];o=n.height-e.margin[0]-e.margin[2]-e.border[0]-e.border[2];i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:0,ey:0};e.style.position="relative";if(this.convertElementUnit(e.jxhlWidth,e,"h"))e.style.width=i+"px";if(this.convertElementUnit(e.jxhlHeight,e,"v"))e.style.height=o+"px";e.style.left=this.convertElementUnit(e.jxhlLeft,e,"h")+e.margin[3]+"px";e.style.top=this.convertElementUnit(e.jxhlTop,e,"v")+e.margin[0]+"px";break;case"top":i=t.region.ex-t.region.sx-e.margin[1]-e.margin[3];o=n.height-e.margin[0]-e.margin[2]-e.border[0]-e.border[2];i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:i,ey:o};e.style.width=i+"px";e.style.height=o+"px";e.style.left=t.region.sx+e.margin[3]+"px";e.style.top=t.region.sy+e.margin[0]+"px";t.region.sy+=n.height;break;case"bottom":i=t.region.ex-t.region.sx-e.margin[1]-e.margin[3];o=n.height-e.margin[0]-e.margin[2]-e.border[0]-e.border[2];i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:i,ey:o};e.style.width=i+"px";e.style.height=o+"px";e.style.left=t.region.sx+e.margin[3]+"px";e.style.top=t.region.ey-n.height+e.margin[0]+"px";t.region.ey-=n.height;break;case"left":i=n.width-e.margin[1]-e.margin[3]-e.border[1]-e.border[3];o=t.region.ey-t.region.sy-e.margin[0]-e.margin[2];i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:i,ey:o};e.style.width=i+"px";e.style.height=o+"px";e.style.left=t.region.sx+e.margin[3]+"px";e.style.top=t.region.sy+e.margin[0]+"px";t.region.sx+=n.width;break;case"right":i=n.width-e.margin[1]-e.margin[3]-e.border[1]-e.border[3];o=t.region.ey-t.region.sy-e.margin[0]-e.margin[2];i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:i,ey:o};e.style.width=i+"px";e.style.height=o+"px";e.style.left=t.region.ex-n.width+e.margin[3]+"px";e.style.top=t.region.sy+e.margin[0]+"px";t.region.ex-=n.width;break;case"fill":i=t.region.ex-t.region.sx-e.margin[1]-e.margin[3];o=t.region.ey-t.region.sy-e.margin[0]-e.margin[2];i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:i,ey:o};e.style.width=i+"px";e.style.height=o+"px";e.style.left=t.region.sx+e.margin[3]+"px";e.style.top=t.region.sy+e.margin[0]+"px";t.region.sx=t.region.ex;t.region.sy=t.region.ey;break;case"fix":i=r.width-t.margin[1]-t.margin[3];o=r.height-t.margin[0]-t.margin[2];i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:i,ey:o};e.style.width=i+"px";e.style.height=o+"px";e.style.left="0px";e.style.top="0px";break;case"center":i=Math.min(n.width-e.margin[1]-e.margin[3]-e.border[1]-e.border[3],t.region.ex-t.region.sx-e.margin[1]-e.margin[3]);o=Math.min(n.height-e.margin[0]-e.margin[2]-e.border[0]-e.border[2],t.region.ey-t.region.sy-e.margin[0]-e.margin[2]);i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:i,ey:o};if(!this.convertElementUnit(e.jxhlWidth,e,"h"))i++;if(!this.convertElementUnit(e.jxhlHeight,e,"v"))o++;e.style.width=i+"px";e.style.height=o+"px";e.style.left=t.region.sx+parseInt((t.region.ex-t.region.sx-i)/2)+"px";e.style.top=t.region.sy+parseInt((t.region.ey-t.region.sy-o)/2)+"px";t.region.sx=t.region.ex;t.region.sy=t.region.ey;break;case"float":i=n.width;o=n.height;i=Math.max(i,0);o=Math.max(o,0);e.region={sx:0,sy:0,ex:i,ey:o};if(this.convertElementUnit(e.jxhlWidth,e,"h"))e.style.width=i+"px";if(this.convertElementUnit(e.jxhlHeight,e,"v"))e.style.height=o+"px";e.style.position="relative";e.style.float="left";e.style.styleFloat="left";e.style.cssFloat="left";break}if(e.jxhl_frame){e.jxhl_frame.style.width=i+"px";e.jxhl_frame.style.height=o+"px"}}if(e.childControls){for(var l=0;l<e.childControls.length;l++){this.calcControlPostion(e.childControls[l])}}};$jxhl.prototype.convertElementUnit=function(e,t,r){if(typeof e=="undefined"||e===null||e==="")return null;e=e+"";if(e.indexOf("%")!=e.length-1&&e.indexOf("*")!=e.length-1){return parseInt(e)}var n=this.calcElementSize(t.parentNode,true);var i=0,o=e.substr(0,e.length-1),l=r=="h"?n.width:n.height;if(e.indexOf("%")==e.length-1){if(o.length==0)o="100";i=parseFloat(o)/100}else{if(o.length==0)o="1";i=parseFloat(o)}return parseInt(l*i+"")};$jxhl.prototype.calcElementSize=function(e,t){var r=t?0:this.convertElementUnit(e.jxhlWidth,e,"h")||0;var n=t?0:this.convertElementUnit(e.jxhlHeight,e,"v")||0;if(typeof jQuery!="undefined"){r=Math.max(r,$(e).outerWidth());n=Math.max(n,$(e).outerHeight());return{width:r,height:n}}r=Math.max(e.offsetWidth||0,e.clientWidth||0,r);if(e==document.body)r=Math.max(r,document.documentElement.clientWidth||0,document.documentElement.offsetWidth||0,document.documentElement.scrollWidth||0,document.body.clientWidth||0,document.body.offsetWidth||0,document.body.scrollWidth||0);n=Math.max(e.offsetHeight||0,e.clientHeight||0,n);if(e.border&&!e.hasCalcBorder){n=n-Math.max(e.border[0],0)-Math.max(e.border[2],0);r=r-Math.max(e.border[1],0)-Math.max(e.border[3],0);e.hasCalcBorder=true}if(e==document.body)n=Math.max(n,document.documentElement.clientHeight||0,document.documentElement.offsetHeight||0,document.documentElement.scrollHeight||0,document.body.clientHeight||0,document.body.offsetHeight||0,document.body.scrollHeight||0);return{width:r,height:n}};$jxhl.prototype.clearControlRegion=function(e){e.region=null;if(e.childControls){for(var t=0;t<e.childControls.length;t++){this.clearControlRegion(e.childControls[t])}}};$jxhl.prototype.clearChildControls=function(e){if(e.childControls)e.childControls=null};$jxhl.prototype.toBoolean=function(e){if(typeof e=="string"){switch(e.toLowerCase()){case"1":case"on":case"yes":case"true":return true;default:return false}}return!!e};$jxhl.prototype.handleError=function(e,t){alert(e)};$jxhl.prototype.xmlhttp=function(){if(typeof XMLHttpRequest!="undefined")return new XMLHttpRequest;return new ActiveXObject("Microsoft.XMLHTTP")};$jxhl.prototype.loadXml=function(e,t,r,n){var i=this;if(this.useCache&&this.layoutCache[e]){i.initComplete(this.layoutCache[e],t,r,n);return}if(typeof jQuery!="undefined"){$.ajax({url:e,type:"GET",dataType:"text",timeout:6e4,error:function(t){i.handleError("unable to load file "+e+" : "+t)},success:function(o){var l=i.loadXmlFromString(o);if(i.useCache)i.layoutCache[e]=l;i.initComplete(l,t,r,n)}});return}var o=this.xmlhttp();o.open("GET",e,true);o.onreadystatechange=function(){if(o.readyState==4){if(o.status==200){if((typeof o.responseXML=="undefined"||typeof o.responseXML!="object")&&typeof DOMParser!="undefined"&&DOMParser&&o.responseText){var l=new DOMParser;var a=l.parseFromString(o.responseText,"text/xml");if(i.useCache)i.layoutCache[e]=a;i.initComplete(a,t,r,n);return}if(!o.responseXML)return i.handleError("unable to load file "+e+" : invalid xml format");if(i.useCache)i.layoutCache[e]=o.responseXML;i.initComplete(o.responseXML,t,r,n);return}}};o.send("")};$jxhl.prototype.loadXmlFromString=function(e){if(!e)return null;if(typeof DOMParser!="undefined"&&DOMParser){var t=new DOMParser;var r=t.parseFromString(e,"text/xml");return r}try{var r=new ActiveXObject("MSXML2.DOMDocument");r.loadXML(e);return r}catch(n){return null}};$jxhl.prototype.getInnerHtml=function(e){var t;if(this.toBoolean(e.getAttribute("rawhtml")))t=r(e);else t=n(e);t=t.replace(/(^\s+|\s+$)/g,"");t=t.replace(/<!\[CDATA\[/g,"").replace(/\]\]>/g,"");return t;function r(e){try{var t=e.text;if(t)return t}catch(r){}try{var t=e.textContent;if(t)return t}catch(r){}var n=[];var i=e.childNodes;for(var o=0;o<i.length;o++){var l=i.item(o);n[n.length]=l.nodeValue}return n.join("")}function n(e){var t=[];var r=e.childNodes;if("xml"in e){for(var n=0;n<r.length;n++){t[n]=r.item(n).xml}}else if(typeof XMLSerializer!="undefined"){var i=new XMLSerializer;for(var n=0;n<r.length;n++){var o=r[n];if(o.nodeType==1)t[t.length]=i.serializeToString(o);else t[t.length]=o.nodeValue}}else{}return t.join("")}};$jxhl.prototype.getElement=function(e,t){if(!t||!e)return null;var r=null;if(typeof t!="undefined"&&t)r=typeof t=="string"?document.getElementById(t):t;if(!r||!r.id)return null;return document.getElementById(r.id+"_"+e)};$jxhl.prototype.notifyResize=function(e){if(typeof e=="undefined")return;var t=typeof e=="string"?document.getElementById(e):e;if(!t)return;this.clearControlRegion(t);this.calcControlPostion(t)};$jxhl.prototype.monitorElement=function(e){var t=false;var r=null;var n=this;r=setInterval(i,100);function i(){if(!e){if(r){clearInterval(r);r=null}return}if(!e.visible||e.style.display=="none"){e.style.display=="none";return}if(!e.oldSize){e.oldSize=n.calcElementSize(e);return}var o=n.calcElementSize(e);if(o.width!=e.oldSize.width||o.height!=e.oldSize.height){if(t){clearInterval(r);t=false;r=setInterval(i,100);return}t=true;var l=e.isroot?e:e.parentContainer;n.notifyResize(l);l.oldSize=o;t=false}}};$jxhl.prototype.buildRunnable=function(baseid){if(!this.runnableObject||!this.runnableObject["jxhl_inner_var$"+baseid]||!this.runnableObject["jxhl_inner_var$"+baseid]["jxhl$runnable"])return;var self=this;function _run(){var localvar_names=[];var localvar_evals=[];for(var n in self.runnableObject["jxhl_inner_var$"+baseid]){if(n!="jxhl$runnable"){localvar_evals.push("var "+n+"=self.runnableObject['jxhl_inner_var$"+baseid+"']['"+n+"'];")}if(n.indexOf("jxhl$")==-1){localvar_names.push(n)}}var runnableFunc="new function(){ \r\n                "+localvar_evals.join("")+"\r\n                var jxhl$localVars = ["+localvar_names.join(",")+"]; \r\n                "+self.runnableObject["jxhl_inner_var$"+baseid]["jxhl$runnable"]+" \r\n                }();";try{eval(runnableFunc)}catch(x){alert("runnable node parse error : "+x.message)}}_run()};$jxhl.prototype.init=function(e,t,r,n,i){var o=document.body;if(typeof t!="undefined"&&t)o=typeof t=="string"?document.getElementById(t)||document.body:t;if(!o.id)o.id="_jxhl_autoid_"+(new Date).getTime();if(!o.style.position)o.style.position="relative";o.visible=true;o.isroot=true;o.margin=[0,0,0,0];if(!e){this.handleError("xml file path is null");return}var l;if(r&&r=="text"){if(e.indexOf("<")>0)e=e.substr(1);l=this.loadXmlFromString(e);this.initComplete(l,o,n,i)}else{this.loadXml(e,o,n,i)}};$jxhl.prototype.initComplete=function(e,t,r,n){if(!e)return;this.clearChildControls(t);this.clearControlRegion(t);t.innerHTML="";if(!this.runnableObject)this.runnableObject={};this.runnableObject["jxhl_inner_var$"+t.id]={};this.runnableObject["jxhl_inner_var$"+t.id]["jxhl$container"]=t;this.runnableObject["jxhl_inner_var$"+t.id]["jxhl$arguments"]=r;var i=e.documentElement||e;i=i.cloneNode(true);for(var o=0;o<i.childNodes.length;o++)this.parseControl(i.childNodes[o],t,t.id);this.calcControlPostion(t);this.monitorElement(t);this.buildRunnable(t.id);if(typeof n=="function")n()};$jxhl.prototype.extension=function(e){if(typeof e=="function")e.apply(this,null)};if(typeof define==="function"&&typeof define.amd==="object"&&define.amd){define(function(){return $jxhl()})}else if(typeof module!=="undefined"&&module.exports){module.exports=new $jxhl;module.exports.jxhl=$jxhl}else{if(!window.jxhl)window.jxhl=new $jxhl}})();