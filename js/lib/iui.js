(function($, window, document, undefined) {
    /**
    utils：通用方法
    */

    window.IUI_UTILS = {
        animateEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        transitionEnd: 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd',
        isPlaceholder: function() {
            var input = document.createElement('input');
            return 'placeholder' in input;
        },
        throttle: function(func, wait, options) {
            var context, args, result;
            var timeout = null;
            // 上次执行时间点
            var previous = 0;
            if (!options) options = {};
            // 延迟执行函数
            var later = function() {
                // 若设定了开始边界不执行选项，上次执行时间始终为0
                previous = options.leading === false ? 0 : new Date().getTime();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function() {
                var now = new Date().getTime();
                // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
                if (!previous && options.leading === false) previous = now;
                // 延迟执行时间间隔
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
                // remaining大于时间窗口wait，表示客户端系统时间被调整过
                if (remaining <= 0 || remaining > wait) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                    //如果延迟执行不存在，且没有设定结尾边界不执行选项
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        debounce: function(func, wait, immediate) {
            var timeout, args, context, timestamp, result;

            var later = function() {
                var last = new Date().getTime() - timestamp;
                if (last < wait && last > 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };

            return function() {
                context = this;
                args = arguments;
                timestamp = new Date().getTime();
                var callNow = immediate && !timeout;
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        },
        scrollBarWidth: (function() {
            var scrollbarWidth;
            var $scrollDiv = $('<div/>');
            $scrollDiv.css({
                'width': 100,
                'height': 100,
                'overflow': 'scroll',
                'position': 'absolute',
                'top': -9999
            });
            $('html').append($scrollDiv);
            scrollbarWidth = $scrollDiv[0].offsetWidth - $scrollDiv[0].clientWidth;
            $scrollDiv.remove();
            return scrollbarWidth;
        }())
    };

    window.IUI = {};


    $.fn.IUI = function() {
        var arg = arguments;
        var method = arguments[0];
        if (IUI[method]) {
            method = IUI[method];
            arg = Array.prototype.slice.call(arg, 1);
            return method.apply(this, arg);
        } else if (typeof(method) == 'object' || !method) {
            for (var name in method) {
                IUI = $.extend(IUI, method);
                method = IUI[name];
                break;
            }
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.IUI Plugin');
            return this;
        }
    };

    /**
     * pub_sub
     * 发布/订阅模式
     */
    var o = $({});

    $.extend({
        sub: function() {

            o.on.apply(o, arguments);
        },
        unsub: function() {
            o.off.apply(o, arguments);
        },
        pub: function() {
            o.trigger.apply(o, arguments);
        }
    });

    /**
     * alert 组件
     * @param {String}                 obj                 被提示的对象，可传 id 或 jQuery 对象
     * @param {String}                 text                文本信息
     * @param {Number}                 timeout             多少毫秒后隐藏提示
     * @param {Boolean}                status              状态，success or error
     * @param {Array}                  offset              自定义位置微调值，offset[0] = x, offset[1] = y
     * @param {Function}               callback            回调函数 - hide 时触发
     *
     */
    $.extend({
        alert: function(options) {
            var param = $.extend({
                obj: "#message",
                text: '',
                timeout: 1000,
                status: 1,
                callback: null
            }, options);
            // 判断传入的是id还是class
            var callerStyle = param.obj.charAt(0) === '#' ? 'id' : 'class';
            //初始化jQuery对象
            var obj = $(param.obj).length === 0 ? $('<div ' + callerStyle + '="' + param.obj.slice(1) + '" />').appendTo('body') : $(param.obj);
            //判断状态
            var status = ['error','success','info','warning'][param.status];
            //定时器进程id与dom对象的count绑定，用于一对一清除
            var count = obj.data('count') || 1;

            clearTimeout(obj.data('count'));

            obj.html('<span class="' + status + '">' + param.text + '</span>').removeClass('hide');

            // 计时器隐藏提示
            obj.data('count', setTimeout(function() {

                obj.addClass('hide');

                if (param.callback) {
                    param.callback();
                }

            }, param.timeout));

        }
    });

    /*!
     * JavaScript Cookie v2.1.2
     * https://github.com/js-cookie/js-cookie
     *
     * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
     * Released under the MIT license
     */
    ;
    (function($) {
        function extend() {
            var i = 0;
            var result = {};
            for (; i < arguments.length; i++) {
                var attributes = arguments[i];
                for (var key in attributes) {
                    result[key] = attributes[key];
                }
            }
            return result;
        }

        function init(converter) {
            function api(key, value, attributes) {
                var result;
                if (typeof document === 'undefined') {
                    return;
                }

                // Write

                if (arguments.length > 1) {
                    attributes = extend({
                        path: '/'
                    }, api.defaults, attributes);

                    if (typeof attributes.expires === 'number') {
                        var expires = new Date();
                        expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                        attributes.expires = expires;
                    }

                    try {
                        result = JSON.stringify(value);
                        if (/^[\{\[]/.test(result)) {
                            value = result;
                        }
                    } catch (e) {}

                    if (!converter.write) {
                        value = encodeURIComponent(String(value))
                            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                    } else {
                        value = converter.write(value, key);
                    }

                    key = encodeURIComponent(String(key));
                    key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                    key = key.replace(/[\(\)]/g, escape);

                    return (document.cookie = [
                        key, '=', value,
                        attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
                        attributes.path && '; path=' + attributes.path,
                        attributes.domain && '; domain=' + attributes.domain,
                        attributes.secure ? '; secure' : ''
                    ].join(''));
                }

                // Read

                if (!key) {
                    result = {};
                }

                // To prevent the for loop in the first place assign an empty array
                // in case there are no cookies at all. Also prevents odd result when
                // calling "get()"
                var cookies = document.cookie ? document.cookie.split('; ') : [];
                var rdecode = /(%[0-9A-Z]{2})+/g;
                var i = 0;

                for (; i < cookies.length; i++) {
                    var parts = cookies[i].split('=');
                    var cookie = parts.slice(1).join('=');

                    if (cookie.charAt(0) === '"') {
                        cookie = cookie.slice(1, -1);
                    }

                    try {
                        var name = parts[0].replace(rdecode, decodeURIComponent);
                        cookie = converter.read ?
                            converter.read(cookie, name) : converter(cookie, name) ||
                            cookie.replace(rdecode, decodeURIComponent);

                        if (this.json) {
                            try {
                                cookie = JSON.parse(cookie);
                            } catch (e) {}
                        }

                        if (key === name) {
                            result = cookie;
                            break;
                        }

                        if (!key) {
                            result[name] = cookie;
                        }
                    } catch (e) {}
                }

                return result;
            }

            api.set = api;
            api.get = function(key) {
                return api(key);
            };
            api.getJSON = function() {
                return api.apply({
                    json: true
                }, [].slice.call(arguments));
            };
            api.defaults = {};

            api.remove = function(key, attributes) {
                api(key, '', extend(attributes, {
                    expires: -1
                }));
            };

            api.withConverter = init;

            return api;
        }

        $.extend({
            cookie: init(function() {})
        });
    }(jQuery));

    /**
     * loading 组件
     * @param {Boolean}     display         显示或隐藏 true/false
     * @param {String}      type            选择 css 或 img
     * @param {String}      animateHtml     穿入的css动画,type为css有效
     * @param {String}      src             图片地址，type不为css有效
     * @param {Boolean}     shadow          是否显示阴影
     *
     * @example
     *
     * $.loading(true,'css')或$(selector).loading(true,'css')或
     *
     */

    $.loading = $.fn.loading = function(options, type) {
        var defaults = {
            display: false,
            type: 1,
            animateHtml: '<div class="ball-clip-rotate"><div></div></div>',
            src: 'http://img.yi114.com/201571121314_382.gif',
            shadow: true
        };

        var $context;
        var callType = this instanceof $;
        if (callType) {
            $context = this;
            $context.css('position', 'relative');
        } else {
            $context = $('body');
        }



        var loadingStr = '<div class="IUI-loading">{{hook}}</div>';

        if (typeof options === 'object') {
            $.extend(defaults, options);
        } else {
            if (options !== undefined) {
                defaults.display = options;
            }
            if (type !== undefined) {
                defaults.type = type;
            }
        }

        loadingStr = loadingStr.replace('{{hook}}', defaults.type ? defaults.animateHtml : '<img src="' + defaults.src + '" />');

        if (defaults.shadow) {
            loadingStr = '<div class="IUI-loading-backdrop" ' + (callType ? 'style="position:absolute;"' : '') + '></div>' + loadingStr;
        }


        if (defaults.display) {
            $context.append(loadingStr);
        } else {
            $context.find('>.IUI-loading-backdrop,>.IUI-loading').remove();
        }

    };

    /**
     * layer 组件
     * @param  {String}            container           组件的执行上下文环境，默认是body
     * @param  {Boolean}           cache               是否缓存 ajax 页面
     * @param  {Boolean}           shadow              是否开启阴影层关闭
     * @param  {String}            confirmHandle       确认按钮Class
     * @param  {String}            closeHandle         关闭按钮Class
     * @param  {String}            offsetWidth         layer 宽度
     * @param  {String}            offsetHeight        layer 高度
     * @param  {String}            animateClass        弹出动画Class
     * @param  {String}            url                 ajax url
     * @param  {String}            dataType            ajax dataType : html,json,xml ...
     * @param  {String}            method              ajax type : get/post
     * @param  {String}            data                ajax data
     * @param  {Function}          successCall         ajax success callback
     * @param  {Function}          errorCall           ajax error callback
     * @param  {Function}          showCall            回调函数 - 显示触发
     * @param  {Function}          confirmCall         回调函数 - 确认触发
     * @param  {Function}          cancelCall          回调函数 - 关闭触发
     *
     * @method [showLayer]  显示层
     * @method [hideLayer]  隐藏层
     * @method [ajaxLoad]   ajax 弹层
     * @method [cutTo]      切换层
     *
     * @event
     *
     * $('selector').on('layer.show',function(){});
     * $('selector').on('layer.hide',function(){});
     *
     * @example
     *
     * var layerId = $('#layerId').IUI('layer'); // 注意：layerId必须是唯一，当页面中没有div#layerId，将自动创建，并 append 到 container 中
     * layerId.showLayer();
     * layerId.hideLayer();
     * layerId.ajaxLoad();
     *
     * html基本结构
     * div.layer-box.hide#layerId>div.layer-content
     *
     *
     */

    (function($, window) {
        var version = '3.1.0';
        var scrollBarWidth = IUI_UTILS.scrollBarWidth;
        var isIE = document.all && !window.atob;
        var $body = $('body');
        var backdrop = $('<div class="layer-backdrop"></div>');



        function animateEnd(el, fn) {
            if (isIE) {
                fn();
            } else {
                el.on(IUI_UTILS.animateEnd, fn);
            }
        }

        function transitionEnd(el, fn) {
            if (isIE) {
                fn();
            } else {
                el.on(IUI_UTILS.transitionEnd, fn);
            }
        }

        function Layer(config, selector) {
            var defaults = {
                container: 'body',
                cache: false,
                shadow: true,
                confirmHandle: '.btn-confirm',
                closeHandle: '.btn-cancel,.btn-close',
                offsetWidth: 'auto',
                offsetHeight: 'auto',
                url: $(this).attr('data-url') || false,
                dataType: $(this).attr('data-dataType') || 'html',
                data: '',
                method: 'GET',
                content: '',
                showCall: function() {},
                hideCall: function() {},
                successCall: function() {},
                errorCall: function() {},
                confirmCall: function() {},
                cancelCall: function() {}
            };
            this.$selector = selector;
            this.config = $.extend(defaults, config);
            //创建遮罩层
            this.$backdrop = backdrop;

            this.init();
            this.event();
        }

        Layer.prototype.init = function() {
            var self = this;
            var config = self.config;
            var template = '<div class="layer-box hide" id="{{layerName}}"><div class="layer-content">' + config.content + '</div></div>';
            var $selector = this.$selector = self.$selector.length ? self.$selector : $(template.replace('{{layerName}}', self.$selector.selector.replace('#', ''))).appendTo(config.container);
            var $container = config.container === 'body' ? $body : $(config.container);
            var closeHandle = config.closeHandle;
            var $content = this.$content = $selector.find('.layer-content');
            var layerWidth = Number($selector.attr('data-width')) || config.offsetWidth;
            var layerHeight = Number($selector.attr('data-height')) || config.offsetHeight;

            $content.css({
                width: layerWidth,
                height: layerHeight
            });

            $selector.data('layer', self);

        };

        Layer.prototype.ajaxLoad = function() {
            var self = this;
            var config = self.config;
            var $selector = self.$selector;
            var requestUrl = config.url || '?';
            var method = ($selector.attr('data-method') || config.method).toUpperCase();
            var dataType = config.dataType;

            if (config.cache && $selector.data('success')) {
                self.showLayer();
                return false;
            }

            $.loading(true, true);
            $selector.data('success', 1);

            $.ajax({
                url: requestUrl,
                type: method,
                dataType: dataType,
                data: config.data
            }).then(function(res) {
                $.loading(false);
                config.successCall.apply($selector, [res, this, self]);
                self.showLayer();
            }, function(err) {
                $.loading(false);
                self.hideLayer();
                config.errorCall.apply($selector, [err, this, self]);
            });

            return self;
        };

        Layer.prototype.event = function() {
            var self = this;
            var config = self.config;
            var $selector = self.$selector;

            //确认事件
            $selector.on('click.iui-layer', config.confirmHandle, function(event) {
                event.preventDefault();
                config.confirmCall.apply($selector, [event, self]);
                return false;
            });

            // 阴影层事件
            $selector.on('click.iui-layer', function(event) {
                if ($(event.target).is($selector)) {

                    if (!config.shadow) {
                        return false;
                    }
                    if ($body.find('.layer-loading').length) {
                        return false;
                    }
                    self.hideLayer();
                    config.cancelCall.apply($selector, [event, self]);
                }
            });


            //绑定关闭事件
            $selector.on('click.iui-layer', config.closeHandle, function(event) {
                self.hideLayer();
                config.cancelCall.apply($selector, [event, self]);
                return false;
            });
        };

        Layer.prototype.showLayer = function(cutto) {
            var self = this;
            var config = self.config;
            var $backdrop = self.$backdrop;
            var screenH = document.documentElement.clientHeight;
            var gtIE10 = document.body.style.msTouchAction === undefined;
            var isCutto = cutto;
            var Q = $.Deferred();
            // 当body高度大于可视高度，修正滚动条跳动
            // >=ie10的滚动条不需要做此修正,tmd :(
            if ($('body').height() > screenH & (gtIE10)) {
                $('body').css({
                    'border-right': scrollBarWidth + 'px transparent solid',
                    'overflow': 'hidden'
                });
            }
            //显示层
            self.$selector.removeClass('hide');
            self.$content.off(IUI_UTILS.animateEnd);

            if (isCutto) {
                self.$content.removeClass('layer-opening');
            } else {
                //插入-遮罩-dom
                self.$selector.after($backdrop);
                //插入-遮罩-显示动画
                $backdrop.attr('style', 'opacity: 1;visibility: visible;');
            }

            //插入-弹层-css3显示动画
            self.$content.addClass('layer-opening');

            animateEnd(self.$content, function(event) {
                self.$content.removeClass('layer-opening');
                //触发show事件
                self.$selector.trigger('layer.show', [self]);
                //触发showCall回调
                config.showCall.apply(self.$selector, [self]);
                Q.resolve();
            });

            // 绑定 esc 键盘控制
            $(document).on('keyup.iui-layer', function(event) {
                if (event.keyCode === 27) {
                    self.$selector.trigger('click.iui-layer', config.closeHandle);
                }
            });

            //返回Layer对象
            return Q;
        };


        Layer.prototype.hideLayer = function(cutto) {
            var self = this;
            var config = self.config;
            var isCutto = cutto;
            var Q = $.Deferred();
            //插入-弹层-隐藏动画
            self.$content.off(IUI_UTILS.animateEnd);
            self.$content.addClass('layer-closing');
            if (!isCutto) {
                self.$backdrop.removeAttr('style');
                transitionEnd(self.$backdrop, function() {
                    self.$backdrop.remove();
                });
            }
            animateEnd(self.$content, function(event) {
                //插入-遮罩-隐藏动画
                self.$content.removeClass('layer-closing');
                //隐藏弹层
                self.$selector.addClass('hide');
                //触发hide事件
                self.$selector.trigger('layer.hide', [this]);
                //触发hideCall回调
                config.hideCall.apply(self.$selector, [self]);
                Q.resolve();
            });

            //恢复 body 滚动条
            $body.removeAttr('style');
            // 绑定 esc 键盘控制
            $(document).off('keyup.iui-layer');
            return Q;
        };

        Layer.prototype.cutTo = function(nextId, currentId) {
            var nextLayer = $(nextId).data('layer');
            var currentLayer = (currentId ? $(currentId) : this.$selector).data('layer');

            currentLayer.hideLayer(true).done(function(){
                nextLayer.showLayer(true);
            });

        };

        Layer.prototype.destroy = function() {
            var self = this;
            var $selector = self.$selector;
            var config = self.config;
            //确认事件
            $selector.remove();
        };


        $.fn.IUI({
            layer: function(config) {
                return new Layer(config, this);
            }
        });

    }(jQuery, window));

    /**
     * tabs 组件
     *
     * @Options
     *
     * @param {[String]}         [event]                        事件名称
     * @param {[String]}         [animateBefore]                前动画，因transition动画需要两个class支持，因此区分before和after
     * @param {[String]}         [animateAfter]                 后动画，具体参考bootstrap tab的动画效果 fade & in
     * @param {[Boolean]}        [isCache]                      是否缓存，ajax请求内容时使用，默认缓存
     * @param {[Object]}         [ajaxSetup]                    ajax 请求配置
     *
     *
     * @Events
     *
     * $('selctor').on('tabsAjaxBefore',function(){});
     * $('selctor').on('tabsAjaxSuccess',function(){});
     *
     *
     * @Usage
     *
     * $('selector').IUI('tabs',{
     *    event:'mouseenter',
     *    animateBefore:'fade',
     *    animateAfter:'in'
     * });
     *
     */

    ;
    (function($) {
        /**
         * [show description]
         * @param  {[jQuery Object]}            target              目标元素
         * @param  {[Object]}                   config              配置
         */
        function show(target, config) {
            var $target = target;
            $target.addClass('active ' + config.animateBefore);
            setTimeout(function() {
                $target.addClass(config.animateAfter);
            }, 100);
        }
        $.fn.IUI({
            tabs: function(options) {
                return this.each(function() {
                    var defaults = {
                        event: 'click',
                        animateBefore: 'fade',
                        animateAfter: 'in',
                        isCache: true,
                        ajaxSetup: null
                    };

                    var $selector = $(this);
                    //避免与tabs嵌套tabs时冲突
                    var $items = $selector.find('.tabs-item');
                    var config = $.extend({}, defaults, options);

                    $selector.on(config.event + '.iui-tabs', '.tabs-item', function(event) {
                        event.preventDefault();
                        var $this = $(this);
                        var $parent = $this.parent();
                        var $target = $($this.attr('href'));
                        $target.trigger('tabsAjaxBefore', [config]);
                        // switch tabs-item class
                        $parent.addClass('active').siblings('.active').removeClass('active');
                        // switch tabs-content class
                        $target.siblings('.tabs-content').removeClass('active ' + config.animateBefore + ' ' + config.animateAfter);

                        show($target, config);

                        if ($this.data('loaded') && config.isCache) {
                            return false;
                        }

                        if ($this.data('ajax')) {
                            $.ajax($.extend({
                                url: $this.data('ajax'),
                                type: 'GET',
                                dataType: 'html'
                            }, config.ajaxSetup)).then(function(res) {
                                $this.data('loaded', true);
                                $target.trigger('tabsAjaxSuccess', [res]);
                            }, function(err) {
                                console.log(err);
                            });
                        }

                        show($target, config);

                    });

                });
            }
        });
    }(jQuery));

    /**
     * share 分享组件
     */
    $.extend({
        share: function(options) {
            var param = $.extend({
                title: null, //分享的标题
                summary: null, //分享的简介
                url: null, //分享url地址
                pic: $('body').find('img').eq(0).attr('src'), //分享的图片，默认拿第一张图片
                copybtn: '#copy-url', //复制按钮
                swbbtn: '.sweibo', //新浪微博按钮
                qzonebtn: '.qzone', //QQ空间按钮
                twbbtn: '.tweibo', //腾讯微博按钮
                dbbtn: '.douban', //豆瓣按钮
                rrbtn: '.renren' //人人网按钮
            }, options);
            var title = encodeURIComponent(param.title);
            var summary = encodeURIComponent(param.summary);
            var pic = encodeURIComponent(document.domain + param.pic);
            var weiboUrl = encodeURIComponent(param.url + '&share=weibo');
            weiboUrl = 'http://service.weibo.com/share/share.php?url=' + weiboUrl + '&title=' + title + '&pic=' + pic + '&appkey=&searchPic=false';
            $(param.swbbtn).attr('href', weiboUrl);
            var qzoneUrl = encodeURIComponent(param.url + '&share=qzone');
            qzoneUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + qzoneUrl + '#qzone&title=' + title + '&summary=' + summary + '&pics=' + pic;
            $(param.qzonebtn).attr('href', qzoneUrl);
            var tweiboUrl = encodeURIComponent(param.url + '&share=tweibo');
            tweiboUrl = 'http://share.v.t.qq.com/index.php?c=share&a=index&url=' + tweiboUrl + '#tweibo&appkey=appkey&title=' + summary + '&pic=' + pic;
            $(param.twbbtn).attr('href', tweiboUrl);
            var doubanUrl = encodeURIComponent(param.url + '&share=douban');
            doubanUrl = 'http://www.douban.com/share/service?image=' + pic + '&href=' + doubanUrl + '#douban&name=' + title + '&text=' + summary;
            $(param.dbbtn).attr('href', doubanUrl);
            var renrenUrl = encodeURIComponent(param.url + '&share=renren');
            renrenUrl = 'http://widget.renren.com/dialog/share?resourceUrl=' + renrenUrl + '&srcUrl=' + renrenUrl + '&title=' + title + '&pic=' + pic + '&description=' + summary;
            $(param.rrbtn).attr('href', renrenUrl);
            $(param.copybtn).val(param.url + '&share=copy');
        }
    });

    /**
     * 判断是否显示/隐藏邮箱、手机
     * @param  [description]             obj             传body进来;  $('body')
     * @param  [description]             parents         input的父级，用于隐藏/显示
     * @param  [description]             type            判断的类型，邮箱还是手机; 传name
     */
    $.extend({
        exist: function(options) {
            var param = $.extend({
                obj: $('body'), //传body进来;  $('body')
                parents: '.form-container', //input的父级，用于隐藏/显示
                type: 'email', //判断的类型，邮箱还是手机; 传name
                success: null //成功的回调函数
            }, options);

            var obj = param.obj instanceof $ ? param.obj : $(param.obj);
            var $parents = obj.find('#' + param.type).parents(param.parents);
            var activityId = obj.find('input[name="activityId"]').val();
            var _val = obj.find('#' + param.type).val();
            var csrf = $('meta[name="csrf-param"]').prop('content');
            var csrf_val = $('meta[name="csrf-token"]').prop('content');
            var isemail = _val ? '&email=' + _val : '';

            $.post('/index/init-activity', csrf + '=' + csrf_val + '&activityId=' + activityId + isemail, function(res) {
                if (res.status) {
                    if (_val) {
                        if (res.register) {
                            $parents.find('#' + param.type).val('');
                            $parents.removeClass('none');
                        } else {
                            $parents.addClass('none');
                        }
                    }
                    if (param.success) {
                        param.success(res.region);
                    }
                }
            });
        }
    });

    /**
     * ajaxForm 组件
     * @param {String}      url
     * @param {String}      method
     * @param {String}      type
     * @param {Function}    before
     * @param {Function}    success
     * @param {Function}    error
     * @param {Function}    pending
     * @param {Function}    always
     */
    $.fn.IUI({
        ajaxForm: function(options) {
            return this.each(function() {
                var $selector = $(this);
                var defaults = {
                    url: $selector.attr('action'),
                    method: $selector.attr('method') || 'POST',
                    type: $selector.attr('data-type') || 'json',
                    data: null,
                    ajax2: false,
                    before: function() {},
                    success: function() {},
                    error: function() {},
                    pending: function() {},
                    always: function() {}
                };

                var config = $.extend({}, defaults, options);

                $selector.data('deferred', config);

                $selector.on('submit', function(event) {
                    event.preventDefault();
                    if ($selector.hasClass('disabled')) {

                        config.pending.call($selector, config);

                        return false;
                    }

                    var beforeResult = config.before.call($selector, event, config);

                    var args = {
                        url: config.url,
                        type: config.method,
                        data: config.data || $selector.serialize()
                    };

                    // ajax2
                    if (config.ajax2) {
                        args.data = new FormData($selector[0]);
                        args.cache = false;
                        args.contentType = false;
                        args.processData = false;
                    }

                    if (beforeResult === false) {
                        return false;
                    }
                    $selector.addClass('disabled').prop('disabled', true);
                    $.ajax(args).then(function(res) {
                        $selector.removeClass('disabled').prop('disabled', false);
                        config.success.call($selector, res, config);
                    }, function(err) {
                        $selector.removeClass('disabled').prop('disabled', false);
                        config.error.call($selector, err, config);
                    }).always(function(res) {
                        config.always.call($selector, res, config);
                    });
                });

            });
        }
    });

    /**
     * validate 组件
     *
     * *** options ***
     *
     * @param {Element selector}             globalMessage       全局提示id，若为false，则逐项提示
     * @param {Element selector}             errorClass          验证信息 - 错误 class
     * @param {Element selector}             infoClass           验证信息 - 提示 class  若为false，则无info提示
     * @param {Element selector}             successClass        验证信息 - 成功 class  若为false，则无info提示
     * @param {Array}                        collections         验证规则配置
     * @param {Object}                       strategy            新增验证规则
     *
     *
     * collections 语法：[{验证项},{验证项},{验证项},{验证项}]
     *
     * 验证项 语法：
     *
        {
            required: 'password',                                 // 对应 input[data-required]
            context: '.form-group',                               // data-required的执行上下文
            infoMsg: '请输入您的密码，字符长度为3-16位',             // 提示信息
            matches: {                                           // 组合验证
                isNonEmpty: {                                    // 对应 strategy 中存在的验证方法
                    errMsg: '密码不能为空'                        //  验证错误的返回信息
                },
                between: {
                    errMsg: '密码长度为6-16位',
                    range:[6,16]                                //可自定义字段
                }
            }
        }

     *
     *
     * *** events ***
     *
     * $('any element').on('validate.focus',function(event,matches){});
     *
     * $('any element').on('validate.blur',function(event,matches){});
     *
     *
     *
     * *** methods ***
     *
     *  batch           详情请查阅源码部分
     *  message         详情请查阅源码部分
     *  verify          详情请查阅源码部分
     *
     */
    $.fn.IUI({
        validate: function(options) {
            /**
             *
             * GLOB_STRATEGY    默认验证策略集合
             *
             */
            var GLOB_STRATEGY = {
                isNonEmpty: function(params) {
                    var $target = this.self;
                    var value = $target[0].value;
                    if ($.trim(value).length === 0) {
                        return false;
                    }
                },
                minLength: function(params) {
                    //大于
                    if (this.self[0].value.length < params.minLength) {
                        return false;
                    }
                },
                maxLength: function(params) {
                    //小于
                    if (this.self[0].value.length < params.maxLength) {
                        return false;
                    }
                },
                birthdayRange: function(params) {
                    //生日范围
                    var val = this.self[0].value;
                    var min = params.range[0];
                    var max = params.range[1];
                    if (val < min || val > max) {
                        return false;
                    }
                },
                isBirthday: function(params) {
                    //是否为生日
                    if (!/^[1-9]\d{3}([-|\/|\.])?((0\d)|([1-9])|(1[0-2]))\1(([0|1|2]\d)|([1-9])|3[0-1])$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                isMobile: function(params) {
                    //是否为手机号码
                    if (!/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                isEmail: function(params) {
                    //是否为邮箱
                    if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.self[0].value)) {
                        return false;
                    }
                },
                between: function(params) {
                    var $target = this.self;
                    var length = this.self[0].value.length;
                    var min = params.range[0];
                    var max = params.range[1];
                    if (length < min || length > max) {
                        return false;
                    }

                },
                //纯英文
                onlyEn: function(params) {
                    if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //纯中文
                onlyZh: function(params) {
                    if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //非整数
                notInt: function(params) {
                    if (/^[0-9]*$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //数字包含小数
                onlyNum: function(params) {
                    if (!/^[0-9]+([.][0-9]+){0,1}$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //整数
                onlyInt: function(params) {
                    if (!/^[0-9]*$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //至少选中一项 radio || checkbox
                isChecked: function(params) {
                    var result = void(0);
                    this.self.each(function(index, el) {
                        result = el.checked;
                        return result ? false : true;
                    });
                    return result ? void(0) : false;
                },
                //昵称
                isNickname: function(params) {
                    if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
                        return false;
                    }
                }
            };
            var defaults = {
                globalMessage: false,
                errorClass: '.validate-error',
                infoClass: '.validate-info',
                successClass: '.validate-success',
                collections: [],
                strategy: GLOB_STRATEGY
            };

            var selector = this;

            function Validate(options) {
                this.container = 'body';
                this.options = $.extend(true, {}, defaults, options);
                this.$selector = selector;
                this.cache = {};
                this.errors = {};
                this.init();
            }


            /**
             * init方法     初始化
             */
            Validate.prototype.init = function() {
                var self = this;
                var statusArr = ['info', 'success', 'error'];

                if (self.options.collections.length === 0) {
                    return false;
                }

                self.add();
                $.each(self.cache, function(name, fields) {
                    if (fields.context.length === 0) {
                        return;
                    }
                    var contextClassName = /validate-context-(info|success|error)/.exec(fields.context[0].className);
                    var initStatus;
                    if (contextClassName) {
                        initStatus = contextClassName[1];
                        fields.self.data('validateStatus', $.inArray(initStatus, statusArr));
                    }
                });
            };


            /**
             * mapping方法      参数修正，将传入进来的数据转化另一种格式，并插入到cache中
             * @param {Object} options      每一项需要验证的配置参数
             *
             */
            Validate.prototype.mapping = function(options) {
                var $dom = this.$selector.find('[data-required=' + options.required + ']');
                var $context = $dom.parents(options.context).eq(0);
                var msg;
                if ($context.length === 0) {
                    msg = '{context:' + options.context + '} is invalid , it may prevent the triggering event';
                    if (window.console) {
                        console.warn(msg);
                    } else {
                        throw msg;
                    }
                }
                //防止重复
                if (this.cache[options.required]) {
                    return false;
                }

                $.extend(true, this.cache, (function() {
                    var item = {};
                    var target = item[options.required] = {};
                    target.matches = {};
                    target.self = $dom;
                    target.context = $context;
                    target.infoMsg = options.infoMsg || '';
                    target.options = options;
                    $.extend(true, target.matches, options.matches);
                    return item;
                }()));
            };


            /**
             * remove方法                  传入 data-required 的值，删除对应的验证
             * @param {String}  target     data-required值
             *
             */
            Validate.prototype.remove = function(target) {
                var self = this;
                var options = self.options;
                var cache = self.cache;
                var queue, i = 0,
                    len, name, src, required, type, $target;

                if (typeof target !== 'string') {
                    return false;
                }

                queue = target.split(' ');

                len = queue.length;

                for (name in cache) {
                    src = cache[name].self;
                    required = src.data('required');
                    type = src[0] ? src[0].type : '';
                    $target = self.$selector.find('[data-required=' + required + ']');

                    if ($.inArray(required, queue) !== -1) {
                        if ($.inArray(type, ['checkbox', 'file', 'radio']) !== -1) {
                            $target.off('change.iui-validate');
                        } else {
                            $target.off('focus.iui-validate blur.iui-validate');
                        }
                        $target.data('event.iui-validate', false);
                        delete cache[name];
                    }
                }
                self.bindEvent();

            };


            Validate.prototype.add = function(options) {
                var self = this;
                var collections = options || self.options.collections;

                for (var i = 0; i < collections.length; i++) {
                    var target = self.$selector.find('[data-required="' + collections[i].required + '"]');
                    var msg = "iui-validate:cannot find element by data-required=\"" + collections[i].required + "\"";

                    if (target.length) {
                        self.mapping(collections[i]);
                    } else {
                        if (window.console) {
                            console.warn(msg);
                        } else {
                            throw msg;
                        }
                    }
                }
                if (options) {
                    $.merge(self.options.collections, options);
                }
                self.bindEvent();
            };


            /**
             * bindEvent     行为方法，如：focus、blur、change
             */
            Validate.prototype.bindEvent = function() {
                var self = this;
                var handleArr = handler.call(this);
                var $selector = self.$selector;
                var changeHandleArr = ['select-one', 'select-multiple', 'radio', 'checkbox', 'file'];

                $.each(handleArr, function(key, value) {
                    var $target = $selector.find(value);
                    var type, requiredName;

                    if ($target[0] === void 0) {
                        return;
                    }

                    type = $target[0].type;

                    requiredName = value.replace('[', '').replace(']', '').split('=')[1];

                    if ($target.data('event.iui-validate')) {
                        return;
                    }

                    if ($.inArray(type, changeHandleArr) !== -1) {
                        $target.on('change.iui-validate', {
                            self: self
                        }, changeEmitter);
                        $target.data('event.iui-validate', true);
                        return;
                    }

                    $target.on('focus.iui-validate', {
                        self: self
                    }, focusEmitter);

                    if (self.cache[requiredName].options.unblur !== true) {
                        $target.on('blur.iui-validate', {
                            self: self
                        }, blurEmitter);
                    }

                    $target.data('event.iui-validate', true);

                });

            };

            /**
             * verify  行为触发验证
             * @param  {Object} glob      全局对象 Validate
             * @param  {String} eventName 事件名
             */
            Validate.prototype.verify = function(glob, eventName) {
                var $this = $(this);
                var collections = glob.cache[$this.data('required')];
                var matches = collections.matches;
                var status = false;

                /**
                 * @param {String}      name        验证函数名
                 * @param {Object}      params      验证字段（自定义字段）：errMsg、range
                 */
                $.each(matches, function(name, params) {
                    var result = glob.options.strategy[name].call(collections, params);
                    status = result === void(0) ? 1 : 2;
                    $this.data('validateStatus', result);
                    glob.message(status, collections, name);
                    return status === 2 ? false : true;
                });

                $this.trigger('validate.' + eventName, collections);

                return status;
            };

            /**
             * [message description]
             * @param  {Number} status      验证状态：0 未验证状态，1 验证且通过，2 验证且不通过
             * @param  {Object} options     被转化后的验证参数
             * @param  {String} matchesName 验证函数名
             *
             */
            Validate.prototype.message = function(status, cache, matchesName) {
                var className, contextClass, msg, $target, $msgEl, errors = this.errors;

                if (status === 0) {
                    className = this.options.infoClass;
                    msg = cache.infoMsg;
                } else if (status === 1) {
                    className = this.options.successClass;
                    msg = '';
                } else if (status === 2) {
                    className = this.options.errorClass;
                    msg = cache.matches[matchesName].errMsg;
                } else {
                    // 后期再考虑 status === anything ...
                }

                if (status === 2) {
                    errors[cache.options.required] = msg;
                }

                if (!this.options.errorClass) {
                    return false;
                }
                contextClass = ['info', 'success', 'error'];
                $msgEl = this.options.globalMessage ? $(this.options.globalMessage) : cache.context;
                className = className.replace(/\./g, ' ').slice(1);
                $msgEl.removeClass('validate-context-info validate-context-success validate-context-error')
                    .addClass('validate-context-' + contextClass[status]).find('.validate-message').remove();
                $target = $('<div class="validate-message ' + className + '" >' + msg + '</div>');
                $msgEl.append($target);

            };

            /**
             * batch    批量验证
             * @param  {Boolean}            circulation       强制循环，true：将全部验证，false：其中一个验证不通过将返回false并中断循环
             * @return {Boolean}
             *
             */
            Validate.prototype.batch = function(circulation) {
                var self = this;
                var status = [];
                $.each(this.cache, function(name, target) {
                    if (target.self[0].disabled) {
                        return;
                    }
                    var initStatus = target.self.data('validateStatus');
                    var result = !initStatus ? self.verify.call(target.self, self, 'batch') : initStatus;

                    if (circulation && result === 2) {
                        status.push(result);
                        return false;
                    }

                    status.push(result);
                });
                return $.inArray(2, status) === -1 ? true : false;
            };
            /**
             * handler 生成事件代理对象
             * @return {String}     事件委托目标
             */
            function handler() {
                var queue = [];
                var collections = this.cache;
                for (var name in collections) {
                    queue.push('[data-required=' + name + ']');
                }
                return queue;
            }


            function focusEmitter(event) {
                var self = event.data.self;
                var $this = $(this);
                var _name = $this.data('required');
                var collections = self.cache[_name];
                if (self.options.infoClass) {
                    self.message(0, collections);
                }
                $this.trigger('validate.focus', collections);
            }

            function blurEmitter(event) {
                var $this = $(this);
                var self = event.data.self;
                var requiredName = $this.data('required');
                self.verify.call(this, self, 'blur');
            }

            function changeEmitter(event) {
                var self = event.data.self;
                self.verify.call(this, self, 'change');
            }

            return new Validate(options);
        }
    });

    /**
     * emailSuffix 组件
     * @param {String}      container               组件的执行上下文
     * @param {String}      style                   组件被 append 的位置，若为global，则 append to container，否则将插入到和被调用元素的同一级节点中
     * @param {String}      item                    邮箱后缀列表 li 的 class
     * @param {String}      current                 邮箱后缀列表 li 的选中 class
     * @param {Array}       emails                  常用邮箱后缀，若要增加新邮箱后缀，需要复写原有默认的邮箱，否则数组将会被覆盖
     * @param {Number}      delay                   delay 毫秒后隐藏列表
     * @param {Number}      offsetLeft              组件定位 - left
     * @param {Number}      offsetTop               组件定位 - top
     * @param {Number}      offsetWidth             组件宽度 - width
     * @param {Number}      offsetHeight            组件高度 - height
     * @param {Function}    checkedCall             回调函数，选中后触发
     */
    $.fn.IUI({
        emailSuffix: function(options) {
            return this.each(function() {
                var defaults = {
                    container: 'body',
                    style: 'global',
                    item: 'email-item',
                    current: 'checked',
                    emails: ['163.com', '126.com', 'qq.com', 'gmail.com', 'sina.com', '139.com', '189.com', 'sohu.com'],
                    delay: 300,
                    offsetLeft: $(this).offset().left,
                    offsetTop: $(this).offset().top,
                    offsetWidth: $(this).outerWidth(),
                    offsetHeight: $(this).outerHeight(),
                    checkedCall: function() {}
                };
                var $selector = $(this);
                var config = $.extend({}, defaults, options);
                var $list = $('<ul class="email-list hide"></ul>');
                var $body = $(config.container);
                var time = null;
                var listHtml = function(arr, input) {

                    var str = '';
                    var val = input.value || null;
                    var prefix = val ? val.split('@')[0] : false;
                    var suffix = val ? val.split('@')[1] : false;

                    for (var i = 0; i < arr.length; i++) {
                        email = arr[i];
                        if ((prefix && !suffix) || suffix && email.indexOf(suffix) !== -1) {
                            str += '<li class="' + config.item + '" data-value="' + prefix + '@' + email + '">' + prefix + '@' + email + '</li>';
                        }

                    }
                    return str;
                };

                var keyEvent = function(keyCode, target, obj) {
                    var tmp = [38, 40];
                    if ($.inArray(keyCode, tmp) === -1 || target.hasClass('hide')) {
                        return false;
                    }
                    var direction = $.inArray(keyCode, tmp) >= 1 ? true : false;
                    var $target = target;
                    var len = $target.find('li').length;
                    var $targetCurrent = $target.find('li.checked');
                    $target.find('li').removeClass('checked');

                    if (direction) {
                        //down
                        if ($targetCurrent.length && $targetCurrent.index() !== len - 1) {
                            $targetCurrent.next().addClass('checked');
                        } else {
                            $target.find('li').eq(0).addClass('checked');
                        }
                    } else {
                        //up
                        if ($targetCurrent.index() > 0) {
                            $targetCurrent.prev().addClass('checked');
                        } else {
                            $target.find('li').eq(len - 1).addClass('checked');
                        }
                    }

                    obj.val($.trim($target.find('li.checked').text()));

                    config.checkedCall.apply($selector, [event, config]);
                };
                var resize = function() {
                    var left = config.offsetLeft;
                    var top = config.offsetTop;
                    var width = config.offsetWidth;
                    $list.css({
                        left: left,
                        top: top + config.offsetHeight,
                        width: width
                    });
                };

                resize();

                if (config.style === 'global') {
                    $body.append($list);
                    $(window).on('resize.emailSuffix', resize);
                } else {
                    $selector.parent().css('position','relative').append($list);
                }

                $selector.on('keyup.emailSuffix', function(event) {
                    var val = this.value;
                    if (val.charAt(0) !== '@' && val.split('@').length === 2 && $.inArray(event.keyCode, [40, 38, 13]) === -1) {
                        var str = listHtml(config.emails, this);

                        $list.html(str).removeClass('hide').find('li').eq(0).addClass('checked');

                    } else if ($.inArray(event.keyCode, [40, 38, 13]) === -1) {
                        $list.html('').addClass('hide');
                    }
                });

                $selector.on('keydown.emailSuffix', function(event) {
                    var $selected = $list.find('li.checked');
                    keyEvent(event.keyCode, $list, $selector);
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        if ($selected.length) {
                            $selector.val($.trim($selected.text()));
                        }
                        $list.addClass('hide');
                    }
                });

                $selector.on('blur.emailSuffix', function(event) {
                    time = setTimeout(function() {
                        $list.addClass('hide');
                    }, config.delay);
                });

                $list.on('click', '.' + config.item, function(event) {
                    event.preventDefault();
                    clearTimeout(time);
                    $selector.val($(this).attr('data-value')).focus();
                    $list.addClass('hide');
                    config.checkedCall.apply($selector, [event, config]);
                    return false;
                });
            });


        }
    });


    /**
     * placeholder 组件
     * @param {color}     color           placeholder color
     * @param {String}    zIndex          placeholder z-index 需高于input
     * @param {Number}    top             placeholder 相对input父元素定位top值
     * @param {Number}    left            placeholder 相对input父元素定位top值
     *
     * @example
     * $('body').IUI('placeholder',{color:'#999',zIndex:1});
     */

    $.fn.IUI({
        placeholder: function(options) {
            if ('placeholder' in document.createElement('input')) {
                return;
            }

            var defaults = {
                    color: '#999', //placeholder color
                    zIndex: 1, //针对position:absolute的input元素，label覆盖在input之上
                    top: 0, //placeholder相对父元素绝对定位
                    left: 0 //placeholder相对父元素绝对定位
                },
                param = $.extend({}, defaults, options || {}),
                $eles = $(this).find('input[type="text"],input[type="password"],input[type="tel"],input[type="email"]');

            return $eles.each(function(i, n) {
                var $ele = $(n),
                    ele = n, //ele供原生事件onpropertychange调用
                    placeholder = $ele.attr('placeholder');

                var $elel = $('<label></label>').css({
                    position: 'absolute',
                    top: param.top,
                    left: param.left,
                    color: param.color,
                    zIndex: param.zIndex,
                    height: 0,
                    lineHeight: $ele.css('height'),
                    fontSize: $ele.css('fontSize'),
                    paddingLeft: $ele.css('textIndent') ? $ele.css('textIndent') : $ele.css('paddingLeft'),
                    background: 'none',
                    cursor: 'text'

                }).text(placeholder).insertBefore($ele);

                $ele.parent().css({
                    'position': 'relative'
                });

                if ($ele.val()) {
                    $elel.hide();
                }

                //事件绑定
                $elel.on({
                    click: function() {
                        $elel.hide();
                        $ele.focus();
                    }
                });
                $ele.on({
                    focus: function() {
                        $elel.hide();
                    },
                    blur: function() {
                        if (!$ele.val()) {
                            $elel.show();
                        }
                    },
                    input: function() {
                        if ($ele.val()) {
                            $elel.hide();
                        } else {
                            $elel.show();
                        }
                    }
                });
                //IE6-8不支持input事件，另行绑定
                ele.onpropertychange = function(event) {
                    event = event || window.event;
                    if (event.propertyName === 'value') {
                        var $this = $(this);
                        if ($this.val()) {
                            $(this).prev('label').hide();
                        } else {
                            $(this).prev('label').show();
                        }
                    }
                };
            });
        }
    });

    /**
     * typeCount 组件
     * @description     字数统计，侦听input[type=text],textarea
     * @example
     * html    div.J-typeCount>input+span.count
     * js      $('.J-typeCount').IUI('typeCount');
     */
    $.fn.IUI({
        typeCount: function(options) {
            return this.each(function() {
                $(this).on('keyup', 'input[type=text],textarea', function(event) {
                    event.preventDefault();
                    var $this = $(this);
                    var $target = $this.parent().find('span.count');
                    var initCount = parseInt($target.text().split('/')[1]);
                    var length = this.value.length;
                    if (length > initCount) {
                        $target.addClass('error');
                    } else {
                        $target.removeClass('error');
                    }
                    $target.html(length + '/' + initCount);
                });

                $(this).find('input,textarea').trigger('keyup');
            });
        }
    });

     /**
 * tokenize 组件
 * @param  {boolean} readOnly 为true的时候，其他所有option失效
 * @return {string}   contain 默认为'.tokenize'，共有上下文
 * @param  {string} remove 如果为'no-remove'，表示不能删除初始化就选中的token
 * @param  {number} maxLength 最多可以输入多少个字符进行搜索，默认是10
 * @param  {string} placeholder input的placeholder
 * @param  {boolean} expand 是否展开二级菜单，默认 true
 * @param  {function} overLimitCount 选择超过限制个数触发
 * @return {function}   existToken 已经存在标签触发
 * @return {function}   searchCallback 搜索后的回调函数
 * @return {function}   beforeChoice 选择前回调函数
 * @return {function}   choiceCallback 选择token回调
 * @return {function}   removeCallback 移除token回调
 * .tokenize > select + ul + .token > .token-item
 */
 /*
    多级必须有optgroup 必须有label属性
 */
;(function($){
    var settings = {
        readOnly: false,
        contain: '.tokenize',
        remove: '',
        maxLength: 20,
        placeholder: '',
        expand: true,
        overLimitCount: function(){},
        existToken: function(){},
        searchCallback: function(){},
        beforeChoice: function(){},
        choiceCallback: function(){},
        removeCallback: function(){}
    };

    var KEY_CODE = {
        top: 38,
        right: 39,
        bottom: 40,
        left: 37,
        enter: 13,
        back: 9
    };

    var htmlTemplate = {
        spanTemplate: ['<span class="token-item">',
                        '<span>{text}</span><span data-value="{value}" class="token-close">×</span>',
                    '</span>'].join(''),
        optionTemplate: '<option selected="selected" value="{value}">{value}</option>',
        liTemplate: '<li class="hidden" data-value="{value}">{value}</li>',
        inputTemplate: '<div class="token"> <span class="tokenize-inp"> <input type="text" maxlength="{{maxlength}}" placeholder="{{placeholder}}" style="width: {{width}}px"> </span> </div>'
    };

    var addChoiceCurrent = function(event, defaults) {
        if (!$(this).hasClass('tokenize-group')) {
            var $this = $(this);
            $this.closest(defaults.contain).find('li').removeClass('current');
            $this.addClass('current');
        }
    };

    var tokenize = $.fn.tokenize = function(options){
        var defaults = $.extend(true, {}, settings, options);
        htmlTemplate.inputTemplate = htmlTemplate.inputTemplate.replace('{{maxlength}}', defaults.maxLength).replace('{{placeholder}}', defaults.placeholder).replace('{{width}}', defaults.maxLength*12);

        return this.each(function(index, el) {
            var $this = $(this);
            var limitCount = $this.attr('data-limitCount') * 1;

            if ($this.data('init')) {
                return true;
            }

            if (isNaN(limitCount)) {
                limitCount = Infinity;
            }
            $this.data({
                showAll: $this.attr('data-showAll') === 'false' ? false : true,
                create: $this.attr('data-create') === 'false' ? false : true,
                limitCount: limitCount,
                init: true
            });

            //添加input
            $this.append(htmlTemplate.inputTemplate);

            //创建模拟下拉框
            tokenize.renderSelect($this, defaults.expand);

            //设置各种事件
            tokenize.setEvent($this, defaults);

            //创建默认token
            $this.find('li[uled]').each(function(index, el) {
                $(el).addClass('current ' + defaults.remove).trigger('click');
            });

            // 恢复显示
            $this.find('.tokenize-group').removeClass('hide');
        });
    };


    //模拟下拉框
    tokenize.renderSelect = function($contain, expand){
        var htmlStr = $contain.find('select').prop('outerHTML');
        var direc = expand ? 'tokenize-up' : '';
        var dis = expand ? '' : 'hide';
        var str = '<li class="tokenize-group"><span class="tokenize-group-name '+direc+'">$1</span><ul class="tokenize-group-child '+dis+'">';

        htmlStr = (htmlStr + '').replace(/<optgroup\s+label="(.*)".*>/g, str);
        htmlStr = htmlStr.replace(/<\/optgroup>/g, '</ul></li>');
        htmlStr = htmlStr.replace(/select/g, 'ul').replace(/option/g, 'li').replace(/value/g, 'data-value');
        $contain.append(htmlStr);
    };

    //创建token
    tokenize.createToken = function(text, value, defaults){
        var $inp = $(this).closest(defaults.contain).find('input').val('');
        var $token = $inp.parent();
        var str = htmlTemplate.spanTemplate.replace('{text}', text).replace('{value}', value);
        $(str).insertBefore($token);
    };

    //设置事件
    tokenize.setEvent = function($contain, defaults){

        if (defaults.readOnly === false) {
            //删除token
            $contain.on('click', '.token-close', function(event) {
                event.stopPropagation();
                var $this = $(this);
                var $contain = $this.closest(defaults.contain);
                var value = $this.attr('data-value');
                var $li = $contain.find('li[data-value="'+value+'"]');
                if ($li.hasClass('no-remove')) {
                    return;
                }
                $contain.find('option[value="'+value+'"]').removeAttr('selected');
                $li.removeClass('hidden');
                $li.closest('li').eq(0).removeClass('hide');
                $this.parent('.token-item').remove();

                tokenize.hideToken($contain);
                defaults.removeCallback.call($contain);
            });

            //聚焦输入
            $contain.on('click', '.token', function(event) {
                event.stopPropagation();
                $(document).trigger('click.tokenize-hide');
                var $this = $(this);
                $this.find('input').focus();
                tokenize.searchToken.call($this.find('input')[0], defaults);
            });

            //输入搜索token
            $contain.on('keyup', 'input', function(event) {
                var keycode = event.keyCode;
                var KC = KEY_CODE;
                if(keycode !== KC.enter && keycode !== KC.back && keycode !== KC.bottom && keycode !== KC.top) {
                    tokenize.searchToken.call(this, defaults);
                }
            });

            // 收缩二级菜单
            $contain.on('click', '.tokenize-group-name', function(event) {
                $(this).toggleClass('tokenize-up').next().toggleClass('hide');
            });

            //按下enter键设置token
            $contain.on('keyup', '>ul,input', function(event) {
                var keycode = event.keyCode;
                var KC = KEY_CODE;
                if(keycode === KC.enter || keycode === KC.back) {
                    tokenize.setToken.call(this, defaults);
                }
            });

            //按下上下键切换token
            $contain.on('keyup', function(event) {
                var keycode = event.keyCode;
                var KC = KEY_CODE;
                if (keycode === KC.bottom || keycode === KC.top) {
                    $contain.off('mouseenter.tokenize');
                    tokenize.turnToken.call(this, keycode);
                    $contain.one('mousemove', '>ul', function(event){
                        $contain.on('mouseenter.tokenize', 'li', function(event){
                            addChoiceCurrent.call(this, event, defaults);
                        });
                    });
                }
            });

            //鼠标样式
            $contain.on('mouseenter.tokenize', 'li', function(event){
                addChoiceCurrent.call(this, event, defaults);
            });

        }else{
            $contain.find('input').attr('readonly', 'readonly');
        }



        //点击li设置token
        $contain.on('click', 'li', function(event) {
            if (!$(this).hasClass('tokenize-group')) {
                tokenize.setToken.call(this, defaults);
            }else{
                event.stopPropagation();
            }
        });

    };

    //输入搜索token
    tokenize.searchToken = function(defaults){
        var $contain =  $(this).closest(defaults.contain);

        // 获取可见的非级别li
        var $lis = $contain.find('>ul').removeClass('hide').find('li').not('.tokenize-group').removeClass('current').not('.hidden');
        var showAll = $contain.data('showAll');
        var values = $.trim(this.value);
        var count = 0;
        $lis.each(function(index, el) {
            var $el = $(el);
            var txts = $el.text();
            var cn = count !== 0 ? '' : 'current';


            if ((showAll || values !== '') && txts.indexOf(values) > -1) {
                ++count;
                $el.removeClass('hide').addClass(cn);
            }else{
                $el.addClass('hide');
            }

        });

        defaults.searchCallback.call($contain);

        // 隐藏父ul
        tokenize.hideTitle.call($contain);
    };

    //按下enter键或者点击 li 设置token
    tokenize.setToken = function(defaults){
        var $contain = $(this).closest(defaults.contain);
        var $tokens = $contain.find('li').not('.tokenize-group');
        //var $visibleTokens = $tokens.filter(':visible');
        var $selectedTokens = $tokens.filter('.current');
        var str;
        var index;
        var $inp = $contain.find('.token input');
        var value = $.trim($inp.val());


        if (!tokenize.testCount.call(this, defaults)) {
            defaults.overLimitCount($contain);
            return;
        }

        if (!tokenize.testExist.call(this, defaults)) {
            defaults.existToken($contain);
            return;
        }

        //$contain.off('mouseenter.tokenize');

        defaults.beforeChoice.call($contain);

        //$selectedTokens = $selectedTokens.length ? $selectedTokens : $visibleTokens.eq(0);
        if ($selectedTokens.length) {
            $selectedTokens.removeClass('current').addClass('hidden');

            //创建 token
            tokenize.createToken.call(this, $selectedTokens.text(), $selectedTokens.attr('data-value'), defaults);

            //改变select
            index = $tokens.index($selectedTokens);
            $contain.find('option').eq(index).attr('selected', 'selected');
        }else{
            var $ul = $contain.find('ul');

            // 多级是无法创建的
            if($contain.data('create') && $ul.length === 1 && value){
                //添加 li
                $contain.find('ul').append(htmlTemplate.liTemplate.replace(/\{value\}/g, value));

                //创建 token
                tokenize.createToken.call(this, value, value, defaults);

                //修改 select
                $contain.find('select').append(htmlTemplate.optionTemplate.replace(/\{value\}/g, value));
            }
        }
        tokenize.hideToken($contain);
        defaults.choiceCallback.call($contain, $selectedTokens);
        // $contain.on('mouseenter.tokenize', 'li', function(event){
        //     addChoiceCurrent.call(this, event, defaults);
        // });
    };

    //按下上下键切换token
    tokenize.turnToken = function(keycode){
        var $this = $(this);
        var $ul = $this.find('>ul');
        var $tokens = $this.find('li').not('.tokenize-group');
        var height = $tokens.height();
        var $visibleTokens = $tokens.filter(':visible');
        var $selectedTokens = $visibleTokens.filter('.current');
        var index = $visibleTokens.index($selectedTokens);
        var length = $visibleTokens.length;

        if (length) {
            if(keycode === 40){
                index = (index +1)%length;
            }else{
                if (index !== 0) {
                    index = --index;
                }else{
                    index = --length;
                }
            }
            $selectedTokens.removeClass('current');
            $visibleTokens.eq(index).addClass('current');
            $ul.scrollTop(index*height);
        }
    };

    //隐藏li
    tokenize.hideToken = function($ele){
        $(document).on('click.tokenize-hide',function(event) {
            tokenize.hideToken($('.tokenize'));
        });
        return function($ele){
            $ele.find('>ul').not('.extra').addClass('hide');
            $ele.find('li').not('.tokenize-group,.extra').addClass('hide');
            //return $ele.find('ul').not('.tokenize-group-child').addClass('hide').find('li').addClass('hide');
        };
    }();

    //隐藏标题（多级的情况）
    tokenize.hideTitle = function(){
        var $lis = this.find('.tokenize-group');

        $lis.each(function(index, el) {
            var $el = $(el);

            if($el.find('li:not(.hidden):not(.hide)').length > 0){
                $el.removeClass('hide');
            }else{
                $el.addClass('hide');
            }
        });
    };

    //判断选择的个数
    tokenize.testCount = function(defaults){
        var $contain = $(this).closest(defaults.contain);
        var limitCount = $contain.data('limitCount');
        var length = $contain.find('.token-item').length;
        if (limitCount !== Infinity) {
            if (length >= limitCount) {
                return false;
            }
        }
        return true;
    };

    //判断是否已经存在
    tokenize.testExist = function(defaults){
        var $contain = $(this).closest(defaults.contain);
        var text = $.trim($contain.find('.token input').val());
        var $tokenItem = $contain.find('.token-item');
        var result = true;
        $tokenItem.each(function(index, el) {
            var $span = $(el).find('span').eq(0);
            if ($span.text() === text) {
                result = false;
                return;
            }
        });
        return result;
    };

    $.fn.IUI({
     tokenize: tokenize
    });

})(jQuery);


/**
 * iselector 组件
 * [defaults description]         定义参数
 * dataJson               传入json数据
 * container              父节点
 * template               自定义html模板
 * placeholder              列默认显示的文字
 * field                input的字段名 [省，市，区]
 * iscity               是否是用于城市下拉(默认是城市下拉)
 * iselect                是否用于select,默认是false，用于自定义
 * iscode               是否输出区号值,默认false, 开启就传字段名，例如：'quhao'
 * isvalue                value存的是id 还是 name 默认true.是存id
 * shorthand              是否开启简写功能,默认不开启 false
 * level                多少列  默认是一列(级) 1
 * values                 返回选中的值
 * joinHtml               拼接html的函数，用于json数据自定义的，里面有4个传值
                  [data-json数据, pid-json数据的父id, level-列数（级数）, placeholder-默认显示的文字]
*/

/**
 * 关于 template
 * data-caller={{caller}} ： 必填，用于呼出下来列表，select时是change事件，自定义标签是click
 * data-item              ： 自定义标签时必填，因为【项】需要绑定click事件
 * role="name"            ： 自定义标签时必填，用于声明【name】 显示选中的选项名称
 * role="content"         ： 自定义标签时必填，用于声明【容器】 选项列表
 * role="input"       :  自定义标签时必填，用于声明【input】隐藏域
 * name="{{field}}"     :  input字段名称，必填
 * 自定义的html
 * <div class="selector-level selector-level-{{level}}">
 *    <a href="javascript:;" role="name" class="selector-name selector-name-dcolor" data-caller="{{caller}}">{{name}}</a>
 *    <input type="hidden" name="{{field}}" role="input" value="">
 *    <ul role="content" class="selector-list hide">{{content}}</ul>
 * </div>
 * select标签
 * <select name="{{field}}" role="content" data-caller="{{caller}}" class="selector-control selector-control-{{level}}">{{content}}</select>
 */

;(function($, window, document, undefined) {

  /**
   * [Iselector description]              构造器
   * @param {[type]} selector [description]   selector
   * @param {[type]} options  [description]   参数
   */
  function iSelector(selector, options) {
    this.options = $.extend({}, iSelector.defaults, options);
    this.$container = $(this.options.container);
    this.$selector = $(selector);
    this.init();
    this.event();
  }

  iSelector.defaults = {
    dataJson: null,
    container: 'body',
    template: '<div class="selector-level selector-level-{{level}} {{csname}}"><a href="javascript:;" role="name" class="selector-name selector-name-dcolor" data-caller="{{caller}}">{{name}}</a><input type="hidden" name="{{field}}" role="input" value=""><ul role="content" class="selector-list hide">{{content}}</ul></div>',
    placeholder: ['请选择省份', '请选择市', '请选择区'],
    field: ['userProvinceId', 'userCityId', 'userAreaId'],
    iscity: true,
    iselect: false,
    iscode: false,
    isvalue: true,
    shorthand: false,
    values: [],
    level: 1,
    joinHtml: function(data, pid, level, placeholder) {
      var _data = data;
      var _len = _data.length;
      var _pid = pid || '100000';
      var _html = this.options.iselect ? '<option>'+ placeholder +'</option>' : '';
      var _jhtml = this.options.iselect ? '<option>'+ placeholder +'</option>' : '';

      if( level < 0) {
        return _html;
      }

      for (var i = 0; i < _len; i++) {
        var _name = this.options.shorthand ? _data[i].shortName : _data[i].name;
        var _val = this.options.isvalue ? _data[i].id : _data[i].name;
        var _code = this.options.iscode && _data[i].cityCode !== "" ? 'data-code='+_data[i].cityCode : '';

        if (this.options.iscity && _data[i].parentId === _pid) {
          if (this.options.iselect) {
            _html += '<option data-item="'+ level +'" value="'+ _val +'">'+ _name +'</option>';
          }else {
            _html += '<li data-item="'+ level +'" data-id="'+ _data[i].id +'" '+ _code +'>'+ _name +'</li>';
          }
        } else {
          if (this.options.iselect) {
            _jhtml += '<option data-item="'+ level +'" value="'+ _val +'">'+ _name +'</option>';
          }else {
            _jhtml += '<li data-item="'+ level +'" data-id="'+ _data[i].id +'" '+ _code +'>'+ _name +'</li>';
          }
        }
      }

      if (this.options.iscity) {
        return _html;
      }

      return _jhtml;
    },
    startClick: null        //自定义标签一开始点击的回调
  };

  iSelector.prototype.init = function() {
    var self = this;
    var config = self.options;
    var html, placeholder, field;

    /**
     * [for description]    定义的级别循环,添加html模板到对应的级别去
     */
    for (var i = 0; i < config.level; i++) {

      //默认提示
      placeholder = config.placeholder[i] || '';

      //html模板把{{level}}和{{caller}}替换成对应的级别
      html = config.template.replace('{{level}}', i + 1).replace('{{caller}}', i + 1);

      if (!i) {
        html = html.replace('{{content}}', config.joinHtml.call(this, config.dataJson, null, i + 1, placeholder));
      } else {
        html = html.replace('{{content}}', config.joinHtml.call(this, config.dataJson, null, -1, placeholder));
      }

      //自定义标签的时候会要求有这个{{name}},{{field}},要把这个替换成默认的显示文字
      if (html.indexOf('{{name}}') !== -1) {
        html = html.replace('{{name}}', placeholder);
      }

      //自定义标签的时候会要求有这个{{field}},要把这个替换成要传的字段名称
      if (html.indexOf('{{field}}') !== -1 || html.indexOf('{{csname}}') !== -1) {
        field = config.field[i] || '';
        html = html.replace('{{field}}', field).replace('{{csname}}', field);
      }

      //把html添加到对应的级别去
      self.$selector.append(html);

    }

  };

  iSelector.prototype.event = function() {
    var self = this;
    var config = self.options;
    var $selector = self.$selector;

    /**
     * 定义的级别循环,级别的事件处理
     */
    for (var i = 0; i < config.level; i++) {
      (eventInjection)(i);
    }

    //判断是否是用于自定义的
    if (!config.iselect) {
      //执行点击区域外的就隐藏列表;
      $(document).on('click.iselector', function(event) {
        var e = event || window.event;
        var elem = e.target || e.srcElement;
        while (elem) {
          if (elem.className && elem.className.indexOf(self) > -1) {
            return;
          }
          elem = elem.parentNode;
        }

        self.$selector.find('[role="content"]').addClass('hide');
      });

    }

    function eventInjection(index) {
      var plusIndex = i + 1;

      //判断是否是select  是就用chage事件，否则就是click事件
      if (config.iselect) {

        $selector.on('change.iselector', '[data-caller="' + plusIndex + '"]', function(event) {
          var $this = $(this);

          self.hideSelector($this, index, true);

        });

      } else {

        //显示列表
        $selector.on('click.iselector', '[data-caller="' + plusIndex + '"]', function(event) {
          var $this = $(this);
          var $selectorList = $selector.find('[role="content"]');

          $selectorList.addClass('hide').eq(index).removeClass('hide');

          if (typeof config.startClick === 'function') {
            /**
             * 一开始点击的时候调用一个回调函数
             * typeof 判断传进来的类型是不是一个function函数
             * 返回三个参数 $self/_this/config
             */
            config.startClick.apply(this, [self, $this, config]);
          }

          return false;
        });

        //点击列表事件
        $selector.on('click.iselector', '[data-item="' + plusIndex + '"]', function(event) {
          var $this = $(this);

          config.values = [];

          self.hideSelector($this, index, false);

        });
      }

    }
  };

  /**
   * [hideSelector description]             选项执行的函数
   * @param  {[type]} tagert  [description]       传点击的this
   * @param  {[type]} index   [description]       传循环的列数
   * @param  {[type]} iselect [description]       是否是select   true/false
   */
  iSelector.prototype.hideSelector = function(tagert, index, iselect) {
    var self = this;
    var config = self.options;
    var $selector = self.$selector;
    var $name = $selector.find('[role="name"]');
    var $caller = $selector.find('[data-caller]');
    var $input = $selector.find('[role="input"]');
    var $content = $selector.find('[role="content"]');
    var parentId = iselect ? tagert.val() : tagert.attr('data-id');
    var txt = tagert.text();
    var plusIndex = index + 1;
    var nextIndex = index + 2;
    var placeholder = config.placeholder[plusIndex] || '';

    /**
     * [if description]     判断是否是用于select，执行select事件，否则执行自定义的事件
     * @param  {[type]} iselect [description]   是否是用于select
     */
    if (iselect) {

      //默认提示
      placeholder = config.placeholder[plusIndex] || '';

      //添加下一列的选项
      $content.eq(plusIndex).html(config.joinHtml.call(self, config.dataJson, parentId, nextIndex, placeholder));

      //执行下一列的事件，然后选中第一个
      $content.eq(plusIndex).find('[data-item]').eq(0).prop('selected', true).trigger('change');

    } else {

      //添加选中的class
      tagert.addClass('checked').siblings('.checked').removeClass('checked');

      //添加选中的文字到name显示
      $name.eq(index).text(txt).removeClass('selector-name-dcolor');

      //添加选中的值到input里
      $input.eq(index).val(parentId);

      //添加下一列的选项列表
      $content.eq(plusIndex).html(config.joinHtml.call(self, config.dataJson, parentId, nextIndex, placeholder));

      //执行下一列的点击事件，选中第一个
      $content.eq(plusIndex).find('[data-item]').eq(0).trigger('click');

      //隐藏对应的列表
      $content.eq(index).addClass('hide');

    }

    //返回选中的值
    config.values.unshift(parentId);

    //选择选项后触发自定义事件choose(选择)事件
    $selector.trigger('choose-' + plusIndex, [self, tagert, plusIndex, config.values]);

  };

  $.fn.IUI({
    iselector: function(config) {
      return this.each(function() {
        if (!$(this).data('iselector')) {
          $(this).data('iselector', new iSelector(this, config));
        }
      });
    }
  });

})(jQuery, window, document);



    /**
     * dialog 组件
     * @param {String}      title 标题                   默认为空
     * @param {String}      content 内容                 默认为空
     * @param {String}      confirmText                 确定按钮文本
     * @param {String}      cancelText                  取消按钮文本
     * @param {Boolean}     closeBtn                    是否开启关闭按钮
     * @param {Boolean}     shadow                      是否开启点击阴影关闭
     * @param {String}      type                        可选择 dialog 或 confirm，区别在于有无【取消按钮】
     * @param {String}      status                      状态类，如 success , error , warning , info
     * @param {Function}    before                      回调函数 - 弹出前
     * @param {Function}    confirm                     回调函数 - 点击确认按钮后触发
     * @param {Function}    cancel                      回调函数 - 点击取消按钮后触发
     *
     *
     * @param $.dialog({options});
     */
    $.extend({
        dialog: function(options) {
            var scrollBarWidth = IUI_UTILS.scrollBarWidth;
            var $body = $('body');
            var animateTime = document.all && !window.atob ? 0 : 200;
            var isIE = document.all && !window.atob;

            function animateEnd(el, fn) {
                if (isIE) {
                    fn();
                } else {
                    el.on(IUI_UTILS.animateEnd, fn);
                }
            }

            function transitionEnd(el, fn) {
                if (isIE) {
                    fn();
                } else {
                    el.on(IUI_UTILS.transitionEnd, fn);
                }
            }
            var defaults = {
                title: '',
                content: '',
                confirmText: '确定',
                cancelText: '取消',
                closeBtn: false,
                shadow: true,
                type: 'confirm',
                status: 'default',
                keyboard: true,
                before: function() {},
                confirm: function() {},
                cancel: function() {}
            };

            var config = $.extend({}, defaults, options);

            var container = create();
            /**
             * [deferred description]
             * @type {Object}
             * @description 在回调函数中使用
             */
            var deferred = {
                showDialog: function() {
                    show(container);
                },
                hideDialog: function() {
                    hide(container);
                },
                target: container
            };

            if (!$.dialogBackdrop) {
                $.dialogBackdrop = $('<div class="IUI-dialog-backdrop"></div>');
                $body.append($.dialogBackdrop);
            }


            if (config.shadow) {
                $body.on('touchstart.iui-dialog click.iui-dialog', '.IUI-dialog-container', function(event) {
                    event.preventDefault();
                    hide(container);
                });
            }

            $body.on('touchstart.iui-dialog click.iui-dialog', '.IUI-dialog-main', function(event) {
                event.stopPropagation();
            });

            container.on('touchstart.iui-dialog click.iui-dialog', '.IUI-dialog-confirm', function(event) {

                if (config.type === 'dialog') {

                    if (config.cancel.call(this, deferred) === false) {
                        return false;
                    }

                    hide(container);

                    return false;
                }

                if (config.confirm.call(this, deferred) === false) {
                    return false;
                }

            });

            container.on('touchstart.iui-dialog click.iui-dialog', '.IUI-dialog-cancel,.IUI-dialog-close', function(event) {
                if (config.cancel.call(this, deferred) === false) {
                    return false;
                }

                hide(container);
            });



            if (config.keyboard) {

                $(document).off('keyup.iui-dialog').on('keyup.iui-dialog', function(event) {
                    // keyCode => esc
                    if (event.keyCode === 27) {
                        container.find('.IUI-dialog-cancel,.IUI-dialog-close').trigger('click.iui-dialog');
                    }
                    // keyCode => enter
                    if (event.keyCode === 13) {
                        container.find('.IUI-dialog-confirm').trigger('click.iui-dialog');
                    }
                });
            }


            /**
             * [show description]
             * @param  {jQuery object} target 需要显示的对象
             */
            function show(target) {
                var screenH = document.documentElement.clientHeight;
                var GtIE10 = document.body.style.msTouchAction === undefined;
                target.find('.IUI-dialog-main').off(IUI_UTILS.animateEnd);
                $.dialogBackdrop.off(IUI_UTILS.transitionEnd);
                //当body高度大于可视高度，修正滚动条跳动
                //tmd,>=ie10的滚动条不需要做此修正
                if ($('body').height() > screenH & GtIE10) {
                    $body.css({
                        'border-right': scrollBarWidth + 'px transparent solid',
                        'overflow': 'hidden'
                    });
                }

                target.removeClass('hide');
                $.dialogBackdrop.attr('style', 'opacity: 1;visibility: visible;');
                target.find('.IUI-dialog-main').addClass('dialog-opening');
                animateEnd(target.find('.IUI-dialog-main'), function(event) {
                    target.find('.IUI-dialog-main').removeClass('dialog-opening');
                });
            }
            /**
             * [hide description]
             * @param  {jQuery object} target 需要隐藏的对象
             */
            function hide(target) {
                $([$body, target]).off('touchstart.iui-dialog click.iui-dialog');
                target.addClass('dialog-closing');
                $.dialogBackdrop.removeAttr('style');
                transitionEnd($.dialogBackdrop, function(event) {
                    target.remove();
                    $body.removeAttr('style');
                });
            }
            /**
             * [create description]
             * @return {string} 拼接html
             */
            function create() {
                var isConfirm = config.type === 'confirm';

                var _closeBtn = '<span class="IUI-dialog-close"></span>';

                var _confirmBtn = '<a href="javascript:;" class="IUI-dialog-confirm">' + config.confirmText + '</a>';

                var _cancelBtn = '<a href="javascript:;" class="IUI-dialog-cancel">' + config.cancelText + '</a>';

                var _header = '<div class="IUI-dialog-header">' + (config.title || '') + (config.closeBtn ? _closeBtn : '') + '</div>';

                var _content = '<div class="IUI-dialog-content">' + (config.content || '') + '</div>';

                var _footer = '<div class="IUI-dialog-footer">' + _confirmBtn + (isConfirm ? _cancelBtn : '') + '</div>';

                var _main = _header + _content + _footer;

                var $container = $('<div class="IUI-dialog-container hide"><div class="IUI-dialog-main ' + config.status + '">' + _main + '</div></div>');

                $body[0].appendChild($container[0]);

                return $container;
            }

            if (config.before.call(this, deferred) === false) {
                return false;
            }

            show(container);

        }
    });

    (function() {

        var template = '<div class="IUI-popover-container hide">' +
            '<div role="content"></div>' +
            '<div role="operate">' +
            '<a href="javascript:;" role="confirm" class="btn btn-primary">确定</a>' +
            '<a href="javascript:;" class="btn btn-default" role="cancel">取消</a>' +
            '</div>' +
            '</div>';
        var defaults = {
            handle: '[data-popover]', //绑定监听对象
            container: 'body', //全局作用域
            offsetX: 0, //全局微调 X 位置
            offsetY: 10, //全局微调 Y 位置
            compiler: null, //有无模板引擎
            data: {} //传参，当compiler存在时有效
        };

        function Popover(config) {
            this.$selector = $(config.handle);
            this.$template = $(template);
            this.$container = $(config.container);
            this.config = config;
            this.containerPos = $(config.container)[0].getBoundingClientRect();
            this.init();
        }

        Popover.prototype.init = function() {
            var self = this;


            // show
            this.$container.on('click.IUI-popover', this.config.handle, function(event) {
                var $this = $(this);
                var eventSpace = $this.data('popoverid') ? ('.popover-' + $this.data('popoverid')) : '.popover';
                $this.trigger('show' + eventSpace, [self]);
                self.show($this);
                $this.trigger('after' + eventSpace, [self]);
                event.stopPropagation();
            });

            // hide
            this.$container.on('click.IUI-popover', function(event) {
                var $this = $(this);
                $this.trigger('hide.popover', [self]);
                self.hide();
            });

            // cut bubbling
            this.$container.on('click', '.IUI-popover-container', function(event) {
                event.stopPropagation();
            });

            // cancel
            this.$container.on('click', '.IUI-popover-container [role="cancel"]', function(event) {
                var $this = $(this);
                var id = self.$template.data('caller').data('popoverid');
                var eventSpace = id ? ('.popover-' + id) : '.popover';
                self.hide();
                $this.trigger('cancel' + eventSpace, [self]);
            });

            // confirm
            this.$container.on('click', '.IUI-popover-container [role="confirm"]', function(event) {
                event.preventDefault();
                var $this = $(this);
                var id = self.$template.data('caller').data('popoverid');
                var eventSpace = id ? ('.popover-' + id) : '.popover';
                $this.trigger('confirm' + eventSpace, [self]);

            });
        };

        Popover.prototype.show = function(handle) {
            var config = this.config;
            var $handle = handle;
            var pos = handle[0].getBoundingClientRect();
            var handlePosX = pos.left;
            var handlePosY = pos.top;
            var containerPosX = this.containerPos.left;
            var containerPosY = this.containerPos.top;
            var handleWidth = $handle.outerWidth() / 2;
            var handleHeight = $handle.outerHeight();
            var $template = this.$template;
            var $content = $($handle.attr('data-popover'));
            var content = config.compiler ? config.compiler($handle.attr('data-popover').replace(/\#|\./, ''), config.data) : $content.html();
            var screenWidth = $(document).width();
            var screenHeight = $(document).height();
            var triPos = '';
            this.$container.css({
                'position': 'relative'
            });
            $template.find('[role="content"]').html(content);
            $template.appendTo(config.container).removeClass('hide');
            handlePosX -= $template.outerWidth() / 2 - handleWidth + config.offsetX;
            handlePosY -= containerPosY - handleHeight - this.$container.scrollTop() - config.offsetY;

            if (screenWidth - pos.left < $template.outerWidth() / 2) {
                handlePosX = pos.left - ($template.outerWidth() - handleWidth * 2);
                triPos = 'right';
            } else if (pos.left === 0) {
                handlePosX = pos.left;
                triPos = 'left';
            }

            $template.removeClass('left right').addClass(triPos).css({
                left: handlePosX,
                top: handlePosY
            }).data('caller', $handle).data('popover', this);
        };

        Popover.prototype.hide = function() {
            this.$container.removeAttr('style');
            this.$template.remove();
        };

        $.extend({
            popover: function(config) {
                return new Popover($.extend({}, defaults, config));
            }
        });
    }());
}(jQuery, window, document, undefined));
