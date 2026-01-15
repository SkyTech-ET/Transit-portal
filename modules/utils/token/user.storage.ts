import { IUser } from "@/modules/user/user.types";

const setUserData = (user: IUser) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('transit-portal-user', JSON.stringify(user));
    }
}

const getUserData = (): IUser | null => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('transit-portal-user');
        return user ? JSON.parse(user) : null;
    }
    return null
}

const removeUserData = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('transit-portal-user');
    }
}


export { setUserData, getUserData, removeUserData }