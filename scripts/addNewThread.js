/* FORMULARZ TWORZENIA NOWEGO WĄTKI */
var user = firebase.auth().currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user && user.emailVerified) {
        console.log(user);
        document.getElementById('addNewThread').setAttribute("style", "display:block")

        document.getElementById('addNewThread').addEventListener("click", function () {
            document.querySelector('.addNewThreadPopUp').classList.add('PopUpActive');
            document.querySelector('main').classList.add('BlurBackground');
            document.querySelector('nav').classList.add('BlurBackground');
        })

        document.querySelector('.ClosePopUp').addEventListener("click", function () {
            document.querySelector('.addNewThreadPopUp').classList.remove('PopUpActive');
            document.querySelector('main').classList.remove('BlurBackground');
            document.querySelector('nav').classList.remove('BlurBackground');
        })


        /* Dodawanie pliku w tworzeniu nowego wątku */
        const actualBtn = document.getElementById('newThreadImageUpload');

        const fileChosen = document.getElementById('file-chosen');

        actualBtn.addEventListener('change', function () {
            fileChosen.textContent = this.files[0].name
        })
    } else {
        document.getElementById('addNewThread').setAttribute("style", "display:none");
    }
});

/*DODAWANIE NOWEGO WĄTKU DO BAZY DANYCH */
function addNewThreadInMainContainer() {
    var topicInput = document.getElementById("topicInput").value;
    var contentInput = document.getElementById("contentInput").value;
    var newThreadImageUpload = document.getElementById("newThreadImageUpload").value;
    console.log(topicInput, contentInput, newThreadImageUpload);

    firebase.auth().onAuthStateChanged((user) => {
        if (user && user.emailVerified) {
            user_id = user.uid;
            firebase
                .database()
                .ref("/threads/" + Timestamp())
                .set({
                    author: user.email,
                    content: contentInput,
                    creation_date: getTodayDate(),
                    entries: 1,
                    thread_rate: 0,
                    title: topicInput,
                    attached_file: newThreadImageUpload,
                }).then(() => {
                    location.assign("index.html")
                })
        } else {
            console.log("error")
            document.getElementById("navLogin").href = "login.html"
        }
    });
}

var getAside = document.querySelector("main>aside");
/* WYŚWIETLANIE WSZYSTKICH WĄTKÓW */
const dbRef = firebase.database().ref();
dbRef.child("threads").get().then((
    snapshot) => {
    if (snapshot.exists()) {
        data = Object.values(snapshot.val());
        dataKeys = Object.keys(snapshot.val());
        if (user && user.emailVerified) {
            var newThreadAuthor = document.getElementById("newThreadAuthor");
            newThreadAuthor.appendChild(document.createTextNode("Autor: " + user.email))
        }
        data.forEach((ex) => {
            /*Tworzy element div zaraz po aside i nadaje mu klase */
            var thread = document.createElement("div");
            thread.setAttribute("class", "thread")
            getAside.after(thread);
            /* Tworzy odnośnik a dla wszystkich elementów i umieszcza go w thread */
            var aMainElement = document.createElement("a");
            aMainElement.setAttribute("class", "testclick");
            aMainElement.setAttribute("href", "onet.pl");
            thread.appendChild(aMainElement);
            /* Tworzy pierwszy div threadTopic */
            var threadTopic = document.createElement("div");
            var threadTopicAFirst = document.createElement("a");
            var threadTopicASecond = document.createElement("a");
            threadTopic.setAttribute("class", "threadTopic");

            threadTopicAFirst.appendChild(document.createTextNode(ex.title))
            threadTopic.appendChild(threadTopicAFirst);

            threadTopicASecond.appendChild(document.createTextNode(ex.creation_date))
            threadTopic.appendChild(threadTopicASecond);

            /* Tworzy drugi div - threadEntries */
            var threadEntries = document.createElement("div");
            var threadEntriesA = document.createElement("a");

            threadEntries.setAttribute("class", "threadEntries");
            threadEntriesA.appendChild(document.createTextNode(ex.entries))
            threadEntries.appendChild(threadEntriesA);

            /*Tworzy trzeci div - threadAutor */
            var threadAutor = document.createElement("div");
            var threadAutorA = document.createElement("a");

            threadAutor.setAttribute("class", "threadAuthor");
            threadAutorA.appendChild(document.createTextNode(ex.author))
            threadAutor.appendChild(threadAutorA);

            /*Tworzy czwarty div - threadRate */
            var threadRate = document.createElement("div");
            var checked = parseInt(ex.thread_rate)


            for (var i = 0; i < checked; i++) {
                var span = document.createElement("span");
                threadRate.setAttribute("class", "threadRate");
                span.setAttribute("class", "fa fa-star checkedStar");
                threadRate.appendChild(span);
            }
            for (var j = checked; j < 5; j++) {
                var span = document.createElement("span");
                threadRate.setAttribute("class", "threadRate");
                span.setAttribute("class", "fa fa-star");
                threadRate.appendChild(span);
            }

            /* DODAWANIE WSZYSTKICH DIVÓW NA KOŃCU */
            thread.appendChild(threadTopic)
            thread.appendChild(threadEntries)
            thread.appendChild(threadAutor)
            thread.appendChild(threadRate)



        });
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});