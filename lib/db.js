import { MongoClient, ServerApiVersion } from 'mongodb'

export async function connectToClient() {
  const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.ksorsiy.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })

  return await client.connect()
}
