


var context = "selection";

  var id = chrome.contextMenus.create({"title": "Call To This '%s' Number", "contexts":[context],
                                         "id": "context" + context});
chrome.contextMenus.onClicked.addListener(onClickHandler);

var Aip,ext,user,Pass,URL;
// The onClicked callback function.


function onClickHandler(info, tab) {
  var sText = info.selectionText;
  sText=sText.replace(/[^0-9]/g,'');
  

chrome.storage.local.get('TechextensionAip', function(result){
	   if(result.TechextensionAip)
		{
		 Aip = result.TechextensionAip;
		
		}
		   
   
		chrome.storage.local.get('Techextensionextension', function(result){
	   if(result.Techextensionextension)
		{
		ext= result.Techextensionextension;
		
		}
		   
   
	

chrome.storage.local.get('Techextensionpassword', function(result){
	   if(result.Techextensionpassword)
		{
		Pass= result.Techextensionpassword;
		
		}
	
	
	chrome.storage.local.get('TechextensionURL', function(result){
	   if(result.TechextensionURL)
		{
		URL = result.TechextensionURL;
		
		}
		   
   
	
console.log(URL+"/clicktocall.php?Aip="+Aip+"&ext="+ext+"&phone="+sText);

	// notification start
															  if (Notification.permission !== "granted")
																  { Notification.requestPermission(); }
															  else {
																	var notification = new Notification('TechExtension Click To Call',
																	{
																  icon: chrome.extension.getURL("images/icon-phone.png"),
																  body:"Calling Number:"+sText,
																	});
																					
																	//notification.onclick = function(x) { window.focus(); this.cancel(); };
																	}
																					
																// notification ends
																
  var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
     
																
 
    }
  }
xmlhttp.open("GET",URL+"/clicktocall.php?Aip="+Aip+"&ext="+ext+"&phone="+sText+"&pass="+Pass,true);
xmlhttp.send();
console.log("success");

 }); }); }); }); 
}

 

		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse)
			{
								var callaction = request.greeting.split("|**|");
                                 var callState = callaction[0]; 
                                  var sText=callaction[1]; ;								 
             								
										if (callState == "TechCall")
										{
										  sendResponse({farewell: "Calling...."});
										  
										 
											  
											  if(sText)
											  {
											  
											 
											   
											  
											  
											  chrome.storage.local.get('TechextensionAip', function(result){
												   if(result.TechextensionAip)
													{
													 Aip = result.TechextensionAip;
													
													}
													   
												
													chrome.storage.local.get('Techextensionextension', function(result){
												   if(result.Techextensionextension)
													{
													ext= result.Techextensionextension;
													
													}
													   
												
												
												
												
chrome.storage.local.get('Techextensionpassword', function(result){
	   if(result.Techextensionpassword)
		{
		Pass= result.Techextensionpassword;
		
		}
	
	
												
												chrome.storage.local.get('TechextensionURL', function(result){
												   if(result.TechextensionURL)
													{
													URL = result.TechextensionURL;
													
													}
													   
												
												
											console.log(URL+"/clicktocall.php?Aip="+Aip+"&ext="+ext+"&phone="+sText);
												// notification start
															  if (Notification.permission !== "granted")
																  { Notification.requestPermission(); }
															  else {
																	var notification = new Notification('TechExtension Click To Call',
																	{
																  icon: chrome.extension.getURL("images/icon-phone.png"),
																  body:"Calling Number:"+sText,
																	});
																					
																	//notification.onclick = function(x) { window.focus(); this.cancel(); };
																	}
																					
																// notification ends

											  var xmlhttp;
											if (window.XMLHttpRequest)
											  {// code for IE7+, Firefox, Chrome, Opera, Safari
											  xmlhttp=new XMLHttpRequest();
											  }
											else
											  {// code for IE6, IE5
											  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
											  }
											xmlhttp.onreadystatechange=function()
											  {
											  if (xmlhttp.readyState==4 && xmlhttp.status==200)
												{
												 // alert('response');
												 
													
																
											 
												}
											  }
											xmlhttp.open("GET",URL+"/clicktocall.php?Aip="+Aip+"&ext="+ext+"&phone="+sText+"&pass="+Pass,true);
											xmlhttp.send();
											console.log("success");

 
									      }); }); }); });

                                             }

 										  
											  
											  
											  
										   chrome.storage.local.set({'PhoneNumber': ""});
										  
										}
										
										
										
										
				

				
			});