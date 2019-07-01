---
---


console.log("main.js");

console.log("jekyll.environment:" ,{{jekyll.environment | jsonify}});

function init() {
  $("#footer").detach().appendTo('.page-content-container').fadeIn();

}

$(window).scroll(function() {
// 100 = The point you would like to fade the nav in.

	if ($(window).scrollTop() > 100){
 		$('.header-wrapper').removeClass('bg-none');
  } else {
    if (!$('.header-wrapper').hasClass("bg-none")) {
      $('.header-wrapper').addClass('bg-none');
    }
 	};
});

$( document ).ready(function() {
  console.log("main.js ready!");
  $('.page-content-container').fadeIn();
  $('.navbar-toggler').click(function(){
    if ($(window).scrollTop() < 100){
      $('.header-wrapper').toggleClass('bg-none');
    }
  })
});

init();
