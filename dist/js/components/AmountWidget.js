import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';// zaimportowanie class widget

class AmountWidget extends BaseWidget {//clasa amount jest rozszerzeniem klasy BaseWidget
    //obsługuje zmiane ilości produktu
    constructor (element){
      super(element, settings.amountWidget.defaultValue);// wywołanie construktora klasy nadrzędnej 
      const thisWidget = this;
      
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.dom.input.value || settings.amountWidget.defaultValue);//operator logiczny OR (||) najpierw spradza lewą strone jeżeli jest prawdziwa to nie sprawdza dalej
    
      thisWidget.initActions();
      console.log('AmountWidget:', thisWidget);
    }

    getElements(){
      const thisWidget = this ;

      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    isValid(value){// nadpisuję metodę z klasy nadrzędnej
      return !isNaN(value)//Nota Number ( czy to jest liczba)
      && value <= settings.amountWidget.defaultMax
      && value >= settings.amountWidget.defaultMin 
    }
    // jeżeli thisWidget.value to nowa wartośc&& nie jest null/tekstem && to nowa wartość zostaje przyjeta jezeli warunek nie jest spełniony to pozostaje wcześniejsza
    renderValue(){
      const thisWidget = this; // renderowanie (wyświetlanie)na stronie
      thisWidget.dom.input.value = thisWidget.value;
    }
    initActions() {
      const thisWidget = this;

      thisWidget.dom.input.addEventListener('change', function () {
        thisWidget.setValue (thisWidget.dom.input.value)});

      thisWidget.dom.linkDecrease.addEventListener('click', function(event){ 
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      
      thisWidget.dom.linkIncrease.addEventListener('click', function (event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }
  }
   export default AmountWidget;