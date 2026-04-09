"use client";

export default function ErrorPage() {
  return (
    <div className="container-shell py-20">
      <div className="card p-8">
        <h1 className="font-serif text-4xl">Something went wrong.</h1>
        <p className="mt-3 text-stone">
          Please retry in a moment. The platform is set up with API-level error handling and can
          be extended with more granular recovery flows.
        </p>
      </div>
    </div>
  );
}
