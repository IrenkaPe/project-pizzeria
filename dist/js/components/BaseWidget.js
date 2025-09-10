
class BaseWidget {
constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;//zapisujemy wraper
    thisWidget.correctValue = initialValue;//początkowa wartoś widgetu
    }
    get value(){
        const thisWidget = this;
        return thisWidget.correctValue;
    }
    set value(value){
        const thisWidget = this;

        const newValue = thisWidget.parseValue(value);
        if(newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) {
            thisWidget.correctValue = newValue;
            thisWidget.announce();
        }
        thisWidget.renderValue();
    }
    setValue(value){
        const thisWidget = this;
        thisWidget.value = value
    }

    parseValue(value){ //konwertuje na liczbę
          return parseInt(value);
    }
    
    isValid(value){
        return !isNaN(value);//Nota Number ( czy to jest liczba)
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
      thisWidget.dom.wrapper.dispatchEvent(event);   
    }
}

export default BaseWidget;