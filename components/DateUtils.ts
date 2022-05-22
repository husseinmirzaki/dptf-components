export function gregorianToJalali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    const gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + (parseInt(String((gy2 + 3) / 4))) - (parseInt(String((gy2 + 99) / 100)))
        + (parseInt(String((gy2 + 399) / 400))) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * (parseInt(String(days / 12053)));
    days %= 12053;
    jy += 4 * (parseInt(String(days / 1461)));
    days %= 1461;
    jy += parseInt(String((days - 1) / 365));
    if (days > 365) days = (days - 1) % 365;
    const jm = (days < 186) ? 1 + parseInt(String(days / 31)) : 7 + parseInt(String((days - 186) / 30));
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy, jm, jd];
}

export function gregorianToPersianDate(value) {
    let date_time = false
    if (value.split("-").length > 3) {
        date_time = true
    }
    const date = new Date(value);
    const persian = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (date_time) {
        return `${persian[0]}/${persian[1]}/${persian[2]} ${date.getHours()}:${date.getMinutes()}`;
    }
    return `${persian[0]}/${persian[1]}/${persian[2]}`;
}

export function gregorianIOSToPersianDate(value, date_time = false) {
    const date = new Date(value);
    const persian = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (date_time) {
        return `${persian[0]}/${persian[1]}/${persian[2]} ${date.getHours()}:${date.getMinutes()}`;
    }
    return `${persian[0]}/${persian[1]}/${persian[2]}`;
}

export function gregorianDateToPersianDate(value: Date, date_time = false) {
    const date = value;
    const persian = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (date_time) {
        return `${persian[0]}/${persian[1]}/${persian[2]} ${date.getHours()}:${date.getMinutes()}`;
    }
    return `${persian[0]}/${persian[1]}/${persian[2]}`;
}

export function currentPersianDate() {
    const date = new Date();
    const persian = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return `${persian[0]}/${persian[1]}/${persian[2]}`;
}