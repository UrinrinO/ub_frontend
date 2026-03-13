import Routes from "./routes/routes";
import { ToastProvider } from "./components/ui/Toast";
import CookieBanner from "./components/ui/CookieBanner";

export default function App() {
  return (
    <ToastProvider>
      <div className="bg-background text-foreground min-h-screen">
        <Routes />
        <CookieBanner />
      </div>
    </ToastProvider>
  );
}
