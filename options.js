// Saves options to chrome.storage

 
function save_options() {
  var asteriskip = document.getElementById('asteriskip').value;
  var extension = document.getElementById('extension').value;
  //var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var URL = document.getElementById('URL').value;
  
  chrome.storage.local.set({'TechextensionAip': asteriskip});
   chrome.storage.local.set({'Techextensionextension': extension});
  //  chrome.storage.local.set({'Techextensionusername': username});
	 chrome.storage.local.set({'Techextensionpassword': password});
	  chrome.storage.local.set({'TechextensionURL': URL});
	  chrome.runtime.reload(); 

 
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.

  chrome.storage.local.get('TechextensionAip', function(result){
	   if(result.TechextensionAip)
		{
		document.getElementById('asteriskip').value = result.TechextensionAip;
		
		}
		   
    });
	
	chrome.storage.local.get('Techextensionextension', function(result){
	   if(result.Techextensionextension)
		{
		document.getElementById('extension').value = result.Techextensionextension;
		
		}
		   
    });
	

	chrome.storage.local.get('Techextensionpassword', function(result){
	   if(result.Techextensionpassword)
		{
		document.getElementById('password').value = result.Techextensionpassword;
		
		}
		 });
		
	
	chrome.storage.local.get('TechextensionURL', function(result){
	   if(result.TechextensionURL)
		{
		document.getElementById('URL').value = result.TechextensionURL;
		
		}
		   
    });
	
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);