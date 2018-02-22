window.onload = function () {
    
  var pCircle = document.getElementsByClassName('pulser-wrap');
  console.log("pCircle is " + pCircle[0]);
  var pSelect = document.getElementById('s1');
  console.log("pSelect is " + pSelect);

  $('#s1').on('input', function() { 
    var pDuration = $(this).val() + "s";
    $("#pWrap").css("animation-duration", pDuration);
  });
    
};
