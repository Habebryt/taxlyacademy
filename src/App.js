
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CurrencyProvider } from "./context/CurrencyContext";
import CallToAction from './components/CallToAction';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Enroll from './pages/Enroll';
import Checkout from './pages/Checkout';
import JobList from './pages/JobList';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';


function App() {
  return (
    <HelmetProvider>
      <CurrencyProvider>
    <div>
      <Navbar />
      {/* ... your Routes or page sections */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/checkout" element={<Checkout />}/>
        <Route path="/joblist" element={<JobList />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        {/* Add more routes as needed */}
      </Routes>
      <CallToAction/>
      <Footer />
    </div>
    </CurrencyProvider>
    </HelmetProvider>
  );
}

export default App;
