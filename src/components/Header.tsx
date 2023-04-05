import { Link } from "react-router-dom";
import { GitHub, Moon, Sun } from "react-feather";
import { ResultDialog } from "./ResultDialog";
import { useThemeContext } from "./ThemeContext";
import { useIsGameRunning } from "../GameStore";
import { GiveUpModal } from "./ConfirmNavigation";
import { useI18nContext } from "../i18n/i18n-react";
import { InterfaceLanguageSelect } from "./InterfaceLanguageSelect";

const Header = () => {
  const { LL } = useI18nContext();

  const links = [
    { name: LL.PLAY(), path: "/settings" },
    { name: LL.ABOUT(), path: "/about" },
  ];

  const { colorMode, switchTheme } = useThemeContext();
  const isGameRunning = useIsGameRunning();

  const imageSrc = colorMode === "light" ? "/new-wiki-logo-light" : "/new-wiki-logo-dark";
  return (
    <div className="flex items-center gap-12 border-b-[2px] border-secondary-blue pb-3">
      <picture className="basis-[200px]">
        <source srcSet={window.location.origin + `/${imageSrc}.webp`} type="image/webp" />

        <source srcSet={window.location.origin + `/${imageSrc}.png`} type="image/png" />
        <img
          className="block h-full"
          src={window.location.origin + `/${imageSrc}.png`}
          alt={LL.WIKI_ALT_TEXT()}
        />
      </picture>
      <nav className="flex h-full flex-1 items-center gap-4">
        <ul className="flex gap-4">
          {!isGameRunning &&
            links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="p-4 hover:text-primary-blue focus-visible:text-primary-blue"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          {isGameRunning && <GiveUpModal />}
        </ul>
        <ResultDialog />
        <ul className="ml-auto flex h-full gap-4">
          {!isGameRunning && <InterfaceLanguageSelect />}
          <li className="h-full">
            <button
              className="flex h-full w-12 items-center justify-center hover:text-primary-blue"
              onClick={switchTheme}
            >
              {colorMode === "light" ? <Sun /> : <Moon />}
            </button>
          </li>
          <li className="h-full">
            <a
              target="_blank"
              href="https://github.com/B0und/WikiSpeedrun"
              className="flex h-full w-12 items-center justify-center hover:text-primary-blue"
              rel="noreferrer"
            >
              <GitHub />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;