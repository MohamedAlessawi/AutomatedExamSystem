// src/views/users/TeachersPage.jsx
import UserList from "../../components/users/UserList";
import { getTeachers, getTeacherById } from "../../services/authService";

const TeachersPage = () => {
    return (
        <UserList
            title="Teachers Management"
            fetchUsers={getTeachers}
            getUserById={getTeacherById}
            userType="teacher"
            addUserRoute="/dashboard/admin-register"
            editUserRoute="/dashboard/edit-teacher"
            viewUserRoute="/dashboard/view-teacher"
        />
    );
};

export default TeachersPage;