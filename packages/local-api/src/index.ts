import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export const serve = (port: number, filename: string, dir: string) => {
  // console.log("serving traffik to port: " + port);
  // console.log("saving/fetching cell from " + filename);
  // console.log("file is in " + dir);
  const app = express();

  app.use(
    createProxyMiddleware({
      target: "http://localhost:3000",
      ws: true,
      logLevel: "silent",
    })
  );

  // this is for if user tries to run our application again while its running so we can show a decend warning message says that port is already in use. because running server takes time and even if we throw and error beforehand if we dont await the server running our application wont see that error and user will be confsused.
  //wrap express into custom promise to use it with async syntax. if we successfully run server it will resolve, otherwise it will reject and we will catch the error in the catch statement of serve.ts
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });

  // app.listen(port, () => {
  //   console.log("listening on port " + port);
  // });
};
