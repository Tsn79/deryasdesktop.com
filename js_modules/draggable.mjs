"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

export var Draggable = /*#__PURE__*/function () {
  function Draggable(el) {
    var header = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    _classCallCheck(this, Draggable);

    this.el = el;
    this.header = header;
    this.shiftX = null;
    this.shiftY = null;
    this.offsetWidth = this.el.offsetWidth;
    this.offsetHeight = this.el.offsetHeight;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.addEventHandlers();
  }

  _createClass(Draggable, [{
    key: "addEventHandlers",
    value: function addEventHandlers() {
      if (this.header) {
        //drag from header
        this.header.addEventListener('mousedown', this.onMouseDown);
      } else {
        this.el.addEventListener('mousedown', this.onMouseDown);
      }

      this.el.addEventListener('dragstart', function (e) {
        return e.preventDefault();
      });
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(e) {
      e = e || window.event;
      this.getDragPointer(e.clientX, e.clientY);
      this.prepareElement();
      this.moveElementTo(e.pageX, e.pageY);
      document.addEventListener('mousemove', this.onMouseMove);
    }
  }, {
    key: "getDragPointer",
    value: function getDragPointer(x, y) {
      var elRect = this.el.getBoundingClientRect();
      this.shiftX = x - elRect.left;
      this.shiftY = y - elRect.top;
    }
  }, {
    key: "prepareElement",
    value: function prepareElement() {
      //this.el.style.position = 'absolute'
      this.el.style.zIndex = 999;
    }
  }, {
    key: "moveElementTo",
    value: function moveElementTo(x, y) {
      var leftPosition = x - this.shiftX < 0 ? 0 : x - this.shiftX;

      if (this.offsetWidth + leftPosition > document.body.clientWidth) {
        leftPosition = document.body.clientWidth - this.offsetWidth;
      }

      var topPosition = y - this.shiftY < 0 ? 0 : y - this.shiftY;

      if (this.offsetHeight + topPosition > document.body.clientHeight) {
        topPosition = document.body.clientHeight - this.offsetHeight;
      }

      this.el.style.left = "".concat(leftPosition, "px");
      this.el.style.top = "".concat(topPosition, "px");
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      e = e || window.event;
      this.moveElementTo(e.pageX, e.pageY);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      document.removeEventListener('mousemove', this.onMouseMove);
    }
  }]);

  return Draggable;
}();

/*export class Draggable {
    constructor(el, header="") {
    this.el = el
    this.header = header
    this.shiftX = null
    this.shiftY = null
    this.offsetWidth = this.el.offsetWidth;
    this.offsetHeight = this.el.offsetHeight;
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.addEventHandlers()
    }
    
    addEventHandlers() {
      if(this.header) {
        //drag from header
        this.header.addEventListener('mousedown', this.onMouseDown)
      } else {
        this.el.addEventListener('mousedown', this.onMouseDown)
      }
    
    this.el.addEventListener('dragstart', e => e.preventDefault())
    document.addEventListener('mouseup', this.onMouseUp)
    }
    
    onMouseDown(e) { 
    e = e || window.event;
    this.getDragPointer(e.clientX, e.clientY)
    this.prepareElement()
    this.moveElementTo(e.pageX, e.pageY)
    document.addEventListener('mousemove', this.onMouseMove)
    }
    
    getDragPointer(x, y) {
    const elRect = this.el.getBoundingClientRect()
    this.shiftX = x - elRect.left
    this.shiftY = y - elRect.top
    }
    
    prepareElement() {
    //this.el.style.position = 'absolute'
    this.el.style.zIndex = 999
    }
    
    moveElementTo(x, y) {
    var leftPosition = x - this.shiftX < 0 ? 0 : x - this.shiftX;
    if(this.offsetWidth + leftPosition > document.body.clientWidth) {
      leftPosition = document.body.clientWidth - this.offsetWidth;
    }
   
    var topPosition = y - this.shiftY < 0 ? 0 : y - this.shiftY
  
    if(this.offsetHeight + topPosition > document.body.clientHeight) {
      topPosition = document.body.clientHeight - this.offsetHeight;
    }
    this.el.style.left = `${leftPosition}px`;
    this.el.style.top = `${topPosition}px`;
    }
    
    onMouseMove(e) {
    e = e || window.event;
    this.moveElementTo(e.pageX, e.pageY)
    }
    
    onMouseUp(e) {
    document.removeEventListener('mousemove', this.onMouseMove)
    }
    
    }*/