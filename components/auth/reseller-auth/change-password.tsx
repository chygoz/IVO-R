import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useMutation } from "@tanstack/react-query";
import changeUserDefaultPassword from "@/actions/change-default-password";
import ButtonText from "@/components/ui/buttonText";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ErrorAlert from "@/components/ui/error-alert";
import { revalidatePage } from "@/actions/revalidate.tag";

type PasswordChangeFormProps = {
  oldPassword: string;
  email: string;
};

// Validation schema using Zod
const formSchema = z.object({
  newPassword: z.string().min(5, "Password must be at least 5 characters"),
  confirmPassword: z
    .string()
    .min(5, "ConfirmPassword must be at least 5 characters"),
});

const PasswordChangeForm = ({
  oldPassword,
  email,
}: PasswordChangeFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mutation = useMutation({
    mutationFn: changeUserDefaultPassword,
    onSuccess() {
      toast.success("password updated successfully");
      const currentParams = searchParams.toString();
      router.refresh();
      if (currentParams) {
        router.push(`${pathname}?${currentParams}`);
        revalidatePage(pathname);
      }
    },
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (data.newPassword !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    mutation.mutate({ email, oldPassword, password: data.newPassword });
  };

  if (!email || !oldPassword) {
    return <div>Something is missing</div>;
  }

  return (
    <div className="mt-4">
      {mutation.isError && (
        <div className="mb-4">
          <ErrorAlert>{mutation.error.message}</ErrorAlert>
        </div>
      )}
      <Card className=" py-4">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3"
                disabled={mutation.isPending}
              >
                <ButtonText loading={mutation.isPending}>
                  Change Password
                </ButtonText>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordChangeForm;
