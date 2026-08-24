import { BrowserRouter, Routes, Route } from 'react-router';
import { Box } from '@mui/material';
import { ProtectedRoute } from './ProtectedRoute';
import { useEffect } from 'react';
import Login from "./page/Login" 
import Registration from './page/Registration';

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
          <Route path="/" element={<Box></Box>} />
          <Route path="/profile" element={<Box></Box>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
