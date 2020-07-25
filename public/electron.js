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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// ------------------- set up event listeners here --------------------

// temporary variable to store data while background
// process is ready to start processing
let cache = {
  data: undefined,
};

// a window object outside the function scope prevents
// the object from being garbage collected
let hiddenWindow;

// This event listener will listen for request
// from visible renderer process

// ipcMain.on("data:send", (e, newInput) => {
//   const newOutput = newInput * newInput;
//   win.webContents.send("data:get", newOutput);
// });

ipcMain.on("python:pythonInput1", (event, args) => {
  const backgroundFileUrl = url.format({
    pathname: path.join(__dirname, `../background_tasks/python1.html`),
    protocol: "file:",
    slashes: true,
  });
  hiddenWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  hiddenWindow.loadURL(backgroundFileUrl);

  hiddenWindow.webContents.openDevTools();

  hiddenWindow.on("closed", () => {
    hiddenWindow = null;
  });
  // cache.data = [args.input1, args.input2, args.input3];
  cache.data = args.input;
});

ipcMain.on("python:pythonInput2", (event, args) => {
  const backgroundFileUrl = url.format({
    pathname: path.join(__dirname, `../background_tasks/python2.html`),
    protocol: "file:",
    slashes: true,
  });
  hiddenWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  hiddenWindow.loadURL(backgroundFileUrl);

  hiddenWindow.webContents.openDevTools();

  hiddenWindow.on("closed", () => {
    hiddenWindow = null;
  });
  cache.data = args.input;
});

// This event listener will listen for data being sent back
// from the background renderer process
ipcMain.on("MESSAGE_FROM_PYTHON1", (event, args) => {
  mainWindow.webContents.send("python:pythonOutput1", {
    output: args.message,
  });
});

ipcMain.on("MESSAGE_FROM_PYTHON2", (event, args) => {
  mainWindow.webContents.send("python:pythonOutput2", {
    output: args.message,
  });
});

ipcMain.on("PYTHON1_READY", (event, args) => {
  event.reply("START_PROCESSING_PYTHON1", {
    data: cache.data,
    // data1: cache.data[0],
    // data2: cache.data[1],
    // data3: cache.data[2],
  });
});

ipcMain.on("PYTHON2_READY", (event, args) => {
  event.reply("START_PROCESSING_PYTHON2", {
    data: cache.data,
  });
});
