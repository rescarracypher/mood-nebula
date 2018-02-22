'use strict'

$(function(){

  var options = [
      // {selector: '#image-tests', offset: 50, callback: function(el) {
      // Materialize.fadeInImage($(el), 1000);
      // } },
        {selector: '#meditations', offset: 50, callback: function(el) {
          Materialize.showStaggeredList($(el), 2000);
        } }
      ];
      Materialize.scrollFire(options);
});
