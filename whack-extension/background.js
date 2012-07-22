var SERVER = 'ws://localhost:9000';
var URL = 'http://192.168.1.192';

chrome.browserAction.onClicked.addListener(function() {
  ws.send('save');
  chrome.browserAction.setBadgeText({text: "Waiting for NFC"});
  chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
});

var ws = new WebSocket(SERVER);

ws.onmessage = function(e) {
  var data = e.data;
  if(data.read) {
    $.getJSON(URL + '/store/'+data.id, function(res){
      if(res.type == 'tabs') {
        res.tabs.forEach(function(el){
          chrome.tabs.create({'url': el}, function(tab) {});
        });
      }
    });
  } else if (data.write) {
    var tabs = [];
    chrome.tabs.query({}, function callback(ts){
      for(var i =0, ii = ts.length; i < ii; i++){
        tabs.push(ts[i].url);
      }
      $.post(URL + '/store/'+data.id, {type: 'tabs', tabs: tabs});
      reset();
    });
  }
}

function reset() {
  chrome.browserAction.setBadgeText({text: "Click to save tabs"});
  chrome.browserAction.setBadgeBackgroundColor({color: [0,0,0,0]});
}

reset();