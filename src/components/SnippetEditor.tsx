import Editor from '@monaco-editor/react';
import { useSnippetStore } from '../store/SnippetStore';
import { desktopDir } from "@tauri-apps/api/path";
import { writeTextFile } from "@tauri-apps/api/fs";
import { useEffect, useState } from 'react';
import { TfiPencil } from "react-icons/tfi";

export default function SnippetEditor() {
  const selectedSnippet = useSnippetStore((state) => state.selectedSnippet);

  const [text, setText] = useState<string | undefined>("");

  useEffect(() => {
    if (!selectedSnippet) return;

    const guardarTexto = setTimeout(async () => {
      // Realizar el guardado aquí
      console.log(`Guardando texto: ${text}`);
      const desktopPath = await desktopDir();
      await writeTextFile(
        `${desktopPath}/Programacion/Snippets/${selectedSnippet.name}.json`,
        text ?? ""
      );
    }, 1000); // Esperar 1 segundo después de la última escritura
    return () => {
      clearTimeout(guardarTexto);
    };
  }, [text]);

  return (
    <>
      {selectedSnippet ? (
        <Editor
          height="100vh"
          theme="vs-dark"
          defaultLanguage="javascript"
          defaultValue="// save your snippet"
          className="text-2xl"
          options={{
            fontSize: 15,
          }}
          onChange={(value) => setText(value)}
          value={selectedSnippet.code ?? ""}
        />
      ) : (
        <TfiPencil className="text-9xl text-neutral-500" />
      )}
    </>
  );
}
