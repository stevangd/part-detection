// Import the required APIs

import { ObjectDetector, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";


// Get the DOM Elements.
const fileInput = document.getElementById('file-input');
const imageWrapper = document.getElementById('image-wrapper');


// This asynchronous function is resposible for creating
// the `ObjectDetector` object.
const createObjectDetector = async () => {
  // Fetch the wasm files from CDN for vision task.
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  // Create and return the `ObjectDetector`.
  return await ObjectDetector.createFromOptions(vision, {
    baseOptions: {
      // Path to the trained model.
      modelAssetPath: `models/model.tflite`
    },
    // Minimum score the detector should look for between 0 to 1.
    scoreThreshold: 0.5,
    // Either `IMAGE` or `VIDEO`.
    runningMode: 'IMAGE'
  });
};


document.addEventListener('DOMContentLoaded', () => {
    createObjectDetector().then(detector => {

      onReady(function() {
        setVisible('.page', true);
        setVisible('.loadingDiv', false);
        setVisible('#loading', false);
      });

      fileInput.addEventListener('input', () => {
      
        while(imageWrapper.firstChild) {
          imageWrapper.removeChild(imageWrapper.firstChild)
        }

        const file = fileInput.files[0]
        const image = new Image()
        const dataUrl = URL.createObjectURL(file)

        image.onload = () => {
          // image.style.height = '100%'
          // image.style.width = '100%'
          imageWrapper.append(image)

          // `ObjectDetector` operates on the natural height and width of
          // the image. We need to calculate the ratio of the rendered image's
          // height/width and naturalHeight/naturalWidth.
          const heightRatio = image.height / image.naturalHeight
          const widthRatio = image.width / image.naturalWidth

          
          const result = detector.detect(image)

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
      })
    })
})