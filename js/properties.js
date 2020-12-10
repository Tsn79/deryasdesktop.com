import { className } from "../js_modules/helper_functions.mjs";

var properties = {
  click: {},
};

properties.click = function(e) {
    if (e.target.parentNode.id !== "tabs") {
        return;
      }
    
      var i;
      var textContents = Array.from(document.querySelectorAll(".properties__content > *"));
      var buttons = Array.from(document.querySelectorAll(".properties__tabs > button"));
    
      for (i = 0; i < textContents.length; i++) {
        textContents[i].style.display = "none";
        className.remove(buttons[i], "clicked");
      }
    
      className.add(e.target, "clicked");
      document.querySelector(`.text[data-name=${e.target.dataset.name}]`).style.display = "block";
}

document.addEventListener("click", properties.click);
