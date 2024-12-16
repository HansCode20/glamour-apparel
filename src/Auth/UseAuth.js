export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('role');
}