import 'dotenv/config'
import app from './src/app'

app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) process.exit(1)
  console.log('Server running on port 3000')
})