import { defaults } from "json-server";
import {select, templates, settings} from "../settings.js";
import utils from "../utils.js";

class Home {
    constructor(element){
        const thisHome = this;
        thisHome.render(element);
        thisHome.initWidgets();

    }
    render(){
        const thisHome = this;

        const generatedHTML = templates.homePage({
            image1: settings.images.image1,
            image2: settings.images.image2,
            image3: settings.images.image3,
            gallery1: settings.images.gallery1,
            gallery2: settings.images.gallery2,
            gallery3: settings.images.gallery3,
            gallery4: settings.images.gallery4,
            gallery5: settings.images.gallery5,
            gallery6: settings.images.gallery6,

        })
        thisHome.dom = {}
        thisHome.dom.wrapper = element;
        thisHome.dom.wrapper.innerHTML = generatedHTML;

        thisHome.dom.orderLink = thisHome.dom.wrapper.querySelector(select.home.orderLink);
        thisHome.dom.bookingLink = thisHome.dom.wrapper.querySelector(select.home.bookingLink);
        thisHome.dom.testimonialSlides = thisHome.dom.wrapper.querySelectorAll(select.home.testimonialSlide);
        thisHome.dom.indicators = thisHome.dom.wrapper.querySelectorAll(select.home.indicator);
    }
    initWidgets(){
        const thisHome = this;
        if(thisHome.dom.orderLink){
            thisHome.dom.orderLink.addEventListener('click',function(event){
                event.preventDefault();
                window.location.hash ='#order'
            });
        }
        if(thisHome.dom.bookingLink){
            thisHome.dom.bookingLink.addEventListener('click',function(event){
                event.preventDefault();
                window.location.hash ='#booking'
            })
        }
        thisHome.initCarousel();
    }
    /*initCarousel(){
        const thisHome = this;
        let currentSlide = 0;
        const slides = thisHome.dom.testimonialSlides;
        const indicators = thisHome.dom.indicators;

        thisHome.showSlide(currentSlide);
        const intervalId =setInterval(function(){
            currentSlide = (currentSlide +1 )
        })

        thisHome.showSlide = function(index){
            
        }

    }*/
}

export defaults Home;