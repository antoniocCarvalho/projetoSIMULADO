import express, { request, response } from "express";
import { openDatabase } from "./database.js";
const app = express();
app.use(express.json());



app.get('/api/ping', (request, response)=> {
    response.send({
        message:"pong"
    })
});



app.get('/api/products', async (request, response)=> {
 
    const db = await openDatabase();
    const products = await db.all(`
    SELECT * FROM products
`)

    response.send(products)

});


app.post('/api/products', async(request, response)=> {
    const { id, title, price, description ,image ,category,  } = request.body;
    const db = await openDatabase();
    const data = await db.run(`
        INSERT INTO products (id, title, price, description, image, category)
        VALUES (?, ?, ?, ?, ?, ?)

`,[id, title, price, description, image, category])
db.close();
response.send({
    id : data.lastID,
    title,
    price,
    description,
    image,
    category


    }); 
}); 

app.put('/api/products/:id', async (request, response)=> {
    const { title, price, description ,image ,category,  } = request.body;
    const {id} = request.params;

    const db = await openDatabase();

    const products = await db.get(`
    SELECT * FROM products WHERE id = ?
    `,[id])

   
    if (products) {
        const data = await db.run(`
        UPDATE products 
            SET title= ?,
                price= ?,
                description= ?,
                image= ?,
                category= ?
        WHERE id = ?

    `,[title, price, description, image, category, id]);

db.close();
response.send({
    id,
    title,
    price,
    description,
    image,
    category
});
return

}



    db.close();
    response.send(products || {}); 
});


app.delete('/api/products/:id', async (request, response) => {
    const { id } = request.params;
    const db = await openDatabase();
    const data = await db.run(`
        DELETE FROM products
        WHERE id = ?

`,[id])
db.close();
response.send({
    id, 
    message : `Produto [${id}] removido com sucesso`,
    }); 

});


app.listen(8000,() => {
    console.log("Servidor funcionando na porta 8000 ")
})