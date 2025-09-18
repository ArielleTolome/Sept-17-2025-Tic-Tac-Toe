import { test, expect } from '@playwright/test';
import fs from 'fs';

test('overlay attaches, plays a game, earns XP', async ({ page }) => {
  const html = `<!doctype html><html><body>
  <div role="grid" id="board" style="display:grid;grid-template-columns:repeat(3,60px);gap:6px">
    ${Array.from({length:9}).map((_,i)=>`<button role="gridcell" id="c${i}" style="width:60px;height:60px;font-size:28px"></button>`).join('')}
  </div>
  <div id="outcome"></div>
  <script>
    let turn='X';
    const b=[...Array(9)].map(()=>null);
    function check(){
      const w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
      for(const [a,c,d] of w){ if(b[a]&&b[a]===b[c]&&b[c]===b[d]) return b[a]; }
      if(b.every(Boolean)) return 'draw';
      return null;
    }
    document.getElementById('board').addEventListener('click', (e)=>{
      const id = (e.target.id||'').slice(1); if(!id) return; const i=+id; if(b[i]) return;
      b[i]=turn; e.target.textContent=turn; turn=turn==='X'?'O':'X';
      const res=check(); if(res){ document.getElementById('outcome').textContent = res==='draw'?'Draw':'You Win'; }
    });
  </script>
  </body></html>`;
  await page.setContent(html);
  const iife = fs.readFileSync('dist/ttt-gamify.iife.js','utf-8');
  await page.addScriptTag({ content: iife });
  await expect(page.locator('#ttt-gamify-root')).toBeVisible();
  // play a quick win
  const seq = [0,3,1,4,2];
  for (const i of seq) await page.click('#c'+i);
  await expect(page.locator('text=Match result')).toBeVisible();
});

