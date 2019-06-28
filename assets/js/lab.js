---
---


//test

console.log("lab.js");
var typeform_url = "//anothertomorrow.typeform.com/to/O8tDRQ";

$( document ).ready(function() {
  const embedElement = document.querySelector('.typoeform-container');

  // var popup2 = window.typeformEmbed.makePopup(typeform_url, {
  //   autoClose: 3000,
  //   hideHeaders: true,
  //   hideFooter: true,
  //   onSubmit: function () {
  //     console.log('Typeform successfully submitted');
  //   }
  // });
  // popup2.open()



  typeformEmbed.makeWidget(
    embedElement,
    typeform_url, // NOTE: Replace with your typeform URL
    {
      hideHeaders: true,
      hideFooter: true,
      opacity: 0,
      buttonText: "Take the survey!",
      onSubmit: function () {
        console.log('Typeform successfully submitted')
      }
    }
  )



  // $("#bt-popup").click(function(){
  //   popup2.open();
  // });


});
