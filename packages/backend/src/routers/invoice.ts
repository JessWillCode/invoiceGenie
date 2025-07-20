import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from '../context';

const t = initTRPC.context<Context>().create();

const invoiceSchema = z.object({
  id: z.string().optional(),
  clientId: z.string(),
  invoiceNumber: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    amount: z.number(),
  })),
  subtotal: z.number(),
  taxAmount: z.number(),
  total: z.number(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  notes: z.string().optional(),
});

export const invoiceRouter = t.router({
  create: t.procedure
    .input(invoiceSchema)
    .mutation(async ({ input, ctx }) => {
      const invoiceRef = ctx.db.collection('invoices').doc();
      const invoice = {
        ...input,
        id: invoiceRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await invoiceRef.set(invoice);
      return invoice;
    }),

  getById: t.procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const doc = await ctx.db.collection('invoices').doc(input).get();
      if (!doc.exists) {
        throw new Error('Invoice not found');
      }
      return doc.data();
    }),

  list: t.procedure
    .input(z.object({
      limit: z.number().default(10),
      offset: z.number().default(0),
      status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
    }))
    .query(async ({ input, ctx }) => {
      let query = ctx.db.collection('invoices').orderBy('createdAt', 'desc');
      
      if (input.status) {
        query = query.where('status', '==', input.status);
      }
      
      const snapshot = await query.limit(input.limit).offset(input.offset).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }),

  update: t.procedure
    .input(z.object({
      id: z.string(),
      data: invoiceSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      const docRef = ctx.db.collection('invoices').doc(input.id);
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
      await ctx.db.collection('invoices').doc(input).delete();
      return { success: true };
    }),

  sendInvoice: t.procedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      // TODO: Implement email sending logic
      const docRef = ctx.db.collection('invoices').doc(input);
      await docRef.update({
        status: 'sent',
        sentAt: new Date(),
        updatedAt: new Date(),
      });
      return { success: true };
    }),
}); 