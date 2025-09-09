class BaseWidget {
constructor(wrapperElement, initialValue){
    const thisWidget = this;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;//zapisujemy wraper
    thisWidget.value = initialValue;//początkowa wartoś widgetu
    }

   setValue(value){
        const thisWidget = this;
        const newValue = thisWidget.parseValue(value);
      if(
        newValue !== thisWidget.value && thisWidget.isValid(newValue)) {
        thisWidget.value = newValue;
        thisWidget.announce();
      }
       thisWidget.renderValue();
    }
    parseValue(value){ //konwertuje na liczbę
          return parseInt(value);
        }
    
    isValid(value){
        return !isNaN(value)//Nota Number ( czy to jest liczba)
    }
    renderValue(){
      const thisWidget = this; // renderowanie (wyświetlanie)na stronie
      thisWidget.dom.wrapper.innerHTML = thisWidget.value; // będzie nadpisywał wrappera widgetu
    }
    announce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', { 
        bubbles: true  
      });
      thisWidget.element.dispatchEvent(event);   
    }
}

export default BaseWidget;