interface ErrorsProps {
  text: string;
}

function Errors({ text }: ErrorsProps) {
  return (
    <div className="rounded border border-red-900/30 bg-red-950/10 p-4">
      <p className="text-sm text-red-400">{text}</p>
    </div>
  );
}

export default Errors;