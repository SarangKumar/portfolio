/** Inline JSON-LD structured data. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(data).replace(/</g, "\\u003c")}
    </script>
  );
}
