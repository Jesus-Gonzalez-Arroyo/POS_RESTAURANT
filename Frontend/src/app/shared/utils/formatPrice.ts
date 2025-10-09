// Función alternativa con formato personalizado (punto como separador de miles)
export function formatPriceCustom(price: number): string {
    if (price === null || price === undefined) {
        return '0';
    }

    // Convierte a string y agrega puntos como separadores de miles
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}