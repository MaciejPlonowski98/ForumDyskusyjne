/* OBSŁUGA FORMULARZA LOGOWANIA LUB REJESTRACJI */

let registerAccountBox = document.getElementById("registerAccountBox");
let loginSection = document.getElementById("loginSection");
let registerAccountLink = document.getElementById("registerAccount");
registerAccountLink.addEventListener("click", function () {
    registerAccountBox.classList.toggle("active");
    loginSection.classList.toggle("active");

    var getHeader = document.querySelector("header");
    var getFooter = document.getElementById("registerAccount");

    if (getHeader.innerHTML === "Zaloguj się") {
        getHeader.innerHTML = "Rejestracja";
        getFooter.innerHTML = "Masz już konto? Zaloguj się!";
    } else {
        getHeader.innerHTML = "Zaloguj się";
        getFooter.innerHTML = "Nie masz konta? Zarejestruj się!";
    }
})