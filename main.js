const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector("nav");
const line = document.querySelectorAll(".line");
const link = document.querySelectorAll(".link");


// Sticky header
window.addEventListener("scroll", function () {
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

// Navigation
hamburger.addEventListener("click", () => {
  nav.classList.toggle("nav-toggle");
  line.forEach((e) => {
    e.classList.toggle("trans");
  });
});

// Nav link
link.forEach((e) => {
  e.addEventListener("click", () => {
    nav.classList.remove("nav-toggle");
    line.forEach((e) => {
      e.classList.toggle("trans");
    });
  });
});

// Nav link active class
for (let i = 0; i < link.length; i++) {
  link[i].addEventListener("click", function () {
    let current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

const accordionContent = document.querySelectorAll(".accordion-content");
accordionContent.forEach((item, index) => {
  let header = item.querySelector("header");
  header.addEventListener("click", () => {
    item.classList.toggle("open");
    let description = item.querySelector(".description");
    if (item.classList.contains("open")) {
      description.style.height = `${description.scrollHeight}px`;
      item.querySelector("i").classList.replace("fa-plus", "fa-minus");
    } else {
      description.style.height = "0px";
      item.querySelector("i").classList.replace("fa-minus", "fa-plus");
    }
    removeOpen(index); 
  });
});


function removeOpen(index1) {
  accordionContent.forEach((item2, index2) => {
    if (index1 != index2) {
      item2.classList.remove("open");
      let des = item2.querySelector(".description");
      des.style.height = "0px";
      item2.querySelector("i").classList.replace("fa-minus", "fa-plus");
    }
  });
}


document
  .getElementById("bookingForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    fetch("/api/book-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((message) => {
        alert(message);
        event.target.reset(); 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
