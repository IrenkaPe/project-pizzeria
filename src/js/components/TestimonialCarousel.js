import { select } from "../settings.js";
/*global Flickity*/
class TestimonialCarousel { 
    constructor(element) {
        const thisCarousel = this;
        thisCarousel.render(element);
        thisCarousel.initPlugin();
    }

    render(element) {
        const thisCarousel = this;
        thisCarousel.dom = {};
        thisCarousel.dom.wrapper = element;
    }

   initPlugin() {
        const thisCarousel = this;
        thisCarousel.flkty = new Flickity(thisCarousel.dom.wrapper, {
            autoPlay: 3000,
            cellAlign: 'center',
            contain: true,
            wrapAround: true,
            pauseAutoPlayOnHover: true,
            pageDots: true,
            prevNextButtons: false, // ⬅️ wyłącza strzałki
        });
    }
}

export default TestimonialCarousel;