// src/types/feedback.ts
import type {
  Feedback as PrismaFeedback,
  FeedbackReaction as PrismaFeedbackReaction,
  ReactionType as PrismaReactionType,
} from "@prisma/client";

export type Feedback = PrismaFeedback;
export type FeedbackReaction = PrismaFeedbackReaction;
export type ReactionType = PrismaReactionType;
