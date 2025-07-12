import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img src={post.image} className="card-img-top" alt={post.title} loading="lazy" />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text">{post.summary}</p>
          <p className="text-muted small">{post.date}</p>
          <Link to={`/blog/${post.id}`} className="btn btn-outline-primary mt-auto">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
