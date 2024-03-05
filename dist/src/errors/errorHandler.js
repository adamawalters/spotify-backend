"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(error, req, res, _next) {
    console.error(JSON.stringify(error.message));
    const { status = 500, message = "Something went wrong! " } = error;
    res.status(status).json({ error: message });
}
exports.errorHandler = errorHandler;
