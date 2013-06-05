/*!
 * Object definition testing
 *
 * 
 */
var LC_Class
(function(){
    LC_Class = function(){};
    LC_Class.prototype = {
        //public
        datum:'default value',
        setDatum:function(someData){
            this.datum = someData;
        },
        getDatum:function(){
            return this.datum;
        },
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
})();

