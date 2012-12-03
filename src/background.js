
// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  linkList = new Array();        
  linkList[0] = {facetext:"Scholar", pos:5, url:"https://scholar.google.com/scholar?hl=en&q=%key", active:true};
  linkList[1] = {facetext:"Baidu", pos:6,  url:"http://www.baidu.com/s?wd=%key", active:false};
  localStorage['linkList'] = JSON.stringify(linkList);
  localStorage.isInitialized = true; // The option initialization.
  console.log('localStorage initialized');
}


//respond request from content script
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
      sendResponse({data: localStorage[request.key]});
    else
      sendResponse({}); // snub them.
});
