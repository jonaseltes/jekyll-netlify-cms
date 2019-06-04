---
---

var image;
var src;
var reader;

function parseImage(input) {
  // image = window.URL.createObjectURL(input.files[0]);
  console.log("input: " ,input);
  console.log("image: " ,image);

  reader.addEventListener("load", function (e) {
    console.log("FileReader e: ",e);
    const data = e.target.result.split(",");
    image = [data[0].match(/:(\w.+);/)[1], data[1]];
    // const image = data;
    console.log("image: " ,image)
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
  var url = "https://script.google.com/macros/s/AKfycbwXvhNxU0PEUwSqfuyiWHFQYEO_gvjNIZELalBjkHtIYYa_zFuG/exec"
  var urlDev = "https://script.google.com/a/eltes.se/macros/s/AKfycby9LtcPXDd_OxgAhL-gREUYmCiDuIvs3OUNrgzDeS7P/dev"
  console.log("url: " ,url);
  console.log("urlDev: " ,urlDev);

  form.onsubmit = function(e) {
    e.preventDefault();
    var formData = new FormData(form);
    var object = {};
    formData.forEach(function(value, key){
        if (typeof value === 'file' || value instanceof File ) {
          console.log("Found image: " ,value);
          formData.set(key, src);
          value = image;
          // value = src;
        }
        object[key] = value;
        console.log("value: " ,value);
    });
    console.log("object: " ,object);
    var json = JSON.stringify(object)
    console.log("json: " ,json);
    //
    // var serializedData = $("form").serialize();
    // console.log("serializedData:" ,serializedData);

    var testData = {name:"John Doe", role: "ceo"}


    // $.post(url, JSON.stringify(testData)).then(res => {
    //   console.log("res" ,res);
    // });
    //

    $('#application-form-wrapper').fadeOut(500, function(){
      $('#application-form-wrapper').removeClass("text-left").html('<p">Sending form data...</p>').fadeIn(500);
    });

    $.ajax({
        url: url,
        type: "post",
        // crossDomain: true,
        data: JSON.stringify(object),
        // contentType: "application/json",
        success: function (msg)
                {
                  console.log("succes: " ,msg)
                  $('#application-form-wrapper').fadeOut(500, function(){
                    $('#application-form-wrapper').html('<p">'+confirmation+'</p>').fadeIn(500);
                  });
                },
        error: function (err)
        { console.log(err.responseText)}
    }).done(function (data, textStatus, xhr) {
        console.log(xhr.getResponseHeader('Link'));
        console.log("xhr: " ,xhr);
    });

    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', form.getAttribute('action'), true);
    // xhr.send(formData);
    // form.reset();
    // $('#application-form-wrapper').fadeOut(500, function(){
    //   $('#application-form-wrapper').html('<p class="text-xl">'+confirmation+'</p>').fadeIn(500);
    //
    // });
    // return false; // To avoid actual submission of the form
  }


})