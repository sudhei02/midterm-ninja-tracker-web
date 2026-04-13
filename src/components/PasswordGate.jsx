import { useState } from "react";
import { Shield } from "lucide-react";
import { setAuthenticated } from "../utils/auth";

export default function PasswordGate({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_APP_PASSWORD) {
      setAuthenticated();
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="ninja-bg min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-ninja-card border border-ninja-border rounded-2xl p-6 sm:p-8 w-full max-w-xs text-center"
      >
        <img
          src="./ninja-mascot.png"
          alt="Ninja mascot"
          className="w-16 h-16 mx-auto mb-4 rounded-xl"
        />
        <div className="flex items-center justify-center gap-2 mb-1">
          <Shield size={16} className="text-ninja-red" />
          <span className="text-sm font-bold text-ninja-text">Ninja Access</span>
        </div>
        <p className="text-[11px] text-ninja-text-dim mb-5">Enter the password to continue</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className={`w-full bg-ninja-bg border rounded-lg px-3 py-2.5 text-sm text-ninja-text placeholder-ninja-text-muted outline-none font-[inherit] ${
            error ? "border-ninja-red-light" : "border-ninja-border focus:border-ninja-red"
          }`}
        />
        {error && (
          <p className="text-[11px] text-ninja-red-light mt-2">Wrong password, ninja.</p>
        )}
        <button
          type="submit"
          className="mt-4 w-full bg-ninja-red text-white font-semibold text-sm py-2.5 rounded-lg cursor-pointer border-none font-[inherit] hover:brightness-110 transition-all"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
