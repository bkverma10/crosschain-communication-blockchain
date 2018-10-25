
var currentBlockHeight;
var http = require('http');
var chalk = require( "chalk" );
var express = require('express');
const request = require("request-promise");
var app = express();
console.log("\n *START* \n");
const baseEndpoint = "https://api.blockcypher.com/v1/btc/test3"
//const addressUrl = "/addrs/2NBe6MgT4ysAZYzAL6pbV2wYiXBxei1r6nx/full?limit=50";
const addressUrl = "/addrs/2N42DnWcY7pkm1cg695qt4e7iraKdHGa3KR/full?limit=50";
const priceApi = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR"
const finalUrl = baseEndpoint+addressUrl;
var bitcoinRate;
var ethereumRate;
var rateConverter;
var blockArray = [];
var outputs;
var transferBitcoinValue;
var transferEtherValue;
var test = 1;

var transactionObj = {

    getLatestBlockHeight: function(){
        return request({
            uri: baseEndpoint,
           method: 'GET',
           maxRedirects:3
       },function(error, response, body) {
        body = JSON.parse(body);
        console.log("sequential req response new", body.height);
         currentBlockHeight = body.height;
        });
    }, 

   bitcoinToEther : function(){
    return request({
        uri: priceApi,
        method: 'GET',
        maxRedirects:3
    }, function(error, response, body) {
        body = JSON.parse(body);
        bitcoinRate = body.BTC.USD;
        ethereumRate = body.ETH.USD;
        console.log("---Bitcoin Rate--- ", bitcoinRate);
        console.log("---Ethereum Rate--- ", ethereumRate);
        rateConverter = bitcoinRate/ethereumRate;
        console.log("---one bitcoin to ether--- ", rateConverter);
    });
   },

   transactionStatus : function(res){
   return request({
        uri: finalUrl,
        method: 'GET',
        maxRedirects:3
    }, function(error, response, body) {
        console.log("\n *Inside request function* \n");
        if (!error) {
            if (body.includes('\"')) { body = JSON.parse(body); }

            var transactionArray = body.txs[1].outputs;
            //console.log("\n * transaction outputs * \n", transactionArray);
            loop1:
            for(i in body.txs){
                outputs = body.txs[i].outputs;
                loop2:
                for(j in outputs){
                    console.log("--------addresses-------->",outputs[j].addresses);
                    if(outputs[j].addresses=='2MtSkBdV1EZ5mFgM9d4c1kujB98MDURtkDr')
                    {
                        
                        transferBitcoinValue = outputs[j].value/100000000;
                        console.log("----value---",outputs[j].value);
                        console.log("----transfer bitcoin value---",transferBitcoinValue);
                        console.log("----block_height---",body.txs[i].block_height);
                        
                        console.log("----currentBlockHeight---",currentBlockHeight);
                        var blockDifference = currentBlockHeight-body.txs[i].block_height;
                        if(blockDifference<1000 && blockDifference>0)
                        {
                            console.log("----blockDifference---",blockDifference);
                            transferEtherValue = rateConverter * transferBitcoinValue;
                            console.log("----transferEtherValue---",transferEtherValue);
                        }
                        break loop1;
                    }
                }
               // console.log("----------------->",outputs);
            }
            //console.log(JSON.stringify(outputs));
            res.write(JSON.stringify({"amount":transferEtherValue}));
            res.end();
        } else {
            return error;
           
        }
    });     
   }

}
app.get("/api/transactionStatus",function(req, res, next){
    res.writeHead(200, {"Content-Type": "application/json"});
    transactionObj.bitcoinToEther()
    .then(function(result){
    //console.log("result from first call : " , result);        
    transactionObj.getLatestBlockHeight();
    })
    .then(function(result){
    console.log("result from second call : " , result);
    transactionObj.transactionStatus(res);
    });
});

// Setup the Express global error handler.
app.use(
    function( error, request, response, next ) {

        console.log( chalk.red.bold( "ERROR" ) );
        console.log( chalk.red.bold( "=====" ) );
        console.log( error );

        // Because we hooking post-response processing into the global error handler, we
        // get to leverage unified logging and error handling; but, it means the response
        // may have already been committed, since we don't know if the error was thrown
        // PRE or POST response. As such, we have to check to see if the response has
        // been committed before we attempt to send anything to the user.
        if ( ! response.headersSent ) {
            response
                .status( 500 )
                .send( "Sorry - something went wrong. We're digging into it." )
            ;

        }

    }
);

app.listen(9096);