import mongoose, { Mongoose } from "mongoose";
import { env } from "process";

export async function connectDB(cb?: (err: Error | null, conn: Mongoose | null) => void){
    try{
        console.log('mongose url:', env.MONGO_LOCAL_URI!)
        let connection = await mongoose.connect(env.MONGO_LOCAL_URI!);
        if(cb) cb(null, connection);
    }catch(err: any){
        console.log(err.message);
        if(cb) cb(err, null);

    }
}