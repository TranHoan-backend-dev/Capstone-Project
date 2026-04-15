// import {authFetch} from "./authFetch";

export const getClientAccessToken = async (): Promise<string | null> => {
    try {
        // const response = await authFetch("/api/auth/token", {
        const response = await fetch("/api/auth/token", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error("Failed to fetch token:", error);
        return null;
    }
};
