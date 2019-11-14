apiready = function () {
}
function save() {
    var remark = $api.trim($api.val($api.byId('appendMessage')));       //追加内容
    var taskDesc = $api.trim($api.val($api.byId('taskDesc')));       //任务描述
    var wsNum = $api.getStorage(storageKey.wsNum);       //工单号
    var processId = $api.getStorage(storageKey.processId);     //流程id
    var ws_id = $api.getStorage(storageKey.wsId);     //流程id
    var imgID = "";     //图片信息
    if(common.isEmpty(remark)){
        api.toast({
            msg: '追加内容不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    api.confirm({
        title: '信息追加',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
            common.post({
                url:config.ZTAppendMessageUrl,
                isLoading: true,
                text: "提交中...",
                data:{
                    wsNum:wsNum,
                    processId:processId,
                    remark: remark,
                    taskDesc: taskDesc,
                    ws_id: ws_id,
                    imgID:imgID
                },
                success: function (ret) {
                    if (ret.status==='200'){
                        api.toast({
                            msg:  '信息追加操作成功！',
                            duration: config.duration,
                            location: 'middle'
                        });
                        setTimeout(function(){
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        },config.successDuration);
                    } else {
                        // 因为返回的错误信息是英文，所有没有单独显示错误信息。
                        var msg = '信息追加操作失败！'
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

