import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemDetailsPage from './pages/ItemDetailsPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import CategoryPage from './pages/CategoryPage';
import SubcategoryPage from './pages/SubcategoryPage';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import i18n from './i18n/i18n';
import './index.css';
import FilterPage from './pages/Filter';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/item/:slug" element={<ItemDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/filter" element={<FilterPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
