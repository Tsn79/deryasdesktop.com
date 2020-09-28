//CLICK SOUND
const clickSound = document.querySelector(".click-sound");
document.querySelector("body").addEventListener("click", function () {
  clickSound.autoplay = true;
  clickSound.load();
});

//DESKTOP BUTTONS
var desktop = {
  buttons: {},
  files: {},
  activeWindows: [],
};

desktop.buttons.closeButton = document.querySelectorAll(".close-btn");
desktop.files = document.querySelectorAll(".file");

desktop.openWindow = function (event) {
  var window = desktop.getDomElementFromUrl(event.currentTarget.href);
  window.classList.add("clicked");

  var navigate = function (ele, arr) {
    //find if open window is clicked before
    if (arr.indexOf(ele) === -1) {
      arr.push(ele);
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.zIndex = `${i + 1}`;
      }
    } else {
      //if window is already clicked, bring it on the top
      var index = arr.indexOf(ele);
      arr.splice(index, 1);
      arr.push(ele);
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.zIndex = `${i + 1}`;
      }
    }
  };

  navigate(window, desktop.activeWindows);
};

//return corresponding element from url location
desktop.getDomElementFromUrl = function (urlLink) {
  if (urlLink !== undefined && urlLink.includes("#")) {
    var regex = /#/;
    var hashIndexInLink = urlLink.search(regex);
    var elementIdAfterHash = urlLink.slice(hashIndexInLink + 1);
    if (elementIdAfterHash !== undefined) {
      var ele = document.querySelector(`#${elementIdAfterHash}`);
    }
  }
  return ele;
};

desktop.closeWindow = function () {
  var clickedWindow = desktop.getDomElementFromUrl(this.href);
  clickedWindow.classList.remove("clicked");

  function removeWindow(ele, arr) {
    ele.style.zIndex = "";
    var index = arr.indexOf(ele);
    arr.splice(index, 1);
  }
  removeWindow(clickedWindow, desktop.activeWindows);
};

//Add event listeners to manage open/close windows
desktop.eventListeners = (function () {
  desktop.files.forEach((file) =>
    file.addEventListener("click", desktop.openWindow)
  );
  desktop.buttons.closeButton.forEach((button) =>
    button.addEventListener("click", desktop.closeWindow)
  );
})();

//Reset hash according to window id
window.onpopstate = function () {
  var changeHash = function (activeWindows, location) {
    var lastWindow = activeWindows
      ? activeWindows[activeWindows.length - 1]
      : null;
    location.hash = lastWindow ? lastWindow.id : "";
  };
  changeHash(desktop.activeWindows, location);
};
