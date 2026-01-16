// src/views/users/StudentDetail.jsx
import UserDetail from '../../components/users/UserDetail';
import { getStudentById } from '../../services/authService';

const StudentDetail = () => {
    return (
        <UserDetail
            title="Student Details"
            getUserById={getStudentById}
            userType="student"
            editUserRoute="/dashboard/edit-student"
            listRoute="/dashboard/students"
        />
    );
};

export default StudentDetail;