import { BrowserRouter, Routes, Route } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { useEffect } from 'react';
import Login from "./page/Login" 
import Registration from './page/Registration';
import ProfileHref from './page/ProfileHref';
import { Box } from '@mui/material';

function App() {
  
  useEffect(() => {
    const handleTabClose = () => {
      localStorage.removeItem('token');
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<ProfileHref />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
