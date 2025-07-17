import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CurrencyProvider } from "./context/CurrencyContext";
import { FirebaseProvider } from "./context/FirebaseContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// --- NEW: Import the MainLayout component ---
import MainLayout from "./components/MainLayout";

// Import all page components
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Enroll from "./pages/Enroll";
import Checkout from "./pages/Checkout";
import JobListPage from "./pages/JobListPage";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import BecomeATrainer from "./pages/BecomeATrainer";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Import 'For...' pages
import ForUniversities from "./pages/ForUniversities";
import ForBusinesses from "./pages/ForBusinesses";
import ForGovernment from "./pages/ForGovernment";
import ForSchools from "./pages/ForSchools";

// --- Import all Dashboard pages ---
import DashboardComingSoon from "./pages/DashboardComingSoon";
import MyCourses from './pages/dashboard/student/MyCourses';
import CoursePlayer from './pages/dashboard/student/CoursePlayer';
import JobApplications from './pages/dashboard/student/JobApplications';
import StudentProfile from './pages/dashboard/student/StudentProfile';
import SubmitAssignment from './pages/dashboard/student/SubmitAssignment';
import TrainerDashboard from './pages/dashboard/trainer/TrainerDashboard';
import MyCoursesTrainer from './pages/dashboard/trainer/MyCoursesTrainer';
import CreateCourse from './pages/dashboard/trainer/CreateCourse';
import EditCourse from './pages/dashboard/trainer/EditCourse';
import ClassroomManager from './pages/dashboard/trainer/ClassroomManager';
import AssessmentManager from './pages/dashboard/trainer/AssessmentManager';
import SupportDashboard from './pages/dashboard/support/SupportDashboard';
import CorporateDashboard from './pages/dashboard/corporate/CorporateDashboard';


const GA_MEASUREMENT_ID = "G-NGZ7CF0TNG";

const AnalyticsTracker = () => {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
  return null;
};


function App() {
  return (
    <HelmetProvider>
      <CurrencyProvider>
        <FirebaseProvider>
          {/* The <Router> should be in your index.js file */}
          <AnalyticsTracker />
          
          {/* The <main> tag has been removed from here as it's now inside MainLayout */}
          <Routes>
            {/* --- Public Pages Wrapped in MainLayout --- */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/courses" element={<MainLayout><Courses /></MainLayout>} />
            <Route path="/courses/:id" element={<MainLayout><CourseDetail /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/enroll" element={<MainLayout><Enroll /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
            <Route path="/joblistpage" element={<MainLayout><JobListPage /></MainLayout>} />
            <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
            <Route path="/events/:id" element={<MainLayout><EventDetail /></MainLayout>} />
            <Route path="/blog" element={<MainLayout><BlogList /></MainLayout>} />
            <Route path="/blog/:id" element={<MainLayout><BlogDetail /></MainLayout>} />
            <Route path="/become-a-trainer" element={<MainLayout><BecomeATrainer /></MainLayout>} />
            <Route path="/terms-of-service" element={<MainLayout><TermsOfService /></MainLayout>} />
            <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
            <Route path="/for-universities" element={<MainLayout><ForUniversities /></MainLayout>} />
            <Route path="/for-businesses" element={<MainLayout><ForBusinesses /></MainLayout>} />
            <Route path="/for-schools" element={<MainLayout><ForSchools /></MainLayout>} />
            <Route path="/for-government" element={<MainLayout><ForGovernment /></MainLayout>} />
            
            {/* --- Dashboard Routes (These do NOT use the MainLayout) --- */}
            <Route path="/login" element={<DashboardComingSoon />} />
            
            {/* Student Dashboard */}
            <Route path="/dashboard/my-courses" element={<MyCourses />} />
            <Route path="/dashboard/job-applications" element={<JobApplications />} />
            <Route path="/dashboard/profile" element={<StudentProfile />} />
            <Route path="/courses/:courseId/learn" element={<CoursePlayer />} />
            <Route path="/dashboard/submit-assignment/:courseId/:lessonIndex" element={<SubmitAssignment />} />

            {/* Trainer Dashboard */}
            <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
            <Route path="/dashboard/my-courses-trainer" element={<MyCoursesTrainer />} />
            <Route path="/dashboard/create-course" element={<CreateCourse />} />
            <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />
            <Route path="/dashboard/classroom-manager/:courseId" element={<ClassroomManager />} />
            <Route path="/dashboard/assessment-manager/:courseId" element={<AssessmentManager />} />
            
            {/* Support & Corporate Dashboards */}
            <Route path="/dashboard/support" element={<SupportDashboard />} />
            <Route path="/dashboard/corporate" element={<CorporateDashboard />} />
          </Routes>
        </FirebaseProvider>
      </CurrencyProvider>
    </HelmetProvider>
  );
}

export default App;
