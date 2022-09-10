import * as esbuild from "esbuild-wasm";
import axios from "axios";

import localForage from "localforage";

/**
LocalForage is an api enables us to use browser indexedDB and localstorage. Our project can be much for just localstorage to handle so we use much more complext indexedDB option and this api makes it easy to use it. If browser does not support indexedDB, api uses localstorage instead.
 */

const fileCache = localForage.createInstance({
  name: "filecache",
});

//* how indexedDB works
// (async () => {
//   await fileCache.setItem("color", "red");

//   const color = await fileCache.getItem("color");
//   console.log(color);
// })();

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of 'index.js'
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      //if we dont return anything with onLoad function, esbuild will continue to next onLoad. we can use this functionality and use it as a middleware and use it for cachedResult. If rquesti is in the cashe, return it, if no keep going.

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // check if we already have fetched this file. before adding type of this file, esbuild did not work.
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // if it is, return it
        if (cachedResult) return cachedResult;
      });

      //Handle css files
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        // replace all newlines with empty string and replace all single or double quotes with other ones so all of our code can stay in single quotes '${data}' wihtout breaking js code.

        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // store response in the cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      //handle root files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // store response in the cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
