"use client";
import {
  Card as SCNCard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DeleteIcon,
  Edit2Icon,
  EyeIcon,
  Trash,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteModel } from "@/api/api";

interface props {
  name: string;
  id: string;
  image: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API; // Change this to your FastAPI backend URL

const Card = (props: props) => {
  const router = useRouter();
  return (
    <SCNCard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img className="rounded-md" src={API_BASE_URL + props.image} />
      </CardContent>
      <CardFooter className="w-full">
        <div className=" w-full flex justify-end items-center gap-3">
          <Button
            className="justify-end"
            onClick={() => {
              deleteModel(props.id);
              router.refresh();
            }}
          >
            <Trash2Icon />
          </Button>
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
