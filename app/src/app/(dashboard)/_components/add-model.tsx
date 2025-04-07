"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Schema
const formSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  thumbnail: z.any(),
  model_file: z.any(),
  bg: z.array(z.object({ color: z.string().min(1, "Color is required") })),
  fibers: z.array(z.object({ file: z.any() })), // ✅ Now used correctly
  affected_meshes: z.array(
    z.object({ mesh: z.string().min(1, "Mesh name is required") })
  ),
  variant_files: z.any().optional(),
});

type AddModelFormValues = z.infer<typeof formSchema>;

export default function AddModelForm() {
  const [loading, startTransition] = useTransition();

  const form = useForm<AddModelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      thumbnail: undefined,
      model_file: undefined,
      bg: [{ color: "" }],
      fibers: [{ file: undefined }], // ✅ Default fiber field included
      affected_meshes: [{ mesh: "" }],
      variant_files: undefined,
    },
  });

  const {
    fields: bgFields,
    append: addBg,
    remove: removeBg,
  } = useFieldArray({
    control: form.control,
    name: "bg",
  });

  const {
    fields: fiberFields,
    append: addFiber,
    remove: removeFiber,
  } = useFieldArray({
    control: form.control,
    name: "fibers",
  });

  const {
    fields: meshFields,
    append: addMesh,
    remove: removeMesh,
  } = useFieldArray({
    control: form.control,
    name: "affected_meshes",
  });

  const onSubmit = async (data: AddModelFormValues) => {
    console.log(data);

    startTransition(async () => {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("thumbnail", data.thumbnail[0]);
        formData.append("model_file", data.model_file[0]);

        data.bg.forEach((bg) => formData.append("bg", bg.color));

        data.fibers.forEach((fiber) => {
          formData.append("fiber_files", fiber.file[0]);
        });

        data.affected_meshes.forEach((mesh) => {
          formData.append("affected_meshes", mesh.mesh);
        });

        if (data.variant_files) {
          Array.from(data.variant_files as File[]).forEach((file: File) => {
            formData.append("variant_files", file);
          });
        }

        const response = await fetch(
          "http://127.0.0.1:8000/models/create_with_fibers/",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to create model");
        }

        toast.success("Model created successfully!");
        form.reset();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create model";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter model name"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  disabled={loading}
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>3D Model File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".obj,.glb,.fbx,.max"
                  disabled={loading}
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Variant Files */}
        <FormField
          control={form.control}
          name="variant_files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Character Variant Files (L1, L2, L3...)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".obj,.glb,.fbx,.max"
                  multiple
                  disabled={loading}
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic Fiber Inputs */}
        <div className="space-y-2">
          <FormLabel>Fiber Images</FormLabel>
          {fiberFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`fibers.${index}.file`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeFiber(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addFiber({ file: undefined })}>
            Add Fiber Image
          </Button>
        </div>
        {/* Dynamic Affected Meshes */}
        <div className="space-y-2">
          <FormLabel>Affected Meshes</FormLabel>
          {meshFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`affected_meshes.${index}.mesh`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Enter mesh name"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeMesh(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addMesh({ mesh: "" })}>
            Add Affected Mesh
          </Button>
        </div>
        {/* Dynamic Background Colors */}
        <div className="space-y-2">
          <FormLabel>Background Colors</FormLabel>
          {bgFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`bg.${index}.color`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="e.g. #FFFFFF"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeBg(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => addBg({ color: "" })}>
            Add Background Color
          </Button>
        </div>

        <Button disabled={loading} className="w-full" type="submit">
          {loading ? "Uploading..." : "Add Model"}
        </Button>
      </form>
    </Form>
  );
}
