let firstMilking = true;
let delayClick = 20000;
let delayPoint = 6500;
let lastClick = 0;
let lastPoint = 0;
let perfStart;
let lastPointVal = null;
let dt24 = false;
let globalTime = { hour: "", min: "", sec: "", amPm: "" };

function addLeadingZero(str) {
  return str < 10 ? "0" + str : str;
}

console.logTime = function(msg) {
  const date = new Date();
  globalTime.hour = date.getHours();
  globalTime.min = date.getMinutes();
  globalTime.sec = date.getSeconds();
  globalTime.hour = (dt24) ? globalTime.hour : (globalTime.hour <= 12 ? globalTime.hour : globalTime.hour - 12);
  globalTime.min = addLeadingZero(globalTime.min);
  globalTime.sec = addLeadingZero(globalTime.sec);
  globalTime.amPm = (dt24) ? "" : (globalTime.hour < 12 ? "am" : "pm");

  console.log("%c" + globalTime.hour + ":" + globalTime.min + ":" + globalTime.sec + globalTime.amPm + ":%c " + msg, "font-size: 32px; color: cyan", "font-size: 32px; color: pink");
}

let buttonObserver = new MutationObserver(function(mutationList) {
  mutationList.forEach(function(mutation) {
    if (document.contains(document.querySelector('[data-test-selector="community-points-summary"]:not([disabled])') && document.querySelector('button[aria-label="Claim Bonus"]')) && (lastClick + delayClick) < Date.now()) {
      if (!firstMilking) console.logTime(Math.round(((window.performance.now() - perfStart)/1000)/60).toString() + " minutes since last milking");
      firstMilking = false;
      lastClick = Date.now();

      let randomWaitTime = (Math.random() * 9197) + 2394;
      console.logTime("new button to click");
      console.logTime("waiting " + Math.round(randomWaitTime) + "ms before click");

      setTimeout(function() {
        document.querySelector('button[aria-label="Claim Bonus"]').click();
        perfStart = window.performance.now();
        console.logTime("got milk");
      }, randomWaitTime);
    }
  });
});

buttonObserver.observe(document, { childList: true, subtree: true });

let pointObserver = new MutationObserver(function(mutationList) {
  mutationList.forEach(function(mutation) {
    if (mutation.type == "childList" && document.contains(document.querySelector('.community-points-summary__points-add-text'))) {
      let pointVal = document.querySelector('.community-points-summary__points-add-text').innerText;
      pointVal = pointVal.slice(1);

      if (lastPoint + delayPoint < Date.now()) {
        console.logTime("received " + pointVal + " points");
        lastPoint = Date.now();
      }
    }
  });
});

pointObserver.observe(document, { childList: true, subtree: true });

console.log("%crunning twich %cmilker", "font-size: 64px; color: cyan", "font-size: 64px; color: pink");
console.logTime("started milking");
