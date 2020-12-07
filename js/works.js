var projects = {
  button: {},
};

projects.button.previous = document.querySelector("#previousBtn");
projects.button.next = document.querySelector("#nextBtn");
projects.container = document.querySelector("#project");
projects.currentProjectIndex = 0;

projects.content = [
`<div class="project-title">
    <h2 class="highlight format-text">portfolio website</h2>
    </div>
    <div class="project-stack">
    <p>JavaScript</p>
    <p>CSS</p>
    <p>SCSS</p>
    <p>HTML</p>
    </div>
    <div class="project-content format-text">
    <p>The website currently you're on is
      my first Front-end project. It is a
      desktop screen where you'll find 
      applications, settings and
      my info.
      </p>
    </div>
    <div class="project-link">
    <a href="https://github.com/D-Antonelli/portfolio" class="format-text" target="_blank">GitHub Page</a>
    </div>`,

    `<div class="project-title">
  <h2 class="highlight format-text">my contact manager</h2>
  </div>
  <div class="project-stack">
  <p>Java</p>
  <p>CSS</p>
  <p>JavaFX</p>
  </div>
  <div class="project-content format-text">
  <p>A contact management application that allows to store, delete, modify, sort, and view contact user information. 
    </p>
  </div>
  <div class="project-link">
  <a href="https://github.com/D-Antonelli/Java-My-Contact-Manager" class="format-text" target="_blank">GitHub Page</a>
  </div>
  </div>`,
  
    `<div class="project-title">
  <h2 class="highlight format-text">codepen challenge</h2>
  </div>
  <div class="project-stack">
  <p>JavaScript</p>
  <p>CSS</p>
  </div>
  <div class="project-content format-text">
  <p>A funny animation
    </p>
  </div>
  <div class="project-link">
  <a href="https://github.com/D-Antonelli/Java-My-Contact-Manager" class="format-text" target="_blank">Go to Pen</a>
  </div>
  </div>`
];

projects.init = (function () {
    projects.content.length < 2 ? projects.button.next.disabled = true : "";
})();

projects.button.next.addEventListener("click", function () {
  projects.currentProjectIndex++;
  projects.button.previous.disabled = false;

  if (projects.content[projects.currentProjectIndex]) {
    projects.container.innerHTML =
      projects.content[projects.currentProjectIndex];

    projects.currentProjectIndex++;
    if (!projects.content[projects.currentProjectIndex]) {
      projects.button.next.disabled = true;
      projects.currentProjectIndex--;
    } else {
      projects.button.next.disabled = false;
      projects.currentProjectIndex--;           
    }
  } else {
    projects.button.next.disabled = true;
  }
});

projects.button.previous.addEventListener("click", function () {
  projects.currentProjectIndex--;
  projects.button.next.disabled = false;

  if (projects.content[projects.currentProjectIndex]) {
    projects.container.innerHTML =
      projects.content[projects.currentProjectIndex];

    projects.currentProjectIndex--;
    if (!projects.content[projects.currentProjectIndex]) {
      projects.button.previous.disabled = true;
      projects.currentProjectIndex++;
    } else {
      projects.currentProjectIndex++;     
    }
  }
});
