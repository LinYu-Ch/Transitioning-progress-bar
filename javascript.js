//Authors:@EcXcariot, @justAnAverageCarrat
//Last Updated: 3/2023
//Not authorized for editing or redistribution CC BY-ND

// getting all the layers and session data
let tier1 = document.querySelector(".tier1");
let tier2 = document.querySelector(".tier2");
let tier3 = document.querySelector(".tier3");
let tier4 = document.querySelector(".tier4");
let tier5 = document.querySelector(".tier5");

let goal, fieldData;

let botPoints = 0;
let sessionData;

const progress = document.getElementById("progress__bar");

// sets initial vlaues and states when widget is loaded
window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    goal = fieldData["goal"];
    sessionData = obj["detail"]["session"]["data"];
    SE_API.counters.get(fieldData.botCounterName).then(counter => {
        botPoints = parseInt(counter.value);
        analysePoints();
    });
});

// gets most up to date session data, not really useful but its good to have as a safety net
window.addEventListener('onSessionUpdate', function (obj) {
    sessionData = obj["detail"]["session"];
    analysePoints();
});

// takes in the stream data and parses all the info we want out
window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const data = obj.detail.event;
    if (listener === 'bot:counter' && data.counter === fieldData.botCounterName) {
        botPoints = parseInt(data.value);
        analysePoints();
    }
});

// parses all the relevant events into a point counter then uses it to update the goal bar
function analysePoints() {
    let data = sessionData;
    let bitsAmount = data["cheer-goal"]["amount"];
    let subsAmount = data["subscriber-goal"]["amount"];
    let tipsAmount = data["tip-goal"]["amount"];
    let followerAmount = data["follower-goal"]["amount"];
    let currentPoints = subsAmount * fieldData.pointsPerSub;
    currentPoints += tipsAmount * fieldData.pointsPerTip;
    currentPoints += bitsAmount * fieldData.pointsPerBit;
    currentPoints += followerAmount * fieldData.pointsPerFollow;
    currentPoints += botPoints * fieldData.pointsPerCounter;
    updateBar(currentPoints);
  	updateBackgroundImage(currentPoints);
}

// self explanatory 
// also sets the percentage tracker
function updateBar(amount) {
    let percentage = amount / goal * 100;
    $("#progress__bar").css('width', Math.min(100, percentage) + "%");
	progress.dataset.value = `${Math.floor(percentage)}%`;
}
// sets the tiers based on how close to the end goal we are 
function updateBackgroundImage(amount) {
let tier = goal / 5;
    if (amount >= goal) {
		drawPlant(tier5);
		drawPlant(tier4);
		drawPlant(tier3);
		drawPlant(tier2);
		drawPlant(tier1);
    } else if (amount >= tier*4) {
		drawPlant(tier4);
		drawPlant(tier3);
		drawPlant(tier2);
		drawPlant(tier1);
    } else if (amount >= tier*3) {
		drawPlant(tier3);
		drawPlant(tier2);
		drawPlant(tier1);
    } else if (amount >= tier*2) {
		drawPlant(tier2);
		drawPlant(tier1);
    } else if (amount >= tier) {
		drawPlant(tier1);
    } else {
        return;
    }
}

// anime.js function, animates each path individually 
// takes in each "tier" of svg element
// the first condition is to take care of the browser redrawing everything and initial widget load function call
// not really that much more resource intensive since it just does a few comparisons
function drawPlant(tier){
if (tier.dataset.visible == "shown") {return};
tier.dataset.visible = "shown";
const flowers = tier.querySelectorAll("#flower");
flowers.forEach((node) => {
    const paths = node.querySelectorAll('path');
    anime({
        targets: paths,
        opacity: [0, 1],
        delay: anime.stagger(250),
        duration: 1000,
        easing: 'easeInQuad',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        duration: 1500,
        dealy: anime.stagger(250)
    });
});    
}


