//change background
var settings = {
    bgColors: {},
    functions: {},
    variables: {},
    listeners: {}
};

settings.bgColors.pinkBg = document.querySelector("#bg-pink");
settings.bgColors.blueBg = document.querySelector("#bg-blue");
settings.bgColors.greenBg = document.querySelector("#bg-green");
settings.bgColors.mintBg = document.querySelector("#bg-mint");
settings.bgColors.originalBg = document.querySelector("#bg-original");
 
settings.bodyContainer = document.querySelector("#body-container");
settings.body = document.querySelector("body");

settings.fullscreen = document.querySelector("#fullscreen");

settings.variables.isToggled = true;

settings.resizeInputRange = document.querySelector("#resizeRange");
settings.effectsInput = document.querySelector("#effects");



settings.functions.setScreenEffects = function() {
    switch(this.value) {
        case "normal":
        settings.body.style.filter = "none";
        break;

        case "weird":
        settings.body.style.filter = "drop-shadow(16px 16px 20px red) invert(75%)";
        break;
        
        case "dark mode":
        settings.body.style.filter = "grayscale(100%)";
        break;

        case "blurry":
        settings.body.style.filter = "blur(1px)"; 
        break;
    }
}


settings.functions.toggleFullScreen = function() {
    settings.variables.isToggled = !settings.variables.isToggled;

    if(!settings.variables.isToggled) {
        if(settings.body.requestFullscreen) {
            settings.body.requestFullscreen();
        }
        else if(settings.body.mozRequestFullScreen) { /* Firefox */
            settings.body.mozRequestFullScreen();
        }
        else if(settings.body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            settings.body.webkitRequestFullscreen();
        }
        else if(settings.body.msRequestFullscreen) { /* IE/Edge */
            settings.body.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
          }        
    }
}


settings.functions.generateClickEvent = function(listenerEl, targetEl) {
        listenerEl.addEventListener("click", function() {
            targetEl.style.backgroundColor = listenerEl.dataset.color;
        })    
}

settings.functions.resizeScreen = function() {
    switch(this.value) {
        case '0':         
        settings.bodyContainer.style.transform = "scale(1)";
        break;    

        case '1': 
        settings.bodyContainer.style.transform = "scale(0.9)"; 
        break;

        case '2':
        settings.bodyContainer.style.transform = "scale(0.8)";
        break;

        case '3':
        settings.bodyContainer.style.transform = "scale(0.7)";
        break;

        case '4':
        settings.bodyContainer.style.transform = "scale(0.6)";
        break;

        case '5':
        settings.bodyContainer.style.transform = "scale(0.5)";
        break;
    }
}


settings.listeners = (function (){
    for(var el in settings.bgColors) {  
    settings.functions.generateClickEvent(settings.bgColors[el], settings.bodyContainer);
 }  
    settings.fullscreen.addEventListener("change", settings.functions.toggleFullScreen);
    settings.resizeInputRange.addEventListener("change", settings.functions.resizeScreen); 
    settings.effectsInput.addEventListener("input", settings.functions.setScreenEffects);
})();







