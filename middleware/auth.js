const { getUser } = require('../service/auth');

async function restrictToLoggedinUserOnly(req, res, next) {
    // Debug: Log request object to ensure it's properly received
    console.log("Request object:", req);

    // Get the user UID from cookies
    const userUid = req.cookies?.uid;
    console.log("User UID from cookie:", userUid); // Debug: Log user UID

    // If no user UID is present in the cookies, redirect to login
    if (!userUid) {
        console.log("No user UID found, redirecting to login");
        return res.redirect("/login");
    }

    // Try to get the user using the UID
    const user = await getUser(userUid);
    console.log("User found:", user); // Debug: Log the user object

    // If user is not found, redirect to login
    if (!user) {
        console.log("User not found, redirecting to login");
        return res.redirect("/login");
    }

    // If user is found, attach it to req object
    req.user = user;

    // Proceed to the next middleware or route
    next();
}

async function checkAuth(req, res, next) {
    const userId = req.cookies?.uid;

    const user = await getUser(userId); // Ensure to await the result

    if (!user) return res.redirect("/login");

    req.user = user;
    next();
}


module.exports = { restrictToLoggedinUserOnly, checkAuth };
