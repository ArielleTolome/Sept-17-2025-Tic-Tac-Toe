import React, { useMemo, useState } from 'react';
import { generateHeatmapSVG } from '../../cli/index';
import { HeuristicBot, MinimaxBot, NegaMaxBot, MCTSBot, playGame } from '../../lib/bots';
import { emptyBoard } from '../../lib/game';

const bots = {
  heuristic: HeuristicBot,
  minimax: MinimaxBot(9),
  negamax: NegaMaxBot(9),
  mcts: MCTSBot(200)
};

export default function App() {
  const [xBot, setXBot] = useState<keyof typeof bots>('minimax');
  const [oBot, setOBot] = useState<keyof typeof bots>('heuristic');
  const [result, setResult] = useState<string>('');
  const heatmap = useMemo(() => generateHeatmapSVG(bots[xBot]), [xBot]);
  return (
    <section className="space-y-4">
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>TTT Strategy Lab</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <label> X Bot: <select value={xBot} onChange={(e)=>setXBot(e.currentTarget.value as any)}>
          {Object.keys(bots).map(k => <option key={k} value={k}>{k}</option>)}
        </select></label>
        <label> O Bot: <select value={oBot} onChange={(e)=>setOBot(e.currentTarget.value as any)}>
          {Object.keys(bots).map(k => <option key={k} value={k}>{k}</option>)}
        </select></label>
        <button onClick={()=>{
          const res = playGame(bots[xBot], bots[oBot]);
          setResult(`Winner: ${res.winner}`);
        }}>Run Match</button>
        <span>{result}</span>
      </div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Opening Heatmap (SVG)</h2>
        <div dangerouslySetInnerHTML={{ __html: heatmap }} />
        <a href={`data:image/svg+xml;utf8,${encodeURIComponent(heatmap)}`} download="heatmap.svg">Download SVG</a>
      </div>
    </section>
  );
}

