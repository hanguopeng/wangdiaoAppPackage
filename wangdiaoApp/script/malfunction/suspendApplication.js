apiready = function() {
    initSelect();
}
//动态加载select
function initSelect(){
    var dictId = parentdictid.suspendApplication.other
    var dmPro = $api.getStorage(storageKey.dmPro);
    if (!common.isEmpty(dmPro)&&dmPro==='大客户专业'){
        dictId = parentdictid.suspendApplication.KH
    }
    common.post({
        url : config.getAllIdUrl,
        isLoading:false,
        data:{
            parentdictid:dictId
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
                        msg:'没有可用的挂起类型！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取挂起类型失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
function save() {
    var disposeWay = $("#disposeWay option:selected").val();    //挂起类型
    var remark = $api.trim($api.val($api.byId('remark')));       //挂起原因
    var wsNum = $api.getStorage(storageKey.wsNum);               //工单号
    var processId = $api.getStorage(storageKey.processId);       //流程id
    var ws_id = $api.getStorage(storageKey.wsId);
    var imgID = "";                                             //图片信息,接口需要传值，但是页面上没有此录入项
    if(common.isEmpty(disposeWay)){
        api.toast({
            msg: '请选择挂起类型！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    api.confirm({
        title: '挂起申请',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
            common.post({
                url:config.suspendApplicationUrl,
                isLoading: true,
                text: "提交中...",
                data:{
                    wsNum: wsNum,
                    processId: processId,
                    remark: remark,
                    imgID: imgID,
                    dispose_way: disposeWay,
                    ws_id: ws_id
                },
                success: function (ret) {
                    if (ret.status==='200'){
                        api.toast({
                            msg:  '挂起申请操作成功！',
                            duration: config.duration,
                            location: 'middle'
                        });
                        setTimeout(function(){
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        },config.successDuration);
                    } else {
                        // 因为返回的错误信息是英文，所有没有单独显示错误信息。
                        var msg = '挂起申请操作失败！'
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
