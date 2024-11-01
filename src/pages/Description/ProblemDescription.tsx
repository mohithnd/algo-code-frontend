import { useState, DragEvent, useContext } from "react";
import AceEditor from "react-ace";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "../../imports/AceBuildImports";
import DOMPurify from "dompurify";

import Languages, { languageMappings } from "../../constants/Languages";

import Themes from "../../constants/Themes";
import { SUBMISSIONS_API } from "../../configs/ServerConfig";
import { SocketContext } from "../../contexts/SocketContext";

type languageSupport = {
  languageName: string;
  value: string;
};

type themeStyle = {
  themeName: string;
  value: string;
};

function Description({
  descriptionText,
}: Readonly<{ descriptionText: string }>) {
  const sanitizedMarkdown = DOMPurify.sanitize(descriptionText);

  const [activeTab, setActiveTab] = useState("statement");
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [theme, setTheme] = useState("monokai");

  const { userId, problemId, response, setResponse } =
    useContext(SocketContext);

  async function handleSubmission() {
    console.log("Submission initiated with language:", language);
    try {
      if (code === "") {
        console.log("No code to submit");
        return;
      }

      setResponse("Pending");
      const response = await axios.post(SUBMISSIONS_API, {
        code,
        language: languageMappings[language],
        userId,
        problemId,
      });
      console.log("Submission response received:", response);
      return response;
    } catch (error) {
      console.error("Error during submission:", error);
    }
  }

  const startDragging = (e: DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.preventDefault();
    console.log("Started dragging");
  };

  const stopDragging = () => {
    if (isDragging) {
      setIsDragging(false);
      console.log("Stopped dragging");
    }
  };

  const onDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 10 && newLeftWidth < 90) {
      setLeftWidth(newLeftWidth);
      console.log("Panel resized to:", newLeftWidth);
    }
  };

  const isActiveTab = (tabName: string) => {
    if (activeTab === tabName) {
      return "tab tab-active";
    } else {
      return "tab";
    }
  };

  return (
    <div
      className="flex w-screen h-[calc(100vh-57px)]"
      onMouseMove={onDrag}
      onMouseUp={stopDragging}
    >
      <div
        className="leftPanel h-full overflow-auto"
        style={{ width: `${leftWidth}%` }}
      >
        <div role="tablist" className="tabs tabs-boxed w-3/5">
          <button
            onClick={() => setActiveTab("statement")}
            role="tab"
            className={isActiveTab("statement")}
          >
            Problem Statement
          </button>
          <button
            onClick={() => setActiveTab("editorial")}
            role="tab"
            className={isActiveTab("editorial")}
          >
            Editorial
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            role="tab"
            className={isActiveTab("submissions")}
          >
            Submissions
          </button>
        </div>
        <div className="markdownViewer p-[20px] basis-1/2">
          <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose">
            {sanitizedMarkdown}
          </ReactMarkdown>
        </div>
      </div>
      <div
        className="divider cursor-col-resize w-[5px] bg-slate-200 h-full"
        onMouseDown={startDragging}
      ></div>
      <div
        className="rightPanel h-full overflow-auto flex flex-col"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <div className="flex gap-x-1.5 justify-start items-center px-4 py-2 basis-[5%]">
          <div>
            <button
              className="btn btn-success btn-sm"
              onClick={handleSubmission}
            >
              Submit
            </button>
          </div>
          <div>
            <button className="btn btn-warning btn-sm">Run Code</button>
          </div>
          <div>
            <select
              className="select select-info w-full select-sm max-w-xs"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {Languages.map((language: languageSupport) => (
                <option key={language.value} value={language.value}>
                  {language.languageName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="select select-info w-full select-sm max-w-xs"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {Themes.map((theme: themeStyle) => (
                <option key={theme.value} value={theme.value}>
                  {theme.themeName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col editor-console grow">
          <div className="editorContainer flex-grow">
            <AceEditor
              mode={language}
              theme={theme}
              value={code}
              onChange={(e: string) => setCode(e)}
              name="codeEditor"
              className="editor"
              style={{ width: "100%" }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                fontSize: 16,
              }}
              height="100%"
            />
          </div>
          <div className="bg-base-200 p-4 rounded-md mt-2 max-h-[40vh] flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <div className="bg-neutral text-white rounded-md p-4 overflow-y-auto flex-grow">
              {response}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Description;
