//故障-查询方法
function getSearchList(pageName) {
    var header_h = $api.getStorage("win_header_height");
    var footer_h = $api.getStorage("win_footer_height")
    if (common.isEmpty(header_h)){
        height=50
    }
    api.openFrame({
        name: 'gz_worksheet_search',
        url: pageName,
        rect: {
            x: 0,
            y: parseInt(header_h) + 10, // 头部留位置
            w: 'auto',
            h:510
        },
    });
    api.openFrame({
        name: 'black',
        url: '../../html/main/black.html',
        rect: {
            x: 0,
            y: parseInt(header_h) + 10  + 505,//header高度+上面frame高度
            w: 'auto',
            h: api.winHeight - 10 - 505 + parseInt(footer_h),//整体frame高度-上面frame高度 + footer高度
        },
    });

}
//中台-查询方法
function search(pageName) {
    var header_h = $api.getStorage("win_header_height");
    var footer_h = $api.getStorage("win_footer_height")
    if (common.isEmpty(header_h)){
        height=50
    }
    api.openFrame({
        name: 'worksheet_search',
        url: pageName,
        rect: {
            x: 0,
            y: parseInt(header_h) + 10, // 头部留位置
            w: 'auto',
            h:435
        },
    });
    api.openFrame({
        name: 'black',
        url: '../../html/main/black.html',
        rect: {
            x: 0,
            y: parseInt(header_h) + 10  + 430,//header高度+上面frame高度
            w: 'auto',
            h: api.winHeight - 10 - 430 + parseInt(footer_h),//整体frame高度-上面frame高度 + footer高度
        },
    });

}