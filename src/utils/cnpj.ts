// CNPJ utility functions

export const cleanCNPJ = (cnpj: string): string => {
  return cnpj.replace(/\D/g, "");
};

export const formatCNPJ = (cnpj: string): string => {
  const cleaned = cleanCNPJ(cnpj);

  if (cleaned.length <= 14) {
    return cleaned.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }

  return cleaned.substring(0, 14);
};

export const isValidCNPJ = (cnpj: string): boolean => {
  const cleaned = cleanCNPJ(cnpj);

  if (cleaned.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let weight = 2;

  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleaned.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(cleaned.charAt(12)) !== digit1) return false;

  sum = 0;
  weight = 2;

  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleaned.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const remainder2 = sum % 11;
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;

  return parseInt(cleaned.charAt(13)) === digit2;
};
