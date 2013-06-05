/*!
 * Object definition testing (alternative to prototype?)
 *
 * 
 */
var LC_Class
(function(Class){
    Class = {
        name:'',
        setup:function(someData){
            this
        },
        //public functions
        dataAlert:function(data){
            show.call(this,data);
        },
        dataLog:function(data){
            log.call(this,data);
        }
    };
    //private functions
    function log(data){
        console.debug(data);
    }
    function show(data){
        alert(data);
    }
)(LC_CLASS);

obj1 = new LC_Class();
obj2 = new LC_Class();
