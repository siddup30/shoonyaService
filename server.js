const Api = require("./lib/RestApi");

let { authparams } = require("./cred");
const twofactor = require("node-2fa");
const secret = '36Q4S3FBOK5JJRI64FZS7727T3P53L36';
const newToken = twofactor.generateToken(secret);
api = new Api({});

const express = require('express');
const port = 3300;
const app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.get("/login", (req, res) => {
    const newToken = twofactor.generateToken(secret);
    authparams.twoFA=newToken.token
    api.login(authparams)
        .then((result) => {
            //api.searchscrip('NFO', 'NIFTY18000').then((reply) => { console.log(reply); });
            //console.log(index.NIFTY);
            res.send(result);
        }).catch((err) => {
            console.error(err);
        });
 });
 app.get("/position", (req, res) => {
    api.get_positions()
        .then((result)=>{
            sum=0
            data= result.reduce(function(tot, arr) { 
                // return the sum with previous value
                return tot + parseFloat(arr.rpnl);
                // set initial value as 0
              },0)
              console.log(result);
            res.send({positions:result,MTM:data});
        }).catch((err) => {
            console.error(err);
        });
 })
 app.get("/getquotes",(req,res)=>{
    api.get_quotes(req.query.exchange,req.query.token)
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            console.error(err);
        });
 })
 app.post("/optionchain",(req,res)=>{
    api.get_option_chain(req.body.exchange,req.body.tradingsymbol,req.body.strikeprice,req.body.count)
        .then((result)=>{
            res.send(result);
        }).catch((err) => {
            console.error(err);
        });
 })

app.post("/placeorder",(req,res)=>{
    api.place_order(req.body)
    .then((result)=>{
        res.send(result);
    }).catch((err) => {
        console.error(err);
    });
})



//  app.get("/setsession", (req, res) => {
//     //details.susertoken=req.token;
//     details={}
//     details.susertoken="1625c79f2caac18f9f87954379c97256ffa7b2546939b48267be5c9e000f0f3f";
//     //details.actid=req.username;
//     details.actid="FA68788";
//     result=api.setSessionDetails(details)
//     res.send({message:"success"})
//     // .then((result)=>{
//     //     res.send(result);
//     // }).catch((err) => {
//     //     console.error(err);
//     // });
//  })
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});