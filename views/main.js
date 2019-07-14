function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const publicVapidKey =
  "BJV-kW194n9pPboPEBQAmwW3L7bbH3GFDcBiYmYqjvJFFIz6i8CuZXJfjUqrrzgYI5hM_ZYkGVEYlKKKHkQ9BuI";

const triggerPush = document.getElementById("pushTest");

async function triggerPushNotification() {
  if ("serviceWorker" in navigator) {
    const register = await navigator.serviceWorker.register("/sw.js", {
      scope: "/"
    });

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    await fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } else {
    console.error("Service workers are not supported in this browser");
  }
}

triggerPush.addEventListener("click", () => {
  console.log("submita  ");
  triggerPushNotification().catch(error => console.error(error));
});
