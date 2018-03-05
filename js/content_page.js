 

var _enabled=true;


var INVALID_NODES = ['SCRIPT', 'STYLE', 'INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A', 'CODE'];



/** add listener for DOM changes, to parse the new nodes for phone numbers **/
/** document.addEventListener('DOMSubtreeModified', handleDomChange, true); **/

/** stupid WebKit won't trigger DOMNodeInserted on innerHTML with plain text and no HTML tags **/
document.addEventListener('DOMCharacterDataModified', handleDomChange, true);
document.addEventListener('DOMNodeInserted'         , handleDomChange, true);

/** prevent it from going into an infinite loop **/
var parsing = false;

    
parseDOM(document.body);

function handleDomChange(e) {
  var ext_enabled = _enabled;
  if (ext_enabled) {
    if (parsing) {
      return;
    }

    var newNodeClass = e.srcElement.className;
    if ( newNodeClass != undefined ) {
      if (/techextension\-message\-box/.test(newNodeClass) || newNodeClass == 'techextension-click-to-call-icon') {
        return;
      }
    }

    var targetNode = (e.relatedNode) ? e.relatedNode : e.target;
    parsing = true;
    setTimeout(function() {
      parseDOM(targetNode);
      parsing = false;
    }, 10);
  }
}




/** Parse DOM and convert phone numbers to click-to-call links **/
function parseDOM (node) {
  var nodeName = node && node.nodeName && node.nodeName.toUpperCase() || '';
  var childNodesLength = node && node.childNodes.length || 0;

  if ($.inArray(nodeName, INVALID_NODES) > -1 || $(node).hasClass('techextension-message-box')) {
    return 0;
  }

  for (var n = 0; n < childNodesLength; n++) {
    var found = parseDOM(node.childNodes[n]);
    if (found > 0) {
      parseDOM(node);
      return 0;
    }
  }

  if (nodeName === 'IFRAME') {
    var doc;
    try {
      doc = node.contentDocument;
    } catch (e) {
      
    }
    if (doc) {
      parseDOM(doc.body);
    }
  }

  if (node.nodeType == Node.TEXT_NODE) {
    return parsePhoneNumbers(node);
  } else {
    addEvents(node);
  }
  return 0;
}

/** Replace phone numbers **/
function parsePhoneNumbers (node) {
  var isStringNumber = false;

  /** SIP address **/
  var sipAddressNumber = /sip:[a-zA-Z0-9_.\-]+@[a-zA-Z0-9_.\-]+\.[a-z]{1,4}/;

  /** Eliminate the obvious cases **/
  if (!node || node.nodeValue.length < 10 ||
      node.nodeValue.search(/\d/) == -1 &&
      node.nodeValue.match(sipAddressNumber) == null) {
        return 0;
  }

  var phoneNumber                          = /((((\+|(00))[1-9]\d{0,3}[\s\-.]?)?\d{2,4}[\s\/\-.]?)|21)\d{5,9}/;
  /** Modified phoneNumberNorthAmerica reg expression to allow for no spaces phone num support (i.e. 17328829922) **/
  //var phoneNumberNorthAmerica              = /\+?(1[\s-.])?((\(\d{3}\))|(\d{3}))[\s.\-]\d{3}[\s.\-]\d{4}/;
  var phoneNumberNorthAmerica              = /\+?(1[\s-.]?)?((\(\d{3}\))|(\d{3}))[\s.\-]?\d{3}[\s.\-]?\d{4}/;

  /** Phone number with an extension **/
  var phoneNumberNorthAmericaWithExtension = /\+?(1[\s-.])?((\(\d{3}\))|(\d{3}))[\s.\-]\d{3}[\s.\-]\d{4}\s{1,5}(ext|x|ex)\s{0,3}.{0,3}\d{2,5}/;
  var phoneNumberExtension                 = /(ext|x|ex)\s{0,3}.{0,3}\d{2,5}/g;
  var phoneNumberDelimiter                 = /[\s.,;:|]/;
  var text                                 = node.nodeValue;
  var offset                               = 0;
  var number                               = "";

  /** Extension **/
  var extension                            = null;
  var found                                = false;
  var foundNorthAmerica                    = false;

  /** Find the first phone number in the text node **/
  while (!found) {
    var result = text.match(phoneNumberNorthAmerica);

    /** Handling extension **/
    var resultWithExtension = text.match(phoneNumberNorthAmericaWithExtension);
    if (resultWithExtension) {
      extension  = text.match(phoneNumberExtension);
      extension  = extension[0];
    }

    if (result == null) {
      result = text.match(sipAddressNumber);
      if (result != null) {
        isStringNumber = true;
      }
    }

    if (result) {
      foundNorthAmerica = true;
    }
    else {
      foundNorthAmerica = false;
    }

    if (!result) {
      return 0;
    }
    number = result[0];
    if (!isStringNumber) {
      var pos = result.index;
      offset += pos;

      /** Make sure we have a reasonable delimiters around our matching number **/
      if (pos && !text.substr(pos - 1, 1).match(phoneNumberDelimiter)
          || pos + number.length < text.length
          && !text.substr(pos + number.length, 1).match(phoneNumberDelimiter)) {

        offset += number.length;
        text = text.substr(pos + number.length);
        continue;
      }
    } else{
      var pos = result.index;
      offset += pos;
    }
    /** looks like we found a phone number **/
    found = true;
  }

  var spanNode;
  /** handle string address **/
  if (isStringNumber) {
    var stringNumber = number.replace(/sip:/,'');
    spanNode     = $('<a  title="Click-to-Call '             + stringNumber +
      '" class="techextension-click-to-call"></a>')[0];
  } else {
    /** wrap the phone number in a span tag **/


    var spanNode = $('<a  title="Click-to-Call ' + number +
      '" class="techextension-click-to-call"></a>')[0];
  }

  var range   = node.ownerDocument.createRange();

  range.setStart(node, offset);
  range.setEnd  (node, offset + number.length);

  var docfrag = range.extractContents();
  var before  = range.startContainer.splitText(range.startOffset);
  var parent  = before.parentNode;

  spanNode.appendChild(docfrag);

  parent.insertBefore(spanNode, before);

  return 1;
}



function addEvents(node) {
  $('.techextension-click-to-call', node).unbind().bind({
    click : function(e){
     
      e.preventDefault();
      callNumber (this.innerHTML);
      if (e.stopPropagation) e.stopPropagation();
    },
    mouseover : function() {
      var offset, top, left;
      var $this = $(this);
      offset    = $this.offset();
      top       = offset.top-10;
      top       = (top > 0) ? top : 0;
      left      = offset.left - 30;
      left      = (left > 0) ? left : 0;

      var icon  = $('<div class="techextension-click-to-call-icon"></div>');
      iconFile  = chrome.extension.getURL('images/icon-phone.png');
      icon.css  ({ 'background-image' : 'url(' + iconFile + ')',
        'top' : top + 'px', 'left' : left + 'px'}).appendTo('body').fadeIn(200);
      $this.data('icon', icon);
    },
    mouseout  : function() {
      var $this  = $(this);
      $this.data('icon').fadeOut(200, function() {
        $(this).remove();
      });
    }
  });
}

/** Call the given number **/
function callNumber(phone_no) {
  
  //chrome.storage.local.set({'PhoneNumber': phone_no});
  //alert(phone_no);
   phone_no=phone_no.replace(/[^0-9]/g,'');
  chrome.runtime.sendMessage({greeting:"TechCall|**|"+phone_no}, function(response) 
				{
					console.log(response.farewell);
				});
}