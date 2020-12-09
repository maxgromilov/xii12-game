import $ from 'jquery'; window.jQuery = $; window.$ = $; jQuery = $;// import module example (npm i -D jquery)
require('owl.carousel') // https://owlcarousel2.github.io/OwlCarousel2/
import {theme} from '../../tailwind.config.js' //
const {color, screens} = theme 

document.addEventListener('DOMContentLoaded', () => {

})
window.onload = ()=> {
	$('.section-nav__burger').on('click', function() {
		$('.section-nav__nav').toggleClass('section-nav__nav--open')
	})

	$('.dropdown__button').on('click', function() {
		// console.log(
			$(this).parent(".dropdown").find('.dropdown__list').toggleClass('hidden')
		// )
	})
	setTimeout(() => {
			
		//- Документация https://owlcarousel2.github.io/OwlCarousel2/
		$('#game-carousel').owlCarousel({
			margin: 30,
			autoWidth: true,
			// dots: false,
			nav: true,
			responsive : {
				0 : {
					autoHeight: true,
					autoWidth: false,
					items: 1,
					// dots: false,
				},
	
				640: {
					items: 2,
					autoHeight: true,
					// dots: false,
				},
				
				768 : {
					items: 2,
					
				},
				
				1280 : {
					items: 3
	
				},
				1536 : {
					items: 3
				}
			}
		});

		//- Документация https://owlcarousel2.github.io/OwlCarousel2/
		$('#main-carousel').owlCarousel({
			margin:30,
			autoHeight:true,
			nav: true,
			
			responsive : {
				
				0 : {
					
					items: 1,
					// dots: false,
				},
				
				768 : {
					items: 2,
					// dots: false,
					
				},
				
				1280 : {
					items: 3
	
				},
				1536 : {
					items: 3
				}
			}
		});	

	}, 500);
	

}

