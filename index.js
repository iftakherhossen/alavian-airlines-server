const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wk6ov.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected')
        const database = client.db('airlines');
        const emptyLegsCollection = database.collection('emptyLeg');
        const blogPostCollection = database.collection('blogPost');

        // GET EmptyLegs API
        app.get('/emptyLegs', async (req, res) => {
            const cursor = emptyLegsCollection.find({});
            const emptySits = await cursor.toArray();
            res.send(emptySits);
        });

        // GET BlogPost API
        app.get('/blogPost', async (req, res) => {
            const cursor = blogPostCollection.find({});
            const article = await cursor.toArray();
            res.send(article);
        });

        // GET Single Booking
        app.get('/emptyLegs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const schedules = await emptyLegsCollection.findOne(query);
            res.json(schedules);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running the alavion server online');
})

app.listen(port, () => {
    console.log('listening to the port', port)
});