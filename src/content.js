var linkList,numButton,timeout=null;

function getKeywords() {
	/*
	var n=document.URL.match(/www\.google\.com\/search\?(.*)#(.*)/);

	if(n && n.length>1) {
		var q= n[-1].match(/(^|&)q=([^&]*)(&|$)/g);
		return q[2];
	} else {
		return "";
	}*/
	if(document.getElementById('lst-ib')) {return encodeURI(document.getElementById('lst-ib').value)}
	else if(document.getElementById('gbqfq')) {return encodeURI(gbqfq.value);}
	else{
		return "";
	}
}

function getNumOfButton() {
    if (hdtb_more) {
        var i=0;
        var last = hdtb_more.previousSibling;
        while((' ' + last.className + ' ').indexOf(" hdtb_mitem ") == -1) last=last.previousSibling;
        var items = document.getElementsByClassName("hdtb_mitem");
        while (!(items[i] === last)) i++;
        return i+1;
    } else 
        return -1;
}

function getLastButton() {
    if (hdtb_more) {
          var i=0;
          var last = hdtb_more.previousSibling;
          while(last.className != "hdtb_mitem") last=last.previousSibling;
          return last;
      } else
          return null;
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
  	linkList.sort(compare);
  	var key = getKeywords();
    numButton = getNumOfButton();
  	for(var i=0; i<linkList.length; i++) {
  		if(linkList[i].active && (document.getElementById('clinkpos'+linkList[i].pos) == null)) {addLink(linkList[i].facetext, linkList[i].pos, linkList[i].url, key); }
  	}
}

function removeLinks() {
	var topbar=document.getElementById('gbzc'); 
	if (topbar == null) return;
	
	for(var i=1; i<=10; i++) {
		if(document.getElementById("clinkpos"+i)) {
			var linkbox = document.getElementById("clinkpos"+i);
			if(linkbox) topbar.removeChild(linkbox);
		}
	}
}

function addLink(text,pos,url,key) {
  var topbar=document.getElementById('gbzc');  
  if (topbar == null) return addLinkNew(text,pos,url,key);  
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
  linkbox.setAttribute('id', "clinkpos"+pos);  
  topbar.insertBefore(linkbox, topbar.childNodes[parseInt(pos)-1]);
}

function addLinkNew(text,pos,url,key) {
  if (pos > numButton) {
    addLinkMore(text,pos,url,key);
  } else {
      var btnlist=document.getElementById('hdtb_msb');  
      if (btnlist == null) return;
      if (document.getElementById('clinkpos'+pos) != null) return;
      // 
      var request_url = make_url(url, key);
  
      // generate scholar link
  
      var linkbox=document.getElementById('hdtb_msb').childNodes[1].cloneNode(true);
      var link = document.evaluate("//a[@class='q qs']", linkbox, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (link == null) {
        return;
      }
      else 
        link = link.singleNodeValue;

      link.href = request_url;
      link.textContent = text;
      linkbox.id="clinkpos"+pos;
      linkbox.className="hdtb_mitem";
      
      btnlist.insertBefore(linkbox, btnlist.childNodes[parseInt(pos)-1]);
      //move the last button to list of more buttons
      var lastitem = getLastButton(); //document.getElementById('hdtb_msb').childNodes[lastind];
      
      //btnlist.removeChild(lastitem);
      document.getElementById("hdtb_more_mn").insertBefore(lastitem, document.getElementById("hdtb_more_mn").childNodes[0]);
      

  }
}

function addLinkMore(text,pos,url,key) {
  var morebtn=document.getElementById('hdtb_more_mn');  
  if (morebtn == null) return;  
  if (document.getElementById('clinkpos'+pos) != null) return;
  // 
  var request_url = make_url(url, key);
  
  // generate scholar link
  
  var linkbox=document.getElementById('hdtb_more_mn').firstChild.cloneNode(true);
  var link = document.evaluate("//a[@class='q qs']", linkbox, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  if (link == null) {
    return;
  }
  else 
    link = link.singleNodeValue;

  link.href = request_url;
  link.textContent = text;
  linkbox.id="clinkpos"+pos;

  morebtn.insertBefore(linkbox, morebtn.childNodes[parseInt(pos)-numButton-1]);
}

function onInit() {
chrome.extension.sendRequest({method: "getLocalStorage", key: "linkList"}, function(response) {
  	linkList = JSON.parse(response.data);
  	//oq=gbqfq.value;
  	//addLinks();
});	
document.addEventListener("DOMSubtreeModified", function() {
    if(timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(addLinks, 500);
}, false);
};

onInit();
//addLink('Scholar',4,"https://scholar.google.com/scholar?hl=en&q=%key",getKeywords());