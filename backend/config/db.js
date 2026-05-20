import mongoose from 'mongoose'

export const ConnectDb = async ()=>{
  try {

    const dbConnect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`db connection successfuly make on ${dbConnect.connection.host}`)
  } catch (error) {
    process.exit(1)
    console.log(`somethign went wrong while making db connection ${error}`)

  }
}
