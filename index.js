const express = require("express");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const mongoose = require("mongoose");
const fetch = require('node-fetch'); // Import the fetch library for making HTTP requests

var bodyParser = require('body-parser')

const Rec = require("./TX")
const app = express();
const cors = require("cors");
require("dotenv").config();

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());

const syms = ['BNB', 'WBNB', 'USDT', 'BUSD', 'USDC', 'WETH', 'WBTC',]
app.get("/l", async (req, res) => {
  const response = await Moralis.EvmApi.token.getTokenMetadataBySymbol({
    "chain": "0x38",
    symbols: syms
  });
  return res.status(200).json({
    status: "success", data: response
  });
})

//TxRec.create({ title: 'First test', detail: { symbols: syms } })

const https = require('https');



//#region =================== Info Record Endpoints

app.get("/getRecord/:id", async (req, res) => {
  try {
    console.log(req.params.id)
    Rec.findById(req.params.id).then((ress) => {
      return res.status(200).json({
        status: "success", data: ress
      });
    }).catch((error) => {
      return res.status(501).json({
        status: 'error', data: error.message
      });
    })

  } catch (error) {
    return res.status(501).json({
      status: 'error', data: error
    });
  }
})

app.get("/delRecord/:id", async (req, res) => {
  try {
    console.log('to delete: ' + req.params.id)
    Rec.findByIdAndDelete(req.params.id).then((ress) => {
      return res.status(200).json({
        status: "success", data: ress
      });
    }).catch((error) => {
      return res.status(501).json({
        status: 'error', data: error.message
      });
    })

  } catch (error) {
    return res.status(501).json({
      status: 'error', data: error
    });
  }
})


app.post("/record/:title/:cat", express.json({ type: '*/*' }), async (req, res) => {
  try {
    console.log('req.body:')
    console.info(req.body)
    Rec.create({
      title: req.params.title,
      category: req.params.cat,
      details: req.body
    }).then((result) => {
      return res.status(200).json({
        status: 'success', id: result._id
      });
    }).catch((error) => {
      return res.status(501).json({
        status: 'error', data: error.message
      });
    })


  } catch (error) {
    return res.status(501).json({
      status: 'error', data: error
    });
  }

})

app.get("/recordList/:cat", async (req, res) => {
  try {
    var cat = req.params.cat;
    Rec.find().then((recRes) => {
      var results = new Array();
      var n = 0;
      console.log('cat: ' + cat + '   -lenght: ' + recRes.length)
      if (cat == 'all') {
        for (let i = 0; i < recRes.length; i++) {
          results[n] = { title: recRes[i].title, id: recRes[i]._id }
          n++;
        }
        console.log('results: ' + results)
        return res.status(200).json({
          status: 'success', data: results
        });

      } else {
        for (let i = 0; i < recRes.length; i++) {
          if (recRes[i].category == cat) {
            results[n] = { title: recRes[i].title, id: recRes[i]._id }
            n++
          }
        }

        return res.status(200).json({
          status: 'success', data: results
        });
      }
    }).catch((error) => {
      return res.status(501).json({
        status: 'error', data: error.message
      });
    })
  } catch (error) {
    return res.status(501).json({
      status: 'error', data: error
    });
  }
})
app.get("/allrecord", async (req, res) => {
  try {
    Rec.find().sort({ recordTime: -1 }).then((recRes) => {
      //recRes.sort({recordTime:1})
      return res.status(200).json({
        status: 'success', data: recRes
      });


    }).catch((error) => {
      return res.status(501).json({
        status: 'error', data: error.message
      });
    })
  } catch (error) {
    return res.status(501).json({
      status: 'error', data: error
    });
  }
})

//#endregion



app.get("/getSA/:id", async (req, res) => {
  console.log('get req received')
  const url = 'https://api.1inch.io/v5.0/1/healthcheck'
  //const url = 'https://api.1inch.io/v5.0/56/approve/spender'
  var id = req.params.id
  console.log('for get SA id: ' + id);
  let data = '';
  var options = {
    hostname: 'api.1inch.io' + '/v5.0/' + id + '/approve/spender',
    port: 443,
    //url: url,
    //path: ,
    method: 'GET',
    headers: {
      //'Content-Type': 'application/json',
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'mode': "no-cors",
      "User-Agent": "Mozilla/5.0",
      "accept": "*/*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      // "x-api-key": "2f6f419a083c46de9d83ce3dbe7db601",
      // "x-build-id": "ZYBX3lrvsE1If7r197bQQ",
      "X-Requested-With": "",
      "User-Agent": "Mozilla/5.0",
      "cookie": ""
      //'CORS': '*'
    }
  }

  try {


    https.get(options, (resp) => {

      console.log('get req sent')
      resp.on('data', (chunk) => {
        data += chunk;
        console.log('A chunck added')
      });
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log('get req ----> end')

        console.info(data);
        //console.info(resp);
        return res.status(200).json({
          status: "success", data: data
        });
      });

    }).on("error", (err) => {
      // console.log("Error: " + err.message);
      console.log("73: Error: " + err);
      return res.status(200).json({
        status: "error", data: err
      });
    });
  } catch (error) {
    console.log("76: Error: " + error);
    return res.status(200).json({
      status: "error", data: error
    });
  }


})
function checkAllowance(ta, wa) {
  return fetch(apiRequestUrl('api.1inch.io/v5.0/56/approve/allowance', { tokenAddress, walletAddress }))
    .then(res => res.json())
    .then(res => res.allowance);
}

app.get("/fetch", async (req, res) => {
  return fetch('https://api.1inch.io/v5.0/' + req.Q)
})
app.get("/al", async (req, res) => {

  var tokenAddress = req.tokenAddress// "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
  var walletAddress = req.walletAddress//'0x11677b07C9AcA203A9131571a164C3F0d3f31908'
  var cid = req.cid
  //return fetch('api.1inch.io/v5.0/56/approve/allowance', { tokenAddress, walletAddress })
  return fetch('https://api.1inch.io/v5.0/' + cid + '/approve/allowance?tokenAddress=' + tokenAddress + '&walletAddress=' + walletAddress)//, { tokenAddress, walletAddress }
  //return fetch('https://api.1inch.io/v5.0/56/approve/allowance?tokenAddress=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&walletAddress=0x11677b07C9AcA203A9131571a164C3F0d3f31908')//, { tokenAddress, walletAddress }
  // fetch('https://api.1inch.io/v5.0/56/healthcheck')
  //   .then(resx => {
  //     console.log('res came ----***')
  //     console.log(resx)
  //     return res.status(200).json({
  //       status: "success", data: resx
  //     });
  //   })
})

app.get("/pa", async (req, res) => {
  const chain = EvmChain.BSC;

  // token 0 address, e.g. WBNB token address
  const token1Address = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";

  // token 1 address, e.g. Cake token address
  const token0Address = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";

  const response = await Moralis.EvmApi.defi.getPairAddress({
    token0Address,
    token1Address,
    chain,
    exchange: "pancakeswapv1",
  });

  console.log(response)

  return res.status(200).json({
    status: "success", data: response
  });
})

app.get("/getTokenPrice", async (req, res) => {

  try {
    const { query } = req
    console.info(query)
    var address = query.address
    console.log('get started')
    console.log(address)
    console.log(typeof (EvmChain))
    var mchain = EvmChain.ETHEREUM;
    var ch = query.chain;
    switch (ch) {
      case 'ETH':
        console.log('inside the switch ch: ' + ch)
        mchain = EvmChain.ETHEREUM;
        break;
      case 'BSC':
        console.log('inside the switch ch: ' + ch)
        mchain = EvmChain.BSC;
        break;
      case 'TBSC':
        mchain = EvmChain.BSC_TESTNET;
        break;
      case 'AVA':
        mchain = EvmChain.AVALANCHE;
        break;
      case 'FAN':
        mchain = EvmChain.FANTOM;
        break;

      case 'POL':
        mchain = EvmChain.POLYGON;
        break;

      default:
        mchain = EvmChain.BSC;
        break;
    }

    console.log('mchain: ')
    //console.info(mchain)

    var price = await Moralis.EvmApi.token.getTokenPrice({
      address: address,
      chain: mchain
    })
    console.log(price)

    return res.status(200).json({
      status: "success", data: price
    });
  } catch (error) {
    console.log('=============================================================')
    console.log(error.message)
    console.log('=============================================================')
    return res.status(501).json({
      status: "error", data: error.message
    });
  }


});

app.get("/tokenPrice", async (req, res) => {
  const { query } = req
  console.info(query)
  var addressArray = (query.addressArray).split(",")
  console.log('starteder')
  console.log(typeof (addressArray))
  console.log(typeof (EvmChain))
  console.info(addressArray)
  console.log(addressArray[1])
  //console.info(query)
  var mchain = EvmChain.ETHEREUM;
  var ch = query.chain;
  switch (ch) {
    case 'ETH':
      mchain = EvmChain.ETHEREUM;
      break;
    case 'BSC':
      mchain = EvmChain.BSC;
      break;
    case 'AVA':
      mchain = EvmChain.AVALANCHE;
      break;
    case 'FAN':
      mchain = EvmChain.FANTOM;
      break;

    case 'POL':
      mchain = EvmChain.POLYGON;
      break;

    default:
      mchain = EvmChain.BSC;
      break;
  }


  //var address = '0x465e07d6028830124BE2E4aA551fBe12805dB0f5';
  var prices = new Array();

  for (let i = 0; i < addressArray.length; i++) {
    const Maddress = addressArray[i];
    prices[i] = await Moralis.EvmApi.token.getTokenPrice({
      address: Maddress,
      chain: mchain
    })
    console.log(i)
    // .then((res) => {
    //   prices[i] = res
    // })
  }
  // const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
  //   address: query.addresstwo,
  //   chain: mchain
  // });
  // var Maddress = addressArray[0]
  // prices[0] = await Moralis.EvmApi.token.getTokenPrice({
  //   address: Maddress,
  //   chain: mchain
  // })


  setTimeout(() => {

    return res.status(200).json({
      status: "success", data: prices
      //  {
      //   'responseOne': responseOne,
      //   'responseTwo': responseTwo,
      // }
    });
  }, 2000);


});

app.get("/health", async (req, res) => {

  return res.status(200).json({
    status: "success",
    dbState: mongoose.STATES[mongoose.connection.readyState]
  });
})

const serverStatus = () => {
  return {
    state: 'up',
    dbState: mongoose.STATES[mongoose.connection.readyState]
  }
};
//  Plug into middleware.
// app.use('/uptime', require('express-healthcheck')({
//   healthy: serverStatus
// }));

app.get('/ut', async (req, res) => {
  console.log(mongoose.connection.readyState);
})

app.use(bodyParser.json());
Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  var dburi = process.env.dburi
  mongoose.connect(dburi, {});
  const port = process.env.port;

  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
