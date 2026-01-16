// src/views/users/StudentsPage.jsx
import UserList from "../../components/users/UserList";
import { getStudents, getStudentById } from "../../services/authService";

const StudentsPage = () => {
    return (
        <UserList
            title="Students Management"
            fetchUsers={getStudents}
            getUserById={getStudentById}
            userType="student"
            addUserRoute="/dashboard/admin-register"
            editUserRoute="/dashboard/edit-student"
            viewUserRoute="/dashboard/view-student"
        />
    );
};

export default StudentsPage;