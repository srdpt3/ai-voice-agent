import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const CreateUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // if user already exists, return the user id
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    if (user.length > 0) {
      return user[0];
    }
    const data = {
      email: args.email,
      name: args.name,
      credit: 50000,
    };
    const result = await ctx.db.insert("users", {
      ...data,
    });
    return data;
  },
});

export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});
