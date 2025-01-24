const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)
const assert = require('node:assert')

const { test, after, beforeEach, describe } = require('node:test')
const Note = require('../models/note')

const helper = require('./test_helper')

describe('when there are some notes saved initially', () => {
  beforeEach(async () => {
    await Note.deleteMany({})

    const noteObjects = helper.initialNotes
      .map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'John Root', passwordHash })

    const tryarray = await user.save()
    promiseArray.push(tryarray)
    await Promise.all(promiseArray)
  })


  test.only('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  test.only('all notes returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()

      const noteToView = notesAtStart[0]


      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })
    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/notes/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })

  })
  describe('addition of a new note', () => {

    test('succeed with valid data', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]

      //get the token from user
      const userForToken = {
        username: user.username,
        password: 'sekret'
      }

      const responseToken = await api
        .post('/api/login')
        .send(userForToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newNote =  new Note({
        content: 'async/await simplifies making async calls',
        important: true,
        user: user.id
      })

      const newNoteObj = newNote.toObject()
      delete newNoteObj._id
      await api
        .post('/api/notes')
        .send(newNoteObj)
        .set('Authorization', `Bearer ${responseToken.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)
      const contents = notesAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('note without content is not added', async () => {

      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]
      //get the token from user
      const userForToken = {
        username: user.username,
        password: 'sekret'
      }

      const responseToken = await api
        .post('/api/login')
        .send(userForToken)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newNote = new Note({
        important: true,
        user: user.id
      })
      const newNoteObj = newNote.toObject()
      delete newNoteObj._id


      await api
        .post('/api/notes')
        .send(newNoteObj)
        .set('Authorization', `Bearer ${responseToken.body.token}`)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {

    test('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]


      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      const contents = notesAtEnd.map(r => r.content)
      assert(!contents.includes(noteToDelete.content))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })


})

after(async () => {
  await mongoose.connection.close()
})