import mongoose from "mongoose"
import dotenv from "dotenv";

const connectDB = async () => {
  try {

     await mongoose.connect(process.env.DB_KEY)

    // console.log(`MongoDB Connected: ${conn.connection.host}`)

  } catch (error) {

    console.error(error.message)
    process.exit(1)

  }
}

export default connectDB