import { ApiResponse } from '@services/api-service';
import { Period } from '@interfaces/forecast/forecast';
import dayjs from 'dayjs';

export const getCurrentPeriod: () => ApiResponse<Period> = () => ({
  data: {
    periodName: `${dayjs().subtract(2, 'month').format('YYYY-MM-DD')}-${dayjs().add(2, 'months').format('YYYY-MM-DD')}`,
    schoolYear: 2025,
    periodId: 1,
    startDate: dayjs().subtract(2, 'month').format('YYYY-MM-DD'),
    endDate: dayjs().add(2, 'months').format('YYYY-MM-DD'),
  },
  message: 'success',
});

export const getAllPeriods: () => ApiResponse<Period[]> = () => ({
  data: [
    {
      periodName: `${dayjs().subtract(2, 'month').format('YYYY-MM-DD')}-${dayjs().add(2, 'months').format('YYYY-MM-DD')}`,
      schoolYear: 2025,
      periodId: 1,
      startDate: dayjs().subtract(2, 'month').format('YYYY-MM-DD'),
      endDate: dayjs().add(2, 'months').format('YYYY-MM-DD'),
    },
    {
      periodName: `${dayjs().add(2, 'months').format('YYYY-MM-DD')}-${dayjs().add(4, 'months').format('YYYY-MM-DD')}`,
      schoolYear: 2025,
      periodId: 2,
      startDate: dayjs().add(2, 'months').format('YYYY-MM-DD'),
      endDate: dayjs().add(4, 'months').format('YYYY-MM-DD'),
    },
  ],
  message: 'success',
});
