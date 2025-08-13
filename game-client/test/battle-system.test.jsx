import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BattleSystem from '../src/components/BattleSystem.jsx';

describe('BattleSystem component', () => {
  it('triggers victory when enemy hp drops to zero', async () => {
    const onVictory = vi.fn();
    render(
      <BattleSystem enemy={{ name: 'Slime', hp: 1 }} onVictory={onVictory} />
    );
    fireEvent.click(screen.getByText('Attack'));
    await waitFor(() => expect(onVictory).toHaveBeenCalled());
  });
});

