let firstMilking = true;
let lastClick = 0;
let delay = 20000;
let start;

function getTime() {
  const date = new Date();
  let hours = date.getHours();
  let mins = date.getMinutes();
  let currHours = hours <= 12 ? hours : hours - 12;
  let currMins = mins < 10 ? "0" + mins : mins;
  let amPm = hours < 12 ? "am" : "pm";
  return currHours + ":" + currMins + amPm;
}

let observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (document.contains(document.querySelector('[data-test-selector="community-points-summary"]:not([disabled])') && document.querySelector('button[aria-label="Claim Bonus"]')) && (lastClick + delay) < Date.now()) {
      if (!firstMilking) console.log(Math.round(((window.performance.now() - start)/1000)/60).toString(), "minutes since last milking");
      firstMilking = false;
      lastClick = Date.now();

      let randomWaitTime = (Math.random() * 9197) + 2394;
      console.log("waiting", Math.round(randomWaitTime), "ms");

      setTimeout(function() {
        document.querySelector('button[aria-label="Claim Bonus"]').click();
        start = window.performance.now();
        console.log("got milk at", getTime());
      }, randomWaitTime);
    }
  });
});

observer.observe(document, { childList: true, subtree: true });

console.log("%crunning twich milker", "font-size: 64px;");
console.log("started milking at", getTime());
