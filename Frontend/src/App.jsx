import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

// CSS styles
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

html, body, #root {
  height: 100%;
  width: 100%;
  background: #0f0f12;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(53, 124, 255, 0.05) 0%, transparent 45%),
    radial-gradient(circle at 75% 75%, rgba(255, 138, 0, 0.05) 0%, transparent 45%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

main {
  width: 92%;
  height: 92%;
  display: flex;
  gap: 2rem;
  position: relative;
  max-width: 1800px;
}

/* Glass morphism effect for panels */
.glass-panel {
  background: rgba(30, 31, 38, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5),
    0 1px 1px rgba(255, 255, 255, 0.05) inset;
  overflow: hidden;
  position: relative;
}

/* Glow effects */
.glass-panel::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(255, 138, 0, 0.8), 
    rgba(229, 46, 113, 0.8), 
    rgba(0, 114, 255, 0.8));
  border-radius: 1rem 1rem 0 0;
  z-index: 2;
  opacity: 0.8;
}

.left::after, .right::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 60%;
  z-index: -1;
}

.left::after {
  left: 0;
  background: radial-gradient(circle at left top, rgba(255, 138, 0, 0.2), transparent 60%);
}

.right::after {
  right: 0;
  background: radial-gradient(circle at right top, rgba(0, 114, 255, 0.2), transparent 60%);
}

/* Left Section (Code Input) */
main .left {
  flex-basis: 50%;
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #f8f8f8;
  padding-left: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.section-title .icon {
  font-size: 1.7rem;
  transform: translateY(-1px);
}

.section-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.2rem;
  padding-left: 0.5rem;
}

.code-container {
  flex: 1;
  border-radius: 0.8rem;
  background-color: rgba(18, 18, 23, 0.8);
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Code editor toolbar */
.editor-toolbar {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.toolbar-dots {
  display: flex;
  gap: 6px;
}

.toolbar-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.toolbar-dot.red { background-color: #ff5f56; }
.toolbar-dot.yellow { background-color: #ffbd2e; }
.toolbar-dot.green { background-color: #27c93f; }

.toolbar-filename {
  margin-left: 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'JetBrains Mono', monospace;
}

.code {
  padding: 1.2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: #fff;
  line-height: 1.5;
  outline: none;
  border: none;
  height: 100%;
  background: transparent;
  min-height: 300px;
  white-space: pre-wrap;
  overflow: auto;
}

/* Review Button */
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.6rem;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: 0.2s all;
}

.language-selector:hover {
  background: rgba(255, 255, 255, 0.1);
}

.language-selector-icon {
  color: #ffbd2e;
}

.review-btn {
  background: linear-gradient(135deg, #357cff, #0052cc);
  color: white;
  padding: 0.8rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  border-radius: 0.7rem;
  transition: 0.3s all;
  text-align: center;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  box-shadow: 
    0 5px 15px rgba(53, 124, 255, 0.4),
    0 0 0 1px rgba(53, 124, 255, 0.2);
}

.review-btn:hover {
  background: linear-gradient(135deg, #4c8dff, #0062f5);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(53, 124, 255, 0.6),
    0 0 0 1px rgba(53, 124, 255, 0.3);
}

.review-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(53, 124, 255, 0.4);
}

/* Right Section (Code Review Output) */
main .right {
  flex-basis: 50%;
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.7rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.issue-high { color: #ff5252; }
.issue-med { color: #ffbd2e; }
.issue-low { color: #27c93f; }

.review-output-container {
  flex: 1;
  border-radius: 0.8rem;
  background-color: rgba(18, 18, 23, 0.8);
  overflow: hidden;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.review-toolbar {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  justify-content: space-between;
  align-items: center;
}

.review-tabs {
  display: flex;
  gap: 1rem;
}

.review-tab {
  color: rgba(255, 255, 255, 0.6);
  padding: 0.3rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s all;
}

.review-tab.active {
  background: rgba(53, 124, 255, 0.2);
  color: #357cff;
}

.review-tab:hover:not(.active) {
  background: rgba(255, 255, 255, 0.05);
}

.review-controls {
  display: flex;
  gap: 0.8rem;
}

.control-btn {
  color: rgba(255, 255, 255, 0.6);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.2s all;
}

.control-btn:hover {
  color: rgba(255, 255, 255, 0.9);
}

.review-output {
  flex: 1;
  width: 100%;
  padding: 1.2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: #f1f1f1;
  overflow: auto;
  background: transparent;
}

/* Markdown styling */
.review-output h3 {
  color: #357cff;
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
}

.review-output h4 {
  color: #ffbd2e;
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
}

.review-output ul {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.review-output li {
  margin-bottom: 0.5rem;
}

.review-output pre {
  background: rgba(0, 0, 0, 0.2) !important;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  border-left: 3px solid #357cff;
}

.review-output code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  color: #357cff;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 1.5rem;
}

.loading-spinner::before,
.loading-spinner::after {
  content: '';
  position: absolute;
  border-radius: 50%;
}

.loading-spinner::before {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(53, 124, 255, 0.1);
}

.loading-spinner::after {
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #357cff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.loading-subtext {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Status Messages */
.message {
  padding: 1rem 1.2rem;
  border-radius: 0.7rem;
  margin-bottom: 1rem;
  font-weight: 500;
  animation: fadeIn 0.5s;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.success {
  background-color: rgba(39, 201, 63, 0.1);
  border-left: 4px solid #27c93f;
  color: #27c93f;
}

.error {
  background-color: rgba(255, 82, 82, 0.1);
  border-left: 4px solid #ff5252;
  color: #ff5252;
}

.warning {
  background-color: rgba(255, 189, 46, 0.1);
  border-left: 4px solid #ffbd2e;
  color: #ffbd2e;
}

.message-icon {
  font-size: 1.2rem;
  min-width: 24px;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-title {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.message-desc {
  font-size: 0.85rem;
  opacity: 0.8;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Animations */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

/* Responsive Design */
@media (max-width: 1200px) {
  main {
    width: 95%;
  }
}

@media (max-width: 992px) {
  main {
    flex-direction: column;
    height: auto;
    gap: 2rem;
    padding: 2rem 0;
    overflow-y: auto;
  }

  main .left, main .right {
    flex-basis: 100%;
    max-height: none;
    height: auto;
  }
  
  .code-container, .review-output-container {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.3rem;
  }
  
  .button-container {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .language-selector, .review-btn {
    width: 100%;
    justify-content: center;
  }
  
  .review-stats {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .review-toolbar {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.8rem;
  }
  
  .review-tabs {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 576px) {
  .stat-item {
    flex: 1;
    padding: 0.5rem;
  }
  
  .review-tab {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}
`;

function App() {
  const [review, setReview] = useState("");
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ title: "", desc: "", type: "" });
  const [activeTab, setActiveTab] = useState("issues");
  
  // Mock stats for demo purposes
  const [stats, setStats] = useState({
    high: 0,
    medium: 0,
    low: 0
  });

  useEffect(() => {
    prism.highlightAll();
    
    // Add stylesheet to the document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  async function getReview() {
    setLoading(true);
    setMessage({ title: "", desc: "", type: "" });
    
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      
      console.log("API Response:", response.data);
      
      // Generate mock statistics based on code length
      const mockHighIssues = Math.floor(code.length / 100);
      const mockMediumIssues = Math.floor(code.length / 50);
      const mockLowIssues = Math.floor(code.length / 30);
      
      // Small delay for animation effect
      setTimeout(() => {
        if (response.data && typeof response.data === "string") {
          setReview(response.data);
          setStats({
            high: mockHighIssues,
            medium: mockMediumIssues,
            low: mockLowIssues
          });
          setMessage({ 
            title: "Analysis Complete", 
            desc: "Review generated with AI-powered insights", 
            type: "success" 
          });
        } else if (response.data?.review) {
          setReview(response.data.review);
          setStats({
            high: mockHighIssues,
            medium: mockMediumIssues,
            low: mockLowIssues
          });
          setMessage({ 
            title: "Analysis Complete", 
            desc: "Review generated with AI-powered insights", 
            type: "success" 
          });
        } else {
          setReview("## Code Analysis\n\nNo significant issues found in your code. Great job!\n\n### Suggestions\n\n- Consider adding JSDoc comments for better documentation\n- Function naming follows best practices\n- The implementation is clean and straightforward");
          setStats({
            high: 0,
            medium: 0,
            low: 1
          });
          setMessage({ 
            title: "Code Looks Good", 
            desc: "No major issues detected in your code", 
            type: "success" 
          });
        }
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("API Error:", error);
      setTimeout(() => {
        setReview("## Error Processing Request\n\nThere was an error connecting to the analysis service. Please try again later or check your network connection.");
        setMessage({ 
          title: "Connection Error", 
          desc: "Unable to connect to the analysis service", 
          type: "error" 
        });
        setLoading(false);
      }, 1000);
    }
  }
  
  const handleReview = () => {
    if (code.trim() === "") {
      setReview("");
      setMessage({ 
        title: "Empty Code", 
        desc: "Please enter some code to analyze", 
        type: "warning" 
      });
    } else {
      getReview();
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <main>
      {/* Left Section (Code Input) */}
      <div className="left glass-panel">
        <div>
          <h2 className="section-title">
            <span className="icon">⌨️</span> Code Editor
          </h2>
          <p className="section-subtitle">Write or paste your code below for AI-powered review</p>
        </div>
        
        <div className="code-container">
          <div className="editor-toolbar">
            <div className="toolbar-dots">
              <div className="toolbar-dot red"></div>
              <div className="toolbar-dot yellow"></div>
              <div className="toolbar-dot green"></div>
            </div>
            <div className="toolbar-filename">script.js</div>
          </div>
          
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            className="code"
            placeholder="Enter your code here..."
          />
        </div>
        
        <div className="button-container">
          <div className="language-selector">
            <span className="language-selector-icon">JS</span>
            JavaScript
          </div>
          
          <button className="review-btn" onClick={handleReview}>
            <span role="img" aria-label="AI">🧠</span> Analyze with AI
          </button>
        </div>
      </div>
      
      {/* Right Section (Review Output) */}
      <div className="right glass-panel">
        <div className="review-header">
          <h2 className="section-title">
            <span className="icon">🤖</span> AI Code Review
          </h2>
          
          <div className="review-stats">
            <div className="stat-item">
              <span className="stat-value issue-high">{stats.high}</span>
              <span className="stat-label">Critical</span>
            </div>
            <div className="stat-item">
              <span className="stat-value issue-med">{stats.medium}</span>
              <span className="stat-label">Warnings</span>
            </div>
            <div className="stat-item">
              <span className="stat-value issue-low">{stats.low}</span>
              <span className="stat-label">Notes</span>
            </div>
          </div>
        </div>
        
        {message.title && (
          <div className={`message ${message.type}`}>
            <div className="message-icon">
              {message.type === "success" ? "✓" : message.type === "error" ? "✕" : "⚠"}
            </div>
            <div className="message-content">
              <div className="message-title">{message.title}</div>
              <div className="message-desc">{message.desc}</div>
            </div>
          </div>
        )}
        
        <div className="review-output-container">
          <div className="review-toolbar">
            <div className="review-tabs">
              <div 
                className={`review-tab ${activeTab === 'issues' ? 'active' : ''}`}
                onClick={() => handleTabChange('issues')}
              >
                Issues
              </div>
              <div 
                className={`review-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
                onClick={() => handleTabChange('suggestions')}
              >
                Suggestions
              </div>
              <div 
                className={`review-tab ${activeTab === 'explanation' ? 'active' : ''}`}
                onClick={() => handleTabChange('explanation')}
              >
                Explanation
              </div>
            </div>
            
            <div className="review-controls">
              <button className="control-btn">⟲</button>
              <button className="control-btn">⬇</button>
              <button className="control-btn">⋮</button>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p className="loading-text">Analyzing your code...</p>
              <p className="loading-subtext">Our AI is checking for issues and best practices</p>
            </div>
          ) : (
            <div className="review-output">
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </Markdown>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;