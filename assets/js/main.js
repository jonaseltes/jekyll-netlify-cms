---
---
{% if jekyll.environment == "production" %}
  console.log = function() {}
{% endif %}

//test

console.log("main.js");

$( document ).ready(function() {
  //
  // $('.slick').slick({
  //   accessibility: false,
  //   centerMode: true,
  //   dots: true,
  //   infinite: false,
  //   vertical: true,
  //   variableWidth: true
  // });


  // console.log( "ready!" );
  const phrases = [
    'Work',
    'Influencer',
    'Work',
    'Work',
    'AI',
    'Work',
    'Work',
    'Sustainability',
    'Work',
    'Economy',
    'Work',
    'Labour'
  ]

  const el = document.querySelector('#work');
  const fx = new TextScramble(el)

  let counter = 0
  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 1600);
      // setTimeout(function(){
      //   window.location.href = "https://www.icplab.org/issue_01.html";
      // }, 1200);
    })
    counter = (counter + 1) % phrases.length;
  }

  setTimeout(next, 2000);
});
