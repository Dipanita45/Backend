const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }




// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)  //wrapper function
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,  //flag pass krte hain
//             messa ge: err.message   //message return krte hain
//         })
//     }
// }


//async is higher order function (it act as variable)