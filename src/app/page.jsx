import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="foundation" aria-labelledby="page-title">
        <p className="foundation__status">Application foundation active</p>
        <h1 id="page-title">CockpitPath</h1>
        <p className="foundation__summary">
          The production application scaffold is ready for intentional product
          implementation.
        </p>
        <p>
          <Link href="/auth/sign-in">Sign in</Link> or{" "}
          <Link href="/auth/sign-up">create an account</Link>.
        </p>
      </section>
    </main>
  );
}
