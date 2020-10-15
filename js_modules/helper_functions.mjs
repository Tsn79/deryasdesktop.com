export var className = {
  add: function (ele, className) {
  if (ele.classList) ele.classList.add(className);
  else if (!hasClass(ele, className)) ele.className += " " + className;
},

remove: function (ele, className) {
  if (ele.classList) {
    ele.classList.remove(className);
  } else if (className.has(ele, className)) {
    var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
},

has: function (ele, className) {
  if (ele.classList) {
    return ele.classList.contains(className);
  } else {
    return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
  }
}
};






