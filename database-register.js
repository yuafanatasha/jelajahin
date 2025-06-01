const {Pool,Client}= require('pg')


const connectionString='postgressql://postgres:postgres@localhost:5433/jelajahin'


//Creating Client
const client= new Client({
    connectionString:connectionString
})

//Select query
client.connect()
client.query('Select * from public."register"',(err,res)=> {
     console.log(err,res)
     client.end()
})