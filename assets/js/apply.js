---
---
$(function() {
  // The Javascript
  var id = {{site.data.application-form.form-id | jsonify}};
  console.log("id: " ,id);
  var form = document.getElementById(id);
  console.log("form: " ,form);
  form.onsubmit = function() {
    var formData = new FormData(form);

    // formData.append('file', file);

    var xhr = new XMLHttpRequest();
    // Add any event handlers here...
    xhr.open('POST', form.getAttribute('action'), true);
    xhr.send(formData);

    return false; // To avoid actual submission of the form
  }
})
