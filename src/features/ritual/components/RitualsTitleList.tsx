const RitualsTitleList = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="max-w-8xl mx-auto px-4 space-y-3">
      <h1 className="py-5 text-4xl font-bold text-foreground">{title}</h1>

      {children}
    </div>
  );
};

export default RitualsTitleList;
