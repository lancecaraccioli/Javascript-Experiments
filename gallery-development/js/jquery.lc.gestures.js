(function($) {
	
	$.fn.gesture = function(settings){
		settings = $.extend({},$.fn.gesture.defaults,settings);
		var me = $(this);
		
		me.data('state', {
			active:false,
			current:{x:0, y:0},
			previous:{x:0, y:0},
			gestureChain:[],
			bound:[]
		});
		me.each(function(){
			for (key in settings.handlers){
				$.fn.gesture.bind.call($(this), key, settings.handlers[key]);
			}
			
		});
		me.mousedown(function(event){
			var me = $(this);//local singular element... the context of $(this) has changed inside this function
			var state = me.data('state');
			state.active = true;
			state.previous.x = event.clientX;
			state.previous.y = event.clientY;
			me.data('state',state);

		});
		me.mousemove(function(event) {
			var me = $(this);
			if(me.data('state').active){
				$.fn.gesture.step.call(me, event);
			}
		});
		me.mouseup(function(event) {
			var me = $(this);
			var state = me.data('state');
			if (state.active){
				$.fn.gesture.exec.call(me);
				state.active=false;
				me.data('state', state);
			}
		});			
		return (me);
	};
	handlers=[];
	$.fn.gesture.defaults = {
		handlers:handlers
	};
	
	$.fn.gesture.bind=function(eventName, fn){
		var me = $(this);
		var state = me.data('state');
		if ((typeof fn)=='function'){
			state.bound[eventName]=fn;
		}
		me.data('state', state);
		return(me);
	};
	$.fn.gesture.step=function(event){
		var me = $(this);
		var state = me.data('state');
		state.current.x = event.clientX;
		state.current.y = event.clientY;

		var mv = $.fn.gesture.getLastMove.call(me);
		if (mv != null) {
			if (state.gestureChain[state.gestureChain.length-1] != mv) {
				state.gestureChain.push(mv);
			}
			state.previous.x=event.clientX;
			state.previous.y=event.clientY;
		}
		me.data('state', state);
		return (me);
		
	};
	$.fn.gesture.getLastMove=function(){
		var me = $(this);
		var state = me.data('state');

		var diff = {
			x:state.current.x-state.previous.x,
			y:state.current.y-state.previous.y
		};
		var mv = null;
		if (Math.abs(diff.x) > Math.abs(diff.y)) {
			if (diff.x <= -10){mv = 'L';}
			else if (diff.x >= 10){mv = 'R';}
		} else {
			if (diff.y <= -10){mv = 'U';}
			else if (diff.y >= 10){mv = 'D';}
		}
		return mv;
	};
	$.fn.gesture.doGesture=function(){
		var me = $(this);
		var state = me.data('state');
		if (state.gestureChain.length) {
			fn = state.bound[state.gestureChain.join('')];
			if (fn) {
				fn.call(me);
			}
			state.gestureChain = [];
			me.data('state', state);
		}
		return(me);
	}
	$.fn.gesture.exec=function(){
		var me = $(this);
		$.fn.gesture.doGesture.call(me);
		return(me);
	};
})(jQuery);

