import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

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
        include: { book: true, attachments: true },
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
        attachments: z
          .array(
            z.object({
              fileName: z.string(),
              fileContent: z.string(),
              mimeType: z.string(),
            }),
          )
          .optional(),
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

      // 新しい添付ファイルの処理
      const newAttachments = await Promise.all(
        (input.attachments ?? []).map(async (attachment) => {
          const fileName = `${uuidv4()}-${attachment.fileName}`;
          const filePath = path.join(
            process.cwd(),
            "public",
            "uploads",
            fileName,
          );

          // Base64デコードしてファイルを保存
          const fileBuffer = Buffer.from(
            attachment.fileContent?.split(",")[1] ?? "",
            "base64",
          );
          await fs.writeFile(filePath, fileBuffer);

          return {
            fileName: attachment.fileName,
            filePath: `/uploads/${fileName}`,
            mimeType: attachment.mimeType,
          };
        }),
      );

      return ctx.db.note.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          isPublic: input.isPublic,
          attachments: {
            create: newAttachments,
            deleteMany: input.removedAttachmentIds
              ? { id: { in: input.removedAttachmentIds } }
              : undefined,
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
          console.error(`Failed to delete file: ${filePath}`, error);
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
            }
          },
          attachments: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});

export const fileRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(z.object({ file: z.any() }))
    .mutation(async ({ ctx, input }) => {
      // This is a placeholder for file upload logic
      // In a real application, you would handle file upload to a storage service here
      // and return the URL of the uploaded file
      const fileUrl = `https://example.com/uploads/${input.file.filename}`;
      return { url: fileUrl };
    }),
});
