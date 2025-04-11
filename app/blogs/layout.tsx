export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}
