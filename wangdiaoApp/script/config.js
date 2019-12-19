// var localServer = "http://192.168.1.126:8080/rams_v3"
var localServer = "http://61.139.150.161:8180/rams_v3"
var config= {
    duration: 3000,   //提示信息3000毫秒之后消失
    successDuration: 600,    // 流程操作成功提示延时
    versionUpdateUrl: localServer + "/dm/mobile.do?method=getapkInfo&type=interface",  //版本更新（一共需要传3个参数）dm/mobile.do?method=getapkInfo&type=interface&userName=admin&j_username=admin&j_password=Admin24123
    loginUrl: localServer + "/j_security_check?method=login&type=android", //登录   /j_security_check?method=login&type=android&j_username=admin&j_password=Admin24123
    getAllDeptAndUserUrl: localServer + "/dm/mobile.do?method=getAllDeptAndUser&type=android",   //对象-部门组织接口（吉林部门默认id为-1，打开下级部门，id为上级部分id） ，/dm/mobile.do?method=getAllDeptAndUser&type=android&id=-1
    getAllIdUrl: localServer + "/dm/mobile.do?method=getAllId&type=android",   //类型-字典值获取接口（参数及固定值 parentdictid=10126/10127） // http://192.168.1.126:8080/rams_v3//dm/mobile.do?method=getAllId&type=android&parentdictid=10126
    // 故障工单专用
    waitAndEndWorksheet: localServer + "/dm/mobile.do?method=worksheetListTotal&type=android",   //待办和已办数量
    waitWorksheetListUrl: localServer + "/dm/faultaccepting.do?method=waitWorksheetListForAndroid&type=android",   //待办列表接口
    endWorksheetListUrl: localServer + "/dm/faultaccepting.do?method=hasBeenWorksheetListForAndroid&type=android",   //已办列表接口
    archiveWorksheetListListUrl: localServer + "/dm/faultaccepting.do?method=endWorksheetList&type=android",   //归档列表接口
    allWorksheetList: localServer + "/dm/faultaccepting.do?method=allWorksheetDetailsList&type=android",     // 工单查询列表
    worksheetDetailUrl: localServer + "/dm/dispatch.do?method=worksheetDetail&type=android",  //工单详情-工单信息接口 // http://192.168.1.126:8080/rams_v3/dm/dispatch.do?method=worksheetDetail&type=android&wsNum=SH-KH-190820-06683
    flowInfoUrl: localServer + "/dm/mobile.do?method=getworkList&type=android",  //工单详情-流转信息-处理信息接口，/dm/mobile.do?method=getworkList&type=android&wsNum=SH-KH-190820-06683&processId=
    getProcessMenu: localServer + "/dm/permissions.do?method=permissions1",   // 工单流程菜单获取接口
    appendMessageUrl: localServer + "/dm/faultaccepting.do?method=appendWorksheet&type=android",             // 信息追加
    appendWorksheetUrl: localServer + "/dm/faultaccepting.do?method=addSend&type=android",                   // 追派
    forwardWorksheetUrl: localServer + "/dm/faultaccepting.do?method=forwardWorksheet&type=android",         // 转派
    confirmFinishWorksheetUrl: localServer + "/dm/faultaccepting.do?method=accountWorksheet&type=android",   // 确认结单
    suspendApplicationUrl: localServer + "/dm/faultaccepting.do?method=pendingWorksheet&type=android",       // 挂起申请
    stageResponseUrl: localServer + "/dm/faultaccepting.do?method=replyWorksheet&type=android",              // 阶段回复
    overWorksheetCommitUrl: localServer + "/dm/faultaccepting.do?method=feedbackWorksheet&type=android",          //  返单
    overWorksheetDetailUrl: localServer + "/dm/faultaccepting.do?method=feedbackWorksheetTZ&type=android",              //  返单  数据回显接口
    overWorksheetGetKeyWordUrl: localServer + "/dm/autoCheckConfig.do?method=getKeyWord",              // 返单获取故障原因关键字
    returnToreProcessingUrl: localServer + "/dm/faultaccepting.do?method=againprocessWorksheet&type=android", // 退回并重新处理
    suspendAuditUrl: localServer + "/dm/faultaccepting.do?method=pendingauditWorksheet&type=android",          //  挂起审核提交
    chooseObjectUrl: localServer + "/dm/faultaccepting.do?method=accountWorksheetTZ&type=android",           // 确认结单-对象选择
    archiveWorksheetUrl: localServer + "/dm/faultaccepting.do?method=archiveWorksheet&type=android",          // 归档
    processWorksheetUrl: localServer + "/dm/faultaccepting.do?method=processWorksheet&type=android",          // 接单开始处理接口
    getSuspendAuditModelUrl: localServer + "/dm/faultaccepting.do?method=pendingauditWorksheetTZ&type=android",          //  挂起审核：挂起类型获取
    suspendAuditModelEchoUrl: localServer + "/dm/faultaccepting.do?method=pendingauditWorksheetProcessLog&type=android",          //  挂起审核：对象选中后回显
    accountWorksheetDetail: localServer + "/dm/faultaccepting.do?method=accountWorksheetDetail&type=android", //确认结单：返单对象选中后回显
    noDealFeedBackWorksheetCommitUrl: localServer + "/dm/faultaccepting.do?method=noFeedbackWorksheet&type=android",          //  未排除返单提交接口
    noDealFeedBackWorksheetDetailUrl: localServer + "/dm/faultaccepting.do?method=noDealFeedBackWorksheetTZ&type=android",              //  未排除返单  数据回显接口
    GZ_checkWorksheet: localServer + "/dm/faultaccepting.do?method=checkWorksheet&type=android",              //  检查工单是否可以提交接口
    GZ_checkWorksheetForArchive: localServer + "/dm/faultaccepting.do?method=checkArchiveAgain&type=android",              //  检查工单--归档专用
    GZ_checkWorksheetForForward: localServer + "/dm/dispatch.do?method=checkSingletree&type=android",              //  检查工单--转派追派专用
    GZ_getFlowDetails: localServer + "/dm/mobile.do?method=details&type=android",           //故障工单获取流转详情
    // 中台专用
    ZTWaitEndArchiveCount: localServer + "/dm/taskSchedulingCount.do?method=worksheetListTotal&type=android",   //待办/已办/归档数量
    ZTWaitWorksheetUrl: localServer + "/dm/taskScheduling.do?method=taskWaitWorksheetList&type=android",   //待办列表
    ZTEndWorksheetListUrl: localServer + "/dm/taskScheduling.do?method=taskHasBeenWorksheetList&type=android",    //已办列表
    ZTArchiveWorksheetListListUrl: localServer + "/dm/taskScheduling.do?method=taskEndWorksheetList&type=android",    //归档列表
    ZTTaskAllWorksheetList: localServer + "/dm/taskScheduling.do?method=taskAllWorksheetList&type=android",     // 工单查询列表
    ZTWorksheetDetailUrl: localServer + "/dm/taskScheduling.do?method=worksheetDetail&type=android",            //工单详情
    ZTGetProcessMenu: localServer + "/dm/taskSchedulingPermissions.do?method=permissions",          // 工单流程菜单获取接口
    ZTProcessWorksheetUrl: localServer + "/dm/taskScheduling.do?method=processWorksheet&type=android",          // 接单开始处理接口
    ZTOverWorksheetDetailUrl: localServer + "/dm/feedback.do?method=feedbackTZ&type=android",                 //返单数据回显接口
    ZTOverWorksheetCommitUrl: localServer + "/dm/feedback.do?method=feedbackWorksheet&type=android",          // 返单提交接口
    ZTAppendMessageUrl: localServer + "/dm/taskScheduling.do?method=appendWorksheet&type=android",          // 信息追加接口
    ZTForwardWorksheetUrl: localServer + "/dm/taskScheduling.do?method=forwardWorksheet&type=android",         // 转派
    ZTArchiveWorksheetUrl: localServer + "/dm/taskScheduling.do?method=archiveWorksheet&type=android",          // 归档
    ZTConfirmFinishWorksheetUrl: localServer + "/dm/feedback.do?method=account&type=android",   //确认结单
    ZTConfirmInitWorksheetDetails: localServer + "/dm/feedback.do?method=accountTZ&type=android",   //确认结单获取工单详情
    ZTAccountWorksheetDetail: localServer + "/dm/feedback.do?method=getFeedbackInfo&type=android", //确认结单：返单对象选中后回显
    ZTReturnUrl: localServer + "/dm/taskScheduling.do?method=returnWorksheet&type=android" ,//退单
    ZTReturnTypeUrl: localServer + "/dm/mobile.do?method=getAllId&type=android",  //退单类型
    ZTReturnToreProcessing: localServer + "/dm/taskScheduling.do?method=againprocessWorksheet&type=android", //退回重新处理
    ZTRevocationWorksheet: localServer + "/dm/taskScheduling.do?method=revocationWorksheet&type=android", //自动工单-撤销
    ZTWorksheetSearchArea: localServer +"/dm/feedback.do?method=queryArea",//工单查询-区县
}
var storageKey = {
    loginName: "loginName",//登录用户名（用来判断是否记住密码）
    loginPwd: "loginPwd", //登录密码
    loginUser: "loginUser",  //登录人信息
    wsId: "wsId",   //工单Id
    wsNum: "wsNum",   //工单号
    wsTitle: "wsTitle",//工单主题
    processId: "processId",  // 流程id
    dmPro: "dmPro",  // 专业

    versionInfo: 'versionInfo', //版本信息

    data_id: "data_id",    //选中节点id
    data_name: "data_name",//选中节点名称
    data_type: "data_type",//选中节点类型

    operate_status: "operate_status",//操作状态  工单操作页面
    worksheet_type: "worksheet_type",   //工单类型，故障工单，中台任务调度
    win_header_height: "win_header_height",   //页面header的高，用于在frame里再打开一次frame
    win_footer_height: "win_footer_height",   //页面footer的高
    ZT_TaskAllWorksheet_List:"ZT_TaskAllWorksheet_List",//查询工单列表
    Query_Worksheet_List:"Query_Worksheet_List",//查询工单列表
    process_choose_pageName: "process_choose_pageName",//流程选择页面名称



}


var parentdictid = {
    suspendApplication: {
        KH: 10122,   // 大客户工单
        other:10111
    },    //挂起申请 字典值父id
    appendWorksheet: 10127,    //追派 字典值父id
    forwardWorksheet: 10126,    //转派 字典值父id
    suspendAudit: 10126,    //挂起审核 字典值父id
    overWorksheet: 10103,    //返单 字典值父id
    returnToreProcessing: 10112,    //退回重新处理 字典值父id
    archiveWorksheet: 10113,         //归档  归档满意度字典值父id
    archiveWorksheet_businessRecovery: 10306,         //归档  业务是否恢复字典值父id
    overWorksheet_ifDeptMalfunction: 10109,    // 返单-是否本部门故障字典值父id
    overWorksheet_malfunctionArea: 10103,    // 返单-故障区域字典值父id
    overWorksheet_ifInfluenceProfessionalWork: 10110,    // 返单-是否影响业务字典值父id
    overWorksheet_isBusinessAllStop:10132,// 返单-传输专业-是否业务全阻
    overWorksheet_dealFkPosition:10133,// 返单-传输专业-位置
    overWorksheet_malfunctionSpecialty: 10101,    // 返单-故障专业字典值父id
    GZ_worksheet_search_level:10102,// 工单查询—故障级别

    //中台父关键字
    ZT_chargeBack_returnTypeDicId:10112, //退单---退回类型字典值
    ZT_worksheet_search_city:10121,    //工单查询 获取地市字典值父id
    ZT_returnToreProcessing:10128,       //中台——退回类型字典值父流程id

};

var ZT_process_need = {
    entrance:'entrance',
    dealType:'dealType',
}
