import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from '../src/App.jsx';

describe('App navigation', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network error'))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders menu and navigates to linked pages', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Main Menu')).toBeTruthy();

    fireEvent.click(screen.getByText('Mission Selection'));
    expect(await screen.findByText('Mission Selection')).toBeTruthy();
    expect(await screen.findByText('Whispering Corridors')).toBeTruthy();

    fireEvent.click(screen.getByText('Back to Menu'));
    expect(await screen.findByText('Main Menu')).toBeTruthy();

    fireEvent.click(screen.getByText('Deck Editor'));
    expect(await screen.findByText('Deck Builder')).toBeTruthy();

    fireEvent.click(screen.getByText('Back to Menu'));
    expect(await screen.findByText('Main Menu')).toBeTruthy();

    fireEvent.click(screen.getByText('Mission Editor'));
    expect(await screen.findByText('Mission editor content coming soon.')).toBeTruthy();
  });
});
