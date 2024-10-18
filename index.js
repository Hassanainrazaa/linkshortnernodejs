const express = require('express');
const cookieParser = require('cookie-parser');

const { connectToMongoDB } = require("./connection");
const URL = require("./model/urlModel");
const path = require("path");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middleware/auth")

const urlRoute = require('./routes/urlRouter');
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/userRouter");




const app = express();
const PORT = 7000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cookieParser());
connectToMongoDB("mongodb://localhost:27017/link-shortner").then(console.log("DB Connected"));

// app.set("view engine", "ejs");

app.use("/url",
    restrictToLoggedinUserOnly,
    urlRoute);

// app.get("/login", (req, res) => {
//     if (req.user) return res.redirect("/"); // If already logged in, redirect to home
//     res.render("login");
// });
app.use((req, res, next) => {
    if (req.path === "/login" || req.path === "/signup") return next(); // Skip auth for login and signup
    checkAuth(req, res, next); // Apply checkAuth for all other routes
});
app.use("/",
    checkAuth,
    staticRoute);
app.use("/user", userRoute);

app.set("views", path.resolve("./view"));


app.get("/test", async (req, res) => {
    const allUrls = await URL.find();
    res.render("home", {
        urls: allUrls,
    });
});

app.get("/url/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { shortId }, // search for the document by shortId
            {
                $push: { visitHistory: { timestamp: Date.now() } } // push the current timestamp into visitHistory
            },
            { new: true } // optional: return the updated document
        );

        if (!entry) { // check if the document was found
            return res.status(404).send("URL not found"); // handle case where shortId is invalid
        }

        res.redirect(entry.redirectURL); // redirect to the stored URL
    } catch (error) {
        console.error(error); // log the error for debugging
        res.status(500).send("An error occurred"); // handle general errors
    }
});




app.listen(PORT, () => console.log('listening on port'));