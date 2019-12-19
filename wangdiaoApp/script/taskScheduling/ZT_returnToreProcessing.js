var params;
apiready = function() {
    params = api.pageParam;
    $api.val($api.byId('user'), params.userName);
    initSelect();
};
function initSelect(){
    common.post({
        url : config.getAllIdUrl ,
        isLoading:false,
        data:{
            parentdictid:parentdictid.ZT_returnToreProcessing
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
                        msg:'没有可用的退回类型！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取退回类型失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}

function save() {
    var wsNum = $api.getStorage(storageKey.wsNum);                      //工单号
    var wsId = $api.getStorage(storageKey.wsId);                        //流程id
    if (common.isEmpty(params.userId)) {
        api.toast({
            msg: '退回重新处理人不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var dispose_way = $api.val($api.byId('disposeWay'));            //退回类型
    if (common.isEmpty(dispose_way)) {
        api.toast({
            msg: '请选择退回类型！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var remark = $api.trim($api.val($api.byId('remark')));          //退回原因
    if (common.isEmpty(remark)) {
        api.toast({
            msg: '退回原因不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    api.confirm({
        title: '退回重新处理',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
            common.post({
                url:config.ZTReturnToreProcessing,
                isLoading: true,
                text: "提交中...",
                data: {
                    wsNum: wsNum,
                    ws_id: wsId,
                    user: params.userId,
                    dispose_way: dispose_way,
                    remark: remark,
                },
                success: function (ret) {
                    if (ret.status==='200'){
                        api.toast({
                            msg:  '退回重新处理操作成功！',
                            duration: config.duration,
                            location: 'middle'
                        });
                        setTimeout(function(){
                            $api.setStorage(ZT_process_need.entrance, 'yb');
                            api.closeWin({
                                name:'ZT_confirmFinishWorksheet'
                            })
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        },config.successDuration);
                    } else {
                        // 因为返回的错误信息是英文，所有没有单独显示错误信息。
                        var msg = '退回重新处理操作失败！'
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
