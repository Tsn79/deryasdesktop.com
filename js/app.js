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
  activeWindows: []
};

desktop.buttons.closeButton = document.querySelectorAll(".close-btn");
desktop.files = document.querySelectorAll(".file");


//BUG -> ONCE CLICKED AGAIN, ALREADY OPEN WINDOW SHOULD REMOVED TO THE LAST INDEX
desktop.handleClickIcon = function (event) {
  var ele = desktop.getElement(event.currentTarget.href);
  ele.classList.add("clicked");
 
  if(desktop.activeWindows.indexOf(ele) === -1) {
    desktop.activeWindows.push(ele);
    ele.style.zIndex = `${desktop.activeWindows.indexOf(ele)+1}`;
  } else {
    //if already on open windows, find item on open windows list and pop out
    var index = desktop.activeWindows.indexOf(ele);
    desktop.activeWindows.splice(index, 1);
    desktop.activeWindows.push(ele);
    //console.log("index is "+desktop.activeWindows.indexOf(ele))
    ele.style.zIndex = `${desktop.activeWindows.indexOf(ele)}`;
  } 
  console.log(desktop.activeWindows)
};

//return corresponding element from url location
desktop.getElement = function (urlLink) {
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


//change z-index of panes
/*desktop.locationHashChanged = function (event) {
  var newUrlId = event.newURL ? desktop.getElement(event.newURL) : null;
  var oldUrlId = event.oldURL ? desktop.getElement(event.oldURL) : null;

  if (newUrlId !== undefined) {
    newUrlId.style.zIndex = "99";
  }
  if (oldUrlId !== undefined) {
    oldUrlId.style.zIndex = "1";
  }
  console.log(desktop.activeWindows);
}; */

//then, remove clicked class
desktop.closeWindow = function () {
  var ele = desktop.getElement(this.href);
  ele.classList.remove("clicked");
  ele.style.zIndex = "";
  var index = desktop.activeWindows.indexOf(ele);
  desktop.activeWindows.splice(index, 1);
  console.log(desktop.activeWindows)
  //rewrite another function
  //https://developer.mozilla.org/en-US/docs/Web/API/History_API
  window.history.back();
};

//hide element when close button is clicked
//remove clicked class from element  when this button is clicked
desktop.eventListeners = (function () {
  desktop.files.forEach((file) =>
    file.addEventListener("click", desktop.handleClickIcon)
  );
  window.addEventListener("hashchange", desktop.locationHashChanged);
  desktop.buttons.closeButton.forEach((button) =>
    button.addEventListener("click", desktop.closeWindow)
  );
})();
