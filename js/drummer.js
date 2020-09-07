const drummer = {};
drummer.drummerPane = document.querySelector("#drummer");

//Write an algorithm to play drum only when the pane is open and on top stack
window.onpopstate = function() {
    console.log(document.location.href)
   if(document.location.href.includes("drummer")) {
       drummer.drummerPane.focus();
   }
  }

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
 


