import EnvVars from "@/constants/EnvVars";
import nextSession from 'next-session';
import { expressSession, promisifyStore } from "next-session/lib/compat";

//session
const mongoURI = EnvVars.DB.URI;
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const store = new MongoDBStore({
    uri: mongoURI,
    collection: 'Sessions'
});
store.on('error', function (err: Error) {
    console.error(err);
});

export const getSession = nextSession({
    name: 'dsoj_session',
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }
)