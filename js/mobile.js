var mobile = {
  navBtn: {},
};

mobile.navBtns = document.querySelectorAll(".mobile-nav-btn");
mobile.pages = document.querySelectorAll(".mobile__pane");
mobile.zoomInBtn = document.querySelector("#mob-zoom-in");
mobile.zoomOutBtn = document.querySelector("#mob-zoom-out");
mobile.skills = document.querySelector("#mob-skills");

Array.from(mobile.navBtns).forEach((btn) =>
  btn.addEventListener("click", function (e) {
    mobile.pages.forEach((page) => (page.style.display = "none"));

    var id = e.currentTarget.id;

    switch (id) {
      case "mobile-btn-about":
        document.querySelector(".mobile__about-me").style.display = "block";
        break;

      case "mobile-btn-skills":
        document.querySelector(".mobile__skills").style.display = "block";
        break;

      case "mobile-btn-works":
        document.querySelector(".mobile__works").style.display = "block";
        break;
    }
  })
);

mobile.zoomInBtn.addEventListener("click", function (e) {
  document.querySelector(".mobile__skills").style.overflowX = "scroll";
  mobile.skills.style.width = 180 + "vw";
});

mobile.zoomOutBtn.addEventListener("click", function (e) {
  document.querySelector(".mobile__skills").style.overflowX = "hidden";
  mobile.skills.style.width = 90 + "vw";
});
