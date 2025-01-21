const dummy = (blogs) => {
    return 1;
  }

const totalLikes = (blogs) => {
    var likes = blogs.reduce((acc, current)=> acc += current.likes, 0);
    return likes;
}
  
  module.exports = {
    dummy,
    totalLikes
  }