"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  href?: string;
  onClick?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  href,
  onClick
}) => {
  const CardContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-200 cursor-pointer group transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600 text-sm">→</span>
          </div>
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );

  if (href && !onClick) {
    return (
      <a href={href} className="block">
        <CardContent />
      </a>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick}>
        <CardContent />
      </div>
    );
  }

  return <CardContent />;
};

export default QuickActionCard;


