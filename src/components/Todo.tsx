import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

type TodoProps = {
  isDark: boolean;
  todos: Todo[]; 
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

interface EditState {
  id: number | null;
  isCompleted: boolean | null;
}

export default function Todo({isDark, todos, setTodos}: TodoProps) {
  const [defaultTab, setDefaultTab] = React.useState<string>("Active");
  const [text, setText] = React.useState<string>("");

  const [editItem, setEditItem] = React.useState<EditState>({id: null, isCompleted: null});

  const handleSave = () => {
    if (!text.trim()) {
      toast.error("Oops! Task cannot be empty.");
      return;
    };

    if (editItem.id) {
      const updated = todos.map(item => item.id === editItem.id ? {...item, text: text}: item)
      toast.success("Task updated")
      setTodos(updated)
      setEditItem({id: null, isCompleted: null});
    } else {
      toast.success("Task added")
      setTodos(prev => [...prev, {id: Date.now(), text, isCompleted: false}])
    }
    setText("")
  };

  const displayTodos = React.useMemo(() => {
    return todos.filter(item => {
      const matchesTab = defaultTab === "Active" ? !item.isCompleted :
      defaultTab === "Completed" ? item.isCompleted : true;

      const matcheSearch = item.text.toLowerCase().includes(text.toLowerCase().trim());
      return matchesTab && matcheSearch
    });
  }, [defaultTab, todos, text]);

  const toggleCheckbox = (id: number) => {
    const toggleItem = todos.map((item) => {
      if (item.id === id) {
        return {...item, isCompleted: !item.isCompleted}
      } else {
        return item
      }
    })
    toast("Changes saved!")
    setTodos(toggleItem)
  };

  const handleEdit = (item: Todo) => {
    setEditItem({id: item.id, isCompleted: item.isCompleted})
    setText(item.text)
  };

  const handleDelete = (id: number) => {
    const deleteItem = todos.filter(item => item.id !== id)
    if (confirm("Do you want to delelte this todo..?")) {
      setTodos(deleteItem)
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10">

      <div className="space-y-2 md:space-y-3">
        <h2 className="text-2xl font-medium ml-1">New Todo</h2>

        <div className={`flex flex-wrap justify-between items-center rounded-full border transition 
          ${isDark ? "bg-gray-800 border-gray-700/35" : "bg-white border-gray-200"}`}>

          <input onChange={(e)=> setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSave()} value={text} type="text" placeholder="Add or search todo"
            className={`flex-1 pl-5 py-3 focus:outline-none ${isDark ? "text-white" : "text-black"} placeholder:opacity-75`} />

          <div onClick={handleSave} className="flex justify-center items-center w-13 h-13 bg-blue-500 hover:opacity-75 active:scale-105 transition rounded-full cursor-pointer">
            {!editItem.id ? (
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                <rect x="2" y="2" width="40" height="40" rx="10" />
                <path d="M22 14V30M14 22H30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg height="30" width="30" viewBox="0 -960 960 960" fill="white">
                <path d="M400-304 240-464l56-56 100 104 274-274 35 56-320 320Z"/>
              </svg>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className={`sticky top-0 z-10 flex justify-between gap-5 pt-3 pb-2 sm:pt-4 sm:pb-3 ${isDark ? "bg-[#0f172a]" : "bg-[#f5f5f5]"}`}>
          <h2 className="text-2xl font-medium ml-1 flex-shrink-0">Todo List</h2>

          <div className="flex gap-2 overflow-x-auto">
            {["Active", "Completed", "All Todos"].map((item, index) => 
              <span key={index} onClick={() => setDefaultTab(item)}
                className={`cursor-pointer flex-shrink-0 px-2 pb-1 transition
                  ${item === defaultTab ? "text-blue-500 font-semibold border-b-2 border-blue-500" : "opacity-60 hover:opacity-100"}`}>
                {item}
              </span>
            )}
          </div> 
        </div>

        <div className={`px-2 ${displayTodos.length === 0 ? "min-h-[calc(100vh-410px)]" : "min-h-[calc(100vh-420px)]"}`}>

          {displayTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center relative top-20 md:top-10 lg:top-5 text-center">
              <div className="w-24 h-24 mb-6 opacity-30">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {defaultTab === "Active" && "No Active Tasks"}
                {defaultTab === "Completed" && "No Completed Tasks"}
                {defaultTab === "All Todos" && "No Tasks Found"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                {defaultTab === "Active" && "All caught up! Add new tasks to get started."}
                {defaultTab === "Completed" && "Complete some tasks to see them here."}
                {defaultTab === "All Todos" && "Start by adding your first task above."}
              </p>
            </div>
          ) : displayTodos.map(item => (
            <div key={item.id} className={`flex justify-between -m-2 pl-4 pr-2 py-4 my-3 rounded-2xl border transition 
              ${isDark ? "bg-gray-800 border-gray-800 opacity-75 hover:opacity-100" : "bg-white border-gray-200 hover:opacity-75"}`}>

              <div className="flex flex-col gap-2">
                <p className={`line-clamp-2 pr-6 ${item.isCompleted ? "line-through opacity-60" : ""}`}>
                  {item.text}
                </p>

                <div className="flex gap-4">
                  <button onClick={()=> handleEdit(item)} className="hover:opacity-75 active:scale-105">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={()=> handleDelete(item.id)} className="hover:opacity-75 active:scale-105">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>

              <div onClick={() => toggleCheckbox(item.id)} className="flex items-center px-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition ${item.isCompleted ? "bg-green-600" : "bg-gray-400"}`}>
                  {item.isCompleted && <svg height="30" width="30" viewBox="0 -960 960 960" fill="white">
                    <path d="M400-304 240-464l56-56 100 104 274-274 35 56-320 320Z"/>
                  </svg>}
                </div>
              </div>

            </div>
          ))}
        </div> 
      </div>

      <ToastContainer theme={isDark ? "dark" : "light"} />
    </div>
  );
}