---
---


//test

console.log("index.js");


$( document ).ready(function() {

  $("#aboutCollapse").on("hide.bs.collapse", function(){
    // $("#about-intro").toggleClass("text-md");
  });
  $("#aboutCollapse").on("show.bs.collapse", function(){
    // $("#about-intro").toggleClass("text-md");
  });



  // var c = 0;
  // setInterval(function () {
  //     var colors = ['blue', 'green', 'red', 'olive', 'yellow']
  //     if (c > colors.length - 1) c = 0;
  //     $("body").animate({
  //         backgroundColor: colors[c++]
  //     },
  //     {
  //         duration: 2000,
  //         easing: "linear"
  //     });
  // }, 2000);


  // console.log( "ready!" );
  const phrases = [
    'work',
    'work'
  ]

  const els = document.querySelectorAll('.work');
  console.log("els: ",els);
  for (var i = 0; i < els.length; i++) {
    const el = els[i];
    const fx = new TextScramble(el);

    let counter = 0
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        var t = Math.floor(Math.random() * 1500) + 500;
        // console.log("t: " ,t);
        setTimeout(next, t);
        // setTimeout(function(){
        //   window.location.href = "https://www.icplab.org/issue_01.html";
        // }, 1200);
      })
      counter = (counter + 1) % phrases.length;
    }
    setTimeout(next, 2000);
  }

  // const el = document.querySelector('.work');

});
