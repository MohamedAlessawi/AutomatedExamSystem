// src/views/teacher/ExamDetail.jsx
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    Avatar
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getExamById } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const ExamDetail = () => {
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchExam = async () => {
            try {
                setLoading(true);
                const response = await getExamById(id);
                setExam(response.data);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch exam details', { variant: 'error' });
                navigate('/dashboard/exams');
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [enqueueSnackbar, id, navigate]);

    const handleEdit = () => {
        navigate(`/dashboard/exams/${id}/edit`);
    };

    const handleBack = () => {
        navigate('/dashboard/exams');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!exam) {
        return (
            <MainCard title="Exam Not Found">
                <Typography variant="body1">
                    The exam you're looking for doesn't exist or has been removed.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mt: 2 }}
                >
                    Back to Exams
                </Button>
            </MainCard>
        );
    }

    return (
        <MainCard title="Exam Details">
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
                    <Grid item>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {exam.title}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {exam.description}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        label={exam.status}
                                        color={exam.status === 'published' ? 'success' : 'default'}
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label={`${exam.duration_minutes} minutes`}
                                        color="primary"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label={`${exam.total_marks} marks`}
                                        color="secondary"
                                    />
                                </Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Subject: {exam.subject ? exam.subject.name : `Subject ${exam.subject_id}`}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Teacher: {exam.teacher ? exam.teacher.full_name : 'Unknown'}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Created: {new Date(exam.created_at).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Exam Schedule
                                </Typography>
                                <Typography variant="body1">
                                    Start Time: {exam.start_time ? new Date(exam.start_time).toLocaleString() : 'Not set'}
                                </Typography>
                                <Typography variant="body1">
                                    End Time: {exam.end_time ? new Date(exam.end_time).toLocaleString() : 'Not set'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <QuestionAnswerIcon sx={{ mr: 1 }} />
                                    Questions ({exam.questions ? exam.questions.length : 0})
                                </Typography>
                                {exam.questions && exam.questions.length > 0 ? (
                                    <List>
                                        {exam.questions.map((question, index) => (
                                            <ListItem key={question.id} divider>
                                                <ListItemText
                                                    primary={`${index + 1}. ${question.question_text}`}
                                                    secondary={`Type: ${question.question_type} | Difficulty: ${question.difficulty_level} | Mark: ${question.pivot ? question.pivot.mark : 'Not set'}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        No questions added to this exam yet.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    Assigned Students
                                </Typography>
                                {exam.students && exam.students.length > 0 ? (
                                    <List>
                                        {exam.students.map((student) => (
                                            <ListItem key={student.id} divider>
                                                <Avatar
                                                    src={student.profile_photo}
                                                    alt={student.full_name}
                                                    sx={{ mr: 2 }}
                                                >
                                                    {student.full_name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <ListItemText
                                                    primary={student.full_name}
                                                    secondary={student.email}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        No students assigned to this exam yet.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ExamDetail;