//CLICK SOUND
const clickSound = document.querySelector('.click-sound');
document.querySelector('body').addEventListener('click', function () {
    clickSound.autoplay = true;
    clickSound.load();
  });


//DESKTOP BUTTONS
 var desktop = {
     element: {}
 };

 desktop.element.closeButton = document.querySelectorAll(".close-btn");
 desktop.files = document.querySelectorAll(".file");

  desktop.handleClickIcon = function(event) {
    var ele = desktop.getElement(event.currentTarget.href);
    ele.classList.add("clicked");  
  }
  
 //return corresponding element from url location
  desktop.getElement = function(urlLink) {
    var regex = /#/;
    var hashIndexInLink = urlLink.search(regex);
    var elementIdAfterHash = urlLink.slice(hashIndexInLink+1);
  
    if(elementIdAfterHash) {
      var ele = document.querySelector(`#${elementIdAfterHash}`);
    }
    return ele;
  }

  //change z-index of panes
  desktop.locationHashChanged = function(event) {
    var newUrlId = desktop.getElement(event.newURL);
    var oldUrlId = desktop.getElement(event.oldURL);
        if(newUrlId) {
           newUrlId.style.zIndex = "99"; 
        }
        if(oldUrlId) {
          oldUrlId.style.zIndex = "2";   
        }   
  }


//then, remove clicked class
  desktop.closeWindow = function() {
    var ele = desktop.getElement(this.href);
    ele.classList.remove("clicked");
}

  //hide element when close button is clicked
  //remove clicked class from element  when this button is clicked
  desktop.eventListeners = (function(){
    desktop.files.forEach(file => file.addEventListener("click", desktop.handleClickIcon));
    window.addEventListener('hashchange', desktop.locationHashChanged);
    desktop.element.closeButton.forEach(button => button.addEventListener("click", desktop.closeWindow));
  })();
  
  
 