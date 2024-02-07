import mongoose from "mongoose";

export async function mongooseConnect() {

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            console.error('MONGODB_URI env variable is not defined');
            process.exit(1);
        }

        try {
            await mongoose.connect(mongoURI);
        } catch (error) {
            console.log('Could not connect to db', error);
            return;
        }
        // mongoose.Promise = global.Promise;
    }
};




