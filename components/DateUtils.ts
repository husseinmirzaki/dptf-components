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

function jalaliToGregorian(jy, jm, jd) {
    let gy, gm, gd, days;
    jy += 1595;
    days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy = 400 * ~~(days / 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * ~~(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
        gy += ~~((days - 1) / 365);
        days = (days - 1) % 365;
    }
    gd = days + 1;
    const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    return [gy , gm, gd];
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

export function persianStringDateToGregorian(dateString: string) {
    const [year, month, day] = dateString.split('/');
    const [gYear, gMonth, gDay] = jalaliToGregorian(Number(year), Number(month), Number(day));

    const date = new Date(Number(gYear), Number(gMonth) - 1, Number(gDay));
    console.log(date);
    return date;
}