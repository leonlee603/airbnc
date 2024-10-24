"use server";

import { profileSchema } from "./schemas";
import db from './db';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProfileAction (prevState: any, formData: FormData) {
  try {
    // get user info from clerk
    const user = await currentUser();
    if (!user) throw new Error('Please login to create a profile');

    console.log(user);
    // apply validation
    const rawData = Object.fromEntries(formData);
    const validatedFields = profileSchema.parse(rawData);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields,
      }
    })

    return { message: 'Profile Created' };
  } catch (error:any) {
    const errMsg = error.errors[0]?.message ? error.errors[0].message : "there was an error...";
    return { message: `${errMsg}` };
  }
};