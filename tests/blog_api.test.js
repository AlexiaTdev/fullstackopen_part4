const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const assert = require('node:assert')

const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')

const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('blogs api', () => {
  describe('can all be requested', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('are synced with db', async () => {
      const blogsSaved = await helper.blogInDb()
      assert.strictEqual(blogsSaved.length, helper.initialBlogs.length)
    })

    test('unique identifier property of blog post is id', async () => {
      const blogsSaved = await helper.blogInDb()
      const idToTest = blogsSaved[0].id
      assert.strictEqual(blogsSaved.filter((blog) => blog.id===idToTest).length, 1)
    })
  })
  describe('posting of a new blog post', () => {
    test('a valid blog can be added ', async () => {
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
      const newBlog = {
        title:'A beautiful test name',
        author:'Maya Doe',
        url:'https://www.google.com/',
        likes:15
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${responseToken.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      const contents = blogsAtEnd.map(n => n.title)
      assert(contents.includes('A beautiful test name'))
    })
    test('a valid blog without likes can be added ', async () => {
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

      const newBlog = {
        title:'A test without likes',
        author:'Maya Doe',
        url:'https://www.google.com/',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${responseToken.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      const contents = blogsAtEnd.map(n => n.title)
      assert(contents.includes('A test without likes'))
    })
    test('a blog without title can\'t be added ', async () => {
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

      const newBlog = {
        author:'Maya Doe',
        url:'https://www.google.com/',
        likes:15
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${responseToken.body.token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('a blog without url can\'t be added ', async () => {
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

      const newBlog = {
        title:'A test without url',
        author:'Maya Doe',
        likes:15
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${responseToken.body.token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('a valid blog without token can\'t be added ', async () => {

      const newBlog = {
        title:'A beautiful test name without token',
        author:'Maya Doe',
        url:'https://www.google.com/',
        likes:15
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    })
    test('a valid blog with bad token can\'t be added ', async () => {

      const newBlog = {
        title:'A beautiful test name with bad token',
        author:'Maya Doe',
        url:'https://www.google.com/',
        likes:15
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'Bearer AREALLYBADTOKEN123456789')
        .expect(401)
        .expect('Content-Type', /application\/json/)

    })
  })
  describe('deletion of a blog post', () => {
    test('a blog can be deleted', async () => {
      //identify a user for posting and deleting a blog
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

      //post a blog as user
      const newBlog = {
        title:'A future deleted post',
        url:'https://www.google.com/',
        likes:15
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${responseToken.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      //delete the blog
      const blogsAtStart = await helper.blogInDb()
      const blogToDelete = blogsAtStart.find(blog => blog.title === 'A future deleted post')

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${responseToken.body.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogInDb()

      const contents = blogsAtEnd.map(r => r.title)
      assert(!contents.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })
    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.blogNonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })
    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
    test('a blog can\'t be deleted without token', async () => {
      const blogsAtStart = await helper.blogInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
    })
    test('a blog can\'t be deleted with bad token', async () => {
      const blogsAtStart = await helper.blogInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'Bearer AREALLYBADTOKEN123456789')
        .expect(401)
    })
  })
  describe('modification of a blog post', () => {
    test('succeeds with status code 201 for valid informations', async () => {
      const blogsAtStart = await helper.blogInDb()
      const blogToModify = blogsAtStart[0]
      blogToModify.likes+=1

      const resultBlog = await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(blogToModify)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToModify)
    })
    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.blogNonExistingId()

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })
    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .put(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})