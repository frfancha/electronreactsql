const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: isDev ? 1600 : 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/preload.js",
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

app.allowRendererProcessReuse = false;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("getData", (event, args) => {
  getData((rows) => {
    mainWindow.webContents.send("setData", rows);
  });
});

const getData = (cb) => {
  const connectionString =
    "server=DB-SRS2-TEST;Database=master;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
  const query = "SELECT name FROM sys.databases";
  const sql = require("msnodesqlv8");
  sql.open(connectionString, (err, con) => {
    if (err) {
      console.error(err);
    } else {
      con.query(query, (err, rows) => {
        if (rows) {
          cb(rows.map((r) => r.name));
        }
      });
    }
  });
};
