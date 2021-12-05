const getUrl = window.location.search;
const urlParams = new URLSearchParams(getUrl);
const getUrlID = urlParams.get('id')

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

        if (snapshot.val().skreslono == true) {
            createIforThumbsUp.className = "fas fa-thumbs-up";
        } else {
            createIforThumbsUp.setAttribute("class", "far fa-thumbs-up");
        }

        createIforThumbsDown.setAttribute("class", "far fa-thumbs-down");




        createIforThumbsUp.setAttribute("aria-hidden", "true");

        createH5forThumbsUp.appendChild(document.createTextNode(snapshot.val().thumbs_up));
        createH5forThumbsDown.appendChild(document.createTextNode(snapshot.val().thumbs_down));

        createIforThumbsUp.appendChild(createH5forThumbsUp);
        createIforThumbsDown.appendChild(createH5forThumbsDown);

        newPostStats.appendChild(createIforThumbsUp)
        newPostStats.appendChild(createIforThumbsDown)
        createArticle.appendChild(newPostStats);
        //crossNote(createIforThumbsUp, getUrlID);

    } else {
        console.log("No data available");
    }
})


/*SPRAWDZANIE CZY UŻYTKOWNIK JEST ZALOGOWANY, JEŚLI NIE TO NIE WYŚWIETLA MOŻLIWOŚCI DODAWANIA KOMENTARZY, JEŚLI TAK TO WYŚWIETLA FORMULARZ DODAWANIWA KOMENTARZA*/
firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
        document.querySelector('footer').setAttribute("style", "display:flex ");
    }
})



/*DODAWANIE NOWYCH KOMENTARZY*/
function addNewCommentFunction() {
    var getTimestamp = Timestamp();

    var newCommentInput = document.getElementById("newCommentInput").value;
    if (newCommentInput == "") {
        window.alert("Aby dodać nowy komentarz, pole tekstowe nie może być puste")
    } else {

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
        console.log("Brak odpowiedzi w wątku.");
    }
})
/* ------------------------------------------------------------------------------------------------------------ */

/* POBIERANIE TYTUŁU WĄTKU I AUTORA - POTRZEBNE DO ZAPISYWANIA WĄTKÓW */
firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
        dbRef.child("threads/" + getUrlID).get().then((
            snapshot) => {
            if (snapshot.exists()) {
                threadTitle = snapshot.val().title;
                threadAuthor = snapshot.val().author;
            } else {
                console.log("No data available");
            }
        })
    } else {
        console.log("Użytkownik nie jest zalogowany więc nie może pobrać danych wątku.")
    }
})

/* POTRZEBNE TO WYŻEJ /\ - POBIERA DANE I DODAJE DO ZAPISANYCH WĄTKÓW */
var getBookmark = document.getElementById("saveThread");
getBookmark.addEventListener("click", function () {
    getBookmark.setAttribute("class", "fas fa-bookmark")
    firebase.auth().onAuthStateChanged((user) => {
        if (user && user.emailVerified) {
            user_id = user.uid;
            firebase
                .database()
                .ref("/users/" + user_id + "/savedThreads/" + getUrlID)
                .set({
                    savedThreadAuthor: threadAuthor,
                    savedThreadTitle: threadTitle,
                })
        } else {
            console.log("Użytkownik niezalogowany więc nie może zapisać wątku.")
        }
    });

})

/*SPRAWDZANIE CZY JEST JUŻ TEN WĄTEK ZAPISANY - JEŚLI TAK TO ZMIENIA BOOKMARKA NA ZAZNACZONEGO */

firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
        user_id = user.uid;
        dbRef.child("/users/" + user_id + "/savedThreads/" + getUrlID).get().then((
            snapshot) => {
            if (snapshot.exists()) {
                getBookmark.setAttribute("class", "fas fa-bookmark")
            } else {
                console.log("Wątek jeszcze nie zapisany");
            }
        })
    } else {
        console.log("Użytkownik nie jest zalogowany więc nie może pobrać danych wątku.")
    }
})
/* ------------------------------------------------------------------------------------------------------------ */