(function($) {

   var earth = undefined;

   function getNewWord(callback) {
       callback("Hello");
   }

   function createRoot(earth, clickX, clickY, resultCallback) {
       var earthPosition = earth.position();
       clickX = clickX - earthPosition.left;
       clickY = clickY - earthPosition.top;
       var topValue = (clickY / earth.height()) * 100;
       var leftValue = (clickX / earth.width()) * 100;
       var root = $('<div>')
           .addClass('plant')
           .css('top', topValue + '%')
           .css('left', leftValue + '%');
       var waving = $('<div>')
           .addClass('waving');
       var growing = $('<div>')
           .addClass('growing');
       getNewWord(function(word, error) {
          var text = $('<p>' + word + '</p>')
               .attr('class', 'word'); 
          growing.append(text);
          waving.append(growing);
          root.append(waving);
          resultCallback(root);
       });
   }

   $(document).ready(function() {
       $('.earth').click(function(e) {
           if(!earth) {
               earth = $(e.target);
           }
           createRoot(earth, e.clientX, e.clientY, function(root) {
               earth.append(root);
           });
       });
   });
})(jQuery)
