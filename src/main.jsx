import { createRoot } from "react-dom/client";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import APP from "./App";
import { store } from "./pages/redux/Store";
import "./index.css";

const AUTH_TOKEN_KEY = "vingo_auth_token";

if (!globalThis.__VINGO_AXIOS_READY__) {
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => {
      const token = response?.data?.token;
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      return response;
    },
    (error) => Promise.reject(error)
  );

  globalThis.__VINGO_AXIOS_READY__ = true;
}

if (!globalThis.__VINGO_ALERT_TOAST_READY__) {
  window.alert = (message) => {
    const text = String(message || "Notification");
    const lower = text.toLowerCase();

    if (
      lower.includes("success") ||
      lower.includes("successful") ||
      lower.includes("placed")
    ) {
      toast.success(text);
      return;
    }

    if (
      lower.includes("failed") ||
      lower.includes("fail") ||
      lower.includes("error") ||
      lower.includes("invalid")
    ) {
      toast.error(text);
      return;
    }

    toast(text);
  };
  globalThis.__VINGO_ALERT_TOAST_READY__ = true;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            borderRadius: "12px",
            background: "#1f2937",
            color: "#fff",
            padding: "12px 14px",
          },
        }}
      />
      <APP />
    </Provider>
  </BrowserRouter>
);
