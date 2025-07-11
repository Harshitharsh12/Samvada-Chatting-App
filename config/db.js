import mongoose from "mongoose";
import color from "colors";
const db = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Database ${con.connection.host} Connected Successfully!!`.bgMagenta.white
    );
  } catch (err) {
    console.log(`Error In MongoDb Connection ${err}`.bgRed.white);
  }
};

export default db;
