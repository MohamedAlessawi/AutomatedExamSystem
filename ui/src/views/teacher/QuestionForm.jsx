// src/views/teacher/QuestionForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// material-ui
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Grid
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { createQuestion, updateQuestion, getQuestionById, getQuestionBanks } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const QuestionForm = () => {
    const [formData, setFormData] = useState({
        question_bank_id: '',
        subject_id: '',
        question_type: 'mcq',
        question_text: '',
        difficulty_level: 1,
        options: [
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false }
        ]
    });
    const [questionBanks, setQuestionBanks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [searchParams] = useSearchParams();
    const questionId = searchParams.get('id');
    const bankId = searchParams.get('bankId');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Mock subjects data - in a real app, you'd fetch this from an API
        setSubjects([
            { id: 1, name: 'Mathematics' },
            { id: 2, name: 'Science' },
            { id: 3, name: 'English' },
            { id: 4, name: 'History' }
        ]);

        const fetchQuestionBanks = async () => {
            try {
                const response = await getQuestionBanks();
                setQuestionBanks(response.data);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch question banks', { variant: 'error' });
            }
        };

        fetchQuestionBanks();

        // If questionId is provided, we're in edit mode
        if (questionId) {
            setIsEdit(true);
            const fetchQuestion = async () => {
                try {
                    setLoading(true);
                    const response = await getQuestionById(questionId);
                    const question = response.data;

                    // Transform the options data
                    const options = question.options.map(option => ({
                        text: option.option_text,
                        is_correct: !!option.is_correct
                    }));

                    setFormData({
                        question_bank_id: question.question_bank_id,
                        subject_id: question.subject_id,
                        question_type: question.question_type,
                        question_text: question.question_text,
                        difficulty_level: question.difficulty_level,
                        options: options.length > 0 ? options : [
                            { text: '', is_correct: false },
                            { text: '', is_correct: false },
                            { text: '', is_correct: false },
                            { text: '', is_correct: false }
                        ]
                    });
                } catch (error) {
                    enqueueSnackbar(error.message || 'Failed to fetch question', { variant: 'error' });
                    navigate('/dashboard/questions');
                } finally {
                    setLoading(false);
                }
            };

            fetchQuestion();
        } else if (bankId) {
            // Set the bank ID if provided in URL params
            setFormData(prev => ({
                ...prev,
                question_bank_id: bankId
            }));
        }
    }, [questionId, bankId, enqueueSnackbar, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...formData.options];
        newOptions[index][field] = value;

        // For MCQ questions, only one option can be correct
        if (formData.question_type === 'mcq' && field === 'is_correct' && value === true) {
            newOptions.forEach((option, i) => {
                if (i !== index) {
                    option.is_correct = false;
                }
            });
        }

        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { text: '', is_correct: false }]
        }));
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = [...formData.options];
            newOptions.splice(index, 1);
            setFormData(prev => ({
                ...prev,
                options: newOptions
            }));
        } else {
            enqueueSnackbar('A question must have at least 2 options', { variant: 'warning' });
        }
    };

    const handleQuestionBankChange = (e) => {
        const bankId = e.target.value;
        const selectedBank = questionBanks.find(bank => bank.id === bankId);

        setFormData(prev => ({
            ...prev,
            question_bank_id: bankId,
            subject_id: selectedBank ? selectedBank.subject_id : prev.subject_id
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.question_text.trim()) {
            enqueueSnackbar('Question text is required', { variant: 'error' });
            return;
        }

        const validOptions = formData.options.filter(option => option.text.trim());
        if (validOptions.length < 2) {
            enqueueSnackbar('A question must have at least 2 valid options', { variant: 'error' });
            return;
        }

        const hasCorrectOption = validOptions.some(option => option.is_correct);
        if (!hasCorrectOption) {
            enqueueSnackbar('At least one option must be marked as correct', { variant: 'error' });
            return;
        }

        try {
            setLoading(true);

            // Prepare data for API
            const apiData = {
                question_bank_id: formData.question_bank_id,
                subject_id: formData.subject_id,
                question_type: formData.question_type,
                question_text: formData.question_text,
                difficulty_level: formData.difficulty_level,
                options: validOptions.map(option => ({
                    text: option.text,
                    is_correct: option.is_correct
                }))
            };

            if (isEdit) {
                await updateQuestion(questionId, apiData);
                enqueueSnackbar('Question updated successfully', { variant: 'success' });
            } else {
                await createQuestion(apiData);
                enqueueSnackbar('Question created successfully', { variant: 'success' });
            }

            navigate('/dashboard/questions');
        } catch (error) {
            enqueueSnackbar(error.message || `Failed to ${isEdit ? 'update' : 'create'} question`, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/dashboard/questions');
    };

    return (
        <MainCard title={isEdit ? 'Edit Question' : 'Create Question'}>
            <Box sx={{ width: '100%' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="bank-select-label">Question Bank</InputLabel>
                                            <Select
                                                labelId="bank-select-label"
                                                value={formData.question_bank_id}
                                                onChange={handleQuestionBankChange}
                                                required
                                            >
                                                {questionBanks.map(bank => (
                                                    <MenuItem key={bank.id} value={bank.id}>
                                                        {bank.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="subject-select-label">Subject</InputLabel>
                                            <Select
                                                labelId="subject-select-label"
                                                name="subject_id"
                                                value={formData.subject_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                {subjects.map(subject => (
                                                    <MenuItem key={subject.id} value={subject.id}>
                                                        {subject.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="type-select-label">Question Type</InputLabel>
                                            <Select
                                                labelId="type-select-label"
                                                name="question_type"
                                                value={formData.question_type}
                                                onChange={handleChange}
                                                required
                                            >
                                                <MenuItem value="mcq">Multiple Choice</MenuItem>
                                                {/*<MenuItem value="checkbox">Multiple Answer</MenuItem>*/}
                                                <MenuItem value="true_false">True/False</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="difficulty-select-label">Difficulty Level</InputLabel>
                                            <Select
                                                labelId="difficulty-select-label"
                                                name="difficulty_level"
                                                value={formData.difficulty_level}
                                                onChange={handleChange}
                                                required
                                            >
                                                <MenuItem value={1}>Easy</MenuItem>
                                                <MenuItem value={2}>Medium</MenuItem>
                                                <MenuItem value={3}>Hard</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Question"
                                            name="question_text"
                                            value={formData.question_text}
                                            onChange={handleChange}
                                            required
                                            multiline
                                            rows={3}
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" gutterBottom>
                                    Options
                                </Typography>

                                {formData.options.map((option, index) => (
                                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                fullWidth
                                                label={`Option ${index + 1}`}
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={2}>
                                            <FormControl fullWidth>
                                                <InputLabel id={`correct-label-${index}`}>Correct</InputLabel>
                                                <Select
                                                    labelId={`correct-label-${index}`}
                                                    value={option.is_correct ? 'true' : 'false'}
                                                    onChange={(e) => handleOptionChange(index, 'is_correct', e.target.value === 'true')}
                                                >
                                                    <MenuItem value="true">Yes</MenuItem>
                                                    <MenuItem value="false">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={2}>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeOption(index)}
                                                disabled={formData.options.length <= 2}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}

                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={addOption}
                                    sx={{ mb: 2 }}
                                >
                                    Add Option
                                </Button>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={loading}
                                    >
                                        {isEdit ? 'Update' : 'Create'}
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </MainCard>
    );
};

export default QuestionForm;