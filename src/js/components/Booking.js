import { select, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';



class Booking {
    constructor(element){
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
    }
    render(element) {
        const thisBooking = this;
    
        // generate HTML based on template
        const generatedHTML = templates.bookingWidget();

        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;//dodaje do niej właściwość wraper
        thisBooking.dom.wrapper.innerHTML = generatedHTML;//zamiana zawartości wrappera innerHTML na kod wygenerowany z szablonu

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);// dostęp do inputu peopeleAmount
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    }
    
    initWidgets(){
        const thisBooking = this;
        console.log ('tu będzie metoda init');
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);// importuje klasę AmountWidget (ten znaleziony input)
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        
        thisBooking.dom.peopleAmount.addEventListener('update',function(){});
        thisBooking.dom.hoursAmount.addEventListener('upadate',function(){});
    }
}
export default Booking;