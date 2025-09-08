import { select, templates } from '../settings';
import utils from '../utils.js';
class Booking {
    constructor(element){
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
    }
    render(element) {
        const thisBooking = this;
        
        const generatedHTML = templates.bookingWidget();

        thisBooking.dom ={};
        thisBooking.dom.element =  utils.createDOMFromHTML(generatedHTML);

        const bookingContainer = document.querySelector(select.containerOf.booking);
        bookingContainer.innerHTML='';

        bookingContainer.appendChild(thisBooking.dom.element);

    }
}
export default Booking;