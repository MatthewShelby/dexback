const express = require("express");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const mongoose = require("mongoose");
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



// app.get("/getSpenderAddress", async (req, res) => {
//   console.log('get req received')
//   const url = 'https://api.1inch.io/v5.0/1/healthcheck'
//   //const url = 'https://api.1inch.io/v5.0/56/approve/spender'
//   let data = '';
//   var options = {
//     hostname: 'api.1inch.io',
//     port: 443,
//     //url: url,
//     path: '/v5.0/1/healthcheck',
//     method: 'GET',
//     headers: {
//       //'Content-Type': 'application/json',
//       //'Content-Type': 'application/json'
//       'Accept': 'application/json',
//       'mode': "no-cors",
//       //'CORS': '*'
//     }
//   }


//   https.get(options, (resp) => {

//     console.log('get req sent')
//     resp.on('data', (chunk) => {
//       data += chunk;
//       console.log('A chunck added')
//     });
//     // The whole response has been received. Print out the result.
//     resp.on('end', () => {
//       console.log('get req end')

//       console.info(data);
//       //console.info(resp);
//       return res.status(200).json({
//         status: "success", data: data
//       });
//     });

//   }).on("error", (err) => {
//     // console.log("Error: " + err.message);
//     console.log("73: Error: " + err);
//     return res.status(200).json({
//       status: "error", data: err
//     });
//   });



// })


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
    status: "success"
  });
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
