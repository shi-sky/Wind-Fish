define(['HTCons', 'jquery', 'layer', 'laypage', 'HTSession', 'HTFun', 'HTUtil'],
    function(HTCons, $, layer, laypage, HTSession, HTFun, HTUtil) {
        //导航
        function openMenu(n) {
            if (n == 1) { // 运价查询
                location.href = HTCons.ServerUrl + "freight/freight.html";
            } else if (n == 2) { // 货物跟踪
                location.href = HTCons.ServerUrl + "mem/tracking.html";
            } else if (n == 3) { // 资讯信息
                location.href = HTCons.ServerUrl + "content/index.html";
            } else if (n == 4) { // 关于我们
                location.href = HTCons.ServerUrl + "user/about.html";
            }  else if (n == 5) { // 我的业务
                location.href = HTCons.ServerUrl + "mem/main.html";
            } else if (n == 6) { // 积分商城
                location.href = HTCons.ServerUrl + "mem/shop.html";
            } else if (n == 9) { // 帮助中心

            }  else { // 首页
                location.href = HTCons.ServerUrl + "index.html";
            }
        }
        //登陆
        function toLogin() {
            location.href = HTCons.ServerUrl + "user/login.html";
        }

        function toRegist() {
            location.href = HTCons.ServerUrl + "user/regist.html";
        }
        //退出登陆
        function logout() {
            HTFun.doAjax({
                _A: "WUser_LOGOUT",
                _mt: "json"
            }, function(json, status) {
                HTFun.clearSession();
                location.replace(HTCons.ServerUrl + "index.html");
            });
        }

        //链接跳转
        window.ReqCtrl  = {
            openMenu: openMenu,
            logout: logout,
            toLogin: toLogin,
            toRegist: toRegist
        };

        //html页面初始化加载   init.coloadConfig
        function loadConfig() {
        	var head_nav_menu = $("#head_nav_menu").val();
      	  	$("#" + head_nav_menu).addClass("active");
            //判断是否登录状态
            if (HTFun.isLogined()) {
                var member_name = HTSession.loadSession("USER_LOGIN_NAME");
                $("#member_name").html(member_name);
                $("#is_login").show();
                $("#myBusiness").show();
                $("#not_login").remove();
            } else {
                $("#not_login").show();
                $("#is_login").remove();
                $("#myBusiness").remove();
            }
        }

        return {
            loadConfig: loadConfig
        };
    });
