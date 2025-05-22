export const UserRole = {
    USER: 1,
    ADMIN: 2,
    CONTRIBUTER: 3,
};

export const UserStatus = {
    ACTIVE: 1,
    RESTRICTED: 2,
    BANNED: 3,
};

export const UserRoleText = Object.fromEntries(
    Object.entries(UserRole).map(([key, value]) => [value, key])
);

export const UserStatusText = Object.fromEntries(
    Object.entries(UserStatus).map(([key, value]) => [value, key])
);