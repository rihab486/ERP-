import React  from 'react';

import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes} from "react-router-dom";




import Login from './components/authentification/Login';

import Display from './display';
import PrivateRoute from './router/protectedroute';
function App() {
   return (
   <Router>
      
    <>
   
 
<Routes>
<Route path="/"  element={<Login/>}/>
<Route element = {<PrivateRoute/>}>
<Route path="home/*"  element={<Display/>} />
</Route>

</Routes>
      
  


    </>
   
    </Router>

  );
}

export default App;