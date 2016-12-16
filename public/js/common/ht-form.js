/*!
 * 表单数据收集
 */
define(['jquery', 'HTCons', 'HTUtil','HTRecord'], function($, HTCons, HTUtil,HTRecord) {
    /**获得一个js对象
     * 用数组arr中的记录配置属性
     * @param {用于配置属性的数组} arr
     * @return {js对象}
     */
    function createRecord(arr, n) {
        var f = {};
        if(typeof arr == "string"){
            arr = HTRecord[arr];
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            f[arr[i]] = "";
        }

        if (n == "M") {
            f["rowAction"] = "M";
            f["removed"] = "0";
        } else if (n == "R") {
            f["rowAction"] = "R";
            f["removed"] = "1";
        } else {
            f["rowAction"] = "N";
            f["removed"] = "0";
            f["uuid"] = HTUtil.UUID(32);
            f["compCode"] = HTCons.compCode;
        }

        return f;
    }

    /**修改现有record记录
     * @param {} arr 数组
     * @param {} obj 对象
     */
    function modifyRecord(arr, obj) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var flag = true;
            for (var key in obj) {
                if (key != 'createBy' && key != 'createTime' && key != 'modifyBy' &&
                    key != 'modifyTime' && key != 'uuid') {
                    if (arr[i] == key) {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag) {
                obj[arr[i]] = null;
            }
        }
        obj['rowAction'] = 'M';
        return obj;
    }

    /**清除record记录
     */
    function clearRecord(r) {
        for (var i in r) {
            r[i] = "";
        }
    }

    /**根据record的name清除html记录
     * r：record
     * _id:位置Id
     */
    function clearHtml(r, _id) {
        if (_id) {
            for (var i in r) {
                $("#" + _id + " " + "[name='" + i + "']").val('');
            }
        } else {
            for (var i in r) {
                $("[name='" + i + "']").val('');
            }
        }
    }

    /**将记录对象rb中的数据更新ra到中
     * @param {} ra
     * @param {} rb
     */
    function recordUpdate(ra, rb) {
        for (var i in rb) {
          ra[i] = rb[i];
        }
    }

    /**扩充成完整的record记录
     *
     * @param {} r 原记录
     * @param {} rt 记录类型
     */
    function toFullRecord(r, rt) {
        if(typeof rt == "string"){
            rt = HTRecord[rt];
        }
        var t = createRecord(rt, 'M');
                recordUpdate(t,r);
        return t;
    }



    /**将页面中的数据保存到数据记录obj中
     * @param {} Obj 对象
     * @param {} cont 容器
     * @param {string 要赋值的属性名} attr
     */
    function DTR(Obj, cont, attr) {
        attr = attr || "name";
        cont = cont || "body";
        $.each(Obj, function(key, val) {
        	 var tfield;
        	if(typeof(cont) =="string" ){
        		tfield = $(cont + ' ' + "[" + attr + "=" + key + "]");
        	}else{
        		tfield = $(cont).find("[" + attr + "=" + key + "]");
        	}
        		
            if (tfield.length > 0) {
                if (tfield.is("input")) {
                    if (tfield.attr("type") == "radio") {
                        Obj[key] = $(cont + ' ' + "input[" + attr + "=" + key + "]:checked").val();
                    } else if (tfield.attr("type") == "checkbox") {
                        if (tfield.prop("checked")) {
                            Obj[key] = "1";
                        } else {
                            Obj[key] = "0";
                        }
                    } else {
                        if(HTUtil.isNotEmpty(tfield.val())&&tfield.val() == tfield.attr('placeholder')){
                            Obj[key] = null;
                        }else{
                            Obj[key] = tfield.val();
                        }
                    }
                } else if (tfield.is("select")) {
                    var id = tfield.data("id");
                    var name = tfield.attr(attr);
                    var code = tfield.data("code");
                    var value = tfield.val();
                    if (id) {
                        Obj[id] = value ? tfield.find("option:selected").data("id") : "";
                    }
                    if (code) {
                        Obj[code] = value ? tfield.find("option:selected").data("code") : "";
                    }
                    Obj[name] = value;
                } else if (tfield.is("textarea")) {
                    Obj[key] = tfield.val()|| null;
                } else {
                    Obj[key] = tfield.text()|| null;
                }
            }
        });
    }
    /**将js对象的对应属性赋值给页面中的对应控件<br/>
     * 控件的name属性值应设置为js对象的对应属性名
     * @param {js对象 数据} Obj
     * @param {string #demo 限制范围} cont
     * @param {string 要赋值的属性名} attr
     */
    function RTD(Obj, cont, attr) {
         attr = attr || "name";
         cont = cont || "body";
        $.each(Obj, function(key, val) {
            var tfield = $(cont + ' ' + "[" + attr + "=" + key + "]");

            if (tfield.length > 0) {
                if (tfield.attr("number")) {
                    Obj[key] = HTUtil.toFixed(Obj[key], tfield.attr("number"));
                }
                //日期类型
                if ($.type(val) === "date") {
                    Obj[key] = Obj[key].format("yyyy-MM-dd hh:mm");
                }

                //如果是input控件
                if (tfield.is("input")) {
                    if (tfield.attr("type") == "radio") {
                        tfield.each(function(i, e) {
                            if ($(e).val() == Obj[key]) {
                                $(e).trigger("click");
                            }
                        });
                    } else if (tfield.attr("type") == "checkbox") {
                        if (Obj[key] == "1") {
                            if (tfield.prop("checked")) {
                                tfield.prop("checked", true);
                            } else {
                                tfield.trigger("click");
                            }
                        } else {
                            tfield.prop("checked", false);
                        }
                    } else {
                        tfield.val(Obj[key]);
                    }
                } else if (tfield.is("select")) {
                    tfield.val(Obj[key]);
                } else if (tfield.is("textarea")) {
                    if (Obj[key]) {
                        tfield.val(("" + Obj[key]));
                    } else {
                        tfield.val("");
                    }
                } else {
                    tfield.text(("" + Obj[key]).replace(/\n/g, "<br/>"));
                }
            }
        });
    }
    
    return {
        createRecord: createRecord,
        modifyRecord: modifyRecord,
        clearRecord: clearRecord,
        clearHtml: clearHtml,
        recordUpdate: recordUpdate,
        toFullRecord: toFullRecord,
        RTD: RTD,
        DTR: DTR
    };
});
