function injectedFunction(tabId) {
    console.log("test123")
    alert("dasdasd")
    document.body.style.backgroundColor = 'orange';
}
  
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     alert("test")
//     if (changeInfo.status == 'complete' && tab.active) {
  
//       // do your things
//       injectedFunction
  
//     }
// });

// const tabId = getTabId();
// chrome.scripting.executeScript(
//     {
//       target: {tabId: tab.id, allFrames: true},
//       files: ['script.js'],
//     },
//     () => { injectedFunction });
// const tabId = getTabId();

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        console.log(tabId, changeInfo)
        // do your things

    }
})

// chrome.tabs.onCreated.addListener(
//     injectedFunction,
// )
