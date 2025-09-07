import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store/store';
import { Toaster } from 'sonner';
import { Auth0Provider as Auth0ProviderBase } from '@auth0/auth0-react';
import Auth0Provider from './components/auth0/Auth0Provider';
import { auth0Config } from './config/auth0';

createRoot(document.getElementById('root')).render(
    <Auth0ProviderBase
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={{
            redirect_uri: auth0Config.redirectUri,
            audience: auth0Config.audience,
            scope: auth0Config.scope
        }}
    >
        <BrowserRouter>
            <Provider store={store}>
                <Auth0Provider>
                    <App />
                    <Toaster />
                </Auth0Provider>
            </Provider>
        </BrowserRouter>
    </Auth0ProviderBase>
);

