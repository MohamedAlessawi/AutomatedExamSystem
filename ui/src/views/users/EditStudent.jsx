// src/views/users/EditStudent.jsx
import EditUser from './EditUser';
import { getStudentById } from '../../services/authService';

const EditStudent = () => {
    return (
        <EditUser
            userType="student"
            getUserById={getStudentById}
            listRoute="/dashboard/students"
        />
    );
};

export default EditStudent;