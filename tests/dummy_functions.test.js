const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const listContent = require('./testLists')

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})


describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listContent.listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listContent.listWithMultipleBlog)
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
    const result = listHelper.favoriteBlog(listContent.listWithMultipleBlog)
    assert.deepStrictEqual(result,
      {
        title: 'again another example',
        author: 'Mme Doe',
        likes: 63
      }
    )
  })
  test('of a list with multiple tops gets right item', () => {
    const result = listHelper.favoriteBlog(listContent.listWithMultipleTopBlogs)
    assert.deepStrictEqual(result,
      {
        title: 'again another example',
        author: 'Mme Doe',
        likes: 63
      }
    )
  })
})
describe('prolific author', () => {
  test('of empty list is empty blog', () => {
    const result = listHelper.mostBlogs([])
    assert.deepStrictEqual(result, {
      author: '',
      blogs:0
    })
  })
  test('of a list gets right author', () => {
    const result = listHelper.mostBlogs(listContent.listWithProlificAuthorsBlogs)
    assert.deepStrictEqual(result,
      {
        author: 'Mme Doe',
        blogs: 2
      }
    )
  })
  test('of a list with multiple prolific authors gets one of the top authors', () => {
    const result = listHelper.mostBlogs(listContent.listWithMultipleProlificAuthorsBlogs)
    assert.deepStrictEqual(result,
      {
        author: 'Mr Doe',
        blogs: 2
      }
    )
  })
})
describe('top votes author', () => {
  test('of empty list is empty author and totalLikes', () => {
    const result = listHelper.mostLikes([])
    assert.deepStrictEqual(result, {
      author: '',
      likes:0
    })
  })
  test('of a list gets right author and total number of votes', () => {
    const result = listHelper.mostLikes(listContent.listWithMultipleProlificAuthorsBlogs)
    assert.deepStrictEqual(result,
      {
        author: 'Mme Doe',
        likes: 71
      }
    )
  })
  test('of a list with multiple top voted authors gets one of the top voted authors', () => {
    const result = listHelper.mostLikes(listContent.listWithMultipleTopVotedAuthorsBlogs)
    assert.deepStrictEqual(result,
      {
        author: 'Mr Doe',
        likes: 30
      }
    )
  })
})