var wsNum = "";
var wsTitle = "";


var alarmregion = "";
var alarmMaintainunit = "";
var dmHapTime = "";
var dmHapTimee = "";
var orderstate = "";
apiready = function() {
    initDmPro();
    initDmLevel()
    initCity();//加载地市
    if (!common.isEmpty(alarmregion)) {
        initArea();//加载区县
    }
};
//时间函数
jeDate("#startTime",{
    language:enLang,
    format: "YYYY-MM-DD hh:mm:ss"
});
jeDate("#endTime",{
    language:enLang,
    format: "YYYY-MM-DD hh:mm:ss"
});

function save() {

    wsNum =  $api.trim($api.val($api.byId('wsNum')));               //工单号
    wsTitle = $api.trim($api.val($api.byId('wsTitle')));            //工单主题

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

//动态加载故障专业
function initDmPro(){
    common.post({
        url : config.getAllIdUrl  ,
        isLoading:false,
        data:{
            parentdictid:parentdictid.overWorksheet_malfunctionSpecialty
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
                    $api.html($api.byId('dm_pro'), "");
                    var dm_pro = doT.template($api.text($api.byId('pro')));
                    $api.html($api.byId('dm_pro'), dm_pro(params));
                }else {
                    api.alert({
                        msg:'没有可用的故障专业！'
                    })
                }
            }else {
                api.toast({
                    msg: '获取故障专业失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
//动态加载故障级别
function initDmLevel(){
    common.post({
        url : config.getAllIdUrl  ,
        isLoading:false,
        data:{
            parentdictid:parentdictid.GZ_worksheet_search_level
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
                    $api.html($api.byId('dm_level'), "");
                    var dm_level = doT.template($api.text($api.byId('level')));
                    $api.html($api.byId('dm_level'), dm_level(params));
                }else {
                    api.alert({
                        msg:'没有可用的故障级别！'
                    })
                }
            }else {
                api.toast({
                    msg: '获取故障级别失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
function initCity() {
    common.post({
        url : config.getAllIdUrl ,
        isLoading:false,
        data:{
            parentdictid:parentdictid.ZT_worksheet_search_city,
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
                    $api.html($api.byId('selCity'), "");
                    var selCity = doT.template($api.text($api.byId('city')));
                    $api.html($api.byId('selCity'), selCity(params));
                }else {
                    api.alert({
                        msg:'没有可用的地市！'
                    })
                }
            }else {
                api.toast({
                    msg: '获取地市失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
function initArea() {
    var id = $("#selCity option:selected").val();               //当前选择地市id
    common.post({
        url : config.getAllIdUrl ,
        isLoading:false,
        data:{
            parentdictid:id,
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
                    $api.html($api.byId('selArea'), "");
                    var selArea = doT.template($api.text($api.byId('area')));
                    $api.html($api.byId('selArea'), selArea(params));
                }else {
                    api.alert({
                        msg:'没有可用的区县！'
                    })
                }
            }else {
                api.toast({
                    msg: '获取区县失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
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
//关闭当前页
function closeFrame(){
    common.sendEvent("close_BlackFrame");
    api.closeFrame()

}




