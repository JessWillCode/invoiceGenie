import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from '../context';

const t = initTRPC.context<Context>().create();

export const authRouter = t.router({
  login: t.procedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      // TODO: Implement authentication logic
      throw new Error('Authentication not implemented yet');
    }),

  register: t.procedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
    }))
    .mutation(async ({ input }) => {
      // TODO: Implement registration logic
      throw new Error('Registration not implemented yet');
    }),

  logout: t.procedure
    .mutation(async () => {
      // TODO: Implement logout logic
      return { success: true };
    }),

  me: t.procedure
    .query(async ({ ctx }) => {
      // TODO: Return current user info
      return ctx.user;
    }),
}); 