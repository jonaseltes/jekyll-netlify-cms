---
---

var image = "";
var src;
var reader;

function parseImage(input) {
  image = window.URL.createObjectURL(input.files[0]);
  console.log("image: " ,image);

  reader.addEventListener("load", function () {
    src = reader.result;
    $("#upload-preview").attr("src",src);
    console.log("src: " ,src);
    this.value = src;
    console.log("this: " ,this);
  }, false);

  reader.readAsDataURL(input.files[0]);

}

$(function() {
  // The Javascript
  var id = {{site.data.application-form.form-id | jsonify}};
  var confirmation = {{site.data.application-form.submission | jsonify}};
  reader  = new FileReader();

  console.log("id: " ,id);
  var form = document.getElementById(id);
  console.log("form: " ,form);
  form.onsubmit = function() {
    var formData = new FormData(form);
    var object = {};
    formData.forEach(function(value, key){
        if (typeof value === 'file' || value instanceof File ) {
          console.log("Found image: " ,value);
          value = src;
        }
        object[key] = value;
        console.log("value: " ,value);
    });
    console.log("object: " ,object)
    // formData.append('file', file);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', form.getAttribute('action'), true);
    xhr.send(formData);
    form.reset();
    $('#application-form-wrapper').fadeOut(500, function(){
      $('#application-form-wrapper').html('<p class="text-xl">'+confirmation+'</p>').fadeIn(500);

    });
    return false; // To avoid actual submission of the form
  }
})
