import { z } from "zod";

export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: 'max length is 5' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required!' }),
  username: z.string().min(1, { message: 'Username is required!!' }),
});

// extract the inferred type
export type profileSchemaType = z.infer<typeof profileSchema>;