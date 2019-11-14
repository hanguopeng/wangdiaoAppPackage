var wsNum = $api.getStorage(storageKey.wsNum);       //工单号
var processId = $api.getStorage(storageKey.processId); //流程id
var json;
var initObjectFlag = false;
var userId;
var worksheetDetails;
var sessionUser;
var worksheet_id;
var objectParams;
var objectNum;
var worksheetDeals; //所有返单信息
apiready = function () {
    initWorksheetDetails()
    api.addEventListener({
        name: 'closeSelectFrame'
    }, function (ret, err) {
        $api.html($api.byId('fddx-div'), '');
        var conTmpl = doT.template($api.text($api.byId('confirm_finsh_ws')));
        $api.html($api.byId('fddx-div'), conTmpl(ret.value));
        userId = ret.value.userId
        getWorkSheetDetail()
    })
}

function initWorksheetDetails() {
    common.post({
        url: config.ZTConfirmInitWorksheetDetails,
        isLoading: false,
        data: {
            wsnum: wsNum
        }, success: function (ret) {
            if (ret && ret.status === "200") {
                worksheetDetails = {sheet: ret.data.sheet}
                sessionUser = ret.data.user
                worksheetDeals = {deals:ret.data.deals}
                worksheetDetails.sheet.dealDate = ret.data.feedback.dealDate
                worksheet_id = ret.data.sheet.wsId
                objectParams = ret.data.deals
                objectNum = ret.data.deals.length
                initObjectFlag = true
            } else {
                api.toast({
                    msg: '获取工单信息失败',
                    duration: 2000,
                    location: 'middle'
                });
            }
        }
    })
}

function getWorkSheetDetail() {
    common.post({
        url: config.ZTAccountWorksheetDetail,
        isLoading: true,
        data: {
            wsNum: wsNum,
            processId: processId,
            userId: userId,
        }, success: function (ret) {
            if (ret) {
                if (ret.reasonType === "1") {
                    ret.reasonTypeStr = "建设类"
                    ret.beSolutionStr = "是否有解决方案"

                } else if (ret.reasonType === "3") {
                    ret.reasonTypeStr = "优化类"
                    ret.beSolutionStr = "是否有解决方案"

                } else {
                    ret.reasonTypeStr = "维护类"
                    ret.beSolutionStr = "故障是否修复"
                    ret.beSolution = ret.isexclude
                }
                var conTmpl = doT.template($api.text($api.byId('confirm-tmpl')))
                $api.html($api.byId('container'), conTmpl(ret))
                switch (ret.judge) {
                    case '11':
                        ret.judge = '无覆盖';
                        break;
                    case '12':
                        ret.judge = '弱覆盖';
                        break;
                    case '13':
                        ret.judge = '扩容';
                        break;
                    case '21':
                        ret.judge = '故障';
                        break;
                    case '22':
                        ret.judge = '搬迁';
                        break;
                    case '23':
                        ret.judge = 'OLT-中继拥塞';
                        break;
                    case '24':
                        ret.judge = '设备故障-硬件类';
                        break;
                    case '25':
                        ret.judge = '设备故障-尾纤类';
                        break;
                    case '26':
                        ret.judge = '设备故障-电源类';
                        break;
                    case '27':
                        ret.judge = '设备故障-环境类';
                        break;
                    case '28':
                        ret.judge = '设备故障-光缆类';
                        break;
                    case '29':
                        ret.judge = '用户故障';
                        break;
                    case '2A':
                        ret.judge = '未知原因';
                        break;
                    case '31':
                        ret.judge = '参数调整';
                        break;
                    case '32':
                        ret.judge = '天馈调整';
                        break;
                    case '33':
                        ret.judge = '无覆盖';
                        break;
                    default:
                        ret.judge = '其他';
                        break;
                }

                $api.val($api.byId('reasonType'), ret.reasonTypeStr || "");
                $api.val($api.byId('remark'), ret.remark || "");
                $api.val($api.byId('beSolution'), ret.beSolution || "");
                $api.val($api.byId('textDescription'), ret.textDescription || "");
                $api.val($api.byId('expTime'), ret.expTime || "");
                $api.val($api.byId('judge'), ret.judge || "");
                // 自动工单才显示责任人信息
                if (worksheetDetails.sheet.wsType === 2 && sessionUser){
                    $api.removeCls($api.byId('userName'),'aui-hide')
                    $api.removeCls($api.byId('userId'),'aui-hide')
                    $api.removeCls($api.byId('deptName'),'aui-hide')
                    $api.removeCls($api.byId('mobile'),'aui-hide')
                    $api.val($api.byId('sendUserName'), sessionUser.username || "");
                    $api.val($api.byId('sendUserId'), sessionUser.userid || "");
                    $api.val($api.byId('sendDeptName'), sessionUser.deptname || "");
                    $api.val($api.byId('phoneNumber'), sessionUser.mobile || "");
                }
                $api.val($api.byId('taskCode'), worksheetDetails.sheet.taskCode || "");
                $api.val($api.byId('dealDate'), worksheetDetails.sheet.dealDate || "");
            }
        }
    })
}

var frameFlag = false;

//获取工单详情
function getWorkSheetDetails() {
    if (initObjectFlag) {
        api.openFrame({
            name: 'objectSelectChangeLine',
            url: './ZT_objectSelectChangeLine.html',
            rect: {
                x: 50,
                y: 200,
                w: 250,
                h: 100 * objectNum
            },
            pageParam: {
                objectParams: objectParams
            },
        });
        frameFlag = true;
    } else {
        if (frameFlag) {
            api.openFrame({
                name: 'objectSelectChangeLine',
                url: './ZT_objectSelectChangeLine.html',
                rect: {
                    x: 50,
                    y: 200,
                    w: 250,
                    h: 100 * objectNum
                },
                pageParam: {
                    objectParams: objectParams
                },
            });
        } else {
            api.toast({
                msg: '返单对象加载中，请稍后...',
                duration: 2000,
                location: 'middle'
            });
        }

    }
}

function submitData() {
    if (common.isEmpty(userId)) {
        api.toast({
            msg: '返单对象不能为空！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var deals = worksheetDeals.deals
    for(var i=0;i<deals.length;i++){
        if(deals[i].dealState!=="2"){
            api.toast({
                msg: '有处理人未返单！',
                duration: config.duration,
                location: 'middle'
            });
            return
        }
    }
    api.confirm({
        title: '确认结单',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function (retBtn, err) {
        if (retBtn.buttonIndex === 1) {
            common.post({
                url: config.ZTConfirmFinishWorksheetUrl,
                isLoading: true,
                data: {
                    worksheet_id: wsNum,
                    feedbackUserid: userId,
                    remark: ""
                },
                success: function (ret) {
                    if (ret && ret.status === "200") {
                        api.toast({
                            msg: '结单提交成功！',
                            duration: config.duration,
                            location: 'middle'
                        });
                        setTimeout(function () {
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        }, config.successDuration);
                    } else {
                        api.toast({
                            msg: '提交失败',
                            duration: 2000,
                            location: 'middle'
                        });
                    }
                }
            })
        }
    });

}

//退回重新处理
function openReturnReprocess() {
    var userName = $api.attr($api.byId('selectDiv'), 'data-userName');
    api.openWin({
        name: 'returnToreProcessing',
        url: './ZT_returnToreProcessing.html',
        pageParam: {userName: userName, userId: userId}
    });
}
