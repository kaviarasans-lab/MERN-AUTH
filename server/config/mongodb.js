import mongoose from "mongoose";

const connectDb = async () => {
    mongoose.connection.on("connected", () =>
        console.log("Database Connected Successfully")
    );

    await mongoose.connect(`${process.env.MONGODB_URL}/MERN_AUTH`);
};

export default connectDb;
