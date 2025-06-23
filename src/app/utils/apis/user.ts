import { apiFetch } from "../apiFetch";

export interface UserProfile {
    _id: string;
    email: string;
    fullName: string;
    role: string;
    favorites: any[];
}

export interface UpdateUserData {
    email?: string;
    fullName?: string;
    password?: string;
    currentPassword?: string;
}

export const getUserProfile = (): Promise<UserProfile> => {
    return apiFetch<UserProfile>(`/users/profile`, {
        method: "GET",
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

export const updateUserProfile = (userData: UpdateUserData): Promise<UserProfile> => {
    return apiFetch<UserProfile>(`/users/profile`, {
        method: "PUT",
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
        data: userData
    });
}; 