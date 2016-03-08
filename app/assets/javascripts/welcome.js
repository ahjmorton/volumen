(function($) {

   var earth = undefined;
   var roots = [];

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

   function createRoot(earth, clickX, clickY) {
       var earthPosition = earth.position();
       clickX = clickX - earthPosition.left;
       clickY = clickY - earthPosition.top;
       var topValue = (clickY / earth.height()) * 100;
       var leftValue = (clickX / earth.width()) * 100;
       var root = $('<div>')
           .attr('class', 'root')
           .css('top', topValue + '%')
           .css('left', leftValue + '%')
       var plant = $('<div />')
           .attr('class', 'plant')
       var text = $('<p>Hello</p>')
           .attr('class', 'word'); 
       plant.append(text);
       root.append(plant);
       earth.append(root);
       return root;
   }

   $(document).ready(function() {
       setInterval(function() {
          roots.forEach(function(root) {
              root.step();
          });
       }, 100);

       $('.earth').click(function(e) {
           if(!earth) {
               earth = $(e.target);
           }
           var root = createRoot(earth, e.clientX, e.clientY);
           root = rotatable(root, -90, 15).init();
           roots.push(root);
       });
   });
})(jQuery)
