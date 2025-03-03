import { getModels } from "@/api/api";
import Card from "../_components/Card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = async () => {
  const data: any[] = await getModels();
  console.log(data);

  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Hi, Welcome back 👋
        </h2>
        <Link href={"/dashboard/add"}>
          <Button>Add model</Button>
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {data.map((v) => (
          <Card name={v.name} id={v.id} />
        ))}
      </div>
    </div>
  );
};

export default page;
