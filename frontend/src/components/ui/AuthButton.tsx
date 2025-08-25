"use client";

import React from "react";

interface AuthButtonProps {
  text: string;
  onClick?: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
    >
      {text}
    </button>
  );
};

export default AuthButton;
