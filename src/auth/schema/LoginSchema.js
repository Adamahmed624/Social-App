import * as zod from 'zod';

export let LoginSchema = zod.object({
    email: zod.string().nonempty("Email is required").email("Enter a valid email"),
    password: zod.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password is invalid"),
  })