
export const get_days_by_year_month = (year: number, month: number): number => {
    if (month < 1 || month > 12) return 0;
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        return 31;
    } else if ([4, 6, 9, 11].includes(month)) {
        return 30;
    } else {
        if (year % 4 === 0 && year % 100 !== 0 || year % 100 === 0) {
            return 29;
        } else {
            return 28;
        }
    }
}

export const get_next_year_month = (year: number, month: number):Array<number> =>{
    if(month === 12){
        return [year+1,1];
    }else{
        return [year,month+1];
    }
}

export const get_prev_year_month = (year: number, month: number):Array<number> =>{
    if(month === 1){
        return [year-1,12];
    }else{
        return [year,month-1];
    }
}