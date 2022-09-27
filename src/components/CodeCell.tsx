import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import Preview from ".//Preview";
import bundle from "../bundler";
import Resizable from "./Resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/useActions";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState("");
  // const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const { updateCell } = useActions();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const result = await bundle(cell.content);
      // const result = await bundle(input);
      setCode(result.code);
      setErr(result.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    // }, [input]);
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="//Code Here"
            // onChange={(value) => setInput(value)}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} bundleStatus={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
