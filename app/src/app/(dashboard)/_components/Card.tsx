"use client";
import {
  Card as SCNCard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit2Icon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface props {
  name: string;
  id: string;
}

const Card = (props: props) => {
  const router = useRouter();
  return (
    <SCNCard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          className="rounded-md"
          src="https://plus.unsplash.com/premium_photo-1681031465676-995faaaac5bf?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </CardContent>
      <CardFooter className="w-full">
        <div className=" w-full flex justify-end items-center">
          <Button
            className="justify-end"
            onClick={() => router.push(`/dashboard/update/${props.id}`)}
          >
            <Edit2Icon />
          </Button>
        </div>
      </CardFooter>
    </SCNCard>
  );
};

export default Card;
