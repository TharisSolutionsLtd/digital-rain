# Digital Rain

This is a HTML canvas animation to produce a digital rain imaged based on the array of words provided. Each word is rotated as it is falling while leaving a smudge effect which gives depth to the image. The animation can run indefinately or it can stop when the end conditions are met, then a pop-up will contain an image of the paused animation.

[EXAMPLE](http://jsbin.com/nosocodaka/3/edit?js,output)

## Setting it up

There are a number of variables defined at the top of this script, the main ones are:

``` javascript
var pauseOnEndCondition;
var imageWidth;
var imageHeight;
var words;
var scoreThresholdPercentage;
```

If you would need the animation running indefinately then set `var pauseOnEndCondition = false;`. If this is used to produce an image then set `var pauseOnEndCondition = true;`. When set to false, the code is waiting until the desired image score is hit before stopping and providing the image. The image dimensions are in pixels. To change the color of the text, get the hexidecimal value of your colour and update these variables:

``` javascript
var rHex = '00';
var gHex = '7F';
var bHex = 'FF';
```

The scoring system might sound complicated, but here goes ... The words in the array are taken and an instance of that word is set to each column randomly. The percentage is calculated by how many falling words out of the total amount of falling words are facing forward in the animation, while making sure that each word that is in the array (not each falling word instance) is facing forward. I have set the current score to a percentage of 85% by using trial and error, I would recommend sticking to this value.

Currently the words array is populated with some examples, update this array to provide the animation with your own words:

``` javascript
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
```
