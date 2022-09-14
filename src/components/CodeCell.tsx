import { useState } from "react";
import CodeEditor from "./CodeEditor";
import Preview from ".//Preview";
import bundle from "../bundler";
import Resizable from "./Resizable";

function CodeCell() {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const clickHandler = async () => {
    const result = await bundle(input);
    setCode(result);
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="console.log('test')"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
}

export default CodeCell;
