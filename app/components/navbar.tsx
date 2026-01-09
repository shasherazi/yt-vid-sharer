import { SiGithub } from "@icons-pack/react-simple-icons";

export default function Navbar() {
  return (
    <nav className="navbar w-full flex justify-end">
      <ul className="nav-links">
        <div className="relative size-fit px-2 py-2 m-4 rounded-lg hover:bg-gray-800">
          <li>
            <a
              href="https://github.com/shasherazi/yt-vid-sharer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGithub size={32} title="GitHub" />
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
}
