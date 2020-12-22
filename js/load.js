var load = {};
 load.showPage = function() {
    document.querySelector("#body-container").style.display = "block";
    document.querySelector("#loader").style.display = "none";
  }

  load.barWidth = 0;
  load.setProgressBar = function() { 
      if(load.barWidth === 100) {
          load.barWidth = 0;
      }

      load.barWidth += 10;    
    document.querySelector(".myBar").style.width = `${load.barWidth}%`; 
      
  }
  
load.progress = setInterval(load.setProgressBar, 800);

  window.addEventListener("load", function(){
    load.showPage();
    clearInterval(load.progress);
   })