import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    credit: v.number(),
    subscriptionId: v.optional(v.string()),
  }),
});
