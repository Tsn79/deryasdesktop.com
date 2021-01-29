import { className } from "../js_modules/helper_functions.mjs";
import { Draggable } from "../js_modules/draggable.mjs";

var desktop = {
  buttons: {},
  files: {},
  activeApps: [],
};

desktop.buttons.closeButton = document.querySelectorAll(".close-btn");
desktop.files = document.querySelectorAll(".file");
desktop.apps = document.querySelectorAll(".pane");
desktop.click = document.querySelector(".click-sound");
desktop.draggables = document.querySelectorAll(".draggable");
desktop.navElements = document.querySelectorAll(".navigation__dropdown");

document.querySelector(".navigation").addEventListener("pointerdown", function(e){
  if(e.pointerType === "touch") {
    desktop.removeNavigationHover();
  } else {
    desktop.addNavigationHover();
  }
});

desktop.removeNavigationHover = function() {  
  desktop.navElements.forEach(ele =>
    {
      className.remove(ele, "navigation__dropdown-hover");
    } ); 
}

desktop.addNavigationHover = function() {
  desktop.navElements.forEach(ele => className.add(ele, "navigation__dropdown-hover"));
}


//make frames draggable
desktop.dragFrames = (function () {
  for (var i = 0; i < desktop.draggables.length; i++) {
    new Draggable(
      desktop.draggables[i],
      desktop.draggables[i].querySelector(".drag")
    );
  }
})();

desktop.openApp = function (event) {
  if (
    (event.target.className !== "file-icon" &&
      event.target.className !== "link" &&
      event.target.className !== "navigation__link") ||
    //exclude mail icon
    event.target.parentNode.className === "file file__mail" ||
    event.target.className === "mail"
  ) {
    return;
  }
  var currApp =
    desktop.getDomElementFromUrl(event.target.parentNode.href) ||
    desktop.getDomElementFromUrl(event.target.href);
  className.add(currApp, "clicked");
  return desktop.setStackingOrder(currApp, desktop.activeApps);
};

desktop.setStackingOrder = function (currApp, activeApps) {
  //find if file link is clicked before
  if (activeApps.indexOf(currApp) === -1) {
    activeApps.push(currApp);
    for (var i = 0; i < activeApps.length; i++) {
      activeApps[i].style.zIndex = "".concat(i + 10);
    }
  } else {
    //if file link is already clicked, bring corresponding pane on the top
    var index = activeApps.indexOf(currApp);
    activeApps.splice(index, 1);
    activeApps.push(currApp);

    for (var _i = 0; _i < activeApps.length; _i++) {
      activeApps[_i].style.zIndex = "".concat(_i + 10);
    }
  }
  //set hash for pointerdown event
  // location.hash = currApp.id;
  // //set focus for playing drums
  // if(currApp.id === "drummer") {currApp.focus();}
};

//return corresponding element from url location
desktop.getDomElementFromUrl = function (urlLink) {
  if (urlLink !== undefined && urlLink.indexOf("#") !== -1) {
    var regex = /#/,
      hashIndexInLink = urlLink.search(regex),
      elementIdAfterHash = urlLink.slice(hashIndexInLink + 1);
    if (elementIdAfterHash !== undefined) {
      var ele = document.querySelector("#".concat(elementIdAfterHash));
    }
  }
  return ele;
};

desktop.closeApp = function (event) {
  event.stopPropagation();
  //close btn for mobile version
  if (this.className.includes("mobile")) {
    return (this.parentNode.style.display = "none");
  }
  var selected = desktop.getDomElementFromUrl(this.href);
  selected.style.top = "";
  selected.style.left = "";
  className.remove(selected, "clicked");
  return desktop.removeAppFromStack(selected, desktop.activeApps);
};

desktop.handlePopState = function () {
  //var tabPortS = window.matchMedia("(max-width: 52.20em)");
  location.hash
    ? desktop.showNavbarActiveAppTab(location.hash)
    : document.querySelector("#open-tabs").hidden = true;

  //if(tabPortS.matches) {document.querySelector("#open-tabs").style.display = "none";}

  var changeHash = function (apps, location) {
    var latestApp = apps[apps.length - 1] || apps;
    location.hash = latestApp.id || latestApp;
  };
  changeHash(desktop.activeApps, location);
};

desktop.removeAppFromStack = function (currApp, activeApps) {
  currApp.style.zIndex = "";
  var index = activeApps.indexOf(currApp);
  if (index !== -1) {
    activeApps.splice(index, 1);
  }
  return desktop.handlePopState();
};

desktop.changeStackingOrder = function (e) {
  desktop.setStackingOrder(e.currentTarget, desktop.activeApps);
  window.location.hash = e.currentTarget.id;
};

//EVENT LISTENERS
desktop.buttons.closeButton.forEach((button) =>
  button.addEventListener("click", desktop.closeApp)
);

//when clicked, stack the current app on the top
desktop.apps.forEach((app) => {
  app.addEventListener("mousedown", desktop.changeStackingOrder);
});

document.addEventListener("click", desktop.openApp);

//desktop.files.forEach(file => file.addEventListener("click", desktop.openApp));

document.querySelector("body").addEventListener("click", function (ev) {
  //prevent click sound on drum keys
  if(ev.target.nodeName === "KBD") {return;}
  desktop.click.autoplay = true;
  desktop.click.load();
});

desktop.showNavbarActiveAppTab = function (locHashName) {
  var locationName = locHashName.slice(1);
  var template = `<button class="navigation__dropdown-btn">${locationName}</button>
        <input type="checkbox" class="navigation__checkbox">
            <div class="navigation__dropdown-content">
              <a href="${locHashName}" class="link quit"
                >close<span aria-label="Close Account Info Modal Box"
                  >&times;</span
                ></a 
              > 
            </div>`;
  document.querySelector("#open-tabs").hidden = false;
  document.querySelector("#open-tabs").innerHTML = template;
  document.querySelector(".quit").addEventListener("click", desktop.closeApp);
};

window.onpopstate = desktop.handlePopState;
