window.addEventListener("DOMContentLoaded", function () {
  var button_one = document.getElementById("button_one");
  var button_two = document.getElementById("button_two");
  var button_three = document.getElementById("button_three");
  var input = document.getElementById('userid')

  // HARD CODED
  var userIDs = ['1234', '5678', '9012']
  //HARD CODED

  button_one.onclick = function() {
    document.querySelector('#userid').setAttribute('class', 'hidden');
    document.querySelector('#errormsg').setAttribute('class', 'hidden');
    sunburst = $(".userScore");
    sunburst.css("display", "none");
    this.style.opacity = 1;
    button_two.style.opacity = 0.6;
    button_three.style.opacity = 0.6;
    d3.text(TEXT_FILE_URL, function(text) {
      document.getElementById("textArticle").innerHTML = text.toString();
      d3.csv(DATA_FILE_URL, function(error, data) {
        if (error) throw error;
        createHighlights(data, text.toString());
      });
    });
  }
  input.addEventListener("keyup", e => {
    if (e.keyCode === 13) {
      console.log(input.value);
      var userid = input.value;
      if (!userIDs.includes(userid)) {
        console.log("Invalid USERID");
        document.querySelector('#errormsg').setAttribute('class', 'shown');
      } else {
        document.querySelector('#errormsg').setAttribute('class', 'hidden');
        // Implement USERID lookup here.
        sunburst = $(".userScore");
        sunburst.slideDown();
        //sunburst.css("display", "block");

        d3.text(TEXT_FILE_URL, function(text) {
          document.getElementById("textArticle").innerHTML = text.toString();
          d3.csv(USER_FILE_URL, function(error, data) {
            if (error) throw error;
              createFormHighlights(data, text.toString(), false);
            });
        });
      }
      input.value = "";
    }
  });
  button_two.onclick = function() {
    document.querySelector('#userid').setAttribute('class', 'userform');
    this.style.opacity = 1;
    button_one.style.opacity = 0.6;
    button_three.style.opacity = 0.6;
  }
  button_three.onclick = function() {
    document.querySelector('#userid').setAttribute('class', 'hidden');
    document.querySelector('#errormsg').setAttribute('class', 'hidden');
    sunburst = $(".userScore");
    sunburst.css("display", "none");
    this.style.opacity = 1;
    button_one.style.opacity = 0.6;
    button_two.style.opacity = 0.6;
    
    d3.text(TEXT_FILE_URL, function(text) {
      document.getElementById("textArticle").innerHTML = text.toString();
      d3.csv(FORM_FILE_URL, function(error, data) {
        if (error) throw error;
        createFormHighlights(data, text.toString(), true);
      });
    });
  }
});
