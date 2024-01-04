export default class CustomError {
    static createError({ name = "Error", cause, message, code = 4 }) {
        const error = new Error(message)
        error.name = name;
        error.code = code;
        error.cause = cause
        throw error.name+'\n'+error.message+'\n'+error.code+'\n'+error.cause;
    }
}