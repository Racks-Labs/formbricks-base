import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { PhoneInput, type PhoneInputProps } from "./phone-input";

const meta: Meta<typeof PhoneInput> = {
  title: "General/PhoneInput",
  component: PhoneInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PhoneInput>;

// Interactive wrapper component
function PhoneInputDemo(props: ComponentProps<typeof PhoneInput>): React.JSX.Element {
  const [value, setValue] = useState(props.value ?? "");

  return (
    <div className="space-y-4">
      <PhoneInput {...props} value={value} onChange={setValue} />
      <div className="text-muted-foreground text-sm">
        <strong>Value:</strong> {value || "(empty)"}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: (args: PhoneInputProps) => <PhoneInputDemo {...args} />,
  args: {
    placeholder: "Enter phone number",
  },
};

export const WithValue: Story = {
  render: (args: PhoneInputProps) => <PhoneInputDemo {...args} />,
  args: {
    value: "+34 612 345 678",
    placeholder: "Enter phone number",
  },
};

export const WithUSNumber: Story = {
  render: (args: PhoneInputProps) => <PhoneInputDemo {...args} />,
  args: {
    value: "+1 555 123 4567",
    placeholder: "Enter phone number",
  },
};

export const Required: Story = {
  render: (args: PhoneInputProps) => <PhoneInputDemo {...args} />,
  args: {
    placeholder: "Enter phone number",
    required: true,
  },
};

export const Disabled: Story = {
  render: (args: PhoneInputProps) => <PhoneInputDemo {...args} />,
  args: {
    value: "+44 20 7123 4567",
    placeholder: "Enter phone number",
    disabled: true,
  },
};

export const WithError: Story = {
  render: (args: PhoneInputProps) => <PhoneInputDemo {...args} />,
  args: {
    value: "+1 555",
    placeholder: "Enter phone number",
    errorMessage: "Please enter a valid phone number",
  },
};

export const RTLDirection: Story = {
  render: (args: PhoneInputProps) => <PhoneInputDemo {...args} />,
  args: {
    value: "+966 50 123 4567",
    placeholder: "أدخل رقم الهاتف",
    dir: "rtl",
  },
};
