    import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
    import { useState } from 'react';
    import { useLocation } from 'react-router-dom';
    import React, { useEffect } from 'react';
    import Home from './Pages/Home';
    import Product from './Pages/Product';
    import ProductDetail from './components/ProductDetail';
    import NotFound from './components/NotFound';
    import Cart from './Pages/Cart';
    import Navbar from './components/Navigation/Navbar';
    import Favorite from './Pages/Favorite';
    import { Toaster } from 'sonner';
    import Sidebar from './Dashboard/Navigation Dashboard/Sidebar';
    import { Outlet } from 'react-router-dom';
    import DashboardProduct from './Dashboard/Pages/DashboardProduct';
    import DashboardCore from './Dashboard/Pages/DashboardLayout';
    import DashboardUser from './Dashboard/Pages/DashboardCore/Users';
    import Login from './Auth/Login';
    import Register from './Auth/Register';
    import Profil from './components/Profil';
    import Succes from './components/Payment/Succes';
    import Cancel from './components/Payment/Cancel';

    // Dashboard Layout with Sidebar
    const DashboardLayout = () => (
      <div className="lg:flex min-h-screen ">
        <Sidebar />
        <div className="flex-grow p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    );

    const App = () => {
      const location = useLocation();
      const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
      const [isPaymentCanceled, setIsPaymentCanceled] = useState(false);

      useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('success')) {
          setIsPaymentSuccess(true);
        }

        if (params.get('canceled')) {
          setIsPaymentCanceled(false);
        }

      }, [location]);


      const shouldRenderNavbar = !(
        location.pathname.startsWith('/dashboard') ||
        location.pathname === '/login' ||
        location.pathname === '/register'
      );

      return (
        <div className="App">
          <Toaster />
          {/* Conditionally render Navbar */}
          {shouldRenderNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profil />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardCore />} />
              <Route path="product" element={<DashboardProduct />} />
              <Route path="core" element={<DashboardCore />} />
              <Route path="users" element={<DashboardUser />} />
            </Route>
            <Route path="/success" element={<Succes isPaymentSuccess={isPaymentSuccess} />} />
            <Route path="/cancel" element={<Cancel isPaymentCanceled={isPaymentCanceled} />} />
            <Route path="*" element={<Navigate to="/notfound" replace />} />
          </Routes>
        </div>
      );
    };

    // Wrapper component to provide location for the App
    const AppWrapper = () => (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    export default AppWrapper;
