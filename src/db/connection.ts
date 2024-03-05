import mongoose from 'mongoose';


let url : string;

if(process.env.NODE_ENV === 'production') {
    url = process.env.MONGO_URL!;
} else {
    url = "mongodb://localhost:27017/test"
}


export async function connectToMongoDB() {  
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

connectToMongoDB();

export default mongoose;
