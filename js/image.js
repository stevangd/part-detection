import { ObjectDetector, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";
const demosSection = document.getElementById("demos");
let objectDetector;
let runningMode = "IMAGE";
const fileInput = document.getElementById('file-input');
const imageWrapper = document.getElementById('image-wrapper');
// Initialize the object detector
const initializeObjectDetector = async () => {

    onReady(function() {
        setVisible('.page', false);
        setVisible('.loadingDiv', true);
        setVisible('#loading', true);
    });

    var thresholdChange = document.getElementById('threshold').value;
    var resultMaxChange = document.getElementById('resultMax').value;

    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm");
    objectDetector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `models/model_part.tflite`,
            delegate: "GPU"
        },
        scoreThreshold: thresholdChange/100,
        maxResults: resultMaxChange,
        runningMode: runningMode
    });

    onReady(function() {
        setVisible('.page', true);
        setVisible('.loadingDiv', false);
        setVisible('#loading', false);
    });

};
initializeObjectDetector();



/////renew detector
let thresholdInput;
let resultMaxInput;

thresholdInput = document.getElementById("threshold");
thresholdInput.addEventListener("change", changeThrashold);

resultMaxInput = document.getElementById("resultMax");
resultMaxInput.addEventListener("change", changeThrashold);

async function changeThrashold(event) {

    await initializeObjectDetector();

    detectionImg();
}


/////detect image

fileInput.addEventListener('input', () => {

    detectionImg();
})


async function detectionImg() {

  while(imageWrapper.firstChild) {
      imageWrapper.removeChild(imageWrapper.firstChild)
  }

  const file = fileInput.files[0]
  const image = new Image()
  const dataUrl = URL.createObjectURL(file)

  image.onload = () => {
      image.style.height = '200%'
      image.style.width = '200%'
      imageWrapper.append(image)

          // `ObjectDetector` operates on the natural height and width of
          // the image. We need to calculate the ratio of the rendered image's
          // height/width and naturalHeight/naturalWidth.
      const heightRatio = image.height / image.naturalHeight
      const widthRatio = image.width / image.naturalWidth


      const result = objectDetector.detect(image)

          // Take all the detections and draw bounding box with label.
      result.detections.forEach(detection => {
            // A `div` element for bounding box.
        const box = document.createElement('div')

        box.style.position = 'absolute'
        box.style.border = '2px solid red'
            // Notice how we are using the calculated ratios to preserve
            // the sizing and coordinate of the detection.
        box.style.left = `${detection.boundingBox.originX * widthRatio}px`
        box.style.top = `${detection.boundingBox.originY * heightRatio}px`
        box.style.height = `${detection.boundingBox.height * heightRatio}px`
        box.style.width = `${detection.boundingBox.width * widthRatio}px`

            // Extract the name of the detection and score.
        const labelName = detection.categories[0].categoryName
        const scorePercentage = Math.round(detection.categories[0].score * 100)

            // A `small` element for the label.
        const label = document.createElement('small')

        label.style.position = 'absolute'
        label.style.top = '-16px'
        label.style.left = '0'
        label.style.color = 'white'
        label.style.backgroundColor = 'red'
        label.textContent = `${labelName} ${scorePercentage}%`

            // Finally append the elements.
        box.append(label)
        imageWrapper.append(box)
    })
  }

  image.src = dataUrl
}