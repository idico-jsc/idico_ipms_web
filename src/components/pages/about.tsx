interface Props extends React.ComponentProps<'div'> {}

export const About = ({ ...rest }: Props) => {

  return (
    <div className="container mx-auto px-4 py-16" {...rest}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <div className="space-y-4 text-lg">
          <p>
            Welcome to our React + TypeScript starter template. This project is
            built with modern web technologies and best practices.
          </p>
          <p>Features include:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>⚡ Vite for lightning-fast development</li>
            <li>⚛️ React 18 with TypeScript</li>
            <li>🎨 Tailwind CSS for styling</li>
            <li>🌐 i18n for internationalization</li>
            <li>🌙 Dark mode support</li>
            <li>📱 Responsive design</li>
            <li>🚀 File-based routing (Next.js style)</li>
            <li>🧩 Atomic Design structure</li>
          </ul>
          <p className="pt-4">Built with ❤️ by the open source community.</p>
        </div>
      </div>
    </div>
  );
};
