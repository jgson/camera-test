// Set constraints for the video stream
const DefaultConstraints = { video: {
							width: { ideal: 640 }, 
							height: { ideal: 480 },
							facingMode: "user" }, 
					audio: false };

const MAXConstraints = { video: {
							width: { ideal: 4096 }, 
							height: { ideal: 2160 },
							facingMode: "user" }, 
					audio: false };

let stream;

// Define constants
const cameraView = document.querySelector("#camera--view"),
	cameraOutput = document.querySelector("#camera--output"),
    cameraCanvas0 = document.querySelector("#camera--canvas0"),
    cameraCanvas1 = document.querySelector("#camera--canvas1"),
    overlayCanvas = document.querySelector("#camera--overlay"),
    cameraTrigger = document.querySelector("#camera--trigger");


function gotStream(mediaStream) {
  stream = window.stream = mediaStream; // stream available to console
  cameraView.srcObject = mediaStream;
  const track = mediaStream.getVideoTracks()[0];
  const constraints = track.getConstraints();
  console.log('Result constraints: ' + JSON.stringify(constraints));
}


function getCapture() {
	cameraCanvas0.width = cameraView.videoWidth;
    cameraCanvas0.height = cameraView.videoHeight;
    cameraCanvas0.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraCanvas0.toDataURL("image/png");
    cameraOutput.classList.add("taken");
	cameraTrigger.style.visibility = 'visible';
}


var snd = new Audio("shutter.wav");

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
	console.log("onclick");
	
	snd.play();
	getCapture();
};


function getMedia(constraints) {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  navigator.mediaDevices.getUserMedia(constraints)
      .then(gotStream)
      .catch(e => {
        console.error('getUserMedia', e.message, e.name);
      });

  return 1;
}

// Access the device camera and stream to cameraView
function cameraStart() {
	getMedia(MAXConstraints);	
}


// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
