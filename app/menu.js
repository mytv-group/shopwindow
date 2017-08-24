//  @flow
import { app, Menu, shell, BrowserWindow }  from  'electron';

export default class MenuBuilder {
    mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    buildMenu() {
        if (process.env.NODE_ENV === 'development' ||  process.env.DEBUG_PROD === 'true') {
            this.setupDevelopmentEnvironment();
        }

        let template;

        if (process.platform === 'darwin') {
            template = {};
        } else {
            template = this.buildDefaultTemplate();
        }

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    setupDevelopmentEnvironment() {
        this.mainWindow.openDevTools();
        this.mainWindow.webContents.on('context-menu', (e, props) => {
            const { x, y } = props;

            Menu
                .buildFromTemplate([{
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.inspectElement(x, y);
                    }
                }])
                .popup(this.mainWindow);
        });
    }

    buildDefaultTemplate() {
        let toolsSubmenu = [];

        if (process.env.NODE_ENV === 'development') {
            toolsSubmenu = [{
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click: () => {
                    this.mainWindow.webContents.reload();
                }
            }, {
                label: 'Toggle  &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                    this.mainWindow.toggleDevTools();
                }
            }];
        }

        toolsSubmenu = toolsSubmenu.concat(
            [{
                label: 'Settings',
                accelerator: 'Ctrl+S',
                click: () => {
                    this.mainWindow.loadURL(`file://${__dirname}/app.html#/settings`);
                }
            }, {
                label: 'Toggle  &Full Screen',
                accelerator: 'F11',
                click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                }
            }, {
                label: '&Close',
                accelerator: 'Ctrl+Q',
                click: () => {
                    this.mainWindow.close();
                }
            }]
        );

        const templateDefault = [
           {
                label: '&Tools',
                submenu: toolsSubmenu
           }, {
                label: 'Help',
                submenu: [{
                    label: 'Documentation',
                    click() {
                        shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
                    }
                }]
            }
        ];

        return templateDefault;
    }
}
