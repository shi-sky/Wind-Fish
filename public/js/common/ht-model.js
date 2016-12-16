/*!
 *获取数据查询
 * @type
 */
define(['HTCons', 'jquery', 'HTMsg', 'HTFun','HTUtil','layer'], function(HTCons, $, HTMsg, HTFun,HTUtil,layer) {
  //附加费查询
  function getFreList(id, callback, async) {
      $.ajax({
        url: HTCons.ServerFont,
        dataType: 'json',
        type: 'GET',
        async:async||true,
        data: {
            _A: "CFclFreight_QW",
            _mt: "json",
            id: id
        },
        success:   function(freList) {
            if (typeof callback == 'function') {
                callback(freList.CFclFreight);
            } else {

            }
        },
        error: function(xhr) {
            callback([]);
        }
      });

  }
    //附加费查询
    function getAdditional(id, callback, async) {
    	var waitingAlert = layer.load(HTMsg.MsgTips018); //'数据处理中，请稍等.....'	
        $.ajax({
          url: HTCons.ServerFont,
          dataType: 'json',
          type: 'GET',
          async:async||true,
          data: {
              _A: "CFclSurcharge_QW",
              _mt: "json",
              fclFreightId: id
          },
          success:   function(freList) {
        	  layer.close(waitingAlert);
              if (typeof callback == 'function') {
                  var list = [];
                  if(freList.CFclSurcharge){
                    list = freList.CFclSurcharge;
                    if (!$.isArray(list)) {
                        list = [list];
                    }
                  }
                  callback(list);
              } else {

              }
          },
          error: function(xhr) {
        	  layer.close(waitingAlert);
              callback([]);
          }
        });

    }

    /**
     * 获取包装数据
     * value:需查询的值
     * calback： 回掉
     */
    function loadPack(value, callback) {
        value = $.trim(value.toUpperCase().replace(/(\(.*\)|\(.*)/g, ""));
        var qa = [{
            'key': 'name',
            'value': value,
            'op': HTCons.LI,
            'orGroup': 'name'
        }, {
            'key': 'nameEn',
            'value': value,
            'op': HTCons.LI,
            'orGroup': 'name'
        }];
        $.ajax({
            url: HTCons.ServerFont,
            dataType: 'json',
            type: 'POST',
            data: {
                _A: "GDict_Q",
                _mt: "json",
                dityCode:'PACKAGE',
                compCode: HTCons.compCode,
                xml: HTUtil.QATJH(qa)
            },
            success: function(data) {
                var ja = data.GDict;
                if (ja) {
                    if (!jQuery.isArray(ja)) {
                        ja = [ja];
                    }
                    if (typeof callback == 'function') {
                        callback(ja);
                    }
                } else {
                    callback([]);
                }
            },
            error: function(xhr) {
                callback([]);
            }
        });
    }
    return {
        getFreList:getFreList,
        getAdditional: getAdditional,
        loadPack:loadPack
    };
});
