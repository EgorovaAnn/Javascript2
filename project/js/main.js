const products = [
    {id: 1, title: 'Notebook', price: 1000, img : 'https://picsum.photos/seed/1/200'},
    {id: 2, title: 'Mouse', price: 100},
    {id: 3, title: 'Keyboard', price: 250, img : 'https://picsum.photos/seed/1/200'},
    {id: 4, title: 'Gamepad', price: 150},
];
// Первый вариант

const renderProduct = (title, price, img = "" ) => {
    return `<div class="product-item">
                <h3>${title}</h3>
                <p>${price}</p>
                <img src = "${img}" alt = "${img}"><br>
                <button class="by-btn">Добавить</button>
              </div>`;
};

const renderProducts = (list) => {
    const productList = list.map((good) => {
        return renderProduct(good.title, good.price, good.img);
    });
    document.querySelector('.products').innerHTML = productList.join('');

    console.log(productList);
};

renderProducts(products);


//Второй вариант
/*
let html = '';
for (const product of products) {
    html = html + renderProduct(product);
}

document.querySelector('.products').innerHTML = html;

function renderProduct(product) {
    return `<div class="product-item">
                <h3>${product.title}</h3>
                <p>${product.price}</p>
                <button class="by-btn">Добавить</button>
              </div>`;
}
*/
