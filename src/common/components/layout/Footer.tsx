export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="flex justify-between items-center max-w-screen-xl mx-auto w-full py-4 px-6">
      <span className="font-bold text-sm">©{year} Mason Turner</span>
      <div>
        <a href="https://www.github.com/tb9-mason" target="_blank" rel="noreferrer">
          <img src="github-mark-white.svg" alt="GitHub" className="w-5" />
          <span className="sr-only">View on GitHub</span>
        </a>
      </div>
    </footer>
  );
};
