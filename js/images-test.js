import { ObjectDetector, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";
const demosSection = document.getElementById("demos");
let objectDetector;
let runningMode = "IMAGE";


///images var
const element = document.getElementById("myBtn");
const imageList = $('#images-list');
///init

const initializeObjectDetector = async () => {

    onReady(function() {
        setVisible('.page', false);
        setVisible('.loadingDiv', true);
        setVisible('#loading', true);
    });

	var thresholdChange = 30;
	var resultMaxChange = 10;

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

};



document.addEventListener('DOMContentLoaded', () => {

	img_find()
})

//element.addEventListener("click", img_find);

async function img_find() {
	await initializeObjectDetector();

    onReady(function() {
        setVisible('.page', true);
        setVisible('.loadingDiv', false);
        setVisible('#loading', false);
    });
    
	var folderCb = "images/jig/";
	var folderCs = "images/croissant/";
	var folderKgc = "images/koreanGarlicCheese/";
	var folderPk = "images/pastryKare/";
	var index = 0;


	////cheese bamboo
	$.ajax({
		url : folderCb,
		success: function (data) {

			var totalImage = 1;
			
			$(data).find("a").attr("href", function (i, val) {
				if( val.match(/\.(jpe?g|png|gif)$/) ) { 

					var image = folderCb + val;

					detectionImg(image, index, 'jig', totalImage)

					index = index+1;
					totalImage = totalImage+1;
					
				} 
			});
		}
	});

	//////croissant
	// $.ajax({
	// 	url : folderCs,
	// 	success: function (data) {

	// 		var totalImage = 1;

	// 		$(data).find("a").attr("href", function (i, val) {
	// 			if( val.match(/\.(jpe?g|png|gif)$/) ) { 

	// 				var image = folderCs + val;

	// 				detectionImg(image, index, 'croissant', totalImage)

	// 				index = index+1;
	// 				totalImage = totalImage+1;
					
	// 			} 
	// 		});
	// 	}
	// });


	//////korean garlic cheese
	// $.ajax({
	// 	url : folderKgc,
	// 	success: function (data) {

	// 		var totalImage = 1;

	// 		$(data).find("a").attr("href", function (i, val) {
	// 			if( val.match(/\.(jpe?g|png|gif)$/) ) { 

	// 				var image = folderKgc + val;

	// 				detectionImg(image, index, 'korean garlic cheese', totalImage)

	// 				index = index+1;
	// 				totalImage = totalImage+1;
					
	// 			} 
	// 		});
	// 	}
	// });

	//////pastry kare
	// $.ajax({
	// 	url : folderPk,
	// 	success: function (data) {

	// 		var totalImage = 1;

	// 		$(data).find("a").attr("href", function (i, val) {
	// 			if( val.match(/\.(jpe?g|png|gif)$/) ) { 

	// 				var image = folderPk + val;

	// 				detectionImg(image, index, 'pastry kare', totalImage)

	// 				index = index+1;
	// 				totalImage = totalImage+1;
					
	// 			} 
	// 		});
	// 	}
	// });
	// const images = Array.from(document.getElementsByTagName("img")).map(i => i.src);

	// console.log(images)

    // for (const key in images) {
    // 	// console.log(images[key]);

    // 	detectionImg(images[key], key)
	// }
}

async function detectionImg(dataUrl, index, category, totalImage) {


	const image = new Image()
	var check = false;


	///////////////set total

	if (category == "jig") {

		$('#tatalCb').text(totalImage);


	}

	// if (category == "croissant") {

	// 	$('#tatalCs').text(totalImage);


	// }


	// if (category == "korean garlic cheese") {

	// 	$('#tatalKgc').text(totalImage);

	// }

	// if (category == "pastry kare") {

	// 	$('#tatalPk').text(totalImage);


	// }


	image.onload = () => {

		image.style.height = '100%'
		image.style.width = '100%'

		imageList.append(
			'<div id="image-wrapper'+index+'" class="col-lg-3 col-md-4 col-6" style="max-width: 20%; height: auto; position: relative;">'+
			'</div>')

		$('#image-wrapper'+index).append(image)


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

			check = true;

			/////////////////////////////////////check validation

			if (category == "jig") {

				
				if (labelName == "jig") {

					var validCb = $('#validCb').text();

					var total = parseInt(validCb) + 1;

					$('#validCb').text(total);
				}
				else{

					var failCb = $('#failCb').text();

					var failTotal = parseInt(failCb) + 1;

					$('#failCb').text(failTotal);
				}
			}

			// if (category == "croissant") {


			// 	if (labelName == "croissant") {

			// 		var validCs = $('#validCs').text();

			// 		var total = parseInt(validCs) + 1;

			// 		$('#validCs').text(total);
			// 	}

			// 	else{

			// 		var failCs = $('#failCs').text();

			// 		var failTotal = parseInt(failCs) + 1;

			// 		$('#failCs').text(failTotal);
			// 	}
			// }


			// if (category == "korean garlic cheese") {


			// 	if (labelName == "korean garlic cheese") {

			// 		var validKgc = $('#validKgc').text();

			// 		var total = parseInt(validKgc) + 1;

			// 		$('#validKgc').text(total);
			// 	}

			// 	else{

			// 		var failKgc = $('#failKgc').text();

			// 		var failTotal = parseInt(failKgc) + 1;

			// 		$('#failKgc').text(failTotal);
			// 	}
			// }

			// if (category == "pastry kare") {

			// 	if (labelName == "pastry kare") {

			// 		var validPk = $('#validPk').text();

			// 		var total = parseInt(validPk) + 1;

			// 		$('#validPk').text(total);
			// 	}

			// 	else{

			// 		var failPk = $('#failPk').text();

			// 		var failTotal = parseInt(failPk) + 1;

			// 		$('#failPk').text(failTotal);
			// 	}
			// }



            ///////// Finally append the label elements.
			box.append(label)
			$('#image-wrapper'+index).append(box)
		})


		/////check not detect

		if (check == false) {

			if (category == "jig") {


				var failCb = $('#failCb').text();

				var failTotal = parseInt(failCb) + 1;

				$('#failCb').text(failTotal);

			}

			// if (category == "croissant") {


			// 	var failCs = $('#failCs').text();

			// 	var failTotal = parseInt(failCs) + 1;

			// 	$('#failCs').text(failTotal);

			// }


			// if (category == "korean garlic cheese") {



			// 	var failKgc = $('#failKgc').text();

			// 	var failTotal = parseInt(failKgc) + 1;

			// 	$('#failKgc').text(failTotal);

			// }

			// if (category == "pastry kare") {



			// 	var failPk = $('#failPk').text();

			// 	var failTotal = parseInt(failPk) + 1;

			// 	$('#failPk').text(failTotal);

			// }

		}
	}

	image.src = dataUrl
}