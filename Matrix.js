var mainCanvasContext = mainCanvas.getContext('2d');
var childCanvasWidth = 200;
var childCanvasHeight = 10;
var angleIncrementMin = 5;
var angleIncrementMax = 30;
var pauseOnEndCondition = true;
var secondsToWaitBeforeEndCondition = 60;
var intervalTime = 50;
var scoreThresholdPercentage = 85;
var rainDeviation = 10000;

var imageWidth = 960;
var imageHeight = 600;

var rHex = '00';
var gHex = '7F';
var bHex = 'FF';

mainCanvas.width = imageWidth;
mainCanvas.height = imageHeight;

var arrayCount = Math.round(mainCanvas.width / 10);

var letters = Array(arrayCount).join(1).split('');
var words = [
	"ASP.NET",
	"Ember.js",
	"WebApi",
	"SQL",
	"HTML5",
	"Entity Framework",
	"Javascript",
	"CSS3",
	"ASP.NET MVC",
	"Windows Azure",
	"C#",
	"WCF",
	"WWF",
	".NET"
];

var xPosWord = new Array();

var CreateWordArray = function () {
	for(var i = 0; i < letters.length; i++) {
		var isReversed = Math.round(Math.random()) == 0 ? true : false;
		xPosWord[i] = {
			word : words[Math.floor(Math.random() * words.length)],
			horizontalScale : 0,
			isReversed: isReversed,
			currentAngle : Math.floor(Math.random() * 360),
			awaitingReverse: !isReversed,
			angleAdjust: angleIncrementMin + Math.round(Math.random() * (angleIncrementMax - angleIncrementMin))
		};
	}
};
CreateWordArray();

var UpdateWordObject = function (wordObject) {
	
	wordObject.currentAngle += wordObject.angleAdjust;
	
	if(wordObject.currentAngle >= 360) {
		wordObject.currentAngle -= 360;
		wordObject.awaitingReverse = true;
	}
	
	if(wordObject.currentAngle > 150 && wordObject.currentAngle < 210) {
		wordObject.currentAngle += 60;
	}
	
	if(wordObject.currentAngle >= 180) {
		if(wordObject.awaitingReverse) {
			if(wordObject.isReversed) {
				wordObject.isReversed = false;
			} else {
				wordObject.isReversed = true;
			}
			
			wordObject.awaitingReverse = false;
		}
	}
	
	var angleInRadians = (wordObject.currentAngle * Math.PI) / 180;
	wordObject.horizontalScale = (Math.cos(angleInRadians) + 1) / 2;
	
	if(wordObject.horizontalScale < 0.05) {
		wordObject.horizontalScale = 0.075;
	}
	
	var childCanvas = document.createElement("canvas");
	childCanvas.width = childCanvasWidth;
	childCanvas.height = childCanvasHeight;
	var childCanvasContext = childCanvas.getContext('2d');
	childCanvasContext.fillStyle = GetHexColourFade(rHex, gHex, bHex, wordObject.currentAngle);
	childCanvasContext.translate(childCanvasWidth/2, childCanvasHeight/2);
	
	if(wordObject.isReversed) {
		childCanvasContext.scale(-1, 1);
	}
	
    childCanvasContext.textAlign = 'center';
	childCanvasContext.transform(wordObject.horizontalScale,0,0,1,0,0);
	childCanvasContext.font = "Futurist Fixed-width";
	childCanvasContext.fillText(wordObject.word, 0,childCanvasHeight/4);
	
	wordObject.wordCanvas = childCanvas;
	
	return wordObject;
};

var GetHexColourFade = function (red, green, blue, angle) {
	
	if(angle >= 180) {
		angle = angle - ((angle - 180) * 2);
	}

	var r = parseInt(red, 16);
	var g = parseInt(green, 16);
	var b = parseInt(blue, 16);

	var rRemaining = 255 - r;
	var gRemaining = 255 - g;
	var bRemaining = 255 - b;
	
	var rFinal = r + Math.round((rRemaining/ 180) * angle);
	var gFinal = g + Math.round((gRemaining / 180) * angle);
	var bFinal = b + Math.round((bRemaining / 180) * angle);

	var rFinalString = rFinal < 16 ? "0" + rFinal.toString(16) : rFinal.toString(16);
	var gFinalString = gFinal < 16 ? "0" + gFinal.toString(16) : gFinal.toString(16);
	var bFinalString = bFinal < 16 ? "0" + bFinal.toString(16) : bFinal.toString(16);
	
	return "#" + rFinalString + gFinalString + bFinalString;
};

var CheckEndConditions = function() {
	var checkArray = new Array();
	var hasFinished = true;
	var score = 0;
		
	for(var m = 0; m < xPosWord.length; m++) {
		if(!xPosWord[m].isReversed) {
			score++;
		}
	}
	
	for(var i = 0; i < words.length; i++) {
		var currentWord = words[i];
		var isInUse = false;
		checkArray[i] = false;
		
		for(var l = 0; l < xPosWord.length; l++) {
			if(xPosWord[l].word == currentWord) {
				isInUse = true;
			}
		}
		
		if(isInUse) {
			for(var j = 0; j < xPosWord.length; j++) {
				if((!xPosWord[j].isReversed) && (xPosWord[j].word == currentWord)) {
					checkArray[i] = true;
				}
			}
		} else {
			checkArray[i] = true;
		}
	}
	
	for(var k = 0; k < checkArray.length; k++) {
		if(!checkArray[k]) {
			hasFinished = false;
		}
	}
	
	if(hasFinished) {
		var endTime = new Date().getTime();
		var scorePercentage = Math.round((score * 100) / xPosWord.length);
		
		if(endTime - startTime > secondsToWaitBeforeEndCondition * 1000) {
			if(scorePercentage >= scoreThresholdPercentage) {
				clearInterval(intervalId);
				var image = mainCanvas.toDataURL("image/png");
				var popup = window.open("about:blank","Image Produced From HTML5 Canvas","width=" + imageWidth + ",height=" + imageHeight);
				popup.document.write("<img src='" + image + "' />");
			}
		}
	}
};

var drawMatrix = function () {
	mainCanvasContext.fillStyle='rgba(0,0,0,.04)';
	mainCanvasContext.fillRect(0,0,mainCanvas.width,mainCanvas.height);
  
	letters.map(function(y_pos, index){
		xPosWord[index] = UpdateWordObject(xPosWord[index]);
		x_pos = (index * 20) - (childCanvasWidth/2);
		mainCanvasContext.drawImage(xPosWord[index].wordCanvas, x_pos, y_pos);
		letters[index] = (y_pos > imageHeight + Math.random() * rainDeviation) ? 0 : y_pos + 10;
	});
	
	if(pauseOnEndCondition) {
		CheckEndConditions();
	}
};

var startTime = new Date().getTime();
var intervalId = setInterval(drawMatrix, intervalTime);
