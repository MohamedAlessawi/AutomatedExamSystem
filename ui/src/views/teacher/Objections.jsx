// src/views/teacher/Objections.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// material-ui
import {
    Box,
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
import { getObjections, updateObjection } from '../../services/authService';

// assets
import EditIcon from '@mui/icons-material/Edit';

const Objections = () => {
    const [objections, setObjections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedObjection, setSelectedObjection] = useState(null);
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchObjections = async () => {
            try {
                setLoading(true);
                const response = await getObjections();

                // The data is in response.data.data based on your API structure
                if (response.data && Array.isArray(response.data.data)) {
                    setObjections(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setObjections(response.data);
                } else {
                    setObjections([]);
                }

            } catch (error) {
                console.error('Error fetching objections:', error);
                enqueueSnackbar(error.message || 'Failed to fetch objections', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchObjections();
    }, [enqueueSnackbar]);

    const handleUpdate = async () => {
        if (!selectedObjection) return;

        try {
            await updateObjection(selectedObjection.id, {
                status: status,
                teacher_response: response
            });

            // Update the objection in the list
            setObjections(objections.map(obj =>
                obj.id === selectedObjection.id
                    ? {
                        ...obj,
                        status: status,
                        teacher_response: response,
                        updated_at: new Date().toISOString()
                    }
                    : obj
            ));

            enqueueSnackbar('Objection updated successfully', { variant: 'success' });
            handleCloseDialog();
        } catch (error) {
            console.error('Error updating objection:', error);
            enqueueSnackbar(error.message || 'Failed to update objection', { variant: 'error' });
        }
    };

    const handleOpenDialog = (objection) => {
        setSelectedObjection(objection);
        setResponse(objection.teacher_response || '');
        setStatus(objection.status || 'pending');
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedObjection(null);
        setResponse('');
        setStatus('');
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleResponseChange = (e) => {
        setResponse(e.target.value);
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MainCard title="Student Objections">
            <Box sx={{ width: '100%' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student</TableCell>
                                <TableCell>Exam</TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell>Objection</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Submitted At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {objections.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body1">No objections found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                objections.map((objection) => (
                                    <TableRow key={objection.id}>
                                        <TableCell>
                                            {objection.student?.full_name || 'Unknown Student'}
                                        </TableCell>
                                        <TableCell>
                                            {objection.exam_assignment?.exam?.title || 'Unknown Exam'}
                                        </TableCell>
                                        <TableCell>
                                            {objection.question?.question_text || 'No question text'}
                                        </TableCell>
                                        <TableCell>
                                            {objection.message || 'No objection text'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={objection.status || 'pending'}
                                                color={
                                                    objection.status === 'accepted' ? 'success' :
                                                        objection.status === 'rejected' ? 'error' :
                                                            'warning'
                                                }
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(objection.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog(objection)}
                                                disabled={objection.status === 'accepted' || objection.status === 'rejected'}
                                                title="Respond to objection"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Respond to Objection</DialogTitle>
                    <DialogContent>
                        {selectedObjection && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Student:</strong> {selectedObjection.student?.full_name || 'Unknown Student'}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Exam:</strong> {selectedObjection.exam_assignment?.exam?.title || 'Unknown Exam'}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Question:</strong> {selectedObjection.question?.question_text || 'No question text'}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Student's Objection:</strong>
                                </Typography>
                                <Box sx={{
                                    p: 2,
                                    bgcolor: 'grey.50',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    mb: 2
                                }}>
                                    {selectedObjection.message || 'No objection text'}
                                </Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                    Submitted on: {formatDate(selectedObjection.created_at)}
                                </Typography>

                                <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                                    <InputLabel id="status-select-label">Status *</InputLabel>
                                    <Select
                                        labelId="status-select-label"
                                        value={status}
                                        onChange={handleStatusChange}
                                        label="Status *"
                                        required
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="accepted">Accepted</MenuItem>
                                        <MenuItem value="rejected">Rejected</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Your Response *"
                                    multiline
                                    rows={4}
                                    value={response}
                                    onChange={handleResponseChange}
                                    sx={{ mt: 2 }}
                                    placeholder="Enter your detailed response to the student..."
                                    required
                                    helperText="Explain your decision to the student"
                                />
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                        <Button
                            onClick={handleUpdate}
                            variant="contained"
                            disabled={!status || !response.trim()}
                        >
                            Submit Response
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </MainCard>
    );
};

export default Objections;