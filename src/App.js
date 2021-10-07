import {Redirect, Route, Switch, BrowserRouter} from "react-router-dom";
import {getToken, initAxiosInterceptors} from "./helpers/auth";
import Login from "./layouts/Login";
import {UserProvider} from "./context/userContext";
import Main from "./layouts/Main";
import Home from "./pages/Home";
import Settings from "./pages/settings";

initAxiosInterceptors()

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login/>
        </Route>
        <Route
          path="/"
          render={() => getToken() ? (
            <UserProvider>
              <Main>
                <Switch>
                  <Route path="/home">
                    <Home/>
                  </Route>
                  <Route path="/settings">
                    <Settings/>
                  </Route>
                  <Route>
                    <Redirect to="/home"/>
                  </Route>
                </Switch>
              </Main>
            </UserProvider>
          ) : (
            <Redirect to="/login"/>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}
