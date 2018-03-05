module.exports = function () {
    var currentDate = new Date();
    var month = currentDate.getMonth() + 1
    var day = currentDate.getDate();
    var year = currentDate.getFullYear().toString().substr(-2);
    var hour = currentDate.getHours();
    var min = currentDate.getMinutes();
    var shortDate = day + "/" + month + "/" + year +"/"+ hour+":"+min;
    return shortDate;
}
