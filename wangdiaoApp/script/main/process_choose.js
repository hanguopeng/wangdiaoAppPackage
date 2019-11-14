apiready = function () {
    $("#txt").bind("keyup",function(){
        txtchange();
    });
};
var data = {id:"0,1",title:"故障处理,中台",name: "0001-故障工单,0002-任务调度"};
var strTitle = (data.title).split(",");//字符分割;
var strId  = (data.id).split(",");    //字符分割;
var strName = (data.name).split(",");    //字符分割;
var params = {
    titleList:[],
    idList:[],
    nameList:[],
};
params.titleList = strTitle;
params.idList = strId;
params.nameList = strName;
$api.html($api.byId('box'), "");
var process = doT.template($api.text($api.byId('type-selector')));
$api.html($api.byId('box'), process(params));

function txtchange() {
    var textObj= $("#txt").val();//输入框值

    strTitle = (data.title).split(",");//字符分割;
    strId  = (data.id).split(",");     //字符分割;
    strName = (data.name).split(",");  //字符分割;
    params = {
        titleList:[],
        idList:[],
        nameList:[],
    }
    for (var i = 0 ; i < strTitle.length ; i++) {
        if (strTitle[i].indexOf(textObj) != -1 || strName[i].indexOf(textObj) != -1) {
            params.titleList.push(strTitle[i]);
            params.idList.push(i);
            params.nameList.push(strName[i]);
        }else{
            //无匹配值
            $api.html($api.byId('box'), "");
        }
    }
    $api.html($api.byId('box'), "");
    process = doT.template($api.text($api.byId('type-selector')));
    $api.html($api.byId('box'), process(params));
    //输入值为空
    if (common.isEmpty(textObj)) {
        data = {id:"0,1",title:"故障处理,中台",name: "0001-故障工单,0002-任务调度"};

        strTitle = (data.title).split(",");//字符分割;
        strId  = (data.id).split(",");    //字符分割;
        strName = (data.name).split(",");    //字符分割;
        params = {
            titleList:[],
            idList:[],
            nameList:[],
        }
        params.titleList = strTitle;
        params.idList = strId;
        params.nameList = strName;
        $api.html($api.byId('box'), "");
        process = doT.template($api.text($api.byId('type-selector')));
        $api.html($api.byId('box'), process(params));
    }
}
//点击获取值
function hideGetVal(obj){
    var pageName = JSON.stringify(obj);
    if (pageName.indexOf("故障工单") != -1 || pageName.indexOf("0001") != -1) {
        $("#txt").val("")
        $("#txt").val("0001-故障工单")
    } else if (pageName.indexOf("任务调度") != -1|| pageName.indexOf("0002") != -1) {
        $("#txt").val("")
        $("#txt").val("0002-任务调度")
    }
}
function confirm(){

    var InputText= $("#txt").val();//输入框值
    var header_h = $api.getStorage("win_header_height");
    var footer_h = $api.getStorage("win_footer_height");
    var pageName = $api.getStorage("process_choose_pageName");
    if(common.isEmpty(InputText)){
        api.toast({
            msg: '请输入流程！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    if (InputText.indexOf("0001-故障工单") != -1 ) {
        if (pageName&&pageName == "GZ_worksheet_manage") {
            common.reloadAppointPage("reload_GZ_worksheet_manage");
            closeFrame();//关闭当前frame 和遮罩层

        }else {
            //发送监听 关闭其他frame页
            common.sendEvent("close_ZT_worksheet_manage");
            common.sendEvent("close_GZ_worksheet_manage");

            api.openFrame({ // 打开Frame
                name: 'GZ_worksheet_manage',
                url: '../../html/malfunction/GZ_worksheet_manage.html',
                rect: {
                    x: 0,
                    y: parseInt(header_h) + 10, // 头部留位置
                    w: 'auto',
                    h: api.winHeight - parseInt(header_h) - parseInt(footer_h) - 10
                },
                bounces: true,
                reload: true,
                vScrollBarEnabled: false
            });
            closeFrame();//关闭当前frame 和遮罩层
        }
    } else if (InputText.indexOf("0002-任务调度") != -1) {
        if (pageName&&pageName == "ZT_worksheet_manage") {
            common.reloadAppointPage("reload_ZT_worksheet_manage");
            closeFrame();//关闭当前frame 和遮罩层

        }else {
            //发送监听 关闭其他frame页
            common.sendEvent("close_ZT_worksheet_manage");
            common.sendEvent("close_GZ_worksheet_manage");
            api.openFrame({ // 打开Frame
                name: 'ZT_worksheet_manage',
                url: '../../html/taskScheduling/ZT_worksheet_manage.html',
                rect: {
                    x: 0,
                    y: parseInt(header_h) + 10, // 头部留位置
                    w: 'auto',
                    h: api.winHeight - parseInt(header_h) - parseInt(footer_h) - 10
                },
                bounces: true,
                reload: true,
                vScrollBarEnabled: false
            });
            closeFrame();//关闭当前frame
        }
    }
}
//关闭 遮罩层
function closeFrame(){
    common.sendEvent("close_BlackFrame");
    api.closeFrame({
        name:'process_choose'
    });



}