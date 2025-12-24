import { ChevronDown, SearchIcon } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { ElementError } from "@/components/general/element-error";
import { type Country, countries, getDefaultCountry } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  /** Unique identifier for the input */
  id?: string;
  /** Phone value including country code (e.g., "+1 555 123 4567") */
  value?: string;
  /** Callback when phone value changes */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Text direction for RTL language support */
  dir?: "ltr" | "rtl" | "auto";
  /** Error message to display */
  errorMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

function PhoneInput({
  id,
  value = "",
  onChange,
  placeholder,
  required,
  disabled,
  dir,
  errorMessage,
  className,
}: Readonly<PhoneInputProps>): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [dropdownPosition, setDropdownPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const parseValue = React.useCallback((): { country: Country; phoneNumber: string } => {
    if (!value) {
      return { country: getDefaultCountry(), phoneNumber: "" };
    }

    const sortedCountries = [...countries].sort((a, b) => {
      const lengthDiff = b.dialCode.length - a.dialCode.length;
      if (lengthDiff !== 0) return lengthDiff;
      return a.code.localeCompare(b.code);
    });

    for (const country of sortedCountries) {
      if (value.startsWith(country.dialCode)) {
        const phoneNumber = value.slice(country.dialCode.length).trim();
        return { country, phoneNumber };
      }
    }

    return { country: getDefaultCountry(), phoneNumber: value };
  }, [value]);

  const { country: selectedCountry, phoneNumber } = parseValue();

  const filteredCountries = React.useMemo(() => {
    if (!search) return countries;
    const searchLower = search.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchLower) ||
        country.dialCode.includes(search) ||
        country.code.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const handleCountrySelect = (country: Country): void => {
    setIsOpen(false);
    setSearch("");
    const newValue = phoneNumber ? `${country.dialCode} ${phoneNumber}` : country.dialCode;
    onChange?.(newValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newPhoneNumber = e.target.value;
    const newValue = newPhoneNumber ? `${selectedCountry.dialCode} ${newPhoneNumber}` : "";
    onChange?.(newValue);
  };

  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = (): void => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
          });
        }
      };

      updatePosition();

      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
    setDropdownPosition(null);
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const hasError = Boolean(errorMessage);

  return (
    <div className="space-y-1">
      <ElementError errorMessage={errorMessage} dir={dir} />
      <div
        className={cn(
          // Layout
          "flex items-center border transition-[color,box-shadow] outline-none",
          // Customizable styles via CSS variables
          "w-input h-input",
          "bg-input-bg border-input-border rounded-input",
          "shadow-input",
          // Focus ring (applied to container when child is focused)
          "has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-[3px]",
          // Error state
          hasError && "ring-destructive/20 dark:ring-destructive/40 border-destructive",
          // Disabled state
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          className
        )}
        dir={dir}>
        <div className="relative flex h-full shrink-0">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => {
              if (!disabled) setIsOpen(!isOpen);
            }}
            disabled={disabled}
            aria-label="Select country code"
            aria-expanded={isOpen}
            className={cn(
              "border-input-border flex h-full items-center gap-1.5 border-r px-2",
              "bg-transparent transition-colors",
              "hover:bg-accent/50",
              "focus:outline-none focus-visible:outline-none",
              "rounded-l-input",
              isOpen && "bg-accent/50"
            )}>
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="text-input-text text-sm font-medium">{selectedCountry.dialCode}</span>
            <ChevronDown
              className={cn(
                "text-muted-foreground h-4 w-4 shrink-0 transition-transform",
                isOpen && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        {isOpen && dropdownPosition && typeof document !== "undefined"
          ? createPortal(
              <div
                ref={dropdownRef}
                className={cn(
                  "fixed z-[99999] w-[280px] rounded-md border border-gray-200",
                  "bg-white text-gray-900 shadow-lg",
                  "animate-in fade-in-0 zoom-in-95",
                  "flex max-h-[300px] flex-col",
                  "overflow-hidden"
                )}
                style={{
                  top: `${dropdownPosition.top.toString()}px`,
                  left: `${dropdownPosition.left.toString()}px`,
                  backgroundColor: "#ffffff",
                }}
                role="listbox">
                <div className="shrink-0 border-b p-2">
                  <div className="bg-muted/50 flex items-center gap-2 rounded-md px-2">
                    <SearchIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      placeholder="Search countries..."
                      className="placeholder:text-muted-foreground h-9 w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-1">
                  {filteredCountries.length === 0 ? (
                    <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                      No countries found
                    </div>
                  ) : (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          handleCountrySelect(country);
                        }}
                        role="option"
                        aria-selected={selectedCountry.code === country.code}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                          "transition-colors",
                          selectedCountry.code === country.code && "bg-accent"
                        )}>
                        <span className="text-base leading-none">{country.flag}</span>
                        <span className="flex-1 truncate text-left">{country.name}</span>
                        <span className="text-muted-foreground shrink-0 font-medium">{country.dialCode}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>,
              document.body
            )
          : null}

        <input
          id={id}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          dir={dir}
          data-slot="phone-input"
          style={{ fontSize: "var(--fb-input-font-size)" }}
          aria-invalid={hasError || undefined}
          className={cn(
            "flex-1 bg-transparent outline-none",
            "font-input font-input-weight",
            "text-input-text",
            "px-input-x py-input-y",
            "placeholder:opacity-input-placeholder",
            "placeholder:text-input-placeholder placeholder:text-sm",
            "selection:bg-primary selection:text-primary-foreground"
          )}
        />
      </div>
    </div>
  );
}

export { PhoneInput };
export type { PhoneInputProps };
