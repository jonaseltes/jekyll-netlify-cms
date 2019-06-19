---
---

var image;
var src;
var reader;
var OK = true;
var errormsg = "";

function parseImage(input) {
  console.log("input: " ,input.files[0]);

  reader.addEventListener("load", function (e) {
    console.log("FileReader e: ",e);
    const data = e.target.result.split(",");
    image = [data[0].match(/:(\w.+);/)[1], data[1]];
    // const image = data;
    console.log("image: " ,image)
    src = reader.result;
    var imageObject = new Image();
    imageObject.onload = function () {
        console.log("image dimensions: "+this.width + " " + this.height);

        $("#upload-preview").html('<img id="" class="mt-3" src="'+src+'" height="200" alt="">');
        console.log("src: " ,src);
        this.value = src;


        // if (this.width >= 600) {
        //   $("#upload-preview").html('<img id="" class="mt-3" src="'+src+'" height="200" alt="">');
        //   console.log("src: " ,src);
        //   this.value = src;
        //   OK = true;
        // }
        // else {
        //   OK = true;
        //   $("#upload-preview").html('<p class="error">Image is too small ('+this.width+'px wide), needs to be at least 600px wide.');
        //   errormsg = "Form could not be submitted. Please check your Profile Picture.</p>";
        // }
    };
    console.log("this: " ,this);
    imageObject.src = src;
    // $("#upload-preview").attr("src",src);

  }, false);

  reader.readAsDataURL(input.files[0]);

}

$(function() {
  // The Javascript
  var id = {{site.data.application-form.form-id | jsonify}};
  var confirmation = {{site.data.application-form.submission | jsonify}};
  reader = new FileReader();

  if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = function (callback, thisArg) {
          thisArg = thisArg || window;
          for (var i = 0; i < this.length; i++) {
              callback.call(thisArg, this[i], i, this);
          }
      };
  }



  console.log("id: " ,id);
  var form = document.getElementById(id);
  console.log("form: " ,form);
  var url = "https://script.google.com/macros/s/AKfycbxiwmQg7mCBecU2IKhaN3bDHs2PaD70-zP19hMZyqnhiWl3cw/exec";
  {% if jekyll.environment == "development" %}
    url = "https://script.google.com/macros/s/AKfycbwXvhNxU0PEUwSqfuyiWHFQYEO_gvjNIZELalBjkHtIYYa_zFuG/exec";
  {% endif %}
  console.log("url: " ,url);

  form.onsubmit = function(e) {
    e.preventDefault();
    if (OK) {
      window.formData = new FormData(form);
      window.object = {};
      formData.forEach(function(value, key){
          if (key === "image") {
            console.log("Found image: " ,value);
            formData.set(key, src);
            value = image;
            // value = src;
          }
          if (typeof value === 'undefined' || value.length == 0) {
            value = "Not specified";
          }
          object[key] = value;
          console.log("value: " ,value);
      });
      console.log("object: " ,object);
      window.json = JSON.stringify(object)
      console.log("json: " ,json);

      $('#application-form-wrapper').fadeOut(500, function(){
        $('#application-form-wrapper').removeClass("text-left").html('<p">Sending form data...</p>').fadeIn(500);
      });

      $.ajax({
          url: url,
          type: "post",
          cache: false,
          // crossDomain: true,
          data: JSON.stringify(object),
          // contentType: "application/json; charset=utf-8",
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
    }

    else {
      $("#form-error").html("<p>"+errormsg+"</p>");
    }

  }


})
