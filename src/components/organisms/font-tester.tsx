import { useState } from "react";
import { Button } from "@atoms/button";

const fontWeights = [
  { label: "Thin (100)", value: "100" },
  { label: "Extra Light (200)", value: "200" },
  { label: "Light (300)", value: "300" },
  { label: "Regular (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "Semi Bold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "Extra Bold (800)", value: "800" },
  { label: "Black (900)", value: "900" },
];

const fontSizes = [
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "32px", value: "32px" },
  { label: "40px", value: "40px" },
  { label: "48px", value: "48px" },
  { label: "64px", value: "64px" },
];

export const FontTester = () => {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
  const [fontSize, setFontSize] = useState("24px");
  const [fontWeight, setFontWeight] = useState("400");

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div>
        <label className="text-muted-foreground mb-2 block text-sm font-medium">
          Text to Display
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-background border-input focus:ring-ring w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
          placeholder="Enter text to test..."
        />
      </div>

      {/* Font Size Selector */}
      <div>
        <label className="text-muted-foreground mb-2 block text-sm font-medium">
          Font Size: {fontSize}
        </label>
        <div className="flex flex-wrap gap-2">
          {fontSizes.map((size) => (
            <Button
              key={size.value}
              variant={fontSize === size.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFontSize(size.value)}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Font Weight Selector */}
      <div>
        <label className="text-muted-foreground mb-2 block text-sm font-medium">
          Font Weight: {fontWeights.find((w) => w.value === fontWeight)?.label}
        </label>
        <div className="flex flex-wrap gap-2">
          {fontWeights.map((weight) => (
            <Button
              key={weight.value}
              variant={fontWeight === weight.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFontWeight(weight.value)}
            >
              {weight.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="border-border rounded-lg border p-6">
        <p className="text-muted-foreground mb-2 text-sm">Preview:</p>
        <div
          style={{
            fontFamily: "Alexandria, sans-serif",
            fontSize: fontSize,
            fontWeight: fontWeight,
          }}
          className="break-words"
        >
          {text}
        </div>
      </div>

      {/* CSS Code Display */}
      <div className="bg-muted rounded-lg p-4">
        <p className="text-muted-foreground mb-2 text-sm">CSS Code:</p>
        <pre className="text-foreground overflow-x-auto text-sm">
          {`font-family: 'Alexandria', sans-serif;
font-size: ${fontSize};
font-weight: ${fontWeight};`}
        </pre>
      </div>

      {/* Tailwind Class Display */}
      <div className="bg-muted rounded-lg p-4">
        <p className="text-muted-foreground mb-2 text-sm">Tailwind Classes:</p>
        <pre className="text-foreground overflow-x-auto text-sm">
          {`font-sans ${getFontSizeClass(fontSize)} ${getFontWeightClass(fontWeight)}`}
        </pre>
      </div>
    </div>
  );
};

// Helper functions to convert to Tailwind classes
function getFontSizeClass(size: string): string {
  const sizeMap: Record<string, string> = {
    "12px": "text-xs",
    "14px": "text-sm",
    "16px": "text-base",
    "18px": "text-lg",
    "20px": "text-xl",
    "24px": "text-2xl",
    "32px": "text-3xl",
    "40px": "text-4xl",
    "48px": "text-5xl",
    "64px": "text-6xl",
  };
  return sizeMap[size] || `text-[${size}]`;
}

function getFontWeightClass(weight: string): string {
  const weightMap: Record<string, string> = {
    "100": "font-thin",
    "200": "font-extralight",
    "300": "font-light",
    "400": "font-normal",
    "500": "font-medium",
    "600": "font-semibold",
    "700": "font-bold",
    "800": "font-extrabold",
    "900": "font-black",
  };
  return weightMap[weight] || `font-[${weight}]`;
}
