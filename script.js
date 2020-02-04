let students = [];
const template = document.querySelector(".student-temp");
const dest = document.querySelector(".student-list");
const popup = document.querySelector(".popup");

document.addEventListener("DOMContentLoaded", start);

function start() {
    console.log("start");
    getJson();
}

async function getJson() {
    console.log("getJson");

    const jsonData = await fetch("students1991.json");

    students = await jsonData.json();
    console.log(students);

    showStudents();
}

function showStudents() {
    console.log("showStudents");
    students.forEach(student => {
        let klon = template.cloneNode(true).content;

        klon.querySelector("li").textContent = student.fullname;

        dest.appendChild(klon);

        dest.lastElementChild.addEventListener("click", () => {
            showPopup(student);
        })
    })
}

function showPopup(student) {
    console.log("showPopup");
    popup.style.display = "flex";

    if (student.house == "Gryffindor") {
        popup.style.backgroundColor = "rgba(100, 23, 59, 0.7)";
    } else if (student.house == "Hufflepuff") {
        popup.style.backgroundColor = "rgba(239, 180, 31, 0.7)";
    } else if (student.house == "Ravenclaw") {
        popup.style.backgroundColor = "rgba(1, 76, 126, 0.7)";
    } else if (student.house == "Slytherin") {
        popup.style.backgroundColor = "rgba(17, 69, 50, 0.7)";
    }

    document.querySelector(".popup-content>h2").textContent = student.fullname;
    document.querySelector(".popup-content>h3").textContent = "House: " + student.house;

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".popup").style.display = "none";
    })
}