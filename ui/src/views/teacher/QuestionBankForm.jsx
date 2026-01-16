// src/views/teacher/QuestionBankForm.jsx
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
    MenuItem
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { createQuestionBank, updateQuestionBank, getQuestionBankWithQuestions } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const QuestionBankForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject_id: ''
    });
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [searchParams] = useSearchParams();
    const bankId = searchParams.get('id');
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

        // If bankId is provided, we're in edit mode
        if (bankId) {
            setIsEdit(true);
            const fetchQuestionBank = async () => {
                try {
                    setLoading(true);
                    const response = await getQuestionBankWithQuestions(bankId);
                    const bank = response.data;
                    setFormData({
                        title: bank.title,
                        description: bank.description,
                        subject_id: bank.subject_id
                    });
                } catch (error) {
                    enqueueSnackbar(error.message || 'Failed to fetch question bank', { variant: 'error' });
                    navigate('/dashboard/question-banks');
                } finally {
                    setLoading(false);
                }
            };

            fetchQuestionBank();
        }
    }, [bankId, enqueueSnackbar, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (isEdit) {
                await updateQuestionBank(bankId, formData);
                enqueueSnackbar('Question bank updated successfully', { variant: 'success' });
            } else {
                await createQuestionBank(formData);
                enqueueSnackbar('Question bank created successfully', { variant: 'success' });
            }

            navigate('/dashboard/question-banks');
        } catch (error) {
            enqueueSnackbar(error.message || `Failed to ${isEdit ? 'update' : 'create'} question bank`, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/dashboard/question-banks');
    };

    return (
        <MainCard title={isEdit ? 'Edit Question Bank' : 'Create Question Bank'}>
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
                                <TextField
                                    fullWidth
                                    label="Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    sx={{ mb: 2 }}
                                />
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

export default QuestionBankForm;