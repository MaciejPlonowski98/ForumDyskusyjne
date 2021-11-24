function Timestamp() {
    var id = new Date();
    id =
        parseInt(id.getMonth() + 1) +
        "" +
        id.getDate() +
        "" +
        id.getFullYear() +
        "" +
        id.getHours() +
        "" +
        id.getMinutes() +
        "" +
        id.getSeconds() +
        "" +
        id.getMilliseconds();
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