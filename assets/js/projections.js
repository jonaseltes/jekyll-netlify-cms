$( document ).ready(function() {
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
});
