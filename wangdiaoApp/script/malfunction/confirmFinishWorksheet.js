var wsNum = $api.getStorage(storageKey.wsNum);       //工单号
var processId = $api.getStorage(storageKey.processId);
var json;
var dm_pro;  //故障专业字典值
var isDept;  //是否本部门字典值
var area;  //故障区域字典值
var reasonKey; //故障原因关键字字典值
var infbus;  //是否影响业务字典值
var dmdeallast1;  //故障历时字典值
var suspendlast1;  //挂起历时
var objectNum ;
var objectParams;
var objectName ;
var initObjectFlag = false;
var startTime;  // 故障开启时间
var pitchOnProcessId;   //选中的流程id
var ywht_time;//业务恢复时间
apiready = function () {
    initObject();
    api.addEventListener({
        name:'closeSelectFrame'
    },function(ret,err){
        if(ret&&ret.value){
            $api.html($api.byId('fddx-div'), '');
            var conTmpl = doT.template($api.text($api.byId('confirm_finsh_ws')));
            $api.html($api.byId('fddx-div'), conTmpl(ret.value));
            objectName = ret.value.objectName
            pitchOnProcessId = ret.value.pitchOnProcessId
            common.post({
                url: config.accountWorksheetDetail,
                isLoading:true,
                data:{
                    wsNum:wsNum,
                    processId:pitchOnProcessId
                },
                success: function (ret) {
                    if (ret && ret.data && ret.data.json1) {
                        var str = JSON.stringify(ret).replace(/\\|\//g, '');
                        str = str.replace('"{', '{');
                        str = str.replace('}"', '}');
                        json = $api.strToJson(str)
                        json = json.data.json1;
                        ywht_time= json.DM_RESTART_TIME;
                        //根据字典值判断是否
                        if (json.ISEXCLUDE === '1010901') {
                            $api.val($api.byId('bbmgz-sel'), '是');
                        } else {
                            $api.val($api.byId('bbmgz-sel'), '否');
                        }
                        isNotNull("gzqy_input",json.AREANAME)
                        isNotNull("gzgjz_input",json.REASON_KEY_NAME)
                        isNotNull("gzyy_input",json.REASON)
                        isNotNull("yxyw-sel",json.INFBUSNAME)
                        isNotNull("jdsj_input",json.RECTIME)
                        isNotNull("gzls_input",json.DMDEALLAST)
                        isNotNull("gzzy_input",json.DMPRONAME)
                        isNotNull("yxfw_input",json.INFLUENCE)
                        isNotNull("ywhfsj_input",json.DM_RESTART_TIME)
                        isNotNull("fdsj_input",json.DEALDATE)
                        isNotNull("clzls_input",json.DEALLAST)
                        isNotNull("gqls_input",json.SUSPEND_TIME_COUNT)
                        isNotNull("gzkqsj_input",json.DM_START_TIME)
                        isNotNull("clsfcs_sel",json.TIMEOUT)
                        startTime = json.DM_START_TIME
                        if (json.TIMEOUT === '是') {
                            $api.removeCls($api.byId('csyy_div'), 'aui-hide');
                        }
                        isNotNull("csyy_area",json.TIMEOUT_REASON)
                        isNotNull("clgcms_area",json.REMARK)
                        if(json.PRO === "1010101"){
                            $api.attr($api.byId("toute_Info"), 'class', 'aui-show');
                        }
                        isNotNull("lyxx_input",json.ROUTEINFO)
                        api.hideProgress();
                        dm_pro = json.PRO;  //故障专业字典值
                        isDept = json.ISEXCLUDE;  //是否本部门字典值
                        area = json.AREA;  //故障区域字典值
                        reasonKey = json.REASON_KEY; //故障原因关键字字典值
                        infbus = json.INFBUS;  //是否影响业务字典值
                        dmdeallast1 = '';  //故障历时字典值
                        suspendlast1 = json.SUSPEND_TIME_COUNT;  //挂起历时
                    }
                }
            })
        }
    })
}
function isNotNull(id,data){
    if(data =="null"||data===""){
        $api.val($api.byId(id), "");
    }else{
        $api.val($api.byId(id), data);
    }

}
//获取对象
function submitData() {
    var area_name = $api.trim($api.val($api.byId('gzqy_input')));//故障区域
    var reasonKey_name = $api.trim($api.val($api.byId('gzgjz_input')));//故障原因关键字
    var reason1 = $api.trim($api.val($api.byId('gzyy_input')));//故障原因
    var infbus_name = $api.trim($api.val($api.byId('yxyw-sel')));//是否影响业务
    var dmdeallast = $api.trim($api.val($api.byId('gzls_input')));  //故障历时
    var influence1 = $api.trim($api.val($api.byId('yxfw_input'))); //影响范围
    var deallast1 = $api.trim($api.val($api.byId('clzls_input')));  //处理总历时
    var suspendlast1 = $api.trim($api.val($api.byId('gqls_input')));  //挂起历时
    var dm_start_time = $api.trim($api.val($api.byId('gzkqsj_input'))); //故障开启时间
    var busrecDateStr = $api.trim($api.val($api.byId('ywhfsj_input')));
    var busrecDate = $api.trim($api.val($api.byId('ywhfsj_input')));  //业务恢复时间
    var timeout1 = $api.trim($api.val($api.byId('clsfcs_sel')));  //处理是否超时
    var timeoutReason = $api.trim($api.val($api.byId('csyy_area')));  //超时原因
    var remark = $api.trim($api.val($api.byId('clgcms_area')));  //处理过程描述
    var column6 = $api.trim($api.val($api.byId('jdbz_area')));  //结单备注-------------未确认
    var routeinfo = $api.trim($api.val($api.byId('lyxx_input')));//路由信息

    var fddx = $api.first($api.byId('fddx-div'));
    var eleId = $api.attr(fddx, 'id');
    if(eleId!=="selectDiv"){
        api.toast({
            msg: '请选择返单对象',
            duration: 2000,
            location: 'middle'
        });
    }else if(busrecDateStr===""||busrecDateStr===null){
        api.toast({
            msg: '请选择业务恢复时间',
            duration: 2000,
            location: 'middle'
        });
    }else{
        api.confirm({
            title: '确认结单',
            msg: '是否提交？',
            buttons: ['确定', '取消']
        }, function(retBtn, err) {
            if(retBtn.buttonIndex===1){
                common.post({
                    url: config.GZ_checkWorksheet ,
                    isLoading: true,
                    data:{
                        wsNum:wsNum,
                        type:'QRJD'
                    },
                    success: function (ret) {
                        if(ret.jd&&ret.jd == '5'){
                            api.toast({
                                msg: '此工单已结单请重新刷新列表!',
                                duration: 2000,
                                location: 'middle'
                            });
                        }
                        if(ret.returnvar == '0'){
                            common.post({
                                url: config.confirmFinishWorksheetUrl ,
                                isLoading: false,
                                data:{
                                    wsNum:wsNum,
                                    processId : pitchOnProcessId,
                                    isexclude_name : '',
                                    area_name : area_name,
                                    reason1 : reason1,
                                    reasonKey_name : reasonKey_name,
                                    infbus_name :  infbus_name,
                                    deleteInfo :  '',
                                    busrecDate :  busrecDate,
                                    dmhapptime1 :  dm_start_time,
                                    deallast1 :  deallast1,
                                    suspendlast1 :  suspendlast1,
                                    timeoutReason :  timeoutReason,
                                    timeout1 :  timeout1,
                                    dm_pro :  dm_pro,
                                    isexclude :  isDept,
                                    area :  area,
                                    reasonKey :  reasonKey,
                                    infbus :  infbus,
                                    dmdeallast1 :  dmdeallast,
                                    column6 :  column6,
                                    influence1 :  influence1,
                                    routeinfo :  routeinfo,
                                    remark1 :  remark
                                },
                                success: function (ret) {
                                    if(ret&&ret.status === "200"){
                                        api.toast({
                                            msg:  '确认结单操作成功！',
                                            duration: config.duration,
                                            location: 'middle'
                                        });
                                        setTimeout(function(){
                                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                                        },config.successDuration);
                                    }else{
                                        var msg = '确认结单操作失败！'
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
                        }else if(ret.returnvar == '1'){
                            api.toast({
                                msg: '此工单已撤销!',
                                duration: 2000,
                                location: 'middle'
                            });
                        }else if(ret.returnvar == '2'){
                            api.toast({
                                msg: '此工单已挂起!',
                                duration: 2000,
                                location: 'middle'
                            });
                        }else if(ret.returnvar == '3'){
                            api.toast({
                                msg: ret.message,
                                duration: 2000,
                                location: 'middle'
                            });

                        }else if(ret.returnvar == '4'){
                            api.toast({
                                msg: '确认结单时不允许选择未排除返单的信息,请重新选择派发对象(追派)或退回重新处理!',
                                duration: 2000,
                                location: 'middle'
                            });
                        }else if (ret.returnvar == '7') {
                            api.toast({
                                msg: '告警未清除，不能进行处理反馈!',
                                duration: 2000,
                                location: 'middle'
                            });
                        }
                    }
                });
            }
        });
    }

}
var returnProObj ;
//初始化对象选择下拉选
function initObject() {
    common.post({
        url: config.chooseObjectUrl ,
        isLoading: false,
        data:{
            wsNum:wsNum,
            processId:processId
        },
        success: function (ret) {
            //填写信息
            if (ret && ret.status==='200'&&ret.data) {
                var data = ret.data;
                objectNum = ((data.result).split(";")).length-1 //有几个对象
                var objects = (data.result).split(";")
                var resultArr;    //字符分割;
                var conTmpl = doT.template($api.text($api.byId('confirm_finsh_ws')));
                objectParams = {objectInfo:[]}
                for(var i=0;i<objects.length-1;i++){
                    resultArr = objects[i].split(",");
                    (objectParams.objectInfo).push(resultArr);
                }
                var returnProObjArr = objects[objects.length-2].split(",")
                returnProObj = returnProObjArr[2]
                $api.html($api.byId('fddx-sel'), conTmpl(resultArr));
                initObjectFlag = true;
            } else if (ret && ret.status==='500'){
                api.alert({
                    msg: '存在未返单情况,不允许选择返单对象!'
                })
                return
            } else {
                api.alert({
                    msg: '没有查到信息'
                })
                return
            }
            api.hideProgress();
        }
    });
}
var frameFlag = false;
//获取工单详情
function getWorkSheetDetails() {
    if(initObjectFlag){
        api.openFrame({
            name: 'objectSelectChangeLine',
            url: './objectSelectChangeLine.html',
            rect: {
                x: 50,
                y: 200,
                w: 250,
                h: 80*objectNum
            },
            pageParam: {objectParams:objectParams
            },
        });
        frameFlag = true;
    }else{
        if(frameFlag){
            api.openFrame({
                name: 'objectSelectChangeLine',
                url: './objectSelectChangeLine.html',
                rect: {
                    x: 50,
                    y: 200,
                    w: 250,
                    h: 80*objectNum
                },
                pageParam: {objectParams:objectParams
                },
            });
        }else{
            api.toast({
                msg: '返单对象加载中，请稍后...',
                duration: 2000,
                location: 'middle'
            });
        }

    }
}
//退回重新处理
function openReturnReprocess(){
    var returnName = $api.attr($api.byId('selectDiv'), 'data-name');
    if(returnName===null||returnName===""||returnName===undefined){
        if(initObjectFlag){
            api.openWin({
                name: 'returnToreProcessing',
                url: './returnToreProcessing.html',
                pageParam: {objectName: returnProObj}
            });
        }else{
            api.toast({
                msg: '处理人获取中...',
                duration: 2000,
                location: 'middle'
            });
        }
    }else{
        api.openWin({
            name: 'returnToreProcessing',
            url: './returnToreProcessing.html',
            pageParam: {objectName: objectName}
        });
    }
}
//时间函数
jeDate("#ywhfsj_input",{
    language:enLang,
    format: "YYYY-MM-DD hh:mm:ss",
    donefun : function(obj){    //回调函数

        var ywhfTime = new Date(obj.val.replace(/-/g,"/")).getTime();
        var gzksTime = new Date(startTime.replace(/-/g,"/")).getTime();

        if (ywhfTime< gzksTime) {
            alert('业务恢复时间不能小于故障开始时间');
            $api.val($api.byId('ywhfsj_input'), ywht_time);//业务恢复时间

        }else {
            calculateGzls(obj.val);
        }
    }

});
//比较业务恢复时间和故障开启时间的差
function calculateGzls(date) {
    var ywhfTime = new Date(date.replace(/-/g,"/")).getTime();
    var gzksTime = new Date(startTime.replace(/-/g,"/")).getTime();
    var timeDifference = ywhfTime-gzksTime;
    var day = Math.floor(timeDifference / 86400000);
    timeDifference = timeDifference % 86400000;
    var hour = Math.floor(timeDifference / 3600000);
    timeDifference = timeDifference % 3600000;
    var minute = Math.floor(timeDifference / 60000);
    timeDifference = timeDifference % 60000;
    var second =  Math.floor(timeDifference / 1000);
    var gzls = day+"天"+ hour+"小时"+ minute+"分"+ second + "秒";
    $api.val($api.byId('gzls_input'),gzls);
}
