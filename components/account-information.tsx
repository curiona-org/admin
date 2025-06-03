"use client";
import {
  deleteUser,
  suspendUser,
  unsuspendUser,
} from "@/app/dashboard/account/[id]/actions";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/auth-provider";
import { GetUserOutput } from "@/types/api-admin";
import { IconLoader, IconShieldCheckFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

type AccountInformationProps = {
  user: GetUserOutput;
};

export function AccountInformation({ user }: AccountInformationProps) {
  const { session } = useAuth();
  const [isStatusChangePending, startStatusChangeTransition] =
    React.useTransition();
  const [isDeleteUserPending, startDeleteUserTransition] =
    React.useTransition();

  const handleStatusChange = async (value: string) => {
    startStatusChangeTransition(() => {
      if (session?.user.id === user.id) {
        toast.error("You cannot change your own account status.");
        return;
      }

      if (value === "suspend") {
        toast.promise(suspendUser(user.id), {
          loading: `Saving ${user.name}`,
          success: `User ${user.name} suspended`,
          error: `Failed to suspend user ${user.name}`,
        });
      } else {
        toast.promise(unsuspendUser(user.id), {
          loading: `Saving ${user.name}`,
          success: `User ${user.name} is now active`,
          error: `Failed to activate user ${user.name}`,
        });
      }
    });
  };

  const handleDeleteUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (session?.user.id === user.id) {
      toast.error("You cannot delete your own account.");
      return;
    }

    startDeleteUserTransition(() => {
      toast.promise(deleteUser(user.id), {
        loading: `Deleting ${user.name}`,
        success: `User ${user.name} deleted successfully`,
        error: `Failed to delete user ${user.name}`,
      });
    });

    redirect("/dashboard/account");
  };

  return (
    <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
      <h1 className='text-2xl font-semibold'>Account Information</h1>
      <div className='flex flex-col gap-2'>
        <Avatar className='size-24'>
          <AvatarImage src={user.avatar} />
        </Avatar>
        <div className='grid grid-cols-1 md:grid-cols-2 py-2 gap-6 md:gap-12 lg:gap-32 xl:gap-52'>
          <div className='flex flex-col gap-6'>
            <div className='grid grid-cols-3 items-center'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Name</span>
              </Label>
              <Input value={user.name} readOnly className='w-full col-span-2' />
            </div>
            <div className='grid grid-cols-3 items-center'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Email</span>
              </Label>
              <Input
                value={user.email}
                readOnly
                className='w-full col-span-2'
              />
            </div>
            <div className='grid grid-cols-3 items-center'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Status</span>
              </Label>
              <Select
                onValueChange={handleStatusChange}
                defaultValue={user.is_suspended ? "suspend" : "active"}
                disabled={session?.user.id === user.id}
              >
                <SelectTrigger id={`${user.id}-target`} className='w-full'>
                  <SelectValue
                    placeholder={
                      user.is_suspended ? (
                        <span className='text-destructive'>Suspended</span>
                      ) : (
                        <span className='text-primary'>Active</span>
                      )
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className='text-primary' value='active'>
                    Active
                  </SelectItem>
                  <SelectItem className='text-destructive' value='suspend'>
                    Suspended
                  </SelectItem>
                </SelectContent>
              </Select>
              {isStatusChangePending && (
                <IconLoader className='size-6 animate-spin' />
              )}
            </div>
          </div>
          <div className='flex flex-col gap-6'>
            <div className='grid grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Joined On</span>
              </Label>
              <Input
                value={dayjs(user.joined_at).format("DD/MM/YYYY HH:mm:ss")}
                readOnly
                className='w-full col-span-2'
              />
            </div>
            <div className='grid grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Role</span>
              </Label>
              <Button variant={user.is_admin ? "default" : "outline"}>
                {user.is_admin && (
                  <div className='flex flex-row items-center gap-2'>
                    <IconShieldCheckFilled className='size-4' />
                    <span className='text-accent'>Admin</span>
                  </div>
                )}
                {!user.is_admin && (
                  <span className='text-muted-foreground'>User</span>
                )}
              </Button>
            </div>
            <div className='grid grid-cols-3'>
              <Label className='w-24'>
                <span className='text-lg font-medium'>Roadmaps</span>
              </Label>
              <Button variant='outline'>{user.roadmaps.total} Roadmaps</Button>
            </div>
          </div>
        </div>
      </div>
      <Button variant='destructive' className='w-32' onClick={handleDeleteUser}>
        {isDeleteUserPending && <IconLoader className='size-6 animate-spin' />}
        {!isDeleteUserPending && "Delete Account"}
      </Button>
    </div>
  );
}
