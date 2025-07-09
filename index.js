const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app=express()
const path =require('path')
const fs= require('fs')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middlewire 
app.use(cors());

app.use(express.json({ limit: "50mb" }))



app.get('/',(req,res)=>{
    res.send('বাংলাদেশ ছাত্রদলের সারভার চালু হইছে')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@user-management-system.h2w7at6.mongodb.net/?retryWrites=true&w=majority&appName=user-management-system`;


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
   
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const postcollection = client.db('SatradalDB').collection('posts')
    const membercollection = client.db('Allmember').collection('member')


    ///=============================get,post,delete=============start===========
app.post('/member', async (req, res) => {
 const newmember =req.body;
 res.send(newmember)
 const result = await membercollection.insertOne(newmember)
 res.send(result)

});

// GET members
app.get('/member', async (req, res) => {
   const coursor = membercollection.find();
  const result = await coursor.toArray();
  res.send(result)
});
app.get('/member/:id', async (req, res) => {
 const id = req.params.id;
  const query ={_id : new ObjectId(id)}
  const result = await membercollection.findOne(query)
  res.send(result)
});
///=============================get,post,delete=============start===========


//post 
app.post('/posts',async(req,res)=>{
 const newpost = req.body;
 res.send(newpost);
 const result = await postcollection.insertOne(newpost)
 res.send(result)
})





//get all posts
app.get('/posts',async(req,res)=>{
    const coursor = postcollection.find();
    const result = await coursor.toArray();
    res.send(result)
})

//get one post using id
app.get('/posts/:id',async(req,res)=>{
    const id = req.params.id;
    const query={_id : new ObjectId(id)}
    const result = await postcollection.findOne(query)
    res.send(result)
})
//================delate==============
app.delete('/posts/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result=await postcollection.deleteOne(query)
  res.send(result)
})
//==========ping==============
app.get('/ping',(req,res)=>{
  res.send('pong');
})
//==========Delete user==============
app.delete('/member/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result=await membercollection.deleteOne(query)
  res.send(result)
})
// Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log('বাংলাদেশ ছাত্রদলের সারভার চালু হইছে',port)
})