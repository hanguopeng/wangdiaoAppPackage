var times = 0;
var time1, time2;
apiready = function () {
    openMainFrame()
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

function openAppointPage(name){
    if (name===null){
        api.toast({
            msg: '此功能暂未开放！',
            duration: config.duration,
            location: 'middle'
        });
        return
    }else if(name==='./person_center'){  // 工单处理/我的互相切换时，可能导致开多次，所以当去我的页时，关闭工单处理frame
        common.sendEvent("close_ZT_worksheet_manage");
        common.sendEvent("close_GZ_worksheet_manage");
    }
    api.openWin({
        name: name,
        bounces: false,
        slidBackEnabled : false,
        reload:true,
        url:  name + '.html',
        vScrollBarEnabled:true,
        hScrollBarEnabled:false
    });
}
function openMainFrame() {
    var header = document.querySelector('#header');
    var pos = $api.offset(header);
    $api.setStorage(storageKey.win_header_height,pos.h);
    var footPos = $api.offset(document.querySelector('#footer'))
    $api.setStorage(storageKey.win_footer_height,footPos.h);
    var process_choose_pageName = $api.getStorage("process_choose_pageName");
    var pageName = 'frm_GZ_worksheet_manage'
    var pageUrl = '../../html/malfunction/GZ_worksheet_manage.html'
    switch (process_choose_pageName) {
        case 'ZT_worksheet_manage':
            pageName= 'frm_GZ_worksheet_manage';
            pageUrl= '../../html/taskScheduling/ZT_worksheet_manage.html'
            break
    }
    api.openFrame({ // 打开Frame
        name: pageName,
        url: pageUrl,
        rect: {
            x: 0,
            y: pos.h+10, // 头部留位置
            w: 'auto',
            h: api.winHeight-pos.h-footPos.h-10
        },
        bounces: true,
        reload: true,
        vScrollBarEnabled: false
    });
}
function processChoose() {
    var header_h = $api.getStorage("win_header_height");
    var footer_h = $api.getStorage("win_footer_height");
    common.sendEvent("close_ZTWorksheet_search");//关闭工单查询页面
    api.openFrame({
        name: 'process_choose',
        url: './process_choose.html',
        rect: {
            x: 0,
            y: parseInt(header_h) + 10, // 头部留位置
            w: 'auto',
            //h: 275
            h:240
        },
    });
    api.openFrame({
        name: 'black',
        url: './black.html',
        rect: {
            x: 0,
            //y: 325,
            y: parseInt(header_h) + 10  + 240,//header高度+上面frame高度
            w: 'auto',
            h: api.winHeight - 10 - 240 + parseInt(footer_h),//整体frame高度-上面frame高度 + footer高度
        },
    });
}
