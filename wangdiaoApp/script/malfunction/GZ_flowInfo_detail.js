var model=[];
apiready = function () {
    model = api.pageParam.model;
    machineFlowInfo();
}

// 把应该放在页面判断的逻辑放在这里，便于以后维护，doT的写法看起来比较费劲
function machineFlowInfo() {
    var params=[];
    var processName = model.task_type;
    params.processName = processName
    var list=[];
    // 派发
    if (processName==='派发'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'派往对象',value:model.p_deal_man})
    }
    // 抄送
    else if (processName==='抄送'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'抄送对象',value:model.p_deal_man})
    }
    // 接单开始处理
    else if (processName==='接单开始处理'){
        list.push({key:'处理时间',value:model.dispose_time})
        list.push({key:'处理人所在部门',value:model.dispose_man_dep})
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
    }
    // 信息追加
    else if (processName==='信息追加'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'追加信息',value:model.d_remark})
    }
    // 阶段回复
    else if (processName==='阶段回复'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'阶段回复内容',value:model.d_remark})
    }
    // 转派
    else if (processName==='转派'){
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'转派原因',value:model.d_remark})
        list.push({key:'派往对象',value:model.p_deal_man})
    }
    // 追派
    else if (processName==='追派'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'派往对象',value:model.p_deal_man})
    }
    // 处理反馈
    else if (processName==='处理反馈'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'反馈人',value:model.dispose_man})
        list.push({key:'反馈人所在部门',value:model.dispose_man_dep})
        list.push({key:'反馈人联系方式',value:model.operatortel})
        list.push({key:'是否本部门故障',value:model.isexclude})
        list.push({key:'故障区域',value:model.area})
        list.push({key:'故障原因关键字',value:model.reason_key})
        list.push({key:'故障原因',value:model.reason})
        list.push({key:'是否影响业务',value:model.infbus})
        list.push({key:'影响范围',value:model.influence})
        list.push({key:'派发时间',value:model.rectime})
        list.push({key:'返单时间',value:model.dispose_time})
        list.push({key:'处理历时',value:model.deallast})
        list.push({key:'挂起历时',value:model.suspendlast})
        list.push({key:'处理是否超时',value:model.timeout})
        list.push({key:'超时原因',value:model.timeout_reason})
        list.push({key:'故障开始时间',value:model.dmhapptime})
        list.push({key:'业务恢复时间',value:model.busrec_date})
        if (model.jh==='KH'){
            list.push({key:'业务恢复历时',value:''})   // todo  在原app中业务恢复历时一般都没有值
        }else{
            list.push({key:'故障历时',value:model.dmdeallast})
        }
        list.push({key:'故障专业',value:model.dmpro})
        list.push({key:'处理过程描述',value:model.d_remark})
    }
    // 确认结单
    else if (processName==='确认结单') {
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'反馈人',value:model.operator})
        list.push({key:'反馈人所在部门',value:model.operatordept})
        list.push({key:'反馈人联系方式',value:model.operatortel})
        list.push({key:'是否本部门故障',value:model.isexclude})
        list.push({key:'故障区域',value:model.area})
        list.push({key:'故障原因关键字',value:model.reason_key})
        list.push({key:'故障原因',value:model.reason})
        list.push({key:'是否影响业务',value:model.infbus})
        list.push({key:'影响范围',value:model.influence})
        list.push({key:'派发时间',value:model.rectime})
        list.push({key:'返单时间',value:model.dealdate})
        list.push({key:'处理历时',value:model.deallast})
        list.push({key:'挂起历时',value:model.suspendlast})
        list.push({key:'处理是否超时',value:model.timeout})
        list.push({key:'超时原因',value:model.timeout_reason})
        list.push({key:'故障开始时间',value:model.dmhapptime})
        list.push({key:'业务恢复时间',value:model.busrec_date})
        if (model.jh==='KH'){
            list.push({key:'业务恢复历时',value:''})
        }else{
            list.push({key:'故障历时',value:model.dmdeallast})
        }
        list.push({key:'故障专业',value:model.dmpro})
        list.push({key:'处理过程描述',value:model.d_remark})
        list.push({key:'结单备注',value:model.column6})
    }
    // 退回重新处理
    else if (processName==='退回重新处理'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'退回类型',value:model.dispose_way})
        list.push({key:'退回内容',value:model.d_remark})
    }
    // 归档
    else if (processName==='归档'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'归档满意度',value:model.dispose_way})
        list.push({key:'归档意见',value:model.d_remark})
    }
    // 撤销
    else if (processName==='撤销'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'撤销类型',value:model.dispose_way})
    }
    // 挂起申请
    else if (processName==='挂起申请'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'挂起类型',value:model.dispose_way})
        list.push({key:'挂起原因',value:model.p_remark})
    }
    // 挂起
    else if (processName==='挂起'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'挂起类型',value:model.dispose_way})
        list.push({key:'挂起原因',value:model.d_remark})
    }
    // 解除挂起
    else if (processName==='解除挂起'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'解除挂起意见',value:model.jgopinion})
    }
    // 退单申请
    else if (processName==='退单申请'){
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
        list.push({key:'挂退单型',value:model.dispose_way})
        list.push({key:'退单原因',value:model.p_remark})
    }
    // 其他
    else{
        list.push({key:'处理人所在部门联系方式',value:model.deptphone})
        list.push({key:'处理人联系方式',value:model.phone})
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
