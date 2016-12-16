 define(['jquery', 'HTMsg','template','HTUtil'], function($, HTMsg,template,HTUtil) {
     /**渲染是否生效
      * @param {} active
      * @return {}
      */
     function activeRender(active) {
         return (active == "0") ? '否' : '是';
     }

     /**渲染订单状态
      *
      * @param {} order
      */
     function WStatusRender(status) {
         if ('0' == status) {
             return HTMsg.status_uncommit; //未提交
         } else if ('1' == status) {
             return HTMsg.status_commit; //已提交
         } else if ('2' == status) {
             return HTMsg.status_accept; //已受理
         } else if ('3' == status) {
             return HTMsg.status_finish; //已完成
         } else if ('99' == status){
            return HTMsg.status_anomaly;
         }else{
           return HTMsg.status_uncommit; //未提交
         }
     }

     /**渲染订单状态
      *
      * @param {} order
      */
     function FStatusRender(status) {
         //0：未操作  1：操作中（未申报）   2:操作中（已申报）  3：操作中（已放行）    4:已完成
         if ('0' == status) {
             return "已受理"; //未操作
         } else if ('1' == status) {
             return "操作中"; //操作中（未申报）
         } else if ('2' == status) {
             return "操作中"; //操作中（已申报）
         } else if ('3' == status) {
             return "操作中";//操作中（已放行）
         } else if ('4' == status){
            return "已完成";//已完成
         }
     }

     /**渲染订舱模式
      *
      * @param {} order
      */
     function bizTypeRender(order) {
         var type = order.bizType;
         if ('FCL' == type) {
             return HTMsg.MsgStr0031; //整箱
         } else if ('LCL' == type) {
             return HTMsg.MsgStr0032; //拼箱
         } else {
             return HTMsg.MsgStr0032; //拼箱
         }
     }
     /** 渲染船期格式
      * @param {船期字符串} str
      * @return { } html
      */
     function rendSchedule(str) {
         str = str + "";
         var arr = str.split(",");
         var html = '';
         $.each(arr, function(i, e) {
             var va = e;
             if (e == "1") {
                 va = '一';
             } else if (e == "2") {
                 va = '二';
             } else if (e == "3") {
                 va = '三';
             } else if (e == "4") {
                 va = '四';
             } else if (e == "5") {
                 va = '五';
             } else if (e == "6") {
                 va = '六';
             } else if (e == "7") {
                 va = '日';
             }
             html += '周' + va;
         });
         return html;
     }

     /** 渲染中转港
      * @param {船期字符串} str
      * @return { } html
      */
     function rendPot(str) {
         var arr = ['直航'];
         if (str && str != 'null,null') {
             arr = str.split(",");
         }
         var text = arr.join(",");
         return text;
     }


     /** 渲染航程
      * @param {航程} number
      * @return { } html
      */
     function rendDuration(nu) {
         if (nu && nu != "null") {
             return nu + "天";
         } else {
             return "暂无";
         }
     }
     
     /** 渲染确认状态
      * 
      */
     function rendStatus(confirmStatus) {
         if(confirmStatus == "1") {
             return "待确认";
         }else if(confirmStatus == "2"){
             return "已确认";
         }else if(confirmStatus == "3"){
             return "有争议";
         }
     }



     template.helper('toFixed',HTUtil.toFixed);
     template.helper('Active',activeRender);
     template.helper('WStatus',WStatusRender);
     template.helper('FStatus',FStatusRender);

     template.helper('BizType',bizTypeRender);
     template.helper('Schedule',rendSchedule);
     template.helper('Pot',rendPot);
     template.helper('Duration',rendDuration);
     template.helper('ChangeStatus',rendStatus);
     return {
         WStatusRender: WStatusRender,
         activeRender: activeRender,
         bizTypeRender: bizTypeRender,
         rendSchedule: rendSchedule,
         rendPot: rendPot,
         rendDuration: rendDuration
     };
 });
