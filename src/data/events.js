export const EVENTS = [
  {
    id: 1,
    title: "Virtual Assistant Bootcamp",
    date: "2025-08-20T10:00:00", // Using ISO format for accurate date handling
    location: "Online (Live on Zoom)",
    type: "Bootcamp",
    summary: "A 3-day live training to launch your career as a virtual assistant, covering tools, client acquisition, and more.",
    fullDescription: "This intensive 3-day virtual bootcamp is designed to kickstart your career as a professional Virtual Assistant. You’ll learn to master essential admin tools, develop productivity hacks, perfect your email management skills, and get our proven blueprint for landing your first high-quality client.",
    speakers: [
        { name: "Mabel Dappa", title: "Lead Instructor, Taxly Academy" },
        { name: "Job van der Voort", title: "Founder, Remote Work Inc." },
        { name: "Marcelo Lebre", title: "Productivity Expert" 
              
        }
    ],
    registrationLink: "https://zoom.us/your-registration-link",
    image: "/images/va-bootcamp.jpg",
  },
  {
    id: 2,
    title: "Compliance for Startups Webinar",
    date: "2025-09-05T14:00:00",
    location: "Online",
    type: "Webinar",
    summary: "Understand African business regulations with experts from Taxly, covering CAC, tax filing, and NDPR.",
    fullDescription: "In this free webinar, our expert panel from Taxly will demystify the complex world of startup compliance in Africa. We will cover essential topics such as Corporate Affairs Commission (CAC) registration, tax filing obligations for small businesses, and understanding the Nigerian Data Protection Regulation (NDPR). This session is perfect for startup founders, aspiring entrepreneurs, and finance professionals.",
    speakers: [
        { name: "David Chen", title: "Head of Compliance, Taxly Africa" }
    ],
    registrationLink: "https://zoom.us/your-registration-link",
    image: "/images/compliance-webinar.jpg",
  },
  {
    id: 3,
    title: "Remote Work Readiness Workshop",
    date: "2025-05-12T11:00:00",
    location: "Online",
    type: "Workshop",
    summary: "We trained over 100 attendees on the essential tools and best practices for succeeding in a remote work environment.",
    fullDescription: "Our Remote Work Readiness Workshop was a huge success, with over 100 attendees from across the continent. We covered everything from setting up a productive home office to mastering asynchronous communication tools like Slack and Asana. Participants left with a clear action plan for thriving in a remote-first company culture.",
    speakers: [
        { name: "Emily White", title: "Productivity Coach" }
    ],
    recordingLink: "https://youtube.com/your-recording-link",
    image: "/images/remote-readiness.jpg",
  },
  {
    id: 4,
    title: "Tax for Freelancers Q&A",
    date: "2025-03-03T18:00:00",
    location: "Online",
    type: "Q&A Session",
    summary: "Our tax experts hosted a live Q&A session to answer the most pressing tax questions from freelancers across Africa.",
    fullDescription: "In this interactive Q&A, our certified tax experts from Taxly Africa answered questions directly from the freelance community. We covered topics like how to register as a freelancer, what expenses are tax-deductible, and how to handle payments from international clients. The session provided immense value and clarity to all who attended.",
    speakers: [
        { name: "Bisi Adebayo", title: "Senior Tax Consultant, Taxly Africa" }
    ],
    recordingLink: "https://youtube.com/your-recording-link",
    image: "/images/freelance-tax.jpg",
  },
];

export default EVENTS;