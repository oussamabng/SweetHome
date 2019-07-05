document.addEventListener('DOMContentLoaded', function(event) {
  /*if (!navigator.onLine) {
    updateNetworkStatus();
  }*/

  window.addEventListener('online', updateNetworkStatus, false);
  window.addEventListener('offline', updateNetworkStatus, false);
});

function updateNetworkStatus() {
  if (navigator.onLine) {
     VanillaToasts.create({
        title: 'connection',
        text: 'app online ',
        type: 'success', // success, info, warning, error
        icon: 'designs/login.png',
        timeout: 2000 ,
        callback: function() {  } 
      });    
  }else{
    VanillaToasts.create({
      title: 'connection',
      text: 'app offline ',
      type: 'info', // success, info, warning, error
      icon: 'designs/login.png',
      timeout: 4000 ,
      callback: function() {  } 
    });    

  }
    
  }