import { Card } from "@/components/ui/card";
import AddModelForm from "../../_components/add-model";

const page = () => {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Add Model</h2>
      </div>
      <div className="flex justify-center items-center w-full">
        <Card className="p-3">
          <AddModelForm />
        </Card>
      </div>
    </div>
  );
};

export default page;
