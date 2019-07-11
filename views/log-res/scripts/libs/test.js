function registerTest (){
    var email = document.getElementById('Registermail').value;
    var username = document.getElementById('txtRegisterUsername').value;
    var password = document.getElementById('txtRegisterPassword').value;
    var sende = {username : username , email : email , password : password}
    var send = {username : "oussama" , email: "ouss@gmail.com" , password :"12345"}
    $.ajax({
        type : 'POST',
        data : JSON.stringify(send),
        contentType : 'application/json',
        dataType : 'json',
        url : '/api/signIn/s',
        success : function(data){
            console.log(data);
            }
        });
    ajaxRequester.register(email, username, password,
        function (data) {
        data.email = email;    
        data.username = username;
            Success(data);
    }, registerError);
}