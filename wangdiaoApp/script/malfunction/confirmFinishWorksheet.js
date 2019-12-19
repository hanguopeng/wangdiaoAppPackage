
//正则判断  小时:分钟 格式
function testTime(time){
    var regu =/^([0-1]{1}\d|2[0-3]):([0-5]\d)$/;
    var re = new RegExp(regu);
    if (re.test(time)) {
        return true;
    }else{
        return false;
    }
}

function currentDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day;
}

var formatDate = function(date){
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    return year+"-"+month+"-"+day;
};
var addDate= function(date,n){
    date.setDate(date.getDate()+n);
    return date;
};
var setDate = function(date){
    var week = date.getDay()-1;
    date = addDate(date,week*-1);
    currentFirstDate = new Date(date);
    currentDates.length=0;
    for(var i = 0;i<7;i++){
        var tmp = formatDate(i==0 ? date : addDate(date,1));
        if(i==0){
            currentStartDate = tmp;
        }else if(i==6){
            currentEndDate = tmp;
            if(limitEndDate==null){
                limitEndDate = tmp;
            }
        }
        currentDates.push(i==0? truncMD(tmp):truncD(tmp));
    }
};
//截取月日
function truncMD(datestr){
    return datestr.substr(5);
}
//截取日
function truncD(datestr){
    return datestr.substr(8);
}
