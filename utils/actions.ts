"use server";

import { profileSchema } from "./schemas";
import db from "./db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProfileAction(prevState: any, formData: FormData) {
  try {
    // get user info from clerk
    const user = await currentUser();
    if (!user) throw new Error("Please login to create a profile");

    // apply validation
    const rawData = Object.fromEntries(formData);
    const validatedFields = profileSchema.parse(rawData);

    // create user profile to database
    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });

    // update metadata to clerk user
    const client = await clerkClient();
    client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });

    // return { message: "Profile Created" };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
  redirect('/');
}

export async function fetchProfileImage() {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });

  return profile?.profileImage;
}