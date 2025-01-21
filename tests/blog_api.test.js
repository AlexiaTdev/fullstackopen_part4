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
})

after(async () => {
  await mongoose.connection.close()
})