"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const path_1 = __importDefault(require("path"));
const cells_1 = require("./routes/cells");
const serve = (port, filename, dir, useProxy) => {
    const app = (0, express_1.default)();
    //absolute path of index.html that we need to serve
    const packagePath = require.resolve("local-client/build/index.html");
    //so we determine if we use dev or final product with this ifelse statement.
    if (useProxy) {
        //this is for development and we have to keep our react app development server running while using this. this will serve development server. serving final app (build) client is express.static one where we serve built app.
        app.use((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: "http://127.0.0.1:3000",
            //web socket true. create-react-app uses this default
            ws: true,
            //make sure middleware does not log every incoming request.
            logLevel: "silent",
        }));
    }
    else {
        //tell express serve build folder of the react app. this wont work tho. we can request file/folders from other app. (cli/local-api/client). This solution will only work in development
        //* app.use(express.static("../../local-client/build"));
        //so we added local-client as a dependency to local-api with lerna add local-client --scope=local-api. now all folders of local-client are linked to local-api and we can see them in node_modules as well.
        //* app.use(express.static("../node_modules/local-client/build"));
        //since this is a symbolic link this relative path is not compatible with express.
        app.use(express_1.default.static(path_1.default.dirname(packagePath)));
        // we just dont use index.html here, dirname let us use this path (build folder)
    }
    //router for getting and posting cells from or to local files.
    app.use((0, cells_1.createCellsRouter)(filename, dir));
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
