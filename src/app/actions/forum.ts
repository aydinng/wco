"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createForumTopic(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (title.length < 2 || body.length < 1) return;
  await prisma.forumTopic.create({
    data: {
      title: title.slice(0, 200),
      authorId: session.user.id,
      posts: {
        create: {
          body: body.slice(0, 8000),
          authorId: session.user.id,
        },
      },
    },
  });
  revalidatePath("/forum");
}

export async function createForumPost(
  topicId: string,
  formData: FormData,
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return;
  const topic = await prisma.forumTopic.findUnique({ where: { id: topicId } });
  if (!topic) return;
  await prisma.forumPost.create({
    data: {
      topicId,
      authorId: session.user.id,
      body: body.slice(0, 8000),
    },
  });
  await prisma.forumTopic.update({
    where: { id: topicId },
    data: { updatedAt: new Date() },
  });
  revalidatePath("/forum");
  revalidatePath(`/forum/${topicId}`);
}
