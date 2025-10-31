"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { learningPaths } from "@/lib/data";
import { OnboardingSchema, onboardingSchema } from "@/schema/schemas";

const OnboardingForm = ({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (data: OnboardingSchema) => void;
  isSubmitting: boolean;
}) => {
  const form = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      age: 0,
      educationLevel: "high-school", // Default for z.enum()
      learningPath: "technology",
      careerGoal: "",
      availableTime: "15-30",
    },
  });

  return (
    <div className="min-h-screen bg">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl uppercase font-heading font-bold text-foreground mb-2">
            Welcome to{" "}
            <span className="bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
              SkillzBloom
            </span>
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s personalize your learning journey
          </p>
        </div>

        <div className="bg-background rounded-2xl shadow-2xl p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl uppercase font-semibold text-foreground">
                  About You
                </h2>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="18"
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            value={
                              field.value === null ||
                              field.value === undefined ||
                              field.value === 0
                                ? ""
                                : String(field.value)
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? 0 : Number(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Education Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="high-school"
                              id="high-school"
                            />
                            <Label
                              htmlFor="high-school"
                              className="cursor-pointer"
                            >
                              High School
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="undergraduate"
                              id="undergraduate"
                            />
                            <Label
                              htmlFor="undergraduate"
                              className="cursor-pointer"
                            >
                              Undergraduate
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="graduate"
                              id="graduate"
                            />
                            <Label
                              htmlFor="graduate"
                              className="cursor-pointer"
                            >
                              Graduate
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="professional"
                              id="professional"
                            />
                            <Label
                              htmlFor="professional"
                              className="cursor-pointer"
                            >
                              Professional / Working
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Learning Path Selection */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  Choose Your Path
                </h2>

                <FormField
                  control={form.control}
                  name="learningPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Path</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid gap-3"
                        >
                          {learningPaths.map((path) => (
                            <div
                              key={path.value}
                              className={`relative flex items-start space-x-3 p-4 rounded-lg border-2 transition-smooth cursor-pointer ${
                                field.value === path.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <RadioGroupItem
                                value={path.value}
                                id={path.value}
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={path.value}
                                  className="cursor-pointer"
                                >
                                  <div className="font-semibold text-foreground">
                                    {path.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {path.description}
                                  </div>
                                </Label>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Career Goals */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  Your Goals
                </h2>

                <FormField
                  control={form.control}
                  name="careerGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Career Goal</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe what you want to achieve in your career..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Daily Time Commitment (minutes)
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-3"
                        >
                          <div
                            className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-smooth cursor-pointer ${
                              field.value === "15-30"
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <RadioGroupItem
                              value="15-30"
                              id="15-30"
                            />
                            <Label
                              htmlFor="15-30"
                              className="cursor-pointer"
                            >
                              15-30 mins
                            </Label>
                          </div>
                          <div
                            className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-smooth cursor-pointer ${
                              field.value === "30-60"
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <RadioGroupItem
                              value="30-60"
                              id="30-60"
                            />
                            <Label
                              htmlFor="30-60"
                              className="cursor-pointer"
                            >
                              30-60 mins
                            </Label>
                          </div>
                          <div
                            className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-smooth cursor-pointer ${
                              field.value === "60-120"
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <RadioGroupItem
                              value="60-120"
                              id="60-120"
                            />
                            <Label
                              htmlFor="60-120"
                              className="cursor-pointer"
                            >
                              1-2 hours
                            </Label>
                          </div>
                          <div
                            className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-smooth cursor-pointer ${
                              field.value === "120-plus"
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <RadioGroupItem
                              value="120-plus"
                              id="120-plus"
                            />
                            <Label
                              htmlFor="120-plus"
                              className="cursor-pointer"
                            >
                              2+ hours
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full md:max-w-md md:mx-auto flex"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Creating your profile..."
                  : "Start Learning Journey"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
