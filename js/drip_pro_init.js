window._drip_pro = new DripPro

window.drip_plinko = function(drip, page) {
	var response = {}
	var context = window.context
	
	if (drip.is_anon) {
		if (context == 'raise') {
			response = {
				offer: 'salary-increase-templates',
				footer: drip.file('salary-increase-templates-footer')
			}
		} else if (context == 'negotiate') {
			response = {
				offer: 'salary-negotiation-templates',
				footer: drip.file('salary-negotiation-templates-footer')
			}	
		} else if (context == 'interview') {
			response = {
				offer: 'tics',
				footer: drip.file('tics-footer')
			}
		}
	} else if (!drip.has_tag('Purchased - FSN - Bundle') && !(context == 'sales-page')) {
		response = {
			offer: 'fsn',
			footer: drip.file('fsn-footer')
		}
	}
					
	return response
}

window.survey_plinko = function(drip) {
	
}

window.drip_replacements = {
	
}

jQuery(function(){
  window._drip_pro.init({
    debug: false,
    template_path: '/ads/',
    survey_trigger: function() {
      return true // If a question is available, should the survey widget be triggered?
    },
    can_display: function(intent, options) {
      return true // Given the "intent" (like modal), should we show it on this page? Useful for checking to see if you're on the checkout page, etc. and forcing DPT offers to not show.
    },
    pre_init: function() {
      this.settings.track = this.settings.track.bind(this)
      // this.settings.score = this.settings.score.bind(this)
      // this.settings.increment_score = this.settings.increment_score.bind(this)
      // this.settings.content_leaderboard = this.settings.content_leaderboard.bind(this)
    },
    post_drip_response: function(payload) {
      this.settings.track()
			if(this.is_anon) {
				console.log("Anonymous");
				$('[data-offer-plinko="optional"]').show();
				$('head').append('<style type="text/css">.drip-lightbox-wrapper { display: block; }</style>');
			}
      // this.settings.score()
      //
      // $.each(this.custom_fields(), function(key, value) {
      //   $('table').append(
      //     $('<tr>').append(
      //       $('<th>').text(key),
      //       $('<td>').text(value)
      //     )
      //   )
      // })
    },
    score: function(drip) {
      // var t = this
      // $('.category-name a').each(function() {
      //   var tag_name = $(this).text()
      //   tag_name = tag_name.toLowerCase().replace(/ /g, '_')
      //   t.settings.increment_score(tag_name, "12345")
      // })
    },
    increment_score: function(category, article_id) {
      // var posts_cache_count = 30
      // if (!article_id) return
      // var category_posts = (this.custom_fields()[category] || '').split(',')
      // category_posts.push(article_id)
      // this.add_custom_field(category, _.uniq(_.filter(category_posts)).join(','))
      // var recent_posts = (this.custom_fields()['recent_posts'] || '').split(',')
      // var o = {} ; o[category] = article_id
      // recent_posts.push(JSON.stringify(o))
      // this.add_custom_field('recent_posts', _.last(_.uniq(_.filter(recent_posts)), posts_cache_count).join(','))
    },
    content_leaderboard: function() {
      // var recent_posts = (this.custom_fields()['recent_posts'] || '').split(',')
      // recent_posts = _.map(_.filter(recent_posts), JSON.parse)
      // total_posts = recent_posts.length
      // var posts_summary = {}
      // _.each(recent_posts, function(tuple) {
      //   var key = _.keys(tuple)[0]
      //   var value = tuple[key]
      //   posts_summary[key] = posts_summary[key] || []
      //   posts_summary[key].push(value)
      // })
      // _.each(posts_summary, function(value, key) {
      //   percent = value.length / total_posts
      //   posts_summary[key] = percent
      // })
      // var posts_ranked = _.sortBy(_.pairs(posts_summary), function(arr) {
      //   return arr[1]
      // }).reverse()
      // return posts_ranked
    },
    track: function() {
      var traits = { anon: true }
      if (!this.is_anon) {
        traits = {
          anon: false,
          email: this.drip_contact.email,
          firstName: this.custom_fields()['MS_FNAME'],
          lastName: this.custom_fields()['MS_LNAME']
        }
        $.each(this.tags(), function(idx, key) {
          traits[key] = true
        })
      }

      traits = $.extend(traits, this.custom_fields())

			var pageName = document.title.replace(' | Fearless Salary Negotiation','').replace(' | Get Your Next Raise','')

      if (pageName.length) {
        this.add_tag('Read - ' + pageName)
				console.log("Tags: " + this.tags())
      }
    },
    survey_widget: function(survey, drip) {

    },
    renderers: {
		  footer: function(intent, content, options) {
		      var os = jQuery.extend({
						percent_scrolled_threshold: 25,
						windows_scrolled_threshold: 3
		      }, options)

		      if (this.dom_slider)
		          this.dom_slider.remove()
					
					var dptScope = this
		      var dom = jQuery(content)
					var ga_event_label = dom.find('#slider-cta').data("event-label")
					var cta_label = dom.find('#slider-cta').data("cta-label")
					this.dom_slider = dom
					
					// If this particular slider has already been dismissed, do nothing
          if (dptScope.storage.get(cta_label+'_dismissed')) return
						
		      jQuery('body').append(dom)
		      var has_scrolled = false
		      jQuery(window).scroll(function() {
		          var scroll_speed = 800;
		          var wintop = jQuery(window).scrollTop(),
		              docheight = jQuery(document).height(),
		              winheight = jQuery(window).height()
		          percent_scrolled = ((wintop / (docheight - winheight)) * 100)
		          if ((docheight - wintop) < 900) {
		              dom.removeClass('expanded')
		          } else if ((percent_scrolled > os.percent_scrolled_threshold) || (wintop > (winheight * os.windows_scrolled_threshold))) {
		              if (!has_scrolled) {
	                  this.debug('Displaying slider')
	                  has_scrolled = true
	                  $(document).trigger('dpt:slide', [new this.fn_helper(this), this])
										ga('send', {
											hitType: 'event',
											eventCategory: 'Slider',
											eventAction: 'Show ad',
											eventLabel: ga_event_label,
											nonInteraction: 1
										});
		              }
		              dom.addClass('expanded')
		          }
		      }.bind(this))
					
					// Set up a handler for the Click event on the slide-in ad
					var cta_link = document.getElementById('slider-cta');
					var click_event_label = cta_link.dataset.eventLabel;

					var ctaButtonHandler = function(event) {

					  // Prevents the browser from clicking the link
					  // and thus unloading the current page.
					  event.preventDefault();

					  // Creates a timeout to call `clickLink` after 250ms.
					  setTimeout(clickLink, 250);

					  // Keeps track of whether or not the link has been clicked.
					  // This prevents the link from being clicked twice in cases
					  // where `hitCallback` fires normally.
					  var linkClicked = false;

					  function clickLink() {
					    if (!linkClicked) {
					      linkClicked = true;
							  cta_link.removeEventListener('click', ctaButtonHandler);
						    cta_link.click();
					    }
					  }

					  // Sends the event to Google Analytics and
					  // re-clicks the link once the hit is done.
						ga('send', {
							hitType: 'event',
							eventCategory: 'Slider',
							eventAction: 'Click ad',
							eventLabel: click_event_label,
							nonInteraction: 1
						});
					};
					
					// Adds a listener for the "click" event.
					cta_link.addEventListener('click', ctaButtonHandler);

					$(function() {
					// dismiss when clicked
						var cta_dismissal_link = $('#slider-dismiss-cta');
						var ga_dismiss_event_label = $('#slider-cta').data("event-label");
						var dismiss_cta_label = $('#slider-cta').data("cta-label");

						cta_dismissal_link.click(function(event){
							 event.preventDefault();
							 $('#slider-ad').slideUp('fast', function() {
								 $('#slider-ad').remove();
							 });
							 ga('send', {
							 	hitType: 'event',
							 	eventCategory: 'Slider',
							 	eventAction: 'Close ad',
							 	eventLabel: ga_dismiss_event_label,
							 	nonInteraction: 1
							 });
							 
							 // localStorage to 'cookie' them so they don't see the ad again for 5 days
							 dptScope.storage.set(dismiss_cta_label+'_dismissed', '1', 5*86400000 );
						});
					});
		  }
    }
  })
})