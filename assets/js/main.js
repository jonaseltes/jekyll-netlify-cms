---
---
{% if jekyll.environment == "production" %}
  console.log = function() {}
{% endif %}

console.log("main.js");

$( document ).ready(function() {
    // console.log( "ready!" );
    const phrases = [
      'work',
      'influencers',
      'work',
      'work',
      'AIs',
      'work',
      'work',
      'sustainability'
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
      counter = (counter + 1) % phrases.length
    }

    setTimeout(next, 2500)
});
