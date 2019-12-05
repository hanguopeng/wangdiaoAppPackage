apiready = function() {
    initSelect()
};
var remark;
var disposeWay;
var column5;
//动态加载挂起申请对象
function initSelect(){
    var wsNum = $api.getStorage(storageKey.wsNum);
    var processId = $api.getStorage(storageKey.processId);
    common.post({
        url : config.getSuspendAuditModelUrl,
        isLoading:false,
        data:{
            wsNum: wsNum,
            processId: processId
        },
        success : function(ret){
            if(ret&&ret.status==='200'){
                var dmRamsProcessLog = ret.data.dmRamsProcessLog;
                if (dmRamsProcessLog){
                    remark = ifNull(dmRamsProcessLog.remark);
                    $api.val($api.byId('remark'), remark);//挂起原因
                    column5 = ifNull(dmRamsProcessLog.column5);
                    $api.val($api.byId('column5'), column5);//批复意见
                    disposeWay = ifNull(dmRamsProcessLog.disposeWay);
                }
                initDisposeWay(disposeWay);
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
//加载挂起类型
function initDisposeWay(disposeWay){
    if(common.isEmpty(disposeWay)){
        api.toast({
            msg: '没有获取到有效的挂起类型，无法继续操作！',
            duration: config.duration,
            location: 'middle'
        });
        return
    }
    var dictId = parentdictid.suspendApplication.other
    var dmPro = $api.getStorage(storageKey.dmPro);
    if (!common.isEmpty(dmPro)&&dmPro==='大客户专业'){
        dictId = parentdictid.suspendApplication.KH
    }
    common.post({
        url : config.getAllIdUrl ,
        isLoading:false,
        data:{
            parentdictid:dictId
        },
        success : function(ret){
            if(ret&&ret.status==='200'){
                var  idList = ret.data.id.split(",");
                var  nameList = ret.data.name.split(",");
                for (var i = 0;i<idList.length;i++) {
                    if (idList[i]===disposeWay) {
                        $api.val($api.byId('disposeWay'),nameList[i]);//挂起类型-名称
                    }
                }
            }else {
                api.toast({
                    msg: '获取挂起类型失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
function save(obj) {
    var check_result;
    var dataTo = $api.attr(obj, 'data-to');
    if (dataTo === "1") {
        check_result = 1;                // 同意
    } else {
        check_result = 2;                // 不同意
    }
    var gqopinion = $api.trim($api.val($api.byId('gqopinion')));        //意见
    var wsNum = $api.getStorage(storageKey.wsNum);                          //工单号
    var processId = $api.getStorage(storageKey.processId);                  //流程id
    var ws_id = $api.getStorage(storageKey.wsId);
    if(common.isEmpty(gqopinion)){
        api.toast({
            msg: '请输入意见！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    api.confirm({
        title: '挂起审核',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
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
                        common.post({
                            url:config.suspendAuditUrl,
                            data:{
                                wsNum: wsNum ,
                                processId : processId ,
                                remark : remark ,
                                dispose_way : disposeWay,
                                column5 : column5,
                                check_result : check_result,
                                gqopinion:gqopinion,
                                ws_id: ws_id
                            },
                            isLoading: true,
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
                                    var msg = '挂起审核操作失败！'
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
    });
}
function ifNull(str) {
    if (common.isEmpty(str)){
        return ''
    } else{
        return str
    }
}

