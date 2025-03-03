import { getModels } from "@/api/api";
import PageContainer from "@/components/page-container";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon } from "lucide-react";

const page = async () => {
  const data: any[] = await getModels();
  console.log(data);

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.map((v) => (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{v.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  className="rounded-md"
                  src="https://plus.unsplash.com/premium_photo-1681031465676-995faaaac5bf?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </CardContent>
              <CardFooter className="w-full">
                <div className=" w-full flex justify-end items-center">
                  <Button className="justify-end">
                    <EyeIcon />
                  </Button>
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
