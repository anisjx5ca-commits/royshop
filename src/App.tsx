import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-neon-black">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </main>

        <WhatsAppButton phoneNumber="213671234567" />
        <Toaster position="bottom-center" />
      </div>
    </Router>
  );
}

export default App;
