import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { Firestore } from '@google-cloud/firestore';

export interface Context {
  db: Firestore;
  user?: {
    id: string;
    email: string;
  };
}

export const createContext = async (opts: CreateExpressContextOptions): Promise<Context> => {
  const db = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  // TODO: Add authentication middleware
  // For now, return basic context
  return {
    db,
    user: undefined,
  };
}; 