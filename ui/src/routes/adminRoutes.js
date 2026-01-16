const adminRoutes = [
    {
        path: "/dashboard/admin-register",
        name: "Admin Register",
        icon: "ni ni-single-02 text-primary",
        layout: "",
    },
    {
        path: "/dashboard/teachers",
        name: "Teachers",
        icon: "ni ni-hat-3 text-blue",
        layout: "",
    },
    {
        path: "/dashboard/students",
        name: "Students",
        icon: "ni ni-single-02 text-green",
        layout: "",
    },
    {
        path: "/dashboard/view-teacher/:id",
        name: "View Teacher",
        icon: "ni ni-single-02 text-orange",
        layout: "",
    },
    {
        path: "/dashboard/view-student/:id",
        name: "View Student",
        icon: "ni ni-single-02 text-red",
        layout: "",
    },
    {
        path: "/dashboard/edit-teacher/:id",
        name: "Edit Teacher",
        icon: "ni ni-single-02 text-purple",
        layout: "",
    },
    {
        path: "/dashboard/edit-student/:id",
        name: "Edit Student",
        icon: "ni ni-single-02 text-yellow",
        layout: "",
    },
];

export default adminRoutes;