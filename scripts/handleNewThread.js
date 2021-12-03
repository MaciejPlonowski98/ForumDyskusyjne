const getUrl = window.location.search;
const urlParams = new URLSearchParams(getUrl);
const getUrlID = urlParams.get('id')
console.log(getUrlID);

var user = firebase.auth().currentUser;
var getMain = document.querySelector("main");


/* WYŚWIETLANIE WĄTKU GŁÓWNEGO */
const dbRef = firebase.database().ref();
dbRef.child("threads/" + getUrlID).get().then((
    snapshot) => {
    if (snapshot.exists()) {
        data = Object.values(snapshot.val());
        if (user && user.emailVerified) {
            /* TUTAJ POWINNA BYĆ OSBŁUGA WYŚWIETLANIA DODAWANIA POSTA
            W ZALEŻNOŚCI CZY UŻYTKOWNIK JEST ZALOGOWANY */
        }
        var getTitle = document.querySelector("section>header>h1");
        getTitle.appendChild(document.createTextNode(snapshot.val().title));

        var threadDate = document.querySelector(".threadDate");
        threadDate.appendChild(document.createTextNode(snapshot.val().creation_date));

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
    var getTimestamp = Timestamp();

    var newCommentInput = document.getElementById("newCommentInput").value;
    if (newCommentInput == "") {
        window.alert("Aby dodać nowy komentarz, pole tekstowe nie może być puste")
    } else {
        // var createArticle = document.createElement("article");
        // document.querySelector("main").appendChild(createArticle);

        // var newPostOptions = document.createElement("div")
        // newPostOptions.setAttribute("class", "newPostOptions");
        // createArticle.appendChild(newPostOptions)

        // var newPostContent = document.createElement("div")
        // newPostContent.setAttribute("class", "newPostContent");
        // newPostContent.appendChild(document.createTextNode(newCommentInput));
        // createArticle.appendChild(newPostContent)

        // var newPostInfo = document.createElement("div")
        // var createH4forData = document.createElement("h4")
        // var createH4forUser = document.createElement("h4")

        // newPostInfo.setAttribute("class", "newPostInfo");

        // createH4forData.appendChild(document.createTextNode("26/11/2021"));
        // createH4forUser.appendChild(document.createTextNode("MaciejPłonowski98"));
        // newPostInfo.appendChild(createH4forData);
        // newPostInfo.appendChild(createH4forUser);
        // createArticle.appendChild(newPostInfo);


        // var newPostStats = document.createElement("div");
        // var createIforThumbsUp = document.createElement("i");
        // var createIforThumbsDown = document.createElement("i");
        // var createH5forThumbsUp = document.createElement("h5");
        // var createH5forThumbsDown = document.createElement("h5");
        // newPostStats.setAttribute("class", "newPostStats");

        // createIforThumbsUp.setAttribute("class", "far fa-thumbs-up");
        // createIforThumbsDown.setAttribute("class", "far fa-thumbs-down");

        // createIforThumbsUp.setAttribute("aria-hidden", "true");

        // createH5forThumbsUp.appendChild(document.createTextNode("3"));
        // createH5forThumbsDown.appendChild(document.createTextNode("3"));

        // createIforThumbsUp.appendChild(createH5forThumbsUp);
        // createIforThumbsDown.appendChild(createH5forThumbsDown);

        // newPostStats.appendChild(createIforThumbsUp)
        // newPostStats.appendChild(createIforThumbsDown)
        // createArticle.appendChild(newPostStats);

        firebase.auth().onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
                user_id = user.uid;
                firebase
                    .database()
                    .ref("/threads/" + getUrlID + "/_responses/" + getTimestamp)
                    .set({
                        repId: getTimestamp,
                        repDate: getTodayDate(),
                        repAuthor: user.email,
                        repThumbsUp: 0,
                        repThumbsDown: 0,
                        repContent: newCommentInput,
                    }).then(() => {
                        location.assign("thread.html?id=" + getUrlID);
                    })
            } else {
                console.log("error")
                document.getElementById("navLogin").href = "login.html"
            }
        });


    }
}

/*WYŚWIETLANIE ODPOWIEDZI W WĄTKU */
dbRef.child("threads/" + getUrlID + "/_responses").get().then((
    snapshot) => {
    if (snapshot.exists()) {
        var getInfo = Object.entries(snapshot.val());
        if (user && user.emailVerified) {
            /* TUTAJ POWINNA BYĆ OSBŁUGA WYŚWIETLANIA DODAWANIA POSTA
            W ZALEŻNOŚCI CZY UŻYTKOWNIK JEST ZALOGOWANY */
        }
        getInfo.map(([klucz, wartosc]) => {
            var createArticle = document.createElement("article");
            document.querySelector("main").appendChild(createArticle);

            var newPostOptions = document.createElement("div")
            newPostOptions.setAttribute("class", "newPostOptions");
            createArticle.appendChild(newPostOptions)

            var newPostContent = document.createElement("div")
            newPostContent.setAttribute("class", "newPostContent");
            newPostContent.appendChild(document.createTextNode(wartosc.repContent));
            createArticle.appendChild(newPostContent)

            var newPostInfo = document.createElement("div")
            var createH4forData = document.createElement("h4")
            var createH4forUser = document.createElement("h4")

            newPostInfo.setAttribute("class", "newPostInfo");

            createH4forData.appendChild(document.createTextNode(wartosc.repDate));
            createH4forUser.appendChild(document.createTextNode(wartosc.repAuthor));
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

            createH5forThumbsUp.appendChild(document.createTextNode(wartosc.repThumbsDown));
            createH5forThumbsDown.appendChild(document.createTextNode(wartosc.repThumbsUp));

            createIforThumbsUp.appendChild(createH5forThumbsUp);
            createIforThumbsDown.appendChild(createH5forThumbsDown);

            newPostStats.appendChild(createIforThumbsUp)
            newPostStats.appendChild(createIforThumbsDown)
            createArticle.appendChild(newPostStats);
        })

        /* DLACZEGO TO WŁAŚNIE TUTAJ POWINNO SIĘ ODBYWAĆ LICZENIE ILOŚĆI WĄTKÓW I AKTUALIZACJA DO BAZY DANYCH? 
        DLATEGO ŻE WĄTKI NP PO USUNIĘCIU POWINNY SIĘ AKTUALIZOWAĆ OD RAZU, CZYLI WTEDY GDY ZOSTAJE WYŚWIETLANA LISTA WSZYSTKICH WĄTKÓW
        A NIE WTEDY GDY SIĘ DODAJE NP. NOWY WĄTEK BO LISTA WYŚWIETLI SIĘ ZA KAŻDYM RAZEM, A DODANIE WATKU TYLKO GDY UŻYTKOWNIK BĘDZIE CHCIAŁ DODAĆ WĄTEK
        I WTEDY BY DOPIERO ZLICZAŁ*/
        dbRef.child("threads/" + getUrlID + "/_responses").get().then((
            snapshot) => {
            if (snapshot.exists()) {
                var getInfo = Object.values(snapshot.val());
                var counter = [];
                counter.push("Main Thread")
                getInfo.forEach((ex) => {
                    counter.push(ex);
                });
                console.log(counter.length)
            }

            firebase
                .database()
                .ref("/threads/" + getUrlID)
                .update({
                    entries: counter.length,
                })
                .then(() => console.log("Data updated."))
                .catch((error) => {
                    console.error(error);
                });
        })


    } else {
        console.log("No data available");
    }
})