'use strict';

(function($) {

   function getNewWord(callback) {
       callback("Hello");
   }

   function createBranch(element, resultCallback) {
      var branch = $('<div>')
           .addClass('branch waving')
           .css('left', '90%');
       getNewWord(function(word, error) {
          var text = $('<p>' + word + '</p>')
               .addClass('growing word'); 
          branch.append(text);
          resultCallback(branch);
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

   function constructWaving(startPosition, endPosition, duration) {
       var className = "waving-" + startPosition + "-" + endPosition + "-" + duration;
       console.log(className);
       var animationName = className + "-animation";
       var node = $('<style type="text/css"> .' + className + '{ animation-name: ' + animationName + '; animation-duration: ' + duration + 's;} @keyframes ' + animationName + ' { 0% { transform : rotate(' + startPosition + 'deg)} 100% { transform : rotate(' + endPosition + 'deg)}}</style>')
       return {
           className: className,
           node: node
       };
   }

   $(document).ready(function() {
       var earth = $('#earth');
       var head = $('head');      

       function addNewRoot(root, branch, grower) {
         var waving = constructWaving(-120, -60, 2);
         console.log(waving);
         head.append(waving.node);
         branch.addClass(waving.className);
         earth.append(root);
         /*grower.one('animationend', function(e) {
           var scaledSize = getScaledSize(grower);
           firstBranch
             .css("height", scaledSize.height)
             .css("width", scaledSize.width);
           createBranch(root, function(branch, error) {
             firstBranch.append(branch);
           });
         });*/
       }

       earth.click(function(e) {
           if($(e.target).is('#earth')) {
               createRoot(earth, e.clientX, e.clientY, addNewRoot) 
           }
       });
   });
})(jQuery)
