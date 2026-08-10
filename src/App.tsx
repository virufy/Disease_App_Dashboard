import React from 'react';
import { GlobalStyle } from './styles/globalStyle';
import Dashboard from './pages/dashboard/dashboard';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Dashboard />
    </>
  );
};

export default App;
