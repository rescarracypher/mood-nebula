 // $(document).ready(function() {
"use strict";
$(function() {
    // let user;
    let user_id;
	  const today = moment().format('MM/DD/YYYY');
    const missionArray = ["Meditate","Yoga","Exercise","Sleep","Eat_Well"
    ,"Socialize","Gratitude","Write","Volunteer","Water","Vegetables","Read"
    ,"Dance","Breathe","Creativity"]

    const congratulations = ["Wohoo, great job",
    ]

    cleanView()



  // navbar dropdown
  $(".dropdown-button").dropdown();

  // instructional feature discovery
  // $('.tap-target').tapTarget('open');
  $(".instruction").click(function() {
    if ($('.tap-target').tapTarget('open')){
      $('.tap-target').tapTarget('close');
    }
    else {$('.tap-target').tapTarget('open');}
  });



// authentification request to databases
  $.get("/api/user_data")
  .then(function(data) {
    // user = data.username
    user_id = data.id

    // Request sent to server to retrieve user's active missions from database.
    $.get("/api/active_missions", {
      user_id: user_id
    })
    .then(function(data) {
      let activeMissions = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].Mission_id){
          activeMissions.push(data[i].Mission_id)
        }
      }
        markActiveMissions(data,activeMissions);
    });

    // Request sent to server to retrieve user's missions submitted today.
    $.get("/api/missions_by_day", {
      user_id: user_id,
      mission_date: today
    })
    .then(function(data) {
      let todaysMissions = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].Mission_id){
          todaysMissions.push(data[i].Mission_id)
        }
      }
        markSubmittedMissions(data,todaysMissions);
    });
  });



  // GLOBAL VARIABLES + KEY FUNCTIONS
  // ===============================================

  // Setting today's date

	 // when any mood is selected in mood picker this section initiates api request to register items into database
   $(document).on("click", ".icon-btn", function() {
     event.preventDefault();
     const missionID = $(this).attr("data-mission")
     const missionResult = $(this).attr("data-state");
     const buttonState = $(this).attr("button-state");

     const id = "#"+missionID
     if (buttonState=='active') {
      $(id).find(".join").addClass("hidden")
      $(id).find(".missionQuestion").addClass("hidden")
      $(id).find(".missionInput").addClass("hidden")
      $(id).find(".icon-btn").attr("button-state","inactive")

     } else if (missionResult=="inactive") {
      $(id).find(".icon-btn").attr("button-state","active")
      $(id).find(".join").removeClass("hidden")

     } else if (missionResult=="active") {
      $(id).find(".icon-btn").attr("button-state","active")
      $(id).find(".missionQuestion").removeClass("hidden")
      $(id).find(".missionInput").removeClass("hidden")
     }
   });






   $(document).on("click", ".btn-join", function() {
     event.preventDefault();
     const mission_id = $(this).attr("data-mission")
     const activation_date = today;

     const userData = {
       mission_id: mission_id,
       activation_date: activation_date,
     };

     ActivateMission(user_id,userData.mission_id, userData.activation_date)

     const id = "#"+mission_id
     $(id).find(".joined").removeClass("hidden")
     $(id).find(".join").addClass("hidden")
     $(id).find(".icon-btn").attr("data-state","active")
     $(id).find(".icon-btn").attr("button-state","inactive")

     const $toastContent = $('<span> You added ' + mission_id + ' to your mission list!</span>');
     Materialize.toast($toastContent, 10000);
   });










   $(document).on("click", ".completed", function() {
     event.preventDefault();
     const mission_id = $(this).attr("data-mission")
     const mission_result = "Completed"
     const mission_date = today;

     const userData = {
       mission_id: mission_id,
       mission_result: mission_result,
       mission_date: mission_date,
     };

     logDailyMission(user_id,userData.mission_id,userData.mission_result, userData.mission_date)

     const id = "#"+mission_id
     $(id).find(".missionQuestion").text("Submitted...")
     $(id).find(".missionInput").text("")

     const $toastContent = $('<span> Yay, mission completed. Great job!</span>');
     Materialize.toast($toastContent, 10000);
   });



   $(document).on("click", ".not-completed", function() {
     event.preventDefault();
     const mission_id = $(this).attr("data-mission")
     const mission_result = "Not completed"
     const mission_date = today;

     const userData = {
       mission_id: mission_id,
       mission_result: mission_result,
       mission_date: mission_date,
     };

     logDailyMission(user_id,userData.mission_id,userData.mission_result, userData.mission_date)

     const id = "#"+mission_id
     $(id).find(".missionQuestion").text("Submitted...")
     $(id).find(".missionInput").text("")

     const $toastContent = $('<span> Hey, at least you tried! </span>');
     Materialize.toast($toastContent, 10000);
   });



   $(document).on("click", ".unfollow", function() {
     event.preventDefault();
     const mission_id = $(this).attr("data-mission")
     const mission_date = today;

     const userData = {
       mission_id: mission_id,
       mission_date: mission_date
     };

     unfollowMission(user_id,userData.mission_id)

      const id = "#"+mission_id
      $(id).find(".icon-btn").attr("data-state","inactive")
      $(id).find(".joined").addClass("hidden")
      $(id).find(".join").removeClass("hidden")
      $(id).find(".missionQuestion").addClass("hidden")
      $(id).find(".missionInput").addClass("hidden")

     const $toastContent = $('<span> Yeah I hated that mission too. </span>');
     Materialize.toast($toastContent, 10000);
   });



	// function that posts data into database.
  function logDailyMission(user_id, mission_id, mission_result, mission_date) {
    $.post("/api/missions", {
      user_id: user_id,
      mission_id: mission_id,
      mission_result: mission_result,
      mission_date: mission_date
    })
    .then(function() {
      console.log("logged")
      // If there's an error, log the error
    })
    .catch(function(err) {
      console.log(err);
    });
  }



  function ActivateMission(user_id, mission_id, activation_date) {
    $.post("/api/active_missions", {
      user_id: user_id,
      mission_id: mission_id,
      activation_date: activation_date
    })
    .then(function() {
      console.log("logged")
      // If there's an error, log the error
    })
    .catch(function(err) {
      console.log(err);
    });
  };

  function unfollowMission(user_id, mission_id) {
    $.post("/api/active_mission_remove", {
      user_id: user_id,
      mission_id: mission_id
    })
    .then(function() {
      console.log("unfollowed")
      // If there's an error, log the error
    })
    .catch(function(err) {
      console.log(err);
    });
  };



	function markActiveMissions(data, activeMissions){
    for (var i = 0; i < missionArray.length; i++) {
      const id = "#"+missionArray[i]
      if ($.inArray(missionArray[i],activeMissions)>-1) {
        $(id).find(".joined").removeClass("hidden")
        $(id).find(".icon-btn").attr("data-state","active")
      } else {
        $(id).find(".joined").addClass("hidden")
      }
    }
  }


  function markSubmittedMissions (data, todaysMissions) {
    for (var i = 0; i < missionArray.length; i++) {
      const id = "#"+missionArray[i]
      if ($.inArray(missionArray[i],todaysMissions)>-1) {
        $(id).find(".missionQuestion").text("Already submitted...")
        $(id).find(".missionInput").text("")
      }
    }
  }
	// add code to push to active missions row on missions.html!
	// also add functionality to be able to remove missions if desired!

    function cleanView(){
      for (var i = 0; i < missionArray.length; i++) {
        const id = "#"+missionArray[i]
        $(id).find(".joined").addClass("hidden")
        $(id).find(".join").addClass("hidden")
        $(id).find(".icon-btn").attr("data-state","inactive")
        $(id).find(".icon-btn").attr("button-state","inactive")
        $(id).find(".missionQuestion").addClass("hidden")
        $(id).find(".missionInput").addClass("hidden")
      }
    }

    function seedMissions(){
      logDailyMission(user_id,"Meditate","Completed", "02/12/2018")

    // const missionArray = ["Meditate","Yoga","Exercise","Sleep","Eat_Well"
    // ,"Socialize","Gratitude","Write","Volunteer","Water","Vegetables","Read"
    // ,"Dance","Breathe","Creativity"]
    }


}); // closure
