getLogoutButton = document.getElementById("logOut");
getLogoutButton.addEventListener("click", function () {
    firebase.auth().signOut().then(() => {
        location.href = "../index.html";
    });
})


document.getElementById("changePassword").addEventListener("click", function () {
    document.querySelector("main").classList.add("avoid-clicks");
    document.querySelector(".changePasswordPopup").setAttribute("style", "display:flex");
    document.querySelector(".closeChangePassword").addEventListener("click", function () {
        document.querySelector("main").classList.remove("avoid-clicks");
        document.querySelector(".changePasswordPopup").setAttribute("style", "display:none");
    })
})



function changePassword() {
    const user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var email = user.email;
            oldPassword = document.getElementById("oldPassword").value;
            newPassword1 = document.getElementById("newPassword1").value;
            newPassword2 = document.getElementById("newPassword2").value;
            newPasswordErrorBox = document.querySelector(".newPasswordErrorBox");

            var regularExpressionForPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
                newPassword1);

            if (newPassword1 == "" || newPassword2 == "")
                newPasswordErrorBox.innerHTML = "Uzupełnij pola";
            else if (newPassword1 != newPassword2)
                newPasswordErrorBox.innerHTML = "Podane hasła nie sa takie same.";
            else if (!regularExpressionForPassword)
                newPasswordErrorBox.innerHTML = "Nowe hasło jest za słabe";
            else {
                firebase.auth()
                    .signInWithEmailAndPassword(email, oldPassword)
                    .then(function (user) {
                        firebase.auth().currentUser.updatePassword(newPassword1).then(function () {
                            console.log(email, oldPassword, newPassword1)
                            location.href = "account.html"
                        })
                    }).catch((error) => {
                        if (error.code === 'auth/wrong-password') {
                            newPasswordErrorBox.innerHTML = "Stare hasło jest niepoprawne!"
                            setTimeout(function () {
                                newPasswordErrorBox.innerHTML = "";
                            }, 5000);
                        }
                        if (error.code === 'auth/too-many-requests') {
                            newPasswordErrorBox.innerHTML = "Za dużo prób, spróbuj później."
                            setTimeout(function () {
                                newPasswordErrorBox.innerHTML = "";
                            }, 5000);
                        }
                    });
            }
        }
    });
}