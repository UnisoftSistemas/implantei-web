import type { ListCollection } from "@chakra-ui/react";

export interface CustomSelectProps {
  collection: ListCollection;
  value?: string;
  onChange: (value: string) => void;
  placeholderKey?: string;
  placeholder?: string;
  disabled?: boolean;
  bg?: string;
  size?: "sm" | "md" | "lg";
}