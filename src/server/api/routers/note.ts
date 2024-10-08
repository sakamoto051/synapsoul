import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import fs from "node:fs/promises";
import path from "node:path";

export const noteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        bookId: z.number(),
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = Number(ctx.session.user.id);
      return ctx.db.note.create({
        data: {
          title: input.title,
          content: input.content,
          isPublic: input.isPublic,
          book: { connect: { id: input.bookId } },
          user: { connect: { id: userId } },
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.note.findUnique({
        where: { id: input.id },
        include: {
          book: {
            include: {
              user: {
                select: {
                  name: true,
                  displayName: true,
                },
              },
            },
          },
          attachments: true,
        },
      });
      if (!note) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Note not found" });
      }
      return note;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string(),
        isPublic: z.boolean(),
        attachments: z.array(
          z.object({
            fileName: z.string(),
            filePath: z.string(),
            mimeType: z.string(),
          }),
        ),
        removedAttachmentIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = Number(ctx.session.user.id);
      const note = await ctx.db.note.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!note || note.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this note",
        });
      }

      // 削除対象の添付ファイルを取得
      if (input.removedAttachmentIds && input.removedAttachmentIds.length > 0) {
        await ctx.db.attachment.deleteMany({
          where: {
            id: { in: input.removedAttachmentIds },
            noteId: input.id,
          },
        });
      }

      return ctx.db.note.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          isPublic: input.isPublic,
          attachments: {
            create: input.attachments,
          },
        },
        include: { attachments: true },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.db.note.findUnique({
        where: { id: input.id },
        include: { attachments: true },
      });

      if (!note) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Note not found" });
      }

      for (const attachment of note.attachments) {
        const filePath = path.join(
          process.cwd(),
          "public",
          attachment.filePath,
        );
        try {
          await fs.unlink(filePath);
        } catch (error) {
          // console.error(`Failed to delete file: ${filePath}`, error);
        }
      }

      await ctx.db.note.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  downloadAttachment: protectedProcedure
    .input(z.object({ attachmentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const attachment = await ctx.db.attachment.findUnique({
        where: { id: input.attachmentId },
      });

      if (!attachment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Attachment not found",
        });
      }

      const filePath = path.join(process.cwd(), "public", attachment.filePath);
      const fileContent = await fs.readFile(filePath, { encoding: "base64" });

      return {
        fileName: attachment.fileName,
        fileContent,
        mimeType: attachment.mimeType,
      };
    }),

  getPublicNotesByIsbn: publicProcedure
    .input(z.object({ isbn: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.note.findMany({
        where: {
          book: {
            isbn: input.isbn,
          },
          isPublic: true,
        },
        include: {
          book: {
            include: {
              user: true,
            },
          },
          attachments: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  getPublicNoteById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.note.findUnique({
        where: { id: input.id, isPublic: true },
        include: {
          book: {
            include: {
              user: {
                select: {
                  name: true,
                  displayName: true,
                },
              },
            },
          },
          attachments: true,
        },
      });

      if (!note || !note.isPublic) {
        throw new Error("Note not found or not public");
      }

      return note;
    }),
});

export const fileRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(z.object({ file: z.any() }))
    .mutation(async ({ input }) => {
      // This is a placeholder for file upload logic
      // In a real application, you would handle file upload to a storage service here
      // and return the URL of the uploaded file
      const fileUrl = `https://example.com/uploads/${(input.file as { filename: string }).filename}`;
      return { url: fileUrl };
    }),
});
