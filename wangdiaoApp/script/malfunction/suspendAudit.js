// TODO 暂停使用
apiready = function() {
    initSelect();
}
//动态加载挂起申请对象
function initSelect(){
    var wsNum = $api.getStorage(storageKey.wsNum);
    var processId = $api.getStorage(storageKey.processId);
    common.post({
        url : config.getSuspendAuditModelUrl + "&wsNum=" + wsNum + "&processId=" + processId ,
        isLoading:false,
        success : function(ret){
            if(ret&&ret.status==='200'){
                //填写信息
                if (ret.data&&ret.data.result) {
                    var data = ret.data.result;
                    var params = {list:[]}
                    if (data.indexOf(";")!=-1){
                        var list = data.split(";");
                        for (var i=0; i<list.length;i++){
                            if (list[i].length>0){
                                params.list.push(list[i].split(","))
                            }
                        }
                    }
                    $api.html($api.byId('suspendAuditModel'), "");
                    var suspendAuditModel = doT.template($api.text($api.byId('suspend-audit-model')));
                    $api.html($api.byId('suspendAuditModel'), suspendAuditModel(params));
                }
            }else {
                api.toast({
                    msg: '获取挂起申请对象失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
function save(obj) {
    var check_result
    var dataTo = $api.attr(obj, 'data-to');
    if (dataTo == "1") {//同意
        check_result = 1;                //批复类型
    } else {
        check_result = 2;                //批复类型
    }
    var column5 = $api.trim($api.val($api.byId('pfyj')));               //批复意见
    var remark = $api.trim($api.val($api.byId('gqyy')));                //挂起原因
    var dispose_way = $("#gqlx-sel option:selected").val();             //挂起类型
    var wsNum = $api.getStorage(storageKey.wsNum);                      //工单号
    var processId = $api.getStorage(storageKey.processId);              //流程id
    if(common.isEmpty(dispose_way)){
        api.toast({
            msg: '请选择挂起类型！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    common.post({
        url:config.suspendAuditUrl + "&wsNum=" + wsNum + "&processId=" + processId + "&remark=" + remark + "&dispose_way=" + dispose_way +"&column5=" + column5
            + "&check_result=" + check_result,
        isLoading: false,
        text: "提交中...",
        success: function (ret) {
            if (ret.status==='200'){
                api.alert({
                    title: '提示',
                    msg: '挂起审核操作成功！',
                }, function (ret, err) {
                    common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                });
            } else {
                // 因为返回的错误信息是英文，所有没有单独显示错误信息。
                api.toast({
                    msg:  '提交失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
function loadingTypeAndReason() {
    var wsNum = $api.getStorage(storageKey.wsNum);
    var processId = $api.getStorage(storageKey.processId);
    common.post({
        url : config.suspendAuditModelEchoUrl + "&wsNum=" + wsNum + "&processId=" + processId ,
        isLoading:false,
        success : function(ret){

        }
    });
}
