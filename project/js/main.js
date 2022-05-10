const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        userSearch: '',
        showCart: false,
        catalogUrl: '/catalogData.json',
        products: [],
        imgCatalog: 'https://via.placeholder.com/200x150',
        cartUrl: '/getBasket.json',
        cartItems: [],
        imgCart: 'https://via.placeholder.com/50x100',
        filtered: [],

    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product) {
            this.getJson(`${API}/addToBasket.json`)
              .then(data => {
                if (data.result === 1) {
                  let find = this.cartItems.find(el => el.id_product === product.id_product);
                  if (find) {
                    find.quantity++;
                  } else {
                    let prod = Object.assign({quantity: 1}, product);
                    this.cartItems.push(prod)
                  }
                } else {
                  alert('Error');
                }
              })
          },
          remove(item) {
            this.getJson(`${API}/deleteFromBasket.json`)
              .then(data => {
                if (data.result === 1) {
                  if (item.quantity > 1) {
                    item.quantity--;
                  } else {
                    this.cartItems.splice(this.cartItems.indexOf(item), 1)
                  }
                }
              })
          },
          filter() {
            let regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
          },
        },
    
    beforeCreate() {
        console.log('beforeCreate');
        console.log(this.products);
    },
    created() {
        console.log('created');
        console.log(this.products);
        this.getJson(`${API + this.catalogUrl}`)
        .then(data => {
            for (let el of data) {
                this.products.push(el);
                this.filtered.push(el);
            }
        });
        this.getJson(`${API + this.cartUrl}`)
        .then(data => {
          for (let el of data.contents) {
            this.cartItems.push(el);
          }
        });
       
    },
    beforeMount() {
        console.log('beforeMount');
    },
    mounted() {
        console.log('mounted');
    },   
    beforeUpdate() {
        console.log('beforeUpdate');
    },
    updated() {
        console.log('updated');
    },
    beforeDestroy() {
        console.log('beforeDestroy');
    },
    destroyed() {
        console.log('destroyed');
    },
});
