import './App.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import Query4 from './pages/queries/Query4'
import Query1 from './pages/queries/Query1'
import Home from "./pages/home";
import React from "react";
import Layout from "./components/layout/Layout";


function App() {
  return (
        <Layout>
            <Switch>
                <React.Fragment>
                <div>
                    <Route path='/' exact>
                        <Redirect to='/home'/>
                    </Route>
                    <Route component={Home} path='/home/' />
                    <Route component={Query4} path='/query/4' />
                    <Route component={Query1} path='/query/1' />
                </div>
                </React.Fragment>
            </Switch>
         </Layout>
  );
}

export default App;
