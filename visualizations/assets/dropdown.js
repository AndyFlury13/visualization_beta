window.addEventListener("DOMContentLoaded", function () {
  //var article_elem_button = document.getElementById("article_elem_button");
  // var user_button = document.getElementById("user_button");
  // var classic_button = document.getElementById("classic_button");
  var explore_button = document.getElementById("explore_button");
  // var input = document.getElementById('userid')
  // var content = document.getElementsByClassName("dropdown-content")[0];
  // var close_button = document.getElementById("close_button");
  // var showClassicText = true;

  var button_state = 0; // We have TWO states for this deployment;
  // // HARD CODED
  // var userIDs = ['1234', '5678', '9012']
  // //HARD CODED

  // var articleElements = document.getElementsByClassName('hide')[0];
  // //var yourCont = document.getElementsByClassName('hide')[1];
  // var classicElements = document.getElementsByClassName('hide')[1];

  // function classic_click() {
  //   button_state = 0;
  //   visualizationOn = true;
  //   $("#popup").css("opacity", 1);
  //   classic = true;
  //   //content.style.display = "none";
  //   if (showClassicText) {
  //     classicElements.setAttribute('class', 'show');
  //   }
  //   articleElements.setAttribute('class', 'hide');
  //   //yourCont.setAttribute('class', 'hide');
  //   $("#chart").css("opacity", 1);
  //   // document.querySelector('#userid').setAttribute('class', 'hidden');
  //   // document.querySelector('#errormsg').setAttribute('class', 'hidden');
  //   sunburst = $(".userScore");
  //   sunburst.css("display", "none");
  //   classic_button.style.opacity = 1;
  //   // user_button.style.opacity = 0.6;
  //   article_elem_button.style.opacity = 0.6;
  //   d3.text(TEXT_FILE_URL, function(text) {
  //     document.getElementById("textArticle").innerHTML = text.toString();
  //     d3.csv(DATA_FILE_URL, function(error, data) {
  //       if (error) throw error;
  //       d3.csv(TRIAGE_FILE_URL, function(error, triageData) {
  //         if (error) throw error;
  //         createHighlights(data, triageData, text.toString());
  //       });
  //     });
  //   });
  // }
  //
  // article_elem_button.onclick = article_click;
  //
  // //Your Contribution
  // // input.addEventListener("keyup", e => { // redoing individual contribution functionality
  // //   if (e.keyCode === 13) {
  // //     console.log(input.value);
  // //     var userid = input.value;
  // //
  // //     if (!userIDs.includes(userid)) {
  // //       console.log("Invalid USERID");
  // //       document.querySelector('#errormsg').setAttribute('class', 'shown');
  // //     } else {
  // //       classic = false;
  // //       visualizationOn = false;
  // //       $("#chart").css("opacity", .2);
  // //       $("#popup").css("opacity", .5);
  // //       $("myModal").hide();
  // //       document.querySelector('#errormsg').setAttribute('class', 'hidden');
  // //       // Implement USERID lookup here.
  // //       sunburst = $(".userScore");
  // //       sunburst.slideDown();
  // //       //sunburst.css("display", "block");
  // //
  // //
  // //       d3.text(TEXT_FILE_URL, function(text) {
  // //         document.getElementById("textArticle").innerHTML = text.toString();
  // //         d3.csv(USER_FILE_URL, function(error, data) {
  // //           if (error) {
  // //             console.log('No user file found');
  // //           } else {
  // //             createFormHighlights(data, text.toString(), false);
  // //           }
  // //           });
  // //       });
  // //     }
  // //     input.value = "";
  // //   }
  // // });
  //
  //
  // // user_button.onclick = function() {
  // //   //document.querySelector('#userid').setAttribute('class', 'userform');
  // //   d3.text(TEXT_FILE_URL, function(text) {
  // //     document.getElementById("textArticle").innerHTML = text.toString();
  // //     d3.csv(USER_FILE_URL, function(error, data) {
  // //       if (error) {
  // //         console.log('No user file found');
  // //       } else {
  // //         createTriageHighlights(data, text.toString(), false);
  // //       }
  // //       });
  // //   });
  // //
  // //   content.style.display = "block";
  // //   yourCont.setAttribute('class', 'show');
  // //   articleElements.setAttribute('class', 'hide');
  // //   this.style.opacity = 1;
  // //   article_elem_button.style.opacity = 0.6;
  // //   classic_button.style.opacity = 0.6;
  // //
  // //
  // //   // Gray out hallmark, remove functionality
  // //   classic = false;
  // //   visualizationOn = false;
  // //   $("#chart").css("opacity", .2);
  // //   $("#popup").css("opacity", .5);
  // //   $("#myModal").hide();
  // //   $("#popup").html("?");
  // //   sunburst = $(".userScore");
  // //   sunburst.css("display", "none");
  // // }
  //
  // function article_click() {
  //   button_state = 1;
  //   classic = false;
  //   visualizationOn = false;
  //   $("#chart").css("opacity", .2);
  //   $("#popup").css("opacity", .5);
  //   $("#myModal").hide();
  //   $("#popup").html("?");
  //   content.style.display = "block";
  //   articleElements.setAttribute('class', 'show');
  //   classicElements.setAttribute('class', 'hide');
  //   //yourCont.setAttribute('class', 'hide');
  //   // document.querySelector('#userid').setAttribute('class', 'hidden'); redoing individual contribution functionality
  //   // document.querySelector('#errormsg').setAttribute('class', 'hidden');
  //   sunburst = $(".userScore");
  //   sunburst.css("display", "none");
  //   article_elem_button.style.opacity = 1;
  //   classic_button.style.opacity = 0.6;
  //   // user_button.style.opacity = 0.6;
  //   var article_sha256;
  //
  //   d3.text(TEXT_FILE_URL, function(text) {
  //     document.getElementById("textArticle").innerHTML = text.toString();
  //     d3.csv(TRIAGE_FILE_URL, function(error, data) {
  //       if (error) throw error;
  //       createTriageHighlights(data, text.toString(), true);
  //     });
  //   });
  // }
  // //Article Elements
  // classic_button.onclick = classic_click;

  explore_button.onclick = function() {

    if (button_state == 0) {
      $("#chart").css("opacity", .2);
      $("#popup").css("opacity", .4);
      $("#myModal").hide();
      $("#popup").html("?");
      document.getElementById("popup").disabled = true;
      classic = false;
      this.innerHTML = "Classic View";
      this.style["background-color"] = "#57c1ae";
      this.style["font-weight"] = "30px";
      d3.text(TEXT_FILE_URL, function(text) {
          document.getElementById("textArticle").innerHTML = text.toString();
          d3.csv(TRIAGE_FILE_URL, function(error, data) {
            if (error) throw error;
            createTriageHighlights(data, text.toString(), true);
          });
      });
    } else {
      $("#chart").css("opacity", 1);
      $("#popup").css("opacity", .65);
      document.getElementById("popup").disabled = false;
      classic = true;
      this.innerHTML = "Article Elements";
      this.style["background-color"] = "#76BCE2";
      this.style["font-weight"] = "30px";
      d3.text(TEXT_FILE_URL, function(text) {
          document.getElementById("textArticle").innerHTML = text.toString();
          d3.csv(DATA_FILE_URL, function(error, data) {
            if (error) throw error;
            d3.csv(TRIAGE_FILE_URL, function(error, triageData) {
              if (error) throw error;
              createHighlights(data, triageData, text.toString());
            });
          });
        });
    }
    button_state = (button_state + 1) % 2
  }

  $("#explore_button").mouseleave(function() {
    $(this).css("background-color", "#4d61b3");
    $(this).html("Explore the Article");
    $(this).css("font-weight", "none");
  });

  $("#explore_button").mouseenter(function() {
    if (button_state == 1) {
      $(this).css("background-color", "#57c1ae");
      $(this).html("Classic View");
      $(this).css("font-weight", "bold");
    } else {
      $(this).css("background-color", "#76BCE2");
      $(this).html("Article Elements");
      $(this).css("font-weight", "bold");
    }
  });


  // close_button.onclick = function() {
  //   $(".dropdown-content").slideUp("slow");
  //   showClassicText = false;
  //   classic_click();
  //   showClassicText = true;
  // }


});
