"use client";

import React from 'react';
import DetailModal from '@/components/ui/DetailModal';
import { Departamento } from '@/types';
import { 
  Building2, 
  Calendar, 
  Code, 
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DepartamentoDetailProps {
  isOpen: boolean;
  onClose: () => void;
  departamento: Departamento | null;
}



const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const DepartamentoDetail: React.FC<DepartamentoDetailProps> = ({
  isOpen,
  onClose,
  departamento
}) => {
  if (!departamento) return null;

  // Os dados reais disponíveis: nome, ativo, descrição, código, datas
  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Departamento"
      size="xl"
    >
      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{departamento.nome}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  departamento.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {departamento.ativo ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Inativo
                    </>
                  )}
                </span>
              </div>
              {departamento.descricao && (
                <p className="text-gray-600 mb-3">{departamento.descricao}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Code className="w-4 h-4" />
                  <span>Código: {departamento.codigo}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em {formatDate(departamento.dataCriacao)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadados */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Informações do Sistema</h4>
          <div className="text-sm">
            <div>
              <span className="text-gray-500">Última Atualização:</span>
              <span className="ml-2 text-gray-900">{formatDate(departamento.dataAtualizacao)}</span>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default DepartamentoDetail;
