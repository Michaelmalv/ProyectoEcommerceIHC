import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { ProfilePage } from "./pages/ProfilePage";
import { HelpPage } from "./pages/HelpPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TrackOrderPage } from "./pages/TrackOrderPage";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";
import { NotificationPreferencesPage } from "./pages/NotificationPreferencesPage";
import { PrivacySettingsPage } from "./pages/PrivacySettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "catalogo", Component: CatalogPage },
      { path: "producto/:id", Component: ProductPage },
      { path: "carrito", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "confirmacion", Component: ConfirmationPage },
      { path: "perfil", Component: ProfilePage },
      { path: "perfil/cambiar-contrasena", Component: ChangePasswordPage },
      { path: "perfil/notificaciones", Component: NotificationPreferencesPage },
      { path: "perfil/privacidad", Component: PrivacySettingsPage },
      { path: "ayuda", Component: HelpPage },
      { path: "seguimiento", Component: TrackOrderPage },
      { path: "login", Component: LoginPage },
      { path: "registro", Component: RegisterPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
