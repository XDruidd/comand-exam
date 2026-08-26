import { BrowserRouter, Routes, Route } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import Login from "./page/Login" 
import Registration from './page/Registration';
import ProfileHref from './page/ProfileHref';
import AdminRoute from './AdminRoute';
import AdminPanel from './page/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          <Route path="/*" element={<ProfileHref />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
