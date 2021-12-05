/* WYŚWIETLANIE ZAPISANYCH WĄTKÓW W ZAKŁADCE ACCOUNT + OBŁSŁUGA ICH USUWANIA */
var savedThreads = document.querySelector(".savedThreads");
const dbRef = firebase.database().ref();
const getUrl = window.location.search;
const urlParams = new URLSearchParams(getUrl);
const getUrlID = urlParams.get('id')


firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
        user_id = user.uid;
        dbRef.child("/users/" + user_id + "/savedThreads").get().then((
            snapshot) => {
            if (snapshot.exists()) {
                var getInfo = Object.entries(snapshot.val());
                getInfo.map(([klucz, wartosc]) => {
                    var createSavedElement = document.createElement("div");
                    createSavedElement.setAttribute("class", "savedElement");

                    var createSavedElementInfo = document.createElement("div");
                    var createSavedElementInfoTitle = document.createElement("a");
                    var createSavedElementInfoH5 = document.createElement("h5");
                    var createSavedElementInfoH5a = document.createElement("a");

                    createSavedElementInfo.setAttribute("class", "savedElementInfo");
                    createSavedElementInfo.setAttribute("onclick", "location.href='thread.html?id=" + klucz + "';");

                    createSavedElementInfoTitle.appendChild(document.createTextNode(wartosc.savedThreadTitle))
                    createSavedElementInfo.appendChild(createSavedElementInfoTitle);


                    createSavedElementInfoH5a.appendChild(document.createTextNode("Autor: " + wartosc.savedThreadAuthor));
                    createSavedElementInfoH5.appendChild(createSavedElementInfoH5a);

                    createSavedElementInfo.appendChild(createSavedElementInfoH5);


                    var createDeleteSavedElement = document.createElement("div");
                    var createIForDeleteSavedElement = document.createElement("i");

                    createDeleteSavedElement.setAttribute("class", "deleteSavedElement");

                    createIForDeleteSavedElement.setAttribute("class", "fas fa-times");
                    deleteSavedElementFromDatabase(createSavedElement, createIForDeleteSavedElement, klucz);

                    createDeleteSavedElement.appendChild(createIForDeleteSavedElement);

                    createSavedElement.appendChild(createSavedElementInfo);
                    createSavedElement.appendChild(createDeleteSavedElement);
                    savedThreads.appendChild(createSavedElement);

                })
            }
        })

    } else {
        document.getElementById("navLogin").href = "login.html"
    }
});


function deleteSavedElementFromDatabase(element, i, klucz) {
    i.addEventListener("click", function () {
        firebase
            .database()
            .ref("/users/" + user_id + "/savedThreads/" + klucz)
            .remove()
            .then(() => {
                element.remove();
            })
            .catch((error) => {
                console.error(error);
            });
    });

}