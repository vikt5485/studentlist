let students = [];
const template = document.querySelector(".student-temp");
const dest = document.querySelector(".student-list");
const popup = document.querySelector(".popup");
const wrapper = document.querySelector(".student-wrapper");

document.addEventListener("DOMContentLoaded", start);

function start() {
    console.log("start");
    getJson();
    document.querySelector("select#theme").addEventListener("change", selectTheme);
}

async function getJson() {
    console.log("getJson");

    const jsonData = await fetch("students1991.json");

    students = await jsonData.json();
    console.log(students);

    showStudents();
}

function selectTheme() {
    document.querySelector("body").setAttribute("data-house", this.value);

}


function showStudents() {
    console.log("showStudents");
    students.forEach(student => {
        let klon = template.cloneNode(true).content;

        klon.querySelector("li").textContent = student.fullname;
        if (student.fullname == "Harry Potter") {
            klon.querySelector("li").textContent = student.fullname + " ⚡";
        }

        dest.appendChild(klon);

        dest.lastElementChild.addEventListener("click", () => {
            showPopup(student);
        });
    });
}

function showPopup(student) {
    console.log("showPopup");
    popup.classList.add("popup-appear");
    wrapper.classList.add("wrapper-effect");

    document.querySelector(".popup-content").setAttribute("data-house", student.house);

    document.querySelector(".popup-content>h2").textContent = student.fullname;
    document.querySelector(".popup-content>h3").textContent =
        "House: " + student.house;

    if (student.fullname == "Harry Potter") {
        document.querySelector(".popup-content>h2").textContent = student.fullname + " ⚡";
    }

    document.querySelector(".close").addEventListener("click", () => {
        popup.classList.remove("popup-appear");
        wrapper.classList.remove("wrapper-effect");
    });
}