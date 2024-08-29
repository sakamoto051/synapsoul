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
        include: { book: true }, // Include book instead of attachments
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
        attachments: z.array(
          z.object({
            fileName: z.string(),
            fileContent: z.string(), // Base64エンコードされたファイル内容
            mimeType: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, content, attachments } = input;

      // 添付ファイルの保存
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
            // Base64デコードしてファイルを保存
            await fs.writeFile(
              filePath,
              Buffer.from(attachment.fileContent, "base64"),
            );

            savedAttachments.push({
              fileName: attachment.fileName,
              filePath: `/uploads/${fileName}`, // データベースには相対パスを保存
              mimeType: attachment.mimeType,
            });
          } catch (error) {
            console.error(`Failed to save file: ${fileName}`, error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to save attachment",
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

      // 添付ファイルの削除
      for (const attachment of note.attachments) {
        const filePath = path.join(
          process.cwd(),
          "public",
          attachment.filePath,
        );
        await fs.unlink(filePath).catch(() => {
          // ファイルが見つからない場合など、エラーを無視
        });
      }

      // ノートの削除（attachmentsは CASCADE で自動的に削除される）
      await ctx.db.note.delete({
        where: { id: input.id },
      });

      return { success: true };
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
