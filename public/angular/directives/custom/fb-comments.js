angular.module('app')
 .directive('fbComments', function() {
   return {
      restrict: 'C',
      link: function(scope, element, attributes) {
        //Get parent element(parse should be perform over parent)
        var parentElement = document.getElementById('fb-comment-widget');

        if(parentElement == null)
          return void 0;

        //Defining element href
        parentElement.firstElementChild.setAttribute('data-href', document.location.href);
        //Parsing element
        return typeof FB !== "undefined" && FB !== null ? FB.XFBML.parse(parentElement) : void 0;
      }
    };
  });
