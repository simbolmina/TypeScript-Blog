import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import Preview from ".//Preview";
import bundle from "../bundler";
import Resizable from "./Resizable";

function CodeCell() {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      const result = await bundle(input);
      setCode(result.code);
      setErr(result.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="//Code Here"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} bundleStatus={err} />
      </div>
    </Resizable>
  );
}

export default CodeCell;
