/*!
 * 时间类型模块;
 */
define(function() {
    /**
     * 日期原型扩展  Format
     * 调用 new Date().format("yyyy-MM-dd");
     */
    Date.prototype.format = function(formatStr) {
        dateFormat(formatStr);
    };

    /**时间格式
     * @param  fmt
     * fmt ： "yyyy-MM-dd"
     * fmt ： "yyyy-MM-dd HH:mm:ss"
     */
    function dateFormat(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /*** 日期加减<br/>
     * modify by sw 2014-04-24
     * @param  {Date,days,year,month,type}
     * Dtae 日期
     * days 要加的天数； 可以传 -days
     * month要加的月；
     * year要加的年
     * type:0 :string,1:date
     */
    function dateChage(v) {
        var date = v.Date;
        // 参数表示在当前日期下要增加的天数
        if (date instanceof String) {
            date = date.replace(/-/g, "/");
            date = new Date(date);
        }
        var now = date || new Date();
        var days = data.days;
        var month = data.month;
        var year = data.year;
        var type = data.type;
        // + 1 代表日期加，- 1代表日期减
        if (days) {
            now.setDate((now.getDate()) + 1 * days);
        }
        if (month) {
            now.setMonth((now.getMonth()) + 1 * month);
        }
        if (year) {
            now.setYear((now.getFullYear()) + 1 * year);
        }

        var nyear = now.getFullYear();
        var nmonth = now.getMonth() + 1;
        var ndays = now.getDate();
        if (nmonth < 10) {
            nmonth = '0' + nmonth;
        }
        if (ndays < 10) {
            ndays = '0' + ndays;
        }
        if (type == 1) {
            return now;
        } else {
            return nyear + '-' + nmonth + '-' + ndays;
        }
    }

    return {
        dateFormat: dateFormat,
        dateChage: dateChage
    };
});
