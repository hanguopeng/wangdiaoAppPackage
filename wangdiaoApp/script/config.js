//var localServer = "http://192.168.1.126:8080/rams_v3"
var localServer = "http://61.139.150.161:8180/rams_v3"
var config= {
    duration: 3000,   //提示信息3000毫秒之后消失
    // 测试通过，需要在url后面继续拼接数据的已经在说明后举例！
    versionUpdateUrl: localServer + "/dm/mobile.do?method=getapkInfo&type=interface",  //版本更新（一共需要传3个参数）dm/mobile.do?method=getapkInfo&type=interface&userName=admin&j_username=admin&j_password=Admin24123
    loginUrl: localServer + "/j_security_check?method=login&type=android", //登录   /j_security_check?method=login&type=android&j_username=admin&j_password=Admin24123
    waitAndEndWorksheet: localServer + "/dm/mobile.do?method=worksheetListTotal&type=android",   //待办和已办数量
    waitWorksheetListUrl: localServer + "/dm/faultaccepting.do?method=waitWorksheetListForAndroid&type=android",   //手机端待办列表接口
    endWorksheetListUrl: localServer + "/dm/faultaccepting.do?method=hasBeenWorksheetListForAndroid&type=android",   //手机端已办列表接口
    worksheetDetailUrl: localServer + "/dm/dispatch.do?method=worksheetDetail&type=android",  //工单详情-手机端工单信息接口 // http://192.168.1.126:8080/rams_v3/dm/dispatch.do?method=worksheetDetail&type=android&wsNum=SH-KH-190820-06683
    flowInfoUrl: localServer + "/dm/mobile.do?method=getworkList&type=android",  //工单详情-流转信息-处理信息接口，/dm/mobile.do?method=getworkList&type=android&wsNum=SH-KH-190820-06683&processId=
    getAllDeptAndUserUrl: localServer + "/dm/mobile.do?method=getAllDeptAndUser&type=android",   //对象-部门组织接口（吉林部门默认id为-1，打开下级部门，id为上级部分id） ，/dm/mobile.do?method=getAllDeptAndUser&type=android&id=-1
    getAllIdUrl: localServer + "/dm/mobile.do?method=getAllId&type=android",   //类型-字典值获取接口（参数及固定值 parentdictid=10126/10127） // http://192.168.1.126:8080/rams_v3//dm/mobile.do?method=getAllId&type=android&parentdictid=10126
    getProcessMenu: localServer + "/dm/mobile.do?method=permissions1&type=android",   // 工单流程菜单获取接口，参数wsNum /dm/mobile.do?method=permissions1&type=android&wsNum=SH-KH-190820-06683

    // 流程操作接口
    /*addBy 邱振华0926*/
    appendMessageUrl: localServer + "/dm/faultaccepting.do?method=appendWorksheet&type=android",             //手机端    已办列表-信息追加
    appendWorksheetUrl: localServer + "/dm/faultaccepting.do?method=addSend&type=android",                   //手机端    追派
    forwardWorksheetUrl: localServer + "/dm/faultaccepting.do?method=forwardWorksheet&type=android",         //手机端    转派
    confirmFinishWorksheetUrl: localServer + "/dm/faultaccepting.do?method=accountWorksheet&type=android",   //手机端    确认结单
    suspendApplicationUrl: localServer + "/dm/faultaccepting.do?method=pendingWorksheet&type=android",       //手机端    挂起申请
    stageResponseUrl: localServer + "/dm/faultaccepting.do?method=replyWorksheet&type=android",              //手机端    阶段回复
    overWorksheetUrl: localServer +"/dm/faultaccepting.do?method=feedbackWorksheet&type=android",          //手机端    返单
    getDetailUrl: localServer +"/dm/faultaccepting.do?method=feedbackWorksheetTZ&type=android",              //手机端    返单  数据回显接口
    returnToreProcessingUrl: localServer +"/dm/faultaccepting.do?method=againprocessWorksheet&type=android", //手机端    退回并重新处理
    suspendAuditUrl: localServer +"/dm/faultaccepting.do?method=pendingauditWorksheet&type=android",          //手机端    挂起审核提交
    chooseObjectUrl:localServer  + "/dm/faultaccepting.do?method=accountWorksheetTZ&type=android",           //手机端-确认结单-对象选择
    archiveWorksheetUrl:localServer  +"/dm/faultaccepting.do?method=archiveWorksheet&type=android",          //手机端    归档

    // add by Mela.S @20190929
    processWorksheetUrl: localServer + "/dm/faultaccepting.do?method=processWorksheet&type=android",          // 手机端 接单开始处理接口
    // add by Mela.S @20191008
    getSuspendAuditModelUrl: localServer + "/dm/faultaccepting.do?method=pendingauditWorksheetTZ&type=android",          // 手机端 挂起审核：挂起审核对象
    suspendAuditModelEchoUrl: localServer + "/dm/faultaccepting.do?method=pendingauditWorksheetProcessLog&type=android",          // 手机端 挂起审核：对象选中后回显

    //韩国鹏 确认结单：返单对象选中后回显
    accountWorksheetDetail: localServer + "/dm/faultaccepting.do?method=accountWorksheetDetail&type=android" //确认结单：返单对象选中后回显
}
var storageKey={
    loginName:"loginName",//登录用户名（用来判断是否记住密码）
    loginPwd:"loginPwd", //登录密码
    loginUser:"loginUser",  //登录人信息
    wsId:"wsId",   //工单Id
    wsNum:"wsNum",   //工单号
    wsTitle: "wsTitle",//工单主题
    processId:"processId" ,  // 流程id
    versionInfo: 'versionInfo', //版本信息

    data_id : "data_id",    //选中节点id
    data_name : "data_name",//选中节点名称
    data_type : "data_type",//选中节点类型

    operate_status : "operate_status",//操作状态  工单操作页面


}


var parentdictid={
    suspendApplication: 10111,    //挂起申请 字典值父id
    appendWorksheet: 10127,    //追派 字典值父id
    forwardWorksheet: 10126,    //转派 字典值父id
    suspendAudit: 10126,    //挂起审核 字典值父id
    overWorksheet: 10103,    //返单 字典值父id
    returnToreProcessing: 10112,    //退回重新处理 字典值父id
    archiveWorksheet: 10113,         //归档  归档满意度字典值父id
    overWorksheet_ifDeptMalfunction:10109,    // 返单-是否本部门故障字典值父id
    overWorksheet_malfunctionArea:10103,    // 返单-故障区域字典值父id
    overWorksheet_ifInfluenceProfessionalWork:10110,    // 返单-是否影响业务字典值父id
    overWorksheet_malfunctionSpecialty:10101,    // 返单-故障专业字典值父id
    overWorksheet_malfunctionReasonKeyword:{
        yiWang:10123,    // 故障原因关键字-移网，等到二期这里需要更细致的划分
        other:10107      // 故障原因关键字-其他
    }
}
