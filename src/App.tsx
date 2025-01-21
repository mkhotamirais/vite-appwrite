import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import Book from "./pages/book/Book";
import Product from "./pages/product/Product";
import BookAdd from "./pages/book/BookAdd";
import BookUpdate from "./pages/book/BookUpdate";
import ProductAdd from "./pages/product/ProductAdd";
import ProductUpdate from "./pages/product/ProductUpdate";

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book">
              <Route index element={<Book />} />
              <Route path="add" element={<BookAdd />} />
              <Route path="update/:id" element={<BookUpdate />} />
            </Route>
            <Route path="/product">
              <Route index element={<Product />} />
              <Route path="add" element={<ProductAdd />} />
              <Route path="update/:id" element={<ProductUpdate />} />
            </Route>
            {/* auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
