const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]
const listWithMultipleBlog =[
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d12k2',
    title: 'another example',
    author: 'Mr Doe',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/mrDoe.pdf',
    likes: 22,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d12m6',
    title: 'again another example',
    author: 'Mme Doe',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/mmeDoe.pdf',
    likes: 63,
    __v: 0
  }
]
const listWithMultipleTopBlogs =[
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d12k2',
    title: 'another example',
    author: 'Mr Doe',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/mrDoe.pdf',
    likes: 22,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d12m6',
    title: 'again another example',
    author: 'Mme Doe',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/mmeDoe.pdf',
    likes: 63,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d19p3',
    title: 'again another example TWIN',
    author: 'Mme DoeTwin',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/mmeDoeTwin.pdf',
    likes: 63,
    __v: 0
  }
]
describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMultipleBlog)
    assert.strictEqual(result, 90)
  })
}
)

describe('favorite blog', () => {
  test('of empty list is empty blog', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, {
      title: '',
      author: '',
      likes: 0
    })
  })
  test('of a list gets right item', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlog)
    assert.deepStrictEqual(result,
      {
        title: 'again another example',
        author: 'Mme Doe',
        likes: 63
      }
    )
  })
  test('of a list with multiple tops gets right item', () => {
    const result = listHelper.favoriteBlog(listWithMultipleTopBlogs)
    assert.deepStrictEqual(result,
      {
        title: 'again another example',
        author: 'Mme Doe',
        likes: 63
      }
    )
  })
})