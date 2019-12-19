var childFlag;
apiready= function(){
    dept_tree()
}
function dept_tree(){
    common.post({
        url: config.getAllDeptAndUserUrl,
        isLoading: true,
        data:{
            id:"-1"
        },
        success: function (ret, err) {
            if(ret&&ret.status==="200"){
                var tempInfo = doT.template($api.text($api.byId('check_dept')));
                $api.html($api.byId('dept_container'), tempInfo(ret.data));
                for (var i = 0; i < ret.data.length; i++) {
                    $api.html($api.byId(ret.data[i].id), '');
                }
            }else{
                api.toast({
                    msg: '获取部门失败',
                    duration: 2000,
                    location: 'middle'
                });
            }
        }
    })
}
function check_dept_Inp(obj){
    var childEle = $api.first(($api.next(((obj.parentNode).parentNode).parentNode)))
    if(obj.checked){
        $api.html(childEle, '');
    }

}

function check_dept(obj){
    var input_ele = obj.previousSibling;
    var childEle = $api.first(($api.next(((obj.parentNode).parentNode).parentNode)))
    var preInpName = $api.attr(input_ele,'name');
    var preInputArr = $api.domAll('input[name="'+preInpName+'"]');
    var notCheckedFlag = true;

    if(input_ele.checked){
        input_ele.checked = false;

    }else{
        input_ele.checked = true;
        $api.html(childEle,'');
    }
    for(var j=0;j<preInputArr.length;j++){
        if(preInputArr[j].checked){
            notCheckedFlag=false;
        }
    }
}
function dept_goOrStop(ele){
    var checkBox = $api.first(ele.parentNode);
    if(checkBox.checked){
        api.toast({
            msg:'您已选中该部门，不能再次选中下一级',
            duration:2000,
            location:'middle'
        })
    }else{
        open_checkbox(ele)
    }
}
function open_checkbox(ele){
    var childEle = $api.first(($api.next(((ele.parentNode).parentNode).parentNode)));
    var childId = $api.attr(childEle, 'id');
    childFlag = ($api.first(childEle.parentNode)).hasChildNodes()
    var input_ele = $api.attr($api.first(ele.parentNode),'name');
    var preEle = $api.first(ele.parentNode)

    var checkColorChangeArr = $api.domAll('input[name="'+input_ele+'"]');

    if(childFlag){
        $api.removeCls(ele,'aui-icon-top')
        $api.addCls(ele,'aui-icon-down')
        $api.html($api.byId(childId), '');
    }else{
        $api.removeCls(ele,'aui-icon-down')
        $api.addCls(ele,'aui-icon-top')
        common.post({
            url: config.getAllDeptAndUserUrl ,
            isLoading:true,
            data:{
                id:childId
            },
            success:function (ret, err) {
                if(ret&&ret.status==="200"&&ret.data&&ret.data.length&&ret.data.length>0){
                    for(var i=0;i<ret.data.length;i++){
                        ret.data[i].id_name = childId
                    }
                    var tempInfo = doT.template($api.text($api.byId('children_dept')));
                    $api.html($api.byId(childId), tempInfo(ret.data));
                    for(var i=0;i<ret.data.length;i++){
                        $api.html($api.byId(ret.data[i].id),'');
                    }
                }else{
                    api.toast({
                        msg: '没有下一级啦',
                        duration: 2000,
                        location: 'middle'
                    });
                }
            }})
    }
}
//提交方法，可以获取所被选中的复选框的部门的id
function submitTest(){
    var inputArr = $("input:checked");
    var data_id = "";
    var data_name = "";
    var data_type = "";
    for (var i=0;i<inputArr.length;i++){
        //data_id.push($api.attr(inputArr[i],'data-id'));
        //data_name.push($api.attr(inputArr[i],'data-name'))
        if(i < inputArr.length-1){
            data_name += $api.attr(inputArr[i],'data-name') + ","
            data_id += $api.attr(inputArr[i],'data-id') + ","
            data_type += $api.attr(inputArr[i],'data-type') + ","
        }else if(i === inputArr.length-1){
            data_id += $api.attr(inputArr[i],'data-id')
            data_type += $api.attr(inputArr[i],'data-type')
            data_name += $api.attr(inputArr[i],'data-name')
        }
        //data_type.push($api.attr(inputArr[i],'data-type'))
    }
    $api.setStorage(storageKey.data_id,data_id);
    $api.setStorage(storageKey.data_name,data_name);
    $api.setStorage(storageKey.data_type,data_type);

    api.sendEvent({
        name: 'loginout',

    });
    api.closeWin()

}
