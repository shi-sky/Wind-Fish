// =============Session Manager===========
define(function() {
    var Cookies = {};
    Cookies.set = function(name, value) {
        var argv = arguments;
        var argc = arguments.length;
        var expires = (argc > 2) ? argv[2] : null;
        var path = (argc > 3) ? argv[3] : '/';
        var domain = (argc > 4) ? argv[4] : null;
        var secure = (argc > 5) ? argv[5] : false;
        document.cookie = name + "=" + escape(value) +
            ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
            ((path == null) ? "" : ("; path=" + path)) +
            ((domain == null) ? "" : ("; domain=" + domain)) +
            ((secure == true) ? "; secure" : "");
    };
    Cookies.get = function(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        var j = 0;
        while (i < clen) {
            j = i + alen;
            if (document.cookie.substring(i, j) == arg)
                return Cookies.getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0)
                break;
        }
        return null;
    };

    Cookies.clear = function(name) {
        if (Cookies.get(name)) {
            document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
        }
    };

    Cookies.getCookieVal = function(offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    };

    var isIE = !!document.all;
    if (isIE)
        document.documentElement.addBehavior("#default#userdata");

    function saveUserData(key, value) {
        var ex;
        if (isIE) {
            with(document.documentElement)
            try {
                load(key);
                setAttribute("value", value);
                save(key);
                return
                getAttribute("value");
            } catch (ex) {
                alert(ex.message);
            }
        } else if (window.sessionStorage) {
            try {
                sessionStorage.setItem(key, value);
            } catch (ex) {
                alert(ex);
            }
        } else {
            alert("当前浏览器不支持userdata或者sessionStorage特性");
        }
    };

    function loadUserData(key) {
        var ex;
        if (isIE) {
            with(document.documentElement)
            try {
                load(key);
                return getAttribute("value");
            } catch (ex) {
                alert(ex.message);
                return null;
            }
        } else if (window.sessionStorage) {
            try {
                return sessionStorage.getItem(key);
            } catch (ex) {
                alert(ex);
            }
        }
    };

    function deleteUserData(key) {
        var ex;
        if (isIE) {
            with(document.documentElement)
            try {
                load(key);
                expires = new Date(315532799000).toUTCString();
                save(key);
            } catch (ex) {
                alert(ex.message);
            }
        } else if (window.sessionStorage) {
            try {
                sessionStorage.removeItem(key);
            } catch (ex) {
                alert(ex);
            }
        }
    };

    var loadSession = function(k) {
        var p = '';
        if (window.sessionStorage)
            p = window.sessionStorage.getItem(k);
        else if (document.all)
            p = loadUserData(k);
        else
            p = Cookies.get(k);

        return p;
    };
    var saveSession = function(k, v) {
        if (window.sessionStorage)
            window.sessionStorage.setItem(k, v);
        else if (document.all)
            saveUserData(k, v);
        else
            Cookies.set(k, v);
    };

    var clearSession = function(k) {
        if (window.sessionStorage)
            window.sessionStorage.removeItem(k);
        else if (document.all)
            deleteUserData(k);
        else
            Cookies.clear(k);
    };

    return {
        loadSession: loadSession,
        saveSession: saveSession,
        clearSession: clearSession
    }
})
