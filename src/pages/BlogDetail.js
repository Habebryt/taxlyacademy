import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import blogData from "../data/blogData";

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogData.find((b) => b.id === parseInt(id));

  if (!post) return <p className="text-center mt-5">Blog not found.</p>;

  return (
    <>
      <Helmet>
        <title>{post?.title ?? "Blog Post"} | Taxly Academy</title>
        <meta
          name="description"
          content={
            post?.summary ??
            "Read this blog article on virtual careers and skills."
          }
        />
        <meta
          property="og:title"
          content={`${post?.title ?? "Blog Post"} | Taxly Academy`}
        />
        <meta
          property="og:description"
          content={
            post?.summary ?? "Insightful content for virtual professionals."
          }
        />
      </Helmet>

      <section className="blog-detail-section py-5">
        <div className="container">
          <h1 className="mb-3">{post.title}</h1>
          <p className="text-muted small">Published on {post.date}</p>
          <img
            src={post.image}
            alt={post.title}
            className="img-fluid mb-4 rounded"
          />
          <p>{post.content}</p>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;
