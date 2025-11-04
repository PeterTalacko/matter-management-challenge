import { config } from '../../../utils/config.js';
import { CycleTime, Matter, SLAStatus } from '../../types.js';

/**
 * CycleTimeService - Calculate resolution times and SLA status for matters
 *
 * TODO: Implement this service to:
 * 1. Calculate resolution time from "To Do" → "Done" status transitions
 * 2. Determine SLA status based on resolution time vs threshold
 * 3. Format durations in human-readable format (e.g., "2h 30m", "3d 5h")
 *
 * Requirements:
 * - Query ticketing_cycle_time_histories table
 * - Join with status groups to identify "To Do", "In Progress", "Done" statuses
 * - Calculate time between first transition and "Done" transition
 * - For in-progress matters, calculate time from first transition to now
 * - Compare against SLA_THRESHOLD_HOURS (default: 8 hours)
 *
 * SLA Status Logic:
 * - "In Progress": Matter not yet in "Done" status
 * - "Met": Resolved within threshold (≤ 8 hours)
 * - "Breached": Resolved after threshold (> 8 hours)
 *
 * Consider:
 * - Performance for 10,000+ matters
 * - Caching strategies for high load
 * - Database query optimization
 */
export class CycleTimeService {
  // SLA threshold in milliseconds (candidates will use this in their implementation)
  private slaThresholdMs: number;

  constructor() {
    this.slaThresholdMs = config.SLA_THRESHOLD_HOURS * 60 * 60 * 1000;
  }

  async calculateCycleTimeAndSLA(
    ticketId: string,
    currentStatusGroupName: string | null,
    history: Matter['history'],
  ): Promise<{ cycleTime: CycleTime; sla: SLAStatus }> {
    if (history.length === 0) {
      // TODO: Is this an error or can tickets have no history?
      throw new Error(`No history found for ticket: ${ticketId}`);
    }

    const firstTransitionDate = history[0].transitionedAt;

    if (currentStatusGroupName === 'Done') {
      const lastTransitionDate = history[history.length - 1].transitionedAt;
      const resolutionTimeMs = lastTransitionDate.getTime() - firstTransitionDate.getTime();
      const sla = resolutionTimeMs > this.slaThresholdMs ? 'Breached' : 'Met';

      return {
        cycleTime: {
          resolutionTimeMs,
          resolutionTimeFormatted: this.formatDuration(resolutionTimeMs, false),
          isInProgress: false,
          startedAt: firstTransitionDate,
          completedAt: lastTransitionDate,
        },
        sla,
      };
    } else {
      const currentDate = new Date();
      const resolutionTimeMs = currentDate.getTime() - firstTransitionDate.getTime();
      if (ticketId === 'c0b4c58f-d4cb-4ef4-9ac7-cd11a8b58013')
        console.log(currentDate, firstTransitionDate);
      return {
        cycleTime: {
          resolutionTimeMs,
          resolutionTimeFormatted: this.formatDuration(resolutionTimeMs, true),
          isInProgress: true,
          startedAt: firstTransitionDate,
          completedAt: null,
        },
        sla: 'In Progress',
      };
    }
  }

  // Helper method for formatting durations (candidates will implement this)
  // TODO: Implement duration formatting
  // Format as "2h 30m", "3d 5h", etc.
  // Prefix with "In Progress: " if matter is not complete
  private formatDuration(durationMs: number, isInProgress: boolean): string {
    const secondInMs = 1000; // Can be used if seconds are required for display
    const minuteInMs = 60 * secondInMs;
    const hourInMs = 60 * minuteInMs;
    const dayInMs = 24 * hourInMs;

    const days = Math.floor(durationMs / dayInMs);
    const remainingMsAfterDays = durationMs % dayInMs;

    const hours = Math.floor(remainingMsAfterDays / hourInMs);
    const remainingMsAfterHours = remainingMsAfterDays % hourInMs;

    const minutes = Math.floor(remainingMsAfterHours / minuteInMs);

    const formattedTimes = [];
    if (isInProgress) {
      formattedTimes.push('In Progress:');
    }
    if (days > 0) {
      formattedTimes.push(`${days}d`);
    }
    if (hours > 0) {
      formattedTimes.push(`${hours}h`);
    }
    if (minutes > 0) {
      formattedTimes.push(`${minutes}m`);
    }
    return formattedTimes.join(' ');
  }
}

export default CycleTimeService;
