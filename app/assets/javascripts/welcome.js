(function($) {

   var earth = undefined;

   function getNewWord(callback) {
       callback("Hello");
   }

   var activityManager = (function() {
       var elements = [];

       function doUpdate() {
           elements.forEach(function(element) {
               element.step();
           });
       }

       return {
          init : function() {
              setInterval(doUpdate, 100);
          },
          addActivity : function(activity) {
              activity.init();
              elements.push(activity);
          }
       };
   })();

   function rotatable(element, initial, stepAmount) {
      var goingRight = true;
      var current = initial;
      var rightMost = initial + stepAmount;
      var leftMost = initial - stepAmount;
      var result = {};

      function setRotation(rotation) {
          var rotateStr = 'rotate(' + rotation  + 'deg)';
          element.css('-ms-transform', rotateStr)
                 .css('-webkit-transform', rotateStr)
                 .css('transform', rotateStr);
          current = rotation;
      }

      function nextStep() {
          if(goingRight) {
              var nextStep = current + 1;
              if(nextStep >= rightMost) {
                 goingRight = false;
                 return current;
              } else {
                 return nextStep;
              }
          } else {
              var nextStep = current - 1;
              if(nextStep <= leftMost) {
                 goingRight = true;
                 return current;
              } else {
                 return nextStep;
              }
          }
      }

      result.init = function() {
          setRotation(initial);
          return result;
      }
      result.step = function() {
          setRotation(nextStep());
          return result;
      }
      return result;
   }

   function createRoot(earth, clickX, clickY, resultCallback) {
       var earthPosition = earth.position();
       clickX = clickX - earthPosition.left;
       clickY = clickY - earthPosition.top;
       var topValue = (clickY / earth.height()) * 100;
       var leftValue = (clickX / earth.width()) * 100;
       var root = $('<div>')
           .attr('class', 'plant')
           .css('top', topValue + '%')
           .css('left', leftValue + '%')
       getNewWord(function(word, error) {
          var text = $('<p>' + word + '</p>')
               .attr('class', 'word'); 
          root.append(text);
          resultCallback(root);
       });
   }

   $(document).ready(function() {
       activityManager.init();
       $('.earth').click(function(e) {
           if(!earth) {
               earth = $(e.target);
           }
           createRoot(earth, e.clientX, e.clientY, function(root) {
               earth.append(root);
               root = rotatable(root, -90, 15)
               activityManager.addActivity(root);
           });
       });
   });
})(jQuery)
