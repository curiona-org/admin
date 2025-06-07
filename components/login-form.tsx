"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const formSchemaSignIn = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type FormTypeSignIn = z.infer<typeof formSchemaSignIn>;

export const useFormSignIn = () =>
  useForm<FormTypeSignIn>({
    resolver: zodResolver(formSchemaSignIn),
  });

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn, signInGoogle, authIsLoading, authError, clearError } =
    useAuth();

  React.useEffect(() => {
    if (authError) {
      toast.error(authError);
    }

    // Reset the error after displaying it
    return () => {
      clearError();
    };
  }, [authError, clearError]);

  const { register, handleSubmit } = useFormSignIn();
  const onSubmit = handleSubmit(async ({ email, password }) => {
    await signIn({ email, password });
    redirect("/dashboard");
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  {...register("email")}
                />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  {...register("password")}
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={authIsLoading}
                >
                  {authIsLoading ? (
                    <IconLoader className='size-6 animate-spin' />
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => signInGoogle()}
                >
                  Login with Google
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
