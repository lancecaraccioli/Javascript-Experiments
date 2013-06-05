/*!
 * Credits: http://santrajan.blogspot.com/2008/10/what-john-resig-did-not-tell-you.html
 *
 * 
 */
(function($){
    LC.Component = function() {
      LC.Component.superclass.init.apply(this, arguments);//applying jquery's init function to this object scope
    };
    LC.extend(LC.Component, $, {});
})(jQuery);
