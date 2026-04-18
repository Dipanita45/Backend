import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function Root() {
  return (
    <StrictMode>
      <div className="app-wrapper">
        <App />
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);