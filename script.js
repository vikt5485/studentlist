let students = [];
const template = document.querySelector(".student-temp");
const dest = document.querySelector(".student-list");

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
    })
}