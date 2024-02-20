const userKey = 'user';

export function storeUser(user) {
    localStorage.setItem(userKey, JSON.stringify(user));
}

export function getUser() {
    let userString = localStorage.getItem(userKey); 
    return JSON.parse(userString); 
} 
export function logoutUser() {
    localStorage.removeItem(userKey);
}