import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import logo from './sprites/logo.svg';

ReactDOM.render(<App srcs={[logo]}/>, document.getElementById('root'));
registerServiceWorker();
