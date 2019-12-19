var contentData
apiready = function() {
    initSelect();
}
//动态加载select
function initSelect(){
    var wsNum = $api.getStorage(storageKey.wsNum);              //工单号
    common.post({
        url:config.ZTOverWorksheetDetailUrl,
        isLoading:false,
        data:{
            wsnum: wsNum
        },
        success:function(ret) {
            if (ret&&ret.status==='200'&&ret.data&&ret.data.result==='ok') {
                contentData = ret.data.data;
                isNotNull("taskCode",contentData.taskCode);//任务单编号
                // 自动工单才显示责任人信息
                if (contentData.wsType === 2){
                    var user = ret.data.user
                    $api.removeCls($api.byId('userName'),'aui-hide')
                    $api.removeCls($api.byId('userId'),'aui-hide')
                    $api.removeCls($api.byId('deptName'),'aui-hide')
                    $api.removeCls($api.byId('mobile'),'aui-hide')
                    isNotNull("sendUserName",user.username);//责任人姓名
                    isNotNull("sendUserId",user.userid);//责任人工号
                    isNotNull("sendDeptName",user.deptname);//责任人所属部门
                    isNotNull("phoneNumber",user.mobile);//责任人电话
                }
                $api.val($api.byId('feedBackTime'), common.currentTime());//返单时间
            }else{
                api.toast({
                    msg: '获取返单回显数据失败！',
                    duration: config.duration,
                    location: 'middle'
                });
            }
        }
    })
}
function isNotNull(id,data){
    if(common.isEmpty(data)){
        $api.val($api.byId(id), "");
    }else{
        $api.val($api.byId(id), data);
    }

}

function changePage(){
    var reasonType = $("#reasonType option:selected").val();
    if(reasonType==='1'){//建设类
        $api.removeCls($api.byId('maintain'),'aui-show')
        $api.removeCls($api.byId('optimize'),'aui-show')
        $api.addCls($api.byId('construction'),'aui-show')
    }else if(reasonType==='2'){//维护类
        $api.removeCls($api.byId('construction'),'aui-show')
        $api.removeCls($api.byId('optimize'),'aui-show')
        var taskFrom = contentData.taskFrom;
        $api.removeCls($api.byId('maintain-judge-one'),'aui-show')
        $api.removeCls($api.byId('maintain-judge-two'),'aui-show')
        if (taskFrom === '2'||taskFrom === '3'){
            $api.addCls($api.byId('maintain-judge-one'),'aui-show')
        }else if (taskFrom === '1'||taskFrom === '4') {
            $api.addCls($api.byId('maintain-judge-two'),'aui-show')
        }
        $api.addCls($api.byId('maintain'),'aui-show')
    }else if(reasonType==='3'){//优化类
        $api.removeCls($api.byId('construction'),'aui-show')
        $api.removeCls($api.byId('maintain'),'aui-show')
        $api.addCls($api.byId('optimize'),'aui-show')
    }
}
function save() {
    var wsNum = $api.getStorage(storageKey.wsNum);              //工单号

    var reasonType = $("#reasonType option:selected").val();                  //问题原因类型
    if (common.isEmpty(reasonType)) {
        api.toast({
            msg: '请选择问题原因类型！',
            duration: config.duration,
            location: 'middle'
        });
        return;
    }
    var remark = $api.trim($api.val($api.byId('remark')));
    if(reasonType==='1'){
        var judge = $("#construction-judge option:selected").val();                  //问题原因判定
        if (common.isEmpty(judge)) {
            api.toast({
                msg: '请选择问题原因判定！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var beSolution = $("#construction-beSolution option:selected").val();                  //是否有解决方案
        if (common.isEmpty(beSolution)) {
            api.toast({
                msg: '请选择是否有解决方案！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var textDescription = $api.trim($api.val($api.byId('construction-textDescription')));
        if (common.isEmpty(textDescription)) {
            api.toast({
                msg: '文字描述不能为空！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var expTime = $api.trim($api.val($api.byId('construction-expTime')));
        if (common.isEmpty(expTime)) {
            api.toast({
                msg: '预计解决时间不能为空！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
    }else if(reasonType==='2'){
        var taskFrom = contentData.taskFrom;
        if (taskFrom === '2'||taskFrom === '3'){
            var judge = $("#maintain-judge-one option:selected").val();                  //是否本部门故障
        }else if (taskFrom === '1'||taskFrom === '4') {
            var judge = $("#maintain-judge-two option:selected").val();                  //是否本部门故障
        }
        if (common.isEmpty(judge)) {
            api.toast({
                msg: '请选择问题原因判定！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var isexclude = $("#maintain-isexclude option:selected").val();                  //故障是否修复
        if (common.isEmpty(isexclude)) {
            api.toast({
                msg: '请选择故障是否修复！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var textDescription = $api.trim($api.val($api.byId('maintain-textDescription')));
        if (common.isEmpty(textDescription)) {
            api.toast({
                msg: '文字描述不能为空！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var expTime = $api.trim($api.val($api.byId('maintain-expTime')));
        if (common.isEmpty(expTime)) {
            api.toast({
                msg: '预计解决时间不能为空！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
    }else if(reasonType==='3'){
        var judge = $("#optimize-judge option:selected").val();
        if (common.isEmpty(judge)) {
            api.toast({
                msg: '请选择问题原因判定！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var beSolution = $("#optimize-beSolution option:selected").val();                  //是否本部门故障
        if (common.isEmpty(beSolution)) {
            api.toast({
                msg: '请选择是否有解决方案！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var textDescription = $api.trim($api.val($api.byId('optimize-textDescription')));
        if (common.isEmpty(textDescription)) {
            api.toast({
                msg: '文字描述不能为空！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
        var expTime = $api.trim($api.val($api.byId('optimize-expTime')));
        if (common.isEmpty(expTime)) {
            api.toast({
                msg: '预计解决时间不能为空！',
                duration: config.duration,
                location: 'middle'
            });
            return;
        }
    }

    api.confirm({
        title: '确认返单',
        msg: '是否提交？',
        buttons: ['确定', '取消']
    }, function(retBtn, err) {
        if(retBtn.buttonIndex===1){
            common.post({
                url : config.ZTOverWorksheetCommitUrl,
                isLoading: true,
                text: "提交中...",
                data:{
                    worksheet_id:wsNum,     //工单号(必填)
                    sheetno:wsNum,   //工单号(必填)
                    reasonType: reasonType,   //问题原因类型 (必填)
                    judge: judge,           //问题原因判定(必填)
                    remark: remark,         //备注
                    beSolution: beSolution,           //是否有解决方案(1.3必填)
                    isexclude: isexclude,           //故障是否修复(2必填)
                    textDescription: textDescription,          //文字描述(必填)
                    expTime: expTime ,           //预计解决时间(必填)
                },
                success: function (ret) {
                    if (ret.status==='200'){
                        api.toast({
                            msg:  '返单操作成功！',
                            duration: config.duration,
                            location: 'middle'
                        });
                        setTimeout(function(){
                            $api.setStorage(ZT_process_need.entrance, 'yb');
                            common.closeAndReloadAppointPage('process_success_reload_worksheet_detail');
                        },config.successDuration);
                    } else {
                        var msg = '返单操作失败！'
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
//时间函数

Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth() + 1, // month
        "d+" : this.getDate(), // day
        "h+" : this.getHours(), // hour
        "m+" : this.getMinutes(), // minute
        "s+" : this.getSeconds(), // second
        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" : this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
                    .substr(("" + o[k]).length));
        }
    }
    return format;
};
var nowt = new Date().format("yyyy-MM-dd");//当前时间
jeDate("#construction-expTime",{
    language:enLang,
    format: "YYYY-MM-DD hh:mm:ss",
    minDate:nowt,
    donefun : function(obj){    //回调函数

        var yjjjsj = (new Date(obj.val.replace(/-/g,"/")).getTime())+120000;
        var nowTime = new Date().getTime();
        if ( yjjjsj< nowTime) {
            alert('预计解决时间不能小于现在时间');
            $api.val($api.byId('construction-expTime'), "");//业务恢复时间

        }
    }
});
jeDate("#maintain-expTime",{
    language:enLang,
    format: "YYYY-MM-DD hh:mm:ss",
    minDate:nowt,
    donefun : function(obj){    //回调函数

        var yjjjsj = (new Date(obj.val.replace(/-/g,"/")).getTime())+120000;
        var nowTime = new Date().getTime();

        if ( yjjjsj< nowTime) {
            alert('预计解决时间不能小于现在时间');
            $api.val($api.byId('maintain-expTime'), "");//业务恢复时间

        }
    }
});
jeDate("#optimize-expTime",{
    language:enLang,
    format: "YYYY-MM-DD hh:mm:ss",
    minDate:nowt,
    donefun : function(obj){    //回调函数

        var yjjjsj = (new Date(obj.val.replace(/-/g,"/")).getTime())+120000;
        var nowTime = new Date().getTime();
        if ( yjjjsj< nowTime) {
            alert('预计解决时间不能小于现在时间');
            $api.val($api.byId('optimize-expTime'), "");//业务恢复时间

        }
    }
});

