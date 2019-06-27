---
---


//test

console.log("hackathon.js");


$( document ).ready(function() {


  $("#hackathonCollapse").on("hide.bs.collapse", function(){
    $("#hackathonCollapseButton").html('Read more +');
    // $("#aboutCollapseButton").hide();
  });
  $("#hackathonCollapse").on("show.bs.collapse", function(){
    $("#hackathonCollapseButton").html('Read more –');
  });

  var par = $(".collapse-paragraphs").parent();
  $(".collapse-paragraphs").children(":first").detach().prependTo(par);


});
