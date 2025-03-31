import { mutation } from "./_generated/server";
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
