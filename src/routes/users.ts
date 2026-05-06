import app from '../app'

type User = { id: number; name: string }

let users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
]

app.get('/users', async (request, reply) => {
  return users 
})

app.post('/users', async (request, reply) => {
  let {name} = request.body as { name?: string } 
  if(!name){
    return reply.status(400).send({ error: 'Name is required' })  
  }
  let newUser = { id: users.length ? users[users.length - 1].id + 1 : 1, name }
  users.push(newUser)
  return newUser
})

export default app