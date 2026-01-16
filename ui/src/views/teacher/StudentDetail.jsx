// src/views/teacher/StudentDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// material-ui
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    IconButton,
    Typography,
    Avatar,
    Button,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getStudentByIdForTeacher } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StudentDetail = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                const response = await getStudentByIdForTeacher(id);
                setStudent(response.data);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch student details', { variant: 'error' });
                navigate('/dashboard/students');
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [enqueueSnackbar, id, navigate]);

    const handleBack = () => {
        navigate('/dashboard/students');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!student) {
        return (
            <MainCard title="Student Not Found">
                <Typography variant="body1">
                    The student you're looking for doesn't exist or has been removed.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mt: 2 }}
                >
                    Back to Students
                </Button>
            </MainCard>
        );
    }

    return (
        <MainCard title="Student Details">
            <Box sx={{ width: '100%' }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Avatar
                                    src={student.profile_photo}
                                    alt={student.full_name}
                                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                                >
                                    {student.full_name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="h4">{student.full_name}</Typography>
                                <Chip
                                    label={student.role}
                                    color="primary"
                                    sx={{ mt: 1 }}
                                />
                                <Chip
                                    label={student.is_active ? 'Active' : 'Inactive'}
                                    color={student.is_active ? 'success' : 'default'}
                                    sx={{ mt: 1, ml: 1 }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EmailIcon sx={{ mr: 1, fontSize: 18 }} />
                                            Email
                                        </Typography>
                                        <Typography variant="body1">
                                            {student.email}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PhoneIcon sx={{ mr: 1, fontSize: 18 }} />
                                            Phone
                                        </Typography>
                                        <Typography variant="body1">
                                            {student.phone}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />
                                            Email Verified
                                        </Typography>
                                        <Typography variant="body1">
                                            {student.email_verified_at ?
                                                new Date(student.email_verified_at).toLocaleDateString() :
                                                'Not verified'
                                            }
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Two Factor Enabled
                                        </Typography>
                                        <Typography variant="body1">
                                            {student.two_factor_enabled ? 'Yes' : 'No'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            IP Address
                                        </Typography>
                                        <Typography variant="body1">
                                            {student.ip_address}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />
                                            Created At
                                        </Typography>
                                        <Typography variant="body1">
                                            {new Date(student.created_at).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {student.exams && student.exams.length > 0 && (
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Exam History
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Exam</TableCell>
                                            <TableCell>Subject</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Score</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {student.exams.map((exam) => (
                                            <TableRow key={exam.id}>
                                                <TableCell>{exam.title}</TableCell>
                                                <TableCell>{exam.subject}</TableCell>
                                                <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{exam.score}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={exam.status}
                                                        color={exam.status === 'completed' ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </MainCard>
    );
};

export default StudentDetail;