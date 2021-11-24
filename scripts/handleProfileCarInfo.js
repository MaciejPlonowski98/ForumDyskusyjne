    /* FORMULARZ DODAWANIA NOWEGO POJAZDU */
    document.getElementById("addNewVehicle").addEventListener("click", function () {
        document.querySelector("main").classList.add("avoid-clicks");
        document.querySelector(".addVehiclePopup").setAttribute("style", "display:flex");
        document.querySelector(".closeAddNewVehiclePopup").addEventListener("click", function () {
            document.querySelector("main").classList.remove("avoid-clicks");
            document.querySelector(".addVehiclePopup").setAttribute("style", "display:none");
        })
    })


    /*DODAWANIE POJAZDU DO BAZY DANYCH*/

    function addNewVehicleToDatabase() {
        newCarMark = document.getElementById("cars").value;
        newVehicleModel = document.getElementById("newVehicleModel").value;
        getTimestamp = Timestamp();

        firebase.auth().onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
                user_id = user.uid;
                firebase
                    .database()
                    .ref("/users/" + user_id + "/cars/" + getTimestamp)
                    .set({
                        CarId: getTimestamp,
                        Mark: newCarMark,
                        Model: newVehicleModel
                    }).then(() => {
                        location.assign("account.html")
                    })
            } else {
                console.log("error")
                document.getElementById("navLogin").href = "login.html"
            }
        });

    }

    function deleteOwnedCar(element, id) {
        // element i jego ID
        element.addEventListener("click", (e) => {
            var todo_id = e.target.parentNode.id;
            console.log(todo_id);
            firebase
                .database()
                .ref("/users/" + user_id + "/cars/" + todo_id)
                .remove()
                .then(() => {
                    e.target.parentNode.remove();
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }


    /* WYŚWIETLANIE POJAZDÓW Z BAZY */
    var ownedVehicles = document.getElementById("ownedVehicles");

    firebase.auth().onAuthStateChanged((user) => {
        if (user && user.emailVerified) {
            user_id = user.uid;

            const dbRef = firebase.database().ref();
            dbRef.child("users").child(user_id).child("cars").get().then((
                snapshot) => {
                if (snapshot.exists()) {
                    data = Object.values(snapshot.val());
                    dataKeys = Object.keys(snapshot.val());
                    counter = 0;

                    data.forEach((ex) => {
                        var carSingleBox = document.createElement("div");
                        carSingleBox.classList.add("ownedCar");
                        var createH2 = document.createElement("h2");
                        var createH3 = document.createElement("h3");
                        var createDeleteDiv = document.createElement("div");
                        var createTextForDeleteDiv = document.createTextNode("Usuń pojazd");
                        createDeleteDiv.setAttribute("class", "deleteOwnedCar");

                        carSingleBox.appendChild(createH2);
                        createH2.appendChild(document.createTextNode(ex.Mark));

                        carSingleBox.appendChild(createH3);
                        createH3.appendChild(document.createTextNode(ex.Model));

                        carSingleBox.appendChild(createDeleteDiv);
                        createDeleteDiv.appendChild(createTextForDeleteDiv);
                        createDeleteDiv.setAttribute("id", ex.CarId);

                        carSingleBox.setAttribute("id", ex.CarId)

                        console.log()

                        ownedVehicles.appendChild(carSingleBox)
                        deleteOwnedCar(createDeleteDiv, ex.CarId);

                    });
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {
            document.getElementById("navLogin").href = "login.html"
        }
    });