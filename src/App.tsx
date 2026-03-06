import Routes from "./routes/routes";
import { ToastProvider } from "./components/ui/Toast";

export default function App() {
  return (
    <ToastProvider>
      <div className="bg-background text-foreground min-h-screen">
        <Routes />
      </div>
    </ToastProvider>
  );
}
