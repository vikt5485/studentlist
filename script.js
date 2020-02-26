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
let allPrefects;
let prefectsOfHouse;
let prefectsOfHouseAndGender;

const Student = {
  firstName: "",
  lastName: "",
  middleName: undefined,
  nickName: undefined,
  image: undefined,
  house: "",
  prefect: false,
  expelled: false,
  gender: ""
};

function start() {
  console.log("start");
  HTML.template = document.querySelector(".student-temp");
  HTML.dest = document.querySelector(".student-list");
  HTML.popup = document.querySelector(".popup");
  HTML.wrapper = document.querySelector(".student-wrapper");
  HTML.studentName = document.querySelector(".popup-name");
  HTML.searchField = document.querySelector("#search_field");

  document.querySelector("#hack").addEventListener("click", hackTheSystem);
  getJson();
}

async function getJson() {
  console.log("getJson");

  const jsonData = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");

  studentsJSON = await jsonData.json();
  studentsJSON.forEach(cleanData);
  currentStudents = allStudents;
  displayStudents(currentStudents);
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
  student.gender = studentData.gender.toLowerCase();

  allStudents.push(student);
  return allStudents;
}

function displayStudents(currentStudents) {
  HTML.dest.innerHTML = "";
  console.log(currentStudents);
  document.querySelector(".info h3:nth-child(3)").classList.remove("hide");

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



  if (student.lastName == undefined) {
    klon.querySelector(".name").textContent = student.firstName;
  } else {
    klon.querySelector(".name").textContent = student.firstName + " " + student.lastName;
  }

  if (student.gender === "girl") {
    klon.querySelector(".name").classList.add("girl");
  } else if (student.gender === "boy") {
    klon.querySelector(".name").classList.add("boy");
  }

  klon.querySelector(".house").textContent = student.house;

  // EVENT LISTENERS
  if (student.house === "Hogwarts") {
    klon.querySelector(".prefect").addEventListener("click", () => {
      document.querySelector(".popup-hacked").classList.add("popup-appear");
      HTML.wrapper.classList.add("wrapper-effect");

      document.querySelector(".hacked-message").textContent = `${student.fullName} cannot be removed as a prefect.`;

      document.querySelector(".close-btn").addEventListener("click", () => {
        document.querySelector(".popup-hacked").classList.remove("popup-appear");
        HTML.wrapper.classList.remove("wrapper-effect");
      })
    });

    klon.querySelector(".expel").addEventListener("click", () => {
      document.querySelector(".popup-hacked").classList.add("popup-appear");
      HTML.wrapper.classList.add("wrapper-effect");

      document.querySelector(".hacked-message").textContent = `${student.fullName} cannot be expelled.`;

      document.querySelector(".close-btn").addEventListener("click", () => {
        document.querySelector(".popup-hacked").classList.remove("popup-appear");
        HTML.wrapper.classList.remove("wrapper-effect");
      })
    })

  } else {
    klon.querySelector(".prefect").addEventListener("click", () => {
      makePrefect(student);
    });

    klon.querySelector(".expel").addEventListener("click", () => {
      expelStudent(student);
    })
  }

  if (student.expelled === true) {
    klon.querySelector(".expel").classList.add("hide");
    klon.querySelector(".prefect").classList.add("hide");
    document.querySelector(".info h3:nth-child(3)").classList.add("hide");
  }

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

  if (student.prefect === true) {
    document.querySelector(".popup-prefect-h4").textContent = "Prefect: Yes";
  } else {
    document.querySelector(".popup-prefect-h4").textContent = "Prefect: No";
  }

  if (student.expelled === true) {
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
    currentStudents = allStudents.filter(student => {
      return student.expelled === false;
    })
  } else if (selectedFilter == "Gryffindor" || selectedFilter == "Slytherin" || selectedFilter == "Ravenclaw" || selectedFilter == "Hufflepuff") {
    currentStudents = studentsFilteredByHouse(selectedFilter);
  } else if (selectedFilter == "prefect") {
    currentStudents = studentsFilteredByPrefect();
  } else if (selectedFilter == "expelled") {
    currentStudents = expelledStudents;
  }

  displayStudents(sortStudents(sortBy, sortDirection));
}

function studentsFilteredByHouse(house) {
  currentStudents = allStudents.filter(student => {
    return student.expelled === false;
  })

  let result = currentStudents.filter(filterFunction);

  function filterFunction(student) {
    return student.house === house;
  }

  return result;
}

function studentsFilteredByPrefect() {
  let result = allStudents.filter(filterFunction);

  function filterFunction(student) {
    return student.prefect === true;
  }

  return result;
}

function studentsFilteredByExpel() {
  let result = allStudents.filter(filterFunction);

  function filterFunction(student) {
    return student.expelled === true;
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

function expelStudent(student) {
  console.log("Expelled: " + student.firstName);

  // document.querySelector(".popup-expel").classList.add("popup-appear");
  // HTML.wrapper.classList.add("wrapper-effect");
  // document.querySelector(".expel-message").textContent = `Are you sure you want to expel ${student.firstName}? This action cannot be undone.`;

  student.expelled = true;
  student.prefect = false;

  currentStudents = allStudents.filter(student => {
    return student.expelled === false;
  })

  expelledStudents.push(student);

  filterArray(selectedFilter);

  // document.querySelector(".yes").addEventListener("click", () => {
  //   console.log("hh");


  // document.querySelector(".popup-expel").classList.remove("popup-appear");
  // HTML.wrapper.classList.remove("wrapper-effect");

  // })

  // document.querySelector(".no").addEventListener("click", () => {
  //   student.expelled = false;

  //   document.querySelector(".popup-expel").classList.remove("popup-appear");
  //   HTML.wrapper.classList.remove("wrapper-effect");

  //   filterArray(selectedFilter);
  // })
}

function makePrefect(clickedStudent) {
  console.log(clickedStudent);

  allPrefects = currentStudents.filter(student => {
    return student.prefect === true;
  })

  prefectsOfHouse = allPrefects.some(student => {
    return student.house === clickedStudent.house;
  })

  prefectsOfHouseAndGender = allPrefects.some(student => {
    return student.gender === clickedStudent.gender;
  })

  if (clickedStudent.prefect === true) {
    clickedStudent.prefect = false;
  } else if (prefectsOfHouse === true && prefectsOfHouseAndGender === true) {
    console.log("Gender and house are the same");



    // alert("kun 2 af hver");
    // document.querySelector(".popup-prefect").classList.add("popup-appear");
    // HTML.wrapper.classList.add("wrapper-effect");
    // document.querySelector(".prefect-message").textContent = `You may only select two prefects from each house. Please remove either ${prefectsOfHouse[0].firstName} or ${prefectsOfHouse[1].firstName}.`;
    // document.querySelector(".student1").textContent = `Remove ${prefectsOfHouse[0].firstName}`;
    // document.querySelector(".student2").textContent = `Remove ${prefectsOfHouse[1].firstName}`;


    // document.querySelector(".student1").addEventListener("click", () => {
    //   displayStudents(removeStudent1(prefectsOfHouse, clickedStudent));
    // })

    // document.querySelector(".student2").addEventListener("click", () => {
    //   displayStudents(removeStudent2(prefectsOfHouse, clickedStudent));
    // })

  } else {
    clickedStudent.prefect = true;
  }


  displayStudents(currentStudents);

  // if (allPrefects.length > 7) {
  //   alert("maks 8");
  //   clickedStudent.prefect = false;
  // }


}

function hackTheSystem() {
  document.querySelector("#hack").removeEventListener("click", hackTheSystem);
  document.querySelector("#hack").textContent = "System has been hacked";
  document.querySelector("#hack").classList.add("hacked");
  let hackedStudent = Object.create(Student);
  hackedStudent.firstName = "Viktor";
  hackedStudent.middleName = "Friis";
  hackedStudent.lastName = "Kjeldal";
  hackedStudent.house = "Hogwarts";
  hackedStudent.fullName = "Viktor Kjeldal";
  hackedStudent.prefect = true;
  hackedStudent.gender = "boy";

  currentStudents.unshift(hackedStudent);

  displayStudents(currentStudents);
}


// function removeStudent1(prefectsOfHouse, clickedStudent) {
//   console.log("REMOVE STUDENT 1");

//   prefectsOfHouse[0].prefect = false;
//   clickedStudent.prefect = true;

//   document.querySelector(".popup-prefect").classList.remove("popup-appear");
//   HTML.wrapper.classList.remove("wrapper-effect");

//   return currentStudents;
// }

// function removeStudent2(prefectsOfHouse, clickedStudent) {
//   console.log("REMOVE STUDENT 2");

//   prefectsOfHouse[1].prefect = false;
//   clickedStudent.prefect = true;

//   document.querySelector(".popup-prefect").classList.remove("popup-appear");
//   HTML.wrapper.classList.remove("wrapper-effect");


//   return currentStudents;
// }