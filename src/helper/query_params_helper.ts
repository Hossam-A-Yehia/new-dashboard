export function createQueryParams(obj: { [x: string]: string | number | boolean; }) {
    return Object.keys(obj)
        .filter(key => obj[key] !== undefined && obj[key] !== null)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');
}