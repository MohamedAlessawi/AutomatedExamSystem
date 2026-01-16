// src/components/users/UserList.jsx
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Tooltip,
    Typography,
    Chip,
    Avatar
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { toggleUserStatus } from '../../services/authService';

// assets
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

const UserList = ({
                      title,
                      fetchUsers,
                      getUserById,
                      userType,
                      addUserRoute,
                      editUserRoute,
                      viewUserRoute
                  }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [togglingUserId, setTogglingUserId] = useState(null); // Add this for loading state
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const response = await fetchUsers();
                setUsers(response.data);
            } catch (error) {
                enqueueSnackbar(error.message || `Failed to load ${userType}s`, { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [fetchUsers, enqueueSnackbar, userType]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleToggleStatus = async (userId) => {
        setTogglingUserId(userId); // Set loading state for this specific user
        try {
            const response = await toggleUserStatus(userId);

            // The API response is: { "success": true, "message": "User status updated.", "data": { "id": 1, "is_active": true } }
            // We need to update the user in the list with the new status from response.data
            setUsers(currentUsers =>
                currentUsers.map(user =>
                    user.id === userId
                        ? { ...user, is_active: response.data.is_active }
                        : user
                )
            );

            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.error("Failed to toggle user status:", error);
            // Provide a more specific error message if available
            const errorMessage = error.response?.data?.message || 'Failed to update user status';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setTogglingUserId(null); // Clear loading state
        }
    };

    const handleViewUser = async (userId) => {
        try {
            const response = await getUserById(userId);
            // Navigate to user details page with the user data
            navigate(viewUserRoute, { state: { user: response.data } });
        } catch (error) {
            enqueueSnackbar(error.message || `Failed to load ${userType} details`, { variant: 'error' });
        }
    };

    const handleEditUser = (userId) => {
        navigate(`${editUserRoute}/${userId}`);
    };

    const handleAddUser = () => {
        navigate(addUserRoute);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    return (
        <MainCard title={title} secondary={
            <Box
                component="button"
                onClick={handleAddUser}
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    border: 'none',
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: 'primary.dark'
                    }
                }}
            >
                Add {userType}
            </Box>
        }>
            <Box sx={{ width: '100%' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Profile</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                        ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : users
                                ).map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>
                                            <Avatar
                                                src={user.profile_photo}
                                                alt={user.full_name}
                                                sx={{ width: 40, height: 40 }}
                                            >
                                                {user.full_name.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{user.full_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.is_active ? 'Active' : 'Inactive'}
                                                color={user.is_active ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex' }}>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleViewUser(user.id)}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => handleEditUser(user.id)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={user.is_active ? 'Deactivate' : 'Activate'}>
                                                    <IconButton
                                                        color={user.is_active ? 'warning' : 'success'}
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        disabled={togglingUserId === user.id} // Disable button while loading
                                                    >
                                                        {togglingUserId === user.id ? (
                                                            <CircularProgress size={24} />
                                                        ) : user.is_active ? (
                                                            <ToggleOffIcon />
                                                        ) : (
                                                            <ToggleOnIcon />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            component="div"
                            count={users.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                )}
            </Box>
        </MainCard>
    );
};

UserList.propTypes = {
    title: PropTypes.string.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    getUserById: PropTypes.func.isRequired,
    userType: PropTypes.string.isRequired,
    addUserRoute: PropTypes.string.isRequired,
    editUserRoute: PropTypes.string.isRequired,
    viewUserRoute: PropTypes.string.isRequired
};

export default UserList;