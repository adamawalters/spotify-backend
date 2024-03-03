import mongoose from 'mongoose';

const url = /* process.env.MONGO_URL || */ "mongodb://localhost:27017/test_db";

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
