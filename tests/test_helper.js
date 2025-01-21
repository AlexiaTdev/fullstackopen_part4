const Note = require('../models/note')

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
    title:'Another random blog name',
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

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes,
  initialBlogs,
  nonExistingId,
  notesInDb
}