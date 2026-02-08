import React from "react"
import Navbar from "@/components/Navbar"
import Todo from "@/components/Todo"
import useLocalStorage from "@/hooks/useLocalStorage"

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

function App() {
  const [isDark, setIsDark] = useLocalStorage("theme", false);
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark]);

  return (
    <div className="space-y-7 md:space-y-10 custom-scrollbar">

      <div className="sm:w-[80%] md:w-[55%] sm:mx-auto">
        <Navbar isDark={isDark} setTodos={setTodos} setIsDark={setIsDark} />
        <p className={`h-px flex-1 ${isDark ? "bg-gray-700" : "bg-gray-300"}`} />
      </div>

      <div className="px-6 md:px-0 sm:w-[80%] md:w-[55%] sm:mx-auto">
        <Todo isDark={isDark} todos={todos} setTodos={setTodos} />
      </div>

      <div className={`sm:w-[80%] md:w-[55%] sm:mx-auto relative -mt-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f5f5f5]"} w-full text-center`}>
        <p className={`h-px flex-1 ${isDark ? "bg-gray-700" : "bg-gray-300"}`} />
        <p className="px-6 md:px-0 text-xs font-medium opacity-50 tracking-widest py-6">
          ©{new Date().getFullYear()} SIFAANDEV - ALL RIGHTS RESERVED
        </p>
      </div>

    </div>
  )
}

export default App