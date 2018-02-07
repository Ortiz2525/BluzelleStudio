const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
require('./ApplicationMenu');

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'debug', alias: 'd', type: Boolean }
];

const options = commandLineArgs(optionDefinitions);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, splash


function createWindow () {
    splash = new BrowserWindow({
        width: 300,
        height: 500,
        icon: __dirname + '/bluzelle.png',
        transparent: true,
        frame: false,
        alwaysOnTop: true,
    });

    splash.loadURL(url.format({
        pathname: __dirname + '/splash.html',
        protocol: 'file:',
        slashes: true
    }));


    win = new BrowserWindow({
        width: options.debug ? 1200 : 800,
        height: options.debug ? 800 : 600,
        icon: __dirname + '/bluzelle.png',
        show: false
    });

    win.loadURL(url.format({
        pathname: __dirname + '/index.html',
        protocol: 'file:',
        slashes: true,
    }));

    win.once('ready-to-show', () => {
        splash.destroy();
        win.show();
    });

    // Open the DevTools.
    options.debug && win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
//        emulator.shutdown();
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

exports.foo = n => console.log(n);

