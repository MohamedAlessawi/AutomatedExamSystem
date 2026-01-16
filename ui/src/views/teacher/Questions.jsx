// src/views/teacher/Questions.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    Fab,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getQuestions, deleteQuestion, getQuestionBanks } from '../../services/authService';

// assets
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [questionBanks, setQuestionBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        subject_id: '',
        question_bank_id: ''
    });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await getQuestions(filters);
                setQuestions(response.data);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch questions', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [enqueueSnackbar, filters]);

    useEffect(() => {
        const fetchQuestionBanks = async () => {
            try {
                const response = await getQuestionBanks();
                setQuestionBanks(response.data);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch question banks', { variant: 'error' });
            }
        };

        fetchQuestionBanks();
    }, [enqueueSnackbar]);

    // Set bank ID from URL params if provided
    useEffect(() => {
        const bankId = searchParams.get('bankId');
        if (bankId) {
            setFilters(prev => ({
                ...prev,
                question_bank_id: bankId
            }));
        }
    }, [searchParams]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteQuestion(id);
                setQuestions(questions.filter(question => question.id !== id));
                enqueueSnackbar('Question deleted successfully', { variant: 'success' });
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to delete question', { variant: 'error' });
            }
        }
    };

    const handleView = (id) => {
        navigate(`/dashboard/questions/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/questions/${id}/edit`);
    };

    const handleCreate = () => {
        const bankId = filters.question_bank_id;
        navigate(`/dashboard/questions/create${bankId ? `?bankId=${bankId}` : ''}`);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MainCard title="Questions">
            <Box sx={{ width: '100%' }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="subject-filter-label">Subject</InputLabel>
                            <Select
                                labelId="subject-filter-label"
                                name="subject_id"
                                value={filters.subject_id || ''}
                                onChange={handleFilterChange}
                                label="Subject"
                            >
                                <MenuItem value="">All Subjects</MenuItem>
                                <MenuItem value="1">Mathematics</MenuItem>
                                <MenuItem value="2">Science</MenuItem>
                                <MenuItem value="3">English</MenuItem>
                                <MenuItem value="4">History</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="bank-filter-label">Question Bank</InputLabel>
                            <Select
                                labelId="bank-filter-label"
                                name="question_bank_id"
                                value={filters.question_bank_id || ''}
                                onChange={handleFilterChange}
                                label="Question Bank"
                            >
                                <MenuItem value="">All Banks</MenuItem>
                                {questionBanks.map(bank => (
                                    <MenuItem key={bank.id} value={bank.id}>
                                        {bank.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Question</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Difficulty</TableCell>
                                <TableCell>Question Bank</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body1">No questions found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                questions.map((question) => (
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
                                            {question.question_bank ? question.question_bank.title : `Bank ${question.question_bank_id}`}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleView(question.id)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleEdit(question.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(question.id)}>
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
                    onClick={handleCreate}
                >
                    <AddIcon />
                </Fab>
            </Box>
        </MainCard>
    );
};

export default Questions;