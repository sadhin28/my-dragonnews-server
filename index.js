const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app=express()
const multer = require('multer')
const path =require('path')
const fs= require('fs')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middlewire 
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('বাংলাদেশ ছাত্রদলের সারভার চালু হইছে')
})


//setup file upload
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

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
//post 
app.post('/posts',async(req,res)=>{
 const newpost = req.body;
 res.send(newpost);
 const result = await postcollection.insertOne(newpost)
 res.send(result)
})
//post a member/add member
app.post('/members', async (req, res) => {
 const newmember=req.body;
 res.send(newmember);
 const result = await membercollection.insertOne(newmember)
 res.send(result)
});
//get all members
app.get('/members',async(req,res)=>{
  const coursor = membercollection.find();
  const result = await coursor.toArray();
  res.send(result)

})
//get single member by id
app.get('/members/:id',async(req,res)=>{
  const id = req.params.id;
  const query ={_id : new ObjectId(id)}
  const result = await membercollection.findOne(query)
  res.send(result)
})
//get photo

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
//==========Delete user==============
app.delete('/members/:id',async(req,res)=>{
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