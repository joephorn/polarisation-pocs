//gebruikt usb : https://github.com/node-usb/node-usb#migrating-from-node-usb-detection
//gebruikt node.js
//gebruikt electron

const { app, BrowserWindow, ipcMain } = require('electron');
const usb = require('usb');

let knownDevices = [];
let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // enables access to ipcRenderer in the frontend
    }
  });

  win.loadFile('index.html');

  // Start polling for USB changes
  setInterval(() => {
    const currentDevices = usb.getDeviceList();
    const currentIds = currentDevices.map(d => d.deviceAddress);

    const added = currentDevices.filter(d => !knownDevices.includes(d.deviceAddress));
    const removed = knownDevices.filter(id => !currentIds.includes(id));

    added.forEach(device => {
      console.log('USB inserted:', device.deviceDescriptor);
      win.webContents.send('usb-added', device.deviceDescriptor);
    });

    removed.forEach(id => {
      console.log('USB removed:', id);
      win.webContents.send('usb-removed', id);
    });

    knownDevices = currentIds;
  }, 1000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
