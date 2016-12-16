/**前后台数据传递通用方法
 *
 */
define(['jquery'],
    function($) {
        Array.prototype.add = function(str){
           if(str&&this.indexOf(str)==-1){
             this.push(str);
           }
        };
        /**判断是否为空
         * unll、undefined和''都认为是空
         * @param {} v
         * @param {} allowBlank
         * @return {}
         */
        function isEmpty(v, allowBlank) {
            return v === "undefined" || v === null || v === "null" || v === undefined || (!allowBlank ? v === '' : false);
        }

        /**判断是否不为空
         * 与isEmpty取值相反，unll、undefined和''都认为是空
         * @param {} v
         * @param {} allowBlank
         * @return {}
         */
        function isNotEmpty(v, allowBlank) {
            return !isEmpty(v, allowBlank);
        }

        /**把"\n"转换为"<br/>"
         * @param {} _str //字符串
         * @return {}
         */
        function replaceN(_str) {
            var re = new RegExp("\n", "g");
            var str = "" + _str;
            str = str.replace(re, "\\n");
            return str;
        }

        /**UUID
         * @param {} len
         * @param {} radix
         * @return {}
         */
        function UUID(len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [];
            radix = radix || chars.length;

            if (len) {
                for (var i = 0; i < len; i++)
                    uuid[i] = chars[0 | Math.random() * radix];
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                for (var i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        }

        /**xml字符串转化成xml对象
         * @param {} xmlStr  xml字符串
         * @return {} xml对象
         */
        function parseXml(xmlStr) {
            var doc;
            if (window.DOMParser) {
                doc = (new DOMParser()).parseFromString(xmlStr, "text/xml");
            } else {
                doc = new ActiveXObject("Microsoft.XMLDOM");
                doc.loadXML(xmlStr);
            }
            return doc;
        }

        /**在json对象字符串外面封装HtRequest标签
         * x:json对象字符串
         */
        function HTJ(json) {
            return "{\"HtRequest\":" + json + "}";
        }

        /**查询对象转换为字符串
         * @param {用于查询的json对象} jr
         * @return {字符串}
         */
        function QTJ(jr) {
            var json = "{" + "\"key\":\"" + jr.key + "\"," + "\"value\":\"" + jr.value +
                "\"," + "\"op\":" + jr.op;
            if (jr.orGroup) {
                json += ",\"orGroup\":" + "\"" + jr.orGroup + "\"";
            }
            json += "}";
            return json;
        }

        /**查询对象数组转换为字符串
         * @param {} a
         * @return {}
         */
        function QATJ(a) {
            alength = a.length;
            jsonA = "";
            if (alength > 0) {
                for (var i = 0; i < alength; i++) {
                    if (i === 0) {
                        jsonA += QTJ(a[i]);
                    } else {
                        jsonA += "," + QTJ(a[i]);
                    }
                }
                jsonA = "{\"HtQuery\":[" + jsonA + "]}";
            }
            return jsonA;
        }

        /**查询对象转换为外面封装HtRequest标签的字符串
         * @param {用于查询的json对象数组} a
         * @return {外面封装HtRequest标签的字符串}
         */
        function QATJH(a) {
            if (a) {
                return (a.length > 0) ? HTJ(QATJ(a)) : "";
            } else {
                return "";
            }
        }

        /**记录数组转换为json格式字符串
         * @param {记录数组} a
         * @param {记录类型} rt
         * @param {} withMore 如果用于多个表记录同时保存时withMore不为空
         * @return {}
         */
        function RATJ(a, rt, withMore) {
            jsonA = "";
            if (a.length > 0) {
                for (var i = 0; i < a.length; i++) {
                    if ((a[i].rowAction === '') || (a[i].rowAction === undefined))
                        a[i].rowAction = 'M';
                    if (i === 0) {
                        jsonA += RTJS(a[i]);
                    } else {
                        jsonA += "," + RTJS(a[i]);
                    }
                }
                if (withMore) {
                    jsonA = "\"" + rt + "\":[" + jsonA + "]";
                } else {
                    jsonA = "{\"" + rt + "\":[" + jsonA + "]}";
                }
            }
            return jsonA;
        }

        /**单个数据记录转换成json字符串
         */
        function RTJS(Obj) {
            jsonA = "";

            for (var i in Obj) {
                var ok = true;
                ok = isNotEmpty(Obj[i]) && isNotEmpty(i);
                if (i == 'version') {
                    ok = true;
                }
                if (ok) {
                    var value =  $.trim(Obj[i].toString());
                        value = value.replace(/<br>/g, "\\n")
                                     .replace(/\\/g, "\\\\")
                                     .replace(/\n/g, "\\n")
                                     .replace(/\"/g, '\\"');
                    if (jsonA.length === 0) {
                        if (i == 'id') {
                            jsonA = jsonA + "\"" + i + "\":" + value;
                        } else {
                            jsonA = jsonA + "\"" + i + "\":\"" + value + "\"";
                        }

                    } else {
                        if (i == 'id') {
                            jsonA = jsonA + ",\"" + i + "\":" + value;
                        } else {
                            jsonA = jsonA + ",\"" + i + "\":\"" + value + "\"";
                        }
                    }
                }
            }
            if (jsonA.length > 0) {
                jsonA = "{" + jsonA + "}";
            }
            return jsonA;
        }

        /**一条记录转换成json格式字符串
         * @param {记录} r
         * @param {记录类型} rt
         * @param {} withMore 如果用于多个表记录同时保存时withMore不为空
         * @return {}
         */
        function RTJ(r, rt, withMore) {
            if ((r.rowAction === '') || (r.rowAction === undefined)) {
                r.rowAction = 'M';
            }
            jsonA = "";
            if (r) {
                if (withMore) {
                    jsonA = "\"" + rt + "\":" + RTJS(r);
                } else {
                    jsonA = "{\"" + rt + "\":" + RTJS(r) + "}";
                }
            }
            return jsonA;
        }


        /**生成query记录
         *
         * @param {} key
         * @param {} value
         * @param {} op
         * @param {} orGroup
         * @return {}
         */
        function geneHtQuery(key, value, op, orGroup) {
            var arr = ['key', 'value', 'op', 'orGroup'];
            var r = new Object();
            for (var i = 0, len = arr.length; i < len; i++) {
                r[arr[i]] = "";
            }
            r["key"] = key;
            r["value"] = value;
            r["op"] = op;
            if (orGroup) {
                r["orGroup"] = orGroup;
            }
            return r;
        }

        /**得到指定位数的小数数值
         *
         * @param {} number
         * @param {} precision 小数位数
         * @return {}
         */
        function toFixed(number, precision) {
            if (isEmpty(precision)) {
                precision = 2;
            }
            number = Number(number);
            number = number.toFixed(precision);
            return number;
        }

        /**将数值千分位格式化  2,345.34
         *
         * @param {} num
         * @return {String}
         */
        function toThousands(num) {
            if ($.trim((num + "")) === "") {
                return "";
            }
            if (isNaN(num)) {
                return "";
            }
            num = num + "";
            if (/^.*\..*$/.test(num)) {
                var pointIndex = num.lastIndexOf(".");
                var intPart = num.substring(0, pointIndex);
                var pointPart = num.substring(pointIndex + 1, num.length);
                intPart = intPart + "";
                var re = /(-?\d+)(\d{3})/;
                while (re.test(intPart)) {
                    intPart = intPart.replace(re, "$1,$2");
                }
                num = intPart + "." + pointPart;
            } else {
                num = num + "";
                var re = /(-?\d+)(\d{3})/;
                while (re.test(num)) {
                    num = num.replace(re, "$1,$2");
                }
            }
            return num;
        }

        /**阿拉伯数字转英文大写
         *
         * @param {} input
         * @return {String}
         */
        function N2EW(input) {
            if (!input) return '';
            input = parseInt(input).toString();
            var inputlength = input.length;
            var d1 = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE '];
            var d2 = ['', '', 'TWENTY ', 'THIRTY ', 'FORTY ', 'FIFTY ', 'SIXTY ', 'SEVENTY ', 'EIGHTY ', 'NINETY '];
            var d3 = ['TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
            var x = 0;
            var teen1 = "";
            teen2 = "";
            teen3 = "";
            numName = "";
            invalidNum = "";
            var a1 = "";
            a2 = "";
            a3 = "";
            a4 = "";
            a5 = "";
            digit = new Array(inputlength);
            for (var i = 0; i < inputlength; i++) {
                digit[inputlength - i] = input.charAt(i);
            }
            store = new Array(9);
            for (var i = 0; i < inputlength; i++) {
                x = inputlength - i;
                switch (x) {
                    case x = 9:
                        store[x] = d1[digit[x]];
                        break;
                    case x = 8:
                        if (digit[x] == "1") {
                            teen3 = "yes";
                        } else {
                            teen3 = "";
                        }
                        store[x] = d2[digit[x]];
                        break;
                    case x = 7:
                        if (teen3 == "yes") {
                            teen3 = "";
                            store[x] = d3[digit[x]];
                        } else {
                            store[x] = d1[digit[x]];
                        }
                        break;
                    case x = 6:
                        store[x] = d1[digit[x]];
                        break;
                    case x = 5:
                        if (digit[x] == "1") {
                            teen2 = "yes";
                        } else {
                            teen2 = "";
                        }
                        store[x] = d2[digit[x]];
                        break;
                    case x = 4:
                        if (teen2 == "yes") {
                            teen2 = "";
                            store[x] = d3[digit[x]];
                        } else {
                            store[x] = d1[digit[x]];
                        }
                        break;
                    case x = 3:
                        store[x] = d1[digit[x]];
                        break;
                    case x = 2:
                        if (digit[x] == "1") {
                            teen1 = "yes";
                        } else {
                            teen1 = "";
                        }
                        store[x] = d2[digit[x]];
                        break;
                    case x = 1:
                        if (teen1 == "yes") {
                            teen1 = "";
                            store[x] = d3[digit[x]];
                        } else {
                            store[x] = d1[digit[x]];
                        }
                        break;
                }
                switch (inputlength) {
                    case 1:
                        store[2] = "";
                    case 2:
                        store[3] = "";
                    case 3:
                        store[4] = "";
                    case 4:
                        store[5] = "";
                    case 5:
                        store[6] = "";
                    case 6:
                        store[7] = "";
                    case 7:
                        store[8] = "";
                    case 8:
                        store[9] = "";
                }
                if (store[9] !== "") {
                    a1 = "HUNDRED ";
                } else {
                    a1 = "";
                }
                if ((store[9] !== "") || (store[8] !== "") || (store[7] !== "")) {
                    a2 = "MILLION ";
                } else {
                    a2 = "";
                }
                if (store[6] !== "") {
                    a3 = "HUNDRED ";
                } else {
                    a3 = "";
                }
                if ((store[6] !== "") || (store[5] !== "") || (store[4] !== "")) {
                    a4 = "THOUSAND ";
                } else {
                    a4 = "";
                }
                if (store[3] !== "") {
                    if (store[2] !== "" || store[1] !== "") a5 = "HUNDRED AND ";
                    else a5 = "HUNDRED ";
                } else {
                    a5 = "";
                }
            }
            numName = store[9] + a1 + store[8] + store[7] + a2 + store[6] + a3 + store[5] + store[4] + a4 + store[3] + a5 + store[2] + store[1];
            store[1] = "";
            store[2] = "";
            store[3] = "";
            store[4] = "";
            store[5] = "";
            store[6] = "";
            store[7] = "";
            store[8] = "";
            store[9] = "";
            return numName;
        }

        /**url 参数获取
         * 使用方法： $.getUrlVar(nameStr);
         * */
        $.extend({
            //url参数字符串
            parseParam: function(param, key) {
                var paramStr = "";
                if (param instanceof String || param instanceof Number || param instanceof Boolean) {
                    paramStr += "&" + key + "=" + encodeURIComponent(param);
                } else {
                    $.each(param, function(i) {
                        var k = key === null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
                        paramStr += '&' + parseParam(this, k);
                    });
                }
                return paramStr.substr(1);
            },
            getUrl: function() {
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                return hashes;
            },
            getUrlVars: function() {
                var vars = {},
                    hash;
                var hashes = $.getUrl();
                for (var i = 0; i < hashes.length; i++) {

                    hash = hashes[i].split('=');
                    vars[hash[0]] = decodeURIComponent(hash[1]);
                }
                return vars;
            },
            //
            getUrlVar: function(name) {
                return $.getUrlVars()[name];
            },
            //marks 唛头显示问题
            marks: function() {
                this.on('focus', function() {
                    if ($(this).val() == "N/M") {
                        $(this).val("");
                    }
                }).on('blur', function() {
                    if (isEmpty($(this).val())) {
                        $(this).val("N/M");
                    }
                });
            }
        });
        return {
            isEmpty: isEmpty,
            isNotEmpty: isNotEmpty,
            replaceN: replaceN,
            UUID: UUID,
            parseXml: parseXml,
            HTJ: HTJ,
            QTJ: QTJ,
            QATJ: QATJ,
            QATJH: QATJH,
            RATJ: RATJ,
            RTJS: RTJS,
            RTJ: RTJ,
            geneHtQuery: geneHtQuery,
            toFixed: toFixed,
            toThousands: toThousands,
            N2EW: N2EW
        };
    });
