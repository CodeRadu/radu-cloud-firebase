import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import { HashRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import NotFound from "./error/404";
import { lazy, Suspense } from "react";
import Loading from "./Loading";

const Dashboard = lazy(() => import('./storage/Dashboard'))
const Profile = lazy(() => import('./auth/Profile'))
const Signup = lazy(() => import('./auth/Signup'))
const Login = lazy(() => import('./auth/Login'))
const ForgotPassword = lazy(() => import('./auth/ForgotPassword'))

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Root />}>
            {/* Dashboard */}
            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path="/" element={<Dashboard />} />
            </Route>
            <Route exact path="/folder/:folderId" element={<PrivateRoute />}>
              <Route exact path="/folder/:folderId" element={<Dashboard />} />
            </Route>
            {/* Profile */}
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            {/* Auth */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            {/* 404 Page */}
            <Route element={NotFound} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function Root() {
  return <>
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  </>
}

export default App;
