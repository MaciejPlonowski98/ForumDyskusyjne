function handleLogin() {
    let getLoggingEmail = document.getElementById("login").value;
    let getLoggingPassword = document.getElementById("password").value;
    let getLoginErrorBox = document.querySelector(".LoginErrorBox");
    firebase
        .auth()
        .signInWithEmailAndPassword(getLoggingEmail, getLoggingPassword)
        .then(() => {
            var user = firebase.auth().currentUser;
            if (user && user.emailVerified) {
                //console.log("User logged in");
                location.href = "../index.html";
            } else {
                getLoginErrorBox.innerHTML = "Aby się zalogować musisz potwierdzić swój adres e-mail!"
            }

        })
        .catch((error) => {
            if (error.code === 'auth/user-not-found') {
                getLoginErrorBox.innerHTML = "Brak użytkownika o podanym email."
                setTimeout(function () {
                    getLoginErrorBox.innerHTML = "";
                }, 5000);
            }
            if (error.code === 'auth/wrong-password') {
                getLoginErrorBox.innerHTML = "Błędne hasło."
                setTimeout(function () {
                    getLoginErrorBox.innerHTML = "";
                }, 5000);
            }
            if (error.code === 'auth/too-many-requests') {
                getLoginErrorBox.innerHTML = "Zbyt dużo prób połączenia, spróbuj później."
                setTimeout(function () {
                    getLoginErrorBox.innerHTML = "";
                }, 5000);
            }
            console.error(error);
            //console.log("Coś poszło nie tak!");
        })

}