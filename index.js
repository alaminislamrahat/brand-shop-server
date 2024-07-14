const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;



// middle ware 

app.use(cors())
app.use(express.json());


// 
// 0dIFQbljXpJRCIDu


// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://alaminislamrahat:0dIFQbljXpJRCIDu@cluster0.3jkraio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
