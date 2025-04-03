import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createDiscussionRoom = mutation({
  args: {
    topic: v.string(),
    expert: v.string(),
    coachingOption: v.string(),
  },
  handler: async (ctx, args) => {
    const { topic, expert, coachingOption } = args;
    // const userId = await getAuthUserId(ctx);
    // if (!userId) {
    //   throw new Error("Unauthorized");
    // }
    const discussionRoomId = await ctx.db.insert("DiscussionRoom", {
      topic,
      expert,
      coachingOption,
    });
    return discussionRoomId;
  },
});

export const GetDiscussionRoom = query({
  args: {
    id: v.id("DiscussionRoom"),
  },
  handler: async (ctx, args) => {
    const discussionRoom = await ctx.db.get(args.id);
    return discussionRoom;
  },
});
