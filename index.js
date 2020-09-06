var express = require('express');
var redis   = require("redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var app = express();


app.use(express.urlencoded({extended:true}))
app.use(express.json())

const redisClient = redis.createClient({
    port:6379,
    host:'localhost'
})
//used to handle reverse proxy
app.set('trust proxy', 1)

app.use(session({
    name:'sample',
    store:new redisStore({client: redisClient}),
    resave:false,
    saveUninitialized:false,
    secret :'cookiesecret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 100// two hours
             //secure only https 
    }
}))


app.get('/',(req, res) => {
  
    res.send(` <form method="get" action="/submit">
                <h1> Enter Details</h1>
                <input name="id" type="text">
                <button>submit</button>
              </form>`);
})

app.get('/submit', (req, res) => {
    let { id } = req.query

    req.session.clientId = id;
    let newSession =   req.session;
    res.send(`server 1  ${newSession}`)
})




app.post(('/'), (req, res) =>{

  let  {username,  password} = req.body;
   if(!username || !password){
       res.status(400).send('username is empty')
   }

   console.log(username === 'hello' && password === 'hello');
    if(username === 'hello' && password === 'hello'){
       req.session.Id = 'Jam'
       res.send('working');
   }

})

app.listen(9100, () => console.log('server up'))