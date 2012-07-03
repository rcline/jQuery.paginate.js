/*
 * jQuery Paginate Plugin
 * Developed by Ryan Cline
 */
(function($){
   
   var defaults = {
         $navigation: $('.paginate-navigation'), // Element holding the navigation
         itemsPerPage: 10, // The number of items on a page
         numberOfItems: null, // The number of total items
         getPageNumber: null, // parameter for getPage method
         // Default navigation content. Override this function to customize you navigation (can use a template function).
         // Can also style the predefined classes to modify this navigation.
         getNavigationContent: function( numberOfItems, itemsPerPage, currentPageNumber ){
            var pageLinks = '',
               navigationHtml = '',
               numberOfPages = Math.ceil( numberOfItems / itemsPerPage );
            
            if( numberOfPages > 1 ){
               for( i = 1; i <= numberOfPages; i++ ){
                  pageLinks += '&nbsp;<a href="javascript:;" class="paginate-page paginate-page-specific' + ( ( i == currentPageNumber ) ? ' paginate-current paginate-disabled' : '' ) + '" data-page-number="'+i+'">'+i+'</a>&nbsp;';
               }
            
               navigationHtml += '&nbsp;<a href="javascript:;" class="paginate-page paginate-page-first' + ( ( currentPageNumber == 1 ) ? ' paginate-disabled' : '' ) + '" data-page-number="1">&lt;&lt; First</a>&nbsp;';
               navigationHtml += '&nbsp;<a href="javascript:;" class="paginate-page paginate-page-previous' + ( ( currentPageNumber == 1 ) ? ' paginate-disabled' : '' ) + '" data-page-number="'+( parseInt(currentPageNumber) - 1 )+'">&lt; Previous</a>&nbsp;';
               
               navigationHtml += pageLinks;
               
               navigationHtml += '&nbsp;<a href="javascript:;" class="paginate-page paginate-page-next' + ( ( currentPageNumber == numberOfPages ) ? ' paginate-disabled' : '' ) + '" data-page-number="'+( parseInt(currentPageNumber) + 1 )+'">Next &gt;</a>&nbsp;';
               navigationHtml += '&nbsp;<a href="javascript:;" class="paginate-page paginate-page-last' + ( ( currentPageNumber == numberOfPages ) ? ' paginate-disabled' : '' ) + '" data-page-number="'+numberOfPages+'">Last &gt;&gt;</a>&nbsp;';
               
               return navigationHtml;
            }
            
            return '';
         }
      },
   
      // Variable to hold defaults and params
      options = {},
   
      methods = {
         init: function(){
            initEventHandlers();
            
            options.getPageNumber = 1;
            methods.getPage();
         },
         
         getPage: function(){
            var $container = options.$container;
            $container.children().hide();
            
            var start = ( options.getPageNumber - 1 ) * options.itemsPerPage + 1,
               end = start + options.itemsPerPage;
            
            for( var i = start; i < end; i++){
               $container.children().eq(i-1).show();
            }
            
            options.$navigation
               .html(
                  options.getNavigationContent( 
                     options.numberOfItems, 
                     options.itemsPerPage, 
                     options.getPageNumber
                  )
               );
         }
      };
   
   $.fn.paginate = function( settings, params ){
      var $this = $(this);
      
      $.extend(options, defaults, settings, params);
      options.$container = $this;
      options.numberOfItems = options.$container.children().length;
      
      return $this.each(function(){
         // Call the method
         if( methods[options.method] ){
            return methods[options.method].apply( this );
         }
         else if( options.method == '' || options.method == null ){
            return methods.init.apply( this );
         }
         else{
            $.error( 'Method ' +  options.method + ' does not exist on jQuery.paginate' );
         }
      });
   };
   
   // Initialize event handlers
   function initEventHandlers() {
      $('.paginate-page:not(.paginate-disabled)').live('click', function(e) {
         e.preventDefault();
         var $this = $(this);
         
         $.extend(options, {
            method: 'getPage',
            getPageAction: 'goto',
            getPageNumber: $this.attr('data-page-number')
         });
         
         methods.getPage();
      });
   }
})(jQuery);