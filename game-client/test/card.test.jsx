import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../src/components/Card.jsx';

describe('Card component', () => {
  it('renders newly added character stats', () => {
    const card = {
      id: 'test_char',
      name: 'Test Character',
      slot: 'character',
      class: 'Warrior',
      race: 'Human',
      stats: {
        str: 1,
        agi: 2,
        int: 3,
        end: 4,
        cha: 5,
        lck: 6,
        atk: 7,
        def: 8,
        spatk: 9,
        spdef: 10,
        spd: 11,
      },
    };

    render(<Card card={card} />);
    const statsElement = screen.getByText(/Stats:/);
    const text = statsElement.textContent || '';
    ['STR 1', 'AGI 2', 'END 4', 'SPD 11'].forEach((fragment) => {
      expect(text.includes(fragment)).toBe(true);
    });
  });
});
