import { describe, expect, it } from 'vitest';
import { CycleTimeService } from '../cycle_time_service';

describe('calculateCycleTimeAndSLA', () => {
  it('SLA: Met', () => {
    const cycleTimeService = new CycleTimeService();
    const startedAt = new Date('2025-11-01T08:00:00Z');
    const completedAt = new Date('2025-11-01T08:20:00Z');
    const resolutionTimeMs = 1000 * 60 * 20; // 20 minutes

    const { cycleTime, sla } = cycleTimeService.calculateCycleTimeAndSLA('Done', {
      firstTransitionDate: startedAt,
      lastTransitionDate: completedAt,
      resolutionTimeMs,
    });
    expect(sla).toStrictEqual('Met');
    expect(cycleTime).toStrictEqual({
      resolutionTimeMs,
      resolutionTimeFormatted: '20m',
      isInProgress: false,
      startedAt,
      completedAt,
    });
  });

  it('SLA: Breached', () => {
    const cycleTimeService = new CycleTimeService();
    const startedAt = new Date('2025-11-01T08:00:00Z');
    const completedAt = new Date('2025-11-01T18:00:00Z');
    const resolutionTimeMs = 1000 * 60 * 60 * 10; // 10 hours

    const { cycleTime, sla } = cycleTimeService.calculateCycleTimeAndSLA('Done', {
      firstTransitionDate: startedAt,
      lastTransitionDate: completedAt,
      resolutionTimeMs,
    });
    expect(sla).toStrictEqual('Breached');
    expect(cycleTime).toStrictEqual({
      resolutionTimeMs,
      resolutionTimeFormatted: '10h',
      isInProgress: false,
      startedAt,
      completedAt,
    });
  });

  it('SLA: In Progress', () => {
    const cycleTimeService = new CycleTimeService();
    const startedAt = new Date('2025-11-01T08:00:00Z');
    const resolutionTimeMs = 1000 * 60 * 60 * 10; // 10 hours

    const { cycleTime, sla } = cycleTimeService.calculateCycleTimeAndSLA('To Do', {
      firstTransitionDate: startedAt,
      lastTransitionDate: null,
      resolutionTimeMs,
    });
    expect(sla).toStrictEqual('In Progress');
    expect(cycleTime).toStrictEqual({
      resolutionTimeMs,
      resolutionTimeFormatted: '10h',
      isInProgress: true,
      startedAt,
      completedAt: null,
    });
  });
});
