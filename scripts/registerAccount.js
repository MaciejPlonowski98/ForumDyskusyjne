/* OBSŁUGA FORMULARZA LOGOWANIA LUB REJESTRACJI */

let registerForm = document.getElementById("registerForm");
let loginForm = document.getElementById("loginForm");
let forgotPasswordBox = document.getElementById("forgotPasswordBox");

let registerAccountLink = document.querySelector(".registerAccount");
let forgotPasswordLink = document.querySelector(".forgotPassword")

registerAccountLink.addEventListener("click", function () {
    registerForm.classList.toggle("down");
    loginForm.classList.toggle("down");
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
    loginForm.classList.toggle("up");
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