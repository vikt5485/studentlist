"use strict";

document.addEventListener("DOMContentLoaded", start);

const HTML = {};
let students = [];
let allStudents = [];
let studentCount;

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: null,
  house: ""
};

function start() {
  console.log("start");
  HTML.template = document.querySelector(".student-temp");
  HTML.dest = document.querySelector(".student-list");
  HTML.popup = document.querySelector(".popup");
  HTML.wrapper = document.querySelector(".student-wrapper");
  studentCount = 0;

  getJson();
  document.querySelector("select#theme").addEventListener("change", selectTheme);
}

async function getJson() {
  console.log("getJson");

  const jsonData = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");

  students = await jsonData.json();
  showStudents();
}

function selectTheme() {
  document.querySelector("body").setAttribute("data-house", this.value.toLowerCase());
}

function showStudents() {
  console.log("showStudents");
  students.forEach(showAStudent);
  console.log(allStudents);
}

function showAStudent(studentData) {
  let student = Object.create(Student);

  // FULL NAME
  let fullName = studentData.fullname.trim();
  fullName = fullName.toLowerCase();

  // FIRST NAME
  let firstChar = fullName.substring(0, 1);
  firstChar = firstChar.toUpperCase();

  student.firstName = fullName.substring(1, fullName.indexOf(" "));
  student.firstName = firstChar + student.firstName;



  // LAST NAME
  student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.length + 1);

  let firstCharLastName = student.lastName.substring(0, 1);
  firstCharLastName = firstCharLastName.toUpperCase();
  student.lastName = firstCharLastName + fullName.substring(fullName.lastIndexOf(" ") + 2, fullName.length + 1);

  if (student.lastName.includes("-")) {
    let firstLastName = student.lastName.substring(0, student.lastName.indexOf("-"));
    let secondLastName = student.lastName.substring(student.lastName.indexOf("-") + 1);
    let firstCharSecondLastName = secondLastName.substring(0, 1);
    firstCharSecondLastName = firstCharSecondLastName.toUpperCase();
    secondLastName = firstCharSecondLastName + student.lastName.substring(student.lastName.indexOf("-") + 2);

    student.lastName = firstLastName + "-" + secondLastName;
  }

  // MIDDLE NAME
  student.middleName = fullName.substring(student.firstName.length + 1, fullName.lastIndexOf(" "));
  let firstCharMiddle = student.middleName.substring(0, 1);
  firstCharMiddle = firstCharMiddle.toUpperCase();

  if (student.middleName == " ") {
    student.middleName = "";
  } else if (student.middleName.includes('"')) {
    firstCharMiddle = student.middleName.substring(1, 2);
    firstCharMiddle = firstCharMiddle.toUpperCase();
    student.middleName = '"' + firstCharMiddle + fullName.substring(student.firstName.length + 3, fullName.lastIndexOf(" "));
  } else {
    student.middleName = firstCharMiddle + fullName.substring(student.firstName.length + 2, fullName.lastIndexOf(" "));
  }


  // student.nickName =
  // student.image =
  // student.house =

  if (fullName.includes(" ") == false) {
    student.firstName = fullName.substring(1);
    student.firstName = firstChar + student.firstName;

    student.middleName = "";
    student.lastName = "";
  }
  fullName = student.firstName + " " + student.middleName + " " + student.lastName;

  let klon = HTML.template.cloneNode(true).content;

  klon.querySelector("li").textContent = fullName;
  if (fullName == "Harry James Potter") {
    klon.querySelector("li").textContent = fullName + " ⚡";
  }

  HTML.dest.appendChild(klon);

  HTML.dest.lastElementChild.addEventListener("click", () => {
    showPopup(studentData);
  });

  allStudents.push(student);
}

function showPopup(studentData) {
  console.log("showPopup");
  HTML.popup.classList.add("popup-appear");
  HTML.wrapper.classList.add("wrapper-effect");

  document.querySelector(".popup-content").setAttribute("data-house", studentData.house.toLowerCase());

  document.querySelector(".popup-content>h2").textContent = studentData.fullname;
  document.querySelector(".popup-content>h3").textContent = "House: " + studentData.house;

  if (studentData.fullname == "Harry Potter") {
    document.querySelector(".popup-content>h2").textContent = studentData.fullname + " ⚡";
  }

  document.querySelector(".close").addEventListener("click", () => {
    HTML.popup.classList.remove("popup-appear");
    HTML.wrapper.classList.remove("wrapper-effect");
  });
}
