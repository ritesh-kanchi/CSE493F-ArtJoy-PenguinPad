// This is a basic web serial template for p5.js using the Makeability Lab
// serial.js library:
// https://github.com/makeabilitylab/p5js/blob/master/_libraries/serial.js
//
// See a basic example of how to use the library here:
// https://editor.p5js.org/jonfroehlich/sketches/5Knw4tN1d
//
// For more information, see:
// https://makeabilitylab.github.io/physcomp/communication/p5js-serial
// 
// By Jon E. Froehlich
// @jonfroehlich
// http://makeabilitylab.io/
//


// let pHtmlMsg;
let serialOptions = { baudRate: 9600  };
let serial;

let currSerialVal = 0;
const maxBounding = 100;

let eraserMode = false;

let colors = ["red","orange","yellow","green","lime","blue","lightblue","purple","indigo","pink","black","brown","gray"];
let colorIndex = 0;

let lastColor = colors[colorIndex];
let currentColor = lastColor;

let shapes = ["cursor","square","circle","triangle"]
let shapeIndex = 0;

let lastShape = shapes[shapeIndex];
let currentShape = lastShape;

function setup() {
  createCanvas(500, 500);

  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  // If we have previously approved ports, attempt to connect with them
  serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);

  // Add in a lil <p> element to provide messages. This is optional
  // pHtmlMsg = createP("Click anywhere on this page to open the serial connection dialog");
  // pHtmlMsg.style('color', 'deeppink');
  background("white");
  noStroke();
  
  document.getElementById("shape").innerHTML = shapes[shapeIndex];
  document.getElementById("color").innerHTML = colors[colorIndex];
  document.getElementById("eraser").innerHTML = "Eraser Off";
  document.getElementById("stroke").innerHTML = "0% Stroke";
}

function draw() {
  fill(currentColor);
  if (currentShape == "square") {
    rect(mouseX-(maxBounding * currSerialVal)/2, mouseY-(maxBounding * currSerialVal)/2, maxBounding * currSerialVal, maxBounding * currSerialVal);
  } else if (currentShape == "circle") {
      circle(mouseX, mouseY, maxBounding * currSerialVal);
  } else if (currentShape == "triangle") {
      // Assuming you want to draw an equilateral triangle
      let triangleHeight = sqrt(3) / 2 * (maxBounding * currSerialVal); // Height of equilateral triangle
      let triangleWidth = (maxBounding * currSerialVal) / 2; // Half of the base of the equilateral triangle
      let x1 = mouseX;
      let y1 = mouseY - triangleHeight / 2;
      let x2 = mouseX - triangleWidth;
      let y2 = mouseY + triangleHeight / 2;
      let x3 = mouseX + triangleWidth;
      let y3 = mouseY + triangleHeight / 2;
      triangle(x1, y1, x2, y2, x3, y3);
  } else {
    
  }
}

function keyPressed() {
  if (key === 'd' || key === 'D') {
    shapeIndex = (shapeIndex + 1) % shapes.length;
    currentShape = shapes[shapeIndex];
    document.getElementById("shape").innerHTML = currentShape;
  } else if (key === 't' || key === 'T') {
      colorIndex = (colorIndex + 1) % colors.length;
      if(eraserMode) {
        eraserMode = false;
      }
      currentColor = colors[colorIndex];
      document.getElementById("color").innerHTML = currentColor;
  } else if (key === 'w' || key === 'W') {
      if(eraserMode) {
        eraserMode = false;
        currentColor = lastColor;
        document.getElementById("eraser").innerHTML = "Eraser Off";
      } else {
        eraserMode = true;
        lastColor = currentColor;
        currentColor = "white";
        document.getElementById("eraser").innerHTML = "Eraser On";
      }
  } else if (key === '8') {
    background("white");
  } else {
    console.log(key);
  }
}

/**
 * Callback function by serial.js when there is an error on web serial
 * 
 * @param {} eventSender 
 */
 function onSerialErrorOccurred(eventSender, error) {
//   console.log("onSerialErrorOccurred", error);
  // pHtmlMsg.html(error);
}

/**
 * Callback function by serial.js when web serial connection is opened
 * 
 * @param {} eventSender 
 */
function onSerialConnectionOpened(eventSender) {
//   console.log("onSerialConnectionOpened");
  // pHtmlMsg.html("Serial connection opened successfully");
}

/**
 * Callback function by serial.js when web serial connection is closed
 * 
 * @param {} eventSender 
 */
function onSerialConnectionClosed(eventSender) {
//   console.log("onSerialConnectionClosed");
//   pHtmlMsg.html("onSerialConnectionClosed");
}

/**
 * Callback function serial.js when new web serial data is received
 * 
 * @param {*} eventSender 
 * @param {String} newData new data received over serial
 */
function onSerialDataReceived(eventSender, newData) {
//   console.log("onSerialDataReceived", newData);
  // pHtmlMsg.html("onSerialDataReceived: " + newData);
  currSerialVal = parseFloat(newData);
  var displayVal = Math.round(currSerialVal*100);
  document.getElementById("stroke").innerHTML = displayVal > 0 ? `${displayVal}% stroke` : `No stroke`;
}

/**
 * Called automatically by the browser through p5.js when mouse clicked
 */
function mouseClicked() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }
}