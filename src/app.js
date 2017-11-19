'use strict';

import {WordManager, load as loadWords} from './word_manager.js';

export default async function start($, document) {

   let wordManager = new WordManager(["still", "loading"]);
   loadWords("latin").then(newWordManager => {
     wordManager = newWordManager;
   });

   async function createBranch() {
      var branch = $('<div>')
           .addClass('branch waving')
           .css('left', '90%');
      const word = await wordManager.getNewWord();
      var text = $('<p>' + word + '</p>')
           .addClass('growing word'); 
      branch.append(text);
      return {
        branch : branch,
        text: text
      };
   }

   async function createRoot(earth, clickX, clickY) {
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

       const word = await wordManager.getNewWord();
       var text = $('<p>' + word + '</p>')
               .addClass('word growing'); 
       branch.append(text);
       root.append(branch);
       return {
         root: root,
         branch: branch,
         text: text
       }
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

   var animationManager = (function() {
     var cache = {};
     var head = undefined;

     function doDefineGrowing(className, initXScale, endXScale, initYScale, endYScale, duration) {
        var animationName = className + '-animation';

        var node = $('<style type="text/css"> .' + className + '{ animation-name: ' + animationName + '; animation-duration: ' + duration + 's;} @keyframes ' + animationName + ' { 0% { transform : scale(' + initYScale + ',' + initXScale + ')} 100% { transform : scale(' + endYScale + ',' + endXScale + ')}}</style>');
        return node;
     }

     function doDefineWaving(className, startPosition, endPosition, duration) {
       var animationName = className + '-animation';
       var node = $('<style type="text/css"> .' + className + '{ animation-name: ' + animationName + '; animation-duration: ' + duration + 's;} @keyframes ' + animationName + ' { 0% { transform : rotate(' + startPosition + 'deg)} 100% { transform : rotate(' + endPosition + 'deg)}}</style>')
       return node;
     }

     function getOrUpdateFromCache(className, builder) {
        if(!cache.hasOwnProperty(className)) {
           var node = builder(className)
           cache[className] = node;
           head.append(node);
         }
         return className;
     }

     function forCss(word) {
        return word.toString().replace(/\./g, '-');
     }

     return {
       init : function() {
         head = $('head');
       },
       addWavingFor : function(startPosition, endPosition, duration) {
         var className = forCss("waving-" + startPosition + "-" + endPosition + "-" + duration);
         return getOrUpdateFromCache(className, function(className) {
           return doDefineWaving(className, startPosition, endPosition, duration);
         });
       },
       addGrowingFor : function(startX, endX, startY, endY, duration) {
         var className = forCss("growing-" + forCss(startX) + "-" + endX + "-" + startY + "-" + endY + "-" + duration);
         return getOrUpdateFromCache(className, function(className) {
           return doDefineGrowing(className, startX, endX, startY, endY, duration);
         });
       }
     }
   }());
    
   $(document).ready(function() {
       const MAX_HEIGHT = 4;
       const MAX_WAVE_DURATION = 7;
       const MIN_WAVE_DURATION = 2;
       const WAVE_DURATION = MAX_WAVE_DURATION - MIN_WAVE_DURATION;
       const ROOT_MIN_ANGLE = -130;
       const ROOT_MAX_ANGLE = -65;
       const WAVE_RADIUS = Math.abs(ROOT_MIN_ANGLE - ROOT_MAX_ANGLE);
       const MAX_WAVE = WAVE_RADIUS / 2;
       const WAVE_STEP = MAX_HEIGHT / MAX_WAVE;
       
       function waveParameters(base, scaling) {
          scaling = scaling || 0;
          var scaledWave = MAX_WAVE - (scaling * WAVE_STEP);
          var leftWave = base - Math.floor((Math.random() * scaledWave));
          var rightWave = base + Math.floor((Math.random() * scaledWave));
          var duration = Math.floor(MIN_WAVE_DURATION + (WAVE_DURATION * Math.random()));
          return {
             start : leftWave,
             end : rightWave,
             duration : duration
          };
       } 

       var earth = $('#earth');
       animationManager.init();

       function growPlant(branch, grower, recursion) {
          grower.one('animationend', async (e) => {
            let {height, width, duration} = getScaledSize(grower);
            branch
              .css("height", height)
              .css("width", width);
            const {branch: newBranch, text: newGrower} = await createBranch();
            var wParameters = waveParameters(0, recursion);
            var wavingClass = animationManager.addWavingFor(wParameters.start, wParameters.end, wParameters.duration);
            newBranch.addClass(wavingClass);

            var growingClass = animationManager.addGrowingFor(0.10, 2.25, 0.10, 1.25, 2);
            newGrower.addClass(growingClass);

            branch.append(newBranch);
            if(recursion < MAX_HEIGHT) {
               growPlant(newBranch, newGrower, recursion + 1);
            }
          });
       }

       function addNewRoot(root, branch, grower) {
         var wParameters = waveParameters(-90);
         var wavingClass = animationManager.addWavingFor(wParameters.start, wParameters.end, wParameters.duration);
         branch.addClass(wavingClass);
         
         var growingClass = animationManager.addGrowingFor(0.10, 2.25, 0.10, 1.25, 2);
         grower.addClass(growingClass);

         earth.append(root);
         growPlant(branch, grower, 1);
       }

       earth.click(async (e) => { 
           if($(e.target).is('#earth')) {
               const {root, branch, text} = await createRoot(earth, e.clientX, e.clientY ) 
               addNewRoot(root, branch,text);
           }
       });
   });
}
