const drummer = {};
drummer.drummerPane = document.querySelector("#drummer");

drummer.drummerPane.addEventListener("keydown", function(e){
    var audioMatch = document.querySelector(`audio[data-key='${e.keyCode}']`);
    if(audioMatch) {
       //add playing class to the corresponding data
       document.querySelector(`.key[data-key='${e.keyCode}']`).classList.add("playing"); 
       audioMatch.autoplay = true;
       audioMatch.load();
    }
});

drummer.drummerPane.addEventListener("keyup", function(e) {
   //now remove the class
    if(document.querySelector(`.key[data-key='${e.keyCode}']`)) {
       document.querySelector(`.key[data-key='${e.keyCode}']`).classList.remove("playing");  
    } 
})
 

//focus drummer when it is open
window.onhashchange = function() {
    if(location.hash === '#drummer') {
        drummer.drummerPane.focus();
    } else {
        drummer.drummerPane.blur();
    }
} 
