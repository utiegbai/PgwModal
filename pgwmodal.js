/**
 * PgwModal - Version 1.0
 *
 * Copyright 2014, Jonathan M. Piat
 * http://pgwjs.com - http://pagawa.com
 * 
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
;(function($){
    $.pgwModal = function(obj) {

        var pgwModal = {};	
        var defaults = {
            close: true,
            maxWidth: 500,
            loading: 'Loading in progress...',
            error: 'An error has occured. Please try again in a few moments.'
        };

        if (typeof window.pgwModalObject != 'undefined') {
            pgwModal = window.pgwModalObject;
        }

        // Merge the defaults and the user's config
        if ((typeof obj == 'object') && (! obj.pushContent)) {
            if (! obj.url && ! obj.target && ! obj.content) {
                throw new Error('PgwModal - There is no content to display, please provide a config parameter : "url", "target" or "content"');
            }

            pgwModal.config = {};
            pgwModal.config = $.extend({}, defaults, obj);
            window.pgwModalObject = pgwModal;
        }

        // Create modal container
        var create = function() {
            var appendBody = '<div id="pgwModalWrapper"></div>'
                + '<div id="pgwModal">'
                + '<div class="pmContainer">'
                + '<div class="pmBody">'
                + '<a href="javascript:void(0)" class="pmClose" onclick="$.pgwModal(\'close\')"><span></span></a>'
                + '<div class="pmTitle"></div>'
                + '<div class="pmContent cntr"></div>'
                + '</div>'
                + '</div>'
                + '</div>';
            $('body').append(appendBody);
            return true;
        };

        // Reset modal container
        var reset = function() {
            $('#pgwModal .pmTitle, #pgwModal .pmContent').html('');
            return true;
        };

        // Angular compilation
        var angularCompilation = function() {
            angular.element('body').injector().invoke(function($compile) {
                var scope = angular.element($('#pgwModal .pmContent')).scope();
                $compile($('#pgwModal .pmContent'))(scope);
                scope.$digest();
            });
            return true;
        };

        // Push content into the modal
        var pushContent = function(content) {
            $('#pgwModal .pmContent').html(content);
            if (pgwModal.config.angular) {
                angularCompilation();
            }
            reposition();
            return true;
        };

        // Repositions the modal
        var reposition = function() {
            var windows_height = $(window).height();
            var modal_height = $('#pgwModal .pmBody').height();
            var margin_top = Math.round((windows_height - modal_height)/3);
            if (margin_top <= 0) {
                margin_top = 10;
            }
            $('#pgwModal .pmBody').css('margin-top', margin_top);
            return true;
        };

        // Returns the modal data
        var getData = function() {
            return pgwModal.config.modalData;
        };

        // Close the modal
        var close = function() {
            $('#pgwModal, #pgwModalWrapper').hide();
            $('body').removeClass('pgwModal');
            reset();
            delete window.pgwModalObject;
            return true;
        };

        // Open the modal
        var open = function() {
            if ($('#pgwModal').length == 0) {
                create();
            } else {
                reset();
            }

            if (! pgwModal.config.close) {
               $('#pgwModal .pmClose').hide();
            } else {
                $('#pgwModal .pmClose').show();
            }

            if (pgwModal.config.title) {
                $('#pgwModal .pmTitle').text(pgwModal.config.title);
            }

            if (pgwModal.config.maxWidth) {
                $('#pgwModal .pmBody').css('max-width', pgwModal.config.maxWidth);
            }

            // Content loaded by Ajax
            if (pgwModal.config.url) {
                if (pgwModal.config.loading) {
                    $('#pgwModal .pmContent').html(pgwModal.config.loading);
                }

                var ajaxOptions = {
                    'url' : obj.url,
                    'success' : function(data) {
                        pushContent(data);
                    },
                    'error' : function() {
                        $('#pgwModal .pmContent').html(pgwModal.config.error);
                    }
                };

                if (pgwModal.config.ajaxOptions) {
                    ajaxOptions = $.extend({}, ajaxOptions, pgwModal.config.ajaxOptions);
                }

                $.ajax(ajaxOptions);
                
            // Content loaded by a html element
            } else if (pgwModal.config.target) {
                pushContent($(pgwModal.config.target).html());

            // Content loaded by a html element
            } else if (pgwModal.config.content) {
                pushContent(pgwModal.config.content);
            }

            $('#pgwModal, #pgwModalWrapper').show();
            $('body').addClass('pgwModal');			
            return true;
        };

        // Choose the action
        if ((typeof obj == 'string') && (obj == 'close')) {
            return close();

        } else if ((typeof obj == 'string') && (obj == 'reposition')) {
            return reposition();

        } else if ((typeof obj == 'string') && (obj == 'getData')) {
            return getData();

        } else if ((typeof obj == 'object') && (obj.pushContent)) {
            return pushContent(obj.pushContent);

        } else if (typeof obj == 'object') {
            return open();
        }
    }
})(jQuery);
