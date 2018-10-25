# cross-chain-communication-uh


The purpose of this project is to establish a cross-chain communication between two blockchains (Bitcoin and Ethereum), 
one of the use case of the cross-chain communication is cryptocurrency exchange. currently, 
there are numbers of third-party cryptocurrency exchangers like (Coinbase, Bitpanda etc.) our task is to eliminate the third party by implementing a smart contract using Oraclize, 
where one can transfer Bitcoin currency and in exchange can receive Ethereum currency.

Implementation: 

Everything done in the local development environment.

#Custom API written in NodeJs to return Ether equal to Bitcoin: this is in custom_api directory.
To make it accessible to Oraclize smart contract, install localtunnel.
```
$ npm install -g localtunnel
$ lt --port 9096
```
Built a Bitcoin testnet: 

Setup a Bitcoin testnet using given URL
https://www.suffix.be/blog/getting-started-bitcoin-testnet


Follow below steps to setup ethereum testnet, ethereum-bridge for Oracle Communication.

You can also refer to this url for the detailed explanation.
https://medium.com/coinmonks/how-to-create-a-dapp-using-truffle-oraclize-ethereum-bridge-and-webpack-9cb84b8f6bcb


#Install Truffle

`$ npm install -g truffle`

#Create a new Truffle project

```
$ mkdir oraclize-test

$ cd oraclize-test

$ truffle unbox webpack
```
( Truffle webpack box, which will make it easier for us to create our DApp's front-end)

#Start the Truffle testnet (testrpc):
```
$ truffle develop
```
#Add Oraclize to Truffle
```
$ truffle install oraclize-api

$ truffle develop
```
#Install ethereum-bridge
```
$ mkdir ethereum-bridge

$ git clone https://github.com/oraclize/ethereum-bridge ethereum-bridge

$ cd ethereum-bridge

$ npm install
```
#Start ethereum-bridge
```
$ node bridge -a 9 -H 127.0.0.1 -p 9545 --dev
```
#Compile the code
```
$ truffle compile

$ truffle migrate --development --reset 

$ npm run dev
```
