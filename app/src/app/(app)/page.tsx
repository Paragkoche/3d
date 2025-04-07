import { getModels } from "@/api/api";
import PageContainer from "@/components/page-container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
const API_BASE_URL = process.env.NEXT_PUBLIC_API; // Change this to your FastAPI backend URL

const page = async () => {
  const data = await getModels();
  console.log(data);

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.map((v, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{v.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  className="rounded-md"
                  src={API_BASE_URL + v.thumbnail_path}
                />
              </CardContent>
              <CardFooter className="w-full">
                <div className=" w-full flex justify-end items-center">
                  <Link href={"/" + v.id}>
                    <Button className="justify-end">
                      <EyeIcon />
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default page;
