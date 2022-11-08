const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors())
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('server is running')
})
//connect to database


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@crumb-cooking.shezpsi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//service collection
const serviceCollection = client.db('cooking').collection('services')

async function run(){
    try{
        //get services data
        app.get('/services', async(req, res)=>{
            const size = parseInt(req.query.size)
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.limit(size).toArray()
            res.send(result)
        })

        //get service data
        app.get('/serviceDetail/:id', async(req, res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)}
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })
    }
    finally{}
}

run().catch(err =>console.error(err))


app.listen(port)