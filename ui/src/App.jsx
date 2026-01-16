// src/App.jsx
import { SnackbarProvider } from 'notistack';
import { RouterProvider } from 'react-router-dom';

// project imports
import ThemeCustomization from './themes';
import { AuthProvider } from './contexts/AuthContext';
import router from 'routes';
function App() {
    return (
        <ThemeCustomization>
            <AuthProvider>
                <SnackbarProvider maxSnack={3}>
                    <RouterProvider router={router} />
                </SnackbarProvider>
            </AuthProvider>
        </ThemeCustomization>
    );
}

export default App;