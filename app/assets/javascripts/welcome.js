'use strict';

(function($) {

   function getNewWord(callback) {
       callback("Macushla");
   }

   function createBranch(resultCallback) {
      var branch = $('<div>')
           .addClass('branch waving')
           .css('left', '90%');
       getNewWord(function(word, error) {
          var text = $('<p>' + word + '</p>')
               .addClass('growing word'); 
          branch.append(text);
          resultCallback(branch, text);
       });
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
       var branch = $('<div>')
           .addClass('branch waving');
       getNewWord(function(word, error) {
          var text = $('<p>' + word + '</p>')
               .addClass('word growing'); 
          branch.append(text);
          root.append(branch);
          resultCallback(root, branch, text);
       });
   }
 
   function getScaledSize(obj) {
      var matrix = obj.css("transform");
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var scaledWidth = obj.width() * values[0];
      var scaledHeight = obj.height() * values[3];
      return {
          height: scaledHeight,
          width: scaledWidth
      };
   }

   var wavingManager = (function() {
     var cache = {};
     var head = undefined;

     function doDefineNode(className, startPosition, endPosition, duration) {
       var animationName = className + "-animation";
       var node = $('<style type="text/css"> .' + className + '{ animation-name: ' + animationName + '; animation-duration: ' + duration + 's;} @keyframes ' + animationName + ' { 0% { transform : rotate(' + startPosition + 'deg)} 100% { transform : rotate(' + endPosition + 'deg)}}</style>')
       return node;
     }

     return {
       init : function() {
         head = $('head');
       },
       addStyleFor : function(startPosition, endPosition, duration) {
         var className = "waving-" + startPosition + "-" + endPosition + "-" + duration;
         if(!cache.hasOwnProperty(className)) {
           var node = doDefineNode(className, startPosition, endPosition, duration);
           cache[className] = node;
           head.append(node);
         }
         return className;
       }
     }
   }());
     
   $(document).ready(function() {
       var MAX_HEIGHT = 3;
       var earth = $('#earth');
       wavingManager.init();

       function growPlant(branch, grower, recursion) {
          grower.one('animationend', function(e) {
            var scaledSize = getScaledSize(grower);
            branch
              .css("height", scaledSize.height)
              .css("width", scaledSize.width);
            createBranch(function(newBranch, newGrower, error) {
              var className = wavingManager.addStyleFor(-30, 30, 2);
              newBranch.addClass(className);
              branch.append(newBranch);
              if(recursion < MAX_HEIGHT) {
                 growPlant(newBranch, newGrower, recursion + 1);
              }
            });
          });
       }

       function addNewRoot(root, branch, grower) {
         var className = wavingManager.addStyleFor(-120, -60, 2);
         branch.addClass(className);
         earth.append(root);
         growPlant(branch, grower, 0);
       }

       earth.click(function(e) {
           if($(e.target).is('#earth')) {
               createRoot(earth, e.clientX, e.clientY, addNewRoot) 
           }
       });
   });
})(jQuery)
