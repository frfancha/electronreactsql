import React, { useState } from "react";
declare global {
  interface Window {
    ipcRenderer: any;
    sql: any;
  }
}
export const App = () => {
  const [list, setList] = useState<string[]>([]);
  const getData = () => {
    window.ipcRenderer.send("getData", {
      input: "test",
    });
  };
  window.ipcRenderer.on("setData", (e: any, rows: any) => {
    console.log(rows);
    setList(rows);
  });
  const getData2 = () => {
    const connectionString =
      "server=DB-SRS2-TEST;Database=master;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
    const query = "SELECT name FROM sys.databases";
    const sql = require("msnodesqlv8");
    sql.open(connectionString, (err: any, con: any) => {
      if (err) {
        console.error(err);
      } else {
        con.query(query, (err: any, rows: any) => {
          if (rows) {
            setList(rows.map((r: any) => r.name));
          }
        });
      }
    });
  };

  return (
    <>
      <h1>Solvency II</h1>
      <button onClick={getData}>Get data</button>
      <button onClick={getData2}>Get data2</button>
      {list.map((l) => (
        <p key={l}>{l}</p>
      ))}
    </>
  );
};
