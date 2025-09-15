import {settings, select, classNames, templates} from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart {
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      thisCart.getElements(element); 
      thisCart.initActions();
      //console.log('new cart: ', thisCart);
    }

    getElements(element){

      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    }

    initActions(){
      // cliknięcie my cart -pokazuje/ukrywa koszyk
      const thisCart = this;

      // Cliknięcie "My cart" pokazuje/ukrywa koszyk
      thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });

      // Nasłuchuj zdarzenia 'updated' na liście produktów, aby zawsze aktualizować koszyk
      thisCart.dom.productList.addEventListener('updated', function() {
        thisCart.update();
      });

      thisCart.dom.productList.addEventListener('remove',function(event){
        event.preventDefault();
         thisCart.remove(event.detail.cartProduct);

      })
      thisCart.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisCart.sendOrder();
      })
    
    }
    remove(cartProduct){
      const thisCart =this;
      cartProduct.element.remove();

      const index = thisCart.products.indexOf(cartProduct);
      if(index !== -1){
        thisCart.products.splice(index, 1);
      }
      thisCart.update();
    }

    add (menuProduct){
      
      const thisCart = this;

      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      thisCart.dom.productList.appendChild(generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

      thisCart.update();
    }

    update(){
      const thisCart = this;

      const deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;

      for (let product of thisCart.products) {
        thisCart.totalNumber += product.amount;
        thisCart.subtotalPrice += product.price;
      }

      thisCart.totalPrice = 0;
      if (thisCart.totalNumber > 0) {
        thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
      } else {
        thisCart.totalPrice = 0;
      }
      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
      thisCart.dom.deliveryFee.innerHTML = deliveryFee;
      for(let priceElem of thisCart.dom.totalPrice){
        priceElem.innerHTML = thisCart.totalPrice;
      }
      //console.log('total price:', thisCart.totalPrice);
    }

    sendOrder(){
      const thisCart = this;

      const url = settings.db.url + '/' + settings.db.orders;
      const payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.subtotalPrice,
        totalNumber: thisCart.totalNumber,
        deliveryFee: settings.cart.defaultDeliveryFee,
        products: []
      }
      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url, options)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          console.log ('parsedResponse', parsedResponse); 
        })
        .catch(function(error) {
         console.error('Error sending order:', error);
        });
    }
  }
  export default Cart;