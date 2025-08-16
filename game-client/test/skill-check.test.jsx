import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from '../src/App.jsx';

describe('Skill checks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network error'))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('succeeds STR check with message and move', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.95);
    render(
      <MemoryRouter initialEntries={['/missions/whispering_corridors']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText('Continue'));
    await screen.findByText('Wounded Scout');
    fireEvent.click(screen.getByText('Move on'));
    await screen.findByText('Collapsed Corridor');
    fireEvent.click(screen.getByText('Climb (STR check)'));
    expect(await screen.findByText('You succeed.')).toBeTruthy();
    expect(await screen.findByText('Side Corridor')).toBeTruthy();
  });

  it('fails STR check and shows damage', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(
      <MemoryRouter initialEntries={['/missions/whispering_corridors']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText('Continue'));
    await screen.findByText('Wounded Scout');
    fireEvent.click(screen.getByText('Move on'));
    await screen.findByText('Collapsed Corridor');
    fireEvent.click(screen.getByText('Climb (STR check)'));
    expect(await screen.findByText('You fail. You are wounded.')).toBeTruthy();
    expect(await screen.findByText('Collapsed Corridor')).toBeTruthy();
  });
});
