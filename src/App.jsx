import Header from "./Components/Header.jsx";
import SignIn from "./Components/SignIn.jsx";

function App() {
  if (window.location.pathname === "/signin") {
    return <SignIn />;
  }

  return (
    <main className="min-h-screen bg-white text-[#6B352A]">
      <Header />

      <section
        id="home"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-12 md:grid-cols-2 md:pb-28 md:pt-20"
      >
        <div>
          <p className="mb-5 w-fit rounded-full bg-[#FFF1A6] px-4 py-2 text-sm font-bold uppercase tracking-[0.12em]">
            A calmer way to work together
          </p>
          <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Big plans,
            <br />
            made manageable.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8">
            Forma is a simple project management app. It helps your team keep
            tasks, deadlines, and ideas together, so everyone knows what to do
            next.
          </p>
          <a
            href="#features"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#6B352A] px-6 py-3 font-semibold text-[#FFF1A6] transition hover:opacity-90"
          >
            Take a look <span aria-hidden="true">→</span>
          </a>
        </div>

        <div
          aria-label="Example project task list"
          className="rounded-3xl border-2 border-[#6B352A] bg-white p-6 shadow-[8px_8px_0_#6B352A] md:p-8"
        >
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold opacity-70">YOUR PROJECT</p>
              <h2 className="mt-1 text-2xl font-bold">A little more organized</h2>
            </div>
            <span className="rounded-full bg-[#FFF1A6] px-3 py-2 text-sm font-bold">
              3 tasks
            </span>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-3 rounded-2xl border border-[#6B352A]/15 p-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#6B352A]" />
              <span className="font-medium">Write down the big idea</span>
            </li>
            <li className="flex items-center gap-3 rounded-2xl bg-[#FFF1A6] p-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#6B352A]">
                <span aria-hidden="true">✓</span>
              </span>
              <span className="font-medium line-through opacity-60">
                Get everyone on the same page
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-2xl border border-[#6B352A]/15 p-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#6B352A]" />
              <span className="font-medium">Make the next step happen</span>
            </li>
          </ul>

          <p className="mt-6 text-sm opacity-70">
            One shared list. A lot less “who’s doing that?”
          </p>
        </div>
      </section>

      <section id="features" className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em]">
            The short version
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Everything your project needs, without the fuss.
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <article>
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#FFF1A6] text-2xl" aria-hidden="true">✎</span>
              <h3 className="mt-4 text-xl font-bold">Keep it all together</h3>
              <p className="mt-2 leading-7">
                Tasks, notes, and plans live in one easy-to-find place.
              </p>
            </article>
            <article>
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#FFF1A6] text-2xl" aria-hidden="true">☀</span>
              <h3 className="mt-4 text-xl font-bold">See what’s next</h3>
              <p className="mt-2 leading-7">
                Clear priorities help everyone focus on the next step.
              </p>
            </article>
            <article>
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#FFF1A6] text-2xl" aria-hidden="true">♡</span>
              <h3 className="mt-4 text-xl font-bold">Make progress together</h3>
              <p className="mt-2 leading-7">
                Share updates and celebrate the little wins along the way.
              </p>
            </article>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <span className="font-bold">forma.</span>
        <span>Good work, made a little simpler.</span>
      </footer>
    </main>
  );
}

export default App;
