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

  calculateCycleTimeAndSLA(
    currentStatusGroupName: string | null,
    history: Matter['history'],
  ): { cycleTime: CycleTime; sla: SLAStatus } {
    const isInProgress = currentStatusGroupName !== 'Done';
    const sla = isInProgress
      ? 'In Progress'
      : history.resolutionTimeMs > this.slaThresholdMs
        ? 'Breached'
        : 'Met';

    return {
      cycleTime: {
        resolutionTimeMs: history.resolutionTimeMs,
        resolutionTimeFormatted: this.formatDuration(history.resolutionTimeMs, false),
        isInProgress,
        startedAt: history.firstTransitionDate,
        completedAt: history.lastTransitionDate,
      },
      sla,
    };
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
