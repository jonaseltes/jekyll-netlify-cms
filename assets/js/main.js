---
---


console.log("main.js");

console.log("jekyll.environment:" ,{{jekyll.environment | jsonify}});

function init() {
  console.log("main.js init");
  $("#footer").detach().appendTo('.page-content-container').fadeIn();

  // var paperCanvas = document.getElementById("paperCanvas");
  // var logoImg = document.getElementById("logo");
  // console.log("paperCanvas: " ,paperCanvas);
  // console.log("logoImg: " ,logoImg);
  // console.log("$(paperCanvas).width(): " ,$(paperCanvas).width());
  // console.log("$(paperCanvas).height(): " ,$(paperCanvas).width());
  // paperCanvas.width  = $(paperCanvas).width() * window.devicePixelRatio;
  // paperCanvas.height  = $(paperCanvas).height() * window.devicePixelRatio;
  // paperCanvas.style.width = ''+$(paperCanvas).width()+'px';
  // paperCanvas.style.height = ''+$(paperCanvas).height()+'px';
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
  });

  $(".collapse-wrapper").each(function(index){
    var collapse_id = 'collapse_' +index;
    var collapse = $(this).find(".collapse");
    $(collapse).attr('id', collapse_id);
    var toggle = $(this).find(".collapse-toggle");
    $(toggle).attr('href', '#'+collapse_id).attr('aria-controls', collapse_id);
    var button = $(this).find(".collapse-button");

    var par = $(collapse).parent();
    $(collapse).children(":first").detach().prependTo(par);

    var textClass = $(par).attr('text-size');

    $(collapse).on("hide.bs.collapse", function(){
      $(par).toggleClass(textClass);
      $(button).html('Read more +');
      // $("#aboutCollapseButton").hide();
    });

    $(collapse).on("show.bs.collapse", function(){
      $(par).toggleClass(textClass);
      $(button).html('Read less –');
    });
  });


  var paperCanvas = document.getElementById("paperCanvas");
  var logoImg = document.getElementById("logo");
  console.log("paperCanvas: " ,paperCanvas);
  console.log("logoImg: " ,logoImg);
  console.log("logoImg width: " ,$(logoImg).width());
  console.log("logoImg height: " ,$(logoImg).height());
  console.log("$(paperCanvas).width(): " ,$(paperCanvas).width());
  console.log("$(paperCanvas).height(): " ,$(paperCanvas).width());
  paperCanvas.width  = $(logoImg).width() * window.devicePixelRatio;
  paperCanvas.height  = $(logoImg).height() * window.devicePixelRatio;
  // paperCanvas.style.width = ''+$(logoImg).width()+'px';
  // paperCanvas.style.height = ''+$(logoImg).height()+'px';

  // resize();

});

function resize(){
  // var logoSize = document.getElementById("logo").getBoundingClientRect();
  // var paperCanvas = document.getElementById('paperCanvas');
  // paperCanvas.width = logoSize.width;
  // paperCanvas.height = logoSize.height;
  // console.log("logoSize: " ,logoSize);
}

$(window).on('resize', function(){
  // resize();
});

init();
