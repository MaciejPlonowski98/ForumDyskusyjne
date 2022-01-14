/* W komentarzach nie będzie getUrlId tylko id komentarza */
var timestamp = Timestamp();

function likeComment(element, user, dbRecord) {
    console.log(dbRecord)
    element.setAttribute("class", "fas fa-thumbs-up");
    firebase
        .database()
        .ref("/threads/" + dbRecord + "/likedBy/" + user.uid)
        .update({
            date: timestamp,
            email: user.email,
        })

    dbRef.child("threads/" + dbRecord + "/likedBy").get().then((
        snapshot) => {
        if (snapshot.exists()) {
            var getInfo = Object.values(snapshot.val());
            element.childNodes[0].innerHTML = getInfo.length;
        }
        firebase
            .database()
            .ref("/threads/" + dbRecord)
            .update({
                thumbs_up: getInfo.length,
            })
    })


}

function dislikeComment(element, user, dbRecord) {
    element.setAttribute("class", "far fa-thumbs-up");
    firebase
        .database()
        .ref("/threads/" + dbRecord + "/likedBy/" + user.uid)
        .remove()

    dbRef.child("threads/" + dbRecord + "/likedBy").get().then((
        snapshot) => {
        /* TUTAJ TO JEST POTRZEBNE BO JAK DA SIE 1 POLUBIENIE I POZNIEJ USUNIE TO USUWA WSZYSTKIE REKORDY I BRAK JEST I WYSYPUJE NULL */
        if (snapshot.val() == null) {
            element.childNodes[0].innerHTML = "0";
        } else {
            var getInfo = Object.values(snapshot.val());
            if (snapshot.exists()) {
                console.log(getInfo)
                element.childNodes[0].innerHTML = getInfo.length;
            }
            console.log(getInfo.length)
            firebase
                .database()
                .ref("/threads/" + dbRecord)
                .update({
                    thumbs_up: getInfo.length,
                })
        }
    })
}

/* --------------------------- +1 NA PROFIL ------------------------- */

function followUser(element, commentInfo, currentLoggedInUser) {
    if (commentInfo.userUid === currentLoggedInUser.uid) {
        alert("Nie możesz polubić swojego profilu.");
    } else {
        element.setAttribute("class", "fas fa-check-circle")
        alert("Polubiłeś profil użytkownika " + commentInfo.author);
        firebase
            .database()
            .ref("/users/" + commentInfo.userUid + "/userInfo/followedBy/" + currentLoggedInUser.uid)
            .update({
                date: timestamp,
                email: currentLoggedInUser.email,
            })

        dbRef.child("/users/" + commentInfo.userUid + "/userInfo/followedBy").get().then((
            snapshot) => {
            if (snapshot.exists()) {
                var getInfo = Object.values(snapshot.val());
                firebase
                    .database()
                    .ref("/users/" + commentInfo.userUid + "/userInfo")
                    .update({
                        accountRates: getInfo.length,
                    })
            }
        })

    }
}


function unfollowUser(element, commentInfo, currentLoggedInUser) {
    element.setAttribute("class", "far fa-check-circle")
    alert("Już nie lubisz profilu użytkownika " + commentInfo.author);

    firebase
        .database()
        .ref("/users/" + commentInfo.userUid + "/userInfo/followedBy/" + currentLoggedInUser.uid)
        .remove()

    dbRef.child("/users/" + commentInfo.userUid + "/userInfo/followedBy").get().then((
        snapshot) => {
        /* TUTAJ TO JEST POTRZEBNE BO JAK DA SIE 1 POLUBIENIE I POZNIEJ USUNIE TO USUWA WSZYSTKIE REKORDY I BRAK JEST I WYSYPUJE NULL */
        if (snapshot.val() == null) {
            firebase
                .database()
                .ref("/users/" + commentInfo.userUid + "/userInfo/")
                .update({
                    accountRates: 0,
                })
        } else {
            var getInfo = Object.values(snapshot.val());
            firebase
                .database()
                .ref("/users/" + commentInfo.userUid + "/userInfo/")
                .update({
                    accountRates: getInfo.length,
                })
        }
    })
}