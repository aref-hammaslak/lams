import UserRoleModel from "../models/UserRole.js";

export const USER_ROLES = {
    Staff: 1001,
    Supervisor: 1923,
    Admin: 2005,
};

export async function findUserRoleById(id) {
    let userRole;
    try {
        userRole = await UserRoleModel.findById(id);
    } catch {
        userRole = null;
    }

    if (!userRole) {
        userRole = await UserRoleModel.findOne({ role_id: id });
    }

    return userRole;
}

export async function getUserACLs(user) {
    let acls = [];

    for (const role_id of user.roles) {
        const role = await findUserRoleById(role_id);
        if (role) {
            acls.push(role.acl);
        }
    }

    return acls;
}

export async function canUserChangeOther(self, other) {
    if (self._id.equals(other._id)) {
        return true;
    }

    const privs = self.roles.map((role_id) => {
        const priv = {
            role_id
        };
        if (self.lab_owner === true) {
            priv.lab_owner = true;
        }
        if (self.lab_id.equals(other.lab_id)) {
            priv.same_lab = true;
        }

        return priv;
    });

    for (const acls of await getUserACLs(other)) {
        if (!checkACL(privs, acls)) {
            return false;
        }
    }
    return true;
}

export async function canUserAccessRole(self, other, role_id) {
    const privs = self.roles.map((role_id) => {
        const priv = {
            role_id
        };
        if (self.lab_owner === true) {
            priv.lab_owner = true;
        }
        if (self.lab_id.equals(other.lab_id)) {
            priv.same_lab = true;
        }

        return priv;
    });

    const role = await findUserRoleById(role_id);
    if (!role) {
        throw new Error(`ACL not defined for rule ${role_id}`);
    }
    const acl = role.acl;

    return checkACL(privs, acl);
}

export async function isUserPrivileged(user) {
    for (const role_id of user.roles) {
        const role = await findUserRoleById(role_id);
        if (!role) {
            continue;
        }

        if (role.privileged === true) {
            return true;
        }

        return false;
    }
}

export function canUserChangeDeleted(user) {
    return (user.roles.includes(USER_ROLES.Admin) || user.roles.includes(USER_ROLES.Staff));
}

function checkACL(privs, acls) {
    for (const acl of acls) {
        for (const priv of privs) {
            if (priv.role_id !== acl.role_id) {
                continue;
            }

            if ('same_lab' in acl && acl.same_lab != undefined && acl.same_lab !== priv.same_lab) {
                continue;
            }
            if ('lab_owner' in acl && acl.lab_owner != undefined && acl.lab_owner !== priv.lab_owner) {
                continue;
            }

            return true;
        }
    }

    return false;
}