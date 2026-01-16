// src/components/RoleBasedMenu.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const RoleBasedMenu = ({ item, level }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [open, setOpen] = React.useState(false);

    // Check if the current item should be visible based on user role
    const isVisible = () => {
        // If no roles are specified, show to all users
        if (!item.roles) return true;
        // If user is not logged in, don't show any role-specific items
        if (!user) return false;
        // Show item if user's role is in the item's roles array
        return item.roles.includes(user.role);
    };

    // Check if the current item is active
    const isActive = () => {
        if (item.url) {
            return location.pathname === item.url;
        }
        if (item.children) {
            return item.children.some(child => child.url && location.pathname === child.url);
        }
        return false;
    };

    // Handle click on menu item
    const handleClick = () => {
        if (item.type === 'collapse') {
            setOpen(!open);
        }
    };

    // If the item should not be visible, return null
    if (!isVisible()) return null;

    // Render menu item based on its type
    if (item.type === 'collapse') {
        return (
            <>
                <ListItemButton
                    selected={isActive()}
                    onClick={handleClick}
                    sx={{
                        pl: level * 2 + 1,
                        '&.Mui-selected': {
                            backgroundColor: 'primary.lighter',
                            '&:hover': {
                                backgroundColor: 'primary.lighter'
                            }
                        }
                    }}
                >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((child, index) => (
                            <RoleBasedMenu key={index} item={child} level={level + 1} />
                        ))}
                    </List>
                </Collapse>
            </>
        );
    }

    // For external links
    if (item.external) {
        return (
            <ListItemButton
                component="a"
                href={item.url}
                target={item.target || '_blank'}
                sx={{
                    pl: level * 2 + 1,
                    '&.Mui-selected': {
                        backgroundColor: 'primary.lighter',
                        '&:hover': {
                            backgroundColor: 'primary.lighter'
                        }
                    }
                }}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
            </ListItemButton>
        );
    }

    // For regular menu items
    return (
        <ListItemButton
            component="a"
            href={item.url}
            selected={isActive()}
            sx={{
                pl: level * 2 + 1,
                '&.Mui-selected': {
                    backgroundColor: 'primary.lighter',
                    '&:hover': {
                        backgroundColor: 'primary.lighter'
                    }
                }
            }}
        >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
        </ListItemButton>
    );
};

export default RoleBasedMenu;