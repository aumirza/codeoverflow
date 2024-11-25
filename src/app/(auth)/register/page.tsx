"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/Auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { addSpaces, toTitleCase } from "@/utils/case";
import PasswordInput from "@/components/password-input";
import Link from "next/link";
import { FaCircleNotch } from "react-icons/fa";

const registerFormSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8).max(20),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // set the path of the error
  });

const keys = Object.keys(registerFormSchema._def.schema.shape) as Array<
  keyof typeof registerFormSchema._def.schema.shape
>;

const RegisterPage = () => {
  const { createAccount } = useAuthStore();

  const { mutateAsync: handleRegister } = useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => createAccount(name, email, password),
    onSuccess(data) {
      // console.log(data);
    },
    onError(error) {
      // console.error(error);
      setError("root", { message: error.message });
    },
  });

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<z.infer<typeof registerFormSchema>> = async (
    values
  ) => {
    const { email, password } = values;
    const name = values.firstName + " " + values.lastName;
    await handleRegister({ name, email, password });
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="flex justify-center mb-5">
        <span className="text-3xl">Register</span>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            {keys.map((key) => (
              <FormField
                key={key}
                control={control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      {addSpaces(field.name).toUpperCase()}
                    </FormLabel>
                    <FormControl>
                      {key.toLowerCase().includes("password") ? (
                        <PasswordInput
                          placeholder={toTitleCase(key)}
                          {...field}
                        />
                      ) : (
                        <Input placeholder={toTitleCase(key)} {...field} />
                      )}
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage className="text-red-100" />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* {errors.root ? (
            <span className="text-red-100">{errors.root.message}</span>
          ) : null} */}

          <Button
            type="submit"
            className="mt-2 w-full bg-primary text-white border-2 border-primary hover:bg-accent transition-none ease-in-out"
            variant={"outline"}
            disabled={Boolean(isSubmitting)}
          >
            {isSubmitting ? (
              <>
                <FaCircleNotch className="animate-spin" />
                Registering...
              </>
            ) : (
              <span className="font-semibold group-hover:animate-pulse">
                Register
              </span>
            )}
          </Button>
        </form>
        <div className="mt-2">
          <span className="">Already have an account? </span>
          <Link href="/login" className="underline -white ml-1">
            login
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
