; (function () {
    'use strict';
    function $jxhl() {
        //use cache to save the layout
        this.useCache = false;
        this.layoutCache = {};
    }

    $jxhl.prototype.newControl = function (node, baseid) {
        var basecontrol = document.createElement("div");

        if (node) {
            //render layout properties
            basecontrol.setAttribute("jxhl_control", node.nodeName);
            basecontrol.setAttribute("jxhl_baseid", baseid);
            if (node.getAttribute("id")) basecontrol.id = baseid + "_" + node.getAttribute("id");
            if (node.getAttribute("css_name")) basecontrol.className = node.getAttribute("css_name");
            if (node.getAttribute("css_text")) basecontrol.style.cssText = node.getAttribute("css_text");
            if (node.getAttribute("width")) basecontrol.jxhlWidth = parseInt(node.getAttribute("width"));
            if (node.getAttribute("height")) basecontrol.jxhlHeight = parseInt(node.getAttribute("height"));
            if (node.getAttribute("left")) basecontrol.jxhlLeft = parseInt(node.getAttribute("left"));
            else basecontrol.jxhlLeft = 0;
            if (node.getAttribute("top")) basecontrol.jxhlTop = parseInt(node.getAttribute("top"));
            else basecontrol.jxhlTop = 0;
            if (node.getAttribute("dock")) basecontrol.dock = node.getAttribute("dock");
            else basecontrol.dock = "auto";//auto(not calc region), top, center, bottom, left, right, fill(left full), fix(full, not calc region), float(not calc region, not set x,y)
            if (node.getAttribute("overflow")) basecontrol.overflow = node.getAttribute("overflow");
            else basecontrol.overflow = "hidden";//hidden,x,y,both
            if (node.getAttribute("v_align")) basecontrol.v_align = node.getAttribute("v_align");
            else basecontrol.v_align = "top";//top, middle, bottom
            if (node.getAttribute("h_align")) basecontrol.h_align = node.getAttribute("h_align");
            else basecontrol.h_align = "left";//left, center, right
            if (node.getAttribute("visible")) basecontrol.visible = this.toBoolean(node.getAttribute("visible"));
            else basecontrol.visible = true;
            if (node.getAttribute("opacity")) {
                var opaF = 1;
                try {
                    opaF = Math.min(1, parseFloat(node.getAttribute("opacity")));
                }
                catch (x)
                { }
                basecontrol.style.opacity = opaF;
                basecontrol.style.mozOpacity = opaF;
                basecontrol.style.khtmlOpacity = opaF;
                basecontrol.style.filter = "alpha(opacity=" + parseInt(opaF * 100) + ")";
            }

            var margin = node.getAttribute("margin");
            var padding = node.getAttribute("padding");
            var border = node.getAttribute("border_width");
            if (!margin)
                basecontrol.margin = [0, 0, 0, 0];
            else if (margin.indexOf(",") == -1)
                basecontrol.margin = [parseInt(margin), parseInt(margin), parseInt(margin), parseInt(margin)];
            else
                basecontrol.margin = eval("([" + margin + "])");
            if (!padding)
                basecontrol.padding = [0, 0, 0, 0];
            else if (padding.indexOf(",") == -1)
                basecontrol.padding = [parseInt(padding), parseInt(padding), parseInt(padding), parseInt(padding)];
            else
                basecontrol.padding = eval("([" + padding + "])");

            if (!border)
                basecontrol.border = [0, 0, 0, 0];
            else if (border.indexOf(",") == -1)
                basecontrol.border = [parseInt(border), parseInt(border), parseInt(border), parseInt(border)];
            else
                basecontrol.border = eval("([" + border + "])");
            basecontrol.style.borderTopWidth = basecontrol.border[0] + "px";
            basecontrol.style.borderRightWidth = basecontrol.border[1] + "px";
            basecontrol.style.borderBottomWidth = basecontrol.border[2] + "px";
            basecontrol.style.borderLeftWidth = basecontrol.border[3] + "px";
            
            //Analyse [image, frame]
            if (node.nodeName == "image") {
                var img = document.createElement("img");
                if (node.getAttribute("src")) img.setAttribute("src", node.getAttribute("src"));
                basecontrol.jxhl_image = img;
                basecontrol.appendChild(img);
            }
            if (node.nodeName == "frame") {
                var frm = document.createElement("iframe");
                frm.frameBorder = 0;
                frm.frameSpacing = 0;
                if (node.getAttribute("frame_scrolling")) frm.setAttribute("scrolling", node.getAttribute("frame_scrolling"));
                else frm.setAttribute("scrolling", "auto");
                if (node.getAttribute("src")) frm.setAttribute("src", node.getAttribute("src"));
                basecontrol.jxhl_frame = frm;
                basecontrol.appendChild(frm);
            }
            
            //register local_var
            if (node.getAttribute("local_var") && node.getAttribute("local_var") != "jxhl$runnable"
                && node.getAttribute("local_var") != "jxhl$container"
                && node.getAttribute("local_var") != "jxhl$arguments") {
                this.runnableObject["jxhl_inner_var$" + baseid][node.getAttribute("local_var")] = basecontrol;
            }
        }

        return basecontrol;
    }

    $jxhl.prototype.parseControl = function (node, p, baseid) {
        //3-text, 4-cdata, 8-comment
        if (node.nodeType == 4 || node.nodeType == 3 || node.nodeType == 8)
            return;
        //var pSize = this.calcElementSize(p);
        //if (!p.region) p.region = { sx: 0, sy: 0, ex: pSize.width, ey: pSize.height }; 
        
        var ctlname = node.nodeName;
        
        //runnable element, that is javascript in jxhl
        if (ctlname == "runnable") {
            this.runnableObject["jxhl_inner_var$" + baseid]["jxhl$runnable"] = this.getInnerHtml(node);
            return;
        }

        if (!p.childControls) p.childControls = [];
        var bc = this.newControl(node, baseid);
        bc.style.position = "absolute";
        bc.isroot = false;
        bc.parentContainer = p;
        //dock/align/margin/padding
        switch (ctlname) {
            case "html":
            case "label":
                //if html snippet has style tag, IE7/8 will cause some issue when load，so use Jquery if it exists
                if (typeof (jQuery) != "undefined")
                    $(bc).append(this.getInnerHtml(node));
                else
                    bc.innerHTML = this.getInnerHtml(node);
                p.appendChild(bc);
                p.childControls.push(bc);
                
                //load local_var in html snippets
                if (ctlname == "html") {
                    var eles = bc.childNodes;
                    for (var k = 0; k < eles.length; k++) {
                        recurseHtmlLocalVar.apply(this, [eles[k]]);
                    }
                }
                break;
            case "frame":
                p.appendChild(bc);
                p.childControls.push(bc);
                break;
            case "image":
                p.appendChild(bc);
                p.childControls.push(bc);
                break;
            case "panel":
                p.appendChild(bc);
                p.childControls.push(bc);
                break;
        }
        
        //recurse
        if (ctlname == "panel" && node.childNodes.length > 0) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.parseControl(node.childNodes[i], bc, baseid);
        }

        function recurseHtmlLocalVar() {
            var ele = arguments[0];
            if (ele.nodeType != 1)
                return;
            if (ele.getAttribute("local_var") && ele.getAttribute("local_var") != "jxhl$runnable"
                && ele.getAttribute("local_var") != "jxhl$container"
                && ele.getAttribute("local_var") != "jxhl$arguments") {
                this.runnableObject["jxhl_inner_var$" + baseid][ele.getAttribute("local_var")] = ele;
            }
            var eles = ele.childNodes;
            if (eles.length == 0)
                return;
            for (var k = 0; k < eles.length; k++) {
                recurseHtmlLocalVar.apply(this, [eles[k]]);
            }
        }
    }

    $jxhl.prototype.calcControlPostion = function (ctl) {
        if (ctl.parentContainer) {
            if (!ctl.visible) {
                ctl.style.display = "none";
                ctl.jxhl_runtime_visible = "disable";
                return;
            }
            if (ctl.jxhl_runtime_visible && ctl.jxhl_runtime_visible == "disable") {
                ctl.jxhl_runtime_visible = null;
                ctl.style.display = "";
            }
            var p = ctl.parentContainer;
            var pSize = this.calcElementSize(p);
            if (!p.region) p.region = { sx: 0, sy: 0, ex: pSize.width, ey: pSize.height };

            var ctlSize = this.calcElementSize(ctl);
            //calc overflow
            //auto(not calc region), top, center, bottom, left, right, fill(left full), fix(full, not calc region), float(not calc region, not set x,y)
            //none fixed at 2014-04-02, not calc region, set relative position
            var __w = 0;
            var __h = 0;
            ctl.style.position = "absolute";
            switch (ctl.dock) {
                case "auto":
                    __w = ctlSize.width - ctl.margin[1] - ctl.margin[3] - ctl.border[1] - ctl.border[3];
                    __h = ctlSize.height - ctl.margin[0] - ctl.margin[2] - ctl.border[0] - ctl.border[2];

                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: __w, ey: __h };

                    ctl.style.width = __w + "px";
                    ctl.style.height = __h + "px";

                    ctl.style.position = "relative";

                    ctl.style.left = ctl.jxhlLeft + ctl.margin[3] + "px";
                    ctl.style.top = ctl.jxhlTop + ctl.margin[0] + "px";
                    break;
                case "none":
                    __w = ctlSize.width - ctl.margin[1] - ctl.margin[3] - ctl.border[1] - ctl.border[3];
                    __h = ctlSize.height - ctl.margin[0] - ctl.margin[2] - ctl.border[0] - ctl.border[2];

                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: 0, ey: 0 };

                    ctl.style.position = "relative";
                    if (ctl.jxhlWidth)
                        ctl.style.width = __w + "px";
                    if (ctl.jxhlHeight)
                        ctl.style.height = __h + "px";
                    ctl.style.left = ctl.jxhlLeft + ctl.margin[3] + "px";
                    ctl.style.top = ctl.jxhlTop + ctl.margin[0] + "px";
                    break;
                case "top":
                    __w = p.region.ex - p.region.sx - ctl.margin[1] - ctl.margin[3];
                    __h = ctlSize.height - ctl.margin[0] - ctl.margin[2] - ctl.border[0] - ctl.border[2];
                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: __w, ey: __h };

                    ctl.style.width = __w + "px";
                    ctl.style.height = __h + "px";

                    ctl.style.left = p.region.sx + ctl.margin[3] + "px";
                    ctl.style.top = p.region.sy + ctl.margin[0] + "px";

                    p.region.sy += ctlSize.height;
                    break;
                case "bottom":
                    __w = p.region.ex - p.region.sx - ctl.margin[1] - ctl.margin[3];
                    __h = ctlSize.height - ctl.margin[0] - ctl.margin[2] - ctl.border[0] - ctl.border[2];
                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: __w, ey: __h };

                    ctl.style.width = __w + "px";
                    ctl.style.height = __h + "px";

                    ctl.style.left = p.region.sx + ctl.margin[3] + "px";
                    ctl.style.top = p.region.ey - ctlSize.height + ctl.margin[0] + "px";

                    p.region.ey -= ctlSize.height;
                    break;
                case "left":
                    __w = ctlSize.width - ctl.margin[1] - ctl.margin[3] - ctl.border[1] - ctl.border[3];
                    __h = p.region.ey - p.region.sy - ctl.margin[0] - ctl.margin[2];
                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: __w, ey: __h };

                    ctl.style.width = __w + "px";
                    ctl.style.height = __h + "px";

                    ctl.style.left = p.region.sx + ctl.margin[3] + "px";
                    ctl.style.top = p.region.sy + ctl.margin[0] + "px";

                    p.region.sx += ctlSize.width;
                    break;
                case "right":
                    __w = ctlSize.width - ctl.margin[1] - ctl.margin[3] - ctl.border[1] - ctl.border[3];
                    __h = p.region.ey - p.region.sy - ctl.margin[0] - ctl.margin[2];
                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: __w, ey: __h };

                    ctl.style.width = __w + "px";
                    ctl.style.height = __h + "px";

                    ctl.style.left = p.region.ex - ctlSize.width + ctl.margin[3] + "px";
                    ctl.style.top = p.region.sy + ctl.margin[0] + "px";

                    p.region.ex -= ctlSize.width;
                    break;
                case "fill":
                    __w = p.region.ex - p.region.sx - ctl.margin[1] - ctl.margin[3];
                    __h = p.region.ey - p.region.sy - ctl.margin[0] - ctl.margin[2];
                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: __w, ey: __h };

                    ctl.style.width = __w + "px";
                    ctl.style.height = __h + "px";

                    ctl.style.left = p.region.sx + ctl.margin[3] + "px";
                    ctl.style.top = p.region.sy + ctl.margin[0] + "px";

                    p.region.sx = p.region.ex;
                    p.region.sy = p.region.ey;
                    break;
                case "fix":
                    __w = pSize.width - p.margin[1] - p.margin[3];
                    __h = pSize.height - p.margin[0] - p.margin[2];
                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: __w, ey: __h };

                    ctl.style.width = __w + "px";
                    ctl.style.height = __h + "px";

                    ctl.style.left = "0px";
                    ctl.style.top = "0px";
                    break;
                case "center":
                    __w = Math.min(ctlSize.width - ctl.margin[1] - ctl.margin[3] - ctl.border[1] - ctl.border[3], p.region.ex - p.region.sx - ctl.margin[1] - ctl.margin[3]);
                    __h = Math.min(ctlSize.height - ctl.margin[0] - ctl.margin[2] - ctl.border[0] - ctl.border[2], p.region.ey - p.region.sy - ctl.margin[0] - ctl.margin[2]);

                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: __w, ey: __h };

                    ctl.style.width = __w + "px";
                    ctl.style.height = __h + "px";

                    ctl.style.left = p.region.sx + parseInt((p.region.ex - p.region.sx - __w) / 2) + "px";
                    ctl.style.top = p.region.sy + parseInt((p.region.ey - p.region.sy - __h) / 2) + "px";

                    p.region.sx = p.region.ex;
                    p.region.sy = p.region.ey;
                    break;
                case "float":
                    __w = ctlSize.width;
                    __h = ctlSize.height;
                    __w = Math.max(__w, 0);
                    __h = Math.max(__h, 0);

                    ctl.region = { sx: 0, sy: 0, ex: __w, ey: __h };

                    if (ctl.jxhlWidth)
                        ctl.style.width = __w + "px";
                    if (ctl.jxhlHeight)
                        ctl.style.height = __h + "px";
                    ctl.style.position = "relative";
                    ctl.style.float = "left";
                    ctl.style.styleFloat = "left";
                    ctl.style.cssFloat = "left";
                    break;
            }
            //[width and height of iframe]
            if (ctl.jxhl_frame) {
                ctl.jxhl_frame.style.width = __w + "px";
                ctl.jxhl_frame.style.height = __h + "px";
            }
        }

        if (ctl.childControls) {
            for (var i = 0; i < ctl.childControls.length; i++) {
                this.calcControlPostion(ctl.childControls[i]);
            }
        }
    }

    $jxhl.prototype.calcElementSize = function (ele) {
        var w = ele.jxhlWidth || 0;
        var h = ele.jxhlHeight || 0;

        if (typeof (jQuery) != "undefined") {
            w = Math.max(w, $(ele).outerWidth());
            h = Math.max(h, $(ele).outerHeight());
            return { width: w, height: h };
        }

        w = Math.max(ele.offsetWidth || 0, ele.clientWidth || 0, w);

        if (ele == document.body)
            w = Math.max(w, document.documentElement.clientWidth || 0, document.documentElement.offsetWidth || 0, document.documentElement.scrollWidth || 0,
                document.body.clientWidth || 0, document.body.offsetWidth || 0, document.body.scrollWidth || 0);

        h = Math.max(ele.offsetHeight || 0, ele.clientHeight || 0, h);
        if (ele.border && !ele.hasCalcBorder) {
            h = h - Math.max(ele.border[0], 0) - Math.max(ele.border[2], 0);
            w = w - Math.max(ele.border[1], 0) - Math.max(ele.border[3], 0);
            ele.hasCalcBorder = true;
        }
        if (ele == document.body)
            h = Math.max(h, document.documentElement.clientHeight || 0, document.documentElement.offsetHeight || 0, document.documentElement.scrollHeight || 0,
                document.body.clientHeight || 0, document.body.offsetHeight || 0, document.body.scrollHeight || 0);

        return { width: w, height: h };
    }

    $jxhl.prototype.clearControlRegion = function (ctl) {
        ctl.region = null;
        if (ctl.childControls) {
            for (var i = 0; i < ctl.childControls.length; i++) {
                this.clearControlRegion(ctl.childControls[i]);
            }
        }
    }

    $jxhl.prototype.clearChildControls = function (ctl) {
        if (ctl.childControls)
            ctl.childControls = null;
    }

    $jxhl.prototype.toBoolean = function (val) {
        if (typeof (val) == "string") {
            switch (val.toLowerCase()) {
                case "1":
                case "on":
                case "yes":
                case "true":
                    return true;
                default:
                    return false;
            }
        }
        return !!val;
    }

    $jxhl.prototype.handleError = function (message, title) {
        alert(message);
    }

    $jxhl.prototype.xmlhttp = function () {
        if (typeof (XMLHttpRequest) != "undefined")
            return new XMLHttpRequest();
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    /**
     * ajax get jxhl layout define file (xxx.xml)
     */
    $jxhl.prototype.loadXml = function (path, container, sendArgs, callback) {
        var self = this;

        if (this.useCache && this.layoutCache[path]) {
            self.initComplete(this.layoutCache[path], container, sendArgs, callback);
            return;
        }

        if (typeof (jQuery) != "undefined") {
            $.ajax({
                url: path,
                type: 'GET',
                dataType: 'text',
                timeout: 60000,
                error: function (xml) {
                    self.handleError("unable to load file " + path + " : " + xml);
                },
                success: function (xml) {
                    var xmlDom = self.loadXmlFromString(xml);
                    if (self.useCache)
                        self.layoutCache[path] = xmlDom;
                    self.initComplete(xmlDom, container, sendArgs, callback);
                }
            });
            return;
        }

        var xh = this.xmlhttp();
        xh.open("GET", path, true);
        xh.onreadystatechange = function () {
            if (xh.readyState == 4) {
                if (xh.status == 200) {
                    if ((typeof (xh.responseXML) == "undefined" || typeof (xh.responseXML) != "object")
                        && typeof (DOMParser) != "undefined" && DOMParser && xh.responseText) {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(xh.responseText, 'text/xml');
                        if (self.useCache)
                            self.layoutCache[path] = doc;
                        self.initComplete(doc, container, sendArgs, callback);
                        return;
                    }
                    if (!xh.responseXML)
                        return self.handleError("unable to load file " + path + " : invalid xml format");
                    if (self.useCache)
                        self.layoutCache[path] = xh.responseXML;
                    self.initComplete(xh.responseXML, container, sendArgs, callback);
                    return;
                }
            }
        }
        xh.send("");
    }
    
    /**
     * parse xml from string
     */
    $jxhl.prototype.loadXmlFromString = function (str) {
        if (!str)
            return null;
        if (typeof (DOMParser) != "undefined" && DOMParser) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(str, 'text/xml');
            return doc;
        }
        try {
            var doc = new ActiveXObject("MSXML2.DOMDocument");
            doc.loadXML(str);
            return doc;
        }
        catch (x) {
            return null;
        }
    }

    $jxhl.prototype.getInnerHtml = function (node) {
        var html;
        if (this.toBoolean(node.getAttribute("rawhtml")))
            html = get_node_innertext(node);
        else
            html = get_node_innerxml(node);
        html = html.replace(/(^\s+|\s+$)/g, "");
        //fixed ie8/7
        html = html.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "");
        return html;

        function get_node_innertext(node) {
            try {
                var s = node.text;
                if (s) return s;
            }
            catch (x) {
            }
            try {
                var s = node.textContent;
                if (s) return s;
            }
            catch (x) {
            }
            var arr = [];
            var nodes = node.childNodes;
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes.item(i);
                arr[arr.length] = n.nodeValue;
            }
            return arr.join("");
        }

        function get_node_innerxml(node) {
            var arr = [];
            var childs = node.childNodes;

            if ("xml" in node) {
                for (var i = 0; i < childs.length; i++) {
                    arr[i] = childs.item(i).xml;
                }
            }
            else if (typeof (XMLSerializer) != "undefined") {
                var s = new XMLSerializer();
                for (var i = 0; i < childs.length; i++) {
                    var childnode = childs[i];
                    if (childnode.nodeType == 1)
                        arr[arr.length] = s.serializeToString(childnode);
                    else
                        arr[arr.length] = childnode.nodeValue;
                }
            }
            else {

            }
            return arr.join("");
        }
    }
    
    /**
     * find a jxhl control DOM element by id(defined in xml attribute of control) 
     */
    $jxhl.prototype.getElement = function (id, c) {
        if (!c || !id)
            return null;
        var container = null;
        if (typeof (c) != "undefined" && c)
            container = typeof (c) == "string" ? document.getElementById(c) : c;
        if (!container || !container.id)
            return null;
        return document.getElementById(container.id + "_" + id);
    }
    
    /**
     * notify parent node that it resized, then re-calculate the children's layout
     */
    $jxhl.prototype.notifyResize = function (cOrCtl) {
        if (typeof (cOrCtl) == "undefined")
            return;
        var container = typeof (cOrCtl) == "string" ? document.getElementById(cOrCtl) : cOrCtl;
        if (!container)
            return;
        this.clearControlRegion(container);
        this.calcControlPostion(container);
    }
    
    /**
     * monitor container or element of view resize
     */
    $jxhl.prototype.monitorElement = function (c) {
        var isResizing = false;
        var interval = null;
        var self = this;
        interval = setInterval(DoMonitor, 100);

        function DoMonitor() {
            if (!c) {
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
                return;
            }
            if (!c.visible || c.style.display == "none") {
                c.style.display == "none";
                return;
            }
            if (!c.oldSize) {
                c.oldSize = self.calcElementSize(c);
                return;
            }
            var currSize = self.calcElementSize(c);
            if (currSize.width != c.oldSize.width || currSize.height != c.oldSize.height) {
                if (isResizing) {
                    clearInterval(interval);
                    isResizing = false;
                    interval = setInterval(DoMonitor, 100);
                    return;
                }
                isResizing = true;

                var ele = c.isroot ? c : c.parentContainer;
                self.notifyResize(ele);
                ele.oldSize = currSize;

                isResizing = false;
            }
        }
    }
    
    /**
     * apply the runnable node javascript to the XML view scope
     */
    $jxhl.prototype.buildRunnable = function (baseid) {
        if (!this.runnableObject ||
            !this.runnableObject["jxhl_inner_var$" + baseid] ||
            !this.runnableObject["jxhl_inner_var$" + baseid]["jxhl$runnable"])
            return;

        var self = this;
        function _run() {

            var localvar_names = [];
            var localvar_evals = [];
            for (var n in self.runnableObject["jxhl_inner_var$" + baseid]) {
                if (n != "jxhl$runnable") {
                    //eval("var " + n + "=self.runnableObject['jxhl_inner_var$" + baseid + "']['" + n + "'];");
                    localvar_evals.push("var " + n + "=self.runnableObject['jxhl_inner_var$" + baseid + "']['" + n + "'];");
                }
                if (n.indexOf("jxhl$") == -1) {
                    localvar_names.push(n);
                }
            }
            var runnableFunc = "new function(){ \
                "+ localvar_evals.join("") + "\
                var jxhl$localVars = ["+ localvar_names.join(",") + "]; \
                "+ self.runnableObject["jxhl_inner_var$" + baseid]["jxhl$runnable"] + " \
                }();";
            try{
                eval(runnableFunc);
            }
            catch (x) {
                alert("runnable node parse error : " + x.message);
            }
        }

        _run();
    }
    
    /**
     * init xml layout with arguments and callback
     */
    $jxhl.prototype.init = function (pathOrText, c, argType, sendArgs, callback) {
        var container = document.body;
        if (typeof (c) != "undefined" && c)
            container = typeof (c) == "string" ? (document.getElementById(c) || document.body) : c;
        if (!container.id) container.id = "_jxhl_autoid_" + new Date().getTime();
        if (!container.style.position) container.style.position = "relative";
        container.visible = true;
        container.isroot = true;
        container.margin = [0, 0, 0, 0];
        //parse xml
        if (!pathOrText) {
            this.handleError("xml file path is null");
            return;
        }
        var xmldoc;
        if (argType && argType == "text") {
            //remove Bom tag in some Windows OS
            if (pathOrText.indexOf("<") > 0)
                pathOrText = pathOrText.substr(1);
            xmldoc = this.loadXmlFromString(pathOrText);

            this.initComplete(xmldoc, container, sendArgs, callback);
        }
        else {
            //xmldoc = this.loadXml(pathOrText);
            //IOS7 can not support async:false
            this.loadXml(pathOrText, container, sendArgs, callback);
        }

    }
    
    /**
     * init completely, callback will apply, arguments will be transfered to runnable node scripts
     */
    $jxhl.prototype.initComplete = function (xmldoc, container, sendArgs, callback) {
        if (!xmldoc)
            return;

        this.clearChildControls(container);
        this.clearControlRegion(container);
        container.innerHTML = "";
        
        //a var to save local_var list of runnable scope
        if (!this.runnableObject)
            this.runnableObject = {};
        this.runnableObject["jxhl_inner_var$" + container.id] = {};
        //define jxhl$container for runnable scope
        this.runnableObject["jxhl_inner_var$" + container.id]["jxhl$container"] = container;
        //define jxhl$arguments for runnable scope, which is sendArgs
        this.runnableObject["jxhl_inner_var$" + container.id]["jxhl$arguments"] = sendArgs;

        var de = xmldoc.documentElement || xmldoc;
        de = de.cloneNode(true);
        for (var i = 0; i < de.childNodes.length; i++)
            this.parseControl(de.childNodes[i], container, container.id);

        this.calcControlPostion(container);
        this.monitorElement(container);

        this.buildRunnable(container.id);

        if (typeof (callback) == "function")
            callback();
    }
    
    /**
     * give an extension method
     */
    $jxhl.prototype.extension = function (func) {
        if (typeof (func) == "function")
            func.apply(this, null);
    }
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function () {
            return $jxhl();
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = new $jxhl();
        module.exports.jxhl = $jxhl;
    } else {
        if (!window.jxhl)
            window.jxhl = new $jxhl();
    }
} ());