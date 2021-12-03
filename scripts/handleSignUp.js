function handleSignUp() {

    var getAccountName = document.getElementById("accountName").value;
    var getAccountEmail = document.getElementById("accountEmail").value;
    var getAccountPassword_1 = document.getElementById("accountPassword_1").value;
    var getAccountPassword_2 = document.getElementById("accountPassword_2").value;
    var getCarMark = document.getElementById("cars").value;
    var getCarModel = document.getElementById("cars_model").value;

    var getErrorBox = document.querySelector(".errorBox");

    var regularExpressionForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(getAccountEmail);
    var regularExpressionForPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
        getAccountPassword_1);

    var setTimestamp = Timestamp();

    if (getAccountName == "" || getAccountEmail == "" || getAccountPassword_1 == "" ||
        getAccountPassword_2 == "" || getCarMark == "" || getCarModel == "") {
        getErrorBox.innerHTML = "Uzupełnij wszystkie pola!";
    } else if (getAccountName.length < 5) {
        getErrorBox.innerHTML = "Nazwa użytkownika musi zawierać więcej niż 5 znaków!";
    } else if (getAccountName.length > 30) {
        getErrorBox.innerHTML = "Nazwa użytkownika musi zawierać mniej niż 30 znaków!";
    } else if (!regularExpressionForEmail) {
        getErrorBox.innerHTML = "Niepoprawny format e-mail!";
    } else if (getAccountPassword_1 != getAccountPassword_2) {
        getErrorBox.innerHTML = "Hasła nie są identyczne!";
    } else if (!regularExpressionForPassword) {
        getErrorBox.innerHTML =
            "Hało musi zawierać od 6 do 16 znaków, co najmniej 1 cyfrę oraz znak specjalny!";
    } else {
        firebase
            .auth()
            .createUserWithEmailAndPassword(getAccountEmail, getAccountPassword_1)
            .then((result) => {
                firebase
                    .database()
                    .ref("/users/" + result.user.uid + "/cars/" + setTimestamp)
                    .set({
                        CarId: setTimestamp,
                        Mark: getCarMark,
                        Model: getCarModel,
                    })
                firebase
                    .database()
                    .ref("/users/" + result.user.uid + "/userInfo")
                    .set({
                        accountEmail: getAccountEmail,
                        accountName: getAccountName,
                        accountType: "Użytkownik",
                        accountRates: 0,
                    }).then(() => {
                        sendVerification();
                    })
                    .then(() => {
                        location.assign("login.html")
                    })

            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    console.log("That email address is already in use!");
                    error = "Ten adres email jest już użyty, prosze podac inny !";
                }

                if (error.code === "auth/invalid-email") {
                    console.log("That email address is invalid!");
                    error = "Ten adres email jest błędny !";
                }
                console.error(error);
                getErrorBox.innerHTML = error;
            });
    }

}

function sendVerification() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function () {
        window.alert("Wysłano maila potwierdzającego!");
    }).catch(function (error) {
        //error OBSŁUŻYĆ ERRORY
    })
}