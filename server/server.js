const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use('/', express.static('./public'));

app.get('/api/products', (req, res) => {
    fs.readFile('./server/db/products.json', 'utf-8', (err, data) => {
        if (err) res.send(JSON.stringify({ result: 0, err }));
        else res.send(data);
    });
});

app.get('/api/cart', (req, res) => {
    fs.readFile('./server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) res.send(JSON.stringify({ result: 0, err }));
        else res.send(data);
    });
});

app.post('/api/cart', (req, res) => {
    fs.readFile('./server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) res.send(JSON.stringify({ result: 0, err }));
        else {
            const cart = JSON.parse(data);
            cart.contents.push(req.body);

            fs.writeFile('./server/db/userCart.json', JSON.stringify(cart), (err) => {
                if (err) res.end(JSON.stringify({ result: 0, err }));
                else res.end(JSON.stringify({ result: 1 }));
            });
        }
    });
});

app.put('/api/cart/:id', (req, res) => {
    fs.readFile('./server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) res.send(JSON.stringify({ result: 0, err }));
        else {
            const cart = JSON.parse(data);
            const find = cart.contents.find(good => good.id_product === Number(req.params.id)); // req.query // /?dwd=fwf
            find.quantity += req.body.quantity;

            fs.writeFile('./server/db/userCart.json', JSON.stringify(cart), (err) => {
                if (err) res.end(JSON.stringify({ result: 0, err }));
                else res.end(JSON.stringify({ result: 1 }));
            });
        }
    });
});

app.delete('/api/cart/:id', (req, res) => {
    fs.readFile('./server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) res.send(JSON.stringify({ result: 0, err }));
        else {
            const cart = JSON.parse(data);
            const find = cart.contents.find(good => good.id_product === Number(req.params.id)); 
            find.quantity += -req.body.quantity;

            fs.writeFile('./server/db/userCart.json', JSON.stringify(cart), (err) => {
                if (err) res.end(JSON.stringify({ result: 0, err }));
                else res.end(JSON.stringify({ result: 1 }));
            });
        }
    });

});

// app.get('*');

app.listen(5555, () => {
    console.log('Server started!');
});
