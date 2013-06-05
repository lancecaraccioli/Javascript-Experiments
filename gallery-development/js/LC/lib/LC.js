/*!
 * Credits: http://santrajan.blogspot.com/2008/10/what-john-resig-did-not-tell-you.html
 *
 * 
 */
var LC;
(function($){
    LC = {
        extend: function(bc, sc, o) {
            var f = function() {};
            f.prototype = sc.prototype;
            bc.prototype = new f();
            bc.prototype.constructor = bc;
            bc.superclass = sc.prototype;
            for (var m in o){
                bc.prototype[m] = o[m];
            }
        }
    };
})(jQuery);

