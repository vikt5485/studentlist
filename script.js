"use strict";

document.addEventListener("DOMContentLoaded", start);

const HTML = {};
let studentsJSON = [];
let allStudents = [];
let selectedFilter;


const Student = {
  firstName: "",
  lastName: "",
  middleName: undefined,
  nickName: undefined,
  image: undefined,
  house: "",
  prefect: false
};

function start() {
  console.log("start");
  HTML.template = document.querySelector(".student-temp");
  HTML.dest = document.querySelector(".student-list");
  HTML.popup = document.querySelector(".popup");
  HTML.wrapper = document.querySelector(".student-wrapper");
  HTML.studentName = document.querySelector(".popup-content>h2");

  getJson();
  document.querySelector("select#theme").addEventListener("change", selectTheme);
  document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", handleFilter));

}

async function getJson() {
  console.log("getJson");

  const jsonData = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");

  studentsJSON = await jsonData.json();
  studentsJSON.forEach(cleanData);
  displayStudents(allStudents);
  listReady();
}

function cleanData(studentData) {
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
    student.middleName = undefined;
  } else if (student.middleName.includes('"')) {
    firstCharMiddle = student.middleName.substring(1, 2);
    firstCharMiddle = firstCharMiddle.toUpperCase();
    student.nickName = firstCharMiddle + fullName.substring(student.firstName.length + 3, fullName.lastIndexOf(" ") - 1);
    student.middleName = undefined;
  } else {
    student.middleName = firstCharMiddle + fullName.substring(student.firstName.length + 2, fullName.lastIndexOf(" "));
  }

  if (fullName.includes(" ") == false) {
    student.firstName = fullName.substring(1);
    student.firstName = firstChar + student.firstName;

    student.middleName = undefined;
    student.lastName = undefined;
  }

  // IMAGE

  student.image = student.lastName + "_" + firstChar;
  student.image = student.image.toLowerCase();

  if (student.lastName == "Patil") {
    student.image = student.lastName + "_" + student.firstName;
    student.image = student.image.toLowerCase();
  } else if (student.lastName == "Finch-Fletchley") {
    student.image = "fletchley_j";
  } else if (student.lastName == undefined) {
    student.image = undefined;
  }

  // HOUSE
  student.house = studentData.house.toLowerCase();
  student.house = student.house.trim()
  let houseFirstChar = student.house.substring(0, 1);
  houseFirstChar = houseFirstChar.toUpperCase();
  student.house = houseFirstChar + student.house.substring(1);

  student.prefect = false;

  allStudents.push(student);
  return allStudents;
}

function displayStudents(studentArray) {
  HTML.dest.innerHTML = "";
  console.log(studentArray);

  studentArray.forEach(showStudent);

  document.querySelector(".sort-name").addEventListener("click", function () {
    studentArray = studentArray.sort(sortByFirstName);
    displayStudents(studentArray);
  });

  document.querySelector(".sort-house").addEventListener("click", function () {
    studentArray = studentArray.sort(sortByHouse);
    displayStudents(studentArray);
  });
}

function showStudent(student) {
  let klon = HTML.template.cloneNode(true).content;

  if (student.lastName == undefined) {
    klon.querySelector(".name").textContent = student.firstName;
  } else {
    klon.querySelector(".name").textContent = student.firstName + " " + student.lastName;
  }

  klon.querySelector(".house").textContent = student.house;

  HTML.dest.appendChild(klon);

  HTML.dest.lastElementChild.querySelector(".name").addEventListener("click", () => {
    showPopup(student);
  });
}

function showPopup(student) {
  console.log("showPopup");

  HTML.popup.classList.add("popup-appear");
  HTML.wrapper.classList.add("wrapper-effect");

  document.querySelector(".popup-content").setAttribute("data-house", student.house);
  document.querySelector(".popup-content>h4").textContent = "House: " + student.house;
  document.querySelector(".popup-content>img").src = `images/${student.image}.png`;

  if (student.lastName == undefined) {
    console.log(student.firstName);
    HTML.studentName.textContent = student.firstName;
    document.querySelector(".popup-content>img").style.display = "none";
  } else if (student.middleName == undefined) {
    HTML.studentName.textContent = student.firstName + " " + student.lastName;
    document.querySelector(".popup-content>img").style.display = "block";
  } else {
    HTML.studentName.textContent = student.firstName + " " + student.middleName + " " + student.lastName;
    document.querySelector(".popup-content>img").style.display = "block";
  }

  if (student.nickName != undefined) {
    HTML.studentName.textContent = `${student.firstName} "${student.nickName}" ${student.lastName}`;
  }

  document.querySelector(".close").addEventListener("click", () => {
    HTML.popup.classList.remove("popup-appear");
    HTML.wrapper.classList.remove("wrapper-effect");
  });
}

function listReady() {
  console.log("listReady");
}

function handleFilter() {
  selectedFilter = this.dataset.filter;
  console.log(selectedFilter);

  filterArray(selectedFilter);
}

function filterArray(selectedFilter) {
  let filteredArray = [];

  if (selectedFilter == "*") {
    filteredArray = allStudents;
  } else {
    filteredArray = studentsFilteredByHouse(selectedFilter);
  }

  displayStudents(filteredArray);
}

function studentsFilteredByHouse(house) {
  const result = allStudents.filter(filterFunction);

  function filterFunction(student) {
    return student.house === house;
  }

  return result;
}

function sortByFirstName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}



function selectTheme() {
  document.querySelector("body").setAttribute("data-house", this.value);
}