function getKeywords() {
	var n=document.URL.match(/www\.google\.com\/search\?(.*)/);
	if(n && n.length>1) {
		var n= n[1].match(/(^|&)q=([^&]*)(&|$)/);
		return n[2]; 
	} else {
		return "";
	}
}

function make_url(url, key) {
	return url.replace('%key',key);
}

function compare(a,b) {
  if (a.pos < b.pos)
     return -1;
  if (a.pos > b.pos)
    return 1;
  return 0;
}

function addLinks() {
	chrome.extension.sendRequest({method: "getLocalStorage", key: "linkList"}, function(response) {
  	var linkList = JSON.parse(response.data);
  	linkList.sort(compare);
  	var key = getKeywords();
  	for(var i=0; i<linkList.length; i++) {
  		if(linkList[i].active) {addLink(linkList[i].facetext, linkList[i].pos, linkList[i].url, key); }
  	}
});	

}



function addLink(text,pos,url,key) {
  var topbar=document.getElementById('gbzc');  
  if (topbar == null) return;  
  // 
  var request_url = make_url(url, key);
  
  // find parent container
  //var parentElement=document.getElementsByClassName('gbtc')[0];
 
  // generate scholar link
  var linkbox=document.createElement('li');
  linkbox.setAttribute('class', 'gbt');
  
  var tspaceSpan=document.createElement('span');
  tspaceSpan.setAttribute('class', 'gbtb2');
  
  var linkTextSpan=document.createElement('span');
  linkTextSpan.setAttribute('class', 'gbts');
  linkTextSpan.appendChild(document.createTextNode(text));
  
  var link = document.createElement('a');
  link.setAttribute('target', '_self');
  link.setAttribute('href', request_url);
  link.setAttribute('class', 'gbzt');
  link.onmouseover=function() {this.className='gbzt gbzt-hvr';};
  link.onmouseout=function() {this.className='gbzt';};
  link.appendChild(tspaceSpan);
  link.appendChild(linkTextSpan);
  
  linkbox.appendChild(link);
  
  topbar.insertBefore(linkbox, topbar.childNodes[parseInt(pos)-1]);
}

window.onload = function () { addLinks(); }
//addLink('Scholar',4,"https://scholar.google.com/scholar?hl=en&q=%key",getKeywords());