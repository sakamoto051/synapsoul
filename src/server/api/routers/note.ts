import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import fs from "node:fs/promises";
import path from "node:path";

export const noteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        bookId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const book = await ctx.db.book.findFirst({
        where: {
          id: input.bookId,
          userId: Number(ctx.session.user.id),
        },
      });

      if (!book) {
        throw new Error("Book not found or you don't have permission");
      }

      return ctx.db.note.create({
        data: {
          title: input.title,
          content: input.content,
          book: {
            connect: { id: input.bookId },
          },
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
        attachments: z
          .array(
            z.object({
              fileName: z.string(),
              fileContent: z.string(), // Base64エンコードされたファイル内容
              mimeType: z.string(),
            }),
          )
          .optional(),
        removedAttachmentIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, content, attachments, removedAttachmentIds } = input;

      // 削除する添付ファイルの処理
      try {
        const attachmentsToRemove = await ctx.db.attachment.findMany({
          where: { id: { in: removedAttachmentIds }, noteId: id },
        });

        for (const attachment of attachmentsToRemove) {
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

        await ctx.db.attachment.deleteMany({
          where: { id: { in: removedAttachmentIds }, noteId: id },
        });
      } catch (error) {
        console.error("Failed to process removed attachments:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process removed attachments",
        });
      }

      // 新しい添付ファイルの保存
      const savedAttachments = [];
      if (attachments && attachments.length > 0) {
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // アップロードディレクトリの存在確認と作成
        try {
          await fs.access(uploadDir);
        } catch (error) {
          await fs.mkdir(uploadDir, { recursive: true });
        }

        for (const attachment of attachments) {
          const fileName = `${Date.now()}-${attachment.fileName}`;
          const filePath = path.join(uploadDir, fileName);

          try {
            const fileBuffer = Buffer.from(
              attachment.fileContent?.split(",")[1] ?? "",
              "base64",
            );
            await fs.writeFile(filePath, fileBuffer);

            savedAttachments.push({
              fileName: attachment.fileName,
              filePath: `/uploads/${fileName}`,
              mimeType: attachment.mimeType,
            });
          } catch (error) {
            console.error(`Failed to save file: ${fileName}`, error);
            console.error(
              `File details: ${JSON.stringify(
                {
                  fileName: attachment.fileName,
                  mimeType: attachment.mimeType,
                  contentLength: attachment.fileContent.length,
                },
                null,
                2,
              )}`,
            );
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Failed to save attachment: ${(error as Error).message}`,
            });
          }
        }
      }

      // ノートの更新
      try {
        const updatedNote = await ctx.db.note.update({
          where: { id },
          data: {
            title,
            content,
            attachments: {
              create: savedAttachments,
            },
          },
          include: { attachments: true },
        });

        return updatedNote;
      } catch (error) {
        console.error("Failed to update note:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update note",
        });
      }
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
