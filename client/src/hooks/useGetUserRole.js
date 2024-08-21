import { ROLES } from "../consts";
import useAuth from "./useAuth";

export function useGetUserRole() {

    const { roles } = useAuth().auth;
    if (roles.includes(ROLES.admin)) return "admin";
    else if (roles.includes(ROLES.supervisor)) return 'supervisor';
    else if (roles.includes(ROLES.staff)) return'staff';
}