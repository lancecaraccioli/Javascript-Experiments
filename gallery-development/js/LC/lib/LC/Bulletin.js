/*!
 * Author:Lance Caraccioli
 * (c) May 1 2009
 * 
 */
(function($){
    LC.Bulletin = function(){
        LC.Bulletin.superclass.constructor.apply(this, arguments);
        this.initialize();
    };
    //private data
    var bulletinCollection = null;

    LC.extend(LC.Bulletin, LC.Component, {
        //public
        maxZIndex:0,
        currentBulletin:null,
        position:{x:0,y:0,z:0},
        designModeEnabled:false,//set to true to enable design mode on this collection
        setPostion:function(positionObj){
            this.position.x = positionObj.x;//left
            this.position.y = positionObj.y;//top
            this.position.z = positionObj.z;//z-index
            return this;
        },
        getBulletinCollection:function(){
            return bulletinCollection;
        },
        getPostion:function(){
            return this.position;
        },
        setDesignModeEnabled:function(enableDesignMode){
            this.designModeEnabled=enableDesignMode?true:false;
            if (this.designModeEnabled){
                this.draggable({
                    drag:handleAll,
                    start:handleAll,
                    stop:handleAll
                });
                this.resizable({
                    resize:handleAll,
                    start:handleAll,
                    stop:handleAll,
                    aspectRatio:true
                });
            } else {
                this.draggable('destroy');
                this.resizable('destroy');
            }
            return this;
        },
        getDesignModeEnabled:function(){
            return this.designModeEnabled;
        },
        nextBulletin:function(){
            var currentBulletin = this.getCurrentBulletin();
            var nextBulletin = currentBulletin.next('.lc-bulletin');
            if (!nextBulletin.is('.lc-bulletin')) nextBulletin = $(this[0]).parent().find('.lc-bulletin:first');
            return nextBulletin;
        },
        prevBulletin:function(){
            var currentBulletin = this.getCurrentBulletin();
            var prevBulletin = currentBulletin.prev('.lc-bulletin');
            if (!prevBulletin) prevBulletin = $(this[0]).parent().find('.lc-bulletin:last');
            return prevBulletin;
        },
        getCurrentBulletin:function(){
            return this.currentBulletin;
        },
        setCurrentBulletin:function(bulletin){
            this.currentBulletin= bulletin;
            return this;
        },
        isCurrentFullyLoaded:function(){
            return this.currentBulletin.data('fullsizeImageLoaded');
        },
        isCurrentThumbnailLoaded:function(){
            return this.currentBulletin.data('thumbnailImageLoaded');
        },
        click:function(fn){
            if (typeof fn == 'function'){
                customized_fn = function(event){
                    bulletinCollection.currentBulletin = $(this);
                    //handle the event in the context of the whole collection
                    event.preventDefault();//prevent a tag default, etc.
                    fn.apply(bulletinCollection, arguments);
                }
                this.bind('click', customized_fn);
            } else {
                this.trigger('click');
            }
        },
        initialize:function(){
            bulletinCollection = this;
            this.data('myBulletinCollection', bulletinCollection);
            this.data('fullsizeImageLoaded', false);
            this.data('thumbnailImageLoaded', false);
            this.each(function(){
                if (parseInt($(this).css('z-index')) > parseInt(bulletinCollection.maxZIndex)){
                    bulletinCollection.maxZIndex = $(this).css('z-index');
                }
                var bulletin = $(this);
                bulletin.find('img').load(function(){
                    bulletin.removeClass('thumbnail-loading').addClass('thumbnail-loaded');
                    bulletin.data('thumbnailImageLoaded', true);
                });
                if (bulletin.is('a')){
                    fullsizeImage = new Image();
                    fullsizeImage.src = bulletin.attr('href');
                    $(fullsizeImage).load(function(){
                        bulletin.data('fullsizeImageLoaded', true);
                        bulletin.find('img').attr('src', $(this).attr('src'));
                    });
                    bulletin.data('fullsizeImage', fullsizeImage);
                }
            });
            this.addClass('lc-bulletin thumbnail-loading');

            this.currentBulletin= $(this[0]).parent().find('.lc-bulletin:first');
            return this;
        }
    });
    //private functions
    handleAll=function(event){
        if (bulletinCollection.getDesignModeEnabled()){
            return eval(event.type+"Handler.apply(this, arguments);");            
        } else {
            return false;
        }
    };
    resizeHandler=function(event){
        
    };
    resizestartHandler=function(event){
        
    };
    resizestopHandler=function(event){
        $(this).css({
            height:$(this).height()/$(this).parent().height()*100+"%",
            width:$(this).width()/$(this).parent().width()*100+"%",
            left:$(this).position().left/$(this).parent().width()*100+"%",
            top:$(this).position().top/$(this).parent().height()*100+"%"
        });
    };
    dragHandler=function(event){
        
    };
    dragstartHandler=function(event){
        $(this).css('z-index', ++bulletinCollection.maxZIndex);
    };
    dragstopHandler=function(event){
        $(this).css({
            left:$(this).position().left/$(this).parent().width()*100+"%",
            top:$(this).position().top/$(this).parent().height()*100+"%"
        });
    };
})(jQuery);

