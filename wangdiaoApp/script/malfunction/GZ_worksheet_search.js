apiready = function() {
    initCity();
    initDmPro();
    initDmLevel();
    api.addEventListener({
        name: 'close_GZWorksheet_search'
    }, function () {
        api.closeFrame({
            name: 'GZ_worksheet_search'
        });
    })
};
var now = new Date();
//时间函数
jeDate("#startTime",{
    language:enLang,
    format: "YYYY-MM-DD hh:mm:ss",
    isinitVal:true,
    initDate:[{DD:"-7",hh:-now.getHours(),mm:-now.getMinutes(),ss:-now.getSeconds()},true],   //初始化时间
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
    isinitVal:true,
    initDate:[{hh:23,mm:59,ss:59},false],   //初始化日期
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
    common.post({
        url: config.allWorksheetList,
        isLoading: true,

        data:{
            wsNum:$api.trim($api.val($api.byId('wsNum'))),//工单号
            wsTitle:$api.trim($api.val($api.byId('wsTitle'))),
            dm_pro:$("#dm_pro option:selected").val(),//故障专业
            dm_level:$("#dm_level option:selected").val(),//故障响应级别
            orderType:$("#objectType option:selected").val(),//工单类型
            alarmregion:$("#selCity option:selected").val(),//地市
            alarmMaintainunit:$("#selArea option:selected").val(), //区县
            dmHapTime:$api.trim($api.val($api.byId('startTime'))),//开始时间
            dmHapTimee:$api.trim($api.val($api.byId('endTime'))),//结束时间
            orderstate:$("#orderstate option:selected").val(),//工单状态
        },
        success: function (ret) {

            $api.html($api.byId('workSheetDetail'), "");
            if (ret.status == '200') {
                $api.setStorage(storageKey.Query_Worksheet_List,ret);
                closeFrame();
                common.sendEvent("open_GZ_AllWorksheet_List");

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
//加载地市
function initCity() {

    common.post({
        url : config.getAllIdUrl  ,
        isLoading:false,
        data:{
            parentdictid:parentdictid.ZT_worksheet_search_city
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
                    var city = doT.template($api.text($api.byId('city')));
                    $api.html($api.byId('selCity'), city(params));
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
//加载区县
function initArea(cityId) {
    if (!common.isEmpty(cityId)) {
        common.post({
            url : config.getAllIdUrl  ,
            isLoading:false,
            data:{
                parentdictid:cityId
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
                        var area = doT.template($api.text($api.byId('area')));
                        $api.html($api.byId('selArea'), area(params));
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
function closeFrame(){
    common.sendEvent("close_BlackFrame");
    api.closeFrame({
        name:'GZ_worksheet_search'
    });

}




