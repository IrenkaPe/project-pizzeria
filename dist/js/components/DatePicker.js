import BaseWidget from '../components/BaseWidget.js'
import utils from '../utils.js'
import { select, settings } from '../settings.js'

class DatePicker extends BaseWidget {
	constructor(wrapper) {
		super(wrapper, utils.dateToStr(new Date()))
		const thisWidget = this
// new Date() - opiekt daty teraz / utils.dateToStr przekształca obiekt daty na tekst rok-miesiąc-dzień
		thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input)
		thisWidget.initPlugin()
	}
	initPlugin() {
		const thisWidget = this

		thisWidget.minDate = new Date()
		thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture)//używamy metody add.Days z utilsów przyjmuje ona 2 arg datę do której ma dodać ilość dni i ilość dni które ma dodać
		// eslint-disable-next-line no-undef
		flatpickr(thisWidget.dom.input, {
			// (sygnetura(element,options) wez ten input i skonfiguruj się tak jak w drugim elemencie)
			defaultDate: thisWidget.minDate,
			minDate: thisWidget.minDate,
			maxDate: thisWidget.maxDate,
			locale: {
				firstDayOfWeek: 1,
			},
			disable: [
				function (date) {
					return date.getDay() === 1
				},
			],
			onChange: function (selectedDates, dateStr) {
				thisWidget.value = dateStr
			},
		})
	}
	parseValue(value) {
		return value
	}

	isValid() {
		return true
	}

	renderValue() {}
}

export default DatePicker
