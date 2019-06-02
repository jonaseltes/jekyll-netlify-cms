---
---

var image = "";

function parseImage(files) {
  image = window.URL.createObjectURL(files[0]);
  console.log("image: " ,image);
}

$(function() {
  // The Javascript
  var id = {{site.data.application-form.form-id | jsonify}};


  console.log("id: " ,id);
  var form = document.getElementById(id);
  console.log("form: " ,form);
  form.onsubmit = function() {
    var formData = new FormData(form);
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    console.log("object: " ,object)
    // formData.append('file', file);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', form.getAttribute('action'), true);
    xhr.send(formData);
    form.reset();
    $('#application-form-wrapper').fadeOut(500, function(){
      $('#application-form-wrapper').html('<p class="text-xl">Thank you!</p>').fadeIn(500);

    });
    return false; // To avoid actual submission of the form
  }
})
