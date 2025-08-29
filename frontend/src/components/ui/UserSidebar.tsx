"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Building2,
  FolderOpen,
  Home,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Settings,
  User,
  BookOpen,
  Search,
  Upload
} from 'lucide-react';

interface UserSidebarProps {
  className?: string;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard/user',
      description: 'Visão geral dos seus documentos'
    },
    {
      title: 'Documentos do Departamento',
      icon: Building2,
      href: '/user/documentos',
      description: 'Ver documentos do seu departamento'
    },
    {
      title: 'Meus Documentos',
      icon: FolderOpen,
      href: '/user/meus-documentos',
      description: 'Documentos que você criou'
    },
    {
      title: 'Buscar Documentos',
      icon: Search,
      href: '/user/buscar',
      description: 'Pesquisar em todos os documentos'
    },
    {
      title: 'Upload de Documento',
      icon: Upload,
      href: '/upload',
      description: 'Enviar novo documento'
    }
  ];

  const secondaryItems = [
    {
      title: 'Configurações',
      icon: Settings,
      href: '/user/configuracoes',
      description: 'Suas configurações'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">eiDocuments</h1>
              <p className="text-xs text-gray-500">Área do Usuário</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`flex-shrink-0 w-5 h-5 ${
                  active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                
                {!isCollapsed && (
                  <>
                    <span className="ml-3 truncate">{item.title}</span>
                    {active && (
                      <ChevronRight className="ml-auto w-4 h-4 text-blue-600" />
                    )}
                  </>
                )}
                
                {isCollapsed && (
                  <div className="absolute left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Secondary Menu */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`flex-shrink-0 w-5 h-5 ${
                    active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  
                  {!isCollapsed && (
                    <span className="ml-3 truncate">{item.title}</span>
                  )}
                  
                  {isCollapsed && (
                    <div className="absolute left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                      {item.title}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Usuário Atual
              </p>
              <p className="text-xs text-gray-500 truncate">
                user@empresa.com
              </p>
            </div>
          )}
        </div>
        
        <button className={`mt-3 w-full flex items-center ${
          isCollapsed ? 'justify-center' : 'justify-start'
        } px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors`}>
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Sair</span>}
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
