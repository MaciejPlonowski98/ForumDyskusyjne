function sendNewPassword() {
    var getForgotPasswordEmail = document.getElementById("forgotPasswordEmail").value;
    var getForgetPasswordErrorBox = document.querySelector(".forgotPasswordErrorBox");

    if (getForgotPasswordEmail != "") {
        firebase.auth().sendPasswordResetEmail(getForgotPasswordEmail).then(function () {
            getForgetPasswordErrorBox.setAttribute("style", "color:green");
            getForgetPasswordErrorBox.innerHTML = "Na podany mail została wysłana wiadomość!"
            setTimeout(function () {
                getForgetPasswordErrorBox.innerHTML = "";
            }, 5000);
        }).catch((error) => {
            if (error.code === 'auth/invalid-email') {
                getForgetPasswordErrorBox.innerHTML = "Nieprawidłowy email."
                setTimeout(function () {
                    getForgetPasswordErrorBox.innerHTML = "";
                }, 5000);
            }
            if (error.code === 'auth/user-not-found') {
                getForgetPasswordErrorBox.innerHTML = "Nie znaleziono użytkownika o podanym e-mailu."
                setTimeout(function () {
                    getForgetPasswordErrorBox.innerHTML = "";
                }, 5000);
            }
        })

    } else {

        getForgetPasswordErrorBox.innerHTML = "Uzupełnij pole!";
        setTimeout(function () {
            getForgetPasswordErrorBox.innerHTML = "";
        }, 5000);
    }
}