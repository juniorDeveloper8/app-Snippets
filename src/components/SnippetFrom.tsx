import {writeTextFile} from '@tauri-apps/api/fs'
import {desktopDir, join} from '@tauri-apps/api/path'
import React, { useState } from 'react'
import { toast } from "react-hot-toast";
import { useSnippetStore } from '../store/SnippetStore'

export default function SnippetFrom() {

  /**
   * esto es un estado par guardar nuestra porcion de codigo 
   */
  const [snippetName, setSnippetName] = useState<string>('');
  const addSnippetName = useSnippetStore((state) => state.addSnippetName);
  const snippetNames = useSnippetStore((state) => state.snippetsNames);

 
    /**
     * el desktopDir es una funsión asincorna asi q tenemos que poner
     * await y asycn
     * ademas es ves de arrojar alertas mejor utilizamos writeTextFile para q 
     * pudea guardar nuestros snippets.
     * 
     * dentro del input generamos una funcion flecha para pasar el estado e a un
     * estado modificado con target y lo evaluamos
    */
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      
      e.preventDefault()
      if (!snippetName || snippetName === "") {
        // alert("Please write a snippet name");
        toast.error("Please write a snippet name", {
          duration: 2000,
          position: "bottom-right",
          style: {
            background: "#202020",
            color: "#fff",
          },
        });
        return;
      }
  
      // file already exists
      if (snippetNames.includes(snippetName)) {
        toast.error("Snippet already exists", {
          duration: 2000,
          position: "bottom-right",
          style: {
            background: "#202020",
            color: "#fff",
          },
        });
        return;
      }
  
      const desktopPath = await desktopDir()
      await writeTextFile(`${desktopPath}\Programacion/Snippets/${snippetName}.json`, "")
      addSnippetName(snippetName);
      setSnippetName('')
      
      toast.success("Snippet saved", {
        duration: 2000,
        position: "bottom-right",
        style: {
          background: "#202020",
          color: "#fff",
        },
      });
    };
    
      return (
        <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Write a Snippet"
          onChange={(e) => setSnippetName(e.target.value)}
          className="bg-zinc-900 w-full border-none outline-none p-4"
          autoFocus
          value={snippetName}
        />
        <button className="hidden">save</button>
      </form>
      )
}
