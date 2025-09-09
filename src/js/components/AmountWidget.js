import {settings, select} from '../settings.js';
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
   export default AmountWidget;