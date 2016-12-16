/**自定义通用方法
 * createRecord 获得一个js对象
 * clearRecord 清除record记录
 * clearHtml 根据record的name清除html记录
 * replaceN 把"\n"转换为"<br/>"
 * isEmpty 判断是否为空
 * blurToVal 控件失去焦点 n2获得n1值
 * rarryRemove 删除数组元素id属性为指定值的元素
 * change_date 日期加减
 * HashMap
 *
 * =============插件部分方法=============
 * bootstrap引用插件部分
 * jquery引用插件部分
 * ==================================
 */
define(['HTCons', 'jquery', 'layer', 'HTMsg', 'HTUtil', 'HTSession'],
    function(HTCons, $, layer, HTMsg, HTUtil, HTSession) {
        
        /*----------bootstrap dialog-----------*/
        function alert(msg, i) {
            layer.msg(msg, {
                icon: i
            });
        }

        function confirm(msg, callbackOk) {
            layer.confirm(msg, {
                btn: [HTMsg.btn_ok, HTMsg.btn_cancel], //按钮
                shade: false //不显示遮罩
            }, function(index) {
                if (callbackOk) {
                    callbackOk(index);
                } else {
                    layer.close(index);
                }
            });
        }
        /**执行ajax数据请求
         *
         * @param {} data 参数
         * @param {} sfn 成功后的回调方法
         * @param {} efn 失败后的回调方法
         */
        function doAjax(data, sfn, efn) {

            var waitingAlert = layer.load(HTMsg.MsgTips018); //'数据处理中，请稍等.....'
            $.ajax({
                url: HTCons.ServerFont,
                dataType: "json",
                type: "POST",
                data: data,
                success: function(json, status) {
                    layer.close(waitingAlert);
                    if (sfn) {
                        sfn(json, status);
                    }
                },
                error: function(xhr) {
                    layer.close(waitingAlert);
                    var json = eval('(' + xhr.responseText + ')');
                    alert(json.msg);
                    if (efn) {
                        efn(json);
                    }
                }
            });
        }
        /**登陆后填充session
         *
         * @param {} user
         */
        function fillSession(user) {
            HTSession.saveSession("USER_ID", user.id);
            HTSession.saveSession("USER_EMAIL", user.wusrEmail);
            HTSession.saveSession("USER_NAME", user.wusrFirstName);
            HTSession.saveSession("USER_LOGIN_NAME", user.wusrName);
            HTSession.saveSession("USER_FUNCTION", user.wusrFunctions);
            HTSession.saveSession("USER_TYPE", user.wusrType);
            HTSession.saveSession("USER_TEL", user.wusrMobile)
        }

        /**退出登录时清空session
         *
         */
        function clearSession() {
            if (window.sessionStorage) {
                try {
                    return sessionStorage.clear();
                } catch (ex) {
                    alert(ex);
                }
            } else {
                HTSession.clearSession("USER_ID");
                HTSession.clearSession("USER_EMAIL");
                HTSession.clearSession("USER_NAME");
                HTSession.clearSession("USER_LOGIN_NAME");
                HTSession.clearSession("USER_FUNCTION", user.wusrFunctions);
                HTSession.clearSession("USER_TYPE", user.wusrType);
                HTSession.clearSession("USER_TEL", user.wusrMobile)
            }
        }

        /**获得ID
         * modify by hqw
         * @return {Number}
         */
        function findRowIdFn(sId) {
            if (sId) {
                var ids = sId.split("_");
                if (ids.length > 0) {
                    return ids[1];
                } else {
                    return 0;
                }
            }
            return 0;
        }

        /**对指定的控件进行非空校验
         * modify by hqw
         * @param {} fieldStr
         * @return {Boolean}
         */
        function emptyTipsFn(fieldStr) {
            var field = $(fieldStr);
            var fv = field.val();
            if (field.is('span')) { //如果是span则取text
                fv = field.text();
            }
            if (field.is("input")) {
                if ((HTUtil.isNotEmpty(fv)) && (fv == field.attr('placeholder'))) {
                    fv = '';
                }
            }
            if (HTUtil.isEmpty(fv)) {
                layer.tips(HTMsg.MsgTips001, fieldStr, {
                    guide: 1,
                    time: 2000
                });
                field.focus();
                return true;
            }
            return false;
        }

        /**
         * 错误信息过滤
         */
        function alertBackMsgStr(errorStr) {
            if (errorStr.indexOf("需要登录") >= 0) {
                alert(errorStr);
            } else {
                alert(errorStr);
            }
        }
		/**获取表单数据转换成对象 
		 * 使用方法： $.serializeObject(form);
		 * */
		$.fn.extend({
			serializeObject:function (){ 
				var o ={}; 
				$.each($(this).serializeArray(),function(index,e){
					if(o[e['name']]){ 
						o[e['name']] = o[e['name']] +","+e['value']; 
					}else{ 
						o[e['name']] = e['value']; 
					} 
				}); 
				return o; 
			} 
		});
        /**sw限制金额输入、兼容浏览器
         * @param
         */
        $.fn.numberFix = function() {
            $.each(this, function(i, me) {
                var n = $(me).attr('number');
                $(me).on('keypress', function(e) {
                    var keyCode = e.keyCode ? e.keyCode : e.which;
                    if (n && n !== 0) { //浮点数
                        if ((this.value.length === 0 || this.value.indexOf(".") != -1) && keyCode == 46) return false;
                        return keyCode >= 48 && keyCode <= 57 || keyCode == 46 || keyCode == 8 || keyCode == 37 || keyCode == 39 || keyCode == 9;
                    } else { //整数
                        return keyCode >= 48 && keyCode <= 57 || keyCode == 8 || keyCode == 37 || keyCode == 39 || keyCode == 9;
                    }
                });

                $(me).on("focus", function() {
                    if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
                        this.value = this.value.substr(0, this.value.length - 1);
                    } else if (isNaN(this.value)) {
                        this.value = "";
                    }
                });
                $(me).on("blur", function() {
                    if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
                        this.value = this.value.substr(0, this.value.length - 1);
                    } else if (isNaN(this.value) || this.value < 0) {
                        this.value = "";
                    }

                    var val = $(this).val();
                    if (HTUtil.isNotEmpty(val)) {
                        var txtNum = Number(val);
                        if (isNaN(txtNum)) {
                            txtNum = 0;
                        }
                        if (n) {
                            txtNum = txtNum.toFixed(n);
                        }
                        $(this).val(txtNum);
                    }
                });
            });
        };

        /**判断是否已登陆
         *
         */
        function isLogined() {
            if (HTUtil.isEmpty(HTSession.loadSession("USER_ID"))) {
                return false;
            } else {
                return true;
            }
        }


        /**返回
         *
         */
        return {
            isLogined: isLogined,
            alert: alert,
            confirm: confirm,
            doAjax: doAjax,
            fillSession: fillSession,
            clearSession: clearSession,
            findRowIdFn: findRowIdFn,
            emptyTipsFn: emptyTipsFn,
            alertBackMsgStr: alertBackMsgStr
        };
    });
