import React, { useEffect, useMemo, useState } from "react";
import { Bot, ChevronRight, Loader2, Send, Wrench } from "lucide-react";
import { loadDataset, normalizeProperties } from "../services/dataService";
import { createAgent } from "../ai/agent";
export default function AILab() {
  const [datasets, setDatasets] = useState([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    loadDataset("countries")
      .then(fc => setDatasets([{...normalizeProperties(fc), id:"countries"}]))
      .catch(console.error);
  }, []);
  const agent = useMemo(
    () => createAgent({ datasets, onAction: () => {} }),
    [datasets]
  );
  async function ask(text = question) {
    if (!text.trim() || busy) return;
    setMessages(m => [...m, {role:"user", text}]);
    setQuestion("");
    setBusy(true);
    try {
      const result = await agent.ask(text);
      if (result.type === "analysis") {
        setMessages(m => [...m, {
          role:"assistant",
          text: `Tool executed: ${result.tool}. Result contains ${Array.isArray(result.result) ? result.result.length : "structured"} records.`
        }]);
      } else {
        setMessages(m => [...m, {role:"assistant", text:result.text}]);
      }
    } catch (e) {
      setMessages(m => [...m, {role:"assistant", text:`Operation failed: ${e.message}`}]);
    } finally {
      setBusy(false);
    }
  }
  const examples = [
    "Show population density of Colombia.",
    "Calculate DSI from available socioeconomic variables.",
    "Run a deterministic suitability analysis."
  ];
  return (
    <section className="page ai-page">
      <div className="page-heading">
        <div><span className="eyebrow">AI</span><h1>Spatial Copilot</h1><p>Tool-based spatial reasoning architecture. Every GIS action is explicit.</p></div>
      </div>
      <div className="ai-layout">
        <div className="ai-main">
          <div className="chat">
            {messages.length === 0 && (
              <div className="ai-empty">
                <div className="ai-logo"><Bot size={28}/></div>
                <h2>Ask. Analyze. Understand. Decide.</h2>
                <p>Start with a geographic question and the registered tool layer will determine what can be executed.</p>
              </div>
            )}
            {messages.map((m,i) => (
              <div className={`message ${m.role}`} key={i}>
                <span>{m.role === "user" ? "You" : "Spatial Copilot"}</span>
                <p>{m.text}</p>
              </div>
            ))}
            {busy && <div className="message assistant"><Loader2 className="spin" size={16}/> Executing registered GIS tools…</div>}
          </div>
          <div className="prompt-box">
            <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key==="Enter" && ask()} placeholder="Ask a spatial question..." />
            <button onClick={() => ask()}><Send size={17}/></button>
          </div>
        </div>
        <aside className="ai-tools">
          <div className="panel-title"><Wrench size={16}/> Registered Tools</div>
          {[
            "search_dataset",
            "query_features",
            "calculate_statistics",
            "buffer",
            "centroid",
            "run_dsi",
            "run_ml"
          ].map(tool => (
            <div className="tool-row" key={tool}>
              <span>{tool}</span><ChevronRight size={14}/>
            </div>
          ))}
          <div className="panel-divider"/>
          <div className="panel-title">Examples</div>
          {examples.map(x => (
            <button className="example" key={x} onClick={() => ask(x)}>{x}</button>
          ))}
        </aside>
      </div>
    </section>
  );
}
