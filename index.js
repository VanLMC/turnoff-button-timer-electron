const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const execSync = require('child_process').execSync;

const createWindow = () => {
    const win = new BrowserWindow({
      width: 550,
      height: 700,
      frame: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
     }
    })
  
    win.loadFile('index.html')
    ipcMain.on('close-window', ()=>{ console.log('close app js'); win.close()})
    ipcMain.on('turn-off', (e, args)=>{ 
      //execSync(`shutdown -a`, { encoding: 'utf-8' });
       execSync(`shutdown -s -t ${((args[0] * 1000) / 60).toFixed(0)}`, { encoding: 'utf-8' });  // the default is 'buffer'
       // win.close()
    })

    // Insert menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
  
  }

  app.whenReady().then(() => {
    createWindow()
  })




  // Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//setup devtools
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Devtools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                accelerator: process.platform === 'darwin' ? 'Command+R' : 'Ctrl+R',
                role: 'reload'
            }
        ]
    });
}