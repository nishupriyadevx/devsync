import React from "react";
import { Editor } from "@monaco-editor/react";

export default function CodeEditor(){
    return(
        <div className="h-screen bg-gray-900 p-4">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                defaultValue="//Start typing your code here..."
                theme="vs-dark"
            />
        </div>
    )
}