export const select = {
  templateOf: {
    home:"#template-home",
    menuProduct: "#template-menu-product",
    cartProduct: '#template-cart-product',
    bookingWidget: '#template-booking-widget',
    },
    containerOf: {
      home: '#home',
      menu: '#product-list',
      cart: '#cart',
      pages: '#pages',
      booking: '.booking-wrapper',
    },

    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
      datePicker: {
            wrapper: '.date-picker',
            input: `input[name="date"]`,
      },
      hourPicker: {
            wrapper: '.hour-picker',
            input: 'input[type="range"]',
            output: '.output',
      },
    },
    home:{
      orderLink:'a[href="#order"]',
      bookingLink:'a[href="#booking"]',
      testimonialSlide:'.carousel-cell',
      testimonialsWrapper: '.testimonials',
    },
    booking: {
        peopleAmount: '.people-amount',
        hoursAmount: '.hours-amount',
        tables: '.floor-plan .table',
        tablesContainer: '.floor-plan',
        phone:'input[type ="tel"]',
        address:'input[name ="address"]',
        starterCheckboxes:'input[name="starter"]',
        submitBtn: 'button[type="submit"]',
    },
    nav: {
        links: '.main-nav a',
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
};

export const classNames = {
    menuProduct: {
        wrapperActive: 'active',
        imageVisible: 'active',
    },
    cart: {
        wrapperActive: 'active',
    },
    booking: {
        loading: 'loading',
        tableBooked: 'booked',
    },
    nav: {
        active: 'active',
    },
    pages: {
        active: 'active',
    },
};

export const settings = {


    amountWidget: {
        defaultValue: 1,
        defaultMin: 0,
        defaultMax: 10,
    },
    cart: {
        defaultDeliveryFee: 20,
    },
    hours: {
        open: 12,
        close: 24,
    },
    datePicker: {
        maxDaysInFuture: 14,
    },
    booking: {
        tableIdAttribute: 'data-table',
    },
    db: {
        url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''), // jeśli server to localhost to dodaj 3131 w przeciwnym wypadku nic nie dodawaj
        products: 'products',
        orders: 'orders',
        bookings: 'bookings',
        events: 'events',
        dateStartParamKey: 'date_gte',
        dateEndParamKey: 'date_lte',
        notRepeatParam: 'repeat=false',
        repeatParam: 'repeat_ne=false',
    },
    images: {

    //background top
    orderBg:'images/homepage/pizza-1.jpg',
    bookingBg:'images/homepage/pizza-2.jpg',

    // Karuzela opinii
    image1: 'images/homepage/pizza-1.jpg',
    image2: 'images/homepage/pizza-2.jpg',
    image3: 'images/homepage/pizza-3.jpg',

    // Galeria zdjęć
    gallery1: 'images/homepage/pizza-4.jpg',
    gallery2: 'images/homepage/pizza-5.jpg',
    gallery3: 'images/homepage/pizza-6.jpg',
    gallery4: 'images/homepage/pizza-7.jpg',
    gallery5: 'images/homepage/pizza-8.jpg',
    gallery6: 'images/homepage/pizza-9.jpg'
  }
};

export const templates = {
  home: Handlebars.compile(document.querySelector(select.templateOf.home).innerHTML),
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),
};
