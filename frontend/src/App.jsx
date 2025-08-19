import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext'; // << New
import Checkout from './pages/Checkout';
import { ToastContainer } from 'react-toastify';
import OrderDetails from './pages/OrderDetails';
import EditProfile from './pages/EditProfile';
import AllProducts from './pages/AllProducts';
import AddProduct from './pages/AddProduct';
import EditProducts from './pages/EditProducts';
import ViewOrders from './pages/ViewOrders';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/details" element={<OrderDetails />} />
          <Route path="/edit-profile" element={<EditProfile/>}/>
          <Route path="/admin/products" element={<AllProducts/>} />
          <Route path="/admin/add-product" element={<AddProduct/>} />
          <Route path="/admin/edit-product" element={<EditProducts />} />
          <Route path="/admin/orders" element={<ViewOrders />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
        <ToastContainer />
      </CartProvider>
    </UserProvider>
  );
}

export default App;
