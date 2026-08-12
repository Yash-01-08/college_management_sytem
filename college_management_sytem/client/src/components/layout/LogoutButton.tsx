import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  className?: string;
  showText?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  showText = true,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold transition-all ${className}`}
      title="Logout"
    >
      <LogOut className="w-4 h-4 shrink-0" />
      {showText && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;
