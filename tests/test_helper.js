const Note = require('../models/note')
const Blog = require('../models/blog')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]
const initialBlogs = [
  {
    title:'A random blog name',
    author:'John Doe',
    url:'https://www.google.com/',
    likes:3
  },
  {
    title:'Another random blog name',
    author:'Alice Doe',
    url:'https://www.google.com/',
    likes:8
  },
  {
    title:'Yet, this is blog name, at random',
    author:'Amanda Doe',
    url:'https://www.google.com/',
    likes:12
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}
const blogNonExistingId = async () => {
  const blog = new Blog({
    title:'non existing id',
    author:'non existing Doe',
    url:'https://www.google.com/',
    likes:0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const blogInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialNotes,
  initialBlogs,
  nonExistingId,
  blogNonExistingId,
  notesInDb,
  blogInDb
}