"use client";
import { getModelsId, IdModelResponse } from "@/api/api";
import React, { use, useEffect, useState } from "react";
import { Viewer } from "../_components/3D";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};

const Page = ({ params }: PageProps) => {
  const { id } = use(params);

  const [data, setData] = useState<IdModelResponse | null>(null);

  useEffect(() => {
    if (id) getModelsId(id).then((data) => setData(data));
    console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  console.log("data->", data);

  return data && <Viewer {...data} />;
};

export default Page;
