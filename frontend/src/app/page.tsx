"use client";

import React from "react";
import Link from "next/link";
import { 
  Shield, 
  Zap, 
  Search, 
  Cloud, 
  BarChart3, 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";

const LandingPage = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Segurança de Nível Bancário",
      description: "Seus documentos são protegidos com criptografia AES-256 e autenticação de dois fatores."
    },
    {
      icon: <Search className="h-8 w-8 text-green-600" />,
      title: "Busca Inteligente",
      description: "Encontre qualquer documento em segundos com nossa tecnologia de busca avançada por IA."
    },
    {
      icon: <Cloud className="h-8 w-8 text-purple-600" />,
      title: "Sincronização em Tempo Real",
      description: "Acesse seus documentos de qualquer dispositivo com sincronização automática."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Analytics Avançados",
      description: "Monitore o uso e performance dos seus documentos com relatórios detalhados."
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Colaboração em Equipe",
      description: "Compartilhe e trabalhe em documentos com sua equipe em tempo real."
    },
    {
      icon: <FileText className="h-8 w-8 text-red-600" />,
      title: "Formato Universal",
      description: "Suporte para mais de 100 formatos de arquivo, incluindo PDF, Word, Excel e mais."
    }
  ];

  const benefits = [
    "Redução de 80% no tempo de busca de documentos",
    "Economia de 60% em custos de armazenamento",
    "Aumento de 90% na produtividade da equipe",
    "Conformidade com LGPD e GDPR",
    "Backup automático e recuperação de desastres",
    "Integração com mais de 50 ferramentas populares"
  ];

  const team = [
    {
      name: "Equipe de TI",
      role: "Desenvolvimento e Infraestrutura",
      department: "Tecnologia da Informação",
      content: "Responsável pelo desenvolvimento, manutenção e segurança da plataforma.",
      expertise: "Desenvolvimento Full-Stack"
    },
    {
      name: "Equipe de Gestão",
      role: "Coordenação e Planejamento",
      department: "Administração",
      content: "Coordena a implementação e define as estratégias de uso da plataforma.",
      expertise: "Gestão de Projetos"
    },
    {
      name: "Equipe de Usuários",
      role: "Usuários Finais",
      department: "Todas as Áreas",
      content: "Utilizam a plataforma diariamente para gestão eficiente de documentos.",
      expertise: "Operação e Uso"
    }
  ];

  const companyInfo = {
    name: "Nossa Empresa",
    description: "Somos uma organização comprometida com a excelência e inovação em todos os nossos processos.",
    mission: "Fornecer soluções tecnológicas de alta qualidade para otimizar nossos processos internos.",
    vision: "Ser referência em eficiência operacional através da tecnologia.",
    values: [
      "Inovação e Tecnologia",
      "Eficiência Operacional",
      "Segurança e Confiabilidade",
      "Colaboração em Equipe"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">eiDocuments</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Recursos</a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">Benefícios</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">Sobre</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Entrar
              </Link>
              <ModernButton size="sm" onClick={() => window.location.href = '/register'}>
                Começar Grátis
              </ModernButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Plataforma Inteligente de
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Documentos</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema corporativo para gestão eficiente de documentos empresariais. 
              Organize, busque e gerencie seus arquivos com tecnologia de ponta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ModernButton size="lg" onClick={() => window.location.href = '/register'}>
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </ModernButton>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <span>Ver Demo</span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Segurança Corporativa</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-600">Disponibilidade</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime Garantido</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recursos Avançados para Gestão Corporativa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnologias de ponta para otimizar seus processos de documentação
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Benefícios para Nossa Organização
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                A implementação desta plataforma trará melhorias significativas em eficiência, 
                produtividade e organização dos nossos processos.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
                  <div className="text-gray-600">Aumento na Produtividade</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Antes</span>
                    <span className="text-gray-600">Depois</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600">
              Conheça os responsáveis por esta plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  {member.content}
                </p>
                
                <div>
                  <div className="font-semibold text-gray-900">{member.name}</div>
                  <div className="text-gray-600">{member.role}</div>
                  <div className="text-blue-600 font-medium">{member.department}</div>
                  <div className="text-sm text-gray-500 mt-1">{member.expertise}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sobre Nossa Organização
            </h2>
            <p className="text-xl text-gray-600">
              Conheça nossa missão, visão e valores
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
                <p className="text-gray-600 text-lg">
                  {companyInfo.mission}
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Visão</h3>
                <p className="text-gray-600 text-lg">
                  {companyInfo.vision}
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossos Valores</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {companyInfo.values.map((value, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{companyInfo.name}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {companyInfo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Usar a Plataforma?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Acesse sua conta e comece a utilizar todos os recursos disponíveis
          </p>
          
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ModernButton 
                size="lg" 
                variant="secondary"
                onClick={() => window.location.href = '/dashboard'}
              >
                Acessar Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </ModernButton>
              <Link href="/login" className="flex items-center justify-center space-x-2 text-white border-2 border-white rounded-xl px-8 py-4 hover:bg-white hover:text-blue-600 transition-all duration-300">
                <span>Fazer Login</span>
              </Link>
            </div>
          
          <p className="text-blue-200 mt-6">
            ✓ Acesso imediato ✓ Suporte interno ✓ Treinamento disponível
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">eiDocuments</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Plataforma corporativa para gestão inteligente de documentos empresariais.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Recursos</a>
              <a href="#benefits" className="hover:text-white transition-colors">Benefícios</a>
              <a href="#about" className="hover:text-white transition-colors">Sobre</a>
              <a href="/login" className="hover:text-white transition-colors">Login</a>
              <a href="/register" className="hover:text-white transition-colors">Registro</a>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8">
              <p className="text-gray-400 text-sm">
                © 2024 eiDocuments - Plataforma Corporativa. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
