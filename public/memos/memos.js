/*==================================================================*/
//	MEMOS
/*==================================================================*/

"use strict()";

$(function() {
	// Global Variables
	/*-------------------------------------------------- */
	let user_id;
	let username;
	var today = moment().format('MM/DD/YYYY');
	// Navbar Dropdown
	/*-------------------------------------------------- */
	$(".dropdown-button").dropdown();
	$(".button-collapse").sideNav();

	// Collapse Memo Collection
	/*-------------------------------------------------- */
	$('.collapsible').collapsible();
	$('.memoList').collapsible('open', 0);


//	OPERATIONS
/*==================================================================*/
	
	//  GET  <- request user ID from DB
	//--------------------------------------------------
	$.get("/api/user_data").then(function(data) {
		user_id = data.id;
		username = data.username;
		console.log(username);
		
		// GET  <- request user memos from DB
		//--------------------------------------------------
		$.get("/api/memos", {
			user_id: user_id
		}).then(function(data) {
			viewActiveMemos(data);
		});
	});
	
	// Submit Memo
	//--------------------------------------------------
	$(document).on("click", "#submit-memo", function() {
		// when a user submits the memo api request initiated to register memo into DB
		event.preventDefault();
		var memo_text = $('.memo').val();
		var memo_date = today;
		var userData = {
			memo_text: memo_text,
			memo_date: memo_date,
		};
		// after data is captured, api request is submitted via logDailyMemos function
		logDailyMemos(user_id, userData.memo_text, userData.memo_date);
		location.reload();
	});
	
	// POST -> memos to DB 
	//--------------------------------------------------
	function logDailyMemos(user_id, memo_text, memo_date) {
		$.post("/api/memos", {
			user_id: user_id,
			memo_text: memo_text,
			memo_date: memo_date
		}).then(function() {
			window.location.replace(data);
			// If there's an error, log the error
		}).catch(function(err) {
			console.log(err);
		});
	}
	
	// Render memos in collapsible component
	//--------------------------------------------------
	function viewActiveMemos(data) {
		console.log(data);
		/* console.log(memoDates);*/

		// refer to <ul> element in html .memoList
		// add class collapsible popout
		var memoList = $(".memoList").addClass('collapsible popout');
		for (var j = 0; j < data.length; j++) {
			
			var memoListItems = $("<li>").attr('list-id', data[j].id).addClass('memoListItems indigo lighten-4 z-depth-5');

				var memoDateToShow = $('<div class="collapsible-header"><h6 class="memoDate">').html(moment(data[j].Memo_Date,
					"YYYY-MM-DD").format("dddd, MMMM Do YYYY"));
				var memoTextToShow = $('<div class="collapsible-body"><span class="memoText">').html(data[j].Memo_Text);
			
				// append date and memo text to list item (<li>)		
				memoListItems.append(memoDateToShow, memoTextToShow);
			// append each <li> to <ul> 
			memoList.prepend(memoListItems);
		}
	}

}); // onready closure
