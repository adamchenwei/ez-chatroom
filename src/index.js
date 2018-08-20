import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './index.css';
import 'antd/dist/antd.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router><Switch>
      <Route exact path="/" component={App}/>
      <Route path="/:chatSessionId" component={App}/>
    </Switch>
  </Router>, document.getElementById('root'));
registerServiceWorker();
