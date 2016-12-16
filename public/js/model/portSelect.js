define(['jquery', 'HTCons', 'HTUtil'], function($, HTCons, HTUtil) {
    /**
     * 构造函数
     */
    function PortSelect(element, options) {
        this.$element = $(element).attr('edit',true);
        this.$dropdown = null;
        this.options = $.extend({}, PortSelect.DEFAULTS, $.isPlainObject(options) && options);
        this.init();
    }

    PortSelect.prototype = {
        constructor: PortSelect,
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
                dropdown = '<div class="dropdown pol_box" style="left:0px;top:105%;display:none;width:' + p.width + '">' +
                '<div class="pol_box_header">' + placeholder + '</div>' +
                '<ul style="height: 240px; overflow: auto;">' +
                '</ul>' +
                '</div>';

            this.$dropdown = $(dropdown).insertAfter(this.$element);
        },

        bind: function() {
            var $this = this.$element,
                $dropdown = this.$dropdown,
                op = this.options,
                fn = this;
            if (!$this.data('code')) {
                $this.val('');
            }
            //得到焦点
            $this.on("focus", function() {
                $dropdown.fadeIn();
                var key = $this.val();
                loadData(key, function(data) {
                    fn.setDate(data);
                },op);
            });

            //失去焦点
            $this.on("blur", function() {
                if ($dropdown.is(":visible")) {
                    $dropdown.hide();
                    if ($dropdown.find('li').index() == -1) {
                        fn.clear();
                    } else {
                        //console.log($dropdown.find('active').index())
                        if ($dropdown.find('active').index() != -1) { //如果某个数据获得焦点，则直接选择这个数据
                            $dropdown.find('active').trigger("mousedown");
                        } else if ($this.val().length === 0) { //如果没有输入了关键字，并且没有焦点数据，则清空
                            fn.clear();
                        } else {
                            $dropdown.find('li').eq(0).trigger("mousedown");
                        }
                    }
                }
            });
            //键盘按下
            $this.on("keydown", function(e) {
                if (e.keyCode == 38) {
                    fn.cursorUp();
                } else if (e.keyCode == 40) {
                    fn.cursorDown();
                }
            });

            //键盘弹起
            $this.on("keyup", function(e) {
                var key = $this.val();
                if (e.keyCode == 38 || e.keyCode == 40) {

                } else if (e.keyCode == 13) {
                    $this.blur(); // 此处完全引用blur事件的逻辑
                } else {
                    loadData(key, function(data) {
                        fn.setDate(data);
                    },op);
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
                w = '100%';
            }

            return {
                top: p.top || 0,
                left: p.left || 0,
                height: h,
                width: w
            };
        },

        setDate: function(data) {
            var $this = this.$element,
                $dropdown = this.$dropdown;
            $dropdown.find('ul').empty();
            if (data.length === 0) {
                //$dropdown.find('.pol_box_header').text('没有找到相关港口！');
            } else {
                $.each(data, function(i, d) {
                    var $li = $('<li class="cursor"  >' + d.portNameEn + '(' + d.portNameCn + ')</li>');
                    $li.data('obj', d);
                    $dropdown.find('ul').append($li);
                });
            }

            // 为便于键盘操作，使用JS实现焦点样式
            $dropdown.find('li').each(function(i, e) {
                $e = $(e);
                $e.hover(
                    function() {
                        $(this).addClass("active").siblings().removeClass("active");
                    },
                    function() {
                        $(this).removeClass("active");
                    });
                $e.on("mousedown", function(event) {
                    var obj = $(this).data('obj');
                    $this.val($(this).text());
                    $this.data('code', obj.portCode);
                    $this.data('name', obj.portNameCn);
                    $this.data('nameEn', obj.portNameEn);
                    $this.data('id', obj.id);

                    $dropdown.hide();
                });
            });
        },
        /**
         * 向下滚动
         */
        cursorDown: function() {
            var $this = this.$element,
                $dropdown = this.$dropdown,
                $active = $dropdown.find('.active');
            if ($active.size() > 0) {
                $active.removeClass('active');
                if ($active.next().size() > 0) {
                    $active.next().addClass('active');
                } else {
                    $dropdown.find('li').eq(0).addClass('active');
                }
            } else {
                $dropdown.find('li').eq(0).addClass('active');
            }
        },
        /**
         * 向上滚动
         */
        cursorUp: function() {
            var $this = this.$element,
                $dropdown = this.$dropdown,
                $active = $dropdown.find('.active');
            if ($active.size() > 0) {
                if ($active.prev().size() > 0) {
                    $active.removeClass('active');
                    $active.prev().addClass('active');
                } else {
                    //$dropdown.find('li').eq(0).addClass('active');
                }
            } else {
                $dropdown.find('li').eq(0).addClass('active');
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

    /**
     * 默认值
     */
    PortSelect.DEFAULTS = {
        placeholder: '请选择起始港口',
        type:"POL",
        routeCode: null, //航线
        responsive: true,
        num:"20"
    };

    $.fn.portSelect = function(options) {
        return this.each(function() {
            new PortSelect(this, options);
        });
    };

    /**
     * 获取港口数据
     * value:需查询的值
     * calback： 回掉
     */
    function loadData(value, callback,op) {
        value = $.trim(value.toUpperCase().replace(/(\(.*\)|\(.*)/g, ""));
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
        }];
        var obj = {};
        if(op.type=="POL"){
            obj = {
               'key': 'counCode',
               'value': "CN",
               'op': HTCons.EQ
            };
            qa.push(obj);
        }else if(op.type=="POD"){
            obj = {
              'key': 'counCode',
              'value': "CN",
              'op': HTCons.NE
            };
            qa.push(obj);
        }
        $.ajax({
            url: HTCons.ServerFont + '?_A=GPort_Q&_mt=json&compCode=JMWL',
            dataType: 'json',
            type: 'POST',
            data: {
              	limit:op.num,
                xml: HTUtil.QATJH(qa),
                sort: "portCode",
                dir: "asc"
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

});
