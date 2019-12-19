apiready = function() {
    initSelect();
}
//动态加载select
function initSelect(){
    initDisposeWay()
    initBusinessRecovery()
}
function save() {
    var wsNum = $api.getStorage(storageKey.wsNum);              //工单号
    var processId = $api.getStorage(storageKey.processId);      //流程id
    var business_recovery =  $("#businessRecovery option:selected").val();   //确认是否恢复
    if(common.isEmpty(business_recovery)){
        api.toast({
            msg: '请选择确认是否恢复！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var dispose_way = $("#disposeWay option:selected").val();    //归档满意度
    if(common.isEmpty(dispose_way)){
        api.toast({
            msg: '请选择归档满意度！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var remark = $api.trim($api.val($api.byId('remark')));      //归档意见
    if (common.isEmpty(remark)) {
        api.toast({
            msg: '归档意见不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }

    api.confirm({
        title: '归档',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
            common.post({
                url:config.ZTArchiveWorksheetUrl,
                isLoading: true,
                text: "提交中...",
                data:{
                    wsNum : wsNum,
                    processId : processId,
                    remark : remark,
                    business_recovery : business_recovery,
                    dispose_way : dispose_way
                },
                success: function (ret) {
                    if (ret.status==='200'){
                        api.toast({
                            msg:  '归档操作成功！',
                            duration: config.duration,
                            location: 'middle'
                        });
                        setTimeout(function(){
                            $api.setStorage(ZT_process_need.entrance, 'gd');
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        },config.successDuration);
                    } else {
                        var msg = '归档操作失败！'
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
    });
}
// 初始化归档满意度
function initDisposeWay(){
    common.post({
        url : config.getAllIdUrl ,
        isLoading:false,
        data:{
            parentdictid:parentdictid.archiveWorksheet
        },
        success : function(ret){
            if(ret&&ret.status==='200'){
                //填写信息
                if (ret.data&&ret.data.name&&ret.data.id&&ret.data.name.length > 0) {
                    var data = ret.data;
                    var strName = (data.name).split(",");    //字符分割;
                    var strId  = (data.id).split(",");    //字符分割;
                    var params = {
                        idList:[],
                        nameList:[]
                    }
                    params.idList = strId
                    params.nameList = strName
                    $api.html($api.byId('disposeWay'), "");
                    var disposeWay = doT.template($api.text($api.byId('type-selector')));
                    $api.html($api.byId('disposeWay'), disposeWay(params));
                }else {
                    api.alert({
                        msg:'没有可用的满意度！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取归档满意度失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
// 初始业务是否恢复
function initBusinessRecovery(){
    common.post({
        url : config.getAllIdUrl ,
        isLoading:false,
        data:{
            parentdictid:parentdictid.archiveWorksheet_businessRecovery
        },
        success : function(ret){
            if(ret&&ret.status==='200'){
                //填写信息
                if (ret.data&&ret.data.name&&ret.data.id&&ret.data.name.length > 0) {
                    var data = ret.data;
                    var strName = (data.name).split(",");    //字符分割;
                    var strId  = (data.id).split(",");    //字符分割;
                    var params = {
                        idList:[],
                        nameList:[]
                    }
                    params.idList = strId
                    params.nameList = strName
                    $api.html($api.byId('businessRecovery'), "");
                    var businessRecovery = doT.template($api.text($api.byId('businessRecovery-selector')));
                    $api.html($api.byId('businessRecovery'), businessRecovery(params));
                }else {
                    api.alert({
                        msg:'没有可用的业务是否恢复！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取业务是否恢复失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}