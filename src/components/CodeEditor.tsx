import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Loader2, 
  Code, 
  Terminal, 
  Sun, 
  Moon, 
  Settings, 
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  FileText,
  Zap
} from 'lucide-react';

interface Language {
  id: string;
  name: string;
  extension: string;
  defaultCode: string;
  color: string;
  apiUrl: string;
}

const languages: Language[] = [
  {
    id: 'js',
    name: 'JavaScript',
    extension: 'js',
    color: 'text-yellow-400',
    apiUrl: 'https://coderunner-klzl.onrender.com/api/run-js',
    defaultCode: `// Welcome to the Online Code Runner
console.log("Hello, World!");
// You can write your JavaScript code here`
  },
  {
    id: 'python',
    name: 'Python',
    extension: 'py',
    color: 'text-blue-400',
    apiUrl: 'https://coderunner-klzl.onrender.com/api/run-python',
    defaultCode: `# Welcome to the Online Code Runner
print("Hello, World!")
# You can write your Python code here`
  },
  {
    id: 'c',
    name: 'C',
    extension: 'c',
    color: 'text-blue-500',
    apiUrl: 'https://coderunner-klzl.onrender.com/api/run-c',
    defaultCode: `#include <stdio.h>

// Welcome to the Online Code Runner
int main() {
    printf("Hello, World!\\n");  
    return 0;
}`
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: 'cpp',
    color: 'text-purple-400',
    apiUrl: 'https://coderunner-klzl.onrender.com/api/run-cpp',
    defaultCode: `#include <iostream>
using namespace std;

// Welcome to the Online Code Runner
int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
  },
  {
    id: 'java',
    name: 'Java',
    extension: 'java',
    color: 'text-red-400',
    apiUrl: 'https://java-app-e7h2.onrender.com/run-java',
    defaultCode: `// Welcome to the Online Code Runner
import java.util.*;

public class Main {
     public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  }
];

const CodeEditor: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [code, setCode] = useState<string>(languages[0].defaultCode);
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(14);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLanguageChange = (languageId: string) => {
    const language = languages.find(lang => lang.id === languageId);
    if (language) {
      setSelectedLanguage(language);
      setCode(language.defaultCode);
      setOutput('');
      setError('');
    }
  };

  const runCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to run');
      return;
    }

    setIsLoading(true);
    setOutput('');
    setError('');

    try {
      const response = await fetch(selectedLanguage.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: code,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while running the code');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const { selectionStart, selectionEnd, value } = textarea;
    
    // Auto-bracket completion
    const brackets: { [key: string]: string } = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };
    
    if (brackets[e.key]) {
      e.preventDefault();
      const before = value.substring(0, selectionStart);
      const after = value.substring(selectionEnd);
      const newValue = before + e.key + brackets[e.key] + after;
      
      setCode(newValue);
      
      // Set cursor position between brackets
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
    }
    
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const before = value.substring(0, selectionStart);
      const after = value.substring(selectionEnd);
      const newValue = before + '  ' + after; // 2 spaces
      
      setCode(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      }, 0);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main.${selectedLanguage.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';
  
  const headerClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200 shadow-sm';
  
  const editorClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';
  
  const panelClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-gray-100 border-gray-200';

  const outputClasses = isDarkMode 
    ? 'bg-gray-900' 
    : 'bg-white';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 ${headerClasses}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Code className="w-8 h-8 text-blue-500" />
                <Zap className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  CodeRunner IDE
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Professional Online Compiler
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <FileText className={`w-4 h-4 ${selectedLanguage.color}`} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                main.{selectedLanguage.extension}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Font Size:
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className={`px-2 py-1 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
            </div>

            <select
              value={selectedLanguage.id}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={`px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={copyCode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              
              <button
                onClick={downloadCode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title="Download code"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
            
            <button
              onClick={runCode}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-700 disabled:to-green-800 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-80px)]'}`}>
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">          
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full h-full p-4 font-mono resize-none focus:outline-none transition-colors ${editorClasses}`}
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Consolas', monospace",
                lineHeight: '1.6',
                tabSize: 4,
                fontSize: `${fontSize}px`,
                paddingLeft: '4rem',
              }}
              placeholder="Write your code here..."
              spellCheck={false}
            />
            
            {/* Line numbers */}
            <div className={`absolute top-0 left-0 w-14 h-full border-r pointer-events-none transition-colors ${panelClasses}`}>
              <div className="p-4 text-sm font-mono leading-6" style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}>
                {code.split('\n').map((_, index) => (
                  <div key={index} className={`text-right pr-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className={`w-96 border-l flex flex-col transition-colors ${panelClasses}`}>
          <div className={`px-4 py-3 border-b transition-colors ${panelClasses}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <h2 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Output Console
                </h2>
              </div>
              {(output || error) && (
                <button
                  onClick={() => {
                    setOutput('');
                    setError('');
                  }}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className={`flex-1 p-4 overflow-auto transition-colors ${outputClasses}`}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-32 space-y-3">
                <div className="relative">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Executing {selectedLanguage.name} code...
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Please wait
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-red-500 text-sm">Execution Error</span>
                </div>
                <div className={`p-3 rounded-lg border-l-4 border-red-500 font-mono text-sm whitespace-pre-wrap ${
                  isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                }`}>
                  {error}
                </div>
              </div>
            ) : output ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={`font-semibold text-green-500 text-sm`}>Output</span>
                </div>
                <div className={`p-3 rounded-lg border-l-4 border-green-500 font-mono text-sm whitespace-pre-wrap ${
                  isDarkMode ? 'bg-green-900/20 text-green-100' : 'bg-green-50 text-green-800'
                }`}>
                  {output}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 space-y-3">
                <Terminal className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ready to execute
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                    Click "Run Code" to see the output
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;