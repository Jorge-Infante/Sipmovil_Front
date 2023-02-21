import {timeFormat} from '@/modules/softphone/helpers/timeFormat'

export const callDurationFormat = (state) => {
  return timeFormat(state.callDuration);
};

export const recordDurationFormat = (state) => {
  return timeFormat(state.conferenceRecordDuration);
};
