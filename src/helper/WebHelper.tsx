export function setLocalStorage(key: string, object: any) {
    localStorage.setItem(process.env.PUBLIC_URL + key, object);
}

export function getLocalStorage(key: string) {
    return localStorage.getItem(process.env.PUBLIC_URL + key);
}

export function removeLocalStorage(key: string) {
    localStorage.removeItem(process.env.PUBLIC_URL + key);
}
