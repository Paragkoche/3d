import { Card } from "@/components/ui/card";
import UpdateModelForm from "../../../_components/update-model";

type PageProps = {
  params: Promise<{ id: string }>;
  // searchParams?: { [key: string]: string | string[] | undefined };
};
const page = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Add Model</h2>
      </div>
      <div className="flex justify-center items-center w-full">
        <Card className="p-3">
          <UpdateModelForm modelId={parseInt(id)} />
        </Card>
      </div>
    </div>
  );
};

export default page;
