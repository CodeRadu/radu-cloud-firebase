import Signup from "./auth/Signup";
import Profile from "./auth/Profile";
import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Dashboard from "./storage/Dashboard";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import NotFound from "./error/404";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          {/* Dashboard */}
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/folder/:folderId" component={Dashboard} />
          {/* Profile */}
          <PrivateRoute path="/profile" component={Profile} />
          {/* Auth */}
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/reset-password" component={ForgotPassword} />
          {/* 404 Page */}
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
