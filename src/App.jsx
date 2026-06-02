import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import Layout from './Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import AboutPage from './pages/AboutPage/AboutPage'
import Catalog from './pages/CatalogPage/Catalog'
import BatteryPage from './pages/BatteryPage/BatteryPage'
import Cart from "./pages/CartPage/Cart.jsx"
import Profile from "./pages/ProfilePage/ProfilePage.jsx"
import { CartProvider } from "./components/CartContext.jsx"
import { AuthProvider } from "./components/AuthContext.jsx"



function App() {
  const location = useLocation();
  const background = location.state?.background;
  return (
    <AuthProvider>
      <CartProvider>
        <Routes location={background || location}>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <>
                <HomePage />
                <AboutPage />
                <Catalog />
              </>
            }/>
            <Route path="catalog" element={<Catalog/>}/>
            <Route path="cart" element={<Cart />} />
            <Route path="product/:id" element={<BatteryPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="about" element={<AboutPage/>}/>
          </Route>
      </Routes>

      {background &&(
        <Routes>
          <Route path="/product/:id" element={
            <div className="modal-overlay">
                <div className="modal-content">
                    <BatteryPage isModal={true} />
                </div>
            </div>
          }/>
        </Routes>
      )}
    </CartProvider>
    </AuthProvider>
    
    
  );
}

export default App;
