"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
function NotFound(req, res, next) {
    next({
        status: 404,
        message: `Path not found: ${req.originalUrl}`
    });
}
exports.NotFound = NotFound;
