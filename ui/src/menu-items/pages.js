// src/menu-items/pages.js
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import AccountBox from '@mui/icons-material/AccountBoxOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import QuizIcon from '@mui/icons-material/Quiz';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GavelIcon from '@mui/icons-material/Gavel';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HistoryIcon from '@mui/icons-material/History';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const icons = {
  NavigationOutlinedIcon,
  ChromeReaderModeOutlinedIcon,
  TranslateIcon,
  SecurityOutlinedIcon,
  MonetizationOnOutlinedIcon,
  ErrorOutlineRounded,
  HourglassEmptyRoundedIcon,
  HelpOutlineOutlinedIcon,
  AccountBox,
  PeopleOutlinedIcon,
  PersonAddOutlinedIcon,
  SchoolOutlinedIcon,
  PersonOutlineOutlinedIcon,
  QuizIcon,
  QuestionAnswerIcon,
  AssignmentIcon,
  GavelIcon,
  PeopleAltIcon,
  HistoryIcon,
  EventAvailableIcon,
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages = {
  id: 'pages',
  title: 'Management',
  caption: 'System Management',
  type: 'group',
  icon: icons.NavigationOutlinedIcon,
  children: [
    {
      id: 'sample-page',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.ChromeReaderModeOutlinedIcon
    },
    {
      id: 'user-management',
      title: 'User Management',
      type: 'collapse',
      icon: icons.PeopleOutlinedIcon,
      roles: ['admin'], // Only show to admin users
      children: [
        {
          id: 'admin-register',
          title: 'Register User',
          type: 'item',
          url: '/dashboard/admin-register',
          icon: icons.PersonAddOutlinedIcon,
          breadcrumbs: false,
          roles: ['admin']
        },
        {
          id: 'teachers',
          title: 'Teachers',
          type: 'item',
          url: '/dashboard/teachers',
          icon: icons.SchoolOutlinedIcon,
          breadcrumbs: false,
          roles: ['admin']
        },
        {
          id: 'students',
          title: 'Students',
          type: 'item',
          url: '/dashboard/students',
          icon: icons.PersonOutlineOutlinedIcon,
          breadcrumbs: false,
          roles: ['admin']
        }
      ]
    },
    {
      id: 'question-management',
      title: 'Question Management',
      type: 'collapse',
      icon: icons.QuizIcon,
      roles: ['teacher'], // Only show to teacher users
      children: [
        {
          id: 'question-banks',
          title: 'Question Banks',
          type: 'item',
          url: '/dashboard/question-banks',
          icon: icons.QuestionAnswerIcon,
          breadcrumbs: false,
          roles: ['teacher']
        },
        {
          id: 'questions',
          title: 'Questions',
          type: 'item',
          url: '/dashboard/questions',
          icon: icons.QuizIcon,
          breadcrumbs: false,
          roles: ['teacher']
        }
      ]
    },
    {
      id: 'exam-management',
      title: 'Exam Management',
      type: 'collapse',
      icon: icons.AssignmentIcon,
      roles: ['teacher'], // Only show to teacher users
      children: [
        {
          id: 'exams',
          title: 'Exams',
          type: 'item',
          url: '/dashboard/exams',
          icon: icons.AssignmentIcon,
          breadcrumbs: false,
          roles: ['teacher']
        },
        {
          id: 'objections',
          title: 'Objections',
          type: 'item',
          url: '/dashboard/objections',
          icon: icons.GavelIcon,
          breadcrumbs: false,
          roles: ['teacher']
        }
      ]
    },
    {
      id: 'teacher-students',
      title: 'My Students',
      type: 'item',
      url: '/dashboard/teacher-students',
      icon: icons.PeopleAltIcon,
      breadcrumbs: false,
      roles: ['teacher']
    },
    {
      id: 'student-exams',
      title: 'Exams',
      type: 'collapse',
      icon: icons.AssignmentIcon,
      roles: ['student'], // Only show to student users
      children: [
        {
          id: 'current-exams',
          title: 'Current Exams',
          type: 'item',
          url: '/dashboard/student/current-exams',
          icon: icons.EventAvailableIcon,
          breadcrumbs: false,
          roles: ['student']
        },
        {
          id: 'exam-history',
          title: 'Exam History',
          type: 'item',
          url: '/dashboard/student/exam-history',
          icon: icons.HistoryIcon,
          breadcrumbs: false,
          roles: ['student']
        }
      ]
    },
    {
      id: 'auth',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.SecurityOutlinedIcon,
      children: [
        {
          id: 'login-1',
          title: 'login',
          type: 'item',
          url: '/pages/auth/login',
          target: '_blank'
        },
        {
          id: 'register',
          title: 'register',
          type: 'item',
          url: '/pages/auth/register',
          target: '_blank'
        }
      ]
    },
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/materially-react-material-documentation/',
      icon: icons.HelpOutlineOutlinedIcon,
      chip: {
        label: 'Help?',
        color: 'primary'
      },
      external: true,
      target: '_blank'
    }
  ]
};

export default pages;