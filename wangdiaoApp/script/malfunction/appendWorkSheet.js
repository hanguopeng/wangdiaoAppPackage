var inputId = '';
var zpdxId = "";
var csdxId = "";
var zpdxType = "";
var csdxType = "";
apiready = function() {
    initSelect()

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
        } else if (inputId == "csdx") {
            csdxId = id;
            csdxType = type;
        }

        $api.rmStorage(storageKey.data_id);
        $api.rmStorage(storageKey.data_name);
        $api.rmStorage(storageKey.data_type);
    });
}

//动态加载select
function initSelect(){
    common.post({
        url : config.getAllIdUrl  ,
        isLoading:false,
        data:{
            parentdictid:parentdictid.appendWorksheet
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
                        msg:'没有可用的追派类型！'
                    })
                }
            }else {
                api.toast({
                    msg: '获取追派类型失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
function openWin(id) {
    inputId = id;
    api.openWin({
        name: 'tag_tree',
        bounces: false,
        slidBackEnabled : false,
        reload:true,
        url: '../../html/main/my_tree.html',
        vScrollBarEnabled:true,
        hScrollBarEnabled:false

    });

}

function save() {
    var chuliGroupd = csdxId;                                       //抄送对象
    var chuliGroupdType = csdxType;                                        //抄送对象类型
    var dispose_way = $("#disposeWay option:selected").val();         //追派类型
    if(common.isEmpty(dispose_way)){
        api.toast({
            msg: '请选择追派类型',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }

    var paiwangGroupd = zpdxId;                                     //追派对象
    var paiwangGroupdType = zpdxType;                                     //追派对象类型
    if( common.isEmpty(paiwangGroupd)){
        api.toast({
            msg: '请选择追派对象',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }

    var wsNum = $api.getStorage(storageKey.wsNum);                  //工单号
    var processId = $api.getStorage(storageKey.processId);          //流程id
    var remark = $api.trim($api.val($api.byId('remark')));            //追派原因

    api.confirm({
        title: '追派',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
            common.post({
                url: config.GZ_checkWorksheetForForward,
                isLoading: true,
                data:{
                    paiwangGroupd:paiwangGroupd,
                    paiwangGroupdType:paiwangGroupdType
                },
                success: function (ret) {
                    if(ret.flag1 === 'isNull'){
                        api.toast({
                            msg: '您选择的派发对象：部门【'+ret.dept+'】中，不存在人员,请重新选择并派发！',
                            duration: 2000,
                            location: 'middle'
                        });
                        return;
                    }
                    if(ret.flag === 'nook'){
                        api.toast({
                            msg: '您选择的派发对象：人员【'+ret.user+'】在所选的部门【'+ret.dept+'】中，请重新选择并派发!',
                            duration: 2000,
                            location: 'middle'
                        });
                        return;
                    }else{
                        common.post({
                            url:config.appendWorksheetUrl,
                            isLoading: true,
                            text: "提交中...",
                            data:{
                                wsNum : wsNum,
                                remark : remark,
                                paiwangGroupd : paiwangGroupd,
                                paiwangGroupdType : paiwangGroupdType,
                                processId : processId,
                                chuliGroupd : chuliGroupd,
                                chuliGroupdType : chuliGroupdType,
                                dispose_way : dispose_way
                            },
                            success: function (ret) {
                                if (ret.status==='200'){
                                    api.toast({
                                        msg:  '追派操作成功！',
                                        duration: config.duration,
                                        location: 'middle'
                                    });
                                    setTimeout(function(){
                                        common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                                    },config.successDuration);
                                } else {
                                    var msg = '追派操作失败！'
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
