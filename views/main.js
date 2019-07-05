  //enregistrement de service worker (the last one )
    if ('serviceWorker' in navigator && 'PushManager' in window ){
          navigator.serviceWorker.register('/views/sw.js')
            .then(reg => console.log("service worker:registred") )
            .catch(err =>{console.log("error service worker Unregustred " )});
    }


  //add to home screen
   
     let btn_Prompt;
     const addBtn = document.querySelector('.add-button');
     addBtn.style.display = 'none';

     window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        btn_Prompt = e;
        //notify the users they can add to home screen
        addBtn.style.display = 'block';
        addBtn.addEventListener('click', (e) => {
            addBtn.style.display = 'none';
            btn_Prompt.prompt();
            btn_Prompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                }
                else {console.log('User dismissed the A2HS prompt');
                }
                btn_Prompt = null;
                //addBtn.style.display = 'none';
             });
           });
     });


navigator.serviceWorker
 .addEventListener('message',function(event) { 
  console.log('message')
  console.log(event.data)
})

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
   

 
 
 
    
   

