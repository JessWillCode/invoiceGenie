import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from '../context';

const t = initTRPC.context<Context>().create();

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  taxId: z.string().optional(),
  notes: z.string().optional(),
});

export const clientRouter = t.router({
  create: t.procedure
    .input(clientSchema)
    .mutation(async ({ input, ctx }) => {
      const clientRef = ctx.db.collection('clients').doc();
      const client = {
        ...input,
        id: clientRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await clientRef.set(client);
      return client;
    }),

  getById: t.procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const doc = await ctx.db.collection('clients').doc(input).get();
      if (!doc.exists) {
        throw new Error('Client not found');
      }
      return doc.data();
    }),

  list: t.procedure
    .input(z.object({
      limit: z.number().default(10),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const snapshot = await ctx.db.collection('clients')
        .orderBy('name')
        .limit(input.limit)
        .offset(input.offset)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }),

  update: t.procedure
    .input(z.object({
      id: z.string(),
      data: clientSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      const docRef = ctx.db.collection('clients').doc(input.id);
      const updateData = {
        ...input.data,
        updatedAt: new Date(),
      };
      
      await docRef.update(updateData);
      return { id: input.id, ...updateData };
    }),

  delete: t.procedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.collection('clients').doc(input).delete();
      return { success: true };
    }),

  search: t.procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      // Simple search by name or email
      const snapshot = await ctx.db.collection('clients')
        .where('name', '>=', input)
        .where('name', '<=', input + '\uf8ff')
        .limit(10)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }),
}); 