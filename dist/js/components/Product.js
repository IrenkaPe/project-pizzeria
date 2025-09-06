import {select, templates, classNames} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import utils from '../utils.js';

class Product{

    constructor(id,data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      console.log('element:', thisProduct.element);
      console.log('element type:', thisProduct.element.nodeType);
      console.log('element tag:', thisProduct.element.tagName);
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

      thisProduct.accordionTrigger.addEventListener('click', function(event) {
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
     
     // app.cart.add(productSummary)
     const event = new CustomEvent('add-to-cart', {
        bubbles:true,
        detail:{
            product:thisProduct.prepareCartProduct(),
        }
     });
     console.log('element:', thisProduct.element)
     thisProduct.element.dispatchEvent(event);
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
  export default Product;