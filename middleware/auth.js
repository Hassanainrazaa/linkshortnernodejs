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
    // Debug: Log request cookies
    console.log("Request cookies:", req.cookies);

    // Get the user UID from cookies
    const userId = req.cookies?.uid;
    console.log("User ID from cookies:", userId); // Debug: Log user ID

    // If no user UID is present, redirect to login
    if (!userId) {
        console.log("No user ID found in cookies, redirecting to /login");
        return res.redirect("/login");
    }

    // Fetch the user by UID
    const user = await getUser(userId);
    console.log("User fetched from DB:", user); // Debug: Log the user object

    // If no user is found, redirect to login
    if (!user) {
        console.log("User not found, redirecting to /login");
        return res.redirect("/login");
    }

    // If user is found, attach it to req object
    req.user = user;

    // Proceed to the next middleware or route
    next();
}


module.exports = { restrictToLoggedinUserOnly, checkAuth };
