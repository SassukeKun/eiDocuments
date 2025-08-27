"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Building2,
  FolderOpen,
  FileType,
  Home,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Settings,
  Users
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      description: 'Visão geral do sistema'
    },
    {
      title: 'Documentos',
      icon: FileText,
      href: '/manage/documentos',
      description: 'Gerenciar todos os documentos'
    },
    {
      title: 'Departamentos',
      icon: Building2,
      href: '/manage/departamentos',
      description: 'Gerenciar departamentos'
    },
    {
      title: 'Categorias',
      icon: FolderOpen,
      href: '/manage/categorias',
      description: 'Gerenciar categorias'
    },
    {
      title: 'Tipos',
      icon: FileType,
      href: '/manage/tipos',
      description: 'Gerenciar tipos de documento'
    },
    {
      title: 'Usuários',
      icon: Users,
      href: '/manage/usuarios',
      description: 'Gerenciar usuários'
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      h-screen bg-white border-r border-gray-200 
      transition-all duration-300 ease-in-out
      flex flex-col
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">eiDocs</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 p-3 rounded-lg
                transition-all duration-200 group
                ${active 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`
                w-5 h-5 
                ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
              `} />
              
              {!isCollapsed && (
                <>
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-blue-600" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/settings"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Configurações</span>}
        </Link>
        
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
