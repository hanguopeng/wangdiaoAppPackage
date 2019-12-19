apiready = function(){
    var header = $api.byId('header'); // 获取头部
    $api.fixStatusBar(header); // 处理ios兼容
    var pos = $api.offset(header); // 获取头部位置
    var title  = $api.dom(header,'.aui-title'); // 获取标题位置
    $api.html(title,api.pageParam.title); // 设置标题内容


    api.openFrame({ // 打开内容页，并传递参数
        name: 'confirmFinishWorksheet',
        url: 'confirmFinishWorksheet.html',
        rect:{
            x: 0,
            y: pos.h, // 头部留位置
            w: 'auto',
            h: 'auto'
        },
        bounces: true,
        vScrollBarEnabled: false,
        pageParam: {titleName: titleName} // 传递参数
    });
};
api.addEventListener({
    name:'win-worksheet-manage'
},function(){
    api.closeWin();
})

}

function confirmChooseEvent() {
    api.sendEvent({
        name: 'appendMessage',
        extra: {
        }
    });
}
function goBack(){
    api.openWin({
        name: 'appendMessage',
        bounces: false,
        slidBackEnabled : false,
        reload:true,
        url: './html/malfunction/test.html',
        vScrollBarEnabled:true,
        hScrollBarEnabled:false

    });

}





