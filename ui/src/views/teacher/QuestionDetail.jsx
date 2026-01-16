// src/views/teacher/QuestionDetail.jsx
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
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Radio,
    Checkbox
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getQuestionById } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const QuestionDetail = () => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setLoading(true);
                const response = await getQuestionById(id);
                setQuestion(response.data);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch question details', { variant: 'error' });
                navigate('/dashboard/questions');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [enqueueSnackbar, id, navigate]);

    const handleEdit = () => {
        navigate(`/dashboard/questions/${id}/edit`);
    };

    const handleBack = () => {
        navigate('/dashboard/questions');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!question) {
        return (
            <MainCard title="Question Not Found">
                <Typography variant="body1">
                    The question you're looking for doesn't exist or has been removed.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mt: 2 }}
                >
                    Back to Questions
                </Button>
            </MainCard>
        );
    }

    return (
        <MainCard title="Question Details">
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

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {question.question_text}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label={question.question_type}
                                color="primary"
                                sx={{ mr: 1 }}
                            />
                            <Chip
                                label={`Difficulty: ${question.difficulty_level}`}
                                color="secondary"
                                sx={{ mr: 1 }}
                            />
                            <Chip
                                label={`Subject: ${question.subject_id}`}
                                variant="outlined"
                            />
                        </Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            Question Bank: {question.question_bank ? question.question_bank.title : `Bank ${question.question_bank_id}`}
                        </Typography>
                    </CardContent>
                </Card>

                <Typography variant="h6" gutterBottom>
                    Options
                </Typography>
                <Card>
                    <CardContent>
                        <List>
                            {question.options && question.options.map((option, index) => (
                                <ListItem key={option.id} divider>
                                    <ListItemIcon>
                                        {question.question_type === 'mcq' ? (
                                            option.is_correct ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <RadioButtonUncheckedIcon />
                                            )
                                        ) : (
                                            option.is_correct ? (
                                                <Checkbox checked color="success" />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon />
                                            )
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={option.option_text}
                                        secondary={option.is_correct ? 'Correct Answer' : ''}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </MainCard>
    );
};

export default QuestionDetail;