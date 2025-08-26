// Test API functions with i18n
import { parseDateByType } from "@/api/date_utils";
import { commonParseCodeToName } from "@/api/star_horse_utils";

console.log("Testing API functions with i18n...");

// Test date parsing with week format
const testDate = new Date();
console.log("Week format test:", parseDateByType(testDate, "week"));

// Test date range format
const startDate = new Date();
const endDate = new Date(startDate.getTime() + 86400000); // Add one day
const dateRange = [startDate, endDate];
console.log("Date range test:", parseDateByType(dateRange, "daterange"));

// Test commonParseCodeToName function
console.log("isDel test (1):", commonParseCodeToName("isDel", 1));
console.log("isDel test (0):", commonParseCodeToName("isDel", 0));
console.log("state test (1):", commonParseCodeToName("state", 1));
console.log("state test (0):", commonParseCodeToName("state", 0));

console.log("API function tests completed.");