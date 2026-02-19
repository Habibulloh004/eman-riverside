"use client";

import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  return (
    <div className={`border border-gray-200 rounded-md ${className || ""}`}>
      <div className="flex flex-wrap gap-2 border-b border-gray-200 px-2 py-1 text-xs text-gray-600">
        <button type="button" onClick={() => exec("bold")} className="px-2 py-1 rounded hover:bg-gray-100">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => exec("italic")} className="px-2 py-1 rounded hover:bg-gray-100">
          <em>I</em>
        </button>
        <button type="button" onClick={() => exec("underline")} className="px-2 py-1 rounded hover:bg-gray-100">
          <u>U</u>
        </button>
        <button type="button" onClick={() => exec("insertUnorderedList")} className="px-2 py-1 rounded hover:bg-gray-100">
          • List
        </button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="px-2 py-1 rounded hover:bg-gray-100">
          1. List
        </button>
        <button type="button" onClick={() => exec("formatBlock", "H3")} className="px-2 py-1 rounded hover:bg-gray-100">
          H3
        </button>
        <button type="button" onClick={() => exec("removeFormat")} className="px-2 py-1 rounded hover:bg-gray-100">
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        className="rte-editor min-h-[96px] p-3 text-sm focus:outline-none"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder || ""}
      />
      <style jsx>{`
        .rte-editor:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
