import 'bootstrap/dist/css/bootstrap.min.css';
//import CustomerPage from './Components/Customers/CustomerPage/';
import BranchPage from './Components/Branch/BranchPage/BranchPage';
import ShopWindowPage from './Components/ShopWindow/ShopWindowPage/ShopWindowPage';

import Login from './Components/Menu/Login';

import * as serviceWorker from './serviceWorker';

import React from 'react'
import ReactDOM from 'react-dom'
//import './index.css'
import { Route, Link, BrowserRouter as Router, useParams } from 'react-router-dom'

const routing = (
  <Router>
    <div>
    
      <Route exact path="/id/:branchId" children={<ShopWindowId/>} />
      <Route exact path='/login' component={Login} />
      <Route exact path="/branch/:branchId" children={<Branch />} />
      <Route exact path='/' component={Login} />
      
    </div>
  </Router>
)
// <Route exact path="/:branchName" children={<ShopWindowName/>} />
function Branch() {
  let { branchId } = useParams(); 
  return <BranchPage branchId={branchId}></BranchPage>
}

function ShopWindowId() {
  let { branchId } = useParams();
  return <ShopWindowPage branchId={branchId}></ShopWindowPage>
}

ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();