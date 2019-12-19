var inputId = '';
var zpdxId = "";
var zpdxType = "";
apiready = function() {
    //监听登出事件
    api.addEventListener({
        name: 'loginout'
    }, function(ret, err) {
        var id = $api.getStorage(storageKey.data_id);
        var name = $api.getStorage(storageKey.data_name);
        var type = $api.getStorage(storageKey.data_type);
        //对象获取值
        $api.val($api.byId(inputId),name);
        if (inputId == "zpdx") {
            zpdxId = id;
            zpdxType = type;
        }

        $api.rmStorage(storageKey.data_id);
        $api.rmStorage(storageKey.data_name);
        $api.rmStorage(storageKey.data_type);
    });
}
//进入tag_tree
function openWin(id) {
    inputId = id;
    api.openWin({
        name: 'my_tree',
        bounces: false,
        slidBackEnabled : false,
        reload:true,
        url: '../../html/main/my_tree.html',
        vScrollBarEnabled:true,
        hScrollBarEnabled:false

    });

}
function save() {
    var paiwangGroupd = $api.trim(zpdxId);      //转派对象
    var paiwangGroupdType = zpdxType;                               //派往对象类型
    if(common.isEmpty(paiwangGroupd)){
        api.toast({
            msg: '请选择转派对象！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var remark =$api.trim($api.val($api.byId('remark')));              //转派原因
    var wsNum = $api.getStorage(storageKey.wsNum);                  //工单号
    var ws_id = $api.getStorage(storageKey.wsId);          //流程id
    var imgID = "";        //图片信息
    api.confirm({
        title: '转派',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
            common.post({
                url:config.ZTForwardWorksheetUrl,
                isLoading: true,
                text: "提交中...",
                data:{
                    wsNum : wsNum,
                    remark : remark,
                    paiwangGroupd : paiwangGroupd,
                    paiwangGroupdType : paiwangGroupdType,
                    ws_id : ws_id,
                    imgID : imgID
                },
                success: function (ret) {
                    if (ret.status==='200'){
                        api.toast({
                            msg:  '转派操作成功！',
                            duration: config.duration,
                            location: 'middle'
                        });
                        setTimeout(function(){
                            $api.setStorage(ZT_process_need.entrance, 'yb');
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        },config.successDuration);
                    } else {
                        var msg = '转派操作失败！'
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
