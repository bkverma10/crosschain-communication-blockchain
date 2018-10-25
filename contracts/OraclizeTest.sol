pragma solidity ^0.4.21;
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";


contract OraclizeTest is usingOraclize {

    address public owner;
    string public ETHUSD;
    address public account1;
    uint public amount;

    event LogInfo(string description);
    event LogPriceUpdate(string price);
    event LogUpdate(address indexed _owner, uint indexed _balance);
     
     /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    
    // Constructor
    function OraclizeTest()
    payable
    public {
        owner = msg.sender;

        emit LogUpdate(owner, address(this).balance);

        // Replace the next line with your version:
        //OAR = OraclizeAddrResolverI(0xb23Ca91D99c98448BD506e6628B51cc950f479A6);
        //OAR = OraclizeAddrResolverI(0xaDb2b18b616bd2993e288c5B2eB4d0429CEf4Db8);
        //OAR = OraclizeAddrResolverI(0xD3E4c7fdA9838a1f99ED78cbD8F8cB036CFDAAbc);
        //OAR = OraclizeAddrResolverI(0xC2f71a0ed5986A22aAe8fD05b6077569956059E5);
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);

        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        update();
    }

    // Fallback function
    function()
    public{
        revert();
    }

    function __callback(bytes32 id, string result, bytes proof)
    public {
        require(msg.sender == oraclize_cbAddress());
        
        ETHUSD = result;
        emit LogInfo("Bharat");
        emit LogPriceUpdate(ETHUSD);
       
        account1 = 0xf17f52151ebef6c7334fad080c5704d77216b732;
        amount = 1 ether;
        
       uint v = parseInt(ETHUSD);
       // account1.transfer(amount);
        //getBalance();
         //update();
    }



    function getBalance()
    public
    returns (uint _balance) {
        return address(this).balance;
    }

    function update()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize query was sent, standing by for the answer..");

            // Using XPath to to fetch the right element in the JSON response
            //oraclize_query("URL", "json(https://api.coinbase.com/v2/prices/ETH-USD/spot).data.amount");
            oraclize_query("URL", "json(https://brown-fireant-17.localtunnel.me/api/transactionStatus).amount");
        }
    }

}





