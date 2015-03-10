(function ($) {

	// global variables
	$html = $('html');

	// toggle class helper
	var toggleClass = function(el, className) {
	    if(el.hasClass(className + '--open')) {
	      el.removeClass(className + '--open');
	    } else {
	      el.addClass(className + '--open');
	    }
	}

	$('[data-toggle]').on( "click", function() {
		var $className = $( this ).data("toggle");
		toggleClass($('html'), $className);
	});

	// scroll to helper
	var scrollTo = function( el ) {

		el.on('click', function(event) {
		    var target = $( $(this).attr('href') );

		    if( target.length ) {
				event.preventDefault();
		        $('html, body').animate({
		            scrollTop: target.offset().top
		        }, 500);


		    }
		});

	}

	// svg fallback to png
	if(!Modernizr.svg) {
	    $('img[src*="svg"]').attr('src', function() {
	        return $(this).attr('src').replace('.svg', '.png');
	    });
	}

	var coverCarousel = function() {
		var $carousel = $('[data-carousel--full]');

	    $carousel.owlCarousel({
		    items:1,
		    loop: true,
		    nav: true,
		    autoplay:true,
		    navContainer: $carousel,
		    navText: ['<button class="page page--prev"> <i class="ico-arrow-left"></i> </button>','<button class="page page--next"> <i class="ico-arrow-right"></i> </button>'],
		    dots: true,
		    onInitialized: function() {
		    	var $pageDown = $('<a>', {
		    		href: 	'#header',
		    		class: 	'page-down button--secondary'	,
		    		html: 	'<i class="ico-arrow-down"></i>'
		    		
		    	});

		    	$pageDown.appendTo( $carousel );

		    	scrollTo( $pageDown );
		    },
		    dotsContainer: $carousel.find('.pagination'),
		    animateOut: 'fadeOut'
		});


	    $($carousel).find('.page').on('click',function(){
			$carousel.trigger('autoplay.stop.owl')

			console.log('stop owl');
		});

	}

	var reviewCarousel = function(){
		var carousel = $('#umbracoReviews');
		// console.log(" FOCUS PUCUS ");
	    carousel.owlCarousel({
		    items:1,
		    loop: true,
		    nav: false,
		    dots: true

		});
	}


	var sizeMap = function() {
		var windowH	= $(window).outerHeight(),
			header 	= $('#header'),
			footer	= $('#footer'),
			map 	= $('#map'),
			mapH 	= windowH - ( header.outerHeight() + footer.outerHeight() );

			

		if (Modernizr.mq('only screen and (min-width: 37.5em)')) {
			map.css({
				'height': mapH,
				'min-height': $('.site__content').outerHeight()
			});
		}

	}
	var portfolio = function() {
		checkboxFilter.init();

		$('#portfolio').mixItUp({
			layout: {
				containerClassFail: 'grid--empty'
			},
			selectors: {
				target: '.grid__item'
			},
			controls: {
				enable: false // we won't be needing these
			},
			animation: {
				easing: 'cubic-bezier(0.86, 0, 0.07, 1)',
				duration: 600
			}
		});
	}

	var caseStudy = function() {
		var $tile = $('.case-study__section'),
			$colWidth;

		if (Modernizr.mq('only screen and (max-width: 799px)')) {
			$colWidth = $(window).width();
			// console.log( "colWidth is: " +  $colWidth );
		} else {
			$colWidth = $(window).width() /2;
			 // console.log( "colWidth is: " +  $colWidth );
		}
		


//		$tile.css('width', $colWidth);
		// console.log( "colWidth is: " +  $colWidth );
		$('.grid--case-study').masonry({
			itemSelector: $tile,
			columnWidth: $colWidth,
			isAnimated: false,
			layoutPriorities: {
				upperPosition: 1,
				shelfOrder: 1
			}
		});
		$('.resource__wrap').masonry({
			itemSelector: $('.resource__tile'),
			columnWidth: $colWidth,
			isAnimated: false,
			layoutPriorities: {
				upperPosition: 1,
				shelfOrder: 1
			}
		});

	}

	var reviewTestimonials = function() {
		var carousel = $('#caseTestimonials');
	    carousel.owlCarousel({
		    items:1,
		    loop: false,
		    nav: false,
		    dots: true

		});
	}


	var coffeeScript = function() {

		$('#recaptcha_area').addClass('table--scroll');

		$('[data-link="#coffee-form"]').magnificPopup({
				type: 'inline',
				preloader: false,
				focus: '#name',
				// When elemened is focused, some mobile browsers in some cases zoom in
				// It looks not nice, so we disable it:
				callbacks: {
					beforeOpen: function() {
						if($(window).width() < 700) {
							this.st.focus = false;
						} else {
							this.st.focus = '#name';
						}
					}
				}
		});

		if( $('.field-validation-error').length > 0 ) {

			$('[data-link="#coffee-form"]').click();

		}

		// FORM STYLE //   

		$('#c16ac739-1b5c-45db-a007-5f7fe6441a2e').focus(function() {
				$('.c16ac739-1b5c-45db-a007-5f7fe6441a2e').css({'top':'-50px','font-size':'14px','color':'#00b7ce'});
				console.log("focus");
		}).blur(function() {
			if(	$('#c16ac739-1b5c-45db-a007-5f7fe6441a2e').val().length ){
				$('.c16ac739-1b5c-45db-a007-5f7fe6441a2e').css({'top':'-50px','font-size':'14px','color':'#00b7ce'});
				console.log("filled");
			} else {
				$('.c16ac739-1b5c-45db-a007-5f7fe6441a2e').css({'top':'-15px','font-size':'18px','color':'#dfe5e5'});
				console.log("empty");
			}
		});
	}

	var filterButton = function(){
		$('#filterButton').click(function() {
			console.log("HELLO");
			$('.portfolio-filter--l').css('overflow', 'hidden');
			$('#filterMenu').cssAnimateAuto('height 0.5s ease', function() {
				if( $('html').hasClass('filter--open') ){
					$('.portfolio-filter--l').css('overflow', 'visible');
				}

			});
		});
	}

	var initFormValidation = function() {
		$('#4541611c-391f-4710-ec7b-9830ad1aa940').prop("type", "email");
		$('#recaptcha_response_field').prop('required',true);
		
		var $contactForm = $('#contour_form_Coffeeform').find('form');
		var $button 		 = $contactForm.find('.btn');

		$button.prop("disabled", true);

		$button.on('click', function () {
			$contactForm.parsley().validate();
			validateFront();

		});

		var validateFront = function () {
			$('#recaptcha_response_field').prop('required',true);
			if (true === $contactForm.parsley().isValid()) {
				$button.prop("disabled", false);
			} else {
				//console.log('invalid');
				$button.prop("disabled", true);
			}
		};

		fields = ['input[type="text"]','textarea', 'input' ];
			$.each( fields, function (index, value) {
				$contactForm.find(value).on('keyup keydown focus change blur', function (value) {
					return function (event) {
					$this = $(this);
					if (true === $this.parsley().isValid()) {
					   $this.addClass('input--valid');
					$this.removeClass('input--invalid');
				} else {
				   $this.addClass('input--invalid');
					$this.removeClass('input--valid');
				}
					validateFront();
				}
			}(value));
		});

	};


	var triggerAnimations = function() {

		wow = new WOW({
			offset:       200
		})
		wow.init();

	}

	var portfolioItemScripts = function() {

	    $('.magnific-js').magnificPopup({
	        delegate: 'a',
	        type: 'image',
	        closeOnContentClick: false,
	        closeBtnInside: false,
	        mainClass: 'mfp-with-zoom mfp-img-mobile',
	        image: {
	            verticalFit: true,
	            titleSrc: function(item) {
	                return item.el.attr('title');
	            }
	        },
	        gallery: {
	            enabled: true
	        },
	        zoom: {
	            enabled: true,
	            duration: 300, // don't foget to change the duration also in CSS
	            opener: function(element) {
	                return element.find('img');
	            }
	        }
	    });

	    var carousel = $('.tile-slide-js');
	    carousel.owlCarousel({
	        items: 1,
	        loop: true,
	        nav: true,
	        dots: true,
	        dotsContainer: ".controls-js",
	        autoplay: true,
	        animateOut: "fadeOut",
	        navText: ['<button class="page page--prev"> <i class="ico-arrow-left"></i> </button>','<button class="page page--next"> <i class="ico-arrow-right"></i> </button>'],


	    });

	}


/* ===========================================================

	# INIT

=========================================================== */
	$(window).ready(function(){

	    caseStudy();
		$html.removeClass('preload');
		coverCarousel();
		reviewCarousel();
		sizeMap();
		scrollTo( $('a[href^="#"]') );
		$('#main').fitVids();
//		initFormValidation();

		$('#header').scrollToFixed();

	});

	$(window).load(function() {
	  	setTimeout(function() {
			caseStudy();
		}, 300);
		reviewTestimonials();
		$('.grid-section').animate({opacity: 1}, 600);
		coffeeScript();
		filterButton();
		triggerAnimations();

		if( $html.hasClass('doc--portfolioitem') ) {
			portfolioItemScripts();
		}

	});

	$(window).resize(function() {
	    caseStudy();
	});


})(jQuery);



