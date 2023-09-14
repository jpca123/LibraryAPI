import mongoose, { Connection, Mongoose } from "mongoose";
import { env } from "process";

export async function connectDB(): Promise<{error?: Error, connection?: Mongoose}>{
	try{
		let url = env.MONGO_LOCAL_URI!;
		let connection = await mongoose.connect(url);
		return {connection};
	}catch(error: any){
		return {error};
	}
}
