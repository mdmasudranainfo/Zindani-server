const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

// mongodb config

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.lw6j4eg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const userCollections = client.db("zindani").collection("user");
    const categoryCollections = client.db("zindani").collection("category");
    const ProductCollections = client.db("zindani").collection("products");

    //
    //
    app.get("/category", async (req, res) => {
      const query = {};
      const result = await categoryCollections.find(query).toArray();
      res.send(result);
    });
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollections.insertOne(user);
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await ProductCollections.insertOne(products);
      res.send(result);
    });
    // all products
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await ProductCollections.find(query).toArray();
      res.send(result);
    });
    // get category ways products
    app.get("/producs/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const result = await ProductCollections.find(query).toArray();
      res.send(result);
    });
    // get Seller Products
    app.get("/myproducts", async (req, res) => {
      const email = req.query.email;
      const query = { SallerEmail: req.query.email };
      const result = await ProductCollections.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run();

//

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Running ${port}`);
});
