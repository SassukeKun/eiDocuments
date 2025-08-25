"use client";

import React from "react";
import ModernButton from "./ModernButton";
import { useNotification } from "@/hooks/useNotification";

const NotificationDemo: React.FC = () => {
  const { success, error, warning, info } = useNotification();

  return (
    <div className="fixed bottom-4 left-4 z-40 space-y-2">
      <div className="flex flex-col space-y-2">
        <ModernButton
          size="sm"
          variant="outline"
          onClick={() => success("Sucesso!", "Operação realizada com sucesso!")}
        >
          Sucesso
        </ModernButton>
        
        <ModernButton
          size="sm"
          variant="outline"
          onClick={() => error("Erro!", "Algo deu errado. Tente novamente.")}
        >
          Erro
        </ModernButton>
        
        <ModernButton
          size="sm"
          variant="outline"
          onClick={() => warning("Atenção!", "Esta ação requer confirmação.")}
        >
          Aviso
        </ModernButton>
        
        <ModernButton
          size="sm"
          variant="outline"
          onClick={() => info("Informação", "Aqui está uma informação útil.")}
        >
          Info
        </ModernButton>
      </div>
    </div>
  );
};

export default NotificationDemo;
