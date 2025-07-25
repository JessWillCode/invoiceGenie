import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { Client } from 'pg';
import { Request } from 'express';

type Context = {
  db: Client;
  user?: any;
};

export const getUserFromRequest = (req: Request) => {
  // const authHeader = req.headers;
  console.log(req.headers);
}

export const createContext = async (opts: CreateExpressContextOptions): Promise<Context> => {
  const db = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  await db.connect();
  const user = await getUserFromRequest(opts.req);
  return { db, user };
}; 