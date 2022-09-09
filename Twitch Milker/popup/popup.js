document.addEventListener('DOMContentLoaded', async function() {
  let humanModeCheckBox = document.getElementById("humanMode");

  function setPointsVal(res) {
    document.querySelector("span#pointVal").innerText = res;
  }

  const getStorageData = key =>
    new Promise((resolve, reject) =>
      chrome.storage.sync.get(key, result =>
        chrome.runtime.lastError
          ? reject(Error(chrome.runtime.lastError.message))
          : resolve(result)
      )
    )

  const setStorageData = data =>
    new Promise((resolve, reject) =>
      chrome.storage.sync.set(data, () =>
        chrome.runtime.lastError
          ? reject(Error(chrome.runtime.lastError.message))
          : resolve()
      )
    )

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

  humanModeCheckBox.addEventListener("change", async function(e) {
    await setStorageData({ humanMode: humanModeCheckBox.checked });
    humanMode = await getStorageData("humanMode");
    sendMessageToTab({ type: "toggleHumanMode", val: humanMode.humanMode });
  });

  sendMessageToTab({ type: "getCount"}, setPointsVal);
  let humanMode = await getStorageData("humanMode");
  humanMode.humanMode ? humanModeCheckBox.setAttribute("checked", "") : humanModeCheckBox.removeAttribute("checked");
  sendMessageToTab({ type: "toggleHumanMode", val: humanMode.humanMode });

});
