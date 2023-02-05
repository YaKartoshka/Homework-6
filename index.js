const video = document.querySelector(".webcam");

const canvas = document.querySelector(".video").transferControlToOffscreen();
const ctx = canvas.getContext("2d");

const faceCanvas = document.querySelector(".face").transferControlToOffscreen();
const faceCtx = faceCanvas.getContext("2d");



canvas.width =  1280;
canvas.height = 720;
faceCanvas.width = 1280;
faceCanvas.height = 720;

const SIZE = 10;
const SCALE = 1;

const faceDetector = new FaceDetector();

async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
    });
    video.srcObject = stream;

    await video.play();
}

function censor(boundingBox) {
    ctx.imageSmoothingEnabled = false;
    console.log(boundingBox)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(
  
        video, 
        1, 
        5,
        boundingBox.width,
        boundingBox.height,
   
        boundingBox.x,
        boundingBox.y,
        SIZE,
        SIZE
    )
  
    const width = boundingBox.width * SCALE;
    const height = boundingBox.height * SCALE;
    ctx.drawImage(
        canvas, 
        boundingBox.x,
        boundingBox.y,
        SIZE,
        SIZE,
       
        boundingBox.x+boundingBox.width,
        0,
        1280,
        720
    );

    ctx.drawImage(
        canvas, 
        boundingBox.x,
        boundingBox.y,
        SIZE,
        SIZE,
    
        boundingBox.x-boundingBox.width-1280,
        0,
        boundingBox.width+1280,
        720
    );

     ctx.drawImage(
        video, 
        boundingBox.x,
        boundingBox.y,
        SIZE,
        SIZE,
        boundingBox.x,
        boundingBox.y+boundingBox.height,
        boundingBox.width,
        boundingBox.height+boundingBox.height
    );

    ctx.drawImage(
        canvas,
        boundingBox.x, 
        boundingBox.y,
        SIZE,
        SIZE,
        boundingBox.x,
        boundingBox.y-boundingBox.height-720,
        boundingBox.width,
        boundingBox.height+720
    );

}

function drawFace({boundingBox}) {
    const { width, height, top, left } = boundingBox;
    ctx.strokeStyle = "#ffc600";
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    censor(boundingBox);
    ctx.strokeRect(left, top, width, height);
}

async function detect() {
    const faces = await faceDetector.detect(video);
    faces.forEach(drawFace);
    requestAnimationFrame(detect);
}

populateVideo().then(detect);