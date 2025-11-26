"use client";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ButtonText from "@/components/ui/buttonText";
import { getBankName, initiateAddAccount } from "@/actions/accounts";
import SearchableSelect from "@/components/ui/select-with-search";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { toast } from "sonner";

type NewWalletProps = {
  banks: {
    id: number;
    code: string;
    name: string;
  }[];
  session: Session;
};

const formSchema = z.object({
  bankName: z.string().min(1, {
    message: "bank name is required",
  }),
  accountNumber: z.string().min(1, {
    message: "account number is required",
  }),
});

function NewWithdrawalForm({ banks }: NewWalletProps) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: initiateAddAccount,
    onSuccess(data) {
      router.replace(
        `/admin/wallet/withdraw-accounts/verify-otp?requestId=${data.requestId}`
      );
      toast.success("successfully requested add account");
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: ``,
      accountNumber: ``,
    },
  });

  const bankName = form.watch("bankName").trim(); // Track changes to bankName
  const accountNumber = form.watch("accountNumber").trim(); // Track changes to accountNumber

  const { isFetching: isFetchingName, data: bankNameData } = useQuery({
    queryKey: ["bank-name", bankName, accountNumber],
    queryFn: () => getBankName(getDetails(form)),
    enabled: shouldFetchName({ accountNumber, bankName }),
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!bankNameData?.data.account_name) {
      return;
    }
    const [bankName, sortCode] = splitByLastDash(values.bankName);

    mutation.mutate({
      accountName: bankNameData.data.account_name,
      bankId: "000",
      accountNumber: bankNameData.data.account_number,
      bankName,
      currency: "NGN",
      sortCode: sortCode,
    });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 mb-2">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      className="capitalize bg-white"
                      placeholder="12345678910"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      value={field.value}
                      className="w-full"
                      placeholder="Choose your bank"
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      items={
                        banks
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((bank) => {
                            return {
                              label: `${bank.name} - ${bank.code}`,
                              value: `${bank.name} - ${bank.code}`,
                            };
                          }) || []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!shouldFetchName({
            bankName,
            accountNumber,
          }) ? null : isFetchingName ? (
            <LoadingSpinner />
          ) : bankNameData?.data?.account_name ? (
            <div className="rounded-xl text-primary capitalize p-2 mt-4 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="16" height="16" rx="8" fill="currentColor" />
                <path
                  d="M11.4375 5.8125L7.0625 10.1875L4.875 8"
                  stroke="white"
                  strokeWidth="1.53"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {bankNameData?.data.account_name}
            </div>
          ) : (
            <div className="bg-red-100 text-red-600 p-2 mt-4 rounded-xl">
              We Could not fetch the account details
            </div>
          )}

          {bankNameData?.data.account_name ? (
            <Button
              disabled={mutation.isPending}
              className="w-full mt-8 bg-primary text-[var(--text-color)]"
            >
              <ButtonText loading={mutation.isPending}>Add Account</ButtonText>
            </Button>
          ) : null}
        </form>
      </Form>
    </div>
  );
}

export default NewWithdrawalForm;

function shouldFetchName(data: { accountNumber: string; bankName: string }) {
  const { accountNumber, bankName } = data;

  if (accountNumber.length === 10 && bankName) {
    return true;
  }

  return false;
}

function getDetails(
  form: UseFormReturn<
    {
      bankName: string;
      accountNumber: string;
    },
    any,
    undefined
  >
) {
  const { accountNumber, bankName } = form.getValues();

  return {
    accountNumber,
    sortCode: getTextAfterLastHyphen(bankName),
  };
}
function getTextAfterLastHyphen(input: string): string {
  const lastHyphenIndex = input.lastIndexOf("-");
  return lastHyphenIndex !== -1 ? input.substring(lastHyphenIndex + 1) : input;
}

function splitByLastDash(input: string): [string, string] {
  const lastIndex = input.lastIndexOf("-");
  if (lastIndex === -1) {
    return [input, ""]; // No dash found
  }
  const before = input.slice(0, lastIndex).trim();
  const after = input.slice(lastIndex + 1).trim();
  return [before, after];
}
