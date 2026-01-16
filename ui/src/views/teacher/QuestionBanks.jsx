// src/views/teacher/QuestionBanks.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getQuestionBanks, deleteQuestionBank, updateQuestionBank } from '../../services/authService';

// assets
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const QuestionBanks = () => {
    const [questionBanks, setQuestionBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject_id: ''
    });
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchQuestionBanks = async () => {
            try {
                setLoading(true);
                const response = await getQuestionBanks();
                setQuestionBanks(response.data);

                // Extract unique subjects from question banks
                const uniqueSubjects = [...new Set(response.data.map(bank => bank.subject_id))];
                setSubjects(uniqueSubjects);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch question banks', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionBanks();
    }, [enqueueSnackbar]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question bank? All questions in this bank will also be deleted.')) {
            try {
                await deleteQuestionBank(id);
                setQuestionBanks(questionBanks.filter(bank => bank.id !== id));
                enqueueSnackbar('Question bank deleted successfully', { variant: 'success' });
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to delete question bank', { variant: 'error' });
            }
        }
    };

    const handleView = (id) => {
        navigate(`/dashboard/question-banks/${id}`);
    };

    const handleEdit = (bank) => {
        setSelectedBank(bank);
        setFormData({
            title: bank.title,
            description: bank.description,
            subject_id: bank.subject_id
        });
        setEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await updateQuestionBank(selectedBank.id, formData);
            setQuestionBanks(questionBanks.map(bank =>
                bank.id === selectedBank.id ? { ...bank, ...formData } : bank
            ));
            enqueueSnackbar('Question bank updated successfully', { variant: 'success' });
            setEditDialogOpen(false);
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to update question bank', { variant: 'error' });
        }
    };

    const handleCreate = () => {
        navigate('/dashboard/question-banks/create');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
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
        <MainCard title="Question Banks">
            <Box sx={{ width: '100%' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Questions Count</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questionBanks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1">No question banks found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                questionBanks.map((bank) => (
                                    <TableRow key={bank.id}>
                                        <TableCell>{bank.title}</TableCell>
                                        <TableCell>{bank.description}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`Subject ${bank.subject_id}`}
                                                color="primary"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{bank.questions_count || 0}</TableCell>
                                        <TableCell>{new Date(bank.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleView(bank.id)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleEdit(bank)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(bank.id)}>
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

                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                    <DialogTitle>Edit Question Bank</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            sx={{ mt: 2 }}
                            multiline
                            rows={3}
                        />
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="subject-select-label">Subject</InputLabel>
                            <Select
                                labelId="subject-select-label"
                                name="subject_id"
                                value={formData.subject_id}
                                onChange={handleFormChange}
                            >
                                {subjects.map(subject => (
                                    <MenuItem key={subject} value={subject}>
                                        Subject {subject}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} variant="contained">Update</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </MainCard>
    );
};

export default QuestionBanks;