// components/TinyMCEEditor.tsx
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  initialValue: string;
  onEditorChange: (content: string) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  initialValue,
  onEditorChange,
}) => {
  return (
    <Editor
      init={{
        width: "100%",
        height: 600, // Increased height for better coding visibility
        toolbar_mode: "wrap",
        toolbar_sticky: true,
        plugins:
          "autoresize link markdown emoticons image code table lists advlist fullscreen directionality codesample charmap textpattern preview",
        menubar: false,
        toolbar:
          "undo redo | styles | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | link image media | codesample code | emoticons charmap | hr removeformat | preview fullscreen | save searchreplace visualchars spellchecker template pagebreak anchor nonbreaking advlist insertdatetime wordcount toc",
        font_size_input_default_unit: "pt",
        codesample_dialog_width: 600,
        codesample_dialog_height: 400,
        content_css: "//www.tiny.cloud/css/codepen.min.css", // Optional: Add custom CSS
      }}
      value={initialValue}
      onEditorChange={onEditorChange}
    />
  );
};

export default TinyMCEEditor;
