"use server";

import { imageSchema, profileSchema, propertySchema, validateWithZodSchema } from "@/utils/schemas";
import db from "./db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ReactElement } from "react";
import { raw } from "@prisma/client/runtime/library";
import { uploadImage } from "./supabase";

async function getAuthUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }
  if (!user.privateMetadata.hasProfile) redirect("/profile/create");
  return user;
}

function renderError(error: unknown): { message: string } {
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
}

// create a profile for user from database to match with the user from clerk
export async function createProfileAction(prevState: any, formData: FormData) {
  try {
    // get user info from clerk
    const user = await currentUser();
    if (!user) throw new Error("Please login to create a profile");

    // apply validation
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    // create user profile to database
    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress ?? "",
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
    return renderError(error);
  }
  redirect("/");
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

  return profile?.profileImage || (user.imageUrl ?? ""); // show default user image from clerk even before the profile is create in our database.
}

export async function fetchProfile() {
  const user = await getAuthUser();

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!profile) redirect("profile/create");

  return profile;
}

export async function updateProfileAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  const user = await getAuthUser();

  try {
    // apply validation
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });

    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error) {
    return renderError(error);
  }
}

export async function updateProfileImageAction (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  const user = await getAuthUser();
  
  try {
    const image = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFields.image);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });
    
    revalidatePath('/profile');

    return { message: 'Profile image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
}

export const createPropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);

    // apply validation
    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: rawData.image });

    // upload the image
    const fullPath = await uploadImage(validatedFile.image);

    // create property into database
    await db.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
      },
    });

  } catch (error) {
    return renderError(error);
  }
  
  redirect('/');
};

export async function fetchProperties ({
  search = '',
  category,
}: {
  search?: string;
  category?: string;
}) {
  const properties = await db.property.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      image: true,
      price: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};