// src/components/users/UserDetail.jsx
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// material-ui
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    IconButton,
    Typography,
    Chip,
    Avatar,
    Divider,
    Button
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { toggleUserStatus } from '../../services/authService.js';

// assets
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

const UserDetail = ({
                        title,
                        getUserById,
                        userType,
                        editUserRoute,
                        listRoute
                    }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user data is passed in location state
        if (location.state?.user) {
            setUser(location.state.user);
            setLoading(false);
        } else {
            // If not, fetch it using the ID from URL params
            const userId = location.pathname.split('/').pop();
            const loadUser = async () => {
                try {
                    setLoading(true);
                    const response = await getUserById(userId);
                    setUser(response.data);
                } catch (error) {
                    enqueueSnackbar(error.message || `Failed to load ${userType} details`, { variant: 'error' });
                    navigate(listRoute);
                } finally {
                    setLoading(false);
                }
            };

            loadUser();
        }
    }, [getUserById, enqueueSnackbar, userType, navigate, listRoute, location]);

    const handleToggleStatus = async () => {
        try {
            const response = await toggleUserStatus(user.id);
            enqueueSnackbar(response.message, { variant: 'success' });

            // Update the user state
            setUser({ ...user, is_active: response.data.is_active });
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to update user status', { variant: 'error' });
        }
    };

    const handleEditUser = () => {
        navigate(`${editUserRoute}/${user.id}`);
    };

    const handleGoBack = () => {
        navigate(listRoute);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6">{userType} not found</Typography>
            </Box>
        );
    }

    return (
        <MainCard
            title={title}
            secondary={
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                >
                    Back to {userType}s
                </Button>
            }
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ textAlign: 'center' }}>
                        <CardContent>
                            <Avatar
                                src={user.profile_photo}
                                alt={user.full_name}
                                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                            >
                                {user.full_name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h4">{user.full_name}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Typography>
                            <Chip
                                label={user.is_active ? 'Active' : 'Inactive'}
                                color={user.is_active ? 'success' : 'default'}
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardHeader
                            title="User Information"
                            action={
                                <Box>
                                    <IconButton
                                        color="secondary"
                                        onClick={handleEditUser}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color={user.is_active ? 'warning' : 'success'}
                                        onClick={handleToggleStatus}
                                    >
                                        {user.is_active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                                    </IconButton>
                                </Box>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1">{user.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Phone
                                    </Typography>
                                    <Typography variant="body1">{user.phone}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        User ID
                                    </Typography>
                                    <Typography variant="body1">{user.id}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Status
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Created At
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(user.updated_at).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </MainCard>
    );
};

UserDetail.propTypes = {
    title: PropTypes.string.isRequired,
    getUserById: PropTypes.func.isRequired,
    userType: PropTypes.string.isRequired,
    editUserRoute: PropTypes.string.isRequired,
    listRoute: PropTypes.string.isRequired
};

export default UserDetail;