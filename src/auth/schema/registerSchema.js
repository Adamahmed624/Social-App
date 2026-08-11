import * as zod from 'zod';

export let schema = zod.object({
    name: zod.string().nonempty("Name is required").min(2, "Name should be at least 2 letters").max(30, "Name is too Long"),
    email: zod.string().nonempty("Email is required").email("Enter a valid email"),
    password: zod.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password is invalid"),
    dateOfBirth: zod.string().nonempty(),
    gender: zod.string().nonempty("Please Enter Your Gender"),
    rePassword: zod.string().nonempty("Please fill the field")
  }).refine((data) => data.password === data.rePassword, {
    message: "rePassword doesn't match the password",
    path: ["rePassword"],
  });