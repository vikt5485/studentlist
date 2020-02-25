"use strict";

document.addEventListener("DOMContentLoaded", start);

const HTML = {};
let studentsJSON = [];
let currentStudents = [];
let allStudents = [];
let expelledStudents = [];

let selectedFilter;
let sortBy;
let sortDirection;

const Student = {
  firstName: "",
  lastName: "",
  middleName: undefined,
  nickName: undefined,
  image: undefined,
  house: "",
  prefect: false,
  expelled: false
};

function start() {
  console.log("start");
  HTML.template = document.querySelector(".student-temp");
  HTML.dest = document.querySelector(".student-list");
  HTML.popup = document.querySelector(".popup");
  HTML.wrapper = document.querySelector(".student-wrapper");
  HTML.studentName = document.querySelector(".popup-name");
  HTML.searchField = document.querySelector("#search_field");


  getJson();
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

function displayStudents(currentStudents) {
  HTML.dest.innerHTML = "";
  console.log(currentStudents);


  currentStudents.forEach(showStudent);

  document.querySelector("select#sorter").addEventListener("change", handleSorter);
  document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", handleFilter));
  // document.querySelectorAll(".sort").forEach(btn => btn.addEventListener("select", handleSorter));


  HTML.searchField.addEventListener("keyup", function (search) {
    console.log("key up");

    const searchValue = search.target.value.toLowerCase();
    const students = document.querySelectorAll(".student");

    Array.from(students).forEach(student => {
      const name = student.querySelector(".name").textContent;
      student.className = "student";

      if (name.toLowerCase().includes(searchValue)) {
        student.classList.add("student");
      } else {
        student.classList.add("hide");
      }
    })
  })
}

function showStudent(student) {
  let klon = HTML.template.cloneNode(true).content;

  if (student.prefect === true) {
    klon.querySelector(".prefect").textContent = "⭐";
  } else {
    klon.querySelector(".prefect").textContent = "☆";
  }

  klon.querySelector(".prefect").addEventListener("click", () => {
    makePrefect(student);
  });

  klon.querySelector(".expel").addEventListener("click", () => {
    displayStudents(expelStudent(student));
  })

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

  document.querySelector(".popup-house").textContent = "House: " + student.house;
  document.querySelector(".popup-blood").textContent = "Blood-status: " + undefined;
  document.querySelector(".popup-content>img").src = `images/${student.image}.png`;

  if (student.prefect) {
    document.querySelector(".popup-prefect").textContent = "Prefect: Yes";
  } else {
    document.querySelector(".popup-prefect").textContent = "Prefect: No";
  }

  if (student.expelled) {
    document.querySelector(".popup-expelled").textContent = "Expelled: Yes";
  } else {
    document.querySelector(".popup-expelled").textContent = "Expelled: No";
  }

  //TODO: ADD "MEMBER OF INQ SQUAD TEXT"


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

  document.querySelectorAll(".filter").forEach(filter => filter.className = "filter");
  document.querySelector(`[data-filter="${selectedFilter}"]`).classList.add("active-filter");

  filterArray(selectedFilter);
}

function filterArray(selectedFilter) {

  if (selectedFilter == "*") {
    currentStudents = allStudents;
  } else {
    currentStudents = studentsFilteredByHouse(selectedFilter);
  }

  displayStudents(sortStudents(sortBy, sortDirection));
}

function studentsFilteredByHouse(house) {
  let result = allStudents.filter(filterFunction);

  function filterFunction(student) {
    return student.house === house;
  }

  return result;
}

function handleSorter() {
  sortBy = this.value;
  sortDirection = "asc";

  if (this.value.includes("Desc")) {
    console.log("desc");

    sortBy = sortBy.slice(0, -4);
    sortDirection = "desc";
  }

  console.log(sortBy, sortDirection);

  displayStudents(sortStudents(sortBy, sortDirection));
}

function sortStudents(sortBy, sortDirection) {
  let desc = 1;

  if (sortDirection === "desc") {
    desc = -1;
  }

  if (currentStudents.length < 1) {
    allStudents.sort(function (a, b) {
      let x = a[sortBy];
      let y = b[sortBy];
      if (x < y) {
        return -1 * desc;
      }
      if (x > y) {
        return 1 * desc;
      }
      return 0;
    });

    return allStudents;
    //displayStudents(allStudents);

  } else {
    currentStudents.sort(function (a, b) {
      let x = a[sortBy];
      let y = b[sortBy];
      if (x < y) {
        return -1 * desc;
      }
      if (x > y) {
        return 1 * desc;
      }
      return 0;
    });

    return currentStudents;
    //displayStudents(currentStudents);
  }
}

function expelStudent(student) {
  console.log("Expelled: " + student.firstName);

  console.log(student);

  if (student.expelled === false) {
    student.expelled = true;
    student.prefect = false;
  }

  if (currentStudents.length < 1) {
    return allStudents;
  } else {
    return currentStudents;
  }
}

let allPrefects;
let prefectsOfHouse;

function makePrefect(clickedStudent) {
  console.log(clickedStudent);


  if (currentStudents.length < 1) {
    allPrefects = allStudents.filter(student => {
      return student.prefect === true;
    })

    prefectsOfHouse = allPrefects.filter(student => {
      return student.house === clickedStudent.house;
    })
  } else {
    allPrefects = currentStudents.filter(student => {
      return student.prefect === true;
    })

    prefectsOfHouse = allPrefects.filter(student => {
      return student.house === clickedStudent.house;
    })
  }

  if (clickedStudent.prefect === true) {
    clickedStudent.prefect = false;

    if (currentStudents.length < 1) {
      displayStudents(allStudents);
    } else {
      displayStudents(currentStudents);
    }
  } else if (prefectsOfHouse.length === 2) {
    console.log(prefectsOfHouse);
    console.log(allPrefects);
    // alert("kun 2 af hver");
    document.querySelector(".popup-prefect").classList.add("popup-appear");
    HTML.wrapper.classList.add("wrapper-effect");
    document.querySelector(".prefect-message").textContent = `You may only select two prefects from each house. Please remove either ${prefectsOfHouse[0].firstName} or ${prefectsOfHouse[1].firstName}.`;
    document.querySelector(".student1").textContent = `Remove ${prefectsOfHouse[0].firstName}`;
    document.querySelector(".student2").textContent = `Remove ${prefectsOfHouse[1].firstName}`;


    document.querySelector(".student1").addEventListener("click", () => {
      displayStudents(removeStudent1(prefectsOfHouse, clickedStudent));
    })

    document.querySelector(".student2").addEventListener("click", () => {
      displayStudents(removeStudent2(prefectsOfHouse, clickedStudent));
    })

  } else {
    clickedStudent.prefect = true;

    if (currentStudents.length < 1) {
      displayStudents(allStudents);
    } else {
      displayStudents(currentStudents);
    }
  }

  // if (allPrefects.length > 7) {
  //   alert("maks 8");
  //   clickedStudent.prefect = false;
  // }


}


function removeStudent1(prefectsOfHouse, clickedStudent) {
  console.log("REMOVE STUDENT 1");

  prefectsOfHouse[0].prefect = false;
  clickedStudent.prefect = true;

  document.querySelector(".popup-prefect").classList.remove("popup-appear");
  HTML.wrapper.classList.remove("wrapper-effect");

  if (currentStudents.length < 1) {
    return allStudents;
  } else {
    return currentStudents;
  }
}

function removeStudent2(prefectsOfHouse, clickedStudent) {
  console.log("REMOVE STUDENT 2");

  prefectsOfHouse[1].prefect = false;
  clickedStudent.prefect = true;

  document.querySelector(".popup-prefect").classList.remove("popup-appear");
  HTML.wrapper.classList.remove("wrapper-effect");

  if (currentStudents.length < 1) {
    return allStudents;
  } else {
    return currentStudents;
  }
}