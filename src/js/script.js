/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
  templateOf: {
    menuProduct: "#template-menu-product",
    cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
    db: {
      url: '//localhost:3131',
      products: 'products',
      orders: 'orders',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };

  class Product{

    constructor(id,data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      console.log('new Product:',thisProduct);
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget(); 
      thisProduct.processOrder();

    }

    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /* create element DOM  using utils.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /* find menu container*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* add element to menu*/
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
     
    }
    
    initAccordion(){
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      /*const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);*/
    /* START: add event listener to clickable trigger on event click */
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
      /* prevent default action for event */
      event.preventDefault();
      console.log('Kliknięto produkt:', thisProduct.data.name);
      /* find active product (product that has active class) */
      const activeProduct = document.querySelector(select.all.menuProductsActive);
      /* if there is active product and it's not thisProduct.element, remove class active from it */
      if (activeProduct && activeProduct !== thisProduct.element) {
          console.log('zamknęłam produkt: ', activeProduct);
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
      /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      });
    }

    initOrderForm(){
      const thisProduct = this;
      console.log(this.initOrderForm);
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart()
      });
    }

    processOrder() {
    const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']} - co zostało zaznaczone na stronie
    const formData = utils.serializeFormToObject(thisProduct.form);
    console.log('formData', formData);

    // set price to default price
    let priceSingle = thisProduct.data.price;

    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      console.log(paramId, param);

      // for every option in this category
      for(let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        console.log(optionId, option);

        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        //czy w form data istnieje właściwość o nazwie zgodnej z kategorią i czy zawiera ona nazwę sprawdzanej opcji - czy została zaznaczona ten produkt i czy zaznaczony obiekt zawiera zaznaczoną opcję
        if(optionSelected){
          //sprawdz czy nie jest default !
          if (!option.default) {
            //dodaj cenę do ceny
            priceSingle += option.price;
          }
        } else {
          if(option.default) {
            // check if the option is default
            priceSingle -= option.price;
            // reduce price variable
          }
        }

        const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        console.log ('optionImage: ', optionImage);
        // w tym produkcie we weaperze znajdujemy paramID -optionID
        if (optionImage){
          //jeżeli w formularzu został zaznaczony produkt ze składnikiem to dodaj class active

          if(optionSelected){
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          }
          // jeżeli opcja nie jest wybrana to zabierz class active
          else {optionImage.classList.remove(classNames.menuProduct.imageVisible);

          }
        }
      }
    }
    const amount = thisProduct.amountWidget.value;
    const priceTotal = priceSingle * amount

    thisProduct.priceSingle = priceSingle;
    thisProduct.priceTotal = priceTotal;

    thisProduct.priceElem.innerHTML = priceTotal;
    //wyświetl całkowitą cenę w HTML
    }

    initAmountWidget(){
      const thisProduct = this;
      //obsługuje klikniecie +/- wysyła event updated 
      // widget ilości
      thisProduct.amountWidget = new AmountWidget (thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated',function() //nasłuchuje event update
      {thisProduct.processOrder();});// przelicz cenę
    }
    
    addToCart(){
      const thisProduct = this;
     //stała podsumowanie productu
      const productSummary = thisProduct.prepareCartProduct();
      //dodaj do koszyka tylko podsumowanie productu
      app.cart.add(productSummary)
    }

    prepareCartProduct(){

      const thisProduct = this;
      const productSummary =
       { 
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
        //price: thisProduct.priceElem.innerHTML,
        priceSingle: thisProduct.priceSingle,
        price :thisProduct.priceTotal,
        params : thisProduct.prepareCartProductParams(),
       };
      return productSummary;

    }

    prepareCartProductParams(){
      const thisProduct = this;
      //przekazanie obiektu z opcjami do koszyka

      const formData = utils.serializeFormToObject(thisProduct.form); //pobieranie danych z formularza
      console.log('formData:', formData);
      const params = {}; // tu zapisujemy wybrane opcje - utwórz pusty obiekt
  
    // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        console.log(paramId, param);
    
        //create category param in pams / tworzymmy miejsce w obiekcie dla tej kategorii
        params[paramId] = {
        label: param.label,  // np. 'Sauce'
        options: {}          // na start pusty – tu dodamy wybrane opcje
        };
        // for every option in this category /  Przejdź po każdej opcji w tej kategorii (np. tomato, cream)
        for (let optionId in param.options) {
          const option = param.options[optionId];
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        
          //  Sprawdź, czy opcja jest zaznaczona
          if (optionSelected) {
        //  Dodaj opcję do options w tej kategorii
          params[paramId].options[optionId] = option.label;
      // np. params.sauce.options.tomato = 'Tomato';
          }
        }
      }
      return params;
    }
  }
  
  class AmountWidget {
    //obsługuje zmiane ilości produktu
    constructor (element){
      const thisWidget = this;
      
      thisWidget.getElements(element);

      const inputValue = thisWidget.input.value;
      const defaultValue = settings.amountWidget.defaultValue;
      
      if(inputValue){
        thisWidget.setValue(inputValue)
      }
      else {
        thisWidget.setValue(defaultValue)
      }

      thisWidget.initActions();
    }

    getElements(element){
      const thisWidget = this ;

      thisWidget.element = element;

      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    
    }

    setValue(value){

      const thisWidget = this;

      const newValue = parseInt(value);
      // Konwertuje na liczbę

      if(
        thisWidget.value !== newValue &&
        !isNaN(newValue) &&
        newValue <= settings.amountWidget.defaultMax &&
        newValue >= settings.amountWidget.defaultMin 
        ) {
        thisWidget.value = newValue;
      }
       thisWidget.input.value = thisWidget.value;
       thisWidget.announce();

    }
    // jeżeli thisWidget.value to nowa wartośc&& nie jest null/tekstem && to nowa wartość zostaje przyjeta jezeli warunek nie jest spełniony to pozostaje wcześniejsza
    initActions() {
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function () {
        thisWidget.setValue (thisWidget.input.value)});

      thisWidget.linkDecrease.addEventListener('click', function(event){ 
        event.preventDefault();
        thisWidget.setValue (thisWidget.value - 1);
      });
      
      thisWidget.linkIncrease.addEventListener('click', function (event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }
    announce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', { 
        bubbles: true  
      });
      thisWidget.element.dispatchEvent(event);   
    }
  }

  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      thisCart.getElements(element); 
      thisCart.initActions();
      console.log('new cart: ', thisCart);
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
      console.log('total price:', thisCart.totalPrice);
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

  class CartProduct {
    constructor(menuProduct,element){
      const thisCartProduct = this;
       // instancje pojedyńczych produktów w koszyku
      //menuProduct
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.params= menuProduct.params;

      //zapisz element DOM
      thisCartProduct.element = element;
      
      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();

    }
    getElements(element){
      const thisCartProduct = this;

      thisCartProduct.dom ={};//pusty obiekt na referencje DOM
      thisCartProduct.dom.wrapper = element;// główny kontener produktu w koszyku 
      thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);

    }
    getData (){
      const thisCartProduct = this; 
      return {
        id:thisCartProduct.id,
        name:thisCartProduct.name,
        price:thisCartProduct.price,
        amount:thisCartProduct.amount,
        priceSingle: thisCartProduct.priceSingle,
        params:thisCartProduct.params,
      }
    }
    initAmountWidget(){
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget (thisCartProduct.dom.amountWidget);

      thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
        const newValue = thisCartProduct.amountWidget.value;
        thisCartProduct.amount = newValue;
        thisCartProduct.price = thisCartProduct.priceSingle * newValue;

        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
        app.cart.update(); 
      });

    }

    remove(){
      const thisCartProduct =this;

      const event = new CustomEvent ('remove', {
        bubbles: true,
        detail:{ 
          cartProduct: thisCartProduct,
        }
      })
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }

    initActions(){
      const thisCartProduct = this;
      thisCartProduct.dom.remove.addEventListener('click',function(event){
        event.preventDefault();
        thisCartProduct.remove();
      })
    }

    
  }

  const app = {

    initMenu: function(){
      const thisApp = this;

      console.log('thisApp.data:', thisApp.data);
      for(let productData in thisApp.data.products){
       // new Product(productData,thisApp.data.products[productData]);
       new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initData: function() {
      const thisApp = this;

      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
      fetch(url)
        .then(function(rawResponse) {
          return rawResponse.json();
        })
        .then(function(parsedResponse) {
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
}
