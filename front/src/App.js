import './App.css';
import {Route, Switch, Redirect} from 'react-router-dom';
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

                </div>
                </React.Fragment>
            </Switch>
         </Layout>
  );
}

export default App;
