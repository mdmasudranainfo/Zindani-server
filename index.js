const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const buyCollections = client.db("zindani").collection("buyingProducts");

    //
    //
    app.get("/category", async (req, res) => {
      const query = {};
      const result = await categoryCollections.find(query).toArray();
      res.send(result);
    });
    app.post("/user", async (req, res) => {
      const user = req.body;

      const result = await userCollections.insertOne(user);
      res.send(result);
    });

    // user get
    app.get("/alluer", async (req, res) => {
      const query = { role: "user" };
      const result = await userCollections.find(query).toArray();
      res.send(result);
    });
    //
    // get single user
    app.get("/user/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await userCollections.findOne(query);
      res.send(result);
    });
    //
    // delete user
    app.delete("/users/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await userCollections.deleteOne(query);
      res.send(result);
    });

    //
    // update user role
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          verify: true,
        },
      };
      const result = await userCollections.updateOne(query, updateDoc, options);
      res.send(result);
    });
    //
    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await ProductCollections.insertOne(products);
      res.send(result);
    });
    // update product advrtize
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          advrtized: true,
        },
      };
      const result = await ProductCollections.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    // report items
    app.put("/reports/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          report: true,
        },
      };
      const update = await ProductCollections.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(update);
    });

    // get Rported Items
    app.get("/products/reports", async (req, res) => {
      const query = { report: true };
      const result = await ProductCollections.find(query).toArray();
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
    //
    // get advrtized products
    app.get("/advrtized", async (req, res) => {
      const query = { advrtized: true };
      const result = await ProductCollections.find(query).toArray();
      res.send(result);
    });
    // delete my product
    // delete
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ProductCollections.deleteOne(query);
      res.send(result);
    });

    // delete order
    app.delete("/buydelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await buyCollections.deleteOne(query);
      res.send(result);
    });

    // buy products
    app.post("/buyproduct", async (req, res) => {
      const product = req.body;
      const result = await buyCollections.insertOne(product);
      res.send(result);
    });
    app.get("/buyproduct", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await buyCollections.find(query).toArray();
      res.send(result);
    });

    // selller get
    app.get("/seller", async (req, res) => {
      const query = { role: "seller" };
      const result = await userCollections.find(query).toArray();
      res.send(result);
    });

    // get admin
    app.get("/role/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollections.findOne(query);

      res.send({ isAdmin: user.role === "admin" });
    });

    app.get("/roles/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollections.findOne(query);

      res.send({ isSeller: user.role === "seller" });
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
