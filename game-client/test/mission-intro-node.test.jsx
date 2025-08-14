import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import MissionIntroNode from '../src/components/MissionIntroNode';
import { ReactFlowProvider } from 'reactflow';

describe('MissionIntroNode', () => {
  it('renders without input handles and aligns choice labels to the right', () => {
    const data = { title: 'Intro', room_id: 'room-1', choices: [{ label: 'Go' }] };
    const { container, getByText } = render(
      <ReactFlowProvider>
        <MissionIntroNode id="intro-1" data={data} />
      </ReactFlowProvider>
    );

    expect(container.querySelector('.react-flow__handle-left')).toBeNull();
    expect(container.querySelector('.react-flow__handle-right')).not.toBeNull();

    const label = getByText('Go');
    expect(label.style.position).toBe('absolute');
    expect(label.style.left).toBe('100%');
    expect(label.style.marginLeft).toBe('4px');
  });
});
