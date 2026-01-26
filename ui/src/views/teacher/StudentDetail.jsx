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
    Chip,
    Paper,
    LinearProgress,
    Stack
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getStudentByIdForTeacher, getAdminExamStats } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScoreIcon from '@mui/icons-material/Score';

const StudentDetail = () => {
    const [student, setStudent] = useState(null);
    const [examStats, setExamStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
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

        const fetchExamStats = async () => {
            try {
                setStatsLoading(true);
                const response = await getAdminExamStats();
                setExamStats(response.data);
            } catch (error) {
                console.error('Failed to fetch exam statistics:', error);
                // Don't show error snackbar for stats as they might not be critical
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStudent();
        fetchExamStats();
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

    const renderStatCard = (title, value, icon, color = 'primary') => (
        <Card>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 1 }}>
                            {value}
                        </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.dark` }}>
                        {icon}
                    </Avatar>
                </Stack>
            </CardContent>
        </Card>
    );

    const calculateProgress = (value, max = 100) => {
        return (value / max) * 100;
    };

    return (
        <MainCard title="Student Details">
            <Box sx={{ width: '100%' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mb: 3 }}
                >
                    Back to Students
                </Button>

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
                                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                                    <Chip
                                        label={student.role}
                                        color="primary"
                                    />
                                    <Chip
                                        label={student.is_active ? 'Active' : 'Inactive'}
                                        color={student.is_active ? 'success' : 'default'}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Exam Statistics Section */}
                        {!statsLoading && examStats && (
                            <Card sx={{ mt: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AssessmentIcon sx={{ mr: 1 }} />
                                        Exam Statistics
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            {renderStatCard(
                                                'Submitted',
                                                examStats.submitted,
                                                <CheckCircleIcon />,
                                                'success'
                                            )}
                                        </Grid>
                                        <Grid item xs={6}>
                                            {renderStatCard(
                                                'Not Submitted',
                                                examStats.not_submitted,
                                                <CancelIcon />,
                                                'error'
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Card sx={{ mt: 1 }}>
                                                <CardContent>
                                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                        Average Score
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <ScoreIcon color="primary" />
                                                        <Typography variant="h5">
                                                            {examStats.avg_score.toFixed(1)}%
                                                        </Typography>
                                                    </Stack>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={calculateProgress(examStats.avg_score)}
                                                        color="primary"
                                                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                                                    />
                                                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Min: {examStats.min_score}%
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Max: {examStats.max_score}%
                                                        </Typography>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                        Pass Rate
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <TrendingUpIcon color="success" />
                                                        <Typography variant="h5">
                                                            {(examStats.pass_rate * 100).toFixed(1)}%
                                                        </Typography>
                                                    </Stack>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={calculateProgress(examStats.pass_rate * 100)}
                                                        color="success"
                                                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                                                    />
                                                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                                        Pass Mark: {examStats.pass_mark}%
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* Score Distribution */}
                        {!statsLoading && examStats && examStats.score_distribution && (
                            <Card sx={{ mt: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Score Distribution
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {Object.entries(examStats.score_distribution).map(([range, count]) => (
                                        <Box key={range} sx={{ mb: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                <Typography variant="body2">
                                                    {range.replace('_', '-')}%
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {count} student{count !== 1 ? 's' : ''}
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={calculateProgress(count, examStats.total_assignments)}
                                                sx={{ height: 6, borderRadius: 3 }}
                                            />
                                        </Box>
                                    ))}
                                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                                        Total Assignments: {examStats.total_assignments}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Student Information
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <EmailIcon sx={{ mr: 1, fontSize: 18 }} />
                                                Email
                                            </Typography>
                                            <Typography variant="body1">
                                                {student.email}
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <PhoneIcon sx={{ mr: 1, fontSize: 18 }} />
                                                Phone
                                            </Typography>
                                            <Typography variant="body1">
                                                {student.phone || 'Not provided'}
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />
                                                Email Verified
                                            </Typography>
                                            <Typography variant="body1">
                                                {student.email_verified_at ?
                                                    new Date(student.email_verified_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) :
                                                    <Chip label="Not verified" size="small" color="error" />
                                                }
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Two Factor Authentication
                                            </Typography>
                                            <Chip
                                                label={student.two_factor_enabled ? 'Enabled' : 'Disabled'}
                                                color={student.two_factor_enabled ? 'success' : 'default'}
                                                size="small"
                                                sx={{ mt: 1 }}
                                            />
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                IP Address
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                                {student.ip_address || 'Not available'}
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />
                                                Account Created
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(student.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    {/* Additional Information */}
                                    <Grid item xs={12}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Additional Information
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Last Login
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {student.last_login_at ?
                                                            new Date(student.last_login_at).toLocaleDateString() :
                                                            'Never logged in'
                                                        }
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Status
                                                    </Typography>
                                                    <Chip
                                                        label={student.is_active ? 'Active' : 'Inactive'}
                                                        color={student.is_active ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Exam History */}
                        {student.exams && student.exams.length > 0 && (
                            <Card sx={{ mt: 3 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Exam History
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Exam</TableCell>
                                                    <TableCell>Subject</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Score</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {student.exams.map((exam) => (
                                                    <TableRow key={exam.id} hover>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {exam.title}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>{exam.subject}</TableCell>
                                                        <TableCell>
                                                            {new Date(exam.date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={`${exam.score}%`}
                                                                color={
                                                                    exam.score >= 85 ? 'success' :
                                                                        exam.score >= 70 ? 'info' :
                                                                            exam.score >= 50 ? 'warning' : 'error'
                                                                }
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={exam.status}
                                                                color={exam.status === 'completed' ? 'success' : 'default'}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => navigate(`/dashboard/exams/${exam.id}`)}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* No Exams Message */}
                        {(!student.exams || student.exams.length === 0) && (
                            <Card sx={{ mt: 3 }}>
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="textSecondary" gutterBottom>
                                        No Exam History
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        This student hasn't taken any exams yet.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default StudentDetail;