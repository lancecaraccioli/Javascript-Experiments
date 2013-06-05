/**
 * @author    Lance Caraccioli
 * @copyright 2008 Lance Caraccioli
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License:
 * @version   0.1
 * 
 */
 
	/**
	* Depends on: jquery dimensions plugin http://brandonaaron.net/docs/dimensions/
	* Causes each element of the collection to intuitively fill it's parent's height
	* usage: jQuery(".fill-y").fillparent();
	* For each element of the collection;
	* 1. Find it's parent's css height (excludes padding and border)
	* 2. Then find the current element's outer height (includes padding border and margin)
	* 3. If this elements outer height is less than the parent's css height then process that element
	*    a.  Determine the differnce between the parent's css height and the element's outer height
	*    b.  Add this difference to the current css height of the element and reset it's height to that value.
	*/
	 
	jQuery.fn.fillparent = function(){
		jQuery(this).each(function(){
			parent_css_height=jQuery(this).parent().height();
			element_outer_height = jQuery(this).outerHeight({ margin: true });
			if (element_outer_height < parent_css_height) {
				difference=parent_css_height-element_outer_height;
				current_height=jQuery(this).height();
				new_height=current_height + difference;
				jQuery(this).height(new_height);
			};
		});
	};
