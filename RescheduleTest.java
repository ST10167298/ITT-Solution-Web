import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.*;

class RescheduleTest {

    // Method to validate time logic (15:00 to 17:00 in 20-minute intervals)
    public boolean validateTime(int hour, int minute) {
        return (hour == 15 || hour == 16 || (hour == 17 && minute == 0)) && minute % 20 == 0;
    }

    // Method to set min and max date for rescheduling
    public String[] setMinMaxDate(String selectedDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate originalDate = LocalDate.parse(selectedDate, formatter);

        LocalDate minDate = originalDate.plusDays(1);
        LocalDate maxDate = originalDate.plusDays(2);

        return new String[]{minDate.format(formatter), maxDate.format(formatter)};
    }

    @Test
    void testValidateTime_ValidTimes() {
        assertTrue(validateTime(15, 0));
        assertTrue(validateTime(15, 20));
        assertTrue(validateTime(16, 40));
        assertTrue(validateTime(17, 0));
    }

    @Test
    void testValidateTime_InvalidTimes() {
        assertFalse(validateTime(14, 40)); // Before allowed hours
        assertFalse(validateTime(17, 1));  // Beyond 17:00
        assertFalse(validateTime(16, 10)); // Not a 20-minute interval
    }

    @Test
    void testSetMinMaxDate() {
        String selectedDate = "2024-11-18"; // Example original date
        String[] minMaxDates = setMinMaxDate(selectedDate);

        assertEquals("2024-11-19", minMaxDates[0]); // Minimum date is one day after
        assertEquals("2024-11-20", minMaxDates[1]); // Maximum date is two days after
    }

    @Test
    void testValidateTime_BoundaryConditions() {
        assertTrue(validateTime(15, 0)); // Lower boundary
        assertTrue(validateTime(17, 0)); // Upper boundary
        assertFalse(validateTime(14, 59)); // Just before allowed hours
        assertFalse(validateTime(17, 1));  // Just after allowed hours
    }
}
