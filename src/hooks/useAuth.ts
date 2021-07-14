import { useContext } from "react";
import { AuthContext } from "../context/AutoContext";

export function useAuth () {
    const value = useContext(AuthContext);

    return value;
}