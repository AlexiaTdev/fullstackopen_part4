const _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  var likes = blogs.reduce((acc, current) => acc += current.likes, 0)
  return likes
}
const favoriteBlog = (blogs) => {
  var favorite = {
    title: '',
    author: '',
    likes: 0
  }
  blogs.forEach((blog) => {
    if(blog.likes>favorite.likes){
      favorite={
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
    }
  }
  )
  return favorite
}

const mostBlogs = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author');
    const authorWithMostBlogs = _.maxBy(Object.keys(groupedByAuthor), author => groupedByAuthor[author].length);
    return {
        author: authorWithMostBlogs || '',
        blogs: groupedByAuthor[authorWithMostBlogs]?.length || 0
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}