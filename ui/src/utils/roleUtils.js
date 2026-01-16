// src/utils/roleUtils.js
export const hasRole = (userRoles, requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) {
        return true; // No roles required, so everyone can see it
    }

    if (!userRoles || userRoles.length === 0) {
        return false; // User has no roles but item requires roles
    }

    return requiredRoles.some(role => userRoles.includes(role));
};