// hooks/useMenuItems.js
import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import menuItems from '../menu-items';

// دالة لتصفية القوائم بناءً على الدور
const filterMenuItemsByRole = (items, userRole) => {
    if (!items || !userRole) return [];

    return items.filter(item => {
        // إذا كان العنصر لديه خاصية allowedRoles ويحتوي على دور المستخدم
        if (item.allowedRoles && !item.allowedRoles.includes(userRole)) {
            return false;
        }

        // إذا كان العنصر لديه children، قم بتصفيتهم أيضاً
        if (item.children && item.children.length > 0) {
            const filteredChildren = filterMenuItemsByRole(item.children, userRole);
            item.children = filteredChildren;

            // إذا لم يتبق أطفال بعد التصفية، قم بإزالة العنصر
            if (filteredChildren.length === 0 && item.type !== 'group') {
                return false;
            }
        }

        return true;
    });
};

export const useMenuItems = () => {
    const { user } = useAuth();
    const userRole = user?.role || 'student';

    const filteredMenuItems = useMemo(() => {
        if (!menuItems.items) return [];

        // تصفية القوائم الرئيسية
        const filtered = filterMenuItemsByRole([...menuItems.items], userRole);

        // إزالة المجموعات الفارغة
        const nonEmptyGroups = filtered.filter(group => {
            if (group.children && group.children.length === 0) {
                return false;
            }
            return true;
        });

        return nonEmptyGroups;
    }, [userRole]);

    return filteredMenuItems;
};