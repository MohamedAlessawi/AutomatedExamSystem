// assets
import {
    UserOutlined,
    TeamOutlined,
    SolutionOutlined,
    UserAddOutlined
} from '@ant-design/icons';

const icons = {
    UserOutlined,
    TeamOutlined,
    SolutionOutlined,
    UserAddOutlined
};

// ==============================|| USER MANAGEMENT MENU ITEMS ||============================== //

const userManagement = {
    id: 'user-management',
    title: 'User Management',
    type: 'group',
    allowedRoles: ['admin'], // Only admin can see
    children: [
        {
            id: 'teachers',
            title: 'Teachers',
            type: 'item',
            url: '/dashboard/teachers',
            icon: icons.UserOutlined,
            allowedRoles: ['admin']
        },
        {
            id: 'students',
            title: 'Students',
            type: 'item',
            url: '/dashboard/students',
            icon: icons.TeamOutlined,
            allowedRoles: ['admin']
        },
        {
            id: 'admin-register',
            title: 'Register Admin',
            type: 'item',
            url: '/dashboard/admin-register',
            icon: icons.UserAddOutlined,
            allowedRoles: ['admin']
        }
    ]
};

export default userManagement;