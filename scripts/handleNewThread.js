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
        var authorUid = snapshot.val().userUid;

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
        var autor = snapshot.val().author
        createH4forData.appendChild(document.createTextNode(snapshot.val().creation_date));
        createH4forUser.appendChild(document.createTextNode(autor));
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

        firebase.auth().onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
                dbRef.child("users").child(user_id).child("userInfo").get().then((
                    snapshot) => {
                    if (snapshot.exists()) {
                        if (snapshot.val().accountType == "Administrator" && user.email != autor) {
                            console.log(snapshot.val().accountType, autor)
                            /* USUWANIE CAŁEGO WĄTKU ROZMÓW Z POZIOMU ADMINISTRATORA */
                            var createDeletingElement = document.createElement("i");
                            createDeletingElement.setAttribute("class", "fas fa-folder-minus");
                            deletePost(createDeletingElement, getUrlID);
                            newPostOptions.appendChild(createDeletingElement);


                            var createBlockingUserElement = document.createElement("i");
                            createBlockingUserElement.setAttribute("class", "fas fa-user-lock");
                            blockAccount(createBlockingUserElement, authorUid);
                            newPostOptions.appendChild(createBlockingUserElement);



                        }
                    }
                })
            }
        })
    } else {
        console.log("No data available");
    }
    firebase.auth().onAuthStateChanged((user) => {
        var checkCurrentUser = firebase.auth().currentUser;
        if (user && user.emailVerified) {
            if (checkCurrentUser.email == snapshot.val().author) {
                /* PRZYCISK DO USUWANIA WŁASNEGO KOMENTARZA */
                var createDeletingElement = document.createElement("i");
                createDeletingElement.setAttribute("class", "fas fa-folder-minus");
                deletePost(createDeletingElement, getUrlID);
                newPostOptions.appendChild(createDeletingElement);

                /*PRZYCISK DO EDYTOWANIA WŁASNEGO KOMENTARZA */
                var createEditingElement = document.createElement("i");
                createEditingElement.setAttribute("class", "fas fa-edit");
                EditThread(createEditingElement, getUrlID);
                newPostOptions.appendChild(createEditingElement);
            }
        }
    })


})

/*EDYCJA GŁÓWNEGO WĄTKU */
function EditThread(createEditingElement, klucz) {
    createEditingElement.addEventListener("click", function () {
        var editingCommentPopup = document.getElementById("EditComment");
        editingCommentPopup.classList.add("active");

        var getMain = document.querySelector("section");
        getMain.classList.add("blur");


        var editingCommentTextarea = document.querySelector("#EditComment>textarea");
        firebase.auth().onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
                dbRef.child("threads").child(getUrlID).get().then((
                    snapshot) => {
                    if (snapshot.exists()) {
                        var oldContent = snapshot.val().content;
                        editingCommentTextarea.value = oldContent;
                        closeEditComment(editingCommentTextarea);
                        sendEditedThreadToDatabase(klucz);
                    }
                })
            }
        })

    })
}

function sendEditedThreadToDatabase() {
    var getSaveButton = document.getElementById("submitEdited");
    getSaveButton.addEventListener("click", function () {
        var getNewCommentContent = document.querySelector("#EditComment>textarea").value;
        firebase
            .database()
            .ref("/threads/" + getUrlID)
            .update({
                content: getNewCommentContent,
            })
            .then(() => location.assign("thread.html?id=" + getUrlID))
            .catch((error) => {
                console.error(error);
            });
    })
}

/*USUWANIE CAŁEGO POSTA - POPRZEZ OSOBĘ KTÓRA GO UTWORZYŁA*/
function deletePost(createDeletingElement, postID) {
    createDeletingElement.addEventListener("click", function () {
        var user = firebase.auth().currentUser;
        if (confirm("Potwierdź usuwanie całego wątku.")) {
            if (user && user.emailVerified) {
                firebase
                    .database()
                    .ref("/threads/" + postID)
                    .remove()
                    .then(() => {
                        location.assign("../index.html")
                    })
            }
        } else {
            window.alert("Anulowałeś usuwanie posta.")
        }
    });
}

/*BLOKOWANIE UŻYTKOWNIKA W POŚCIE - Z POZIOMU AMINISTRATORA */
function blockAccount(createBlockingUserElement, account) {
    var authRef = firebase.auth();
    createBlockingUserElement.addEventListener("click", function () {
        if (confirm("Potwierdź blokowanie użytkownika.")) {
            /*TUTAJ POWINNO BYĆ BLOKOWANIE UŻYTKOWNIKA - TEGO KTÓRY UTWORZYŁ POSTA */
        } else {
            window.alert("Anulowałeś usuwanie posta.")
        }
    });
}


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
            console.log("test")
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

            /* USUWANIE TYLKO I WYŁĄCZNIE WŁASNYCH KOMENTARZY - NAPISANYCH PRZEZ SAMEGO SIEBIE */
            firebase.auth().onAuthStateChanged((user) => {
                var checkCurrentUser = firebase.auth().currentUser;
                if (user && user.emailVerified) {
                    if (checkCurrentUser.email == wartosc.repAuthor) {
                        /* PRZYCISK DO USUWANIA WŁASNEGO KOMENTARZA */
                        var createDeletingElement = document.createElement("i");
                        createDeletingElement.setAttribute("class", "fas fa-trash-alt");
                        deleteComment(createDeletingElement, klucz);
                        newPostOptions.appendChild(createDeletingElement);

                        /*PRZYCISK DO EDYTOWANIA WŁASNEGO KOMENTARZA */
                        var createEditingElement = document.createElement("i");
                        createEditingElement.setAttribute("class", "fas fa-edit");
                        EditComment(createEditingElement, klucz);
                        newPostOptions.appendChild(createEditingElement);


                    }
                }
            })

            /* DODANIE FUNKCJI ADMINISTRATORA DO USUWANIA POJEDYŃCZYCH KOMENTARZY */
            firebase.auth().onAuthStateChanged((user) => {
                if (user && user.emailVerified) {
                    dbRef.child("users").child(user_id).child("userInfo").get().then((
                        snapshot) => {
                        if (snapshot.exists()) {
                            /* DRUGI ARGUMENT JEST PO TO ABY NIE DUPLIKOWAŁY SIĘ DWA ŚMIETNIKI DO USUWANIA POSTA
                            Z RACJI TEGO ŻE ADMIN SAM NAPISAŁ POSTA I DLATEGO ŻE JEST ADMINEM  I JEDNOCZEŚNIE ŻEBY NIE MÓGL ZABLOKOWAĆ SAM SIEBIE*/
                            if (snapshot.val().accountType == "Administrator" && firebase.auth().currentUser.email != wartosc.repAuthor) {
                                /* USUWANIE POJEDYŃCZEGO KOMENTARZA  Z POZIOMU ADMINISTRATORA */
                                var createDeletingElement = document.createElement("i");
                                createDeletingElement.setAttribute("class", "fas fa-trash-alt");
                                deleteComment(createDeletingElement, klucz);
                                newPostOptions.appendChild(createDeletingElement);

                                /*Blokowanie użytkwonika który napisał komentarz */
                                var createBlockingUserElement = document.createElement("i");
                                createBlockingUserElement.setAttribute("class", "fas fa-user-lock");
                                newPostOptions.appendChild(createBlockingUserElement);

                            }
                        }
                    })
                }
            })

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

function deleteComment(createDeletingElement, postID) {
    createDeletingElement.addEventListener("click", function () {
        if (confirm("Potwierdź usuwanie tego komentarza.")) {
            firebase
                .database()
                .ref("/threads/" + getUrlID + "/_responses/" + postID)
                .remove()
                .then(() => {
                    location.assign("../pages/thread.html?id=" + getUrlID);
                })
        } else {
            window.alert("Anulowałeś usuwanie posta.")
        }
    });

}
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


/* EDYTOWANIE KOMENTARZA -- EDITCOMMENT - nasluchuje na ikonke, po czym pobiera tresc z bazy i wyswietla ja w textarea
po czym jest sa przesylane dane do funkcji wysylajacej nowa tresc komentarza do bazy - po uzyciu przycisku Zapisz */
function EditComment(createEditingElement, klucz) {
    createEditingElement.addEventListener("click", function () {
        var editingCommentPopup = document.getElementById("EditComment");
        editingCommentPopup.classList.add("active");

        var getMain = document.querySelector("section");
        getMain.classList.add("blur");


        var editingCommentTextarea = document.querySelector("#EditComment>textarea");
        firebase.auth().onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
                dbRef.child("threads").child(getUrlID).child("_responses").child(klucz).get().then((
                    snapshot) => {
                    if (snapshot.exists()) {
                        var oldContent = snapshot.val().repContent
                        editingCommentTextarea.value = oldContent;
                        closeEditComment(editingCommentTextarea);
                        sendNewContentToDatabase(klucz);
                    }
                })
            }
        })

    })
}

function sendNewContentToDatabase(klucz) {
    var getSaveButton = document.getElementById("submitEdited");
    getSaveButton.addEventListener("click", function () {
        var getNewCommentContent = document.querySelector("#EditComment>textarea").value;
        firebase
            .database()
            .ref("/threads/" + getUrlID + "/_responses/" + klucz)
            .update({
                repContent: getNewCommentContent,
            })
            .then(() => location.assign("thread.html?id=" + getUrlID))
            .catch((error) => {
                console.error(error);
            });
    })
}


/*Funkcja wyłączania popup i dzieki jquery usuwania zawartosci textarea przez co jesli drugi raz sie uzyje przycisku to tresc sie nie dubluje*/
function closeEditComment(editingCommentTextarea) {
    var closeEditButton = document.getElementById("cancelEdited");
    var editingCommentPopup = document.getElementById("EditComment");



    closeEditButton.addEventListener("click", function () {
        editingCommentPopup.classList.remove("active")

        var getMain = document.querySelector("section");
        getMain.classList.remove("blur");
        editingCommentTextarea.value = "";
    })

}