// src/views/student/ExamResults.jsx
import { useState, useEffect } from 'react';
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
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getStudentExamById, submitObjection } from '../../services/authService';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import GavelIcon from '@mui/icons-material/Gavel';

const ExamResults = () => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [objectionDialogOpen, setObjectionDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [objectionMessage, setObjectionMessage] = useState('');
  const [submittingObjection, setSubmittingObjection] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await getStudentExamById(id);
        console.log('Exam response:', response); // Debug log
        setExam(response.data);
      } catch (error) {
        enqueueSnackbar(error.message || 'Failed to fetch exam results', { variant: 'error' });
        navigate('/dashboard/student/exam-history');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id, navigate, enqueueSnackbar]);

  const handleOpenObjectionDialog = (question) => {
    setSelectedQuestion(question);
    setObjectionMessage('');
    setObjectionDialogOpen(true);
  };

  const handleCloseObjectionDialog = () => {
    setObjectionDialogOpen(false);
    setSelectedQuestion(null);
    setObjectionMessage('');
  };

  const handleSubmitObjection = async () => {
    if (!objectionMessage.trim()) {
      enqueueSnackbar('Please provide a reason for your objection', { variant: 'warning' });
      return;
    }

    try {
      setSubmittingObjection(true);
      await submitObjection({
        exam_assignment_id: parseInt(id),
        question_id: selectedQuestion.id,
        message: objectionMessage
      });

      enqueueSnackbar('Objection submitted successfully', { variant: 'success' });
      handleCloseObjectionDialog();
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to submit objection', { variant: 'error' });
    } finally {
      setSubmittingObjection(false);
    }
  };

  // Helper function to get questions from exam
  const getQuestions = () => {
    if (!exam) return [];

    if (exam.exam?.questions) {
      return exam.exam.questions;
    } else if (exam.questions) {
      return exam.questions;
    }
    return [];
  };

  // Helper function to get student's answer for a question
  const getStudentAnswer = (questionId) => {
    if (!exam?.answers) return null;
    return exam.answers.find(answer => answer.question_id === questionId);
  };

  const calculateScore = () => {
    const questions = getQuestions();
    if (!exam || !questions || !exam.answers) return { score: 0, totalMarks: 0 };

    let score = 0;
    let totalMarks = 0;

    questions.forEach(question => {
      const questionMark = parseFloat(question.pivot?.mark || 0);
      totalMarks += questionMark;

      const studentAnswer = getStudentAnswer(question.id);

      if (studentAnswer) {
        const selectedOption = question.options?.find(option => option.id === studentAnswer.selected_option_id);

        if (selectedOption && selectedOption.is_correct) {
          score += questionMark;
        }
      }
    });

    return { score, totalMarks };
  };

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
    );
  }

  if (!exam) {
    return (
        <MainCard title="Exam Results Not Found">
          <Typography variant="body1">
            The exam results you're looking for don't exist.
          </Typography>
          <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard/student/exam-history')}
              sx={{ mt: 2 }}
          >
            Back to Exam History
          </Button>
        </MainCard>
    );
  }

  const { score, totalMarks } = calculateScore();
  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
  const questions = getQuestions();
  const answeredQuestions = exam.answers ? exam.answers.length : 0;
  const totalQuestions = questions.length;

  return (
      <MainCard title="Exam Results">
        <Box sx={{ width: '100%' }}>
          <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard/student/exam-history')}
              sx={{ mb: 2 }}
          >
            Back to Exam History
          </Button>

          {/* Exam Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {exam.exam?.title || exam.title || 'Exam'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Subject: {exam?.exam?.subject?.name || exam?.subject?.name || 'N/A'}
              </Typography>
              <Typography variant="body1" paragraph>
                {exam.exam?.description || ''}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="h5" color="primary">
                    {score.toFixed(2)}/{totalMarks.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Score
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="h5" color="primary">
                    {percentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Percentage
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="h5" color="primary">
                    {answeredQuestions}/{totalQuestions}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Questions Answered
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="h5" color="primary">
                    <Chip
                        label={exam.status}
                        color={exam.status === 'graded' ? 'success' : exam.status === 'submitted' ? 'info' : 'default'}
                    />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Questions and Answers */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Questions and Answers
              </Typography>

              {questions.map((question, index) => {
                const studentAnswer = getStudentAnswer(question.id);
                const isCorrect = studentAnswer &&
                    question.options?.find(option =>
                        option.id === studentAnswer.selected_option_id && option.is_correct
                    );

                return (
                    <Card key={question.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" gutterBottom>
                            Question {index + 1}
                          </Typography>
                          <Chip
                              label={isCorrect ? 'Correct' : 'Incorrect'}
                              color={isCorrect ? 'success' : 'error'}
                              size="small"
                          />
                        </Box>

                        <Typography variant="body1" paragraph>
                          {question.question_text}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>
                          Options:
                        </Typography>

                        <List>
                          {question.options?.map((option) => (
                              <ListItem key={option.id} sx={{ py: 0.5 }}>
                                <ListItemIcon>
                                  {question.question_type === 'mcq' || question.question_type === 'true_false' ? (
                                      option.is_correct ? (
                                          <CheckCircleIcon color="success" />
                                      ) : (
                                          <RadioButtonUncheckedIcon />
                                      )
                                  ) : (
                                      option.is_correct ? (
                                          <Checkbox checked color="success" />
                                      ) : (
                                          <CheckBoxOutlineBlankIcon />
                                      )
                                  )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={option.option_text}
                                    secondary={
                                      studentAnswer && studentAnswer.selected_option_id === option.id
                                          ? 'Your answer'
                                          : option.is_correct
                                              ? 'Correct answer'
                                              : ''
                                    }
                                    sx={{
                                      color:
                                          studentAnswer && studentAnswer.selected_option_id === option.id
                                              ? option.is_correct
                                                  ? 'success.main'
                                                  : 'error.main'
                                              : 'inherit'
                                    }}
                                />
                              </ListItem>
                          ))}
                        </List>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Marks: {studentAnswer?.mark_obtained || '0.00'} / {question.pivot?.mark || 'N/A'}
                          </Typography>

                          {exam.status === 'graded' && (
                              <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<GavelIcon />}
                                  onClick={() => handleOpenObjectionDialog(question)}
                              >
                                Object
                              </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                );
              })}
            </CardContent>
          </Card>

          {/* Objection Dialog */}
          <Dialog open={objectionDialogOpen} onClose={handleCloseObjectionDialog} maxWidth="md" fullWidth>
            <DialogTitle>Submit Objection</DialogTitle>
            <DialogContent>
              {selectedQuestion && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Question: {selectedQuestion.question_text}
                    </Typography>

                    <TextField
                        fullWidth
                        label="Reason for objection"
                        multiline
                        rows={4}
                        value={objectionMessage}
                        onChange={(e) => setObjectionMessage(e.target.value)}
                        sx={{ mt: 2 }}
                        placeholder="Explain why you think your answer should be reconsidered..."
                    />
                  </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseObjectionDialog} disabled={submittingObjection}>
                Cancel
              </Button>
              <Button
                  onClick={handleSubmitObjection}
                  color="primary"
                  variant="contained"
                  disabled={submittingObjection}
              >
                {submittingObjection ? 'Submitting...' : 'Submit Objection'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </MainCard>
  );
};

export default ExamResults;