define(['jquery', 'HTCons', 'HTUtil'], function($, HTCons, HTUtil) {
    /**
     * 构造函数
     */

    function podSelect(element, options) {
        this.$element = $(element);
        this.$dropdown = null;
        this.options = $.extend({}, podSelect.DEFAULTS, $.isPlainObject(options) && options);
        this.init();
    }

    /**
     * 默认值
     */
    podSelect.DEFAULTS = {
        placeholder: '请选择目的港口',
        routeCode: null, //航线
        responsive: true,
        width: '500'
    };

    podSelect.prototype = {

        constructor: podSelect,
        init: function() {
            this.render();
            this.bind();
        },
        /**
         * 渲染页面
         */
        render: function() {
            var p = this.getPosition(),
                placeholder = this.$element.attr('placeholder') || this.options.placeholder,
                dropdown = '<div  class="dropdown pod_box" style="left:10px;height:275px;top:105%;display:none;width:' + p.width + '">' +
                '<div class="pod_box_header">' + placeholder + '</div>' +
                '<ul class="pod_nav">' +
                '</ul>' +
                '<div class="dashed"></div>' +
                '<ul class="pod_nav_bottom" style="overflow:auto; height:160px;">' +
                '</ul>' +
                '</div>';

            this.$dropdown = $(dropdown).insertAfter(this.$element);

        },
        /**绑定方法*/
        bind: function() {

            var $this = this.$element,
                $dropdown = this.$dropdown,
                fn = this;

            //得到焦点
            $this.on("focus", function() {
                if (!$dropdown.is(':visible')) {
                    $dropdown.fadeIn();
                    if (!$dropdown.data('data')) {
                        loadDictData('ROUTE', function(data) {
                            fn.setDate(data);
                        });
                    }

                }
            });
            //键盘弹起
            var time ;
            $this.on("keyup", function(e) {
                var key = $this.val();
                if (e.keyCode == 38 || e.keyCode == 40) {

                } else if (e.keyCode == 13) {
                    //$this.blur(); // 此处完全引用blur事件的逻辑
                } else {
                  time = e.timeStamp;
                  setTimeout(function(){
                    if(time-e.timeStamp===0){
                      loadPortData(key, function(data) {
                          fn.setPortDate(data);
                      });
                    }
                  },700);

                }
            });
            //失去焦点
            $this.on("blur", function() {
                if ($this.val().length === 0) { //如果没有输入了关键字，并且没有焦点数据，则清空
                    fn.clear();
                }
            });
            $this.click(function(event) {
                event.stopPropagation();
            });
            $dropdown.click(function(event) {
                event.stopPropagation();
            });
            $(document).click(function() {
                if ($dropdown.is(':visible') && !$this.is(':focus')) {
                    $dropdown.hide();
                }
            });
        },

        /**
         * 获取位置
         */
        getPosition: function() {
            var p, h, w, s, pw;
            p = this.$element.position();
            s = this.$element;
            h = s.height() + "px";
            w = s.width() + "px";
            if (this.options.responsive) {
                w = this.options.width + "px";
            }

            return {
                top: p.top || 0,
                left: p.left || 0,
                height: h,
                width: w
            };
        },

        /**
         * 获取港口数据
         */
        setDate: function(data) {
            var $this = this.$element,
                $dropdown = this.$dropdown,
                $ul = $dropdown.find('ul.pod_nav'),
                fn = this;
            $ul.empty();

            if (data.length === 0) {

            } else {
                $dropdown.data('data', true);
                $.each(data, function(i, d) {
                    var $li = $('<li class="cursor"  >' + d.name + '</li>');

                    $li.data('code', d.code);
                    $li.data('id', d.id);
                    $li.data('name', d.name);
                    $li.on("click", function(e) {
                        var $me = $(this),
                            code = $me.data('code');
                        $me.addClass("active").siblings().removeClass("active");
                        //获取航线港口
                        loadPortData(code, function(data) {
                            fn.setPortDate(data);
                        });
                    });
                    if (i === 0) {
                        $li.addClass("active");
                        $li.trigger('click');
                    }
                    $dropdown.find('ul.pod_nav').append($li);
                });
            }
        },
        /**获取*/
        setPortDate: function(data) {
            var $this = this.$element,
                $dropdown = this.$dropdown,
                $ul = $dropdown.find('ul.pod_nav_bottom');
            $ul.empty();
            if (data.length === 0) {

            } else {
                $.each(data, function(i, d) {
                    var $li = $('<li class="cursor" >' + d.portNameEn + '(' + d.portNameCn + ')</li>');
                    $li.on("hover", function(e) {
                        $li.addClass("active").siblings().removeClass("active");
                    });

                    $li.on("mousedown", function(event) {
                        $this.val($li.text());
                        $this.data('code', d.portNameEn);
                        $this.data('name', d.portNameCn);
                        $this.data('nameEn', d.portNameEn);
                        $this.data('id', d.id);
                        $dropdown.hide();
                    });

                    $ul.append($li);
                });
            }
        },

        clear: function() {
            var $element = this.$element;
            $element.val('');
            $element.removeData('code');
            $element.removeData('name');
            $element.removeData('nameEn');
            $element.removeData('id');
        }
    };


    /**调用入口*/
    $.fn.podSelect = function(options) {
        return this.each(function() {
            new podSelect(this, options);
        });
    };

    /**
     * 获取港口数据
     * value:传入参数
     * callback ：回掉
     */
    function loadPortData(value, callback) {

        var qa = [{
            'key': 'portNameEn',
            'value': value,
            'op': HTCons.LI,
            'orGroup': 'name'
        }, {
            'key': 'portNameCn',
            'value': value,
            'op': HTCons.LI,
            'orGroup': 'name'
        }, {
            'key': 'portCode',
            'value': value,
            'op': HTCons.LI,
            'orGroup': 'name'
        },{
            'key': 'routeCode',
            'value': value,
            'op': HTCons.LI,
            'orGroup': 'name'
        }];
        $.ajax({
            url: HTCons.ServerFont + '?_A=GPort_Q&_mt=json',
            dataType: 'json',
            type: 'get',
            data: {
                compCode: HTCons.compCode,
                sort: "portCode",
                dir: "ASC",
                xml: HTUtil.QATJH(qa)
            },
            success: function(data) {
                var ja = data.GPort;
                if (ja) {
                    if (!jQuery.isArray(ja)) {
                        ja = [ja];
                    }
                    callback(ja);
                } else {
                    callback([]);
                }
            },
            error: function(xhr) {
                callback([]);
            }
        });
    }
    /**
     * 获取航线数据
     * calback： 回掉
     */
    function loadDictData(value, callback) {
        $.ajax({
            url: HTCons.ServerFont + '?_A=GDict_Q&_mt=json',
            dataType: 'json',
            type: 'get',
            data: {
                compCode: HTCons.compCode,
                dityCode: value
            },
            success: function(data) {
                var ja = data.GDict;
                if (ja) {
                    if (!jQuery.isArray(ja)) {
                        ja = [ja];
                    }
                    callback(ja);
                } else {
                    callback([]);
                }
            },
            error: function(xhr) {
                callback([]);
            }
        });
    }

});
