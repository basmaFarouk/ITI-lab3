const logRequest = (req, res,next)=>{
    console.log(req.method, req.url, new Date())
    next()
}

module.exports = {
    logRequest,
}