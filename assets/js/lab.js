---
---


//test

console.log("lab.js");
var typeform_url = "//anothertomorrow.typeform.com/to/O8tDRQ";

function newTypeform(){
  window.embedElement = document.querySelector('.typoeform-container');
  typeformEmbed.makeWidget(
    embedElement,
    typeform_url, // NOTE: Replace with your typeform URL
    {
      hideHeaders: true,
      hideFooter: true,
      opacity: 0,
      buttonText: "Take the survey!",
      onSubmit: function (e) {
        console.log('Typeform successfully submitted');
        setTimeout(function(){
          $(embedElement).children().fadeOut();
        },1000)
      }
    }
  )
}


$( document ).ready(function() {
  newTypeform();

  // var popup2 = window.typeformEmbed.makePopup(typeform_url, {
  //   autoClose: 3000,
  //   hideHeaders: true,
  //   hideFooter: true,
  //   onSubmit: function () {
  //     console.log('Typeform successfully submitted');
  //   }
  // });
  // popup2.open()


  //
  // setTimeout(function(){
  //   embedElement.close()
  //  }, 10000) // NOTE: In this code, the typeform will automatically open, then automatically close 10 seconds later




  // $("#bt-popup").click(function(){
  //   popup2.open();
  // });


});
