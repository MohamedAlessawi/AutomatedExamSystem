// src/views/dashboard/AdminRegister.jsx
import { useState } from 'react';
import { useSnackbar } from 'notistack';

// material-ui
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import { useForm, Controller } from 'react-hook-form';

// project imports
import MainCard from 'components/cards/MainCard';
import { register as registerService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RefreshIcon from '@mui/icons-material/Refresh';

// Function to generate random password
const generateRandomPassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

// ==============================|| ADMIN REGISTER ||============================== //

export default function AdminRegister() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const { setGlobalLoading } = useAuth();

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm({
        defaultValues: {
            full_name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            role: 'student',
            send_email: true
        }
    });

    const passwordValue = watch('password');
    const passwordConfirmationValue = watch('password_confirmation');

    const handleGeneratePassword = () => {
        const newPassword = generateRandomPassword();
        setValue('password', newPassword);
        setValue('password_confirmation', newPassword);
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setGlobalLoading(true);

        try {
            const formData = new FormData();

            // Add all form fields to FormData
            Object.keys(data).forEach(key => {
                if (key !== 'send_email') { // Exclude send_email from API call
                    formData.append(key, data[key]);
                }
            });

            // Add profile photo if selected
            if (profilePhoto) {
                formData.append('profile_photo', profilePhoto);
            }

            const response = await registerService(formData);

            enqueueSnackbar('User registered successfully!', { variant: 'success' });

            // Reset form after successful submission
            reset();
            setProfilePhoto(null);
            setPreviewPhoto(null);

            // If send_email is true, show additional message
            if (data.send_email) {
                enqueueSnackbar('Login credentials have been sent to the user\'s email.', { variant: 'info' });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Handle validation errors
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                Object.keys(validationErrors).forEach(field => {
                    enqueueSnackbar(`${field}: ${validationErrors[field][0]}`, { variant: 'error' });
                });
            }
        } finally {
            setIsSubmitting(false);
            setGlobalLoading(false);
        }
    };

    return (
        <MainCard title="Register New User">
            <Box sx={{ width: '100%' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                {...register('full_name', { required: 'Full name is required' })}
                                fullWidth
                                label="Full Name"
                                error={Boolean(errors.full_name)}
                                helperText={errors.full_name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                fullWidth
                                label="Email Address"
                                error={Boolean(errors.email)}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                {...register('phone', { required: 'Phone number is required' })}
                                fullWidth
                                label="Phone Number"
                                error={Boolean(errors.phone)}
                                helperText={errors.phone?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="role-select-label">Role</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="role-select-label"
                                            label="Role"
                                        >
                                            <MenuItem value="student">Student</MenuItem>
                                            <MenuItem value="teacher">Teacher</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={Boolean(errors.password)}>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <OutlinedInput
                                    {...register('password', { required: 'Password is required' })}
                                    id="password"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Button
                                                size="small"
                                                onClick={handleGeneratePassword}
                                                startIcon={<RefreshIcon />}
                                                sx={{ mr: 1 }}
                                            >
                                                Generate
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                            >
                                                {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                                            </Button>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                                {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={Boolean(errors.password_confirmation)}>
                                <InputLabel htmlFor="password_confirmation">Confirm Password</InputLabel>
                                <OutlinedInput
                                    {...register('password_confirmation', {
                                        required: 'Please confirm your password',
                                        validate: value => value === passwordValue || 'Passwords do not match'
                                    })}
                                    id="password_confirmation"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    label="Confirm Password"
                                />
                                {errors.password_confirmation?.message && <FormHelperText error>{errors.password_confirmation.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{ mr: 2 }}
                                >
                                    Upload Profile Photo
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </Button>
                                {previewPhoto && (
                                    <Box
                                        component="img"
                                        src={previewPhoto}
                                        alt="Profile preview"
                                        sx={{ height: 50, width: 50, borderRadius: '50%' }}
                                    />
                                )}
                                {profilePhoto && (
                                    <Typography variant="body2">
                                        {profilePhoto.name}
                                    </Typography>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="send_email"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                {...field}
                                                checked={field.value}
                                                color="primary"
                                            />
                                        )}
                                    />
                                }
                                label="Send login credentials to user's email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Stack direction="row" justifyContent="flex-end">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => reset()}
                                    sx={{ mr: 2 }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                >
                                    Register User
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </MainCard>
    );
}

AdminRegister.propTypes = {};