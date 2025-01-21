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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}