//查询方法
function search(pageName) {
    var header_h = $api.getStorage("win_header_height");
    var footer_h = $api.getStorage("win_footer_height");
    var page_height;
    if (common.isEmpty(header_h)){
        height=50
    }
    if (!common.isEmpty(pageName)&&pageName == "../../html/taskScheduling/ZT_worksheet_search.html"){
        page_height = 435;
        api.openFrame({
            name: 'ZT_worksheet_search',
            url: pageName,
            rect: {
                x: 0,
                y: parseInt(header_h) + 10, // 头部留位置
                w: 'auto',
                h:page_height
            },
        });
    } else if (!common.isEmpty(pageName)&&pageName == "../../html/malfunction/GZ_worksheet_search.html")  {
        page_height = 510;
        api.openFrame({
            name: 'GZ_worksheet_search',
            url: pageName,
            rect: {
                x: 0,
                y: parseInt(header_h) + 10, // 头部留位置
                w: 'auto',
                h:510
            },
        });
    }

    api.openFrame({
        name: 'black',
        url: '../../html/main/black.html',
        rect: {
            x: 0,
            y: parseInt(header_h) + 5  + page_height,//header高度+上面frame高度
            w: 'auto',
            h: api.winHeight - 5 - page_height + parseInt(footer_h),//整体frame高度-上面frame高度 + footer高度
        },
    });

}