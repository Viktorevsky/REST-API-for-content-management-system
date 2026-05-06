import  app  from '../app'

type Post = { id: number; title: string; content: string }



let posts: Post[] = [
  { id: 1, title: 'First Post', content: 'This is the first post.' },
  { id: 2, title: 'Second Post', content: 'This is the second post.' },
  { id: 3, title: 'Third Post', content: 'This is the third post.' }
]



app.get('/posts', async (request, reply) => {
  return posts
})


app.post('/posts', async (request, reply) => {
  let { title, content } = request.body as { title?: string; content?: string }
  if(!title || !content){
    return reply.status(400).send({ error: 'Title and content are required' })  
  }
  let newPost = { 
  id: posts.length ? posts[posts.length - 1].id + 1 : 1, title, content }
  posts.push(newPost)
  return newPost
})
