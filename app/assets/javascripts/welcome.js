(function($) {
 
   function createRoot(earthElement, clickX, clickY) {
       var earthPosition = earthElement.position();
       clickX = clickX - earthPosition.left;
       clickY = clickY - earthPosition.top;
       var topValue = (clickY / earthElement.height()) * 100;
       var leftValue = (clickX / earthElement.width()) * 100;
       var style = "top: " + topValue + "%;" + "left: " + leftValue + "%;";
       var element = $('<div class="root" style="' + style + '">');
       earthElement.append(element);
   }

   $(document).ready(function() {
       $('.earth').click(function(e) {
           var earth = $(e.target);
           createRoot(earth, e.clientX, e.clientY);
       });
   });
})(jQuery)
