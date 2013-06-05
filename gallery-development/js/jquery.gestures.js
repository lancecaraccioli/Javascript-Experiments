jQuery.gestures = {};
(function ($) {
  var canvas;
  
  var active = false;
  var recording=false;
  var previous = {x:0,y:0};
  var chain = [];

  var registered = [];
  var error = null;
  
  var color;

  function exec(chain) {
    if (chain.length) {
      fun = registered[chain.join('')];
      if (fun) {
        fun.call(this);
      } else {
        if (error) {
          error($.map(chain, function(e) {
                if (e=='U') return 'Up';
                if (e=='D') return 'Down';
                if (e=='L') return 'Left';
                if (e=='R') return 'Right';
              }).join(', '));
        }
      }
    }
  }

  function get_last_move (previous, cur) {
    var diff = {x:cur.x-previous.x, y : cur.y-previous.y};
    var mv = null;
    if (Math.abs(diff.x) > Math.abs(diff.y)) {
      if (diff.x <= -10) mv = 'L';
      if (diff.x >= 10)  mv = 'R';
    } else {
      if (diff.y <= -10) mv = 'U';
      if (diff.y >= 10)  mv = 'D';
    }
    return mv;
  }

  function drawline(previous,cur) {
    var context = document.getElementById('gestures_canvas').getContext('2d');
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(previous.x,previous.y);
    context.lineTo(cur.x,cur.y);
    context.closePath();
    context.stroke();
  }

  function setup() {
    if(active) {
      recording=false;
      chain=[];
      canvas.hide()
        .css({ position:'fixed', top:0, left:0, })
        .attr({ height: $(window).height(), width: $(window).width() })
        .show();
    }
  }

  $.gestures.init = function(ob) {
    ob = $.extend(ob, {active:false, color:'#FF0000'});
    color = ob.color;

    // add the canvas to the body element
    $('body').append('<canvas id="gestures_canvas"/>');
    canvas = $('#gestures_canvas');
    $(window).resize(setup);

    // capturing mouse gestures
    $('body').mousedown(function(e) {
        if (active) {
          recording=true;
          previous={x:e.clientX,y:e.clientY}
        }
      });
    $('body').mousemove(function(e) {
        if(active && recording) {
          var pos = {x:e.clientX,y:e.clientY};
          drawline(previous, pos);
          var mv = get_last_move(previous, pos);
          if (mv != null) {
            if (chain[chain.length-1] != mv) {
              chain.push(mv);
            }
          }
          previous={x:e.clientX,y:e.clientY}
        }
      });
    $('body').mouseup(function(e) {
        if(active && recording) {
          var c = chain;
          setup();
          exec(c);
        }
      });

    // setting the observer
    if (ob.active) $.gestures.enable();
    else $.gestures.disable();
  }
  $.gestures.register = function (gesture, fun) { registered[gesture.replace(/,/g, '')] = fun; }
  $.gestures.error = function (fun) { error = fun; }
  $.gestures.enable = function () { active = true; setup(); }
  $.gestures.disable = function () { active = false; $(canvas).hide(); }
  $.gestures.active = function () { return active; }
})(jQuery)
