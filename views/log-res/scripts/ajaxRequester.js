'use strict';

var ajaxRequester = (function () {


    function login(username, password, success, error){
        $.ajax({
            method: 'POST',
            url:  '/api/auth/k',
            contentType : 'application/json',
            dataType : 'json',
            data:  JSON.stringify({username: username, password: password}),
            success: success,
            error: error
        });
    }

    function register(email, username, password, success, error){

        var send = {username : username , email : email , password : password}
        $.ajax({
            method: 'POST',
            url: '/api/signIn/k',
            contentType : 'application/json',
            dataType : 'json', 
            data: JSON.stringify(send, function(){
                console.log( JSON.stringify(send));
            }),
            success:  function(success){
                console.log(success);
            },
            error: error
        });
    }

    function registerApp(email, username, password){
        var send = {username : username , email : email , password : password}
        $.ajax({
            type : 'POST',
            data : JSON.stringify(send),
            contentType : 'application/json',
            dataType : 'json',
            url : '/api/signIn/k',
            success : function(data){
                document.getElementById('k').value  = data.name;
                }
            });
    }
    return {
        login: login,
        register: register,
    };

})();