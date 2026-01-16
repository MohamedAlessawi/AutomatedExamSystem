// src/views/student/ExamHistory.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// material-ui
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Checkbox,
  ListItemIcon,
  FormControlLabel,
  Switch
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getExamHistory, getExamDetails, submitObjection } from '../../services/authService';

// assets
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ExamHistory = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    status: '',
    dateRange: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // State for objection functionality
  const [selectedExam, setSelectedExam] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [objectionDialogOpen, setObjectionDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [objectionMessage, setObjectionMessage] = useState('');
  const [loadingExamDetails, setLoadingExamDetails] = useState(false);
  const [submittingObjection, setSubmittingObjection] = useState(false);
  const [bulkMessageMode, setBulkMessageMode] = useState(false);
  const [individualMessages, setIndividualMessages] = useState({});

  // Use a ref to store the selected exam assignment ID to prevent it from being lost
  const selectedExamIdRef = useRef(null);

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        setLoading(true);
        const response = await getExamHistory(filters);
        setExams(response.data);
      } catch (error) {
        enqueueSnackbar(error.message || 'Failed to fetch exam history', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, [enqueueSnackbar, filters]);

  const handleViewResults = (examId) => {
    navigate(`/dashboard/student/exam-results/${examId}`);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'submitted':
        return <Chip label="Submitted" color="info" />;
      case 'graded':
        return <Chip label="Graded" color="success" />;
      default:
        return <Chip label={status} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to safely get subject name
  const getSubjectName = (examData) => {
    if (!examData) return 'N/A';

    // Check multiple possible structures
    if (examData.exam?.subject?.name) {
      return examData.exam.subject.name;
    } else if (examData.subject?.name) {
      return examData.subject.name;
    } else if (examData.exam?.subject_name) {
      return examData.exam.subject_name;
    } else if (examData.subject_name) {
      return examData.subject_name;
    }
    return 'N/A';
  };

  // Helper function to safely get exam title
  const getExamTitle = (examData) => {
    if (!examData) return 'N/A';

    if (examData.exam?.title) {
      return examData.exam.title;
    } else if (examData.title) {
      return examData.title;
    }
    return 'N/A';
  };

  // Helper function to safely get total marks
  const getTotalMarks = (examData) => {
    if (!examData) return 'N/A';

    if (examData.exam?.total_marks) {
      return examData.exam.total_marks;
    } else if (examData.total_marks) {
      return examData.total_marks;
    }
    return 'N/A';
  };

  // Objection functions
  const handleObjectionClick = (event, examAssignment) => {
    setAnchorEl(event.currentTarget);
    setSelectedExam(examAssignment);
    selectedExamIdRef.current = examAssignment.id; // Store in ref
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedExam here, just the anchor
  };

  const handleFetchExamDetails = async () => {
    const examIdToFetch = selectedExam?.id || selectedExamIdRef.current;
    if (!examIdToFetch) return;

    try {
      setLoadingExamDetails(true);
      const response = await getExamDetails(examIdToFetch);
      console.log('Exam details response:', response);

      if (response.data) {
        setExamDetails(response.data);
      } else {
        setExamDetails(response);
      }

      handleMenuClose();
      setObjectionDialogOpen(true);
    } catch (error) {
      console.error('Error fetching exam details:', error);
      enqueueSnackbar(error.message || 'Failed to fetch exam details', { variant: 'error' });
      handleMenuClose();
    } finally {
      setLoadingExamDetails(false);
    }
  };

  const handleCloseObjectionDialog = () => {
    setObjectionDialogOpen(false);
    setExamDetails(null);
    setSelectedQuestions([]);
    setObjectionMessage('');
    setIndividualMessages({});
    setBulkMessageMode(false);
    setSelectedExam(null);
    selectedExamIdRef.current = null;
  };

  const handleQuestionToggle = (question) => {
    setSelectedQuestions(prev => {
      const exists = prev.find(q => q.id === question.id);
      if (exists) {
        // Remove question
        const newSelection = prev.filter(q => q.id !== question.id);
        // Also remove individual message if exists
        if (individualMessages[question.id]) {
          const newMessages = { ...individualMessages };
          delete newMessages[question.id];
          setIndividualMessages(newMessages);
        }
        return newSelection;
      } else {
        // Add question
        return [...prev, question];
      }
    });
  };

  const handleSelectAllQuestions = () => {
    const questions = getQuestions();
    if (selectedQuestions.length === questions.length) {
      // Deselect all
      setSelectedQuestions([]);
      setIndividualMessages({});
    } else {
      // Select all
      setSelectedQuestions([...questions]);
    }
  };

  const handleIndividualMessageChange = (questionId, message) => {
    setIndividualMessages(prev => ({
      ...prev,
      [questionId]: message
    }));
  };

  const handleSubmitObjection = async () => {
    const examAssignmentId = selectedExam?.id || selectedExamIdRef.current;

    if (!examAssignmentId) {
      enqueueSnackbar('No exam selected', { variant: 'error' });
      return;
    }

    if (selectedQuestions.length === 0) {
      enqueueSnackbar('Please select at least one question', { variant: 'warning' });
      return;
    }

    if (bulkMessageMode && !objectionMessage.trim()) {
      enqueueSnackbar('Please provide a message for your objections', { variant: 'warning' });
      return;
    }

    // For individual messages mode, check each selected question has a message
    if (!bulkMessageMode) {
      const missingMessages = selectedQuestions.filter(q => !individualMessages[q.id]?.trim());
      if (missingMessages.length > 0) {
        enqueueSnackbar(`Please provide messages for ${missingMessages.length} selected question(s)`, { variant: 'warning' });
        return;
      }
    }

    try {
      setSubmittingObjection(true);
      const results = [];
      const errors = [];

      // Submit objections for each selected question
      for (const question of selectedQuestions) {
        try {
          const objectionData = {
            exam_assignment_id: examAssignmentId,
            question_id: question.id,
            message: bulkMessageMode
                ? objectionMessage.trim()
                : (individualMessages[question.id] || '').trim()
          };

          console.log('Submitting objection for question:', question.id, objectionData);
          const response = await submitObjection(objectionData);
          results.push({
            questionId: question.id,
            questionText: question.question_text,
            success: true,
            data: response
          });
        } catch (error) {
          console.error('Error submitting objection for question:', question.id, error);
          errors.push({
            questionId: question.id,
            questionText: question.question_text,
            error: error.message || 'Failed to submit objection'
          });
        }
      }

      // Show results summary
      if (errors.length === 0) {
        enqueueSnackbar(`Successfully submitted ${results.length} objection(s)`, {
          variant: 'success',
          autoHideDuration: 3000
        });
        handleCloseObjectionDialog();
      } else if (results.length > 0) {
        enqueueSnackbar(
            `Submitted ${results.length} objection(s) successfully, but ${errors.length} failed. Check console for details.`,
            {
              variant: 'warning',
              autoHideDuration: 4000
            }
        );
        console.log('Successful submissions:', results);
        console.log('Failed submissions:', errors);
      } else {
        enqueueSnackbar(
            `Failed to submit all ${errors.length} objections. Please try again.`,
            {
              variant: 'error',
              autoHideDuration: 4000
            }
        );
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      enqueueSnackbar('An unexpected error occurred. Please try again.', { variant: 'error' });
    } finally {
      setSubmittingObjection(false);
    }
  };

  // Helper function to get student's answer for a question
  const getStudentAnswer = (questionId) => {
    if (!examDetails?.answers) return null;
    return examDetails.answers.find(answer => answer.question_id === questionId);
  };

  // Helper function to get correct option
  const getCorrectOption = (question) => {
    if (!question?.options) return 'N/A';
    const correctOption = question.options.find(option => option.is_correct === 1);
    return correctOption ? correctOption.option_text : 'N/A';
  };

  // Helper function to get student's selected option
  const getStudentOption = (questionId) => {
    const answer = getStudentAnswer(questionId);
    if (!answer) return 'N/A';

    const questions = getQuestions();
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.options) return 'N/A';

    const selectedOption = question.options.find(option => option.id === answer.selected_option_id);
    return selectedOption ? selectedOption.option_text : 'N/A';
  };

  // Get questions from examDetails
  const getQuestions = () => {
    if (!examDetails) return [];

    if (examDetails.exam?.questions) {
      return examDetails.exam.questions;
    } else if (examDetails.questions) {
      return examDetails.questions;
    }
    return [];
  };

  // Check if a question is selected
  const isQuestionSelected = (questionId) => {
    return selectedQuestions.some(q => q.id === questionId);
  };

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
    );
  }

  return (
      <MainCard title="Exam History">
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="subject-filter-label">Subject</InputLabel>
                <Select
                    labelId="subject-filter-label"
                    name="subject"
                    value={filters.subject}
                    onChange={handleFilterChange}
                    label="Subject"
                >
                  <MenuItem value="">All Subjects</MenuItem>
                  <MenuItem value="1">Mathematics</MenuItem>
                  <MenuItem value="2">Science</MenuItem>
                  <MenuItem value="3">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                    labelId="status-filter-label"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="graded">Graded</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                  fullWidth
                  label="Search"
                  name="search"
                  value={filters.search || ''}
                  onChange={handleFilterChange}
                  InputProps={{
                    startAdornment: <SearchIcon />
                  }}
              />
            </Grid>
          </Grid>

          {exams.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="textSecondary">
                  No exam history found.
                </Typography>
              </Box>
          ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Exam</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((examAssignment) => (
                          <TableRow key={examAssignment.id}>
                            <TableCell>{getExamTitle(examAssignment)}</TableCell>
                            <TableCell>{getSubjectName(examAssignment)}</TableCell>
                            <TableCell>
                              {examAssignment.score ?
                                  `${examAssignment.score}/${getTotalMarks(examAssignment)}` :
                                  'Not graded'
                              }
                            </TableCell>
                            <TableCell>{getStatusChip(examAssignment.status)}</TableCell>
                            <TableCell>{formatDate(examAssignment.submitted_at)}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => handleViewResults(examAssignment.id)}
                                    size="small"
                                >
                                  View
                                </Button>
                                {examAssignment.status === 'graded' && (
                                    <>
                                      <IconButton
                                          size="small"
                                          onClick={(e) => handleObjectionClick(e, examAssignment)}
                                          aria-label="raise objection"
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                      <Menu
                                          anchorEl={anchorEl}
                                          open={Boolean(anchorEl && selectedExam?.id === examAssignment.id)}
                                          onClose={handleMenuClose}
                                      >
                                        <MenuItem
                                            onClick={handleFetchExamDetails}
                                            disabled={loadingExamDetails}
                                        >
                                          {loadingExamDetails ? (
                                              <CircularProgress size={20} />
                                          ) : (
                                              <>
                                                <QuestionAnswerIcon sx={{ mr: 1 }} />
                                                Raise Objection
                                              </>
                                          )}
                                        </MenuItem>
                                      </Menu>
                                    </>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={exams.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
          )}
        </Box>

        {/* Objection Dialog */}
        <Dialog
            open={objectionDialogOpen}
            onClose={handleCloseObjectionDialog}
            maxWidth="md"
            fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <QuestionAnswerIcon />
              Raise Objection
            </Box>
            <Typography variant="body2" color="textSecondary">
              {getExamTitle(examDetails || selectedExam)} • {getSubjectName(examDetails || selectedExam)}
            </Typography>
          </DialogTitle>

          <DialogContent>
            {examDetails ? (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Select question(s) to raise objection
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button
                          size="small"
                          onClick={handleSelectAllQuestions}
                          disabled={getQuestions().length === 0}
                      >
                        {selectedQuestions.length === getQuestions().length ? 'Deselect All' : 'Select All'}
                      </Button>
                      <FormControlLabel
                          control={
                            <Switch
                                checked={bulkMessageMode}
                                onChange={(e) => setBulkMessageMode(e.target.checked)}
                                size="small"
                            />
                          }
                          label="Same message for all"
                      />
                    </Box>
                  </Box>

                  {getQuestions().length === 0 ? (
                      <Typography color="textSecondary" sx={{ py: 2 }}>
                        No questions found for this exam.
                      </Typography>
                  ) : (
                      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {getQuestions().map((question, index) => {
                          const studentAnswer = getStudentAnswer(question.id);
                          const isSelected = isQuestionSelected(question.id);

                          return (
                              <div key={question.id}>
                                <ListItem
                                    button
                                    onClick={() => handleQuestionToggle(question)}
                                    sx={{
                                      border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                      borderRadius: 1,
                                      mb: 1,
                                      backgroundColor: isSelected ? 'action.selected' : 'background.paper',
                                      alignItems: 'flex-start'
                                    }}
                                >
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Checkbox
                                        edge="start"
                                        checked={isSelected}
                                        tabIndex={-1}
                                        disableRipple
                                        sx={{ padding: '4px' }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                      primary={
                                        <Typography variant="subtitle1" sx={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                                          Q{index + 1}: {question.question_text || 'Question text not available'}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box sx={{ mt: 1 }}>
                                          <Typography variant="body2" color="textSecondary">
                                            <strong>Your Answer:</strong> {getStudentOption(question.id)}
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary">
                                            <strong>Correct Answer:</strong> {getCorrectOption(question)}
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary">
                                            <strong>Marks:</strong> {studentAnswer?.mark_obtained || '0'} / {question.pivot?.mark || 'N/A'}
                                          </Typography>
                                          <Typography variant="body2" color={studentAnswer?.is_correct === 1 ? 'success.main' : 'error.main'}>
                                            {studentAnswer?.is_correct === 1 ? '✓ Correct' : '✗ Incorrect'}
                                          </Typography>

                                          {/* Individual message input */}
                                          {isSelected && !bulkMessageMode && (
                                              <TextField
                                                  fullWidth
                                                  size="small"
                                                  margin="dense"
                                                  label="Objection message for this question"
                                                  value={individualMessages[question.id] || ''}
                                                  onChange={(e) => handleIndividualMessageChange(question.id, e.target.value)}
                                                  placeholder="Explain why you think this answer should be reconsidered..."
                                                  multiline
                                                  rows={2}
                                                  required
                                              />
                                          )}
                                        </Box>
                                      }
                                  />
                                </ListItem>
                                <Divider />
                              </div>
                          );
                        })}
                      </List>
                  )}

                  {/* Bulk message input */}
                  {bulkMessageMode && selectedQuestions.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Objection Message (will be used for all selected questions)"
                            value={objectionMessage}
                            onChange={(e) => setObjectionMessage(e.target.value)}
                            placeholder="Explain why you think your answers should be reconsidered..."
                            helperText={`This message will be sent for ${selectedQuestions.length} selected question(s)`}
                            required
                        />
                      </Box>
                  )}

                  {/* Summary of selected questions */}
                  {selectedQuestions.length > 0 && (
                      <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="body2">
                          <strong>Selected:</strong> {selectedQuestions.length} question(s)
                        </Typography>
                      </Box>
                  )}
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseObjectionDialog}>
              Cancel
            </Button>
            <Button
                onClick={handleSubmitObjection}
                variant="contained"
                disabled={
                    selectedQuestions.length === 0 ||
                    (bulkMessageMode && !objectionMessage.trim()) ||
                    (!bulkMessageMode && selectedQuestions.some(q => !individualMessages[q.id]?.trim()))
                }
                startIcon={submittingObjection ? <CircularProgress size={20} /> : null}
            >
              {submittingObjection ? 'Submitting...' : `Submit ${selectedQuestions.length} Objection(s)`}
            </Button>
          </DialogActions>
        </Dialog>
      </MainCard>
  );
};

export default ExamHistory;