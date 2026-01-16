const studentRoutes = [
    {
        path: "/dashboard/student/current-exams",
        name: "Current Exams",
        icon: "ni ni-calendar-grid-58 text-primary",
        layout: "",
    },
    {
        path: "/dashboard/student/exam-history",
        name: "Exam History",
        icon: "ni ni-single-copy-04 text-blue",
        layout: "",
    },
    {
        path: "/dashboard/student/exam/:id",
        name: "Take Exam",
        icon: "ni ni-paper-diploma text-green",
        layout: "",
    },
    {
        path: "/dashboard/student/exam-results/:id",
        name: "Exam Results",
        icon: "ni ni-chart-bar-32 text-orange",
        layout: "",
    },
];

export default studentRoutes;