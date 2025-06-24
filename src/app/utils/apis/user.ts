import { apiFetch } from "../apiFetch";

export interface UserProfile {
    _id: string;
    email: string;
    fullName: string;
    role: string;
    favorites: any[];
    currentLocation?: {
        latitude: number;
        longitude: number;
        updatedAt: string;
    };
}

export interface UpdateUserData {
    email?: string;
    fullName?: string;
    password?: string;
    currentPassword?: string;
}

export interface UpdateCurrentLocationData {
    latitude: number;
    longitude: number;
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

export const updateCurrentLocation = (locationData: UpdateCurrentLocationData): Promise<UserProfile> => {
    return apiFetch<UserProfile>(`/users/current-location`, {
        method: "PUT",
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
        data: locationData
    });
};

export const getCurrentLocation = (): Promise<{ latitude: number; longitude: number; updatedAt: string } | null> => {
    return apiFetch<{ latitude: number; longitude: number; updatedAt: string } | null>(`/users/current-location`, {
        method: "GET",
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

export interface NearbyUser {
    _id: string;
    fullName: string;
    currentLocation: {
        latitude: number;
        longitude: number;
        updatedAt: string;
    };
}

export const getNearbyUsers = (distance?: number): Promise<NearbyUser[]> => {
    const queryParams = distance ? `?distance=${distance}` : '';
    return apiFetch<NearbyUser[]>(`/users/nearby${queryParams}`, {
        method: "GET",
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
}; 