(function ($) {
	"use strict";

	$(window).load(function () {
		for (var key in qodefCore.shortcodes) {
			for (var keyChild in qodefCore.shortcodes[key]) {
				qodefElementor.init(key, keyChild);
			}
		}
		
		qodefElementorSection.init();
		elementorSection.init();
	});
	
	var qodefElementor = {
		init: function (key, keyChild) {
			$(window).on('elementor/frontend/init', function (e) {
				elementorFrontend.hooks.addAction('frontend/element_ready/' + key + '.default', function (e) {
					// Check if object doesn't exist and print the module where is the error
                    if (typeof qodefCore.shortcodes[key][keyChild] === 'undefined') {
                        console.log(keyChild);
                    }

                    qodefCore.shortcodes[key][keyChild].init();
				});
			});
		}
	};
	
	var qodefElementorSection = {
		init: function () {
			$(window).on('elementor/frontend/init', function () {
				elementorFrontend.hooks.addAction('frontend/element_ready/section', elementorSection.init);
			});
		}
	};
	
	var elementorSection = {
		init: function ($scope) {
			var $target = $scope,
				isEditMode = Boolean(elementorFrontend.isEditMode()),
				settings = [],
				sectionData = {};
			
			//generate parallax settings
			if (isEditMode && typeof $scope !== 'undefined') {
				// generate options when in admin
				var editorElements = window.elementor.elements,
					sectionId = $target.data('id');
				
				$.each(editorElements.models, function (index, object) {
					if (sectionId === object.id) {
						sectionData = object.attributes.settings.attributes;
					}
				});

				if (typeof sectionData.qodef_enable_parallax !== 'undefined') {
					settings['enable_parallax'] = sectionData.qodef_enable_parallax;
				}
				
				if (typeof sectionData.qodef_parallax_image !== 'undefined' && sectionData.qodef_parallax_image['url']) {
					settings['image_url'] = sectionData.qodef_parallax_image['url'];
				}
				
				if (typeof sectionData.qodef_parallax_height !== 'undefined') {
					settings['section_height'] = sectionData.qodef_parallax_height;
				}

				// angled shape
				if( typeof sectionData.qodef_enable_angled_shape_top !== 'undefined' ){
					settings['enable_angled_shape_top'] = sectionData.qodef_enable_angled_shape_top;
				}

                if( typeof sectionData.qodef_angled_shape_top_text !== 'undefined' ){
					settings['angled_shape_top_text'] = sectionData.qodef_angled_shape_top_text;
				}

                if( typeof sectionData.qodef_angled_shape_top_text_link !== 'undefined' ){
					settings['angled_shape_top_text_link'] = sectionData.qodef_angled_shape_top_text_link;
				}

                if( typeof sectionData.qodef_angled_shape_top_fill !== 'undefined' ){
					settings['angled_shape_top_fill'] = sectionData.qodef_angled_shape_top_fill;
				}

                // angled shape bottom
                if( typeof sectionData.qodef_enable_angled_shape_bottom !== 'undefined' ){
                    settings['enable_angled_shape_bottom'] = sectionData.qodef_enable_angled_shape_bottom;
                }

                if( typeof sectionData.qodef_angled_shape_bottom_text !== 'undefined' ){
                    settings['angled_shape_bottom_text'] = sectionData.qodef_angled_shape_bottom_text;
                }

                if( typeof sectionData.qodef_angled_shape_bottom_text_link !== 'undefined' ){
                    settings['angled_shape_bottom_text_link'] = sectionData.qodef_angled_shape_bottom_text_link;
                }

                if( typeof sectionData.qodef_angled_shape_bottom_fill !== 'undefined' ){
                    settings['angled_shape_bottom_fill'] = sectionData.qodef_angled_shape_bottom_fill;
                }
				
			} else {
				// generate options when in frontend using global js variable
				var sectionHandlerData = qodefElementorGlobal.vars.elementorSectionHandler;
				var angledShapeInBackgroundSectionData = qodefElementorGlobal.vars.elementorAngledShapeInBackgroundSection;
				var angledShapeBottomInBackgroundSectionData = qodefElementorGlobal.vars.elementorAngledShapeBottomInBackgroundSection;
				
				$.each(sectionHandlerData, function (index, property) {
					$target = $('[data-id="' + index + '"]');
					settings['image_url'] = property[0].url;
					settings['section_height'] = property[1];
					
					if (typeof settings['image_url'] !== 'undefined') {
						settings['enable_parallax'] = 'yes';
					}
					
					//generate output
					if (typeof $target !== 'undefined' && $target.length) {
						elementorSection.generateOutput($target, settings);
					}
				});

				$.each( angledShapeInBackgroundSectionData, function( index, property ){
					$target = $('[data-id="' + index + '"]');
					settings['angled_shape_top_text'] = property[0];
					settings['angled_shape_top_text_link'] = property[1];
					settings['angled_shape_top_fill'] = property[2];
                    settings['enable_angled_shape_top'] = property[3];

					if(typeof settings['enable_angled_shape_top'] !== 'undefined' && settings['enable_angled_shape_top'] !== 'yes' ){
						settings['enable_angled_shape_top'] = 'yes';
					}

					//generate output
					if( typeof $target !== 'undefined' && $target.length ){
						elementorSection.generateAngledShapeInBackgroundOutput($target, settings);
					}
				})

                $.each( angledShapeBottomInBackgroundSectionData, function( index, property ){
                    $target = $('[data-id="' + index + '"]');
                    settings['angled_shape_bottom_text'] = property[0];
                    settings['angled_shape_bottom_text_link'] = property[1];
                    settings['angled_shape_bottom_fill'] = property[2];
                    settings['enable_angled_shape_bottom'] = property[3];

                    if(typeof settings['enable_angled_shape_bottom'] !== 'undefined' && settings['enable_angled_shape_bottom'] !== 'yes' ){
                        settings['enable_angled_shape_bottom'] = 'yes';
                    }

                    //generate output
                    if( typeof $target !== 'undefined' && $target.length ){
                        elementorSection.generateAngledShapeBottomInBackgroundOutput($target, settings);
                    }
                })
			}
			
			//generate output
			if( typeof $target !== 'undefined' ){
				elementorSection.generateOutput($target, settings);
				elementorSection.generateAngledShapeInBackgroundOutput($target, settings);
                elementorSection.generateAngledShapeBottomInBackgroundOutput($target, settings);
			}
		},
		generateOutput: function ($target, settings) {
			$('.qodef-parallax-img-holder', $target).remove();
			$target.removeClass('qodef-parallax qodef--parallax-row');
			$target.css({'overflow': 'hidden'});
			
			if (typeof settings['enable_parallax'] !== 'undefined' && settings['enable_parallax'] == 'yes' && typeof settings['image_url'] !== 'undefined') {
				var $layout = null;
				
				$target.addClass('qodef-parallax qodef--parallax-row');
				$target.css({'height': settings['section_height'], 'background': 'transparent'});
				
				$layout = $('<div class="qodef-parallax-img-holder"><div class="qodef-parallax-img-wrapper"><img src="' + settings['image_url'] + '" alt="Parallax image"></div></div>').prependTo($target);
				
				//wait for image src to be loaded
				var newImg = new Image;
				newImg.onload = function () {
					$target.find('img').attr('src', this.src);
					qodefCore.qodefParallaxBackground.init();
				};
				newImg.src = settings['image_url'];
			}
		},
		generateAngledShapeInBackgroundOutput: function($target, settings){
			$( '.qodef-angled-shape-inner', $target ).remove();
			$target.css({'overflow':'visible'});

			if( typeof settings['enable_angled_shape_top'] !== 'undefined' && settings['enable_angled_shape_top'] !== 'no' ){
				var $layout = null;
				var $fill = '#eaeaea';
                var $text = '';
				
				if( typeof settings['angled_shape_top_fill'] !== 'undefined' && settings['angled_shape_top_fill'] !== '' ) {
					$fill = settings['angled_shape_top_fill'];
				}

                if( typeof settings['angled_shape_top_text'] !== 'undefined' && settings['angled_shape_top_text'] !== '' ) {
                    $text = '<span class="qodef-anchor-text">' + settings['angled_shape_top_text'] + '</span>';
                }
				
				if( typeof settings['angled_shape_top_text_link'] !== 'undefined' && settings['angled_shape_top_text_link'] ) {
					$layout = $(
						'<div class="qodef-angled-shape-inner"><svg preserveAspectRatio="none" width="100%" height="110px" viewBox="0 0 110 110" enable-background="new 0 0 100% 110" xml:space="preserve">\n' +
						'<polygon fill="'+$fill+'" points="0,110 55,0 110,110"/>\n' +
						'</svg>' +
						'<div class="qodef-anchor-holder"><a target="_blank" href="'+settings['angled_shape_top_text_link']+'"><svg class="qodef-anchor-arrow" width="23" height="40" viewBox="0 0 22.76 39.79"><line x1="0.27" y1="0.26" x2="22.25" y2="22.31"/><line x1="0.27" y1="39.52" x2="22.5" y2="17.29"/></svg>'+$text+'</a>' +
						'</div>' +
						'</div>' ).prependTo( $target );
				} else {
					$layout = $(
						'<div class="qodef-angled-shape-inner"><svg preserveAspectRatio="none" width="100%" height="110px" viewBox="0 0 110 110" enable-background="new 0 0 100% 110" xml:space="preserve">\n' +
						'<polygon fill="'+$fill+'" points="0,110 55,0 110,110"/>\n' +
						'</svg>' +
						'</div>' ).prependTo( $target );
				}
			}
		},
		generateAngledShapeBottomInBackgroundOutput: function($target, settings){
			$( '.qodef-angled-shape-inner-bottom', $target ).remove();
			$target.css({'overflow':'visible'});

			if( typeof settings['enable_angled_shape_bottom'] !== 'undefined' && settings['enable_angled_shape_bottom'] !== 'no' ){
				var $layout = null;
				var $fill = '#eaeaea';
                var $text = '';

				if( typeof settings['angled_shape_bottom_fill'] !== 'undefined' && settings['angled_shape_bottom_fill'] !== '' ) {
					$fill = settings['angled_shape_bottom_fill'];
				}

                if( typeof settings['angled_shape_bottom_text'] !== 'undefined' && settings['angled_shape_bottom_text'] !== '' ) {
                    $text = '<span class="qodef-anchor-text">' + settings['angled_shape_bottom_text'] + '</span>';
                }

				if( typeof settings['angled_shape_bottom_text_link'] !== 'undefined' && settings['angled_shape_bottom_text_link'] ) {
					$layout = $(
						'<div class="qodef-angled-shape-inner-bottom"><svg preserveAspectRatio="none" width="100%" height="110px" viewBox="0 0 110 110" enable-background="new 0 0 100% 110" xml:space="preserve">\n' +
						'<polygon fill="'+$fill+'" points="0,110 55,0 110,110"/>\n' +
						'</svg>' +
						'<div class="qodef-anchor-holder"><a target="_blank" href="'+settings['angled_shape_bottom_text_link']+'">'+$text+'<svg class="qodef-anchor-arrow" width="23" height="40" viewBox="0 0 22.76 39.79"><line x1="0.27" y1="0.26" x2="22.25" y2="22.31"/><line x1="0.27" y1="39.52" x2="22.5" y2="17.29"/></svg></a>' +
						'</div>' +
						'</div>' ).prependTo( $target );
				} else {
					$layout = $(
						'<div class="qodef-angled-shape-inner-bottom"><svg preserveAspectRatio="none" width="100%" height="110px" viewBox="0 0 110 110" enable-background="new 0 0 100% 110" xml:space="preserve">\n' +
						'<polygon fill="'+$fill+'" points="0,110 55,0 110,110"/>\n' +
						'</svg>' +
						'</div>' ).prependTo( $target );
				}
			}
		}
	};
	
})(jQuery);
