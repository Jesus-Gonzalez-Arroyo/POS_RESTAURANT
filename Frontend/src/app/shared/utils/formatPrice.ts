export function formatPriceCustom(price: number): string {
    if (price === null || price === undefined) {
        return '0';
    }

    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
