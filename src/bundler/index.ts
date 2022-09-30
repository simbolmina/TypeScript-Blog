import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;

const bundle = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      // we say to esbuild to go to fetch wasm bundle from public folder and start service.
      // we can host this file or ask from unpkg com as well. wasmURL: "/esbuild.wasm",
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }

  try {
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": '"production"',
        //some packages requres this line. we want to pass production string, thats thy there are two quotes
        global: "window",
        //when bundling packages global variable should be window
      },
      //settings for our pre imported react/dom packages to avoid collustion from user downloaded packages
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });
    return { code: result.outputFiles[0].text, err: "" };
  } catch (err) {
    if (err instanceof Error) {
      return {
        code: "",
        err: err.message,
      };
    } else {
      throw err;
    }
  }
};

export default bundle;
