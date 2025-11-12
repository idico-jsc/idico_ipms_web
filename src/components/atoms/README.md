# Atoms

Atoms are the smallest building blocks of the UI. They are basic HTML elements like buttons, inputs, labels, etc.

## Examples
- Button
- Input
- Label
- Icon
- Typography components

## Guidelines
- Should be simple and reusable
- Should not contain business logic
- Should accept props for customization
- Shadcn UI components are installed here
- **⚠️ IMPORTANT: Atoms must NOT import other atoms** - Each atom should be completely independent and only use native HTML elements or external libraries (like Radix UI, etc.)
