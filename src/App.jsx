import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import CatalogPage from "@/components/pages/CatalogPage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import CartPage from "@/components/pages/CartPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import OrdersPage from "@/components/pages/OrdersPage";
import SupplierDashboardPage from "@/components/pages/SupplierDashboardPage";
import ProductUploadPage from "@/components/pages/ProductUploadPage";
import AdminDashboardPage from "@/components/pages/AdminDashboardPage";

function App() {
  return (
    <>
      <BrowserRouter>
<Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CatalogPage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="supplier-dashboard" element={<SupplierDashboardPage />} />
            <Route path="upload-products" element={<ProductUploadPage />} />
            <Route path="admin-dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
        className="mt-16"
      />
    </>
  );
}

export default App;