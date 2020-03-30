var worksheet='wait';
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
    getWaitAndEndCount();
    getWaitWorkSheetList();
    //监听keyback返回事件
    api.addEventListener({
        name: 'reload_worksheet_manage'
    },function () {
        var operate_status = $api.getStorage(storageKey.operate_status);
        if (operate_status&&operate_status === "operate_success") {
            window.location.reload();
            $api.setStorage(storageKey.operate_status,"");
        }
    })
    //监听关闭指定名称页面
    api.addEventListener({
        name: "close_GZ_worksheet_manage"
    }, function () {
        api.closeFrame()
    })
    //监听工单查询跳转到跳转到列表
    api.addEventListener({
        name: "open_GZ_AllWorksheet_List"
    },  function () {
        getSearchWorkSheetList();
    });
    //监听刷新指定名称页面
    api.addEventListener({
        name: "reload_GZ_worksheet_manage"
    }, function () {
        refresh()
    })
    $api.setStorage(storageKey.process_choose_pageName, "GZ_worksheet_manage");//当前页面名称
};
//下拉刷新
function refresh() {
    api.refreshHeaderLoadDone(); //复位下拉刷新
    getWaitAndEndCount();
    if (worksheet === 'wait') {
        getWaitWorkSheetList();
    } else if (worksheet === 'end') {
        getEndWorkSheetList()
    } else if (worksheet === 'archive') {
        getArchiveSheetList()
    } else if (worksheet === 'worksheet_search') {
        getSearchWorkSheetList()
    }
}


function getWaitAndEndCount() {
    var time = this.computationTimeSubAMonth()
    common.post({
        url: config.waitAndEndWorksheet+"&dmHapTime="+time,
        isLoading: true,
        success: function (ret) {
            var params = []
            if (ret.status=='200'){
                params = ret.data;
                if (params.wait > 99){
                    params.wait = '99+'
                }
                if (params.end > 99){
                    params.end = '99+'
                }
                if (params.archive > 99){
                    params.archive = '99+'
                }
            }
            $api.html($api.byId('allProcessCountInfo'), "");
            var allProcessCountInfo = doT.template($api.text($api.byId('all-process-count-info')));
            $api.html($api.byId('allProcessCountInfo'), allProcessCountInfo(params));
        }
    });
}
function getWaitWorkSheetList() {
    worksheet='wait'
    var time = this.computationTimeSubAMonth()
    common.post({
        url: config.waitWorksheetListUrl+"&dmHapTime="+time,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('workSheetDetail'), "");
            if (ret.status=='200'){
                var params = [];
                params.list = ret.data
                for (var i=0; i<params.list.length; i++){
                    var info = params.list[i]
                    if (info.level === '1010201'){
                        info.level = 'red'
                    }else if (info.level === '1010202'){
                        info.level = 'orange'
                    }else if (info.level === '1010203'){
                        info.level = 'yellow'
                    }else if (info.level === '1010204'){
                        info.level = 'blue'
                    }else{
                        info.level = '#f9f9f9'
                    }
                    if(info.worksheetStatus === '1'){
                        if(info.dealStatus === '0'){
                            if(info.dealType === 'FKCL'){
                                info.worksheetStatus = '待接单'
                            }else if(info.dealType === 'JG'){
                                info.worksheetStatus = '待解除挂起'
                            }else if(info.dealType === 'QRJD'){
                                info.worksheetStatus = '待确认结单'
                            }else if(info.dealType === 'GQSH'){
                                info.worksheetStatus = '待挂起审核'
                            }else if(info.dealType === 'CS'){
                                info.worksheetStatus = '待抄送确认'
                            }else if(info.dealType === 'GQPF'){
                                info.worksheetStatus = '待挂起批复'
                            }else if(info.dealType === 'FDSH'){
                                info.worksheetStatus = '待退单审核'
                            }else {
                                info.worksheetStatus = ''
                            }
                        }else if(info.worksheetStatus === '1'){
                            if(info.dealType === 'YJD'){
                                info.worksheetStatus = '已接单'
                            }else if(info.dealType === 'FKCL'){
                                info.worksheetStatus = '待返单'
                            }else if(info.dealType === 'JG'){
                                info.worksheetStatus = '解除挂起'
                            }else if(info.dealType === 'QRJD'){
                                info.worksheetStatus = '确认结单'
                            }else if(info.dealType === 'GQSH'){
                                info.worksheetStatus = '挂起审核'
                            }else if(info.dealType === 'CS'){
                                info.worksheetStatus = '抄送确认'
                            }else if(info.dealType === 'GQPF'){
                                info.worksheetStatus = '挂起批复'
                            }else if(info.dealType === 'FDSH'){
                                info.worksheetStatus = '退单审核'
                            }else {
                                info.worksheetStatus = ''
                            }
                        }else {
                            info.worksheetStatus = ''
                        }
                    }else if(info.worksheetStatus === '4'){
                        info.worksheetStatus = '挂起中'
                    }else{
                        info.worksheetStatus = ''
                    }
                    if (info.worksheetTitle && info.worksheetTitle.length>45){
                        info.worksheetTitle = info.worksheetTitle.substring(0,45)+ "..."
                    }
                }
                params.title='待办工单列表'
                var worksheetDetail = doT.template($api.text($api.byId('wait-worksheet-detail')));
                $api.html($api.byId('workSheetDetail'), worksheetDetail(params));
            }else{
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
    var time = this.computationTimeSubAMonth()
    common.post({
        url: config.endWorksheetListUrl+"&dmHapTime="+time,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('workSheetDetail'), "");
            if (ret.status=='200'){
                var params = [];
                params.list = ret.data
                for (var i=0; i<params.list.length; i++){
                    var info = params.list[i]
                    if (info.level === '1010201'){
                        info.level = 'red'
                    }else if (info.level === '1010202'){
                        info.level = 'orange'
                    }else if (info.level === '1010203'){
                        info.level = 'yellow'
                    }else if (info.level === '1010204'){
                        info.level = 'blue'
                    }else{
                        info.level = '#f9f9f9'
                    }
                    if(info.worksheetStatus === '1'){
                        info.worksheetStatus = '处理中'
                    }else if(info.worksheetStatus === '2'){
                        info.worksheetStatus = '结单'
                    }else if(info.worksheetStatus === '3'){
                        info.worksheetStatus = '归档'
                    }else if(info.worksheetStatus === '4'){
                        info.worksheetStatus = '挂起'
                    }else if(info.worksheetStatus === '5'){
                        info.worksheetStatus = '撤销'
                    }else{
                        info.worksheetStatus = ''
                    }
                    if (info.worksheetTitle && info.worksheetTitle.length>45){
                        info.worksheetTitle = info.worksheetTitle.substring(0,45)+ "..."
                    }
                }
                params.title='已办工单列表'
                var worksheetDetail = doT.template($api.text($api.byId('end-worksheet-detail')));
                $api.html($api.byId('workSheetDetail'), worksheetDetail(params));
            }else{
                api.toast({
                    msg: '已办工单列表获取失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });


}
function getArchiveSheetList() {
    worksheet = 'archive'
    var time = this.computationTimeSubAMonth()
    common.post({
        url: config.archiveWorksheetListListUrl+"&dmHapTime="+time,
        isLoading: true,
        success: function (ret) {
            $api.html($api.byId('workSheetDetail'), "");
            if (ret.status == '200') {
                var params = [];
                params.list = ret.data
                for (var i = 0; i < params.list.length; i++) {
                    var info = params.list[i]
                    if (info.wsTitle && info.wsTitle.length > 45) {
                        info.wsTitle = info.wsTitle.substring(0, 45) + "..."
                    }
                }
                params.title = '归档工单列表'
                var worksheetDetail = doT.template($api.text($api.byId('archive-worksheet-detail')));
                $api.html($api.byId('workSheetDetail'), worksheetDetail(params));
            }else{
                api.toast({
                    msg: '归档工单列表失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    });


}
function getSearchWorkSheetList() {

    worksheet = 'worksheet_search';
    var data = $api.getStorage(storageKey.Query_Worksheet_List);
    var params = [];
    params.list = data.data;
    for (var i = 0; i < params.list.length; i++) {
        var info = params.list[i];
        if (info.ORDER_STATE === '0') {
            info.ORDER_STATE = '待派发'
        } else if (info.ORDER_STATE === '1') {
            info.ORDER_STATE = '处理中'
        } else if (info.ORDER_STATE === '2') {
            info.ORDER_STATE = '结单'
        } else if (info.ORDER_STATE === '3') {
            info.ORDER_STATE = '归档'
        } else if (info.ORDER_STATE === '4') {
            info.ORDER_STATE = '挂起'
        } else if (info.ORDER_STATE === '5') {
            info.ORDER_STATE = '撤销'
        }

    }
    params.title = '工单查询';
    var worksheetDetail = doT.template($api.text($api.byId('search-worksheet-detail')));
    $api.html($api.byId('workSheetDetail'), worksheetDetail(params));

    $api.setStorage(storageKey.process_choose_pageName, "ZT_worksheet_manage");//当前页面名称
}

function openWorksheetDetail(worksheetNo,processId,worksheetTitle) {
    $api.setStorage(storageKey.wsNum, worksheetNo);
    $api.setStorage(storageKey.processId, processId);
    $api.setStorage(storageKey.wsTitle, worksheetTitle);
    api.openWin({
        name: 'worksheet_detail',
        bounces: false,
        slidBackEnabled : false,
        reload:true,
        url: './worksheet_detail.html',
        vScrollBarEnabled:true,
        hScrollBarEnabled:false
    });
}

function showOrClose(obj) {
    var isShow = $api.hasCls($api.next(obj), 'aui-show');
    if (isShow) {
        $api.removeCls($api.next(obj), 'aui-show');
        $api.addCls($api.next(obj), 'aui-hide');
    }else{
        $api.removeCls($api.next(obj), 'aui-hide');
        $api.addCls($api.next(obj), 'aui-show');
    }
}

function computationTimeSubAMonth(){
    var date=new Date();
    var newDate = new Date(date - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
    var year = newDate.getFullYear();
    var month = newDate.getMonth()+1;
    var day = newDate.getDate();
    return year + "-" + month + "-" + day +" 00:00:00";
}


