const express = require("express");
const app = express();
const go = require("index.js")

app.get("getTest", async (req, res) => {
      go.health()
      return res.status(200).json({
            status: "success", data: res
      });
})