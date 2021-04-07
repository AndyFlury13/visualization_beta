


function runPyScript(input){
    var jqXHR = $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/login",
        async: false,
        data: { mydata: input },
        crossDomain: true
    });

    return jqXHR.responseText;
}
