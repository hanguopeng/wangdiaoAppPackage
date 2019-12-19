var versionInfo = $api.getStorage(storageKey.versionInfo);
var personInfo = $api.getStorage(storageKey.loginUser);
var UIActionProgress;
var fs;
var times = 0;
var time1, time2;
apiready = function(){
    UIActionProgress = api.require('UIActionProgress');
    fs = api.require('fs');
    userAndversionInfo();
    keyBackListener()
}
function keyBackListener() {
    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        if (times == 0) {
            time1 = new Date().getTime();
            times = 1;
            api.toast({
                msg: '再按一次返回键退出',
                duration: 2000,
                location: 'middle'
            });
        } else if (times == 1) {
            time2 = new Date().getTime();
            if (time2 - time1 < 2000) {
                api.closeWidget({
                    id: api.appId,
                    retData: {
                        name: 'closeWidget'
                    },
                    silent: true
                });
            } else {
                times = 0;
                api.toast({
                    msg: '再按一次返回键退出',
                    duration: 2000,
                    location: 'middle'
                });
            }
        }
    });
}
//用户信息及app版本信息
function userAndversionInfo(){

    var contentTmpl = doT.template($api.text($api.byId('versionInfo')))
    var param = {}
    param.code = versionInfo
    $api.html($api.byId('versonInfoContainer'), contentTmpl(param));

    var userNameTmpl = doT.template($api.text($api.byId('personName')))
    $api.html($api.byId('userName'), userNameTmpl(personInfo));

    var userPhoneTmpl = doT.template($api.text($api.byId('personPhone')))
    $api.html($api.byId('userPhone'), userPhoneTmpl(personInfo));


    var userDeptTmpl = doT.template($api.text($api.byId('my-dept-conTmpl')))
    $api.html($api.byId('my-dept'), userDeptTmpl(personInfo));

}
//退出登录
function outOfLogin(){
    $api.rmStorage(storageKey.loginName);
    $api.rmStorage(storageKey.loginPwd);

    api.closeToWin({
        name:'root'
    });
}
//未做功能
function notShow(){
    api.toast({
        msg: '此功能暂未开放！',
        duration: config.duration,
        location: 'bottom'
    });
}
//检查更新
function appUpdataCheck(){
    common.post({
        url:config.versionUpdateUrl,
        isLoading:true,
        data:{
            userName: personInfo.userId ,
            j_username: personInfo.userId,
            j_password: personInfo.password
        },
        success:function(ret){
            var versionArr = versionInfo.split('.')
            if(ret){
                if(ret.status=== "200"){
                    var appCodeArr = ret.data.code.split('.')
                    for(var i=0;i<versionArr.length;i++){
                        if(parseInt(versionArr[i])<appCodeArr[i]){
                            api.confirm({
                                title:'有新版本！是否更新？',
                                msg:'',
                                button:['确定','取消']
                            },function(retUpdate,err){
                                var index = retUpdate.buttonIndex;
                                if(index == 2){
                                    if (api.systemType == "android"){
                                        UIActionProgress.open({
                                            maskBg: 'rgba(0,0,0,0.5)',
                                            styles: {
                                                h: 108,
                                                bg: '#fff',
                                                title: {
                                                    size: 13,
                                                    color: '#000',
                                                    marginT: 10
                                                },
                                                msg: {
                                                    size: 12,
                                                    color: '#000',
                                                    marginT: 5
                                                },
                                                lable: {
                                                    size: 12,
                                                    color: '#696969',
                                                    marginB: 5
                                                },
                                                progressBar: {
                                                    size: 2,
                                                    normal: '#000',
                                                    active: '#4876FF',
                                                    marginB: 35,
                                                    margin: 5
                                                }
                                            },
                                            data: {
                                                title: '正在更新',
                                                msg: '',
                                                value: 0
                                            }
                                        },function(ret){
                                            if(ret && ret.eventType=='complete'){
                                                UIActionProgress.close();
                                            }
                                        });
                                        fs.removeSync({
                                            path: 'fs://app.apk'
                                        });

                                        api.download({
                                            url: ret.data.address,
                                            savePath: 'fs://app.apk',
                                            report: true,
                                            cache: true,
                                            allowResume: true
                                        },function(retdownload, err2){
                                            if (retdownload && 0 == retdownload.state) {/* 下载进度 */
                                                UIActionProgress.setData({
                                                    data:{
                                                        title: '正在更新',
                                                        msg: '',
                                                        value: retdownload.percent
                                                    }
                                                });
                                            }
                                            if (retdownload && 1 == retdownload.state) {/* 下载完成 */
                                                UIActionProgress.setData({
                                                    data:{
                                                        title: '正在更新',
                                                        msg: '',
                                                        value: 100
                                                    }
                                                });
                                                api.installApp({
                                                    appUri : retdownload.savePath
                                                });
                                            }
                                            if(retdownload && 2 == retdownload.state){/* 下载失败 */
                                                UIActionProgress.close();
                                                api.alert({
                                                    title: '错误',
                                                    msg: '更新失败,请稍后重试',
                                                }, function(ret3, err3){
                                                    //判断是否需要强行关闭
                                                    if(ret.content.closed){
                                                        api.alert({
                                                            title: '提示',
                                                            msg: ret.content.closeTip||'必须更新版本之后才能使用!',
                                                        }, function(ret, err){
                                                            api.closeWidget({
                                                                id: api.appId,
                                                                retData: {
                                                                    name: 'closeWidget'
                                                                },
                                                                silent: true
                                                            });
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            })
                        }else{
                            api.toast({
                                msg: '已是最新版本',
                                duration: 2000,
                                location: 'middle'
                            });
                        }
                    }
                }
            }else{
                api.alert({
                    title: '错误',
                    msg: '版本更新异常,请联系管理员'
                });
            }

        }
    })
}

function openAppointPage(name){
    if (name===null){
        api.toast({
            msg: '此功能暂未开放！',
            duration: config.duration,
            location: 'bottom'
        });
        return
    }
    api.openWin({
        name: name,
        bounces: false,
        slidBackEnabled : false,
        reload:true,
        url: name + '.html',
        vScrollBarEnabled:true,
        hScrollBarEnabled:false
    });
}
