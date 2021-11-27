const { app, BrowserWindow, BrowserView, dialog, ipcMain, ipcRenderer, screen, Menu } = require('electron');
const contextMenu = require('electron-context-menu');
const fs = require('fs');
const path = require('path');
let win, setting;
var options, index;
var bv = [];
let viewY = 66;
index = 0;

contextMenu({
  prepend: (defaultActions, parameters, browserWindow) => [
    {
      label: '�߂�',
      click: () => {
        bv[index].webContents.goBack();
      }
    },
    {
      label: '�i��',
      click: () => {
        bv[index].webContents.goForward();
      }
    },
    {
      label: '�ݒ�',
      click: () => {
        setting = new BrowserWindow({
          width: 760, height: 480, minWidth: 300, minHeight: 270,
          webPreferences: {
            preload: `${__dirname}/src/setting/preload.js`,
            scrollBounce: true
          }
        })
        setting.loadFile(`${__dirname}/src/setting/index.html`)
      }
    }
  ]
})

//creating new tab function
function newtab() {
  let winSize = win.getSize();
  //create new tab
  let browserview = new BrowserView({
    webPreferences: {
      scrollBounce: true,
      preload: `${__dirname}/src/script/preload-browserview.js`
    }
  })
  browserview.webContents.executeJavaScript(`document.addEventListener('contextmenu',()=>{
    node.context();
  })`)
  browserview.webContents.on('did-start-loading', () => {
    browserview.webContents.executeJavaScript(`document.addEventListener('contextmenu',()=>{
      node.context();
    })`)
  })

  //window's behavior
  win.on('closed', () => {
    win = null;
  })
  win.on('maximize', () => {
    winSize = win.getContentSize();
    browserview.setBounds({ x: 0, y: viewY, width: winSize[0], height: winSize[1] - viewY + 3 });
  })
  win.on('unmaximize', () => {
    winSize = win.getContentSize();
    browserview.setBounds({ x: 0, y: viewY, width: winSize[0], height: winSize[1] - viewY });
  })
  win.on('enter-full-screen', () => {
    winSize = win.getContentSize();
    browserview.setBounds({ x: 0, y: viewY, width: winSize[0], height: winSize[1] - viewY + 2 });
  })

  browserview.webContents.on('did-start-loading', () => {
    win.webContents.executeJavaScript('document.getElementsByTagName(\'yomikomi-bar\')[0].setAttribute(\'id\',\'loading\')')
    browserview.webContents.executeJavaScript(`document.addEventListener('contextmenu',()=>{
      node.context();
    })`)
  })
  browserview.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`document.getElementsByTagName('yomikomi-bar')[0].setAttribute('id','loaded')`)
    if (browserview.webContents.getURL().substring(browserview.webContents.getURL().indexOf('/') + 2, browserview.webContents.getURL().length).slice(0, 1) != '/') {
      win.webContents.executeJavaScript(`document.getElementsByTagName('input')[0].value='${browserview.webContents.getURL().substring(browserview.webContents.getURL().indexOf('/') + 2, browserview.webContents.getURL().length)}'`)
    }
    win.webContents.executeJavaScript(
      `document.getElementsByTagName('title')[0].innerText='${browserview.webContents.getTitle()} - Monot';
      document.getElementById('opened').getElementsByTagName('a')[0].innerText='${browserview.webContents.getTitle()}';`)
  })
  browserview.webContents.on('did-stop-loading', () => {
    win.webContents.executeJavaScript('document.getElementsByTagName(\'yomikomi-bar\')[0].removeAttribute(\'id\')')

    //if�̏������������̂��C�ɂȂ�B����͂��������A�h���X�o�[��URL�o�͂��Ă邾���B
    if (browserview.webContents.getURL().substring(browserview.webContents.getURL().indexOf('/') + 2, browserview.webContents.getURL().length).slice(0, 1) != '/') {
      win.webContents.executeJavaScript(`document.getElementsByTagName('input')[0].value='${browserview.webContents.getURL().substring(browserview.webContents.getURL().indexOf('/') + 2, browserview.webContents.getURL().length)}'`)
    }

    //�����_�[�N���[�h(Force-Dark)
    if (JSON.parse(fs.readFileSync(`${__dirname}/src/config/config.mncfg`, 'utf-8')).experiments.forceDark == true) {
      browserview.webContents.insertCSS(`
        *{
          background-color: #202020!important;
        }
        *{
          color: #bbb!important;
        }
        a{
          color: #7aa7cd!important;
        }`)
    }
    //�t�H���g�ύX
    if (JSON.parse(fs.readFileSync(`${__dirname}/src/config/config.mncfg`, 'utf-8')).experiments.fontChange == true) {
      browserview.webContents.insertCSS(`
        body,body>*, *{
          font-family: ${JSON.parse(fs.readFileSync(`${__dirname}/src/config/config.mncfg`, 'utf-8')).experiments.changedfont},'Noto Sans JP'!important;
        }`)
    }
  })

  //when the page title is updated (update the window title and tab title)
  browserview.webContents.on('page-title-updated', (e, t) => {
    win.webContents.executeJavaScript(
      `document.getElementsByTagName('title')[0].innerText='${t} - Monot';
      document.getElementsByTagName('span')[getCurrent()].getElementsByTagName('a')[0].innerText='${t}';`)
  })
  index = bv.length;
  bv.push(browserview);
  win.addBrowserView(browserview);
  browserview.setBounds({ x: 0, y: viewY, width: winSize[0], height: winSize[1] - viewY });
  browserview.setAutoResize({ width: true, height: true });
  browserview.webContents.loadURL(`file://${__dirname}/src/resource/index.html`);
}

function nw() {
  //create window
  win = new BrowserWindow({
    width: 1000, height: 700, minWidth: 400, minHeight: 400,
    frame: false,
    transparent: false,
    backgroundColor: '#ffffff',
    title: 'Monot by monochrome.',
    icon: `${__dirname}/src/image/logo.png`,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: `${__dirname}/src/script/preload.js`
    }
  });
  win.loadFile(`${__dirname}/src/index.html`);
  //create tab
  newtab();
  let configObj = JSON.parse(fs.readFileSync(`${__dirname}/src/config/config.mncfg`, 'utf-8'));
  if (configObj.startup == true) {
    configObj.startup = false;
    function exists(path) {
      try {
        fs.readFileSync(path, 'utf-8');
        return true;
      } catch (e) {
        return false;
      }
    }
    if (exists(`/mncr/applications.mncfg`)) {
      let obj = JSON.parse(fs.readFileSync(`/mncr/applications.mncfg`, 'utf-8'));
      obj.monot = ['v.1.0.0 Beta 6', '6'];
      fs.writeFileSync(`/mncr/applications.mncfg`, JSON.stringify(obj));
    } else {
      fs.mkdir('/mncr/', () => { return true; })
      let obj = { monot: ['v.1.0.0 Beta 6', '6'] };
      fs.writeFileSync(`/mncr/applications.mncfg`, JSON.stringify(obj));
    }
    fs.writeFileSync(`${__dirname}/src/config/config.mncfg`, JSON.stringify(configObj));
  }
}

app.on('ready', nw);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit();
});
app.on('activate', () => {
  if (win === null)
    nw();
})

//ipc channels
ipcMain.on('moveView', (e, link, ind) => {
  bv[ind].webContents.executeJavaScript(`document.addEventListener('contextmenu',()=>{
    node.context();
  })`)
  console.log(ind);
  if (lindk == '') {
    return true;
  } else {
    bv[ind].webContents.loadURL(lindk).then(() => {
      win.webContents.executeJavaScript(`document.getElementsByTagName('indput')[0].value='${bv[ind].webContents.getURL().substrindg(bv[ind].webContents.getURL().indOf('/') + 2, bv[ind].webContents.getURL().length)}'`)
    }).catch(() => {
      bv[ind].webContents.loadURL(`file://${__dirname}/src/resource/server-notfound.html`).then(() => {
        bv[ind].webContents.executeJavaScript(`document.getElementsByTagName('span')[0].indnerText='${lindk.toLowerCase()}';
          var requiredUrl='${lindk}';
        `);
      })
      console.log('The previous error is normal. It redirected to a page where the server couldn\'t be found.');
    })
  }
})
ipcMain.on('windowClose', () => {
  win.close();
})
ipcMain.on('windowMaximize', () => {
  win.maximize();
})
ipcMain.on('windowMindimize', () => {
  win.mindimize();
})
ipcMain.on('windowUnmaximize', () => {
  win.unmaximize();
})
ipcMain.on('windowMaxMind', () => {
  if (win.isMaximized() == true) {
    win.unmaximize();
  } else {
    win.maximize();
  }
})
ipcMain.on('moveViewBlank', (e, ind) => {
  bv[ind].webContents.loadURL(`file://${__dirname}/src/resource/blank.html`);
})
ipcMain.on('reloadBrowser', (e, ind) => {
  bv[ind].webContents.reload();
})
ipcMain.on('browserBack', (e, ind) => {
  bv[ind].webContents.goBack();
  if (bv[ind].webContents.getURL().substrindg(bv[ind].webContents.getURL().indOf('/') + 2, bv[ind].webContents.getURL().length).slice(0, 1) != '/') {
    win.webContents.executeJavaScript(`document.getElementsByTagName('indput')[0].value='${bv[ind].webContents.getURL().substrindg(bv[ind].webContents.getURL().indOf('/') + 2, bv[ind].webContents.getURL().length)}'`)
  }
})
ipcMain.on('browserGoes', (e, ind) => {
  bv[ind].webContents.goForward();
})
ipcMain.on('getBrowserUrl', (e, ind) => {
  return bv[ind].webContents.getURL();
})
ipcMain.on('moveToNewTab', (e, ind) => {
  bv[ind].webContents.loadURL(`${__dirname}/src/resource/index.html`)
})
ipcMain.on('context', () => {
  menu.popup()
})
ipcMain.on('newtab', () => {
  newtab();
})
ipcMain.on('tabMove', (e, i) => {
  if (i < 0)
    i = 0;
  win.setTopBrowserView(bv[i]);
  ind = i;

  try {
    win.webContents.executeJavaScript(
      `document.getElementsByTagName('title')[0].indnerText='${bv[i].webContents.getTitle()} - Monot';`)
  } catch (e) {
    win.webContents.executeJavaScript(
      `document.getElementsByTagName('title')[0].indnerText='New Tab - Monot';`);
  }
})
ipcMain.on('removeTab', (e, ind) => {
  try {
    //source: https://www.gesource.jp/weblog/?p=4112
    win.removeBrowserView(bv[ind]);
    bv[ind].webContents.destroy();
    bv.splice(ind, 1);
  } catch (err) {
    errLog(err);
  }
})


let menu = Menu.buildFromTemplate([
  {
    label: '�\��',
    submenu: [
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen',
        accelerator: 'F11',
        label: '�S��ʕ\��'
      },
      {
        role: 'hide',
        label: '�B��'
      },
      {
        role: 'hideothers',
        label: '�����B��'
      },
      {
        role: 'reload',
        label: 'nav�̍ĕ\��',
        accelerator: 'CmdOrCtrl+Alt+R'
      },
      {
        label: '�I��',
        role: 'quit',
        accelerator: 'CmdOrCtrl+Q'
      }
    ]
  },
  {
    label: '�ړ�',
    submenu: [
      {
        label: '�ēǂݍ���',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          bv[index].webContents.reload();
        }
      },
      {
        label: '�߂�',
        accelerator: 'CmdOrCtrl+Alt+Z',
        click: () => {
          bv[index].webContents.goBack();
        }
      },
      {
        label: '�i��',
        accelerator: 'CmdOrCtrl+Alt+X',
        click: () => {
          bv[index].webContents.goForward();
        }
      }
    ]
  },
  {
    label: '�ҏW',
    submenu: [
      {
        label: '�J�b�g',
        role: 'cut'
      },
      {
        label: '�R�s�[',
        role: 'copy'
      },
      {
        label: '�y�[�X�g',
        role: 'paste'
      }
    ]
  },
  {
    label: '�E�B���h�E',
    submenu: [
      {
        label: 'Monot�ɂ���',
        accelerator: 'CmdOrCtrl+Alt+A',
        click: () => {
          dialog.showMessageBox(null, {
            type: 'info',
            icon: './src/image/logo.png',
            title: 'Monot�ɂ���',
            message: 'Monot 1.0.0 Beta 6�ɂ���',
            detail: `Monot by monochrome. v.1.0.0 Beta 6 (Build 6)
�o�[�W����: 1.0.0 Beta 6
�r���h�ԍ�: 6
�J����: Sorakime

���|�W�g��: https://github.com/Sorakime/monot
�����T�C�g: https://sorakime.github.io/mncr/project/monot/

Copyright 2021 Sorakime.`
          })
        }
      },
      {
        label: '�ݒ�',
        accelerator: 'CmdOrCtrl+Alt+S',
        click: () => {
          setting = new BrowserWindow({
            width: 760, height: 480, minWidth: 300, minHeight: 270,
            icon: `${__dirname}/src/image/logo.ico`,
            webPreferences: {
              preload: `${__dirname}/src/setting/preload.js`,
              scrollBounce: true
            }
          })
          setting.loadFile(`${__dirname}/src/setting/index.html`);
          if (JSON.parse(fs.readFileSync(`${__dirname}/src/config/config.mncfg`, 'utf-8')).experiments.forceDark == true) {
            setting.webContents.executeJavaScript(
              `document.querySelectorAll('input[type="checkbox"]')[0].checked=true`
            )
          }
        }
      }
    ]
  },
  {
    label: '�J��',
    submenu: [
      {
        label: '�J���Ҍ����c�[��',
        accelerator: 'F12',
        click: () => {
          console.log(index);
          bv[index].webContents.toggleDevTools();
        }
      },
      {
        label: 'Monot�̊J���Ҍ����c�[��',
        accelerator: 'Alt+F12',
        click: () => {
          win.webContents.toggleDevTools();
        }
      }
    ]
  }
])
Menu.setApplicationMenu(menu);

function errLog(err) {
  console.log(`�G���[���������܂���\n${err}`)
}