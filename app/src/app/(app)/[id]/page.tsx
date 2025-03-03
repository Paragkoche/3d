import React from "react";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <div>{id}</div>;
};

export default page;
