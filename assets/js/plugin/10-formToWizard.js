/* Created by jankoatwarpspeed.com */
/* Modified by horchatadesign.com  
 * Made a little more flexible/modular */

(function($) {
    $.fn.formToWizard = function(options) {
        options = $.extend({  
            submitButton: "",
            stepsclass: "",
            sectionname: ""
        }, options); 
        
        var element = this;

        var steps = $(element).find(options.stepsclass);
        var count = steps.size();
        var submmitButtonName = $(element).find('input[type="submit"]');
        $(submmitButtonName).hide();

        // 2
//        $(element).before("<ul id='steps'></ul>");

        steps.each(function(i) {
            $(this).wrap("<div id='step" + i + "'></div>");
            $(this).append("<p id='step" + i + "commands' class='step-controls'></p>");

            // 2
            var name = $(this).find('h2').html();
//            $("#steps").append("<li id='stepDesc" + i + "'><a href='#step" + (i) + "'>" + (i + 1) + "<span> " + name + "</span></a></li>");

            if (i == 0) {
                
                $("#step0commands").append("<div class='step-controls__col step-controls__col--first'><button class='button button--primary button--next button--disabled' disabled>Prev</button></div>");

                createPagination(i);
                createNextButton(i);
                focusInput(i);
//                selectStep(i);
            }
            else if (i == count - 1) {
                $("#step" + i).hide();
                createPrevButton(i);
                createPagination(i);
            }
            else {
                $("#step" + i).hide();
                createPrevButton(i);
                createPagination(i);
                createNextButton(i);
            }

        });

        function createPrevButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append("<div class='step-controls__col step-controls__col--first'><button id='" + stepName + "Prev' class='button button--primary button--prev'>Prev</button></div>");

            $("#" + stepName + "Prev").on("click", function(e) {

                $("#" + stepName).hide();
                $("#step" + (i - 1)).show();

                // focus first input of new fieldset
                focusInput( i - 1 );

                $(submmitButtonName).hide();
//                selectStep(i - 1);
                $('html, body').animate({scrollTop :  ( $('#contour_form_Briefingform').offset().top - 120) },200);
                return false;
            
            });
        }

        function createNextButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append("<div class='step-controls__col step-controls__col--last'><button  id='" + stepName + "Next' class='button button--primary button--next'>Next</button></div>");

            $("#" + stepName + "Next").on("click", function(e) {

                if( isValid( stepName ) ) {
                    $("#" + stepName).hide();
                    $("#step" + (i + 1)).show();

                    // focus first input of new fieldset
                    focusInput( i + 1 );

                    if (i + 2 == count)
                        $(submmitButtonName).show();
    //                selectStep(i + 1);
                    $('html, body').animate({scrollTop :  ( $('#contour_form_Briefingform').offset().top - 120) },200);
                    return false;
                }

            });
        }

        function createPagination(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append('<div class="pager step-controls__col beta"><span class="pager__current">' + (i + 1) + '</span><span class="text--light">/</span><span class="pager--total">' +  steps.length + '</span></div>')
        }

        function isValid( stepName ) {
            return $('#' + stepName).find('input,textarea').valid();
        }

        function focusInput(i) {
            $( "#step" + ( i ) ).find('input[type=text],textarea,select').filter(':visible:first').focus();
        }

/*
        function selectStep(i) {
            $("#steps li").removeClass("current");
            $("#stepDesc" + i).addClass("current");
        }


        
            $('#steps').find('a').on('click', function(e) {
                targetId = $(this).attr('href');
                steps.parent().hide();

                $(targetId).show();

                console.log( targetId )

                e.preventDefault();
            });
        */

    }
})(jQuery); 