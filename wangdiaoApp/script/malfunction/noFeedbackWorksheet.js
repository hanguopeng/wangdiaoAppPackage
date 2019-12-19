var startTime;
apiready = function() {
    initSelect();
}
//动态加载select
function initSelect(){
    var wsNum = $api.getStorage(storageKey.wsNum);              //工单号
    var processId = $api.getStorage(storageKey.processId);      //流程id
    var ws_id = $api.getStorage(storageKey.wsId);      //工单id
    common.post({
        url:config.noDealFeedBackWorksheetDetailUrl,
        isLoading:false,
        data:{
            wsNum: wsNum,
            processId: processId,
            ws_id: ws_id
        },
        success:function(ret) {
            if (ret&&ret.status==='200'&&ret.data) {
                var data = ret.data;
                startTime = data.date2
                $api.val($api.byId('recTime'), data.date3);//派发时间
                $api.val($api.byId('fdsj_input'), data.date);//返单时间
                $api.val($api.byId('clls_input'), data.date1);//处理总历时
                $api.val($api.byId('suspendLast'), data.date6);//挂起历时
                $api.val($api.byId('dmhappTime'), data.date2);//故障开始时间
                $api.val($api.byId('busrecDate'), data.date5);//业务恢复时间
                $api.val($api.byId('dmdeallast'), data.date4);//故障历时

            }
        }
    })
}

function save() {
    var wsNum = $api.getStorage(storageKey.wsNum);              //工单号
    var processId = $api.getStorage(storageKey.processId);      //流程id
    var ws_id = $api.getStorage(storageKey.wsId);      //流程id

    var remark = $api.trim($api.val($api.byId('remark')));            //故障处理过程及故障原因描述
    if (common.isEmpty(remark)) {
        api.toast({
            msg: '故障处理过程及故障原因描述不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var rectime = $api.trim($api.val($api.byId('recTime')));            //处理总历时
    var suspendlast = $api.trim($api.val($api.byId('suspendLast')));            //挂起历时
    var dmhapptime = $api.trim($api.val($api.byId('dmhappTime')));            //挂起历时
    var dmdeallast = $api.trim($api.val($api.byId('dmdeallast')));            //故障历时
    var busrecDate = $api.trim($api.val($api.byId('busrecDate')));            //业务恢复时间
    api.confirm({
        title: '确认未排除返单',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
            common.post({
                url : config.noDealFeedBackWorksheetCommitUrl,
                isLoading: true,
                text: "提交中...",
                data:{
                    wsNum: wsNum,
                    processId: processId,
                    ws_id: ws_id,
                    reason: '',
                    remark: remark,
                    rectime: rectime,
                    suspendlast: suspendlast,
                    dmhapptime: dmhapptime,
                    dmdealLast: dmdeallast,
                    busrecDate: busrecDate,
                    imgID:''
                },
                success: function (ret) {
                    if (ret.status==='200'){
                        api.toast({
                            msg:  '未排除返单操作成功！',
                            duration: config.duration,
                            location: 'middle'
                        });
                        setTimeout(function(){
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        },config.successDuration);
                    } else {
                        var msg = '未排除返单操作失败！'
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
}
function picker(id){
    api.openPicker({
        type: 'date',
        title: '开始时间'
    }, function(ret, err){
        var hYear = ret.year;
        var hMonth = ret.month;
        var hDay = ret.day;
        api.openPicker({
            type: 'time',
            title: '开始时间'
        }, function(ret, err){
            var hh = ret.hour;
            var hmin = ret.minute;
            var hDate = hYear + "-" + (hMonth<10? "0"+hMonth:hMonth) + "-" + (hDay<10?"0"+hDay:hDay) + " " +(hh<10?"0"+hh:hh) + ":" + (hmin<10?"0"+hmin:hmin) + ":00";

            if (id==='busrecDate'){
                if (new Date(hDate.replace(/-/g,"/")).getTime()<new Date(startTime.replace(/-/g,"/")).getTime()){
                    alert('业务恢复时间不能小于故障开始时间')
                    return ;
                }else{
                    $api.val($api.byId(id),hDate);
                    calculateGzls(hDate)
                }
            }else{
                $api.val($api.byId(id),hDate);
            }
        });
    });
}
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
    $api.val($api.byId('dmdeallast'),gzls);
}

