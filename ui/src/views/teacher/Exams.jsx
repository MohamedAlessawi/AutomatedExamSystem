// src/views/teacher/Exams.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// material-ui
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
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
    Chip
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getExams, deleteExam } from '../../services/authService';

// assets
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true);
                const response = await getExams();
                setExams(response.data);
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to fetch exams', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [enqueueSnackbar]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await deleteExam(id);
                setExams(exams.filter(exam => exam.id !== id));
                enqueueSnackbar('Exam deleted successfully', { variant: 'success' });
            } catch (error) {
                enqueueSnackbar(error.message || 'Failed to delete exam', { variant: 'error' });
            }
        }
    };

    const handleView = (id) => {
        navigate(`/dashboard/exams/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/exams/${id}/edit`);
    };

    const handleCreate = () => {
        navigate('/dashboard/exams/create');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MainCard title="Exams">
            <Box sx={{ width: '100%' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exams.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1">No exams found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                exams.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell>{exam.title}</TableCell>
                                        <TableCell>{exam.description}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`Subject ${exam.subject_id}`}
                                                color="primary"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{exam.duration_minutes} minutes</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={exam.status}
                                                color={exam.status === 'published' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleView(exam.id)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleEdit(exam.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(exam.id)}>
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

export default Exams;