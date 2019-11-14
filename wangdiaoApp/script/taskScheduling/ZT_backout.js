var wsNum = $api.getStorage(storageKey.wsNum);       //工单号
var processId = $api.getStorage(storageKey.processId); //流程id
var ws_id = $api.getStorage(storageKey.wsId); //流程id
apiready = function(){
}

function submitData(){
    var deleteType = $api.val($api.byId('deleteType'));
    if(common.isEmpty(deleteType)){
        api.toast({
            msg: '请选择撤销类型！',
            duration: 2000,
            location: 'middle'
        });
        return
    }
    var deleteInfo = $api.val($api.byId('deleteInfo'))
    if(common.isEmpty(deleteInfo)){
        api.toast({
            msg: '撤销原因不能为空！',
            duration: 2000,
            location: 'middle'
        });
        return
    }
    api.confirm({
        title: '撤销',
        msg: '确认提交？',
        buttons: ['确认','取消']
    }, function (ret, err) {
        var index = ret.buttonIndex;
        if(index===1){
            common.post({
                url:config.ZTRevocationWorksheet,
                isLoading: true,
                data:{
                    wsNum:wsNum,
                    processId:processId,
                    ws_id:ws_id,
                    deleteInfo:deleteInfo,
                    deleteType:deleteType
                },
                success:function(ret){
                    if(ret&&ret.status==="200"){
                        api.toast({
                            msg: '撤销成功',
                            duration: 2000,
                            location: 'middle'
                        });
                        setTimeout(function(){
                            $api.setStorage(ZT_process_need.entrance, 'yb');
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        },config.successDuration);
                    }else{
                        api.toast({
                            msg: '撤销失败',
                            duration: 2000,
                            location: 'middle'
                        });
                    }
                }
            })
        }
    });

}

