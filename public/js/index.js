require(['init', 'portSelect', 'podSelect', 'HTUtil'],
    function(init, port, pod, HTUtil) {
        //初始化
        init.loadConfig();
        $("#pol_input").portSelect();
        $("#pod_input").podSelect();
        $("#queryBtn").on("click", priceQuery);

        //条件查询 页面跳转
        function priceQuery() {
            var polCode = $("#pol_input").data('code');
            var podCode = $("#pod_input").data('code');
            var polName = $("#pol_input").data('name');
            var podName = $("#pod_input").data('name');

            if (HTUtil.isEmpty(polCode)) {
                $("#pol_input").focus();
                return;
            }
            if (HTUtil.isEmpty(podCode)) {
                $("#pod_input").focus();
                return;
            }
            location.href = "./freight/freight.html?polCode=" + polCode + "&podCode=" + podCode + "&polName=" + polName + "&podName=" + podName;
        }

    });
