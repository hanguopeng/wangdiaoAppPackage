var wsNum = $api.getStorage(storageKey.wsNum);       //工单号
var processId = $api.getStorage(storageKey.processId); //流程id
apiready = function(){
    getReturnType()
}

function getReturnType(){

    common.post({
        url:config.ZTReturnTypeUrl ,
        isLoading:false,
        data:{
            parentdictid:parentdictid.ZT_chargeBack_returnTypeDicId,
        },
        success:function (ret) {
            if(ret&&ret.status==="200"){
                var idArr = (ret.data.id).split(",")
                var nameArr = (ret.data.name).split(",")
                var paramsArr = []
                var params = {}
                for(var i=0;i<idArr.length-1;i++){
                    params = {}
                    params.id=idArr[i]
                    params.name=nameArr[i]
                    paramsArr.push(params)
                }

                var conTmpl = doT.template($api.text($api.byId('returnTmpl')));
                $api.html($api.byId('returnType-sel'), conTmpl(paramsArr));
            }

        }

    })
}

function submitData(){
    var returnType = $api.val($api.byId('returnType-sel'));
    var returnReason = $api.val($api.byId('returnReason_area'))
    if(common.isEmpty(returnType)){
        api.toast({
            msg: '请选择退单类型！',
            duration: 2000,
            location: 'middle'
        });
        return
    }
    api.confirm({
        title: '退单',
        msg: '确认提交？',
        buttons: ['确认','取消']
    }, function (ret, err) {
        var index = ret.buttonIndex;
        if(index===1){
            common.post({
                url:config.ZTReturnUrl,
                isLoading: true,
                data:{
                    wsNum:wsNum,
                    processId:processId,
                    remark:returnReason,
                    dispose_way:returnType,
                    imgID:""
                },
                success:function(ret){
                    if(ret&&ret.status==="200"){
                        api.toast({
                            msg: '退单成功',
                            duration: 2000,
                            location: 'middle'
                        });
                        setTimeout(function(){
                            $api.setStorage(ZT_process_need.entrance, 'yb');
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        },config.successDuration);
                    }else{
                        api.toast({
                            msg: '退单失败',
                            duration: 2000,
                            location: 'middle'
                        });
                    }
                }
            })
        }
    });

}

