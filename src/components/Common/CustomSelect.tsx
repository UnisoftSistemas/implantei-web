import { Select, Portal } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { ListCollection } from "@chakra-ui/react";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  collection: ListCollection<SelectOption>;
  value?: string;
  onChange: (value: string) => void;
  placeholderKey?: string;
  placeholder?: string;
  disabled?: boolean;
  bg?: string;
  size?: "sm" | "md" | "lg";
}

export const CustomSelect = ({
  collection,
  value,
  onChange,
  placeholderKey,
  placeholder,
  disabled = false,
  bg = "white",
  size = "md",
}: CustomSelectProps) => {
  const { t } = useTranslation();

  const displayPlaceholder = placeholderKey
    ? t(placeholderKey)
    : placeholder || t("common.selectOption");

  return (
    <Select.Root
      collection={collection}
      value={value ? [value] : []}
      onValueChange={(details) => onChange(details.value[0])}
      disabled={disabled}
      size={size}
    >
      <Select.Trigger bg={bg}>
        <Select.ValueText placeholder={displayPlaceholder} />
      </Select.Trigger>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((option) => (
              <Select.Item item={option} key={option.value}>
                {option.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};
