"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  email,
  InferInput,
  maxLength,
  minLength,
  object,
  pipe,
  string,
  trim,
  url,
} from "valibot";

import Button from "@/components/Button";
import Select, { SelectProps } from "@/components/Select";
import TextInput from "@/components/TextInput";

const schema = object({
  name: pipe(
    string("Name is required"),
    trim(),
    minLength(1, "Name is required"),
    maxLength(50, "Name must be at most 50 characters"),
  ),
  email: pipe(
    string("Email is required"),
    trim(),
    minLength(1, "Email is required"),
    email("Invalid email"),
    maxLength(50, "Email must be at most 50 characters"),
  ),
  assignment_description: pipe(
    string("Description is required"),
    trim(),
    minLength(1, "Description is required"),
    minLength(10, "Description must be at least 10 characters"),
    maxLength(500, "Description must be at most 500 characters"),
  ),
  github_repo_url: pipe(
    string("GitHub URL is required"),
    trim(),
    minLength(1, "GitHub URL is required"),
    url("Invalid URL"),
    maxLength(200, "GitHub URL must be at most 200 characters"),
  ),
  candidate_level: pipe(
    string("Level is required"),
    trim(),
    minLength(1, "Level is required"),
  ),
});

type FormData = InferInput<typeof schema>;

const AssignmentForm = () => {
  const [errors, setErrors] = useState<string[]>();
  const [selectOptions, setSelectOptions] = useState<SelectProps["options"]>();
  const [selectOptionsError, setSelectOptionsError] = useState<boolean>(false);

  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      assignment_description: "",
      github_repo_url: "",
      candidate_level: "",
    },
  });

  const getSelectOptions = async () => {
    if (selectOptions) return;

    try {
      const {
        data: { levels },
      } = await axios.get<{ levels: string[] }>(
        "https://tools.qa.public.ale.ai/api/tools/candidates/levels",
      );

      setSelectOptionsError(false);
      setSelectOptions(levels.map((level) => ({ value: level, label: level })));
    } catch {
      setSelectOptionsError(true);
    }
  };

  const onSubmit = async (data: FormData) => {
    const trimmedData = { ...data };

    Object.keys(trimmedData).forEach((key) => {
      trimmedData[key as keyof typeof trimmedData] =
        trimmedData[key as keyof typeof trimmedData].trim();
    });

    try {
      await axios.post(
        "https://tools.qa.public.ale.ai/api/tools/candidates/assignments",
        trimmedData,
      );

      setErrors(undefined);
      localStorage.setItem(
        "form-data",
        JSON.stringify({
          Name: trimmedData.name,
          Email: trimmedData.email,
          Description: trimmedData.assignment_description,
          "GitHub Repo URL": trimmedData.github_repo_url,
          Level: trimmedData.candidate_level,
        }),
      );
      router.push("/thank-you");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(["Internal Server Error"]);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-end gap-4"
    >
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            id={field.name}
            fullWidth
            label="Name"
            required
            {...(error && { error: true, helperText: error.message })}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            id={field.name}
            type="email"
            fullWidth
            label="Email"
            required
            {...(error && { error: true, helperText: error.message })}
          />
        )}
      />
      <Controller
        control={control}
        name="assignment_description"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            textarea
            id={field.name}
            fullWidth
            label="Description"
            required
            {...(error && { error: true, helperText: error.message })}
          />
        )}
      />
      <Controller
        control={control}
        name="github_repo_url"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            {...field}
            id={field.name}
            type="url"
            fullWidth
            label="GitHub Repo URL"
            required
            {...(error && { error: true, helperText: error.message })}
          />
        )}
      />
      <Controller
        control={control}
        name="candidate_level"
        render={({ field, fieldState: { error } }) => (
          <Select
            {...field}
            fullWidth
            label="Level"
            required
            options={selectOptions}
            {...(!selectOptions &&
              selectOptionsError && {
                optionsError: "Could not get options",
              })}
            onOpen={getSelectOptions}
            {...(error && { error: true, helperText: error.message })}
          />
        )}
      />
      {errors && (
        <ul className="w-full space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="text-sm text-red-700">
              {error}
            </li>
          ))}
        </ul>
      )}
      <Button type="submit" disabled={!isDirty || !isValid}>
        Submit
      </Button>
    </form>
  );
};

export default AssignmentForm;
