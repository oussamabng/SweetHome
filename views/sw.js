const StaticCache = "static1";
const DynamicCache = "dynamic";
const cacheAssets = [
  "/",
  "webapp.html",
  "main.js",
  "swacss.css",
  "designs/favicon.png",
  "designs/login.png",
  "push.js",
  //'https://fonts.googleapis.com/css?family=Roboto',   //lzzmlhom cnx
  //'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
  "vanillatoasts.js",
  "vanillatoasts.css"
];

//installation sw et cacher les fichers
self.addEventListener("install", e => {
  console.log("Service Worker: Installed");
  e.waitUntil(
    caches
      .open(StaticCache)
      .then(function(cache) {
        console.log("service worker : caching file");
        return cache.addAll(cacheAssets).then(() => {
          console.log("caches added");
        });
      })
      .then(() => self.skipWaiting())
  );
});

//activation sw
self.addEventListener("activate", e => {
  self.clients.claim(); //le nouveau service worker prend le contrôle de toutes les pages ouvertes de l'appli web progressive
  console.log("Service Worker: Activated");

  // supp les fichers cachées indésirable
  e.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(function(cache) {
            if (cache !== StaticCache && cache !== DynamicCache) {
              console.log("Service Worker: Clear Cache");
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Fetch Network then cache

self.addEventListener("fetch", function(event) {
  console.log("fetch event for ", event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then(function(res) {
            return caches.open(DynamicCache).then(function(cache) {
              cache.put(event.request.url, res.clone());
              return res;
            });
          })
          .catch(function(err) {});
      }
    })
  );
});

self.addEventListener("push", function(e) {
  console.log("push event " + e);
  var data = { title: "notification", content: "new notification" }; //******************************************* */
  //console.log(JSON.stringify(data));
  console.log("data " + e.data);

  if (e.data) {
    data = JSON.parse(e.data.text());
    console.log(data);
  }
  var options = {
    body: data.content,
    icon: data.icon ? data.icon : "designs/login.png", //icon:'designs/login.png',
    dir: "ltr",
    vibrate: [200, 100, 200],
    badge: "designs/favicon.png",
    tag: "confirm-notification",
    renotify: true,
    actions: [
      { action: "confirm", title: "Okay" },
      { action: "cancel", title: "Cancel" }
    ]
  };

  e.waitUntil(
    console.log("notif"),
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", function(event) {
  var notification = event.notification;
  var action = event.action;
  var url = "http://127.0.0.1:5500/views/webapp.html"; //************************* */

  if (action === "confirm") {
    console.log("notification confirm");
  } else {
    console.log(action);
  }
  event.waitUntil(
    clients.matchAll().then(function(clis) {
      var client = clis.find(function(c) {
        return c.visibilityState === "visible";
      });

      if (client !== undefined) {
        client.navigate(url);
        client.focus();
      } else {
        clients.openWindow(url);
      }
      notification.close();
    })
  );
});

self.addEventListener("notificationclose", function(event) {
  console.log("notification was close");
});

/*self.clients.matchAll()
  .then( clients =>
    clients.forEach( client =>
      client.postMessage(message)
    )
  )*/

addEventListener("message", event => {
  console.log("[Service Worker] Message Event: ", event.data);
});
