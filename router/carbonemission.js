const express = require('express');
const Carbon = require('../models/Carbon.js');
const CarbonUser = require('../models/CarbonUser.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post(
  '/postdata',
  async (req, res) => {
    console.log(req.body);
    let { userid, webpage, datatransferredingb } = req.body;
    let count = 0, totaldata = 0;
    let website = await Carbon.find({ userid: userid, webpage: webpage });
    console.log(website.length);
    console.log(website);
    if (website.length > 0) {
      console.log(website[website.length - 1]);
      count = parseFloat(website[website.length - 1].count);
      totaldata = parseFloat(website[website.length - 1].totaldata);
    }
    count = count + 1;
    totaldata = totaldata + parseFloat(datatransferredingb);
    let carbonemission = parseFloat(datatransferredingb) * 11;
    let status = ((carbonemission < 11) ? 2 : ((carbonemission < 20) ? 1 : 0));
    console.log(status);
    let carbondata;

//    await CarbonUser.findOneAndUpdate({ userid }, { overAllEmission: { $inc: carbonemission } })

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

      let updated = await Carbon.findOneAndUpdate({ userid: userid, webpage: "current" }, { datatransferredingb: datatransferredingb, carbonemission: carbonemission, status: webpage })
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

    Carbon.find({ userid: userid, webpage: "current" }, (err, results) => {
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

    Carbon.find({ userid: userid, webpage: webpage }, (err, results) => {
      if (err) {
        res.status(400).json({ error: "there has a error in your code." });
      } else {

        console.log(results);
        results = results.sort((a, b) => parseInt(a.count) - parseInt(b.count))
        res.status(200).json({ results });
      }
    });
  }
);

router.get('/getUserRanking',
  async (req, res) => {

    let userid = req.query.user;
    var otherUserEmission = 0
    var UserEmission = 0
    
    Carbon.find({ }, async(err, results) => {
      if (err) {
        res.status(400).json({ error: "there has a error in your code." });
      } else {

      //  console.log(results);
        var totalUser = await CarbonUser.countDocuments()
        for(let el of results){
        //  console.log(el.carbonemission)
          if(el.userid === userid){
            UserEmission += parseFloat(el.carbonemission)
          }else{
            otherUserEmission += parseFloat(el.carbonemission)
          }
        }

        //results = results.sort((a, b) => parseInt(a.count) - parseInt(b.count))
        res.status(200).json({UserEmission, otherUserEmission,totalUser});
      }
    });
  }
);

router.get('/lastThreeDays', async (req, res) => {
  let response = {}
  try {

    var emission1 = 0
    var emission2 = 0
    var emission3 = 0

    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let date1 = new Date(year,month,day+1)
    let date2 = new Date(year,month,day)
    let date3 = new Date(year,month,day-1)
    let date4 = new Date(year,month,day-2)

    let data1 = await Carbon.find({userid:req.query.userid, "date":{ '$gte':date2, '$lte':date1 }})
    let data2 = await Carbon.find({userid:req.query.userid,"date":{ '$gte':date3, '$lte':date2 }})
    let data3 = await Carbon.find({userid:req.query.userid,"date":{ '$gte':date4, '$lte':date3 }})
    
    
  //  console.log(data1,data2,data3)

    for(let i of data1){
      emission1 += parseFloat(i.carbonemission)
    }

    for(let i of data2){
     // console.log(i.carbonemission)
      emission2 += parseFloat(i.carbonemission)
    }

    for(let i of data3){
      emission3 += parseFloat(i.carbonemission)
    }
    //console.log(data1.length,data2.length,data3.length)
    let data = {emission1,emission2,emission3}
    if (data) {
          response.status = 200,
              response.data = { msg: "Successfull", data: data }
      } else {
          console.log("Error 400")
          response.status = 400,
              response.data = { msg: "failed" }

      }

      res.status(response.status).json(response.data)

  } catch (error) {
      res.status(500).json({ "message": error.message, "status": "false", "source": "Auth controller", "error": error })
  }
})

module.exports = router;