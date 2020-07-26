import React, { useState } from "react";
declare global {
  interface Window {
    ipcRenderer: any;
  }
}
export const App = () => {
  const [list, setList] = useState<string[]>([]);
  const getData = () => {
    window.ipcRenderer.send("getData", {
      input: "test",
    });
  };
  window.ipcRenderer.on("setData", (e: any, args: any) => {
    console.log(args.output);
    setList(JSON.parse(args.output));
  });
  return (
    <>
      <h1>Solvency II</h1>
      <button onClick={getData}>Get data</button>
      {list.map((l) => (
        <p key={l}>{l}</p>
      ))}
    </>
  );
};
