
import {select, templates, settings} from "../settings.js";
import utils from "../utils.js";
import TestimonialCarousel from "./TestimonialCarousel.js";


class Home {
    constructor(element, appInstance){
        const thisHome = this;
        thisHome.render(element);
        thisHome.app = appInstance;
        thisHome.initWidgets();
        thisHome.initCarousel();
    }


    render(element){
        const thisHome = this;

        const generatedHTML = templates.home ({
            image1: settings.images.image1,
            image2: settings.images.image2,
            image3: settings.images.image3,
            gallery1: settings.images.gallery1,
            gallery2: settings.images.gallery2,
            gallery3: settings.images.gallery3,
            gallery4: settings.images.gallery4,
            gallery5: settings.images.gallery5,
            gallery6: settings.images.gallery6,
            orderBg: settings.images.orderBg,
            bookingBg:settings.images.bookingBg,
        });

        thisHome.dom = {};
        thisHome.dom.wrapper = element;
        thisHome.dom.wrapper.innerHTML = generatedHTML;

        thisHome.dom.orderLink = thisHome.dom.wrapper.querySelector(select.home.orderLink);
        thisHome.dom.bookingLink = thisHome.dom.wrapper.querySelector(select.home.bookingLink);
        thisHome.dom.testimonialSlides = thisHome.dom.wrapper.querySelectorAll(select.home.testimonialSlide);
        thisHome.dom.testimonialsWrapper = thisHome.dom.wrapper.querySelector(select.home.testimonialsWrapper);
    }
    initWidgets(){
        const thisHome = this;
        if(thisHome.dom.orderLink){
            thisHome.dom.orderLink.addEventListener('click',function(event){
                event.preventDefault();
                thisHome.app.handleNavigation('order');
            });
        }
        if(thisHome.dom.bookingLink){
            thisHome.dom.bookingLink.addEventListener('click',function(event){
                event.preventDefault();
                thisHome.app.handleNavigation('booking');
            })
        }

    }
    
    initCarousel(){
        const thisHome = this;
        const carouselElement = thisHome.dom.wrapper.querySelector(select.home.testimonialsWrapper);

        thisHome.testimonialCarousel = new TestimonialCarousel(carouselElement); 
   
        }

    }


export default Home;