"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/Auth";
import { useMutation, useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const keys = Object.keys(formSchema.shape) as Array<
  keyof typeof formSchema.shape
>;

function LoginPage() {
  const { login } = useAuthStore();

  const { mutate: handleLogin } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onError(error, variables, context) {
      setError("root", {
        type: "custom",
        message: error.message,
      });
    },
    onSuccess(data, variables, context) {
      console.log(data);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
  ) => {
    // const { email, password } = values;
    handleLogin(values);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-center mb-5">
        <span className="text-3xl text-white">Login</span>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {keys.map((key) => (
            <FormField
              control={control}
              key={key}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    {field.name.toUpperCase()}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                  <FormMessage className="text-red-100" />
                </FormItem>
              )}
            />
          ))}
          {errors.root ? (
            <span className="text-red-100">{errors.root.message}</span>
          ) : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default LoginPage;
