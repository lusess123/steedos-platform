import { getStringTimeValue, computeBusinessHoursPerDay, computeIsBusinessDate, computeNextBusinessDate, NextBusinessDate, BusinessHoursPerDay} from "../../src/holidays";
import { expect } from 'chai';
const moment = require('moment');

const utcOffset = 8;

describe('getStringTimeValue', () => {
    it('09:00 is 9 Hours and 9*60 Minutes', async () => {
        let result:any = getStringTimeValue("9:00")
        expect(result.valueToHours).to.eq(9);
        expect(result.valueToMinutes).to.eq(9*60);
    });
    it('24:09 is formated error so will catch errors', async () => {
        let result:any;
        try {
            result = getStringTimeValue("24:09");
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
    it('09:099 is formated error so will catch errors', async () => {
        let result:any;
        try {
            result = getStringTimeValue("09:099")
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
});

describe('computeBusinessHoursPerDay', () => {
    it('9:00 to 18:00 is 9 Hours', async () => {
        let result:any = computeBusinessHoursPerDay("9:00", "18:00",)
        expect(result.computedHours).to.be.eq(9);
        expect(result.startValue.hours).to.be.eq(9);
        expect(result.startValue.minutes).to.be.eq(0);
    });
    it('9:30 to 18:00 is 8.5 Hours', async () => {
        let result:any = computeBusinessHoursPerDay("9:30", "18:00",)
        expect(result.computedHours).to.be.eq(8.5);
        expect(result.startValue.hours).to.be.eq(9);
        expect(result.startValue.minutes).to.be.eq(30);
    });
    it('18:00 to 9:00 is -9 Hours but will catch errors', async () => {
        let result:any;
        try {
            result = computeBusinessHoursPerDay("18:00", "9:00")
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
    it('18:00 to 18:00 is zero Hours but will catch errors', async () => {
        let result:any;
        try {
            result = computeBusinessHoursPerDay("18:00", "18:00")
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
    it('24:01 to 25:00 has formated error, will catch errors', async () => {
        let result:any;
        try {
            result = computeBusinessHoursPerDay("24:01", "25:00",)
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
});

describe('computeIsBusinessDate', () => {
    let holidays:any = [{
        name: '国庆节第一天',
        type: 'public',
        date: new Date("2020-10-01T00:00:00.000Z")
    },
    {
        name: '国庆节第二天',
        type: 'public',
        date: new Date("2020-10-02T00:00:00.000Z")
    },
    {
        name: '国庆节第三天',
        type: 'public',
        date: new Date("2020-10-03T00:00:00.000Z")
    },
    {
        name: '国庆节第四天',
        type: 'public',
        date: new Date("2020-10-04T00:00:00.000Z")
    },
    {
        name: '国庆节第五天',
        type: 'public',
        date: new Date("2020-10-05T00:00:00.000Z")
    },
    {
        name: '国庆节第六天',
        type: 'public',
        date: new Date("2020-10-06T00:00:00.000Z")
    },
    {
        name: '国庆节第七天',
        type: 'public',
        date: new Date("2020-10-07T00:00:00.000Z")
    },
    {
        name: '国庆节第8天',
        type: 'public',
        date: new Date("2020-10-08T00:00:00.000Z")
    },
    {
        name: '国庆节后周六正常补班',
        type: 'adjusted_working_day',
        date: new Date("2020-10-10T00:00:00.000Z"),
        adjusted_to: '4'
    },
    {
        name: '国庆节后额外周五调休',
        type: 'adjusted_holiday',
        date: new Date("2020-10-09T00:00:00.000Z")
    },
    {
        name: '国庆节后额外周日调班',
        type: 'adjusted_working_day',
        date: new Date("2020-10-11T00:00:00.000Z"),
        adjusted_to: '5'
    }];
    let businessHours = {
        name: 'A',
        start: '9:00',
        end: '18:00',
        working_days: [ '1', '2', '3', '4', '5' ] 
    };
    it('2020-09-01 is a business date', async () => {
        const start = moment.utc("2020-09-01T07:00:00.000Z");
        let result:any = computeIsBusinessDate(start.toDate(), holidays, businessHours.working_days)
        expect(result).to.be.eq(true);
    });
    it('2020-09-05 is not a business date because it is Saturday', async () => {
        const start = moment.utc("2020-09-05T07:00:00.000Z");
        let result:any = computeIsBusinessDate(start.toDate(), holidays, businessHours.working_days)
        expect(result).to.be.eq(false);
    });
    it('2020-10-01 is in holidays and type is public, so it is a business date', async () => {
        const start = moment.utc("2020-10-01T07:00:00.000Z");
        let result:any = computeIsBusinessDate(start.toDate(), holidays, businessHours.working_days)
        expect(result).to.be.eq(false);
    });
    it('2020-10-10 is in holidays and type is adjusted_working_day, although it is Saturday but it is a business date', async () => {
        const start = moment.utc("2020-10-10T07:00:00.000Z");
        let result:any = computeIsBusinessDate(start.toDate(), holidays, businessHours.working_days)
        expect(result).to.be.eq(true);
    });
    it('2020-10-09 is in holidays and type is adjusted_holiday, so it is a business date', async () => {
        const start = moment.utc("2020-10-09T07:00:00.000Z");
        let result:any = computeIsBusinessDate(start.toDate(), holidays, businessHours.working_days)
        expect(result).to.be.eq(false);
    });
    it('2020-10-11 is in holidays and type is adjusted_working_day, although it is Sunday, but it is a business date', async () => {
        const start = moment.utc("2020-10-11T07:00:00.000Z");
        let result:any = computeIsBusinessDate(start.toDate(), holidays, businessHours.working_days)
        expect(result).to.be.eq(true);
    });
});

describe('computeNextBusinessDate', () => {
    let holidays:any = [{
        name: '国庆节第一天',
        type: 'public',
        date: new Date("2020-10-01T00:00:00.000Z")
    },
    {
        name: '国庆节第二天',
        type: 'public',
        date: new Date("2020-10-02T00:00:00.000Z")
    },
    {
        name: '国庆节第三天',
        type: 'public',
        date: new Date("2020-10-03T00:00:00.000Z")
    },
    {
        name: '国庆节第四天',
        type: 'public',
        date: new Date("2020-10-04T00:00:00.000Z")
    },
    {
        name: '国庆节第五天',
        type: 'public',
        date: new Date("2020-10-05T00:00:00.000Z")
    },
    {
        name: '国庆节第六天',
        type: 'public',
        date: new Date("2020-10-06T00:00:00.000Z")
    },
    {
        name: '国庆节第七天',
        type: 'public',
        date: new Date("2020-10-07T00:00:00.000Z")
    },
    {
        name: '国庆节第8天',
        type: 'public',
        date: new Date("2020-10-08T00:00:00.000Z")
    },
    {
        name: '国庆节后周六正常补班',
        type: 'adjusted_working_day',
        date: new Date("2020-10-10T00:00:00.000Z"),
        adjusted_to: '4'
    },
    {
        name: '国庆节后额外周五调休',
        type: 'adjusted_holiday',
        date: new Date("2020-10-09T00:00:00.000Z")
    },
    {
        name: '国庆节后额外周日调班',
        type: 'adjusted_working_day',
        date: new Date("2020-10-11T00:00:00.000Z"),
        adjusted_to: '5'
    }];
    let businessHours = {
        name: 'A',
        start: '9:00',
        end: '18:00',
        working_days: [ '1', '2', '3', '4', '5' ] 
    };
    it('the start time of next business date of 2020-09-01T07:00:00.000Z is 2020-09-02T01:00:00Z', async () => {
        const start = moment.utc("2020-09-01T07:00:00.000Z");
        const businessHoursPerDay:BusinessHoursPerDay = computeBusinessHoursPerDay(<string>businessHours.start, <string>businessHours.end);
        let result:NextBusinessDate = computeNextBusinessDate(start, holidays, businessHoursPerDay, businessHours.working_days, utcOffset);
        expect(moment.utc(result.start).format()).to.be.eq("2020-09-02T01:00:00Z");
        expect(moment.utc(result.end).format()).to.be.eq("2020-09-02T10:00:00Z");
    });
    it('the start time of next business date of 2020-09-30T07:00:00.000Z is 2020-10-10T01:00:00Z', async () => {
        const start = moment.utc("2020-09-30T07:00:00.000Z");
        const businessHoursPerDay:BusinessHoursPerDay = computeBusinessHoursPerDay(<string>businessHours.start, <string>businessHours.end);
        let result:NextBusinessDate = computeNextBusinessDate(start, holidays, businessHoursPerDay, businessHours.working_days, utcOffset);
        expect(moment.utc(result.start).format()).to.be.eq("2020-10-10T01:00:00Z");
        expect(moment.utc(result.end).format()).to.be.eq("2020-10-10T10:00:00Z");
    });
    it('the start time of next business date of 2020-10-06T07:00:00.000Z is 2020-10-10T01:00:00Z', async () => {
        const start = moment.utc("2020-10-06T07:00:00.000Z");
        const businessHoursPerDay:BusinessHoursPerDay = computeBusinessHoursPerDay(<string>businessHours.start, <string>businessHours.end);
        let result:NextBusinessDate = computeNextBusinessDate(start, holidays, businessHoursPerDay, businessHours.working_days, utcOffset);
        expect(moment.utc(result.start).format()).to.be.eq("2020-10-10T01:00:00Z");
        expect(moment.utc(result.end).format()).to.be.eq("2020-10-10T10:00:00Z");
    });
    it('the start time of next business date of 2020-10-08T07:00:00.000Z is 2020-10-10T01:00:00Z', async () => {
        const start = moment.utc("2020-10-08T07:00:00.000Z");
        const businessHoursPerDay:BusinessHoursPerDay = computeBusinessHoursPerDay(<string>businessHours.start, <string>businessHours.end);
        let result:NextBusinessDate = computeNextBusinessDate(start, holidays, businessHoursPerDay, businessHours.working_days, utcOffset);
        expect(moment.utc(result.start).format()).to.be.eq("2020-10-10T01:00:00Z");
        expect(moment.utc(result.end).format()).to.be.eq("2020-10-10T10:00:00Z");
    });
    it('the start time of next business date of 2020-10-10T07:00:00.000Z is 2020-10-10T01:00:00Z', async () => {
        const start = moment.utc("2020-10-10T07:00:00.000Z");
        const businessHoursPerDay:BusinessHoursPerDay = computeBusinessHoursPerDay(<string>businessHours.start, <string>businessHours.end);
        let result:NextBusinessDate = computeNextBusinessDate(start, holidays, businessHoursPerDay, businessHours.working_days, utcOffset);
        expect(moment.utc(result.start).format()).to.be.eq("2020-10-11T01:00:00Z");
        expect(moment.utc(result.end).format()).to.be.eq("2020-10-11T10:00:00Z");
    });
    it('the start time of next business date of 2020-10-16T07:00:00.000Z is 2020-10-19T01:00:00Z', async () => {
        const start = moment.utc("2020-10-16T07:00:00.000Z");
        const businessHoursPerDay:BusinessHoursPerDay = computeBusinessHoursPerDay(<string>businessHours.start, <string>businessHours.end);
        let result:NextBusinessDate = computeNextBusinessDate(start, holidays, businessHoursPerDay, businessHours.working_days, utcOffset);
        expect(moment.utc(result.start).format()).to.be.eq("2020-10-19T01:00:00Z");
        expect(moment.utc(result.end).format()).to.be.eq("2020-10-19T10:00:00Z");
    });
});