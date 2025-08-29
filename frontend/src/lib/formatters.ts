import React from 'react';

// Utilitários para formatação consistente entre servidor e cliente

/**
 * Formata número com separadores de milhares de forma consistente
 * Evita problemas de hidratação do Next.js
 */
export function formatNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  // Usa formatação manual para garantir consistência
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Formata porcentagem com casa decimal fixa
 */
export function formatPercent(num: number, decimals: number = 1): string {
  if (typeof num !== 'number' || isNaN(num)) return '0.0';
  
  return num.toFixed(decimals);
}

/**
 * Formata valor monetário de forma consistente
 */
export function formatCurrency(num: number, currency: string = 'EUR'): string {
  if (typeof num !== 'number' || isNaN(num)) return '0,00 €';
  
  // Formatação manual para evitar diferenças de locale
  const formatted = num.toFixed(2).replace('.', ',');
  return `${formatted} €`;
}

/**
 * Formata tamanho de arquivo de forma consistente
 * Para evitar problemas de hidratação
 */
export function formatFileSize(bytes: number): string {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes === 0) return '0 B';
  
  const k = 1024;
  const mb = bytes / (k * k);
  
  if (mb < 1) {
    const kb = bytes / k;
    return `${formatPercent(kb, 1)} KB`;
  } else {
    return `${formatPercent(mb, 1)} MB`;
  }
}

/**
 * Hook para evitar problemas de hidratação
 * Renderiza apenas no cliente quando necessário
 */
export function useIsClient() {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}
