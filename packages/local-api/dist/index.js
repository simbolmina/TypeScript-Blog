"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const serve = (port, filename, dir) => {
    // console.log("serving traffik to port: " + port);
    // console.log("saving/fetching cell from " + filename);
    // console.log("file is in " + dir);
    const app = (0, express_1.default)();
    app.use((0, http_proxy_middleware_1.createProxyMiddleware)({
        target: "http://localhost:3000",
        ws: true,
        logLevel: "silent",
    }));
    // this is for if user tries to run our application again while its running so we can show a decend warning message says that port is already in use. because running server takes time and even if we throw and error beforehand if we dont await the server running our application wont see that error and user will be confsused.
    //wrap express into custom promise to use it with async syntax. if we successfully run server it will resolve, otherwise it will reject and we will catch the error in the catch statement of serve.ts
    return new Promise((resolve, reject) => {
        app.listen(port, resolve).on("error", reject);
    });
    // app.listen(port, () => {
    //   console.log("listening on port " + port);
    // });
};
exports.serve = serve;
