// src/views/student/ExamTaking.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// material-ui
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Grid,
  Paper,
  IconButton
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getStudentExamById, submitExam } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TimerIcon from '@mui/icons-material/Timer';

const ExamTaking = () => {
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const hasSubmitted = useRef(false);

  // Extract questions from the nested exam object
  const questions = exam?.exam?.questions || exam?.questions || [];

  // Calculate total marks for progress
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).filter(key => {
    const answer = answers[key];
    return answer && (answer.selected_option_id || (answer.selected_option_ids && answer.selected_option_ids.length > 0));
  }).length;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await getStudentExamById(id);
        console.log('Exam data received:', response.data);

        // Check if response has the expected structure
        if (!response.data) {
          throw new Error('Invalid exam data structure');
        }

        setExam(response.data);

        // Initialize answers object with empty values
        const initialAnswers = {};
        const examQuestions = response.data.exam?.questions || response.data.questions || [];

        if (Array.isArray(examQuestions)) {
          examQuestions.forEach(question => {
            initialAnswers[question.id] = {
              selected_option_id: null,
              selected_option_ids: []
            };
          });
        }
        setAnswers(initialAnswers);

        // Set timer
        const durationInSeconds = (response.data.exam?.duration_minutes || response.data.duration_minutes || 0) * 60;
        setTimeRemaining(durationInSeconds);
        setExamStarted(false); // Exam hasn't started yet
      } catch (error) {
        console.error('Fetch exam error:', error);
        enqueueSnackbar(error.message || 'Failed to fetch exam', { variant: 'error' });
        navigate('/dashboard/student/current-exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id, navigate, enqueueSnackbar]);

  // Timer countdown - only run if exam has started
  useEffect(() => {
    if (!examStarted || timeRemaining <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Auto-submit when time runs out
          handleSubmitExam(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [examStarted, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer change for MCQ questions
  const handleMcqAnswerChange = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selected_option_id: optionId,
        selected_option_ids: [] // Clear checkbox answers when MCQ is selected
      }
    }));
  };

  // Handle answer change for True/False questions
  const handleTrueFalseAnswerChange = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selected_option_id: optionId,
        selected_option_ids: [] // Clear any other selections
      }
    }));
  };

  // Handle answer change for checkbox questions
  const handleCheckboxAnswerChange = (questionId, optionId, isChecked) => {
    setAnswers(prev => {
      const currentSelected = prev[questionId]?.selected_option_ids || [];
      let newSelected;

      if (isChecked) {
        newSelected = [...currentSelected, optionId];
      } else {
        newSelected = currentSelected.filter(id => id !== optionId);
      }

      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          selected_option_id: null, // Clear MCQ answer when checkbox is selected
          selected_option_ids: newSelected
        }
      };
    });
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Jump to a specific question
  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Start exam
  const handleStartExam = () => {
    setExamStarted(true);
  };

  // Open confirmation dialog
  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  // Close confirmation dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  // Submit exam
  const handleSubmitExam = useCallback(async (isAutoSubmit = false) => {
    // Prevent multiple submissions
    if (hasSubmitted.current) {
      return;
    }

    // Check if user has answered any questions
    const hasAnswers = Object.keys(answers).some(key => {
      const answer = answers[key];
      return answer && (answer.selected_option_id || (answer.selected_option_ids && answer.selected_option_ids.length > 0));
    });

    if (!hasAnswers && !isAutoSubmit) {
      enqueueSnackbar('Please answer at least one question before submitting', { variant: 'warning' });
      return;
    }

    try {
      setSubmitting(true);
      hasSubmitted.current = true; // Mark as submitted

      // Prepare answers for submission
      const formattedAnswers = [];

      Object.keys(answers).forEach(questionId => {
        const answer = answers[questionId];

        if (answer.selected_option_id) {
          // MCQ or True/False answer
          formattedAnswers.push({
            question_id: parseInt(questionId),
            selected_option_id: answer.selected_option_id
          });
        } else if (answer.selected_option_ids && answer.selected_option_ids.length > 0) {
          // Checkbox answers (multiple selections)
          answer.selected_option_ids.forEach(optionId => {
            formattedAnswers.push({
              question_id: parseInt(questionId),
              selected_option_id: optionId
            });
          });
        }
      });

      console.log('Submitting answers:', formattedAnswers);

      await submitExam({
        exam_assignment_id: parseInt(id),
        answers: formattedAnswers
      });

      enqueueSnackbar('Exam submitted successfully', { variant: 'success' });
      navigate('/dashboard/student/current-exams');
    } catch (error) {
      console.error('Exam submission error:', error);
      hasSubmitted.current = false; // Reset submission flag on error

      // Extract error message from response
      const errorMessage = error.errors ?
          Object.values(error.errors).flat().join(', ') :
          error.message ||
          'Failed to submit exam';

      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [answers, id, navigate, enqueueSnackbar]);

  // Get current question
  const currentQuestion = questions[currentQuestionIndex] || {};

  // Check if question has options
  const hasOptions = currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0;

  // Get true/false options if none exist
  const getTrueFalseOptions = () => {
    if (currentQuestion.question_type === 'true_false' && (!hasOptions || currentQuestion.options.length === 0)) {
      return [
        { id: 1, option_text: 'True' },
        { id: 2, option_text: 'False' }
      ];
    }
    return currentQuestion.options || [];
  };

  const optionsToDisplay = currentQuestion.question_type === 'true_false' ? getTrueFalseOptions() : currentQuestion.options;

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
    );
  }

  if (!exam) {
    return (
        <MainCard title="Exam Not Found">
          <Typography variant="body1">
            The exam you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
              variant="contained"
              onClick={() => navigate('/dashboard/student/current-exams')}
              sx={{ mt: 2 }}
          >
            Back to Exams
          </Button>
        </MainCard>
    );
  }

  // Check if questions exist and is an array
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
        <MainCard title="No Questions">
          <Typography variant="body1">
            This exam has no questions available.
          </Typography>
          <Button
              variant="contained"
              onClick={() => navigate('/dashboard/student/current-exams')}
              sx={{ mt: 2 }}
          >
            Back to Exams
          </Button>
        </MainCard>
    );
  }

  return (
      <MainCard title={exam.exam?.title || exam.title}>
        <Box sx={{ width: '100%' }}>
          {/* Timer and Progress */}
          <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimerIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Time Remaining: {formatTime(timeRemaining)}
              </Typography>
            </Box>
            <Box sx={{ width: '50%' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Progress: {answeredQuestions}/{totalQuestions} questions answered
              </Typography>
              <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Paper>

          {/* Question Navigation */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Question Navigation
            </Typography>
            <Grid container spacing={1}>
              {questions.map((question, index) => {
                const hasAnswer = answers[question.id]?.selected_option_id ||
                    (answers[question.id]?.selected_option_ids &&
                        answers[question.id].selected_option_ids.length > 0);
                return (
                    <Grid item key={question.id}>
                      <Button
                          variant={index === currentQuestionIndex ? "contained" : "outlined"}
                          size="small"
                          onClick={() => handleJumpToQuestion(index)}
                          sx={{
                            minWidth: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: hasAnswer ? 'success.main' : undefined,
                            color: hasAnswer ? 'white' : undefined
                          }}
                      >
                        {index + 1}
                      </Button>
                    </Grid>
                );
              })}
            </Grid>
          </Paper>

          {/* Current Question */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Typography>
              <Typography variant="body1" paragraph>
                {currentQuestion.question_text}
              </Typography>

              {/* Question Type Badge */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{
                  px: 1,
                  py: 0.5,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  borderRadius: 1,
                  fontWeight: 'bold'
                }}>
                  {currentQuestion.question_type?.toUpperCase().replace('_', ' ') || 'UNKNOWN'}
                </Typography>
              </Box>

              {/* Render question based on type */}
              {currentQuestion.question_type === 'mcq' && (
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                        value={answers[currentQuestion.id]?.selected_option_id || ''}
                        onChange={(e) => handleMcqAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                    >
                      {optionsToDisplay.map((option, index) => (
                          <FormControlLabel
                              key={option.id}
                              value={option.id}
                              control={<Radio />}
                              label={`${String.fromCharCode(65 + index)}. ${option.option_text}`}
                              sx={{ mb: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: 1, p: 1 }}
                          />
                      ))}
                    </RadioGroup>
                  </FormControl>
              )}

              {currentQuestion.question_type === 'true_false' && (
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Select one:</FormLabel>
                    <RadioGroup
                        value={answers[currentQuestion.id]?.selected_option_id || ''}
                        onChange={(e) => handleTrueFalseAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                        row
                    >
                      {optionsToDisplay.map((option) => (
                          <FormControlLabel
                              key={option.id}
                              value={option.id}
                              control={<Radio />}
                              label={option.option_text}
                              sx={{
                                mr: 3,
                                px: 3,
                                py: 1,
                                border: '2px solid',
                                borderColor: answers[currentQuestion.id]?.selected_option_id === option.id ? 'primary.main' : 'grey.300',
                                borderRadius: 2,
                                bgcolor: answers[currentQuestion.id]?.selected_option_id === option.id ? 'primary.light' : 'transparent'
                              }}
                          />
                      ))}
                    </RadioGroup>
                  </FormControl>
              )}

              {currentQuestion.question_type === 'checkbox' && (
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Select all that apply:</FormLabel>
                    {optionsToDisplay.map((option, index) => (
                        <FormControlLabel
                            key={option.id}
                            control={
                              <Checkbox
                                  checked={answers[currentQuestion.id]?.selected_option_ids?.includes(option.id) || false}
                                  onChange={(e) => handleCheckboxAnswerChange(currentQuestion.id, option.id, e.target.checked)}
                              />
                            }
                            label={`${String.fromCharCode(65 + index)}. ${option.option_text}`}
                            sx={{ mb: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: 1, p: 1 }}
                        />
                    ))}
                  </FormControl>
              )}

              {/* If question type is not recognized */}
              {!['mcq', 'true_false', 'checkbox'].includes(currentQuestion.question_type) && (
                  <Typography color="error" variant="body2">
                    Unsupported question type: {currentQuestion.question_type}
                  </Typography>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <Box>
              {currentQuestionIndex < totalQuestions - 1 ? (
                  <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleNextQuestion}
                  >
                    Next
                  </Button>
              ) : (
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenConfirmDialog}
                      disabled={submitting}
                  >
                    Submit Exam
                  </Button>
              )}
            </Box>
          </Box>

          {/* Start Exam Overlay - Show when exam hasn't started */}
          {!examStarted && (
              <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999
              }}>
                <Card sx={{ p: 4, maxWidth: 400 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Ready to Start Exam?
                    </Typography>
                    <Typography variant="body1" paragraph>
                      You have {totalQuestions} questions to complete. The exam will be timed for {exam.exam?.duration_minutes || exam.duration_minutes || 0} minutes.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Make sure you're ready before starting. Once started, the timer will begin counting down.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleStartExam}
                        fullWidth
                    >
                      Start Exam
                    </Button>
                  </CardContent>
                </Card>
              </Box>
          )}

          {/* Confirmation Dialog */}
          <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
            <DialogTitle>Submit Exam</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to submit your exam? You have answered {answeredQuestions} out of {totalQuestions} questions.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Once submitted, you cannot make any changes.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog} disabled={submitting}>
                Cancel
              </Button>
              <Button
                  onClick={() => handleSubmitExam(false)}
                  color="primary"
                  variant="contained"
                  disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </MainCard>
  );
};

export default ExamTaking;