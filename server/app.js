require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors")
const knex = require('knex');
const { ok } = require("assert");
const bcrypt = require('bcryptjs');
const { createJWT, createRefreshJWT} = require('../src/helpers/jwt.helper');
const { userAuthorization } = require('../src/middlewares/authorization.middleware')
const stripe = require("stripe")(process.env.STRIPE);
const bodyParser = require("body-parser");

const app = express()

//Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(userAuthorization)
app.use(cors({
  origin: '*'
}));


// Automatically parse request body as form data.
app.use(express.urlencoded({extended: true}));

app.enable('trust proxy');

//Serve the static assets
app.use(express.static(path.resolve(__dirname,"..","build")));

// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});


// Set up a variable to hold our connection pool. It would be safe to
// initialize this right away, but we defer its instantiation to ease
// testing different configurations.
let pool;

app.use(async (req, res, next) => {
  if (pool) {
    return next();
  }
  try {
    pool = await createPoolAndEnsureSchema();
    next();
  } catch (err) {
    return next(err);
  }
});


const createUnixSocketPool = async config => {
    const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';
  
    // Establish a connection to the database
    return knex({
      client: 'pg',
      connection: {
        user: process.env.DB_USER, 
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
      },
      ...config,
    });
};

const createTcpPool = async config => {
    // Extract host and port from socket address
    const dbSocketAddr = process.env.DB_HOST.split(':'); // e.g. '127.0.0.1:5432'
  
    // Establish a connection to the database
    return knex({
      client: 'pg',
      connection: {
        user: process.env.DB_USER, 
        password: process.env.DB_PASS, 
        database: process.env.DB_NAME,
        host: dbSocketAddr[0], 
        port: dbSocketAddr[1],
      },
      ...config,
    });
  };

const createPool = async () => {
    const config = {pool: {}};
    config.pool.max = 5;
    config.pool.min = 5;
    config.pool.acquireTimeoutMillis = 60000;
    config.pool.createTimeoutMillis = 30000;
    config.pool.idleTimeoutMillis = 600000;
    config.pool.createRetryIntervalMillis = 200;

    if (process.env.DB_HOST === "127.0.0.1:8080") {
        return createTcpPool(config);  // for local server
    } else {
        return createUnixSocketPool(config); // for production
    }
};


const createPoolAndEnsureSchema = async () =>
  await createPool()
    .then(async pool => {
      return pool;
    })
    .catch(err => {
      throw err;
    });


// New user registration
const insertUser = async (pool, user) => {
  try {
    return await pool('users').insert(user).returning('id');
  }
  catch (err) {
    throw Error(err);
  }
}

app.post('/signup', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const newUser = req.body;
      const data = await insertUser(pool, newUser)
      console.log("User added")
      res.json({status: "success", message: "User added Successful", id: data[0] })
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to register user')
    .end();
  }
});

// login user

const checkUser = async (pool, user) => {
  try {
    return await pool('users').where({email:user.email}).select('*');
  }
  catch (err) {
    throw Error(err);
  }
}

app.post('/login', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const newUser = req.body;
      const data = await checkUser(pool, newUser)
      console.log(data)
      //res.json(data);

      if (data.length === 0 ){
        res.json({status: "fail", message: "User not Found"})
      } else if (bcrypt.compareSync(newUser.password, data[0].password) === false) {
        res.json({status: "fail", message: "Incorrect Email or Password"})
      } else {
        const accessJWT = await createJWT(data[0].id);
        //const refreshJWT = await createRefreshJWT(newUser.email);
        res.json({status: "success", message: "Login Successful", id: data[0].id, type: data[0].type, accessJWT })
      }

  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Entry Not Found')
    .end();
  }
});

// Get all global items

const getSoldItems = async pool => {
  return await pool
      .select('id','conformation')
      .from('items')
}

app.get('/global', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const items = await getSoldItems(pool)
      res.json(items);
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to load page; see logs for more details.')
    .end();
  }
});


// Get all items
const getItems = async pool => {
    return await pool
        .select('*')
        .from('items')
}

app.get('/items', async (req, res) => {

    pool = pool || (await createPoolAndEnsureSchema());
    try {
        const items = await getItems(pool)
        res.json(items);
    } catch (err) {
        console.error(err);
    res
      .status(500)
      .send('Unable to load page; see logs for more details.')
      .end();
    }
});


// Insert item
const insertItem = async (pool, item) => {
  try {
    return await pool('items').insert(item);
  }
  catch (err) {
    throw Error(err);
  }
}

app.post('/item', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const newItem = req.body;
      await insertItem(pool, newItem)
      console.log("item added")
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to add item; see logs for more details.')
    .end();
  }
});


// Update item
const updateItem = async (pool, newItem, itemId) => {
  try {
    return await pool('items').where({id:itemId}).update({name:newItem.name, image:newItem.image, type:newItem.type, price:newItem.price, original_price:newItem.original_price, expiration_date:newItem.expiration_date, note:newItem.note, buyer_id:newItem.buyer_id, conformation:newItem.conformation});
  }
  catch (err) {
    throw Error(err);
  }
}

app.patch('/item', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      console.log(req.body)
      const newItem = req.body;
      const itemId = req.body.id
      await updateItem(pool, newItem, itemId)
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to update item; see logs for more details.')
    .end();
  }
});

//UPDATE MULTIPLE
const updateItems = async (pool, newItem, itemId) => {
  try {
    return await pool('items').where({id:itemId}).update({name:newItem.name, image:newItem.image, type:newItem.type, price:newItem.price, original_price:newItem.original_price, expiration_date:newItem.expiration_date, note:newItem.note, buyer_id:newItem.buyer_id, conformation:newItem.conformation});
  }
  catch (err) {
    throw Error(err);
  }
}

app.patch('/items', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const itemsArray = req.body
      for(let i = 0; i < itemsArray.length; i++){
        await updateItem(pool, itemsArray[i], itemsArray[i].id)
      };
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to update item; see logs for more details.')
    .end();
  }
});

// Delete an item
const deleteItem = async (pool, itemId) => {
  try {
    return await pool('items').where({id:itemId}).del();
  }
  catch (err) {
    throw Error(err);
  }
}

app.delete('/item', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const itemId = req.query.id
      const itemIdInt = parseInt(itemId)
      await deleteItem(pool, itemIdInt)
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to delete item; see logs for more details.')
    .end();
  }
});


// Get all Sellers
const getSellers = async pool => {
  return await pool
      .select('*')
      .from('sellers')
}

app.get('/sellers', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const sellers = await getSellers(pool)
      res.json(sellers);
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to load page; see logs for more details.')
    .end();
  }
});

//get single seller

const getSeller = async pool => {
  return await pool
      .select('*')
      .from('sellers')
}

app.get('/seller/:id', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const sellers = await getSeller(pool)
      const paramsId = req.params.id
      const retSeller = sellers.filter((seller)=>seller.id === parseInt(paramsId))

      res.json(retSeller);
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to load page; see logs for more details.')
    .end();
  }
});


// Insert a seller
const insertSeller = async (pool, seller) => {
try {
  return await pool('sellers').insert(seller).returning('id');
}
catch (err) {
  throw Error(err);
}
}

app.post('/seller', async (req, res) => {

pool = pool || (await createPoolAndEnsureSchema());
try {
    const newSeller = req.body;
    const data = await insertSeller(pool, newSeller)
    res.json({status: "success", message: "seller added Successful", id: data[0] })
} catch (err) {
    console.error(err);
res
  .status(500)
  .send('Unable to add seller; see logs for more details.')
  .end();
}
});


// Update a seller
const updateSeller = async (pool, newSeller, sellerId) => {
try {
  return await pool('sellers').where({id:sellerId})
    .update({seller_name:newSeller.seller_name, shop_name:newSeller.shop_name, shop_location: newSeller.shop_location, shop_long: newSeller.shop_long,
    shop_lat:newSeller.shop_lat, opening_time:newSeller.opening_time, closing_time:newSeller.closing_time, phone_number:newSeller.phone_number, email_address:newSeller.email_address});
}
catch (err) {
  throw Error(err);
}
}

app.patch('/seller', async (req, res) => {

pool = pool || (await createPoolAndEnsureSchema());
try {
    const newSeller = req.body;
    const sellerId = req.body.id
    await updateSeller(pool, newSeller, sellerId)
} catch (err) {
    console.error(err);
res
  .status(500)
  .send('Unable to update seller; see logs for more details.')
  .end();
}
});




// Get all Buyers
const getBuyers = async pool => {
  return await pool
      .select('*')
      .from('buyers')
}

app.get('/buyers', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const buyers = await getBuyers(pool)
      res.json(buyers);
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to load page; see logs for more details.')
    .end();
  }
});

//Get single buyer
const getBuyer = async pool => {
  return await pool
      .select('*')
      .from('buyers')
}

app.get('/buyer/:id', async (req, res) => {

  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const buyers = await getBuyers(pool)
      const paramsId = req.params.id

      const retBuyer = buyers.filter((buyer)=>buyer.id === parseInt(paramsId))

      res.json(retBuyer);

  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to load page; see logs for more details.')
    .end();
  }
});

// Insert a buyer
const insertBuyer = async (pool, buyer) => {
  try {
    return await pool('buyers').insert(buyer).returning('id');
  }
  catch (err) {
    throw Error(err);
  }
  }
  
  app.post('/buyer', async (req, res) => {
  
  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const newBuyer = req.body;
      const data = await insertBuyer(pool, newBuyer)
      res.json({status: "success", message: "Buyer added Successful", id: data[0] })
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to add buyer; see logs for more details.')
    .end();
  }
  });
  
  
  // Update a buyer
  const updateBuyer = async (pool, newBuyer, buyerId) => {
  try {
    return await pool('buyers').where({id:buyerId})
      .update({buyer_name:newBuyer.buyer_name, buyer_address: newBuyer.buyer_address, phone_number:newBuyer.phone_number, email_address:newBuyer.email_address});
  }
  catch (err) {
    throw Error(err);
  }
  }
  
  app.patch('/buyer', async (req, res) => {
  
  pool = pool || (await createPoolAndEnsureSchema());
  try {
      const newBuyer = req.body;
      const buyerId = req.body.id
      await updateBuyer(pool, newBuyer, buyerId)
      res.json("updated")
  } catch (err) {
      console.error(err);
  res
    .status(500)
    .send('Unable to update buyer; see logs for more details.')
    .end();
  }
  });

//test endpoint
app.get("/hello", async(req,res) => {
    res.json("Let's save some food!!")
})

//stripe setup 
app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: req.body.items.map((item) => {
      return {
        price_data: {
          currency: "jpy",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price,
        },
        quantity: 1,
      }
    }),
    // success_url: `http://localhost:3000/buyer-success`,
    // cancel_url: `http://localhost:3000/buyer-fail`,
    success_url: `https://eatable-7yflvglpaq-uc.a.run.app/buyer-success`,
    cancel_url: `https://eatable-7yflvglpaq-uc.a.run.app/buyer-fail`,
  });
  console.log(session)
  res.json({ url: session.url });
  } catch (error) {
    console.log(error);
  }
});

app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname,"..","build","index.html"));
});

module.exports = app;