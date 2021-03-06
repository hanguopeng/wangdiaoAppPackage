apiready = function() {
    initSelect();
}
//动态加载select
function initSelect(){
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
function save() {
    var remark = $api.trim($api.val($api.byId('remark')));      //归档意见
    var wsNum = $api.getStorage(storageKey.wsNum);              //工单号
    var processId = $api.getStorage(storageKey.processId);      //流程id
    var business_recovery =  "";                                 //确认是否恢复
    var dispose_way = $("#disposeWay option:selected").val();    //归档满意度
    if(common.isEmpty(dispose_way)){
        api.toast({
            msg: '请选择归档满意度！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    } else if (common.isEmpty(remark)) {
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
                url: config.GZ_checkWorksheetForArchive ,
                isLoading: true,
                data:{
                    wsNum:wsNum
                },
                success: function (ret) {
                    if(ret.returnvar === '2'){
                        api.toast({
                            msg: '此工单已归档，请刷新列表!!',
                            duration: 2000,
                            location: 'middle'
                        });
                        return;
                    }else{
                        common.post({
                            url:config.archiveWorksheetUrl,
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
                }
            });
        }
    });
}
