function checkAuth(req, res, next ) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({message : 'Request is unauthorized, please login first'})
    }
}
function checkUnAuth(req, res, next ) {
    if (!req.isAuthenticated()) {
        next()
    } else {
        res.json({message : 'Hello, you are already logged in'})
    }
}

export {checkAuth, checkUnAuth}