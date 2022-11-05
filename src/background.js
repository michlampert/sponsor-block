function injectedFunction() {
    console.log("test123")
    document.body.style.backgroundColor = 'orange';
}
  
chrome.action.onUpdated.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectedFunction
    });
});
