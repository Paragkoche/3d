"use client";

import { useEffect, useState } from "react";
import { getModels, ModelResponse } from "@/api/api";
import Card from "../_components/Card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  const [data, setData] = useState<ModelResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const models = await getModels();
      setData(models);
    };

    fetchData();
  }, []);

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
          <Card
            key={v.id}
            name={v.name}
            id={v.id.toString()}
            image={v.thumbnail_path}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
