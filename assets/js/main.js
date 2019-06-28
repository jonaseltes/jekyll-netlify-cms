---
---


console.log("main.js");

console.log("jekyll.environment:" ,{{jekyll.environment | jsonify}});

function init() {
  $("#footer").detach().appendTo('.page-content-container').fadeIn();

}

$( document ).ready(function() {
  console.log("main.js ready!");
  $('.page-content-container').fadeIn();
});

init();
