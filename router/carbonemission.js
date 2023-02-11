const express = require('express');
const Carbon = require('../models/Carbon.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post(
    '/postdata',
    async(req, res) => {
        console.log(req.body);
        let {userid,webpage,datatransferredingb}=req.body;
        let count=0,totaldata=0;
        let website = await Carbon.find({userid:userid,webpage:webpage});
        console.log(website.length);
        console.log(website);
        if(website.length>0){
            console.log(website[website.length-1]);
            count=parseFloat(website[website.length-1].count);
            totaldata=parseFloat(website[website.length-1].totaldata);
        }
        count=count+1;
        totaldata=totaldata+parseFloat(datatransferredingb);
        let carbonemission=parseFloat(datatransferredingb)*11;
        let status=((carbonemission<11)?2:((carbonemission<20)?1:0));
        console.log(status);
        let carbondata;
    //   try{
    carbondata = await Carbon.create({
      userid: userid,
      webpage: webpage,
      datatransferredingb: datatransferredingb,
      totaldata: totaldata,
      carbonemission: carbonemission,
      status: status,
      count: count
    })


    let currentWebsite = await Carbon.find({ userid: userid, webpage: "current" });
    console.log("currentWebsite.length", currentWebsite.length, datatransferredingb)
    if (currentWebsite.length > 0) {

      let updated = await Carbon.findOneAndUpdate({ userid: userid, webpage: "current" }, { datatransferredingb: datatransferredingb, carbonemission: carbonemission,status:webpage })
      console.log("updated", updated)
    } else {
      Carbon.create({
        userid: userid,
        webpage: "current",
        datatransferredingb: datatransferredingb,
        totaldata: totaldata,
        carbonemission: carbonemission,
        status: webpage,
        count: count
      })
    }
    res.json({ carbondata });
    // }
    // catch(error){
    //     res.status(400).json({error:"there has a error in your code."});
    // }
  },
);

router.get('/getdata/:userid',
  async (req, res) => {
    console.log(req.params);
    let userid = req.params.userid;
    Carbon.find({ userid: userid }, (err, results) => {
      if (err) {
        res.status(400).json({ error: "there has a error in your code." });
      } else {
        console.log(results);
        res.status(200).json({ results });
      }
    });
  }
);
router.get('/getalldata',
  async (req, res) => {
    let alldata = await Carbon.find().sort({ "totaldata": -1 });
    console.log(alldata);
    res.status(200).json({ alldata });
  }
);


router.get('/getCurrentTab/:userid',
  async (req, res) => {
    
    let userid = req.params.userid;
    
    Carbon.find({ userid: userid, webpage:"current" }, (err, results) => {
      if (err) {
        res.status(400).json({ error: "there has a error in your code." });
      } else {
        console.log(results);
        res.status(200).json({ results });
      }
    });
  }
);


router.get('/getWebpageDetail',
  async (req, res) => {
    
    let userid = req.query.user;
    let webpage = req.query.webpage;
    
    Carbon.find({ userid: userid, webpage:webpage }, (err, results) => {
      if (err) {
        res.status(400).json({ error: "there has a error in your code." });
      } else {
        console.log(results);
        res.status(200).json({ results });
      }
    });
  }
);


module.exports = router;