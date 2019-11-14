var menuFlag = false;
var initMenuFlag;
var params;
var list;
var currentTab = 0;
var tabList = ['tab-worksheet-info','tab-malfunction-info','tab-flow-info']
apiready = function () {
    api.parseTapmode();
    //下拉刷新
    api.setRefreshHeaderInfo({
        visible: true,
        bgColor: 'rgba(0,0,0,0)',
        textColor: '#666',
        textDown: '下拉刷新',
        textUp: '释放刷新',
        showTime: false
    }, function () {
        api.refreshHeaderLoadDone(); //复位下拉刷新
        window.location.reload();
    });
    //监听操作完成事件 刷新流程菜单
    api.addEventListener({
        name: 'process_success_reload_worksheet_detail'
    },function () {
        $api.setStorage(storageKey.operate_status,'operate_success');
        window.location.reload();
    })
    //加载操作菜单
    keyBackListener();

    loadAllInfo();

    // 监控左划事件
    api.addEventListener({
        name:'swipeleft'
    }, function(ret, err){
        if (currentTab === 2){
            currentTab = 2
        } else {
            currentTab = currentTab + 1
        }
        var id = tabList[currentTab]
        changeTab($api.dom('#'+id))
    });
    // 监控右划事件
    api.addEventListener({
        name:'swiperight'
    }, function(ret, err){
        if (currentTab === 0){
            currentTab = 0
        } else {
            currentTab = currentTab - 1
        }
        var id = tabList[currentTab]
        changeTab($api.dom('#'+id))
    });
};


var loadAllInfo = function () {
    //加载工单信息、故障信息、流传信息
    loadWorksheetAndMalfunctionInfo();
    loadFlowInfo();
};

function changeTab(obj) {
    pageDispose()
    var auiActive = $api.hasCls(obj, 'tab-active');
    if (!auiActive) {
        $api.removeCls($api.byId('tab-worksheet-info'), 'tab-active');
        $api.removeCls($api.byId('tab-malfunction-info'), 'tab-active');
        $api.removeCls($api.byId('tab-flow-info'), 'tab-active');
        $api.addCls(obj, 'tab-active');
    }
    var dataTo = $api.attr(obj, 'data-to');
    if (dataTo === "worksheet-info") {
        var worksheetInfo = doT.template($api.text($api.byId('worksheet-info')));
        $api.html($api.byId('workSheetDetail'), worksheetInfo(params));
    } else if (dataTo === "malfunction-info") {
        var malfunctionInfo = doT.template($api.text($api.byId('malfunction-info')));
        $api.html($api.byId('workSheetDetail'), malfunctionInfo(params));
    } else if (dataTo === "flow-info") {
        var flowInfo = doT.template($api.text($api.byId('flow-info')));
        $api.html($api.byId('workSheetDetail'), flowInfo(list));

    }
}
function loadWorksheetAndMalfunctionInfo() {
    //加载工单信息时，重新画一下基础信息数据
    var wsNum = $api.getStorage(storageKey.wsNum);
    common.post({
        url: config.worksheetDetailUrl,
        isLoading: true,
        data:{
            wsNum:wsNum
        },
        success: function (ret) {
            if (ret.status === '200'){
                params = ret.data
                initMenu();
                //每次刷新工单信息，把工单id存到storage里
                $api.setStorage(storageKey.wsId,  ret.data.wsId);
                $api.html($api.byId('orangeRectangleInfo'), "");
                var baseInfo = doT.template($api.text($api.byId('base-info')));
                $api.html($api.byId('orangeRectangleInfo'), baseInfo(params));

            }else{
                api.toast({
                    msg: '工单详情获取失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
function loadFlowInfo() {
    var wsNum = $api.getStorage(storageKey.wsNum);
    var processId = $api.getStorage(storageKey.processId);
    common.post({
        url: config.flowInfoUrl,
        isLoading: true,
        data:{
            wsNum:wsNum,
            processId:processId
        },
        success: function (ret) {
            if (ret.status === '200'){
                var params = ret.data;
                list = []
                for (var K in params){
                    if (K !== 'size'){
                        list.push(params[K])
                    }
                }
                $api.html($api.byId('workSheetDetail'), "");
                var flowInfo = doT.template($api.text($api.byId('flow-info')));
                $api.html($api.byId('workSheetDetail'), flowInfo(list));
            }else{
                api.toast({
                    msg: '流转信息获取失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}
function keyBackListener() {
    api.addEventListener({
        name: 'keyback'
    }, function () {
        common.closeAndReloadAppointPage('reload_worksheet_manage');
    })
}
function openAppointPage(name){
    if (name===null){
        api.toast({
            msg: '此功能暂未开放！',
            duration: config.duration,
            location: 'middle'
        });
        return
    }
    api.openWin({
        name: name,
        bounces: false,
        slidBackEnabled : false,
        reload:true,
        url: '../main/' + name + '.html',
        vScrollBarEnabled:true,
        hScrollBarEnabled:false
    });
}

function initMenu() {
    common.post({
        url: config.getProcessMenu,
        isLoading: true,
        data:{
            wsNum: params.wsNum,
            dmpro: params.dmProId,
            dealType: params.dealType,
            flag:params.flag,
            entrance: params.entrance,
            processId: params.processId,
            dkh: params.jk
        },
        success: function (ret) {
            if(ret&&ret.content){
                var params = ret.content;
                var list = []
                for (var K in params){
                    var key =   params[K].key
                    var data  = {
                        imgUrl:null,
                        pageUrl:null,
                        key:null
                    }
                    if(key==='接单开始处理'){  // 测试通过
                        data.imgUrl = 'jiedankaishichuli.png';
                        data.pageUrl = 'jiedankaishichuli';
                    }else if(key==='转派'){
                        data.imgUrl = 'zhuanpai.png';
                        data.pageUrl = 'forwardWorksheet';
                    }else if(key==='追派'){
                        data.imgUrl = 'zhuipai.png';
                        data.pageUrl = 'appendWorkSheet';
                    }else if(key==='返单'){
                        data.imgUrl = 'fandan.png';
                        data.pageUrl = 'overWorksheet';
                    }else if(key==='确认结单'){
                        data.imgUrl = 'querenjiedan.png';
                        data.pageUrl = 'confirmFinishWorksheet';
                    }else if(key==='信息追加'){  //测试通过
                        data.imgUrl = 'xinxizhuijia.png';
                        data.pageUrl = 'appendMessage';
                    }else if(key==='挂起申请'){
                        data.imgUrl = 'guaqishenqing.png';
                        data.pageUrl = 'suspendApplication';
                    }
                    // else if(key==='挂起审核'){
                    //     data.imgUrl = 'guaqishenhe.png';
                    //     data.pageUrl = 'suspendAudit';
                    // }
                    else if(key==='阶段回复'){
                        data.imgUrl = 'jieduanhuifu.png';
                        data.pageUrl = 'stageResponse';
                    }else if(key==='退回重新处理'){
                        data.imgUrl = 'tuihuichongxinchuli.png';
                        data.pageUrl = 'returnToreProcessing';
                    }else if(key==='归档'){
                        data.imgUrl = 'guidang.png';
                        data.pageUrl = 'archiveWorksheet';
                    }else if(key==='未排除返单'){
                        data.imgUrl = 'fandan.png';
                        data.pageUrl = 'noFeedbackWorksheet';
                    }

                    if(data.imgUrl!=null){
                        data.key = key
                        list.push(data)
                    }
                }
                if (list.length>0){
                    $api.html($api.byId('activityMenu'), "");
                    var menuInfo = doT.template($api.text($api.byId('menu-info')));
                    $api.html($api.byId('activityMenu'), menuInfo(list));
                } else{
                    api.toast({
                        msg: '当前工单没有可操作流程！',
                        duration: config.duration,
                        location: 'middle'
                    });
                }
                initMenuFlag = true;
            }else{
                api.toast({
                    msg: '获取操作菜单失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }

        }
    });
}


function openProcessWin(name) {
    if (name === 'jiedankaishichuli'){
        var wsNum = $api.getStorage(storageKey.wsNum);
        var processId = $api.getStorage(storageKey.processId);
        api.confirm({
            title: '接单开始处理',
            msg: '确认接单？',
            buttons: ['确认','取消']
        }, function(retBtn, err) {
            if(retBtn.buttonIndex===1){
                common.post({
                    url: config.processWorksheetUrl,
                    isLoading: true,
                    data:{
                        wsNum:wsNum,
                        processId:processId
                    },
                    success: function (ret) {
                        if (ret&&ret.status==='200'){
                            api.toast({
                                msg:  '接单开始处理操作成功！',
                                duration: config.duration,
                                location: 'middle'
                            });
                            setTimeout(function(){
                                common.reloadAppointPage('process_success_reload_worksheet_detail');
                            },config.successDuration);
                        } else {
                            // 因为返回的错误信息是英文，所有没有单独显示错误信息。
                            var msg = '接单开始处理操作失败！'
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
    } else{
        pageDispose();
        api.openWin({
            name: name,
            bounces: false,
            slidBackEnabled : false,
            reload:true,
            url: './' + name + '.html',
            vScrollBarEnabled:true,
            hScrollBarEnabled:false
        });
    }
}

/**
 * 点击工单基础信息部分，对页面细节进行处理，暂时是去掉流程菜单弹窗
 */
function pageDispose() {//点击橙色区域影藏操作菜单
    //获取要显示的div对象
    var menu = $api.byId('activityMenu');
    //显示
    menu.style.display="none";
}
/*function showMenu() {//点击菜单按钮显示操作菜单
    //获取要显示的div对象
    var menu = $api.byId('activityMenu');
    //显示
    menu.style.display="block";
}*/
function showMenu() {
    if(initMenuFlag){
        var menu = $api.byId('activityMenu');
        //显示
        menu.style.display="block";
        frameFlag = true;
    }else{
        if(menuFlag){
            var menu = $api.byId('activityMenu');
            //显示
            menu.style.display="block";
        }else{
            api.toast({
                msg: '操作流程菜单加载中，请稍后...',
                duration: 2000,
                location: 'middle'
            });
        }

    }
}
