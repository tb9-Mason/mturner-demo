import { Link } from 'react-router';

export const Header = () => {
  return (
    <header className="max-w-screen-xl mx-auto w-full py-4 px-6">
      <ul className="flex flex-row gap-2">
        <li>
          <Link to="">Home</Link>
        </li>
        <li>
          <Link to="albums">Albums</Link>
        </li>
      </ul>
    </header>
  );
};
