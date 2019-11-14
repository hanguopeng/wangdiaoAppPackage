var tasList=[];
var listFeedBack=[];
apiready = function () {
    tasList = api.pageParam.tasList;
    if (api.pageParam.listFeedBack){
        listFeedBack = api.pageParam.listFeedBack;
    }
    machineFlowInfo();
}

// 把应该放在页面判断的逻辑放在这里，便于以后维护，doT的写法看起来比较费劲
function machineFlowInfo() {
    var params=[];
    params.processName = tasList[2];
    var list=[];
    // 派发
    if (tasList[2]==='派发'){
        list.push({key:'处理人联系方式',value:tasList[7]})
        if (tasList[11] === null){
            if (tasList[57] === '1'){
                list.push({key:'派往对象【角色】',value:tasList[95]})
            }else if(tasList[57] === null){
                if (tasList[5] === 'subrole'){
                    list.push({key:'派往对象【角色】',value:tasList[95]})
                } else{
                    list.push({key:'派往对象【部门】',value:tasList[90]})
                    list.push({key:'派往对象联系方式',value:tasList[27]})
                }
            }
        } else{
            list.push({key:'派往对象【人员】',value:tasList[89]})
            list.push({key:'派往对象所属部门',value:tasList[90]})
        }
    }
    // 接单开始处理
    else if (tasList[2]==='接单开始处理'){
        list.push({key:'处理人',value:tasList[87]})
        list.push({key:'处理人所在部门',value:tasList[88]})
        list.push({key:'处理方式',value:tasList[2]})
        list.push({key:'处理时间',value:tasList[6]})
        list.push({key:'处理人所在部门联系方式',value:tasList[27]})
        list.push({key:'处理人联系方式',value:tasList[7]})
    }
    // 信息追加
    else if (tasList[2]==='信息追加'){
        list.push({key:'处理人所在部门联系方式',value:tasList[27]})
        list.push({key:'处理人联系方式',value:tasList[7]})
        list.push({key:'追加内容',value:tasList[9]})
        list.push({key:'任务描述',value:tasList[86]})
    }
    // 转派
    else if (tasList[2]==='转派'){
        list.push({key:'处理人联系方式',value:tasList[7]})
        list.push({key:'转派原因',value:tasList[9]})
        if (tasList[11] === null){
            if (tasList[5] === 'subrole'){
                list.push({key:'派往对象【角色】',value:tasList[95]})
            } else{
                list.push({key:'派往对象【部门】',value:tasList[90]})
                list.push({key:'派往对象联系方式',value:tasList[27]})
            }
        } else{
            list.push({key:'派往对象【人员】',value:tasList[89]})
            list.push({key:'派往对象所属部门',value:tasList[90]})
        }
    }
    // 抄送
    else if (tasList[2]==='抄送'){
        list.push({key:'处理人所在部门联系方式',value:tasList[27]})
        list.push({key:'处理人联系方式',value:tasList[7]})
        if (tasList[11] === null){
            list.push({key:'抄送对象',value:tasList[90]})
        } else{
            list.push({key:'抄送对象',value:tasList[89]})
        }
        list.push({key:'抄送对象所属角色',value:tasList[97]})
    }
    // 确认结单
    else if (tasList[2]==='确认结单') {
        list.push({key: '结单人', value: tasList[87]})
        list.push({key: '结单人所在部门', value: tasList[88]})
        list.push({key: '结单人联系方式', value: tasList[7]})
        list.push({key: '结单时间', value: tasList[6]})
        list.push({key: '问题原因类型', value: listFeedBackGetReasonType(listFeedBack[2])})
        list.push({key: '问题原因判定', value: listFeedBackGetReasonDecide(listFeedBack[11])})
        list.push({key: '任务单编号', value: tasList[84]})
        if (listFeedBack[2] === '1' || listFeedBack[2] === '3') {
            list.push({key: '是否有解决方案', value: listFeedBack[12]})
        }
        if (listFeedBack[2] === '2') {
            list.push({key: '故障是否排除', value: listFeedBack[39]})
        }
        list.push({key: '备注', value: listFeedBack[10]})
        list.push({key: '文字描述', value: listFeedBack[14]})
        list.push({key: '预计完成时间', value: listFeedBack[15]})
    }
    // 归档
    else if (tasList[2]==='归档'){
        list.push({key:'归档人',value:tasList[87]})
        list.push({key:'归档人所在部门',value:tasList[88]})
        list.push({key:'归档人联系方式',value:tasList[7]})
        list.push({key:'归档时间',value:tasList[6]})
        list.push({key:'确认是否恢复',value:tasList[51]})
        list.push({key:'归档满意度',value:tasList[52]})
        list.push({key:'归档意见',value:tasList[9]})
    }
    // 处理反馈
    else if (tasList[2]==='处理反馈'){
        list.push({key:'返单人',value:tasList[87]})
        list.push({key:'返单人所在部门',value:tasList[88]})
        list.push({key:'返单人联系方式',value:tasList[7]})
        list.push({key:'返单时间',value:tasList[6]})
        list.push({key: '问题原因类型', value: listFeedBackGetReasonType(tasList[82])})
        list.push({key: '问题原因判定', value: listFeedBackGetReasonDecide(tasList[83])})
        list.push({key: '任务单编号', value: tasList[84]})
        if (tasList[82] === '1' || tasList[82] === '3') {
            list.push({key: '是否有解决方案', value: tasList[91]})
        }
        if (tasList[82] === '2') {
            list.push({key: '故障是否排除', value: tasList[80]})
        }
        list.push({key: '备注', value: tasList[92]})
        list.push({key: '文字描述', value: tasList[93]})
        list.push({key: '预计完成时间', value: tasList[94]})
    }
    // 退单
    else if (tasList[2]==='退单'){
        list.push({key:'退单人',value:tasList[87]})
        list.push({key:'退单人所在部门',value:tasList[88]})
        list.push({key:'退单人联系方式',value:tasList[7]})
        list.push({key:'退单时间',value:tasList[6]})
        list.push({key:'退单类型',value:tasList[53]})
        list.push({key:'退单原因',value:tasList[9]})
    }
    // 退回重新处理
    else if (tasList[2]==='退回重新处理'){
        list.push({key:'退回人',value:tasList[87]})
        list.push({key:'退回人所在部门',value:tasList[88]})
        list.push({key:'处理人联系方式',value:tasList[7]})
        list.push({key:'退回时间',value:tasList[6]})
        list.push({key:'退回类型',value:tasList[53]})
        list.push({key:'退回原因',value:tasList[9]})
    }
    // 重新派发
    else if (tasList[2]==='重新派发'){
        list.push({key:'处理人所在部门联系方式',value:tasList[27]})
        list.push({key:'处理人联系方式',value:tasList[7]})
        if (tasList[11] === null){
            if (tasList[57] === '1'){
                list.push({key:'派往对象【角色】',value:tasList[95]})
            }else if(tasList[57] === null){
                if (tasList[5] === 'subrole'){
                    list.push({key:'派往对象【角色】',value:tasList[95]})
                } else{
                    list.push({key:'派往对象【部门】',value:tasList[90]})
                    list.push({key:'派往对象联系方式',value:tasList[27]})
                }
            }
        } else{
            list.push({key:'派往对象【人员】',value:tasList[89]})
            list.push({key:'派往对象所属部门',value:tasList[90]})
        }
    }
    // 撤销
    else if (tasList[2]==='撤销'){
        list.push({key:'撤销人',value:tasList[87]})
        list.push({key:'撤销人所在部门',value:tasList[88]})
        list.push({key:'撤销人联系方式',value:tasList[7]})
        list.push({key:'撤销时间',value:tasList[6]})
        list.push({key:'撤销类型',value:tasList[8]})
        list.push({key:'撤销原因',value:tasList[9]})
    }
    // 其他
    else{
        list.push({key:'处理人所在部门联系方式',value:tasList[27]})
        list.push({key:'处理人联系方式',value:tasList[7]})
    }
    params.list = list;
    $api.html($api.byId('flow-Info'), "");
    var infoDetail = doT.template($api.text($api.byId('infoDetail')));
    $api.html($api.byId('flow-Info'), infoDetail(params));
}

function closeFrame() {
    common.sendEvent("close_BlackFrame");
    api.closeFrame();
}


// 返单-问题原因类型
function listFeedBackGetReasonType(str) {
    switch (str) {
        case '1':return '建设类';break;
        case '2':return '维护类';break;
        case '3':return '优化类';break;
        default:return '其他';break;
    }
}
// 返单-问题原因判定
function listFeedBackGetReasonDecide(str) {
    switch (str) {
        case '11':return '无覆盖';break;
        case '12':return '弱覆盖';break;
        case '13':return '扩容';break;
        case '21':return '故障';break;
        case '22':return '搬迁';break;
        case '23':return 'OLT-中继拥塞';break;
        case '24':return '设备故障-硬件类';break;
        case '25':return '设备故障-尾纤类';break;
        case '26':return '设备故障-电源类';break;
        case '27':return '设备故障-环境类';break;
        case '28':return '设备故障-光缆类';break;
        case '29':return '用户故障';break;
        case '2A':return '未知原因';break;
        case '31':return '参数调整';break;
        case '32':return '天馈调整';break;
        case '33':return '无覆盖';break;
        default:return '其他';break;
    }
}