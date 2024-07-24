export default class ExpressError extends Error {
    constructor(message, code) {
        super();
        this.message = message;
        this.code = code;
    }

}