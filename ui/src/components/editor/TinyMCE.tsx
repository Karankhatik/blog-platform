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
        height: 700,
        width: 700,
        plugins:
          "link markdown emoticons image code table lists advlist fullscreen directionality",
        menubar: false,
        toolbar:
          "undo redo | styles | fontsizeinput | formatselect fontselect fontsizeselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | ltr rtl | outdent indent | bullist numlist | link image media | emoticons charmap | hr removeformat | code codesample preview fullscreen | save searchreplace visualchars spellchecker template pagebreak anchor nonbreaking advlist insertdatetime wordcount toc",
        font_size_input_default_unit: "pt",
      }}
      value={initialValue}
      onEditorChange={onEditorChange}
    />
  );
};

export default TinyMCEEditor;
