import { test, expect, request as playwrightRequest } from '@playwright/test';

const apiBase = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:4000';

const persistTokenScript = ({ roomId, token, wsUrl }: { roomId: string; token: string; wsUrl: string }) => {
  const store = JSON.stringify({ [roomId]: { token, wsUrl } });
  window.sessionStorage.setItem('ttt-room-tokens', store);
};

test('online multiplayer syncs moves between players', async ({ page, context }) => {
  const api = await playwrightRequest.newContext({ baseURL: apiBase });
  const create = await api.post('/api/rooms', { data: { name: 'Player One' } });
  expect(create.ok()).toBeTruthy();
  const createBody = await create.json();
  const { roomId, token, wsUrl } = createBody as { roomId: string; token: string; wsUrl: string };

  await page.addInitScript(persistTokenScript, { roomId, token, wsUrl });
  await page.goto(`/online/room/${roomId}`);
  await expect(page.getByText(`Room ${roomId}`)).toBeVisible();

  const join = await api.post(`/api/rooms/${roomId}/join`, { data: { name: 'Player Two' } });
  expect(join.ok()).toBeTruthy();
  const joinBody = await join.json();
  const joinToken = (joinBody as { token: string }).token;
  const secondPage = await context.newPage();
  await secondPage.addInitScript(persistTokenScript, { roomId, token: joinToken, wsUrl: wsUrl ?? apiBase });
  await secondPage.goto(`/online/room/${roomId}`);
  await expect(secondPage.getByText(`Room ${roomId}`)).toBeVisible();

  await page.getByRole('gridcell').first().click();
  await expect(secondPage.getByRole('gridcell').first()).toHaveText('X');

  await secondPage.close();
  await api.dispose();
});
