import { useAuth } from "@/app/providers/AuthProvider";
import { apiFetch } from "../apiFetch";

export const getLocations = (): Promise<any> => {
    return apiFetch<[]>(`/location`, {
        method: "GET",
        // headers: { authorization: `Bearer ${user.token}` },
    });
};

export const getLocationByName = (name: any): Promise<any> => {
    return apiFetch<[]>(`/location?name=${name}`, {
        method: "GET",
        // headers: { authorization: `Bearer ${user.token}` },
    });
};

export const getLocationByAmenity = (amenity: any): Promise<any> => {
    return apiFetch<[]>(`/location?amenity=${amenity}`, {
        method: "GET",
        // headers: { authorization: `Bearer ${user.token}` },
    });
};


export const getLocationByTourism = (tourism: any): Promise<any> => {
    return apiFetch<[]>(`/location?tourism=${tourism}`, {
        method: "GET",
        // headers: { authorization: `Bearer ${user.token}` },
    });
};

export const getNearestLocations = ({ lon, lat, distance }: any): Promise<any> => {
    return apiFetch<[]>(`/location/nearby?latitude=${lat}&longitude=${lon}&distance=${distance * 1000}`, {
        method: "GET",
        // headers: { authorization: `Bearer ${user.token}` },
    });
};


export const getFavourites = (): Promise<any> => {
    console.log(localStorage.getItem('token'))
    return apiFetch<[]>(`/users/favorites`, {
        method: "GET",
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

//toggle/favorites

export const toggleFavourites = (id:any): Promise<any> => {

    return apiFetch<[]>(`/users/toggle/favorites`, {
        method: "POST",
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
        data: { locationId: id }
    });
};