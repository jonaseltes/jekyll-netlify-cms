---
---


//test

console.log("lab.js");
var typeform_url = "//anothertomorrow.typeform.com/to/O8tDRQ";
var typeform_test_url = "//anothertomorrow.typeform.com/to/z0csjE";
var typeform_backup_url = "//anothertomorrow.typeform.com/to/KZdKRX";
var url = typeform_url;
var results_url = "//script.google.com/macros/s/AKfycbxlBl7BgohEt_v90BbBnfXgJtyoo87RtHQMj2XRJ2SiTeelad49/exec"
// var results_url = "//script.google.com/macros/s/AKfycbw5FNVzbGUgSHOM6rIral3Y6xJnIvU9pyy5o14ld3f_liRdFOs/exec?jsonp=?";

url = typeform_test_url;
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


function getHighlightFromArray(answersArray){
  // LOOP THORUGH SORTED ARRAY TO GET MOST COMMON ANSWERS
  // console.log("Gettign highlights from answersArray: " ,answersArray[6]);
  // CREATE HIGHLIGHTS OBJECT TO STORE MOST COMMON ANSWERS
  var highlights = {
    work: {

    },
    learn: {

    },
    rest: {

    }
  };

  // LOOP THROUGH ANSWER COLUMNS
  for (var j = 0; j < answersArray.length; j++) {

    // VARIABLE FOR ANSWER COLUMN
    var answerColumn = answersArray[j];
    // console.log("Column "+j+":" ,answerColumn);
    var mf = 0;
    var m = 0;
    // VARIABLE FOR ANSWER
    var item;

    //LOOP TO EXTRACT MOST COMMON DATA IN ANSWER COLUMN
    for (var k=0; k<answerColumn.length; k++){
      for (var l=0; l<answerColumn.length; l++)
      {
              if (answerColumn[k] == answerColumn[l])
               m++;
              if (mf<m)
              {
                mf=m;
                item = answerColumn[k];
              }
      }
      m=0;
    }

    // FORMAT DATA FOR VISUALISATION
    switch (j) {
      case 0:
        var slots = 0;
        switch (item) {
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
        // console.log("learn item is: " ,item);
        highlights.learn.answer = item;
        highlights.learn.change = slots;
        highlights.learn.quantity = mf;
        break;
      case 2:
        var slots = 1;
        switch (item) {
          case "Every year":
            slots = 1;
            break;
          case "Every 2 years":
            slots = 2;
            break;
          case "Every 3 years":
            slots = 3;
            break;
          case "Every 4 years":
            slots = 4;
            break;
          case "Every 5 years":
            slots = 5;
            break;
          case "Every 7 years":
            slots = 7;
            break;
          case "Every 10 years":
            slots = 10;
            break;
          case "Every 15 years":
            slots = 15;
            break;
          case "I'd stay more than 15 years in one place":
            slots = 20;
            break;
          case "I'd stay at one workplace as long as possible":
            slots = 0;
            break;
        }
        // console.log("work item is: " ,item);
        highlights.work.answer = item;
        highlights.work.change = slots;
        highlights.work.quantity = mf;
        break;
      case 4:
        switch (item) {
          case "After reaching a certain age I leave my job/stop working, and remain retired":
            break;
          case "After reaching a certain age I leave my formal employment, but continue working in other ways at my own pace (monetizing hobbies, gig jobs, start something new etc)":
            // SOME FUNCTIONALLY TO SHOW BLEND OF WORK AND RETIREMNT
            break;
          case "I take my share of retirement years and spread them out, taking breaks at regular intervals through life, even if it means I continue working late into life":
            break;
          case "I split my share of retirement years in two and have a significant break in the middle of life, even if it means I continue working until a later age":
            break;
          case "I want to work forever. Can I donate my retirement years to someone else?":
            break;
        }
        // console.log("rest answer: " ,item);
        highlights.rest.answer = item;
        highlights.rest.quantity = mf;
        break;
    }
  }
  // console.log("highlight: " ,highlights);
  return highlights;
}

function newArrayContainer (length) {
  // ARRAY FOR STORING RESULTS BY COLUMN
  var arrayContainer = [];
  for (var i = 0; i < length; i++) {
    // CREATE A CHILD ARRAY FOR EACH COLUMN
    arrayContainer[i] = [];
  }
  return arrayContainer;
}

function getHighlightsAge(results){
  console.log("getHighlightsAge from results: " ,results);

  // OBJECT TO STORE AGE SECTIONS
  var ageObject = {

  }

  // LOOP THRUGH ALL RESULTS
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    // CHECK RESULT AGE
    var age = result[6];
    // console.log("age: " ,age);
    // CHECK IF AGE ALREADY EXISTS IN OBJECT
    if (!ageObject.hasOwnProperty(age)) {
      // IF NOT CREATE A NEW OBJECT TO STORE AGE DATA
      ageObject[age] = {
        data: {
          raw: []
        }
      }
      // CREATE A NEW ARRAY FOR STORING ANSWERS BY COLUMN
      ageObject[age].data.sorted = newArrayContainer(results[0].length);
      // console.log("ageObject[age]: " ,ageObject[age]);
    }
    else {
      // console.log("Age " +age+ " already exists: " ,ageObject[age]);
    }
    // LOOP THRUGH RESULT AND ADD EACH COLUMN TO THE SORTED ARRAY WITH THE GIVEN AGE
    ageObject[age].data.raw.push(result);
    for (var j = 0; j < result.length; j++) {
      ageObject[age].data.sorted[j].push(result[j]);
    }
  }

  // LOOP THORUGH AGE SECTIONS
  for (var item in ageObject){
    // GET NUMBER OF ENTRIES WITHIN AGE GROUP
    ageObject[item].entries = ageObject[item].data.sorted[0].length;
    // GET HIGHLIGHTS FROM AGE GROUP
    var highlights = getHighlightFromArray(ageObject[item].data.sorted);
    ageObject[item].highlights = highlights;
  }
  return ageObject;
  // console.log("ageObject: " ,ageObject);
}


function getHighlights(results){
  console.log("getHighlights from results: " ,results);

  // ARRAY FOR STORING RESULTS BY COLUMN
  var arrayContainer = [];
  // CREATE A CHILD ARRAY FOR EACH COLUMN
  for (var i = 0; i < results[0].length; i++) {
    arrayContainer[i] = [];
  }

  //OBJECT TO STORE THE HIGHLIGHTS
  // data_highlights = {
  //   total: results.length,
  //   data: {
  //     work: {
  //
  //     },
  //     learn: {
  //
  //     },
  //     rest: {
  //
  //     }
  //   }
  // }

  // LOOP THORUGH ALL RESULTS AND SORT COLUMNS INTO NEW ARRAYS
  for (var i = 0; i < results.length; i++) {
    var result = results[i]
    // ADD DATA INTO SORTED ARRAY
    for (var j = 0; j < result.length; j++) {
      arrayContainer[j].push(result[j]);
    }
    // LOOP THORUGH SORTED ARRAY TO GET MOST COMMON ANSWERS
    /*for (var j = 0; j < arrayContainer.length; j++) {
      var arr1 = arrayContainer[j];
      var mf = 1;
      var m = 0;
      var item;
      //LOOP TO EXTRACT MOST COMMON DATA
      for (var k=0; k<arr1.length; k++){
        for (var l=k; l<arr1.length; l++)
        {
                if (arr1[k] == arr1[l])
                 m++;
                if (mf<m)
                {
                  mf=m;
                  item = arr1[k];
                }
        }
        m=0;
      }

      // FORMAT DATA FOR VISUALISATION
      switch (j) {
        case 0:
          var slots = 0;
          switch (item) {
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
          data_highlights.data.learn.answer = item;
          data_highlights.data.learn.change = slots;
          data_highlights.data.learn.quantity = mf;
          break;
        case 2:
          var slots = 1;
          switch (item) {
            case "Every year":
              slots = 1;
              break;
            case "Every 2 years":
              slots = 2;
              break;
            case "Every 3 years":
              slots = 3;
              break;
            case "Every 4 years":
              slots = 4;
              break;
            case "Every 5 years":
              slots = 5;
              break;
            case "Every 7 years":
              slots = 7;
              break;
            case "Every 10 years":
              slots = 10;
              break;
            case "Every 15 years":
              slots = 15;
              break;
            case "I'd stay more than 15 years in one place":
              slots = 20;
              break;
            case "I'd stay at one workplace as long as possible":
              slots = 0;
              break;
          }
          data_highlights.data.work.answer = item;
          data_highlights.data.work.change = slots;
          data_highlights.data.work.quantity = mf;
          break;
        case 4:
          switch (item) {
            case "After reaching a certain age I leave my job/stop working, and remain retired":
              break;
            case "After reaching a certain age I leave my formal employment, but continue working in other ways at my own pace (monetizing hobbies, gig jobs, start something new etc)":
              // SOME FUNCTIONALLY TO SHOW BLEND OF WORK AND RETIREMNT
              break;
            case "I take my share of retirement years and spread them out, taking breaks at regular intervals through life, even if it means I continue working late into life":
              break;
            case "I split my share of retirement years in two and have a significant break in the middle of life, even if it means I continue working until a later age":
              break;
            case "I want to work forever. Can I donate my retirement years to someone else?":
              break;
          }
          data_highlights.data.rest.answer = item;
          data_highlights.data.rest.quantity = mf;
          break;
      }
    }*/

  }
  var highlights = {}
  highlights.data = {
    raw: results,
    sorted: arrayContainer
  }
  highlights.highlights = getHighlightFromArray(arrayContainer);

  highlights.entries = results.length;
  return highlights;
  // console.log("highlights unfiltered: " ,highlights);
  // console.log("arrayContainer: " ,arrayContainer);
}


function getAvarage (results) {
  var avarage = newJourney({
    prefilled: false
  });
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    avarage.total += result.total;
    avarage.data.base.years += result.data.base.years;
    avarage.data.base.slots += result.data.base.slots;
    avarage.data.default.years += result.data.default.years;
    avarage.data.default.slots += result.data.default.slots;
    avarage.data.learn.years += result.data.learn.years;
    avarage.data.learn.slots += result.data.learn.slots;
    avarage.data.work.years += result.data.work.years;
    avarage.data.work.slots += result.data.work.slots;
    avarage.data.rest.years += result.data.rest.years;
    avarage.data.rest.slots += result.data.rest.slots;
  }

  // console.log("avarage before dividing: " ,avarage);

  avarage.total = avarage.total / results.length;
  avarage.data.base.slots = avarage.data.base.slots / results.length;
  avarage.data.base.years = avarage.data.base.years / results.length;
  avarage.data.default.slots = avarage.data.default.slots / results.length;
  avarage.data.default.years = avarage.data.default.years / results.length;

  avarage.data.learn.years = avarage.data.learn.years / results.length;
  avarage.data.learn.slots = avarage.data.learn.slots / results.length;
  avarage.data.work.years = avarage.data.work.years / results.length;
  avarage.data.work.slots = avarage.data.work.slots / results.length;
  avarage.data.rest.years = avarage.data.rest.years / results.length;
  avarage.data.rest.slots = avarage.data.rest.slots / results.length;

  // console.log("avarge: " ,avarage);
  return avarage;
  // loadLabVisuals(avarage, startRender);
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
      data: {
        base: {
          label: "base",
          years: 6,
          slots: 1
        },
        default: {
          label: "default",
          years: 15,
          slots: 1
        },
        learn: {
          label: "learn",
          years: 0,
          slots: 0
        },
        work: {
          label: "work",
          years: 45,
          slots: 1
        },
        rest: {
          label: "rest",
          years: 16,
          slots: 1
        }
      }
    };
  }

  else {
    defaultJourney = {
      total: 0,
      data: {
        base: {
          label: "base",
          years: 0,
          slots: 0
        },
        default: {
          label: "default",
          years: 0,
          slots: 0
        },
        learn: {
          label: "learn",
          years: 0,
          slots: 0
        },
        work: {
          label: "work",
          years: 0,
          slots: 0
        },
        rest: {
          label: "rest",
          years: 0,
          slots: 0
        }
      }
    }
  }
  return defaultJourney;
}

function parseResult (result) {
  // console.log("Parsing result: " ,result);
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
        journey.data.learn.years += slots * slot_years;
        journey.data.learn.slots += slots;
        journey.data.work.years -= (slots * slot_years) / 2;
        journey.data.rest.years -= (slots * slot_years) / 2;
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
            divisor = journey.data.work.years/2;
            break;
          case "I'd stay at one workplace as long as possible":
            divisor = journey.data.work.years;
            break;
        }
        journey.data.work.slots = journey.data.work.years / divisor;
        break;
      case 4:
        switch (string) {
          case "After reaching a certain age I leave my job/stop working, and remain retired":
            break;
          case "After reaching a certain age I leave my formal employment, but continue working in other ways at my own pace (monetizing hobbies, gig jobs, start something new etc)":
            // SOME FUNCTIONALLY TO SHOW BLEND OF WORK AND RETIREMNT
            break;
          case "I take my share of retirement years and spread them out, taking breaks at regular intervals through life, even if it means I continue working late into life":
            journey.data.rest.slots += 4;
            break;
          case "I split my share of retirement years in two and have a significant break in the middle of life, even if it means I continue working until a later age":
            journey.data.rest.slots += 2;
            break;
          case "I want to work forever. Can I donate my retirement years to someone else?":
            journey.data.rest.slots = 0;
            journey.data.work.years += journey.data.rest.years;
            journey.data.rest.years = 0;
            break;
        }
        break;
    }
  }
  // console.log("journey: " ,journey);

  return journey;
}

function getResults(all){

    $("#lab-introduction").hide();
    $("#lab-info-container").html("Loading...");
   $.ajax({
      url: results_url,
      // dataType: 'jsonp',
      success: function(data) {
        $("#lab-info-container").fadeOut(function(){
          $("#results-info-container").fadeIn();
          $(".results-info-container-second").fadeIn();
        });
        var jsonData = JSON.parse(data);
        jsonData.shift(); // Remove header row form results
        console.log("results before filtering: " ,jsonData);
        console.log("results length before filtering: " ,jsonData.length);

        var filtered = jsonData.filter(function (el) {
          return el[0] != "";
        });
        console.log("filtered: ",filtered);

        var highlights_unfiltered = getHighlights(filtered);
        var highlights_age = getHighlightsAge(filtered);
        highlights_age.all = highlights_unfiltered;
        console.log("highlights_unfiltered: ",highlights_unfiltered);
        console.log("highlights_age: ",highlights_age);
        data_highlights = highlights_age;
        console.log("data_highlights: " ,data_highlights);


        var results = [];
        for (var i = 0; i < filtered.length; i++) {
          var result = parseResult(filtered[i]);
          results.push(result);
        }
        console.log("results after filtering: " ,results);
        console.log("results length after filtering: " ,results.length);

        {% capture my_include %}{% include /lab/filter.html %}{% endcapture %}
        $("#results-info-first").html('{{ my_include | strip_newlines }}');
        var ageArray = [];
        for (var item in data_highlights){
          if (item != "all") {
            ageArray.push(item)
          }
          data_highlights[item].data.parsed = [];
          for (var i = 0; i < data_highlights[item].data.raw.length; i++) {
            var result = parseResult(data_highlights[item].data.raw[i]);
            data_highlights[item].data.parsed.push(result);
          }
          data_highlights[item].data.avarage = getAvarage(data_highlights[item].data.parsed);
        }
        ageArray.sort();
        console.log("ageArray: " ,ageArray);
        $("#filter-select").append('<option class="text-uppercase">'+ capitalizeFirstLetter("all")+'</option>');
        for (var i = 0; i < ageArray.length; i++) {
          $("#filter-select").append('<option class="text-uppercase">'+ capitalizeFirstLetter(ageArray[i])+'</option>');
        }
        // $("filter-select")


        $('#filter-select').change(function(){
          console.log("labWrapper.children: " ,labWrapper.children);
          var group = $(this).val().toLowerCase();
          console.log("Changed group: " ,group);
          for (var i = 0; i < labWrapper.children.length; i++) {
            var avarage = data_highlights[group].data.avarage.data[labWrapper.children[i].name];
            var s = avarage.years;
            var p = avarage.slots;
            setBlobProprties(labWrapper.children[i], s, p);
            labWrapper.children[i].userData.years = avarage.years;
            labWrapper.children[i].userData.slots = avarage.slots;
            labWrapper.children[i].material.opacity = 1.0;
          }
          if (typeof intersects !== "undefined") {
            clickedBlob(intersects);
          }
        });

        if (all) {
          filter = true;
          // for (var item in highlights_age){
          //   if (item != "all") {
          //     ageArray.push(item);
          //   }
          // }

          $("#results-info-second").text("Click one of the blobs to explore insights and trends within each category:");
          initiLabMode("lab", data_highlights.all.data.avarage, loadLabVisuals);
        }

        else {
          filter = false;
          var latestResult = results[results.length - 1];
          initiLabMode("lab", latestResult, loadLabVisuals);
          // $("#results-info-first").text("");
          $("#results-info-second").html("<div><p>Thank you for contributing to our research!</p><p>Click one of the blobs to explore how your ideal future of work compares to the rest of the results:</p>");
        }

      },
      error: function (err) {
        console.log("error: " ,err.responseText);
      }
  });
}


$( document ).ready(function() {
  // newTypeform();
  $("#results-info-container").hide();
  $(".results-info-container-second").hide();
  console.log("animation_mode: " ,animation_mode);
  var popup2 = window.typeformEmbed.makePopup(url, {
    hideHeaders: true,
    hideFooter: true,
    onSubmit: function () {
      console.log('Typeform successfully submitted');
      popup2.close();
      setTimeout(function(){
        getResults(false);
      }, 2000);
    }
  });
  // popup2.open()
  $("iframe").attr("scrolling","yes");
  //
  // setTimeout(function(){
  //   embedElement.close()
  //  }, 10000) // NOTE: In this code, the typeform will automatically open, then automatically close 10 seconds later


  $("#bt-popup").click(function(){
    {% if jekyll.environment == "development" %}
      getResults(false);
    {% else %}
      popup2.open();
    {% endif %}
  });


});
