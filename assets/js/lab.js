---
---


//test

console.log("lab.js");
var typeform_url = "//anothertomorrow.typeform.com/to/O8tDRQ";
var typeform_test_url = "//anothertomorrow.typeform.com/to/p4X1am";
var url = typeform_url;
var results_url = "//script.google.com/macros/s/AKfycbxlBl7BgohEt_v90BbBnfXgJtyoo87RtHQMj2XRJ2SiTeelad49/exec"
// var results_url = "//script.google.com/macros/s/AKfycbw5FNVzbGUgSHOM6rIral3Y6xJnIvU9pyy5o14ld3f_liRdFOs/exec?jsonp=?";

{% if jekyll.environment == "development" %}
  url = typeform_test_url;
{% endif %}

function newTypeform(){
  window.embedElement = document.querySelector('.typoeform-container');
  typeformEmbed.makeWidget(
    embedElement,
    url, // NOTE: Replace with your typeform URL
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


var total_years = 82,
    base_years = 6,
    default_schooling = 15,
    education_years = 0,
    work_years = 45,
    retiremnt_years = 16;




function getAvarage (results) {
  var avarage = newJourney({
    prefilled: false
  });
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    avarage.total += result.total;
    avarage.base.years += result.base.years;
    avarage.base.slots += result.base.slots;
    avarage.default.years += result.default.years;
    avarage.default.slots += result.default.slots;
    avarage.learn.years += result.learn.years;
    avarage.learn.slots += result.learn.slots;
    avarage.work.years += result.work.years;
    avarage.work.slots += result.work.slots;
    avarage.rest.years += result.rest.years;
    avarage.rest.slots += result.rest.slots;
  }

  console.log("avarage before dividing: " ,avarage);

  avarage.total = avarage.total / results.length;
  avarage.base.slots = avarage.base.slots / results.length;
  avarage.base.years = avarage.base.years / results.length;
  avarage.default.slots = avarage.default.slots / results.length;
  avarage.default.years = avarage.default.years / results.length;

  avarage.learn.years = avarage.learn.years / results.length;
  avarage.learn.slots = avarage.learn.slots / results.length;
  avarage.work.years = avarage.work.years / results.length;
  avarage.work.slots = avarage.work.slots / results.length;
  avarage.rest.years = avarage.rest.years / results.length;
  avarage.rest.slots = avarage.rest.slots / results.length;

  console.log("avarge: " ,avarage);
}


function newJourney(options){
  // this.total: 82,
  // this.base: {
  //   years: 6,
  //   slots: 1
  // },
  // this.default: {
  //   years: 15,
  //   slots: 1
  // },
  // this.learn: {
  //   years: 0,
  //   slots: 0
  // },
  // this.work: {
  //   years: 45,
  //   slots: 1
  // },
  // this.rest: {
  //   years: 16,
  //   slots: 1
  // }

  var defaultJourney;

  if (options.prefilled) {
    defaultJourney = {
      total: 82,
      base: {
        years: 6,
        slots: 1
      },
      default: {
        years: 15,
        slots: 1
      },
      learn: {
        years: 0,
        slots: 0
      },
      work: {
        years: 45,
        slots: 1
      },
      rest: {
        years: 16,
        slots: 1
      }
    };
  }

  else {
    defaultJourney = {
      total: 0,
      base: {
        years: 0,
        slots: 0
      },
      default: {
        years: 0,
        slots: 0
      },
      learn: {
        years: 0,
        slots: 0
      },
      work: {
        years: 0,
        slots: 0
      },
      rest: {
        years: 0,
        slots: 0
      }
    }
  }
  return defaultJourney;
}

function parseResult (result) {
  console.log("Parsing result: " ,result);
  var journey = newJourney({
    prefilled: true
  });
  for (var i = 0; i < result.length; i++) {
    var string = result[i];
    switch (i) {
      case 0:
        var slots = 0;
        var slot_years = 2;
        switch (string) {
          case "Never":
            break;
          case "A few times":
            slots = 3;
            break;
          case "On a regular basis":
            slots = 6;
            break;
          case "As often as possible":
            slots = 9;
            break;
        }
        journey.learn.years += slots * slot_years;
        journey.learn.slots += slots;
        journey.work.years -= (slots * slot_years) / 2;
        journey.rest.years -= (slots * slot_years) / 2;
        break;
      case 2:
        var divisor;
        switch (string) {
          case "Every year":
            divisor = 1;
            break;
          case "Every 2 years":
            divisor = 2;
            break;
          case "Every 3 years":
            divisor = 3;
            break;
          case "Every 4 years":
            divisor = 4;
            break;
          case "Every 5 years":
            divisor = 5;
            break;
          case "Every 7 years":
            divisor = 7;
            break;
          case "Every 10 years":
            divisor = 10;
            break;
          case "Every 15 years":
            divisor = 15;
            break;
          case "I'd stay more than 15 years in one place":
            divisor = journey.work.years/2;
            break;
          case "I'd stay at one workplace as long as possible":
            divisor = journey.work.years;
            break;
        }
        journey.work.slots = journey.work.years / divisor;
        break;
      case 4:
        switch (string) {
          case "After reaching a certain age I leave my job/stop working, and remain retired":
            break;
          case "After reaching a certain age I leave my formal employment, but continue working in other ways at my own pace (monetizing hobbies, gig jobs, start something new etc)":
            // SOME FUNCTIONALLY TO SHOW BLEND OF WORK AND RETIREMNT
            break;
          case "I take my share of retirement years and spread them out, taking breaks at regular intervals through life, even if it means I continue working late into life":
            journey.rest.slots += 4;
            break;
          case "I split my share of retirement years in two and have a significant break in the middle of life, even if it means I continue working until a later age":
            journey.rest.slots += 2;
            break;
          case "I want to work forever. Can I donate my retirement years to someone else?":
            journey.rest.slots = 0;
            journey.work.years += journey.rest.years;
            journey.rest.years = 0;
            break;
        }
        break;
    }
  }
  // console.log("journey: " ,journey);
  return journey;
}

function getResults(){
   $.ajax({
      url: results_url,
      // dataType: 'jsonp',
      success: function(data) {
        var jsonData = JSON.parse(data);
        jsonData.shift(); // Remove header row form results
        console.log("results length: " ,jsonData.length);
        console.log("results: " ,jsonData);
        var results = [];
        for (var i = 0; i < jsonData.length; i++) {
          var result = parseResult(jsonData[i]);
          results.push(result);
          getAvarage(results);
        }
        console.log("results: " ,results);
      },
      error: function (err) {
        console.log("error: " ,err.responseText);
      }
  });
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
