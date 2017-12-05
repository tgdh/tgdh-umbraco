/*!
 * jQuery lightweight plugin for AJAX data callback
 * Original author: Paulius Putna
 * Further changes, comments: www.tgdh.co.uk
 * Licensed under the MIT license
 */
;
(function($, window, document, undefined) {

    var temp = {

        module: '<div id="module-tile" class="large-tile clearfix"></div>',
        moduleId: '#module-tile',
        openClass: 'tile-open',
        closeClass: 'tile-close',
        moduleOpen: 'module--open',
        moduleClose: 'module--close',
        loadMore: '<button id="load-more" class="button button--load button--load-prev">Load more</button>',
        loadPrev: '<button id="load-prev" class="button button--load button--load-next">Load previous</button>',
        wrapper: 0,
        tiles: 0,
        loading: false,
        tileCount: 0, // tiles per row
        activeTile: 0, // active tile on click
        activeRow: 0, // active row on tile click
        tileRow: 0,
        activeBlock: false,
        insertAfter: 0,
        children: 0,
        pages: 0,
        currentPage: 0,
        nextPage: 0,
        prevPage: 0,
        busyLoading: false,
        prepend: false,
        moreLink: '?altTemplate=portfolioPage',
        category: "",
        sector: "",
        client: ""

    };

    var Toast = {

        init: function(options, elem) {
            var self = this;
            self.elem = elem;
            self.$elem = $(elem);
            var child = self.$elem.children();

            if (typeof options === 'string') {

            } else {
                self.options = $.extend({}, $.fn.getToast.defaults, options);

            }

            self.build();
            self.getTiles();
            self.bindUI();
            self.checkQueryString();
            self.getStats();
            self.loadMoreUI();
            // self.buildLink();
        },

        getTiles: function() {
            var self = this,
                wrapWidth = self.$elem.width(),
                tileWidth = self.$elem.children().width();

            temp.tileCount = Math.round(wrapWidth / tileWidth);
            self.getStats();
        },

        build: function() {
            var self = this,
                tiles = self.$elem.children();

            self.$elem.addClass(this.options.wrapClass);
            tiles.each(function() {
                $(this).addClass(self.options.tileClass);
            });

            self.getStats();
        },

        bindUI: function() {
            var self = this,
                anchor = $("." + self.options.tileClass + "");

            $('body').on('click', '.toast-item', function(e) {
                var link = this,
                    ajaxUrl = $(link).attr("href") + self.options.altTemplate
                e.preventDefault();
                if ($(this).hasClass(temp.openClass)) {

                } else {
                    $(this).siblings().removeClass(temp.openClass);
                    $(this).addClass(temp.openClass);

                    temp.activeTile = $('.toast-item').index(this) + 1;
                    temp.tileRow = Math.ceil(temp.activeTile / temp.tileCount);


                    self.count();

                    self.getData(ajaxUrl);
                    self.getStats();
                }


            });
            $(document).on('click', '#closeModule', function() {
                self.closeModule();
            });



        },

        ajaxSubForm: function() {

            $('.site').on('submit', '#subForm', function(e) {
                e.preventDefault();

                var subForm = $(this);

                $.getJSON(
                this.action + "?callback=?",
                $(this).serialize(),
                function (data) {
                    if (data.Status === 400) {
                        //alert("Error: " + data.Message);
                        if( $(subForm).find('.alert').length < 1 ) {
                            $(subForm).prepend('<p class="alert alert--error">' + data.Message + '</p>');
                         }
                    } else { // 200
                        //alert("Success: " + data.Message);
                        $(subForm).replaceWith('<p class="alert alert--success">' + data.Message + '</p>');
                    }
                });

            });
        },

        checkQueryString: function() {
            var self = this;
            var vars = [],
                hash,
                query = location.href.split('?')[1];

            if (query != undefined) {
                query = query.split('&');
                for (var i = 0; i < query.length; i++) {
                    hash = query[i].split('=');
                    // vars.push(hash[1]); 
                    vars[hash[0]] = hash[1]
                }
            }

            if (jQuery.isEmptyObject(vars)) {
                // console.log( "NO query or DOESN'T match a pattern");
                temp.currentPage = 1;
            } else if (vars.page && vars.page >= 1) {
                //console.log( "Query MATCHES a pattern");
                temp.currentPage = vars.page;
            } else {
                //console.log('no page in query string');
                temp.currentPage = 1;
            }

            // write if statements for query
            if (vars.cat) {
                temp.category = vars.cat;
            }
            if (vars.cat || vars.sector || vars.client) {
                $('html').addClass('filter--open');
                $('#filterMenu').css('height', 'auto');
                $('.portfolio-filter--l').css('overflow', 'visible');

            }
            if (vars.sector) {
                temp.sector = vars.sector;
            }
            if (vars.client) {
                temp.client = vars.client;
            }

            // var qCat = "", // query category
            // 	qSector = ""

            // console.log(vars);
            // console.log('current page is: ' + temp.currentPage);
            temp.prevPage = (temp.currentPage - 1);
            temp.nextPage = (temp.prevPage + 2);
            // console.log('current page is: ' + temp.currentPage);
            self.getStats();

            var goToLink = function(val, filter) {

                var wrap = $('#filters'),
                    catFilter = wrap.find("[data-search='cat']"),
                    sectorFilter = wrap.find("[data-search='sector']"),
                    clientFilter = wrap.find("[data-search='client']"),
                    catArr = [],
                    sectorArr = [],
                    clientArr = []

                // console.log(catFilter.length);
                // console.log(sectorFilter.length);
                // console.log(clientFilter.length);

                catFilter.each(function() {
                    catArr.push($(this).data('filter'));
                })
                sectorFilter.each(function() {
                    sectorArr.push($(this).data('filter'));
                })
                clientFilter.each(function() {
                        clientArr.push($(this).data('filter'));
                    })
                    // console.log(catArr);
                    // console.log(sectorArr);
                    // console.log(clientArr);
                temp.category = catArr;
                temp.client = clientArr;
                temp.sector = sectorArr;
                //console.log("THEY ARE PUSEHD");
                if (clientArr.length > 0 || sectorArr.length > 0 || catArr.length > 0) {

                    //console.log("A");

                    if (filter === "sector" || filter === "cat" || filter === "client") {
                        //console.log("A.A");

                        if (filter === "sector") {

                            //console.log("Add to sector");
                            //console.log("Sector string: " + sectorArr);
                            if (sectorArr.length > 0) {
                                for (i = 0; i < sectorArr.length; i++) {
                                    if ($.inArray(val.toLowerCase().replace(/\s/g, "_"), sectorArr) > -1) {
//                                        console.log("NONE");
                                    } else {
                                        sectorArr.push(val.toLowerCase().replace(/\s/g, "_"));
                                        break;
                                    }
                                }
                            } else {
                                sectorArr.push(val.toLowerCase().replace(/\s/g, "_"));
                            }
                            //console.log("Sector string: " + sectorArr);

                        } else if (filter === "cat") {

                            //console.log("Add to cat");
                            // console.log("Cat string: " + catArr);
                            if (catArr.length > 0) {
                                for (i = 0; i < catArr.length; i++) {
                                    if ($.inArray(val.toLowerCase().replace(/\s/g, "_"), catArr) > -1) {
                                        //console.log("NONE");
                                    } else {
                                        catArr.push(val.toLowerCase().replace(/\s/g, "_"));
                                        break;
                                    }
                                }
                            } else {
                                catArr.push(val.toLowerCase().replace(/\s/g, "_"));
                            }
                            //console.log("Cat string: " + catArr);

                        } else if (filter === "client") {

                            //console.log("Add to client");
//                            console.log("Client string: " + clientArr);
                            if (clientArr.length > 0) {
                                for (i = 0; i < clientArr.length; i++) {
                                    if ($.inArray(val.toLowerCase().replace(/\s/g, "_"), clientArr) > -1) {
//                                        console.log("NONE");
                                    } else {
                                        clientArr.push(val.toLowerCase().replace(/\s/g, "_").replace(/&/g,"%26"));
                                        break;
                                    }
                                }
                            } else {
                                clientArr.push(val.toLowerCase().replace(/\s/g, "_").replace(/&/g,"%26"));
                            }
                            //console.log("Client string: " + clientArr);

                        }


                        // if( vars[filter] === undefined ){
                        // 	// creates new filter with value if not present
                        // 	vars[filter] = val.toLowerCase().replace(/\s/g,"_");
                        // console.log("A.B");
                        // } else {
                        // 	var filters = vars[filter].split(',');
                        // 	// needs to check current string and see if filter is selected or not
                        // console.log("A.C");
                        // 	for(i = 0; i < filters.length; i++) {
                        // console.log( "Filter: " + filters[i] );

                        // 		if($.inArray(val.toLowerCase().replace(/\s/g,"_"), filters) > -1){
                        // console.log("filter is in array");

                        // 		} else {
                        // console.log( vars[filter] );
                        // console.log( " THIS MAKES IT ADD MORE  , ")
                        // 			vars[filter] = vars[filter] + ',' + val.toLowerCase().replace(/\s/g,"_");
                        // 			break;
                        // 		}

                        // 	}

                        // }
                        // temp.category = vars.cat;
                        // temp.client = vars.client;
                        // temp.sector = vars.sector;
                    } else if (filter === undefined) {
                        //console.log('remove: ' + val);

                        // console.log(vars);
                        // var y = catArr;
                        // var removeItem = val;
                        // console.log(y);

                        catArr = jQuery.grep(catArr, function(value) {
                            return value != val;
                        });
                        clientArr = jQuery.grep(clientArr, function(value) {
                            return value != val;
                        });
                        sectorArr = jQuery.grep(sectorArr, function(value) {
                            return value != val;
                        });

                        // console.log(y);
                        temp.category = catArr;
                        temp.client = clientArr;
                        temp.sector = sectorArr;
                    }
                    var sector = 'sector=',
                        category = 'cat=',
                        client = 'client='

                    // console.log(temp.category);
                    // console.log(temp.sector);
                    // console.log(temp.client);

                    var link = "/portfolio",
                        first = true

                    if (sectorArr.length > 0 && first === true) {
                        link = link + '?' + sector + temp.sector;
                        first = false;
                    }

                    if (catArr.length > 0 && first === true) {
                        link = link + '?' + category + temp.category;
                        first = false;
                    } else if (catArr.length > 0) {
                        link = link + '&' + category + temp.category;
                    }

                    for(i = 0; i < clientArr.length; i++){
                        clientArr[i] = clientArr[i].toString().replace("&","%26")
                    }

                    if (clientArr.length > 0 && first === true) {
                        link = link + '?' + client + temp.client;
                        first = false;
                    } else if (clientArr.length > 0) {
                        link = link + '&' + client + temp.client;
                    }
//                    console.log(client);
                    // console.log(temp.client.replace(/&/g,"%26"));
//                    console.log(link);
                    // window.location = link;
                } else {
                    // default no query string, just builds the link and goes
                    var link = "/portfolio";
                    link = link + '?' + filter + "=" + val.toLowerCase().replace(/\s/g, "_");
                    //console.log("B");
                    //console.log(link);
                    window.location = link;
                }


                window.location = link;
//                console.log(link);
            }

                
            $(document).ready(function() {
                $('#sectorSelect').selectOrDie({
                    size: 10,
                    customClass: "sector-select",
                    onChange: function() {
                        goToLink($(this).val(), "sector");
                    }
                });
                $('#catSelect').selectOrDie({
                    size: 10,
                    customClass: "cat-select",
                    onChange: function() {
                        goToLink($(this).val(), "cat");
                    }
                });
                $('#clientSelect').selectOrDie({
                    size: 10,
                    customClass: "client-select",
                    onChange: function() {
                        goToLink($(this).val(), "client");
                    }
                });

            });

            $(document).on('click', '.filter-js', function() {
                goToLink($(this).data('filter'), undefined);

            });
        },

        closeModule: function() {
            var self = this,
                module = $(temp.moduleId).css({
                    'max-height': '0'

                }).addClass(temp.moduleClose), // .slideUp("slow"),
                openTile = self.$elem.children('.portfolio-tile').eq(temp.activeTile - 1)

            setTimeout(function() {
                $(temp.moduleId).css({
                    'max-height': '0'

                }).removeClass(temp.moduleOpen);
                $(temp.moduleId).remove();
            }, 500);

            // console.log(openTile);
            $('.tile-open').addClass(temp.closeClass);
            setTimeout(function() {
                self.$elem.children().each(function() {
                    $(this).removeClass(temp.openClass);
                    $(this).removeClass(temp.closeClass);
                });
            }, 500);

            temp.activeTile = 0;
            temp.activeRow = 0;
            temp.activeTile = 0;
            temp.tileRow = 0;
            temp.insertAfter = 0;
            temp.activeBlock = false;
            $('.activeTile').html(temp.activeTile);
            self.getStats();
        },

        changeModule: function() {
            var self = this,
                module = $(temp.moduleId).css({
                    'max-height': 0
                }).removeClass(temp.moduleOpen),
                openTile = self.$elem.children().eq(temp.activeTile - 1)

            setTimeout(function() {
                $(temp.moduleId).remove();
            }, 600);
            temp.activeRow = Math.ceil(temp.activeTile / temp.tileCount);
            // openTile.removeClass( temp.openClass );
        },

        getStats: function() {
            $('.tileCount').html(temp.tileCount);
            $('.activeTile').html(temp.activeTile);
            $('.activeRow').html(temp.activeRow);
            $('.tileRow').html(temp.tileRow);
            $('.insertAfter').html(temp.insertAfter);
            $('.activeBlock').html(temp.activeBlock.toString());
            if ($('.activeBlock').html() === 'true') {
                $('.activeBlock').css('color', 'green');
            } else {
                $('.activeBlock').css('color', 'red');
            }
            $('.chidren').html(temp.children);
            $('.pages').html(temp.pages);
            $('.currentPage').html(temp.currentPage);
            $('.nextPage').html(temp.nextPage);
            $('.prevPage').html(temp.prevPage);
        },

        count: function() {
            var self = this;

            if (temp.activeBlock === false) {
                temp.insertAfter = (temp.tileRow * temp.tileCount);
                temp.children = self.$elem.find(temp.tileClass);
                // console.log(temp.children);
            } else {
                if (temp.tileRow > temp.activeRow) {
                    temp.insertAfter = (Math.ceil((temp.activeTile) / temp.tileCount) * temp.tileCount);
                } else {
                    temp.insertAfter = (temp.tileRow * temp.tileCount);
                }

            }

        },

        getData: function(link) {
            // console.log("getData called");
            var self = this
                //console.log(link);
            $.ajax({
                type: "POST",
                url: link,
                async: true,
                cache: false,
                success: function(result) {
                    self.checkData(result);
                },
                complete: function(result) {

                },
                error: function(result) {
                    //console.log("error");
                }
            });
        },

        checkData: function(data) {
            var self = this;
            if (temp.busyLoading === true) {
                self.addTiles(data);
            } else {
                if (temp.activeBlock === false) {
                    self.renderData(data);
                    temp.activeBlock = true;
                    self.getStats();
                    // self.animate();
                } else {
                    if (temp.activeRow === temp.tileRow) {
                        var tile = $(temp.moduleId);
                        self.updateData(data);
                        // self.animate();
                    } else {
                        self.changeModule();
                        setTimeout(function() {
                            // self.animate();
                            self.renderData(data);
                        }, 600);

                    }
                }
            }


        },

        renderData: function(result) {
            // console.log("called renderData");
            var self = this;
            var maxHeight = 620;

            if (self.$elem.children().eq(temp.insertAfter - 1).length > 0) {
                self.$elem.children().eq(temp.insertAfter - 1).after(temp.module);

            } else {
                self.$elem.append(temp.module);
            }

            var tile = $(temp.moduleId);
            tile.html(result);
            tile.children().wrapAll("<div class='module__wrap clearfix'></div>")
            
            maxHeight = $('.module__wrap').height();

            // console.log( height );
            // tile.css('max-height', height)
            setTimeout(function() {
                tile.css({
                    'max-height': maxHeight + "px"
                }).addClass(temp.moduleOpen); // .slideDown("slow");

            }, 10);


            $("#module-tile img").on('load', function() {

                var height = $('.module__wrap').outerHeight(true);
                if (height > maxHeight) {
                    tile.css({
                        'max-height': height + "px"
                    }); // .slideDown("slow");
                }
            });

            temp.activeRow = Math.ceil(temp.activeTile / temp.tileCount);
            temp.activeRow = temp.tileRow;
            // console.log('last child is in the dom')
            self.scrollMod();
            self.tileSlide();
            self.magnificPopup();
            self.getStats();
            self.ajaxSubForm();
        },
        updateData: function(result) {
            var self = this;
            var tile = $(temp.moduleId);
            // tile.css({
            // 	'opacity': '0'
            // });
            tile.html(result);
            tile.children().wrapAll("<div class='module__wrap clearfix'></div>")
            var maxHeight = 620;

            // console.log( height );
            // tile.css('max-height', height)
            tile.css({
                'max-height': maxHeight + "px"
            }).addClass(temp.moduleOpen); // .slideDown("slow");

            $("#module-tile img").on('load', function() {
                var height = $('.module__wrap').outerHeight(true);
                if (height > maxHeight) {
                    tile.css({
                        'max-height': height + "px"
                    }); // .slideDown("slow");
                }
            });

            temp.activeRow = Math.ceil(temp.activeTile / temp.tileCount);
            self.tileSlide();
            self.getStats();
            self.magnificPopup();
            self.ajaxSubForm();
        },

        addTiles: function(data) {
            var tiles = data,
                self = this

            if (temp.prepend === true) {
                self.$elem.prepend('<div class="temp-tile"></div>'); // tiles
                $('.temp-tile').html(tiles);
                setTimeout(function() {
                    $('.temp-tile').css({
                        'max-height': '500px'
                    });
                }, 50);

                setTimeout(function() {
                    // self.animate();
                    var child = $('.temp-tile').children();
                    child.unwrap();
                    self.getTiles();
                    self.build();
                    self.count();
                    temp.busyLoading = false;
                }, 500);
                temp.prepend = false;
                temp.currentPage = temp.prevPage;
                temp.prevPage--;

            } else {
                self.$elem.append('<div class="temp-tile"></div>'); // tiles

                $('.temp-tile').html(tiles);
                setTimeout(function() {
                    $('.temp-tile').css({
                        'max-height': '500px'
                    });
                }, 50);

                setTimeout(function() {
                    // self.animate();
                    var child = $('.temp-tile').children();
                    child.unwrap();
                    self.getTiles();
                    self.build();
                    self.count();
                    temp.busyLoading = false;
                }, 500);
                temp.currentPage = temp.nextPage;
                temp.nextPage++;
            }
            if (temp.prevPage === 0) {
                $('#load-prev').remove();

            }
            if (temp.nextPage > temp.pages) {
                $('#load-more').remove();
            }


            self.getTiles();
            self.build();
            self.count();
            // console.log( temp.currentPage );
            self.getHistory();
            self.getStats();
        },

        getHistory: function() {
            var sector = 'sector=',
                category = 'cat=',
                client = 'client=',
                page = 'page='

            var link = "",
                first = true

            // console.log(temp.sector);
            // console.log(temp.category);
            // console.log(temp.client);
            if (temp.sector !== "" && first === true) {
                link = link + '?' + sector + temp.sector;
                first = false;
            }

            if (temp.category !== "" && first === true) {
                link = link + '?' + category + temp.category;
                first = false;
            } else if (temp.category !== "") {
                link = link + '&' + category + temp.category;
            }

            if (temp.client !== "" && first === true) {
                link = link + '?' + client + temp.client;
                first = false;
            } else if (temp.client !== "") {
                link = link + '&' + client + temp.client;
            }
            if (first === true) {
                link = link + '?' + page + temp.currentPage
            } else {
                link = link + '&' + page + temp.currentPage
            }

//            console.log(link);

            history.pushState(null, '', link);
        },

        setHeight: function() {

        },
        scrollMod: function() {
            var self = this;

            $('html, body').animate({
                scrollTop: $(temp.moduleId).offset().top - 300
            }, 1000);
        },

        loadMoreUI: function() {
            var self = this

            temp.pages = $('.paging-nav').data('pages');
            $('.paging-nav').hide();
            if (temp.nextPage > temp.pages) {

            } else {
                self.$elem.after(temp.loadMore);
            }

            if (temp.currentPage > 1) {
                self.$elem.before(temp.loadPrev);
            }
            // console.log('nav hidden');

            $('#load-more').on('click', function() {
                if (temp.busyLoading === false && temp.currentPage < temp.pages) {
                    temp.busyLoading = true;
                    // console.log( temp.nextPage );
                    self.getData((temp.moreLink + '&sector=' + temp.sector + '&cat=' + temp.category + '&client=' + temp.client + '&page=' + (temp.nextPage)));
                } else {
                    // console.log('do nothing');
                }
            });

            $('#load-prev').on('click', function() {
                if (temp.busyLoading === false && temp.prevPage > 0) {
                    temp.prepend = true;
                    temp.busyLoading = true;
                    //console.log( temp.prevPage );
                    self.getData((temp.moreLink + '&sector=' + temp.sector + '&cat=' + temp.category + '&client=' + temp.client + '&page=' + (temp.prevPage)));
                } else {
                    //console.log('do nothing');
                }
            });

            self.getStats();

        },

        tileSlide: function() {
            var totalWidth = 0,
                stage;

            var carousel = $('.tile-slide-js');
            carousel.owlCarousel({
                items: 1,
                loop: true,
                nav: true,
                dots: true,
                margin: 5,
                dotsContainer: ".controls-js",
                autoplay: true,
                animateOut: "fadeOut",
                navText: ['<button class="page page--prev"> <i class="ico-arrow-left"></i> </button>','<button class="page page--next"> <i class="ico-arrow-right"></i> </button>']
            });

            if( carousel.length > 0 ) {
                stage = carousel.find('.owl-stage');
                totalWidth = $(stage).css('width').replace(/[^-\d\.]/g, '') + 1;
                stage.css('width', totalWidth);
            }
        },
        magnificPopup: function() {
            $('.magnific-js').magnificPopup({
                delegate: 'a',
                type: 'image',
                closeOnContentClick: false,
                closeBtnInside: false,
                mainClass: 'mfp-img-mobile',
                image: {
                    verticalFit: true,
                    titleSrc: function(item) {
                        return item.el.attr('title');
                    }
                },
                gallery: {
                    enabled: true
                }
            });

            $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,

                fixedContentPos: false
            });
            // console.log('magnific');

            $('.js-modal-form').magnificPopup({
                type: 'inline',
                preloader: false,
                focus: '#fieldName',
                mainClass: 'mfp-modal',
                // When elemened is focused, some mobile browsers in some cases zoom in
                // It looks not nice, so we disable it:
                callbacks: {
                    beforeOpen: function() {
                        if($(window).width() < 700) {
                            this.st.focus = false;
                        } else {
                            this.st.focus = 'input';
                        }
                    }
                }
        });
        }



    };



    $.fn.getToast = function(options) {
        Toast.init(options, this);
        return this;
    };

    $.fn.getToast.defaults = {
        animationIn: "",
        animationOut: "",
        durationIn: 0,
        durationOut: 0,
        wrapClass: "toast-wrap",
        tileClass: "toast-item",
        altTemplate: "?altTemplate=portfolioTile",
    };


})(jQuery, window, document);

if ($('html').hasClass('page--portfolio')) {

    $('#portfolio-tiles').getToast({

    });

}

if ($('html').hasClass('page--about')) {

    $('#employee-wrap').getToast({
        altTemplate: "?altTemplate=personInfo"
    });

}