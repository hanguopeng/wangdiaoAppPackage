apiready = function() {
    initSelect()
};
var remark;
var disposeWay;
var disposeWayName;
var check_result;
var column5;
//动态加载挂起申请对象
function initSelect(){
    var wsNum = $api.getStorage(storageKey.wsNum);
    var processId = $api.getStorage(storageKey.processId);
    var wsId = $api.getStorage(storageKey.wsId);
    common.post({
        url : config.getSuspendApprovalModelUrl,
        isLoading:false,
        data:{
            wsNum: wsNum,
            wsId: wsId,
            processId: processId
        },
        success : function(ret){
            if(ret&&ret.status==='200'){
                var result= JSON.parse(ret.data.json)
                disposeWay = ifNull(result.DISPOSEWAY);
                disposeWayName = ifNull(result.DISPOSEWAYNAME);
                $api.val($api.byId('disposeWayName'), disposeWayName);//挂起原因
                remark = ifNull(result.REMARK);
                $api.val($api.byId('remark'), remark);//挂起原因
            }else {
                api.toast({
                    msg: '获取挂起申请批复对象失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}

function save(obj) {
    var dataTo = $api.attr(obj, 'data-to');
    if (dataTo === "1") {
        check_result = 1;                // 同意
    } else {
        check_result = 2;                // 不同意
    }
    column5 = $api.trim($api.val($api.byId('column5')));        //批复意见
    var wsNum = $api.getStorage(storageKey.wsNum);                          //工单号
    if(common.isEmpty(column5)){
        api.toast({
            msg: '请输入批复意见！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    api.confirm({
        title: '挂起申请批复',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        // web中不同意时，不check工单
        if(retBtn.buttonIndex===1){
            if (check_result === 2){
                commitData();
                return;
            } else{
                common.post({
                    url: config.GZ_checkWorksheet ,
                    isLoading: true,
                    data:{
                        wsNum:wsNum
                    },
                    success: function (ret) {
                        if(ret.returnvar === '1'){
                            api.toast({
                                msg: '此工单已撤销！',
                                duration: 2000,
                                location: 'middle'
                            });
                            return;
                        }else if (ret.returnvar === '0'){
                            commitData();
                            return;
                        }else {
                            api.toast({
                                msg: '此工单已挂起！',
                                duration: 2000,
                                location: 'middle'
                            });
                            return;
                        }
                    }
                });
            }
        }
    });
}

function commitData() {
    var wsNum = $api.getStorage(storageKey.wsNum);                          //工单号
    var processId = $api.getStorage(storageKey.processId);                  //流程id
    var ws_id = $api.getStorage(storageKey.wsId);
    common.post({
        url:config.saveSuspendApprovalUrl,
        data:{
            wsNum: wsNum ,
            remark : remark ,
            disposeWay : disposeWay,
            check_result : check_result,
            processId : processId ,
            column5 : column5,
            ws_id: ws_id
        },
        isLoading: true,
        text: "提交中...",
        success: function (ret) {
            if (ret.status==='200'){
                api.alert({
                    title: '提示',
                    msg: '挂起申请批复操作成功！',
                }, function (ret, err) {
                    common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                });
            } else {
                // 因为返回的错误信息是英文，所有没有单独显示错误信息。
                var msg = '挂起申请批复操作失败！'
                if (ret&&ret.data&&ret.data.message){
                    msg = ret.data.message
                }
                api.alert({
                    title: '提示',
                    msg: msg,
                });
            }
        }
    });
}
function ifNull(str) {
    if (common.isEmpty(str)){
        return ''
    } else{
        return str
    }
}

