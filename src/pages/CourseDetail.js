import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { CurrencyContext } from "../context/CurrencyContext";
import { useParams, Link } from "react-router-dom";
import "../styles/CourseDetail.css"; // Make sure to have this CSS file for styling
import Hero from "../components/Hero";

// This new data structure is much more detailed, based on your blog posts.
const courseData = {
  "executive-assistant-mastery": {
    title: "Executive Assistant Mastery",
    duration: "6 Weeks",
    price: 65000,
    overview: "This course is designed to elevate your administrative skills to a C-suite level. You will learn to manage complex schedules, coordinate travel, handle confidential communications, and become the indispensable right hand to high-level executives, freeing them up to focus on strategic decisions.",
    learningOutcomes: [
      "Advanced calendar and inbox management.",
      "Professional travel and meeting coordination.",
      "Handling sensitive information with discretion.",
      "Mastery of office management and organizational duties.",
    ],
    whoIsThisFor: "Administrative assistants, personal assistants, and office managers looking to transition into a high-level executive support role in the online space.",
    curriculum: [
      "Week 1: The Modern Executive Assistant's Role & Mindset",
      "Week 2: Advanced Calendar & Scheduling Mastery (Across Timezones)",
      "Week 3: Professional Communication & Gatekeeping",
      "Week 4: Travel Coordination & Itinerary Management",
      "Week 5: Document & Report Organization",
      "Week 6: Capstone Project: Simulating a CEO's Week",
    ],
    careerOpportunities: ["Executive Assistant to CEO/COO/CFO", "Virtual Executive Assistant", "Chief of Staff (Junior Role)"],
  },
  "social-media-strategy": {
    title: "Social Media Strategy & Management",
    duration: "6 Weeks",
    price: 70000,
    overview: "Go beyond simply posting content. This course teaches you to develop and implement a comprehensive social media strategy. You will master content planning, copywriting, basic graphic design and video editing, and learn to use AI and scheduling tools to drive engagement and growth for clients.",
    learningOutcomes: [
      "Developing a data-driven social media strategy.",
      "Creating and curating engaging content (text, image, and video).",
      "Understanding social media analytics and reporting.",
      "Managing multiple platforms and scheduling tools efficiently.",
    ],
    whoIsThisFor: "Aspiring social media managers, content creators, and marketing assistants who want to take on a strategic role and manage a brand's entire social media presence.",
     curriculum: [
      "Week 1: Foundations of Social Media Strategy",
      "Week 2: Content Creation & Curation (Canva, CapCut)",
      "Week 3: Advanced Copywriting & Community Engagement",
      "Week 4: Platform Deep Dive: Instagram & LinkedIn",
      "Week 5: Analytics, Reporting & AI Tools",
      "Week 6: Building a Client Strategy & Portfolio",
    ],
    careerOpportunities: ["Social Media Manager", "Content Strategist", "Community Manager", "Digital Marketing Specialist"],
  },
  "unicorn-digital-marketing-assistant": {
    title: "Unicorn Digital Marketing Assistant",
    duration: "10 Weeks",
    price: 120000,
    overview: "This is the ultimate gateway course to a high-value marketing career. You will learn the entire marketing ecosystem, from email marketing and SEO to website updates and tech automations. This course equips you with the technical and strategic skills to implement a cohesive marketing plan, making you an invaluable asset to any team.",
    learningOutcomes: [
      "Formatting and scheduling weekly email campaigns.",
      "Fundamentals of Search Engine Optimization (SEO).",
      "Creating graphics and short-form video for marketing.",
      "Managing website updates and landing pages.",
      "Understanding and assisting with marketing automations.",
    ],
    whoIsThisFor: "Individuals seeking an entry-point into the digital marketing world. This course provides the broad, foundational experience needed to quickly climb the ladder to specialized manager roles.",
    curriculum: [
        "Week 1-2: Core Marketing Principles & The Marketing Ecosystem",
        "Week 3-4: Content & Email Marketing (Mailchimp, ConvertKit)",
        "Week 5-6: Social Media Publishing & SEO Fundamentals",
        "Week 7: Basic Website & Landing Page Management (WordPress/Shopify)",
        "Week 8: Affiliate Marketing & Data Tracking",
        "Week 9: Introduction to Tech Automations (Zapier)",
        "Week 10: Building Your Portfolio & Finding Clients",
    ],
    careerOpportunities: ["Marketing Assistant", "Marketing Coordinator", "Junior Marketing Manager", "Content Manager"],
  },
  "customer-success-manager": {
    title: "Customer Success Manager",
    duration: "5 Weeks",
    price: 55000,
    overview: "Learn the art of client retention and delight. This course covers essential workflows for managing client communications, troubleshooting needs, and nurturing customer relationships to drive long-term business success.",
    learningOutcomes: ["Effective client communication strategies.", "Managing customer inboxes and communities.", "Troubleshooting client issues and recovering payments.", "Upselling and identifying new opportunities from warm leads."],
    whoIsThisFor: "Individuals with strong people skills looking to manage client relationships, support teams, and take responsibility for customer satisfaction and retention.",
    curriculum: ["Week 1: Principles of Customer Success", "Week 2: Building Client Communication Workflows", "Week 3: Proactive Troubleshooting & Issue Resolution", "Week 4: Community & Inbox Management Techniques", "Week 5: Driving Retention & Identifying Growth Opportunities"],
    careerOpportunities: ["Customer Success Manager", "Customer Relations Manager", "Client Account Manager", "Community Manager"],
  },
  "paid-traffic-ads-manager": {
    title: "Paid Traffic & Ads Management",
    duration: "8 Weeks",
    price: 90000,
    overview: "Become a high-value ads manager by learning to drive traffic and sales through paid advertising. This course provides in-depth training on major platforms like Meta (Facebook/Instagram) and Google, focusing on strategy, execution, and analytics.",
    learningOutcomes: ["Developing and executing paid ad strategies.", "Setting up and managing campaigns on Meta and Google.", "Understanding ad analytics and optimizing for performance.", "Creating compelling ad copy and visuals.", "Managing client ad spend and reporting on ROI."],
    whoIsThisFor: "Marketers who want to specialize in the high-demand, high-reward field of paid advertising and manage significant client budgets.",
    curriculum: ["Week 1-2: Fundamentals of Paid Advertising", "Week 3-4: Deep Dive into Meta Ads (Facebook & Instagram)", "Week 5-6: Mastering Google & YouTube Ads", "Week 7: Budget Management & ROI Analysis", "Week 8: Client Reporting & Scaling Campaigns"],
    careerOpportunities: ["Ads Manager", "Paid Traffic Specialist", "Digital Advertising Strategist", "PPC Manager"],
  },
  "podcast-production-management": {
    title: "Podcast Production & Management",
    duration: "5 Weeks",
    price: 50000,
    overview: "Move from assistant to manager by learning to oversee the entire podcast production process. This course covers everything from guest management and content scripting to coordinating with editors and executing growth strategies.",
    learningOutcomes: ["Managing the end-to-end podcast production workflow.", "Coordinating with editors, designers, and content teams.", "Developing content strategies and writing scripts.", "Securing guests and managing sponsor relationships.", "Implementing promotion and growth strategies for a podcast."],
    whoIsThisFor: "Podcast assistants, content coordinators, and anyone passionate about audio content who wants to manage the entire lifecycle of a podcast.",
    curriculum: ["Week 1: The Podcast Ecosystem & Strategy", "Week 2: Guest Management & Content Planning", "Week 3: Production Workflow & Editing Coordination", "Week 4: Promotion, Growth & Social Media Strategy", "Week 5: Monetization & Securing Sponsorships"],
    careerOpportunities: ["Podcast Manager", "Podcast Producer", "Audio Content Manager"],
  },
  "tech-automations-expert": {
    title: "Tech & Automations Expert",
    duration: "7 Weeks",
    price: 85000,
    overview: "Become the tech backbone of any online business. This course teaches you how to integrate different platforms, automate complex workflows, and implement system-level AI solutions, making you a highly sought-after technical expert.",
    learningOutcomes: ["Integrating various software and tech stacks (e.g., CRM, email, project management).", "Building and managing automations with tools like Zapier.", "Implementing AI into operational and marketing systems.", "Troubleshooting technical issues within a business's systems.", "Providing value-based pricing for technical projects."],
    whoIsThisFor: "Tech-savvy individuals, virtual assistants, and operations managers who want to specialize in systems integration and automation.",
    curriculum: ["Week 1: Foundations of Business Tech Stacks", "Week 2-3: Mastering Zapier for Workflow Automation", "Week 4: CRM & Email Marketing Integration", "Week 5: Implementing AI into Systems (ChatGPT API, etc.)", "Week 6: Advanced Troubleshooting & System Audits", "Week 7: Scoping & Pricing Tech Projects"],
    careerOpportunities: ["Tech VA", "Automations Expert", "Systems Integrator", "Operations Consultant"],
  },
  "community-management-pro": {
    title: "Community Management Pro",
    duration: "4 Weeks",
    price: 48000,
    overview: "Learn to build, grow, and manage thriving online communities. This course focuses on engagement strategies, content planning, and moderation for both free and paid membership groups on platforms like Facebook, Slack, and Discord.",
    learningOutcomes: ["Developing and implementing community engagement strategies.", "Creating content calendars and facilitating discussions.", "Managing membership, onboarding, and retention.", "Moderating content and handling member issues.", "Analyzing community health and reporting on key metrics."],
    whoIsThisFor: "Social media coordinators, customer service professionals, and anyone who excels at building relationships and wants to manage online communities.",
    curriculum: ["Week 1: The Art of Community Building", "Week 2: Engagement Strategies & Content Planning", "Week 3: Moderation & Conflict Resolution", "Week 4: Tools, Analytics & Monetization"],
    careerOpportunities: ["Community Manager", "Membership Manager", "Social Media Manager", "Audience Engagement Specialist"],
  },
  "content-marketing-manager": {
    title: "Content Marketing Manager",
    duration: "6 Weeks",
    price: 75000,
    overview: "Go beyond single-platform content creation. This course teaches you to manage a brand's entire content marketing strategy, including writing and repurposing blogs, emails, and social media posts with a strong focus on SEO to drive traffic and generate leads.",
    learningOutcomes: ["Developing a comprehensive content marketing strategy.", "Writing for different formats (blogs, emails, social media).", "Understanding and implementing SEO best practices.", "Repurposing long-form content into multiple assets.", "Analyzing content performance and using data to inform strategy."],
    whoIsThisFor: "Writers, social media managers, and marketing assistants who want to oversee a company's entire content ecosystem.",
    curriculum: ["Week 1: Content Strategy & SEO Foundations", "Week 2: Long-Form Content Creation (Blogging)", "Week 3: Email Marketing & Nurture Sequences", "Week 4: Content Repurposing & Distribution", "Week 5: Analytics & Performance Tracking", "Week 6: Building a Cohesive Content Plan"],
    careerOpportunities: ["Content Manager", "Content Marketing Manager", "SEO Specialist", "Copywriter"],
  },
  "launch-affiliate-management": {
    title: "Launch & Affiliate Management",
    duration: "8 Weeks",
    price: 95000,
    overview: "Specialize in high-impact, revenue-focused projects. This course trains you to manage product launches from start to finish and to build and run successful affiliate programs, positioning you as a key player in a company's growth.",
    learningOutcomes: ["Managing the entire project timeline for a digital product launch.", "Coordinating with marketing, tech, and content teams.", "Building and managing relationships with affiliates.", "Tracking launch metrics and affiliate performance.", "Understanding different launch models and profit-sharing structures."],
    whoIsThisFor: "Project managers, marketing managers, and experienced VAs who want to specialize in the profitable niches of launch and affiliate management.",
    curriculum: ["Week 1-2: Anatomy of a Digital Launch", "Week 3: Project Management for Launches", "Week 4: Launch Marketing & Copy", "Week 5: Building an Affiliate Program from Scratch", "Week 6: Affiliate Recruitment & Management", "Week 7: Tracking, Payouts & Legal", "Week 8: Post-Launch Analysis & Debrief"],
    careerOpportunities: ["Launch Manager", "Affiliate Manager", "Project Manager (Marketing)", "Online Business Manager"],
  },
  "pinterest-marketing-expert": {
    title: "Pinterest Marketing Expert",
    duration: "4 Weeks",
    price: 45000,
    overview: "Master the unique blend of SEO, graphic design, and content marketing required for Pinterest success. Learn how to use this powerful visual search engine to drive organic traffic, generate leads, and convert sales for clients.",
    learningOutcomes: ["Developing a Pinterest-specific SEO and keyword strategy.", "Designing compelling pins and video pins.", "Using scheduling tools to manage a content calendar.", "Analyzing Pinterest analytics to optimize strategy.", "Converting Pinterest traffic into email subscribers and sales."],
    whoIsThisFor: "Virtual assistants, graphic designers, and content marketers looking for a creative and in-demand niche with schedule flexibility.",
    curriculum: ["Week 1: Pinterest as a Search Engine (SEO & Strategy)", "Week 2: Pin Design & Video Content Creation", "Week 3: Scheduling, Board Management & Tailwind", "Week 4: Analytics, Funnels & Monetization"],
    careerOpportunities: ["Pinterest Manager", "Pinterest VA", "Social Media Manager", "Visual Content Specialist"],
  },
  "professional-copywriting": {
    title: "Professional Copywriting for Web & Email",
    duration: "7 Weeks",
    price: 80000,
    overview: "Learn the high-income skill of writing words that sell. This course covers the fundamentals of persuasive writing for various digital formats, including emails, sales pages, landing pages, social posts, and blogs, even in the age of AI.",
    learningOutcomes: ["Understanding core copywriting principles and frameworks.", "Writing compelling headlines and calls-to-action.", "Crafting high-converting sales pages and landing pages.", "Writing effective email marketing sequences.", "Adapting messaging for different platforms and audiences.", "Using AI as a writing assistant, not a replacement."],
    whoIsThisFor: "Aspiring writers, marketers, and anyone who wants to learn how to write persuasive copy to drive business results.",
    curriculum: ["Week 1: Foundations of Persuasive Copy", "Week 2-3: Mastering Sales Pages & Landing Pages", "Week 4-5: Email Copywriting & Automation Sequences", "Week 6: Writing for Social Media & Blogs", "Week 7: Building a Portfolio & Pricing Your Services"],
    careerOpportunities: ["Copywriter", "Content Strategist", "Email Marketing Specialist", "Conversion Rate Optimizer"],
  },
  "virtual-executive-assistant": {
    title: "Virtual Executive Assistant",
    duration: "5 Weeks",
    price: 60000,
    overview: "Master the art of high-level executive support for global founders and remote teams. This course focuses on advanced scheduling, proactive communication, and the strategic thinking required to be a true partner to an executive.",
    learningOutcomes: ["Managing complex international scheduling and travel.", "Proactive communication and inbox management strategies.", "Handling high-stakes meeting preparation and follow-up.", "Becoming a strategic partner to a busy executive."],
    whoIsThisFor: "Experienced administrative professionals ready to step up to support fast-paced founders and executives in a remote environment.",
    curriculum: ["Week 1: The Strategic Mindset of a Virtual EA", "Week 2: Mastering Global Calendars & Timezones", "Week 3: Executive Communication & Inbox Zero", "Week 4: Project & Meeting Management", "Week 5: Building a Trusted Executive Partnership"],
    careerOpportunities: ["Virtual Executive Assistant", "Remote Executive Business Partner", "Founder's Assistant"],
  },
  "virtual-cfo": {
    title: "Virtual CFO (vCFO)",
    duration: "8 Weeks",
    price: 150000,
    overview: "Transition from bookkeeping to strategic financial leadership. This course teaches you how to provide Virtual CFO services, covering financial planning, budgeting, cash flow forecasting, and reporting for startups and SMEs.",
    learningOutcomes: ["Developing comprehensive financial models and forecasts.", "Creating and managing budgets for startups and SMEs.", "Analyzing cash flow and providing strategic advice.", "Preparing investor-ready financial reports and dashboards."],
    whoIsThisFor: "Accountants, bookkeepers, and finance professionals who want to offer high-value strategic financial advisory services remotely.",
    curriculum: ["Week 1-2: Foundations of Strategic Financial Planning", "Week 3-4: Advanced Budgeting & Forecasting Techniques", "Week 5: Cash Flow Management & Optimization", "Week 6: Key Performance Indicator (KPI) Dashboards", "Week 7: Financial Reporting for Investors & Stakeholders", "Week 8: Pricing and Packaging Your vCFO Services"],
    careerOpportunities: ["Virtual CFO", "Fractional CFO", "Financial Strategist", "Finance Consultant"],
  },
  "compliance-legal-assistant": {
    title: "Compliance & Legal Assistant",
    duration: "6 Weeks",
    price: 75000,
    overview: "Become a vital asset to any business by supporting their legal and compliance needs remotely. This course covers corporate filings, contract management, NDA handling, and understanding key compliance frameworks for modern businesses.",
    learningOutcomes: ["Assisting with corporate filings and maintaining records.", "Drafting and managing standard contracts and NDAs.", "Understanding key corporate compliance frameworks.", "Supporting the legal needs of a business in a virtual environment."],
    whoIsThisFor: "Paralegals, administrative professionals, and detail-oriented individuals looking to specialize in the in-demand field of remote legal and compliance support.",
    curriculum: ["Week 1: Introduction to Corporate Compliance", "Week 2: Managing Corporate Filings & Records", "Week 3-4: Contract Lifecycle Management (Drafting & Review)", "Week 5: Understanding NDAs and Confidentiality", "Week 6: Supporting a Remote Legal Department"],
    careerOpportunities: ["Compliance Assistant", "Legal Assistant", "Contracts Administrator", "Remote Paralegal", "Remote Compliance Officer"],
  },
  "digital-business-assistant": {
    title: "Digital Business Assistant",
    duration: "4 Weeks",
    price: 40000,
    overview: "This foundational course equips you with the essential skills to provide excellent remote administrative support. You will learn to manage CRM systems, handle customer emails professionally, and perform crucial data handling tasks.",
    learningOutcomes: ["Efficiently managing and updating CRM systems (e.g., HubSpot, Salesforce).", "Handling customer service emails with professional templates.", "Performing data entry, cleaning, and basic analysis.", "Providing reliable, all-around administrative support to a digital business."],
    whoIsThisFor: "Individuals new to remote work or looking to build a strong foundation in virtual administration before specializing further.",
    curriculum: ["Week 1: The Digital Admin's Toolkit", "Week 2: CRM Management & Best Practices", "Week 3: Professional Email & Customer Communication", "Week 4: Data Handling & Reporting Fundamentals"],
    careerOpportunities: ["Digital Business Assistant", "Remote Administrative Assistant", "CRM Assistant", "Data Entry Specialist"],
  },
  "sales-crm-assistant": {
    title: "Sales & CRM Assistant",
    duration: "5 Weeks",
    price: 50000,
    overview: "Become an essential part of a sales team by learning to support online sales processes. This course focuses on managing and updating CRMs, qualifying leads, and ensuring a smooth handoff to the sales team, all in a remote setting.",
    learningOutcomes: ["Mastery of popular CRM platforms for sales support.", "Lead qualification and data enrichment techniques.", "Managing sales pipelines and updating deal stages.", "Efficiently handling client leads and initial communications."],
    whoIsThisFor: "Detail-oriented individuals who want to work in a sales environment without being a commissioned salesperson, supporting the team's efficiency and success.",
    curriculum: ["Week 1: The Modern Sales Process & Funnel", "Week 2: Deep Dive into CRM Management", "Week 3: Lead Generation & Qualification", "Week 4: Supporting the Sales Team & Reporting", "Week 5: Tools and Tech for Sales Assistants"],
    careerOpportunities: ["Sales Assistant", "CRM Assistant", "Sales Support Specialist", "Sales Operations Assistant"],
  },
  "remote-marketing-assistant": {
    title: "Remote Marketing Assistant",
    duration: "4 Weeks",
    price: 45000,
    overview: "Get hands-on with the tools that power modern marketing teams. This practical course covers social media scheduling, email marketing campaign setup, and content management, making you a ready-to-hire remote marketing assistant.",
    learningOutcomes: ["Using social media scheduling tools like Buffer or Hootsuite.", "Setting up and sending email campaigns with platforms like Mailchimp.", "Basic content scheduling and management for blogs.", "Understanding marketing analytics to track campaign performance."],
    whoIsThisFor: "Individuals looking for a practical, tool-focused entry into marketing that provides immediately applicable skills for remote roles.",
    curriculum: ["Week 1: Introduction to the Marketing Tech Stack", "Week 2: Social Media Scheduling & Management", "Week 3: Email Marketing Campaign Execution", "Week 4: Content Publishing & Basic Analytics"],
    careerOpportunities: ["Remote Marketing Assistant", "Social Media Coordinator", "Email Marketing Assistant"],
  }
};

const CourseDetail = () => {
  const { id } = useParams();
  const course = courseData[id];
  const { symbol, rate } = useContext(CurrencyContext);

  const handleEnroll = (courseDetails) => {
    const courseToStore = {
      id: id, // Use the id from URL params
      title: courseDetails.title,
      price: courseDetails.price, // Store the base price in NGN
    };
    localStorage.setItem("selectedCourse", JSON.stringify(courseToStore));
    window.location.href = "/checkout";
  };

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <h2>Course Not Found</h2>
        <Link to="/courses" className="btn btn-outline-primary mt-3">
          Go Back to Courses
        </Link>
      </div>
    );
  }

  const displayPrice = (course.price * rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <Helmet>
        <title>{course.title} | Taxly Academy</title>
        <meta name="description" content={course.overview} />
        <meta property="og:title" content={`${course.title} | Taxly Academy`} />
        <meta property="og:description" content={course.overview} />
      </Helmet>

      <Hero
        backgroundImage="/images/single-course-banner.jpg"
        title={course.title}
        subtitle="Master in-demand skills with our expert-led, hands-on training."
      />

      <section className="course-detail-section py-5">
        <div className="container">
          <div className="row">
            {/* Main Content Column */}
            <div className="col-lg-8">
              <div className="course-content">
                <h2 className="mb-3">Course Overview</h2>
                <p className="lead">{course.overview}</p>

                <h3 className="mt-5">What You'll Learn</h3>
                <ul className="list-unstyled outcome-list">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <li key={idx}>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {outcome}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-5">Who Is This Course For?</h3>
                <p>{course.whoIsThisFor}</p>

                <h3 className="mt-5">Career Opportunities</h3>
                <div className="d-flex flex-wrap">
                    {course.careerOpportunities.map((job, idx) => (
                        <span key={idx} className="badge bg-secondary text-dark m-1">{job}</span>
                    ))}
                </div>

                <h3 className="mt-5">Curriculum</h3>
                <div className="accordion" id="curriculumAccordion">
                  {course.curriculum.map((topic, idx) => (
                    <div className="accordion-item" key={idx}>
                      <h2 className="accordion-header" id={`heading${idx}`}>
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`}>
                          {topic}
                        </button>
                      </h2>
                      <div id={`collapse${idx}`} className="accordion-collapse collapse" data-bs-parent="#curriculumAccordion">
                        <div className="accordion-body">
                          Detailed lesson plans, resources, and assignments for this module will be provided upon course enrollment.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="col-lg-4">
              <div className="course-sidebar card shadow-sm p-4">
                <h4 className="mb-3">{course.title}</h4>
                <p className="display-6 text-primary fw-bold">
                  {symbol}
                  {displayPrice}
                </p>
                <p className="text-muted">Duration: {course.duration}</p>
                <button
                  className="btn btn-primary btn-lg w-100 mt-3"
                  onClick={() => handleEnroll(course)}
                >
                  Enroll Now
                </button>
                <div className="mt-4">
                  <h5 className="mb-3">Course Features</h5>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-camera-video me-2"></i>Live expert-led sessions</li>
                    <li><i className="bi bi-file-earmark-text me-2"></i>Hands-on projects</li>
                    <li><i className="bi bi-people me-2"></i>Community support</li>
                    <li><i className="bi bi-patch-check me-2"></i>Certificate of completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseDetail;
