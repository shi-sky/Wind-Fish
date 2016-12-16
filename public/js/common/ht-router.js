
define(['jquery'],function($){
	function Router() {
        var self = this;

        self.hashList = {}; /* 路由表 */
        self.index = null;
        self.key = '/';

        window.onhashchange = function() {
            self.reload();
        };
    }

   	/**
     * 添加路由,如果路由已经存在则会覆盖
     * @param path: 地址
     * @param callback: 回调函数，调用回调函数的时候同时也会传入相应参数
     */
    Router.prototype.route = function(path, callback) {
        var self = this;

        self.hashList[path] = callback;
    };

    /**
     * 删除路由
     * @param path: 地址
     */
    Router.prototype.remove = function(path) {
        var self = this;

        delete self.hashList[path];
    };

    /**
     * 设置主页地址
     * @param index: 主页地址
     */
    Router.prototype.setIndex = function(index) {
        var self = this;

        self.index = index;
    };

     /**
     * 跳转到指定地址
     * @param path: 地址值
     */
    Router.prototype.go = function(path) {
        var self = this;

        window.location.hash = '#' + self.key + path;
    };
 	 /**
     * 开始路由，实际上只是为了当直接访问路由路由地址的时候能够及时调用回调
     */
    Router.prototype.start = function() {
        var self = this;

        self.reload();
    };
	 /**
     * 重载页面
     */
    Router.prototype.reload = function() {
        var self = this;
        var hash = window.location.hash.replace('#' + self.key, '');
        var path = hash.split('/')[0];

        var cb = getCb(path, self.hashList);
        if(cb !== false) {
					if(cb.active!==false){
	    	    var attr =cb.active||"#/"+hash;
	    	    $(".menu_body a").removeClass('mem_nav_active');
	    	    var $a = $("a[href='"+attr+"']:first");
	        	if(cb.active){
	        		$a = $(cb.active);
	        	}
	        	$a.closest('.menu_body').show().siblings(".menu_body").hide();
	    			$a.closest('.menu_body').prev('.menu_head').addClass("current").siblings().removeClass("current");
	    			$a.addClass('mem_nav_active');
					}

            var arr = hash.split('/');
             	arr.shift();
    		load(cb,self,arr);
        } else {
            self.index && self.go(self.index);
        }
    };
     /**
     * 开始路由，实际上只是为了当直接访问路由路由地址的时候能够及时调用回调
     */
    Router.prototype.start = function() {
        var self = this;

        self.reload();
    };
    /**
     * 获取callback
     * @return false or callback
     */
    function getCb(path, hashList) {
        for(var key in hashList) {
            if(key == path) {
                return hashList[key];
            }
        }
        return false;
    }
    /**
     *
     */
   	function load(cb,self,arr){
   		var template = cb.template;
   		var controller =  cb.controller;
        if(template.indexOf(".html")==-1){
           template = template+".html";
        }
        var templateUrl = "./"+ template;
        $("#template").load(templateUrl,function(){
        	if(typeof controller == "function"){
        		 controller.apply(self, arr);
        	}
        });
    }

    return  new Router();
});
