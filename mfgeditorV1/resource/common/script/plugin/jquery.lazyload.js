/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.8.4
 *
 */
(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0, //不明参数...
            error_limit     : 3, //每张图片请求失败的最大次数，当为0的时候，则不重复请求
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            fail            : null
        };

        function update() {
            var counter = 0;
      
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit; 
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed; 
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function(event) {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);
            var errorCounter = 0;

            self.loaded = false;

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!self.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $self.trigger("loader");
                }
            });

            /* 命名为loader避免load默认jQuery事件冲突 */
            $self.bind("loader", function() {
                $self.attr('status', 'loading');
                /*if ($self.siblings('.loaderInfo').length == 0) {
                    $self.after('<div class="loaderInfo" style="font-size:12px;"></div>');
                };*/
                /*$self.siblings('.loaderInfo').append('<p>正在加载这张图片</p>');
                window.console && console.log('正在加载图片:' + $self.data(settings.data_attribute));*/
                if (!self.loaded) {
                    $("<img />")
                        .bind("load", newImgHandler)
                        .bind("error", newImgHandler)
                        .bind("abort", newImgHandler)
                        .attr("src", $self.data(settings.data_attribute));
                }

                function newImgHandler(e) {
                    /*$self.siblings('.loaderInfo').append('<p>当前加载事件:' + e.type + '</p>');
                    window.console && console.log('当前加载事件:' + e.type);*/
                    if (e.type == 'abort' || e.type == 'error'){
                        $self.attr('status', 'failed');
                        // 增加失败回调
                        if (settings.fail) {
                            var elements_left = elements.length;
                            settings.fail.call(self, elements_left, settings);
                        }

                        if (++errorCounter <= settings.error_limit) {
                            /*$self.siblings('.loaderInfo').append('<p>加载失败次数:' + errorCounter + '</p>');
                            window.console && console.log('加载失败次数:' + errorCounter);*/
                            $self.trigger("loader");
                        }else{
                            /*$self.siblings('.loaderInfo').append('<p>尝试连接超过最大次数，放弃加载...</p>');
                            window.console && console.log('尝试连接超过最大次数，放弃加载:' + $self.data(settings.data_attribute));*/
                        }
                       
                        return;
                    }else if (e.type == 'load'){
                        var target = e.currentTarget || e.target || e.srcElement;
                        var imageSize = {
                            width: target.width,
                            height: target.height
                        };

                        self.loaded = true;
                        $self.attr('status', 'completed');

                        $self
                            .css('visibility','hidden')
                            .attr("src", $self.data(settings.data_attribute));
                            //.css('visibility','visible');
                            //[settings.effect](settings.effect_speed); //要想fadeIn，必须要hide，而hide，获取不到图片高度。

                        /* Remove image from array so it is not looped next time. */
                        var temp = $.grep(elements, function(element) {
                            return !element.loaded;
                        });
                        elements = $(temp);

                        if (settings.load) {
                            var elements_left = elements.length;
                            setTimeout(function(){ //防止出现图片高宽用回原来src的高宽
                                settings.load.call(self, elements_left, imageSize, settings);
                                $self.css('visibility','visible');
                            },10);
                        }
                    }
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function(event) {
            update();
        });

        /* Force initial check if images should appear. */
        $(window).load(function() {
            update();
        });
              
        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }
        
        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[':'], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);