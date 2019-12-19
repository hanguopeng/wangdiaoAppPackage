var startTime;
var initialPro;
var ywht_time;//业务恢复时间
apiready = function() {
    initSelect();
}
//动态加载select
function initSelect(){
    var wsNum = $api.getStorage(storageKey.wsNum);              //工单号
    var processId = $api.getStorage(storageKey.processId);      //流程id
    common.post({
        url:config.overWorksheetDetailUrl,
        isLoading:false,
        data:{
            wsNum: wsNum,
            processId: processId
        },
        success:function(ret) {
            if (ret&&ret.status==='200'&&ret.data) {
                var data = ret.data;
                startTime = data.date2
                initialPro = data.pro
                ywht_time = data.date5;
                $api.val($api.byId('clls_input'), data.date1);//处理总历时
                $api.val($api.byId('gqls_input'), data.date6);//挂起历时
                $api.val($api.byId('gzkqsj_input'), data.date2);//故障开启时间
                $api.val($api.byId('ywhfsj_input'), data.date5);//业务恢复时间
                $api.val($api.byId('clsfcs_sel'), data.timeout);//处理是否超时
                $api.val($api.byId('fdsj_input'), data.date);//返单时间
                $api.val($api.byId('pfsj_input'), data.date3);//派发时间
                $api.val($api.byId('gzls_input'), data.date4);//故障历时
                if (data.timeout==='是'){    //超时显示超时原因
                    $api.addCls($api.byId('csyy'),'aui-show')
                }
                if (data.pro==='1010101'){   //移动专业显示路由信息
                    $api.addCls($api.byId('lyxx'),'aui-show')
                } else if (data.pro==='1010103') {
                    $api.addCls($api.byId('sfywqz'),'aui-show');
                    $api.addCls($api.byId('wz'),'aui-show');
                    isBusinessAllStop();
                    dealFkPosition();
                }
                ifDeptMalfunction();
                malfunctionArea();
                malfunctionReasonKeyword(data.pro);
                ifInfluenceProfessionalWork();
                malfunctionSpecialty(data.pro);
            }
        }
    })
}
function changeStar() {
    var isexclude = $("#bbmgz-sel option:selected").val();                  //是否本部门故障
    if (isexclude&&isexclude=='1010902') {//选择否
        //获取
        var list = document.getElementsByName('star')
        for(var i = 0, l = list.length; i < l; i++) {
            var objTemp = list[i];
            objTemp.style.color = 'white';
        }
    } else if (isexclude&&isexclude=='1010901') {//选择是
        //获取
        var list = document.getElementsByName('star')
        for(var i = 0, l = list.length; i < l; i++) {
            var objTemp = list[i];
            objTemp.style.color = 'red';
        }
    }
    //获取是否影响业务的值，无论是否本部门故障，如果影响业务为否，业务影响范围都不必填
    var yxywSel = $("#yxyw-sel option:selected").val();
    if (yxywSel&&yxywSel==='1011001'){  //影响业务
        $api.byId('yxfwAreaStar').style.color = 'red'
    } else {  //不影响业务 或者为空
        $api.byId('yxfwAreaStar').style.color = 'white'
    }
}

function save() {
    var wsNum = $api.getStorage(storageKey.wsNum);              //工单号
    var processId = $api.getStorage(storageKey.processId);      //流程id

    var isexclude = $("#bbmgz-sel option:selected").val();                  //是否本部门故障
    if (common.isEmpty(isexclude)) {
        api.toast({
            msg: '请选择是否本部门故障！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var isDeptMalfunction = this.isDeptMalfunction(isexclude);   //是否本部门故障
    var dm_pro =$("#gzzy-sel option:selected").val();                        //故障专业
    if (common.isEmpty(dm_pro)) {
        api.toast({
            msg: '请选择故障专业！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var reasonKey = $("#gzyygjz-sel option:selected").val();                //故障原因关键字
    if (common.isEmpty(reasonKey)) {
        api.toast({
            msg: '请选择故障原因关键字！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var area = $("#gzqy-sel option:selected").val();                        //故障区域
    if (isDeptMalfunction&&common.isEmpty(area)) {
        api.toast({
            msg: '请选择故障区域！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var timeout =$api.trim($api.val($api.byId('clsfcs_sel')));               //处理是否超时
    var timeoutReason = $api.trim($api.val($api.byId('csyy_area')));         //超时原因
    if (timeout==='是'&&isDeptMalfunction&&common.isEmpty(timeoutReason)) {
        api.toast({
            msg: '超时原因不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var reason = $api.trim($api.val($api.byId('gzyy_area')));               //故障原因
    if (isDeptMalfunction&&common.isEmpty(reason)) {
        api.toast({
            msg: '故障原因不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var infbus = $("#yxyw-sel option:selected").val();                      //是否影响业务
    var influence =  $api.trim($api.val($api.byId('yxfw_area')));           //业务影响范围
    if (isDeptMalfunction&&common.isEmpty(infbus)) {
        api.toast({
            msg: '请选择是否影响业务！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }else{
        if (infbus==='1011001'&&common.isEmpty(influence)) {
            api.toast({
                msg: '影响范围不能为空！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
    }
    var deallast = $api.trim($api.val($api.byId('clls_input')));            //处理总历时
    if (isDeptMalfunction&&common.isEmpty(deallast)) {
        api.toast({
            msg: '处理总历时不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var suspendlast =$api.trim($api.val($api.byId('gqls_input')));           //挂起历时
    if (isDeptMalfunction&&common.isEmpty(suspendlast)) {
        api.toast({
            msg: '挂起历时不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var dmhapptime =$api.trim($api.val($api.byId('gzkqsj_input')));          //故障开始时间
    if (isDeptMalfunction&&common.isEmpty(dmhapptime)) {
        api.toast({
            msg: '故障开始时间不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var busrecDate=$api.trim($api.val($api.byId('ywhfsj_input')));           //业务恢复时间
    if (isDeptMalfunction&&common.isEmpty(busrecDate)) {
        api.toast({
            msg: '请选择业务恢复时间！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var dealdate =$api.trim($api.val($api.byId('fdsj_input')));              //返单时间
    if (isDeptMalfunction&&common.isEmpty(dealdate)) {
        api.toast({
            msg: '返单时间不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var rectime = $api.trim($api.val($api.byId('pfsj_input')));;                        //派发时间
    if (isDeptMalfunction&&common.isEmpty(rectime)) {
        api.toast({
            msg: '派发时间不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    if (dm_pro=="1010103") {
        var isBusinessAllStop =$("#sfywqz_sel option:selected").val();                        //是否业务全阻
        if (infbus==='1011001'&&common.isEmpty(isBusinessAllStop)) {
            api.toast({
                msg: '请选择是否业务全阻！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var dealFkPosition =$("#wz_sel option:selected").val();                                 //位置
        if (infbus==='1011001'&&common.isEmpty(dealFkPosition)) {
            api.toast({
                msg: '请选择位置！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
    }
    var remark = $api.trim($api.val($api.byId('clgcms_area')));             //处理过程描述
    if (common.isEmpty(remark)) {
        api.toast({
            msg: '处理过程描述不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var dmdeallast = $api.trim($api.val($api.byId('gzls_input')));           //故障历时
    if (isDeptMalfunction&&common.isEmpty(dmdeallast)) {
        api.toast({
            msg: '故障历时不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var routeinfo =$api.trim($api.val($api.byId('lyxx_input')));              //路由信息
    if (initialPro==='1010101'&&common.isEmpty(routeinfo)) {
        api.toast({
            msg: '路由信息不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var imgID = "";                         //图片信息
    api.confirm({
        title: '确认返单',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
            common.post({
                url: config.GZ_checkWorksheet ,
                isLoading: true,
                data:{
                    wsNum:wsNum,
                    operateType: 'CLFK',
                    isexclude: isexclude
                },
                success: function (ret) {
                    if(ret.returnvar === '0'){
                        common.post({
                            url : config.overWorksheetCommitUrl,
                            isLoading: true,
                            text: "提交中...",
                            data:{
                                wsNum: wsNum,
                                processId: processId,
                                isexclude: isexclude,
                                area: area,
                                reasonKey: reasonKey,
                                reason: reason,
                                infbus: infbus,
                                influence: influence,
                                deallast: deallast,
                                suspendlast: suspendlast,
                                dmhapptime: dmhapptime,
                                busrecDate: busrecDate,
                                timeout: timeout,
                                timeoutReason: timeoutReason,
                                dealdate: dealdate,
                                dm_pro: dm_pro,
                                remark: remark,
                                imgID: imgID,
                                dmdeallast: dmdeallast,
                                rectime: rectime,
                                routeinfo: routeinfo,
                                isBusinessAllStop:isBusinessAllStop,
                                dealFkPosition:dealFkPosition,
                            },
                            success: function (ret) {
                                if (ret.status==='200'){
                                    api.toast({
                                        msg:  '返单操作成功！',
                                        duration: config.duration,
                                        location: 'middle'
                                    });
                                    setTimeout(function(){
                                        common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                                    },config.successDuration);
                                } else {
                                    var msg = '返单操作失败！'
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
                        return;
                    }else if(ret.returnvar === '1'){
                        api.toast({
                            msg: '此工单已撤销!',
                            duration: 2000,
                            location: 'middle'
                        });
                        return;
                    }else if(ret.returnvar === '4'){
                        api.toast({
                            msg: '告警未清除,不能进行处理反馈!',
                            duration: 2000,
                            location: 'middle'
                        });
                        return;
                    }else if(ret.returnvar === '2'){
                        api.toast({
                            msg: '此工单已挂起!',
                            duration: 2000,
                            location: 'middle'
                        });
                        return;
                    }else if(ret.returnvar === '3'){
                        api.toast({
                            msg: data.message,
                            duration: 2000,
                            location: 'middle'
                        });
                        return;
                    }else if(ret.returnvar === '6'){
                        api.toast({
                            msg: '告警未清除,不能进行处理反馈!',
                            duration: 2000,
                            location: 'middle'
                        });
                        return;
                    }
                }
            });
        }
    });
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

//是否是本部门故障
function ifDeptMalfunction() {
    common.post({
        url:config.getAllIdUrl,
        isLoading:false,
        data:{
            parentdictid: parentdictid.overWorksheet_ifDeptMalfunction
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
                    $api.html($api.byId('bbmgz-sel'), "");
                    var disposeWay = doT.template($api.text($api.byId('bbmgz-selector')));
                    $api.html($api.byId('bbmgz-sel'), disposeWay(params));
                }else {
                    api.alert({
                        msg:'没有可用的是否本部门故障类型！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}

//故障区域获取
function malfunctionArea() {
    common.post({
        url:config.getAllIdUrl,
        isLoading:false,
        data:{
            parentdictid: parentdictid.overWorksheet_malfunctionArea
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
                    $api.html($api.byId('gzqy-sel'), "");
                    var disposeWay = doT.template($api.text($api.byId('type-selector')));
                    $api.html($api.byId('gzqy-sel'), disposeWay(params));
                }else {
                    api.alert({
                        msg:'没有可用的故障区域！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取故障区域失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
//故障原因关键字
function malfunctionReasonKeyword(pro) {
    var keyWord =  '1010199'+pro.substring(5)
    common.post({
        url: config.overWorksheetGetKeyWordUrl,
        isLoading: false,
        data: {
            dmProSub: keyWord
        },
        success: function (ret) {
            if (ret) {
                if (ret.length > 0) {
                    $api.html($api.byId('gzyygjz-sel'), "");
                    var disposeWay = doT.template($api.text($api.byId('gjz-selector')));
                    $api.html($api.byId('gzyygjz-sel'), disposeWay(ret));
                } else {
                    api.alert({
                        msg: '没有可用的故障原因关键字！'
                    })
                }
            } else {
                api.toast({
                    msg: '获取故障原因关键字失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    })
}
//是否影响业务
function ifInfluenceProfessionalWork() {
    common.post({
        url:config.getAllIdUrl,
        isLoading:false,
        data:{
            parentdictid: parentdictid.overWorksheet_ifInfluenceProfessionalWork
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
                    $api.html($api.byId('yxyw-sel'), "");
                    var disposeWay = doT.template($api.text($api.byId('yxyw-selector')));
                    $api.html($api.byId('yxyw-sel'), disposeWay(params));
                }else {
                    api.alert({
                        msg:'没有可用的！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
//故障专业
function malfunctionSpecialty(pro) {
    common.post({
        url:config.getAllIdUrl,
        isLoading:false,
        data:{
            parentdictid: parentdictid.overWorksheet_malfunctionSpecialty
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
                        nameList:[],
                        pro:pro
                    }
                    params.idList = strId
                    params.nameList = strName
                    $api.html($api.byId('gzzy-sel'), "");
                    var disposeWay = doT.template($api.text($api.byId('gzzy-selector')));
                    $api.html($api.byId('gzzy-sel'), disposeWay(params));
                }else {
                    api.alert({
                        msg:'没有可用的故障专业！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取故障专业失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    })
}
//当故障专业变化时，修改故障原因关键字
function changeKeyword() {
    var dm_pro =$("#gzzy-sel option:selected").val();
    malfunctionReasonKeyword(dm_pro)
}

function isDeptMalfunction(id) {
    if (id==='1010902') { //不是本部门故障
        return false
    }else{
        return true
    }
}
//传输专业-显示-业务全阻
function isBusinessAllStop() {
    common.post({
        url:config.getAllIdUrl,
        isLoading:false,
        data:{
            parentdictid:parentdictid.overWorksheet_isBusinessAllStop
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
                        nameList:[],
                    }
                    params.idList = strId
                    params.nameList = strName
                    $api.html($api.byId('sfywqz_sel'), "");
                    var disposeWay = doT.template($api.text($api.byId('sfywqz-selector')));
                    $api.html($api.byId('sfywqz_sel'), disposeWay(params));
                }else {
                    api.alert({
                        msg:'没有可用的是否业务全阻！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取是否业务全阻失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    })
}
//传输专业-显示-位置
function dealFkPosition() {
    common.post({
        url:config.getAllIdUrl,
        isLoading:false,
        data:{
            parentdictid: parentdictid.overWorksheet_dealFkPosition
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
                        nameList:[],
                    }
                    params.idList = strId
                    params.nameList = strName
                    $api.html($api.byId('wz_sel'), "");
                    var disposeWay = doT.template($api.text($api.byId('wz-selector')));
                    $api.html($api.byId('wz_sel'), disposeWay(params));
                }else {
                    api.alert({
                        msg:'没有可用的位置！'
                    })
                }
            }else{
                api.toast({
                    msg: '获取位置失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    })
}

