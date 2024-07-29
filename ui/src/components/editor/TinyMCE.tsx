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
        height: 400,
        autoresize_min_height: 400,
        autoresize_max_height: 800,
        toolbar_mode: "wrap",
        toolbar_sticky: true,
        plugins:
          "autoresize link markdown emoticons image code table lists advlist fullscreen directionality",
        menubar: false,
        toolbar:
          "table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol| undo redo | styles | fontsizeinput | formatselect fontselect fontsizeselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | ltr rtl | outdent indent | bullist numlist | link image media | emoticons charmap | hr removeformat | code codesample preview fullscreen | save searchreplace visualchars spellchecker template pagebreak anchor nonbreaking advlist insertdatetime wordcount toc",
        font_size_input_default_unit: "pt",
      }}
      value={initialValue}
      onEditorChange={onEditorChange}
    />
  );
};

export default TinyMCEEditor;
