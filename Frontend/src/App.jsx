import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import logo from './assets/logo.png';
import logo2 from './assets/logo2.png';
import background from './assets/background.png';
import product1 from './assets/product1.png';
import product2 from './assets/product2.png';
import product3 from './assets/product3.jpg';
import product4 from './assets/product4.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import ProductCategories from './ProductCategories';
import CategoryProducts from './CategoryProducts';
import ProductDetails from './ProductDetails';
import { categories } from './data';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AdminLayout from './Admin/AdminLayout';
import Dashboard from './Admin/Dashboard';
import Inventory from './Admin/Inventory';
import CategorySubcategories from './Admin/CategorySubcategories';
import Variants from './Admin/Variants';
import Reports from './Admin/Reports';
import QuarterlyStats from './Admin/QuarterlyStats';
import Categories from './Admin/Categories';
import Inquiries from './Admin/Inquiries';
import Login from './Admin/Login';
import RequireAdminAuth from './Admin/RequireAdminAuth';
import CustomerLogin from './Login';
import CustomerSignup from './Signup';
import Profile from './Profile';
import Cart from './Cart';
import Payment from './Payment';

const THEME_KEY = 'mt-theme';

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Create flattened products array for carousel
  const allProducts = categories.flatMap(category => 
    category.products.map(product => ({
      ...product,
      categoryName: category.name,
      categoryId: category.id
    }))
  );

  console.log('All products for carousel:', allProducts); // Debug log

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    arrows: true,
    swipeToSlide: true,
    touchMove: true,
    accessibility: true,
    customPaging: function(i) {
      return (
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#d1d5db',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}></div>
      );
    },
    dotsClass: 'slick-dots custom-dots',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  // const flashcards = [
  //   {
  //     title: 'Wide Product Range',
  //     desc: 'Choose from Power Tools, Machining Coils, and Machine Armatures for all your industrial needs.',
  //     icon: '🛠️',
  //   },
  //   {
  //     title: 'Trusted by Industry',
  //     desc: 'Our products are trusted by leading companies for their reliability and performance.',
  //     icon: '🏭',
  //   },
  //   {
  //     title: 'Expert Support',
  //     desc: 'Get expert advice and support for all your tool and machinery requirements.',
  //     icon: '🤝',
  //   },
  //   {
  //     title: 'Fast Delivery',
  //     desc: 'We ensure quick and safe delivery to keep your operations running smoothly.',
  //     icon: '🚚',
  //   },
  // ];

  return (
    <div style={{ width: '100vw', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        background: `url(${background}) center/cover no-repeat`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.75)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          borderRadius: 18,
          padding: '3.5rem 2.5rem',
          maxWidth: 600,
          width: '90vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backdropFilter: 'blur(8px)',
        }}>
          {/* Logo2 Image */}
          <div style={{ 
            width: 80, 
            height: 80, 
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(255,127,42,0.3)'
          }}>
            <img src={logo2} alt="Mahaveer Tools Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            {/* <div style={{ width: 140, height: 140, borderRadius: 999, overflow: 'hidden', boxShadow: '0 6px 30px rgba(0,0,0,0.12)' }}>
              <img src={logo2} alt="Mahaveer Tools" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div> */}
            {/* Visually hidden site title for accessibility */}
            {/* <h1 style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Mahaveer Tools</h1> */}
            <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: '#222', margin: 0, marginBottom: 18, textAlign: 'center', letterSpacing: '-1px' }}>Mahaveer Tools</h1>
          

          </div>
          <div style={{ color: '#444', fontSize: '1.13rem', textAlign: 'center', marginBottom: 32, maxWidth: 480 }}>
            Your trusted destination for high-quality industrial tools, delivered with precision, reliability, and unmatched service.
          </div>
          <Link to="/categories" style={{
            background: '#1a2640',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: 8,
            padding: '0.9rem 2.2rem',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            transition: 'background 0.2s',
          }}>Discover our collection</Link>
        </div>
      </div>

      {/* Flashcards Section
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '3rem 1rem 2rem 1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 32,
        justifyContent: 'center',
      }}>
        {flashcards.map((f, i) => (
          <div key={i} style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 4px 24px rgba(30,41,59,0.10)',
            padding: '2.2rem 1.7rem',
            minWidth: 240,
            maxWidth: 320,
            flex: 1,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#1a2640', marginBottom: 6 }}>{f.title}</div>
            <div style={{ color: '#64748b', fontWeight: 500, fontSize: 16 }}>{f.desc}</div>
          </div>
        ))}
      </div> */}

      {/* Featured Products Carousel */}
      <div style={{
        width: '100vw',
        margin: '0',
        padding: '4rem 0',
        background: '#f8f9fa',
        position: 'relative'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '0 2rem'
        }}>
          <h3 style={{
            fontSize: '2.8rem', 
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Featured Products
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: '#6c757d',
            marginBottom: '0',
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            Discover our premium range of industrial products trusted by leading companies
          </p>
        </div>
        
        <div style={{
          width: '100vw',
          overflow: 'visible',
          boxSizing: 'border-box',
          position: 'relative',
          paddingBottom: '2rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 4rem',
            overflow: 'visible'
          }}>
            <Slider {...sliderSettings}>
            {allProducts.map((product, index) => (
              <div key={`${product.id}-${index}`} style={{
                padding: '0 8px',
                boxSizing: 'border-box',
                width: '100%'
              }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #f1f3f4',
                  margin: '0 8px'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                }}>
                  
                  {/* Product Image */}
                  <div style={{
                    width: '100%',
                    height: '240px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#fafbfc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    {/* Category Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: '#1a2640',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {product.categoryName}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div style={{ 
                    padding: '1.2rem', 
                    textAlign: 'left',
                    background: '#ffffff',
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <h4 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700', 
                        color: '#1a1a1a',
                        margin: '0 0 0.4rem 0',
                        lineHeight: '1.3',
                      }}>
                        {product.name}
                      </h4>
                      <p style={{ 
                        fontSize: '0.85rem', 
                        color: '#6b7280',
                        margin: '0 0 1rem 0',
                        lineHeight: '1.4',
                      }}>
                        High-grade {product.name.toLowerCase()} for industrial use.
                      </p>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '1rem',
                    }}>
                      <Link 
                        to={`/categories/${product.categoryId}`}
                        style={{
                          background: '#1a2640',
                          color: '#fff',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease',
                          border: 'none',
                          cursor: 'pointer',
                          minWidth: '80px',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = '#2d3748';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = '#1a2640';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        View
                        <span style={{ fontSize: '10px' }}>→</span>
                      </Link>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart context for global access
export const CartContext = createContext();

function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, getCartItemCount } = useCart();

  // Check if current route is login or signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Cart handlers
  const handleAddToCart = async (product) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login page with current location
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    const result = await addToCart(product);
    if (!result.success) {
      alert(result.error || 'Failed to add item to cart');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    await removeFromCart(productId);
  };

  const handleChangeQty = async (productId, newQuantity) => {
    await updateQuantity(productId, newQuantity);
  };

  return (
    <div className={`app-root ${theme}-theme`}>
      {!isAuthPage && <Navbar categories={categories} setCartOpen={setCartOpen} />}
        {/* Main content wrapper with top padding to account for fixed navbar */}
        <div style={{ paddingTop: isAuthPage ? '0' : '84px' }}>
          {/* Cart Modal */}
          {cartOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,41,59,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setCartOpen(false)}>
              <div style={{ background: '#fff', borderRadius: 18, minWidth: 320, maxWidth: 400, padding: '2rem 1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', position: 'relative' }} onClick={e => e.stopPropagation()}>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Your Cart</h2>
                {!cart || cart.items.length === 0 ? (
                  <div style={{ color: '#64748b', fontSize: '1.1rem' }}>Cart is empty.</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {cart.items.map(item => (
                      <li key={item.productId} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.2rem', gap: '1rem' }}>
                        <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700 }}>{item.name}</div>
                          <div style={{ fontSize: 13, color: '#64748b' }}>Qty: 
                            <button onClick={() => handleChangeQty(item.productId, item.quantity - 1)} style={{ margin: '0 4px', padding: '2px 7px', borderRadius: 6, border: '1px solid #eee', background: '#f3f4f6', cursor: 'pointer' }}>-</button>
                            {item.quantity}
                            <button onClick={() => handleChangeQty(item.productId, item.quantity + 1)} style={{ margin: '0 4px', padding: '2px 7px', borderRadius: 6, border: '1px solid #eee', background: '#f3f4f6', cursor: 'pointer' }}>+</button>
                          </div>
                        </div>
                        <button onClick={() => handleRemoveFromCart(item.productId)} style={{ background: '#ff7f2a', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
                <button onClick={() => setCartOpen(false)} style={{ position: 'absolute', top: 12, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#64748b', cursor: 'pointer' }}>&times;</button>
              </div>
          </div>
          )}
        <Routes>
            <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/categories" element={<ProductCategories />} />
          <Route path="/categories/:category" element={<CategoryProducts />} />
          <Route path="/categories/:category/:product" element={<ProductDetails />} />
          {/* Customer Authentication Routes */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/signup" element={<CustomerSignup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          {/* Admin Login Route (unprotected) */}
          <Route path="/admin/login" element={<Login />} />
          {/* Protected Admin Panel Routes */}
          <Route path="/admin" element={<RequireAdminAuth />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/:categoryId" element={<CategorySubcategories />} />
              <Route path="specifications/:categoryId/:subIdx" element={<Variants />} />
              <Route path="reports" element={<Reports />} />
              <Route path="quarterly-stats" element={<QuarterlyStats />} />
              <Route path="categories" element={<Categories />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route index element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
        {/* Footer Component */}
        <Footer categories={categories} />
        </div>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}