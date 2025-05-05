import { baseColors } from '../../constants/colors';
import React from 'react';
import { Div, Text } from 'react-native-magnus';

// Helper to get the number of days in a month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const WeekCalendar = ({ startingWeekDay, currentWeekDay }: { startingWeekDay: number; currentWeekDay: number }) => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0 = January, 1 = February, etc.
  const currentYear = today.getFullYear();

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const daysInPreviousMonth = getDaysInMonth(previousYear, previousMonth);
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Div flexDir="row" justifyContent="space-between" bg="transparent" pt="xl">
      {days.map((day, index) => {
        let dayNumber = startingWeekDay + index;

        // If the day number exceeds the days in the previous month, move to the current month
        if (dayNumber > daysInPreviousMonth) {
          dayNumber = dayNumber - daysInPreviousMonth;
        }

        return (
          <Div
            h={57}
            w={34}
            key={index}
            rounded={20}
            borderWidth={1}
            alignItems="center"
            borderColor={baseColors.themeLight}
            bg={dayNumber === currentWeekDay ? baseColors.themeLight : 'transparent'}>
            <Div justifyContent="center" alignItems="center" rounded="circle" mt="xs">
              <Text fontWeight="500" color={dayNumber === currentWeekDay ? baseColors.theme : baseColors.themeLight} fontSize="sm">
                {day[0]}
              </Text>
            </Div>

            <Div
              p={2}
              py={5}
              mt="xs"
              w="90%"
              rounded={20}
              alignItems="center"
              justifyContent="center"
              bg={dayNumber === currentWeekDay ? baseColors.yellowPrimary : 'transparent'}>
              <Text fontWeight="500" color={dayNumber === currentWeekDay ? baseColors.theme : baseColors.themeLight}>
                {dayNumber}
              </Text>
            </Div>
          </Div>
        );
      })}
    </Div>
  );
};
