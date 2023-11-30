/*!
*  filename: ej.tagcloud.js
*  version : 15.1.0.41
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/


window.ej = window.Syncfusion = window.Syncfusion || {};


(function ($, ej, undefined) {
    'use strict';

    ej.version = "15.1.0.41";

    ej.consts = {
        NamespaceJoin: '-'
    };
    ej.TextAlign = {
        Center: 'center',
        Justify: 'justify',
        Left: 'left',
        Right: 'right'
    };
    ej.Orientation = { Horizontal: "horizontal", Vertical: "vertical" };

    ej.serverTimezoneOffset = 0;

    ej.persistStateVersion = null;

    if (!Object.prototype.hasOwnProperty) {
        Object.prototype.hasOwnProperty = function (obj, prop) {
            return obj[prop] !== undefined;
        };
    }

    //to support toISOString() in IE8
    if (!Date.prototype.toISOString) {
        (function () {
            function pad(number) {
                var r = String(number);
                if (r.length === 1) {
                    r = '0' + r;
                }
                return r;
            }
            Date.prototype.toISOString = function () {
                return this.getUTCFullYear()
                    + '-' + pad(this.getUTCMonth() + 1)
                    + '-' + pad(this.getUTCDate())
                    + 'T' + pad(this.getUTCHours())
                    + ':' + pad(this.getUTCMinutes())
                    + ':' + pad(this.getUTCSeconds())
                    + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                    + 'Z';
            };
        }());
    }

    String.format = function () {
        var source = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++)
            source = source.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i + 1]);

        source = source.replace(/\{[0-9]\}/g, "");
        return source;
    };

    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };
    // Function to create new class
    ej.defineClass = function (className, constructor, proto, replace) {
        /// <summary>Creates the javascript class with given namespace & class name & constructor etc</summary>
        /// <param name="className" type="String">class name prefixed with namespace</param>
        /// <param name="constructor" type="Function">constructor function</param>
        /// <param name="proto" type="Object">prototype for the class</param>
        /// <param name="replace" type="Boolean">[Optional]Replace existing class if exists</param>
        /// <returns type="Function">returns the class function</returns>
        if (!className || !proto) return undefined;

        var parts = className.split(".");

        // Object creation
        var obj = window, i = 0;
        for (; i < parts.length - 1; i++) {

            if (ej.isNullOrUndefined(obj[parts[i]]))
                obj[parts[i]] = {};

            obj = obj[parts[i]];
        }

        if (replace || ej.isNullOrUndefined(obj[parts[i]])) {

            //constructor
            constructor = typeof constructor === "function" ? constructor : function () {
            };

            obj[parts[i]] = constructor;

            // prototype
            obj[parts[i]].prototype = proto;
        }

        return obj[parts[i]];
    };

    ej.util = {
        getNameSpace: function (className) {
            /// <summary>Internal function, this will create namespace for plugins using class name</summary>
            /// <param name="className" type="String"></param>
            /// <returns type="String"></returns>
            var splits = className.toLowerCase().split(".");
            splits[0] === "ej" && (splits[0] = "e");

            return splits.join(ej.consts.NamespaceJoin);
        },

        getObject: function (nameSpace, from) {
            if (!from) return undefined;

            var value = from, splits = nameSpace.split('.');

            for (var i = 0; i < splits.length; i++) {

                if (ej.util.isNullOrUndefined(value)) break;

                value = value[splits[i]];
            }

            return value;
        },

        createObject: function (nameSpace, value, initIn) {
            var splits = nameSpace.split('.'), start = initIn || window, from = start, i, t, length = splits.length;

            for (i = 0; i < length; i++) {
                t = splits[i];
                if (i + 1 == length)
                    from[t] = value === undefined ? {} : value;
                else if (ej.isNullOrUndefined(from[t]))
                    from[t] = {};

                from = from[t];
            }

            return start;
        },

        isNullOrUndefined: function (value) {
            /// <summary>Util to check null or undefined</summary>
            /// <param name="value" type="Object"></param>
            /// <returns type="Boolean"></returns>
            return value === undefined || value === null;
        },
        print: function (element, printWin) {
            var $div = ej.buildTag('div')
            var elementClone = element.clone();
            $div.append(elementClone);
            if (!printWin)
                var printWin = window.open('', 'print', "height=452,width=1024,tabbar=no");
            printWin.document.write('<!DOCTYPE html>');
            var links = $('head').find('link').add("style");
            if (ej.browserInfo().name === "msie") {
                var a = ""
                links.each(function (index, obj) {
                    if (obj.tagName == "LINK")
                        $(obj).attr('href', obj.href);
                    a += obj.outerHTML;
                });
                printWin.document.write('<html><head></head><body>' + a + $div[0].innerHTML + '</body></html>');
            }
            else {
                var a = ""
                printWin.document.write('<html><head>')
                links.each(function (index, obj) {
                    if (obj.tagName == "LINK")
                        $(obj).attr('href', obj.href);
                    a += obj.outerHTML;
                });
                printWin.document.writeln(a + '</head><body>')
                printWin.document.writeln($div[0].innerHTML + '</body></html>')
            }
            printWin.document.close();
            printWin.focus();
            setTimeout(function () {
                if (!ej.isNullOrUndefined(printWin.window)) {
                    printWin.print();
                    setTimeout(function () { printWin.close() }, 1000);
                }
            }, 1000);
        },
        ieClearRemover: function (element) {
            var searchBoxHeight = $(element).height();
            element.style.paddingTop = parseFloat(searchBoxHeight / 2) + "px";
            element.style.paddingBottom = parseFloat(searchBoxHeight / 2) + "px";
            element.style.height = "1px";
            element.style.lineHeight = "1px";
        },
        //To send ajax request
        sendAjaxRequest: function (ajaxOptions) {
            $.ajax({
                type: ajaxOptions.type,
                cache: ajaxOptions.cache,
                url: ajaxOptions.url,
                dataType: ajaxOptions.dataType,
                data: ajaxOptions.data,
                contentType: ajaxOptions.contentType,
                async: ajaxOptions.async,
                success: ajaxOptions.successHandler,
                error: ajaxOptions.errorHandler,
                beforeSend: ajaxOptions.beforeSendHandler,
                complete: ajaxOptions.completeHandler
            });
        },

        buildTag: function (tag, innerHtml, styles, attrs) {
            /// <summary>Helper to build jQuery element</summary>
            /// <param name="tag" type="String">tagName#id.cssClass</param>
            /// <param name="innerHtml" type="String"></param>
            /// <param name="styles" type="Object">A set of key/value pairs that configure styles</param>
            /// <param name="attrs" type="Object">A set of key/value pairs that configure attributes</param>
            /// <returns type="jQuery"></returns>
            var tagName = /^[a-z]*[0-9a-z]+/ig.exec(tag)[0];

            var id = /#([_a-z]+[-_0-9a-z]+)/ig.exec(tag);
            id = id ? id[id.length - 1] : undefined;

            var className = /\.([a-z]+[-_0-9a-z ]+)/ig.exec(tag);
            className = className ? className[className.length - 1] : undefined;

            return $(document.createElement(tagName))
                .attr(id ? { "id": id } : {})
                .addClass(className || "")
                .css(styles || {})
                .attr(attrs || {})
                .html(innerHtml || "");
        },
        _preventDefaultException: function (el, exceptions) {
            if (el) {
                for (var i in exceptions) {
                    if (exceptions[i].test(el[i])) {
                        return true;
                    }
                }
            }

            return false;
        },

        //Gets the maximum z-index in the document
        getMaxZindex: function () {
            var maxZ = 1;
            maxZ = Math.max.apply(null, $.map($('body *'), function (e, n) {
                if ($(e).css('position') == 'absolute' || $(e).css('position') == 'fixed')
                    return parseInt($(e).css('z-index')) || 1;
            })
            );
            if (maxZ == undefined || maxZ == null)
                maxZ = 1;
            return maxZ;
        },

        //To prevent default actions for the element
        blockDefaultActions: function (e) {
            e.cancelBubble = true;
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        },

        //To get dimensions of the element when its hidden
        getDimension: function (element, method) {
            var value;
            var $hidden = $(element).parents().andSelf().filter(':hidden');
            if ($hidden) {
                var prop = { visibility: 'hidden', display: 'block' };
                var tmp = [];
                $hidden.each(function () {
                    var temp = {}, name;
                    for (name in prop) {
                        temp[name] = this.style[name];
                        this.style[name] = prop[name];
                    }
                    tmp.push(temp);
                });
                value = /(outer)/g.test(method) ?
                $(element)[method](true) :
               $(element)[method]();

                $hidden.each(function (i) {
                    var temp = tmp[i], name;
                    for (name in prop) {
                        this.style[name] = temp[name];
                    }
                });
            }
            return value;
        },
        //Get triggers when transition End
        transitionEndEvent: function () {
            var transitionEnd = {
                '': 'transitionend',
                'webkit': 'webkitTransitionEnd',
                'Moz': 'transitionend',
                'O': 'otransitionend',
                'ms': 'MSTransitionEnd'
            };

            return transitionEnd[ej.userAgent()];
        },
        //Get triggers when transition End
        animationEndEvent: function () {
            var animationEnd = {
                '': 'animationend',
                'webkit': 'webkitAnimationEnd',
                'Moz': 'animationend',
                'O': 'webkitAnimationEnd',
                'ms': 'animationend'
            };

            return animationEnd[ej.userAgent()];
        },
        //To return the start event to bind for element
        startEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "touchstart" : "mousedown";
        },
        //To return end event to bind for element
        endEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "touchend" : "mouseup"
        },
        //To return move event to bind for element
        moveEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? ($.support.hasPointer && !ej.isMobile()) ? "ejtouchmove" : "touchmove" : "mousemove";
        },
        //To return cancel event to bind for element
        cancelEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "touchcancel" : "mousecancel";
        },
        //To return tap event to bind for element
        tapEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "tap" : "click";
        },
        //To return tap hold event to bind for element
        tapHoldEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "taphold" : "click";
        },
        //To check whether its Device
        isDevice: function () {
            if (ej.getBooleanVal($('head'), 'data-ej-forceset', false))
                return ej.getBooleanVal($('head'), 'data-ej-device', this._device());
            else
                return this._device();
        },
        //To check whether its portrait or landscape mode
        isPortrait: function () {
            var elem = document.documentElement;
            return (elem) && ((elem.clientWidth / elem.clientHeight) < 1.1);
        },
        //To check whether its in lower resolution
        isLowerResolution: function () {
            return ((window.innerWidth <= 640 && ej.isPortrait() && ej.isDevice()) || (window.innerWidth <= 800 && !ej.isDevice()) || (window.innerWidth <= 800 && !ej.isPortrait() && ej.isWindows() && ej.isDevice()) || ej.isMobile());
        },
        //To check whether its iOS web view
        isIOSWebView: function () {
            return (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent));
        },
        //To check whether its Android web view
        isAndroidWebView: function () {
            return (!(typeof (Android) === "undefined"));
        },
        //To check whether its windows web view
        isWindowsWebView: function () {
            return location.href.indexOf("x-wmapp") != -1;
        },
        _device: function () {
            return (/Android|BlackBerry|iPhone|iPad|iPod|IEMobile|kindle|windows\sce|palm|smartphone|iemobile|mobile|pad|xoom|sch-i800|playbook/i.test(navigator.userAgent.toLowerCase()));
        },
        //To check whether its Mobile
        isMobile: function () {
            return ((/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(navigator.userAgent.toLowerCase()) && /mobile/i.test(navigator.userAgent.toLowerCase()))) || (ej.getBooleanVal($('head'), 'data-ej-mobile', false) === true);
        },
        //To check whether its Tablet
        isTablet: function () {
            return (/ipad|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase())) || (ej.getBooleanVal($('head'), 'data-ej-tablet', false) === true) || (!ej.isMobile() && ej.isDevice());
        },
        //To check whether its Touch Device
        isTouchDevice: function () {
            return (('ontouchstart' in window || (window.navigator.msPointerEnabled && ej.isMobile())) && this.isDevice());
        },
        //To get the outerHTML string for object
        getClearString: function (string) {
            return $.trim(string.replace(/\s+/g, " ").replace(/(\r\n|\n|\r)/gm, "").replace(new RegExp("\>[\n\t ]+\<", "g"), "><"));
        },
        //Get the attribute value with boolean type of element
        getBooleanVal: function (ele, val, option) {
            /// <summary>Util to get the property from data attributes</summary>
            /// <param name="ele" type="Object"></param>
            /// <param name="val" type="String"></param>
            /// <param name="option" type="GenericType"></param>
            /// <returns type="GenericType"></returns>
            var value = $(ele).attr(val);
            if (value != null)
                return value.toLowerCase() == "true";
            else
                return option;
        },
        //Gets the Skew class based on the element current position
        _getSkewClass: function (item, pageX, pageY) {
            var itemwidth = item.width();
            var itemheight = item.height();
            var leftOffset = item.offset().left;
            var rightOffset = item.offset().left + itemwidth;
            var topOffset = item.offset().top;
            var bottomOffset = item.offset().top + itemheight;
            var widthoffset = itemwidth * 0.3;
            var heightoffset = itemheight * 0.3;
            if (pageX < leftOffset + widthoffset && pageY < topOffset + heightoffset)
                return "e-m-skew-topleft";
            if (pageX > rightOffset - widthoffset && pageY < topOffset + heightoffset)
                return "e-m-skew-topright";
            if (pageX > rightOffset - widthoffset && pageY > bottomOffset - heightoffset)
                return "e-m-skew-bottomright";
            if (pageX < leftOffset + widthoffset && pageY > bottomOffset - heightoffset)
                return "e-m-skew-bottomleft";
            if (pageX > leftOffset + widthoffset && pageY < topOffset + heightoffset && pageX < rightOffset - widthoffset)
                return "e-m-skew-top";
            if (pageX < leftOffset + widthoffset)
                return "e-m-skew-left";
            if (pageX > rightOffset - widthoffset)
                return "e-m-skew-right";
            if (pageY > bottomOffset - heightoffset)
                return "e-m-skew-bottom";
            return "e-m-skew-center";
        },
        //Removes the added Skew class on the element
        _removeSkewClass: function (element) {
            $(element).removeClass("e-m-skew-top e-m-skew-bottom e-m-skew-left e-m-skew-right e-m-skew-topleft e-m-skew-topright e-m-skew-bottomleft e-m-skew-bottomright e-m-skew-center e-skew-top e-skew-bottom e-skew-left e-skew-right e-skew-topleft e-skew-topright e-skew-bottomleft e-skew-bottomright e-skew-center");
        },
        //Object.keys  method to support all the browser including IE8.
        _getObjectKeys: function (obj) {
            var i, keys = [];
            obj = Object.prototype.toString.call(obj) === Object.prototype.toString() ? obj : {};
            if (!Object.keys) {
                for (i in obj) {
                    if (obj.hasOwnProperty(i))
                        keys.push(i);
                }
                return keys;
            }
            if (Object.keys)
                return Object.keys(obj);
        },
        _touchStartPoints: function (evt, object) {
            if (evt) {
                var point = evt.touches ? evt.touches[0] : evt;
                object._distX = 0;
                object._distY = 0;
                object._moved = false;
                object._pointX = point.pageX;
                object._pointY = point.pageY;
            }
        },
        _isTouchMoved: function (evt, object) {
            if (evt) {
                var point = evt.touches ? evt.touches[0] : evt,
                deltaX = point.pageX - object._pointX,
                deltaY = point.pageY - object._pointY,
                timestamp = Date.now(),
                newX, newY,
                absDistX, absDistY;
                object._pointX = point.pageX;
                object._pointY = point.pageY;
                object._distX += deltaX;
                object._distY += deltaY;
                absDistX = Math.abs(object._distX);
                absDistY = Math.abs(object._distY);
                return !(absDistX < 5 && absDistY < 5);
            }
        },
        //To bind events for element
        listenEvents: function (selectors, eventTypes, handlers, remove, pluginObj, disableMouse) {
            for (var i = 0; i < selectors.length; i++) {
                ej.listenTouchEvent(selectors[i], eventTypes[i], handlers[i], remove, pluginObj, disableMouse);
            }
        },
        //To bind touch events for element
        listenTouchEvent: function (selector, eventType, handler, remove, pluginObj, disableMouse) {
            var event = remove ? "removeEventListener" : "addEventListener";
            var jqueryEvent = remove ? "off" : "on";
            var elements = $(selector);
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                switch (eventType) {
                    case "touchstart":
                        ej._bindEvent(element, event, eventType, handler, "mousedown", "MSPointerDown", "pointerdown", disableMouse);
                        break;
                    case "touchmove":
                        ej._bindEvent(element, event, eventType, handler, "mousemove", "MSPointerMove", "pointermove", disableMouse);
                        break;
                    case "touchend":
                        ej._bindEvent(element, event, eventType, handler, "mouseup", "MSPointerUp", "pointerup", disableMouse);
                        break;
                    case "touchcancel":
                        ej._bindEvent(element, event, eventType, handler, "mousecancel", "MSPointerCancel", "pointercancel", disableMouse);
                        break;
                    case "tap": case "taphold": case "ejtouchmove": case "click":
                        $(element)[jqueryEvent](eventType, handler);
                        break;
                    default:
                        if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9)
                            pluginObj["_on"]($(element), eventType, handler);
                        else
                            element[event](eventType, handler, true);
                        break;
                }
            }
        },
        //To bind events for element
        _bindEvent: function (element, event, eventType, handler, mouseEvent, pointerEvent, ie11pointerEvent, disableMouse) {
            if ($.support.hasPointer)
                element[event](window.navigator.pointerEnabled ? ie11pointerEvent : pointerEvent, handler, true);
            else
                element[event](eventType, handler, true);
        },
        _browser: function () {
            return (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : (/trident/i).test(navigator.userAgent) ? 'ms' : 'opera' in window ? 'O' : '';
        },
        styles: document.createElement('div').style,
        /**
       * To get the userAgent Name     
       * @example             
       * &lt;script&gt;
       *       ej.userAgent();//return user agent name
       * &lt;/script&gt         
       * @memberof AppView
       * @instance
       */
        userAgent: function () {
            var agents = 'webkitT,t,MozT,msT,OT'.split(','),
            t,
            i = 0,
            l = agents.length;

            for (; i < l; i++) {
                t = agents[i] + 'ransform';
                if (t in ej.styles) {
                    return agents[i].substr(0, agents[i].length - 1);
                }
            }

            return false;
        },
        addPrefix: function (style) {
            if (ej.userAgent() === '') return style;

            style = style.charAt(0).toUpperCase() + style.substr(1);
            return ej.userAgent() + style;
        },
        //To Prevent Default Exception

        //To destroy the mobile widgets
        destroyWidgets: function (element) {
            var dataEl = $(element).find("[data-role *= ejm]");
            dataEl.each(function (index, element) {
                var $element = $(element);
                var plugin = $element.data("ejWidgets");
                if (plugin)
                    $element[plugin]("destroy");
            });
        },
        //Get the attribute value of element
        getAttrVal: function (ele, val, option) {
            /// <summary>Util to get the property from data attributes</summary>
            /// <param name="ele" type="Object"></param>
            /// <param name="val" type="String"></param>
            /// <param name="option" type="GenericType"></param>
            /// <returns type="GenericType"></returns>
            var value = $(ele).attr(val);
            if (value != null)
                return value;
            else
                return option;
        },

        // Get the offset value of element
        getOffset: function (ele) {
            var pos = {};
            var offsetObj = ele.offset() || { left: 0, top: 0 };
            $.extend(true, pos, offsetObj);
            if ($("body").css("position") != "static") {
                var bodyPos = $("body").offset();
                pos.left -= bodyPos.left;
                pos.top -= bodyPos.top;
            }
            return pos;
        },

        // Z-index calculation for the element
        getZindexPartial: function (element, popupEle) {
            if (!ej.isNullOrUndefined(element) && element.length > 0) {
                var parents = element.parents(), bodyEle;
                bodyEle = $('body').children();
                if (!ej.isNullOrUndefined(element) && element.length > 0)
                    bodyEle.splice(bodyEle.index(popupEle), 1);
                $(bodyEle).each(function (i, ele) { parents.push(ele); });

                var maxZ = Math.max.apply(maxZ, $.map(parents, function (e, n) {
                    if ($(e).css('position') != 'static') return parseInt($(e).css('z-index')) || 1;
                }));
                if (!maxZ || maxZ < 10000) maxZ = 10000;
                else maxZ += 1;
                return maxZ;
            }
        },

        isValidAttr: function (element, attribute) {
            var element = $(element)[0];
            if (typeof element[attribute] != "undefined")
                return true;
            else {
                var _isValid = false;
                $.each(element, function (key) {
                    if (key.toLowerCase() == attribute.toLowerCase()) {
                        _isValid = true;
                        return false;
                    }
                });
            }
            return _isValid;
        }

    };

    $.extend(ej, ej.util);

    // base class for all ej widgets. It will automatically inhertied
    ej.widgetBase = {
        droppables: { 'default': [] },
        resizables: { 'default': [] },

        _renderEjTemplate: function (selector, data, index, prop) {
            var type = null;
            if (typeof selector === "object" || selector.startsWith("#") || selector.startsWith("."))
                type = $(selector).attr("type");
            if (type) {
                type = type.toLowerCase();
                if (ej.template[type])
                    return ej.template[type](this, selector, data, index, prop);
            }
            return ej.template.render(this, selector, data, index, prop);
        },

        destroy: function () {

            if (this._trigger("destroy"))
                return;

            if (this.model.enablePersistence) {
                this.persistState();
                $(window).off("unload", this._persistHandler);
            }

            try {
                this._destroy();
            } catch (e) { }

            var arr = this.element.data("ejWidgets") || [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == this.pluginName) {
                    arr.splice(i, 1);
                }
            }
            if (!arr.length)
                this.element.removeData("ejWidgets");

            while (this._events) {
                var item = this._events.pop(), args = [];

                if (!item)
                    break;

                for (var i = 0; i < item[1].length; i++)
                    if (!$.isPlainObject(item[1][i]))
                        args.push(item[1][i]);

                $.fn.off.apply(item[0], args);
            }

            this._events = null;

            this.element
                .removeClass(ej.util.getNameSpace(this.sfType))
                .removeClass("e-js")
                .removeData(this.pluginName);

            this.element = null;
            this.model = null;
        },

        _on: function (element) {
            if (!this._events)
                this._events = [];
            var args = [].splice.call(arguments, 1, arguments.length - 1);

            var handler = {}, i = args.length;
            while (handler && typeof handler !== "function") {
                handler = args[--i];
            }

            args[i] = ej.proxy(args[i], this);

            this._events.push([element, args, handler, args[i]]);

            $.fn.on.apply(element, args);

            return this;
        },

        _off: function (element, eventName, selector, handlerObject) {
            var e = this._events, temp;
            if (!e || !e.length)
                return this;
            if (typeof selector == "function") {
                temp = handlerObject;
                handlerObject = selector;
                selector = temp;
            }
            var t = (eventName.match(/\S+/g) || [""]);
            for (var i = 0; i < e.length; i++) {
                var arg = e[i],
                r = arg[0].length && (!handlerObject || arg[2] === handlerObject) && (arg[1][0] === eventName || t[0]) && (!selector || arg[1][1] === selector) && $.inArray(element[0], arg[0]) > -1;
                if (r) {
                    $.fn.off.apply(element, handlerObject ? [eventName, selector, arg[3]] : [eventName, selector]);
                    e.splice(i, 1);
                    break;
                }
            }

            return this;
        },

        // Client side events wire-up / trigger helper.
        _trigger: function (eventName, eventProp) {
            var fn = null, returnValue, args, clientProp = {};
            $.extend(clientProp, eventProp)

            if (eventName in this.model)
                fn = this.model[eventName];

            if (fn) {
                if (typeof fn === "string") {
                    fn = ej.util.getObject(fn, window);
                }

                if ($.isFunction(fn)) {

                    args = ej.event(eventName, this.model, eventProp);

                    var scopeFn = this.model["_applyScope"];

                    returnValue = fn.call(this, args);

                    scopeFn && scopeFn.call();

                    // sending changes back - deep copy option should not be enabled for this $.extend 
                    if (eventProp) $.extend(eventProp, args);

                    if (args.cancel || !ej.isNullOrUndefined(returnValue))
                        return returnValue === false || args.cancel;
                }
            }

            var isPropDefined = Boolean(eventProp);
            eventProp = eventProp || {};
            eventProp.originalEventType = eventName;
            eventProp.type = this.pluginName + eventName;

            args = $.Event(eventProp.type, ej.event(eventProp.type, this.model, eventProp));

            this.element && this.element.trigger(args);

            // sending changes back - deep copy option should not be enabled for this $.extend 
            if (isPropDefined) $.extend(eventProp, args);

            if (ej.isOnWebForms && args.cancel == false && this.model.serverEvents && this.model.serverEvents.length)
                ej.raiseWebFormsServerEvents(eventName, eventProp, clientProp);

            return args.cancel;
        },

        setModel: function (options, forceSet) {
            // check for whether to apply values are not. if _setModel function is defined in child,
            //  this will call that function and validate it using return value

            if (this._trigger("modelChange", { "changes": options }))
                return;

            for (var prop in options) {
                if (!forceSet) {
                    if (this.model[prop] === options[prop]) {
                        delete options[prop];
                        continue;
                    }
                    if ($.isPlainObject(options[prop])) {
                        iterateAndRemoveProps(this.model[prop], options[prop]);
                        if ($.isEmptyObject(options[prop])) {
                            delete options[prop];
                            continue;
                        }
                    }
                }

                if (this.dataTypes) {
                    var returnValue = this._isValidModelValue(prop, this.dataTypes, options);
                    if (returnValue !== true)
                        throw "setModel - Invalid input for property :" + prop + " - " + returnValue;
                }
                if (this.model.notifyOnEachPropertyChanges && this.model[prop] !== options[prop]) {
                    var arg = {
                        oldValue: this.model[prop],
                        newValue: options[prop]
                    };

                    options[prop] = this._trigger(prop + "Change", arg) ? this.model[prop] : arg.newValue;
                }
            }
            if ($.isEmptyObject(options))
                return;

            if (this._setFirst) {
                var ds = options.dataSource;
                if (ds) delete options.dataSource;

                $.extend(true, this.model, options);
                if (ds) {
                    this.model.dataSource = (ds instanceof Array) ? ds.slice() : ds;
                    options["dataSource"] = this.model.dataSource;
                }
                !this._setModel || this._setModel(options);

            } else if (!this._setModel || this._setModel(options) !== false) {
                $.extend(true, this.model, options);
            }
            if ("enablePersistence" in options) {
                this._setState(options.enablePersistence);
            }
        },
        option: function (prop, value, forceSet) {
            if (!prop)
                return this.model;

            if ($.isPlainObject(prop))
                return this.setModel(prop, forceSet);

            if (typeof prop === "string") {
                prop = prop.replace(/^model\./, "");
                var oldValue = ej.getObject(prop, this.model);

                if (value === undefined && !forceSet)
                    return oldValue;

                if (prop === "enablePersistence")
                    return this._setState(value);

                if (forceSet && value === ej.extensions.modelGUID) {
                    return this._setModel(ej.createObject(prop, ej.getObject(prop, this.model), {}));
                }

                if (forceSet || ej.getObject(prop, this.model) !== value)
                    return this.setModel(ej.createObject(prop, value, {}), forceSet);
            }
            return undefined;
        },

        _isValidModelValue: function (prop, types, options) {
            var value = types[prop], option = options[prop], returnValue;

            if (!value)
                return true;

            if (typeof value === "string") {
                if (value == "enum") {
                    options[prop] = option ? option.toString().toLowerCase() : option;
                    value = "string";
                }

                if (value === "array") {
                    if (Object.prototype.toString.call(option) === '[object Array]')
                        return true;
                }
                else if (value === "data") {
                    return true;
                }
                else if (value === "parent") {
                    return true;
                }
                else if (typeof option === value)
                    return true;

                return "Expected type - " + value;
            }

            if (option instanceof Array) {
                for (var i = 0; i < option.length; i++) {
                    returnValue = this._isValidModelValue(prop, types, option[i]);
                    if (returnValue !== true) {
                        return " [" + i + "] - " + returnValue;
                    }
                }
                return true;
            }

            for (var innerProp in option) {
                returnValue = this._isValidModelValue(innerProp, value, option);
                if (returnValue !== true)
                    return innerProp + " : " + returnValue;
            }

            return true;
        },

        _returnFn: function (obj, propName) {
            if (propName.indexOf('.') != -1) {
                this._returnFn(obj[propName.split('.')[0]], propName.split('.').slice(1).join('.'));
            }
            else
                obj[propName] = obj[propName].call(obj.propName);
        },

        _removeCircularRef: function (obj) {
            var seen = [];
            function detect(obj, key, parent) {
                if (typeof obj != 'object') { return; }
                if (!Array.prototype.indexOf) {
                    Array.prototype.indexOf = function (val) {
                        return jQuery.inArray(val, this);
                    };
                }
                if (seen.indexOf(obj) >= 0) {
                    delete parent[key];
                    return;
                }
                seen.push(obj);
                for (var k in obj) { //dive on the object's children
                    if (obj.hasOwnProperty(k)) { detect(obj[k], k, obj); }
                }
                seen.pop();
                return;
            }
            detect(obj, 'obj', null);
            return obj;
        },

        stringify: function (model, removeCircular) {
            var observables = this.observables;
            for (var k = 0; k < observables.length; k++) {
                var val = ej.getObject(observables[k], model);
                if (!ej.isNullOrUndefined(val) && typeof (val) === "function")
                    this._returnFn(model, observables[k]);
            }
            if (removeCircular) model = this._removeCircularRef(model);
            return JSON.stringify(model);
        },

        _setState: function (val) {
            if (val === true) {
                this._persistHandler = ej.proxy(this.persistState, this);
                $(window).on("unload", this._persistHandler);
            } else {
                this.deleteState();
                $(window).off("unload", this._persistHandler);
            }
        },

        _removeProp: function (obj, propName) {
            if (!ej.isNullOrUndefined(obj)) {
                if (propName.indexOf('.') != -1) {
                    this._removeProp(obj[propName.split('.')[0]], propName.split('.').slice(1).join('.'));
                }
                else
                    delete obj[propName];
            }
        },

        persistState: function () {
            var model;

            if (this._ignoreOnPersist) {
                model = copyObject({}, this.model);
                for (var i = 0; i < this._ignoreOnPersist.length; i++) {
                    this._removeProp(model, this._ignoreOnPersist[i]);
                }
                model.ignoreOnPersist = this._ignoreOnPersist;
            } else if (this._addToPersist) {
                model = {};
                for (var i = 0; i < this._addToPersist.length; i++) {
                    ej.createObject(this._addToPersist[i], ej.getObject(this._addToPersist[i], this.model), model);
                }
                model.addToPersist = this._addToPersist;
            } else {
                model = copyObject({}, this.model);
            }

            if (this._persistState) {
                model.customPersists = {};
                this._persistState(model.customPersists);
            }

            if (window.localStorage) {
                if (!ej.isNullOrUndefined(ej.persistStateVersion) && window.localStorage.getItem("persistKey") == null)
                    window.localStorage.setItem("persistKey", ej.persistStateVersion);
                window.localStorage.setItem("$ej$" + this.pluginName + this._id, JSON.stringify(model));
            }
            else if (document.cookie) {
                if (!ej.isNullOrUndefined(ej.persistStateVersion) && ej.cookie.get("persistKey") == null)
                    ej.cookie.set("persistKey", ej.persistStateVersion);
                ej.cookie.set("$ej$" + this.pluginName + this._id, model);
            }
        },

        deleteState: function () {
            if (window.localStorage)
                window.localStorage.removeItem("$ej$" + this.pluginName + this._id);
            else if (document.cookie)
                ej.cookie.set("$ej$" + this.pluginName + this._id, model, new Date());
        },

        restoreState: function (silent) {
            var value = null;
            if (window.localStorage)
                value = window.localStorage.getItem("$ej$" + this.pluginName + this._id);
            else if (document.cookie)
                value = ej.cookie.get("$ej$" + this.pluginName + this._id);

            if (value) {
                var model = JSON.parse(value);

                if (this._restoreState) {
                    this._restoreState(model.customPersists);
                    delete model.customPersists;
                }

                if (ej.isNullOrUndefined(model) === false)
                    if (!ej.isNullOrUndefined(model.ignoreOnPersist)) {
                        this._ignoreOnPersist = model.ignoreOnPersist;
                        delete model.ignoreOnPersist;
                    } else if (!ej.isNullOrUndefined(model.addToPersist)) {
                        this._addToPersist = model.addToPersist;
                        delete model.addToPersist;
                    }
            }
            if (!ej.isNullOrUndefined(model) && !ej.isNullOrUndefined(this._ignoreOnPersist)) {
                for (var i in this._ignoreOnPersist) {
                    if (this._ignoreOnPersist[i].indexOf('.') !== -1)
                        ej.createObject(this._ignoreOnPersist[i], ej.getObject(this._ignoreOnPersist[i], this.model), model);
                    else
                        model[this._ignoreOnPersist[i]] = this.model[this._ignoreOnPersist[i]];
                }
                this.model = model;
            }
            else
                this.model = $.extend(true, this.model, model);

            if (!silent && value && this._setModel)
                this._setModel(this.model);
        },

        //to prevent persistence
        ignoreOnPersist: function (properties) {
            var collection = [];
            if (typeof (properties) == "object")
                collection = properties;
            else if (typeof (properties) == 'string')
                collection.push(properties);
            if (this._addToPersist === undefined) {
                this._ignoreOnPersist = this._ignoreOnPersist || [];
                for (var i = 0; i < collection.length; i++) {
                    this._ignoreOnPersist.push(collection[i]);
                }
            } else {
                for (var i = 0; i < collection.length; i++) {
                    var index = this._addToPersist.indexOf(collection[i]);
                    this._addToPersist.splice(index, 1);
                }
            }
        },

        //to maintain persistence
        addToPersist: function (properties) {
            var collection = [];
            if (typeof (properties) == "object")
                collection = properties;
            else if (typeof (properties) == 'string')
                collection.push(properties);
            if (this._addToPersist === undefined) {
                this._ignoreOnPersist = this._ignoreOnPersist || [];
                for (var i = 0; i < collection.length; i++) {
                    var index = this._ignoreOnPersist.indexOf(collection[i]);
                    this._ignoreOnPersist.splice(index, 1);
                }
            } else {
                for (var i = 0; i < collection.length; i++) {
                    if ($.inArray(collection[i], this._addToPersist) === -1)
                        this._addToPersist.push(collection[i]);
                }
            }
        },

        // Get formatted text 
        formatting: function (formatstring, str, locale) {
            formatstring = formatstring.replace(/%280/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            locale = ej.preferredCulture(locale) ? locale : "en-US";
            var s = formatstring;
            var frontHtmlidx, FrontHtml, RearHtml, lastidxval;
            frontHtmlidx = formatstring.split("{0:");
            lastidxval = formatstring.split("}");
            FrontHtml = frontHtmlidx[0];
            RearHtml = lastidxval[1];
            if (typeof (str) == "string" && $.isNumeric(str))
                str = Number(str);
            if (formatstring.indexOf("{0:") != -1) {
                var toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                var formatVal = toformat.exec(formatstring);
                if (formatVal != null && str != null) {
                    if (FrontHtml != null && RearHtml != null)
                        str = FrontHtml + ej.format(str, formatVal[2], locale) + RearHtml;
                    else
                        str = ej.format(str, formatVal[2], locale);
                } else if (str != null)
                    str = str;
                else
                    str = "";
                return str;
            } else if (s.startsWith("{") && !s.startsWith("{0:")) {
                var fVal = s.split(""), str = (str || "") + "", strSplt = str.split(""), formats = /[0aA\*CN<>\?]/gm;
                for (var f = 0, f, val = 0; f < fVal.length; f++)
                    fVal[f] = formats.test(fVal[f]) ? "{" + val++ + "}" : fVal[f];
                return String.format.apply(String, [fVal.join("")].concat(strSplt)).replace('{', '').replace('}', '');
            } else if (this.data != null && this.data.Value == null) {
                $.each(this.data, function (dataIndex, dataValue) {
                    s = s.replace(new RegExp('\\{' + dataIndex + '\\}', 'gm'), dataValue);
                });
                return s;
            } else {
                return this.data.Value;
            }
        },
    };

    ej.WidgetBase = function () {
    }

    var iterateAndRemoveProps = function (source, target) {
        for (var prop in source) {
            if (source[prop] === target[prop])
                delete target[prop];
            if ($.isPlainObject(target[prop]) && $.isPlainObject(source[prop]))
                iterateAndRemoveProps(source[prop], target[prop]);
        }
    }

    ej.widget = function (pluginName, className, proto) {
        /// <summary>Widget helper for developers, this set have predefined function to jQuery plug-ins</summary>
        /// <param name="pluginName" type="String">the plugin name that will be added in jquery.fn</param>
        /// <param name="className" type="String">the class name for your plugin, this will help create default cssClas</param>
        /// <param name="proto" type="Object">prototype for of the plug-in</param>

        if (typeof pluginName === "object") {
            proto = className;
            for (var prop in pluginName) {
                var name = pluginName[prop];

                if (name instanceof Array) {
                    proto._rootCSS = name[1];
                    name = name[0];
                }

                ej.widget(prop, name, proto);

                if (pluginName[prop] instanceof Array)
                    proto._rootCSS = "";
            }

            return;
        }

        var nameSpace = proto._rootCSS || ej.getNameSpace(className);

        proto = ej.defineClass(className, function (element, options) {

            this.sfType = className;
            this.pluginName = pluginName;
            this.instance = pInstance;

            if (ej.isNullOrUndefined(this._setFirst))
                this._setFirst = true;

            this["ob.values"] = {};

            $.extend(this, ej.widgetBase);

            if (this.dataTypes) {
                for (var property in options) {
                    var returnValue = this._isValidModelValue(property, this.dataTypes, options);
                    if (returnValue !== true)
                        throw "setModel - Invalid input for property :" + property + " - " + returnValue;
                }
            }

            var arr = (element.data("ejWidgets") || []);
            arr.push(pluginName);
            element.data("ejWidgets", arr);

            for (var i = 0; ej.widget.observables && this.observables && i < this.observables.length; i++) {
                var t = ej.getObject(this.observables[i], options);
                if (t) ej.createObject(this.observables[i], ej.widget.observables.register(t, this.observables[i], this, element), options);
            }

            this.element = element.jquery ? element : $(element);
            this.model = copyObject(true, {}, proto.prototype.defaults, options);
            this.model.keyConfigs = copyObject(this.keyConfigs);

            this.element.addClass(nameSpace + " e-js").data(pluginName, this);

            this._id = element[0].id;

            if (!this.element.attr("tabIndex"))
                this.element.attr("tabIndex", "");

            if (this.model.enablePersistence) {
                if (window.localStorage && !ej.isNullOrUndefined(ej.persistStateVersion) && window.localStorage.getItem("persistKey") != ej.persistStateVersion) {
                    for (var i in window.localStorage) {
                        if (i.indexOf("$ej$") != -1)
                            window.localStorage.removeItem(i); //removing the previously stored plugin item from local storage				
                    }
                }
                else if (document.cookie && !ej.isNullOrUndefined(ej.persistStateVersion) && ej.cookie.get("persistKey") != ej.persistStateVersion) {
                    var splits = document.cookie.split(/; */);
                    for (var k in splits) {
                        if (k.indexOf("$ej$") != -1)
                            ej.cookie.set(k.split("=")[0], model, new Date()); //removing the previously stored plugin item from local storage		
                    }
                }
                this._persistHandler = ej.proxy(this.persistState, this);
                $(window).on("unload", this._persistHandler);
                this.restoreState(true);
            }

            this._init(options);

            if (typeof this.model.keyConfigs === "object" && !(this.model.keyConfigs instanceof Array)) {
                var requiresEvt = false;
                if (this.model.keyConfigs.focus)
                    this.element.attr("accesskey", this.model.keyConfigs.focus);

                for (var keyProps in this.model.keyConfigs) {
                    if (keyProps !== "focus") {
                        requiresEvt = true;
                        break;
                    }
                }

                if (requiresEvt && this._keyPressed) {
                    var el = element, evt = "keydown";

                    if (this.keySettings) {
                        el = this.keySettings.getElement ? this.keySettings.getElement() || el : el;
                        evt = this.keySettings.event || evt;
                    }

                    this._on(el, evt, function (e) {
                        if (!this.model.keyConfigs) return;

                        var action = keyFn.getActionFromCode(this.model.keyConfigs, e.which, e.ctrlKey, e.shiftKey, e.altKey);
                        var arg = {
                            code: e.which,
                            ctrl: e.ctrlKey,
                            alt: e.altKey,
                            shift: e.shiftKey
                        };
                        if (!action) return;

                        if (this._keyPressed(action, e.target, arg, e) === false)
                            e.preventDefault();
                    });
                }
            }
            this._trigger("create");
        }, proto);

        $.fn[pluginName] = function (options) {
            var opt = options, args;
            for (var i = 0; i < this.length; i++) {

                var $this = $(this[i]),
                    pluginObj = $this.data(pluginName),
                    isAlreadyExists = pluginObj && $this.hasClass(nameSpace),
                    obj = null;

                if (this.length > 0 && $.isPlainObject(opt))
                    options = ej.copyObject({}, opt);

                // ----- plug-in creation/init
                if (!isAlreadyExists) {
                    if (proto.prototype._requiresID === true && !$(this[i]).attr("id")) {
                        $this.attr("id", getUid("ejControl_"));
                    }
                    if (!options || typeof options === "object") {
                        if (proto.prototype.defaults && !ej.isNullOrUndefined(ej.setCulture) && "locale" in proto.prototype.defaults && pluginName != "ejChart") {
                            if (options && !("locale" in options)) options.locale = ej.setCulture().name;
                            else if (ej.isNullOrUndefined(options)) {
                                options = {}; options.locale = ej.setCulture().name;
                            }
                        }
                        new proto($this, options);
                    }
                    else {
                        throwError(pluginName + ": methods/properties can be accessed only after plugin creation");
                    }
                    continue;
                }

                if (!options) continue;

                args = [].slice.call(arguments, 1);

                if (this.length > 0 && args[0] && opt === "option" && $.isPlainObject(args[0])) {
                    args[0] = ej.copyObject({}, args[0]);
                }

                // --- Function/property set/access
                if ($.isPlainObject(options)) {
                    // setModel using JSON object
                    pluginObj.setModel(options);
                }

                    // function/property name starts with "_" is private so ignore it.
                else if (options.indexOf('_') !== 0
                    && !ej.isNullOrUndefined(obj = ej.getObject(options, pluginObj))
                    || options.indexOf("model.") === 0) {

                    if (!obj || !$.isFunction(obj)) {

                        // if property is accessed, then break the jquery chain
                        if (arguments.length == 1)
                            return obj;

                        //setModel using string input
                        pluginObj.option(options, arguments[1]);

                        continue;
                    }

                    var value = obj.apply(pluginObj, args);

                    // If function call returns any value, then break the jquery chain
                    if (value !== undefined)
                        return value;

                } else {
                    throwError(className + ": function/property - " + options + " does not exist");
                }
            }
            if (pluginName.indexOf("ejm") != -1)
                ej.widget.registerInstance($this, pluginName, className, proto.prototype);
            // maintaining jquery chain
            return this;
        };

        ej.widget.register(pluginName, className, proto.prototype);
    };

    $.extend(ej.widget, (function () {
        var _widgets = {}, _registeredInstances = [],

        register = function (pluginName, className, prototype) {
            if (!ej.isNullOrUndefined(_widgets[pluginName]))
                throwError("ej.widget : The widget named " + pluginName + " is trying to register twice.");

            _widgets[pluginName] = { name: pluginName, className: className, proto: prototype };

            ej.widget.extensions && ej.widget.extensions.registerWidget(pluginName);
        },
        registerInstance = function (element, pluginName, className, prototype) {
            _registeredInstances.push({ element: element, pluginName: pluginName, className: className, proto: prototype });
        }

        return {
            register: register,
            registerInstance: registerInstance,
            registeredWidgets: _widgets,
            registeredInstances: _registeredInstances
        };

    })());

    ej.widget.destroyAll = function (elements) {
        if (!elements || !elements.length) return;

        for (var i = 0; i < elements.length; i++) {
            var data = elements.eq(i).data(), wds = data["ejWidgets"];
            if (wds && wds.length) {
                for (var j = 0; j < wds.length; j++) {
                    if (data[wds[j]] && data[wds[j]].destroy)
                        data[wds[j]].destroy();
                }
            }
        }
    };

    ej.cookie = {
        get: function (name) {
            var value = RegExp(name + "=([^;]+)").exec(document.cookie);

            if (value && value.length > 1)
                return value[1];

            return undefined;
        },
        set: function (name, value, expiryDate) {
            if (typeof value === "object")
                value = JSON.stringify(value);

            value = escape(value) + ((expiryDate == null) ? "" : "; expires=" + expiryDate.toUTCString());
            document.cookie = name + "=" + value;
        }
    };

    var keyFn = {
        getActionFromCode: function (keyConfigs, keyCode, isCtrl, isShift, isAlt) {
            isCtrl = isCtrl || false;
            isShift = isShift || false;
            isAlt = isAlt || false;

            for (var keys in keyConfigs) {
                if (keys === "focus") continue;

                var key = keyFn.getKeyObject(keyConfigs[keys]);
                for (var i = 0; i < key.length; i++) {
                    if (keyCode === key[i].code && isCtrl == key[i].isCtrl && isShift == key[i].isShift && isAlt == key[i].isAlt)
                        return keys;
                }
            }
            return null;
        },
        getKeyObject: function (key) {
            var res = {
                isCtrl: false,
                isShift: false,
                isAlt: false
            };
            var tempRes = $.extend(true, {}, res);
            var $key = key.split(","), $res = [];
            for (var i = 0; i < $key.length; i++) {
                var rslt = null;
                if ($key[i].indexOf("+") != -1) {
                    var k = $key[i].split("+");
                    for (var j = 0; j < k.length; j++) {
                        rslt = keyFn.getResult($.trim(k[j]), res);
                    }
                }
                else {
                    rslt = keyFn.getResult($.trim($key[i]), $.extend(true, {}, tempRes));
                }
                $res.push(rslt);
            }
            return $res;
        },
        getResult: function (key, res) {
            if (key === "ctrl")
                res.isCtrl = true;
            else if (key === "shift")
                res.isShift = true;
            else if (key === "alt")
                res.isAlt = true;
            else res.code = parseInt(key, 10);
            return res;
        }
    };

    ej.getScrollableParents = function (element) {
        return $(element).parentsUntil("html").filter(function () {
            return $(this).css("overflow") != "visible";
        }).add($(window));
    }
    ej.browserInfo = function () {
        var browser = {}, clientInfo = [],
        browserClients = {
            opera: /(opera|opr)(?:.*version|)[ \/]([\w.]+)/i, edge: /(edge)(?:.*version|)[ \/]([\w.]+)/i, webkit: /(chrome)[ \/]([\w.]+)/i, safari: /(webkit)[ \/]([\w.]+)/i, msie: /(msie|trident) ([\w.]+)/i, mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
        };
        for (var client in browserClients) {
            if (browserClients.hasOwnProperty(client)) {
                clientInfo = navigator.userAgent.match(browserClients[client]);
                if (clientInfo) {
                    browser.name = clientInfo[1].toLowerCase() == "opr" ? "opera" : clientInfo[1].toLowerCase();
                    browser.version = clientInfo[2];
                    browser.culture = {};
                    browser.culture.name = browser.culture.language = navigator.language || navigator.userLanguage;
                    if (typeof (ej.globalize) != 'undefined') {
                        var oldCulture = ej.preferredCulture().name;
                        var culture = (navigator.language || navigator.userLanguage) ? ej.preferredCulture(navigator.language || navigator.userLanguage) : ej.preferredCulture("en-US");
                        for (var i = 0; (navigator.languages) && i < navigator.languages.length; i++) {
                            culture = ej.preferredCulture(navigator.languages[i]);
                            if (culture.language == navigator.languages[i])
                                break;
                        }
                        ej.preferredCulture(oldCulture);
                        $.extend(true, browser.culture, culture);
                    }
                    if (!!navigator.userAgent.match(/Trident\/7\./)) {
                        browser.name = "msie";
                    }
                    break;
                }
            }
        }
        browser.isMSPointerEnabled = (browser.name == 'msie') && browser.version > 9 && window.navigator.msPointerEnabled;
        browser.pointerEnabled = window.navigator.pointerEnabled;
        return browser;
    };
    ej.eventType = {
        mouseDown: "mousedown touchstart",
        mouseMove: "mousemove touchmove",
        mouseUp: "mouseup touchend",
        mouseLeave: "mouseleave touchcancel",
        click: "click touchend"
    };

    ej.event = function (type, data, eventProp) {

        var e = $.extend(eventProp || {},
            {
                "type": type,
                "model": data,
                "cancel": false
            });

        return e;
    };

    ej.proxy = function (fn, context, arg) {
        if (!fn || typeof fn !== "function")
            return null;

        if ('on' in fn && context)
            return arg ? fn.on(context, arg) : fn.on(context);

        return function () {
            var args = arg ? [arg] : []; args.push.apply(args, arguments);
            return fn.apply(context || this, args);
        };
    };

    ej.hasStyle = function (prop) {
        var style = document.documentElement.style;

        if (prop in style) return true;

        var prefixs = ['ms', 'Moz', 'Webkit', 'O', 'Khtml'];

        prop = prop[0].toUpperCase() + prop.slice(1);

        for (var i = 0; i < prefixs.length; i++) {
            if (prefixs[i] + prop in style)
                return true;
        }

        return false;
    };

    Array.prototype.indexOf = Array.prototype.indexOf || function (searchElement) {
        var len = this.length;

        if (len === 0) return -1;

        for (var i = 0; i < len; i++) {
            if (i in this && this[i] === searchElement)
                return i;
        }
        return -1;
    };

    String.prototype.startsWith = String.prototype.startsWith || function (key) {
        return this.slice(0, key.length) === key;
    };
    var copyObject = ej.copyObject = function (isDeepCopy, target) {
        var start = 2, current, source;
        if (typeof isDeepCopy !== "boolean") {
            start = 1;
        }
        var objects = [].slice.call(arguments, start);
        if (start === 1) {
            target = isDeepCopy;
            isDeepCopy = undefined;
        }

        for (var i = 0; i < objects.length; i++) {
            for (var prop in objects[i]) {
                current = target[prop], source = objects[i][prop];

                if (source === undefined || current === source || objects[i] === source || target === source)
                    continue;
                if (source instanceof Array) {
                    if (i === 0 && isDeepCopy) {
                        target[prop] = new Array();
                        for (var j = 0; j < source.length; j++) {
                            copyObject(true, target[prop], source);
                        }
                    }
                    else
                        target[prop] = source.slice();
                }
                else if (ej.isPlainObject(source)) {
                    target[prop] = current || {};
                    if (isDeepCopy)
                        copyObject(isDeepCopy, target[prop], source);
                    else
                        copyObject(target[prop], source);
                } else
                    target[prop] = source;
            }
        }
        return target;
    };
    var pInstance = function () {
        return this;
    }

    var _uid = 0;
    var getUid = function (prefix) {
        return prefix + _uid++;
    }

    ej.template = {};

    ej.template.render = ej.template["text/x-jsrender"] = function (self, selector, data, index, prop) {
        if (selector.slice(0, 1) !== "#")
            selector = ["<div>", selector, "</div>"].join("");
        var property = { prop: prop, index: index };
        return $(selector).render(data, property);
    }

    ej.isPlainObject = function (obj) {
        if (!obj) return false;
        if (ej.DataManager !== undefined && obj instanceof ej.DataManager) return false;
        if (typeof obj !== "object" || obj.nodeType || jQuery.isWindow(obj)) return false;
        try {
            if (obj.constructor &&
                !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        var key, ownLast = ej.support.isOwnLast;
        for (key in obj) {
            if (ownLast) break;
        }

        return key === undefined || obj.hasOwnProperty(key);
    };
    var getValueFn = false;
    ej.util.valueFunction = function (prop) {
        return function (value, getObservable) {
            var val = ej.getObject(prop, this.model);

            if (getValueFn === false)
                getValueFn = ej.getObject("observables.getValue", ej.widget);

            if (value === undefined) {
                if (!ej.isNullOrUndefined(getValueFn)) {
                    return getValueFn(val, getObservable);
                }
                return typeof val === "function" ? val.call(this) : val;
            }

            if (typeof val === "function") {
                this["ob.values"][prop] = value;
                val.call(this, value);
            }
            else
                ej.createObject(prop, value, this.model);
        }
    };
    ej.util.getVal = function (val) {
        if (typeof val === "function")
            return val();
        return val;
    };
    ej.support = {
        isOwnLast: function () {
            var fn = function () { this.a = 1; };
            fn.prototype.b = 1;

            for (var p in new fn()) {
                return p === "b";
            }
        }(),
        outerHTML: function () {
            return document.createElement("div").outerHTML !== undefined;
        }()
    };

    var throwError = ej.throwError = function (er) {
        try {
            throw new Error(er);
        } catch (e) {
            throw e.message + "\n" + e.stack;
        }
    };

    ej.getRandomValue = function (min, max) {
        if (min === undefined || max === undefined)
            return ej.throwError("Min and Max values are required for generating a random number");

        var rand;
        if ("crypto" in window && "getRandomValues" in crypto) {
            var arr = new Uint16Array(1);
            window.crypto.getRandomValues(arr);
            rand = arr[0] % (max - min) + min;
        }
        else rand = Math.random() * (max - min) + min;
        return rand | 0;
    }

    ej.extensions = {};
    ej.extensions.modelGUID = "{0B1051BA-1CCB-42C2-A3B5-635389B92A50}";
})(window.jQuery, window.Syncfusion);
(function () {
    $.fn.addEleAttrs = function (json) {
        var $this = $(this);
        $.each(json, function (i, attr) {
            if (attr && attr.specified) {
                $this.attr(attr.name, attr.value);
            }
        });

    };
    $.fn.removeEleAttrs = function (regex) {
        return this.each(function () {
            var $this = $(this),
                names = [],
                attrs = $(this.attributes).clone();
            $.each(attrs, function (i, attr) {
                if (attr && attr.specified && regex.test(attr.name)) {
                    $this.removeAttr(attr.name);
                }
            });
        });
    };
    $.fn.attrNotStartsWith = function (regex) {
        var proxy = this;
        var attributes = [], attrs;
        this.each(function () {
            attrs = $(this.attributes).clone();
        });
        for (i = 0; i < attrs.length; i++) {
            if (attrs[i] && attrs[i].specified && regex.test(attrs[i].name)) {
                continue
            }
            else
                attributes.push(attrs[i])
        }
        return attributes;

    }
    $.fn.removeEleEmptyAttrs = function () {
        return this.each(function () {
            var $this = $(this),
                names = [],
                attrs = $(this.attributes).clone();
            $.each(attrs, function (i, attr) {
                if (attr && attr.specified && attr.value === "") {
                    $this.removeAttr(attr.name);
                }
            });
        });
    };
    $.extend($.support, {
        has3d: ej.addPrefix('perspective') in ej.styles,
        hasTouch: 'ontouchstart' in window,
        hasPointer: navigator.msPointerEnabled,
        hasTransform: ej.userAgent() !== false,
        pushstate: "pushState" in history &&
        "replaceState" in history,
        hasTransition: ej.addPrefix('transition') in ej.styles
    });
    //Ensuring elements having attribute starts with 'ejm-' 
    $.extend($.expr[':'], {
        attrNotStartsWith: function (element, index, match) {
            var i, attrs = element.attributes;
            for (i = 0; i < attrs.length; i++) {
                if (attrs[i].nodeName.indexOf(match[3]) === 0) {
                    return false;
                }
            }
            return true;
        }
    });
    //addBack() is supported from Jquery >1.8 and andSelf() supports later version< 1.8. support for both the method is provided by extending the JQuery function.
    var oldSelf = $.fn.andSelf || $.fn.addBack;
    $.fn.andSelf = $.fn.addBack = function () {
        return oldSelf.apply(this, arguments);
    };
})();;
;
window.ej = window.Syncfusion = window.Syncfusion || {};

(function ($, ej, doc, undefined) {
    'use strict';
	
    ej.DataManager = function (dataSource, query, adaptor) {
          if (!(this instanceof ej.DataManager))
            return new ej.DataManager(dataSource, query, adaptor);

        if (!dataSource)
            dataSource = [];
        adaptor = adaptor || dataSource.adaptor;

        if (typeof (adaptor) === "string") 
            adaptor = new ej[adaptor]();
        var data = [], self = this;

        if (dataSource instanceof Array) {
            // JSON array
            data = {
                json: dataSource,
                offline: true
            };

        } else if (typeof dataSource === "object") {
            if ($.isPlainObject(dataSource)) {
                if (!dataSource.json)
                    dataSource.json = [];
                if (dataSource.table)
                    dataSource.json = this._getJsonFromElement(dataSource.table, dataSource.headerOption);
                data = {
                    url: dataSource.url,
                    insertUrl: dataSource.insertUrl,
                    removeUrl: dataSource.removeUrl,
                    updateUrl: dataSource.updateUrl,
                    crudUrl: dataSource.crudUrl,
                    batchUrl: dataSource.batchUrl,
                    json: dataSource.json,
                    headers: dataSource.headers,
                    accept: dataSource.accept,
                    data: dataSource.data,
					async : dataSource.async,
                    timeTillExpiration: dataSource.timeTillExpiration,
                    cachingPageSize: dataSource.cachingPageSize,
                    enableCaching: dataSource.enableCaching,
                    requestType: dataSource.requestType,
                    key: dataSource.key,
                    crossDomain: dataSource.crossDomain,
                    jsonp: dataSource.jsonp,
                    dataType: dataSource.dataType,
                    offline: dataSource.offline !== undefined ? dataSource.offline : dataSource.adaptor == "remoteSaveAdaptor" || dataSource.adaptor instanceof ej.remoteSaveAdaptor ? false : dataSource.url ? false : true,
                    requiresFormat: dataSource.requiresFormat
                };
            } else if (dataSource.jquery || isHtmlElement(dataSource)) {
                data = {
                    json: this._getJsonFromElement(dataSource),
                    offline: true,
                    table: dataSource
                };
            }
        } else if (typeof dataSource === "string") {
            data = {
                url: dataSource,
                offline: false,
                dataType: "json",
                json: []
            };
        }

        if (data.requiresFormat === undefined && !ej.support.cors)
            data.requiresFormat = isNull(data.crossDomain) ? true : data.crossDomain;
        if (data.dataType === undefined)
            data.dataType = "json";
        this.dataSource = data;
        this.defaultQuery = query;

        if (data.url && data.offline && !data.json.length) {
            this.isDataAvailable = false;
            this.adaptor = adaptor || new ej.ODataAdaptor();
            this.dataSource.offline = false;
            this.ready = this.executeQuery(query || ej.Query()).done(function (e) {
                self.dataSource.offline = true;
                self.isDataAvailable = true;
                data.json = e.result;
                self.adaptor = new ej.JsonAdaptor();
            });
        }
        else
            this.adaptor = data.offline ? new ej.JsonAdaptor() : new ej.ODataAdaptor();
        if (!data.jsonp && this.adaptor instanceof ej.ODataAdaptor)
            data.jsonp = "callback";
        this.adaptor = adaptor || this.adaptor;
        if (data.enableCaching)
            this.adaptor = new ej.CacheAdaptor(this.adaptor, data.timeTillExpiration, data.cachingPageSize);
        return this;
    };

    ej.DataManager.prototype = {
        setDefaultQuery: function (query) {
            this.defaultQuery = query;
        },
	
        executeQuery: function (query, done, fail, always) {
            if (typeof query === "function") {
                always = fail;
                fail = done;
                done = query;
                query = null;
            }

            if (!query)
                query = this.defaultQuery;

            if (!(query instanceof ej.Query))
                throwError("DataManager - executeQuery() : A query is required to execute");

            var deffered = $.Deferred();

            deffered.then(done, fail, always);
            var args = { query: query };

            if (!this.dataSource.offline && this.dataSource.url != undefined) {
				 var result = this.adaptor.processQuery(this, query);
                if (!ej.isNullOrUndefined(result.url))
                    this._makeRequest(result, deffered, args, query);
                else {
                    nextTick(function () {
                        args = this._getDeferedArgs(query, result, args);
                        deffered.resolveWith(this, [args]);;
                    }, this);
                }
            } else {
				if(!ej.isNullOrUndefined(this.dataSource.async) && this.dataSource.async == false)
					this._localQueryProcess(query, args, deffered);
				else{
					nextTick(function () {
						this._localQueryProcess(query, args, deffered);
					}, this);
				}
            }
            return deffered.promise();
        },
		_localQueryProcess: function(query, args, deffered){
			var res = this.executeLocal(query);
			args = this._getDeferedArgs(query, res, args);
			deffered.resolveWith(this, [args]);
		},
        _getDeferedArgs: function (query, result, args) {
            if (query._requiresCount) {
                args.result = result.result;
                args.count = result.count;
            } else
                args.result = result;
            args.getTableModel = getTableModel(query._fromTable, args.result, this);
            args.getKnockoutModel = getKnockoutModel(args.result);
            return args;
        },
	
        executeLocal: function (query) {
            if (!this.defaultQuery && !(query instanceof ej.Query))
                throwError("DataManager - executeLocal() : A query is required to execute");

            if (!this.dataSource.json)
                throwError("DataManager - executeLocal() : Json data is required to execute");

            query = query || this.defaultQuery;

            var result = this.adaptor.processQuery(this, query);

            if (query._subQuery) {
                var from = query._subQuery._fromTable, lookup = query._subQuery._lookup,
                    res = query._requiresCount ? result.result : result;

                if (lookup && lookup instanceof Array) {
                    buildHierarchy(query._subQuery._fKey, from, res, lookup, query._subQuery._key);
                }

                for (var j = 0; j < res.length; j++) {
                    if (res[j][from] instanceof Array) {
                        res[j] = $.extend({}, res[j]);
                        res[j][from] = this.adaptor.processResponse(query._subQuery.using(ej.DataManager(res[j][from].slice(0))).executeLocal(), this, query);
                    }
                }
            }

            return this.adaptor.processResponse(result, this, query);
        },

        _makeRequest: function (url, deffered, args, query) {
            var isSelector = !!query._subQuerySelector;

            var fnFail = $proxy(function (e) {
                args.error = e;
                deffered.rejectWith(this, [args]);
            }, this);

            var process = $proxy(function (data, count, xhr, request, actual, aggregates, virtualSelectRecords) {
                if (isSelector) return;

                args.xhr = xhr;
                args.count = parseInt(count, 10);
                args.result = data;
                args.request = request;
                args.aggregates = aggregates;
                args.getTableModel = getTableModel(query._fromTable, data, this);
                args.getKnockoutModel = getKnockoutModel(data);
                args.actual = actual;
                args.virtualSelectRecords = virtualSelectRecords;
                deffered.resolveWith(this, [args]);

            }, this);

            var fnQueryChild = $proxy(function (data, selector) {
                var subDeffer = $.Deferred(),
                    childArgs = { parent: args };

                query._subQuery._isChild = true;

                var subUrl = this.adaptor.processQuery(this, query._subQuery, data ? this.adaptor.processResponse(data) : selector);

                var childReq = this._makeRequest(subUrl, subDeffer, childArgs, query._subQuery);

                if(!isSelector)
                    subDeffer.then(function (subData) {
                        if (data) {
                            buildHierarchy(query._subQuery._fKey, query._subQuery._fromTable, data, subData, query._subQuery._key);
                            process(data);
                        }
                    }, fnFail);

                return childReq;
            }, this);

            var fnSuccess = proxy(function (data, status, xhr, request) {
                if (xhr.getResponseHeader("Content-Type").indexOf("xml") == -1 && ej.dateParse)
                    data = ej.parseJSON(data);
                var result = this.adaptor.processResponse(data, this, query, xhr, request), count = 0, aggregates = null;
                var virtualSelectRecords = data.virtualSelectRecords;
                if (query._requiresCount) {
                    count = result.count;
                    aggregates = result.aggregates;
                    result = result.result;
                }

                if (!query._subQuery) {
                    process(result, count, xhr, request, data, aggregates, virtualSelectRecords);
                    return;
                }

                if (!isSelector)
                    fnQueryChild(result);

            }, this);

            var req = $.extend({
                type: "GET",
                dataType: this.dataSource.dataType,
                crossDomain: this.dataSource.crossDomain,
                jsonp: this.dataSource.jsonp,
                cache: true,
                beforeSend: $proxy(this._beforeSend, this),
                processData: false,
                success: fnSuccess,
                error: fnFail
            }, url);

            if ("async" in this.dataSource)
                req.async = this.dataSource.async;

            req = $.ajax(req);

            if (isSelector) {
                var res = query._subQuerySelector.call(this, { query: query._subQuery, parent: query });

                if (res && res.length) {
                    req = $.when(req, fnQueryChild(null, res));

                    req.then(proxy(function (pData, cData, requests) {
                        var pResult = this.adaptor.processResponse(pData[0], this, query, pData[2], requests[0]), count = 0;
                        if (query._requiresCount) {
                            count = pResult.count;
                            pResult = pResult.result;
                        }
                        var cResult = this.adaptor.processResponse(cData[0], this, query._subQuery, cData[2], requests[1]), count = 0;
                        if (query._subQuery._requiresCount) {
                            count = cResult.count;
                            cResult = cResult.result;
                        }

                        buildHierarchy(query._subQuery._fKey, query._subQuery._fromTable, pResult, cResult, query._subQuery._key);
                        isSelector = false;
                        process(pResult, count, pData[2]);

                    }, this), fnFail);
                } else {
                    isSelector = false;
                }
            }

            return req;
        },

        _beforeSend: function (request, settings) {
            this.adaptor.beforeSend(this, request, settings);

            var headers = this.dataSource.headers, props;
            for (var i = 0; headers && i < headers.length; i++) {
                props = [];
                for (var prop in headers[i]) {
                    props.push(prop);
                    request.setRequestHeader(prop, headers[i][prop]);
                }
            }
        },
	
        saveChanges: function (changes, key, tableName, query) {

            if (tableName instanceof ej.Query) {
                query = tableName;
                tableName = null;
            }

            var args = {
                url: tableName,
                key: key || this.dataSource.key
            };

            var req = this.adaptor.batchRequest(this, changes, args, query);

            if (this.dataSource.offline) {
                return req;
            }

            var deff = $.Deferred();
            $.ajax($.extend({
                beforeSend: $proxy(this._beforeSend, this),
                success: proxy(function (data, status, xhr, request) {
                    deff.resolveWith(this, [this.adaptor.processResponse(data, this, null, xhr, request, changes)]);
                }, this),
                error: function (e) {
                    deff.rejectWith(this, [{ error: e }]);
                }
            }, req));

            return deff.promise();
        },
	
        insert: function (data, tableName, query) {           
            data = p.replacer(data);

            if (tableName instanceof ej.Query) {
                query = tableName;
                tableName = null;
            }

            var res = this.adaptor.insert(this, data, tableName, query);

            if (this.dataSource.offline) {
                return res;
            }            

            var deffer = $.Deferred();

            $.ajax($.extend({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                processData: false,
                beforeSend: $proxy(this._beforeSend, this),
                success: proxy(function (record, status, xhr, request) {
                    try {
                        if (ej.isNullOrUndefined(record))
                            record = [];
                        else
                            p.parseJson(record);
                    }
                    catch (e) {
                        record = [];
                    }
                    record = this.adaptor.processResponse(p.parseJson(record), this, null, xhr, request);
                    deffer.resolveWith(this, [{ record: record, dataManager: this }]);
                }, this),
                error: function (e) {
                    deffer.rejectWith(this, [{ error: e, dataManager: this }]);
                }
            }, res));

            return deffer.promise();
        },
	
        remove: function (keyField, value, tableName, query) {
            if (typeof value === "object")
                value = value[keyField];

            if (tableName instanceof ej.Query) {
                query = tableName;
                tableName = null;
            }

            var res = this.adaptor.remove(this, keyField, value, tableName, query);

            if (this.dataSource.offline)
                return res;          

            var deffer = $.Deferred();
            $.ajax($.extend({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                beforeSend: $proxy(this._beforeSend, this),
                success: proxy(function (record, status, xhr, request) {
                    try {
                        if (ej.isNullOrUndefined(record))
                            record = [];
                        else
                            p.parseJson(record);
                    }
                    catch (e) {
                        record = [];
                    }
                    record = this.adaptor.processResponse(p.parseJson(record), this, null, xhr, request);
                    deffer.resolveWith(this, [{ record: record, dataManager: this }]);
                }, this),
                error: function (e) {
                    deffer.rejectWith(this, [{ error: e, dataManager: this }]);
                }
            }, res));
            return deffer.promise();
        },
	
        update: function (keyField, value, tableName, query) {
            value = p.replacer(value);

            if (tableName instanceof ej.Query) {
                query = tableName;
                tableName = null;
            }

            var res = this.adaptor.update(this, keyField, value, tableName, query);

            if (this.dataSource.offline) {
                return res;
            }           

            var deffer = $.Deferred();

           $.ajax($.extend({
                contentType: "application/json; charset=utf-8",
                beforeSend: $proxy(this._beforeSend, this),
                success: proxy(function (record, status, xhr, request) {
                    try {
                        if (ej.isNullOrUndefined(record))
                            record = [];
                        else
                            p.parseJson(record);
                    }
                    catch (e) {
                        record = [];
                    }
                    record = this.adaptor.processResponse(p.parseJson(record), this, null, xhr, request);
                    deffer.resolveWith(this, [{ record: record, dataManager: this }]);
                }, this),
                error: function (e) {
                    deffer.rejectWith(this, [{ error: e, dataManager: this }]);
                }
           }, res));

           return deffer.promise();
        },

        _getJsonFromElement: function (ds) {
            if (typeof (ds) == "string")
                ds = $($(ds).html());

            ds = ds.jquery ? ds[0] : ds;

            var tagName = ds.tagName.toLowerCase();

            if (tagName !== "table")
                throwError("ej.DataManager : Unsupported htmlElement : " + tagName);

            return ej.parseTable(ds);
        }
    };

    var buildHierarchy = function (fKey, from, source, lookup, pKey) {
        var i, grp = {}, t;
        if (lookup.result) lookup = lookup.result;

        if (lookup.GROUPGUID)
            throwError("ej.DataManager: Do not have support Grouping in hierarchy");

        for (i = 0; i < lookup.length; i++) {
            var fKeyData = ej.getObject(fKey, lookup[i]);
            t = grp[fKeyData] || (grp[fKeyData] = []);

            t.push(lookup[i]);
        }

        for (i = 0; i < source.length; i++) {
            source[i][from] = grp[ej.getObject(pKey || fKey, source[i])];
        }
    };

    var oData = {
        accept: "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5",
        multipartAccept: "multipart/mixed",
        batch: "$batch",
        changeSet: "--changeset_",
        batchPre: "batch_",
        contentId: "Content-Id: ",
        batchContent: "Content-Type: multipart/mixed; boundary=",
        changeSetContent: "Content-Type: application/http\nContent-Transfer-Encoding: binary ",
        batchChangeSetContentType: "Content-Type: application/json; charset=utf-8 "
    };
    var p = {
        parseJson: function (jsonText) {
            var type = typeof jsonText;
            if (type === "string") {
                jsonText = JSON.parse(jsonText, p.jsonReviver);
            } else if (jsonText instanceof Array) {
                p.iterateAndReviveArray(jsonText);
            } else if (type === "object")
                p.iterateAndReviveJson(jsonText);
            return jsonText;
        },
        iterateAndReviveArray: function (array) {
            for (var i = 0; i < array.length; i++) {
                if (typeof array[i] === "object")
                    p.iterateAndReviveJson(array[i]);
                else if (typeof array[i] === "string" && !/^[\s]*\[|^[\s]*\{|\"/g.test(array[i]))
                    array[i] = p.jsonReviver("",array[i]);
                else
                    array[i] = p.parseJson(array[i]);
            }
        },
        iterateAndReviveJson: function (json) {
            var value;

            for (var prop in json) {
                if (prop.startsWith("__"))
                    continue;

                value = json[prop];
                if (typeof value === "object") {
                    if (value instanceof Array)
                        p.iterateAndReviveArray(value);
                    else
                        p.iterateAndReviveJson(value);
                } else
                    json[prop] = p.jsonReviver(prop, value);
            }
        },
        jsonReviver: function (field, value) {
            var s = value;
            if (typeof value === "string") {
                var ms = /^\/Date\(([+-]?[0-9]+)([+-][0-9]{4})?\)\/$/.exec(value);
                if (ms)
                    return p.replacer(new Date(parseInt(ms[1])));
                else if (/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*){1})([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(value)) {
                    value = p.replacer(new Date(value));
                    if (isNaN(value)) {
                        var a = s.split(/[^0-9]/);
                        value = p.replacer(new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]));
                    }
                }
            }

            return value;
        },
        isJson: function (jsonData) {
            if(typeof jsonData[0]== "string")
                return jsonData;
            return ej.parseJSON(jsonData);
        },
        isGuid: function (value) {
            var regex = /[A-Fa-f0-9]{8}(?:-[A-Fa-f0-9]{4}){3}-[A-Fa-f0-9]{12}/i;
            var match = regex.exec(value);
            return match != null;
        },
        replacer: function (value) {

            if (ej.isPlainObject(value))
                return p.jsonReplacer(value);

            if (value instanceof Array)
                return p.arrayReplacer(value);

            if (value instanceof Date)
                return p.jsonReplacer({ val: value }).val;

            return value;
        },
        jsonReplacer: function (val) {
            var value;
            for (var prop in val) {
                value = val[prop];

                if (!(value instanceof Date))
                    continue;
                val[prop] = new Date(+value + (ej.serverTimezoneOffset * 60 * 60 * 1000));
            }

            return val;
        },
        arrayReplacer: function (val) {

            for (var i = 0; i < val.length; i++) {            
                if (ej.isPlainObject(val[i]))
                    val[i] = p.jsonReplacer(val[i]);
                else if (val[i] instanceof Date)
                    val[i] = p.jsonReplacer({ date: val[i] }).date;
            }

            return val;
        }
    };

    ej.isJSON = p.isJson;
    ej.parseJSON = p.parseJson;
    ej.dateParse = true;
    ej.isGUID = p.isGuid;
    ej.Query = function (from) {
        if (!(this instanceof ej.Query))
            return new ej.Query(from);

        this.queries = [];
        this._key = "";
        this._fKey = "";

        if (typeof from === "string")
            this._fromTable = from || "";
        else if (from && from instanceof Array)
            this._lookup = from;

        this._expands = [];
        this._sortedColumns = [];
        this._groupedColumns = [];
        this._subQuery = null;
        this._isChild = false;
        this._params = [];
        return this;
    };

    ej.Query.prototype = {
        key: function (field) {
            if (typeof field === "string")
                this._key = field;

            return this;
        },
	
        using: function (dataManager) {
            if (dataManager instanceof ej.DataManager) {
                this.dataManagar = dataManager;
                return this;
            }

            return throwError("Query - using() : 'using' function should be called with parameter of instance ej.DataManager");
        },
	
        execute: function (dataManager, done, fail, always) {
            dataManager = dataManager || this.dataManagar;

            if (dataManager && dataManager instanceof ej.DataManager)
                return dataManager.executeQuery(this, done, fail, always);

            return throwError("Query - execute() : dataManager needs to be is set using 'using' function or should be passed as argument");
        },
	
        executeLocal: function (dataManager) {
            // this does not support for URL binding
            

            dataManager = dataManager || this.dataManagar;

            if (dataManager && dataManager instanceof ej.DataManager)
                return dataManager.executeLocal(this);

            return throwError("Query - executeLocal() : dataManager needs to be is set using 'using' function or should be passed as argument");
        },
	
        clone: function () {
            var cl = new ej.Query();
            cl.queries = this.queries.slice(0);
            cl._key = this._key;
            cl._isChild = this._isChild;
            cl.dataManagar = this.dataManager;
            cl._fromTable = this._fromTable;
            cl._params = this._params.slice(0);
            cl._expands = this._expands.slice(0);
            cl._sortedColumns = this._sortedColumns.slice(0);
            cl._groupedColumns = this._groupedColumns.slice(0);
            cl._subQuerySelector = this._subQuerySelector;
            cl._subQuery = this._subQuery;
            cl._fKey = this._fKey;
            cl._requiresCount = this._requiresCount;
            return cl;
        },
	
        from: function (tableName) {
            if (typeof tableName === "string")
                this._fromTable = tableName;

            return this;
        },
	
        addParams: function (key, value) {
            if (typeof value !== "function" && !ej.isPlainObject(value))
                this._params.push({ key: key, value: value });
            else if (typeof value === "function")
                this._params.push({ key: key, fn: value });

            return this;
        },
	
        expand: function (tables) {
            if (typeof tables === "string")
                this._expands = [].slice.call(arguments, 0);
            else
                this._expands = tables.slice(0);

            return this;
        },
	
        where: function (fieldName, operator, value, ignoreCase) {
            operator = (operator || ej.FilterOperators.equal).toLowerCase();
            var predicate = null;

            if (typeof fieldName === "string")
                predicate = new ej.Predicate(fieldName, operator, value, ignoreCase);
            else if (fieldName instanceof ej.Predicate)
                predicate = fieldName;
            else
                throwError("Query - where : Invalid arguments");

            this.queries.push({
                fn: "onWhere",
                e: predicate
            });
            return this;
        },
	
        search: function (searchKey, fieldNames, operator, ignoreCase) {
            if (!fieldNames || typeof fieldNames === "boolean") {
                fieldNames = [];
                ignoreCase = fieldNames;
            } else if (typeof fieldNames === "string")
                fieldNames = [fieldNames];

            if (typeof operator === "boolean") {
                ignoreCase = operator;
                operator = null;
            }
            operator = operator || ej.FilterOperators.contains;
            if (operator.length < 3)
                operator = ej.data.operatorSymbols[operator];

            var comparer = ej.data.fnOperators[operator] || ej.data.fnOperators.processSymbols(operator);

            this.queries.push({
                fn: "onSearch",
                e: {
                    fieldNames: fieldNames,
                    operator: operator,
                    searchKey: searchKey,
                    ignoreCase: ignoreCase,
                    comparer: comparer
                }
            });
            return this;
        },
		
        sortBy: function (fieldName, comparer, isFromGroup) {
            var order = ej.sortOrder.Ascending, sorts, t;

            if (typeof fieldName === "string" && fieldName.toLowerCase().endsWith(" desc")) {
                fieldName = fieldName.replace(/ desc$/i, '');
                comparer = ej.sortOrder.Descending;
            }
            if (fieldName instanceof Array) {
                for(var i=0;i<fieldName.length;i++)
                   this.sortBy(fieldName[i],comparer,isFromGroup);
                return this;
            }
            if (typeof comparer === "boolean")
                comparer = !comparer ? ej.sortOrder.Ascending : ej.sortOrder.Descending;
            else if (typeof comparer === "function")
                order = "custom";

            if (!comparer || typeof comparer === "string") {
                order = comparer ? comparer.toLowerCase() : ej.sortOrder.Ascending;
                comparer = ej.pvt.fnSort(comparer);
            }
            if (isFromGroup) {
                sorts = filterQueries(this.queries, "onSortBy");

                for (var i = 0; i < sorts.length; i++) {
                    t = sorts[i].e.fieldName;
                    if (typeof t === "string") {
                        if (t === fieldName) return this;
                    } else if (t instanceof Array) {
                        for (var j = 0; j < t.length; j++)
                            if (t[j] === fieldName || fieldName.toLowerCase() === t[j] + " desc")
                                return this;
                    }
                }
            }

            this.queries.push({
                fn: "onSortBy",
                e: {
                    fieldName: fieldName,
                    comparer: comparer,
                    direction: order
                }
            });

            return this;
        },
		
        sortByDesc: function (fieldName) {
            return this.sortBy(fieldName, ej.sortOrder.Descending);
        },
		
        group: function (fieldName,fn) {
            this.sortBy(fieldName, null, true);

            this.queries.push({
                fn: "onGroup",
                e: {
                    fieldName: fieldName,
                    fn: fn
                }
            });
            return this;
        },
	
        page: function (pageIndex, pageSize) {
            this.queries.push({
                fn: "onPage",
                e: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                }
            });
            return this;
        },
	
        range: function (start, end) {
            if (typeof start !== "number" || typeof end !== "number")
                throwError("Query() - range : Arguments type should be a number");

            this.queries.push({
                fn: "onRange",
                e: {
                    start: start,
                    end: end
                }
            });
            return this;
        },
	

        take: function (nos) {
            if (typeof nos !== "number")
                throwError("Query() - Take : Argument type should be a number");

            this.queries.push({
                fn: "onTake",
                e: {
                    nos: nos
                }
            });
            return this;
        },
	
        skip: function (nos) {
            if (typeof nos !== "number")
                throwError("Query() - Skip : Argument type should be a number");

            this.queries.push({
                fn: "onSkip",
                e: { nos: nos }
            });
            return this;
        },
	
        select: function (fieldNames) {
            if (typeof fieldNames === "string")
                fieldNames = [].slice.call(arguments, 0);

            if (!(fieldNames instanceof Array)) {
                throwError("Query() - Select : Argument type should be String or Array");
            }

            this.queries.push({
                fn: "onSelect",
                e: { fieldNames: fieldNames }
            });
            return this;
        },
	
        hierarchy: function (query, selectorFn) {
            if (!query || !(query instanceof ej.Query))
                throwError("Query() - hierarchy : query must be instance of ej.Query");

            if (typeof selectorFn === "function")
                this._subQuerySelector = selectorFn;

            this._subQuery = query;
            return this;
        },
	
        foreignKey: function (key) {
            if (typeof key === "string")
                this._fKey = key;

            return this;
        },
	
        requiresCount: function () {
            this._requiresCount = true;

            return this;
        },
        //type - sum, avg, min, max
        aggregate: function (type, field) {
            this.queries.push({
                fn: "onAggregates",
                e: { field: field, type: type }
            });
        }
    };

    ej.Adaptor = function (ds) {
        this.dataSource = ds;
        this.pvt = {};
		this.init.apply(this, [].slice.call(arguments, 1));
    };

    ej.Adaptor.prototype = {
        options: {
            from: "table",
            requestType: "json",
            sortBy: "sorted",
            select: "select",
            skip: "skip",
            group: "group",
            take: "take",
            search: "search",
            count: "requiresCounts",
            where: "where",
            aggregates: "aggregates"
        },
        init: function () {
        },
        extend: function (overrides) {
            var fn = function (ds) {
                this.dataSource = ds;

                if (this.options)
                    this.options = $.extend({}, this.options);
				this.init.apply(this, [].slice.call(arguments, 0));

                this.pvt = {};
            };
            fn.prototype = new this.type();
            fn.prototype.type = fn;

            var base = fn.prototype.base = {};
            for (var p in overrides) {
                if (fn.prototype[p])
                    base[p] = fn.prototype[p];
            }
            $.extend(true, fn.prototype, overrides);
            return fn;
        },
        processQuery: function (dm, query) {
            // this needs to be overridden
        },
        processResponse: function (data, ds, query, xhr) {
            if (data.d)
               return data.d;
            return data;
        },
        convertToQueryString: function (req, query, dm) {
            return $.param(req);
        },
        type: ej.Adaptor
    };

    ej.UrlAdaptor = new ej.Adaptor().extend({
        processQuery: function (dm, query, hierarchyFilters) {
            var sorted = filterQueries(query.queries, "onSortBy"),
                grouped = filterQueries(query.queries, "onGroup"),
                filters = filterQueries(query.queries, "onWhere"),
                searchs = filterQueries(query.queries, "onSearch"),
                aggregates = filterQueries(query.queries, "onAggregates"),
                singles = filterQueryLists(query.queries, ["onSelect", "onPage", "onSkip", "onTake", "onRange"]),
                params = query._params,
                url = dm.dataSource.url, tmp, skip, take = null,
                op = this.options;

            var r = {
                sorted: [],
                grouped: [],
                filters: [],
                searches: [],
                aggregates: []
            };

            // calc Paging & Range
            if (singles["onPage"]) {
                tmp = singles["onPage"];
                skip = getValue(tmp.pageIndex, query);
                take = getValue(tmp.pageSize, query);
				skip = (skip - 1) * take;
            } else if (singles["onRange"]) {
                tmp = singles["onRange"];
                skip = tmp.start;
                take = tmp.end - tmp.start;
            }

            // Sorting
            for (var i = 0; i < sorted.length; i++) {
                tmp = getValue(sorted[i].e.fieldName, query);

                r.sorted.push(callAdaptorFunc(this, "onEachSort", { name: tmp, direction: sorted[i].e.direction }, query));
            }

            // hierarchy
            if (hierarchyFilters) {
                tmp = this.getFiltersFrom(hierarchyFilters, query);
                if (tmp)
                    r.filters.push(callAdaptorFunc(this, "onEachWhere", tmp.toJSON(), query));
            }

            // Filters
            for (var i = 0; i < filters.length; i++) {
                r.filters.push(callAdaptorFunc(this, "onEachWhere", filters[i].e.toJSON(), query));

                for (var prop in r.filters[i]) {
                    if (isNull(r[prop]))
                        delete r[prop];
                }
            }

            // Searches
            for (var i = 0; i < searchs.length; i++) {
                tmp = searchs[i].e;
                r.searches.push(callAdaptorFunc(this, "onEachSearch", {
                    fields: tmp.fieldNames,
                    operator: tmp.operator,
                    key: tmp.searchKey,
                    ignoreCase: tmp.ignoreCase
                }, query));
            }

            // Grouping
            for (var i = 0; i < grouped.length; i++) {
                r.grouped.push(getValue(grouped[i].e.fieldName, query));
            }

            // aggregates
            for (var i = 0; i < aggregates.length; i++) {
                tmp = aggregates[i].e; 
                r.aggregates.push({ type: tmp.type, field: getValue(tmp.field, query) });
            }

            var req = {};
            req[op.from] = query._fromTable;
            if (op.expand) req[op.expand] = query._expands;
            req[op.select] = singles["onSelect"] ? callAdaptorFunc(this, "onSelect", getValue(singles["onSelect"].fieldNames, query), query) : "";
            req[op.count] = query._requiresCount ? callAdaptorFunc(this, "onCount", query._requiresCount, query) : "";
            req[op.search] = r.searches.length ? callAdaptorFunc(this, "onSearch", r.searches, query) : "";
            req[op.skip] = singles["onSkip"] ? callAdaptorFunc(this, "onSkip", getValue(singles["onSkip"].nos, query), query) : "";
            req[op.take] = singles["onTake"] ? callAdaptorFunc(this, "onTake", getValue(singles["onTake"].nos, query), query) : "";
            req[op.where] = r.filters.length || r.searches.length ? callAdaptorFunc(this, "onWhere", r.filters, query) : "";
            req[op.sortBy] = r.sorted.length ? callAdaptorFunc(this, "onSortBy", r.sorted, query) : "";
            req[op.group] = r.grouped.length ? callAdaptorFunc(this, "onGroup", r.grouped, query) : "";
            req[op.aggregates] = r.aggregates.length ? callAdaptorFunc(this, "onAggregates", r.aggregates, query) : "";
			req["param"] = [];
			
            // Params
			callAdaptorFunc(this, "addParams", { dm: dm, query: query, params: params, reqParams: req });

            // cleanup
            for (var prop in req) {
                if (isNull(req[prop]) || req[prop] === "" || req[prop].length === 0)
                    delete req[prop];
            }

            if (!(op.skip in req && op.take in req) && take !== null) {
                req[op.skip] = callAdaptorFunc(this, "onSkip", skip, query);
                req[op.take] = callAdaptorFunc(this, "onTake", take, query);
            }
            var p = this.pvt;
            this.pvt = {};

            if (this.options.requestType === "json") {
                return {
                    data: JSON.stringify(req),
                    url: url,
                    ejPvtData: p,
                    type: "POST",
                    contentType: "application/json; charset=utf-8"
                }
            }
            tmp = this.convertToQueryString(req, query, dm);
            tmp =  (dm.dataSource.url.indexOf("?")!== -1 ? "&" : "/") + tmp;
            return {
                type: "GET",
                url: tmp.length ? url.replace(/\/*$/, tmp) : url,
                ejPvtData: p
            };
        },
        convertToQueryString: function (req, query, dm) {
            if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1)
                return $.param(req);
            return "?" + $.param(req);
        },
        processResponse: function (data, ds, query, xhr, request, changes) {
            var pvt = request.ejPvtData || {};
			var groupDs= data.groupDs;
			if (xhr && xhr.getResponseHeader("Content-Type") && xhr.getResponseHeader("Content-Type").indexOf("xml") != -1 && data.nodeType == 9)
                return query._requiresCount ? { result: [], count: 0 } : [];
            var d = JSON.parse(request.data);
            if (d && d.action === "batch" && data.added) {
                changes.added = data.added;
                return changes;
            }
            if (data.d)
                data = data.d;

            if (pvt && pvt.aggregates && pvt.aggregates.length) {
                var agg = pvt.aggregates, args = {}, fn, res = {};
                if ('count' in data) args.count = data.count;
                if (data["result"]) args.result = data.result;
                if (data["aggregate"]) data = data.aggregate;
                for (var i = 0; i < agg.length; i++) {
                    fn = ej.aggregates[agg[i].type];
                    if (fn)
                        res[agg[i].field + " - " + agg[i].type] = fn(data, agg[i].field);
                }
                args["aggregates"] = res;
                data = args;
            }

            if (pvt && pvt.groups && pvt.groups.length) {
                var groups = pvt.groups, args = {};
                if ('count' in data) args.count = data.count;
                if (data["aggregates"]) args.aggregates = data.aggregates;
                if (data["result"]) data = data.result;
                for (var i = 0; i < groups.length; i++){
                    var level = null;
                    var format = getColFormat(groups[i], query.queries);
                    if (!ej.isNullOrUndefined(groupDs))
                        groupDs = ej.group(groupDs, groups[i], null, format);
                    data = ej.group(data, groups[i], pvt.aggregates, format, level, groupDs);
                }
                if (args.count != undefined)
                    args.result = data;
                else
                    args = data;
                return args;
            }
            return data;
        },
        onGroup: function (e) {
            this.pvt.groups = e;
        },
        onAggregates: function (e) {
            this.pvt.aggregates = e;
        },
        batchRequest: function (dm, changes, e, query) {
            var res = {
                changed: changes.changed,
                added: changes.added,
                deleted: changes.deleted,
                action: "batch",
                table: e.url,
                key: e.key
            };
            if (query)
                this.addParams({ dm: dm, query: query, params: query._params, reqParams: res });

            return {
                type: "POST",
                url: dm.dataSource.batchUrl || dm.dataSource.crudUrl || dm.dataSource.removeUrl || dm.dataSource.url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(res)
            };
        },
        beforeSend: function (dm, request) {
        },
        insert: function (dm, data, tableName, query) {
            var res = {
                value: data,
                table: tableName,
                action: "insert"
            };
            if (query)
                this.addParams({ dm: dm, query: query, params: query._params, reqParams: res });

            return {
                url: dm.dataSource.insertUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                data: JSON.stringify(res)
            };
        },
        remove: function (dm, keyField, value, tableName, query) {
            var res = {
                key: value,
                keyColumn: keyField,
                table: tableName,
                action: "remove"
            };
            if (query)
                this.addParams({ dm: dm, query: query, params: query._params, reqParams: res });

            return {
                type: "POST",
                url: dm.dataSource.removeUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                data: JSON.stringify(res)
            };
        },
        update: function (dm, keyField, value, tableName, query) {
            var res = {
                value: value,
                action: "update",
                keyColumn: keyField,
                key: value[keyField],
                table: tableName
            };
            if (query)
                this.addParams({ dm: dm, query: query, params: query._params, reqParams: res });

            return {
                type: "POST",
                url: dm.dataSource.updateUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                data: JSON.stringify(res)
            };
        },
        getFiltersFrom: function (data, query) {
            if (!(data instanceof Array) || !data.length)
                throwError("ej.SubQuery: Array of key values required");
            var key = query._fKey, value, prop = key, pKey = query._key, predicats = [],
                isValues = typeof data[0] !== "object";

            if (typeof data[0] !== "object") prop = null;

            for (var i = 0; i < data.length; i++) {
                value = !isValues ? ej.pvt.getObject(pKey || prop, data[i]) : data[i];
                predicats.push(new ej.Predicate(key, "==", value));
            }

            return ej.Predicate.or(predicats);
        },
        addParams: function (options) {
            var dm = options.dm, query = options.query, params = options.params, req = options.reqParams; req["params"] = {};
            for (var i = 0, tmp; tmp = params[i]; i++) {
                if (req[tmp.key]) throwError("ej.Query: Custom Param is conflicting other request arguments");
                req[tmp.key] = tmp.value;
                if (tmp.fn)
                    req[tmp.key] = tmp.fn.call(query, tmp.key, query, dm);                
                req["params"][tmp.key] = req[tmp.key];
            }
        }
    });
    ej.WebMethodAdaptor = new ej.UrlAdaptor().extend({
        processQuery: function (dm, query, hierarchyFilters) {
            var obj = ej.UrlAdaptor.prototype.processQuery(dm, query, hierarchyFilters);
            var data = ej.parseJSON(obj.data), result = {};

            result["value"] = data;

            //Params             
            callAdaptorFunc(this, "addParams", { dm: dm, query: query, params: query._params, reqParams: result });

            return {
                data: JSON.stringify(result),
                url: obj.url,
                ejPvtData: obj.ejPvtData,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            }
        },
        addParams: function (options) {
            var dm = options.dm, query = options.query, params = options.params, req = options.reqParams; req["params"] = {};
            for (var i = 0, tmp; tmp = params[i]; i++) {
                if (req[tmp.key]) throwError("ej.Query: Custom Param is conflicting other request arguments");
                var webkey = tmp.key, webvalue = tmp.value;
                if (tmp.fn)
                    webvalue = tmp.fn.call(query, tmp.key, query, dm);
                req[webkey] = webvalue;
                req["params"][webkey] = req[webkey];
            }
        }
    });
    ej.CacheAdaptor = new ej.UrlAdaptor().extend({
        init: function (adaptor, timeStamp, pageSize) {
            if (!ej.isNullOrUndefined(adaptor)) {
                this.cacheAdaptor = adaptor;
            }
            this.pageSize = pageSize;
            this.guidId = ej.getGuid("cacheAdaptor");
            var obj = { keys: [], results: [] };
            if (window.localStorage)
                window.localStorage.setItem(this.guidId, JSON.stringify(obj));
            var guid = this.guidId;
            if (!ej.isNullOrUndefined(timeStamp)) {
                setInterval(function () {
                    var data = ej.parseJSON(window.localStorage.getItem(guid));
                    var forDel = [];
                    for (var i = 0; i < data.results.length; i++) {
                        data.results[i].timeStamp = new Date() - new Date(data.results[i].timeStamp)
                        if (new Date() - new Date(data.results[i].timeStamp) > timeStamp)
                            forDel.push(i);
                    }
                    var d = forDel;
                    for (var i = 0; i < forDel.length; i++) {
                        data.results.splice(forDel[i], 1);
                        data.keys.splice(forDel[i], 1);
                    }
                    window.localStorage.removeItem(guid);
                    window.localStorage.setItem(guid, JSON.stringify(data));
                }, timeStamp);
            }
        },
        generateKey: function (url, query) {
            var sorted = filterQueries(query.queries, "onSortBy"),
                grouped = filterQueries(query.queries, "onGroup"),
                filters = filterQueries(query.queries, "onWhere"),
                searchs = filterQueries(query.queries, "onSearch"),
				pageQuery = filterQueries(query.queries, "onPage"),
                singles = filterQueryLists(query.queries, ["onSelect", "onPage", "onSkip", "onTake", "onRange"]),
                params = query._params;
            var key = url;
            if (singles["onPage"])
              key += singles["onPage"].pageIndex;
              sorted.forEach(function (obj) {
                   key += obj.e.direction + obj.e.fieldName;
              });
                grouped.forEach(function (obj) {
                    key += obj.e.fieldName;
                });
                searchs.forEach(function (obj) {
                    key += obj.e.searchKey;
                });
            
            for (var filter = 0; filter < filters.length; filter++) {
                var currentFilter = filters[filter];
                if (currentFilter.e.isComplex) {
                    var newQuery = query.clone();
                    newQuery.queries = [];
                    for (var i = 0; i < currentFilter.e.predicates.length; i++) {
                        newQuery.queries.push({ fn: "onWhere", e: currentFilter.e.predicates[i], filter: query.queries.filter });
                    }
                    key += currentFilter.e.condition + this.generateKey(url, newQuery);
                }
                else
                    key += currentFilter.e.field + currentFilter.e.operator + currentFilter.e.value
            }
            return key;
        },
        processQuery: function (dm, query, hierarchyFilters) {
            var key = this.generateKey(dm.dataSource.url, query);
            var cachedItems;
            if (window.localStorage)
                cachedItems = ej.parseJSON(window.localStorage.getItem(this.guidId));
            var data = cachedItems ? cachedItems.results[cachedItems.keys.indexOf(key)] : null;
            if (data != null && !this._crudAction && !this._insertAction) {
                return data;
            }
            this._crudAction = null; this._insertAction = null;
            return this.cacheAdaptor.processQuery.apply(this.cacheAdaptor, [].slice.call(arguments, 0))
        },
        processResponse: function (data, ds, query, xhr, request, changes) {
            if (this._insertAction || (request && this.cacheAdaptor.options.batch && request.url.endsWith(this.cacheAdaptor.options.batch) && request.type.toLowerCase() === "post")) {
                return this.cacheAdaptor.processResponse(data, ds, query, xhr, request, changes);
            }
            var data = this.cacheAdaptor.processResponse.apply(this, [].slice.call(arguments, 0));
            var key = this.generateKey(ds.dataSource.url, query)
            var obj = {};
            if (window.localStorage)
                obj = ej.parseJSON(window.localStorage.getItem(this.guidId));
            var index = $.inArray(key, obj.keys);
            if (index != -1) {
                obj.results.splice(index, 1);
                obj.keys.splice(index, 1);
            }
            obj.results[obj.keys.push(key) - 1] = { keys: key, result: data.result, timeStamp: new Date(), count: data.count }
            while (obj.results.length > this.pageSize) {
                obj.results.splice(0, 1);
                obj.keys.splice(0, 1);
            }
            window.localStorage.setItem(this.guidId, JSON.stringify(obj));
            return data;
        },
        update: function (dm, keyField, value, tableName) {
            this._crudAction = true;
            return this.cacheAdaptor.update(dm, keyField, value, tableName);
        },
        insert: function (dm, data, tableName) {
            this._insertAction = true;
            return this.cacheAdaptor.insert(dm, data, tableName);
        },
        remove: function (dm, keyField, value, tableName) {
            this._crudAction = true;
            return this.cacheAdaptor.remove(dm, keyField, value, tableName);
        },
        batchRequest: function (dm, changes, e) {
            return this.cacheAdaptor.batchRequest(dm, changes, e);
        }
    });
    var filterQueries = function (queries, name) {
        return queries.filter(function (q) {
            return q.fn === name;
        }) || [];
    };
    var filterQueryLists = function (queries, singles) {
        var filtered = queries.filter(function (q) {
            return singles.indexOf(q.fn) !== -1;
        }), res = {};
        for (var i = 0; i < filtered.length; i++) {
            if (!res[filtered[i].fn])
                res[filtered[i].fn] = filtered[i].e;
        }
        return res;
    };
    var callAdaptorFunc = function (obj, fnName, param, param1) {
        if (obj[fnName]) {
            var res = obj[fnName](param, param1);
            if (!isNull(res)) param = res;
        }
        return param;
    };

    ej.ODataAdaptor = new ej.UrlAdaptor().extend({
        options: {
            requestType: "get",
            accept: "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5",
            multipartAccept: "multipart/mixed",
            sortBy: "$orderby",
            select: "$select",
            skip: "$skip",
            take: "$top",
            count: "$inlinecount",
            where: "$filter",
            expand: "$expand",
            batch: "$batch",
            changeSet: "--changeset_",
            batchPre: "batch_",
            contentId: "Content-Id: ",
            batchContent: "Content-Type: multipart/mixed; boundary=",
            changeSetContent: "Content-Type: application/http\nContent-Transfer-Encoding: binary ",
            batchChangeSetContentType: "Content-Type: application/json; charset=utf-8 "
        },
        onEachWhere: function (filter, requiresCast) {
            return filter.isComplex ? this.onComplexPredicate(filter, requiresCast) : this.onPredicate(filter, requiresCast);
        },
        onPredicate: function (pred, query, requiresCast) {
            var returnValue = "",
                operator,guid,
                val = pred.value,
                type = typeof val,
                field = this._p(pred.field);

            if (val instanceof Date)
                val = "datetime'" + p.replacer(val).toJSON() + "'";

            if (type === "string") {
				if(val.indexOf("'") != -1)
                    val = val.replace(new RegExp(/'/g),"''");
                val = "'" + val + "'";

                if (requiresCast) {
                    field = "cast(" + field + ", 'Edm.String')";
                }
                if (ej.isGUID(val))
                    guid = 'guid';
                if (pred.ignoreCase) {
                    !guid ? field = "tolower(" + field + ")" : field;
                    val = val.toLowerCase();
                }
            }

            operator = ej.data.odBiOperator[pred.operator];
            if (operator) {
                returnValue += field;
                returnValue += operator;
                if (guid)
                    returnValue += guid;
                return returnValue + val;
            }

            operator = ej.data.odUniOperator[pred.operator];
            if (!operator || type !== "string") return "";

            if (operator === "substringof") {
                var t = val;
                val = field;
                field = t;
            }

            returnValue += operator + "(";
            returnValue += field + ",";
            if (guid) returnValue += guid;
            returnValue += val + ")";

            return returnValue;
        },
        onComplexPredicate: function (pred, requiresCast) {
            var res = [];
            for (var i = 0; i < pred.predicates.length; i++) {
                res.push("(" + this.onEachWhere(pred.predicates[i], requiresCast) + ")");
            }
            return res.join(" " + pred.condition + " ");
        },
        onWhere: function (filters) {
            if (this.pvt.searches)
                filters.push(this.onEachWhere(this.pvt.searches, null, true));

            return filters.join(" and ");
        },
        onEachSearch: function (e) {
            if (e.fields.length === 0)
                throwError("Query() - Search : oData search requires list of field names to search");

            var filter = this.pvt.searches || [];
            for (var i = 0; i < e.fields.length; i++) {
                filter.push(new ej.Predicate(e.fields[i], e.operator, e.key, e.ignoreCase));
            }
            this.pvt.searches = filter;
        },
        onSearch: function (e) {
            this.pvt.searches = ej.Predicate.or(this.pvt.searches);
            return "";
        },
        onEachSort: function (e) {
            var res = [];
            if (e.name instanceof Array) {
                for (var i = 0; i < e.name.length; i++)
                    res.push(this._p(e.name[i]));
            } else {
                res.push(this._p(e.name) + (e.direction === "descending" ? " desc" : ""));
            }
            return res.join(",");
        },
        onSortBy: function (e) {
            return e.reverse().join(",");
        },
        onGroup: function (e) {
            this.pvt.groups = e;
            return "";
        },
        onSelect: function (e) {
            for (var i = 0; i < e.length; i++)
                e[i] = this._p(e[i]);

            return e.join(',');
        },
        onAggregates: function(e){
            this.pvt.aggregates = e;
            return "";
        },
        onCount: function (e) {
            return e === true ? "allpages" : "";
        },
        beforeSend: function (dm, request, settings) {
            if (settings.url.endsWith(this.options.batch) && settings.type.toLowerCase() === "post") {
                request.setRequestHeader("Accept", oData.multipartAccept);
                request.setRequestHeader("DataServiceVersion", "2.0");
                request.overrideMimeType("text/plain; charset=x-user-defined");
            }

            if (!dm.dataSource.crossDomain) {
                request.setRequestHeader("DataServiceVersion", "2.0");
                request.setRequestHeader("MaxDataServiceVersion", "2.0");
            }
        },
        processResponse: function (data, ds, query, xhr, request, changes) {
            if (!ej.isNullOrUndefined(data.d)) {
                var dataCopy = (query && query._requiresCount) ? data.d.results : data.d;
                if (!ej.isNullOrUndefined(dataCopy))
                    for (var i = 0; i < dataCopy.length; i++) {
                        !ej.isNullOrUndefined(dataCopy[i].__metadata) && delete dataCopy[i].__metadata;
                    }
            }
            var pvt = request && request.ejPvtData;
            if (xhr && xhr.getResponseHeader("Content-Type") && xhr.getResponseHeader("Content-Type").indexOf("xml") != -1 && data.nodeType == 9)
                return query._requiresCount ? { result: [], count: 0 } : [];
            if (request && this.options.batch && request.url.endsWith(this.options.batch) && request.type.toLowerCase() === "post") {
                var guid = xhr.getResponseHeader("Content-Type"), cIdx, jsonObj;
                guid = guid.substring(guid.indexOf("=batchresponse") + 1);
                data = data.split(guid);
                if (data.length < 2) return;

                data = data[1];
                var exVal = /(?:\bContent-Type.+boundary=)(changesetresponse.+)/i.exec(data);
                data.replace(exVal[0], "");

                var changeGuid = exVal[1];
                data = data.split(changeGuid);

                for (var i = data.length; i > -1; i--) {
                    if (!/\bContent-ID:/i.test(data[i]) || !/\bHTTP.+201/.test(data[i]))
                        continue;

                    cIdx = parseInt(/\bContent-ID: (\d+)/i.exec(data[i])[1]);

                    if (changes.added[cIdx]) {
                        jsonObj = p.parseJson(/^\{.+\}/m.exec(data[i])[0]);
                        $.extend(changes.added[cIdx], this.processResponse(jsonObj));
                    }
                }
                return changes;
            }
            var version = xhr && xhr.getResponseHeader("DataServiceVersion"), count = null, aggregateResult = {};
            version = (version && parseInt(version, 10)) || 2;

            if (query && query._requiresCount) {
                if (data.__count || data['odata.count']) count = data.__count || data['odata.count'];
                if (data.d) data = data.d;
                if (data.__count || data['odata.count']) count = data.__count || data['odata.count'];
            }

            if (version === 3 && data.value) data = data.value;
            if (data.d) data = data.d;
            if (version < 3 && data.results) data = data.results;

            if (pvt && pvt.aggregates && pvt.aggregates.length) {
                var agg = pvt.aggregates, args = {}, fn, res = {};
                for (var i = 0; i < agg.length; i++) {
                    fn = ej.aggregates[agg[i].type];
                    if (fn)
                        res[agg[i].field + " - " + agg[i].type] = fn(data, agg[i].field);
                }
                aggregateResult = res;
            }
            if (pvt && pvt.groups && pvt.groups.length) {
                var groups = pvt.groups;
                for (var i = 0; i < groups.length; i++) {
                    var format = getColFormat(groups[i], query.queries)
                    data = ej.group(data, groups[i], pvt.aggregates, format);
                }
            }
            return isNull(count) ? data : { result: data, count: count, aggregates: aggregateResult };
        },
        convertToQueryString: function (req, query, dm) {
            var res = [], tableName = req.table || "";
            delete req.table;

            if (dm.dataSource.requiresFormat)
                req["$format"] = "json";

            for (var prop in req)
                res.push(prop + "=" + req[prop]);

            res = res.join("&");

            if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1 && !tableName)
                return res;

            return res.length ? tableName + "?" + res : tableName || "";
        },
        insert: function (dm, data, tableName) {
            return {
                url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : ''),
                data: JSON.stringify(data)
            }
        },
        remove: function (dm, keyField, value, tableName) {
            return {
                type: "DELETE",
                url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '(' + value + ')'
            };
        },
        update: function (dm, keyField, value, tableName) {
            return {
                type: "PUT",
                url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '(' + value[keyField] + ')',
                data: JSON.stringify(value),
                accept: this.options.accept
            };
        },
        batchRequest: function (dm, changes, e) {
            var initialGuid = e.guid = ej.getGuid(oData.batchPre);
            var url = dm.dataSource.url.replace(/\/*$/, '/' + this.options.batch);
            var args = {
                url: e.url,
                key: e.key,
                cid: 1,
                cSet: ej.getGuid(oData.changeSet)
            };
            var req = "--" + initialGuid + "\n";

            req += "Content-Type: multipart/mixed; boundary=" + args.cSet.replace("--", "") + "\n";

            this.pvt.changeSet = 0;

            req += this.generateInsertRequest(changes.added, args);
            req += this.generateUpdateRequest(changes.changed, args);
            req += this.generateDeleteRequest(changes.deleted, args);

            req += args.cSet + "--\n";
            req += "--" + initialGuid + "--";

            return {
                type: "POST",
                url: url,
                contentType: "multipart/mixed; charset=UTF-8;boundary=" + initialGuid,
                data: req
            };
        },
        generateDeleteRequest: function (arr, e) {
            if (!arr) return "";
            var req = "";

            for (var i = 0; i < arr.length; i++) {
                req += "\n" + e.cSet + "\n";
                req += oData.changeSetContent + "\n\n";
                req += "DELETE ";
                req += e.url + "(" + arr[i][e.key] + ") HTTP/1.1\n";
                req += "If-Match : * \n"
                req += "Accept: " + oData.accept + "\n";
                req += "Content-Id: " + this.pvt.changeSet++ + "\n";
                req += oData.batchChangeSetContentType + "\n";
            }

            return req + "\n";
        },
        generateInsertRequest: function (arr, e) {
            if (!arr) return "";
            var req = "";

            for (var i = 0; i < arr.length; i++) {
                req += "\n" + e.cSet + "\n";
                req += oData.changeSetContent + "\n\n";
                req += "POST ";
                req += e.url + " HTTP/1.1\n";
                req += "Accept: " + oData.accept + "\n";
                req += "Content-Id: " + this.pvt.changeSet++ + "\n";
                req += oData.batchChangeSetContentType + "\n\n";

                req += JSON.stringify(arr[i]) + "\n";
            }

            return req;
        },
        generateUpdateRequest: function (arr, e) {
            if (!arr) return "";
            var req = "";

            for (var i = 0; i < arr.length; i++) {
                req += "\n" + e.cSet + "\n";
                req += oData.changeSetContent + "\n\n";
                req += "PUT ";
                req += e.url + "(" + arr[i][e.key] + ")" + " HTTP/1.1\n";
                req += "If-Match : * \n"
                req += "Accept: " + oData.accept + "\n";
                req += "Content-Id: " + this.pvt.changeSet++ + "\n";
                req += oData.batchChangeSetContentType + "\n\n";

                req += JSON.stringify(arr[i]) + "\n\n";
            }

            return req;
        },
        _p: function (prop) {
            return prop.replace(/\./g, "/");
        }
    });
    ej.ODataV4Adaptor = new ej.ODataAdaptor().extend({
        options: {
            requestType: "get",
            accept: "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5",
            multipartAccept: "multipart/mixed",
            sortBy: "$orderby",
            select: "$select",
            skip: "$skip",
            take: "$top",
            count: "$count",
            search: "$search",
            where: "$filter",
            expand: "$expand",
            batch: "$batch",
            changeSet: "--changeset_",
            batchPre: "batch_",
            contentId: "Content-Id: ",
            batchContent: "Content-Type: multipart/mixed; boundary=",
            changeSetContent: "Content-Type: application/http\nContent-Transfer-Encoding: binary ",
            batchChangeSetContentType: "Content-Type: application/json; charset=utf-8 "
        },
        onCount: function (e) {
            return e === true ? "true" : "";
        },
        onPredicate: function (pred, query, requiresCast) {
            var returnValue = "",
                val = pred.value,
                isDate = val instanceof Date;               
            ej.data.odUniOperator["contains"] = "contains";
            returnValue = ej.ODataAdaptor.prototype.onPredicate.call(this, pred, query, requiresCast);
            ej.data.odUniOperator["contains"] = "substringof";
                if (isDate)
                    returnValue = returnValue.replace(/datetime'(.*)'$/, "$1");

            return returnValue;
        },
        onEachSearch: function (e) {
			 var search = this.pvt.search || [];
			 search.push(e.key);
			 this.pvt.search = search;
		},
		onSearch: function (e) {
			 return this.pvt.search.join(" OR ");
		},
        beforeSend: function (dm, request, settings) {
 
        },
        processQuery: function (ds, query) {
            var digitsWithSlashesExp = /\/[\d*\/]*/g;
            var poppedExpand = "";
            for (var i = query._expands.length - 1; i > 0; i--) {
                if (poppedExpand.indexOf(query._expands[i]) >= 0) { // If current expand is child of previous
                    query._expands.pop(); // Just remove it because its in the expand already
                }
                else {
                    if (digitsWithSlashesExp.test(query._expands[i])) { //If expanded to subentities
                        poppedExpand = query._expands.pop();
                        var r = poppedExpand.replace(digitsWithSlashesExp, "($expand="); //Rewrite into odata v4 expand
                        for (var j = 0; j < poppedExpand.split(digitsWithSlashesExp).length - 1; j++) {
                            r = r + ")"; // Add closing brackets
                        }
                        query._expands.unshift(r); // Add to the front of the array
                        i++;
                    }
                }
            }
            return ej.ODataAdaptor.prototype.processQuery.apply(this, [ds, query]);
        },
        processResponse: function (data, ds, query, xhr, request, changes) {
            var pvt = request && request.ejPvtData;
            if (xhr && xhr.getResponseHeader("Content-Type") && xhr.getResponseHeader("Content-Type").indexOf("xml") != -1 && data.nodeType == 9)
                return query._requiresCount ? { result: [], count: 0 } : [];
            if (request && this.options.batch && request.url.endsWith(this.options.batch) && request.type.toLowerCase() === "post") {
                var guid = xhr.getResponseHeader("Content-Type"), cIdx, jsonObj;
                guid = guid.substring(guid.indexOf("=batchresponse") + 1);
                data = data.split(guid);
                if (data.length < 2) return;

                data = data[1];
                var exVal = /(?:\bContent-Type.+boundary=)(changesetresponse.+)/i.exec(data);
                data.replace(exVal[0], "");

                var changeGuid = exVal[1];
                data = data.split(changeGuid);

                for (var i = data.length; i > -1; i--) {
                   if (!/\bContent-ID:/i.test(data[i]) || !/\bHTTP.+201/.test(data[i]))
                        continue;

                    cIdx = parseInt(/\bContent-ID: (\d+)/i.exec(data[i])[1]);

                    if (changes.added[cIdx]) {
                        jsonObj = p.parseJson(/^\{.+\}/m.exec(data[i])[0]);
                        $.extend(changes.added[cIdx], this.processResponse(jsonObj));
                    }
                }
                return changes;
           }
            var count = null, aggregateResult = {};
            if (query && query._requiresCount)
                if ('@odata.count' in data) count = data['@odata.count'];

            data = ej.isNullOrUndefined(data.value) ? data : data.value;
           if (pvt && pvt.aggregates && pvt.aggregates.length) {
               var agg = pvt.aggregates, args = {}, fn, res = {};
               for (var i = 0; i < agg.length; i++) {
                   fn = ej.aggregates[agg[i].type];
                   if (fn)
                       res[agg[i].field + " - " + agg[i].type] = fn(data, agg[i].field);
               }
               aggregateResult = res;
           }
            if (pvt && pvt.groups && pvt.groups.length) {
                var groups = pvt.groups;
                for (var i = 0; i < groups.length; i++) {
                    var format = getColFormat(groups[i], query.queries);
                    data = ej.group(data, groups[i], pvt.aggregates, format);
                }
            }
            return isNull(count) ? data : { result: data, count: count, aggregates: aggregateResult };
        },
    });
    ej.JsonAdaptor = new ej.Adaptor().extend({
        processQuery: function (ds, query) {
            var result = ds.dataSource.json.slice(0), count = result.length, cntFlg = true, ret, key, agg = {};

            for (var i = 0; i < query.queries.length; i++) {
                key = query.queries[i];
                ret = this[key.fn].call(this, result, key.e, query);
                if (key.fn == "onAggregates")
                    agg[key.e.field + " - " + key.e.type] = ret;
                else
                result = ret !== undefined ? ret : result;

                if (key.fn === "onPage" || key.fn === "onSkip" || key.fn === "onTake" || key.fn === "onRange") cntFlg = false;

                if (cntFlg) count = result.length;
            }

            if (query._requiresCount) {
                result = {
                    result: result,
                    count: count,
                    aggregates: agg
                };
            }

            return result;
        },
        batchRequest: function (dm, changes, e) {
            var i;
            for (i = 0; i < changes.added.length; i++)
                this.insert(dm, changes.added[i]);
            for (i = 0; i < changes.changed.length; i++)
                this.update(dm, e.key, changes.changed[i]);
            for (i = 0; i < changes.deleted.length; i++)
                this.remove(dm, e.key, changes.deleted[i]);
            return changes;
        },
        onWhere: function (ds, e) {
            if (!ds) return ds;

            return ds.filter(function (obj) {
                return e.validate(obj);
            });
        },
        onAggregates: function(ds, e){
            var fn = ej.aggregates[e.type];
            if (!ds || !fn || ds.length == 0) return null;
            return fn(ds, e.field);
        },
        onSearch: function (ds, e) {
            if (!ds || !ds.length) return ds;

            if (e.fieldNames.length === 0) {
                ej.pvt.getFieldList(ds[0], e.fieldNames);
            }

            return ds.filter(function (obj) {
                for (var j = 0; j < e.fieldNames.length; j++) {
                    if (e.comparer.call(obj, ej.pvt.getObject(e.fieldNames[j], obj), e.searchKey, e.ignoreCase))
                        return true;
                }
                return false;
            });
        },
        onSortBy: function (ds, e, query) {
            if (!ds) return ds;
            var fnCompare, field = getValue(e.fieldName, query);
            if (!field)
                return ds.sort(e.comparer);

            if (field instanceof Array) {
                field = field.slice(0);

                for (var i = field.length - 1; i >= 0; i--) {
                    if (!field[i]) continue;

                    fnCompare = e.comparer;

                    if (field[i].endsWith(" desc")) {
                        fnCompare = ej.pvt.fnSort(ej.sortOrder.Descending);
                        field[i] = field[i].replace(" desc", "");
                    }

                    ds = stableSort(ds, field[i], fnCompare, []);
                }
                return ds;
            }
            return stableSort(ds, field, e.comparer, query ? query.queries : []);
        },
        onGroup: function (ds, e, query) {
            if (!ds) return ds;
            var aggQuery = filterQueries(query.queries, "onAggregates"), agg = [];
            if (aggQuery.length) {
                var tmp;
                for (var i = 0; i < aggQuery.length; i++) {
                    tmp = aggQuery[i].e;
                    agg.push({ type: tmp.type, field: getValue(tmp.field, query) });
                }
            }
            var format = getColFormat(e.fieldName, query.queries);
            return ej.group(ds, getValue(e.fieldName, query), agg, format);
        },
        onPage: function (ds, e, query) {
            var size = getValue(e.pageSize, query),
                start = (getValue(e.pageIndex, query) - 1) * size, end = start + size;

            if (!ds) return ds;

            return ds.slice(start, end);
        },
        onRange: function (ds, e) {
            if (!ds) return ds;
            return ds.slice(getValue(e.start), getValue(e.end));
        },
        onTake: function (ds, e) {
            if (!ds) return ds;

            return ds.slice(0, getValue(e.nos));
        },
        onSkip: function (ds, e) {
            if (!ds) return ds;
            return ds.slice(getValue(e.nos));
        },
        onSelect: function (ds, e) {
            if (!ds) return ds;
            return ej.select(ds, getValue(e.fieldNames));
        },
        insert: function (dm, data) {
            return dm.dataSource.json.push(data);
        },
        remove: function (dm, keyField, value, tableName) {
            var ds = dm.dataSource.json, i;
            if (typeof value === "object")
                value = ej.getObject(keyField, value);
            for (i = 0; i < ds.length; i++) {
                if (ej.getObject(keyField, ds[i]) === value) break;
            }

            return i !== ds.length ? ds.splice(i, 1) : null;
        },
        update: function (dm, keyField, value, tableName) {
            var ds = dm.dataSource.json, i, key = ej.getObject(keyField, value);

            for (i = 0; i < ds.length; i++) {
                if (ej.getObject(keyField, ds[i]) === key) break;
            }

            return i < ds.length ? $.extend(ds[i], value) : null;
        }
    });
    ej.ForeignKeyAdaptor = function (data, type) {
        var foreignObj = new ej[type || "JsonAdaptor"]().extend({
            init: function () {
                this.foreignData = [];
                this.key = [];
                this.adaptorType = type;
                this.value = [];
                this.fValue = [];
                this.keyField = [];
                var dataObj = data;
                for (var i = 0; i < dataObj.length; i++) {
                    this.foreignData[i] = dataObj[i].dataSource;
                    this.key[i] = dataObj[i].foreignKeyField;
                    this.fValue[i] = ej.isNullOrUndefined(dataObj[i].field)? dataObj[i].foreignKeyValue : dataObj[i].field + "_" + dataObj[i].foreignKeyValue;
                    this.value[i] = dataObj[i].foreignKeyValue;
                    this.keyField[i] = dataObj[i].field || dataObj[i].foreignKeyField;
                    this.initial = true;
                }
            },
            processQuery: function (ds, query) {
                var data = ds.dataSource.json;
                if (this.initial) {
                    for (var i = 0; i < data.length; i++) {
                        var proxy = this;
                        for (var j = 0; j < this.foreignData.length; j++) {
                            this.foreignData[j].filter(function (col) { //filtering the foreignKey dataSource
                                if (ej.getObject(proxy.key[j], col) == ej.getObject(proxy.keyField[j], data[i]))
                                    data[i][proxy.fValue[j]] = ej.getObject(proxy.value[j], col);
                            });
                        }
                    }
                    this.initial = false;
                }
                return this.base.processQuery.apply(this, [ds, query]);
            },
            setValue: function (value) {
                for (var i = 0; i < this.foreignData.length; i++) {
                    var proxy = this;
                    var keyValue = value[this.fValue[i]];
                    if (typeof keyValue == "string" && !isNaN(keyValue))
                        keyValue = ej.parseFloat(keyValue);
                    var data = $.grep(proxy.foreignData[i], function (e) {
                        return e[proxy.value[i]] == keyValue;
                    })[0];
                    if (ej.isNullOrUndefined(data)) {
                        data = $.grep(proxy.foreignData[i], function (e) {
                            return e[proxy.key[i]] == keyValue;
                        })[0];
                        if (ej.getObject(this.value[i], data) != undefined)
                            ej.createObject(proxy.value[i], ej.getObject(this.value[i], data), value);
                    }
                    if (ej.getObject(this.value[i], data) != undefined)
                        ej.createObject(this.keyField[i], ej.getObject(this.key[i], data), value);
                }
            },
            insert: function (dm, data, tableName) {
                this.setValue(data);
                return {
                    url: dm.dataSource.insertUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                    data: JSON.stringify({
                        value: data,
                        table: tableName,
                        action: "insert"
                    })
                };
            },
            update: function (dm, keyField, value, tableName) {
                this.setValue(value);
                ej.JsonAdaptor.prototype.update(dm, keyField, value, tableName);
                return {
                    type: "POST",
                    url: dm.dataSource.updateUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                    data: JSON.stringify({
                        value: value,
                        action: "update",
                        keyColumn: keyField,
                        key: value[keyField],
                        table: tableName
                    })
                };
            }
        });
        $.extend(this, new foreignObj());
        return this;
    }
    ej.remoteSaveAdaptor = new ej.JsonAdaptor().extend({
        beforeSend: ej.UrlAdaptor.prototype.beforeSend,
        insert: ej.UrlAdaptor.prototype.insert,
        update: ej.UrlAdaptor.prototype.update,
        remove: ej.UrlAdaptor.prototype.remove,
        addParams: ej.UrlAdaptor.prototype.addParams,
        batchRequest: function (dm, changes, e) {
            var i;
            for (i = 0; i < changes.added.length; i++)
                ej.JsonAdaptor.prototype.insert(dm, changes.added[i]);
            for (i = 0; i < changes.changed.length; i++)
                ej.JsonAdaptor.prototype.update(dm, e.key, changes.changed[i]);
            for (i = 0; i < changes.deleted.length; i++)
                ej.JsonAdaptor.prototype.remove(dm, e.key, changes.deleted[i]);
            return {
                type: "POST",
                url: dm.dataSource.batchUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    changed: changes.changed,
                    added: changes.added,
                    deleted: changes.deleted,
                    action: "batch",
                    table: e.url,
                    key: e.key
                })
            };
        }
    });
    ej.WebApiAdaptor = new ej.ODataAdaptor().extend({
        insert: function (dm, data, tableName) {
            return {
                type: "POST",
                url: dm.dataSource.url,
                data: JSON.stringify(data)
            };
        },
        remove: function (dm, keyField, value, tableName) {
            return {
                type: "DELETE",
                url: dm.dataSource.url + "/" + value,
                data: JSON.stringify(value)
            };
        },
        update: function (dm, keyField, value, tableName) {
            return {
                type: "PUT",
                url: dm.dataSource.url,
                data: JSON.stringify(value)
            };
        },
        processResponse: function (data, ds, query, xhr, request, changes) {

            var pvt = request && request.ejPvtData;
            if (request && request.type.toLowerCase() != "post") {
                var version = xhr && xhr.getResponseHeader("DataServiceVersion"), count = null, aggregateResult = {};
                version = (version && parseInt(version, 10)) || 2;

                if (query && query._requiresCount) {
                     if (!isNull(data.Count)) count = data.Count;
                }

                if (version < 3 && data.Items) data = data.Items;

                if (pvt && pvt.aggregates && pvt.aggregates.length) {
                    var agg = pvt.aggregates, args = {}, fn, res = {};
                    for (var i = 0; i < agg.length; i++) {
                        fn = ej.aggregates[agg[i].type];
                        if (fn)
                            res[agg[i].field + " - " + agg[i].type] = fn(data, agg[i].field);
                    }
                    aggregateResult = res;
                }
                if (pvt && pvt.groups && pvt.groups.length) {
                    var groups = pvt.groups;
                    for (var i = 0; i < groups.length; i++) {
                        var format = getColFormat(groups[i], query.queries);
                        data = ej.group(data, groups[i], pvt.aggregates, format);
                    }
                }
                return isNull(count) ? data : { result: data, count: count, aggregates: aggregateResult };
            }
        }
    });
    var getValue = function (value, inst) {
        if (typeof value === "function")
            return value.call(inst || {});
        return value;
    }

    ej.TableModel = function (name, jsonArray, dataManager, modelComputed) {
        if (!instance(this, ej.TableModel))
            return new ej.TableModel(jsonArray);

        if (!instance(jsonArray, Array))
            throwError("ej.TableModel - Json Array is required");

        var rows = [], model, dirtyFn = $proxy(setDirty, this);

        for (var i = 0; i < jsonArray.length; i++) {
            model = new ej.Model(jsonArray[i], this);
            model.state = "unchanged";
            model.on("stateChange", dirtyFn);
            if (modelComputed)
                model.computes(modelComputed);
            rows.push(model);
        }

        this.name = name || "table1";

        this.rows = ej.NotifierArray(rows);
        this._deleted = [];

        this._events = $({});

        this.dataManager = dataManager;

        this._isDirty = false;

        return this;
    };

    ej.TableModel.prototype = {
        on: function (eventName, handler) {
            this._events.on(eventName, handler);
        },

        off: function (eventName, handler) {
            this._events.off(eventName, handler);
        },

        setDataManager: function (dataManager) {
            this.dataManagar = dataManager;
        },

        saveChanges: function () {
            if (!this.dataManager || !instance(this.dataManager, ej.DataManager))
                throwError("ej.TableModel - saveChanges : Set the dataManager using setDataManager function");

            if (!this.isDirty())
                return;

            var promise = this.dataManager.saveChanges(this.getChanges(), this.key, this.name);

            promise.done($proxy(function (changes) {
                var rows = this.toArray();
                for (var i = 0; i < rows.length; i++) {
                    if (rows.state === "added") {
                        rows.set(this.key, changes.added.filter(function (e) {
                            return e[this.key] === rows.get(this.key);
                        })[0][this.key]);
                    }
                    rows[i].markCommit();
                }

                this._events.triggerHandler({ type: "save", table: this });

            }, this));

            promise.fail($proxy(function (e) {
                this.rejectChanges();
                this._events.triggerHandler({ type: "reject", table: this, error: e });
            }, this));

            this._isDirty = false;
        },

        rejectChanges: function () {
            var rows = this.toArray();
            for (var i = 0; i < rows.length; i++)
                rows[i].revert(true);

            this._isDirty = false;
            this._events.triggerHandler({ type: "reject", table: this });
        },

        insert: function (json) {
            var model = new ej.Model(json);
            model._isDirty = this._isDirty = true;

            this.rows.push(model);

            this._events.triggerHandler({ type: "insert", model: model, table: this });
        },

        update: function (value) {
            if (!this.key)
                throwError("TableModel - update : Primary key should be assigned to TableModel.key");

            var row = value, model, key = this.key, keyValue = row[key];

            model = this.rows.array.filter(function (obj) {
                return obj.get(key) === keyValue;
            });

            model = model[0];

            for (var col in row) {
                model.set(col, row[col]);
            }

            this._isDirty = true;

            this._events.triggerHandler({ type: "update", model: model, table: this });
        },

        remove: function (key) {
            if (!this.key)
                throwError("TableModel - update : Primary key should be assigned to TableModel.key");

            var field = this.key;

            var index = -1, model;

            if (key && typeof key === "object") {
                key = key[field] !== undefined ? key[field] : key.get(field);
            }

            for (var i = 0; i < this.rows.length() ; i++) {
                if (this.rows.array[i].get(field) === key) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                model = this.rows.removeAt(index);
                model.markDelete();

                this._deleted.push({ model: model, position: index });

                this._isDirty = true;
                this._events.triggerHandler({ type: "remove", model: model, table: this });
            }
        },

        isDirty: function () {
            return this._isDirty;
        },

        getChanges: function () {

            var changes = {
                added: [],
                changed: []
            };
            var rows = this.toArray();
            for (var i = 0; i < rows.length; i++) {
                if (changes[rows[i].state])
                    changes[rows[i].state].push(rows[i].json);
            }

            changes.deleted = ej.select(this._deleted, ["model"]);

            return changes;
        },

        toArray: function () {
            return this.rows.toArray();
        },

        setDirty: function (dirty, model) {
            if (this._isDirty === !!dirty) return;

            this._isDirty = !!dirty;

            this._events.triggerHandler({ type: "dirty", table: this, model: model });
        },
        get: function (index) {
            return this.rows.array[index];
        },
        length: function () {
            return this.rows.array.length;
        },

        bindTo: function (element) {
            var marker = tDiv, template = $(element.html()), rows = this.toArray(), cur;
            if ($.inArray(element.prop("tagName").toLowerCase(), ["table", "tbody"]))
                marker = tTR;

            marker.insertBefore(element);
            element.detach().empty();

            for (var i = 0; i < rows.length; i++) {
                cur = template.clone();
                rows[i].bindTo(cur);
                element.append(cur);
            }

            element.insertAfter(marker);
            marker.remove();
        }
    };

    var tDiv = doc ? $(document.createElement("div")) : {},
        tTR = doc ? $(document.createElement("tr")) : {};

    ej.Model = function (json, table, name) {
        if (typeof table === "string") {
            name = table;
            table = null;
        }
        this.$id = getUid("m");

        this.json = json;
        this.table = table instanceof ej.TableModel ? table : null;
        this.name = name || (this.table && this.table.name);
        this.dataManager = (table instanceof ej.DataManager) ? table : table.dataManagar;
        this.actual = {};
        this._events = $({});
        this.isDirty = false;
        this.state = "added";
        this._props = [];
        this._computeEls = {};
        this._fields = {};
        this._attrEls = {};
        this._updates = {};
        this.computed = {};
    };

    ej.Model.prototype = {
        computes: function (value) {
            $.extend(this.computed, value);
        },
        on: function (eventName, handler) {
            this._events.on(eventName, handler);
        },
        off: function (eventName, handler) {
            this._events.off(eventName, handler);
        },
        set: function (field, value) {
            var obj = this.json, actual = field, prev;
            field = field.split('.');

            for (var i = 0; i < field.length - 1; i++) {
                field = field[0];
                obj = obj[field[0]];
            }

            this.isDirty = true;
            this.changeState("changed", { from: "set" });

            prev = obj[field];

            if (this.actual[field] === undefined && !(field in this.actual))
                this.actual[field] = value; // Complex property ?

            obj[field] = value;

            this._updateValues(field, value);
            this._events.triggerHandler({ type: actual, current: value, previous: prev, model: this });
        },
        get: function (field) {
            return ej.pvt.getObject(field, this.json);
        },
        revert: function (suspendEvent) {
            for (var prop in this.actual) {
                this.json[prop] = this.actual[prop];
            }

            this.isDirty = false;

            if (suspendEvent)
                this.state = "unchanged";
            else
                this.changeState("unchanged", { from: "revert" });
        },
        save: function (dm, key) {
            dm = dm || this.dataManagar;
            key = key || dm.dataSource.key;
            if (!dm) throwError("ej.Model - DataManager is required to commit the changes");
            if (this.state === "added") {
                return dm.insert(this.json, this.name).done(ej.proxy(function (e) {
                    $.extend(this.json, e.record);
                }, this));
            }
            else if (this.state === "changed") {
                return dm.update(key, this.json, this.name);
            }
            else if (this.state === "deleted") {
                return dm.remove(key, this.json, this.name);
            }
        },
        markCommit: function () {
            this.isDirty = false;
            this.changeState("unchanged", { from: "commit" });
        },
        markDelete: function () {
            this.changeState("deleted", { from: "delete" });
        },
        changeState: function (state, args) {
            if (this.state === state) return;

            if (this.state === "added") {
                if (state === "deleted")
                    state = "unchanged";
                else return;
            }

            var prev = state;
            args = args || {};

            this.state = state;
            this._events.triggerHandler($.extend({ type: "stateChange", current: state, previous: prev, model: this }, args));
        },
        properties: function () {
            if (this._props.length)
                return this._props;

            for (var pr in this.json) {
                this._props.push(pr);
                this._updates[pr] = { read: [], input: [] };
            }

            return this._props;
        },
        bindTo: function (element) {
            var el = $(element), ctl, field,
                elements = el.find("[ej-observe], [ej-computed], [ej-prop]"), len = elements.length;

            el.data("ejModel", this);
            var unbindData = { fields: [], props: [], computes: [] };
            for (var i = 0; i < len; i++) {
                ctl = elements.eq(i);

                field = ctl.attr("ej-prop");
                if (field) {
                    this._processAttrib(field, ctl, unbindData);
                }
                field = ctl.attr("ej-observe");
                if (field && this._props.indexOf(field) !== -1) {
                    this._processField(ctl, field, unbindData);
                    continue;
                }

                field = ctl.attr("ej-computed");
                if (field) {
                    this._processComputed(field, ctl, unbindData);
                    continue;
                }
            }
            el.data("ejModelBinding" + this.$id, unbindData);
        },
        unbind: function (element) {
            var tmp, data = {
                props: this._attrEls,
                computes: this._computeEls
            }, isCustom = false;

            if (element) {
                data = $(element).removeData("ejModel").data("ejModelBinding" + this.$id) || data;
                isCustom = true;
            }

            for (var p in this.computed) {
                tmp = data.computes[p], p = this.computed[p];
                if (tmp && p.deps) {
                    this.off(p.deps.join(' '), tmp.handle);
                    if (isCustom)
                        delete this._computeEls[p];
                }
            }
            if (!isCustom)
                this._computeEls = {};

            for (var p in data.props) {
                tmp = data.props[p];
                if (tmp) {
                    this.off(tmp.deps.join(' '), tmp.handle);
                    delete data.props[p];
                    if (isCustom)
                        delete this._attrEls[p];
                }
            }
            if (!isCustom)
                this._attrEls = {};

            if (data.fields && data.fields.length) {
                var len = data.fields.length, ctl, idx, ty;
                for (var i = 0; i < len; i++) {
                    ctl = data.fields[i];
                    $(ctl).off("change", null, this._changeHandler);

                    ty = this.formElements.indexOf(ctl.tagName.toLowerCase()) !== -1 ? "input" : "read";
                    idx = this._updates[ty].indexOf(ctl);
                    if (idx !== -1)
                        this._updates[ty].splice(idx, 1);
                }
            }
        },
        _processComputed: function (value, element, data) {
            if (!value) return;

            var val, deps, safeVal = safeStr(value),
            type = this.formElements.indexOf(element[0].tagName.toLowerCase()) !== -1 ? "val" : "html";

            if (!this.computed[value] || !this.computed[safeVal]) {
                this.computed[safeVal] = {
                    value: new Function("var e = this; return " + value),
                    deps: this._generateDeps(value)
                }
                value = safeVal;
            }

            val = this.computed[value];
            if (!val.get) {
                val.get = function () {
                    val.value.call(this.json);
                }
            }

            deps = val.deps;
            val = val.value;

            this._updateDeps(deps);
            this._updateElement(element, type, val);

            val = { el: element, handle: $proxy(this._computeHandle, this, { value: value, type: type }) };
            this._computeEls[value] = val;
            data.computes[value] = val;

            this.on(deps.join(' '), val.handle);
        },
        _computeHandle: function (e) {
            var el = this._computeEls[e.value];
            if (el && this.computed[e.value])
                this._updateElement(el.el, e.type, this.computed[e.value].value);
        },
        _updateElement: function (el, type, val) {
            el[type](val.call($.extend({}, this.json, this.computed)));
        },
        _updateDeps: function (deps) {
            for (var i = 0; i < deps.length; i++) {
                if (!(deps[i] in this.json) && deps[i] in this.computed)
                    ej.merge(deps, this.computed[deps[i]].deps);
            }
        },
        _generateDeps: function (value) {
            var splits = value.replace(/(^e\.)|( e\.)/g, '#%^*##ej.#').split("#%^*#"),
                field, deps = [];

            for (var i = 0; i < splits.length; i++) {
                if (splits[i].startsWith("#ej.#")) {
                    field = splits[i].replace("#ej.#", "").split(' ')[0];
                    if (field && this._props.indexOf(field) !== -1)
                        deps.push(field);
                }
            }

            return deps;
        },
        _processAttrib: function (value, el, data) {
            var prop, val, res = {};
            value = value.replace(/^ +| +$/g, "").split(";");
            for (var i = 0; i < value.length; i++) {
                value[i] = value[i].split(":");
                if (value[i].length < 2) continue;

                prop = value[i][0].replace(/^ +| +$/g, "").replace(/^'|^"|'$|"$/g, "");
                res[prop] = value[i][1].replace(/^ +| +$/g, "").replace(/^'|^"|'$|"$/g, "");
            }
            value = res;
            var deps = [];
            for (prop in value)
                deps.push(value[prop]);

            this._updateDeps(deps);
            this._updateProps(el, value);

            res = getUid("emak");
            val = { el: el, handle: $proxy(this._attrHandle, this, res), value: value, deps: deps };
            el.prop("ejmodelattrkey", res);

            data.props[res] = val;
            this._attrEls[res] = val;

            this.on(deps.join(' '), val.handle);
        },
        _attrHandle: function (res) {
            var el = this._attrEls[res];
            if (el)
                this._updateProps(el.el, el.value);
        },
        _updateProps: function (element, value) {
            var json = this.json, t, c = this.computed;
            for (var prop in value) {
                t = value[prop];
                if (t in json)
                    t = json[t];
                else if (t in c) {
                    t = c[t];
                    if (t) {
                        t = t.value.call($.extend({}, this.json, c));
                    }
                }

                if (!isNull(t)) {
                    element.prop(prop, t);
                }
            }
        },
        _updateValues: function (prop, value) {
            var arr = this._updates[prop];

            if (!arr || (!arr.read && !arr.input)) return;

            this._ensureItems(arr.read, "html", value);
            this._ensureItems(arr.input, "val", value);
        },
        _ensureItems: function (a, type, value) {
            if (!a) return;

            for (var i = a.length - 1; i > -1; i--) {
                if (!a[i].offsetParent) {
                    a.splice(i, 1);
                    continue;
                }
                $(a[i])[type](value);
            }
        },
        _changeHandler: function (e) {
            e.data.self.set(e.data.prop, $(this).val());
        },
        _processField: function (ctl, field, data) {
            var e = { self: this, prop: field }, val = this.get(field);

            data.fields.push(ctl[0]);

            if (this.formElements.indexOf(ctl[0].tagName.toLowerCase()) === -1) {
                ctl.html(val);
                return this._updates[field].read.push(ctl[0]);
            }

            ctl.val(val)
                    .off("change", null, this._changeHandler)
                    .on("change", null, e, this._changeHandler);

            return this._updates[field].input.push(ctl[0]);
        },
        formElements: ["input", "select", "textarea"]
    };

    var safeReg = /[^\w]+/g;
    var safeStr = function (value) {
        return value.replace(safeReg, "_");
    };
    var setDirty = function (e) {
        this.setDirty(true, e.model);
    };

    ej.Predicate = function (field, operator, value, ignoreCase) {
        if (!(this instanceof ej.Predicate))
            return new ej.Predicate(field, operator, value, ignoreCase);

        if (typeof field === "string") {
            this.field = field;
            this.operator = operator;
            this.value = value;
            this.ignoreCase = ignoreCase;
            this.isComplex = false;

            this._comparer = ej.data.fnOperators.processOperator(this.operator);

        } else if (field instanceof ej.Predicate && value instanceof ej.Predicate || value instanceof Array) {
            this.isComplex = true;
            this.condition = operator.toLowerCase();
            this.predicates = [field];
            if (value instanceof Array)
                [].push.apply(this.predicates, value);
            else
                this.predicates.push(value);
        }
        return this;
    };

    ej.Predicate.and = function () {
        return pvtPredicate._combinePredicates([].slice.call(arguments, 0), "and");
    };

    ej.Predicate.or = function () {
        return pvtPredicate._combinePredicates([].slice.call(arguments, 0), "or");
    };

    ej.Predicate.fromJSON = function (json) {
        if (instance(json, Array)) {
            var res = [];
            for (var i = 0, len = json.length; i < len; i++)
                res.push(pvtPredicate._fromJSON(json[i]));
            return res;
        }

        return pvtPredicate._fromJSON(json);
    };

    // Private fn
    var pvtPredicate = {
        _combinePredicates: function (predicates, operator) {
            if (!predicates.length) return undefined;
            if (predicates.length === 1) {
                if (!instance(predicates[0], Array))
                    return predicates[0];
                predicates = predicates[0];
            }
            return new ej.Predicate(predicates[0], operator, predicates.slice(1));
        },

        _combine: function (pred, field, operator, value, condition, ignoreCase) {
            if (field instanceof ej.Predicate)
                return ej.Predicate[condition](pred, field);

            if (typeof field === "string")
                return ej.Predicate[condition](pred, new ej.Predicate(field, operator, value, ignoreCase));

            return throwError("Predicate - " + condition + " : invalid arguments");
        },

        _fromJSON: function (json) {

            if (!json || instance(json, ej.Predicate))
                return json;

            var preds = json.predicates || [], len = preds.length, predicates = [], result;

            for (var i = 0; i < len; i++)
                predicates.push(pvtPredicate._fromJSON(preds[i]));                     

            if(!json.isComplex)
                result = new ej.Predicate(json.field, json.operator, ej.parseJSON({ val: json.value }).val, json.ignoreCase);
            else
                result = new ej.Predicate(predicates[0], json.condition, predicates.slice(1));

            return result;
        }
    };

    ej.Predicate.prototype = {
        and: function (field, operator, value, ignoreCase) {
            return pvtPredicate._combine(this, field, operator, value, "and", ignoreCase);
        },
        or: function (field, operator, value, ignoreCase) {
            return pvtPredicate._combine(this, field, operator, value, "or", ignoreCase);
        },
        validate: function (record) {
            var p = this.predicates, isAnd, ret;

            if (!this.isComplex) {
                return this._comparer.call(this, ej.pvt.getObject(this.field, record), this.value, this.ignoreCase);
            }

            isAnd = this.condition === "and";

            for (var i = 0; i < p.length; i++) {
                ret = p[i].validate(record);
                if (isAnd) {
                    if (!ret) return false;
                } else {
                    if (ret) return true;
                }
            }

            return isAnd;
        },
        toJSON: function () {
            var predicates, p;
            if (this.isComplex) {
                predicates = [], p = this.predicates;
                for (var i = 0; i < p.length; i++)
                    predicates.push(p[i].toJSON());
            }
            return {
                isComplex: this.isComplex,
                field: this.field,
                operator: this.operator,
                value: this.value,
                ignoreCase: this.ignoreCase,
                condition: this.condition,
                predicates: predicates
            }
        }
    };

    ej.dataUtil = {
        swap: function (array, x, y) {
            if (x == y) return;

            var tmp = array[x];
            array[x] = array[y];
            array[y] = tmp;
        },

        mergeSort: function (jsonArray, fieldName, comparer) {
            if (!comparer || typeof comparer === "string")
                comparer = ej.pvt.fnSort(comparer, true);

            if (typeof fieldName === "function") {
                comparer = fieldName;
                fieldName = null;
            }

            return ej.pvt.mergeSort(jsonArray, fieldName, comparer);
        },

        max: function (jsonArray, fieldName, comparer) {
            if (typeof fieldName === "function") {
                comparer = fieldName;
                fieldName = null;
            }

            return ej.pvt.getItemFromComparer(jsonArray, fieldName, comparer || ej.pvt.fnDescending);
        },

        min: function (jsonArray, fieldName, comparer) {
            if (typeof fieldName === "function") {
                comparer = fieldName;
                fieldName = null;
            }

            return ej.pvt.getItemFromComparer(jsonArray, fieldName, comparer || ej.pvt.fnAscending);
        },

        distinct: function (json, fieldName, requiresCompleteRecord) {
            var result = [], val, tmp = {};
            for (var i = 0; i < json.length; i++) {
                val = getVal(json, fieldName, i);
                if (!(val in tmp)) {
                    result.push(!requiresCompleteRecord ? val : json[i]);
                    tmp[val] = 1;
                }
            }
            return result;
        },

        sum: function (json, fieldName) {
            var result = 0, val, castRequired = typeof getVal(json, fieldName, 0) !== "number";

            for (var i = 0; i < json.length; i++) {
                val = getVal(json, fieldName, i);
                if (!isNaN(val) && val !== null) {
                    if (castRequired)
                       val = +val;
                   result += val;
                }
            }
            return result;
        },

        avg: function (json, fieldName) {
            return ej.sum(json, fieldName) / json.length;
        },

        select: function (jsonArray, fields) {
            var newData = [];

            for (var i = 0; i < jsonArray.length; i++) {
                newData.push(ej.pvt.extractFields(jsonArray[i], fields));
            }

            return newData;
        },

        group: function (jsonArray, field, agg, format,/* internal */ level,groupDs) {
            level = level || 1;

            if (jsonArray.GROUPGUID == ej.pvt.consts.GROUPGUID) {
                for (var j = 0; j < jsonArray.length; j++) {
                    if(!ej.isNullOrUndefined(groupDs)){
                        var indx = -1;
                        var temp = $.grep(groupDs,function(e){return e.key==jsonArray[j].key});
                        indx = groupDs.indexOf(temp[0]);
                        jsonArray[j].items = ej.group(jsonArray[j].items, field, agg, format, jsonArray.level + 1, groupDs[indx].items);
                        jsonArray[j].count = groupDs[indx].count;
                    }
                    else{
                        jsonArray[j].items = ej.group(jsonArray[j].items, field, agg, format, jsonArray.level + 1);
                        jsonArray[j].count = jsonArray[j].items.length;
                    }  
                }

                jsonArray.childLevels += 1;
                return jsonArray;
            }

            var grouped = {}, groupedArray = [];

            groupedArray.GROUPGUID = ej.pvt.consts.GROUPGUID;
            groupedArray.level = level;
            groupedArray.childLevels = 0;
            groupedArray.records = jsonArray;

            for (var i = 0; i < jsonArray.length; i++) {
                var val = getVal(jsonArray, field, i);
                if (!ej.isNullOrUndefined(format)) val = format(val, field);

                if (!grouped[val]) {
                    grouped[val] = {
                        key: val,
                        count: 0,
                        items: [],
                        aggregates: {},
                        field: field
                    };
                    groupedArray.push(grouped[val]);
					if(!ej.isNullOrUndefined(groupDs)) {
                        var tempObj = $.grep(groupDs,function(e){return e.key==grouped[val].key});
                       grouped[val].count = tempObj[0].count
                    }
                }

                grouped[val].count = !ej.isNullOrUndefined(groupDs) ? grouped[val].count :  grouped[val].count += 1;
                grouped[val].items.push(jsonArray[i]);
            }
            if (agg && agg.length) {

                for (var i = 0; i < groupedArray.length; i++) {
                    var res = {}, fn;
                    for (var j = 0; j < agg.length; j++) {

                        fn = ej.aggregates[agg[j].type];
                        if(!ej.isNullOrUndefined(groupDs)) {
                            var temp = $.grep(groupDs,function(e){return e.key==groupedArray[i].key});
                            if(fn)
                                res[agg[j].field + " - " + agg[j].type] = fn(temp[0].items, agg[j].field);
                        }
                        else{
                            if (fn)
                                res[agg[j].field + " - " + agg[j].type] = fn(groupedArray[i].items, agg[j].field);
                        }

                    }
                    groupedArray[i]["aggregates"] = res;
                }
            }
            return groupedArray;
        },

        parseTable: function (table, headerOption, headerRowIndex) {
            var tr = table.rows, headerRow, headerTds = [], data = [], i;

            if (!tr.length) return [];

            headerRowIndex = headerRowIndex || 0;

            switch ((headerOption || "").toLowerCase()) {
                case ej.headerOption.tHead:
                    headerRow = table.tHead.rows[headerRowIndex];
                    break;
                case ej.headerOption.row:
                default:
                    headerRow = table.rows[headerRowIndex];
                    break;
            }

            var hTd = headerRow.cells;

            for (i = 0; i < hTd.length; i++)
                headerTds.push($.trim(hTd[i].innerHTML));

            for (i = headerRowIndex + 1; i < tr.length; i++) {
                var json = {}, td = tr[i].cells;
                for (var j = 0; j < td.length; j++) {
                    var temp = td[j].innerHTML;
                    if (typeof temp == "string" && $.isNumeric(temp))
                       json[headerTds[j]] = Number(temp);
				    else
                       json[headerTds[j]] = temp;
                }
                data.push(json);
            }
            return data;
        }
    };

    ej.headerOption = {
        tHead: "thead",
        row: "row"
    };

    ej.aggregates = {
        sum: function (ds, field) {
            return ej.sum(ds, field);
        },
        average: function (ds, field) {
            return ej.avg(ds, field);
        },
        minimum: function (ds, field) {
            return ej.getObject(field, ej.min(ds, field));
        },
        maximum: function (ds, field) {
            return  ej.getObject(field, ej.max(ds, field));
        },
        truecount: function (ds, field){
            var predicate = ej.Predicate(field, "equal", true);
            return ej.DataManager(ds).executeLocal(ej.Query().where(predicate)).length;
        },
        falsecount: function (ds, field) {
            var predicate = ej.Predicate(field, "equal", false);
            return ej.DataManager(ds).executeLocal(ej.Query().where(predicate)).length;
        },
        count: function (ds, field) {
            return ds.length;
        }

    };
    ej.pvt = {
        filterQueries: filterQueries,
        mergeSort: function (jsonArray, fieldName, comparer) {
            if (jsonArray.length <= 1)
                return jsonArray;

            // else list size is > 1, so split the list into two sublists
            var middle = parseInt(jsonArray.length / 2, 10);

            var left = jsonArray.slice(0, middle),
                right = jsonArray.slice(middle);

            left = ej.pvt.mergeSort(left, fieldName, comparer);
            right = ej.pvt.mergeSort(right, fieldName, comparer);

            return ej.pvt.merge(left, right, fieldName, comparer);
        },

        getItemFromComparer: function (array, field, comparer) {
            var keyVal, current, key, i = 0,castRequired = typeof getVal(array, field, 0) == "string";
            if (array.length)
            while (ej.isNullOrUndefined(keyVal) && i < array.length) {
                keyVal = getVal(array, field, i);
                key = array[i++];
            }
            for (; i < array.length; i++) {
                current = getVal(array, field, i);
                if (ej.isNullOrUndefined(current))
                    continue;
                if (castRequired) {
                    keyVal = +keyVal;
                    current = +current;
                }
                if (comparer(keyVal, current) > 0) {
                    keyVal = current;
                    key = array[i];
                }
            }
            return key;
        },

        quickSelect: function (array, fieldName, left, right, k, comparer) {
            if (left == right)
                return array[left];

            var pivotNewIndex = ej.pvt.partition(array, fieldName, left, right, comparer);

            var pivotDist = pivotNewIndex - left + 1;

            if (pivotDist == k)
                return array[pivotNewIndex];

            else if (k < pivotDist)
                return ej.pvt.quickSelect(array, fieldName, left, pivotNewIndex - 1, k, comparer);
            else
                return ej.pvt.quickSelect(array, fieldName, pivotNewIndex + 1, right, k - pivotDist, comparer);
        },

        extractFields: function (obj, fields) {
            var newObj = {};

            if (fields.length == 1)
                return ej.pvt.getObject(fields[0], obj);

            for (var i = 0; i < fields.length; i++) {
                newObj[fields[i].replace('.', ej.pvt.consts.complexPropertyMerge)] = ej.pvt.getObject(fields[i], obj);
            }

            return newObj;
        },

        partition: function (array, field, left, right, comparer) {

            var pivotIndex = parseInt((left + right) / 2, 10),
                pivot = getVal(array, field, pivotIndex);

            ej.swap(array, pivotIndex, right);

            pivotIndex = left;

            for (var i = left; i < right; i++) {
                if (comparer(getVal(array, field, i), pivot)) {
                    ej.swap(array, i, pivotIndex);
                    pivotIndex++;
                }
            }

            ej.swap(array, pivotIndex, right);

            return pivotIndex;
        },

        fnSort: function (order) {
            order = order ? order.toLowerCase() : ej.sortOrder.Ascending;

            if (order == ej.sortOrder.Ascending)
                return ej.pvt.fnAscending;

            return ej.pvt.fnDescending;
        },

        fnGetComparer: function (field, fn) {
            return function (x, y) {
                return fn(ej.pvt.getObject(field, x), ej.pvt.getObject(field, y));
            }
        },

        fnAscending: function (x, y) {
            if (y === null || y === undefined)
                return -1;

            if (typeof x === "string")
                return x.localeCompare(y);

            if (x === null || x === undefined)
                return 1;

            return x - y;
        },

        fnDescending: function (x, y) {
            if (y === null || y === undefined)
                return 1;

            if (typeof x === "string")
                return x.localeCompare(y) * -1;

            if (x === null || x === undefined)
                return -1;

            return y - x;
        },

        merge: function (left, right, fieldName, comparer) {
            var result = [], current;

            while (left.length > 0 || right.length > 0) {
                if (left.length > 0 && right.length > 0) {
                    if (comparer)
                        current = comparer(getVal(left, fieldName, 0), getVal(right, fieldName, 0)) <= 0 ? left : right;
                    else
                        current = left[0][fieldName] < left[0][fieldName] ? left : right;
                } else {
                    current = left.length > 0 ? left : right;
                }

                result.push(current.shift());
            }

            return result;
        },

        getObject: function (nameSpace, from) {
            if (!from) return undefined;
            if (!nameSpace) return from;

            if (nameSpace.indexOf('.') === -1) return from[nameSpace];

            var value = from, splits = nameSpace.split('.');

            for (var i = 0; i < splits.length; i++) {

                if (value == null) break;

                value = value[splits[i]];
            }

            return value;
        },

        createObject: function (nameSpace, value, initIn) {
            var splits = nameSpace.split('.'), start = initIn || window, from = start, i;

            for (i = 0; i < splits.length; i++) {

                if (i + 1 == splits.length)
                    from[splits[i]] = value === undefined ? {} : value;
                else if (from[splits[i]] == null)
                    from[splits[i]] = {};

                from = from[splits[i]];
            }

            return start;
        },

        getFieldList: function (obj, fields, prefix) {
            if (prefix === undefined)
                prefix = "";

            if (fields === undefined || fields === null)
                return ej.pvt.getFieldList(obj, [], prefix);

            for (var prop in obj) {
                if (typeof obj[prop] === "object" && !(obj[prop] instanceof Array))
                    ej.pvt.getFieldList(obj[prop], fields, prefix + prop + ".");
                else
                    fields.push(prefix + prop);
            }

            return fields;
        }
    };

    ej.FilterOperators = {
        lessThan: "lessthan",
        greaterThan: "greaterthan",
        lessThanOrEqual: "lessthanorequal",
        greaterThanOrEqual: "greaterthanorequal",
        equal: "equal",
        contains: "contains",
        startsWith: "startswith",
        endsWith: "endswith",
        notEqual: "notequal"
    };

    ej.data = {};

    ej.data.operatorSymbols = {
        "<": "lessthan",
        ">": "greaterthan",
        "<=": "lessthanorequal",
        ">=": "greaterthanorequal",
        "==": "equal",
        "!=": "notequal",
        "*=": "contains",
        "$=": "endswith",
        "^=": "startswith"
    };

    ej.data.odBiOperator = {
        "<": " lt ",
        ">": " gt ",
        "<=": " le ",
        ">=": " ge ",
        "==": " eq ",
        "!=": " ne ",
        "lessthan": " lt ",
        "lessthanorequal": " le ",
        "greaterthan": " gt ",
        "greaterthanorequal": " ge ",
        "equal": " eq ",
        "notequal": " ne "
    };

    ej.data.odUniOperator = {
        "$=": "endswith",
        "^=": "startswith",
        "*=": "substringof",
        "endswith": "endswith",
        "startswith": "startswith",
        "contains": "substringof"
    };

    ej.data.fnOperators = {
        equal: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) == toLowerCase(expected);

            return actual == expected;
        },
        notequal: function (actual, expected, ignoreCase) {
            return !ej.data.fnOperators.equal(actual, expected, ignoreCase);
        },
        lessthan: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) < toLowerCase(expected);

            return actual < expected;
        },
        greaterthan: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) > toLowerCase(expected);

            return actual > expected;
        },
        lessthanorequal: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) <= toLowerCase(expected);

            return actual <= expected;
        },
        greaterthanorequal: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) >= toLowerCase(expected);

            return actual >= expected;
        },
        contains: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return !isNull(actual) && !isNull(expected) && toLowerCase(actual).indexOf(toLowerCase(expected)) != -1;

            return !isNull(actual) && !isNull(expected) && actual.toString().indexOf(expected) != -1;
        },
        notnull: function (actual) {
            return actual !== null;
        },
        isnull: function (actual) {
            return actual === null;
        },
        startswith: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return actual && expected && toLowerCase(actual).startsWith(toLowerCase(expected));

            return actual && expected && actual.startsWith(expected);
        },
        endswith: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return actual && expected && toLowerCase(actual).endsWith(toLowerCase(expected));

            return actual && expected && actual.endsWith(expected);
        },

        processSymbols: function (operator) {
            var fnName = ej.data.operatorSymbols[operator];
            if (fnName) {
                var fn = ej.data.fnOperators[fnName];
                if (fn) return fn;
            }

            return throwError("Query - Process Operator : Invalid operator");
        },

        processOperator: function (operator) {
            var fn = ej.data.fnOperators[operator];
            if (fn) return fn;
            return ej.data.fnOperators.processSymbols(operator);
        }
    };

    ej.NotifierArray = function (array) {
        if (!instance(this, ej.NotifierArray))
            return new ej.NotifierArray(array);

        this.array = array;

        this._events = $({});
        this._isDirty = false;

        return this;
    };

    ej.NotifierArray.prototype = {
        on: function (eventName, handler) {
            this._events.on(eventName, handler);
        },
        off: function (eventName, handler) {
            this._events.off(eventName, handler);
        },
        push: function (item) {
            var ret;

            if (instance(item, Array))
                ret = [].push.apply(this.array, item);
            else
                ret = this.array.push(item);

            this._raise("add", { item: item, index: this.length() - 1 });

            return ret;
        },
        pop: function () {
            var ret = this.array.pop();

            this._raise("remove", { item: ret, index: this.length() - 1 });

            return ret;
        },
        addAt: function (index, item) {
            this.array.splice(index, 0, item);

            this._raise("add", { item: item, index: index });

            return item;
        },
        removeAt: function (index) {
            var ret = this.array.splice(index, 1)[0];

            this._raise("remove", { item: ret, index: index });

            return ret;
        },
        remove: function (item) {
            var index = this.array.indexOf(item);

            if (index > -1) {
                this.array.splice(index, 1);
                this._raise("remove", { item: item, index: index });
            }

            return index;
        },
        length: function () {
            return this.array.length;
        },
        _raise: function (e, args) {
            this._events.triggerHandler($.extend({ type: e }, args));
            this._events.triggerHandler({ type: "all", name: e, args: args });
        },
        toArray: function () {
            return this.array;
        }
    };

    $.extend(ej, ej.dataUtil);

    // For IE8
    Array.prototype.forEach = Array.prototype.forEach || function (fn, scope) {
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    };

    Array.prototype.indexOf = Array.prototype.indexOf || function (searchElement) {
        var len = this.length;

        if (len === 0) return -1;

        for (var i = 0; i < len; i++) {
            if (i in this && this[i] === searchElement)
                return i;
        }
        return -1;
    };

    Array.prototype.filter = Array.prototype.filter || function (fn) {
        if (typeof fn != "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1] || this;
        for (var i = 0; i < this.length; i++) {
            var val = this[i]; // in case fun mutates this
            if (fn.call(thisp, val, i, this))
                res.push(val);
        }

        return res;
    };

    String.prototype.endsWith = String.prototype.endsWith || function (key) {
        return this.slice(-key.length) === key;
    };

    String.prototype.startsWith = String.prototype.startsWith || function (key) {
        return this.slice(0, key.length) === key;
    };

    if (!ej.support) ej.support = {};
    ej.support.stableSort = function () {
        var res = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].sort(function () { return 0; });
		for(var i = 0; i < 17; i++){
		    if(i !== res[i]) return false;
		}
        return true;
    }();
    ej.support.cors = $.support.cors;

    if (!$.support.cors && window.XDomainRequest) {
        var httpRegEx = /^https?:\/\//i;
        var getOrPostRegEx = /^get|post$/i;
        var sameSchemeRegEx = new RegExp('^' + location.protocol, 'i');
        var xmlRegEx = /\/xml/i;

        // ajaxTransport exists in jQuery 1.5+
        $.ajaxTransport('text html xml json', function (options, userOptions, jqXHR) {
            // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
            if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(userOptions.url) && sameSchemeRegEx.test(userOptions.url)) {
                var xdr = null;
                var userType = (userOptions.dataType || '').toLowerCase();
                return {
                    send: function (headers, complete) {
                        xdr = new XDomainRequest();
                        if (/^\d+$/.test(userOptions.timeout)) {
                            xdr.timeout = userOptions.timeout;
                        }
                        xdr.ontimeout = function () {
                            complete(500, 'timeout');
                        };
                        xdr.onload = function () {
                            var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                            var status = {
                                code: 200,
                                message: 'success'
                            };
                            var responses = {
                                text: xdr.responseText
                            };

                            try {
                                if (userType === 'json') {
                                    try {
                                        responses.json = JSON.parse(xdr.responseText);
                                    } catch (e) {
                                        status.code = 500;
                                        status.message = 'parseerror';
                                        //throw 'Invalid JSON: ' + xdr.responseText;
                                    }
                                } else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
                                    var doc = new ActiveXObject('Microsoft.XMLDOM');
                                    doc.async = false;
                                    try {
                                        doc.loadXML(xdr.responseText);
                                    } catch (e) {
                                        doc = undefined;
                                    }
                                    if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                        status.code = 500;
                                        status.message = 'parseerror';
                                        throw 'Invalid XML: ' + xdr.responseText;
                                    }
                                    responses.xml = doc;
                                }
                            } catch (parseMessage) {
                                throw parseMessage;
                            } finally {
                                complete(status.code, status.message, responses, allResponseHeaders);
                            }
                        };
                        xdr.onerror = function () {
                            complete(500, 'error', {
                                text: xdr.responseText
                            });
                        };
						if(navigator.userAgent.indexOf("MSIE 9.0") != -1)
							xdr.onprogress = function() {};
                        xdr.open(options.type, options.url);
                        xdr.send(userOptions.data);
                        //xdr.send();
                    },
                    abort: function () {
                        if (xdr) {
                            xdr.abort();
                        }
                    }
                };
            }
        });
    }

    $.support.cors = true;

    ej.sortOrder = {
        Ascending: "ascending",
        Descending: "descending"
    };

    // privates
    ej.pvt.consts = {
        GROUPGUID: "{271bbba0-1ee7}",
        complexPropertyMerge: "_"
    };

    // private utils
    var nextTick = function (fn, context) {
        if (context) fn = $proxy(fn, context);
        (window.setImmediate || window.setTimeout)(fn, 0);
    };

    ej.support.enableLocalizedSort = false;

    var stableSort = function (ds, field, comparer, queries) {
        if (ej.support.stableSort) {
            if(!ej.support.enableLocalizedSort && typeof ej.pvt.getObject(field, ds[0] || {}) == "string" 
                && (comparer === ej.pvt.fnAscending || comparer === ej.pvt.fnDescending)
                && queries.filter(function(e){return e.fn === "onSortBy";}).length === 1)
                return fastSort(ds, field, comparer === ej.pvt.fnDescending);
            return ds.sort(ej.pvt.fnGetComparer(field, comparer));
        }
        return ej.mergeSort(ds, field, comparer);
    };
    var getColFormat = function (field, query) {
        var grpQuery = $.grep(query, function (args) { return args.fn == "onGroup" });
        for (var grp = 0; grp < grpQuery.length; grp++) {
            if (ej.getObject("fieldName", grpQuery[grp].e) == field) {
                return ej.getObject("fn", grpQuery[grp].e);
            }
        }
    };
    var fastSort = function(ds, field, isDesc){
        var old = Object.prototype.toString;
        Object.prototype.toString = (field.indexOf('.') === -1) ? function(){
            return this[field];
        }:function(){
            return ej.pvt.getObject(field, this);
        };
        ds = ds.sort();
        Object.prototype.toString = old;
        if(isDesc)
            ds.reverse();
    }

    var toLowerCase = function (val) {
        return val ? val.toLowerCase ? val.toLowerCase() : val.toString().toLowerCase() : (val === 0 || val === false) ? val.toString() : "";
    };

    var getVal = function (array, field, index) {
        return field ? ej.pvt.getObject(field, array[index]) : array[index];
    };

    var isHtmlElement = function (e) {
        return typeof HTMLElement === "object" ? e instanceof HTMLElement :
            e && e.nodeType === 1 && typeof e === "object" && typeof e.nodeName === "string";
    };

    var instance = function (obj, element) {
        return obj instanceof element;
    };

    var getTableModel = function (name, result, dm, computed) {
        return function (tName) {
            if (typeof tName === "object") {
                computed = tName;
                tName = null;
            }
            return new ej.TableModel(tName || name, result, dm, computed);
        };
    };

    var getKnockoutModel = function (result) {
        return function (computedObservables, ko) {
            ko = ko || window.ko;

            if (!ko) throwError("Knockout is undefined");

            var model, koModels = [], prop, ob;
            for (var i = 0; i < result.length; i++) {
                model = {};
                for (prop in result[i]) {
                    if (!prop.startsWith("_"))
                        model[prop] = ko.observable(result[i][prop]);
                }
                for (prop in computedObservables) {
                    ob = computedObservables[prop];

                    if ($.isPlainObject(ob)) {
                        if (!ob.owner) ob.owner = model;
                        ob = ko.computed(ob);
                    } else
                        ob = ko.computed(ob, model);

                    model[prop] = ob;
                }
                koModels.push(model);
            }

            return ko.observableArray(koModels);
        };
    };

    var uidIndex = 0;
    var getUid = function (prefix) {
        uidIndex += 1;
        return prefix + uidIndex;
    };

    ej.getGuid = function (prefix) {
        var hexs = '0123456789abcdef', rand;
        return (prefix || "") + '00000000-0000-4000-0000-000000000000'.replace(/0/g, function (val, i) {
            if ("crypto" in window && "getRandomValues" in crypto) {
                var arr = new Uint8Array(1)
                window.crypto.getRandomValues(arr);
                rand = arr[0] % 16|0
            }
            else rand = Math.random() * 16 | 0;
            return hexs[i === 19 ? rand & 0x3 | 0x8 : rand];
        });
    };

    var proxy = function (fn, context) {
        return function () {
            var args = [].slice.call(arguments, 0);
            args.push(this);

            return fn.apply(context || this, args);
        };
    };

    var $proxy = function (fn, context, arg) {
        if ('bind' in fn)
            return arg ? fn.bind(context, arg) : fn.bind(context);

        return function () {
            var args = arg ? [arg] : []; args.push.apply(args, arguments);
            return fn.apply(context || this, args);
        };
    };

    ej.merge = function (first, second) {
        if (!first || !second) return;

        Array.prototype.push.apply(first, second);
    };

    var isNull = function (val) {
        return val === undefined || val === null;
    };

    var throwError = function (er) {
        try {
            throw new Error(er);
        } catch (e) {
            throw e.message + "\n" + e.stack;
        }
    };

})(window.jQuery, window.Syncfusion, window.document);;
/**
* @fileOverview Plugin to style the tagCloud control.
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    
    ej.widget("ejTagCloud", "ej.TagCloud", {
        
        element: null,
        
        model: null,
        validTags: ["div", "span"],
        _rootCSS: "e-tagcloud",
        _setFirst: false,
        
        defaults: {
            
            cssClass : "",
			
            htmlAttributes : {},
            
            dataSource: null,
            
            query: null,
            
            fields:  { 
				
			    text: "text", 
				
			    url: "url", 
				
			    frequency: "frequency",
                
			    htmlAttributes: "htmlAttributes"
			},
            
            showTitle: true,
            
            titleText: "Title",
            
            titleImage: null,
            
            format: "cloud",
            
            enableRTL: false,
            
            minFontSize: "10px",
            
            maxFontSize: "40px",
                        
            mouseover: null,
            
            mouseout: null,
            
            click: null,
            
            create: null,
            
            destroy: null
        },
        
        dataTypes: {
            cssClass : "string",
            showTitle: "boolean",
            titleText: "string",
            titleImage: "string",
            format: "enum",
            enableRTL: "boolean",
            dataSource: "data",
            query: "data",
            fields: "data",
            htmlAttributes: "data"
        },

        
        
        _init: function () {
            this._initialize();
            this._render();
        },
        
        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "fields":
                    case "query":
                    case "dataSource":
                    case "minFontSize":
                    case "maxFontSize":
                        this._refreshTagItems(option, options[option]); break;
                    case "showTitle": this._showTitle(options[option]); break;
                    case "titleText": this._title(options[option]); break;
                    case "titleImage": this._titleImage(options[option]); break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "format": this._format(options[option]); break;
                    case "enableRTL": this._rtl(options[option]); break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                }
            }
        },

        _refreshTagItems: function (key, value) {
            this.model[key] = value;
            this.ul.empty();
            this._checkDataBinding();
        },
        
        _showTitle: function (boolean) {
            if (boolean) {
                this._generateTitle();
                this.ul.removeClass("e-notitle");
            }
            else {
                this.titleText.remove();
                this.ul.addClass("e-notitle");
                this.titleText = null;
            }
        },
        
        _title: function (text) {
            if (this.titleText) {
                if (text) {
                    if (this.text) this.text.html(text);
                    else this._generateTextTag(text);
                }
                else if (this.text) {
                    this.text.remove();
                    this.text = null;
                }
            }
        },
        
        _titleImage: function (imagePath) {
            if (this.titleText) {
                if (imagePath) {
                    if (this.image) this.image.attr("src", imagePath);
                    else this._generateImageTag(imagePath);
                }
                else if (this.image) {
                    this.image.remove();
                    this.image = null;
                }
            }
        },
        
        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this.element.removeClass(this.model.cssClass).addClass(skin);
            }
        },
        
        insert: function (tag) {
            if ($.trim(tag.text)) {
                this.ul.append(this._generateLi(tag, this._getMapper()));
            }
        },
        
        insertAt: function (tag, position) {
            if ($.trim(tag.text)) {
                $(this.ul.children()[position - 1]).before(this._generateLi(tag, this._getMapper()));
            }
        },
        
        remove: function (txt) {
            var li = this.ul.children(), liTag, i;
            for (i = 0; i < li.length; i++) {
                liTag = $(li[i]);
                if (liTag.children()[0].innerHTML == txt)
                    liTag.remove();
            }
        },
        
        removeAt: function (position) {
            var li = this.ul.children();
            $(li[position - 1]).remove();
        },
        
        _format: function (format) {
            if (format == "cloud") {
                this.ul.removeClass("e-list");
                this.ul.addClass("e-cloud");
            }
            else if (format == "list") {
                this.ul.removeClass("e-cloud");
                this.ul.addClass("e-list");
            }
        },
        
        _destroy: function () {
            this.element.removeClass("e-widget " + this.model.cssClass);
            this.element.empty();
        },
        
        _initialize: function () {
            this.minFreq = 0;
            this.maxFreq = 30;
            this.ul = null;
            this.titleText = null;
            this.image = null;
            this.text = null;
        },
        
        _render: function () {
            this.element.addClass("e-widget " + this.model.cssClass);
            if (this.model.showTitle) this._generateTitle();
            this._renderWrapper();
            this._checkDataBinding();
			this._addAttr(this.model.htmlAttributes);
            this._checkProperties();
        },
        
        _generateTitle: function () {
            this.titleText = ej.buildTag("div.e-header e-title");
            if (this.model.titleImage)
                this._generateImageTag(this.model.titleImage);
            if (this.model.titleText)
                this._generateTextTag(this.model.titleText);
            if (this.ul) this.titleText.insertBefore(this.ul);
            else this.element.append(this.titleText);
        },
        
        _generateImageTag: function (titleImage) {	
			if(!this.image)
				this.image = $('<img class="e-title-img" src="' + titleImage + '" />');
			if(this.text && !this.model.titleImage) this.image.insertBefore(this.text);			
			else this.titleText.append(this.image);
        },		
        
        _generateTextTag: function (titleText) { 
			if(!this.text) this.text = ej.buildTag("span", titleText);					
			this.titleText.append(this.text);
        },		
        
        _renderWrapper: function () {
            var format;
            format = (this.model.format == "list") ? "list" : "cloud";
            this.ul = ej.buildTag("ul.e-ul e-box e-" + format);
            this.element.append(this.ul);
            if (!this.model.showTitle) this.ul.addClass("e-notitle");
        },
        
        _renderItems: function (list) {
            this._generateTagItems(list);
            this.ul.removeClass("e-load");
        },
		_addAttr: function (htmlAttr) {
			var proxy = this;
			$.map(htmlAttr, function(value, key) {
				if (key == "class") proxy.element.addClass(value);
				else proxy.element.attr(key,value)
			});
		},

        _checkProperties: function () {
            if (this.model.enableRTL) this._rtl(this.model.enableRTL);
        },
        
        _rtl: function (boolean) {
            if (boolean) this.element.addClass("e-rtl");
            else this.element.removeClass("e-rtl");
        },
        
        _checkDataBinding: function () {
            var source = this.model.dataSource;
            if (source != null) {
                this.ul.addClass("e-load");
                if (ej.DataManager && source instanceof ej.DataManager)
                    this._initDataSource(source);
                else
                    this._renderItems(source);
            }
        },
        
        _initDataSource: function (source) {
            var proxy = this;
            var queryPromise = source.executeQuery(this._getQuery());
            queryPromise.done(function (e) {
                proxy._renderItems(e.result);
            }).fail(function (e) {
                proxy.ul.removeClass("e-load");
            });
        },
        
        _setAttributes: function (data, element) {
            if (data) {
                for (var key in data)
                    if (key == "class")
                        element.addClass(data[key]);
                    else
                        element.attr(key, (key == "style" ? element.attr("style") + ";" : "") + data[key]);
            }
        },

        _getQuery: function () {
            if (ej.isNullOrUndefined(this.model.query)) {
                var column = [], queryManager = ej.Query(), mapper = this.model.fields;
                for (var col in mapper) {
                    if (col !== "tableName" && mapper[col])
                        column.push(mapper[col]);
                }
                if (column.length > 0)
                    queryManager.select(column);
                if (!this.model.dataSource.dataSource.url.match(mapper.tableName + "$"))
                    !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            }
            else queryManager = this.model.query;
            return queryManager;
        },

        _generateTagItems: function (list) {
            var i, mapField = this._getMapper(), callback = function (o) { return o[mapField._freq]; };
            var mappedArray = list.map ? list.map(callback) : $.map(list, callback);
            this.minFreq = Math.min.apply(Math, mappedArray);
            this.maxFreq = Math.max.apply(Math, mappedArray);

            for (i = 0; i < list.length; i++) {
                this.ul.append(this._generateLi(list[i], mapField));
            }
        },
        
        _getMapper: function () {
            var mapper = this.model.fields, mapFld = { _text: null, _freq: null, _url: null };
            mapFld._text = (mapper && mapper.text) ? mapper["text"] : "text";
            mapFld._freq = (mapper && mapper.frequency) ? mapper["frequency"] : "frequency";
            mapFld._url = (mapper && mapper.url) ? mapper["url"] : "url";
            mapFld._attr = (mapper && mapper.htmlAttributes) ? mapper["htmlAttributes"] : "htmlAttributes";
            return mapFld;
        },
        
        _generateLi: function (list, map) {
            var li = ej.buildTag("li.e-tagitems"), aTag;
            aTag = ej.buildTag("a.e-txt", list[map._text] || list[map._url],
                    { "font-size": this._calculateFontSize(list[map._freq]) },
                    { role: "link" });
            if (list[map._url]) aTag.attr({ "href": list[map._url], "target": "blank" });
            this._setAttributes((list[map._attr]), aTag);
            li.append(aTag);
            this._on(aTag, "mouseenter", this._mouseEnter);
            this._on(aTag, "mouseleave", this._mouseLeave);
            this._on(aTag, "click", this._mouseClick);
            return li;
        },

        
        _mouseEnter: function (e) {
            $(e.target).addClass("hover");
            this._raiseEvent(e, "mouseover");
        },
        
        _mouseLeave: function (e) {
            $(e.target).removeClass("hover");
            this._raiseEvent(e, "mouseout");
        },
        
        _mouseClick: function (e) {
            $(e.target).removeClass("hover");
            this._raiseEvent(e, "click");
        },

        _raiseEvent: function (e, _type) {
            this._trigger(_type, { value: $(e.target).html(), url: $(e.target).attr('href'), eventType: _type, target: $(e.target) });
        },
        
        _calculateFontSize: function (frequency) {
            if (frequency) {
                var C = 2, k, fontRange, fontSize,
                minSize = parseInt(this.model.minFontSize, 10), maxSize = parseInt(this.model.maxFontSize, 10);
                k = (frequency - this.minFreq) / (this.maxFreq - this.minFreq);
                fontRange = maxSize - minSize;
                fontSize = minSize + (C * Math.floor(k * (fontRange / C)));
                return fontSize;
            }
            else return this.model.minFontSize;
        }
    });
    
    ej.Format = {
        /**  Render the tagCloud items in cloud format */
        Cloud: "cloud",
        /**  Render the tagCloud items in list format */
        List: "list"
    };
})(jQuery, Syncfusion);;