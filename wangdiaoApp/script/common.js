function openMyToolFrame() {
    $api.addEvt($api.dom('.search-person'), 'click', function () {
        api.openFrame({
            name: 'frm_tools',
            url: './frm_tools.html',
            rect: {
                x: api.winWidth - 300,
                y: api.winHeight - api.frameHeight + 20,
                w: 300,
                h: api.frameHeight
            },
            progress: {
                type: "default",
                title: "",
                text: "正在加载数据"
            },
            animation: {
                type: "flip",
                subType: "from_bottom"
            },
            vScrollBarEnabled: true,
            hScrollBarEnabled: false
        });
    });
}

/*
 * 统一请求处理方法，后续可能会涉及到如果token失效要跳转到登录页面的操作
 * 该js需要放到apiready方法之后
 * 如果isLoading=true,success方法中需要自己使用api.hideProgress方法，进行关闭遮罩,主要是ajax多次调用时遮罩一直可以保持
 */
var common = {
    "loginInvalid": false,
    "notNull": function (val) {
        return val || "";
    },
    "sortAsc": function (x, y) {
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    },
    "beginTransSync": function (db) {
        db.transactionSync({
            name: cmcdb.name,
            operation: 'begin'
        }, function (ret, err) {
            if (ret.status) {
            } else {
                alert(JSON.stringify(err));
            }
        });
    },
    "commitTransSync": function (db) {
        db.transactionSync({
            name: cmcdb.name,
            operation: 'commit'
        }, function (ret, err) {
            if (ret.status) {
            } else {
                alert(JSON.stringify(err));
            }
        });
    },
    "rollbackTransSync": function (db) {
        db.transactionSync({
            name: cmcdb.name,
            operation: 'rollback'
        }, function (ret, err) {
            if (ret.status) {
            } else {
                alert(JSON.stringify(err));
            }
        });
    },
    "post": function (param) {
        console.log( param.url)
        if (param.isLoading || false) {
            api.showProgress({
                title: param.title || '',
                text: param.text || '努力加载中...'
            });
        }
        api.ajax({
            url: param.url,
            method: 'post',
            timeout: 30,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                values: param.data
            }
        }, function (ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
            if (param.isLoading || false) {
                api.hideProgress();
            }
            param.success(ret);
        });
    },
    'isEmpty':function (str) {
        if (str === null || str === '' || str === undefined || str === 'undefined') {
            return true
        }
    },
    // 关闭当前页并刷新指定页面
    'closeAndReloadAppointPage':function (name) {
        api.closeWin();
        this.reloadAppointPage(name);
    },
    // 刷新执行页面
    'reloadAppointPage':function (name) {
        this.sendEvent(name);
    },
    // 发送指定名称的事件
    'sendEvent':function (eventName) {
        api.sendEvent({
            name: eventName,
        })
    }


}
