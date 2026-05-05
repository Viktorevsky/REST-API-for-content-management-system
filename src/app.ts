import Fastify from 'fastify'

const app = Fastify({logger: true})

type User = { id: number; name: string }
type Post = { id: number; title: string; content: string }

let users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
]

let posts: Post[] = [
  { id: 1, title: 'First Post', content: 'This is the first post.' },
  { id: 2, title: 'Second Post', content: 'This is the second post.' },
  { id: 3, title: 'Third Post', content: 'This is the third post.' }
]

app.get('/', async (request, reply) => {
    
  return { status: 'ok' }
})

app.get('/users', async (request, reply) => {
  return users 
})

app.get('/posts', async (request, reply) => {
  return posts
})

app.post('/users', async (request, reply) => {
  let {name} = request.body as { name?: string } 
  if(!name){
    return reply.status(400).send({ error: 'Name is required' })  
  }
  let newUser = { id: users.length+1, name }
  users.push(newUser)
  return newUser
})

app.post('/posts', async (request, reply) => {
  if(!request.body){
    return reply.status(400).send({ error: 'Title and content are required' })  
  }
  let { title, content } = request.body as { title?: string; content?: string }
  if(!title || !content){
    return reply.status(400).send({ error: 'Title and content are required' })  
  }
  let newPost = { id: posts.length+1, title, content }
  posts.push(newPost)
  return newPost
})

export default app