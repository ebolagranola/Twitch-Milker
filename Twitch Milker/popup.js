document.addEventListener('DOMContentLoaded', function() {
  let humanModeCheckBox = document.getElementById("humanMode");
  let humanMode = humanModeCheckBox.checked;
  console.log('human mode ', humanMode);

  function setPointsVal(res) {
    document.querySelector("span#pointVal").innerText = res;
  }

  function flipCheckbox(el) {
    if (el.checked) {
      el.setAttribute("checked", "");
    } else {
      el.removeAttribute("checked");
    }
  }

  function setStorage() {
    chrome.storage.sync.set({
      humanMode: humanModeCheckBox.checked
    }, function(items) {
      flipCheckbox(humanModeCheckBox);
    });
  }

  async function getStorage(obj) {
    await chrome.storage.sync.get(obj, function(items) {
      console.log(items.humanMode);
      humanMode = items.humanMode;
      if (items.humanMode) {
        humanModeCheckBox.setAttribute("checked", "");
        console.log("added checked attr");
      } else {
        humanModeCheckBox.removeAttribute("checked");
        console.log("removed checked attr");
      }
    });
  }

  function sendMessageToTab(msg, callback) {
    chrome.tabs.query({ active: true, url: "*://*.twitch.tv/*" }).then(tabs => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, msg, (response) => {
          if (arguments[1]) callback(response);
        });
      }
    }).catch((err) => {
      console.log("Error:", err);
    });
  }

  humanModeCheckBox.addEventListener("change", function(e) {
    console.log('checkbox changed');
    setStorage();
    sendMessageToTab({type: "toggleHumanMode", val: humanModeCheckBox.checked});
  });

  getStorage("humanMode");
  sendMessageToTab({type: "getCount"}, setPointsVal);
  console.log('sending val: ' + humanMode);
  sendMessageToTab({type: "toggleHumanMode", val: humanMode});

});
