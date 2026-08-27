import React, { useState } from "react";
import { ArrowRight, Database, GitBranch, Play, Save, ShieldCheck } from "lucide-react";
const initialNodes = [
  { id: "population", title: "Population", type: "Input" },
  { id: "normalize-pop", title: "Normalize", type: "Transform" },
  { id: "economy", title: "GDP / Capita", type: "Input" },
  { id: "normalize-econ", title: "Normalize", type: "Transform" },
  { id: "overlay", title: "Weighted Overlay", type: "Suitability" },
  { id: "dsi", title: "DSI Output", type: "Output" }
];
export default function Workflows() {
  const [nodes, setNodes] = useState(initialNodes);
  const [runs, setRuns] = useState(0);
  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">BUILD</span><h1>Workflow Builder</h1><p>Reusable analysis graphs with explicit inputs and outputs.</p></div>
        <div className="button-row">
          <button className="button" onClick={() => setNodes([...nodes, {id:crypto.randomUUID(),title:"New Analysis",type:"Operation"}])}><GitBranch size={15}/> Add node</button>
          <button className="button" onClick={() => setRuns(runs+1)}><Play size={15}/> Run</button>
          <button className="button primary"><Save size={15}/> Save</button>
        </div>
      </div>
      <div className="workflow-canvas">
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <article className="workflow-node">
              <div className="node-type">{node.type}</div>
              <strong>{node.title}</strong>
              <span>{node.type === "Input" ? <Database size={14}/> : <ShieldCheck size={14}/>} Configurable</span>
            </article>
            {i < nodes.length - 1 && <ArrowRight className="workflow-arrow" size={18}/>}
          </React.Fragment>
        ))}
      </div>
      <div className="workflow-footer">
        <span>Workflow version 1.0</span>
        <span>{runs} execution(s)</span>
        <span>Inputs are explicit; no hidden analytical values.</span>
      </div>
    </section>
  );
}
