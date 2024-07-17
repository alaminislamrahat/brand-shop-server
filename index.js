const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;



// middle ware 

app.use(cors())
app.use(express.json());


// 
// 0dIFQbljXpJRCIDu


// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3jkraio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
     
        await client.connect();

        const productCollection = client.db("productDB").collection("product");
        const addedCollection = client.db("productDB").collection("cart");

        // cart section 

        app.post('/cart', async (req, res) =>{
            const data = req.body;
            const result = await addedCollection.insertOne(data);
            res.send(result);
        })


        app.get('/cart', async (req, res) =>{
            const result = await addedCollection.find().toArray();
            res.send(result);
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: id };
            console.log(query)
            const result = await addedCollection.deleteOne(query);
            console.log(result)
            res.send(result);
        })

        // product section 

        app.post('/products', async (req, res) => {
            const data = req.body;
            const result = await productCollection.insertOne(data);
            res.send(result)
        })

        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = {_id : new ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set:{
                    brandName : data.brandName, 
                    image : data.image, 
                    name : data.name, 
                    price : data.price, 
                    rating : data.rating, 
                    type : data.type
                }
            }
            const result = await productCollection.updateOne(filter,updatedDoc,options);
            res.send(result);

        })
       
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is runnig');
})



app.listen(port, () => {
    console.log(`app is runnig on port ${port}`)
})
