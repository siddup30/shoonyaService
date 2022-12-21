const Api = require("./lib/RestApi");

let { authparams } = require("./cred");

api = new Api({});

api.login(authparams)
.then((res) => {            
        //console.log('Reply: ', res);
        api.get_positions()
        .then((res)=>{
            sum=0
            console.log('Reply: ', res.reduce(function(tot, arr) { 
                // return the sum with previous value
                return tot + parseFloat(arr.rpnl);
              
                // set initial value as 0
              },0));
        }).catch((err) => {
            console.error(err);
        });
        return;

    }).catch((err) => {
        console.error(err);
    });

