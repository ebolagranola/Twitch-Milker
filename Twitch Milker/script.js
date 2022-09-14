let firstRun = true;
let delayClick = 20000;
let delayPoint = 6500;
let lastClick = lastPoint = 0;
let randomWaitTime = 0;
let waitAsHuman = false;
let dt24 = false;
let globalTime = { hour: "", min: "", sec: "", amPm: "" };
let globalCounter = 0;
let observerOptions = { childList: true, subtree: true };

function addLeadingZero(str) {
  return str < 10 ? "0" + str : str;
}

console.logTime = function(msg) {
  const date = new Date();
  globalTime.hour = date.getHours();
  globalTime.min = date.getMinutes();
  globalTime.sec = date.getSeconds();
  globalTime.amPm = (dt24) ? "" : (globalTime.hour < 12 ? "am" : "pm");
  globalTime.hour = (dt24) ? globalTime.hour : (globalTime.hour <= 12 ? globalTime.hour : globalTime.hour - 12);
  globalTime.hour = addLeadingZero((globalTime.hour == 0) ? 12 : globalTime.hour);
  globalTime.min = addLeadingZero(globalTime.min);
  globalTime.sec = addLeadingZero(globalTime.sec);
  console.log("%c" + globalTime.hour + ":" + globalTime.min + ":" + globalTime.sec + globalTime.amPm + ":%c " + msg, "font-size: 32px; color: cyan", "font-size: 32px; color: pink");
}

function setCounter(amt) {
  globalCounter += Number(amt);
}

function sendNewPoints() {
  chrome.runtime.sendMessage({
    newPointVal: globalCounter
  });
}

let buttonObserver = new MutationObserver(function(mutationList) {
  mutationList.forEach(function(mutation) {
    if (document.contains(document.querySelector('[data-test-selector="community-points-summary"]:not([disabled])') && document.querySelector('button[aria-label="Claim Bonus"]')) && (lastClick + delayClick) < Date.now()) {
      lastClick = Date.now();

      if (waitAsHuman) {
        randomWaitTime = (Math.random() * 9197) + 2394;
        console.logTime("waiting " + Math.round(randomWaitTime) + "ms before milking");
      } else {
        randomWaitTime = 0;
      }

      setTimeout(function() {
        document.querySelector('button[aria-label="Claim Bonus"]').click();
      }, randomWaitTime);
    }
  });
});

let pointObserver = new MutationObserver(function(mutationList) {
  mutationList.forEach(function(mutation) {
    if (mutation.type == "childList" && document.contains(document.querySelector('.community-points-summary__points-add-text'))) {
      let pointVal = document.querySelector('.community-points-summary__points-add-text').innerText;
      if (lastPoint + delayPoint < Date.now()) {
        console.logTime(pointVal + " milk cartons");
        lastPoint = Date.now();
        setCounter(pointVal.slice(1));
        sendNewPoints();
      }
    }
  });
});

let communitySectionObserver = new MutationObserver(function(mutationList) {
  if (firstRun) {
    mutationList.forEach(function(mutation) {
      let communitySection = document.querySelector('[data-test-selector="community-points-summary"]:not([disabled])');
      if (mutation.type == "childList" && communitySection && firstRun) {
        firstRun = false;
        buttonObserver.observe(communitySection, observerOptions);
        pointObserver.observe(communitySection, observerOptions);
        console.logTime("started milking");
      }
    });
  }
});

communitySectionObserver.observe(document.body, observerOptions);
console.log("%crunning twich %cmilker", "font-size: 64px; color: cyan", "font-size: 64px; color: pink");

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch(message.type) {
    case "getCount":
      sendResponse(globalCounter);
      break;
    case "toggleHumanMode":
      waitAsHuman = message.val;
      sendResponse({status: 'ok'});
      break;
    default:
      console.error("Unrecognised message: ", message);
  }
});
