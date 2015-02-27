// ===========================================================
//
//	$TOGGLE CLASS
//	To use <button data-toggle="nav--main">
//
// ===========================================================

var toggle = function(el, className) {
  var $target = $('.' + className);

    if(el.hasClass(className + '--open')) {
      el.removeClass(className + '--open');
      $target.attr('aria-hidden','true');
    } else {
      el.addClass(className + '--open');
      $target.attr('aria-hidden','false');
    }
}

$('[data-toggle]').on( "click", function() {
  var $className = $( this ).data("toggle");
  toggle($('html'), $className);
});

// ===========================================================
//
// PURE JS version
//
// ===========================================================

var dataToggle = document.querySelectorAll('[data-toggle]');

for (var i in dataToggle) {
	if (dataToggle[i].nodeType == 1) dataToggle[i].addEventListener('click', function(event) {
		var $class = this.getAttribute( "data-toggle" );
		toggle(html, $class);
	});
}