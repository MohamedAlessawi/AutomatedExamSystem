// src/views/teacher/ExamForm.jsx
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
    Checkbox,
    ListItemText,
    Grid,
    Divider,
    Chip
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { createExam, updateExam, getExamById, getQuestionBanks, getQuestions, getStudentsForTeacher } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ExamForm = () => {
    const [formData, setFormData] = useState({
        subject_id: '',
        title: '',
        description: '',
        duration_minutes: 60,
        question_ids: [],
        student_ids: []
    });
    const [questionBanks, setQuestionBanks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedBank, setSelectedBank] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [searchParams] = useSearchParams();
    const examId = searchParams.get('id');
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

        const fetchData = async () => {
            try {
                // Fetch question banks
                const banksResponse = await getQuestionBanks();
                setQuestionBanks(banksResponse.data);

                // Fetch questions
                const questionsResponse = await getQuestions();
                setQuestions(questionsResponse.data);

                // Fetch students
                const studentsResponse = await getStudentsForTeacher();
                setStudents(studentsResponse.data);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch data', { variant: 'error' });
            }
        };

        fetchData();

        // If examId is provided, we're in edit mode
        if (examId) {
            setIsEdit(true);
            const fetchExam = async () => {
                try {
                    setLoading(true);
                    const response = await getExamById(examId);
                    const exam = response.data;

                    setFormData({
                        subject_id: exam.subject_id,
                        title: exam.title,
                        description: exam.description,
                        duration_minutes: exam.duration_minutes,
                        question_ids: exam.questions ? exam.questions.map(q => q.id) : [],
                        student_ids: exam.students ? exam.students.map(s => s.id) : []
                    });
                } catch (error) {
                    enqueueSnackbar(error.message || 'Failed to fetch exam', { variant: 'error' });
                    navigate('/dashboard/exams');
                } finally {
                    setLoading(false);
                }
            };

            fetchExam();
        }
    }, [examId, enqueueSnackbar, navigate]);

    useEffect(() => {
        // Fetch questions when a bank is selected
        const fetchQuestionsByBank = async () => {
            if (selectedBank) {
                try {
                    const response = await getQuestions({ question_bank_id: selectedBank });
                    setQuestions(response.data);
                } catch (error) {
                    enqueueSnackbar(error.message || 'Failed to fetch questions', { variant: 'error' });
                }
            } else {
                // Fetch all questions if no bank is selected
                try {
                    const response = await getQuestions();
                    setQuestions(response.data);
                } catch (error) {
                    enqueueSnackbar(error.message || 'Failed to fetch questions', { variant: 'error' });
                }
            }
        };

        fetchQuestionsByBank();
    }, [selectedBank, enqueueSnackbar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuestionChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData(prev => ({
            ...prev,
            question_ids: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleStudentChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData(prev => ({
            ...prev,
            student_ids: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleBankChange = (event) => {
        setSelectedBank(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.title.trim()) {
            enqueueSnackbar('Exam title is required', { variant: 'error' });
            return;
        }

        if (formData.question_ids.length === 0) {
            enqueueSnackbar('At least one question must be selected', { variant: 'error' });
            return;
        }

        if (formData.student_ids.length === 0) {
            enqueueSnackbar('At least one student must be assigned', { variant: 'error' });
            return;
        }

        try {
            setLoading(true);

            if (isEdit) {
                await updateExam(examId, formData);
                enqueueSnackbar('Exam updated successfully', { variant: 'success' });
            } else {
                await createExam(formData);
                enqueueSnackbar('Exam created successfully', { variant: 'success' });
            }

            navigate('/dashboard/exams');
        } catch (error) {
            enqueueSnackbar(error.message || `Failed to ${isEdit ? 'update' : 'create'} exam`, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/dashboard/exams');
    };

    const getQuestionText = (id) => {
        const question = questions.find(q => q.id === id);
        return question ? question.question_text : '';
    };

    const getStudentName = (id) => {
        const student = students.find(s => s.id === id);
        return student ? student.full_name : '';
    };

    return (
        <MainCard title={isEdit ? 'Edit Exam' : 'Create Exam'}>
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
                                        <TextField
                                            fullWidth
                                            label="Duration (minutes)"
                                            name="duration_minutes"
                                            type="number"
                                            value={formData.duration_minutes}
                                            onChange={handleChange}
                                            required
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            multiline
                                            rows={3}
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" gutterBottom>
                                    Select Questions
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="bank-filter-label">Filter by Question Bank</InputLabel>
                                            <Select
                                                labelId="bank-filter-label"
                                                value={selectedBank}
                                                onChange={handleBankChange}
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
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="question-select-label">Questions</InputLabel>
                                            <Select
                                                labelId="question-select-label"
                                                multiple
                                                value={formData.question_ids}
                                                onChange={handleQuestionChange}
                                                inputProps={{ 'aria-label': 'Select questions' }}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={`Q${value}`} size="small" />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                {questions.map((question) => (
                                                    <MenuItem key={question.id} value={question.id}>
                                                        <Checkbox checked={formData.question_ids.indexOf(question.id) > -1} />
                                                        <ListItemText primary={`${question.question_text.substring(0, 50)}...`} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                {formData.question_ids.length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Selected Questions:
                                        </Typography>
                                        {formData.question_ids.map(id => (
                                            <Chip
                                                key={id}
                                                label={getQuestionText(id).substring(0, 30) + '...'}
                                                sx={{ m: 0.5 }}
                                            />
                                        ))}
                                    </Box>
                                )}

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" gutterBottom>
                                    Assign Students
                                </Typography>

                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="student-select-label">Students</InputLabel>
                                    <Select
                                        labelId="student-select-label"
                                        multiple
                                        value={formData.student_ids}
                                        onChange={handleStudentChange}
                                        inputProps={{ 'aria-label': 'Select students' }}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={getStudentName(value)} size="small" />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {students.map((student) => (
                                            <MenuItem key={student.id} value={student.id}>
                                                <Checkbox checked={formData.student_ids.indexOf(student.id) > -1} />
                                                <ListItemText primary={student.full_name} secondary={student.email} />
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

export default ExamForm;