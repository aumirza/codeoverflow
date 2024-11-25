"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/Auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toTitleCase } from "@/utils/case";
import { FaCircleNotch } from "react-icons/fa";
import Link from "next/link";
import PasswordInput from "@/components/password-input";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const keys = Object.keys(formSchema.shape) as Array<
  keyof typeof formSchema.shape
>;

function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();

  const { mutateAsync: handleLogin } = useMutation({
    mutationKey: ["login"],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onMutate() {
      toast.loading("Logging in...");
    },
    onSuccess() {
      toast.dismiss();
      toast.success("Logged in successfully");
      form.reset();
      router.replace("/");
    },
    onError(error) {
      toast.dismiss();
      toast.error(error.message);
      setError("root", { message: error.message });
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
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
  ) => {
    const { email, password } = values;
    await handleLogin({ email, password });
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="flex justify-center mb-5">
        <span className="text-3xl  font-bold">Login</span>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {keys.map((key) => (
            <FormField
              control={control}
              key={key}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">{field.name.toUpperCase()}</FormLabel>
                  <FormControl>
                    {key.includes("password") ? (
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
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          ))}
          {/* {errors.root ? (
            <span className="text-red-100">{errors.root.message}</span>
          ) : null} */}
          <Button
            className="group w-full text-white hover:bg-accent hover:text-primary border-primary border-2 mt-5 transition-all ease-in-out"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaCircleNotch className="animate-spin" />
                verifying...
              </>
            ) : (
              <span className="font-semibold group-hover:animate-pulse">
                Login
              </span>
            )}
          </Button>
        </form>
        <div className="mt-2">
          <span className="">Don&apos;t have an account?</span>
          <Link href="/register" className="underline -white ml-1">
            Register
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
