const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
/*
let getRequest = (url, cb) => { // не fetch
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
                console.log('Error');
            } else {
                cb(xhr.responseText);
            }
        }
    };
    xhr.send();
};
*/
/*
let getRequest = (url) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    reject('Error');
                } else {
                    resolve(xhr.responseText);
                }
            }
        }
    });
};
*/
class List {
    constructor(url, container, list = listContext){
      this.container = container;
      this.list = list;
      this.url = url;
      this.goods = [];
      this.productsObjects = [];
      this.filtered = [];
      this._init();
    }

    getProducts(url) {
        return fetch(url ? url :`${API + this.url}`)
            .then(result => result.json())
            .catch(error => console.log(error));
    }

    handleData(data){
        this.goods = data;
        this.render();
    }

    getTotalPrice() {
        return this.productsObjects.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);
    }

    render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            console.log(this.constructor.name);
           
            let productObject = null;
            if (this.constructor.name === 'ProductsList') productObject = new ProductItem(product);
            if (this.constructor.name === 'Cart') productObject = new CartItem(product);
            if (!productObject) return;

            console.log(productObject);

            this.productsObjects.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render());
        }
    }

    filter(value){
        const regexp = new RegExp(value, 'i');
        this.filtered = this.productsObjects.filter(product => regexp.test(product.product_name));
        this.productsObjects.forEach(el => {
          const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
          if(!this.filtered.includes(el)){
            block.classList.add('invisible');
          } else {
            block.classList.remove('invisible');
          }
        })
      }
      _init(){
        return undefined;
      }
}

class Item {
    constructor(el, img = 'https://via.placeholder.com/200x150'){
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = img;
    }  
    render() {
        return ``;
    }
}

class ProductsList extends List{
    constructor(cart, container = '.products', url = "/catalogData.json"){
      super(url, container);
      this.cart = cart;
      this.getProducts()
        .then(data => this.handleData(data));
    }
    _init(){
        document.querySelector(this.container).addEventListener('click', event => {
          if(event.target.classList.contains('buy-btn')){
            this.cart.addProduct(event.target);
          }
        });
        document.querySelector('.search-form').addEventListener('submit', event => {
          event.preventDefault();
          this.filter(document.querySelector('.search-field').value)
        })
    }
}

class ProductItem extends Item {
    render() {
      return `<div class="product-item" data-id="${this.id_product}">
                  <img src="${this.img}" alt="Some img">
                  <div class="desc">
                      <h3>${this.product_name}</h3>
                      <p>${this.price} ₽</p>
                      <button class="buy-btn"
                      data-id="${this.id_product}"
                      data-name="${this.product_name}"
                      data-price="${this.price}">Купить</button>
                  </div>
              </div>`;
    }
}

class Cart extends List {
    constructor(container = ".cart-block", url = "/getBasket.json"){
      super(url, container);
      this.getProducts()
        .then(data => {
          this.handleData(data.contents);
        });
    }


    addProduct(element){
       this.getProducts(`${API}/addToBasket.json`)
        .then(data => {
          if(data.result === 1){
            let productId = +element.dataset['id'];
            let find = this.productsObjects.find(product => product.id_product === productId);
          if(find){
            find.quantity++;
            this._updateCart(find);
          } else {
            let product = {
              id_product: productId,
              price: +element.dataset['price'],
              product_name: element.dataset['name'],
              quantity: 1
            };
            this.goods = [product];
            this.render();
          }
        } else {
          alert('Error');
        }
        })
    }

    removeProduct(element){
        this.getProducts(`${API}/deleteFromBasket.json`)
          .then(data => {
            if(data.result === 1){
              let productId = +element.dataset['id'];
              let find = this.productsObjects.find(product => product.id_product === productId);
              if(find.quantity > 1){ 
                find.quantity--;
                this._updateCart(find);
              } else { 
                this.productsObjects.splice(this.productsObjects.indexOf(find), 1);
                document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
              }
            } else {
              alert('Error');
            }
        })
    }

    _updateCart(product){
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        block.querySelector('.product-quantity').textContent = `Количество: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `${product.quantity * product.price} ₽`;
    }
    _init(){
        document.querySelector('.btn-cart').addEventListener('click', () => {
        document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector(this.container).addEventListener('click', event => {
          if(event.target.classList.contains('del-btn')){
            this.removeProduct(event.target);
          }
        })
    }
}

class CartItem extends Item{
    constructor(el, img = 'https://via.placeholder.com/50x100'){
      super(el, img);
      this.quantity = el.quantity;
    }
    render(){
      return `<div class="cart-item" data-id="${this.id_product}">
              <div class="product-bio">
              <img src="${this.img}" alt="Some image">
              <div class="product-desc">
              <p class="product-title">${this.product_name}</p>
              <p class="product-quantity">Количество: ${this.quantity}</p>
          <p class="product-single-price">${this.price} за ед.</p>
          </div>
          </div>
          <div class="right-block">
              <p class="product-price">${this.quantity*this.price} ₽</p>
              <button class="del-btn" data-id="${this.id_product}">&times;</button>
          </div>
          </div>`
    }
}
 
const listContext = {
    ProductsList: ProductItem,
    Cart: CartItem
};

let cart = new Cart();
let products = new ProductsList(cart);
  




/*
class ProductList {
    constructor(container = '.products') {
        this.container = document.querySelector(container);
        this._goods = [];
        this._productsObjects = [];

        // this._fetchGoods();
        // this._render();
        this.getProducts()
            .then((data) => {
                this._goods = data;
                this._render();
                console.log(this.getTotalPrice());
            });
    }

    // _fetchGoods() {
    //     getRequest(`${API}/catalogData.json`, (data) => {
    //         // console.log(data);
    //         this._goods = JSON.parse(data);
    //         this._render();
    //         console.log(this._goods);
    //     });
    // }

    getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then(response => response.json())
            .catch(err => console.log(err));
    }

    getTotalPrice() {
        return this._productsObjects.reduce((accumulator, good) => accumulator + good.price, 0);
    }

    _render() {
        for (const product of this._goods) {
            const productObject = new ProductItem(product);
            console.log(productObject);

            this._productsObjects.push(productObject);
            this.container.insertAdjacentHTML('beforeend', productObject.getHTMLString());
        }
    }
}

class ProductItem {
    constructor(product, img = 'https://via.placeholder.com/200x150') {
        this.id = product.id;
        this.title = product.product_name;
        this.price = product.price;
        this.img = img;
    }

    getHTMLString() {
        return `<div class="product-item" data-id="${this.id}">
                  <img src="${this.img}" alt="Some img">
                  <div class="desc">
                      <h3>${this.title}</h3>
                      <p>${this.price} \u20bd</p>
                      <button class="buy-btn">Купить</button>
                  </div>
              </div>`;
    }
}

// const cart = new Cart();
// const list = new ProductList(cart);
const list = new ProductList();
*/
