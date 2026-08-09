import { ApiError } from "../errors/api-error.js";
// Check operating window
export function checkOperatingHours(date = new Date()) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const openingMinutes = 9 * 60; // 9:00 AM
    const closingMinutes = 18 * 60; // 6:00 PM
    const lunchStartMinutes = 13 * 60; // 1:00 PM
    const lunchEndMinutes = 13 * 60 + 45; // 1:45 PM
    const isOpenHours = totalMinutes >= openingMinutes && totalMinutes < closingMinutes;
    const isLunchBreak = totalMinutes >= lunchStartMinutes && totalMinutes < lunchEndMinutes;
    const serverTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    if (!isOpenHours) {
        return {
            allowed: false,
            reason: "Borrowing and returning books is only allowed between 9:00 AM and 6:00 PM",
            currentStatus: { isOpenHours, isLunchBreak, serverTime },
        };
    }
    if (isLunchBreak) {
        return {
            allowed: false,
            reason: "Transactions are blocked during lunch break (1:00 PM - 1:45 PM)",
            currentStatus: { isOpenHours, isLunchBreak, serverTime },
        };
    }
    return {
        allowed: true,
        currentStatus: { isOpenHours, isLunchBreak, serverTime },
    };
}
// Time guard
export function validateOperatingHours(req, res, next) {
    const check = checkOperatingHours();
    if (!check.allowed) {
        return next(ApiError.badRequest(check.reason || "Operation not allowed outside operating hours"));
    }
    next();
}
