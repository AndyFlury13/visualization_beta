/** This file will create the hallmark. It uses the d3 library to create a sunburst visualization.
A rough roadmap of the contents:
    - global variables
    - create hallmark skeleton
    - fill center of hallmark
    - mouse animations
    - helper functions

**/

var chartDiv = document.getElementById("chart");

var width = 400,
    height = 400,
    radius = (Math.min(width, height) / 2);

var formatNumber = d3.format(",d");

var x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

var y = d3.scaleSqrt()
    .range([0, radius]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var partition = d3.partition();

var classic = true;

/* A map that relates a node in the data heirarchy to the
SVGPathElement in the visualization.
*/
var nodeToPath = new Map();

var arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function(d) { return 155 * d.y0; })
    .outerRadius(function(d) { return 155 * d.y1; });


//This variable creates the floating textbox on the hallmark
var DIV;
var TRIAGE_DIV;
var PSEUDOBOX;

var ROOT;
var SVG;
var visualizationOn;
var DEFINITION_SHOWING = false;
var TOOLTIP_TEXT = '';

var DEFINITION_EXAMPLE = "<p>\"\"\"Assuming without good reason that the past was superior to the present or future. The idea that things in the past were much better than the present in some unspecific way, or neglecting relevant ways in which the past was actually worse. E.g. \"This new generation, with their TikTok & video games, will never understand how great it was to grow up in the 20th century. If they did, their so-called FOMO (fear of missing out) would destroy them.\">E.g. \"Long gone are the times when you could walk down the street without encountering some person struggling just to live. Long gone is our Old California.\"\"\"\"</p>";

function hallmark(data) {

  var svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append('g')
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
  SVG = svg;



  visualizationOn = false;

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("text-align", "center")
      .style("margin", "auto");

  var triage_div = d3.select('body').append('div')
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("text-align", "center");

  var pseudobox = d3.select("body").append("div")
      .attr("class", "pseudobox")
      .style("opacity", 1);

  DIV = div;
  TRIAGE_DIV = triage_div;
  PSEUDOBOX = pseudobox;

  delete data["columns"];
  clean(data);
  data = addDummyData(data);
  var root = convertToHierarchy(data);

  var PILLS_MAP = new Map();
  condense(root, PILLS_MAP);
  drawPills(PILLS_MAP);
  // var sunburst_div = document.getElementsByClassName('sunburst')[0]
  // var newheight = sunburst_div.clientHeight + document.getElementById('chart').clientHeight;
  // sunburst_div.style.height = newheight.toString() + "px";
  ROOT = root;
  totalScore = 90 + scoreSum(root);
  root.sum(function(d) {

    return Math.abs(parseFloat(d.data.Points));
  });

  //Fill in the colors
  svg.selectAll("g")
    .data(partition(root).descendants())
    .enter().append("path")
    .attr("d", arc)
    .style("fill", function(d) {
      nodeToPath.set(d, this)
      return color(d.data.data["Credibility Indicator Category"]);
    });



  //Setting the center circle to the score
var center_style = getCenterStyle(NUM_NFC);
var text_x = center_style[0];
var text_y = center_style[1];
var text_size = center_style[2];
var question_x = center_style[3];
var question_y = center_style[4];
var question_size = center_style[5]
var double_question = center_style[6];

  svg.selectAll(".center-text")
    .style("display", "none");
  svg.append("text")
    .attr("class", "center-text")
    .attr("x", text_x)
    .attr("y", text_y)
    .style("font-size", text_size)
    .style("text-anchor", "middle")
    .html((totalScore));

  if (double_question) {
    svg.append("text")
      .attr("class", "center-question")
      .attr("x", question_x)
      .attr("y", question_y)
      .style("font-size", question_size)
      .html("??")
  } else {
    svg.append("text")
      .attr("class", "center-question")
      .attr("x", question_x)
      .attr("y", question_y)
      .style("font-size", question_size)
      .html("?")
  }



  //Setting the outer and inside rings to be transparent.
  d3.selectAll("path").transition().each(function(d) {
    if (d) {
        if (!d.children) {
            this.style.display = "none";
        } else if (d.height == 2) {
            this.style.opacity = 0;
        }
    }
  });

  //Mouse animations.
  svg.selectAll("path")
     .on('mouseover', function(d) {
          drawVis(d, root, this, div);
          visualizationOn = true;
    })
    .on('mousemove', function(d) {
        if (visualizationOn) {
            var sunburstBox = $(".sunburst")[0].getBoundingClientRect();
            var divBox = $(".tooltip")[0].getBoundingClientRect();
            var midline = (sunburstBox.right + sunburstBox.left) / 2;
            var width = divBox.right - divBox.left;
            if (d3.event.pageX < midline) {
                div
                    .style("opacity", .7)
                    .style("left", (d3.event.pageX)+ "px")
                    .style("top", (d3.event.pageY) + "px");
            } else {
                div
                    .style("opacity", .7)
                    .style("left", (d3.event.pageX - width)+ "px")
                    .style("top", (d3.event.pageY) + "px");
            }
        } else {
            div.transition()
                .duration(10)
                .style("opacity", 0);
        }
    })
    // .on('mouseleave', function(d) {
    //   console.log('leaving');
    //     resetVis(d);
    // }).on('click', function(d) {
    //   scrolltoView(d)
    // })
    // .on('click', function(d) {
    //     scrolltoView(d);
    // })
    .style("fill", colorFinderSun);


  //Setting the outer and inside rings to be transparent.
    d3.selectAll("path").transition().each(function(d) {
        if (d) {
            if (!d.children) {
                this.style.display = "none";
            } else if (d.height == 2) {
                this.style.opacity = 0;
            }
        }
    });

  //Mouse animations.
    svg.selectAll("path")
        .on('mouseover', function(d) {
            if (d.height == 0) {
              var start_index = d.data.data.Start;
              var end_index = d.data.data.End;
              if (start_index == -1 || end_index == -1) {
                document.body.style.cursor = "default";
              } else {
                document.body.style.cursor = "pointer";
              }
            } else if (d.height == 1) {
                document.body.style.cursor = "pointer";
            } else {
              document.body.style.cursor = "default";
            }
            if (classic) {
              drawVis(d, root, this, div);
              visualizationOn = true;
            }
        })
        .on('mousemove', function(d) {
            if (visualizationOn) {
                var sunburstBox = $(".sunburst")[0].getBoundingClientRect()
                var divBox = $(".tooltip")[0].getBoundingClientRect()
                var midline = (sunburstBox.right + sunburstBox.left) / 2;
                var width = divBox.right - divBox.left;
                if (d3.event.pageX < midline) {
                    div
                        .style("opacity", .7)
                        .style("left", (d3.event.pageX)+ "px")
                        .style("top", (d3.event.pageY) + "px")
                } else {
                    div
                        .style("opacity", .7)
                        .style("left", (d3.event.pageX - width)+ "px")
                        .style("top", (d3.event.pageY) + "px")
                }
                div.html()
            } else {
                div.transition()
                    .duration(10)
                    .style("opacity", 0);
            }
        })
        .on('mouseleave', function(d) {
            resetVis(d);
            DEFINITION_SHOWING = false;
            document.body.style.cursor = "default";
        })
        .on('click', function(d) {
          DEFINITION_SHOWING = true;
          scrolltoView(d);
          var textWithDefinition = addDefinition(TOOLTIP_TEXT);
            drawTooltipDiv(div, textWithDefinition, textWithDefinition.length, Math.min(textWithDefinition.length, 20));
          pulse(d);
        })
        .style("fill", colorFinderSun);

  d3.select(self.frameElement).style("height", height + "px");

}

/****************************** HELPER FUNCTIONS ******************************/


function addDefinition(text) {
  return text + DEFINITION_EXAMPLE;
}

/* Function that provides the color based on the node.
    @param d: the node in the data heirarchy
    @return : a d3.rgb object that defines the color of the arc
*/

function colorFinderSun(d) {
    if (d.data.children) {
        if (d.data.data['Credibility Indicator Name'] == "Reasoning") {
               return d3.rgb(239, 117, 89);
            } else if (d.data.data['Credibility Indicator Name'] == "Evidence") {
               return d3.rgb(87, 193, 174);
            } else if (d.data.data['Credibility Indicator Name'] == "Probability") {
                return d3.rgb(118, 188, 226);
            } else if (d.data.data['Credibility Indicator Name'] == "Language") {
               return d3.rgb(75, 95, 178);
            } else if (d.data.data['Credibility Indicator Name'] == "Holistic"){
                return d3.rgb(255, 180, 0);
            } else if (d.data.data['Credibility Indicator Name'] == "Sourcing") {
                return d3.rgb(201, 87, 198)
            } else {
              return d3.rgb(255, 255, 255);
            }
        }   else {
            if (d.data.size > 0) {
                return d3.rgb(172,172,172);
            }
            if (d.parent.data.data['Credibility Indicator Name'] == "Reasoning") {
                return d3.rgb(239, 117, 89);
            } else if (d.parent.data.data['Credibility Indicator Name'] == "Evidence") {
                return d3.rgb(87, 193, 174);
            } else if (d.parent.data.data['Credibility Indicator Name'] == "Probability") {
                return d3.rgb(118, 188, 226);
            } else if (d.parent.data.data['Credibility Indicator Name'] == "Language") {
                return d3.rgb(75, 95, 178);
            } else if (d.parent.data.data['Credibility Indicator Name'] == "Holistic" ){
                return d3.rgb(255, 180, 0);
            } else if (d.parent.data.data['Credibility Indicator Name'] == "Sourcing") {
              return d3.rgb(201, 87, 198);
            } else {
              return d3.rgb(255, 255, 255);
            }
        }
  }


/* Function that resets the visualization after the mouse has been moved
   away from the sunburst. It resets the text score to the original
   article score and resets the colors to their original.
   @param d : the node in the data heirarchy
   @return : none
*/
function resetVis(d) {
  // theresa start
    normalSun(d);
    d3.selectAll("path")
        .transition()
        .delay(300)
        .duration(800)
        .attr('stroke-width',2)
        .style("opacity", function(d) {
            if (d) {
                if (d.height == 1) {
                    } else {
                        return 0;
                    }
            } else {
            }
        })
    d3.selectAll("path")
        .transition()
        .delay(1000)
        .attr('stroke-width',2)
        .style("display", function(d) {
          if (d) {
              if (d.children) {
              } else {
                  return "none";
              }
          } else {
          }
        })
    DIV.transition()
            .delay(200)
            .duration(600)
            .style("opacity", 0);
    var total = parseFloat(scoreSum(d));

    var center_style = getCenterStyle(NUM_NFC);
    var text_x = center_style[0];
    var text_y = center_style[1];
    var text_size = center_style[2];
    var question_x = center_style[3];
    var question_y = center_style[4];
    var question_size = center_style[5]
    var double_question = center_style[6];


    SVG.selectAll(".center-text").style('display', 'none');
    SVG.selectAll(".center-question").style('display', 'none');
    SVG.append("text")
        .attr("class", "center-text")
        .attr("x", text_x)
        .attr("y", text_y)
        .style("font-size", text_size)
        .style("text-anchor", "middle")
        .html((totalScore));

    if (double_question) {
      SVG.append("text")
          .attr("class", "center-question")
          .attr("x", question_x)
          .attr("y", question_y)
          .style("font-size", question_size)
          .html("??")
    } else {
      SVG.append("text")
          .attr("class", "center-question")
          .attr("x", question_x)
          .attr("y", question_y)
          .style("font-size", question_size)
          .html("?")
    }


    visualizationOn = false;
}

/*Function that draws the visualization based on what is being hovered over.
    @param d : the node in the data heirarchy that I am hovering over
    @param root : the root of the data heirarchy
    @param me : the path that I am hovering over.
    @return : none
*/
function drawVis(d, root, me, div) {
    if (d.height == 2) {
        resetVis(d);
        return;
    }
    d3.selectAll("path")
        .transition()
        .style("opacity", function(d) {
            return .5
            }
        );
    if (d.children) {
        var node;
        for (node of d.children) {
            var path = nodeToPath.get(node);
            d3.select(path)
                .transition()
                .style("display", "block")
                .style("opacity", 0.5)
                .duration(100)
        }
    } else {
        var child;
        for (child of d.parent.children) {
            var path = nodeToPath.get(child);
            path.style.opacity = .5;
        }
    }

    d3.select(me)
        .transition()
        .duration(300)
        .attr('stroke-width', 5)
        .style("opacity", 1)

    if (d.height == 0) {
        d3.select(nodeToPath.get(d.parent))
            .transition()
            .duration(300)
            .attr('stroke-width', 5)
            .style("opacity", 1)
    } if (d.height == 0) {
        let textToHighlight = document.getElementsByName(d.data.data["Credibility Indicator ID"] +"-" + d.data.data["Credibility Indicator Name"] + "-" + d.data.data.Start + "-" + d.data.data.End);

        if (d.data.data.Start == -1) {
          console.log("This fallacy does not have a highlight in the article body.");
        } else {
            highlightSun(textToHighlight[0]);
        }
    } else if (d.height == 2) {
        d3.select(me).style('display', 'none');
    } else if (d.height == 1) {
        d3.select(nodeToPath.get(d.parent)).style('display', 'none');
    }
    TOOLTIP_TEXT =  d.data.data['Credibility Indicator Name'];
    var words = TOOLTIP_TEXT.split(" ");
    var longest = words.sort(
      function (a, b) {
        return b.length - a.length;
      }
    )[0];
    var max_width = Math.max(longest.length, 20);
    var words_len = TOOLTIP_TEXT.length;
    var start_index = d.data.data.Start;
    var end_index = d.data.data.End;
    var category = d.data.data["Credibility Indicator Category"]
    if (start_index == -1 || end_index == -1) {
      if (category == "Holistic") {
        TOOLTIP_TEXT = TOOLTIP_TEXT + "<br><i>(Throughout article)</i></span>";
        words_len += "(Throughout article)".length;
      } else {
        TOOLTIP_TEXT = TOOLTIP_TEXT + "<br><i>(No highlight in text)</i></span>";
        words_len += "(No highlight in text)".length;
      }
    } else {
      TOOLTIP_TEXT += "</span>";
    }

    drawTooltipDiv(div, TOOLTIP_TEXT, words_len, max_width);
    // div.transition()
    //   .duration(200)
    //   .style("opacity", .9);
    // div.html("<span style='display: inline-block; vertical-align:middle; line-height:normal;'>" + tooltip_text)
    //   .style("left", (d3.event.pageX) + "px")
    //   .style("top", (d3.event.pageY) + "px")
    //   .style("width", function() {
    //     if (words_len < 20) {
    //       return words_len.toString() + "ch";
    //     }
    //     return max_width.toString() + "ch";
    //   }).style("min-height", function() {
    //     return "1ch";
    //   }).style("height", function() {
    //     return "fit-content";
    //   });

    var pointsGained = scoreSum(d);
    SVG.selectAll(".center-text").style('display', 'none');
    SVG.selectAll(".center-question").style('display', 'none');
    if (d.data.data["Credibility Indicator Name"] == "Waiting for fact-checkers") {
      pointsGained = "?";
    } else if (d.data.data["Credibility Indicator Name"] == "Evidence") {
      var child;
      var allFactCheck = true;
      for (child of d.children) {

        if (child.data.data["Credibility Indicator Name"] != "Waiting for fact-checkers") {
          allFactCheck = false;
        }
      }
      if (allFactCheck) {
        pointsGained = "?";
      }
    }
    SVG.append("text")
      .attr("class", "center-text")
      .attr("x", 0)
      .attr("y", 13)
      .style("font-size", 40)
      .style("text-anchor", "middle")
      .html((pointsGained));

}


function drawTooltipDiv(div, text, words_len, max_width) {
  div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("<span style='display: inline-block; vertical-align:middle; line-height:normal;'>" + text)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px")
      .style("width", function() {
        if (words_len < 20) {
          return words_len.toString() + "ch";
        }
        console.log(max_width)
        return max_width.toString() + "ch";
      }).style("min-height", function() {
        return "1ch";
      }).style("height", function() {
        return "fit-content";
      });
}

/*
Recursive function that returns a number that represents the total score of the given arc.
For the center, we simply return the score of the article (100 plus the collected points).
    @param d = the node of the hierarchy.
    @return : the cumulative score of a certain path.
              These are the points lost. The
              scoreSum(root) of an article with no
              points lost would be 0.
*/
function scoreSum(d) {
    if (d.depth == 2) {
        if (d.data.data["Credibility Indicator Name"] == "Waiting for fact-checkers") {
          return 0;
        } 
        if (isNaN(d.data.data.Points)) {
          console.log("one of our values is NaN. We are returning zero for now.");
          return 0;
        }
        return Math.round(parseFloat(d.data.data.Points));
    } else {
        var sum = 0;
        for (var i = 0; i < d.children.length; i++) {
            sum += Math.round(parseFloat(scoreSum(d.children[i])));
        }
        if (d.height == 2) {
            articleScore = parseFloat(sum);
            return Math.round(articleScore);
        }
        return sum;
    }
}

// theresa start
function scrolltoView(x) {
    if (x.height == 0) {
        let textToView = document.getElementsByName(x.data.data["Credibility Indicator ID"] + '-' + x.data.data["Credibility Indicator Name"] + '-' + x.data.data.Start + '-' + x.data.data.End);
        textToView[0].scrollIntoView({behavior: "smooth", block:"center"});
    }
}

function pulse(x) {
  x = x.data.data;
  //console.log(x);

  var name = x["Credibility Indicator ID"] +"-"+ x["Credibility Indicator Name"] + '-'+ x["Start"] +"-"+ x["End"]
  //console.log(name);
  var value = $("[name='" + name+"']");
  value.animate("margin:100px");
}


function highlightSun(x) {
  var color = x.style.borderBottomColor;      // grab color of border underline in rgb form
  var color = color.match(/\d+/g);                      // split rgb into r, g, b, components
  var cred_id = x.getAttribute("cred_id");

  $("span[cred_id='"+cred_id+"']").each(function() {
    this.style.setProperty("background-color", "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + "0.25");
    this.style.setProperty("background-clip", "content-box");
  });
  // x.style.setProperty("background-color", "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + "0.25");
  // x.style.setProperty("background-clip", "content-box");
}

function normalSun() {
    var allSpans = document.getElementsByTagName('span');
    for (var i = 0; i < allSpans.length; i++) {
      allSpans[i].style.setProperty("background-color", "transparent");
    }
}


// Returns
//    [score_x, score_y, score_size, question_x, question_y, question_size]
function getCenterStyle(num_nfc) {
  switch(num_nfc) {
    case 0:
      return [0, 13, 40, 0, 0, 0, false]
    case 1:
      return [-1, 13, 33, 17, -5, 19, false]
    case 2:
      return [-3, 13, 25, 11, -0, 30, false]
    case 3:
      return [-9.5, 17, 20, 0, 5, 39, false]
    case 4:
      return [-8, 14, 14, -4, 7.5, 48, false]
    case 5:
      return [-23, 26, 13, -19, 20, 56, true]
    default:
      return [-5, 13, 14, 0, 0, 37]
  }
}
//theresa end
