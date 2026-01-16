// src/views/teacher/QuestionBankDetail.jsx
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
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getQuestionBankWithQuestions, deleteQuestion } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const QuestionBankDetail = () => {
    const [questionBank, setQuestionBank] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchQuestionBank = async () => {
            try {
                setLoading(true);
                const response = await getQuestionBankWithQuestions(id);
                setQuestionBank(response.data);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch question bank details', { variant: 'error' });
                navigate('/dashboard/question-banks');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionBank();
    }, [enqueueSnackbar, id, navigate]);

    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteQuestion(questionId);
                setQuestionBank({
                    ...questionBank,
                    questions: questionBank.questions.filter(q => q.id !== questionId)
                });
                enqueueSnackbar('Question deleted successfully', { variant: 'success' });
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to delete question', { variant: 'error' });
            }
        }
    };

    const handleViewQuestion = (questionId) => {
        navigate(`/dashboard/questions/${questionId}`);
    };

    const handleEditQuestion = (questionId) => {
        navigate(`/dashboard/questions/${questionId}/edit`);
    };

    const handleCreateQuestion = () => {
        navigate(`/dashboard/questions/create?bankId=${id}`);
    };

    const handleBack = () => {
        navigate('/dashboard/question-banks');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!questionBank) {
        return (
            <MainCard title="Question Bank Not Found">
                <Typography variant="body1">
                    The question bank you're looking for doesn't exist or has been removed.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mt: 2 }}
                >
                    Back to Question Banks
                </Button>
            </MainCard>
        );
    }

    return (
        <MainCard title={questionBank.title}>
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

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {questionBank.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {questionBank.description}
                        </Typography>
                        <Chip
                            label={`Subject ${questionBank.subject_id}`}
                            color="primary"
                            sx={{ mr: 1 }}
                        />
                        <Chip
                            label={`${questionBank.questions ? questionBank.questions.length : 0} Questions`}
                            color="secondary"
                        />
                    </CardContent>
                </Card>

                <Typography variant="h6" gutterBottom>
                    Questions
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Question</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Difficulty</TableCell>
                                <TableCell>Options</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(!questionBank.questions || questionBank.questions.length === 0) ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body1">No questions found in this bank</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                questionBank.questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell>{question.question_text}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={question.question_type}
                                                color="primary"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={question.difficulty_level}
                                                color="secondary"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {question.options ? question.options.length : 0}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleViewQuestion(question.id)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleEditQuestion(question.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteQuestion(question.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16
                    }}
                    onClick={handleCreateQuestion}
                >
                    <AddIcon />
                </Fab>
            </Box>
        </MainCard>
    );
};

export default QuestionBankDetail;