(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.option = function() {
        var self = this;
        $(self).each(function(){
             var t = this;
            var $t = $(this);
            var w = $t.width();

            if($t.data("optioned") || !w){
                return self;
            }

            $t.css({"visibility":"hidden"});
            var $opts = $t.find(".opt"),
                perIndex = 8,
                GAP = 30,
                EXLEN = 34;

            function max(arr){
                var m = arr[0];
                for(var i = 1; i < arr.length; i++){
                    if(arr[i] > m){
                        m = arr[i];
                    }
                }
                return m;
            }

            function getWidth(cont){
                if(!$("#getWidth").length){
                    $('body').append('<div id="getWidth" class="clearfix pa" style="visibility:hidden;left:-1000px;"><div id="widthCont" class="l"></div><div>');
                }
                var $panel = $("#widthCont");
                $panel.html(cont);
                return $panel.width();
            }

            function commonOption(){
                var sW =  Math.floor(1/perIndex*w);
                $opts.each(function(){
                    var ow = getWidth($(this).clone()) + GAP + EXLEN;
                    while(ow > sW && perIndex != 1){
                        perIndex /= 2;
                        sW = Math.floor(1/perIndex * w);
                    }
                });
                $opts.width(sW - GAP + 8).css({"float":"left","margin-right":GAP - 10 + "px","position":'relative'});
                var totalNum = $opts.length;
                for(var i = 0; i < totalNum; i = i + perIndex){
                    var $newWrp;
                    if(perIndex < totalNum){
                        $newWrp = $('<div class="l clearfix"></div>');
                        $t.append($newWrp);
                    }else{
                        $newWrp = $t;
                    }
                    var tops = [],topObj = {};
                    for(var j = i; j < i + perIndex && j < totalNum; j ++){
                        var $letter = $opts.eq(j).find("span:first");
                        if($letter.length){
                            tops.push($letter.offset().top);
                            topObj[j] = [$opts.eq(j),$letter.offset().top];
                        }
                        if(perIndex < totalNum){
                            $opts.eq(j).appendTo($newWrp);
                        }
                        $opts.eq(j).css("zoom",1); //防止IE浏览器中公式部分内容重叠
                    }
                    var maxTop = max(tops);
                    $.each(topObj,function(key,val){
                        if(val[1] != maxTop){
                            val[0].css("margin-top",(maxTop - val[1])+'px');
                        }
                    });
                }
            }

            function imgOption(){
                var $img = $t.find("img");
                var num = $img.length;
                $img.each(function(){
                    var src = $(this).attr("src");
                    var $img = $(this);
                    $('<img/>')
                        .bind("load",function(){
                            if($img.width() > 1/2*w-GAP-30){
                                $img.width(1/2*w-GAP-30);
                            }
                            if(!(--num)){
                                commonOption();
                            }
                        })
                        .attr('src',src);
                });
            }

            if($t.find("img").length){
                imgOption();
            }else{
                commonOption();
            }

            $t.css("visibility","visible").data("optioned",true);
        });
       
        return this;
    };

})(jQuery, window, document);
