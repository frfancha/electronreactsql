import React, { useState, useEffect } from "react";
import { SqlClient } from "msnodesqlv8";

const connectionString =
  "server=DB-SRS2-TEST;Database=qbere;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const query = "SELECT name FROM deprod.ct_country";
export const App = () => {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    const sql: SqlClient = require("msnodesqlv8");
    sql.open(connectionString, (err, con) => {
      if (err) {
        console.error(err);
      } else {
        con.query(query, (err, rows) => {
          if (rows) {
            console.log(rows);
            setList(rows.map((r) => r.name));
          }
        });
      }
    });
  });
  return (
    <>
      <h1>Solvency II</h1>
      {list.map((l) => (
        <p key={l}>l</p>
      ))}
    </>
  );
};
