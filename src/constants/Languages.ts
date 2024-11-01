export default [
  {
    languageName: "C++",
    value: "c_cpp",
  },
  {
    languageName: "Java",
    value: "java",
  },
  {
    languageName: "JavaScript",
    value: "javascript",
  },
  {
    languageName: "Python",
    value: "python",
  },
];

type LanguageMapping = {
  [key: string]: string;
};

export const languageMappings: LanguageMapping = {
  c_cpp: "CPP",
  python: "PYTHON",
  java: "JAVA",
  javascript: "NODEJS",
};
