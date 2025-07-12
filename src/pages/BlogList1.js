import React, { useState } from 'react';
import blogData from '../data/blogData';
import BlogCard from '../components/BlogCard';

const BlogList1 = () => {
  const postsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogData.length / postsPerPage);
  const paginatedPosts = blogData.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <section className="blog-list-section py-5">
      <div className="container">
        <h2 className="text-center mb-4">Our Blog</h2>
        <div className="row">
          {paginatedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &larr; Prev
          </button>
          <span className="fw-bold align-self-center">Page {currentPage} of {totalPages}</span>
          <button
            className="btn btn-primary ms-2"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogList1;
