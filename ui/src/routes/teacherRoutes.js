const teacherRoutes = [
    {
        path: "/dashboard/question-banks",
        name: "Question Banks",
        icon: "ni ni-collection text-primary",
        layout: "",
    },
    {
        path: "/dashboard/question-banks/:id",
        name: "Question Bank Detail",
        icon: "ni ni-collection text-blue",
        layout: "",
    },
    {
        path: "/dashboard/question-banks/create",
        name: "Create Question Bank",
        icon: "ni ni-collection text-green",
        layout: "",
    },
    {
        path: "/dashboard/question-banks/edit/:id",
        name: "Edit Question Bank",
        icon: "ni ni-collection text-orange",
        layout: "",
    },
    {
        path: "/dashboard/questions",
        name: "Questions",
        icon: "ni ni-book-bookmark text-red",
        layout: "",
    },
    {
        path: "/dashboard/questions/:id",
        name: "Question Detail",
        icon: "ni ni-book-bookmark text-purple",
        layout: "",
    },
    {
        path: "/dashboard/questions/create",
        name: "Create Question",
        icon: "ni ni-book-bookmark text-yellow",
        layout: "",
    },
    {
        path: "/dashboard/questions/:id/edit",
        name: "Edit Question",
        icon: "ni ni-book-bookmark text-teal",
        layout: "",
    },
    {
        path: "/dashboard/exams",
        name: "Exams",
        icon: "ni ni-paper-diploma text-info",
        layout: "",
    },
    {
        path: "/dashboard/exams/:id",
        name: "Exam Detail",
        icon: "ni ni-paper-diploma text-warning",
        layout: "",
    },
    {
        path: "/dashboard/exams/create",
        name: "Create Exam",
        icon: "ni ni-paper-diploma text-success",
        layout: "",
    },
    {
        path: "/dashboard/exams/:id/edit",
        name: "Edit Exam",
        icon: "ni ni-paper-diploma text-danger",
        layout: "",
    },
    {
        path: "/dashboard/objections",
        name: "Objections",
        icon: "ni ni-bell-55 text-primary",
        layout: "",
    },
    {
        path: "/dashboard/teacher-students",
        name: "My Students",
        icon: "ni ni-single-02 text-blue",
        layout: "",
    },
    {
        path: "/dashboard/teacher-students/:id",
        name: "Student Detail",
        icon: "ni ni-single-02 text-green",
        layout: "",
    },
];

export default teacherRoutes;