import {settings, select, templates, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';


  const app = {

    initMenu: function(){
      const thisApp = this;

      console.log('thisApp.data:', thisApp.data);
      for(let productData of thisApp.data.products){
        new Product(productData.id, productData);
      }
      /*for(let productData in thisApp.data.products){
       // new Product(productData,thisApp.data.products[productData]);
       new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }*/
    },

    initData: function() {
      const thisApp = this;

      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
      console.log('Fetching data from:', url);
      fetch(url)
        .then(function(rawResponse) {
          return rawResponse.json();
        })
        .then(function(parsedResponse) {
          console.log('Parsed response:', parsedResponse);
          /* save parsedResponse to thisApp.data.products */
          thisApp.data.products = parsedResponse; 
          /* now you can call initMenu() to render the products */
          thisApp.initMenu(); 
        });
    },

    initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart (cartElem);

    thisApp. productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', (event)=>{
      app.cart.add(event.detail.product);

    })
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
    
    thisApp.initData();  
    
    thisApp.initCart();
    },
  }
  app.init();

  export {app};

