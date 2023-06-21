import { useSnippetStore } from "../store/SnippetStore";
import { desktopDir, join } from "@tauri-apps/api/path";
import { toast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { removeFile, readTextFile } from "@tauri-apps/api/fs";
import { FiTrash, FiX } from "react-icons/fi";

type SnippetItemProps = {
  file: string;
};

export default function SnippetItem({ file }: SnippetItemProps) {
  const removeSnippetName = useSnippetStore((state) => state.removeSnippetName);
  const setSelectSnippet = useSnippetStore((state) => state.setSelectedSnippet);
  const selectedSnippetName = useSnippetStore((state) => state.selectedSnippet);
  console.log(selectedSnippetName);

  const handleDelete = async (file: string) => {
    const accept = await window.confirm(
      "Are you sure you want to delete this snippet?"
    );
    if (!accept) return;

    const desktopPath = await desktopDir();
    const filePath = await join(desktopPath, "/Programacion/Snippets", `${file}.json`);
    await removeFile(filePath);

    removeSnippetName(file);

    toast.success("Snippet deleted", {
      duration: 2000,
      position: "bottom-right",
      style: {
        background: "#202020",
        color: "#fff",
      },
    });
  };

  return (
    <li
      className={twMerge(
        "task py-2 px-4 hover:bg-neutral-900 hover:cursor-pointer flex justify-between",
        selectedSnippetName?.name === file ? "bg-sky-500" : ""
      )}
      onClick={async () => {

        setSelectSnippet(null);

        const desktopPath = await desktopDir();
        const filePath = await join(desktopPath, "/Programacion/Snippets", `${file}.json`);
        const snippet = await readTextFile(filePath);
        console.log(snippet)
        setSelectSnippet({
          name: file,
          code: snippet,
        });
      }}
    >
      {file}

      {setSelectSnippet && (
        <div className={"flex gap-2 items-center justify-center"}>
          <FiTrash
            className="text-neutral-500"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(file);
            }}
          />
          <FiX
            className="text-neutral-500 text-xl"
            onClick={(e) => {
              e.stopPropagation();
              setSelectSnippet(null);
            }}
          />
        </div>
      )}
    </li>
  );
}