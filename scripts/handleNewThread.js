const getUrl = window.location.search;
const urlParams = new URLSearchParams(getUrl);
const getUrlID = urlParams.get('id')
console.log(getUrlID);
var user = firebase.auth().currentUser;
var getMain = document.querySelector("main");


/* WYŚWIETLANIE WSZYSTKICH WĄTKÓW */
const dbRef = firebase.database().ref();
dbRef.child("threads/" + getUrlID).get().then((
    snapshot) => {
    if (snapshot.exists()) {
        data = Object.values(snapshot.val());
        if (user && user.emailVerified) {
            /* TUTAJ POWINNA BYĆ OSBŁUGA WYŚWIETLANIA DODAWANIA POSTA
            W ZALEŻNOŚCI CZY UŻYTKOWNIK JEST ZALOGOWANY */
        }

        var createArticle = document.createElement("article");
        document.querySelector("main").appendChild(createArticle);

        var newPostOptions = document.createElement("div")
        newPostOptions.setAttribute("class", "newPostOptions");
        createArticle.appendChild(newPostOptions)

        var newPostContent = document.createElement("div")
        newPostContent.setAttribute("class", "newPostContent");
        newPostContent.appendChild(document.createTextNode(snapshot.val().content));
        createArticle.appendChild(newPostContent)

        var newPostInfo = document.createElement("div")
        var createH4forData = document.createElement("h4")
        var createH4forUser = document.createElement("h4")

        newPostInfo.setAttribute("class", "newPostInfo");

        createH4forData.appendChild(document.createTextNode(snapshot.val().creation_date));
        createH4forUser.appendChild(document.createTextNode(snapshot.val().author));
        newPostInfo.appendChild(createH4forData);
        newPostInfo.appendChild(createH4forUser);
        createArticle.appendChild(newPostInfo);


        var newPostStats = document.createElement("div");
        var createIforThumbsUp = document.createElement("i");
        var createIforThumbsDown = document.createElement("i");
        var createH5forThumbsUp = document.createElement("h5");
        var createH5forThumbsDown = document.createElement("h5");
        newPostStats.setAttribute("class", "newPostStats");

        createIforThumbsUp.setAttribute("class", "far fa-thumbs-up");
        createIforThumbsDown.setAttribute("class", "far fa-thumbs-down");

        createIforThumbsUp.setAttribute("aria-hidden", "true");

        createH5forThumbsUp.appendChild(document.createTextNode(snapshot.val().thumbs_up));
        createH5forThumbsDown.appendChild(document.createTextNode(snapshot.val().thumbs_down));

        createIforThumbsUp.appendChild(createH5forThumbsUp);
        createIforThumbsDown.appendChild(createH5forThumbsDown);

        newPostStats.appendChild(createIforThumbsUp)
        newPostStats.appendChild(createIforThumbsDown)
        createArticle.appendChild(newPostStats);

    } else {
        console.log("No data available");
    }
})


/*DODAWANIE NOWYCH KOMENTARZY*/
function addNewCommentFunction() {
    var newCommentInput = document.getElementById("newCommentInput").value;
    if (newCommentInput == "") {
        window.alert("Aby dodać nowy komentarz, pole tekstowe nie może być puste")
    } else {
        var createArticle = document.createElement("article");
        document.querySelector("main").appendChild(createArticle);

        var newPostOptions = document.createElement("div")
        newPostOptions.setAttribute("class", "newPostOptions");
        createArticle.appendChild(newPostOptions)

        var newPostContent = document.createElement("div")
        newPostContent.setAttribute("class", "newPostContent");
        newPostContent.appendChild(document.createTextNode(newCommentInput));
        createArticle.appendChild(newPostContent)

        var newPostInfo = document.createElement("div")
        var createH4forData = document.createElement("h4")
        var createH4forUser = document.createElement("h4")

        newPostInfo.setAttribute("class", "newPostInfo");

        createH4forData.appendChild(document.createTextNode("26/11/2021"));
        createH4forUser.appendChild(document.createTextNode("MaciejPłonowski98"));
        newPostInfo.appendChild(createH4forData);
        newPostInfo.appendChild(createH4forUser);
        createArticle.appendChild(newPostInfo);


        var newPostStats = document.createElement("div");
        var createIforThumbsUp = document.createElement("i");
        var createIforThumbsDown = document.createElement("i");
        var createH5forThumbsUp = document.createElement("h5");
        var createH5forThumbsDown = document.createElement("h5");
        newPostStats.setAttribute("class", "newPostStats");

        createIforThumbsUp.setAttribute("class", "far fa-thumbs-up");
        createIforThumbsDown.setAttribute("class", "far fa-thumbs-down");

        createIforThumbsUp.setAttribute("aria-hidden", "true");

        createH5forThumbsUp.appendChild(document.createTextNode("3"));
        createH5forThumbsDown.appendChild(document.createTextNode("3"));

        createIforThumbsUp.appendChild(createH5forThumbsUp);
        createIforThumbsDown.appendChild(createH5forThumbsDown);

        newPostStats.appendChild(createIforThumbsUp)
        newPostStats.appendChild(createIforThumbsDown)
        createArticle.appendChild(newPostStats);
    }
}