var menuFlag = false;
var initMenuFlag;
var params;
var list;
var currentTab = 0;
var tabList = ['tab-worksheet-info','tab-flow-info']
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
    });

    //加载操作菜单
    initMenu();

    keyBackListener();

    loadWorksheetAndFlowInfo();

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

function changeTab(obj) {
    pageDispose()
    var auiActive = $api.hasCls(obj, 'tab-active');
    if (!auiActive) {
        $api.removeCls($api.byId('tab-worksheet-info'), 'tab-active');
        $api.removeCls($api.byId('tab-flow-info'), 'tab-active');
        $api.addCls(obj, 'tab-active');
    }
    var dataTo = $api.attr(obj, 'data-to');
    if (dataTo === "worksheet-info") {
        var worksheetInfo = doT.template($api.text($api.byId('worksheet-info')));
        $api.html($api.byId('workSheetDetail'), worksheetInfo(params));
    } else if (dataTo === "flow-info") {
        var flowInfo = doT.template($api.text($api.byId('flow-info')));
        $api.html($api.byId('workSheetDetail'), flowInfo(params.tasList));

    }
}
function loadWorksheetAndFlowInfo() {
    //加载工单信息时，重新画一下基础信息数据
    var wsNum = $api.getStorage(storageKey.wsNum);
    common.post({
        url: config.ZTWorksheetDetailUrl,
        isLoading: true,
        data:{
            wsNum:wsNum
        },
        success: function (ret) {
            if (ret.status === '200'){
                params = ret.data
                //每次刷新工单信息，把工单id存到storage里
                $api.setStorage(storageKey.wsId,  ret.data.wsId);
                machineData()
                $api.html($api.byId('orangeRectangleInfo'), "");
                var baseInfo = doT.template($api.text($api.byId('base-info')));
                $api.html($api.byId('orangeRectangleInfo'), baseInfo(params));
                $api.html($api.byId('workSheetDetail'), '');
                var flowInfo = doT.template($api.text($api.byId('flow-info')));
                // 页面doT的写法比较不好看，所以这里处理一下派往人或者是抄送人
                for (var i=0; i<params.tasList.length; i++){
                    var data = params.tasList[i]
                        if (data[11] === null){
                            if(data[57] == '1'){
                                data[1] = data[95]
                            }else if(data[57] === null){
                                if(data[5] === 'subrole'){
                                    data[1] = data[95]
                                }else{
                                    data[1] = data[90]
                                }
                            }
                        }else{
                            data[1] = data[89]
                            if(data[2] === '抄送'){
                                if(data[72] === null){
                                    data[1] = common.isEmpty(data[90])?data[1]:data[1] + "(" + data[90] + ")"
                                }else{
                                    data[1] = common.isEmpty(data[97])?data[1]:data[1] + "(" + data[97] + ")"
                                }
                            }else{
                                if(data[71] === null){
                                    data[1] = common.isEmpty(data[90])?data[1]:data[1] + "(" + data[90] + ")"
                                }else{
                                    data[1] = common.isEmpty(data[96])?data[1]:data[1] + "(" + data[96] + ")"
                                }
                            }
                        }
                }
                $api.html($api.byId('workSheetDetail'), flowInfo(params.tasList));
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
    var wsNum = $api.getStorage(storageKey.wsNum);
    var processId = $api.getStorage(storageKey.processId);
    if (common.isEmpty(processId)) {
        processId=null
    }
    var entrance = $api.getStorage(ZT_process_need.entrance);
    if (entrance==='gd'||entrance==='cx'){
        return;
    }
    var dealType = $api.getStorage(ZT_process_need.dealType);
    // 建单人待办中的待修改工单，不加载操作权限
    if (dealType === 'DXG'){
        return
    }
    common.post({
        url: config.ZTGetProcessMenu,
        isLoading: true,
        data:{
            wsNum:wsNum,
            processId:processId,
            entrance :entrance,
            dealType :dealType
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
                        key:null,
                    }
                    if(key==='接单开始处理'){
                        data.imgUrl = 'jiedankaishichuli.png';
                        data.pageUrl = 'jiedankaishichuli';
                    }else if(key==='转派'){
                        data.imgUrl = 'zhuanpai.png';
                        data.pageUrl = 'ZT_forwardWorksheet';
                    }else if(key==='返单'){
                        data.imgUrl = 'fandan.png';
                        data.pageUrl = 'ZT_overWorksheet';
                    }else if(key==='确认结单'){
                        data.imgUrl = 'querenjiedan.png';
                        data.pageUrl = 'ZT_confirmFinishWorksheet';
                    }else if(key==='信息追加'){
                        data.imgUrl = 'xinxizhuijia.png';
                        data.pageUrl = 'ZT_appendMessage';
                    }else if(key==='归档'){
                        data.imgUrl = 'guidang.png';
                        data.pageUrl = 'ZT_archiveWorksheet';
                    }else if(key==='退单'){
                        data.imgUrl = 'chongxintuihuichuli.png';
                        data.pageUrl = 'ZT_chargeback';
                    }else if(key==='撤销'){
                        data.imgUrl = 'chongxintuihuichuli.png';
                        data.pageUrl = 'ZT_backout';
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
        var ws_id = $api.getStorage(storageKey.wsId);
        api.confirm({
            title: '接单开始处理',
            msg: '确认接单？',
            buttons: ['确认','取消']
        }, function(retBtn, err) {
            if(retBtn.buttonIndex===1){
                common.post({
                    url: config.ZTProcessWorksheetUrl,
                    isLoading: true,
                    data:{
                        wsNum:wsNum,
                        ws_id:ws_id,
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
function showMenu() {
    var entrance = $api.getStorage(ZT_process_need.entrance);
    if (entrance==='gd'){
        api.toast({
            msg: '已归档的工单没有操作流程菜单！',
            duration: 2000,
            location: 'middle'
        });
        return
    } else if (entrance==='cx'){
        api.toast({
            msg: '查询工单没有操作流程菜单！',
            duration: 2000,
            location: 'middle'
        });
        return
    }
    var dealType = $api.getStorage(ZT_process_need.dealType);
    // 建单人待办中的待修改工单，不加载操作权限
    if (dealType === 'DXG'){
        api.toast({
            msg: '待修改工单没有操作流程菜单！',
            duration: 2000,
            location: 'middle'
        });
        return
    }
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

// 将获取到的工单信息进行处理
function machineData() {
    // 工单状态
    if(params.worksheet.orderState === '1'){
        params.worksheet.orderState = '处理中'
    }else if(params.worksheet.orderState === '2'){
        params.worksheet.orderState = '结单'
    }else if(params.worksheet.orderState === '3'){
        params.worksheet.orderState = '归档'
    }else if(params.worksheet.orderState === '4'){
        params.worksheet.orderState = '挂起'
    }else if(params.worksheet.orderState === '5'){
        params.worksheet.orderState = '撤销'
    }
    // 任务来源
    if(params.worksheet.taskFrom === '1'){
        params.worksheet.taskFrom = '宽带微服务'
    }else if(params.worksheet.taskFrom === '2'){
        params.worksheet.taskFrom = '移网微服务'
    }else if(params.worksheet.taskFrom === '3'){
        params.worksheet.taskFrom = '网络投诉管控'
    }else if(params.worksheet.taskFrom === '4'){
        params.worksheet.taskFrom = '网络自动化'
    }
    // 任务对象类型
    if(params.worksheet.taskType === 'A'){
        params.worksheet.taskType = '聚类点'
    }else if(params.worksheet.taskType === 'B'){
        params.worksheet.taskType = '微网格'
    }else if(params.worksheet.taskType === 'C'){
        params.worksheet.taskType = '基站小区'
    }else if(params.worksheet.taskType === 'D'){
        params.worksheet.taskType = '宽带小区'
    }else if(params.worksheet.taskType === 'E'){
        params.worksheet.taskType = '设备'
    }
}

// 展示选中的流程详情
function showFlowDetail(index,processName) {
    var tasList = params.tasList[index-1]
    // 初始值为其他流程的frame尺寸
    var  x = 30;
    var  y= 230;
    var  w= 300;
    var  h= 150;
    if (processName==='派发'||processName==='转派'||processName==='重新派发'||processName==='抄送'){
        y=200;
        h=200;
    } else if (processName==='撤销'||processName==='接单开始处理'||processName==='信息追加'||
        processName==='归档'||processName==='退单'||processName==='退回重新处理'){
        y=150;
        h=270;
    } else if (processName==='确认结单'||processName==='处理反馈') {
        y=100;
        h=400;
    }
    // 给整体一个遮罩层
    api.openFrame({
        name: 'black',
        url: '../../html/main/black.html',
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
    });
    api.openFrame({ // 打开Frame
        name: 'ZT_flowInfo_detail',
        url: 'ZT_flowInfo_detail.html',
        rect: {
            x: x,
            y: y,
            w: w,
            h: h
        },
        pageParam: {
            tasList: tasList,
            listFeedBack: params.listFeedBack
        },
        bounces: true,
        reload: true,
        vScrollBarEnabled: false
    });

}
