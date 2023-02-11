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
            count=parseInt(website[website.length-1].count);
            totaldata=parseInt(website[website.length-1].totaldata);
        }
//         await Carbon.find({userid:userid,webpage:webpage})
//   .sort({date: -1})
//   .limit(1)
//   .exec(function(err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//         count=parseInt(result[0].count);
//         totaldata=parseInt(result[0].totaldata);
//       console.log(result[0]);
//     }
//   });
        count=count+1;
        totaldata=totaldata+parseInt(datatransferredingb);
        let carbonemission=parseInt(datatransferredingb)*11;
        let status=((carbonemission<11)?2:((carbonemission<20)?1:0));
        console.log(status);
        let carbondata;
    //   try{
       carbondata = await Carbon.create({
            userid:userid,
            webpage:webpage,
            datatransferredingb:datatransferredingb,
            totaldata:totaldata,
            carbonemission:carbonemission,
            status: status,
            count:count
      })
      res.json({carbondata});
    // }
    // catch(error){
    //     res.status(400).json({error:"there has a error in your code."});
    // }
    },
  );

  router.get('/getdata',
    async(req,res)=>{
          console.log(req.body);
          let {userid}=req.body;
          Carbon.find({ userid: userid }, (err, results) => {
            if (err) {
                res.status(400).json({error:"there has a error in your code."});
            } else {
              console.log(results);
              res.status(200).json({results});
            }
          });
    }
  );
  module.exports = router;