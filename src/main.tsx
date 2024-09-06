import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@fontsource/inter/100.css"
import "@fontsource/inter/200.css"
import "@fontsource/inter/300.css"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"
import "@fontsource/inter/800.css"
import "@fontsource/inter/900.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Login from './page/auth/login'
import Register from './page/auth/register'
import Home from './page/home'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Questions from './page/vacancy/questions'
// import Interview2 from './page/interview-1'
import Interview from './page/interview/interview'
import InterviewAnalysisResult from './page/interview/analysisResult'
import Dashboard from './page/dashboard'
import CVAnalyzer from './page/cv/cvAnalyzer'


const router = createBrowserRouter([
  {
    path: "",
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "auth",
        element: <Outlet />,
        children: [
          {
            path: "signin",
            element: <Login />,
          },
          {
            path: "signup",
            element: <Register />
          },
        ],
      },
      {
        path: "questions",
        element: <Questions />        
      },
      {
        path: "interview",
        element: <Interview />
      },
      {
        path: "interview-result",
        element: <InterviewAnalysisResult />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "cv-analyzer",
        element: <CVAnalyzer />
      }
    ],
    errorElement: <div>Error</div>
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="308076801679-d5m5u8u1ibas3a3p31j58nmlgpov7ssf.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

