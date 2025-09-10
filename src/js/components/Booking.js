import { select, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';



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

        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker =  thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    }
    
    initWidgets(){
        const thisBooking = this;
        console.log ('tu będzie metoda init');
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);// importuje klasę AmountWidget (ten znaleziony input)
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        
        thisBooking.dom.peopleAmount.addEventListener('update',function(){});
        thisBooking.dom.hoursAmount.addEventListener('update',function(){});
        thisBooking.dom.datePicker.addEventListener('update',function(){});
        thisBooking.dom.hourPicker.addEventListener('update',function(){});
    }
}
export default Booking;