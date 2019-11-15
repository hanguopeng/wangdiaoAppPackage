var wsNum = "";
var wsTitle = "";
var taskOrderNbr = "";
var source = "";
var objectType = "";
var alarmregion = "";
var alarmMaintainunit = "";
var dmHapTime = "";
var dmHapTimee = "";
var orderstate = "";
apiready = function() {
    api.addEventListener({
        name: 'close_ZTWorksheet_search'
    }, function () {
        api.closeFrame({
            name:'worksheet_search'
        });
    })
};
//时间函数
jeDate("#startTime",{
    language:enLang,
    format: "YYYY-MM-DD hh:mm:ss",
    donefun : function(obj){    //回调函数
        var endTime = new Date(($api.val($api.byId('endTime'))).replace(/-/g,"/")).getTime();
        var startTime = new Date(obj.val.replace(/-/g,"/")).getTime();

        if (endTime< startTime) {
            alert('结束时间不能小于开始时间');
            $api.val($api.byId('startTime'), "");//开始时间
        }
    }
});
jeDate("#endTime",{
    language:enLang,
    format: "YYYY-MM-DD hh:mm:ss",
    donefun : function(obj){    //回调函数
        var startTime = new Date(($api.val($api.byId('startTime'))).replace(/-/g,"/")).getTime();
        var endTime = new Date(obj.val.replace(/-/g,"/")).getTime();

        if (endTime< startTime) {
            alert('结束时间不能小于开始时间');
            $api.val($api.byId('endTime'), "");//结束时间
        }
    }
});

function save() {

    wsNum =  $api.trim($api.val($api.byId('wsNum')));               //工单号
    wsTitle = $api.trim($api.val($api.byId('wsTitle')));            //工单主题
    taskOrderNbr = $api.trim($api.val($api.byId('taskOrderNbr')));  //任务单编号
    source = $("#source option:selected").val();                       //任务来源
    alarmregion = $("#selCity option:selected").val();                //地市
    alarmMaintainunit =  $("#selArea option:selected").val();         //区县
    dmHapTime = $api.trim($api.val($api.byId('startTime')));      //开始时间
    dmHapTimee = $api.trim($api.val($api.byId('endTime')));      //结束时间
    common.post({
        url: config.ZTTaskAllWorksheetList,
        isLoading: true,
        data:{
            wsNum:wsNum,
            wsTitle:wsTitle,
            taskOrderNbr:taskOrderNbr,
            source:source,
            objectType:objectType,
            alarmregion:alarmregion,
            alarmMaintainunit:alarmMaintainunit,
            dmHapTime:dmHapTime,
            dmHapTimee:dmHapTimee,
            orderstate:orderstate,
        },
        success: function (ret) {

            $api.html($api.byId('workSheetDetail'), "");
            if (ret.status == '200') {
                $api.setStorage(storageKey.Query_Worksheet_List,ret);
                closeFrame();
                common.sendEvent("open_ZT_TaskAllWorksheet_List");

            } else {
                api.toast({
                    msg: '工单列表获取失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }

    });
}
function closeFrame(){
    common.sendEvent("close_BlackFrame");
    api.closeFrame({
        name:'worksheet_search'
    });

}
//加载区县
function changeArea(cityId) {
    if(!common.isEmpty(cityId)){
        common.post({
            url : config.ZTWorksheetSearchArea ,
            isLoading:false,
            data:{
                cityId :cityId
            },
            success : function(ret){
                if(!common.isEmpty(ret)){
                    $api.html($api.byId('selArea'), "");
                    var selArea = doT.template($api.text($api.byId('area')));
                    $api.html($api.byId('selArea'), selArea(ret));
                }else {
                    api.toast({
                        msg: '获取区县失败！',
                        duration: config.duration,
                        location: 'middle'
                    });
                }
            }
        });
    } else {
        $api.html($api.byId('selArea'), "");
    }
}
//选择地市后才可以选择区县
function AlertMessage() {
    var id = $("#selCity option:selected").val();               //当前选择地市id
    if (common.isEmpty(id)) {
        api.toast({
            msg: '请选择地市！',
            duration: config.duration,
            location: 'middle'
        })
    }
}






