"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import * as z from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  url: z.url("Please enter a valid URL"),
});

export default function Form() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <Card className="w-full max-w-lg mt-6 lg:mt-10">
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Controller
                control={form.control}
                name="url"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="url">YouTube Video URL</FieldLabel>
                    <Input
                      {...field}
                      id="url"
                      type="text"
                      placeholder="https://youtu.be/dQw4w9WgXcQ"
                      autoFocus
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              ></Controller>
            </FieldGroup>
          </FieldSet>
        </form>
        <CardFooter className="mt-4 px-0">
          <Field className="w-fit ml-auto">
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
          </Field>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
