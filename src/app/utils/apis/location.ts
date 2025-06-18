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

export const getNearestLocations = ({ lon, lat, distance }: any): Promise<any> => {
    return apiFetch<[]>(`/location/nearby?latitude=${lat}&longitude=${lon}&distance=${distance*1000}`, {
        method: "GET",
        // headers: { authorization: `Bearer ${user.token}` },
    });
};
