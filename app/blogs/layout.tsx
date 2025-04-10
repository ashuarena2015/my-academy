import { title } from "@/components/primitives";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1 className={title()}>Blogs</h1>
      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}
