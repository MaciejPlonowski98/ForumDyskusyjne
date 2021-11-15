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