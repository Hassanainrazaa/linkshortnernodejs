const shortid = require("shortid");
const URL = require("../model/urlModel");
async function handleGenerateShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(404).json({ error: "URL is required" });
    const shortId = shortid();
    await URL.create({
        shortId: shortId,
        redirectURL: req.body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });
    console.log(shortId);
    return res.render("home", {

        id: shortId,
    });

}

// async function handleGetAnalytics(req, res) {
//     const shortId = req.params.id;
//     const result = await URL.findOne({ shortId });
//     return res.json({ totalClicks: result.visitHistory.length || 0, analytics: result.analytics || [] });

// }
async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId; // assuming 'id' is the param key
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ message: "Short ID not found" }); // Handle case where no matching document is found
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory // default to an empty array if no analytics field
        });

    } catch (error) {
        console.error(error); // Log the error
        return res.status(500).json({ message: "An error occurred while fetching analytics" }); // Handle any other errors
    }
}


module.exports = { handleGenerateShortURL, handleGetAnalytics };