const video = document.querySelector('.webcam');

const videoCanvas = document.querySelector('.video');
const videoCanvasCtx = videoCanvas.getContext('2d')

const faceCanvas = document.querySelector('.face');
const faceCanvasCtx = faceCanvas.getContext('2d')

const faceDetector = new FaceDetector();

async function populate() {

    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: 1280,
            height: 720,
        }
    });
    videoCanvas.width = 1280;
    videoCanvas.height = 720;

    faceCanvas.width = 1280;
    faceCanvas.height = 720;

    video.srcObject = stream;
    await video.play();
}

function censor(boundingBox) {
    faceCanvasCtx.imageSmoothingEnabled = false;

    faceCanvasCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height)

    // draw the small face
    faceCanvasCtx.drawImage(
        // 5 source args
        video, // where does the source come from?
        boundingBox.x, // where do we start the source pull from?
        boundingBox.y,
        boundingBox.width,
        boundingBox.height,
        // 4 draw args
        boundingBox.x, // where should we start drawing the x and y?
        boundingBox.y,
        10,
        10
    )
    // take that face back out and draw it back normal size
    // draw the small face back on, but scaled up
    const width = boundingBox.width ;
    const height = boundingBox.height ;
    faceCanvasCtx.drawImage(
        faceCanvas, // source
        boundingBox.x, // where do we start the source pull from?
        boundingBox.y,
        10,
        10,
        //drawing args
        boundingBox.x,
        boundingBox.y,
        width,
        height
    );
}

function draw({boundingBox: {left, top, width, height}}) {
    videoCanvasCtx.lineWidth = 2;
    videoCanvasCtx.strokeStyle = '#ffc600'

    videoCanvasCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height)
    censor(boundingBox);
    videoCanvasCtx.strokeRect(left, top, width, height);
}

async function detect() {
    const faces = await faceDetector.detect(video);
    faces.forEach(face => draw(face));
    requestAnimationFrame(detect);
}

populate().then(detect).catch(console.error);

const obj = {
    width: 100,
    height: 100,
    age: 20,
    name: 'Nico'
}


function f() {
    // obj.height = 200;
    // obj.width = 200;

    const {height, ...otherFields} = obj;

    // he
}