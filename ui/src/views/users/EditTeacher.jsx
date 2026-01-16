// src/views/users/EditTeacher.jsx
import EditUser from './EditUser';
import { getTeacherById } from '../../services/authService';

const EditTeacher = () => {
    return (
        <EditUser
            userType="teacher"
            getUserById={getTeacherById}
            listRoute="/dashboard/teachers"
        />
    );
};

export default EditTeacher;