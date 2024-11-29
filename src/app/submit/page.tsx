"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitRun } from "@/lib/actions";
import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [formState, setFormState] = useState<{
    name: string;
    company: string;
    mileage: number;
  }>({ name: "", company: "", mileage: 0 });
  const [image, setImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "mileage" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      company: value,
    }));
  };

  return (
    <main className="w-screen flex justify-center items-center py-12">
      <form
        className="lg:w-1/3 w-full px-8 flex flex-col gap-6"
        action={async (data: FormData) => {
          setLoading(true); // Start loading
          setError(""); // Reset error
          const result = await submitRun(data);
          if (result.message && !result.success) {
            setError(() => result.message);
            setLoading(false); // End loading on failure
          }
          setLoading(false); // End loading on error
        }}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Submit a new run</h1>
          <p className="text-zinc-400 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
            beatae!
          </p>
        </div>
        <Element title="Name" description="This is public">
          <Input
            name="name"
            placeholder="MARK CHUANG"
            value={formState.name}
            onChange={handleInputChange}
          />
        </Element>
        <Element
          title="Company"
          description="The mileage you submit will go towards this company"
        >
          <Select name="company" onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alpha">Alpha</SelectItem>
              <SelectItem value="Bravo">Bravo</SelectItem>
              <SelectItem value="Charlie">Charlie</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
              <SelectItem value="MSC">MSC</SelectItem>
              <SelectItem value="HQ">HQ</SelectItem>
            </SelectContent>
          </Select>
        </Element>
        <Element title="Mileage" description="How many kilometers did you run">
          <Input
            name="mileage"
            type="number"
            placeholder="0"
            value={formState.mileage || ""}
            onChange={handleInputChange}
          />
        </Element>
        <Element
          title="Screenshot"
          description="Upload a screenshot from Strava"
        >
          {image ? (
            <Button variant={"ghost"} disabled className="mr-auto">
              File uploaded
            </Button>
          ) : (
            <UploadButton
              endpoint="imageUploader"
              className="mr-auto"
              onClientUploadComplete={(res) => {
                setImage(() => res[0].url);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          )}
        </Element>
        <input
          className="hidden"
          name="blob"
          value={image}
          onChange={() => {}}
        />
        <Button
          disabled={
            loading ||
            !image ||
            !formState.name ||
            !formState.company ||
            !formState.mileage
          }
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
        <p className="text-red-400 mt-2">{error}</p>
      </form>
    </main>
  );
}

const Element = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-medium">{title}</Label>
      {children}
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  );
};
