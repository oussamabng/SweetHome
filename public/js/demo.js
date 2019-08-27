if (screen.width < 700) {
  var r = 120;
  var a = "bottom";
  var b = -195;
  var c = 220;
  var x = -120;
  var y = 130;
  var u = -45;
  var i = 55;
  var w = -10;
  var v = 30;
  var p = -240;
  var o = 270;
} else {
  var r = 100;
  var a = "left";
  var b = 15;
  var c = 60;
  var x = 15;
  var y = 60;
  var u = 15;
  var i = 60;
  var w = 15;
  var v = 60;
  var p = 15;
  var o = 60;
}

var tour = {
    id: "hello-hopscotch",
    steps: [
      {
        target: "test",
        title: "Hello and welcome!",
        content:
          "welcome to your Sweet app, where you can control your whole home easily , by controlling each room by itself! each room has its own card with the devices working in it!",
        placement: "top",
        yOffset: r,
        xOffset: 15,
        arrowOffset: 60
      },

      {
        target: "type0",
        placement: a,
        title: "Name and type of your room",
        content:
          "here you will find the name and the type of your room; if you're on a phone or a tablet , grab and swipe left and right to navigate between your rooms!"
      },
      {
        target: "rgb0",
        placement: a,
        title: "Control your lights",
        content:
          "turn on or off by clicking on the light bulb, and have fun changing your light color with the rgb color wheel"
      },
      {
        target: "charts0",
        placement: a,
        title: "Temperature and humidity ",
        content:
          "keep track of your room's temperature and humidity, click on it to check the detailed chart over time!"
      },
      {
        target: "motion0",
        placement: a,
        title: "motion detector",
        content:
          "If you see this little man runnig , then there's movement in your room, and if he's not moving then your room is safe and empty."
      },
      {
        target: "gaz0",
        placement: a,
        title: "Gas leak?",
        content:
          "keep an eye on different gas levels on your room , don't worry  you will have a notification if there is any gas leak!"
      },
      {
        target: "add-tour",
        placement: "bottom",
        title: "Add a new room",
        content:
          "create a new room here by naming it , choosing a type and Selecting the devices that you installed in it ",
        yOffset: 100,
        xOffset: b,
        arrowOffset: c
      },
      {
        target: "showRoutines",
        placement: "bottom",
        title: "Routines",
        content:
          "all of us have routines that we repeat every day , well you don't have to anymore! ",
        yOffset: 100,
        xOffset: x,
        arrowOffset: y
      },
      {
        target: "showRoutines",
        placement: "bottom",
        content:
          "Add your routine , name it and give it a themed color, and select devices that will do certain actions when the routine is activated! ",
        yOffset: 100,
        xOffset: x,
        arrowOffset: y
      },
      {
        target: "showRoutines",
        placement: "bottom",
        content:
          "for example : whenever you are going to sleep you have to turn all the lights off and turn on the alarm for motion sensors , well... why do it by hand when you only have to press one button if you add a sleep routine here? (cool, right?) ",
        yOffset: 100,
        xOffset: x,
        arrowOffset: y
      },
      {
        target: "notify",
        placement: "bottom",
        title: "Notifications",
        content:
          "all of the notifications sent to you by the app are listed here , if you miss one you can check it , and if you handled the situation , you can delete the notification with the lil 'x' on the right of each one ",
        yOffset: 100,
        xOffset: u,
        arrowOffset: i
      },
      {
        target: "logout",
        placement: "bottom",
        title: "Logout!",
        content:
          "if you want to sign off from your account , you can do it here !  ",
        yOffset: 100,
        xOffset: w,
        arrowOffset: v
      },
      {
        target: "help-tour",
        placement: "bottom",
        content:
          "have fun using your Sweet app in your Sweet home, if you have any questions, fill free to sen us an email with the form that you will find here!",
        yOffset: 100,
        xOffset: p,
        arrowOffset: o
      }
    ],
    showPrevButton: true,
    scrollTopMargin: 100
  },
  /* ========== */
  /* TOUR SETUP */
  /* ========== */
  addClickListener = function(el, fn) {
    if (el.addEventListener) {
      01111;
      el.addEventListener("click", fn, false);
    } else {
      el.attachEvent("onclick", fn);
    }
  },
  init = function() {
    var startBtnId = "startTourBtn",
      calloutId = "startTourCallout",
      mgr = hopscotch.getCalloutManager(),
      state = hopscotch.getState();

    if (state && state.indexOf("hello-hopscotch:") === 0) {
      // Already started the tour at some point!
      hopscotch.startTour(tour);
    } else {
      // Looking at the page for the first(?) time.
      setTimeout(function() {
        mgr.createCallout({
          id: startBtnId,
          target: "help-tour",
          placement: "bottom",
          title: "Take a tour ",
          content:
            "You can take a tour around the app to know what to do and how to do it.",
          yOffset: 80,
          xOffset: p,
          arrowOffset: o
        });
      }, 100);
    }

    addClickListener(document.getElementById(startBtnId), function() {
      if (!hopscotch.isActive) {
        mgr.removeAllCallouts();
        hopscotch.startTour(tour);
      }
    });
  };

init();
// ADJUST FOR VIEWPORT
