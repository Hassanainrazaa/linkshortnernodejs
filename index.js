const express = require('express');

const urlRoute = require('./routes/urlRouter');
const { connectToMongoDB } = require("./connection");
const URL = require("./model/urlModel");
const staticRoute = require("./routes/staticRouter");
const path = require("path");



const app = express();
const PORT = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectToMongoDB("mongodb://localhost:27017/link-shortner").then(console.log("DB Connected"));
app.set("view engine", "ejs");

app.use("/url", urlRoute);
app.use("/", staticRoute);
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