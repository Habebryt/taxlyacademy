import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/BlogList.css"; 
import Hero from "../components/Hero"; 

const BlogList = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <Helmet>
        <title>Blog | Taxly Academy</title>
        <meta
          name="description"
          content="Read insights, stories, and expert tips on thriving as a virtual professional."
        />
        <meta property="og:title" content="Blog | Taxly Academy" />
        <meta
          property="og:description"
          content="Explore articles on virtual work, productivity, and back-office careers."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/coming-soon.jpg"
        title="Coming Soon"
        subtitle="Our insights, stories, and virtual career tips are almost ready."
        ctaText="Stay Tuned!" // No button will render
      />
      <p
        className="align-text-center lead text-muted"
        data-aos="fade-up"
        style={{ textAlign: "center" }}
      >
        We're working hard to bring you insightful articles, tips, and stories
        from the world of virtual work.
        <br />
        Stay tuned!
      </p>
    </div>
  );
};

export default BlogList;
