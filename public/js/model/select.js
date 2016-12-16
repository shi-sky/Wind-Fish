define(['jquery', 'HTCons', 'HTUtil','HTModel'],
 function($, HTCons, HTUtil,HTModel) {
    /**
     * 构造函数
     */
    function GetSelect(element, loadModel,options) {
        this.$element = $(element);
        this.$dropdown = null;
        this.options = $.extend({}, GetSelect.DEFAULTS, $.isPlainObject(options) && options);
        this.init();
        if (typeof callback == 'function') {
          this.loadData = loadModel;
        }else{
          this.loadData = HTModel[loadModel];
        }
    }

    GetSelect.prototype = {
        constructor: GetSelect,
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
                dropdown = '<div class="dropdown" style="left:-10px;top:105%;display:none;width:172px">' +
                '<div class="dropdown-header">' + placeholder + '</div>' +
                '<ul class="dropdown-content">' +
                '</ul>' +
                '</div>';

            this.$dropdown = $(dropdown).insertAfter(this.$element);
        },

        bind: function() {
            var $this = this.$element,
                $dropdown = this.$dropdown,
                loadData = this.loadData,
                fn = this;

            if (!$this.data('code')) {
                $this.val('');
            }
            //得到焦点
            $this.on("focus", function() {
                $dropdown.fadeIn();
                var key = $this.val();
                fn.loadData(key, function(data) {
                    fn.setDate(data);
                });
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
                    fn.loadData(key, function(data) {
                        fn.setDate(data);
                    });
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
                $dropdown = this.$dropdown,
                options =  this.options
                ;
            $dropdown.find('ul').empty();
            if (data.length === 0) {
                //$dropdown.find('.pol_box_header').text('没有找到相关港口！');
            } else {
                $.each(data, function(i, d) {
                    var $li = $('<li class="cursor"  >' + d[options.name] +'</li>');
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
                    $this.data('code', obj[options.code]);
                    $this.data('name', obj[options.name]);
                    $this.data('nameEn', obj[options.nameEn]);
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
    GetSelect.DEFAULTS = {
        placeholder: '请选择',
        responsive: false,
      //  num:8,
        code:"code",
        name:"name",
        nameEn:"nameEn"

    };

    $.fn.select = function(loadModel,options) {
        return this.each(function() {
            new GetSelect(this, loadModel,options);
        });
    };



});
