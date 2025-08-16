import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from '../src/App.jsx';
import examplePlayer from '../../assets/players/example_player.json';

describe('Wounded Scout event', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network error'))));
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    cleanup();
  });

  it('warns when player lacks food', async () => {
    const noFoodPlayer = {
      ...examplePlayer,
      inventory: {
        ...examplePlayer.inventory,
        items: examplePlayer.inventory.items.filter(
          (i) => !(i.tags && i.tags.includes('food'))
        ),
      },
    };
    localStorage.setItem('player', JSON.stringify(noFoodPlayer));

    render(
      <MemoryRouter initialEntries={['/missions/whispering_corridors']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText('Continue'));
    await screen.findAllByText('Wounded Scout');
    const [offerBtn1] = screen.getAllByText('Offer food');
    fireEvent.click(offerBtn1);
    expect(await screen.findByText("You don't have food to offer.")).toBeTruthy();
  });

  it('reveals secret shortcut when food is offered', async () => {
    localStorage.setItem('player', JSON.stringify(examplePlayer));

    render(
      <MemoryRouter initialEntries={['/missions/whispering_corridors']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText('Continue'));
    await screen.findAllByText('Wounded Scout');
    const [offerBtn2] = screen.getAllByText('Offer food');
    fireEvent.click(offerBtn2);
    expect(await screen.findByText('Take the secret shortcut')).toBeTruthy();
  });
});
