"use strict";

(function() {
  $(function() {
    registerEventHandlers();

    showHomeView();
  });

  function registerEventHandlers() {
    $("#forgotPassword").click(function() {
      console.log("clic forgot ");

      $.ajax({
        method: "GET",
        url: "/api/forgot",
        success: function() {
          console.log("get forgot wsal");
        }
      });
    });

    $("#btnLoginLogin").click(function() {
      var user = document.getElementById("txtLoginUsername").value;
      var pass = document.getElementById("txtLoginPassword").value;
      console.log(user);
      $.ajax({
        method: "POST",
        data: JSON.stringify({ username: user, password: pass }),
        contentType: "application/json",
        dataType: "json",
        url: "/api/auth",

        success: function(data) {
          $.ajaxSetup({
            headers: {
              "x-auth-token": data.token
            }
          });
          console.log(data.token);
          window.location.replace(`/api/rooms/all?token=${data.token}`);

          //hna
        }
      });
    });
    $("#btnRegister").click(function() {
      var email = document.getElementById("Registermail").value;
      var username = document.getElementById("txtRegisterUsername").value;
      var password = document.getElementById("txtRegisterPassword").value;
      var token = document.getElementById("txtRegisterTokenId").value;
      $.ajax({
        type: "POST",
        data: JSON.stringify({
          username: username,
          email: email,
          password: password,
          tokenId: token
        }),
        contentType: "application/json",
        dataType: "json",
        url: "/api/signIn",
        success: function(data) {
          console.log(data);
        }
      });
    });
  }

  function showHomeView() {
    $("main > *").hide();
    $("#homeView").show();
    // $("#forgotView").hide();
  }

  function showForgotPassword() {
    $("#homeView").hide();
    $("#forgotView").show();
  }

  function Success(data) {
    login(data);
  }

  function loginError(error) {
    showAjaxError("Login failed.", error);
  }

  function registerError(error) {
    showAjaxError("Register failed.", error);
  }

  function showAjaxError(msg, error) {
    var errMsg = error.responseJSON;
    if (errMsg && errMsg.error) {
      showErrorMessage(msg + ": " + errMsg.error);
    } else {
      showErrorMessage(msg + ".");
    }
  }

  function showInfoMessage(msg) {
    not({
      text: msg,
      type: "info",
      layout: "topCenter",
      timeout: 5000
    });
  }

  function showErrorMessage(msg) {
    not({
      text: msg,
      type: "error",
      layout: "topCenter",
      timeout: 5000
    });
  }
})();

function reset_pass() {
  var email = document.getElementById("mail").value;
  $.ajax({
    type: "POST",
    data: JSON.stringify({ email: email }),
    contentType: "application/json",
    dataType: "json",
    url: "/api/forgot",
    success: function(data) {
      console.log(data);
    }
  });
  $("#forgotView").hide();
  $("#mailsend").show();
}

function update_password() {
  var pass1 = document.getElementById("pass1").value;
  var pass2 = document.getElementById("pass2").value;

  var token = window.location.href.split("/")[4];
  $.ajax({
    type: "POST",
    data: JSON.stringify({
      newPassword: pass1,
      verifyPassword: pass2,
      token: token
    }),
    contentType: "application/json",
    dataType: "json",
    url: "/reset",
    success: function(data) {
      console.log(data);
    }
  });
}
