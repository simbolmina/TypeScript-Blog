import { useRef, useEffect } from "react";
import "./Preview.css";
interface PreviewProps {
  code: string;
  bundleStatus: string;
}

// we are passing our into iframe within a script tag so browser will run for us as soon as iframe loads up. since some libraries have <script></script> in them as well this breaks our app.
// const html = `
// <script> ${code}</script>
// `;

const html = `
    <html>
      <head>
        <style>html {background-color: #fff}</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: darkred;"><h4>RunTime Error</h4>'+ err +'</div>';
          throw err;
        };

        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error);
        })
          window.addEventListener('message', (event) => {
            // console.log(event.data)
            try {
              eval(event.data);
            } catch (err) {
              handleError(err)
            }
          }, false)
        </script>
      </body>
    </html>
  `;

//after sending code via a message to iframe we run eval(event.data) which let us run js code given as a string in the browser.

const Preview: React.FC<PreviewProps> = ({ code, bundleStatus }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    //reset content of iframe at each code snippet change.
    iframe.current.srcdoc = html;

    //we are sending a messsage containing code outupt to parent (browser)
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        sandbox="allow-scripts"
        srcDoc={html}
        title="runjs"
        ref={iframe}
      />
      {bundleStatus && <div className="preview-error">{bundleStatus}</div>}
    </div>
  );
};

export default Preview;
