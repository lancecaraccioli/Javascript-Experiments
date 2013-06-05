/*!
 * Author:Lance Caraccioli
 * (c) May 1 2009
 * 
 */
(function($){
    LC.Bulletin_Board = function(){
        LC.Bulletin_Board.superclass.constructor.apply(this, arguments);
        this.initialize();
    };
    LC.extend(LC.Bulletin_Board, LC.Component, {
        //public
        bulletins:null,
        translation:{top:0,left:0},
        designModeEnabled:false,//set to true to enable design mode on this collection
        setTranslation:function(positionObj){
            this.translation.top = translationObj.top;//top
            this.translation.left = translationObj.left;//left
            
            return this;
        },
        getTranslation:function(){
            return this.translation;
        },
        setDesignModeEnabled:function(enableDesignMode){
            this.designModeEnabled=enableDesignMode?true:false;
            if (this.designModeEnabled){
                //TODO: intuition tells me something's going here later          
            } else {
                           
            }
            return this;
        },
        getDesignModeEnabled:function(){
            return this.designModeEnabled;
        },
        initialize:function(){
            this.data('My_Collection', this);
            this.bind('contextmenu', rightClickHandler);
            return this;
        },
        addBulletins:function(bulletins){
            if (this.bulletins){
                this.bulletins = $(this.bulletins, bulletins);
            } else {
                this.bulletins = bulletins;
            }
            this.bulletins.data('My_Bulletin_Board', this);
            this.bulletins.unbind('click');
            this.bulletins.click(bulletinClickHandler);
        },
        getBulletins:function(){
            return this.bulletins;
        }
        
    });
    //private functions
    bulletinClickHandler=function(event){
        //this context is of the bulletin collection object
        var bulletinCollection = this;
        if (!bulletinCollection.getDesignModeEnabled()){
            if (!bulletinCollection.isCurrentFullyLoaded()){
                bulletinCollection.currentBulletin.append('<div class="fullsize-not-loaded"></div>');
            }
            var bulletin_board = bulletinCollection.currentBulletin.data('My_Bulletin_Board');
            
            var viewport = bulletin_board.parent();
            /*to find the bulletin_board positioning that centers the selected image in the viewport
	            1.We need to translate the center on the image to the bulletin_board element coordinate space
	                a.  find the center of the image in image coordinates (image width/2)
	                b.  find distance of center of image from bulletin_board left border (image offset left + 1/2 image width) - bulletin_board element offset left
	                c.  translate that distance to relative bulletin_board coordinates (distance to center of image)/bulletin_board width
	                d.  scroll left of viewport will be width of bulletin_board * image center relative location - (1/2 width of viewport)
	                
	        */ 
            var translationAdjustment = {x:0.0, y:0.0};

           
            //find the relative center mass x coordinate
	        var halfOfImageWidth = bulletinCollection.currentBulletin.outerWidth()/2.0;//get width of image including padding and border but not margin then divide it by two
	        var xDistanceFromLeftBulletinBoardBorderToCenterOfImage = (bulletinCollection.currentBulletin.offset().left + halfOfImageWidth) - (bulletin_board.offset().left);//the offset is between border and margin
	        translationAdjustment.x = xDistanceFromLeftBulletinBoardBorderToCenterOfImage/bulletin_board.width();
	        //find the relative center mass y coordinate
	        var halfOfImageHeight = bulletinCollection.currentBulletin.outerHeight()/2.0;
	        var yDistanceFromTopBulletinBoardBorderToCenterOfImage = (bulletinCollection.currentBulletin.offset().top + halfOfImageHeight) - (bulletin_board.offset().top);//the offset is between border and margin
	        translationAdjustment.y = yDistanceFromTopBulletinBoardBorderToCenterOfImage/bulletin_board.height();
	
            bulletin_board.data('translation', translationAdjustment);
            
            //we want the current image centered on the screen and taking as much realestate as possible
            //the most realestate possible that stays within the viewport will be determined by the viewports deminsions
            //so we want the images height to be the height of the viewport, so by taking the ratio of the image height now
            //to it's ideal height (which is the height of the viewport) we can determine the same scale ratio for the bulletin_board 
            var scaleFactor = viewport.height()/bulletinCollection.currentBulletin.height();
            var expectedBulletinBoardWidth = scaleFactor * bulletin_board.width();
	        var expectedBulletinBoardHeight = scaleFactor * bulletin_board.height();
	        var positionLeftTarget = viewport.width()/2.0 - (expectedBulletinBoardWidth * translationAdjustment.x);
	        var positionTopTarget = viewport.height()/2.0 - (expectedBulletinBoardHeight * translationAdjustment.y);
            bulletin_board.stop();
	        bulletin_board.animate({height:expectedBulletinBoardHeight, width:expectedBulletinBoardWidth,left:positionLeftTarget+1, top:positionTopTarget+1}, {duration:1300});
	        bulletin_board.data('scale', {x:scaleFactor, y:scaleFactor});
        }
    };
    rightClickHandler=function (event){
        event.preventDefault();//stop browser context menu from appearing
        $(this).data('My_Collection').bulletins.currentBulletin.find('.fullsize-not-loaded').remove();
        var viewport = $(this).parent();
	    
	    var scaleFactorY = viewport.height()/$(this).height();
	    var scaleFactorX = viewport.width()/$(this).width();
	    var scaleFactor;
	    if (scaleFactorX > scaleFactorY){
	        scaleFactor = scaleFactorY;
	    } else {
	        scaleFactor = scaleFactorX;
	    }
	    
		var expectedBulletinWidth = scaleFactor * $(this).width();
		var expectedBulletinHeight = scaleFactor * $(this).height();
		//reposition the this to the top left of the viewport
		var translationAdjustment = {x:1.0, y:1.0};
		$(this).data('translation', translationAdjustment);
		var positionLeftTarget = 1;
		var positionTopTarget = 1;
        $(this).stop();				
		$(this).animate({height:expectedBulletinHeight, width:expectedBulletinWidth,left:positionLeftTarget, top:positionTopTarget}, {duration:1300});
		$(this).data('scale', {x:scaleFactor, y:scaleFactor});
	}
    
})(jQuery);

