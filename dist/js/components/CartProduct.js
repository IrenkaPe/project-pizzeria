import {select} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import {app} from '../app.js';

class CartProduct {
    constructor(menuProduct,element){
        const thisCartProduct = this;
        // instancje pojedyńczych produktów w koszyku
        //menuProduct
        thisCartProduct.id = menuProduct.id;
        thisCartProduct.name = menuProduct.name;
        thisCartProduct.amount = menuProduct.amount;
        thisCartProduct.priceSingle = menuProduct.priceSingle;
        thisCartProduct.price = menuProduct.price;
        thisCartProduct.params= menuProduct.params;

        //zapisz element DOM
        thisCartProduct.element = element;
        
        thisCartProduct.getElements(element);
        thisCartProduct.initAmountWidget();
        thisCartProduct.initActions();

    }
    
    getElements(element){
        const thisCartProduct = this;

        thisCartProduct.dom ={};//pusty obiekt na referencje DOM
        thisCartProduct.dom.wrapper = element;// główny kontener produktu w koszyku 
        thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
        thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
        thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
        thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);

    }

    getData (){
        const thisCartProduct = this; 
        return {
        id:thisCartProduct.id,
        name:thisCartProduct.name,
        price:thisCartProduct.price,
        amount:thisCartProduct.amount,
        priceSingle: thisCartProduct.priceSingle,
        params:thisCartProduct.params,
        }
    }

    initAmountWidget(){
        const thisCartProduct = this;

        thisCartProduct.amountWidget = new AmountWidget (thisCartProduct.dom.amountWidget);

        thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
        const newValue = thisCartProduct.amountWidget.value;
        thisCartProduct.amount = newValue;
        thisCartProduct.price = thisCartProduct.priceSingle * newValue;

        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
        app.cart.update(); 
        });

    }

    remove(){
        const thisCartProduct =this;

        const event = new CustomEvent ('remove', {
        bubbles: true,
        detail:{ 
            cartProduct: thisCartProduct,
        }
        })
        thisCartProduct.dom.wrapper.dispatchEvent(event);
    }

    initActions(){
        const thisCartProduct = this;
        thisCartProduct.dom.remove.addEventListener('click',function(event){
        event.preventDefault();
        thisCartProduct.remove();
        })
    }    
}
 export default CartProduct;