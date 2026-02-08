import React from "react"
import { toast } from 'react-toastify';

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

type NavbarProps = {
  isDark: boolean,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>,
}

function Navbar({isDark, setTodos, setIsDark }: NavbarProps) {
  const [openMenu, setOpenMenu] = React.useState<boolean>(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleEvent = (event: Event) => {
      if (openMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false)
      }
    };

    document.addEventListener("mousedown", handleEvent)
    window.addEventListener("scroll", handleEvent)

    return () => {
      document.removeEventListener("mousedown", handleEvent);
      window.removeEventListener("mousedown", handleEvent);
    };
  }, [openMenu]);

  return (
    <div className="px-6 md:px-0 py-4 flex flex-wrap justify-between items-center">
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
        TodoFlex
      </h1>

      <div ref={menuRef} className="relative">
        <svg onClick={() => setOpenMenu(prev => !prev)} className="cursor-pointer hover:opacity-75 transition" width="26" height="27" viewBox="0 0 32 28" fill="none">
          <line x1="3" y1="5" x2="29" y2="5" stroke={isDark ? "white" : "black"} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="3" y1="14" x2="19" y2="14" stroke={isDark ? "white" : "black"} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="3" y1="23" x2="29" y2="23" stroke={isDark ? "white" : "black"} strokeWidth="3.5" strokeLinecap="round" />
        </svg>

        <div className={`flex flex-col gap-4 pl-8 pr-10 py-4 absolute top-12 right-1 z-30 rounded-xl transition-all duration-200 border backdrop-blur-md
            ${openMenu ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-2 pointer-events-none"} 
            ${isDark ? "bg-gray-900/90 border-gray-800 text-white" : "bg-white/90 border-gray-200"}`}>

          <strong className="font-medium text-lg">Appearance</strong>

          <div className="flex items-center gap-2 active:opacity-75">
            <input name="theme" checked={!isDark} onChange={() => setIsDark(false)} id="default-radio-1" type="radio" className="w-3 h-3 rounded-full border-2 border-gray-400 appearance-none checked:bg-blue-500 transition cursor-pointer" />
            <label htmlFor="default-radio-1" className="select-none flex-1">Light</label>
          </div>

          <div className="flex items-center gap-2 active:opacity-75">
            <input name="theme" checked={isDark} onChange={() => setIsDark(true)} id="default-radio-2" type="radio" className="w-3 h-3 rounded-full border-2 border-gray-400 appearance-none checked:bg-blue-500 transition cursor-pointer" />
            <label htmlFor="default-radio-2" className="select-none flex-1">Dark</label>
          </div>

          <strong className="font-medium text-lg mt-4">Todos</strong>
          <p onClick={() => {
            if (confirm("Do you want to delete all todos")) {
              toast.success("All todos deleted")
              setTodos([])
            }
          }} className="cursor-pointer text-red-500 hover:opacity-75 active:opacity-75">Delete All</p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Navbar);