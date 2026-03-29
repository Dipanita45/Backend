class ApiResponse{
    constructor(
        satutsCode,
       data, message = "Success"){
this.statusCode = this.statusCode
this.message = message
this.data = data
this.success = this.statusCode < 400
    }
}

export {ApiResponse }