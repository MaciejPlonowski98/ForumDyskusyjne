/* OBSŁUGA FORMULARZA LOGOWANIA LUB REJESTRACJI */

let registerAccountBox = document.getElementById("registerAccountBox");
let loginSection = document.getElementById("loginSection");
let forgotPasswordBox = document.getElementById("forgotPasswordBox");

let registerAccountLink = document.querySelector(".registerAccount");
let forgotPasswordLink = document.querySelector(".forgotPassword")

registerAccountLink.addEventListener("click", function () {
    registerAccountBox.classList.toggle("down");
    loginSection.classList.toggle("down");
    forgotPasswordLink.classList.toggle("disappear");

    var getHeader = document.querySelector("header");
    var getFooter = document.querySelector(".registerAccount");

    if (getHeader.innerHTML === "Zaloguj się") {
        getHeader.innerHTML = "Rejestracja";
        getFooter.innerHTML = "Masz już konto? Zaloguj się!";
    } else {
        getHeader.innerHTML = "Zaloguj się";
        getFooter.innerHTML = "Nie masz konta? Zarejestruj się!";
    }
})

forgotPasswordLink.addEventListener("click", function () {
    forgotPasswordBox.classList.toggle("up");
    loginSection.classList.toggle("up");
    registerAccountLink.classList.toggle("disappear");

    var getHeader = document.querySelector("header");
    var getFooter = document.querySelector(".forgotPassword");

    if (getHeader.innerHTML === "Zaloguj się") {
        getHeader.innerHTML = "Przypomnij hasło";
        getFooter.innerHTML = "Masz już konto? Zaloguj się!";
    } else {
        getHeader.innerHTML = "Zaloguj się";
        getFooter.innerHTML = "Zapomniałeś hasła?";
    }

})