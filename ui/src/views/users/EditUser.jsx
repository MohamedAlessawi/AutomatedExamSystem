// src/views/users/EditUser.jsx
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// material-ui
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
    Divider
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
// CORRECTED IMPORT: We only import 'updateUser'. 'getUserById' is passed as a prop.
import { updateUser } from '../../services/authService';

const EditUser = ({ userType, getUserById, listRoute }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        role: userType, // Default role based on userType prop
        is_active: true
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                // getUserById is passed as a prop from EditTeacher or EditStudent
                const response = await getUserById(id);
                const userData = response.data;
                setUser(userData);
                setFormData({
                    full_name: userData.full_name,
                    email: userData.email,
                    phone: userData.phone,
                    role: userData.role,
                    is_active: userData.is_active
                });
            } catch (error) {
                enqueueSnackbar(error.message || `Failed to load ${userType} details`, { variant: 'error' });
                navigate(listRoute);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id, getUserById, enqueueSnackbar, userType, navigate, listRoute]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'is_active' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Now we call the 'updateUser' function we added to authService
            await updateUser(id, formData);
            enqueueSnackbar(`${userType} updated successfully`, { variant: 'success' });
            navigate(listRoute);
        } catch (error) {
            const errorMessage = error.response?.data?.message || `Failed to update ${userType}`;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MainCard title={`Edit ${userType}`}>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="Role"
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    name="is_active"
                                    color="primary"
                                />
                            }
                            label="Active"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => navigate(listRoute)}
                                sx={{ mr: 2 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={submitting}
                                startIcon={submitting ? <CircularProgress size={20} /> : null}
                            >
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

EditUser.propTypes = {
    userType: PropTypes.string.isRequired,
    getUserById: PropTypes.func.isRequired, // This prop is required
    listRoute: PropTypes.string.isRequired
};

export default EditUser;