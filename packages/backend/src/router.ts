import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { invoiceRouter } from './routers/invoice';
import { clientRouter } from './routers/client';
import { authRouter } from './routers/auth';

const t = initTRPC.create();

export const appRouter = t.router({
  invoice: invoiceRouter,
  client: clientRouter,
  auth: authRouter,
  health: t.procedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),
});

export type AppRouter = typeof appRouter; 