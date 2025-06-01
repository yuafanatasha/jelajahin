
////////////////////////////Step 1 Rendering your html page////////////////////////////////////////////

const express=require('express');
const app=express();
const port= 9000;

const bodyParser=require('body-parser'); 



app.use(express.static(__dirname));

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.get("/index", (req, res) => {
    res.sendFile(__dirname + "/index.html");  // Halaman home setelah registrasi
  });


app.use(bodyParser.urlencoded({extended: false}))
app.get('/submit',function(req,res){
  console.log("Data Saved");
})

////////////////////////////Step 2 Connection with Postgres////////////////////////////////////////////

const {Pool,Client}= require('pg');

const connectionString='postgresql://postgres:postgres@localhost:5433/jelajahin'


const client= new Client({
    connectionString:connectionString
})


////////////////////////////Step 3  Inserting the values////////////////////////////////////////////

app.post("/", (req, res) => {
    const { username, email, password } = req.body;
    
    // Connect to the database
    client.connect()
      .then(() => {
        // Step 1: Check if the email already exists in the database
        return client.query('SELECT * FROM register WHERE email = $1', [email]);
      })
      .then((result) => {
        if (result.rows.length > 0) {
          // If email already exists, send a warning message and redirect to register page
          console.log("Email already exists");
          res.send(`<script>alert('Email already exists! Please use a different email.'); window.location.href = '/register';</script>`);
        } else {
          // Step 2: If email doesn't exist, insert the new user into the database
          return client.query('INSERT INTO register (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
        }
      })
      .then(() => {
        // After successful insertion, redirect to a success page or back to the register page
        console.log("User registered successfully");
        res.redirect(`/index?username=${username}`);
      })
      .catch((err) => {
        console.error('Error during registration:', err);
        res.status(500).send('An error occurred');
      })
      .finally(() => {
        // Close the database connection
        client.end();
      });
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
  