export const numberFormatter = (number, locale = 'pt-BR', options = {}) => {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new Error('Número inválido fornecido para o formatador');
    }

    const defaultOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    const formatOptions = { ...defaultOptions, ...options };

    return new Intl.NumberFormat(locale, formatOptions).format(number);
};
