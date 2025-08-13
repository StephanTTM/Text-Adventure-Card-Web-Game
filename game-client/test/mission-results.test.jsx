import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from '../src/App.jsx';

describe('Mission results', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network error'))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('completes Whispering Corridors and shows results', async () => {
    render(
      <MemoryRouter initialEntries={['/missions/whispering_corridors']}>
        <App />
      </MemoryRouter>
    );

    // Start room
    expect(await screen.findByText('Abandoned Palace Hall')).toBeTruthy();

    // mission_intro node -> Continue
    fireEvent.click(screen.getByText('Continue'));

    // wounded_scout -> Move on
    await screen.findByText('Wounded Scout');
    fireEvent.click(screen.getByText('Move on'));

    // collapsed_corridor -> Climb (STR check) which moves to side corridor
    await screen.findByText('Collapsed Corridor');
    fireEvent.click(screen.getByText('Climb (STR check)'));

    // side corridor -> guards_patrol -> Resolve Battle
    expect(await screen.findByText('Side Corridor')).toBeTruthy();
    await screen.findByText('Palace Guards');
    fireEvent.click(screen.getByText('Resolve Battle'));

    // to_vault_antechamber -> Proceed
    await screen.findByText('Descend the stairs');
    fireEvent.click(screen.getByText('Proceed'));

    // results screen
    expect(await screen.findByText('Mission Results')).toBeTruthy();
    expect(await screen.findByText('Whispering Corridors')).toBeTruthy();
  });
});
