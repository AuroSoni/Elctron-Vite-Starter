import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import UpdateElectron from './components/update/update'

function App(): JSX.Element {
  const ipcHandle = (): void => {
    window.electron.ipcRenderer.send('ping')
    console.log('ping')
  }

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite 0.0.0</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
      <UpdateElectron />
    </>
  )
}

export default App
