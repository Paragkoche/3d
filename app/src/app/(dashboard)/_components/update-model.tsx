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
import { useTransition, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  thumbnail: z.any().optional(),
  model_file: z.any().optional(),
  bg: z.array(z.object({ color: z.string().min(1, "Color is required") })),
  fibers: z.array(z.object({ file: z.any().optional() })),
});

type UpdateModelFormValues = z.infer<typeof formSchema>;

interface UpdateModelFormProps {
  modelId: number;
}

export default function UpdateModelForm({ modelId }: UpdateModelFormProps) {
  const [loading, startTransition] = useTransition();

  const form = useForm<UpdateModelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      thumbnail: undefined,
      model_file: undefined,
      bg: [{ color: "" }],
      fibers: [{ file: undefined }],
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

  useEffect(() => {
    async function fetchModel() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/models/`);
        const data = await response.json();
        const model = data.find((m: any) => m.id === modelId);

        if (!model) throw new Error("Model not found");

        form.reset({
          name: model.name,
          bg: model.bg_colors.map((color: string) => ({ color })),
          fibers: [], // For update, files are optional
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to load model data");
      }
    }

    fetchModel();
  }, [modelId, form]);

  const onSubmit = async (data: UpdateModelFormValues) => {
    startTransition(async () => {
      try {
        let token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("name", data.name);

        if (data.thumbnail && data.thumbnail.length > 0) {
          formData.append("thumbnail", data.thumbnail[0]);
        }

        if (data.model_file && data.model_file.length > 0) {
          formData.append("model_file", data.model_file[0]);
        }

        data.bg.forEach((bg) => formData.append("bg", bg.color));

        data.fibers.forEach((fiber) => {
          if (fiber.file && fiber.file.length > 0) {
            formData.append("fiber_files", fiber.file[0]);
          }
        });

        const response = await fetch(
          `http://127.0.0.1:8000/models/${modelId}/`,
          {
            method: "PUT",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to update model");
        }

        toast.success("Model updated successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to update model");
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
              <FormLabel>Thumbnail Image (optional)</FormLabel>
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
              <FormLabel>3D Model File (optional)</FormLabel>
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

        <div className="space-y-2">
          <FormLabel>Fiber Images (optional)</FormLabel>
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

        <Button disabled={loading} className="w-full" type="submit">
          {loading ? "Updating..." : "Update Model"}
        </Button>
      </form>
    </Form>
  );
}
