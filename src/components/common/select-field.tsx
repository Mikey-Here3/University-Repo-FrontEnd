"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value:           string;
  onValueChange:   (value: string) => void;
  placeholder?:    string;
  options:         Option[];
  disabled?:       boolean;
  className?:      string;
}

export function SelectField({
  value,
  onValueChange,
  placeholder = "Select…",
  options,
  disabled = false,
  className,
}: SelectFieldProps) {
  /*
   * Use the Radix primitive directly instead of the shadcn wrapper.
   * The shadcn SelectTrigger inherits bg-background / text-foreground
   * which resolves to dark colours when CSS vars aren't scoped to light.
   * Explicit Tailwind colours below guarantee correct light appearance.
   */
  return (
    <SelectPrimitive.Root
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      {/* ── Trigger ── */}
      <SelectPrimitive.Trigger
        className={cn(
          /* layout */
          "flex h-10 w-full items-center justify-between gap-2 rounded-xl px-3.5",
          /* explicit light colours — no CSS vars */
          "border border-gray-200 bg-white text-sm text-gray-900",
          /* placeholder colour */
          "data-[placeholder]:text-gray-400",
          /* focus / hover */
          "outline-none ring-0",
          "hover:border-primary/40 hover:bg-gray-50/60",
          "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
          /* disabled */
          "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-100",
          "transition-all duration-150 shadow-sm",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      {/* ── Portal + Content ── */}
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className={cn(
            "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden",
            "rounded-xl border border-gray-200 bg-white shadow-xl shadow-black/[0.08]",
            /* open animation */
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            /* close animation */
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            /* direction slide */
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
          )}
        >
          <SelectPrimitive.Viewport className="p-1.5">
            {options.length === 0 ? (
              <div className="px-3 py-4 text-center text-[12px] text-gray-400">
                No options available
              </div>
            ) : (
              options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center gap-2",
                    "rounded-lg px-3 py-2 text-sm text-gray-700 outline-none",
                    /* highlight */
                    "data-[highlighted]:bg-primary/8 data-[highlighted]:text-primary",
                    /* selected */
                    "data-[state=checked]:font-semibold data-[state=checked]:text-primary",
                    "transition-colors duration-100",
                    /* right-pad for the check icon */
                    "pr-8",
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {opt.label}
                  </SelectPrimitive.ItemText>

                  {/* Check mark for selected item */}
                  <SelectPrimitive.ItemIndicator className="absolute right-2.5 flex items-center">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))
            )}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}