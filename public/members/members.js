"use strict";
$(function() {
  // creating global variables that will be populated with authentification check
  let user;
  let user_id;
  let databaseDates = [];
  let uniqueDatabaseDates=[];
  let calendarDates=[];
  let emotion_dates = [];
  let missions = [];
  let memos = [];
  let emotions = []
  let todaySQL = moment().format('YYYY-MM-DD');
  const moodArray = ['Irritated', 'Energetic', 'Confident'
  , 'Couragious', 'Stressed', 'Anxious', 'Overwhelmed', 'Happy', 'Delighted', 'Fresh'
  , 'Content', 'Secure', 'Peaceful', 'Sad', 'Depressed', 'Gloomy', 'Guilty'
  , 'Envious', 'Jealous', 'Compassionate', 'Loving', 'Warm'
  , 'Frustrated', 'Angry'
  ]
  const positiveEmotion = [false,true,true,true,false,false,false,true,true,true
  ,false,true,true,false,false,false,false,false,false,true,true,true,false,false
  ]

// authentification request to database
  $.get("/api/user_data").then(function(data) {
    user = data.username
    user_id = data.id




    // request to server to get data from database.
    //Data that is returned contains all user mood entries.
    $.get("/api/emotions", {
      user_id: user_id
    })
    .then(function(data) {

      for (let i = 0; i <   data.length; i++) {
          emotion_dates.push(moment(data[i].Emotion_Date,"YYYY-MM-DD").format("M/D/YYYY"))
      }
      // after retrieving data calendar is generated dynamicaly with all user data. default calendar year is 2017
      createCalendar(data,emotion_dates);
      // after retrieving user data, system checks if user has a selection for today. if selection was made, system hides section that allows user to select again.
      if($.inArray(moment().format("M/D/YYYY"),emotion_dates)>-1) {

        $("#colorwheel").addClass("hidden")
      } else {
        createButtons()
        placeInCircle("btn-drop", "colorwheel", 140)
        placeInCircle("moodName", "colorwheel", 0)
      }

      emotions=data

      $.get("/api/memos", {
        user_id: user_id
      })
      .then(function(dataM) {
        memos=dataM


        $.get("/api/missions", {
          user_id: user_id
        })
        .then(function(dataI) {
          missions=dataI




          missions.forEach(function(item){
            databaseDates.push(item.Mission_Date)
          });


          memos.forEach(function(item){
            databaseDates.push(item.Memo_Date)
          });

          emotions.forEach(function(item){
            databaseDates.push(item.Emotion_Date)
          });


          uniqueDatabaseDates = getUnique(databaseDates)



          for (var i = 0; i < uniqueDatabaseDates.length; i++) {

          let formatedSelectorDate = moment(uniqueDatabaseDates[i],"YYYY-MM-DD").format("M/D/YYYY")


          let selector = "[data-date2='"+formatedSelectorDate+"']"

          let fEmotions = filterObjectsOnEmotionDate(emotions,uniqueDatabaseDates[i])
          let fMemos = filterObjectsOnMemoDate(memos,uniqueDatabaseDates[i])
          let fMissions = filterObjectsOnMissionDate(missions,uniqueDatabaseDates[i])

            for (let i = 0; i < fEmotions.length; i++) {
              if (fEmotions[i]){
                let currentEmotion =  $(selector).attr("mood")
                  if (currentEmotion) {
                    currentEmotion = currentEmotion + "<br><a class='x-small material-icons unfollow' style='color:"+fEmotions[i].Color +" ;'>brightness_1</a>" +fEmotions[i].Emotion
                    $(selector).attr("mood",currentEmotion)

                  } else {
                    currentEmotion = "<br><a class='x-small material-icons unfollow' style='color:"+fEmotions[i].Color +" ;'>brightness_1</a>" +fEmotions[i].Emotion
                    $(selector).attr("mood",currentEmotion)

                  }
                console.log("adding mood")
              }
            }


            for (let i = 0; i < fMemos.length; i++) {
              if (fMemos[i]){
                let currentMemo =  $(selector).attr("memo")
                if (currentMemo) {
                  currentMemo = currentMemo + "<br>" + fMemos[i].Memo_Text
                  $(selector).attr("memo",currentMemo)
                } else {
                  currentMemo = "<br>" + fMemos[i].Memo_Text
                  $(selector).attr("memo",currentMemo)
                }
              }
            }

            for (let i = 0; i < fMissions.length; i++) {
              if (fMissions[i]){
                let currentMission =  $(selector).attr("mission")
                if (currentMission) {
                  currentMission = currentMission + "<br><i class='material-icons'>star</i>" + fMissions[i].Mission_id + ": " + fMissions[i].Mission_Result
                  $(selector).attr("mission",currentMission)

                } else {
                  currentMission = "<br><i class='material-icons'>star</i>" + fMissions[i].Mission_id + ": " + fMissions[i].Mission_Result
                  $(selector).attr("mission",currentMission)
                }
              }
            }
          }






          addTooltip(calendarDates);






        });

      });

    });

  });






  function getUnique (originalArray) {
  let uniq = [...new Set(originalArray)];
  return uniq
  }


  function filterObjectsOnEmotionDate (obj_array,lookup) {
  var new_obj_array = obj_array.filter(function(obj) {
    if(lookup.indexOf(obj.Emotion_Date) === -1) {
      return false;
    }
      return true;
  });
  return new_obj_array
  }

  function filterObjectsOnMemoDate (obj_array,lookup) {
  var new_obj_array = obj_array.filter(function(obj) {
    if(lookup.indexOf(obj.Memo_Date) === -1) {
      return false;
    }
      return true;
  });
  return new_obj_array
  }

  function filterObjectsOnMissionDate (obj_array,lookup) {
  var new_obj_array = obj_array.filter(function(obj) {
    if(lookup.indexOf(obj.Mission_Date) === -1) {
      return false;
    }
      return true;
  });
  return new_obj_array
  }

// Creation of color wheel
// GLOBAL VARIABLES + KEY FUNCTIONS
// ===============================================

// Setting today's date
var today = moment().format('M/D/YYYY');
$(".today").text(today);
$('.dayIn[data-date2="' + today + '"]').addClass('active');
var moodIndex = 0


function createButtons() {
  for (var i = 0; i < 360; i += 15) {
    var drop = $("<button>")
    drop.addClass("btn-drop select")
    drop.attr("id", "d" + i)
    drop.addClass("combination"+i)
    drop.attr("date", moment().format("MM/DD/YY"))
    drop.css("background", "hsl(" + i + ", 100%, 50%)")
    drop.attr('mood-data', moodArray[moodIndex])
    drop.attr('positive-emotion', positiveEmotion[moodIndex])
    var moodName = $("<span>");
    // drop.addClass("moodName");
    moodName.addClass("moodName");
    moodName.addClass("combination"+i)
    moodName.css("color","hsl(" + i + ", 100%, 50%)");
    moodName.text(moodArray[moodIndex])
    $("#colorwheel").append(drop)
    $("#colorwheel").append(moodName)
    moodIndex++
  };
}


function placeInCircle(ItemClass, ItemLocation, radius) {
  var radius = radius;
  var fields = $('.' + ItemClass),
    container = $('#' + ItemLocation),
    width = container.width(),
    height = container.height();
  var angle = 0,
    step = (2 * Math.PI) / fields.length;
  fields.each(function() {
    var x = Math.round(width / 2 + radius * Math.cos(angle) - $(this).width() / 2);
    var y = Math.round(height / 2 + radius * Math.sin(angle) - $(this).height() / 2);
    if (window.console) {}
    $(this).css({
      left: x + 'px',
      top: y + 'px'
    });
    angle += step;
  });
}



/// this section converts rgb to hex value for database storage
var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
 }


 // when any mood is selected in mood picker this section initiates api request to register items into database
   $(document).on("click", ".select", function() {
     event.preventDefault();
     var emotion = $(this).attr("mood-data")
     var colorRGB =  $(this).css("background-color")
     var colorHEX = rgb2hex(colorRGB)
     var emotion_date = $(this).attr("date");
     var positive_emotion = $(this).attr("positive-emotion");

     var userData = {
       emotion: emotion,
       color: colorHEX,
       emotion_date: emotion_date,
       positive_emotion: positive_emotion
     };
 // after data is captured, api request is submitted via below function
    logDailyMood(user_id, userData.emotion, userData.color, userData.emotion_date, userData.positive_emotion);
    location.reload();
   });


// function that posts data into database.
  function logDailyMood(user_id, emotion, color, emotion_date, positive_emotion) {
    $.post("/api/emotions", {
      user_id: user_id,
      emotion: emotion,
      color: color,
      emotion_date: emotion_date,
      positive_emotion: positive_emotion
    })
    .then(function() {
      console.log("mood logged")
      // If there's an error, log the error
    })
    .catch(function(err) {
      console.log(err);
    });
  }






/* ==============================================================================
   CALENDAR SETUP – EST. DAYS / MONTH / YEAR
   ==============================================================================*/


  function createCalendar(data, emotion_dates) {

    const days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const monthsNum = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const moodGraph = document.getElementById('moodGraph');


    for (let i = 0; i < days.length; i++) {
        moodGraph.innerHTML = moodGraph.innerHTML + ('<div class="row cal-row" id="' + months[i] + '"><p>' + months[i].substr(0, 3) + '</p><div class="inner"></div></div>');

      // Append columns
      for (let h = 0; h < days[i]; h++) {
        const element = document.getElementById(months[i]).getElementsByClassName('inner')[0];
        let   calendarDate = (i + 1) + '/' + (h + 1) + '/' + 2020
        calendarDates.push(calendarDate)


        if ($.inArray(calendarDate,emotion_dates)>-1) {
          let emotion_index=($.inArray(calendarDate,emotion_dates))
          if (data[emotion_index].Positive_Emotion =="true") {
          element.innerHTML = element.innerHTML + ('<div class="day positive" style="background-color: '+data[emotion_index].Color+'" data-date2="' + calendarDate + '"></div>');
          } else {
          element.innerHTML = element.innerHTML + ('<div class="day negative" style="background-color: '+data[emotion_index].Color+'" data-date2="' + calendarDate + '"></div>');
          }
        } else {
          element.innerHTML = element.innerHTML + ('<div class="day" data-date2="' + calendarDate + '"></div>');
        }

      }
    }
  }





  function addTooltip(dates){
    for (let i = 0; i < dates.length; i++) {

      let selector = "[data-date2='"+dates[i]+"']"

      $(selector).addClass("tooltipped")
      $(selector).attr("data-html","true")
      $(selector).attr("data-position","bottom")
      $(selector).attr("data-delay","50")

      if (!$(selector).attr("memo")) {
        $(selector).attr("memo","<br>No Messages Saved")
      }

      if (!$(selector).attr("mood")) {
        $(selector).attr("mood","<br>No Emotions Saved")
      }

      if (!$(selector).attr("mission")) {
        $(selector).attr("mission","<br>No Missions Saved")
      }

      let dataTooltip = "<strong> Date: "+ dates[i] +"</strong><br>"
      +"<hr><strong> Memos:</strong>"           +$(selector).attr("memo")
      +"<hr><strong> Moods Recorded:</strong>"  +$(selector).attr("mood")
      +"<hr> <strong> Completed Missions:</strong>"+$(selector).attr("mission")
      +"</small>"

      $(selector).attr("data-tooltip",dataTooltip)
    }
    console.log($('.tooltipped'))
    $('.tooltipped').tooltip();
  }


});

