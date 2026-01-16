// src/views/users/TeacherDetail.jsx
import UserDetail from '../../components/users/UserDetail';
import { getTeacherById } from '../../services/authService';

const TeacherDetail = () => {
    return (
        <UserDetail
            title="Teacher Details"
            getUserById={getTeacherById}
            userType="teacher"
            editUserRoute="/dashboard/edit-teacher"
            listRoute="/dashboard/teachers"
        />
    );
};

export default TeacherDetail;