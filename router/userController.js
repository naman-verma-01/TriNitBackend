const express = require('express');
const CarbonUser = require('../models/CarbonUser.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const router = express.Router();




router.post('/login', async (req, res) => {
    let response = {}
    try {

        const data = await CarbonUser.find({ where: { userid: req.body.email } })
        console.log(data)
        if (data[0] != null) {
            var comparering = await bcrypt.compare(req.body.password, data[0].password);
        }

        if (comparering) {
            console.log("data", data, comparering)
            response.status = 200,
                response.data = { msg: "Login Successfull", data: data }
        } else {
            console.log("Error 400")
            response.status = 400,
                response.data = { msg: "Login failed" }

        }

        res.status(response.status).json(response.data)

    } catch (error) {
        res.status(500).json({ "message": error.message, "status": "false", "source": "Auth controller", "error": error })
    }
})


router.post('/signup', async (req, res) => {
    let response = {}
    try {

        const hashpass = await bcrypt.hash(req.body.password, 10);

        const user = await new CarbonUser({ userid: req.body.email, password: hashpass,overAllEmission:0 })

        const data = await user.save()

        if (data) {
            response.status = 200,
                response.data = { msg: "Sign Up Successfull", data: data }
        } else {
            console.log("Error 400")
            response.status = 400,
                response.data = { msg: "Sign up failed" }

        }

        res.status(response.status).json(response.data)

    } catch (error) {
        res.status(500).json({ "message": error.message, "status": "false", "source": "Auth controller", "error": error })
    }
})


module.exports = router;