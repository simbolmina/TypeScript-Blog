import "bulmaswatch/superhero/bulmaswatch.min.css";
import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/CodeEditor";

function App() {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState("");
  // const [code, setCode] = useState("");

  // we say to esbuild to go to fetch wasm bundle from public folder and start service.
  const startService = async () => {
    //we are assigning the service object to the ref so we can use it in the clickHandler.
    ref.current = await esbuild.startService({
      worker: true,
      // we can host this file or ask from unpkg com as well. wasmURL: "/esbuild.wasm",
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const clickHandler = async () => {
    if (!ref.current) return;

    //reset content of iframe at each submit.
    iframe.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        //some packages requres this line. we want to pass production string, thats thy there are two quotes
        global: "window",
        //when bundling packages global variable should be window
      },
    });

    // setCode(result.outputFiles[0].text);
    //we are sending a messsage containing code outupt to parent (browser)
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  // we are passing our into iframe within a script tag so browser will run for us as soon as iframe loads up. since some libraries have <script></script> in them as well this breaks our app.
  // const html = `
  // <script> ${code}</script>
  // `;

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            // console.log(event.data)
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: darkred;"><h4>RunTime Error</h4>'+ err +'</div>';
              throw err;
            }
          }, false)
        </script>
      </body>
    </html>
  `;

  //after sending code via a message to iframe we run eval(event.data) which let us run js code given as a string in the browser.

  return (
    <div>
      <CodeEditor
        initialValue="console.log('test')"
        onChange={(value) => setInput(value)}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={clickHandler} className="button is-primary">
          Submit
        </button>
        {/* <pre>{code}</pre> */}
        <iframe
          sandbox="allow-scripts"
          srcDoc={html}
          title="runjs"
          ref={iframe}
        />
      </div>
    </div>
  );
}

export default App;
