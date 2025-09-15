
import { select, templates, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
    constructor(element){
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
        thisBooking.getData();
        thisBooking.selectedTable = null;
    }

    getData(){
        const thisBooking = this;
        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

        const params= {
            booking: [
                startDateParam,
                endDateParam,
            ],
            eventsCurrent: [
                settings.db.notRepeatParam,
                startDateParam,
                endDateParam, 
            ],
            eventsRepeat: [
                settings.db.repeatParam,
                endDateParam,
            ],
        };
        //console.log('getData params', params);
        const urls = {
            eventsCurrent: settings.db.url +'/'+ settings.db.events  
                                        +'?'+ params.eventsCurrent.join('&'),
            eventsRepeat:  settings.db.url +'/' + settings.db.events  
                                        +'?'+ params.eventsRepeat.join('&'),
            booking:       settings.db.url +'/' + settings.db.bookings
                                        +'?'+ params.booking.join('&'),
        }
        //console.log('getData urls', urls);
        Promise.all([ //Wyślij 3 zapytania jednocześnie → czekaj, aż wszystkie się zakończą.
            fetch(urls.booking),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat),
        ])
    //
        .then(function(allResponse){//Z każdej odpowiedzi wyciągnij JSON (to też są Promise!) → czekaj, aż wszystkie się przetworzą.
            const bookingsResponse = allResponse[0];
            const eventsCurrentResponse = allResponse[1];
            const eventsRepeatResponse = allResponse[2];
            return Promise.all ([
                bookingsResponse.json(),
                eventsCurrentResponse.json(),
                eventsRepeatResponse.json(),
            ])
        })
        //Dostałaś 3 tablice danych → wyświetl je w konsoli.
        .then(function([bookings ,eventsCurrent, eventsRepeat]){//skrócony zapis  -  potraktuj pierwszy argument jako tablicę i pierwszy element tej tablicy zapisz w zmiennej bookings
            console.log (bookings);
            console.log (eventsCurrent);
            console.log (eventsRepeat);
            thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
        })
    }


    parseData (bookings,eventsCurrent, eventsRepeat){
       const thisBooking = this;

        thisBooking.booked = {};
        for (let item of bookings){
            thisBooking.makeBooked (item.date, item.hour, item.duration, item.table)
        }
         for (let item of eventsCurrent){
            thisBooking.makeBooked (item.date, item.hour, item.duration, item.table)
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;

        for(let item of eventsRepeat){
            if(item.repeat == 'daily'){
                for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
                thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table)
                }
            }
        }
        //console.log('thisBooking.booked', thisBooking.booked)
        thisBooking.updateDOM();
    }

    makeBooked(date, hour, duration, table){
        const thisBooking = this;
        
        if(typeof thisBooking.booked[date] == 'undefined'){
            thisBooking.booked[date] = {};
        }
        const startHour = utils.hourToNumber(hour);
        for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
           // console.log('loop', hourBlock);
           if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
           thisBooking.booked[date][hourBlock] = [];
        }
        thisBooking.booked[date][hourBlock].push(table);
        }
    }

    toNumber(value){
        if (value === null|| value === undefined || value === ''){
            return null;
        }
        const num = Number(value);

        if(isNaN(num)){
            return null;
        }
        return num;
    }

    updateDOM(){
        const thisBooking = this;

        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value)

        let allAvailable = false;

        if(
            typeof thisBooking.booked[thisBooking.date] === 'undefined'||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ==='undefined'
        ){
            allAvailable = true
        }
         

        for(let table of thisBooking.dom.tables){
            const tableId = thisBooking.toNumber(table.getAttribute(settings.booking.tableIdAttribute))
            
            if(
                !allAvailable
                &&
                thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ){  
                table.classList.add(classNames.booking.tableBooked)
            } else {
                table.classList.remove(classNames.booking.tableBooked)
            }
        }
    }
    resetSelectedTable(){
        const thisBooking = this; 

         if (thisBooking.selectedTable) {
            thisBooking.selectedTable.classList.remove('selected');
            thisBooking.selectedTable = null;
        }
    }

    initTables(event){
        const thisBooking = this; 
        const clickedTable = event.target.closest('.table');
        if (!clickedTable)return;

        if (clickedTable.classList.contains(classNames.booking.tableBooked)){
            alert ('this table is already booked');
            return;
        }
        if (thisBooking.selectedTable){
            thisBooking.selectedTable.classList.remove('selected');
        }
        clickedTable.classList.add('selected')
        thisBooking.selectedTable = clickedTable;

        const submitBtn = thisBooking.dom.submitBtn;
        submitBtn.disabled = !thisBooking.selectedTable;
    }

    sendBooking(){
        const thisBooking = this;

        const date = thisBooking.datePicker.value;
        const hour = thisBooking.hourPicker.value;

        let table = null;
        if (thisBooking.selectedTable){ 
            table = thisBooking.toNumber(thisBooking.selectedTable.getAttribute(settings.booking.tableIdAttribute))
        }

        const duration = thisBooking.toNumber(thisBooking.hoursAmount.value);
        const ppl = thisBooking.toNumber(thisBooking.peopleAmount.value);

        const phone = thisBooking.dom.phone.value;
        const address = thisBooking.dom.address.value;

        const starters = [];
        const starterCheckboxes= thisBooking.dom.starterCheckboxes;

        for (let checkbox of starterCheckboxes) {
            if (checkbox.checked) {
            starters.push(checkbox.value);
            }
        }
        const bookingData = {
            date,
            hour,
            table,
            duration,
            ppl,
            starters,
            phone,
            address
        };
        const urlBookings = settings.db.url + '/' + settings.db.bookings;

        fetch(urlBookings,{
            method: 'POST',
            headers: {'Content-Type':'application/json',
            },
            body: JSON.stringify(bookingData),
        })
        .then(function(response) {
            console.log('wysłano dane:', bookingData)
            return response.json()
        })
        .then(function(data) {
            console.log('serwer odpowiedział:', data);

            thisBooking.makeBooked(date, hour, duration, table);
            alert ('Reservation successful. Thank you');

            thisBooking.resetSelectedTable();
            thisBooking.updateDOM();
        })
        .catch(error => {
        alert('Error during booking: ' + error.message);
        console.error('Booking error:', error);
        });
        

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
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
        thisBooking.dom.tablesContainer = thisBooking.dom.wrapper.querySelector(select.booking.tablesContainer);
        thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
        thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
        thisBooking.dom.starterCheckboxes = thisBooking.dom.wrapper.querySelectorAll(select.booking.starterCheckboxes);
        thisBooking.dom.submitBtn = thisBooking.dom.wrapper.querySelector(select.booking.submitBtn);
    }
    
    initWidgets(){
        const thisBooking = this;
        
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);// importuje klasę AmountWidget (ten znaleziony input)
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        
       
        thisBooking.dom.wrapper.addEventListener('updated',function(){thisBooking.  updateDOM();
        });

        thisBooking.dom.tablesContainer.addEventListener('click', function(event){
        thisBooking.initTables(event)
        });

        thisBooking.dom.wrapper.addEventListener('submit',function (event){
            event.preventDefault();
            if(!thisBooking.selectedTable){
                alert ('Please select a table first!')
                return
            }
            thisBooking.sendBooking();
        })
    }
}
export default Booking;