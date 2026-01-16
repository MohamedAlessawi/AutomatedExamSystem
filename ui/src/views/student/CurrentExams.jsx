// src/views/student/CurrentExams.jsx
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
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { getCurrentExams } from '../../services/authService';

// assets
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GradeIcon from '@mui/icons-material/Grade';
import VisibilityIcon from '@mui/icons-material/Visibility';

const CurrentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchCurrentExams = async () => {
      try {
        setLoading(true);
        const response = await getCurrentExams();
        setExams(response.data);
      } catch (error) {
        enqueueSnackbar(error.message || 'Failed to fetch current exams', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentExams();
  }, [enqueueSnackbar]);

  const handleStartExam = (examId) => {
    navigate(`/dashboard/student/exam/${examId}`);
  };

  const handleViewExam = (examId) => {
    navigate(`/dashboard/student/exam-results/${examId}`);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'assigned':
        return <Chip label="Assigned" color="primary" icon={<ScheduleIcon />} />;
      case 'in_progress':
        return <Chip label="In Progress" color="warning" icon={<PlayArrowIcon />} />;
      case 'submitted':
        return <Chip label="Submitted" color="info" icon={<AssignmentTurnedInIcon />} />;
      case 'graded':
        return <Chip label="Graded" color="success" icon={<GradeIcon />} />;
      default:
        return <Chip label={status} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainCard title="Current Exams">
      <Box sx={{ width: '100%' }}>
        {exams.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="textSecondary">
              You don't have any assigned exams at the moment.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {exams.map((examAssignment) => (
              <Grid item xs={12} md={6} lg={4} key={examAssignment.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h5" component="div">
                        {examAssignment.exam.title}
                      </Typography>
                      {getStatusChip(examAssignment.status)}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Subject: {examAssignment.exam.subject.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Duration: {examAssignment.exam.duration_minutes} minutes
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Marks: {examAssignment.exam.total_marks}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {examAssignment.exam.description}
                    </Typography>

                    {examAssignment.status === 'graded' && (
                      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                        Score: {examAssignment.score}/{examAssignment.exam.total_marks}
                      </Typography>
                    )}
                  </CardContent>

                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    {examAssignment.status === 'assigned' && (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleStartExam(examAssignment.id)}
                      >
                        Start Exam
                      </Button>
                    )}

                    {examAssignment.status === 'in_progress' && (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleStartExam(examAssignment.id)}
                      >
                        Continue Exam
                      </Button>
                    )}

                    {(examAssignment.status === 'submitted' || examAssignment.status === 'graded') && (
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewExam(examAssignment.id)}
                      >
                        View Results
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </MainCard>
  );
};

export default CurrentExams;