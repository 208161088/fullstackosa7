let token = null

const blogs = [
  {
    _id: '1',
    title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
    author: 'testauthor',
  },
  {
    _id: '2',
    title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä2',
    author: 'testauthor2',
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

export default { getAll, blogs }