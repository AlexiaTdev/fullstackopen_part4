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
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const blogsSaved = await helper.blogInDb()
    assert.strictEqual(blogsSaved.length, helper.initialBlogs.length)
  })

  test('unique identifier property of blog post is id', async () => {
    const blogsSaved = await helper.blogInDb()
    const idToTest = blogsSaved[0].id
    assert.strictEqual(blogsSaved.filter((blog) => blog.id===idToTest).length, 1)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title:'A beautiful test name',
      author:'Maya Doe',
      url:'https://www.google.com/',
      likes:15
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const contents = blogsAtEnd.map(n => n.title)
    assert(contents.includes('A beautiful test name'))
  })
  test('a valid blog without likes can be added ', async () => {
    const newBlog = {
      title:'A test without likes',
      author:'Maya Doe',
      url:'https://www.google.com/',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const contents = blogsAtEnd.map(n => n.title)
    assert(contents.includes('A test without likes'))
  })
})

after(async () => {
  await mongoose.connection.close()
})