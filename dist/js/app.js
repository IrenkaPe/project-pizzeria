import { settings, select, classNames } from './settings.js'
import Product from './components/Product.js'
import Cart from './components/Cart.js'
import Booking from './components/Booking.js'
import Home from './components/Home.js'

const app = {
  
	initPages: function () {
		const thisApp = this

		thisApp.pages = document.querySelector(select.containerOf.pages).children;

		thisApp.navLinks = document.querySelectorAll(select.nav.links);
	
		const idFromHash = window.location.hash.replace('#/', '');
		let pageMatchingHash = thisApp.pages[0].id
		for (let page of thisApp.pages) {
			if (page.id == idFromHash) {
				pageMatchingHash = page.id
				break
			}
		}

		thisApp.activatePage(pageMatchingHash); //znajdujemy podstrony

		for (let link of thisApp.navLinks) {
			link.addEventListener('click', function (event) {
				const clickedElement = this
				event.preventDefault()
				
				const id = clickedElement.getAttribute('href').replace('#', '');
				thisApp.handleNavigation(id)

				//change URL hash - dodajemy adresy podstron!!
				window.location.hash = '#/' + id
			})
		}
	},

	activatePage: function (pageId) {
		//console.log('Activating page:', pageId);
		const thisApp = this
		
		for (let page of thisApp.pages) {
			page.classList.toggle(classNames.pages.active, page.id === pageId)
		}//toggle - można mu nadać drugi  argument = możemy mu dać warunek z klasy if
		for (let link of thisApp.navLinks) {
			link.classList.toggle(classNames.nav.active, link.getAttribute('href') === '#' + pageId) 
		}
	},

  handleNavigation:function(pageId){
    const thisApp = this;
    thisApp.activatePage(pageId);
    window.location.hash = '#/'+ pageId;
  },

	initMenu: function () {
		const thisApp = this;

		for (let productData of thisApp.data.products) {
			new Product(productData.id, productData)
		}
	},

	initData: function () {
		const thisApp = this

		thisApp.data = {}
		const url = settings.db.url + '/' + settings.db.products
		//console.log('Fetching data from:', url);
		fetch(url)
			.then(function (rawResponse) {
				return rawResponse.json()
			})
			.then(function (parsedResponse) {
				//console.log('Parsed response:', parsedResponse);
				/* save parsedResponse to thisApp.data.products */
				thisApp.data.products = parsedResponse
				/* now you can call initMenu() to render the products */
				thisApp.initMenu()
			})
	},

	initCart: function () {
		const thisApp = this

		const cartElem = document.querySelector(select.containerOf.cart)
		thisApp.cart = new Cart(cartElem)

		thisApp.productList = document.querySelector(select.containerOf.menu)
		thisApp.productList.addEventListener('add-to-cart', event => {
			app.cart.add(event.detail.product)
		})
	},

	initBooking: function () {
		const thisApp = this
		const bookingWidget = document.querySelector(select.containerOf.booking)
		thisApp.booking = new Booking(bookingWidget)
	},

	initHome: function () {
		const thisApp = this
		const homeContainer = document.querySelector(select.containerOf.home)
		thisApp.home = new Home(homeContainer, thisApp);
	},


	init: function () {
		const thisApp = this
		//console.log('*** App starting ***');
		//console.log('thisApp:', thisApp);
		//console.log('classNames:', classNames);
		//console.log('settings:', settings);
		//console.log('templates:', templates);
		
		thisApp.initData()
		thisApp.initCart()
		thisApp.initPages()
		thisApp.initBooking()
    thisApp.initHome()
	},
}

app.init()
window.app = app;

export { app }
