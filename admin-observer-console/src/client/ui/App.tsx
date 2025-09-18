import React, { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';

type Room = { id: string; players: string[]; createdAt: number };
type Game = { id: string; x: string; o: string; winner: string; finishedAt: number };

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [query, setQuery] = useState('');
  useEffect(() => {
    fetch('/api/rooms').then(r=>r.json()).then(d=>setRooms(d.rooms||[]));
    fetch('/api/games/recent').then(r=>r.json()).then(d=>setGames(d.games||[]));
  }, []);

  const filteredRooms = useMemo(()=> rooms.filter(r => r.players.join(' ').toLowerCase().includes(query.toLowerCase()) || r.id.includes(query)), [rooms, query]);
  const filteredGames = useMemo(()=> games.filter(g => [g.x,g.o,g.winner,g.id].join(' ').toLowerCase().includes(query.toLowerCase())), [games, query]);

  const roomsColumns = useRoomsColumns();
  const roomsTable = useReactTable({ data: filteredRooms, columns: roomsColumns, getCoreRowModel: getCoreRowModel() });
  const gamesColumns = useGamesColumns();
  const gamesTable = useReactTable({ data: filteredGames, columns: gamesColumns, getCoreRowModel: getCoreRowModel() });

  function exportCSV() {
    const header = 'id,players,createdAt\n';
    const body = filteredRooms.map(r => `${r.id},"${r.players.join(' ')}",${new Date(r.createdAt).toISOString()}`).join('\n');
    const blob = new Blob([header+body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rooms.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="container mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Observer Console</h1>
        <input className="input" placeholder="Search…" value={query} onChange={(e)=>setQuery(e.currentTarget.value)} />
      </header>
      <div className="card">
        <div className="flex items-center justify-between mb-2"><h2 className="font-semibold">Active Rooms</h2><button className="btn" onClick={exportCSV}>Export CSV</button></div>
        <table className="min-w-full"><thead>{roomsTable.getHeaderGroups().map(hg=> (
          <tr key={hg.id}>{hg.headers.map(h=> (
            <th key={h.id} className="p-2 text-left">{flexRender(h.column.columnDef.header, h.getContext())}</th>
          ))}</tr>
        ))}</thead><tbody>{roomsTable.getRowModel().rows.map(r=> (
          <tr key={r.id} className="border-t border-slate-700">{r.getVisibleCells().map(c=> (
            <td key={c.id} className="p-2">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
          ))}</tr>
        ))}</tbody></table>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-2"><h2 className="font-semibold">Recent Games</h2></div>
        <table className="min-w-full"><thead>{gamesTable.getHeaderGroups().map(hg=> (
          <tr key={hg.id}>{hg.headers.map(h=> (
            <th key={h.id} className="p-2 text-left">{flexRender(h.column.columnDef.header, h.getContext())}</th>
          ))}</tr>
        ))}</thead><tbody>{gamesTable.getRowModel().rows.map(r=> (
          <tr key={r.id} className="border-t border-slate-700">{r.getVisibleCells().map(c=> (
            <td key={c.id} className="p-2">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
          ))}</tr>
        ))}</tbody></table>
      </div>
    </section>
  );
}

function useRoomsColumns() {
  const h = createColumnHelper<Room>();
  return [
    h.accessor('id', { header: 'Room ID', cell: (i)=> i.getValue() }),
    h.accessor('players', { header: 'Players', cell: (i)=> i.getValue().join(' ') }),
    h.accessor('createdAt', { header: 'Created', cell: (i)=> new Date(i.getValue()).toLocaleString() })
  ];
}
function useGamesColumns() {
  const h = createColumnHelper<Game>();
  return [
    h.accessor('id', { header: 'Game ID', cell: (i)=> i.getValue() }),
    h.accessor('x', { header: 'X', cell: (i)=> i.getValue() }),
    h.accessor('o', { header: 'O', cell: (i)=> i.getValue() }),
    h.accessor('winner', { header: 'Winner', cell: (i)=> i.getValue() }),
    h.accessor('finishedAt', { header: 'Finished', cell: (i)=> new Date(i.getValue()).toLocaleString() })
  ];
}

