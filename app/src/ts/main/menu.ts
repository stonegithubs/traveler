import { app, Menu, MenuItemConstructorOptions, dialog, MessageBoxOptions, clipboard, BrowserWindow, shell } from 'electron'
import checkUpdate from './update'
import { execSync } from 'child_process'

declare function __non_webpack_require__ (module: string): any

let commit = ''
let commitDate = ''
if (process.env.NODE_ENV !== 'production') {
  commit = execSync('git rev-parse HEAD', { cwd: require('path').join(__dirname, '..') }).toString().replace(/[\r\n]/g, '')
  commitDate = new Date((execSync('git log -1', { cwd: require('path').join(__dirname, '..') }).toString().match(/Date:\s*(.*?)\n/) as any)[1]).toISOString()
}

export default function createMenu (win: BrowserWindow): Menu {
  const template: MenuItemConstructorOptions[] = [
    {
      label: '帮助',
      submenu: [
        {
          label: '设置',
          click () {
            if (win) win.webContents.send('setting')
          }
        },
        {
          type: 'separator'
        },
        {
          label: '切换开发人员工具',
          click () {
            win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools()
          }
        },
        {
          label: '检查更新...',
          click () {
            checkUpdate().then((versionData) => {
              if (!versionData) {
                dialog.showMessageBox(win, { type: 'info', message: '当前没有可用的更新。' })
                return
              }

              const buttons = ['前往下载', '取消']
              dialog.showMessageBox(win, {
                type: 'info',
                message: '有可用的更新',
                detail: `\n当前版本: ${app.getVersion()}\n最新版本: ${versionData.version}-${versionData.commit}`,
                buttons,
                defaultId: 0,
                noLink: true
              }, (response) => {
                if (buttons[response] === '前往下载') {
                  if (versionData.exeUrl) {
                    shell.openExternal(versionData.exeUrl)
                  } else if (versionData.zipUrl) {
                    shell.openExternal(versionData.zipUrl)
                  } else {
                    shell.openExternal('https://github.com/toyobayashi/traveler/releases')
                  }
                }
              })
            }).catch((err) => {
              dialog.showMessageBox(win, { type: 'error', message: '检查更新失败。\n' + err })
            })
          }
        },
        {
          label: '关于',
          click () {
            const detail = '\n' + Array.prototype.join.call([
              `版本: ${app.getVersion()}`,
              process.env.NODE_ENV === 'production' ? `提交: ${__non_webpack_require__('../package.json')._commit}` : `提交: ${commit}`,
              process.env.NODE_ENV === 'production' ? `日期: ${__non_webpack_require__('../package.json')._commitDate}` : `日期: ${commitDate}`,
              `Electron: ${process.versions.electron}`,
              `Chrome: ${process.versions.chrome}`,
              `Node.js: ${process.versions.node}`,
              `V8: ${process.versions.v8}`,
              `架构: ${process.arch}`
            ], '\n')
            const buttons = ['确定', '复制']
            const opt: MessageBoxOptions = {
              type: 'info',
              title: app.getName(),
              message: app.getName(),
              buttons,
              noLink: true,
              defaultId: 0,
              detail
            }
            const callback: (response: number, checkboxChecked: boolean) => void = (response) => {
              if (buttons[response] === '复制') {
                clipboard.writeText(detail)
              }
            }
            dialog.showMessageBox(win, opt, callback)
          }
        },
        {
          label: 'Github',
          click () {
            shell.openExternal('https://github.com/toyobayashi/traveler')
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName()
    })
  }

  return Menu.buildFromTemplate(template)
}
