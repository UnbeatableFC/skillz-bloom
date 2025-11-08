// components/dashboard/skill-details-dialog.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle } from "lucide-react";
import { CalculatedSkill, Task } from "@/types/types";

interface SkillDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: CalculatedSkill | null;
}

export const SkillDetailsDialog = ({
  open,
  onOpenChange,
  skill,
}: SkillDetailsDialogProps) => {
  if (!skill) {
    return null; // Render nothing if no skill is selected
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{skill.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Acquired from: {skill.phaseTitle}
          </p>
        </DialogHeader>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Completed Tasks:</h4>
          {/* Add a scroll area in case there are many tasks */}
          <ScrollArea className="h-[200px] pr-3">
            <div className="space-y-4">
              {skill.tasks.map((task: Task) => (
                <div key={task.name} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{task.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-1 text-xs capitalize"
                    >
                      {task.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
