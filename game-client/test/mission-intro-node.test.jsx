import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import MissionIntroNode from '../src/components/MissionIntroNode';
import { ReactFlowProvider } from 'reactflow';

describe('MissionIntroNode', () => {
  it('renders without input handles and keeps choice labels inside on the right edge', () => {
    const data = { title: 'Intro', room_id: 'room-1', choices: [{ label: 'Go' }] };
    const { container, getByText } = render(
      <ReactFlowProvider>
        <MissionIntroNode id="intro-1" data={data} />
      </ReactFlowProvider>
    );

    expect(container.querySelector('.react-flow__handle-left')).toBeNull();
    const handle = container.querySelector('.react-flow__handle-right');
    expect(handle).not.toBeNull();
    expect(handle.parentElement.style.width).toBe('100%');

    const label = getByText('Go');
    expect(label.style.position).toBe('absolute');
    expect(label.style.right).toBe('0px');
    expect(label.style.left).toBe('');
  });
});
