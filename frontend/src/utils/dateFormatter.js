export const dateFormatter = (date, locale = 'pt-BR', options = {}) => {
    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate)) {
        throw new Error('Data inválida fornecida para o formatador');
    }

    const defaultOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    };

    const formatOptions = { ...defaultOptions, ...options };

    return parsedDate.toLocaleDateString(locale, {...formatOptions, timeZone: 'UTC' });
};