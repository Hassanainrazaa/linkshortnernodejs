const express = require('express');

const URL = require("../model/urlModel");


const router = express.Router();

// router.get('/', async (req, res) => {
//     if (!req.user) return res.render('');
//     const allUrls = await URL.find({
//         createdBy: req.user._id
//     });
//     return res.render('home', {
//         urls: allUrls
//     });
// });

router.get('/', async (req, res) => {
    if (!req.user) return res.render('login'); // If user is not authenticated, show login
    const allUrls = await URL.find({ createdBy: req.user._id });
    return res.render('home', {
        urls: allUrls
    });
});


router.get('/signup', async (req, res) => {
    return res.render('signup');
});

router.get('/login', async (req, res) => {
    return res.render('login');
});




module.exports = router;

