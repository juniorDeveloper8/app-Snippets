import { useEffect } from 'react'
import { readDir } from '@tauri-apps/api/fs'
import { desktopDir } from '@tauri-apps/api/path'
import { useSnippetStore } from '../store/SnippetStore'
import SnippetItem from './SnippetItem';

export default function SnippetList() {

  /**
   * funcion para ejecutar una lectura de los archivos creados
   *
   */

  const setSnippetNames = useSnippetStore((state) => state.setSnippetsNames);
  const snippetNames = useSnippetStore((state) => state.snippetsNames);

  useEffect(() => {
    async function loadFiles() {
      const desktopPath = await desktopDir();
      const result = await readDir(`${desktopPath}/Programacion/Snippets`);
      const filenames = result.map((file) => file.name!.split(".")[0]);
      setSnippetNames(filenames);
    }
    loadFiles();
  }, []);

  return (
    <ul>
      {snippetNames.map((file, i) => (
        <SnippetItem key={i} file={file} />
      ))}
    </ul>
  );
}

