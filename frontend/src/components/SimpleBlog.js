import React from 'react'

const SimpleBlog = ({ blog, onClick }) => (
  <div>
    <div className="ta">
      {blog.title} {blog.author}
    </div>
    <div className="l">
      blog has {blog.likes} likes
      <button onClick={onClick}>like</button>
    </div>
  </div>
)

export default SimpleBlog