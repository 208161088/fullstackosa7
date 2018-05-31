const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { format, initialBlogs, nonExistingId, blogsInDb, usersInDb } = require('./test_helper')

describe('when there are initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})
    const blogObjects = initialBlogs.map(b => new Blog(b))
    await Promise.all(blogObjects.map(b => b.save()))
  })

  test('all blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedBlogs = response.body.map(format)
    blogsInDatabase.forEach(blog => {
      expect(returnedBlogs).toContainEqual(blog)
    })
  })


  test('POST /api/blogs succeeds', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog =   {
      _id: "5a422a851b54a676234d17f8",
      title: "Patterns React",
      author: "Chan Michael",
      url: "https://patternsreact.com/",
      likes: 8,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
    expect(blogsAfterOperation).toContainEqual(format(newBlog))
  })

  test('DELETE /api/blogs/:id secceeds', async () => {
    const blogsAtStart = await blogsInDb()
    const response = await api
      .delete('/api/blogs/'+initialBlogs[2]._id)
      .expect(204)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
      expect(blogsAfterOperation).not.toContainEqual(format(initialBlogs[2]))
  })
  
})
describe('when there are initially no blogs saved', async () => {
  test('no blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedBlogs = response.body.map(format)
    blogsInDatabase.forEach(blog => {
      expect(returnedBlogs).toContainEqual(blog)
    })
  })

  test('POST /api/blogs succeeds', async () => {
    //_id on erilainen
    const blogsAtStart = await blogsInDb()

    const newBlog =   {
      _id: "5a422a851b54a676234d17f8",
      title: "Patterns React",
      aor: "Chan Michael",
      url: "https://patternsreact.com/",
      likes: 8,
      __v: 0
      }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
    expect(blogsAfterOperation).toContainEqual(format(newBlog))
  })
  
})

describe('when there is initially one user at db', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
      adult: 'false'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u=>u.username)
    expect(usernames).toContain(newUser.username)
  })
})
afterAll(() => {
  server.close()
})