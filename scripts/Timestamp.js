function miliseconds() {
    var mili = new Date().getMilliseconds();
    if (mili < 10) {
        return "00" + mili;
    } else if (mili > 10 && mili < 100) {
        return "0" + mili
    } else {
        return mili;
    }
}

function seconds() {
    var sec = new Date().getSeconds();
    if (sec < 10) {
        return "0" + sec;
    } else {
        return sec;
    }
}

function minutes() {
    var min = new Date().getMinutes();
    if (min < 10) {
        return "0" + min;
    } else {
        return min;
    }
}

function hours() {
    var hour = new Date().getHours();
    if (hour < 10) {
        return "0" + hour;
    } else {
        return hour;
    }
}

function date() {
    var date = new Date().getDate();
    if (date < 10) {
        return "0" + date;
    } else {
        return date;
    }
}

function month() {
    var month = new Date().getMonth();
    if (month < 10) {
        return "0" + month;
    } else {
        return month;
    }
}

function Timestamp() {
    var id = new Date();

    id =
        id.getFullYear() +
        "-" +
        parseInt(month() + 1) +
        "-" +
        date() +
        "-" +
        hours() +
        "" +
        minutes() +
        "" +
        seconds() +
        "" +
        miliseconds();
    return id;
}

function getTodayDate() {
    var date = new Date();
    date =
        date.getDate() +
        "/" +
        parseInt(date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        "";
    return date
}