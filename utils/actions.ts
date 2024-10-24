"use server";

import { profileSchema } from "./schemas";

export async function createProfileAction (prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = profileSchema.parse(rawData);
    console.log(validatedFields);
    return { message: 'Profile Created' };
  } catch (error:any) {
    console.log(error.errors[0].message);
    const errMsg = error.errors[0]?.message ? error.errors[0].message : "there was an error...";
    return { message: `${errMsg}` };
  }
};