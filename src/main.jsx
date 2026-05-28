import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import bridge from '@vkontakte/vk-bridge';
import {PrivacyContext} from "./components/PrivacyContext.jsx"

if (typeof bridge.send !== 'function' && bridge.default) {
    bridge.default.send("VKWebAppInit");
} else {
    bridge.send("VKWebAppInit");
}
    
    createRoot(document.getElementById('root')).render(
     <PrivacyContext>
        <HashRouter>
           <App />
        </HashRouter>
      </PrivacyContext>
      
    );

  