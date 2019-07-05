(function (window) {
  'use strict';
    
 var isEnable=false;   
 //var enableNotifaction = document.querySelector('.enable-notification');

 if ('Notification' in window){
   console.log('push notification')
   askForNotificationPermission();
  }else{
     console.log("no notification in browser")
  }


  /*enableNotifaction.addEventListener('click', function(){
    if (!isEnable){
      change_btn_notif('enable');
      console.log('now ask for permission');
      askForNotificationPermission();
    }else{
      change_btn_notif('disable');
      unsubscribe();
    }
  });*/

 
 function askForNotificationPermission(){
    Notification.requestPermission()
    .then((res)=>{
     if (res!=='granted'){
       console.log('notification '+res);
       //change_btn_notif('incompatible');
     } else{
       console.log('notification '+res);
       //checkSubscription();
     }
   })
}

/*function checkSubscription(){
  if ( 'serviceWorker' in navigator){
    navigator.serviceWorker.ready
    .then(function(registration){
      return registration.pushManager.getSubscription();
    })
    .then(function(sub){
      console.log(sub);
      if(sub===null){
        subscribeUser();
      } else{
          updateSubscription();
      }
    }).catch(function(){
        //change_btn_notif('disable')
        console.log('erreur dans checkSubscription');
    })
   }
 }



function subscribeUser(){
 navigator.serviceWorker.ready
  .then(function(reg){
     reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:urlBase64ToUint8Array("BNgVIH_VpsHF842JrXSmCkHzS4NcVa-uUnLymg9FrQLGVhN3jrJxmmYZKt-swFaGksXpoMZxL8WmhqDyZXyiM9U" )
     })
   }).then(function(sub){
     console.log('subscribeUser '+JSON.stringify(sub));
     saveSubscription();
   }).catch(function(err){
     console.log('error');
     VanillaToasts.create({
        title: 'Subscription',
        text: 'error in subscription!!',
        type: 'error', // success, info, warning, error
        icon: 'designs/login.png',
        timeout: 2000 ,
        callback: function() {  } 
      }); 
     //change_btn_notif('disable');
   }) 
}



function saveSubscription(){
 console.log('save sub');
 navigator.serviceWorker.ready
 .then(function(reg){
   reg.pushManager.getSubscription()
    .then(function(sub){
     console.log('hhhh '+sub);
     fetch('   ',{
       method:'post',
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
       body: JSON.stringify(sub)
     }).then(function(res){
       console.log(res.JSON)
       VanillaToasts.create({
          title: 'Subscription',
          text: 'Subscribed to push notification successfully.',
          type: 'success', // success, info, warning, error
          icon: 'designs/login.png',
          timeout: 2000 ,
          callback: function() {  } 
        });   
       }).catch(function(err){
         VanillaToasts.create({
            title: 'Subscription',
            text: 'error in save subscription.',
            type: 'error', // success, info, warning, error
            icon: 'designs/login.png',
            timeout: 2000 ,
            callback: function() {  } 
          });   
         //change_btn_notif('disable');
       })
     })
 })
}

/*function unsubscribe(){
 navigator.serviceWorker.ready
 .then(function(reg){
     reg.pushManager.getSubscription()
     .then(function(sub){
        console.log('unsubscribe ');  
         if(sub){
            sub.unsubscribe()
            .then(function(){
                console.log(sub);
                VanillaToasts.create({
                    title: 'Subscription',
                    text: 'Unsubscribed successfully.',
                    type: 'success', // success, info, warning, error
                    icon: 'designs/login.png',
                    timeout: 2000 ,
                    callback: function() {  } 
                  });    
                change_btn_notif('disable');
            }).catch(function(err){
                console.log('error'+err);
            }) 
         }else{
             console.log('undefined user')
         }
     }).catch(function(){
            console.error('Failed to unsubscribe push notification.');
        })
 })
}

function updateSubscription(){

}

/*function change_btn_notif(state){
    switch (state){
        case 'enable':{
            enableNotifaction.textContent='Disable Notifications';
            isEnable=true;
            enableNotifaction.disabled = false;
            break;
        }
        case 'disable' :{
            enableNotifaction.textContent='Enable Notifications';
            isEnable=false;
            enableNotifaction.disabled = false;
            break;
        }
        case 'incompatible':{
            enableNotifaction.disabled = true;
            enableNotifaction.textContent = 'Push notifications are not compatible with this browser';
            break;
        }
    }
}
*/

   
 


 /*function displayConfirmNotification() {
 if ('serviceWorker' in navigator) {
   var options = {
     body: 'You successfully subscribed to our Notification service!',
     icon: 'designs/login.png',
     dir: 'ltr',
     vibrate: [200, 100, 200],
     badge: 'designs/login.png',
     tag: 'confirm-notification',
     renotify: true,
     actions: [
       { action: 'confirm', title: 'Okay', icon: 'designs/login.png' },
       { action: 'cancel', title: 'Cancel', icon: 'designs/login.png' }
     ]
   };

   navigator.serviceWorker.ready
     .then(function(swReg) {
       swReg.showNotification('Successfully subscribed ', options);
      });
  }
}


*/

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }


})(window);