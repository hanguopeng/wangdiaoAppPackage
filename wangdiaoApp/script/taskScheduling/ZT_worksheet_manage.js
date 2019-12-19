var worksheet = 'wait';
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
        refresh();
    });
    getWaitEndArchiveCount();
    getWaitWorkSheetList();
    //监听keyback返回事件
    api.addEventListener({
        name: 'reload_worksheet_manage'
    }, function () {
        var operate_status = $api.getStorage(storageKey.operate_status);
        if (operate_status && operate_status === "operate_success") {
            window.location.reload();
            $api.setStorage(storageKey.operate_status, "");
        }
    });
    //监听关闭指定名称页面
    api.addEventListener({
        name: "close_ZT_worksheet_manage"
    }, function () {
        api.closeFrame()
    })
    //监听工单查询跳转到跳转到列表
    api.addEventListener({
        name: "open_ZT_TaskAllWorksheet_List"
    }, function () {
        getSearchWorkSheetList();
    });
    //监听刷新指定名称页面
    api.addEventListener({
        name: "reload_ZT_worksheet_manage"
    }, function () {
        refresh()
    });
    $api.setStorage(storageKey.process_choose_pageName, "ZT_worksheet_manage");//当前页面名称
};

//下拉刷新
function refresh() {
    api.refreshHeaderLoadDone(); //复位下拉刷新
    getWaitEndArchiveCount();
    if (worksheet === 'wait') {
        getWaitWorkSheetList();
    } else if (worksheet === 'end') {
        getEndWorkSheetList()
    } else if (worksheet === 'archive') {
        getArchiveWorksheetList()
    } else if (worksheet === 'worksheet_search') {
        getSearchWorkSheetList()
    }
}


function getWaitEndArchiveCount() {
    common.post({
        url: config.ZTWaitEndArchiveCount,
        isLoading: true,
        success: function (ret) {
            var params = [];
            if (ret.status == '200') {
                params = ret.data;
                if (params.wait && params.wait > 99) {
                    params.wait = '99+'
                }
                if (params.haven && params.haven > 99) {
                    params.end = '99+'
                } else {
                    params.end = params.haven
                }
                if (params.file && params.file > 99) {
                    params.archive = '99+'
                } else {
                    params.archive = params.file
                }
            }
            $api.html($api.byId('allProcessCountInfo'), "");
            var allProcessCountInfo = doT.template($api.text($api.byId('all-process-count-info')));
            $api.html($api.byId('allProcessCountInfo'), allProcessCountInfo(params));
        }
    });
}

function getWaitWorkSheetList() {
    worksheet = 'wait';
    common.post({
        url: config.ZTWaitWorksheetUrl,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('workSheetDetail'), "");
            if (ret.status == '200') {
                var params = ret.data
                for (var i = 0; i < params.list.length; i++) {
                    var info = params.list[i]
                    // 计算处理历时
                    info.clls = calculateClls(info.wsCreatDate)
                    if (info.orderState === '1') {
                        if (info.dealStatus === '0') {
                            if (info.dealType === 'FKCL') {
                                info.orderState = '待接单'
                            } else if (info.dealType === 'JG') {
                                info.orderState = '待解除挂起'
                            } else if (info.dealType === 'QRJD') {
                                info.orderState = '待确认结单'
                            } else if (info.dealType === 'GQSH') {
                                info.orderState = '待挂起审核'
                            } else if (info.dealType === 'CS') {
                                info.orderState = '待抄送确认'
                            } else if (info.dealType === 'GQPF') {
                                info.orderState = '待挂起批复'
                            } else if (info.dealType === 'TD') {
                                if (info.sendUserId !== params.dispose_man){
                                    info.orderState = '待接单'
                                }else{
                                    //此处将dealType设置为DXG，在传递到detail页的时候不加载操作权限
                                    info.dealType = 'DXG'
                                    info.orderState = '待修改工单'
                                }
                            } else {
                                info.orderState = ''
                            }
                        } else if (info.dealStatus === '1') {
                            if (info.dealType === 'YJD') {
                                info.orderState = '已接单'
                            } else if (info.dealType === 'FKCL') {
                                info.orderState = '待返单'
                            } else if (info.dealType === 'JG') {
                                info.orderState = '解除挂起'
                            } else if (info.dealType === 'QRJD') {
                                info.orderState = '确认结单'
                            } else if (info.dealType === 'GQSH') {
                                info.orderState = '挂起审核'
                            } else if (info.dealType === 'CS') {
                                info.orderState = '抄送确认'
                            } else if (info.dealType === 'GQPF') {
                                info.orderState = '挂起批复'
                            } else if (info.dealType === 'FDSH') {
                                info.orderState = '退单审核'
                            } else if (info.dealType === 'DGD') {
                                info.orderState = '待归档'
                            } else {
                                info.orderState = ''
                            }
                        }else {
                            info.orderState = ''
                        }
                    } else if (info.orderState === '4') {
                        info.orderState = '挂起中'
                    } else {
                        info.orderState = ''
                    }
                    if (info.wsTitle && info.wsTitle.length > 45) {
                        info.wsTitle = info.wsTitle.substring(0, 45) + "..."
                    }
                }
                params.title = '待办工单列表'
                var worksheetDetail = doT.template($api.text($api.byId('wait-worksheet-detail')));
                $api.html($api.byId('workSheetDetail'), worksheetDetail(params));
            } else {
                api.toast({
                    msg: '待办工单列表获取失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });

}

function getEndWorkSheetList() {
    worksheet = 'end'
    common.post({
        url: config.ZTEndWorksheetListUrl,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('workSheetDetail'), "");
            if (ret.status == '200') {
                var params = [];
                params.list = ret.data
                for (var i = 0; i < params.list.length; i++) {
                    var info = params.list[i]
                    // 计算处理历时
                    info.clls = calculateClls(info.wsCreatDate)
                    if (info.orderState === '1') {
                        info.orderState = '处理中'
                    } else if (info.orderState === '2') {
                        info.orderState = '结单'
                    } else if (info.orderState === '3') {
                        info.orderState = '归档'
                    } else if (info.orderState === '4') {
                        info.orderState = '挂起'
                    } else if (info.orderState === '5') {
                        info.orderState = '撤销'
                    } else {
                        info.orderState = ''
                    }
                    if (info.wsTitle && info.wsTitle.length > 45) {
                        info.wsTitle = info.wsTitle.substring(0, 45) + "..."
                    }
                }
                params.title = '已办工单列表'
                var worksheetDetail = doT.template($api.text($api.byId('end-worksheet-detail')));
                $api.html($api.byId('workSheetDetail'), worksheetDetail(params));
            } else {
                api.toast({
                    msg: '已办工单列表获取失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });
}

function getArchiveWorksheetList() {
    worksheet = 'archive'
    common.post({
        url: config.ZTArchiveWorksheetListListUrl,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('workSheetDetail'), "");
            if (ret.status == '200') {
                var params = [];
                params.list = ret.data
                for (var i = 0; i < params.list.length; i++) {
                    var info = params.list[i]
                    // 计算处理历时
                    info.clls = calculateClls(info.wsCreatDate)
                    if (info.wsTitle && info.wsTitle.length > 45) {
                        info.wsTitle = info.wsTitle.substring(0, 45) + "..."
                    }
                }
                params.title = '归档工单列表'
                var worksheetDetail = doT.template($api.text($api.byId('archive-worksheet-detail')));
                $api.html($api.byId('workSheetDetail'), worksheetDetail(params));
            } else {
                api.toast({
                    msg: '归档工单列表获取失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });


}
function getSearchWorkSheetList() {
    worksheet = 'taskAllWorksheetList';
    var data = $api.getStorage(storageKey.Query_Worksheet_List);
    var params = [];
    params.list = data.data;
    for (var i = 0; i < params.list.length; i++) {
        var info = params.list[i];
        if (info.orderState === '0') {
            info.orderState = '待派发'
        } else if (info.orderState === '1') {
            info.orderState = '处理中'
        } else if (info.orderState === '2') {
            info.orderState = '结单'
        } else if (info.orderState === '3') {
            info.orderState = '归档'
        } else if (info.orderState === '4') {
            info.orderState = '挂起'
        } else if (info.orderState === '5') {
            info.orderState = '撤销'
        }
        //处理历时
        info.clls = calculateClls(info.wsCreatDate)
        if (info.wsTitle && info.wsTitle.length > 45) {
            info.wsTitle = info.wsTitle.substring(0, 45) + "..."
        }
    }
    params.title = '工单查询';
    var worksheetDetail = doT.template($api.text($api.byId('search-worksheet-detail')));
    $api.html($api.byId('workSheetDetail'), worksheetDetail(params));

    $api.setStorage(storageKey.process_choose_pageName, "ZT_worksheet_manage");//当前页面名称
}

function openWorksheetDetail(worksheetNo, processId, worksheetTitle, entrance, dealType) {
    $api.setStorage(storageKey.wsNum, worksheetNo);
    $api.setStorage(storageKey.processId, processId);
    $api.setStorage(storageKey.wsTitle, worksheetTitle);
    $api.setStorage(ZT_process_need.entrance, entrance);
    $api.setStorage(ZT_process_need.dealType, dealType);
    api.openWin({
        name: 'ZT_worksheet_detail',
        bounces: false,
        slidBackEnabled: false,
        reload: true,
        url: './ZT_worksheet_detail.html',
        vScrollBarEnabled: true,
        hScrollBarEnabled: false
    });
}

function showOrClose(obj) {
    var isShow = $api.hasCls($api.next(obj), 'aui-show');
    if (isShow) {
        $api.removeCls($api.next(obj), 'aui-show');
        $api.addCls($api.next(obj), 'aui-hide');
    } else {
        $api.removeCls($api.next(obj), 'aui-hide');
        $api.addCls($api.next(obj), 'aui-show');
    }
}

//比较业务恢复时间和故障开启时间的差
function calculateClls(date) {
    var currentTime = new Date().getTime();
    var createdTime = new Date(date.replace(/-/g,"/")).getTime();
    var timeDifference = currentTime-createdTime;
    var hour = (timeDifference / 3600000).toFixed(2);
    return  hour+"小时";

}
